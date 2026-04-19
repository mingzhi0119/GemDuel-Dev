import type { GameAction } from '../types';
import type {
    BootstrapCommand,
    GuestIntentCommand,
    GuestIntentKind,
    NetworkMessage,
} from '../types/network';

export type NetworkRole = 'host' | 'guest';

export interface InboundMessageCheckResult {
    accepted: boolean;
    reason?: string;
}

export const GUEST_INTENT_PERMISSION_TABLE: Record<
    GuestIntentKind,
    { requiresGuestTurn: true; description: string }
> = {
    SELECT_BUFF: {
        requiresGuestTurn: true,
        description: 'Guest may only choose from the active draft pool on their turn.',
    },
    TAKE_GEMS: {
        requiresGuestTurn: true,
        description: 'Guest may request a gem line selection on their turn.',
    },
    REPLENISH: {
        requiresGuestTurn: true,
        description: 'Guest may request a replenish action on their turn.',
    },
    TAKE_BONUS_GEM: {
        requiresGuestTurn: true,
        description: 'Guest may resolve a bonus gem choice on their turn.',
    },
    DISCARD_GEM: {
        requiresGuestTurn: true,
        description: 'Guest may discard excess gems when the rules require it.',
    },
    STEAL_GEM: {
        requiresGuestTurn: true,
        description: 'Guest may resolve a steal action that is active for their turn.',
    },
    INITIATE_BUY_JOKER: {
        requiresGuestTurn: true,
        description: 'Guest may open the joker-color flow for a legal purchase.',
    },
    BUY_CARD: {
        requiresGuestTurn: true,
        description: 'Guest may buy a legal market or reserved card on their turn.',
    },
    INITIATE_RESERVE: {
        requiresGuestTurn: true,
        description: 'Guest may begin reserving a market card on their turn.',
    },
    INITIATE_RESERVE_DECK: {
        requiresGuestTurn: true,
        description: 'Guest may begin reserving from a deck on their turn.',
    },
    CANCEL_RESERVE: {
        requiresGuestTurn: true,
        description: 'Guest may cancel their own pending reserve flow.',
    },
    RESERVE_CARD: {
        requiresGuestTurn: true,
        description: 'Guest may finalize a legal reserve-card action.',
    },
    RESERVE_DECK: {
        requiresGuestTurn: true,
        description: 'Guest may finalize a legal reserve-deck action.',
    },
    DISCARD_RESERVED: {
        requiresGuestTurn: true,
        description: 'Guest may discard a reserved card only when a buff allows it.',
    },
    ACTIVATE_PRIVILEGE: {
        requiresGuestTurn: true,
        description: 'Guest may enter privilege mode on their turn.',
    },
    USE_PRIVILEGE: {
        requiresGuestTurn: true,
        description: 'Guest may consume a privilege on a legal target.',
    },
    CANCEL_PRIVILEGE: {
        requiresGuestTurn: true,
        description: 'Guest may cancel their own pending privilege mode.',
    },
    SELECT_ROYAL_CARD: {
        requiresGuestTurn: true,
        description: 'Guest may resolve a royal choice assigned to their turn.',
    },
    PEEK_DECK: {
        requiresGuestTurn: true,
        description: 'Guest may use a legal peek-deck ability on their turn.',
    },
    CLOSE_MODAL: {
        requiresGuestTurn: true,
        description: 'Guest may close a modal only when the rules allow it.',
    },
};

const HOST_INBOUND_TYPES = new Set<NetworkMessage['type']>([
    'GUEST_INTENT',
    'RECOVERY_REQUEST',
    'HEARTBEAT_PING',
    'HEARTBEAT_PONG',
]);

const GUEST_INBOUND_TYPES = new Set<NetworkMessage['type']>([
    'BOOTSTRAP_STATE',
    'HOST_DECISION',
    'SYNC_STATE',
    'HEARTBEAT_PING',
    'HEARTBEAT_PONG',
]);

export const getInboundMessageCheck = (
    role: NetworkRole,
    msg: NetworkMessage
): InboundMessageCheckResult => {
    const allowedTypes = role === 'host' ? HOST_INBOUND_TYPES : GUEST_INBOUND_TYPES;
    if (allowedTypes.has(msg.type)) {
        return { accepted: true };
    }

    return {
        accepted: false,
        reason: `${role === 'host' ? 'Host' : 'Guest'} rejected inbound ${msg.type} message.`,
    };
};

export const actionToBootstrapCommand = (action: GameAction): BootstrapCommand | null => {
    switch (action.type) {
        case 'INIT':
            return { kind: 'INIT', setup: action.payload };
        case 'INIT_DRAFT':
            return { kind: 'INIT_DRAFT', setup: action.payload };
        default:
            return null;
    }
};

export const bootstrapCommandToAction = (
    command: BootstrapCommand,
    isHost: boolean
): Extract<GameAction, { type: 'INIT' | 'INIT_DRAFT' }> => {
    switch (command.kind) {
        case 'INIT':
            return {
                type: 'INIT',
                payload: { ...command.setup, isHost },
            };
        case 'INIT_DRAFT':
            return {
                type: 'INIT_DRAFT',
                payload: { ...command.setup, isHost },
            };
    }
};

