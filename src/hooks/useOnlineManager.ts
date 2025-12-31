import { useState, useEffect, useCallback, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';
import { GameAction, GameState } from '../types';
import { NetworkMessage } from '../types/network';
import { createPeerConfig } from '../config/webrtc';
import { useConnectionHealth } from './useConnectionHealth';

export const useOnlineManager = (
    onActionReceived: (action: GameAction, checksum?: string) => void,
    onStateReceived: (state: GameState) => void,
    onGuestRequestReceived: (action: GameAction) => void,
    enabled: boolean = false,
    getCurrentStateRef?: () => GameState, // Accessor for authoritative state
    targetIP: string = 'localhost' // IP address for guest to connect to
) => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [conn, setConn] = useState<DataConnection | null>(null);
    const [peerId, setPeerId] = useState<string>('');
    const [remotePeerId, setRemotePeerId] = useState<string>('');
    const [connectionStatus, setConnectionStatus] = useState<
        'disconnected' | 'connecting' | 'connected'
    >('disconnected');
    const [isHost, setIsHost] = useState(false);

    // Refs for callbacks and state access
    const onActionReceivedRef = useRef(onActionReceived);
    const onStateReceivedRef = useRef(onStateReceived);
    const onGuestRequestReceivedRef = useRef(onGuestRequestReceived);
    const isHostRef = useRef(isHost);
    const reconnectAttempts = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 5;

    useEffect(() => {
        onActionReceivedRef.current = onActionReceived;
        onStateReceivedRef.current = onStateReceived;
        onGuestRequestReceivedRef.current = onGuestRequestReceived;
    }, [onActionReceived, onStateReceived, onGuestRequestReceived]);

    useEffect(() => {
        isHostRef.current = isHost;
    }, [isHost]);

    // Send generic message wrapper
    const sendMessage = useCallback(
        (msg: NetworkMessage) => {
            if (conn && conn.open) {
                conn.send(msg);
            }
        },
        [conn]
    );

    // Health Check Hook
    const { latency, isUnstable, handleHeartbeat } = useConnectionHealth(conn, sendMessage);

    const setupConnection = useCallback(
        (connection: DataConnection) => {
            connection.on('open', () => {
                setConnectionStatus('connected');
                setConn(connection);
                setRemotePeerId(connection.peer);
                reconnectAttempts.current = 0; // Reset attempts on success
            });

            connection.on('data', (data: unknown) => {
                const msg = data as NetworkMessage;

                // Handle Heartbeat internally
                if (msg.type === 'HEARTBEAT_PING' || msg.type === 'HEARTBEAT_PONG') {
                    handleHeartbeat(msg);
                    return;
                }

                console.log('Received P2P data:', msg.type);

                if (msg.type === 'SYNC_STATE') {
                    onStateReceivedRef.current(msg.state);
                } else if (msg.type === 'GUEST_REQUEST') {
                    onGuestRequestReceivedRef.current(msg.action);
                } else if (msg.type === 'GAME_ACTION') {
                    onActionReceivedRef.current(msg.action, msg.checksum);
                } else if (msg.type === 'REQUEST_FULL_SYNC') {
                    // Host Logic: Respond to Desync
                    if (isHostRef.current && getCurrentStateRef) {
                        console.warn(
                            '[NET] Guest requested full sync. Sending authoritative snapshot.'
                        );
                        const currentState = getCurrentStateRef();
                        sendMessage({
                            type: 'SYNC_STATE',
                            state: currentState,
                            reason: 'RECOVERY',
                        });
                    }
                }
            });

            connection.on('close', () => {
                setConnectionStatus('disconnected');
                setConn(null);
            });

            connection.on('error', (err) => {
                console.error('[NET] Connection Error:', err);
            });
        },
        [handleHeartbeat, getCurrentStateRef, sendMessage]
    );

    const setupConnectionRef = useRef(setupConnection);
    useEffect(() => {
        setupConnectionRef.current = setupConnection;
    }, [setupConnection]);

    // Initialize Peer only when enabled
    useEffect(() => {
        if (!enabled) {
            console.log('[NET] Manager disabled, skipping peer init.');
            return;
        }

        console.log('[NET] Initializing Peer...');
        console.log(`[NET] Target IP: ${targetIP}, Will be host: ${!isHost}`);

        // Use configurable peer config based on role
        // Note: At initialization we don't know if we'll be host yet,
        // so we default to localhost. The actual host/guest is determined
        // when connection is established.
        const peerConfig = createPeerConfig(true, targetIP);
        const newPeer = new Peer(peerConfig);

        newPeer.on('open', (id) => {
            setPeerId(id);
            console.log('[NET] My peer ID is: ' + id);
        });

        newPeer.on('connection', (connection) => {
            console.log('[NET] Incoming connection from:', connection.peer);
            setupConnectionRef.current(connection);
            setIsHost(true); // The one who receives connection is host (p1)
        });

        newPeer.on('disconnected', () => {
            console.warn('[NET] Peer disconnected from signaling server.');
            if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                console.log(
                    `[NET] Attempting reconnect (${reconnectAttempts.current + 1}/${MAX_RECONNECT_ATTEMPTS})...`
                );
                setTimeout(() => {
                    if (!newPeer.destroyed) {
                        newPeer.reconnect();
                        reconnectAttempts.current++;
                    }
                }, 2000);
            }
        });

        newPeer.on('error', (err) => {
            console.error('[NET] Peer Error:', err);
            if (
                err.type === 'peer-unavailable' ||
                err.type === 'network' ||
                err.type === 'server-error'
            ) {
                // Potentially fatal or retryable depending on UX needs
            }
        });

        setPeer(newPeer);

        return () => {
            console.log('[NET] Destroying Peer instance.');
            newPeer.destroy();
            setPeer(null);
            setPeerId('');
        };
    }, [enabled, targetIP]); // Re-init if targetIP changes

    const connectToPeer = useCallback(
        (id: string) => {
            if (!peer) {
                console.error('[NET] Cannot connect: Peer instance not ready.');
                return;
            }
            setConnectionStatus('connecting');
            const connection = peer.connect(id);
            setupConnectionRef.current(connection);
            setIsHost(false); // The one who initiates connection is guest (p2)
        },
        [peer]
    );

    const sendAction = useCallback(
        (action: GameAction, checksum?: string) => {
            sendMessage({ type: 'GAME_ACTION', action, checksum });
        },
        [sendMessage]
    );

    const sendGuestRequest = useCallback(
        (action: GameAction) => {
            sendMessage({ type: 'GUEST_REQUEST', action });
        },
        [sendMessage]
    );

    const sendState = useCallback(
        (state: GameState) => {
            sendMessage({ type: 'SYNC_STATE', state });
        },
        [sendMessage]
    );

    const sendSystemMessage = useCallback(
        (msg: NetworkMessage) => {
            sendMessage(msg);
        },
        [sendMessage]
    );

    return {
        peerId,
        remotePeerId,
        connectionStatus,
        isHost,
        connectToPeer,
        sendAction,
        sendGuestRequest,
        sendState,
        sendSystemMessage,
        latency,
        isUnstable,
    };
};
