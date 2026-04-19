/**
 * Core domain types for Gem Duel.
 *
 * These contracts model gameplay state, actions, and value objects without
 * coupling the domain to desktop bridge concerns.
 */

// ============================================================================
// GEM TYPES & COLORS
// ============================================================================

/**
 * Coordinate on the game board
 */
export interface GemCoord {
    r: number;
    c: number;
}

/**
 * Union type for all gem colors in the game
 */
export type GemColor = 'blue' | 'white' | 'green' | 'black' | 'red' | 'pearl' | 'gold';
export type BasicGemColor = Exclude<GemColor, 'pearl' | 'gold'>;

export type BounsColor = GemColor | 'null';

/**
 * Gem type definition with styling info
 */
export interface GemTypeObject {
    id: GemColor | 'empty';
    color: string; // Tailwind gradient classes
    border: string; // Tailwind border classes
    label: string;
}

/**
 * Player's gem inventory
 */
export interface GemInventory {
    blue: number;
    white: number;
    green: number;
    black: number;
    red: number;
    pearl: number;
    gold: number;
    [key: string]: number; // Allow dynamic access
}

// ============================================================================
// CARDS
// ============================================================================

/**
 * Card ability types
 */
export type CardAbility = 'again' | 'steal' | 'scroll' | 'bonus_gem' | 'none';

/**
 * Standard development card
 */
export interface Card {
    id: string;
    level: 1 | 2 | 3;
    cost: GemInventory;
    points: number;
    ability?: CardAbility | CardAbility[];
    bonusColor?: BounsColor;
    prestige?: number;
    crowns?: number;
    bonusCount?: number;
    uid?: string;
    isBuff?: boolean;
    image?: string | null;
}

export interface DeckState {
    1: Card[];
    2: Card[];
    3: Card[];
}

export interface MarketState {
    1: (Card | null)[];
    2: (Card | null)[];
    3: (Card | null)[];
}

/**
 * Royal card (special high-value cards)
 */
export interface RoyalCard {
    id: string;
    points: number;
    bonusColor: GemColor;
    ability: CardAbility | CardAbility[];
    label: string;
    crowns?: number;
}

// ============================================================================
// BUFFS (Modifiers/Handicaps)
// ============================================================================

/**
 * Buff effect structure
 */
export interface BuffEffects {
    onInit?: {
        privilege?: number;
        gold?: number;
        randomGem?: number;
        crowns?: number;
        pearl?: number;
        reserveCard?: number;
    };
    passive?: {
        gemCap?: number;
        discountRandom?: number;
        revealDeck1?: boolean;
        immuneNegative?: boolean;
        firstReserveBonus?: number;
        pointBonus?: number;
        crownBonusGem?: boolean;
        recycler?: boolean;
        doubleBonusFirst5?: boolean;
        refillBonus?: boolean;
        privilegeBuff?: number;
        periodicPrivilege?: number;
        extraL3?: boolean;
        discountAny?: number;
        goldBuff?: boolean;
        l3Discount?: number;
        noTake3?: boolean;
        reservedDiscount?: number;
        reserveBonusGem?: boolean;
        buyReservedBonus?: number;
        hoarderBonus?: boolean;
        stealReserved?: boolean;
    };
    active?: string;
    winCondition?: {
        points?: number;
        crowns?: number;
        singleColor?: number;
        disableSingleColor?: boolean;
    };
    state?: BuffRuntimeState;
}

/**
 * Individual buff definition
 */
export interface Buff {
    id: string;
    level: 0 | 1 | 2 | 3;
    category?: 'economy' | 'discount' | 'control' | 'intel' | 'victory';
    label: string;
    desc: string;
    effects: BuffEffects;
    state?: BuffRuntimeState;
}

export interface BuffRuntimeState {
    refillCount?: number;
    discountColor?: BasicGemColor;
    [key: string]: unknown;
}

/**
 * Empty buff (no modifier)
 */
export const BUFF_NONE: Buff = {
    id: 'none',
    level: 1,
    label: 'No Buff',
    desc: 'Standard gameplay',
    effects: {},
};

// ============================================================================
// GAME STATE
// ============================================================================

/**
 * High-level Game Mode (Match Type)
 */
export type GameMode = 'LOCAL_PVP' | 'PVE' | 'ONLINE_MULTIPLAYER';

