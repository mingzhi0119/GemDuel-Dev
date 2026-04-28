import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyAction } from '@gemduel/shared/logic/gameReducer';
import { processGemClick, processOpponentGemClick } from '@gemduel/shared/logic/interactionManager';
import { canActionRunInPhase, getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import { GAME_PHASES, GEM_TYPES } from '@gemduel/shared/constants';
import type {
    Card as CardType,
    GameAction,
    GamePhase,
    GameState,
    GemColor,
} from '@gemduel/shared/types';
import {
    clickElement,
    createMonkeyState,
    EMPTY_COST,
    MONKEY_MARKET_CARD,
    MONKEY_RESERVED_CARD,
    renderGameShellHarness,
    renderStatefulGameShellHarness,
    type RenderedGameShellHarness,
    type ShellHandlerEvent,
} from './helpers/gameShellHarness';

const SEEDS = ['phase-ui-0', 'phase-ui-1', 'phase-ui-2', 'phase-ui-3', 'phase-ui-4'] as const;
const MONKEY_STEPS = 22;

const CLICK_TARGET_SELECTORS = [
    '[data-market-slot] [data-card-preview-click="true"]',
    '[data-market-deck]',
    '[data-reserved-slot] [data-card-preview-click="true"]',
    '[data-tableau-stack]',
    '[data-royal-card]',
    '[data-player-buff-preview-action]',
    '[data-player-zone-gem]',
    '[data-player-zone-privilege]',
    '[data-game-action]',
    '[data-board-cell] button',
] as const;

const NOISE_TARGET_SELECTORS = [
    '[data-market-slot] [data-card-preview-click="true"]',
    '[data-market-deck]',
    '[data-reserved-slot] [data-card-preview-click="true"]',
    '[data-tableau-stack]',
    '[data-royal-card]',
    '[data-player-buff-preview-action]',
] as const;

interface ClickTarget {
    selector: string;
    index: number;
    element: Element;
}

let currentHarness: RenderedGameShellHarness | null = null;

afterEach(() => {
    currentHarness?.cleanup();
    currentHarness = null;
    vi.useRealTimers();
});

const hashSeed = (seed: string): number => {
    let hash = 2166136261;
    for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
};

const createSeededRandom = (seed: string) => {
    let state = hashSeed(seed) || 1;
    return () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 0x100000000;
    };
};

const pickTarget = (targets: ClickTarget[], random: () => number): ClickTarget =>
    targets[Math.floor(random() * targets.length) % targets.length];

const collectTargets = (selectors: readonly string[]): ClickTarget[] => {
    const previewOverlay = document.body.querySelector('[data-card-preview-overlay="true"]');
    const activeSelectors = previewOverlay
        ? (['[data-card-preview-action]', 'button[aria-label="Close card preview"]'] as const)
        : selectors;

    return activeSelectors.flatMap((selector) =>
        Array.from(document.body.querySelectorAll(selector)).map((element, index) => ({
            selector,
            index,
            element,
        }))
    );
};

const closePreviewIfOpen = async () => {
    const closeButton = document.body.querySelector('button[aria-label="Close card preview"]');
    if (closeButton) {
        await clickElement(closeButton);
    }
};

const getRequiredElement = (selector: string, context: string): Element => {
    const element = document.body.querySelector(selector);
    expect(element, `${context}: expected selector ${selector}`).not.toBeNull();
    return element!;
};

const assertNoBlockingPreview = (context: string) => {
    expect(
        document.body.querySelector('[data-card-preview-overlay="true"]'),
        `${context}: card preview overlay must release the next required target`
    ).toBeNull();
};

const clickPreviewElement = async (selector: string, context: string) => {
    await clickElement(getRequiredElement(selector, context));
};

const clickRequiredFollowUpTarget = async (selector: string, context: string) => {
    assertNoBlockingPreview(context);
    await clickElement(getRequiredElement(selector, context));
};

const assertSinglePreviewOverlay = (context: string) => {
    expect(
        document.body.querySelectorAll('[data-card-preview-overlay="true"]').length,
        `${context}: expected at most one card preview overlay`
    ).toBeLessThanOrEqual(1);
};

const assertNoIllegalPreviewActions = (phase: GamePhase, context: string) => {
    const surfacePolicy = getFsmPhaseSurfacePolicy(phase);
    if (surfacePolicy.marketInteraction) {
        return;
    }

    expect(
        document.body.querySelectorAll(
            '[data-card-preview-action="buy"], [data-card-preview-action="reserve"]'
        ).length,
        `${context}: buy/reserve preview actions must stay hidden outside market-interaction phases`
    ).toBe(0);
};

