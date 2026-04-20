import { describe, expect, it } from 'vitest';
import { applyAction } from '../gameReducer';
import {
    validateCommand,
    validateGuestCommand,
    validatePostActionState,
    validateStateSnapshot,
} from '../commandGate';
import { INITIAL_STATE_SKELETON } from '../initialState';
import type { GameAction, GameState } from '../../types';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

describe('FSM and Command Gate', () => {
    it('rejects commands that violate the centralized phase matrix', () => {
        const state = cloneState();
        state.phase = 'STEAL_ACTION';

        const action: GameAction = {
            type: 'TAKE_GEMS',
            payload: { coords: [{ r: 0, c: 0 }] },
        };

        const result = validateCommand(state, action);

        expect(result.valid).toBe(false);
        expect(result.reason).toContain('TAKE_GEMS');
    });

    it('rejects guest commands that are outside the online permission table', () => {
        const state = cloneState();
        state.mode = 'ONLINE_MULTIPLAYER';
        state.isHost = true;
        state.turn = 'p2';

        const action: GameAction = { type: 'DEBUG_ADD_POINTS', payload: 'p2' };
        const result = validateGuestCommand(state, action);

        expect(result.valid).toBe(false);
        expect(result.reason).toContain('not permitted');
    });

    it('rejects illegal state snapshots at the command gate boundary', () => {
        const invalidState = cloneState();
        invalidState.phase = 'SELECT_CARD_COLOR';
        invalidState.pendingBuy = null;

        const result = validateStateSnapshot(invalidState);

        expect(result.valid).toBe(false);
        expect(result.reason).toContain('pendingBuy');
    });

    it('rejects impossible FSM transitions after a mutation', () => {
        const previousState = cloneState();
        const nextState = cloneState();
        nextState.phase = 'PRIVILEGE_ACTION';

        const action: GameAction = {
            type: 'TAKE_GEMS',
            payload: { coords: [{ r: 0, c: 0 }] },
        };

        const result = validatePostActionState(previousState, action, nextState);

        expect(result.valid).toBe(false);
        expect(result.reason).toContain('unexpected');
    });

    it('rolls back invalid FORCE_SYNC snapshots instead of accepting illegal state', () => {
        const state = cloneState();
        const illegalSnapshot = cloneState();
        illegalSnapshot.phase = 'SELECT_CARD_COLOR';
        illegalSnapshot.pendingBuy = null;

        const nextState = applyAction(state, {
            type: 'FORCE_SYNC',
            payload: illegalSnapshot,
        });

        expect(nextState).toEqual(state);
    });

    it('allows joker instant-win purchases to resolve directly to an IDLE winner state', () => {
        const state = cloneState();
        const jokerCard = {
            id: 'joker-win-card',
            level: 1 as const,
            cost: {
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                red: 0,
                pearl: 0,
                gold: 0,
            },
            points: 1,
            bonusColor: 'gold' as const,
            crowns: 0,
            ability: 'none' as const,
        };

        state.extraPoints.p1 = 19;
        state.market = { 1: [jokerCard], 2: [], 3: [] };

        const nextState = applyAction(state, {
            type: 'INITIATE_BUY_JOKER',
            payload: {
                card: jokerCard,
                source: 'market',
                marketInfo: { level: 1, idx: 0 },
            },
        });

        expect(nextState).not.toBe(state);
        expect(nextState?.winner).toBe('p1');
        expect(nextState?.phase).toBe('IDLE');
        expect(nextState?.playerTableau.p1).toContainEqual(
            expect.objectContaining({ id: 'joker-win-card' })
        );
    });
});
