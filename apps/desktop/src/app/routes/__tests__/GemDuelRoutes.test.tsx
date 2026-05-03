// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import type { AppRouteProps } from '@app/types/ui';
import type { GameAction } from '@gemduel/shared/types';
import { GemDuelRoutes } from '../GemDuelRoutes';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const routeSpies = vi.hoisted(() => ({
    draftScreenProps: vi.fn(),
    throwGameShell: false,
}));

const reportRendererEvent = vi.fn();

vi.mock('../../../observability/rendererLogger', () => ({
    reportRendererEvent: (...args: unknown[]) => reportRendererEvent(...args),
}));

vi.mock('@gemduel/ui/components/GameConfigMenu', () => ({
    GameConfigMenu: () => <div data-testid="config-route">config</div>,
}));

vi.mock('@gemduel/ui/components/OnlineMenu', () => ({
    OnlineMenu: () => <div data-testid="online-route">online</div>,
}));

vi.mock('@gemduel/ui/components/LanMenu', () => ({
    LanMenu: () => <div data-testid="lan-route">lan</div>,
}));

vi.mock('@gemduel/ui/components/DraftScreen', () => ({
    DraftScreen: (props: unknown) => {
        routeSpies.draftScreenProps(props);
        return <div data-testid="draft-route">draft</div>;
    },
}));

vi.mock('../../shell/GameShell', () => ({
    GameShell: () => {
        if (routeSpies.throwGameShell) {
            throw new Error('route failed');
        }

        return <div data-testid="game-route">game</div>;
    },
}));

vi.mock('../../visual-lab/VisualLabRoute', () => ({
    VisualLabRoute: ({
        mode,
        onCloseToStartPage,
    }: {
        mode: string;
        onCloseToStartPage?: () => void;
    }) => (
        <div data-testid="visual-lab-route" data-visual-lab-mode={mode}>
            {onCloseToStartPage ? (
                <button
                    type="button"
                    data-app-restart-button="true"
                    onClick={() => onCloseToStartPage()}
                >
                    back
                </button>
            ) : null}
            visual lab
        </div>
    ),
}));

const createLayout = (
    overrides: Partial<AppRouteProps['layout']> = {}
): AppRouteProps['layout'] => ({
    layoutMode: 'desktop-4k',
    viewportWidth: 1920,
    viewportHeight: 1200,
    aspectRatio: 1.6,
    stageCanvasWidthPx: 3840,
    stageCanvasHeightPx: 2160,
    stageScale: 0.5,
    stageInsetXPx: 0,
    stageInsetYPx: 60,
    boardScale: (3840 - 96) / 2000,
    deckScale: 1.12,
    zoneScale: 1,
    zoneHeightPx: 520,
    mainGapPx: 24,
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
            reserveGoldSelection: null,
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
            clearPreselectedReserveGold: vi.fn(),
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
            historySource: 'live',
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
            authoritativeReplayRecorder: null,
            ...overrides.online,
        },
        replay: {
            currentReplay: null,
        },
    } satisfies AppRouteProps['game'];

    return game;
};