const getActionTypeForHandlerEvent = (
    event: ShellHandlerEvent,
    phase: GamePhase
): GameAction['type'] | 'BOARD_CLICK' | null => {
    switch (event.name) {
        case 'handleSelectBuff':
            return 'SELECT_BUFF';
        case 'handleRerollBuffs':
            return 'REROLL_DRAFT_POOL';
        case 'handleSelectBonusColor':
            return 'BUY_CARD';
        case 'handleCloseModal':
            return 'CLOSE_MODAL';
        case 'handleGemClick':
        case 'handleGemDragSelection':
            return 'BOARD_CLICK';
        case 'handleConfirmTake':
            return 'TAKE_GEMS';
        case 'handleReplenish':
            return 'REPLENISH';
        case 'handleSelectRoyal':
            return 'SELECT_ROYAL_CARD';
        case 'handleCancelReserve':
            return 'CANCEL_RESERVE';
        case 'handleCancelPrivilege':
            return 'CANCEL_PRIVILEGE';
        case 'handlePeekDeck':
            return 'PEEK_DECK';
        case 'handleSelfGemClick':
            return 'DISCARD_GEM';
        case 'handleOpponentGemClick':
            return 'STEAL_GEM';
        case 'handleDiscardReserved':
            return 'DISCARD_RESERVED';
        case 'activatePrivilegeMode':
            return 'ACTIVATE_PRIVILEGE';
        case 'checkAndInitiateBuyReserved':
            return phase === GAME_PHASES.IDLE || event.args[1] === true ? 'BUY_CARD' : null;
        case 'handleReserveCard':
            return 'RESERVE_CARD';
        case 'handleReserveDeck':
            return 'RESERVE_DECK';
        case 'initiateBuy':
            return 'BUY_CARD';
        default:
            return null;
    }
};

const isHandlerEventAllowed = (event: ShellHandlerEvent, phase: GamePhase): boolean => {
    const actionType = getActionTypeForHandlerEvent(event, phase);
    if (!actionType) {
        return true;
    }

    if (actionType === 'BOARD_CLICK') {
        return getFsmPhaseSurfacePolicy(phase).boardInteractionMode !== 'disabled';
    }

    return canActionRunInPhase(actionType, phase);
};

const assertHandlerEventsRespectPhase = (
    events: ShellHandlerEvent[],
    phase: GamePhase,
    context: string
) => {
    const illegalEvents = events
        .filter((event) => !isHandlerEventAllowed(event, phase))
        .map((event) => `${String(event.name)}(${event.args.length})`);

    expect(illegalEvents, `${context}: illegal handler calls`).toEqual([]);
};

const runSeededClicks = async ({
    harness,
    phase,
    seed,
    steps,
    selectors = CLICK_TARGET_SELECTORS,
}: {
    harness: RenderedGameShellHarness;
    phase: GamePhase;
    seed: string;
    steps: number;
    selectors?: readonly string[];
}) => {
    const random = createSeededRandom(seed);

    for (let step = 0; step < steps; step += 1) {
        const targets = collectTargets(selectors);
        expect(
            targets.length,
            `${phase}/${seed}/step-${step}: no clickable targets`
        ).toBeGreaterThan(0);

        const target = pickTarget(targets, random);
        const context = `${phase}/${seed}/step-${step}/${target.selector}#${target.index}`;
        await clickElement(target.element);

        assertSinglePreviewOverlay(context);
        assertNoIllegalPreviewActions(phase, context);
        assertHandlerEventsRespectPhase(harness.calledActionLikeEvents, phase, context);
    }
};

