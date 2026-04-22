import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { DataConnection } from 'peerjs';
import type { GameState } from '@gemduel/shared/types';
import type { ReplayFullSync } from '@gemduel/shared/replay';
import { createReasonTelemetryContext } from '@gemduel/shared/logic/reasonCatalog';
import { reportRendererEvent } from '../../observability/rendererLogger';
import { NETWORK_PROTOCOL_VERSION, type NetworkMessage } from '@gemduel/shared/types/network';
import { getInboundMessageCheck } from '@gemduel/shared/logic/networkProtocol';
import { parseNetworkMessageBoundary } from '@gemduel/shared/logic/networkMessageValidation';
import type { ConnectionStatus, OnlineManagerHandlers } from './types';

interface ConnectionHandlerDependencies {
    connection: DataConnection;
    handlersRef: MutableRefObject<OnlineManagerHandlers>;
    isHostRef: MutableRefObject<boolean>;
    reconnectAttempts: MutableRefObject<number>;
    getCurrentStateRef?: () => GameState;
    getCurrentReplayFullSyncRef?: () => ReplayFullSync | null;
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
    getCurrentReplayFullSyncRef,
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
        reportRendererEvent({
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
        const parsed = parseNetworkMessageBoundary(data);
        if (!parsed.ok) {
            reportRendererEvent(
                {
                    category: 'network',
                    name: 'NETWORK_MESSAGE_REJECTED',
                    severity: 'warn',
                    message: 'Inbound network payload was rejected by the runtime parser.',
                    context: createReasonTelemetryContext(parsed.code, {
                        boundaryId: parsed.boundaryId,
                    }),
                },
                {
                    consoleMessage: `[NET] Rejected malformed network message (${parsed.code}).`,
                }
            );
            return;
        }
        const msg = parsed.value;

        if (msg.type === 'HEARTBEAT_PING' || msg.type === 'HEARTBEAT_PONG') {
            handleHeartbeat(msg);
            return;
        }

        const role = isHostRef.current ? 'host' : 'guest';
        const directionCheck = getInboundMessageCheck(role, msg);
        if (!directionCheck.accepted) {
            reportRendererEvent(
                {
                    category: 'network',
                    name: 'NETWORK_DIRECTION_REJECTED',
                    severity: 'warn',
                    message: 'Inbound network payload violated the role-direction contract.',
                    context: {
                        reason: directionCheck.reason ?? null,
                        type: msg.type,
                    },
                },
                {
                    consoleMessage: `[NET] ${directionCheck.reason}`,
                }
            );
            return;
        }

            switch (msg.type) {
            case 'BOOTSTRAP_STATE':
                handlersRef.current.onBootstrapReceived(msg.command, msg.checksum, msg.replayFull);
                break;
            case 'SYNC_STATE':
                handlersRef.current.onStateReceived(msg.snapshot, msg.reason, msg.replaySync);
                break;
            case 'GUEST_INTENT':
                handlersRef.current.onGuestIntentReceived(msg.requestId, msg.command);
                break;
            case 'HOST_DECISION':
                handlersRef.current.onHostDecisionReceived(msg);
                break;
            case 'RECOVERY_REQUEST':
                if (isHostRef.current && getCurrentStateRef) {
                    reportRendererEvent(
                        {
                            category: 'recovery',
                            name: 'RECOVERY_REQUEST_RECEIVED',
                            severity: 'warn',
                            message:
                                'Host received a recovery request and sent an authoritative snapshot.',
                            context: createReasonTelemetryContext(msg.reason),
                        },
                        {
                            consoleMessage: `[NET] Guest requested recovery (${msg.reason}). Sending authoritative snapshot.`,
                        }
                    );
                    sendMessage({
                        version: NETWORK_PROTOCOL_VERSION,
                        type: 'SYNC_STATE',
                        snapshot: getCurrentStateRef(),
                        reason: 'RECOVERY',
                        replaySync: getCurrentReplayFullSyncRef?.() ?? undefined,
                    });
                }
                break;
        }
    });

    connection.on('close', () => {
        reportRendererEvent({
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
        reportRendererEvent(
            {
                category: 'peer',
                name: 'PEER_CONNECTION_ERROR',
                severity: 'error',
                message: 'Peer data connection emitted an error.',
            },
            {
                consoleMessage: '[NET] Connection Error:',
                consoleDetails: err,
            }
        );
    });
};
