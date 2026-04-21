import { describe, it, expect, beforeEach } from 'vitest';
import { applyAction } from '../gameReducer';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { createGameSetupPayload } from '../gameSetup';
import { computeGuestIntentChecksum } from '../networkChecksums';
import { reviewOnlineIntent } from '../authority';
import { actionToGuestIntentCommand, guestIntentToAction } from '../networkProtocol';
import { GameState, GameAction } from '../../types';
import type { GuestIntentCommand, HostDecisionMessage } from '../../types/network';
import { NETWORK_PROTOCOL_VERSION } from '../../types/network';

type NetworkPacket =
    | { type: 'SYNC_STATE'; data: GameState }
    | { type: 'GUEST_INTENT'; requestId: string; data: GuestIntentCommand }
    | { type: 'HOST_DECISION'; data: HostDecisionMessage };

class AuthoritativeMockClient {
    state: GameState;
    role: 'host' | 'guest';
    outbox: NetworkPacket[] = [];
    requestCounter = 0;

    constructor(role: 'host' | 'guest') {
        this.role = role;
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;
    }

    interact(action: GameAction) {
        const myRole = this.role === 'host' ? 'p1' : 'p2';
        if (this.state.turn !== myRole) {
            return;
        }

        if (this.role === 'host') {
            const next = applyAction(this.state, action);
            if (next) {
                this.state = next;
                this.outbox.push({
                    type: 'SYNC_STATE',
                    data: JSON.parse(JSON.stringify(this.state)) as GameState,
                });
            }
            return;
        }

        const command = actionToGuestIntentCommand(action);
        if (!command) {
            return;
        }

        this.requestCounter += 1;
        this.outbox.push({
            type: 'GUEST_INTENT',
            requestId: `guest-${this.requestCounter}`,
            data: command,
        });
    }

    receive(msg: NetworkPacket | GameAction) {
        if ((msg as GameAction).type === 'INIT' || (msg as GameAction).type === 'INIT_DRAFT') {
            const next = applyAction(null, msg as GameAction);
            if (next) this.state = next;
            return;
        }

        if (this.role === 'host' && (msg as NetworkPacket).type === 'GUEST_INTENT') {
            const packet = msg as Extract<NetworkPacket, { type: 'GUEST_INTENT' }>;
            const review = reviewOnlineIntent(this.state, packet.data);
            if (!review.valid) {
                this.outbox.push({
                    type: 'HOST_DECISION',
                    data: {
                        version: NETWORK_PROTOCOL_VERSION,
                        type: 'HOST_DECISION',
                        requestId: packet.requestId,
                        intentKind: packet.data.kind,
                        approved: false,
                        reason: review.reason,
                    },
                });
                return;
            }

            const hostAction = guestIntentToAction(packet.data);
            const checksum = computeGuestIntentChecksum(this.state, packet.data);
            const next = applyAction(this.state, hostAction);
            if (!next || !checksum) {
                return;
            }

            this.state = next;
            this.outbox.push({
                type: 'HOST_DECISION',
                data: {
                    version: NETWORK_PROTOCOL_VERSION,
                    type: 'HOST_DECISION',
                    requestId: packet.requestId,
                    intentKind: packet.data.kind,
                    approved: true,
                    command: packet.data,
                    checksum,
                },
            });
            this.outbox.push({
                type: 'SYNC_STATE',
                data: JSON.parse(JSON.stringify(this.state)) as GameState,
            });
            return;
        }

        if (this.role === 'guest' && (msg as NetworkPacket).type === 'SYNC_STATE') {
            const next = applyAction(this.state, {
                type: 'FORCE_SYNC',
                payload: (msg as Extract<NetworkPacket, { type: 'SYNC_STATE' }>).data,
            });
            if (next) this.state = next;
        }
    }
}

describe('Authoritative Host Online Integration', () => {
    let host: AuthoritativeMockClient;
    let guest: AuthoritativeMockClient;

    beforeEach(() => {
        host = new AuthoritativeMockClient('host');
        guest = new AuthoritativeMockClient('guest');
    });

    const flush = () => {
        let deliveredInRound = 1;
        while (deliveredInRound > 0) {
            deliveredInRound = 0;

            while (host.outbox.length > 0) {
                guest.receive(host.outbox.shift()!);
                deliveredInRound++;
            }

            while (guest.outbox.length > 0) {
                host.receive(guest.outbox.shift()!);
                deliveredInRound++;
            }
        }
    };

    it('should only update Guest state after Host approves and syncs', () => {
        const initAction: GameAction = {
            type: 'INIT',
            payload: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                useBuffs: false,
                isHost: true,
            }),
        };

        host.receive(initAction);
        guest.receive(initAction);

        expect(host.state.turn).toBe('p1');
        expect(guest.state.turn).toBe('p1');

        host.state.board[4][4] = {
            type: { id: 'blue', color: '', border: '', label: '' },
            uid: 'b',
        };
        guest.state.board[4][4] = {
            type: { id: 'blue', color: '', border: '', label: '' },
            uid: 'b',
        };

        const guestTakeAction: GameAction = {
            type: 'TAKE_GEMS',
            payload: { coords: [{ r: 4, c: 4 }] },
        };
        guest.interact(guestTakeAction);
        expect(guest.outbox.length).toBe(0);
        expect(guest.state.board[4][4].type.id).not.toBe('empty');

        flush();

        host.state.board[0][0] = {
            type: { id: 'red', color: '', border: '', label: '' },
            uid: 'r',
        };
        const hostTakeAction: GameAction = {
            type: 'TAKE_GEMS',
            payload: { coords: [{ r: 0, c: 0 }] },
        };
        host.interact(hostTakeAction);
        expect(host.state.board[0][0].type.id).toBe('empty');
        expect(host.state.winner).toBeNull();

        flush();
        expect(guest.state.board[0][0].type.id).toBe('empty');
        expect(guest.state.turn).toBe('p2');
    });

    it('should process Guest intent via Host approval and sync', () => {
        const initAction: GameAction = {
            type: 'INIT',
            payload: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                useBuffs: false,
                isHost: true,
            }),
        };
        host.receive(initAction);
        guest.receive(initAction);

        host.state.turn = 'p2';
        guest.state.turn = 'p2';
        host.state.phase = 'DISCARD_EXCESS_GEMS';
        guest.state.phase = 'DISCARD_EXCESS_GEMS';
        host.state.inventories.p2.blue = 1;
        guest.state.inventories.p2.blue = 1;

        const guestDiscardAction: GameAction = { type: 'DISCARD_GEM', payload: 'blue' };
        guest.interact(guestDiscardAction);
        expect(guest.state.inventories.p2.blue).toBe(1);
        expect(guest.outbox[0].type).toBe('GUEST_INTENT');

        flush();

        expect(host.state.inventories.p2.blue).toBe(0);
        expect(guest.state.inventories.p2.blue).toBe(0);
    });
});
