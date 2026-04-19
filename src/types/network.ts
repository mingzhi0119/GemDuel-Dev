import type {
    BonusGemPayload,
    BuffInitPayload,
    BuyCardPayload,
    GameState,
    InitDraftPayload,
    InitiateBuyJokerPayload,
    InitiateReserveDeckPayload,
    InitiateReservePayload,
    PeekDeckPayload,
    ReplenishPayload,
    ReserveCardPayload,
    ReserveDeckPayload,
    SelectBuffPayload,
    SelectRoyalPayload,
    StealGemPayload,
    UsePrivilegePayload,
} from './domain';

export const NETWORK_PROTOCOL_VERSION = 2 as const;

export type NetworkProtocolVersion = typeof NETWORK_PROTOCOL_VERSION;
export type NetworkSyncReason = 'TURN_SYNC' | 'INITIAL' | 'RECOVERY';
export type RecoveryReason = 'CHECKSUM_MISMATCH' | 'MANUAL' | 'STALE_PACKET';

export type BootstrapCommand =
    | { kind: 'INIT'; setup: BuffInitPayload }
    | { kind: 'INIT_DRAFT'; setup: InitDraftPayload };

export type GuestIntentCommand =
    | { kind: 'SELECT_BUFF'; payload: SelectBuffPayload }
    | { kind: 'TAKE_GEMS'; payload: { coords: Array<{ r: number; c: number }> } }
    | { kind: 'REPLENISH'; payload?: ReplenishPayload }
    | { kind: 'TAKE_BONUS_GEM'; payload: BonusGemPayload }
    | { kind: 'DISCARD_GEM'; payload: string }
    | { kind: 'STEAL_GEM'; payload: StealGemPayload }
    | { kind: 'INITIATE_BUY_JOKER'; payload: InitiateBuyJokerPayload }
    | { kind: 'BUY_CARD'; payload: BuyCardPayload }
    | { kind: 'INITIATE_RESERVE'; payload: InitiateReservePayload }
    | { kind: 'INITIATE_RESERVE_DECK'; payload: InitiateReserveDeckPayload }
    | { kind: 'CANCEL_RESERVE' }
    | { kind: 'RESERVE_CARD'; payload: ReserveCardPayload }
    | { kind: 'RESERVE_DECK'; payload: ReserveDeckPayload }
    | { kind: 'DISCARD_RESERVED'; payload: { cardId: string } }
    | { kind: 'ACTIVATE_PRIVILEGE' }
    | { kind: 'USE_PRIVILEGE'; payload: UsePrivilegePayload }
    | { kind: 'CANCEL_PRIVILEGE' }
    | { kind: 'SELECT_ROYAL_CARD'; payload: SelectRoyalPayload }
    | { kind: 'PEEK_DECK'; payload: PeekDeckPayload }
    | { kind: 'CLOSE_MODAL' };

export type GuestIntentKind = GuestIntentCommand['kind'];

export interface BootstrapStateMessage {
    version: NetworkProtocolVersion;
    type: 'BOOTSTRAP_STATE';
    command: BootstrapCommand;
    checksum?: string;
}

export interface GuestIntentMessage {
    version: NetworkProtocolVersion;
    type: 'GUEST_INTENT';
    requestId: string;
    command: GuestIntentCommand;
}

export interface HostDecisionMessage {
    version: NetworkProtocolVersion;
    type: 'HOST_DECISION';
    requestId: string;
    intentKind: GuestIntentKind;
    approved: boolean;
    reason?: string;
    command?: GuestIntentCommand;
    checksum?: string;
}

export interface SyncStateMessage {
    version: NetworkProtocolVersion;
    type: 'SYNC_STATE';
    snapshot: GameState;
    reason: NetworkSyncReason;
}

export interface RecoveryRequestMessage {
    version: NetworkProtocolVersion;
    type: 'RECOVERY_REQUEST';
    reason: RecoveryReason;
    requestId?: string;
}

export interface HeartbeatPingMessage {
    version: NetworkProtocolVersion;
    type: 'HEARTBEAT_PING';
    timestamp: number;
}

export interface HeartbeatPongMessage {
    version: NetworkProtocolVersion;
    type: 'HEARTBEAT_PONG';
    timestamp: number;
}

export type HeartbeatMessage = HeartbeatPingMessage | HeartbeatPongMessage;

export type NetworkMessage =
    | BootstrapStateMessage
    | GuestIntentMessage
    | HostDecisionMessage
    | SyncStateMessage
    | RecoveryRequestMessage
    | HeartbeatPingMessage
    | HeartbeatPongMessage;

export interface HostApprovalLogEntry {
    requestId: string;
    intentKind: GuestIntentKind;
    approved: boolean;
    reason?: string;
    checksum?: string;
    createdAt: number;
}
