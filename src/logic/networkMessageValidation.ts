import type {
    BootstrapCommand,
    GuestIntentCommand,
    NetworkMessage,
    NetworkSyncReason,
    RecoveryReason,
} from '../types/network';
import { NETWORK_PROTOCOL_VERSION } from '../types/network';
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

const NETWORK_SYNC_REASONS = new Set<NetworkSyncReason>(['TURN_SYNC', 'INITIAL', 'RECOVERY']);
const RECOVERY_REASONS = new Set<RecoveryReason>(['CHECKSUM_MISMATCH', 'MANUAL', 'STALE_PACKET']);

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
    if (
        !isPlainObject(value) ||
        typeof value.type !== 'string' ||
        !isProtocolVersion(value.version)
    ) {
        return null;
    }

    switch (value.type) {
        case 'HEARTBEAT_PING':
        case 'HEARTBEAT_PONG':
            return typeof value.timestamp === 'number'
                ? ({
                      version: NETWORK_PROTOCOL_VERSION,
                      type: value.type,
                      timestamp: value.timestamp,
                  } as NetworkMessage)
                : null;
        case 'BOOTSTRAP_STATE':
            if (!isBootstrapCommand(value.command)) return null;
            if (value.checksum !== undefined && typeof value.checksum !== 'string') return null;
            return {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'BOOTSTRAP_STATE',
                command: value.command,
                checksum: value.checksum,
            };
        case 'GUEST_INTENT':
            if (typeof value.requestId !== 'string' || !isGuestIntentCommand(value.command)) {
                return null;
            }
            return {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'GUEST_INTENT',
                requestId: value.requestId,
                command: value.command,
            };
        case 'HOST_DECISION':
            if (
                typeof value.requestId !== 'string' ||
                !isGuestIntentKind(value.intentKind) ||
                typeof value.approved !== 'boolean'
            ) {
                return null;
            }
            if (value.reason !== undefined && typeof value.reason !== 'string') {
                return null;
            }
            if (value.checksum !== undefined && typeof value.checksum !== 'string') return null;
            if (value.command !== undefined) {
                if (
                    !isGuestIntentCommand(value.command) ||
                    value.command.kind !== value.intentKind
                ) {
                    return null;
                }
            }
            if (value.approved && (value.command === undefined || value.checksum === undefined)) {
                return null;
            }
            return {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: value.requestId,
                intentKind: value.intentKind,
                approved: value.approved,
                reason: value.reason,
                command: value.command,
                checksum: value.checksum,
            };
        case 'SYNC_STATE':
            return isLikelyGameState(value.snapshot)
                ? {
                      version: NETWORK_PROTOCOL_VERSION,
                      type: 'SYNC_STATE',
                      snapshot: value.snapshot,
                      reason: NETWORK_SYNC_REASONS.has(value.reason as NetworkSyncReason)
                          ? (value.reason as NetworkSyncReason)
                          : 'TURN_SYNC',
                  }
                : null;
        case 'RECOVERY_REQUEST':
            if (
                !RECOVERY_REASONS.has(value.reason as RecoveryReason) ||
                (value.requestId !== undefined && typeof value.requestId !== 'string')
            ) {
                return null;
            }
            return {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'RECOVERY_REQUEST',
                reason: value.reason as RecoveryReason,
                requestId: value.requestId,
            };
        default:
            return null;
    }
};
