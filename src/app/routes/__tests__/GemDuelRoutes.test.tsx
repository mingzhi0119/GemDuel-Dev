import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../../../logic/initialState';
import type { AppRouteProps, GameAction } from '../../../types';
import { GemDuelRoutes } from '../GemDuelRoutes';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('../../../components/GameConfigMenu', () => ({
    GameConfigMenu: () => <div data-testid="config-route">config</div>,
}));

vi.mock('../../../components/OnlineMenu', () => ({
    OnlineMenu: () => <div data-testid="online-route">online</div>,
}));

vi.mock('../../../components/DraftScreen', () => ({
    DraftScreen: () => <div data-testid="draft-route">draft</div>,
}));

vi.mock('../../shell/GameShell', () => ({
    GameShell: () => <div data-testid="game-route">game</div>,
}));

const createLayout = (
    overrides: Partial<AppRouteProps['layout']> = {}
): AppRouteProps['layout'] => ({
    layoutMode: 'desktop-4k',
    viewportWidth: 1920,
    viewportHeight: 1200,
    aspectRatio: 1.6,
    stageCanvasWidthPx: 3840,
    stageCanvasHeightPx: 2400,
    stageScale: 0.5,
    stageInsetXPx: 0,
    stageInsetYPx: 0,
    boardScale: 1.14,
    deckScale: 1.08,
    zoneScale: 0.96,
    zoneHeightPx: 317,
    mainGapPx: 32,
    ...overrides,
});

const noop = () => {};

const createGame = (
    overrides: {
        state?: Partial<AppRouteProps['game']['state']>;
        handlers?: Partial<AppRouteProps['game']['handlers']>;
        getters?: Partial<AppRouteProps['game']['getters']>;
        historyControls?: Partial<AppRouteProps['game']['historyControls']>;
        online?: Partial<AppRouteProps['game']['online']>;
    } = {}
): AppRouteProps['game'] => {
    const game = {
        state: {
            ...INITIAL_STATE_SKELETON,
            selectedGems: [],
            errorMsg: null,
            phase: 'IDLE',
            turn: 'p1',
            draftPool: [],
            p2DraftPool: [],
            buffLevel: 1,
            mode: 'LOCAL_PVP',
            ...overrides.state,
        },
        handlers: {
            startGame: vi.fn(),
            handleSelectRoyal: vi.fn(),
            handleSelectBuff: vi.fn(),
            handleCloseModal: vi.fn(),
            handlePeekDeck: vi.fn(),
            handleSelfGemClick: vi.fn(),
            handleGemClick: vi.fn(),
            handleGemDragSelection: vi.fn(),
            handleOpponentGemClick: vi.fn(),
            handleConfirmTake: vi.fn(),
            handleReplenish: vi.fn(),
            activatePrivilegeMode: vi.fn(),
            handleReserveCard: vi.fn(),
            handleReserveDeck: vi.fn(),
            handleDiscardReserved: vi.fn(),
            initiateBuy: vi.fn(),
            handleSelectBonusColor: vi.fn(),
            handleCancelReserve: vi.fn(),
            handleCancelPrivilege: vi.fn(),
            checkAndInitiateBuyReserved: vi.fn(),
            handleDebugAddCrowns: vi.fn(),
            handleDebugAddPoints: vi.fn(),
            handleDebugAddPrivilege: vi.fn(),
            handleForceRoyal: vi.fn(),
            handleRerollBuffs: vi.fn(),
            importHistory: vi.fn(),
            ...overrides.handlers,
        },
        getters: {
            getPlayerScore: vi.fn(() => 0),
            isSelected: vi.fn(() => false),
            getCrownCount: vi.fn(() => 0),
            canAfford: vi.fn(() => false),
            isMyTurn: false,
            ...overrides.getters,
        },
        historyControls: {
            undo: noop,
            redo: noop,
            canUndo: false,
            canRedo: false,
            jumpToStep: noop,
            importHistory: noop,
            clearAndInit: noop,
            currentIndex: 0,
            historyLength: 0,
            history: [] as GameAction[],
            ...overrides.historyControls,
        },
        online: {
            peerId: '',
            remotePeerId: '',
            connectionStatus: 'disconnected',
            isHost: true,
            connectToPeer: noop,
            sendBootstrap: noop,
            sendGuestIntent: noop,
            sendHostDecision: noop,
            sendState: noop,
            requestRecovery: noop,
            latency: 0,
            isUnstable: false,
            approvalLog: [],
            statusNotice: null,
            ...overrides.online,
        },
    } satisfies AppRouteProps['game'];

    return game;
};

