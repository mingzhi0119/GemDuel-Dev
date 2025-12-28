import { useState, useEffect, useCallback, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';
import { GameAction } from '../types';

export const useOnlineManager = (
    onActionReceived: (action: GameAction, checksum?: string) => void,
    onStateReceived: (state: any) => void,
    onGuestRequestReceived: (action: GameAction) => void,
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

    // Keep the latest callbacks in refs
    const onActionReceivedRef = useRef(onActionReceived);
    const onStateReceivedRef = useRef(onStateReceived);
    const onGuestRequestReceivedRef = useRef(onGuestRequestReceived);

    useEffect(() => {
        onActionReceivedRef.current = onActionReceived;
        onStateReceivedRef.current = onStateReceived;
        onGuestRequestReceivedRef.current = onGuestRequestReceived;
    }, [onActionReceived, onStateReceived, onGuestRequestReceived]);

    const setupConnection = useCallback((connection: DataConnection) => {
        connection.on('open', () => {
            setConnectionStatus('connected');
            setConn(connection);
            setRemotePeerId(connection.peer);
        });

        connection.on('data', (data: any) => {
            console.log('Received P2P data:', data.type);
            if (data.type === 'SYNC_STATE') {
                onStateReceivedRef.current(data.state);
            } else if (data.type === 'GUEST_REQUEST') {
                onGuestRequestReceivedRef.current(data.action);
            } else if (data.type === 'GAME_ACTION') {
                onActionReceivedRef.current(data.action, data.checksum);
            }
        });

        connection.on('close', () => {
            setConnectionStatus('disconnected');
            setConn(null);
        });
    }, []);

    // Initialize Peer only when enabled
    useEffect(() => {
        if (!enabled) return;

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
    }, [enabled, setupConnection]);

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
        (action: GameAction, checksum?: string) => {
            if (conn && conn.open) {
                conn.send({ type: 'GAME_ACTION', action, checksum });
            }
        },
        [conn]
    );

    const sendGuestRequest = useCallback(
        (action: GameAction) => {
            if (conn && conn.open) {
                conn.send({ type: 'GUEST_REQUEST', action });
            }
        },
        [conn]
    );

    const sendState = useCallback(
        (state: any) => {
            if (conn && conn.open) {
                conn.send({ type: 'SYNC_STATE', state });
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
        sendGuestRequest,
        sendState,
    };
};
