import { describe, expect, it } from 'vitest';
import { applyAction } from '../gameReducer';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { parseNetworkMessage } from '../actionValidation';
import { GameAction, GameState } from '../../types';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

describe('Security Boundaries', () => {
    it('rejects malicious remote GAME_ACTION sync replacements', () => {
        const message = parseNetworkMessage({
            type: 'GAME_ACTION',
            action: {
                type: 'FORCE_SYNC',
                payload: cloneState(),
            },
        });

        expect(message).toBeNull();
    });

    it('rejects malformed guest requests before they reach the reducer', () => {
        const message = parseNetworkMessage({
            type: 'GUEST_REQUEST',
            action: {
                type: 'TAKE_GEMS',
                payload: {
                    coords: [{ r: 0, c: 'bad' }],
                },
            },
        });

        expect(message).toBeNull();
    });

    it('rejects malformed bootstrap INIT_DRAFT payloads before sync', () => {
        const message = parseNetworkMessage({
            type: 'GAME_ACTION',
            action: {
                type: 'INIT_DRAFT',
                payload: {
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
