import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { vi } from 'vitest';
import { BUFFS, GEM_TYPES, ROYAL_CARDS } from '@gemduel/shared/constants';
import { applyAction } from '@gemduel/shared/logic/gameReducer';
import { getRandomBasicGemColor } from '@gemduel/shared/logic/gameSetup';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import {
    buildBuyAction,
    buildReserveCardFlow,
    buildReserveDeckFlow,
    buildReplenishAction,
    buildSelectBonusColorAction,
    buildSelectRoyalAction,
} from '@gemduel/shared/logic/interactionCommands';
import { processGemClick, processOpponentGemClick } from '@gemduel/shared/logic/interactionManager';
import { getCrownCount, getPlayerScore } from '@gemduel/shared/logic/selectors';
import { calculateTransaction } from '@gemduel/shared/utils';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import type {
    BoardCell,
    Buff,
    CardInteractionContext,
    Card as CardType,
    DeckState,
    GameAction,
    GamePhase,
    GameState,
    GemColor,
    GemInventory,
    MarketState,
    PlayerKey,
    RoyalCard,
} from '@gemduel/shared/types';
import type { AppRouteProps, ResponsiveLayout } from '@app/types/ui';
import { GameShell } from '../../app/shell/GameShell';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

export const EMPTY_COST: GemInventory = {
    blue: 0,
    white: 0,
    green: 0,
    black: 0,
    red: 0,
    pearl: 0,
    gold: 0,
};

export const MONKEY_MARKET_CARD: CardType = {
    id: 'phase-monkey-market-card',
    level: 2,
    cost: {
        ...EMPTY_COST,
        black: 2,
        green: 1,
    },
    points: 2,
    ability: 'bonus_gem',
    bonusColor: 'green',
    crowns: 0,
    bonusCount: 1,
};

export const MONKEY_RESERVED_CARD: CardType = {
    ...MONKEY_MARKET_CARD,
    id: 'phase-monkey-reserved-card',
    ability: 'steal',
    bonusColor: 'blue',
};

export const MONKEY_TABLEAU_CARD: CardType = {
    ...MONKEY_MARKET_CARD,
    id: 'phase-monkey-tableau-card',
    ability: 'none',
    cost: EMPTY_COST,
};

export const MONKEY_PURE_CARD: CardType = {
    ...MONKEY_MARKET_CARD,
    id: 'phase-monkey-pure-card',
    ability: 'none',
    cost: EMPTY_COST,
    bonusColor: 'null',
    bonusCount: 0,
    points: 3,
};

const MONKEY_L1_CARD: CardType = {
    ...MONKEY_MARKET_CARD,
    id: 'phase-monkey-l1-card',
    level: 1,
    cost: EMPTY_COST,
    points: 0,
    ability: 'none',
    bonusColor: 'red',
};

const MONKEY_L3_CARD: CardType = {
    ...MONKEY_MARKET_CARD,
    id: 'phase-monkey-l3-card',
    level: 3,
    cost: EMPTY_COST,
    points: 4,
    ability: 'scroll',
    bonusColor: 'white',
};

export type ShellHandlerName = keyof AppRouteProps['game']['handlers'];

export interface ShellHandlerEvent {
    name: ShellHandlerName;
    args: unknown[];
}

export interface RenderedGameShellHarness {
    props: AppRouteProps;
    game: AppRouteProps['game'];
    handlers: AppRouteProps['game']['handlers'];
    container: HTMLDivElement;
    calledActionLikeEvents: ShellHandlerEvent[];
    cleanup: () => void;
}

export interface StatefulHarnessTransition {
    action: GameAction;
    actionType: GameAction['type'];
    previousPhase: GamePhase;
    phase: GamePhase;
}

export interface RenderedStatefulGameShellHarness extends RenderedGameShellHarness {
    transitions: StatefulHarnessTransition[];
    getState: () => AppRouteProps['game']['state'];
    applyTransition: (action: GameAction) => boolean;
}

export const shellLayout: ResponsiveLayout = {
    layoutMode: 'desktop-4k',
    viewportWidth: 1920,
    viewportHeight: 1080,
    aspectRatio: 16 / 9,
    stageCanvasWidthPx: 3840,
    stageCanvasHeightPx: 2160,
    stageScale: 0.5,
    stageInsetXPx: 0,
    stageInsetYPx: 0,
    boardScale: 1,
    deckScale: 1,
    zoneScale: 1,
    zoneHeightPx: 520,
    mainGapPx: 24,
};

