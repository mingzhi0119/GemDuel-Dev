import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GEM_TYPES } from '../../../constants';
import { BUFF_NONE, type GameState, type GemTypeObject } from '../../../types';
import { createMockState } from '../../__tests__/testHelpers';

vi.mock('../../stateHelpers', () => ({
    addFeedback: vi.fn(),
    addPrivilege: vi.fn(),
}));

vi.mock('../../turnManager', () => ({
    finalizeTurn: vi.fn(),
}));

import { handleForceRoyalSelection, handleSelectRoyalCard } from '../royalActions';

const createState = (overrides: Partial<GameState> = {}): GameState =>
    JSON.parse(JSON.stringify(createMockState(overrides))) as GameState;

const createRoyal = (overrides: Partial<GameState['royalDeck'][number]> = {}) => ({
    id: 'royal-card',
    level: 1 as const,
    cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
    points: 2,
    bonusColor: 'red' as const,
    ability: 'again' as const,
    label: 'Royal Card',
    crowns: 1,
    ...overrides,
});

const setGem = (state: GameState, r: number, c: number, type: GemTypeObject = GEM_TYPES.RED) => {
    state.board[r][c] = { type, uid: `cell-${r}-${c}` };
};

describe('royalActions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('forces the royal-selection phase back toward p1 when p2 is active', () => {
        const state = createState({
            turn: 'p2',
            pendingReserve: { level: 2, idx: 0, isDeck: true },
        });

        handleForceRoyalSelection(state);

        expect(state.phase).toBe('SELECT_ROYAL');
        expect(state.nextPlayerAfterRoyal).toBe('p1');
        expect(state.pendingReserve).toBeNull();
    });

    it('forces the royal-selection phase and clears pending board states', () => {
        const state = createState({
            pendingReserve: { card: undefined, level: 1, idx: 0, isDeck: false },
            pendingBuy: { card: createRoyal(), source: 'market' },
            bonusGemTarget: GEM_TYPES.BLUE,
        });

        handleForceRoyalSelection(state);

        expect(state.phase).toBe('SELECT_ROYAL');
        expect(state.nextPlayerAfterRoyal).toBe('p2');
        expect(state.pendingReserve).toBeNull();
        expect(state.pendingBuy).toBeNull();
        expect(state.bonusGemTarget).toBeNull();
    });

    it('tracks extra turns after an AGAIN royal', async () => {
        const { finalizeTurn } = await import('../../turnManager');
        const state = createState({
            turn: 'p1',
            nextPlayerAfterRoyal: 'p2',
            phase: 'SELECT_ROYAL',
        });
        const royal = createRoyal({ ability: 'again' });
        state.royalDeck = [royal as never];

        handleSelectRoyalCard(state, { card: royal });

        expect(state.playerRoyals.p1).toContainEqual(expect.objectContaining({ id: royal.id }));
        expect(state.royalDeck).toHaveLength(0);
        expect(state.pendingExtraTurn).toBe(true);
        expect(finalizeTurn).toHaveBeenCalledWith(state, 'p2');
    });

    it('routes bonus-gem royals into the bonus-target phase', async () => {
        const { finalizeTurn } = await import('../../turnManager');
        const state = createState({ turn: 'p1', phase: 'SELECT_ROYAL' });
        setGem(state, 0, 0, GEM_TYPES.RED);
        const royal = createRoyal({ ability: 'bonus_gem', bonusColor: 'red' });
        state.royalDeck = [royal as never];

        handleSelectRoyalCard(state, { card: royal });

        expect(state.phase).toBe('BONUS_ACTION');
        expect(state.bonusGemTarget?.id).toBe('red');
        expect(state.nextPlayerAfterRoyal).toBe('p2');
        expect(finalizeTurn).not.toHaveBeenCalled();
    });

    it('can skip steal-blocked royals and award privileges for scroll royals', async () => {
        const { addPrivilege } = await import('../../stateHelpers');
        const { finalizeTurn } = await import('../../turnManager');
        const state = createState({
            turn: 'p1',
            phase: 'SELECT_ROYAL',
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                p2: { blue: 1, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            },
        });
        state.playerBuffs.p2 = {
            ...BUFF_NONE,
            effects: { passive: { immuneNegative: true } },
        } as typeof BUFF_NONE;

        const stealRoyal = createRoyal({ ability: 'steal', bonusColor: 'blue' });
        state.royalDeck = [stealRoyal as never];
        handleSelectRoyalCard(state, { card: stealRoyal });
        expect(state.toastMessage).toBe('Steal blocked by Pacifist!');
        expect(finalizeTurn).toHaveBeenCalledWith(state, 'p2');

        const scrollState = createState({ turn: 'p1', phase: 'SELECT_ROYAL' });
        const scrollRoyal = createRoyal({
            id: 'scroll-royal',
            ability: 'scroll',
            bonusColor: 'blue',
        });
        scrollState.royalDeck = [scrollRoyal as never];
        handleSelectRoyalCard(scrollState, { card: scrollRoyal });

        expect(addPrivilege).toHaveBeenCalledWith(scrollState, 'p1');
        expect(finalizeTurn).toHaveBeenCalledWith(scrollState, 'p2');
    });

    it('falls through bonus-gem royals when no matching gem exists and then opens steal mode', async () => {
        const { addFeedback } = await import('../../stateHelpers');
        const { finalizeTurn } = await import('../../turnManager');
        const state = createState({
            turn: 'p1',
            phase: 'SELECT_ROYAL',
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                p2: { blue: 0, white: 1, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            },
            nextPlayerAfterRoyal: null,
        });
        const royal = createRoyal({
            id: 'bonus-then-steal',
            crowns: 0,
            bonusColor: 'green',
            ability: ['bonus_gem', 'steal'] as const,
        });
        state.royalDeck = [royal as never];

        handleSelectRoyalCard(state, { card: royal });

        expect(addFeedback).not.toHaveBeenCalled();
        expect(state.toastMessage).toBe('No matching gem available - Skill skipped');
        expect(state.phase).toBe('STEAL_ACTION');
        expect(state.nextPlayerAfterRoyal).toBe('p2');
        expect(finalizeTurn).not.toHaveBeenCalled();
    });

    it('supports ability-less royals and preserves a precomputed next player', async () => {
        const { finalizeTurn } = await import('../../turnManager');
        const state = createState({
            turn: 'p2',
            phase: 'SELECT_ROYAL',
            nextPlayerAfterRoyal: 'p1',
        });
        const royal = createRoyal({
            id: 'plain-royal',
            crowns: 0,
            ability: undefined,
        });
        state.royalDeck = [royal as never];

        handleSelectRoyalCard(state, { card: royal });

        expect(state.playerRoyals.p2).toContainEqual(
            expect.objectContaining({ id: 'plain-royal' })
        );
        expect(finalizeTurn).toHaveBeenCalledWith(state, 'p1');
        expect(state.pendingExtraTurn).toBe(false);
    });
});
