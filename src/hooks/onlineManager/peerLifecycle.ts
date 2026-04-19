import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { DataConnection, Peer } from 'peerjs';
import { createPeerConfig } from '../../config/webrtc';
import { reportReleaseHealth } from '../../observability/releaseHealth';
import type { ConnectionStatus } from './types';

interface PeerLifecycleDependencies {
    targetIP: string;
    maxReconnectAttempts: number;
    isHostRef: MutableRefObject<boolean>;
    reconnectAttempts: MutableRefObject<number>;
    reconnectTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
    setupConnection: (connection: DataConnection) => void;
    setPeerId: Dispatch<SetStateAction<string>>;
    setIsHost: Dispatch<SetStateAction<boolean>>;
    setConnectionStatus: Dispatch<SetStateAction<ConnectionStatus>>;
    setRemotePeerId: Dispatch<SetStateAction<string>>;
}

export const createManagedPeer = ({
    targetIP,
    maxReconnectAttempts,
    isHostRef,
    reconnectAttempts,
    reconnectTimeoutRef,
    setupConnection,
    setPeerId,
    setIsHost,
}: PeerLifecycleDependencies): Peer => {
    console.log('[NET] Initializing Peer...');
    console.log(`[NET] Target IP: ${targetIP}`);
    reportReleaseHealth({
        category: 'peer',
        name: 'PEER_INITIALIZING',
        severity: 'info',
        message: 'Peer manager started initializing the local peer instance.',
        context: {
            targetIp: targetIP,
        },
    });

    const peerConfig = createPeerConfig(true, targetIP);
    const peer = new Peer(peerConfig);

    peer.on('open', (id) => {
        setPeerId(id);
        console.log('[NET] My peer ID is: ' + id);
        reportReleaseHealth({
            category: 'peer',
            name: 'PEER_READY',
            severity: 'info',
            message: 'Peer manager received a local peer identifier from the signaling layer.',
            context: {
                peerId: id,
            },
        });
    });

    peer.on('connection', (connection) => {
        console.log('[NET] Incoming connection from:', connection.peer);
        isHostRef.current = true;
        setupConnection(connection);
        setIsHost(true);
        reportReleaseHealth({
            category: 'peer',
            name: 'PEER_INCOMING_CONNECTION',
            severity: 'info',
            message: 'Peer manager accepted an incoming multiplayer connection.',
            context: {
                remotePeerId: connection.peer,
            },
        });
    });

    peer.on('disconnected', () => {
        console.warn('[NET] Peer disconnected from signaling server.');
        reportReleaseHealth({
            category: 'peer',
            name: 'PEER_SIGNALING_DISCONNECTED',
            severity: 'warn',
            message: 'Peer manager disconnected from the signaling server.',
            context: {
                attempt: reconnectAttempts.current + 1,
            },
        });
        if (reconnectAttempts.current < maxReconnectAttempts) {
            console.log(
                `[NET] Attempting reconnect (${reconnectAttempts.current + 1}/${maxReconnectAttempts})...`
            );
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(() => {
                if (!peer.destroyed) {
                    peer.reconnect();
                    reconnectAttempts.current++;
                    reportReleaseHealth({
                        category: 'peer',
                        name: 'PEER_RECONNECT_SCHEDULED',
                        severity: 'info',
                        message: 'Peer manager scheduled a reconnect attempt.',
                        context: {
                            attempt: reconnectAttempts.current,
                            maxAttempts: maxReconnectAttempts,
                        },
                    });
                }
            }, 2000);
        } else {
            reportReleaseHealth({
                category: 'peer',
                name: 'PEER_RECONNECT_EXHAUSTED',
                severity: 'error',
                message: 'Peer manager exhausted its reconnect attempts.',
                context: {
                    maxAttempts: maxReconnectAttempts,
                },
            });
        }
    });

    peer.on('error', (err) => {
        console.error('[NET] Peer Error:', err);
        reportReleaseHealth({
            category: 'peer',
            name: 'PEER_ERROR',
            severity: 'error',
            message: 'Peer manager emitted a signaling-layer error.',
        });
    });

    return peer;
};

export const destroyManagedPeer = (
    peer: Peer,
    reconnectTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
    setPeer: Dispatch<SetStateAction<Peer | null>>,
    setPeerId: Dispatch<SetStateAction<string>>,
    setConnectionStatus: Dispatch<SetStateAction<ConnectionStatus>>,
    setRemotePeerId: Dispatch<SetStateAction<string>>
) => {
    console.log('[NET] Destroying Peer instance.');
    reportReleaseHealth({
        category: 'peer',
        name: 'PEER_DESTROYED',
        severity: 'info',
        message: 'Peer manager destroyed the local peer instance during cleanup.',
    });
    if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
    }
    peer.destroy();
    setPeer(null);
    setPeerId('');
    setConnectionStatus('disconnected');
    setRemotePeerId('');
};