const createProps = (overrides: Partial<AppRouteProps> = {}): AppRouteProps => ({
    appVersion: '1.0.0',
    game: createGame(),
    lan: {
        state: {
            phase: 'idle',
            roomId: null,
            remoteInstanceId: null,
            remoteAddress: null,
            hostPort: null,
            transportHost: false,
            localSeat: null,
            selectedMode: null,
            hostPeerId: null,
            errorMessage: null,
            statusMessage: 'LAN duel is ready.',
        },
        launch: null,
        refresh: vi.fn(),
        startSearch: vi.fn(),
        cancelSearch: vi.fn(),
        selectMode: vi.fn(),
        confirmStart: vi.fn(),
        reportPeerReady: vi.fn(),
        clearLaunch: vi.fn(),
    },
    layout: createLayout(),
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
        ...(overrides.ui ?? {}),
    },
    setters: {
        setShowDebug: vi.fn(),
        setIsReviewing: vi.fn(),
        setShowRulebook: vi.fn(),
        setMatchmakingRoute: vi.fn(),
        setIsPeekingBoard: vi.fn(),
        setShowRestartConfirm: vi.fn(),
        setSoundEnabled: vi.fn(),
        ...(overrides.setters ?? {}),
    },
    callbacks: {
        handleRestart: vi.fn(),
        handleDownloadReplay: vi.fn(),
        handleUploadReplay: vi.fn(),
        openVisualLab: vi.fn(),
        closeVisualLabToStartPage: vi.fn(),
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
        window.history.replaceState(null, '', '/');
        routeSpies.draftScreenProps.mockReset();
        routeSpies.throwGameShell = false;
        reportRendererEvent.mockReset();
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
                    matchmakingRoute: 'online',
                    isPeekingBoard: false,
                    persistentWinner: null,
                    showRestartConfirm: false,
                    soundEnabled: true,
                },
            }),
        },
        {
            name: 'lan route',
            routeTestId: 'lan-route',
            props: createProps({
                ui: {
                    showDebug: false,
                    isReviewing: false,
                    showRulebook: false,
                    matchmakingRoute: 'lan',
                    isPeekingBoard: false,
                    persistentWinner: null,
                    showRestartConfirm: false,
                    soundEnabled: true,
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
        expect(canvas?.style.height).toBe('2160px');
        expect(canvas?.style.transform).toBe('scale(0.5)');
        expect(canvas?.style.left).toBe('0px');
        expect(canvas?.style.top).toBe('60px');
        expect(viewport?.className).toContain('bg-black');
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

    it('mounts the visual lab route from the query string without entering normal game routes', async () => {
        window.history.replaceState(null, '', '/?visualLab=surfaces');
        const closeVisualLabToStartPage = vi.fn();

        const { container, root } = await renderRoutes(
            createProps({
                callbacks: {
                    handleRestart: vi.fn(),
                    handleDownloadReplay: vi.fn(),
                    handleUploadReplay: vi.fn(),
                    openVisualLab: vi.fn(),
                    closeVisualLabToStartPage,
                },
            })
        );

        const visualLab = container.querySelector('[data-testid="visual-lab-route"]');

        expect(visualLab).not.toBeNull();
        expect(visualLab?.getAttribute('data-visual-lab-mode')).toBe('surfaces');
        expect(container.querySelector('[data-testid="config-route"]')).toBeNull();

        const back = container.querySelector('[data-app-restart-button="true"]');
        expect(back).not.toBeNull();
        await act(async () => {
            (back as HTMLButtonElement).click();
        });
        expect(closeVisualLabToStartPage).toHaveBeenCalledTimes(1);

        act(() => {
            root.unmount();
        });
    });

    it('renders high-density desktop layouts with the canonical stage canvas size', async () => {
        const { container, root } = await renderRoutes(
            createProps({
                layout: createLayout({
                    viewportWidth: 1707,
                    viewportHeight: 1067,
                    aspectRatio: 1707 / 1067,
                    stageCanvasWidthPx: 3840,
                    stageCanvasHeightPx: 2160,
                    stageScale: 1707 / 3840,
                    stageInsetXPx: 0,
                    stageInsetYPx: 53,
                }),
            })
        );

        const canvas = container.querySelector(
            '[data-testid="desktop-stage-canvas"]'
        ) as HTMLDivElement | null;

        expect(canvas).not.toBeNull();
        expect(canvas?.style.width).toBe('3840px');
        expect(canvas?.style.height).toBe('2160px');
        expect(canvas?.style.transform).toBe(`scale(${1707 / 3840})`);
        expect(canvas?.style.top).toBe('53px');

        act(() => {
            root.unmount();
        });
    });

    it('passes local-only reroll controls and the p2 draft level into DraftScreen', async () => {
        const { root } = await renderRoutes(
            createProps({
                game: createGame({
                    state: {
                        phase: 'DRAFT_PHASE',
                        mode: 'LOCAL_PVP',
                        turn: 'p2',
                        buffLevel: 2,
                        p2DraftLevel: 3,
                    },
                    historyControls: {
                        historyLength: 1,
                    },
                }),
            })
        );

        expect(routeSpies.draftScreenProps).toHaveBeenCalledWith(
            expect.objectContaining({
                mode: 'LOCAL_PVP',
                activeDraftLevel: 3,
                onReroll: expect.any(Function),
            })
        );

        act(() => {
            root.unmount();
        });
    });

    it('falls back to buffLevel for legacy draft snapshots and withholds rerolls online', async () => {
        const { root } = await renderRoutes(
            createProps({
                game: createGame({
                    state: {
                        phase: 'DRAFT_PHASE',
                        mode: 'ONLINE_MULTIPLAYER',
                        turn: 'p2',
                        buffLevel: 2,
                        p2DraftLevel: undefined as unknown as 0 | 1 | 2 | 3,
                    },
                    historyControls: {
                        historyLength: 1,
                    },
                }),
            })
        );

        expect(routeSpies.draftScreenProps).toHaveBeenCalledWith(
            expect.objectContaining({
                mode: 'ONLINE_MULTIPLAYER',
                activeDraftLevel: 2,
                onReroll: undefined,
            })
        );

        act(() => {
            root.unmount();
        });
    });

    it('renders the draft route for pve draft setup before any history entry exists', async () => {
        const { container, root } = await renderRoutes(
            createProps({
                game: createGame({
                    state: {
                        phase: 'DRAFT_PHASE',
                        mode: 'PVE',
                        draftPool: ['intelligence', 'deep_pockets', 'privilege_favor'],
                    },
                    historyControls: {
                        historyLength: 0,
                    },
                }),
            })
        );

        expect(container.querySelector('[data-testid="draft-route"]')).not.toBeNull();
        expect(container.querySelector('[data-testid="config-route"]')).toBeNull();
        expect(routeSpies.draftScreenProps).toHaveBeenCalledWith(
            expect.objectContaining({
                mode: 'PVE',
                onReroll: expect.any(Function),
            })
        );

        act(() => {
            root.unmount();
        });
    });

    it('still passes the pve reroll handler during the ai draft turn so DraftScreen can hide it locally', async () => {
        const { root } = await renderRoutes(
            createProps({
                game: createGame({
                    state: {
                        phase: 'DRAFT_PHASE',
                        mode: 'PVE',
                        turn: 'p2',
                        localPlayer: 'p1',
                    },
                    historyControls: {
                        historyLength: 1,
                    },
                }),
            })
        );

        expect(routeSpies.draftScreenProps).toHaveBeenCalledWith(
            expect.objectContaining({
                mode: 'PVE',
                activePlayer: 'p2',
                onReroll: expect.any(Function),
                localPlayer: 'p1',
            })
        );

        act(() => {
            root.unmount();
        });
    });

    it('contains route render failures inside a recovery boundary', async () => {
        routeSpies.throwGameShell = true;
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        const { container, root } = await renderRoutes(
            createProps({
                game: createGame({
                    historyControls: {
                        historyLength: 1,
                    },
                }),
            })
        );

        expect(container.querySelector('[role="alert"]')).not.toBeNull();
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'runtime',
                name: 'ROUTE_RENDER_FAILED',
                severity: 'error',
            }),
            expect.objectContaining({
                consoleDetails: expect.any(Error),
            })
        );

        act(() => {
            root.unmount();
        });
    });
});
