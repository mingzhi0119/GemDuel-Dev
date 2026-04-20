import type {
    BootstrapCommand,
    GuestIntentCommand,
    HostDecisionReasonCode,
    NetworkMessage,
    NetworkSyncReason,
    RecoveryReason,
} from '../types/network';
import type { BoundaryFailure, NetworkMessageBoundaryErrorCode } from '../types';
import { NETWORK_PROTOCOL_VERSION } from '../types/network';
import {
    HOST_DECISION_REASON_CODES,
    NETWORK_SYNC_REASONS,
    RECOVERY_REASONS,
} from '../types/reason';
import { GUEST_INTENT_PERMISSION_TABLE } from './networkProtocol';
import {
    isBonusGemPayload,
    isBuyCardPayload,
    isGameSetupPayload,
    isGemColor,
    isInitiateBuyJokerPayload,
    isInitiateReserveDeckPayload,
    isInitiateReservePayload,
    isInitDraftPayload,
    isLikelyGameState,
    isPeekDeckPayload,
    isPlainObject,
    isReplenishPayload,
    isReserveCardPayload,
    isReserveDeckPayload,
    isSelectBuffPayload,
    isSelectRoyalPayload,
    isStealGemPayload,
    isTakeGemsPayload,
    isUsePrivilegePayload,
} from './actionValidation/guards';

const NETWORK_SYNC_REASON_SET = new Set<NetworkSyncReason>(NETWORK_SYNC_REASONS);
const RECOVERY_REASON_SET = new Set<RecoveryReason>(RECOVERY_REASONS);
const HOST_DECISION_REASON_CODE_SET = new Set<HostDecisionReasonCode>(HOST_DECISION_REASON_CODES);

const isProtocolVersion = (value: unknown): value is typeof NETWORK_PROTOCOL_VERSION =>
    value === NETWORK_PROTOCOL_VERSION;

const isBootstrapCommand = (value: unknown): value is BootstrapCommand => {
    if (!isPlainObject(value) || typeof value.kind !== 'string') return false;
    if (value.kind === 'INIT') return isGameSetupPayload(value.setup);
    if (value.kind === 'INIT_DRAFT') return isInitDraftPayload(value.setup);
    return false;
};

const isGuestIntentKind = (value: unknown): value is GuestIntentCommand['kind'] =>
    typeof value === 'string' && value in GUEST_INTENT_PERMISSION_TABLE;