const cloneInitialState = () => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

export const buildMonkeyBoard = (): BoardCell[][] => {
    const cells = [
        GEM_TYPES.GREEN,
        GEM_TYPES.RED,
        GEM_TYPES.BLUE,
        GEM_TYPES.GOLD,
        GEM_TYPES.WHITE,
        GEM_TYPES.BLACK,
        GEM_TYPES.PEARL,
    ];

    return Array.from({ length: 5 }, (_, rowIndex) =>
        Array.from({ length: 5 }, (_, colIndex) => ({
            uid: `phase-monkey-cell-${rowIndex}-${colIndex}`,
            type: cells[(rowIndex * 5 + colIndex) % cells.length] ?? GEM_TYPES.EMPTY,
        }))
    );
};

export const buildMonkeyMarket = (): MarketState => ({
    1: [MONKEY_L1_CARD],
    2: [MONKEY_MARKET_CARD],
    3: [MONKEY_L3_CARD],
});

export const buildMonkeyDecks = (): DeckState => ({
    1: [{ ...MONKEY_L1_CARD, id: 'phase-monkey-l1-deck-card' }],
    2: [{ ...MONKEY_MARKET_CARD, id: 'phase-monkey-l2-deck-card' }],
    3: [{ ...MONKEY_L3_CARD, id: 'phase-monkey-l3-deck-card' }],
});

export const createMonkeyState = (
    overrides: Partial<AppRouteProps['game']['state']> = {}
): AppRouteProps['game']['state'] => {
    const base = cloneInitialState() as AppRouteProps['game']['state'];

    return {
        ...base,
        board: buildMonkeyBoard(),
        bag: [{ uid: 'phase-monkey-bag-red', type: GEM_TYPES.RED }],
        phase: 'IDLE',
        turn: 'p1',
        mode: 'LOCAL_PVP',
        localPlayer: 'p1',
        selectedGems: [],
        reserveGoldSelection: null,
        errorMsg: null,
        market: buildMonkeyMarket(),
        decks: buildMonkeyDecks(),
        inventories: {
            p1: {
                ...EMPTY_COST,
                black: 3,
                green: 3,
                red: 2,
                blue: 1,
                gold: 1,
            },
            p2: {
                ...EMPTY_COST,
                green: 2,
                red: 1,
                blue: 1,
                black: 1,
            },
        },
        privileges: { p1: 1, p2: 1 },
        playerTableau: {
            p1: [MONKEY_TABLEAU_CARD, MONKEY_PURE_CARD],
            p2: [],
        },
        playerReserved: {
            p1: [MONKEY_RESERVED_CARD],
            p2: [{ ...MONKEY_RESERVED_CARD, id: 'phase-monkey-p2-reserved-card' }],
        },
        playerBuffs: {
            p1: BUFFS.INSIGHT as unknown as Buff,
            p2: BUFFS.NONE as unknown as Buff,
        },
        royalDeck: ROYAL_CARDS.slice(0, 4),
        ...overrides,
    };
};

const recordHandler = (
    name: ShellHandlerName,
    calledActionLikeEvents: ShellHandlerEvent[],
    implementation?: (...args: unknown[]) => unknown
) =>
    vi.fn((...args: unknown[]) => {
        calledActionLikeEvents.push({ name, args });
        return implementation?.(...args);
    });

