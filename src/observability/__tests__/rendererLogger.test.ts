import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ElectronBridge } from '../../types/desktop';
import type { RuntimeRelayProfile } from '../../types/runtime';
import { reportReleaseHealth } from '../releaseHealth';
import { logRendererMessage, reportRendererEvent } from '../rendererLogger';

const createRuntimeRelayProfile = (expiresAt: string | null): RuntimeRelayProfile => ({
    policyVersion: 1,
    source: 'runtime-ice-fallback',
    iceServers: [],
    issuedAt: '2026-04-20T00:00:00.000Z',
    expiresAt,
});

const createElectronBridgeMock = (overrides: Partial<ElectronBridge> = {}): ElectronBridge => ({
    getAppVersion: vi.fn(async () => '5.2.11'),
    getRuntimeIceServers: vi.fn(async () => []),
    getRuntimeRelayProfile: vi.fn(async () =>
        createRuntimeRelayProfile('2026-04-20T00:01:00.000Z')
    ),
    refreshRuntimeRelayProfile: vi.fn(async () =>
        createRuntimeRelayProfile('2026-04-20T00:01:00.000Z')
    ),
    revokeRuntimeRelayProfile: vi.fn(async () => createRuntimeRelayProfile(null)),
    getReleaseHealthSnapshot: vi.fn(async () => ({
        startedAt: '2026-04-20T00:00:00.000Z',
        lastEventAt: null,
        totalEvents: 0,
        severityCounts: { info: 0, warn: 0, error: 0 },
        indicators: {
            startupFailures: 0,
            runtimeConfigFailures: 0,
            updaterFailures: 0,
            peerFailures: 0,
            recoveryRequests: 0,
            ipcRejected: 0,
        },
        reasonCodeCounts: {},
        counters: {},
        recentEvents: [],
    })),
    restartApp: vi.fn(),
    reportReleaseHealth: vi.fn(),
    onUpdateAvailable: vi.fn(() => () => undefined),
    onDownloadProgress: vi.fn(() => () => undefined),
    onUpdateDownloaded: vi.fn(() => () => undefined),
    ...overrides,
});

describe('renderer observability', () => {
    beforeEach(() => {
        vi.spyOn(console, 'info').mockImplementation(() => undefined);
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        window.electron = createElectronBridgeMock({
            reportReleaseHealth: vi.fn(),
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete window.electron;
    });

    it('routes renderer events through the governed telemetry bridge and mirrors warn logs', () => {
        reportRendererEvent({
            category: 'network',
            name: 'NETWORK_MESSAGE_REJECTED',
            severity: 'warn',
            message: 'Rejected malformed message.',
        });

        expect(window.electron?.reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                source: 'renderer',
                category: 'network',
                name: 'NETWORK_MESSAGE_REJECTED',
                severity: 'warn',
            })
        );
        expect(console.warn).toHaveBeenCalledWith('Rejected malformed message.');
    });

    it('falls back to console when the release-health bridge throws and still emits explicit error logs', () => {
        window.electron = createElectronBridgeMock({
            reportReleaseHealth: vi.fn(() => {
                throw new Error('bridge unavailable');
            }),
        });

        logRendererMessage('error', 'renderer failed', {
            reason: 'test',
        });
        reportReleaseHealth({
            category: 'runtime',
            name: 'APP_RUNTIME_CONFIG_FAILED',
            severity: 'error',
            message: 'Runtime config failed.',
        });

        expect(console.error).toHaveBeenCalledWith('renderer failed', {
            reason: 'test',
        });
        expect(console.error).toHaveBeenCalledWith(
            '[RELEASE_HEALTH] Failed to forward renderer event.',
            expect.any(Error)
        );
    });

    it('uses severity-matched fallback logs when the release-health bridge throws for warn and info events', () => {
        window.electron = createElectronBridgeMock({
            reportReleaseHealth: vi.fn(() => {
                throw new Error('bridge unavailable');
            }),
        });

        reportReleaseHealth({
            category: 'network',
            name: 'NETWORK_MESSAGE_REJECTED',
            severity: 'warn',
            message: 'Network warning.',
        });
        reportReleaseHealth({
            category: 'startup',
            name: 'WINDOW_LOADED',
            severity: 'info',
            message: 'Startup info.',
        });

        expect(console.warn).toHaveBeenCalledWith(
            '[RELEASE_HEALTH] Failed to forward renderer event.',
            expect.any(Error)
        );
        expect(console.info).toHaveBeenCalledWith(
            '[RELEASE_HEALTH] Failed to forward renderer event.',
            expect.any(Error)
        );
    });

    it('returns early when the window bridge is unavailable', () => {
        const originalWindow = globalThis.window;

        try {
            Object.defineProperty(globalThis, 'window', {
                configurable: true,
                value: undefined,
            });

            expect(() =>
                reportReleaseHealth({
                    category: 'startup',
                    name: 'WINDOW_LOADED',
                    severity: 'info',
                    message: 'No window bridge.',
                })
            ).not.toThrow();
        } finally {
            Object.defineProperty(globalThis, 'window', {
                configurable: true,
                value: originalWindow,
            });
        }
    });
});
