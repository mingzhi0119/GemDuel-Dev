/**
 * Core Game Types for Gem Duel
 *
 * This file defines the fundamental TypeScript interfaces and types
 * that ensure type safety across the entire game logic layer.
 */

// ============================================================================
// GEM TYPES & COLORS
// ============================================================================

declare global {
    interface Window {
        ipcRenderer: {
            on: (channel: string, func: (...args: any[]) => void) => void;
            send: (channel: string, ...args: any[]) => void;
            removeAllListeners: (channel: string) => void;
        };
    }
}

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
    bonusColor?: GemColor;
    prestige?: number;
    crowns?: number;
    bonusCount?: number;
    uid?: string;
    isBuff?: boolean;
    image?: string | null;
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
    };
    active?: string; // e.g., 'peek_deck', 'replenish_steal'
    winCondition?: {
        points?: number;
        crowns?: number;
        singleColor?: number;
        disableSingleColor?: boolean;
    };
    state?: Record<string, any>; // Runtime state tracking
}

/**
 * Individual buff definition
 */
export interface Buff {
    id: string;
    level: 0 | 1 | 2 | 3;
    label: string;
    desc: string;
    effects: BuffEffects;
    state?: Record<string, any>; // Runtime state for buffs
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

// ... (BoardCell, BagItem, ActiveModal) ...

/**
 * Main game state - the single source of truth
 */
export interface GameState {
    // ========== BOARD STATE ==========
    board: BoardCell[][]; // 5x5 grid of gems
    bag: BagItem[]; // Gem distribution bag for drawing random gems (BoardCell | string)

    // ========== TURN & PHASE ==========
    turn: PlayerKey; // Current player ('p1' or 'p2')
    phase: GamePhase; // Current game phase (was phase)
    mode: GameMode; // Match Type (LOCAL, PVE, ONLINE)
    isHost: boolean; // Authoritative identity (P1=true, P2=false)

    // ========== MODALS & UI ==========
    activeModal: ActiveModal | null;
    lastFeedback: Record<string, any> | null;
    toastMessage: string | null;
    winner: PlayerKey | null;

    // ========== CARD MANAGEMENT ==========
    decks: {
        1: Card[];
        2: Card[];
        3: Card[];
    };
    market: {
        1: (Card | null)[];
        2: (Card | null)[];
        3: (Card | null)[];
    };
    playerTableau: Record<PlayerKey, Card[]>; // Cards player owns
    playerReserved: Record<PlayerKey, Card[]>; // Cards in hand/reserved
    playerRoyals: Record<PlayerKey, RoyalCard[]>; // Royal cards owned
    playerTurnCounts: Record<PlayerKey, number>; // Track major actions per player

    // ========== GEM INVENTORY ==========
    inventories: Record<PlayerKey, GemInventory>;

    // ========== PRIVILEGES & SCROLLS ==========
    privileges: Record<PlayerKey, number>; // Privilege scroll count

    // ========== ROYAL CARDS & MILESTONES ==========
    royalDeck: RoyalCard[];
    royalMilestones: Record<PlayerKey, Record<number, boolean>>; // e.g., {p1: {3: true, 6: false}}

    // ========== SCORING ==========
    extraPoints: Record<PlayerKey, number>; // Bonus points (e.g., from crowns)
    extraCrowns: Record<PlayerKey, number>; // Crown count for achievements
    extraAllocation: Record<PlayerKey, GemInventory>; // Track extra gems that don't return to bag
    extraPrivileges: Record<PlayerKey, number>; // Special non-stealable privileges (max 1)
    playerBuffs: Record<PlayerKey, Buff>;
    draftPool: string[]; // Store only Buff IDs
    p2DraftPool?: string[]; // Store only Buff IDs
    p1SelectedBuff?: Buff | null; // Track P1 choice for P2's turn
    draftOrder: PlayerKey[];
    buffLevel: number;
    pendingSetup: {
        board?: BoardCell[][];
        decks?: Record<string, Card[]>;
    } | null;
    privilegeGemCount: number;

    // ========== PENDING ACTIONS (UI State) ==========
    pendingReserve: { deckLevel: number; isDeck?: boolean } | null;
    bonusGemTarget: GemTypeObject | null;
    pendingBuy: { card: Card; source: string; marketInfo?: any } | null;
    nextPlayerAfterRoyal: PlayerKey | null;
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Base action structure
 */
export interface GameAction {
    type: string;
    payload?: any;
}

/**
 * Payload types for specific actions
 */
export interface TakeGemsPayload {
    coords: Array<{ r: number; c: number }>;
}

export interface BuyCardPayload {
    cardId: string;
    source: 'market' | 'reserved';
}

export interface ReserveCardPayload {
    cardId: string;
    deckLevel: number;
}

export interface SelectBuffPayload {
    buffId: string;
    player: PlayerKey;
}

// ============================================================================
// VALIDATION & SELECTORS
// ============================================================================

/**
 * Result of a validation check
 */
export interface ValidationResult {
    valid: boolean;
    reason?: string;
}

/**
 * Game statistics/scoring
 */
export interface PlayerScore {
    points: number;
    crowns: number;
    cardCount: number;
    gemCount: number;
}
