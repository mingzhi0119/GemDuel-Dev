// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppRouteProps } from '@app/types/ui';
import type { ResponsiveLayout } from '@gemduel/shared/types';
import GemDuelBoard from '../App';

const mocks = vi.hoisted(() => ({
    routeProps: null as AppRouteProps | null,
    game: null as AppRouteProps['game'] | null,
    lan: null as AppRouteProps['lan'] | null,
    layout: null as ResponsiveLayout | null,
    setLocale: vi.fn(),
    setSurfaceTheme: vi.fn(),
    setDesktopAspectRatio: vi.fn(),
    useReplayAutoSave: vi.fn(),
    useLanDevVerification: vi.fn(),
}));

vi.mock('../app/routes/GemDuelRoutes', () => ({
    GemDuelRoutes: (props: AppRouteProps) => {
        mocks.routeProps = props;
        return <div data-testid="gem-duel-routes" />;
    },
}));

vi.mock('../app/runtime/useRuntimeAppConfig', () => ({
    useRuntimeAppConfig: () => ({
        appVersion: '5.2.11',
    }),
}));

vi.mock('../hooks/useResponsiveLayout', () => ({
    useResponsiveLayout: () => mocks.layout,
}));

vi.mock('../hooks/useSettings', () => ({
    useSettings: () => ({
        theme: 'dark' as const,
        locale: 'en' as const,
        setLocale: mocks.setLocale,
        surfaceTheme: {
            background: 'crystal-anime',
            topBar: 'crystal-anime',
            gemPanel: 'crystal-anime',
            playerZone: 'crystal-anime',
            effects: 'anime',
        },
        setSurfaceTheme: mocks.setSurfaceTheme,
        desktopAspectRatio: '16:10' as const,
        setDesktopAspectRatio: mocks.setDesktopAspectRatio,
    }),
}));

vi.mock('../hooks/useLanMatchmaking', () => ({
    useLanMatchmaking: () => mocks.lan,
}));

vi.mock('../hooks/useLanDevVerification', () => ({
    useLanDevVerification: (...args: unknown[]) => mocks.useLanDevVerification(...args),
}));

vi.mock('../hooks/useGameLogic', () => ({
    useGameLogic: () => mocks.game,
}));

vi.mock('../app/io/useReplayIO', () => ({
    useReplayIO: () => ({
        handleDownloadReplay: vi.fn(),
        handleUploadReplay: vi.fn(),
        persistReplayToProjectFolder: vi.fn(),
    }),
}));

vi.mock('../app/io/useReplayAutoSave', () => ({
    useReplayAutoSave: (...args: unknown[]) => mocks.useReplayAutoSave(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createLayout = (): ResponsiveLayout => ({
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
    zoneHeightPx: 440,
    mainGapPx: 24,
});

const createLanController = (): AppRouteProps['lan'] => ({
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
});

const createGameController = (
    overrides: Partial<{
        winner: AppRouteProps['game']['state']['winner'];
        historySource: 'live' | 'replay-import';
        historyLength: number;
        currentIndex: number;
    }> = {}
): AppRouteProps['game'] =>
    ({
        state: {
            winner: overrides.winner ?? null,
            mode: 'LOCAL_PVP',
        },
        handlers: {
            importHistory: vi.fn(),
            startGame: vi.fn(),
        },
        historyControls: {
            historySource: overrides.historySource ?? 'live',
            historyLength: overrides.historyLength ?? 0,
            currentIndex: overrides.currentIndex ?? -1,
        },
        online: {
            peerId: null,
            connectionStatus: 'idle',
            connectToPeer: vi.fn(),
        },
        replay: {
            currentReplay: null,
        },
    }) as unknown as AppRouteProps['game'];

describe('GemDuelBoard replay review state', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderBoard = async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<GemDuelBoard />);
            await Promise.resolve();
        });
    };

    beforeEach(() => {
        mocks.routeProps = null;
        mocks.layout = createLayout();
        mocks.lan = createLanController();
        mocks.game = createGameController();
        mocks.setLocale.mockReset();
        mocks.setSurfaceTheme.mockReset();
        mocks.setDesktopAspectRatio.mockReset();
        mocks.useReplayAutoSave.mockReset();
        mocks.useLanDevVerification.mockReset();
        delete window.electron;
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('auto-enters review mode for imported replays and clears the winner overlay', async () => {
        mocks.game = createGameController({
            winner: 'p1',
            historySource: 'replay-import',
            historyLength: 3,
            currentIndex: 2,
        });

        await renderBoard();

        expect(mocks.routeProps?.ui.isReviewing).toBe(true);
        expect(mocks.routeProps?.ui.persistentWinner).toBeNull();
        expect(mocks.routeProps?.desktopAspectRatio).toBe('16:10');
        expect(mocks.routeProps?.callbacks.selectDesktopAspectRatio).toBe(
            mocks.setDesktopAspectRatio
        );
    });

    it('keeps the winner overlay for the latest live match state', async () => {
        mocks.game = createGameController({
            winner: 'p1',
            historySource: 'live',
            historyLength: 3,
            currentIndex: 2,
        });

        await renderBoard();

        expect(mocks.routeProps?.ui.isReviewing).toBe(false);
        expect(mocks.routeProps?.ui.persistentWinner).toBe('p1');
    });

    it('applies the stored desktop aspect ratio through the Electron bridge when available', async () => {
        const setDesktopAspectRatio = vi.fn(async () => ({
            ratio: '16:10' as const,
            width: 1280,
            height: 800,
            aspectRatio: 16 / 10,
        }));
        window.electron = {
            setDesktopAspectRatio,
        } as unknown as typeof window.electron;

        await renderBoard();

        expect(setDesktopAspectRatio).toHaveBeenCalledWith({ ratio: '16:10' });
    });
});
