import { RotateCcw, Hand, Scroll, Plus } from 'lucide-react';
import { GemColor, RoyalCard, CardAbility } from './types';
import { getBuffText, getBuffWinCondition } from './data/buffCopy';

export const GRID_SIZE = 5;

export const GAME_PHASES = {
    IDLE: 'IDLE',
    DRAFT_PHASE: 'DRAFT_PHASE',
    SELECT_ROYAL: 'SELECT_ROYAL',
    DISCARD_EXCESS_GEMS: 'DISCARD_EXCESS_GEMS',
    BONUS_ACTION: 'BONUS_ACTION',
    STEAL_ACTION: 'STEAL_ACTION',
    PRIVILEGE_ACTION: 'PRIVILEGE_ACTION',
    RESERVE_WAITING_GEM: 'RESERVE_WAITING_GEM',
    SELECT_CARD_COLOR: 'SELECT_CARD_COLOR',
} as const;

export const GEM_TYPES = {
    BLUE: {
        id: 'blue' as const,
        color: 'from-blue-400 to-blue-700',
        border: 'border-blue-300',
        label: 'Blue',
    },
    WHITE: {
        id: 'white' as const,
        color: 'from-slate-100 to-slate-400',
        border: 'border-white',
        label: 'White',
    },
    GREEN: {
        id: 'green' as const,
        color: 'from-emerald-400 to-emerald-700',
        border: 'border-emerald-300',
        label: 'Green',
    },
    BLACK: {
        id: 'black' as const,
        color: 'from-slate-700 to-slate-900',
        border: 'border-gray-500',
        label: 'Black',
    },
    RED: {
        id: 'red' as const,
        color: 'from-red-400 to-red-700',
        border: 'border-red-300',
        label: 'Red',
    },
    PEARL: {
        id: 'pearl' as const,
        color: 'from-pink-300 to-pink-500',
        border: 'border-pink-300',
        label: 'Pearl',
    },
    GOLD: {
        id: 'gold' as const,
        color: 'from-yellow-300 via-yellow-500 to-yellow-700',
        border: 'border-yellow-200',
        label: 'Gold',
    },
    NULL: {
        id: 'empty' as const,
        color: 'from-slate-500 to-slate-700',
        border: 'border-slate-400',
        label: 'Neutral',
    },
    EMPTY: {
        id: 'empty' as const,
        color: 'bg-transparent',
        border: 'border-transparent',
        label: '',
    },
} as const;

export const INITIAL_COUNTS: Record<string, number> = {
    red: 4,
    green: 4,
    blue: 4,
    black: 4,
    white: 4,
    pearl: 2,
    gold: 3,
};

export const BONUS_COLORS: GemColor[] = ['blue', 'white', 'green', 'black', 'red'];

// 🌀 螺旋填充顺序 (之前如果缺了这个，刷新盘面会报错)
export const SPIRAL_ORDER = [
    [2, 2],
    [2, 3],
    [3, 3],
    [3, 2],
    [3, 1],
    [2, 1],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [4, 3],
    [4, 2],
    [4, 1],
    [4, 0],
    [3, 0],
    [2, 0],
    [1, 0],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
];

// ⚡ 特殊能力定义 (之前如果缺了这个，读取 realCards.js 会直接白屏)
export const ABILITIES = {
    AGAIN: { id: 'again', label: 'Play Again', icon: RotateCcw },
    STEAL: { id: 'steal', label: 'Steal Gem', icon: Hand },
    SCROLL: { id: 'scroll', label: 'Take Scroll', icon: Scroll },
    BONUS_GEM: { id: 'bonus_gem', label: 'Take Gem', icon: Plus },
    NONE: { id: 'none', label: '', icon: null },
} as const;

// 🟢 新增：皇室卡定义 (Royal Cards)
export const ROYAL_CARDS: RoyalCard[] = [
    {
        id: 'royal-3pts',
        points: 3,
        bonusColor: 'gold' as GemColor,
        ability: 'none' as CardAbility,
        label: 'The Queen',
    },
    {
        id: 'royal-again',
        points: 2,
        bonusColor: 'gold' as GemColor,
        ability: 'again' as CardAbility,
        label: 'The Merchant',
    },
    {
        id: 'royal-scroll',
        points: 2,
        bonusColor: 'gold' as GemColor,
        ability: 'scroll' as CardAbility,
        label: 'The Judge',
    },
    {
        id: 'royal-steal',
        points: 2,
        bonusColor: 'gold' as GemColor,
        ability: 'steal' as CardAbility,
        label: 'The Thief',
    },
];

export const BUFF_LEVELS = {
    1: 'Minor Tweak',
    2: 'Tactical Shift',
    3: 'Game Changer',
};

