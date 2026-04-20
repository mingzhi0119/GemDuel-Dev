// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { createReleaseHealthMonitor, sanitizeReleaseHealthContext } from '../releaseHealth.js';

describe('electron release health monitor', () => {
    it('redacts sensitive context values before persistence', () => {
        expect(
            sanitizeReleaseHealthContext({
                peerId: 'peer-123',
                requestId: 'request-123',
                safeFlag: true,
                note: 'ok',
            })
        ).toEqual({
            peerId: '[REDACTED]',
            requestId: '[REDACTED]',
            safeFlag: true,
            note: 'ok',
        });
    });

    it('tracks severity counts and release-health indicators', () => {
        const logger = {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };
        let timestamp = 1_000;
        const monitor = createReleaseHealthMonitor({
            logger,
            now: () => timestamp++,
        });

        monitor.record({
            source: 'main',
            category: 'startup',
            name: 'APP_BOOT',
            severity: 'info',
            message: 'Booted.',
        });
        monitor.record({
            source: 'renderer',
            category: 'runtime',
            name: 'APP_RUNTIME_CONFIG_FAILED',
            severity: 'error',
            message: 'Failed to load runtime config.',
            context: {
                targetIp: '10.0.0.1',
            },
        });
        monitor.record({
            source: 'main',
            category: 'startup',
            name: 'APP_BOOT_FAILED',
            severity: 'error',
            message: 'Startup failed.',
        });
        monitor.record({
            source: 'main',
            category: 'updater',
            name: 'UPDATER_CHECK_FAILED',
            severity: 'error',
            message: 'Updater failed.',
        });
        monitor.record({
            source: 'main',
            category: 'peer',
            name: 'PEER_CONNECTION_ERROR',
            severity: 'error',
            message: 'Peer error.',
        });
        monitor.record({
            source: 'main',
            category: 'recovery',
            name: 'RECOVERY_REQUEST_SENT',
            severity: 'warn',
            message: 'Requested recovery.',
            context: {
                reasonCode: 'CHECKSUM_MISMATCH',
                requestId: 'guest-123',
            },
        });
        monitor.record({
            source: 'main',
            category: 'runtime',
            name: 'TURN_CREDENTIAL_REFRESH_FAILED',
            severity: 'warn',
            message: 'TURN refresh failed.',
            context: {
                reasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
                token: 'turn-token',
                credential: 'turn-credential',
                url: 'https://relay.example.com/turn/refresh',
            },
        });

        const snapshot = monitor.getSnapshot();
        expect(snapshot.totalEvents).toBe(7);
        expect(snapshot.severityCounts).toEqual({
            info: 1,
            warn: 2,
            error: 4,
        });
        expect(snapshot.indicators).toMatchObject({
            startupFailures: 1,
            runtimeConfigFailures: 1,
            updaterFailures: 1,
            peerFailures: 1,
            recoveryRequests: 1,
            ipcRejected: 0,
        });
        expect(snapshot.reasonCodeCounts).toEqual({
            CHECKSUM_MISMATCH: 1,
            TURN_CREDENTIAL_REFRESH_FAILED: 1,
        });
        expect(snapshot.recentEvents[5]?.context?.targetIp).toBe('[REDACTED]');
        expect(snapshot.recentEvents[1]?.context?.requestId).toBe('[REDACTED]');
        expect(snapshot.recentEvents[0]?.context?.token).toBe('[REDACTED]');
        expect(snapshot.recentEvents[0]?.context?.credential).toBe('[REDACTED]');
        expect(snapshot.recentEvents[0]?.context?.url).toBe('[REDACTED]');
        expect(logger.error).toHaveBeenCalledTimes(4);
        expect(logger.warn).toHaveBeenCalledTimes(2);
        expect(logger.info).toHaveBeenCalledTimes(1);
    });

    it('truncates overly long safe strings without redacting non-sensitive keys', () => {
        const logger = {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };
        const monitor = createReleaseHealthMonitor({
            logger,
            now: () => 10_000,
        });
        const longNote = 'x'.repeat(140);

        monitor.record({
            source: 'renderer',
            category: 'network',
            name: 'NETWORK_DIRECTION_REJECTED',
            severity: 'warn',
            message: 'Rejected direction.',
            context: {
                note: longNote,
            },
        });

        expect(monitor.getSnapshot().recentEvents[0]?.context?.note).toBe(`${'x'.repeat(120)}…`);
    });
});
