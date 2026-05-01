import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ElectronBridge, RuntimeRelayProfile } from '@gemduel/shared/types';
import { useRuntimeAppConfig } from '../useRuntimeAppConfig';

const setRuntimeRelayProfile = vi.fn();
const setRuntimeIceServers = vi.fn();
const reportReleaseHealth = vi.fn();
type RuntimeAppConfigResult = {
    appVersion: string;
};

vi.mock('@gemduel/shared/config/webrtc', () => ({
    setRuntimeRelayProfile: (...args: unknown[]) => setRuntimeRelayProfile(...args),
    setRuntimeIceServers: (...args: unknown[]) => setRuntimeIceServers(...args),
}));

vi.mock('../../../observability/releaseHealth', () => ({
    reportReleaseHealth: (...args: unknown[]) => reportReleaseHealth(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const DEFAULT_STUN_PROFILE: RuntimeRelayProfile = {
    policyVersion: 1,
    source: 'default-stun',
    iceServers: [],
    issuedAt: null,
    expiresAt: null,
};

const createElectronBridgeMock = (overrides: Partial<ElectronBridge> = {}): ElectronBridge => ({
    getAppVersion: vi.fn().mockResolvedValue('5.2.12'),
    getRuntimeIceServers: vi.fn().mockResolvedValue([]),
    getRuntimeRelayProfile: vi.fn().mockResolvedValue(DEFAULT_STUN_PROFILE),
    refreshRuntimeRelayProfile: vi.fn().mockResolvedValue(DEFAULT_STUN_PROFILE),
    revokeRuntimeRelayProfile: vi.fn().mockResolvedValue(DEFAULT_STUN_PROFILE),
    getReleaseHealthSnapshot: vi.fn(),
    getLanMatchmakingState: vi.fn().mockResolvedValue({
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
    }),
    startLanMatchmaking: vi.fn().mockResolvedValue({
        phase: 'searching',
        roomId: null,
        remoteInstanceId: null,
        remoteAddress: null,
        hostPort: null,
        transportHost: false,
        localSeat: null,
        selectedMode: null,
        hostPeerId: null,
        errorMessage: null,
        statusMessage: 'Searching for opponent on local network...',
    }),
    cancelLanMatchmaking: vi.fn().mockResolvedValue({
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
    }),
    setDesktopAspectRatio: vi.fn().mockResolvedValue({
        ratio: '16:9',
        width: 1280,
        height: 720,
        aspectRatio: 16 / 9,
    }),
    selectLanPregameMode: vi.fn().mockResolvedValue({
        phase: 'matched',
        roomId: 'room',
        remoteInstanceId: 'peer',
        remoteAddress: '192.168.1.10',
        hostPort: 9001,
        transportHost: true,
        localSeat: 'p1',
        selectedMode: 'classic',
        hostPeerId: null,
        errorMessage: null,
        statusMessage: 'Mode selected. Ready to start.',
    }),
    confirmLanPregameStart: vi.fn().mockResolvedValue({
        phase: 'starting',
        roomId: 'room',
        remoteInstanceId: 'peer',
        remoteAddress: '192.168.1.10',
        hostPort: 9001,
        transportHost: true,
        localSeat: 'p1',
        selectedMode: 'classic',
        hostPeerId: 'peer-host',
        errorMessage: null,
        statusMessage: 'Connecting LAN duel...',
    }),
    restartApp: vi.fn(),
    reportReleaseHealth: vi.fn(),
    reportLanPeerReady: vi.fn(),
    onLanMatchmakingEvent: vi.fn(() => () => undefined),
    onUpdateAvailable: vi.fn(() => () => undefined),
    onDownloadProgress: vi.fn(() => () => undefined),
    onUpdateDownloaded: vi.fn(() => () => undefined),
    ...overrides,
});

const flushEffects = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

describe('useRuntimeAppConfig', () => {
    let container: HTMLDivElement | null = null;
    let root: Root | null = null;

    beforeEach(() => {
        vi.useRealTimers();
        setRuntimeRelayProfile.mockReset();
        setRuntimeIceServers.mockReset();
        reportReleaseHealth.mockReset();
        delete window.electron;
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        vi.useRealTimers();
        delete window.electron;
    });

    it('loads the governed relay profile, refreshes it near expiry, and revokes it on cleanup', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-04-20T12:00:00.000Z'));

        const initialRelayProfile: RuntimeRelayProfile = {
            policyVersion: 1,
            source: 'online-turn-service',
            iceServers: [
                {
                    urls: ['turns:relay.example.com:443?transport=tcp'],
                    username: 'lease-user',
                    credential: 'lease-pass',
                },
            ],
            issuedAt: '2026-04-20T12:00:00.000Z',
            expiresAt: '2026-04-20T12:00:45.000Z',
        };
        const refreshedRelayProfile: RuntimeRelayProfile = {
            ...initialRelayProfile,
            issuedAt: '2026-04-20T12:00:15.000Z',
            expiresAt: '2026-04-20T12:01:15.000Z',
        };
        const refreshRuntimeRelayProfile = vi
            .fn<() => Promise<RuntimeRelayProfile>>()
            .mockResolvedValue(refreshedRelayProfile);
        const revokeRuntimeRelayProfile = vi
            .fn<() => Promise<RuntimeRelayProfile>>()
            .mockResolvedValue(DEFAULT_STUN_PROFILE);
        let latestResult: RuntimeAppConfigResult | null = null;

        window.electron = createElectronBridgeMock({
            getRuntimeIceServers: vi.fn().mockResolvedValue([{ urls: 'stun:legacy.example.com' }]),
            getRuntimeRelayProfile: vi.fn().mockResolvedValue(initialRelayProfile),
            refreshRuntimeRelayProfile,
            revokeRuntimeRelayProfile,
        });

        const Harness = () => {
            latestResult = useRuntimeAppConfig();
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        await flushEffects();

        expect(latestResult).not.toBeNull();
        expect(latestResult!.appVersion).toBe('5.2.12');
        expect(setRuntimeRelayProfile).toHaveBeenCalledWith(initialRelayProfile);
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'ICE_PROFILE_LOADED',
            })
        );
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'APP_RUNTIME_CONFIG_LOADED',
            })
        );

        await act(async () => {
            vi.advanceTimersByTime(15_000);
            await Promise.resolve();
        });

        expect(refreshRuntimeRelayProfile).toHaveBeenCalledTimes(1);
        expect(setRuntimeRelayProfile).toHaveBeenLastCalledWith(refreshedRelayProfile);
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'ICE_PROFILE_REFRESHED',
            })
        );

        act(() => {
            root?.unmount();
        });

        expect(revokeRuntimeRelayProfile).toHaveBeenCalledTimes(1);
    });

    it('falls back to the legacy ICE bridge when no governed relay profile is returned', async () => {
        window.electron = createElectronBridgeMock({
            getRuntimeIceServers: vi.fn().mockResolvedValue([{ urls: 'stun:legacy.example.com' }]),
            getRuntimeRelayProfile: vi.fn().mockResolvedValue(null),
        });

        const Harness = () => {
            useRuntimeAppConfig();
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        await flushEffects();

        expect(setRuntimeRelayProfile).not.toHaveBeenCalled();
        expect(setRuntimeIceServers).toHaveBeenCalledWith([{ urls: 'stun:legacy.example.com' }]);
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'ICE_PROFILE_FALLBACK',
            })
        );
    });

    it('reports configuration load failure without mutating runtime state', async () => {
        window.electron = createElectronBridgeMock({
            getRuntimeIceServers: vi.fn().mockResolvedValue([{ urls: 'stun:legacy.example.com' }]),
            getRuntimeRelayProfile: vi.fn().mockRejectedValue(new Error('boom')),
        });

        const Harness = () => {
            useRuntimeAppConfig();
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        await flushEffects();

        expect(setRuntimeRelayProfile).not.toHaveBeenCalled();
        expect(setRuntimeIceServers).not.toHaveBeenCalled();
        expect(reportReleaseHealth).toHaveBeenCalledTimes(1);
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'APP_RUNTIME_CONFIG_FAILED',
            })
        );
    });

    it('does not schedule a relay refresh when the governed profile expiry is missing or invalid', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-04-20T12:00:00.000Z'));

        window.electron = createElectronBridgeMock({
            getRuntimeIceServers: vi.fn().mockResolvedValue([]),
            getRuntimeRelayProfile: vi.fn().mockResolvedValue({
                policyVersion: 1,
                source: 'online-turn-service',
                iceServers: [],
                issuedAt: '2026-04-20T12:00:00.000Z',
                expiresAt: 'not-a-date',
            }),
        });

        const Harness = () => {
            useRuntimeAppConfig();
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        await flushEffects();

        await act(async () => {
            vi.advanceTimersByTime(60_000);
            await Promise.resolve();
        });

        expect(window.electron?.refreshRuntimeRelayProfile).not.toHaveBeenCalled();
    });

    it('reports refresh failure when the scheduled governed relay refresh rejects', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-04-20T12:00:00.000Z'));

        window.electron = createElectronBridgeMock({
            getRuntimeIceServers: vi.fn().mockResolvedValue([]),
            getRuntimeRelayProfile: vi.fn().mockResolvedValue({
                policyVersion: 1,
                source: 'online-turn-service',
                iceServers: [],
                issuedAt: '2026-04-20T12:00:00.000Z',
                expiresAt: '2026-04-20T12:00:31.000Z',
            }),
            refreshRuntimeRelayProfile: vi.fn().mockRejectedValue(new Error('refresh failed')),
        });

        const Harness = () => {
            useRuntimeAppConfig();
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        await flushEffects();

        await act(async () => {
            vi.advanceTimersByTime(2_000);
            await Promise.resolve();
        });

        expect(window.electron?.refreshRuntimeRelayProfile).toHaveBeenCalledTimes(1);
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'ICE_PROFILE_REFRESH_FAILED',
                severity: 'error',
            })
        );
    });
});
