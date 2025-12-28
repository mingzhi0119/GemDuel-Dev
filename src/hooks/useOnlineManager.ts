import { useState, useEffect, useCallback, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';
import { GameAction } from '../types';

export const useOnlineManager = (
    onActionReceived: (action: GameAction) => void,
    enabled: boolean = false
) => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [conn, setConn] = useState<DataConnection | null>(null);
    const [peerId, setPeerId] = useState<string>('');
    const [remotePeerId, setRemotePeerId] = useState<string>('');
    const [connectionStatus, setConnectionStatus] = useState<
        'disconnected' | 'connecting' | 'connected'
    >('disconnected');
    const [isHost, setIsHost] = useState(false);

    // Keep the latest callback in a ref to avoid re-triggering effects
    const onActionReceivedRef = useRef(onActionReceived);
    useEffect(() => {
        onActionReceivedRef.current = onActionReceived;
    }, [onActionReceived]);

    const setupConnection = useCallback(
        (connection: DataConnection) => {
            connection.on('open', () => {
                setConnectionStatus('connected');
                setConn(connection);
                setRemotePeerId(connection.peer);
            });

            connection.on('data', (data: any) => {
                console.log('Received data:', data);
                if (data.type === 'GAME_ACTION') {
                    onActionReceivedRef.current(data.action);
                }
            });

            connection.on('close', () => {
                setConnectionStatus('disconnected');
                setConn(null);
            });
        },
        [] // No dependencies needed now
    );

    // Initialize Peer only when enabled
    useEffect(() => {
        if (!enabled) return;

        // If we already have a peer instance, don't recreate it
        // Check if the peer is destroyed or disconnected if you want more robust handling,
        // but for now, simple existence check prevents loop.
        // Actually, we rely on cleanup function to destroy, so we should be fine recreating if enabled changes.

        const newPeer = new Peer();

        newPeer.on('open', (id) => {
            setPeerId(id);
            console.log('My peer ID is: ' + id);
        });

        newPeer.on('connection', (connection) => {
            console.log('Incoming connection from:', connection.peer);
            setupConnection(connection);
            setIsHost(true); // The one who receives connection is host (p1)
        });

        setPeer(newPeer);

        return () => {
            newPeer.destroy();
            setPeer(null);
            setPeerId('');
        };
    }, [enabled, setupConnection]); // setupConnection is now stable

    const connectToPeer = useCallback(
        (id: string) => {
            if (!peer) return;
            setConnectionStatus('connecting');
            const connection = peer.connect(id);
            setupConnection(connection);
            setIsHost(false); // The one who initiates connection is guest (p2)
        },
        [peer, setupConnection]
    );

    const sendAction = useCallback(
        (action: GameAction) => {
            if (conn && conn.open) {
                conn.send({ type: 'GAME_ACTION', action });
            }
        },
        [conn]
    );

    return {
        peerId,
        remotePeerId,
        connectionStatus,
        isHost,
        connectToPeer,
        sendAction,
    };
};