export const actionToGuestIntentCommand = (action: GameAction): GuestIntentCommand | null => {
    switch (action.type) {
        case 'SELECT_BUFF':
            return { kind: 'SELECT_BUFF', payload: action.payload };
        case 'TAKE_GEMS':
            return { kind: 'TAKE_GEMS', payload: action.payload };
        case 'REPLENISH':
            return action.payload === undefined
                ? { kind: 'REPLENISH' }
                : { kind: 'REPLENISH', payload: action.payload };
        case 'TAKE_BONUS_GEM':
            return { kind: 'TAKE_BONUS_GEM', payload: action.payload };
        case 'DISCARD_GEM':
            return { kind: 'DISCARD_GEM', payload: action.payload };
        case 'STEAL_GEM':
            return { kind: 'STEAL_GEM', payload: action.payload };
        case 'INITIATE_BUY_JOKER':
            return { kind: 'INITIATE_BUY_JOKER', payload: action.payload };
        case 'BUY_CARD':
            return { kind: 'BUY_CARD', payload: action.payload };
        case 'INITIATE_RESERVE':
            return { kind: 'INITIATE_RESERVE', payload: action.payload };
        case 'INITIATE_RESERVE_DECK':
            return { kind: 'INITIATE_RESERVE_DECK', payload: action.payload };
        case 'CANCEL_RESERVE':
            return { kind: 'CANCEL_RESERVE' };
        case 'RESERVE_CARD':
            return { kind: 'RESERVE_CARD', payload: action.payload };
        case 'RESERVE_DECK':
            return { kind: 'RESERVE_DECK', payload: action.payload };
        case 'DISCARD_RESERVED':
            return { kind: 'DISCARD_RESERVED', payload: action.payload };
        case 'ACTIVATE_PRIVILEGE':
            return { kind: 'ACTIVATE_PRIVILEGE' };
        case 'USE_PRIVILEGE':
            return { kind: 'USE_PRIVILEGE', payload: action.payload };
        case 'CANCEL_PRIVILEGE':
            return { kind: 'CANCEL_PRIVILEGE' };
        case 'SELECT_ROYAL_CARD':
            return { kind: 'SELECT_ROYAL_CARD', payload: action.payload };
        case 'PEEK_DECK':
            return { kind: 'PEEK_DECK', payload: action.payload };
        case 'CLOSE_MODAL':
            return { kind: 'CLOSE_MODAL' };
        default:
            return null;
    }
};

export const guestIntentToAction = (command: GuestIntentCommand): GameAction => {
    switch (command.kind) {
        case 'SELECT_BUFF':
            return { type: 'SELECT_BUFF', payload: command.payload };
        case 'TAKE_GEMS':
            return { type: 'TAKE_GEMS', payload: command.payload };
        case 'REPLENISH':
            return command.payload === undefined
                ? { type: 'REPLENISH' }
                : { type: 'REPLENISH', payload: command.payload };
        case 'TAKE_BONUS_GEM':
            return { type: 'TAKE_BONUS_GEM', payload: command.payload };
        case 'DISCARD_GEM':
            return { type: 'DISCARD_GEM', payload: command.payload };
        case 'STEAL_GEM':
            return { type: 'STEAL_GEM', payload: command.payload };
        case 'INITIATE_BUY_JOKER':
            return { type: 'INITIATE_BUY_JOKER', payload: command.payload };
        case 'BUY_CARD':
            return { type: 'BUY_CARD', payload: command.payload };
        case 'INITIATE_RESERVE':
            return { type: 'INITIATE_RESERVE', payload: command.payload };
        case 'INITIATE_RESERVE_DECK':
            return { type: 'INITIATE_RESERVE_DECK', payload: command.payload };
        case 'CANCEL_RESERVE':
            return { type: 'CANCEL_RESERVE' };
        case 'RESERVE_CARD':
            return { type: 'RESERVE_CARD', payload: command.payload };
        case 'RESERVE_DECK':
            return { type: 'RESERVE_DECK', payload: command.payload };
        case 'DISCARD_RESERVED':
            return { type: 'DISCARD_RESERVED', payload: command.payload };
        case 'ACTIVATE_PRIVILEGE':
            return { type: 'ACTIVATE_PRIVILEGE' };
        case 'USE_PRIVILEGE':
            return { type: 'USE_PRIVILEGE', payload: command.payload };
        case 'CANCEL_PRIVILEGE':
            return { type: 'CANCEL_PRIVILEGE' };
        case 'SELECT_ROYAL_CARD':
            return { type: 'SELECT_ROYAL_CARD', payload: command.payload };
        case 'PEEK_DECK':
            return { type: 'PEEK_DECK', payload: command.payload };
        case 'CLOSE_MODAL':
            return { type: 'CLOSE_MODAL' };
    }
};
