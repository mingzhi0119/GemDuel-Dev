import { describe, expect, it, vi } from 'vitest';
import { ABILITIES, GEM_TYPES } from '../../constants';
import { computeAiAction } from '../ai/aiPlayer';
import { createMockState } from './testHelpers';

describe('AI player phase routing', () => {
    it('uses the draft surface policy to select a buff during draft selection', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const action = computeAiAction(
            createMockState({
                phase: 'DRAFT_PHASE',
                turn: 'p2',
                draftPool: ['privilege_favor'],
                p2DraftPool: ['privilege_favor'],
            })
        );

        expect(action).toMatchObject({
            type: 'SELECT_BUFF',
            payload: { buffId: 'privilege_favor' },
        });

        vi.restoreAllMocks();
    });

    it('uses the FSM steal surface policy before choosing a gem to steal', () => {
        const action = computeAiAction(
            createMockState({
                phase: 'STEAL_ACTION',
                turn: 'p1',
                inventories: {
                    p1: {
                        blue: 0,
                        white: 0,
                        green: 0,
                        black: 0,
                        red: 0,
                        gold: 0,
                        pearl: 0,
                    },
                    p2: {
                        blue: 0,
                        white: 0,
                        green: 0,
                        black: 0,
                        red: 2,
                        gold: 0,
                        pearl: 0,
                    },
                },
            })
        );

        expect(action).toEqual({
            type: 'STEAL_GEM',
            payload: { gemId: 'red' },
        });
    });

    it('selects the highest-point royal card when the royal selection surface is active', () => {
        const action = computeAiAction(
            createMockState({
                phase: 'SELECT_ROYAL',
                royalDeck: [
                    { id: 'royal-low', points: 2, bonusColor: 'blue', label: 'Low', ability: [] },
                    { id: 'royal-high', points: 5, bonusColor: 'red', label: 'High', ability: [] },
                ],
            })
        );

        expect(action).toEqual({
            type: 'SELECT_ROYAL_CARD',
            payload: {
                card: {
                    id: 'royal-high',
                    points: 5,
                    bonusColor: 'red',
                    label: 'High',
                    ability: [],
                },
            },
        });
    });

    it('discards the largest basic inventory first and falls back to pearl or gold', () => {
        const discardBasic = computeAiAction(
            createMockState({
                phase: 'DISCARD_EXCESS_GEMS',
                turn: 'p2',
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 1, white: 0, green: 3, black: 2, red: 0, gold: 1, pearl: 1 },
                },
            })
        );

        const discardPearl = computeAiAction(
            createMockState({
                phase: 'DISCARD_EXCESS_GEMS',
                turn: 'p2',
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 1, pearl: 2 },
                },
            })
        );

        expect(discardBasic).toEqual({ type: 'DISCARD_GEM', payload: 'green' });
        expect(discardPearl).toEqual({ type: 'DISCARD_GEM', payload: 'pearl' });
    });

    it('takes the matching bonus gem target and resolves joker color choices deterministically', () => {
        const bonusAction = computeAiAction(
            createMockState({
                phase: 'BONUS_ACTION',
                bonusGemTarget: GEM_TYPES.RED,
                board: [
                    [
                        GEM_TYPES.RED,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                ].map((row, r) => row.map((type, c) => ({ type, uid: `${r}-${c}-${type.id}` }))),
            })
        );

        const jokerAction = computeAiAction(
            createMockState({
                phase: 'SELECT_CARD_COLOR',
                pendingBuy: {
                    card: {
                        id: 'joker-card',
                        level: 3,
                        points: 4,
                        cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                        bonusColor: 'gold',
                        ability: ABILITIES.STEAL.id,
                    },
                    source: 'market',
                    marketInfo: { level: 3, idx: 1, isExtra: true, extraIdx: 0 },
                },
            })
        );

        expect(bonusAction).toEqual({ type: 'TAKE_BONUS_GEM', payload: { r: 0, c: 0 } });
        expect(jokerAction).toEqual({
            type: 'BUY_CARD',
            payload: {
                card: expect.objectContaining({ id: 'joker-card', bonusColor: 'red' }),
                source: 'market',
                marketInfo: { level: 3, idx: 1, isExtra: true, extraIdx: 0 },
                randoms: { bountyHunterColor: 'red' },
            },
        });
    });

    it('buys the best available card before reserving or taking gems', () => {
        const action = computeAiAction(
            createMockState({
                turn: 'p2',
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 5, white: 5, green: 5, black: 5, red: 5, gold: 0, pearl: 0 },
                },
                market: {
                    1: [
                        {
                            id: 'market-high',
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
                            points: 5,
                            bonusColor: 'blue',
                        },
                    ],
                    2: [],
                    3: [],
                },
                playerReserved: {
                    p1: [],
                    p2: [
                        {
                            id: 'reserved-low',
                            level: 2,
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
                            bonusColor: 'green',
                        },
                    ],
                },
            })
        );

        expect(action).toEqual({
            type: 'BUY_CARD',
            payload: {
                card: expect.objectContaining({ id: 'market-high' }),
                source: 'market',
                marketInfo: { level: 1, idx: 0 },
                randoms: { bountyHunterColor: 'red' },
            },
        });
    });

    it('replenishes a sparse board and otherwise selects a safe gem line under the gem cap', () => {
        const replenishAction = computeAiAction(
            createMockState({
                bag: [{ type: GEM_TYPES.BLUE, uid: 'bag-blue' }],
                board: Array.from({ length: 5 }, (_, r) =>
                    Array.from({ length: 5 }, (_, c) => ({
                        type: r === 0 && c === 0 ? GEM_TYPES.RED : GEM_TYPES.EMPTY,
                        uid: `${r}-${c}`,
                    }))
                ),
            })
        );

        const takeGemsAction = computeAiAction(
            createMockState({
                turn: 'p2',
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                },
                board: [
                    [
                        GEM_TYPES.RED,
                        GEM_TYPES.GREEN,
                        GEM_TYPES.BLUE,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                ].map((row, r) => row.map((type, c) => ({ type, uid: `${r}-${c}-${type.id}` }))),
                bag: [],
                market: { 1: [], 2: [], 3: [] },
                playerReserved: { p1: [], p2: [] },
            })
        );

        expect(replenishAction).toEqual({
            type: 'REPLENISH',
            payload: { randoms: { expansionColor: 'red', extortionColor: 'blue' } },
        });
        expect(takeGemsAction).toEqual({
            type: 'TAKE_GEMS',
            payload: {
                coords: [
                    { r: 0, c: 0 },
                    { r: 0, c: 1 },
                    { r: 0, c: 2 },
                ],
            },
        });
    });

    it('reserves a high-level card and includes gold coordinates when available', () => {
        const withGold = computeAiAction(
            createMockState({
                bag: [],
                market: {
                    1: [],
                    2: [
                        {
                            id: 'market-two',
                            level: 2,
                            cost: {
                                blue: 4,
                                white: 4,
                                green: 4,
                                black: 4,
                                red: 4,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 3,
                            bonusColor: 'blue',
                        },
                    ],
                    3: [],
                },
                board: Array.from({ length: 5 }, (_, r) =>
                    Array.from({ length: 5 }, (_, c) => ({
                        type: r === 1 && c === 1 ? GEM_TYPES.GOLD : GEM_TYPES.EMPTY,
                        uid: `${r}-${c}`,
                    }))
                ),
            })
        );

        expect(withGold).toEqual({
            type: 'RESERVE_CARD',
            payload: {
                card: expect.objectContaining({ id: 'market-two' }),
                level: 2,
                idx: 0,
                goldCoords: { r: 1, c: 1 },
            },
        });
    });
});
