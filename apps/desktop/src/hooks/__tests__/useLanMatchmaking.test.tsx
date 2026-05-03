import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
    LanLaunchPayload,
    LanMatchmakingEvent,
    LanMatchmakingState,
} from '@gemduel/shared/types/lan';
import { useLanMatchmaking } from '../useLanMatchmaking';

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

type BridgeListener = (event: LanMatchmakingEvent) => void;
type ElectronBridge = NonNullable<Window['electron']>;

describe('useLanMatchmaking', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useLanMatchmaking> | null = null;
    let listener: BridgeListener | null = null;
    let unsubscribe: ReturnType<typeof vi.fn>;
    let bridge!: ElectronBridge;

    const renderHarness = async () => {
        const Harness = () => {
            currentResult = useLanMatchmaking();
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
        listener = null;
        unsubscribe = vi.fn();
        bridge = {
            getAppVersion: vi.fn(),
            getRuntimeIceServers: vi.fn(),
            getRuntimeRelayProfile: vi.fn(),
            refreshRuntimeRelayProfile: vi.fn(),
            revokeRuntimeRelayProfile: vi.fn(),
            getReleaseHealthSnapshot: vi.fn(),
            getLanMatchmakingState: vi.fn(async () => ({
                ...idleState,
                phase: 'searching',
                statusMessage: 'Searching for opponent on local network...',
            })),
            startLanMatchmaking: vi.fn(async () => ({
                ...idleState,
                phase: 'searching',
                statusMessage: 'Searching for opponent on local network...',
            })),
            cancelLanMatchmaking: vi.fn(async () => idleState),
            setDesktopAspectRatio: vi.fn(async () => ({
                ratio: '16:9',
                width: 1280,
                height: 720,
                aspectRatio: 16 / 9,
            })),
            selectLanPregameMode: vi.fn(async () => ({
                ...idleState,
                phase: 'matched',
                roomId: 'room-1',
                localSeat: 'p1',
                selectedMode: 'classic',
                statusMessage: 'Mode selected. Ready to start.',
            })),
            confirmLanPregameStart: vi.fn(async () => ({
                ...idleState,
                phase: 'starting',
                roomId: 'room-1',
                localSeat: 'p1',
                selectedMode: 'classic',
                statusMessage: 'Connecting LAN duel...',
            })),
            restartApp: vi.fn(),
            reportReleaseHealth: vi.fn(),
            reportLanPeerReady: vi.fn(),
            onUpdateAvailable: vi.fn(),
            onDownloadProgress: vi.fn(),
            onUpdateDownloaded: vi.fn(),
            onLanMatchmakingEvent: vi.fn((callback: BridgeListener) => {
                listener = callback;
                return unsubscribe;
            }),
        } as ElectronBridge;

        Object.defineProperty(window, 'electron', {
            configurable: true,
            value: bridge,
        });
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        currentResult = null;
        reportRendererEvent.mockReset();
        vi.restoreAllMocks();
    });

    it('hydrates from the bridge and reacts to state and launch events', async () => {
        await renderHarness();

        expect(bridge.getLanMatchmakingState).toHaveBeenCalledTimes(1);
        expect(bridge.onLanMatchmakingEvent).toHaveBeenCalledTimes(1);
        expect(currentResult?.state.phase).toBe('searching');

        act(() => {
            listener?.({
                type: 'state',
                state: {
                    ...idleState,
                    phase: 'matched',
                    roomId: 'room-1',
                    remoteInstanceId: 'peer-2',
                    localSeat: 'p2',
                    statusMessage: 'Opponent matched. Randomized seats are ready.',
                },
            });
        });

        expect(currentResult?.state).toMatchObject({
            phase: 'matched',
            roomId: 'room-1',
            remoteInstanceId: 'peer-2',
            localSeat: 'p2',
        });

        const launch: LanLaunchPayload = {
            roomId: 'room-1',
            targetIP: '192.168.1.10',
            targetPort: 9001,
            hostPeerId: 'peer-host',
            transportHost: false,
            hostPlayer: 'p2',
            mode: 'roguelike',
        };

        act(() => {
            listener?.({
                type: 'launch',
                launch,
            });
        });

        expect(currentResult?.launch).toEqual(launch);
        expect(currentResult?.state.phase).toBe('starting');

        act(() => {
            currentResult?.clearLaunch();
        });

        expect(currentResult?.launch).toBeNull();

        act(() => {
            root?.unmount();
        });

        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('forwards LAN search, mode, start, and peer-ready requests through the governed bridge', async () => {
        (bridge.getLanMatchmakingState as ReturnType<typeof vi.fn>).mockResolvedValue({
            ...idleState,
            phase: 'matched',
            roomId: 'room-1',
            localSeat: 'p1',
            statusMessage: 'Opponent matched. Randomized seats are ready.',
        } satisfies LanMatchmakingState);

        await renderHarness();

        await act(async () => {
            await currentResult?.startSearch();
        });
        expect(bridge.startLanMatchmaking).toHaveBeenCalledTimes(1);
        expect(currentResult?.state.phase).toBe('searching');

        await act(async () => {
            listener?.({
                type: 'state',
                state: {
                    ...idleState,
                    phase: 'matched',
                    roomId: 'room-1',
                    localSeat: 'p1',
                    statusMessage: 'Opponent matched. Randomized seats are ready.',
                },
            });
            await Promise.resolve();
        });

        await act(async () => {
            await currentResult?.selectMode('classic');
        });
        expect(bridge.selectLanPregameMode).toHaveBeenCalledWith({
            roomId: 'room-1',
            mode: 'classic',
        });
        expect(currentResult?.state.selectedMode).toBe('classic');

        await act(async () => {
            await currentResult?.confirmStart();
        });
        expect(bridge.confirmLanPregameStart).toHaveBeenCalledWith({
            roomId: 'room-1',
        });
        expect(currentResult?.state.phase).toBe('starting');

        act(() => {
            currentResult?.reportPeerReady({
                roomId: 'room-1',
                peerId: 'peer-host',
            });
        });
        expect(bridge.reportLanPeerReady).toHaveBeenCalledWith({
            roomId: 'room-1',
            peerId: 'peer-host',
        });

        await act(async () => {
            await currentResult?.cancelSearch();
        });
        expect(bridge.cancelLanMatchmaking).toHaveBeenCalledTimes(1);
        expect(currentResult?.state.phase).toBe('idle');
        expect(currentResult?.launch).toBeNull();
    });

    it('falls back cleanly when the Electron bridge or room context is unavailable', async () => {
        Object.defineProperty(window, 'electron', {
            configurable: true,
            value: undefined,
        });

        await renderHarness();

        expect(currentResult?.state).toEqual(idleState);
        await act(async () => {
            await expect(currentResult?.startSearch()).resolves.toEqual(idleState);
            await expect(currentResult?.cancelSearch()).resolves.toEqual(idleState);
            await expect(currentResult?.selectMode('classic')).resolves.toEqual(idleState);
            await expect(currentResult?.confirmStart()).resolves.toEqual(idleState);
        });

        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;

        (bridge.getLanMatchmakingState as ReturnType<typeof vi.fn>).mockResolvedValue({
            ...idleState,
            phase: 'matched',
            roomId: null,
            localSeat: 'p1',
        });
        Object.defineProperty(window, 'electron', {
            configurable: true,
            value: bridge,
        });

        await renderHarness();

        await act(async () => {
            await expect(currentResult?.selectMode('classic')).resolves.toEqual(
                expect.objectContaining({ roomId: null })
            );
            await expect(currentResult?.confirmStart()).resolves.toEqual(
                expect.objectContaining({ roomId: null })
            );
        });

        expect(bridge.selectLanPregameMode).not.toHaveBeenCalled();
        expect(bridge.confirmLanPregameStart).not.toHaveBeenCalled();
    });

    it('reports rejected bridge promises and returns a safe idle state', async () => {
        (bridge.startLanMatchmaking as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
            new Error('ipc unavailable')
        );

        await renderHarness();

        act(() => {
            listener?.({
                type: 'launch',
                launch: {
                    roomId: 'room-1',
                    targetIP: '192.168.1.10',
                    targetPort: 9001,
                    hostPeerId: 'peer-host',
                    transportHost: false,
                    hostPlayer: 'p1',
                    mode: 'classic',
                },
            });
        });
        expect(currentResult?.launch).not.toBeNull();

        await act(async () => {
            await expect(currentResult?.startSearch()).resolves.toMatchObject({
                phase: 'idle',
                errorMessage: 'LAN matchmaking is temporarily unavailable.',
                statusMessage: 'LAN matchmaking request failed.',
            });
        });

        expect(currentResult?.launch).toBeNull();
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'runtime',
                name: 'LAN_MATCHMAKING_IPC_REJECTED',
                severity: 'warn',
                context: {
                    operation: 'startSearch',
                },
            }),
            expect.objectContaining({
                consoleDetails: expect.any(Error),
            })
        );
    });
});