export const createGameShellHarness = (
    stateOverrides: Partial<AppRouteProps['game']['state']> = {},
    getterOverrides: Partial<AppRouteProps['game']['getters']> = {},
    handlerOverrides: Partial<AppRouteProps['game']['handlers']> = {}
) => {
    const calledActionLikeEvents: ShellHandlerEvent[] = [];
    const state = createMonkeyState(stateOverrides);
    const handlers = {
        importHistory: recordHandler('importHistory', calledActionLikeEvents),
        startGame: recordHandler('startGame', calledActionLikeEvents),
        handleSelectBuff: recordHandler('handleSelectBuff', calledActionLikeEvents),
        handleRerollBuffs: recordHandler('handleRerollBuffs', calledActionLikeEvents),
        handleDebugAddCrowns: recordHandler('handleDebugAddCrowns', calledActionLikeEvents),
        handleDebugAddPoints: recordHandler('handleDebugAddPoints', calledActionLikeEvents),
        handleDebugAddPrivilege: recordHandler('handleDebugAddPrivilege', calledActionLikeEvents),
        handleForceRoyal: recordHandler('handleForceRoyal', calledActionLikeEvents),
        handleSelectBonusColor: recordHandler('handleSelectBonusColor', calledActionLikeEvents),
        handleCloseModal: recordHandler('handleCloseModal', calledActionLikeEvents),
        handleGemClick: recordHandler('handleGemClick', calledActionLikeEvents),
        handleGemDragSelection: recordHandler('handleGemDragSelection', calledActionLikeEvents),
        handleConfirmTake: recordHandler('handleConfirmTake', calledActionLikeEvents),
        handleReplenish: recordHandler('handleReplenish', calledActionLikeEvents),
        handleSelectRoyal: recordHandler('handleSelectRoyal', calledActionLikeEvents),
        handleCancelReserve: recordHandler('handleCancelReserve', calledActionLikeEvents),
        handleCancelPrivilege: recordHandler('handleCancelPrivilege', calledActionLikeEvents),
        handlePeekDeck: recordHandler('handlePeekDeck', calledActionLikeEvents),
        handleSelfGemClick: recordHandler('handleSelfGemClick', calledActionLikeEvents),
        handleOpponentGemClick: recordHandler('handleOpponentGemClick', calledActionLikeEvents),
        handleDiscardReserved: recordHandler('handleDiscardReserved', calledActionLikeEvents),
        activatePrivilegeMode: recordHandler('activatePrivilegeMode', calledActionLikeEvents),
        checkAndInitiateBuyReserved: recordHandler(
            'checkAndInitiateBuyReserved',
            calledActionLikeEvents,
            () => true
        ),
        clearPreselectedReserveGold: recordHandler(
            'clearPreselectedReserveGold',
            calledActionLikeEvents
        ),
        handleReserveCard: recordHandler('handleReserveCard', calledActionLikeEvents, () => true),
        handleReserveDeck: recordHandler('handleReserveDeck', calledActionLikeEvents, () => true),
        initiateBuy: recordHandler('initiateBuy', calledActionLikeEvents, () => true),
        ...handlerOverrides,
    } as unknown as AppRouteProps['game']['handlers'];
    const game = {
        state,
        handlers,
        getters: {
            getPlayerScore: vi.fn(() => 0),
            isSelected: vi.fn(() => false),
            getCrownCount: vi.fn(() => 0),
            canAfford: vi.fn(() => true),
            isMyTurn: true,
            ...getterOverrides,
        },
        historyControls: {
            undo: vi.fn(),
            redo: vi.fn(),
            canUndo: false,
            canRedo: false,
            jumpToStep: vi.fn(),
            importHistory: vi.fn(),
            clearAndInit: vi.fn(),
            currentIndex: 0,
            historyLength: 0,
            history: [],
            historySource: 'live',
        },
        online: {
            peerId: '',
            remotePeerId: '',
            connectionStatus: 'disconnected',
            isHost: true,
            connectToPeer: vi.fn(),
            sendBootstrap: vi.fn(),
            sendGuestIntent: vi.fn(),
            sendHostDecision: vi.fn(),
            sendState: vi.fn(),
            requestRecovery: vi.fn(),
            latency: 0,
            isUnstable: false,
            approvalLog: [],
            statusNotice: null,
            authoritativeReplayRecorder: null,
        },
        replay: {
            currentReplay: null,
        },
    } satisfies AppRouteProps['game'];

    return {
        calledActionLikeEvents,
        game,
        handlers,
        props: {
            appVersion: 'phase-monkey-test',
            game,
            lan: {} as AppRouteProps['lan'],
            layout: shellLayout,
            theme: 'dark',
            ui: {
                showDebug: false,
                isReviewing: false,
                showRulebook: false,
                matchmakingRoute: 'none',
                isPeekingBoard: false,
                persistentWinner: null,
                showRestartConfirm: false,
                soundEnabled: true,
            },
            setters: {
                setShowDebug: vi.fn(),
                setIsReviewing: vi.fn(),
                setShowRulebook: vi.fn(),
                setMatchmakingRoute: vi.fn(),
                setIsPeekingBoard: vi.fn(),
                setShowRestartConfirm: vi.fn(),
                setSoundEnabled: vi.fn(),
            },
            callbacks: {
                handleRestart: vi.fn(),
                handleDownloadReplay: vi.fn(),
                handleUploadReplay: vi.fn(),
            },
        } satisfies AppRouteProps,
    };
};

