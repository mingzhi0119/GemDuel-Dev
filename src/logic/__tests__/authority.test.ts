import { describe, it, expect, vi } from 'vitest';
import { validateOnlineAction } from '../authority';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { GameState, GameAction } from '../../types';

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

    it('should REJECT guest actions that do not match the current phase', () => {
        const action: GameAction = { type: 'TAKE_BONUS_GEM', payload: { r: 0, c: 0 } };

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        expect(validateOnlineAction(mockState, action)).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
