import { RotateCcw, Hand, Scroll, Plus } from 'lucide-react';
import { GemColor, RoyalCard, CardAbility } from './types';
export { BUFF_LEVELS, BUFFS } from './data/buffs';

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
        color: 'from-slate-500 via-slate-700 to-slate-950',
        border: 'border-slate-300',
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
        id: 'r91-ro',
        points: 3,
        bonusColor: 'gold' as GemColor,
        ability: 'none' as CardAbility,
        label: 'The Queen',
    },
    {
        id: 'r92-ro',
        points: 2,
        bonusColor: 'gold' as GemColor,
        ability: 'again' as CardAbility,
        label: 'The Merchant',
    },
    {
        id: 'r93-ro',
        points: 2,
        bonusColor: 'gold' as GemColor,
        ability: 'scroll' as CardAbility,
        label: 'The Judge',
    },
    {
        id: 'r94-ro',
        points: 2,
        bonusColor: 'gold' as GemColor,
        ability: 'steal' as CardAbility,
        label: 'The Thief',
    },
];
