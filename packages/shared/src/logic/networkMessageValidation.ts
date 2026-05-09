import type {
    HostDecisionReasonCode,
    NetworkMessage,
    NetworkSyncReason,
    RecoveryReason,
} from '../types/network';
import type { BoundaryFailure, GameState, NetworkMessageBoundaryErrorCode } from '../types';
import { NETWORK_PROTOCOL_VERSION } from '../types/network';
import { NETWORK_SYNC_REASONS } from '../types/reason';
import {
    bootstrapStateMessageSchema,
    guestIntentMessageSchema,
    heartbeatPingMessageSchema,
    heartbeatPongMessageSchema,
    hostDecisionMessageSchema,
    networkEnvelopeSchema,
    recoveryRequestMessageSchema,
    syncStateMessageSchema,
} from './contractSchemas';

const NETWORK_SYNC_REASON_SET = new Set<NetworkSyncReason>(NETWORK_SYNC_REASONS);
const NETWORK_MESSAGE_ALLOWED_TOP_LEVEL_KEYS = {
    BOOTSTRAP_STATE: new Set(['version', 'type', 'command', 'checksum', 'replayFull']),
    GUEST_INTENT: new Set(['version', 'type', 'requestId', 'command']),
    HOST_DECISION: new Set([
        'version',
        'type',
        'requestId',
        'intentKind',
        'approved',
        'reasonCode',
        'reason',
        'command',
        'checksum',
    ]),
    SYNC_STATE: new Set(['version', 'type', 'snapshot', 'reason', 'replaySync']),
    RECOVERY_REQUEST: new Set(['version', 'type', 'reason', 'requestId']),
    HEARTBEAT_PING: new Set(['version', 'type', 'timestamp']),
    HEARTBEAT_PONG: new Set(['version', 'type', 'timestamp']),
} satisfies Record<NetworkMessage['type'], ReadonlySet<string>>;

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const hasUnsupportedTopLevelFields = (value: unknown, type: NetworkMessage['type']): boolean => {
    if (!isPlainRecord(value)) {
        return false;
    }
    const allowedKeys = NETWORK_MESSAGE_ALLOWED_TOP_LEVEL_KEYS[type];
    return Object.keys(value).some((key) => !allowedKeys.has(key));
};

export const parseNetworkMessage = (value: unknown): NetworkMessage | null => {
    const result = parseNetworkMessageBoundary(value);
    return result.ok ? result.value : null;
};

export const parseNetworkMessageBoundary = (
    value: unknown
):
    | {
          ok: true;
          value: NetworkMessage;
      }
    | BoundaryFailure<NetworkMessageBoundaryErrorCode> => {
    const envelope = networkEnvelopeSchema.safeParse(value);
    if (!envelope.success) {
        return {
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
            message: 'Inbound network payload did not match the protocol envelope.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        };
    }

    if (hasUnsupportedTopLevelFields(value, envelope.data.type)) {
        return {
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
            message: 'Inbound network payload included unsupported top-level fields.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        };
    }

    switch (envelope.data.type) {
        case 'HEARTBEAT_PING':
            return heartbeatPingMessageSchema.safeParse(value).success
                ? {
                      ok: true,
                      value: heartbeatPingMessageSchema.parse(value),
                  }
                : {
                      ok: false,
                      boundaryId: 'network-message-parsing',
                      code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
                      message: 'HEARTBEAT_PING requires a numeric timestamp payload.',
                      runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                  };
        case 'HEARTBEAT_PONG':
            return heartbeatPongMessageSchema.safeParse(value).success
                ? {
                      ok: true,
                      value: heartbeatPongMessageSchema.parse(value),
                  }
                : {
                      ok: false,
                      boundaryId: 'network-message-parsing',
                      code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
                      message: 'HEARTBEAT_PONG requires a numeric timestamp payload.',
                      runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                  };
        case 'BOOTSTRAP_STATE': {
            const parsed = bootstrapStateMessageSchema.safeParse(value);
            if (!parsed.success) {
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_BOOTSTRAP',
                    message: 'Inbound bootstrap payload failed schema validation.',
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            return {
                ok: true,
                value: parsed.data as NetworkMessage,
            };
        }
        case 'GUEST_INTENT': {
            const parsed = guestIntentMessageSchema.safeParse(value);
            if (!parsed.success) {
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_GUEST_INTENT',
                    message: 'Inbound guest intent failed schema validation.',
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            return {
                ok: true,
                value: parsed.data as NetworkMessage,
            };
        }
        case 'HOST_DECISION': {
            const parsed = hostDecisionMessageSchema.safeParse(value);
            if (!parsed.success) {
                const issues = parsed.error.issues;
                const message = issues.some(
                    (issue) =>
                        issue.message ===
                        'Inbound host decision command payload did not match the declared intent.'
                )
                    ? 'Inbound host decision command payload did not match the declared intent.'
                    : issues.some(
                            (issue) =>
                                issue.message ===
                                'Approved host decisions must include both a command payload and checksum.'
                        )
                      ? 'Approved host decisions must include both a command payload and checksum.'
                      : issues.some((issue) => issue.path[0] === 'reasonCode')
                        ? 'Inbound host decision carried an unknown structured reason code.'
                        : issues.some((issue) => issue.path[0] === 'checksum')
                          ? 'Inbound host decision carried a non-string checksum.'
                          : issues.some((issue) => issue.path[0] === 'reason')
                            ? 'Inbound host decision carried a non-string rejection reason.'
                            : 'Inbound host decision did not satisfy the base contract.';
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
                    message,
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            return {
                ok: true,
                value: parsed.data as NetworkMessage & { reasonCode?: HostDecisionReasonCode },
            };
        }
        case 'SYNC_STATE': {
            const parsed = syncStateMessageSchema.safeParse(value);
            if (!parsed.success) {
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_SYNC_STATE',
                    message: 'Inbound sync-state payload did not satisfy the GameState boundary.',
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            return {
                ok: true,
                value: {
                    version: NETWORK_PROTOCOL_VERSION,
                    type: 'SYNC_STATE',
                    snapshot: parsed.data.snapshot as unknown as GameState,
                    reason: NETWORK_SYNC_REASON_SET.has(parsed.data.reason as NetworkSyncReason)
                        ? (parsed.data.reason as NetworkSyncReason)
                        : 'TURN_SYNC',
                    replaySync: parsed.data.replaySync,
                },
            };
        }
        case 'RECOVERY_REQUEST': {
            const parsed = recoveryRequestMessageSchema.safeParse(value);
            if (!parsed.success) {
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST',
                    message: 'Inbound recovery request failed schema validation.',
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            return {
                ok: true,
                value: {
                    version: NETWORK_PROTOCOL_VERSION,
                    type: 'RECOVERY_REQUEST',
                    reason: parsed.data.reason as RecoveryReason,
                    requestId: parsed.data.requestId,
                },
            };
        }
        default:
            return {
                ok: false,
                boundaryId: 'network-message-parsing',
                code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
                message: 'Inbound network payload used an unsupported message type.',
                runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
            };
    }
};