/**
 * Game phases define the state machine flow
 */
export type GamePhase =
    | 'IDLE'
    | 'DRAFT_PHASE'
    | 'SELECT_ROYAL'
    | 'DISCARD_EXCESS_GEMS'
    | 'BONUS_ACTION'
    | 'STEAL_ACTION'
    | 'PRIVILEGE_ACTION'
    | 'RESERVE_WAITING_GEM'
    | 'SELECT_CARD_COLOR';

/**
 * Player identifiers
 */
export type PlayerKey = 'p1' | 'p2';

/**
 * Single cell on the game board
 */
export interface BoardCell {
    type: GemTypeObject;
    uid: string;
}

/**
 * Item in the gem bag
 */
export type BagItem = BoardCell | string;

export interface PlayerInitRandoms {
    randomGems: BasicGemColor[];
    reserveCardLevel: 1 | 2 | 3;
    preferenceColor: BasicGemColor;
}

export interface GameSetupPayload {
    mode: GameMode;
    board: BoardCell[][];
    bag: BagItem[];
    market: MarketState;
    decks: DeckState;
    initRandoms: Record<PlayerKey, PlayerInitRandoms>;
    isHost: boolean;
}

export interface InitDraftPayload extends GameSetupPayload {
    draftPool: string[];
    buffLevel: 1 | 2 | 3;
}

export type CardActionSource = 'market' | 'reserved';

export interface MarketCardSlot {
    level: 1 | 2 | 3;
    idx: number;
}

export type MarketCardRef =
    | (MarketCardSlot & { isExtra?: false; extraIdx?: undefined })
    | (MarketCardSlot & { level: 3; isExtra: true; extraIdx: number });

export type CardInteractionContext = MarketCardRef;

export type P2DraftPoolIndices = [number, number, number, number];

export interface PeekModalData {
    cards: Card[];
    initiator: PlayerKey;
}

/**
 * UI Modal state
 */
export type ActiveModal = {
    type: 'PEEK';
    data: PeekModalData;
};

/**
 * Main game state - the single source of truth
 */
export interface GameState {
    board: BoardCell[][];
    bag: BagItem[];
    turn: PlayerKey;
    phase: GamePhase;
    mode: GameMode;
    isHost: boolean;
    activeModal: ActiveModal | null;
    lastFeedback: {
        uid: string;
        items: Array<{ player: PlayerKey; type: string; diff: number }>;
    } | null;
    toastMessage: string | null;
    winner: PlayerKey | null;
    decks: DeckState;
    market: MarketState;
    playerTableau: Record<PlayerKey, Card[]>;
    playerReserved: Record<PlayerKey, Card[]>;
    playerRoyals: Record<PlayerKey, RoyalCard[]>;
    playerTurnCounts: Record<PlayerKey, number>;
    inventories: Record<PlayerKey, GemInventory>;
    privileges: Record<PlayerKey, number>;
    royalDeck: RoyalCard[];
    royalMilestones: Record<PlayerKey, Record<number, boolean>>;
    extraPoints: Record<PlayerKey, number>;
    extraCrowns: Record<PlayerKey, number>;
    extraAllocation: Record<PlayerKey, GemInventory>;
    extraPrivileges: Record<PlayerKey, number>;
    playerBuffs: Record<PlayerKey, Buff>;
    draftPool: string[];
    p2DraftPool?: string[];
    p1SelectedBuff?: Buff | null;
    draftOrder: PlayerKey[];
    buffLevel: number;
    pendingSetup: GameSetupPayload | null;
    privilegeGemCount: number;
    pendingReserve: {
        card?: Card;
        level: 1 | 2 | 3;
        idx?: number;
        isDeck?: boolean;
    } | null;
    bonusGemTarget: GemTypeObject | null;
    pendingBuy: {
        card: Card;
        source: CardActionSource;
        marketInfo?: MarketCardRef;
    } | null;
    nextPlayerAfterRoyal: PlayerKey | null;
}

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

// ============================================================================
// VALIDATION & SELECTORS
// ============================================================================

export interface ValidationResult {
    valid: boolean;
    reason?: string;
}

export interface PlayerScore {
    points: number;
    crowns: number;
    cardCount: number;
    gemCount: number;
}
