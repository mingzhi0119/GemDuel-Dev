import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LanMatchmakingState, LanPregameMode } from '@gemduel/shared/types/lan';
import type { MatchmakingRoute } from '../../types/ui';
import { readLanDevVerificationConfig, useLanDevVerification } from '../useLanDevVerification';

const reportRendererEvent = vi.fn();

vi.mock('../../observability/rendererLogger', () => ({
    reportRendererEvent: (...args: unknown[]) => reportRendererEvent(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const idleState: LanMatchmakingState = {
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
};

const flushEffects = async () => {
    await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
    });
};

describe('readLanDevVerificationConfig', () => {
    it('stays disabled without the verification query flag', () => {
        expect(readLanDevVerificationConfig('')).toEqual({ enabled: false });
        expect(readLanDevVerificationConfig('?foo=bar')).toEqual({ enabled: false });
    });

    it('requires a supported LAN mode', () => {
        expect(readLanDevVerificationConfig('?lanHarness=1')).toEqual({ enabled: false });
        expect(readLanDevVerificationConfig('?lanHarness=1&lanMode=invalid')).toEqual({
            enabled: false,
        });
    });

    it('extracts the mode and profile for local dual-instance verification', () => {
        expect(
            readLanDevVerificationConfig('?lanHarness=1&lanMode=classic&lanProfile=alpha')
        ).toEqual({
            enabled: true,
            mode: 'classic',
            profile: 'alpha',
        });
    });
});

describe('useLanDevVerification', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let selectMode: ReturnType<typeof vi.fn>;
    let confirmStart: ReturnType<typeof vi.fn>;
    let startSearch: ReturnType<typeof vi.fn>;
    let setMatchmakingRoute: ReturnType<typeof vi.fn>;

    const renderHarness = async ({
        state,
        matchmakingRoute = 'none',
        search = '',
        historyLength = 0,
        gameMode = 'LOCAL',
    }: {
        state: LanMatchmakingState;
        matchmakingRoute?: MatchmakingRoute;
        search?: string;
        historyLength?: number;
        gameMode?: string;
    }) => {
        window.history.replaceState({}, '', `/${search}`);

        const lan = {
            state,
            startSearch,
            selectMode,
            confirmStart,
        };

        const Harness = () => {
            useLanDevVerification({
                lan,
                matchmakingRoute,
                setMatchmakingRoute,
                historyLength,
                gameMode,
            });
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
            await Promise.resolve();
            await Promise.resolve();
        });
    };

    beforeEach(() => {
        reportRendererEvent.mockReset();
        selectMode = vi.fn().mockResolvedValue(idleState);
        confirmStart = vi.fn().mockResolvedValue(idleState);
        startSearch = vi.fn().mockResolvedValue(idleState);
        setMatchmakingRoute = vi.fn();
        window.history.replaceState({}, '', '/');
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        vi.restoreAllMocks();
    });

    it('auto-enters the LAN route when the verification harness is enabled', async () => {
        await renderHarness({
            state: idleState,
            search: '?lanHarness=1&lanMode=classic&lanProfile=alpha',
        });

        expect(setMatchmakingRoute).toHaveBeenCalledWith('lan');
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'LAN_DEV_VERIFICATION_BOOTSTRAP',
            }),
            expect.objectContaining({
                consoleMessage: expect.stringContaining('Auto-entering LAN queue'),
            })
        );
    });

    it('has randomized P1 automatically select the configured mode', async () => {
        await renderHarness({
            state: {
                ...idleState,
                phase: 'matched',
                roomId: 'room-1',
                localSeat: 'p1',
                transportHost: false,
                selectedMode: null,
            },
            matchmakingRoute: 'lan',
            search: '?lanHarness=1&lanMode=roguelike&lanProfile=alpha',
        });

        await flushEffects();

        expect(selectMode).toHaveBeenCalledWith('roguelike');
        expect(confirmStart).not.toHaveBeenCalled();
    });

    it('auto-confirms start exactly once when the randomized P1 is ready', async () => {
        const matchedReadyState: LanMatchmakingState = {
            ...idleState,
            phase: 'matched',
            roomId: 'room-1',
            localSeat: 'p1',
            transportHost: true,
            selectedMode: 'classic',
            hostPeerId: 'peer-host',
        };

        await renderHarness({
            state: matchedReadyState,
            matchmakingRoute: 'lan',
            search: '?lanHarness=1&lanMode=classic&lanProfile=beta',
        });

        await flushEffects();

        expect(confirmStart).toHaveBeenCalledTimes(1);
        expect(selectMode).not.toHaveBeenCalled();
    });

    it('reports a successful online start only once after the match begins', async () => {
        await renderHarness({
            state: {
                ...idleState,
                phase: 'starting',
                roomId: 'room-9',
                localSeat: 'p2',
                selectedMode: 'classic',
            },
            matchmakingRoute: 'lan',
            search: '?lanHarness=1&lanMode=classic&lanProfile=gamma',
            historyLength: 1,
            gameMode: 'ONLINE_MULTIPLAYER',
        });

        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'LAN_DEV_VERIFICATION_STARTED',
            }),
            expect.objectContaining({
                consoleMessage: expect.stringContaining('STARTED room=room-9'),
            })
        );
    });
});
