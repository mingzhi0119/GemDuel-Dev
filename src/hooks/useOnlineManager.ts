import { useState, useEffect, useCallback, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';
import type { GameState } from '../types';
import type {
    BootstrapCommand,
    GuestIntentCommand,
    HostDecisionMessage,
    NetworkMessage,
    NetworkSyncReason,
    RecoveryReason,
} from '../types/network';
import { NETWORK_PROTOCOL_VERSION } from '../types/network';
import { createPeerConfig } from '../config/webrtc';
import { useConnectionHealth } from './useConnectionHealth';
import { parseNetworkMessage } from '../logic/actionValidation';
import { getInboundMessageCheck } from '../logic/networkProtocol';

export interface OnlineManagerHandlers {
    onBootstrapReceived: (command: BootstrapCommand, checksum?: string) => void;
    onStateReceived: (state: GameState, reason: NetworkSyncReason) => void;
    onGuestIntentReceived: (requestId: string, command: GuestIntentCommand) => void;
    onHostDecisionReceived: (decision: HostDecisionMessage) => void;
}

export interface OnlineManagerController {
    peerId: string;
    remotePeerId: string;
    connectionStatus: 'disconnected' | 'connecting' | 'connected';
    isHost: boolean;
    connectToPeer: (id: string) => void;
    sendBootstrap: (command: BootstrapCommand, checksum?: string) => void;
    sendGuestIntent: (requestId: string, command: GuestIntentCommand) => void;
    sendHostDecision: (decision: Omit<HostDecisionMessage, 'type' | 'version'>) => void;
    sendState: (state: GameState, reason?: NetworkSyncReason) => void;
    requestRecovery: (reason: RecoveryReason, requestId?: string) => void;
    latency: number;
    isUnstable: boolean;
}

export const useOnlineManager = (
    handlers: OnlineManagerHandlers,
    enabled: boolean = false,
    getCurrentStateRef?: () => GameState,
    targetIP: string = 'localhost'
): OnlineManagerController => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [conn, setConn] = useState<DataConnection | null>(null);
    const [peerId, setPeerId] = useState<string>('');
    const [remotePeerId, setRemotePeerId] = useState<string>('');
    const [connectionStatus, setConnectionStatus] = useState<
        'disconnected' | 'connecting' | 'connected'
    >('disconnected');
    const [isHost, setIsHost] = useState(false);

    const handlersRef = useRef(handlers);
    const isHostRef = useRef(isHost);
    const reconnectAttempts = useRef(0);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const MAX_RECONNECT_ATTEMPTS = 5;

    useEffect(() => {
        handlersRef.current = handlers;
    }, [handlers]);

    useEffect(() => {
        isHostRef.current = isHost;
    }, [isHost]);

    const sendMessage = useCallback(
        (msg: NetworkMessage) => {
            if (conn && conn.open) {
                conn.send(msg);
            }
        },
        [conn]
    );

    const { latency, isUnstable, handleHeartbeat } = useConnectionHealth(conn, sendMessage);

    const setupConnection = useCallback(
        (connection: DataConnection) => {
            connection.on('open', () => {
                setConnectionStatus('connected');
                setConn(connection);
                setRemotePeerId(connection.peer);
                reconnectAttempts.current = 0;
            });

            connection.on('data', (data: unknown) => {
                const msg = parseNetworkMessage(data);
                if (!msg) {
                    console.warn('[NET] Rejected malformed network message.');
                    return;
                }

                if (msg.type === 'HEARTBEAT_PING' || msg.type === 'HEARTBEAT_PONG') {
                    handleHeartbeat(msg);
                    return;
                }

                const role = isHostRef.current ? 'host' : 'guest';
                const directionCheck = getInboundMessageCheck(role, msg);
                if (!directionCheck.accepted) {
                    console.warn(`[NET] ${directionCheck.reason}`);
                    return;
                }

                console.log('Received P2P data:', msg.type);

                switch (msg.type) {
                    case 'BOOTSTRAP_STATE':
                        handlersRef.current.onBootstrapReceived(msg.command, msg.checksum);
                        break;
                    case 'SYNC_STATE':
                        handlersRef.current.onStateReceived(msg.snapshot, msg.reason);
                        break;
                    case 'GUEST_INTENT':
                        handlersRef.current.onGuestIntentReceived(msg.requestId, msg.command);
                        break;
                    case 'HOST_DECISION':
                        handlersRef.current.onHostDecisionReceived(msg);
                        break;
                    case 'RECOVERY_REQUEST':
                        if (isHostRef.current && getCurrentStateRef) {
                            console.warn(
                                `[NET] Guest requested recovery (${msg.reason}). Sending authoritative snapshot.`
                            );
                            sendMessage({
                                version: NETWORK_PROTOCOL_VERSION,
                                type: 'SYNC_STATE',
                                snapshot: getCurrentStateRef(),
                                reason: 'RECOVERY',
                            });
                        }
                        break;
                }
            });

            connection.on('close', () => {
                setConn((current) => {
                    if (current === connection) {
                        setConnectionStatus('disconnected');
                        setRemotePeerId('');
                        return null;
                    }
                    return current;
                });
            });

            connection.on('error', (err) => {
                console.error('[NET] Connection Error:', err);
            });
        },
        [getCurrentStateRef, handleHeartbeat, sendMessage]
    );

    const setupConnectionRef = useRef(setupConnection);
    useEffect(() => {
        setupConnectionRef.current = setupConnection;
    }, [setupConnection]);

    useEffect(() => {
        if (!enabled) {
            console.log('[NET] Manager disabled, skipping peer init.');
            return;
        }

        console.log('[NET] Initializing Peer...');
        console.log(`[NET] Target IP: ${targetIP}`);

        const peerConfig = createPeerConfig(true, targetIP);
        const newPeer = new Peer(peerConfig);

        newPeer.on('open', (id) => {
            setPeerId(id);
            console.log('[NET] My peer ID is: ' + id);
        });

        newPeer.on('connection', (connection) => {
            console.log('[NET] Incoming connection from:', connection.peer);
            isHostRef.current = true;
            setupConnectionRef.current(connection);
            setIsHost(true);
        });

        newPeer.on('disconnected', () => {
            console.warn('[NET] Peer disconnected from signaling server.');
            if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                console.log(
                    `[NET] Attempting reconnect (${reconnectAttempts.current + 1}/${MAX_RECONNECT_ATTEMPTS})...`
                );
                if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (!newPeer.destroyed) {
                        newPeer.reconnect();
                        reconnectAttempts.current++;
                    }
                }, 2000);
            }
        });

        newPeer.on('error', (err) => {
            console.error('[NET] Peer Error:', err);
        });

        setPeer(newPeer);

        return () => {
            console.log('[NET] Destroying Peer instance.');
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            newPeer.destroy();
            setPeer(null);
            setPeerId('');
        };
    }, [enabled, targetIP]);

    const connectToPeer = useCallback(
        (id: string) => {
            if (!peer) {
                console.error('[NET] Cannot connect: Peer instance not ready.');
                return;
            }
            setConnectionStatus('connecting');
            isHostRef.current = false;
            const connection = peer.connect(id);
            setupConnectionRef.current(connection);
            setIsHost(false);
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
        (state: GameState, reason: NetworkSyncReason = 'TURN_SYNC') => {
            sendMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'SYNC_STATE',
                snapshot: state,
                reason,
            });
        },
        [sendMessage]
    );

    const requestRecovery = useCallback(
        (reason: RecoveryReason, requestId?: string) => {
            sendMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'RECOVERY_REQUEST',
                reason,
                requestId,
            });
        },
        [sendMessage]
    );

    return {
        peerId,
        remotePeerId,
        connectionStatus,
        isHost,
        connectToPeer,
        sendBootstrap,
        sendGuestIntent,
        sendHostDecision,
        sendState,
        requestRecovery,
        latency,
        isUnstable,
    };
};
