import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { DataConnection } from 'peerjs';
import type { GameState } from '../../types';
import { reportReleaseHealth } from '../../observability/releaseHealth';
import { NETWORK_PROTOCOL_VERSION, type NetworkMessage } from '../../types/network';
import { getInboundMessageCheck } from '../../logic/networkProtocol';
import { parseNetworkMessage } from '../../logic/networkMessageValidation';
import type { ConnectionStatus, OnlineManagerHandlers } from './types';

interface ConnectionHandlerDependencies {
    connection: DataConnection;
    handlersRef: MutableRefObject<OnlineManagerHandlers>;
    isHostRef: MutableRefObject<boolean>;
    reconnectAttempts: MutableRefObject<number>;
    getCurrentStateRef?: () => GameState;
    handleHeartbeat: (
        msg: Extract<NetworkMessage, { type: 'HEARTBEAT_PING' | 'HEARTBEAT_PONG' }>
    ) => void;
    sendMessage: (message: NetworkMessage) => void;
    setConn: Dispatch<SetStateAction<DataConnection | null>>;
    setRemotePeerId: Dispatch<SetStateAction<string>>;
    setConnectionStatus: Dispatch<SetStateAction<ConnectionStatus>>;
}

export const registerConnectionHandlers = ({
    connection,
    handlersRef,
    isHostRef,
    reconnectAttempts,
    getCurrentStateRef,
    handleHeartbeat,
    sendMessage,
    setConn,
    setRemotePeerId,
    setConnectionStatus,
}: ConnectionHandlerDependencies) => {
    connection.on('open', () => {
        setConnectionStatus('connected');
        setConn(connection);
        setRemotePeerId(connection.peer);
        reconnectAttempts.current = 0;
        reportReleaseHealth({
            category: 'peer',
            name: 'PEER_CONNECTION_OPENED',
            severity: 'info',
            message: 'Peer data connection opened successfully.',
            context: {
                role: isHostRef.current ? 'host' : 'guest',
                remotePeerId: connection.peer,
            },
        });
    });

    connection.on('data', (data: unknown) => {
        const msg = parseNetworkMessage(data);
        if (!msg) {
            console.warn('[NET] Rejected malformed network message.');
            reportReleaseHealth({
                category: 'network',
                name: 'NETWORK_MESSAGE_REJECTED',
                severity: 'warn',
                message: 'Inbound network payload was rejected by the runtime parser.',
            });
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
            reportReleaseHealth({
                category: 'network',
                name: 'NETWORK_DIRECTION_REJECTED',
                severity: 'warn',
                message: 'Inbound network payload violated the role-direction contract.',
                context: {
                    reason: directionCheck.reason,
                    type: msg.type,
                },
            });
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
                    reportReleaseHealth({
                        category: 'recovery',
                        name: 'RECOVERY_REQUEST_RECEIVED',
                        severity: 'warn',
                        message:
                            'Host received a recovery request and sent an authoritative snapshot.',
                        context: {
                            reason: msg.reason,
                        },
                    });
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
        reportReleaseHealth({
            category: 'peer',
            name: 'PEER_CONNECTION_CLOSED',
            severity: 'warn',
            message: 'Peer data connection closed.',
            context: {
                remotePeerId: connection.peer,
            },
        });
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
        reportReleaseHealth({
            category: 'peer',
            name: 'PEER_CONNECTION_ERROR',
            severity: 'error',
            message: 'Peer data connection emitted an error.',
        });
    });
};
