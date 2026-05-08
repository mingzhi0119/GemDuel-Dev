import { useCallback, useEffect, useRef, useState } from 'react';
import { DataConnection, Peer } from 'peerjs';
import type { GameState } from '@gemduel/shared/types';
import type { ReplayFullSync, ReplaySync } from '@gemduel/shared/replay';
import type {
    BootstrapCommand,
    GuestIntentCommand,
    HostDecisionMessage,
    NetworkMessage,
    NetworkSyncReason,
    RecoveryReason,
} from '@gemduel/shared/types/network';
import { NETWORK_PROTOCOL_VERSION } from '@gemduel/shared/types/network';
import { createRemoteMultiplayerViewForHost } from '@gemduel/shared/logic/multiplayerVisibility';
import { useConnectionHealth } from './useConnectionHealth';
import { createReasonTelemetryContext } from '@gemduel/shared/logic/reasonCatalog';
import { logRendererMessage, reportRendererEvent } from '../observability/rendererLogger';
import { registerConnectionHandlers } from './onlineManager/connectionHandlers';
import { createManagedPeer, destroyManagedPeer } from './onlineManager/peerLifecycle';
import type { OnlineManagerController, OnlineManagerHandlers } from './onlineManager/types';

export type { OnlineManagerController, OnlineManagerHandlers } from './onlineManager/types';

const MAX_RECONNECT_ATTEMPTS = 5;