const buildPhaseState = (phase: GamePhase): Partial<GameState> => {
    if (phase === GAME_PHASES.BONUS_ACTION) {
        return {
            phase,
            bonusGemTarget: GEM_TYPES.GREEN,
        };
    }

    if (phase === GAME_PHASES.STEAL_ACTION) {
        return {
            phase,
            inventories: {
                p1: { ...EMPTY_COST, green: 1 },
                p2: { ...EMPTY_COST, green: 2, red: 1, blue: 1 },
            },
        };
    }

    if (phase === GAME_PHASES.PRIVILEGE_ACTION) {
        return {
            phase,
            privileges: { p1: 1, p2: 1 },
            privilegeGemCount: 0,
        };
    }

    if (phase === GAME_PHASES.DISCARD_EXCESS_GEMS) {
        return {
            phase,
            inventories: {
                p1: { ...EMPTY_COST, red: 11 },
                p2: EMPTY_COST,
            },
        };
    }

    if (phase === GAME_PHASES.RESERVE_WAITING_GEM) {
        return {
            phase,
            pendingReserve: {
                card: MONKEY_MARKET_CARD,
                level: 2,
                idx: 0,
            },
        };
    }

    if (phase === GAME_PHASES.SELECT_CARD_COLOR) {
        return {
            phase,
            pendingBuy: {
                card: { ...MONKEY_MARKET_CARD, bonusColor: 'gold' },
                source: 'market',
                marketInfo: { level: 2, idx: 0 },
            },
        };
    }

    return { phase };
};

describe('phase-aware UI monkey interactions', () => {
    const resolutionPhases = [
        GAME_PHASES.BONUS_ACTION,
        GAME_PHASES.STEAL_ACTION,
        GAME_PHASES.PRIVILEGE_ACTION,
        GAME_PHASES.DISCARD_EXCESS_GEMS,
        GAME_PHASES.RESERVE_WAITING_GEM,
        GAME_PHASES.SELECT_CARD_COLOR,
    ] as const;

    it.each(
        resolutionPhases.flatMap((phase) =>
            SEEDS.map((seed) => ({
                phase,
                seed,
            }))
        )
    )('keeps illegal actions inert during $phase with $seed', async ({ phase, seed }) => {
        currentHarness = await renderGameShellHarness(buildPhaseState(phase));

        await runSeededClicks({
            harness: currentHarness,
            phase,
            seed,
            steps: MONKEY_STEPS,
        });
    });

    it.each(SEEDS)(
        'keeps IDLE preview actionability routed through overlay buttons with %s',
        async (seed) => {
            currentHarness = await renderGameShellHarness();

            const marketCard = document.body.querySelector(
                '[data-market-slot="2-0"] [data-card-preview-click="true"]'
            );
            await clickElement(marketCard);

            expect(currentHarness.handlers.initiateBuy).not.toHaveBeenCalled();
            expect(currentHarness.handlers.handleReserveCard).not.toHaveBeenCalled();
            expect(
                document.body.querySelector('[data-card-preview-overlay="true"]')
            ).not.toBeNull();

            await clickElement(document.body.querySelector('[data-card-preview-action="buy"]'));
            expect(currentHarness.handlers.initiateBuy).toHaveBeenCalledWith(
                MONKEY_MARKET_CARD,
                'market',
                { level: 2, idx: 0 }
            );

            await clickElement(marketCard);
            await clickElement(document.body.querySelector('[data-card-preview-action="reserve"]'));
            expect(currentHarness.handlers.handleReserveCard).toHaveBeenCalledWith(
                MONKEY_MARKET_CARD,
                { level: 2, idx: 0 }
            );

            await runSeededClicks({
                harness: currentHarness,
                phase: GAME_PHASES.IDLE,
                seed,
                steps: MONKEY_STEPS,
            });
        }
    );
});

interface SmokeScenario {
    name: string;
    phase: GamePhase;
    targetSelector: string;
    expectedActionType: GameAction['type'];
    overrides: Partial<GameState>;
    createHandlers: (
        currentState: () => GameState,
        applyTransition: (action: GameAction) => void
    ) => Partial<RenderedGameShellHarness['handlers']>;
}