export const BUFFS = {
    // --- Level 1 ---
    PRIVILEGE_FAVOR: {
        id: 'privilege_favor',
        level: 1,
        category: 'victory',
        label: getBuffText('privilege_favor', 'en').label,
        desc: getBuffText('privilege_favor', 'en').desc,
        effects: { onInit: { privilege: 1 } },
    },
    HEAD_START: {
        id: 'head_start',
        level: 1,
        category: 'victory',
        label: getBuffText('head_start', 'en').label,
        desc: getBuffText('head_start', 'en').desc,
        effects: { onInit: { randomGem: 1 }, winCondition: getBuffWinCondition('head_start') },
    },
    ROYAL_BLOOD: {
        id: 'royal_blood',
        level: 1,
        category: 'victory',
        label: getBuffText('royal_blood', 'en').label,
        desc: getBuffText('royal_blood', 'en').desc,
        effects: { onInit: { crowns: 1 } },
    },
    INTELLIGENCE: {
        id: 'intelligence',
        level: 1,
        category: 'intel',
        label: getBuffText('intelligence', 'en').label,
        desc: getBuffText('intelligence', 'en').desc,
        effects: { active: 'peek_deck' },
    },
    DEEP_POCKETS: {
        id: 'deep_pockets',
        level: 1,
        category: 'economy',
        label: getBuffText('deep_pockets', 'en').label,
        desc: getBuffText('deep_pockets', 'en').desc,
        effects: { passive: { gemCap: 12 } },
    },
    BACKUP_SUPPLY: {
        id: 'backup_supply',
        level: 1,
        category: 'economy',
        label: getBuffText('backup_supply', 'en').label,
        desc: getBuffText('backup_supply', 'en').desc,
        effects: { onInit: { randomGem: 2 } },
    },
    PATIENT_INVESTOR: {
        id: 'patient_investor',
        level: 1,
        category: 'economy',
        label: getBuffText('patient_investor', 'en').label,
        desc: getBuffText('patient_investor', 'en').desc,
        effects: { passive: { firstReserveBonus: 1 } },
    },
    INSIGHT: {
        id: 'insight',
        level: 1,
        category: 'intel',
        label: getBuffText('insight', 'en').label,
        desc: getBuffText('insight', 'en').desc,
        effects: { passive: { revealDeck1: true }, winCondition: getBuffWinCondition('insight') },
    },
    DOWN_PAYMENT: {
        id: 'down_payment',
        level: 1,
        category: 'discount',
        label: getBuffText('down_payment', 'en').label,
        desc: getBuffText('down_payment', 'en').desc,
        effects: { passive: { reservedDiscount: 1 } },
    },
    NIMBLE_FINGERS: {
        id: 'nimble_fingers',
        level: 1,
        category: 'economy',
        label: getBuffText('nimble_fingers', 'en').label,
        desc: getBuffText('nimble_fingers', 'en').desc,
        effects: { passive: { reserveBonusGem: true } },
    },

    // --- Level 2 ---
    PEARL_TRADER: {
        id: 'pearl_trader',
        level: 2,
        category: 'economy',
        label: getBuffText('pearl_trader', 'en').label,
        desc: getBuffText('pearl_trader', 'en').desc,
        effects: { onInit: { pearl: 1 }, passive: { gemCap: 11 } },
    },
    GOLD_RESERVE: {
        id: 'gold_reserve',
        level: 2,
        category: 'economy',
        label: getBuffText('gold_reserve', 'en').label,
        desc: getBuffText('gold_reserve', 'en').desc,
        effects: { onInit: { gold: 1, reserveCard: 1 } },
    },
    COLOR_PREFERENCE: {
        id: 'color_preference',
        level: 2,
        category: 'discount',
        label: getBuffText('color_preference', 'en').label,
        desc: getBuffText('color_preference', 'en').desc,
        effects: { passive: { discountRandom: 1 } },
    },
    EXTORTION: {
        id: 'extortion',
        level: 2,
        category: 'control',
        label: getBuffText('extortion', 'en').label,
        desc: getBuffText('extortion', 'en').desc,
        effects: { active: 'replenish_steal' },
    },
    FLEXIBLE_DISCOUNT: {
        id: 'flexible_discount',
        level: 2,
        category: 'discount',
        label: getBuffText('flexible_discount', 'en').label,
        desc: getBuffText('flexible_discount', 'en').desc,
        effects: { passive: { discountAny: 1 } },
    },
    BOUNTY_HUNTER: {
        id: 'bounty_hunter',
        level: 2,
        category: 'economy',
        label: getBuffText('bounty_hunter', 'en').label,
        desc: getBuffText('bounty_hunter', 'en').desc,
        effects: { passive: { crownBonusGem: true } },
    },
    RECYCLER: {
        id: 'recycler',
        level: 2,
        category: 'economy',
        label: getBuffText('recycler', 'en').label,
        desc: getBuffText('recycler', 'en').desc,
        effects: { onInit: { randomGem: 1 }, passive: { recycler: true } },
    },
    AGGRESSIVE_EXPANSION: {
        id: 'aggressive_expansion',
        level: 2,
        category: 'control',
        label: getBuffText('aggressive_expansion', 'en').label,
        desc: getBuffText('aggressive_expansion', 'en').desc,
        effects: { passive: { refillBonus: true } },
    },
    SPECULATOR: {
        id: 'speculator',
        level: 2,
        category: 'intel',
        label: getBuffText('speculator', 'en').label,
        desc: getBuffText('speculator', 'en').desc,
        effects: { passive: { buyReservedBonus: 2 } },
    },
    HOARDER: {
        id: 'hoarder',
        level: 2,
        category: 'economy',
        label: getBuffText('hoarder', 'en').label,
        desc: getBuffText('hoarder', 'en').desc,
        effects: { passive: { hoarderBonus: true } },
    },

    // --- Level 3 ---
    GREED_KING: {
        id: 'greed_king',
        level: 3,
        category: 'victory',
        label: getBuffText('greed_king', 'en').label,
        desc: getBuffText('greed_king', 'en').desc,
        effects: { passive: { pointBonus: 1 }, winCondition: getBuffWinCondition('greed_king') },
    },
    ROYAL_ENVOY: {
        id: 'royal_envoy',
        level: 3,
        category: 'victory',
        label: getBuffText('royal_envoy', 'en').label,
        desc: getBuffText('royal_envoy', 'en').desc,
        effects: {
            active: 'turn5_royal',
            winCondition: getBuffWinCondition('royal_envoy'),
        },
    },
    DOUBLE_AGENT: {
        id: 'double_agent',
        level: 3,
        category: 'control',
        label: getBuffText('double_agent', 'en').label,
        desc: getBuffText('double_agent', 'en').desc,
        effects: { passive: { privilegeBuff: 2, gemCap: 8 } },
    },
    ALL_SEEING_EYE: {
        id: 'all_seeing_eye',
        level: 3,
        category: 'victory',
        label: getBuffText('all_seeing_eye', 'en').label,
        desc: getBuffText('all_seeing_eye', 'en').desc,
        effects: {
            passive: { extraL3: true, goldBuff: true },
            winCondition: getBuffWinCondition('all_seeing_eye'),
        },
    },
    WONDER_ARCHITECT: {
        id: 'wonder_architect',
        level: 3,
        category: 'discount',
        label: getBuffText('wonder_architect', 'en').label,
        desc: getBuffText('wonder_architect', 'en').desc,
        effects: {
            passive: { l3Discount: 3 },
            winCondition: getBuffWinCondition('wonder_architect'),
        },
    },
    MINIMALIST: {
        id: 'minimalist',
        level: 3,
        category: 'economy',
        label: getBuffText('minimalist', 'en').label,
        desc: getBuffText('minimalist', 'en').desc,
        effects: { passive: { doubleBonusFirst5: true, gemCap: 6 } },
    },
    PACIFIST: {
        id: 'pacifist',
        level: 3,
        category: 'victory',
        label: getBuffText('pacifist', 'en').label,
        desc: getBuffText('pacifist', 'en').desc,
        effects: {
            onInit: { gold: 1, privilege: 1 },
            passive: { immuneNegative: true, protectPrivilegeTransfer: true },
        },
    },
    DESPERATE_GAMBLE: {
        id: 'desperate_gamble',
        level: 3,
        category: 'control',
        label: getBuffText('desperate_gamble', 'en').label,
        desc: getBuffText('desperate_gamble', 'en').desc,
        effects: { onInit: { gold: 2 }, passive: { noTake3: true, periodicPrivilege: 2 } },
    },
    PUPPET_MASTER: {
        id: 'puppet_master',
        level: 3,
        category: 'intel',
        label: getBuffText('puppet_master', 'en').label,
        desc: getBuffText('puppet_master', 'en').desc,
        effects: { active: 'discard_reserved' },
    },
    COLLECTOR: {
        id: 'collector',
        level: 3,
        category: 'control',
        label: getBuffText('collector', 'en').label,
        desc: getBuffText('collector', 'en').desc,
        effects: {
            passive: { stealReserved: true },
            winCondition: getBuffWinCondition('collector'),
        },
    },

    // Default
    NONE: {
        id: 'none',
        level: 0,
        label: 'Classic',
        desc: 'No buffs.',
        effects: {},
    },
} as const;
