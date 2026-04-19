import { describe, expect, it } from 'vitest';
import { applyAction } from '../gameReducer';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { parseNetworkMessage } from '../actionValidation';
import { GameAction, GameState } from '../../types';
import { NETWORK_PROTOCOL_VERSION } from '../../types/network';
import { getInboundMessageCheck } from '../networkProtocol';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

describe('Security Boundaries', () => {
    it('rejects stale protocol versions before the payload reaches runtime logic', () => {
        const message = parseNetworkMessage({
            version: 1,
            type: 'BOOTSTRAP_STATE',
            command: {
                kind: 'INIT',
                setup: cloneState(),
            },
        });

        expect(message).toBeNull();
    });

    it('rejects malformed guest intents before they reach the reducer', () => {
        const message = parseNetworkMessage({
            version: NETWORK_PROTOCOL_VERSION,
            type: 'GUEST_INTENT',
            requestId: 'guest-1',
            command: {
                kind: 'TAKE_GEMS',
                payload: {
                    coords: [{ r: 0, c: 'bad' }],
                },
            },
        });

        expect(message).toBeNull();
    });

    it('rejects malformed bootstrap INIT_DRAFT payloads before sync', () => {
        const message = parseNetworkMessage({
            version: NETWORK_PROTOCOL_VERSION,
            type: 'BOOTSTRAP_STATE',
            command: {
                kind: 'INIT_DRAFT',
                setup: {
                    mode: 'ONLINE_MULTIPLAYER',
                    board: [],
                    bag: [],
                    market: { 1: [], 2: [], 3: [] },
                    decks: { 1: [], 2: [], 3: [] },
                    initRandoms: { p1: {}, p2: {} },
                    draftPool: ['privilege_favor'],
                    buffLevel: 1,
                    isHost: true,
                },
            },
        });

        expect(message).toBeNull();
    });

    it('rejects approved host decisions that omit the checksum contract', () => {
        const message = parseNetworkMessage({
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: 'guest-2',
            intentKind: 'TAKE_GEMS',
            approved: true,
            command: {
                kind: 'TAKE_GEMS',
                payload: { coords: [{ r: 0, c: 0 }] },
            },
        });

        expect(message).toBeNull();
    });

    it('rejects directionally invalid messages for each network role', () => {
        const syncStateCheck = getInboundMessageCheck('host', {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'SYNC_STATE',
            snapshot: cloneState(),
            reason: 'TURN_SYNC',
        });
        const guestIntentCheck = getInboundMessageCheck('guest', {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'GUEST_INTENT',
            requestId: 'guest-3',
            command: {
                kind: 'CLOSE_MODAL',
            },
        });

        expect(syncStateCheck.accepted).toBe(false);
        expect(syncStateCheck.reason).toContain('Host rejected');
        expect(guestIntentCheck.accepted).toBe(false);
        expect(guestIntentCheck.reason).toContain('Guest rejected');
    });

    it('does not allow STEAL_GEM to advance the turn outside STEAL_ACTION', () => {
        const state = cloneState();
        state.turn = 'p1';
        state.phase = 'IDLE';
        state.inventories.p2.red = 2;

        const action: GameAction = { type: 'STEAL_GEM', payload: { gemId: 'red' } };
        const nextState = applyAction(state, action);

        expect(nextState).not.toBeNull();
        expect(nextState?.turn).toBe('p1');
        expect(nextState?.inventories.p1.red).toBe(0);
        expect(nextState?.inventories.p2.red).toBe(2);
    });

    it('does not allow BUY_CARD to bypass the bonus-color selection flow', () => {
        const state = cloneState();
        const card = {
            id: 'joker-card',
            level: 1 as const,
            cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            points: 1,
            bonusColor: 'gold' as const,
        };

        state.market[1][0] = card;

        const action: GameAction = {
            type: 'BUY_CARD',
            payload: {
                card,
                source: 'market',
                marketInfo: { level: 1, idx: 0 },
            },
        };

        const nextState = applyAction(state, action);

        expect(nextState).not.toBeNull();
        expect(nextState?.playerTableau.p1).toHaveLength(0);
        expect(nextState?.market[1][0]?.id).toBe('joker-card');
    });
});
