import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppChrome } from '../app/chrome/AppChrome';
import { DesktopStage } from '../app/layout/DesktopStage';
import { AppOverlayStack } from '../app/overlays/AppOverlayStack';
import { GamePlaySurface } from '../app/shell/GamePlaySurface';
import { GameShell } from '../app/shell/GameShell';
import { PlayerRail } from '../app/shell/PlayerRail';
import { getGemPanelSkin } from '../app/shell/surfaceArtwork';
import type { AppRouteProps } from '@app/types/ui';
import type { ResponsiveLayout } from '@gemduel/shared/types';
import { createMockState } from '@gemduel/shared/logic/__tests__/testHelpers';

vi.mock('@gemduel/ui/components/GameActions', () => ({
    GameActions: ({ readabilityTreatment }: { readabilityTreatment?: boolean }) => (
        <div
            data-testid="game-actions-smoke"
            data-readability-treatment={readabilityTreatment ? 'true' : 'false'}
        />
    ),
}));

vi.mock('@gemduel/ui/components/GameBoard', () => ({
    GameBoard: () => <div data-testid="game-board-smoke" />,
}));

vi.mock('@gemduel/ui/components/Market', () => ({
    Market: ({ readabilityTreatment }: { readabilityTreatment?: boolean }) => (
        <div
            data-testid="market-smoke"
            data-readability-treatment={readabilityTreatment ? 'true' : 'false'}
        />
    ),
}));

vi.mock('@gemduel/ui/components/ReplayControls', () => ({
    ReplayControls: () => <div data-testid="replay-controls-smoke" />,
}));

vi.mock('@gemduel/ui/components/RoyalCourt', () => ({
    RoyalCourt: ({ readabilityTreatment }: { readabilityTreatment?: boolean }) => (
        <div
            data-testid="royal-court-smoke"
            data-readability-treatment={readabilityTreatment ? 'true' : 'false'}
        />
    ),
}));

vi.mock('@gemduel/ui/components/StatusBar', () => ({
    StatusBar: () => <div data-testid="status-bar-smoke" />,
}));

vi.mock('@gemduel/ui/components/PlayerZone', () => ({
    PlayerZone: ({
        player,
        readabilityTreatment,
        reserved,
        reservedVisibility,
        tableauVisibility,
        gemVisibility,
    }: {
        player?: string;
        readabilityTreatment?: boolean;
        reserved?: unknown[];
        reservedVisibility?: string;
        tableauVisibility?: string;
        gemVisibility?: string;
    }) => (
        <div
            data-testid="player-zone-smoke"
            data-player={player}
            data-readability-treatment={readabilityTreatment ? 'true' : 'false'}
            data-reserved-visibility={reservedVisibility}
            data-tableau-visibility={tableauVisibility}
            data-gem-visibility={gemVisibility}
            data-reserved-first={JSON.stringify(reserved?.[0] ?? null)}
        />
    ),
}));

vi.mock('@gemduel/ui/components/TopBar', () => ({
    TopBar: ({ readabilityTreatment }: { readabilityTreatment?: boolean }) => (
        <div
            data-testid="top-bar-smoke"
            data-readability-treatment={readabilityTreatment ? 'true' : 'false'}
        />
    ),
}));