export const renderGameShellHarness = async (
    stateOverrides: Partial<AppRouteProps['game']['state']> = {},
    getterOverrides: Partial<AppRouteProps['game']['getters']> = {},
    handlerOverrides: Partial<AppRouteProps['game']['handlers']> = {}
): Promise<RenderedGameShellHarness> => {
    const harness = createGameShellHarness(stateOverrides, getterOverrides, handlerOverrides);
    const container = document.createElement('div');
    let root: Root | null = null;
    document.body.appendChild(container);

    await act(async () => {
        root = createRoot(container);
        root.render(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <GameShell {...harness.props} />
            </LocaleProvider>
        );
        await Promise.resolve();
    });

    return {
        ...harness,
        container,
        cleanup: () => {
            act(() => {
                root?.unmount();
            });
            container.remove();
            document.body.replaceChildren();
        },
    };
};

export const clickElement = async (element: Element | null | undefined) => {
    await act(async () => {
        element?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await Promise.resolve();
    });
};

const hasBoardGold = (state: GameState): boolean =>
    state.board.some((row) => row.some((cell) => cell.type.id === 'gold'));

const buildStatefulHandlers = ({
    calledActionLikeEvents,
    getState,
    applyTransition,
    handlerOverrides,
}: {
    calledActionLikeEvents: ShellHandlerEvent[];
    getState: () => AppRouteProps['game']['state'];
    applyTransition: (action: GameAction) => boolean;
    handlerOverrides: Partial<AppRouteProps['game']['handlers']>;
}): AppRouteProps['game']['handlers'] =>
    ({
        importHistory: recordHandler('importHistory', calledActionLikeEvents),
        startGame: recordHandler('startGame', calledActionLikeEvents),
        handleSelectBuff: recordHandler('handleSelectBuff', calledActionLikeEvents),
        handleRerollBuffs: recordHandler('handleRerollBuffs', calledActionLikeEvents),
        handleDebugAddCrowns: recordHandler('handleDebugAddCrowns', calledActionLikeEvents),
        handleDebugAddPoints: recordHandler('handleDebugAddPoints', calledActionLikeEvents),
        handleDebugAddPrivilege: recordHandler('handleDebugAddPrivilege', calledActionLikeEvents),
        handleForceRoyal: recordHandler('handleForceRoyal', calledActionLikeEvents, () =>
            applyTransition({ type: 'FORCE_ROYAL_SELECTION' })
        ),
        handleSelectBonusColor: recordHandler(
            'handleSelectBonusColor',
            calledActionLikeEvents,
            (color: unknown) => {
                const state = getState();
                if (!state.pendingBuy) {
                    return false;
                }

                return applyTransition(
                    buildSelectBonusColorAction(
                        state.pendingBuy,
                        color as GemColor,
                        getRandomBasicGemColor()
                    )
                );
            }
        ),
        handleCloseModal: recordHandler('handleCloseModal', calledActionLikeEvents, () =>
            applyTransition({ type: 'CLOSE_MODAL' })
        ),
        handleGemClick: recordHandler(
            'handleGemClick',
            calledActionLikeEvents,
            (row: unknown, col: unknown) => {
                const result = processGemClick(getState(), row as number, col as number);
                return result.action ? applyTransition(result.action) : false;
            }
        ),
        handleGemDragSelection: recordHandler(
            'handleGemDragSelection',
            calledActionLikeEvents,
            (coords: unknown) =>
                Array.isArray(coords) && coords.length > 0
                    ? applyTransition({ type: 'TAKE_GEMS', payload: { coords } } as GameAction)
                    : false
        ),
        handleConfirmTake: recordHandler('handleConfirmTake', calledActionLikeEvents, () => {
            const selectedGems = getState().selectedGems ?? [];
            return selectedGems.length > 0
                ? applyTransition({ type: 'TAKE_GEMS', payload: { coords: selectedGems } })
                : false;
        }),
        handleReplenish: recordHandler('handleReplenish', calledActionLikeEvents, () =>
            applyTransition(buildReplenishAction(getRandomBasicGemColor()))
        ),
        handleSelectRoyal: recordHandler(
            'handleSelectRoyal',
            calledActionLikeEvents,
            (royal: unknown) => applyTransition(buildSelectRoyalAction(royal as RoyalCard))
        ),
        handleCancelReserve: recordHandler('handleCancelReserve', calledActionLikeEvents, () =>
            applyTransition({ type: 'CANCEL_RESERVE' })
        ),
        handleCancelPrivilege: recordHandler('handleCancelPrivilege', calledActionLikeEvents, () =>
            applyTransition({ type: 'CANCEL_PRIVILEGE' })
        ),
        handlePeekDeck: recordHandler('handlePeekDeck', calledActionLikeEvents, () =>
            applyTransition({ type: 'PEEK_DECK', payload: { levels: [3, 2, 1] } })
        ),
        handleSelfGemClick: recordHandler(
            'handleSelfGemClick',
            calledActionLikeEvents,
            (color: unknown) => applyTransition({ type: 'DISCARD_GEM', payload: color as string })
        ),
        handleOpponentGemClick: recordHandler(
            'handleOpponentGemClick',
            calledActionLikeEvents,
            (color: unknown) => {
                const result = processOpponentGemClick(getState(), color as GemColor);
                return result.action ? applyTransition(result.action) : false;
            }
        ),
        handleDiscardReserved: recordHandler(
            'handleDiscardReserved',
            calledActionLikeEvents,
            (cardId: unknown) =>
                applyTransition({ type: 'DISCARD_RESERVED', payload: { cardId: cardId as string } })
        ),
        activatePrivilegeMode: recordHandler('activatePrivilegeMode', calledActionLikeEvents, () =>
            applyTransition({ type: 'ACTIVATE_PRIVILEGE' })
        ),
        checkAndInitiateBuyReserved: recordHandler(
            'checkAndInitiateBuyReserved',
            calledActionLikeEvents,
            (card: unknown, execute: unknown) => {
                const state = getState();
                const reservedCard = card as CardType;
                const { affordable } = calculateTransaction(
                    reservedCard,
                    state.inventories[state.turn],
                    state.playerTableau[state.turn],
                    state.playerBuffs[state.turn],
                    true
                );

                if (execute === true && affordable) {
                    return applyTransition(
                        buildBuyAction(
                            reservedCard,
                            'reserved',
                            undefined,
                            getRandomBasicGemColor()
                        )
                    );
                }

                return affordable;
            }
        ),
        clearPreselectedReserveGold: recordHandler(
            'clearPreselectedReserveGold',
            calledActionLikeEvents
        ),
        handleReserveCard: recordHandler(
            'handleReserveCard',
            calledActionLikeEvents,
            (card: unknown, context: unknown) => {
                const state = getState();
                const flow = buildReserveCardFlow(
                    card as CardType,
                    context as CardInteractionContext,
                    hasBoardGold(state)
                );
                return applyTransition(flow.action);
            }
        ),
        handleReserveDeck: recordHandler(
            'handleReserveDeck',
            calledActionLikeEvents,
            (level: unknown) => {
                const state = getState();
                const flow = buildReserveDeckFlow(level as 1 | 2 | 3, hasBoardGold(state));
                return applyTransition(flow.action);
            }
        ),
        initiateBuy: recordHandler(
            'initiateBuy',
            calledActionLikeEvents,
            (card: unknown, source: unknown = 'market', marketInfo: unknown) => {
                const state = getState();
                const buyCard = card as CardType;
                const isReserved = source === 'reserved';
                const { affordable } = calculateTransaction(
                    buyCard,
                    state.inventories[state.turn],
                    state.playerTableau[state.turn],
                    state.playerBuffs[state.turn],
                    isReserved
                );

                if (!affordable) {
                    return false;
                }

                return applyTransition(
                    buildBuyAction(
                        buyCard,
                        source as 'market' | 'reserved',
                        marketInfo as CardInteractionContext | undefined,
                        getRandomBasicGemColor()
                    )
                );
            }
        ),
        ...handlerOverrides,
    }) as AppRouteProps['game']['handlers'];

