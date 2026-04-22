/**
 * Core domain types for Gem Duel.
 *
 * These contracts model gameplay state and value objects without coupling the
 * domain to action transport concerns.
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
    color: string;
    border: string;
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
}

export type GemInventoryKey = keyof GemInventory;

// ============================================================================
// CARDS
// ============================================================================

/**
 * Card ability types
 */
export type CardAbility = 'again' | 'steal' | 'scroll' | 'bonus_gem' | 'none';
export type EffectiveCardAbility = Exclude<CardAbility, 'none'>;
export type PendingAbilityResolution = Exclude<CardAbility, 'again' | 'none'>;

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
        immuneSteal?: boolean;
        protectPrivilegeTransfer?: boolean;
        firstReserveBonus?: number;
        pointBonus?: number;
        crownBonusGem?: boolean;
        recycler?: boolean;
        doubleBonusFirst2?: boolean;
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
        echoReservoir?: boolean;
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
    envoyTriggered?: boolean;
    hasReserved?: boolean;
    l3PurchasedCount?: number;
    echoReservoirStoredAbilities?: EffectiveCardAbility[];
    echoReservoirStoredBonusColor?: BounsColor;
}

export interface DeferredEchoReservoirWrite {
    holder: PlayerKey;
    abilities: EffectiveCardAbility[];
    bonusColor?: BounsColor;
}

export interface AbilityResolutionState {
    nextPlayer: PlayerKey;
    pending: PendingAbilityResolution[];
    resolved: EffectiveCardAbility[];
    bonusGemColor?: BounsColor;
    deferredEchoWrite?: DeferredEchoReservoirWrite;
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

export type BuffLevel = 1 | 2 | 3;
export type DraftLevel = 0 | BuffLevel;

export interface GameSetupPayload {
    mode: GameMode;
    board: BoardCell[][];
    bag: BagItem[];
    market: MarketState;
    decks: DeckState;
    initRandoms: Record<PlayerKey, PlayerInitRandoms>;
    isHost: boolean;
    hostPlayer: PlayerKey;
}

export interface InitDraftPayload extends GameSetupPayload {
    draftPool: string[];
    buffLevel: BuffLevel;
}

export type CardActionSource = 'market' | 'reserved';

export interface MarketCardSlot {
    level: 1 | 2 | 3;
    idx: number;
}

export type MarketCardRef =
    | (MarketCardSlot & { isExtra?: false; extraIdx?: undefined })
    | (MarketCardSlot & { isExtra: true; extraIdx: number });

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
    hostPlayer: PlayerKey;
    localPlayer: PlayerKey;
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
    buffLevel: DraftLevel;
    p2DraftLevel: DraftLevel;
    pendingSetup: GameSetupPayload | null;
    privilegeGemCount: number;
    pendingReserve: {
        card?: Card;
        level: 1 | 2 | 3;
        idx?: number;
        isExtra?: boolean;
        extraIdx?: number;
        isDeck?: boolean;
    } | null;
    bonusGemTarget: GemTypeObject | null;
    pendingBuy: {
        card: Card;
        source: CardActionSource;
        marketInfo?: MarketCardRef;
    } | null;
    nextPlayerAfterRoyal: PlayerKey | null;
    pendingExtraTurn: boolean;
    abilityResolution: AbilityResolutionState | null;
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
