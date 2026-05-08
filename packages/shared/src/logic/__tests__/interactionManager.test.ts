import { describe, expect, it } from 'vitest';
import { GEM_TYPES } from '../../constants';
import { type GameState, type GemTypeObject } from '../../types';
import { createMockState } from './testHelpers';
import { processGemClick, processOpponentGemClick } from '../interactionManager';

const createState = (overrides: Partial<GameState> = {}): GameState =>
    JSON.parse(JSON.stringify(createMockState(overrides))) as GameState;

const placeGem = (state: GameState, r: number, c: number, type: GemTypeObject = GEM_TYPES.RED) => {
    state.board[r][c] = { type, uid: `cell-${r}-${c}` };
};

describe('interactionManager', () => {
    it('guards null, winner, empty-cell, reserve-gold, and oversized-selection flows', () => {
        expect(processGemClick(null, 0, 0)).toEqual({ error: 'Game not initialized' });

        const wonState = createState({ winner: 'p1' });
        expect(processGemClick(wonState, 0, 0)).toEqual({ error: 'Game Over' });

        const emptyState = createState({ phase: 'IDLE' });
        emptyState.board[0][0] = { type: GEM_TYPES.EMPTY, uid: 'empty-cell' };
        expect(processGemClick(emptyState, 0, 0)).toEqual({ error: 'Empty cell' });

        const reserveState = createState({ phase: 'RESERVE_WAITING_GEM' });
        reserveState.pendingReserve = {
            card: {
                id: 'reserve-card',
                level: 1,
                cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                points: 0,
                bonusColor: 'blue',
            },
            level: 1,
            idx: 0,
            isDeck: false,
        };
        placeGem(reserveState, 0, 0, GEM_TYPES.RED);
        expect(processGemClick(reserveState, 0, 0)).toEqual({
            error: 'That is not Gold. Select a highlighted Gold gem or Cancel.',
        });

        const selectionState = createState({ phase: 'IDLE' });
        placeGem(selectionState, 0, 0, GEM_TYPES.RED);
        placeGem(selectionState, 0, 1, GEM_TYPES.BLUE);
        placeGem(selectionState, 0, 2, GEM_TYPES.GREEN);
        placeGem(selectionState, 0, 3, GEM_TYPES.BLACK);
        expect(
            processGemClick(selectionState, 0, 3, [
                { r: 0, c: 0 },
                { r: 0, c: 1 },
                { r: 0, c: 2 },
            ])
        ).toEqual({ error: 'Max 3 gems.' });
    });

    it('builds and edits gem selections in the selection rail', () => {
        const state = createState({ phase: 'IDLE' });
        placeGem(state, 0, 0, GEM_TYPES.RED);
        placeGem(state, 0, 1, GEM_TYPES.BLUE);
        placeGem(state, 0, 2, GEM_TYPES.GOLD);

        expect(processGemClick(state, 0, 0)).toEqual({ newSelection: [{ r: 0, c: 0 }] });
        expect(processGemClick(state, 0, 0, [{ r: 0, c: 0 }])).toEqual({ newSelection: [] });
        expect(processGemClick(state, 0, 2)).toEqual({ error: 'Cannot take Gold directly!' });

        const invalidModeState = createState({ phase: 'DRAFT_PHASE' });
        placeGem(invalidModeState, 0, 0, GEM_TYPES.RED);
        expect(processGemClick(invalidModeState, 0, 0)).toEqual({
            error: 'Invalid Game Mode for Gem Click',
        });
    });

    it('routes bonus, reserve, and privilege board clicks into the expected actions', () => {
        const bonusState = createState({ phase: 'BONUS_ACTION' });
        bonusState.bonusGemTarget = GEM_TYPES.RED;
        placeGem(bonusState, 0, 0, GEM_TYPES.RED);
        placeGem(bonusState, 0, 1, GEM_TYPES.BLUE);

        expect(processGemClick(bonusState, 0, 0)).toEqual({
            action: { type: 'TAKE_BONUS_GEM', payload: { r: 0, c: 0 } },
        });
        expect(processGemClick(bonusState, 0, 1)).toEqual({
            error: 'Must select a Red gem!',
        });

        const reserveCardState = createState({ phase: 'RESERVE_WAITING_GEM' });
        reserveCardState.pendingReserve = {
            card: {
                id: 'reserve-card',
                level: 1,
                cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                points: 1,
            },
            level: 1,
            idx: 0,
            isDeck: false,
        };
        placeGem(reserveCardState, 1, 1, GEM_TYPES.GOLD);
        expect(processGemClick(reserveCardState, 1, 1)).toMatchObject({
            action: {
                type: 'RESERVE_CARD',
                payload: {
                    goldCoords: { r: 1, c: 1 },
                },
            },
        });

        const reserveVisibleDeckCardState = createState({ phase: 'RESERVE_WAITING_GEM' });
        reserveVisibleDeckCardState.pendingReserve = {
            card: {
                id: 'insight-card',
                level: 1,
                cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                points: 1,
            },
            level: 1,
            idx: 0,
            isExtra: true,
            extraIdx: 0,
            isDeck: false,
        };
        placeGem(reserveVisibleDeckCardState, 1, 3, GEM_TYPES.GOLD);
        expect(processGemClick(reserveVisibleDeckCardState, 1, 3)).toEqual({
            action: {
                type: 'RESERVE_CARD',
                payload: {
                    card: reserveVisibleDeckCardState.pendingReserve.card,
                    level: 1,
                    idx: 0,
                    isExtra: true,
                    extraIdx: 0,
                    isDeck: false,
                    goldCoords: { r: 1, c: 3 },
                },
            },
        });

        const reserveDeckState = createState({ phase: 'RESERVE_WAITING_GEM' });
        reserveDeckState.pendingReserve = {
            level: 2,
            idx: 0,
            isDeck: true,
        };
        placeGem(reserveDeckState, 1, 2, GEM_TYPES.GOLD);
        expect(processGemClick(reserveDeckState, 1, 2)).toMatchObject({
            action: {
                type: 'RESERVE_DECK',
                payload: {
                    goldCoords: { r: 1, c: 2 },
                },
            },
        });

        const privilegeState = createState({ phase: 'PRIVILEGE_ACTION' });
        placeGem(privilegeState, 2, 0, GEM_TYPES.BLUE);
        placeGem(privilegeState, 2, 1, GEM_TYPES.GOLD);

        expect(processGemClick(privilegeState, 2, 0)).toEqual({
            action: { type: 'USE_PRIVILEGE', payload: { r: 2, c: 0 } },
        });
        expect(processGemClick(privilegeState, 2, 1)).toEqual({
            error: 'Cannot use Privilege on Gold.',
        });
    });

    it('routes opponent gem clicks only during steal mode', () => {
        const stealState = createState({
            phase: 'STEAL_ACTION',
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                p2: { blue: 1, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            },
        });

        expect(processOpponentGemClick(stealState, 'red')).toEqual({
            error: 'Opponent does not have this gem.',
        });
        expect(processOpponentGemClick(stealState, 'gold')).toEqual({
            error: 'Cannot steal Gold!',
        });
        expect(processOpponentGemClick(stealState, 'blue')).toEqual({
            action: { type: 'STEAL_GEM', payload: { gemId: 'blue' } },
        });

        expect(processOpponentGemClick(createState(), 'blue')).toEqual({
            error: 'Not in Steal Mode',
        });
    });

    it('handles opponent-click game-over and p2-opponent routing cases', () => {
        expect(processOpponentGemClick(null, 'blue')).toEqual({ error: 'Game Over' });

        const wonState = createState({
            winner: 'p1',
            phase: 'STEAL_ACTION',
        });
        expect(processOpponentGemClick(wonState, 'blue')).toEqual({ error: 'Game Over' });

        const p2StealState = createState({
            turn: 'p2',
            phase: 'STEAL_ACTION',
            inventories: {
                p1: { blue: 1, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            },
        });

        expect(processOpponentGemClick(p2StealState, 'blue')).toEqual({
            action: { type: 'STEAL_GEM', payload: { gemId: 'blue' } },
        });
    });
});
