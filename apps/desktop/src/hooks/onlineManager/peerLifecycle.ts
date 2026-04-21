import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { DataConnection, Peer } from 'peerjs';
import { createPeerConfig } from '@gemduel/shared/config/webrtc';
import { logRendererMessage, reportRendererEvent } from '../../observability/rendererLogger';
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
    logRendererMessage('info', '[NET] Initializing Peer...');
    logRendererMessage('info', `[NET] Target IP: ${targetIP}`);
    reportRendererEvent({
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
        reportRendererEvent(
            {
                category: 'peer',
                name: 'PEER_READY',
                severity: 'info',
                message: 'Peer manager received a local peer identifier from the signaling layer.',
                context: {
                    peerId: id,
                },
            },
            {
                consoleMessage: '[NET] My peer ID is: ' + id,
            }
        );
    });

    peer.on('connection', (connection) => {
        isHostRef.current = true;
        setupConnection(connection);
        setIsHost(true);
        reportRendererEvent(
            {
                category: 'peer',
                name: 'PEER_INCOMING_CONNECTION',
                severity: 'info',
                message: 'Peer manager accepted an incoming multiplayer connection.',
                context: {
                    remotePeerId: connection.peer,
                },
            },
            {
                consoleMessage: '[NET] Incoming connection from:',
                consoleDetails: connection.peer,
            }
        );
    });

    peer.on('disconnected', () => {
        reportRendererEvent(
            {
                category: 'peer',
                name: 'PEER_SIGNALING_DISCONNECTED',
                severity: 'warn',
                message: 'Peer manager disconnected from the signaling server.',
                context: {
                    attempt: reconnectAttempts.current + 1,
                },
            },
            {
                consoleMessage: '[NET] Peer disconnected from signaling server.',
            }
        );
        if (reconnectAttempts.current < maxReconnectAttempts) {
            logRendererMessage(
                'info',
                `[NET] Attempting reconnect (${reconnectAttempts.current + 1}/${maxReconnectAttempts})...`
            );
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(() => {
                if (!peer.destroyed) {
                    peer.reconnect();
                    reconnectAttempts.current++;
                    reportRendererEvent({
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
            reportRendererEvent({
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
        reportRendererEvent(
            {
                category: 'peer',
                name: 'PEER_ERROR',
                severity: 'error',
                message: 'Peer manager emitted a signaling-layer error.',
            },
            {
                consoleMessage: '[NET] Peer Error:',
                consoleDetails: err,
            }
        );
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
    reportRendererEvent(
        {
            category: 'peer',
            name: 'PEER_DESTROYED',
            severity: 'info',
            message: 'Peer manager destroyed the local peer instance during cleanup.',
        },
        {
            consoleMessage: '[NET] Destroying Peer instance.',
        }
    );
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
