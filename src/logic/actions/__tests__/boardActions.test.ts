/**
 * Example test suite for boardActions
 *
 * Demonstrates how to test pure action handlers with Vitest
 * Each test validates that the action correctly modifies game state
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    handleDiscardGem,
    handleReplenish,
    handleStealGem,
    handleTakeBonusGem,
    handleTakeGems,
} from '../boardActions';
import { INITIAL_STATE_SKELETON } from '../../initialState';
import { GEM_TYPES, BUFFS } from '../../../constants';
import { GameState } from '../../../types';

describe('boardActions', () => {
    let testState: GameState;

    beforeEach(() => {
        // Create a fresh copy of initial state for each test
        testState = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON));
        testState.turn = 'p1';

        // Give p1 some gems to work with
        testState.inventories.p1 = {
            blue: 5,
            white: 3,
            green: 2,
            black: 1,
            red: 2,
            gold: 1,
            pearl: 0,
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Delayed Discard Trigger', () => {
        it('handleReplenish should NOT trigger discard even if gems > 10', () => {
            // Setup: p1 has Aggressive Expansion (gives gem on replenish)
            testState.playerBuffs.p1 = BUFFS.AGGRESSIVE_EXPANSION;
            testState.inventories.p1 = {
                blue: 10,
                white: 0,
                green: 0,
                black: 0,
                red: 0,
                gold: 0,
                pearl: 0,
            };
            testState.board[0][0] = { type: GEM_TYPES.RED, uid: 'r1' }; // Board not empty

            // Replenish will give +1 gem (total 11)
            const updatedState = handleReplenish(testState, {
                randoms: { expansionColor: 'blue' },
            });

            const total = Object.values(updatedState.inventories.p1).reduce((a, b) => a + b, 0);
            expect(total).toBe(11);
            // Should NOT be in discard phase yet, as turn hasn't finalized (Replenish is optional)
            expect(updatedState.phase).not.toBe('DISCARD_EXCESS_GEMS');
            expect(updatedState.phase).toBe('IDLE');
        });

        it('handleStealGem SHOULD trigger discard because it calls finalizeTurn at end of action', () => {
            testState.inventories.p1 = {
                blue: 10,
                white: 0,
                green: 0,
                black: 0,
                red: 0,
                gold: 0,
                pearl: 0,
            };
            testState.inventories.p2 = {
                red: 5,
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                gold: 0,
                pearl: 0,
            };

            const updatedState = handleStealGem(testState, { gemId: 'red' });

            expect(updatedState.inventories.p1.red).toBe(1);
            expect(updatedState.phase).toBe('DISCARD_EXCESS_GEMS');
        });

        it('handleTakeBonusGem should respect the staged next player from the royal flow', () => {
            testState.board[0][0] = { type: GEM_TYPES.RED, uid: 'bonus-red' };
            testState.nextPlayerAfterRoyal = 'p1';

            const updatedState = handleTakeBonusGem(testState, { r: 0, c: 0 });

            expect(updatedState.inventories.p1.red).toBe(3);
            expect(updatedState.turn).toBe('p1');
            expect(updatedState.bonusGemTarget).toBeNull();
        });
    });

    describe('handleTakeGems', () => {
        it('should transfer a capped privilege pool to the opponent when taking two pearls', () => {
            testState.inventories.p1 = {
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                red: 0,
                gold: 0,
                pearl: 0,
            };
            testState.privileges = { p1: 1, p2: 2 };
            testState.board[0][0] = { type: GEM_TYPES.PEARL, uid: 'pearl-a' };
            testState.board[0][1] = { type: GEM_TYPES.PEARL, uid: 'pearl-b' };

            const updatedState = handleTakeGems(testState, {
                coords: [
                    { r: 0, c: 0 },
                    { r: 0, c: 1 },
                ],
            });

            expect(updatedState.inventories.p1.pearl).toBe(2);
            expect(updatedState.privileges).toEqual({ p1: 0, p2: 3 });
            expect(updatedState.turn).toBe('p2');
        });
    });

    describe('handleReplenish', () => {
        it('should fall back to a real stealable color when extortion gets an invalid forced color', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0);

            testState.board[0][0] = { type: GEM_TYPES.RED, uid: 'occupied' };
            testState.playerBuffs.p1 = JSON.parse(JSON.stringify(BUFFS.EXTORTION));
            testState.playerBuffs.p1.state = { refillCount: 1 };
            testState.inventories.p2 = {
                blue: 1,
                white: 0,
                green: 0,
                black: 0,
                red: 0,
                gold: 0,
                pearl: 0,
            };

            const updatedState = handleReplenish(testState, {
                randoms: { extortionColor: 'red' },
            });

            expect(updatedState.inventories.p1.blue).toBe(6);
            expect(updatedState.inventories.p2.blue).toBe(0);
            expect(updatedState.toastMessage).toBe('Extortion! Stole 1 blue!');
        });

        it('should stop extortion when the opponent is protected by Pacifist', () => {
            testState.board[0][0] = { type: GEM_TYPES.RED, uid: 'occupied' };
            testState.playerBuffs.p1 = JSON.parse(JSON.stringify(BUFFS.EXTORTION));
            testState.playerBuffs.p1.state = { refillCount: 1 };
            testState.playerBuffs.p2 = BUFFS.PACIFIST;
            testState.inventories.p2.blue = 2;

            const updatedState = handleReplenish(testState);

            expect(updatedState.inventories.p1.blue).toBe(5);
            expect(updatedState.inventories.p2.blue).toBe(2);
            expect(updatedState.toastMessage).toBe('Extortion blocked by Pacifist!');
        });

        it('should surface the no-basic-gems fallback when extortion has nothing to steal', () => {
            testState.board[0][0] = { type: GEM_TYPES.RED, uid: 'occupied' };
            testState.playerBuffs.p1 = JSON.parse(JSON.stringify(BUFFS.EXTORTION));
            testState.playerBuffs.p1.state = { refillCount: 1 };
            testState.inventories.p2 = {
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                red: 0,
                gold: 2,
                pearl: 1,
            };

            const updatedState = handleReplenish(testState);

            expect(updatedState.toastMessage).toBe(
                'Extortion triggered but opponent has no basic gems.'
            );
        });

        it('should create extra allocation and refill the board for aggressive expansion', () => {
            testState.board[2][2] = { type: GEM_TYPES.EMPTY, uid: 'empty-center' };
            testState.bag = [{ type: GEM_TYPES.BLACK, uid: 'bag-black' }];
            testState.playerBuffs.p1 = BUFFS.AGGRESSIVE_EXPANSION;
            testState.extraAllocation = null;

            const updatedState = handleReplenish(testState, {
                randoms: { expansionColor: 'green' },
            });

            expect(updatedState.inventories.p1.green).toBe(3);
            expect(updatedState.extraAllocation?.p1.green).toBe(1);
            expect(updatedState.board[2][2].type.id).toBe('black');
            expect(updatedState.toastMessage).toBe('Aggressive Expansion: +1 Gem!');
        });
    });

    describe('handleDiscardGem', () => {
        it('should reduce gem count when player discards a gem', () => {
            const initialBlue = testState.inventories.p1.blue;

            // Action: player p1 discards a blue gem
            const updatedState = handleDiscardGem(testState, 'blue');

            // Assertion: blue count decreased by 1
            expect(updatedState.inventories.p1.blue).toBe(initialBlue - 1);
        });

        it('should not reduce gems below zero', () => {
            // Give p1 zero white gems
            testState.inventories.p1.white = 0;

            const updatedState = handleDiscardGem(testState, 'white');

            // Should still be 0 (not negative)
            expect(updatedState.inventories.p1.white).toBe(0);
        });

        it('should add discarded gem to bag', () => {
            const updatedState = handleDiscardGem(testState, 'red');

            // The discarded gem should be in the bag
            const discardedGem = updatedState.bag[updatedState.bag.length - 1];
            if (typeof discardedGem === 'object' && 'type' in discardedGem) {
                expect(discardedGem.type.id).toBe('red');
            }
        });

        it('should transition to next player when total gems <= 10', () => {
            // Set up: p1 has exactly 11 gems (over the limit)
            testState.inventories.p1 = {
                blue: 3,
                white: 3,
                green: 2,
                black: 1,
                red: 1,
                gold: 1,
                pearl: 0,
            };
            testState.phase = 'DISCARD_EXCESS_GEMS';
            testState.nextPlayerAfterRoyal = null;

            // Action: discard blue gem
            const updatedState = handleDiscardGem(testState, 'blue');

            // Calculate total gems after discard
            const totalGems = Object.values(updatedState.inventories.p1).reduce((a, b) => a + b, 0);

            // If total is <= 10, turn should change to p2
            if (totalGems <= 10) {
                expect(updatedState.turn).toBe('p2');
            }
        });

        it('should keep the discard flow on the same player while still above the gem cap', () => {
            testState.inventories.p1 = {
                blue: 10,
                white: 1,
                green: 0,
                black: 0,
                red: 1,
                gold: 0,
                pearl: 0,
            };
            testState.phase = 'DISCARD_EXCESS_GEMS';

            const updatedState = handleDiscardGem(testState, 'white');

            expect(updatedState.turn).toBe('p1');
            expect(updatedState.phase).toBe('DISCARD_EXCESS_GEMS');
            expect(updatedState.inventories.p1.white).toBe(0);
        });
    });

    describe('edge cases', () => {
        it('should handle empty gem inventory gracefully', () => {
            testState.inventories.p1 = {
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                red: 0,
                gold: 0,
                pearl: 0,
            };

            const updatedState = handleDiscardGem(testState, 'blue');

            // Should not crash, all values should remain 0
            expect(updatedState.inventories.p1.blue).toBe(0);
        });

        it('should preserve other player gems when discarding', () => {
            const initialP2Gems = JSON.parse(JSON.stringify(testState.inventories.p2));

            const updatedState = handleDiscardGem(testState, 'red');

            // p2 inventory should not change
            expect(updatedState.inventories.p2).toEqual(initialP2Gems);
        });

        it('should still finalize the turn cleanly when a steal resolves without inventory transfer', () => {
            testState.inventories.p1 = {
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                red: 2,
                gold: 0,
                pearl: 0,
            };
            testState.inventories.p2.red = 0;

            const updatedState = handleStealGem(testState, { gemId: 'red' });

            expect(updatedState.inventories.p1.red).toBe(2);
            expect(updatedState.inventories.p2.red).toBe(0);
            expect(updatedState.turn).toBe('p2');
        });

        it('should ignore malformed bonus-gem payloads', () => {
            const updatedState = handleTakeBonusGem(testState, undefined as never);

            expect(updatedState).toBe(testState);
            expect(updatedState.turn).toBe('p1');
        });

        it('should ignore malformed steal payloads', () => {
            const updatedState = handleStealGem(testState, undefined as never);

            expect(updatedState).toBe(testState);
            expect(updatedState.turn).toBe('p1');
        });
    });
});
