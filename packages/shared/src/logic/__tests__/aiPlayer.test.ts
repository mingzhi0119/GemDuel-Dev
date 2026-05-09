import { describe, expect, it, vi } from 'vitest';
import { ABILITIES, GEM_TYPES } from '../../constants';
import type { Card } from '../../types';
import { computeAiAction } from '../ai/aiPlayer';
import { applyAction } from '../gameReducer';
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

    it('can route draft randomness through an explicit random source', () => {
        const randomSource = {
            next: vi.fn().mockReturnValueOnce(0.99).mockReturnValueOnce(0.2),
        };

        const action = computeAiAction(
            createMockState({
                phase: 'DRAFT_PHASE',
                turn: 'p2',
                p2DraftPool: ['privilege_favor', 'deep_pockets'],
            }),
            randomSource
        );

        expect(action).toMatchObject({
            type: 'SELECT_BUFF',
            payload: {
                buffId: 'deep_pockets',
                randomColor: 'green',
            },
        });
        expect(randomSource.next).toHaveBeenCalledTimes(2);
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

    it('returns null when the draft selection surface has no buff pool to choose from', () => {
        const action = computeAiAction(
            createMockState({
                phase: 'DRAFT_PHASE',
                turn: 'p2',
                draftPool: [],
                p2DraftPool: [],
            })
        );

        expect(action).toBeNull();
    });

    it('falls back to gold discard and returns null when steal or bonus targets are unavailable', () => {
        const discardGold = computeAiAction(
            createMockState({
                phase: 'DISCARD_EXCESS_GEMS',
                turn: 'p2',
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 1, pearl: 0 },
                },
            })
        );

        const stealMissingTarget = computeAiAction(
            createMockState({
                phase: 'STEAL_ACTION',
                turn: 'p1',
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                },
                market: { 1: [], 2: [], 3: [] },
                playerReserved: { p1: [], p2: [] },
                bag: [],
            })
        );

        const bonusMissingTarget = computeAiAction(
            createMockState({
                phase: 'BONUS_ACTION',
                bonusGemTarget: GEM_TYPES.BLUE,
                board: Array.from({ length: 5 }, (_, r) =>
                    Array.from({ length: 5 }, (_, c) => ({
                        type: GEM_TYPES.EMPTY,
                        uid: `${r}-${c}-empty`,
                    }))
                ),
                market: { 1: [], 2: [], 3: [] },
                playerReserved: { p1: [], p2: [] },
                bag: [],
            })
        );

        expect(discardGold).toEqual({ type: 'DISCARD_GEM', payload: 'gold' });
        expect(stealMissingTarget).toBeNull();
        expect(bonusMissingTarget).toBeNull();
    });

    it('normalizes joker color selection payloads for regular market cards and reserved cards', () => {
        const regularMarketAction = computeAiAction(
            createMockState({
                phase: 'SELECT_CARD_COLOR',
                pendingBuy: {
                    card: {
                        id: 'joker-market',
                        level: 2,
                        points: 2,
                        cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                        bonusColor: 'gold',
                        ability: ABILITIES.STEAL.id,
                    },
                    source: 'market',
                    marketInfo: { level: 2, idx: 0 },
                },
            })
        );

        const reservedAction = computeAiAction(
            createMockState({
                phase: 'SELECT_CARD_COLOR',
                pendingBuy: {
                    card: {
                        id: 'joker-reserved',
                        level: 3,
                        points: 3,
                        cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                        bonusColor: 'gold',
                        ability: ABILITIES.STEAL.id,
                    },
                    source: 'reserved',
                    marketInfo: undefined,
                },
            })
        );

        expect(regularMarketAction).toEqual({
            type: 'BUY_CARD',
            payload: {
                card: expect.objectContaining({ id: 'joker-market', bonusColor: 'red' }),
                source: 'market',
                marketInfo: { level: 2, idx: 0 },
                randoms: { bountyHunterColor: 'red' },
            },
        });
        expect(reservedAction).toEqual({
            type: 'BUY_CARD',
            payload: {
                card: expect.objectContaining({ id: 'joker-reserved', bonusColor: 'red' }),
                source: 'reserved',
                marketInfo: undefined,
                randoms: { bountyHunterColor: 'red' },
            },
        });
    });

    it('prefers higher-level cards on tied points and initiates joker purchases for gold bonus cards', () => {
        const tiedPointAction = computeAiAction(
            createMockState({
                turn: 'p2',
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 5, white: 5, green: 5, black: 5, red: 5, gold: 0, pearl: 0 },
                },
                market: {
                    1: [
                        {
                            id: 'market-low',
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
                            points: 2,
                            bonusColor: 'blue',
                        },
                    ],
                    2: [],
                    3: [
                        {
                            id: 'market-high',
                            level: 3,
                            cost: {
                                blue: 0,
                                white: 0,
                                green: 0,
                                black: 0,
                                red: 0,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 2,
                            bonusColor: 'green',
                        },
                    ],
                },
                playerReserved: { p1: [], p2: [] },
            })
        );

        const jokerInitiation = computeAiAction(
            createMockState({
                turn: 'p2',
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 5, white: 5, green: 5, black: 5, red: 5, gold: 0, pearl: 0 },
                },
                market: { 1: [], 2: [], 3: [] },
                playerReserved: {
                    p1: [],
                    p2: [
                        {
                            id: 'reserved-joker',
                            level: 3,
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
                            bonusColor: 'gold',
                            ability: ABILITIES.STEAL.id,
                        },
                    ],
                },
            })
        );

        expect(tiedPointAction).toEqual({
            type: 'BUY_CARD',
            payload: {
                card: expect.objectContaining({ id: 'market-high' }),
                source: 'market',
                marketInfo: { level: 3, idx: 0 },
                randoms: { bountyHunterColor: 'red' },
            },
        });
        expect(jokerInitiation).toEqual({
            type: 'INITIATE_BUY_JOKER',
            payload: {
                card: expect.objectContaining({ id: 'reserved-joker' }),
                source: 'reserved',
                marketInfo: undefined,
            },
        });
    });

    it('buys the revealed Insight top-deck card when it is the best affordable option', () => {
        const action = computeAiAction(
            createMockState({
                turn: 'p2',
                playerBuffs: {
                    p1: createMockState().playerBuffs.p1,
                    p2: {
                        ...createMockState().playerBuffs.p2,
                        id: 'insight',
                        effects: { passive: { revealDeck1: true } },
                    },
                },
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 5, gold: 0, pearl: 0 },
                },
                market: { 1: [], 2: [], 3: [] },
                decks: {
                    1: [
                        {
                            id: 'insight-target',
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
                            points: 4,
                            bonusColor: 'blue',
                        },
                    ],
                    2: [],
                    3: [],
                },
            })
        );

        expect(action).toEqual({
            type: 'BUY_CARD',
            payload: {
                card: expect.objectContaining({ id: 'insight-target' }),
                source: 'market',
                marketInfo: { level: 1, idx: 0, isExtra: true, extraIdx: 0 },
                randoms: { bountyHunterColor: 'red' },
            },
        });
    });

    it('can reserve All-Seeing Eye extra level-3 cards when they are the best visible target', () => {
        const action = computeAiAction(
            createMockState({
                bag: [],
                turn: 'p2',
                playerBuffs: {
                    p1: createMockState().playerBuffs.p1,
                    p2: {
                        ...createMockState().playerBuffs.p2,
                        id: 'all_seeing_eye',
                        effects: { passive: { extraL3: true } },
                    },
                },
                market: { 1: [], 2: [], 3: [] },
                decks: {
                    1: [],
                    2: [],
                    3: [
                        {
                            id: 'hidden-bottom',
                            level: 3,
                            cost: {
                                blue: 9,
                                white: 9,
                                green: 9,
                                black: 9,
                                red: 9,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 1,
                            bonusColor: 'blue',
                        },
                        {
                            id: 'revealed-extra',
                            level: 3,
                            cost: {
                                blue: 9,
                                white: 9,
                                green: 9,
                                black: 9,
                                red: 9,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 4,
                            bonusColor: 'green',
                        },
                        {
                            id: 'top-hidden',
                            level: 3,
                            cost: {
                                blue: 9,
                                white: 9,
                                green: 9,
                                black: 9,
                                red: 9,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 2,
                            bonusColor: 'red',
                        },
                    ],
                },
                board: Array.from({ length: 5 }, (_, r) =>
                    Array.from({ length: 5 }, (_, c) => ({
                        type: r === 1 && c === 1 ? GEM_TYPES.GOLD : GEM_TYPES.EMPTY,
                        uid: `${r}-${c}`,
                    }))
                ),
            })
        );

        expect(action).toEqual({
            type: 'RESERVE_CARD',
            payload: {
                card: expect.objectContaining({ id: 'revealed-extra' }),
                level: 3,
                idx: 0,
                isExtra: true,
                extraIdx: 1,
                goldCoords: { r: 1, c: 1 },
            },
        });
    });

    it('covers reserve without gold, final replenish, and the no-action fallback null path', () => {
        const fullReservedSlots: Card[] = [
            {
                id: 'reserved-slot-1',
                level: 1,
                cost: { blue: 1, white: 1, green: 1, black: 1, red: 1, pearl: 0, gold: 0 },
                points: 0,
                bonusColor: 'blue',
            },
            {
                id: 'reserved-slot-2',
                level: 1,
                cost: { blue: 1, white: 1, green: 1, black: 1, red: 1, pearl: 0, gold: 0 },
                points: 0,
                bonusColor: 'green',
            },
            {
                id: 'reserved-slot-3',
                level: 1,
                cost: { blue: 1, white: 1, green: 1, black: 1, red: 1, pearl: 0, gold: 0 },
                points: 0,
                bonusColor: 'red',
            },
        ];

        const reserveWithoutGold = computeAiAction(
            createMockState({
                bag: [],
                market: {
                    1: [],
                    2: [],
                    3: [
                        {
                            id: 'market-three',
                            level: 3,
                            cost: {
                                blue: 9,
                                white: 9,
                                green: 9,
                                black: 9,
                                red: 9,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 4,
                            bonusColor: 'blue',
                        },
                    ],
                },
                board: Array.from({ length: 5 }, (_, r) =>
                    Array.from({ length: 5 }, (_, c) => ({
                        type: GEM_TYPES.EMPTY,
                        uid: `${r}-${c}-empty`,
                    }))
                ),
            })
        );

        const replenishFallback = computeAiAction(
            createMockState({
                bag: [{ type: GEM_TYPES.GREEN, uid: 'bag-green' }],
                market: { 1: [], 2: [], 3: [] },
                playerReserved: { p1: fullReservedSlots, p2: [] },
                board: Array.from({ length: 5 }, (_, r) =>
                    Array.from({ length: 5 }, (_, c) => ({
                        type: GEM_TYPES.EMPTY,
                        uid: `${r}-${c}-empty`,
                    }))
                ),
            })
        );

        const noAction = computeAiAction(
            createMockState({
                bag: [],
                market: { 1: [], 2: [], 3: [] },
                playerReserved: { p1: fullReservedSlots, p2: [] },
                board: Array.from({ length: 5 }, (_, r) =>
                    Array.from({ length: 5 }, (_, c) => ({
                        type: GEM_TYPES.EMPTY,
                        uid: `${r}-${c}-empty`,
                    }))
                ),
            })
        );

        expect(reserveWithoutGold).toEqual({
            type: 'RESERVE_CARD',
            payload: {
                card: expect.objectContaining({ id: 'market-three' }),
                level: 3,
                idx: 0,
            },
        });
        expect(replenishFallback).toEqual({
            type: 'REPLENISH',
            payload: { randoms: { expansionColor: 'red', extortionColor: 'blue' } },
        });
        expect(noAction).toBeNull();
    });

    it('finds diagonal gem lines while filtering out gold cells and board-edge overflows', () => {
        const action = computeAiAction(
            createMockState({
                turn: 'p2',
                inventories: {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                },
                board: [
                    [
                        GEM_TYPES.RED,
                        GEM_TYPES.GOLD,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.GREEN,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
                    ],
                    [
                        GEM_TYPES.EMPTY,
                        GEM_TYPES.EMPTY,
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
                ].map((row, r) => row.map((type, c) => ({ type, uid: `${r}-${c}-${type.id}` }))),
                bag: [],
                market: { 1: [], 2: [], 3: [] },
                playerReserved: { p1: [], p2: [] },
            })
        );

        expect(action).toEqual({
            type: 'TAKE_GEMS',
            payload: {
                coords: [
                    { r: 0, c: 0 },
                    { r: 1, c: 1 },
                    { r: 2, c: 2 },
                ],
            },
        });
    });
});

describe('Roadmap P3-3 AI and reducer surfaces', () => {
    it('clears a peek modal via CLOSE_MODAL on the shared reducer path', () => {
        const modalState = createMockState({
            activeModal: {
                type: 'PEEK',
                data: {
                    cards: [],
                    initiator: 'p1',
                },
            },
        });
        const next = applyAction(modalState, { type: 'CLOSE_MODAL' });
        expect(next?.activeModal).toBeNull();
    });

    it('returns null for privilege action phase until dedicated privilege heuristics exist', () => {
        const privilegePhase = createMockState({
            phase: 'PRIVILEGE_ACTION',
            turn: 'p1',
            extraPrivileges: { p1: 1, p2: 0 },
        });
        expect(computeAiAction(privilegePhase)).toBeNull();
    });

    it('selects BUY_CARD on a zero-cost high-value market card when inventory can afford it', () => {
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
                            id: 'roadmap-buy-target',
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
                playerReserved: { p1: [], p2: [] },
            })
        );
        expect(action).toEqual({
            type: 'BUY_CARD',
            payload: {
                card: expect.objectContaining({ id: 'roadmap-buy-target' }),
                source: 'market',
                marketInfo: { level: 1, idx: 0 },
                randoms: { bountyHunterColor: 'red' },
            },
        });
    });
});