vi.mock('@gemduel/ui/components/UpdateNotification', () => ({
    UpdateNotification: () => <div data-testid="update-notification-smoke" />,
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const layout: ResponsiveLayout = {
    layoutMode: 'desktop-4k',
    viewportWidth: 1920,
    viewportHeight: 1080,
    aspectRatio: 16 / 9,
    stageCanvasWidthPx: 3840,
    stageCanvasHeightPx: 2160,
    stageScale: 0.5,
    stageInsetXPx: 0,
    stageInsetYPx: 0,
    boardScale: (3840 - 96) / 2000,
    deckScale: 1.12,
    zoneScale: 1,
    zoneHeightPx: 520,
    mainGapPx: 24,
};

const createGameController = (): AppRouteProps['game'] => {
    const state = createMockState({
        mode: 'LOCAL_PVP',
        phase: 'IDLE',
        turn: 'p1',
        playerTurnCounts: { p1: 2, p2: 1 },
        activeModal: null,
    });

    return {
        state: {
            ...state,
            selectedGems: [],
            errorMsg: null,
        },
        handlers: {
            handleDebugAddCrowns: vi.fn(),
            handleDebugAddPoints: vi.fn(),
            handleDebugAddPrivilege: vi.fn(),
            handleForceRoyal: vi.fn(),
            handleSelectBonusColor: vi.fn(),
            handleCloseModal: vi.fn(),
            handleGemClick: vi.fn(),
            handleGemDragSelection: vi.fn(),
            handleConfirmTake: vi.fn(),
            handleReplenish: vi.fn(),
            handleReserveCard: vi.fn(),
            handleReserveDeck: vi.fn(),
            initiateBuy: vi.fn(),
            handleSelectRoyal: vi.fn(),
            handleCancelReserve: vi.fn(),
            handleCancelPrivilege: vi.fn(),
            handlePeekDeck: vi.fn(),
            handleSelfGemClick: vi.fn(),
            handleOpponentGemClick: vi.fn(),
            handleDiscardReserved: vi.fn(),
            activatePrivilegeMode: vi.fn(),
            checkAndInitiateBuyReserved: vi.fn(),
            clearPreselectedReserveGold: vi.fn(),
        },
        getters: {
            getPlayerScore: vi.fn(() => 7),
            getCrownCount: vi.fn(() => 1),
            isMyTurn: true,
        },
        historyControls: {
            undo: vi.fn(),
            redo: vi.fn(),
            canUndo: false,
            canRedo: false,
            jumpToStep: vi.fn(),
            currentIndex: 0,
            historyLength: 0,
            historySource: 'live',
        },
        online: {
            isHost: true,
            connectionStatus: 'connected',
            statusNotice: null,
        },
    } as unknown as AppRouteProps['game'];
};

const uiState: AppRouteProps['ui'] = {
    showDebug: false,
    isReviewing: false,
    showRulebook: false,
    matchmakingRoute: 'none',
    isPeekingBoard: false,
    persistentWinner: null,
    showRestartConfirm: false,
    soundEnabled: true,
};

const uiSetters: AppRouteProps['setters'] = {
    setShowDebug: vi.fn(),
    setIsReviewing: vi.fn(),
    setShowRulebook: vi.fn(),
    setMatchmakingRoute: vi.fn(),
    setIsPeekingBoard: vi.fn(),
    setShowRestartConfirm: vi.fn(),
    setSoundEnabled: vi.fn(),
};

const lanController: AppRouteProps['lan'] = {
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
};

const uiCallbacks: AppRouteProps['callbacks'] = {
    handleRestart: vi.fn(),
    handleDownloadReplay: vi.fn(),
    handleUploadReplay: vi.fn(),
};

describe('shell smoke coverage', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderElement = (element: React.ReactElement) => {
        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);
        }

        act(() => {
            root?.render(element);
        });
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('renders AppChrome without throwing when debug panels stay closed', () => {
        renderElement(
            <AppChrome
                theme="dark"
                showDebug={false}
                canShowDebug={true}
                onToggleDebug={vi.fn()}
                onDownloadReplay={vi.fn()}
                onUploadReplay={vi.fn()}
                onRequestRestart={vi.fn()}
                onShowRulebook={vi.fn()}
                onAddCrowns={vi.fn()}
                onAddPoints={vi.fn()}
                onAddPrivilege={vi.fn()}
                onForceRoyal={vi.fn()}
                showDebugPanels={false}
                soundEnabled={true}
                onToggleSound={vi.fn()}
            />
        );

        const settingsButton = container?.querySelector<HTMLButtonElement>(
            'button[aria-label="Settings"]'
        );
        const settingsTooltipId = settingsButton?.getAttribute('aria-describedby');
        const tooltip = settingsTooltipId
            ? container?.querySelector<HTMLElement>(`#${settingsTooltipId}`)
            : null;
        const restartButton = container?.querySelector<HTMLButtonElement>(
            'button[data-app-restart-button="true"]'
        );
        expect(settingsButton).not.toBeNull();
        expect(settingsButton?.hasAttribute('title')).toBe(false);
        expect(settingsButton?.getAttribute('aria-describedby')).toBe(tooltip?.id);
        expect(tooltip?.dataset.tooltipSize).toBe('standard-label');
        expect(restartButton?.getAttribute('aria-label')).toBe('Restart');
    });

    it('renders DesktopStage with its child canvas anchoring intact', () => {
        renderElement(
            <DesktopStage layout={layout}>
                <div data-testid="desktop-stage-child">child</div>
            </DesktopStage>
        );

        expect(container?.querySelector('[data-testid="desktop-stage-canvas"]')).not.toBeNull();
    });

    it('renders AppOverlayStack without active overlays or modal crashes', () => {
        renderElement(
            <AppOverlayStack
                theme="dark"
                showRulebook={false}
                persistentWinner={null}
                isReviewing={false}
                showRestartConfirm={false}
                phase="IDLE"
                isPeekingBoard={false}
                onCloseRulebook={vi.fn()}
                onStartReview={vi.fn()}
                onStopReview={vi.fn()}
                onCancelRestart={vi.fn()}
                onConfirmRestart={vi.fn()}
                onStartBoardPeek={vi.fn()}
                onStopBoardPeek={vi.fn()}
                onSelectBonusColor={vi.fn()}
            />
        );

        expect(container?.textContent ?? '').toBe('');
    });

    it('renders GamePlaySurface with mocked presentation children', () => {
        renderElement(
            <GamePlaySurface
                game={createGameController()}
                layout={layout}
                theme="dark"
                effectiveGameMode="IDLE"
                localPlayer="p1"
                gemBoardSurfaceStyle={{}}
                gemPanelSkin={getGemPanelSkin('dark')}
                marketSurfaceStyle={{}}
            />
        );

        expect(container?.querySelector('[data-testid="game-board-smoke"]')).not.toBeNull();
        expect(container?.querySelector('[data-testid="replay-controls-smoke"]')).toBeNull();
    });

    it('renders GamePlaySurface replay controls only when requested for review mode', () => {
        renderElement(
            <GamePlaySurface
                game={createGameController()}
                layout={layout}
                theme="dark"
                effectiveGameMode="REVIEW"
                localPlayer="p1"
                gemBoardSurfaceStyle={{}}
                gemPanelSkin={getGemPanelSkin('dark')}
                marketSurfaceStyle={{}}
                showReplayControls={true}
            />
        );

        expect(container?.querySelector('[data-testid="replay-controls-smoke"]')).not.toBeNull();
    });

    it('renders PlayerRail with mocked player zones', () => {
        renderElement(
            <PlayerRail
                game={createGameController()}
                theme="dark"
                effectiveGameMode="IDLE"
                scaledZoneWrapperStyle={{}}
                playerRailStyle={{}}
                isP1ZoneActive={true}
                isP2ZoneActive={false}
            />
        );

        expect(container?.querySelectorAll('[data-testid="player-zone-smoke"]').length).toBe(2);
        const p1Frame = container?.querySelector('[data-player-zone-frame="p1"]');
        const p2Frame = container?.querySelector('[data-player-zone-frame="p2"]');

        expect(p1Frame?.getAttribute('data-player-zone-frame-active')).toBe('true');
        expect(p1Frame?.className).toContain('border-[3px]');
        expect(p1Frame?.className).toContain('animate-breathe-gold');
        expect(p1Frame?.className).toContain('border-amber-200/95');
        expect(p2Frame?.getAttribute('data-player-zone-frame-active')).toBe('false');
        expect(p2Frame?.className).toContain('border-[3px]');
        expect(p2Frame?.className).toContain('border-transparent');
        expect(p2Frame?.className).not.toContain('border-slate');
    });

    it('passes multiplayer reserved backs and LAN local hiding preferences into PlayerZone', () => {
        const game = createGameController();
        game.state = {
            ...game.state,
            mode: 'ONLINE_MULTIPLAYER',
            isHost: true,
            hostPlayer: 'p1',
            localPlayer: 'p1',
            playerReserved: {
                p1: [],
                p2: [
                    {
                        id: 'opponent-private-reserved',
                        level: 1,
                        cost: {
                            blue: 0,
                            white: 0,
                            green: 0,
                            black: 0,
                            red: 1,
                            pearl: 0,
                            gold: 0,
                        },
                        points: 1,
                    },
                ],
            },
        };

        renderElement(
            <PlayerRail
                game={game}
                theme="dark"
                effectiveGameMode="IDLE"
                scaledZoneWrapperStyle={{}}
                playerRailStyle={{}}
                isP1ZoneActive={true}
                isP2ZoneActive={false}
                lanOpponentVisibilityPreferences={{
                    showOpponentPlayerZoneCards: false,
                    showOpponentGems: false,
                }}
            />
        );

        const p1Zone = container?.querySelector<HTMLElement>(
            '[data-testid="player-zone-smoke"][data-player="p1"]'
        );
        const p2Zone = container?.querySelector<HTMLElement>(
            '[data-testid="player-zone-smoke"][data-player="p2"]'
        );

        expect(p1Zone?.dataset.reservedVisibility).toBe('faces');
        expect(p1Zone?.dataset.tableauVisibility).toBe('faces');
        expect(p1Zone?.dataset.gemVisibility).toBe('visible');
        expect(p2Zone?.dataset.reservedVisibility).toBe('backs');
        expect(p2Zone?.dataset.tableauVisibility).toBe('backs');
        expect(p2Zone?.dataset.gemVisibility).toBe('hidden');
    });

    it('renders GameShell without throwing through the excluded composition shell', () => {
        renderElement(
            <GameShell
                appVersion="5.2.11"
                game={createGameController()}
                lan={lanController}
                layout={layout}
                theme="dark"
                ui={uiState}
                setters={uiSetters}
                callbacks={uiCallbacks}
            />
        );

        expect(
            container?.querySelector('[data-main-game-readability="porcelain-glass"]')
        ).not.toBeNull();
        expect(
            container?.querySelector(
                '[data-testid="top-bar-smoke"][data-readability-treatment="true"]'
            )
        ).not.toBeNull();
        expect(
            container?.querySelector(
                '[data-testid="market-smoke"][data-readability-treatment="true"]'
            )
        ).not.toBeNull();
        expect(
            container?.querySelector(
                '[data-testid="royal-court-smoke"][data-readability-treatment="true"]'
            )
        ).not.toBeNull();
        expect(
            container?.querySelector(
                '[data-testid="game-actions-smoke"][data-readability-treatment="true"]'
            )
        ).not.toBeNull();
        expect(container?.querySelector('[data-testid="replay-controls-smoke"]')).toBeNull();
        expect(
            container?.querySelectorAll(
                '[data-testid="player-zone-smoke"][data-readability-treatment="true"]'
            ).length
        ).toBe(2);
    });

    it('redacts opponent reserved cards in the GameShell player rail view', () => {
        const game = createGameController();
        game.state = {
            ...game.state,
            mode: 'ONLINE_MULTIPLAYER',
            isHost: true,
            hostPlayer: 'p1',
            localPlayer: 'p1',
            playerReserved: {
                p1: [],
                p2: [
                    {
                        id: 'shell-private-opponent-reserved',
                        level: 1,
                        cost: {
                            blue: 0,
                            white: 0,
                            green: 0,
                            black: 0,
                            red: 1,
                            pearl: 0,
                            gold: 0,
                        },
                        points: 1,
                    },
                ],
            },
        };

        renderElement(
            <GameShell
                appVersion="5.2.11"
                game={game}
                lan={lanController}
                layout={layout}
                theme="dark"
                ui={{
                    ...uiState,
                    matchmakingRoute: 'lan',
                    lanShowOpponentPlayerZoneCards: false,
                    lanShowOpponentGems: false,
                }}
                setters={uiSetters}
                callbacks={uiCallbacks}
            />
        );

        const p2Zone = container?.querySelector<HTMLElement>(
            '[data-testid="player-zone-smoke"][data-player="p2"]'
        );

        expect(p2Zone?.dataset.reservedVisibility).toBe('backs');
        expect(p2Zone?.dataset.tableauVisibility).toBe('backs');
        expect(p2Zone?.dataset.gemVisibility).toBe('hidden');
        expect(p2Zone?.dataset.reservedFirst).toContain('isHiddenReservedCard');
        expect(p2Zone?.dataset.reservedFirst).not.toContain('shell-private-opponent-reserved');
    });

    it('shows GameShell replay controls while review mode is active', () => {
        renderElement(
            <GameShell
                appVersion="5.2.11"
                game={createGameController()}
                lan={lanController}
                layout={layout}
                theme="dark"
                ui={{ ...uiState, isReviewing: true }}
                setters={uiSetters}
                callbacks={uiCallbacks}
            />
        );

        expect(container?.querySelector('[data-testid="replay-controls-smoke"]')).not.toBeNull();
    });
});