const isGuestIntentCommand = (value: unknown): value is GuestIntentCommand => {
    if (!isPlainObject(value) || typeof value.kind !== 'string') return false;

    switch (value.kind) {
        case 'SELECT_BUFF':
            return isSelectBuffPayload(value.payload);
        case 'TAKE_GEMS':
            return isTakeGemsPayload(value.payload);
        case 'REPLENISH':
            return value.payload === undefined || isReplenishPayload(value.payload);
        case 'TAKE_BONUS_GEM':
            return isBonusGemPayload(value.payload);
        case 'DISCARD_GEM':
            return typeof value.payload === 'string' && isGemColor(value.payload);
        case 'STEAL_GEM':
            return isStealGemPayload(value.payload);
        case 'INITIATE_BUY_JOKER':
            return isInitiateBuyJokerPayload(value.payload);
        case 'BUY_CARD':
            return isBuyCardPayload(value.payload);
        case 'INITIATE_RESERVE':
            return isInitiateReservePayload(value.payload);
        case 'INITIATE_RESERVE_DECK':
            return isInitiateReserveDeckPayload(value.payload);
        case 'CANCEL_RESERVE':
        case 'ACTIVATE_PRIVILEGE':
        case 'CANCEL_PRIVILEGE':
        case 'CLOSE_MODAL':
            return value.payload === undefined;
        case 'RESERVE_CARD':
            return isReserveCardPayload(value.payload);
        case 'RESERVE_DECK':
            return isReserveDeckPayload(value.payload);
        case 'DISCARD_RESERVED':
            return isPlainObject(value.payload) && typeof value.payload.cardId === 'string';
        case 'USE_PRIVILEGE':
            return isUsePrivilegePayload(value.payload);
        case 'SELECT_ROYAL_CARD':
            return isSelectRoyalPayload(value.payload);
        case 'PEEK_DECK':
            return isPeekDeckPayload(value.payload);
        default:
            return false;
    }
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
    if (
        !isPlainObject(value) ||
        typeof value.type !== 'string' ||
        !isProtocolVersion(value.version)
    ) {
        return {
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
            message: 'Inbound network payload did not match the protocol envelope.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        };
    }

    switch (value.type) {
        case 'HEARTBEAT_PING':
        case 'HEARTBEAT_PONG':
            return typeof value.timestamp === 'number'
                ? {
                      ok: true,
                      value: {
                          version: NETWORK_PROTOCOL_VERSION,
                          type: value.type,
                          timestamp: value.timestamp,
                      } as NetworkMessage,
                  }
                : {
                      ok: false,
                      boundaryId: 'network-message-parsing',
                      code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
                      message: `${value.type} requires a numeric timestamp payload.`,
                      runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                  };
        case 'BOOTSTRAP_STATE':
            if (
                !isBootstrapCommand(value.command) ||
                (value.checksum !== undefined && typeof value.checksum !== 'string')
            ) {
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
                value: {
                    version: NETWORK_PROTOCOL_VERSION,
                    type: 'BOOTSTRAP_STATE',
                    command: value.command,
                    checksum: value.checksum,
                },
            };
        case 'GUEST_INTENT':
            if (typeof value.requestId !== 'string' || !isGuestIntentCommand(value.command)) {
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
                value: {
                    version: NETWORK_PROTOCOL_VERSION,
                    type: 'GUEST_INTENT',
                    requestId: value.requestId,
                    command: value.command,
                },
            };
        case 'HOST_DECISION':
            if (
                typeof value.requestId !== 'string' ||
                !isGuestIntentKind(value.intentKind) ||
                typeof value.approved !== 'boolean'
            ) {
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
                    message: 'Inbound host decision did not satisfy the base contract.',
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            if (value.reason !== undefined && typeof value.reason !== 'string') {
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
                    message: 'Inbound host decision carried a non-string rejection reason.',
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            if (
                value.reasonCode !== undefined &&
                !HOST_DECISION_REASON_CODE_SET.has(value.reasonCode as HostDecisionReasonCode)
            ) {
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
                    message: 'Inbound host decision carried an unknown structured reason code.',
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            if (value.checksum !== undefined && typeof value.checksum !== 'string') {
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
                    message: 'Inbound host decision carried a non-string checksum.',
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            if (value.command !== undefined) {
                if (
                    !isGuestIntentCommand(value.command) ||
                    value.command.kind !== value.intentKind
                ) {
                    return {
                        ok: false,
                        boundaryId: 'network-message-parsing',
                        code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
                        message:
                            'Inbound host decision command payload did not match the declared intent.',
                        runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                    };
                }
            }
            if (value.approved && (value.command === undefined || value.checksum === undefined)) {
                return {
                    ok: false,
                    boundaryId: 'network-message-parsing',
                    code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
                    message:
                        'Approved host decisions must include both a command payload and checksum.',
                    runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                };
            }
            return {
                ok: true,
                value: {
                    version: NETWORK_PROTOCOL_VERSION,
                    type: 'HOST_DECISION',
                    requestId: value.requestId,
                    intentKind: value.intentKind,
                    approved: value.approved,
                    reasonCode: value.reasonCode as HostDecisionReasonCode | undefined,
                    reason: value.reason,
                    command: value.command,
                    checksum: value.checksum,
                },
            };
        case 'SYNC_STATE':
            return isLikelyGameState(value.snapshot)
                ? {
                      ok: true,
                      value: {
                          version: NETWORK_PROTOCOL_VERSION,
                          type: 'SYNC_STATE',
                          snapshot: value.snapshot,
                          reason: NETWORK_SYNC_REASON_SET.has(value.reason as NetworkSyncReason)
                              ? (value.reason as NetworkSyncReason)
                              : 'TURN_SYNC',
                      },
                  }
                : {
                      ok: false,
                      boundaryId: 'network-message-parsing',
                      code: 'NETWORK_MESSAGE_INVALID_SYNC_STATE',
                      message: 'Inbound sync-state payload did not satisfy the GameState boundary.',
                      runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
                  };
        case 'RECOVERY_REQUEST':
            if (
                !RECOVERY_REASON_SET.has(value.reason as RecoveryReason) ||
                (value.requestId !== undefined && typeof value.requestId !== 'string')
            ) {
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
                    reason: value.reason as RecoveryReason,
                    requestId: value.requestId,
                },
            };
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
