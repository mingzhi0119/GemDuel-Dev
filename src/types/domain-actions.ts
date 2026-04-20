import type {
    BasicGemColor,
    Card,
    CardActionSource,
    GameSetupPayload,
    GameState,
    GemColor,
    InitDraftPayload,
    MarketCardRef,
    P2DraftPoolIndices,
    PlayerInitRandoms,
    PlayerKey,
    RoyalCard,
} from './domain-core';

// ============================================================================
// ACTIONS
// ============================================================================

export interface TakeGemsPayload {
    coords: Array<{ r: number; c: number }>;
}

export interface ReplenishPayload {
    randoms?: {
        extortionColor?: GemColor;
        expansionColor?: GemColor;
    };
}

export interface BonusGemPayload {
    r: number;
    c: number;
}

export interface StealGemPayload {
    gemId: GemColor;
}

export interface BuyCardPayload {
    card: Card;
    source: CardActionSource;
    marketInfo?: MarketCardRef;
    randoms?: { bountyHunterColor?: GemColor };
}

export interface ReserveCardPayload {
    card: Card;
    level: 1 | 2 | 3;
    idx: number;
    goldCoords?: { r: number; c: number };
    isExtra?: boolean;
    extraIdx?: number;
    isSteal?: boolean;
}

export interface ReserveDeckPayload {
    level: 1 | 2 | 3;
    goldCoords?: { r: number; c: number };
}

export interface UsePrivilegePayload {
    r: number;
    c: number;
}

export interface SelectRoyalPayload {
    card: RoyalCard;
}

export interface InitiateBuyJokerPayload {
    card: Card;
    source: CardActionSource;
    marketInfo?: MarketCardRef;
}

export interface InitiateReservePayload {
    card: Card;
    level: 1 | 2 | 3;
    idx: number;
}

export interface InitiateReserveDeckPayload {
    level: 1 | 2 | 3;
}

export type BuffInitPayload = GameSetupPayload;

export interface SelectBuffPayload {
    buffId: string;
    randomColor?: BasicGemColor;
    initRandoms?: Partial<Record<PlayerKey, PlayerInitRandoms>>;
    p2DraftPoolIndices?: P2DraftPoolIndices;
}

export interface PeekDeckPayload {
    level: 1 | 2 | 3;
}

/**
 * Discriminated Union for all possible Game Actions
 */
export type GameAction =
    | { type: 'INIT'; payload: BuffInitPayload }
    | { type: 'INIT_DRAFT'; payload: InitDraftPayload }
    | { type: 'FORCE_SYNC'; payload: GameState }
    | { type: 'FLATTEN'; payload: GameState }
    | { type: 'SELECT_BUFF'; payload: SelectBuffPayload }
    | { type: 'TAKE_GEMS'; payload: TakeGemsPayload }
    | { type: 'REPLENISH'; payload?: ReplenishPayload }
    | { type: 'TAKE_BONUS_GEM'; payload: BonusGemPayload }
    | { type: 'DISCARD_GEM'; payload: string }
    | { type: 'STEAL_GEM'; payload: StealGemPayload }
    | { type: 'INITIATE_BUY_JOKER'; payload: InitiateBuyJokerPayload }
    | { type: 'BUY_CARD'; payload: BuyCardPayload }
    | { type: 'INITIATE_RESERVE'; payload: InitiateReservePayload }
    | { type: 'INITIATE_RESERVE_DECK'; payload: InitiateReserveDeckPayload }
    | { type: 'CANCEL_RESERVE'; payload?: undefined }
    | { type: 'RESERVE_CARD'; payload: ReserveCardPayload }
    | { type: 'RESERVE_DECK'; payload: ReserveDeckPayload }
    | { type: 'DISCARD_RESERVED'; payload: { cardId: string } }
    | { type: 'ACTIVATE_PRIVILEGE'; payload?: undefined }
    | { type: 'USE_PRIVILEGE'; payload: UsePrivilegePayload }
    | { type: 'CANCEL_PRIVILEGE'; payload?: undefined }
    | { type: 'FORCE_ROYAL_SELECTION'; payload?: undefined }
    | { type: 'SELECT_ROYAL_CARD'; payload: SelectRoyalPayload }
    | { type: 'DEBUG_ADD_CROWNS'; payload: PlayerKey }
    | { type: 'DEBUG_ADD_POINTS'; payload: PlayerKey }
    | { type: 'DEBUG_ADD_PRIVILEGE'; payload: PlayerKey }
    | { type: 'UNDO'; payload?: undefined }
    | { type: 'REDO'; payload?: undefined }
    | { type: 'PEEK_DECK'; payload: PeekDeckPayload }
    | { type: 'DEBUG_REROLL_BUFFS'; payload: { level?: number } }
    | { type: 'CLOSE_MODAL'; payload?: undefined };

export interface ReplayFile {
    version: string;
    timestamp: string;
    history: GameAction[];
}