export const renderStatefulGameShellHarness = async (
    stateOverrides: Partial<AppRouteProps['game']['state']> = {},
    getterOverrides: Partial<AppRouteProps['game']['getters']> = {},
    handlerOverrides: Partial<AppRouteProps['game']['handlers']> = {}
): Promise<RenderedStatefulGameShellHarness> => {
    const calledActionLikeEvents: ShellHandlerEvent[] = [];
    const transitions: StatefulHarnessTransition[] = [];
    const container = document.createElement('div');
    let root: Root | null = null;
    let currentState = createMonkeyState(stateOverrides);
    let currentHandlers: AppRouteProps['game']['handlers'] | null = null;
    let currentGame: AppRouteProps['game'] | null = null;
    let currentProps: AppRouteProps | null = null;
    let applyTransitionRef: (action: GameAction) => boolean = () => false;

    const StatefulHarness = () => {
        const [state, setState] = React.useState(currentState);
        currentState = state;

        const applyTransition = React.useCallback((action: GameAction): boolean => {
            const previousState = currentState;
            const nextState = applyAction(previousState, action);
            if (!nextState || nextState === previousState) {
                return false;
            }

            currentState = nextState as AppRouteProps['game']['state'];
            transitions.push({
                action,
                actionType: action.type,
                previousPhase: previousState.phase,
                phase: currentState.phase,
            });
            setState(currentState);
            return true;
        }, []);
        applyTransitionRef = applyTransition;

        const handlers = React.useMemo(
            () =>
                buildStatefulHandlers({
                    calledActionLikeEvents,
                    getState: () => currentState,
                    applyTransition,
                    handlerOverrides,
                }),
            [applyTransition]
        );
        currentHandlers = handlers;

        const canAfford = React.useCallback(
            (card: CardType, isReserved: boolean = false) => {
                const { affordable } = calculateTransaction(
                    card,
                    state.inventories[state.turn],
                    state.playerTableau[state.turn],
                    state.playerBuffs[state.turn],
                    isReserved
                );
                return affordable;
            },
            [state]
        );

        currentGame = {
            state,
            handlers,
            getters: {
                getPlayerScore: (playerId: PlayerKey) => getPlayerScore(state, playerId),
                isSelected: () => false,
                getCrownCount: (playerId: PlayerKey) => getCrownCount(state, playerId),
                canAfford,
                isMyTurn: true,
                ...getterOverrides,
            },
            historyControls: {
                undo: vi.fn(),
                redo: vi.fn(),
                canUndo: false,
                canRedo: false,
                jumpToStep: vi.fn(),
                importHistory: vi.fn(),
                clearAndInit: vi.fn(),
                currentIndex: transitions.length,
                historyLength: transitions.length,
                history: transitions.map((transition) => transition.action),
                historySource: 'live',
            },
            online: {
                peerId: '',
                remotePeerId: '',
                connectionStatus: 'disconnected',
                isHost: true,
                connectToPeer: vi.fn(),
                sendBootstrap: vi.fn(),
                sendGuestIntent: vi.fn(),
                sendHostDecision: vi.fn(),
                sendState: vi.fn(),
                requestRecovery: vi.fn(),
                latency: 0,
                isUnstable: false,
                approvalLog: [],
                statusNotice: null,
                authoritativeReplayRecorder: null,
            },
            replay: {
                currentReplay: null,
            },
        } satisfies AppRouteProps['game'];

        currentProps = {
            appVersion: 'phase-monkey-stateful-test',
            game: currentGame,
            lan: {} as AppRouteProps['lan'],
            layout: shellLayout,
            theme: 'dark',
            ui: {
                showDebug: false,
                isReviewing: false,
                showRulebook: false,
                matchmakingRoute: 'none',
                isPeekingBoard: false,
                persistentWinner: null,
                showRestartConfirm: false,
                soundEnabled: true,
            },
            setters: {
                setShowDebug: vi.fn(),
                setIsReviewing: vi.fn(),
                setShowRulebook: vi.fn(),
                setMatchmakingRoute: vi.fn(),
                setIsPeekingBoard: vi.fn(),
                setShowRestartConfirm: vi.fn(),
                setSoundEnabled: vi.fn(),
            },
            callbacks: {
                handleRestart: vi.fn(),
                handleDownloadReplay: vi.fn(),
                handleUploadReplay: vi.fn(),
            },
        } satisfies AppRouteProps;

        return (
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <GameShell {...currentProps} />
            </LocaleProvider>
        );
    };

    document.body.appendChild(container);

    await act(async () => {
        root = createRoot(container);
        root.render(<StatefulHarness />);
        await Promise.resolve();
    });

    return {
        props: currentProps!,
        game: currentGame!,
        handlers: currentHandlers!,
        container,
        calledActionLikeEvents,
        transitions,
        getState: () => currentState,
        applyTransition: (action: GameAction) => applyTransitionRef(action),
        cleanup: () => {
            act(() => {
                root?.unmount();
            });
            container.remove();
            document.body.replaceChildren();
        },
    };
};
