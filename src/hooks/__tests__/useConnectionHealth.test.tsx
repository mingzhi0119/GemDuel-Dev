import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { DataConnection } from 'peerjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConnectionHealth } from '../useConnectionHealth';
import { NETWORK_PROTOCOL_VERSION, type NetworkMessage } from '../../types/network';

const reportReleaseHealth = vi.fn();

vi.mock('../../observability/releaseHealth', () => ({
    reportReleaseHealth: (...args: unknown[]) => reportReleaseHealth(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useConnectionHealth', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-04-19T00:00:00.000Z'));
        reportReleaseHealth.mockReset();
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        vi.useRealTimers();
    });

    it('marks the connection unstable after missed heartbeats and reports restoration on pong', () => {
        const sendMessage = vi.fn<(message: NetworkMessage) => void>();
        const connection = { open: true } as DataConnection;
        let currentResult: ReturnType<typeof useConnectionHealth> | null = null;

        const Harness = () => {
            currentResult = useConnectionHealth(connection, sendMessage);
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        act(() => {
            vi.advanceTimersByTime(8000);
        });

        expect(sendMessage).toHaveBeenCalledTimes(4);
        expect(sendMessage).toHaveBeenLastCalledWith({
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HEARTBEAT_PING',
            timestamp: Date.now(),
        });
        expect(currentResult?.isUnstable).toBe(true);
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'HEARTBEAT_TIMEOUT',
                severity: 'warn',
            })
        );

        act(() => {
            currentResult?.handleHeartbeat({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PONG',
                timestamp: Date.now() - 42,
            });
        });

        expect(currentResult?.isUnstable).toBe(false);
        expect(currentResult?.latency).toBe(42);
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'HEARTBEAT_RESTORED',
                severity: 'info',
            })
        );
    });

    it('answers heartbeat pings with a pong message', () => {
        const sendMessage = vi.fn<(message: NetworkMessage) => void>();
        const connection = { open: true } as DataConnection;
        let currentResult: ReturnType<typeof useConnectionHealth> | null = null;

        const Harness = () => {
            currentResult = useConnectionHealth(connection, sendMessage);
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        act(() => {
            currentResult?.handleHeartbeat({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PING',
                timestamp: 123,
            });
        });

        expect(sendMessage).toHaveBeenCalledWith({
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HEARTBEAT_PONG',
            timestamp: 123,
        });
    });
});
