import { describe, it, expect, beforeEach } from 'vitest';
import { applyAction } from '../gameReducer';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { GameState, GameAction, Buff } from '../../types';

// --- Authoritative Mock Infrastructure ---

class AuthoritativeMockClient {
    state: GameState;
    role: 'host' | 'guest';
    outbox: { type: 'SYNC_STATE' | 'GUEST_REQUEST'; data: any }[] = [];

    constructor(role: 'host' | 'guest') {
        this.role = role;
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON));
    }

    // Local UI triggers this
    interact(action: GameAction) {
        const myRole = this.role === 'host' ? 'p1' : 'p2';
        if (this.state.turn !== myRole) {
            // Ignore if it's not my turn (Simulating UI lock / recordAction guard)
            return;
        }

        if (this.role === 'host') {
            // HOST: Execute and prepare sync
            const next = applyAction(this.state, action);
            if (next) {
                this.state = next;
                this.outbox.push({
                    type: 'SYNC_STATE',
                    data: JSON.parse(JSON.stringify(this.state)),
                });
            }
        } else {
            // GUEST: Send request, do nothing locally
            this.outbox.push({ type: 'GUEST_REQUEST', data: action });
        }
    }

    // Received from P2P
    receive(msg: { type: 'SYNC_STATE' | 'GUEST_REQUEST'; data: any }) {
        if (this.role === 'host' && msg.type === 'GUEST_REQUEST') {
            // Host validates and applies guest action
            const next = applyAction(this.state, msg.data);
            if (next) {
                this.state = next;
                this.outbox.push({
                    type: 'SYNC_STATE',
                    data: JSON.parse(JSON.stringify(this.state)),
                });
            }
        } else if (this.role === 'guest' && msg.type === 'SYNC_STATE') {
            // Guest overwrites memory
            const next = applyAction(this.state, { type: 'FORCE_SYNC', payload: msg.data });
            if (next) this.state = next;
        } else if ((msg.type as any) === 'INIT' || (msg.type as any) === 'INIT_DRAFT') {
            // Handle initial bootstrap
            const next = applyAction(null, msg as any);
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
        let count = 0;
        let deliveredInRound = 1;
        while (deliveredInRound > 0) {
            deliveredInRound = 0;
            // Host to Guest
            while (host.outbox.length > 0) {
                guest.receive(host.outbox.shift()!);
                deliveredInRound++;
                count++;
            }
            // Guest to Host
            while (guest.outbox.length > 0) {
                host.receive(guest.outbox.shift()!);
                deliveredInRound++;
                count++;
            }
        }
        return count;
    };

    it('should only update Guest state after Host approves and syncs', () => {
        // 1. Initial Setup
        const initAction = {
            type: 'INIT',
            payload: {
                mode: 'ONLINE_MULTIPLAYER',
                board: Array.from({ length: 5 }, () =>
                    Array.from({ length: 5 }, () => ({
                        type: { id: 'red', color: '', border: '', label: '' },
                        uid: 'r',
                    }))
                ),
                bag: [],
                market: { 1: [], 2: [], 3: [] },
                decks: { 1: [], 2: [], 3: [] },
                playerBuffs: {
                    p1: { id: 'n1', level: 1, label: '', desc: '', effects: {} } as any,
                    p2: { id: 'n2', level: 1, label: '', desc: '', effects: {} } as any,
                },
                playerTurnCounts: { p1: 0, p2: 0 },
                royalMilestones: { p1: { 3: false, 6: false }, p2: { 3: false, 6: false } },
                inventories: {
                    p1: { red: 0, green: 0, blue: 0, white: 0, black: 0, pearl: 0, gold: 0 },
                    p2: { red: 0, green: 0, blue: 0, white: 0, black: 0, pearl: 0, gold: 0 },
                },
                playerTableau: { p1: [], p2: [] },
                playerRoyals: { p1: [], p2: [] },
                playerReserved: { p1: [], p2: [] },
                royalDeck: [],
            },
        };

        host.receive(initAction as any);
        guest.receive(initAction as any);

        expect(host.state.turn).toBe('p1');
        expect(guest.state.turn).toBe('p1');

        // 2. Guest tries to act during Host turn (Should be blocked locally by recordAction guard)
        guest.interact({ type: 'TAKE_GEMS', payload: { coords: [{ r: 4, c: 4 }] } });
        expect(guest.outbox.length).toBe(0); // Blocked from sending
        expect(guest.state.board[4][4].type.id).not.toBe('empty'); // Local state NOT updated

        // Host should ignore guest request if it's not guest turn (simulated by our mock host for now)
        flush();

        // 3. Host acts (P1 turn)
        host.interact({ type: 'TAKE_GEMS', payload: { coords: [{ r: 0, c: 0 }] } });
        expect(host.state.board[0][0].type.id).toBe('empty');
        expect(host.state.winner).toBeNull(); // Verify no accidental win

        flush();
        expect(guest.state.board[0][0].type.id).toBe('empty');
        expect(guest.state.turn).toBe('p2');
    });

    it('should process Guest intent via Host authority', () => {
        // Init with p2 turn to test guest interaction
        const initAction = {
            type: 'INIT',
            payload: {
                mode: 'ONLINE_MULTIPLAYER',
                turn: 'p2',
                playerBuffs: { p1: { id: 'n', effects: {} }, p2: { id: 'n', effects: {} } },
                inventories: { p1: {}, p2: { blue: 1 } },
                playerTurnCounts: { p1: 0, p2: 0 },
            },
        };
        host.receive(initAction as any);
        guest.receive(initAction as any);

        // Guest turn p2. Guest wants to discard.
        guest.interact({ type: 'DISCARD_GEM', payload: 'blue' });
        expect(guest.state.inventories.p2.blue).toBe(1); // Not changed yet

        flush(); // Sent to Host -> Host applies -> Host syncs back

        expect(host.state.inventories.p2.blue).toBe(0); // Host updated
        expect(guest.state.inventories.p2.blue).toBe(0); // Guest updated via sync
    });
});
