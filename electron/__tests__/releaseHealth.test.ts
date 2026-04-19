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
            category: 'recovery',
            name: 'RECOVERY_REQUEST_SENT',
            severity: 'warn',
            message: 'Requested recovery.',
            context: {
                requestId: 'guest-123',
            },
        });

        const snapshot = monitor.getSnapshot();
        expect(snapshot.totalEvents).toBe(3);
        expect(snapshot.severityCounts).toEqual({
            info: 1,
            warn: 1,
            error: 1,
        });
        expect(snapshot.indicators).toMatchObject({
            runtimeConfigFailures: 1,
            recoveryRequests: 1,
        });
        expect(snapshot.recentEvents[1]?.context?.targetIp).toBe('[REDACTED]');
        expect(snapshot.recentEvents[0]?.context?.requestId).toBe('[REDACTED]');
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.warn).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledTimes(1);
    });
});