export const useOnlineManager = (
    handlers: OnlineManagerHandlers,
    enabled: boolean = false,
    getCurrentStateRef?: () => GameState,
    getCurrentReplayFullSyncRef?: () => ReplayFullSync | null,
    targetIP: string = 'localhost',
    targetPort: number = 9000
): OnlineManagerController => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [conn, setConn] = useState<DataConnection | null>(null);
    const [peerId, setPeerId] = useState<string>('');
    const [remotePeerId, setRemotePeerId] = useState<string>('');
    const [connectionStatus, setConnectionStatus] = useState<
        'disconnected' | 'connecting' | 'connected'
    >('disconnected');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);

    const handlersRef = useRef(handlers);
    const isHostRef = useRef(isHost);
    const connectionStatusRef = useRef(connectionStatus);
    const reconnectAttempts = useRef(0);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        handlersRef.current = handlers;
    }, [handlers]);

    useEffect(() => {
        isHostRef.current = isHost;
    }, [isHost]);

    useEffect(
        () => () => {
            if (connectTimeoutRef.current) {
                clearTimeout(connectTimeoutRef.current);
                connectTimeoutRef.current = null;
            }
        },
        []
    );

    useEffect(() => {
        connectionStatusRef.current = connectionStatus;
        if (connectionStatus === 'connected' && connectTimeoutRef.current) {
            clearTimeout(connectTimeoutRef.current);
            connectTimeoutRef.current = null;
        }
    }, [connectionStatus]);

    const clearError = useCallback(() => setErrorMessage(null), []);

    const sendMessage = useCallback(
        (msg: NetworkMessage) => {
            if (conn && conn.open) {
                conn.send(msg);
            }
        },
        [conn]
    );

    const requestRecovery = useCallback(
        (reason: RecoveryReason, requestId?: string) => {
            reportRendererEvent({
                category: 'recovery',
                name: 'RECOVERY_REQUEST_SENT',
                severity: 'warn',
                message: 'Client requested an authoritative recovery snapshot.',
                context: createReasonTelemetryContext(reason, {
                    requestId,
                }),
            });
            sendMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'RECOVERY_REQUEST',
                reason,
                requestId,
            });
        },
        [sendMessage]
    );

    const { latency, isUnstable, handleHeartbeat } = useConnectionHealth(
        conn,
        sendMessage,
        requestRecovery
    );

    const setupConnection = useCallback(
        (connection: DataConnection) => {
            registerConnectionHandlers({
                connection,
                handlersRef,
                isHostRef,
                reconnectAttempts,
                getCurrentStateRef,
                getCurrentReplayFullSyncRef,
                handleHeartbeat,
                sendMessage,
                setConn,
                setRemotePeerId,
                setConnectionStatus,
                setErrorMessage,
            });
        },
        [getCurrentReplayFullSyncRef, getCurrentStateRef, handleHeartbeat, sendMessage]
    );

    const setupConnectionRef = useRef(setupConnection);
    useEffect(() => {
        setupConnectionRef.current = setupConnection;
    }, [setupConnection]);

    useEffect(() => {
        if (!enabled) {
            logRendererMessage('info', '[NET] Manager disabled, skipping peer init.');
            return;
        }

        const managedPeer = createManagedPeer({
            targetIP,
            targetPort,
            maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
            isHostRef,
            reconnectAttempts,
            reconnectTimeoutRef,
            setupConnection: (connection) => setupConnectionRef.current(connection),
            setPeerId,
            setIsHost,
            setConnectionStatus,
            setRemotePeerId,
            setErrorMessage,
        });

        setPeer(managedPeer);

        return () => {
            destroyManagedPeer(
                managedPeer,
                reconnectTimeoutRef,
                setPeer,
                setPeerId,
                setConnectionStatus,
                setRemotePeerId
            );
        };
    }, [enabled, targetIP, targetPort]);

    const connectToPeer = useCallback(
        (id: string) => {
            const trimmedId = id.trim();
            if (!trimmedId) {
                setErrorMessage('Paste an opponent Match ID before connecting.');
                return;
            }

            if (!peer) {
                setConnectionStatus('disconnected');
                setErrorMessage(
                    'Online service is still starting. Wait for your Match ID, then try again.'
                );
                reportRendererEvent(
                    {
                        category: 'peer',
                        name: 'PEER_CONNECT_ATTEMPT_REJECTED',
                        severity: 'error',
                        message:
                            'Outgoing peer connection was attempted before the local peer was ready.',
                    },
                    {
                        consoleMessage: '[NET] Cannot connect: Peer instance not ready.',
                    }
                );
                return;
            }
            if (connectTimeoutRef.current) {
                clearTimeout(connectTimeoutRef.current);
            }
            setErrorMessage(null);
            setConnectionStatus('connecting');
            isHostRef.current = false;
            reportRendererEvent({
                category: 'peer',
                name: 'PEER_CONNECT_REQUESTED',
                severity: 'info',
                message: 'Outgoing peer connection was requested.',
                context: {
                    remotePeerId: trimmedId,
                },
            });
            const connection = peer.connect(trimmedId);
            setupConnectionRef.current(connection);
            setIsHost(false);
            connectTimeoutRef.current = setTimeout(() => {
                if (connectionStatusRef.current !== 'connecting') {
                    return;
                }
                setConnectionStatus('disconnected');
                setErrorMessage('Connection timed out. Check the Match ID and try again.');
            }, 8000);
        },
        [peer]
    );

    const sendBootstrap = useCallback(
        (command: BootstrapCommand, checksum?: string) => {
            sendMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'BOOTSTRAP_STATE',
                command,
                checksum,
            });
        },
        [sendMessage]
    );

    const sendGuestIntent = useCallback(
        (requestId: string, command: GuestIntentCommand) => {
            sendMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'GUEST_INTENT',
                requestId,
                command,
            });
        },
        [sendMessage]
    );

    const sendHostDecision = useCallback(
        (decision: Omit<HostDecisionMessage, 'type' | 'version'>) => {
            sendMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                ...decision,
            });
        },
        [sendMessage]
    );

    const sendState = useCallback(
        (state: GameState, reason: NetworkSyncReason = 'TURN_SYNC', replaySync?: ReplaySync) => {
            const shouldRedactForGuest = state.mode === 'ONLINE_MULTIPLAYER' && state.isHost;
            const snapshot = shouldRedactForGuest
                ? createRemoteMultiplayerViewForHost(state)
                : state;
            sendMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'SYNC_STATE',
                snapshot,
                reason,
                ...(!shouldRedactForGuest && replaySync ? { replaySync } : {}),
            });
        },
        [sendMessage]
    );

    return {
        peerId,
        remotePeerId,
        connectionStatus,
        isHost,
        errorMessage,
        connectToPeer,
        clearError,
        sendBootstrap,
        sendGuestIntent,
        sendHostDecision,
        sendState,
        requestRecovery,
        latency,
        isUnstable,
    };
};