describe('phase-aware ability completion smoke monkey', () => {
    const smokeScenarios: SmokeScenario[] = [
        {
            name: 'bonus gem target',
            phase: GAME_PHASES.BONUS_ACTION,
            targetSelector: '[data-board-cell="0-0"] button',
            expectedActionType: 'TAKE_BONUS_GEM',
            overrides: {
                phase: GAME_PHASES.BONUS_ACTION,
                bonusGemTarget: GEM_TYPES.GREEN,
                inventories: {
                    p1: { ...EMPTY_COST, green: 1 },
                    p2: EMPTY_COST,
                },
            },
            createHandlers: (currentState, applyTransition) => ({
                handleGemClick: (row: number, col: number) => {
                    const result = processGemClick(currentState(), row, col);
                    if (result.action) {
                        applyTransition(result.action);
                    }
                },
            }),
        },
        {
            name: 'steal target',
            phase: GAME_PHASES.STEAL_ACTION,
            targetSelector: '[data-player-zone-gem="p2-green"]',
            expectedActionType: 'STEAL_GEM',
            overrides: {
                phase: GAME_PHASES.STEAL_ACTION,
                inventories: {
                    p1: { ...EMPTY_COST, red: 1 },
                    p2: { ...EMPTY_COST, green: 2 },
                },
            },
            createHandlers: (currentState, applyTransition) => ({
                handleOpponentGemClick: (color: string) => {
                    const result = processOpponentGemClick(currentState(), color as GemColor);
                    if (result.action) {
                        applyTransition(result.action);
                    }
                },
            }),
        },
        {
            name: 'privilege target',
            phase: GAME_PHASES.PRIVILEGE_ACTION,
            targetSelector: '[data-board-cell="0-0"] button',
            expectedActionType: 'USE_PRIVILEGE',
            overrides: {
                phase: GAME_PHASES.PRIVILEGE_ACTION,
                privileges: { p1: 1, p2: 0 },
            },
            createHandlers: (currentState, applyTransition) => ({
                handleGemClick: (row: number, col: number) => {
                    const result = processGemClick(currentState(), row, col);
                    if (result.action) {
                        applyTransition(result.action);
                    }
                },
            }),
        },
        {
            name: 'discard excess gem',
            phase: GAME_PHASES.DISCARD_EXCESS_GEMS,
            targetSelector: '[data-player-zone-gem="p1-red"]',
            expectedActionType: 'DISCARD_GEM',
            overrides: {
                phase: GAME_PHASES.DISCARD_EXCESS_GEMS,
                inventories: {
                    p1: { ...EMPTY_COST, red: 11 },
                    p2: EMPTY_COST,
                },
            },
            createHandlers: (_currentState, applyTransition) => ({
                handleSelfGemClick: (color: string) => {
                    applyTransition({ type: 'DISCARD_GEM', payload: color });
                },
            }),
        },
        {
            name: 'reserve waiting gold target',
            phase: GAME_PHASES.RESERVE_WAITING_GEM,
            targetSelector: '[data-board-cell="0-3"] button',
            expectedActionType: 'RESERVE_CARD',
            overrides: {
                phase: GAME_PHASES.RESERVE_WAITING_GEM,
                inventories: {
                    p1: { ...EMPTY_COST, green: 1 },
                    p2: EMPTY_COST,
                },
                pendingReserve: {
                    card: MONKEY_MARKET_CARD,
                    level: 2,
                    idx: 0,
                },
            },
            createHandlers: (currentState, applyTransition) => ({
                handleGemClick: (row: number, col: number) => {
                    const result = processGemClick(currentState(), row, col);
                    if (result.action) {
                        applyTransition(result.action);
                    }
                },
            }),
        },
    ];

    it.each(smokeScenarios)(
        'lets $name complete after unrelated preview clicks',
        async (scenario) => {
            let state: GameState = createMonkeyState(scenario.overrides) as GameState;
            const transitions: Array<{ actionType: GameAction['type']; phase: GamePhase }> = [];
            const applyTransition = (action: GameAction) => {
                const nextState = applyAction(state, action);
                if (nextState && nextState !== state) {
                    state = nextState;
                    transitions.push({ actionType: action.type, phase: state.phase });
                }
            };

            currentHarness = await renderGameShellHarness(
                scenario.overrides,
                {},
                scenario.createHandlers(() => state, applyTransition)
            );

            await runSeededClicks({
                harness: currentHarness,
                phase: scenario.phase,
                seed: `smoke-${scenario.name}`,
                steps: 8,
                selectors: NOISE_TARGET_SELECTORS,
            });
            await closePreviewIfOpen();
            expect(
                transitions,
                `${scenario.name}: noise clicks must not resolve the phase`
            ).toEqual([]);

            await clickElement(document.body.querySelector(scenario.targetSelector));

            expect(transitions.at(-1), `${scenario.name}: legal target should resolve`).toEqual({
                actionType: scenario.expectedActionType,
                phase: GAME_PHASES.IDLE,
            });
        }
    );
});

const createFollowUpCard = (overrides: Partial<CardType> & { id: string }): CardType => ({
    ...MONKEY_MARKET_CARD,
    cost: { ...EMPTY_COST },
    points: 0,
    crowns: 0,
    ability: 'none',
    bonusColor: 'red',
    bonusCount: 1,
    ...overrides,
});

const affordableInventories = {
    p1: { ...EMPTY_COST, black: 5, green: 5, red: 2, blue: 2 },
    p2: { ...EMPTY_COST, green: 2, red: 1, blue: 1 },
};

