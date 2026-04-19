import { describe, it, expect, vi } from 'vitest';
import { reviewOnlineIntent, validateOnlineAction } from '../authority';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { GameState, GameAction } from '../../types';
import type { GuestIntentCommand } from '../../types/network';

describe('Authority Validator', () => {
    const mockState: GameState = {
        ...INITIAL_STATE_SKELETON,
        mode: 'ONLINE_MULTIPLAYER',
        isHost: true, // I am P1
        turn: 'p2', // It is Guest turn by default
    };

    it('should REJECT guest action when it is Host turn', () => {
        const state = { ...mockState, turn: 'p1' } as GameState;
        const action: GameAction = { type: 'TAKE_GEMS', payload: { coords: [] } };

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        expect(validateOnlineAction(state, action)).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should ALLOW guest action when it is Guest turn', () => {
        const state = {
            ...mockState,
            board: JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON.board)),
        } as GameState;
        state.board[0][0] = { type: { id: 'red', color: '', border: '', label: '' }, uid: 'r1' };
        const action: GameAction = { type: 'TAKE_GEMS', payload: { coords: [{ r: 0, c: 0 }] } };

        expect(validateOnlineAction(state, action)).toBe(true);
    });

    it('should REJECT non-whitelisted guest actions', () => {
        const action: GameAction = { type: 'DEBUG_ADD_POINTS', payload: 'p2' };

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        expect(validateOnlineAction(mockState, action)).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should REJECT guest intents that do not match the current phase', () => {
        const command: GuestIntentCommand = { kind: 'TAKE_BONUS_GEM', payload: { r: 0, c: 0 } };

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const review = reviewOnlineIntent(mockState, command);
        expect(review.valid).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should REJECT valid-but-unauthorized guest intents that target missing ownership', () => {
        const state = {
            ...mockState,
            playerReserved: {
                ...mockState.playerReserved,
                p2: [],
            },
        } as GameState;
        const command: GuestIntentCommand = {
            kind: 'BUY_CARD',
            payload: {
                card: {
                    id: 'reserved-card',
                    level: 1,
                    cost: {
                        blue: 0,
                        white: 0,
                        green: 0,
                        black: 0,
                        red: 0,
                        pearl: 0,
                        gold: 0,
                    },
                    points: 0,
                    bonusColor: 'blue',
                },
                source: 'reserved',
            },
        };

        const review = reviewOnlineIntent(state, command);

        expect(review.valid).toBe(false);
        expect(review.reason).toContain('Reserved card');
    });
});
