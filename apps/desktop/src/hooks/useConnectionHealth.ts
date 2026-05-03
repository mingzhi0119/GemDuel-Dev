import { useCallback, useEffect, useRef, useState } from 'react';
import { DataConnection } from 'peerjs';
import {
    HeartbeatMessage,
    NETWORK_PROTOCOL_VERSION,
    NetworkMessage,
} from '@gemduel/shared/types/network';
import type { RecoveryReason } from '@gemduel/shared/types/network';
import { reportRendererEvent } from '../observability/rendererLogger';

const PING_INTERVAL_MS = 2000;
const TIMEOUT_THRESHOLD_MS = 6000; // Missed 3 pings = trouble

export const useConnectionHealth = (
    connection: DataConnection | null,
    sendMessage: (msg: NetworkMessage) => void,
    requestRecovery?: (reason: RecoveryReason) => void
) => {
    const [latency, setLatency] = useState<number>(0);
    const [isUnstable, setIsUnstable] = useState(false);
    const lastPongRef = useRef<number>(Date.now());
    const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const unstableReportedRef = useRef(false);

    // 1. Heartbeat Loop
    useEffect(() => {
        if (!connection || !connection.open) return;

        // Reset timer on connection open
        lastPongRef.current = Date.now();

        pingIntervalRef.current = setInterval(() => {
            const now = Date.now();

            // Check for timeout
            if (now - lastPongRef.current > TIMEOUT_THRESHOLD_MS) {
                setIsUnstable(true);
                if (!unstableReportedRef.current) {
                    unstableReportedRef.current = true;
                    reportRendererEvent(
                        {
                            category: 'network',
                            name: 'HEARTBEAT_TIMEOUT',
                            severity: 'warn',
                            message: 'Connection became unstable after missed heartbeat responses.',
                            context: {
                                timeoutMs: TIMEOUT_THRESHOLD_MS,
                            },
                        },
                        {
                            consoleMessage: '[NET] Connection unstable: No PONG received.',
                        }
                    );
                    requestRecovery?.('HEARTBEAT_TIMEOUT');
                }
            } else {
                setIsUnstable(false);
                if (unstableReportedRef.current) {
                    unstableReportedRef.current = false;
                    reportRendererEvent({
                        category: 'network',
                        name: 'HEARTBEAT_RESTORED',
                        severity: 'info',
                        message: 'Connection heartbeat recovered after an unstable period.',
                    });
                }
            }

            sendMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PING',
                timestamp: now,
            });
        }, PING_INTERVAL_MS);

        return () => {
            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
            unstableReportedRef.current = false;
        };
    }, [connection, requestRecovery, sendMessage]);

    // 2. Message Handler (Call this from useOnlineManager when data arrives)
    const handleHeartbeat = useCallback(
        (msg: HeartbeatMessage) => {
            if (msg.type === 'HEARTBEAT_PING') {
                sendMessage({
                    version: NETWORK_PROTOCOL_VERSION,
                    type: 'HEARTBEAT_PONG',
                    timestamp: msg.timestamp,
                });
            } else if (msg.type === 'HEARTBEAT_PONG') {
                const rtt = Date.now() - msg.timestamp;
                setLatency(rtt);
                lastPongRef.current = Date.now();
                setIsUnstable(false);
                if (unstableReportedRef.current) {
                    unstableReportedRef.current = false;
                    reportRendererEvent({
                        category: 'network',
                        name: 'HEARTBEAT_RESTORED',
                        severity: 'info',
                        message: 'Connection heartbeat recovered after receiving a PONG.',
                        context: {
                            latencyMs: rtt,
                        },
                    });
                }
            }
        },
        [sendMessage]
    );

    return { latency, isUnstable, handleHeartbeat };
};