const expectLatestTransition = (
    harness: Awaited<ReturnType<typeof renderStatefulGameShellHarness>>,
    actionType: GameAction['type'],
    context: string
) => {
    expect(harness.transitions.at(-1)?.actionType, `${context}: latest action`).toBe(actionType);
};

describe('preview follow-up phase regression monkey', () => {
    it('releases the board after market card preview reserve waits for gold', async () => {
        currentHarness = await renderStatefulGameShellHarness({
            inventories: affordableInventories,
        });
        const harness = currentHarness as Awaited<
            ReturnType<typeof renderStatefulGameShellHarness>
        >;

        await clickPreviewElement(
            '[data-market-slot="2-0"] [data-card-preview-click="true"]',
            'open market preview'
        );
        await clickPreviewElement('[data-card-preview-action="reserve"]', 'reserve from preview');

        expectLatestTransition(harness, 'INITIATE_RESERVE', 'market reserve preview');
        expect(harness.getState().phase).toBe(GAME_PHASES.RESERVE_WAITING_GEM);

        await clickRequiredFollowUpTarget(
            '[data-board-cell="0-3"] button',
            'market reserve gold follow-up'
        );

        expectLatestTransition(harness, 'RESERVE_CARD', 'market reserve gold follow-up');
    });

    it('releases the board after deck preview reserve waits for gold', async () => {
        currentHarness = await renderStatefulGameShellHarness({
            inventories: affordableInventories,
        });
        const harness = currentHarness as Awaited<
            ReturnType<typeof renderStatefulGameShellHarness>
        >;

        await clickPreviewElement('[data-market-deck="1"]', 'open deck preview');
        await clickPreviewElement(
            '[data-card-preview-action="reserve"]',
            'reserve deck from preview'
        );

        expectLatestTransition(harness, 'INITIATE_RESERVE_DECK', 'deck reserve preview');
        expect(harness.getState().phase).toBe(GAME_PHASES.RESERVE_WAITING_GEM);

        await clickRequiredFollowUpTarget(
            '[data-board-cell="0-3"] button',
            'deck reserve gold follow-up'
        );

        expectLatestTransition(harness, 'RESERVE_DECK', 'deck reserve gold follow-up');
    });

    it('releases bonus color selection after market wild preview buy', async () => {
        const wildCard = createFollowUpCard({
            id: 'phase-follow-up-market-wild',
            cost: { ...EMPTY_COST, black: 1 },
            bonusColor: 'gold',
        });
        currentHarness = await renderStatefulGameShellHarness({
            inventories: affordableInventories,
            market: { 1: [], 2: [wildCard], 3: [] },
        });
        const harness = currentHarness as Awaited<
            ReturnType<typeof renderStatefulGameShellHarness>
        >;

        await clickPreviewElement(
            '[data-market-slot="2-0"] [data-card-preview-click="true"]',
            'open market wild preview'
        );
        await clickPreviewElement('[data-card-preview-action="buy"]', 'buy market wild preview');

        expectLatestTransition(harness, 'INITIATE_BUY_JOKER', 'market wild preview buy');
        expect(harness.getState().phase).toBe(GAME_PHASES.SELECT_CARD_COLOR);

        await clickRequiredFollowUpTarget(
            '[data-bonus-color="red"]',
            'market wild color follow-up'
        );

        expectLatestTransition(harness, 'BUY_CARD', 'market wild color follow-up');
    });

    it('releases bonus color selection after reserved wild preview buy', async () => {
        const reservedWildCard = createFollowUpCard({
            id: 'phase-follow-up-reserved-wild',
            cost: { ...EMPTY_COST, black: 1 },
            bonusColor: 'gold',
        });
        currentHarness = await renderStatefulGameShellHarness({
            inventories: affordableInventories,
            playerReserved: {
                p1: [reservedWildCard],
                p2: [MONKEY_RESERVED_CARD],
            },
        });
        const harness = currentHarness as Awaited<
            ReturnType<typeof renderStatefulGameShellHarness>
        >;

        await clickPreviewElement(
            '[data-reserved-slot="p1-0"] [data-card-preview-click="true"]',
            'open reserved wild preview'
        );
        await clickPreviewElement(
            `[data-card-preview-action-card="${reservedWildCard.id}"][data-card-preview-action="buy"]`,
            'buy reserved wild preview'
        );

        expectLatestTransition(harness, 'INITIATE_BUY_JOKER', 'reserved wild preview buy');
        expect(harness.getState().phase).toBe(GAME_PHASES.SELECT_CARD_COLOR);

        await clickRequiredFollowUpTarget(
            '[data-bonus-color="red"]',
            'reserved wild color follow-up'
        );

        expectLatestTransition(harness, 'BUY_CARD', 'reserved wild color follow-up');
    });

    it.each([
        {
            name: 'bonus gem target',
            card: createFollowUpCard({
                id: 'phase-follow-up-bonus',
                ability: 'bonus_gem',
                bonusColor: 'green',
            }),
            expectedPhase: GAME_PHASES.BONUS_ACTION,
            targetSelector: '[data-board-cell="0-0"] button',
            expectedActionType: 'TAKE_BONUS_GEM' as const,
            overrides: {},
        },
        {
            name: 'steal target',
            card: createFollowUpCard({
                id: 'phase-follow-up-steal',
                ability: 'steal',
                bonusColor: 'blue',
            }),
            expectedPhase: GAME_PHASES.STEAL_ACTION,
            targetSelector: '[data-player-zone-gem="p2-green"]',
            expectedActionType: 'STEAL_GEM' as const,
            overrides: {
                inventories: {
                    p1: { ...EMPTY_COST, black: 5, green: 5 },
                    p2: { ...EMPTY_COST, green: 2 },
                },
            },
        },
        {
            name: 'discard excess gem',
            card: createFollowUpCard({
                id: 'phase-follow-up-discard',
                bonusColor: 'red',
            }),
            expectedPhase: GAME_PHASES.DISCARD_EXCESS_GEMS,
            targetSelector: '[data-player-zone-gem="p1-red"]',
            expectedActionType: 'DISCARD_GEM' as const,
            overrides: {
                inventories: {
                    p1: { ...EMPTY_COST, red: 11 },
                    p2: EMPTY_COST,
                },
            },
        },
    ])(
        'releases $name after a market preview buy enters the follow-up phase',
        async ({ card, expectedPhase, targetSelector, expectedActionType, overrides }) => {
            currentHarness = await renderStatefulGameShellHarness({
                inventories: affordableInventories,
                market: { 1: [], 2: [card], 3: [] },
                ...overrides,
            });
            const harness = currentHarness as Awaited<
                ReturnType<typeof renderStatefulGameShellHarness>
            >;

            await clickPreviewElement(
                '[data-market-slot="2-0"] [data-card-preview-click="true"]',
                `open ${card.id} preview`
            );
            await clickPreviewElement('[data-card-preview-action="buy"]', `buy ${card.id}`);

            expectLatestTransition(harness, 'BUY_CARD', `${card.id} preview buy`);
            expect(harness.getState().phase).toBe(expectedPhase);

            await clickRequiredFollowUpTarget(targetSelector, `${card.id} follow-up target`);

            expectLatestTransition(harness, expectedActionType, `${card.id} follow-up target`);
        }
    );

    it('releases royal selection after a market preview buy enters the follow-up phase', async () => {
        vi.useFakeTimers();
        const card = createFollowUpCard({
            id: 'phase-follow-up-royal',
            bonusColor: 'red',
            crowns: 3,
        });

        currentHarness = await renderStatefulGameShellHarness({
            inventories: affordableInventories,
            market: { 1: [], 2: [card], 3: [] },
        });
        const harness = currentHarness as Awaited<
            ReturnType<typeof renderStatefulGameShellHarness>
        >;

        await clickPreviewElement(
            '[data-market-slot="2-0"] [data-card-preview-click="true"]',
            `open ${card.id} preview`
        );
        await clickPreviewElement('[data-card-preview-action="buy"]', `buy ${card.id}`);

        expectLatestTransition(harness, 'BUY_CARD', `${card.id} preview buy`);
        expect(harness.getState().phase).toBe(GAME_PHASES.SELECT_ROYAL);
        assertNoBlockingPreview(`${card.id} royal intro`);
        expect(
            document.body.querySelector('[data-royal-unlock-intro]'),
            `${card.id}: expected royal unlock intro after preview buy`
        ).not.toBeNull();

        act(() => {
            vi.advanceTimersByTime(1250);
        });

        await clickRequiredFollowUpTarget(
            '[data-royal-selection-card]',
            `${card.id} royal selection overlay`
        );

        expectLatestTransition(harness, 'SELECT_ROYAL_CARD', `${card.id} royal selection overlay`);
    });
});