const createProps = (overrides: Partial<AppRouteProps> = {}): AppRouteProps => ({
    appVersion: '1.0.0',
    game: createGame(),
    layout: createLayout(),
    theme: 'dark',
    ui: {
        showDebug: false,
        isReviewing: false,
        showRulebook: false,
        onlineSetup: false,
        isPeekingBoard: false,
        persistentWinner: null,
        showRestartConfirm: false,
        ...(overrides.ui ?? {}),
    },
    setters: {
        setShowDebug: vi.fn(),
        setIsReviewing: vi.fn(),
        setShowRulebook: vi.fn(),
        setOnlineSetup: vi.fn(),
        setIsPeekingBoard: vi.fn(),
        setShowRestartConfirm: vi.fn(),
        ...(overrides.setters ?? {}),
    },
    callbacks: {
        handleRestart: vi.fn(),
        handleDownloadReplay: vi.fn(),
        handleUploadReplay: vi.fn(),
        toggleTheme: vi.fn(),
        ...(overrides.callbacks ?? {}),
    },
    ...overrides,
});

const renderRoutes = async (props: AppRouteProps) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container);

    await act(async () => {
        root.render(<GemDuelRoutes {...props} />);
        await Promise.resolve();
        await Promise.resolve();
    });

    return {
        container,
        root,
    };
};

describe('GemDuelRoutes desktop stage rendering', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it.each([
        {
            name: 'config route',
            routeTestId: 'config-route',
            props: createProps(),
        },
        {
            name: 'online route',
            routeTestId: 'online-route',
            props: createProps({
                ui: {
                    showDebug: false,
                    isReviewing: false,
                    showRulebook: false,
                    onlineSetup: true,
                    isPeekingBoard: false,
                    persistentWinner: null,
                    showRestartConfirm: false,
                },
            }),
        },
        {
            name: 'draft route',
            routeTestId: 'draft-route',
            props: createProps({
                game: createGame({
                    state: {
                        phase: 'DRAFT_PHASE',
                    },
                    historyControls: {
                        historyLength: 1,
                    },
                }),
            }),
        },
        {
            name: 'game route',
            routeTestId: 'game-route',
            props: createProps({
                game: createGame({
                    historyControls: {
                        historyLength: 1,
                    },
                }),
            }),
        },
    ])('mounts the $name inside the shared desktop stage', async ({ props, routeTestId }) => {
        const { container, root } = await renderRoutes(props);

        const viewport = container.querySelector('[data-testid="desktop-stage-viewport"]');
        const canvas = container.querySelector(
            '[data-testid="desktop-stage-canvas"]'
        ) as HTMLDivElement | null;
        const route = container.querySelector(`[data-testid="${routeTestId}"]`);

        expect(viewport).not.toBeNull();
        expect(canvas).not.toBeNull();
        expect(route).not.toBeNull();
        expect(canvas?.style.width).toBe('3840px');
        expect(canvas?.style.height).toBe('2400px');
        expect(canvas?.style.transform).toBe('scale(0.5)');
        expect(canvas?.style.left).toBe('0px');
        expect(canvas?.style.top).toBe('0px');
        expect(canvas?.contains(route as Node)).toBe(true);

        act(() => {
            root.unmount();
        });
    });

    it('renders mobile routes without the desktop stage canvas', async () => {
        const { container, root } = await renderRoutes(
            createProps({
                layout: createLayout({
                    layoutMode: 'mobile',
                    viewportWidth: 375,
                    viewportHeight: 812,
                    aspectRatio: 375 / 812,
                    stageCanvasWidthPx: 375,
                    stageCanvasHeightPx: 812,
                    stageScale: 1,
                    stageInsetXPx: 0,
                    stageInsetYPx: 0,
                    boardScale: 0.45,
                    deckScale: 0.55,
                    zoneScale: 0.55,
                    zoneHeightPx: 286,
                    mainGapPx: 16,
                }),
            })
        );

        expect(container.querySelector('[data-testid="desktop-stage-canvas"]')).toBeNull();
        expect(container.querySelector('[data-testid="config-route"]')).not.toBeNull();

        act(() => {
            root.unmount();
        });
    });

    it('renders high-density desktop layouts with the compensated stage canvas size', async () => {
        const { container, root } = await renderRoutes(
            createProps({
                layout: createLayout({
                    viewportWidth: 1707,
                    viewportHeight: 1067,
                    aspectRatio: 1707 / 1067,
                    stageCanvasWidthPx: 2560,
                    stageCanvasHeightPx: 1067 / (1707 / 2560),
                    stageScale: 1707 / 2560,
                    stageInsetXPx: 0,
                    stageInsetYPx: 0,
                }),
            })
        );

        const canvas = container.querySelector(
            '[data-testid="desktop-stage-canvas"]'
        ) as HTMLDivElement | null;

        expect(canvas).not.toBeNull();
        expect(canvas?.style.width).toBe('2560px');
        expect(Number.parseFloat(canvas?.style.height ?? '0')).toBeCloseTo(1067 / (1707 / 2560), 5);
        expect(canvas?.style.transform).toBe(`scale(${1707 / 2560})`);
        expect(canvas?.style.top).toBe('0px');

        act(() => {
            root.unmount();
        });
    });
});
