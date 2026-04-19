import { describe, it, expect } from 'vitest';
import { applyAction } from '../../gameReducer';
import { INITIAL_STATE_SKELETON } from '../../initialState';
import { BUFFS, GEM_TYPES } from '../../../constants';
import { Card, GameAction } from '../../../types';
import { createGameSetupPayload } from '../../gameSetup';

// Helper to create a clean state
const createTestState = () => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON));

describe('Logic Discrepancy Tests (v3.1.0 JS vs Current TS)', () => {
    it('[handleInit] should ignore non-setup state overrides and keep the bootstrap DTO narrow', () => {
        const customPayload = {
            ...createGameSetupPayload('LOCAL_PVP'),
            privileges: { p1: 3, p2: 3 },
        };

        const action: GameAction = {
            type: 'INIT',
            payload: customPayload,
        };

        // The initial state is null
        const nextState = applyAction(null, action);

        expect(nextState).not.toBeNull();
        expect(nextState!.privileges.p1).toBe(0);
        expect(nextState!.privileges.p2).toBe(1);
    });

    it('[handleBuyCard] Recycler buff should refund the FIRST color paid, not the most numerous', () => {
        // This test verifies a logic discrepancy found between the original JS and the TS migration.
        // JS version refunded paidColors[0]. TS version refunds the color with the highest amount.
        const state = createTestState();

        // Give p1 the Recycler buff and enough gems
        state.playerBuffs.p1 = BUFFS.RECYCLER;
        state.inventories.p1 = { blue: 1, white: 2, green: 0, black: 0, red: 0, gold: 0, pearl: 0 };

        // Create a card that costs 1 blue and 2 white
        const cardToBuy: Card = {
            id: 'test-card',
            level: 2,
            cost: { blue: 1, white: 2, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            points: 2,
            bonusColor: 'green',
            crowns: 0,
            ability: 'none',
        };
        state.market[2][0] = cardToBuy;

        // Pre-fill the bag so the refund logic can execute correctly
        state.bag.push({ type: GEM_TYPES.BLUE, uid: 'b-bag' });
        state.bag.push({ type: GEM_TYPES.WHITE, uid: 'w-bag' });
        state.bag.push({ type: GEM_TYPES.WHITE, uid: 'w-bag-2' });

        const action: GameAction = {
            type: 'BUY_CARD',
            payload: { card: cardToBuy, source: 'market', marketInfo: { level: 2, idx: 0 } },
        };

        const nextState = applyAction(state, action);

        // Assertions
        expect(nextState).not.toBeNull();
        // Original logic: should refund 1 BLUE because it was the first color in the cost object.
        // Current TS logic: will refund 1 WHITE because more white gems were paid.
        expect(nextState!.inventories.p1.blue).toBe(1); // Started with 1, paid 1, got 1 back.
        expect(nextState!.inventories.p1.white).toBe(0); // Started with 2, paid 2.
    });

    it('[handleBuyCard & handleSelectRoyalCard] bonusGemTarget should be an object with id/label, not a plain string', () => {
        // This test verifies that bonusGemTarget is correctly set as an object
        const state = createTestState();

        // Setup state for the test
        state.turn = 'p1';
        state.inventories.p1 = { red: 1, blue: 0, white: 0, green: 0, black: 0, gold: 0, pearl: 0 };

        // Create a card with BONUS_GEM ability
        const cardWithBonus: Card = {
            id: 'bonus-card',
            level: 1,
            cost: { red: 1, blue: 0, white: 0, green: 0, black: 0, pearl: 0, gold: 0 },
            points: 1,
            bonusColor: 'red',
            ability: 'bonus_gem',
        };
        state.market[1][0] = cardWithBonus;

        // Add a matching gem to the board so the bonus gem action is available
        state.board[0][0] = { type: GEM_TYPES.RED, uid: 'red-gem-1' };

        // Buy the card with bonus gem ability
        const buyAction: GameAction = {
            type: 'BUY_CARD',
            payload: { card: cardWithBonus, source: 'market', marketInfo: { level: 1, idx: 0 } },
        };

        const nextState = applyAction(state, buyAction);

        // Assertions
        expect(nextState).not.toBeNull();
        // bonusGemTarget should be an object with .id and .label (used by interactionManager)
        expect(typeof nextState!.bonusGemTarget).toBe('object');
        expect(nextState!.bonusGemTarget?.id).toBe('red');
        expect(nextState!.phase).toBe('BONUS_ACTION');
    });
});
