import { GEM_TYPES, INITIAL_COUNTS, BONUS_COLORS } from './constants';
// 🟢 确保引入了真实数据
import { isColorPreferenceBonusCardId } from './data/colorPreferenceProxyCards';
import { CLASSIC_CARDS, ROGUE_CARDS } from './data/realCards';
import { Card, GemInventory, GemInventoryKey, Buff, BoardCell, GemColor } from './types';

export interface RandomSource {
    next: () => number;
    nextId?: (scope: string, index: number) => string;
}

type RandomInput = RandomSource | (() => number);

const normalizeRandomSource = (randomSource?: RandomInput): RandomSource => {
    if (typeof randomSource === 'function') {
        return { next: randomSource };
    }

    if (randomSource) {
        return randomSource;
    }

    return createUnseededRandomSource();
};

// Casual local setup can use ambient entropy. Replayable simulations and networked setup
// must pass an explicit seed or RandomSource so generated actions remain reproducible.
export const createUnseededRandomSource = (): RandomSource => {
    const next = Math.random;
    return {
        next,
        nextId: (scope, index) =>
            `${scope}-${index}-${Math.floor(next() * 0xffffffff).toString(36)}`,
    };
};

const hashSeed = (seed: string | number): number => {
    const text = String(seed);
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
};

export const createSeededRandomSource = (seed: string | number): RandomSource => {
    let state = hashSeed(seed) || 0x9e3779b9;
    let counter = 0;

    const next = () => {
        state = Math.imul(state, 1664525) + 1013904223;
        return ((state >>> 0) + 0.5) / 4294967296;
    };

    return {
        next,
        nextId: (scope, index) => {
            counter += 1;
            return `${scope}-${index}-${counter}-${Math.floor(next() * 0xffffffff).toString(36)}`;
        },
    };
};

const createRuntimeCardInstanceSuffix = (random: RandomSource): string => {
    const timestampShapedSerial = Math.floor(1_000_000_000_000 + random.next() * 9_000_000_000_000);
    const token = Math.floor(random.next() * 0xffffffff).toString(36);
    return `${timestampShapedSerial}-${token}`;
};

// 洗牌算法
export const shuffleArray = <T>(array: T[], randomSource?: RandomInput): T[] => {
    const random = normalizeRandomSource(randomSource);
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(random.next() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j] as T, newArray[i] as T];
    }
    return newArray;
};

// 生成初始宝石袋
export const generateGemPool = (randomSource?: RandomInput): BoardCell[] => {
    const random = normalizeRandomSource(randomSource);
    const pool: BoardCell[] = [];
    Object.entries(INITIAL_COUNTS).forEach(([typeKey, count]) => {
        for (let i = 0; i < count; i++) {
            pool.push({
                uid:
                    random.nextId?.(`gem-${typeKey}`, i) ??
                    `${typeKey}-${i}-${Math.floor(random.next() * 0xffffffff).toString(36)}`,
                type: GEM_TYPES[typeKey.toUpperCase() as keyof typeof GEM_TYPES],
            });
        }
    });
    return shuffleArray(pool, random);
};

// 检查相邻
export const isAdjacent = (r1: number, c1: number, r2: number, c2: number): boolean => {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0);
};

// 获取连线方向
export const getDirection = (r1: number, c1: number, r2: number, c2: number) => {
    return { dr: r2 - r1, dc: c2 - c1 };
};

// 🟢 生成卡组
export const generateDeck = (
    level: number,
    isRogue: boolean = false,
    randomSource?: RandomInput
): Card[] => {
    const random = normalizeRandomSource(randomSource);
    const cardPool = isRogue ? ROGUE_CARDS : CLASSIC_CARDS;
    const levelCards = cardPool.filter((c) => c.level === level);

    const deck = levelCards.map((card) => ({
        ...(card as Card),
        id: `${card.id}-${createRuntimeCardInstanceSuffix(random)}`,
    }));

    return shuffleArray(deck, random);
};

// 🟢 Unified Transaction Calculator (Used by Hook and Reducer)
export const calculateTransaction = (
    card: Card,
    playerInv: GemInventory,
    playerTableau: Card[],
    playerBuffs: Buff | null = null,
    isReserved: boolean = false
) => {
    const bonuses = BONUS_COLORS.reduce(
        (acc, color) => {
            acc[color] = playerTableau
                .filter(
                    (c) =>
                        c.bonusColor === color && (!c.isBuff || isColorPreferenceBonusCardId(c.id))
                ) // Allow Color Preference proxy cards and legacy replay dummy cards.
                .reduce((sum, c) => sum + (c.bonusCount ?? 1), 0);
            return acc;
        },
        {} as Record<GemColor, number>
    );

    const buffEffects = playerBuffs?.effects?.passive || {};

    // Flexible Discount: Only applies to Level 2 and 3 cards
    const discountAny = card.level === 2 || card.level === 3 ? buffEffects.discountAny || 0 : 0;

    // Wonder Architect: Only applies to first 3 Level 3 cards
    const l3PurchasedCount = (playerBuffs?.state?.l3PurchasedCount as number) || 0;
    const l3Discount =
        card.level === 3 && buffEffects.l3Discount && l3PurchasedCount < 3
            ? buffEffects.l3Discount
            : 0;

    // Down Payment: Only applies to reserved cards
    const reservedDiscount =
        isReserved && buffEffects.reservedDiscount ? buffEffects.reservedDiscount : 0;

    const totalFlatDiscount = discountAny + l3Discount + reservedDiscount;

    const rawCost: Record<string, number> = {};

    // 1. Apply Bonus Discounts
    Object.entries(card.cost).forEach(([color, cost]) => {
        let discount = 0;
        if (color !== 'pearl' && color !== 'gold') discount = bonuses[color as GemColor] || 0;
        // Note: Color Preference dummy card already adds to 'bonuses' in tableau, so no extra logic here.

        const needed = Math.max(0, cost - discount);
        rawCost[color] = needed;
    });

    // 2. Apply Flat Discounts (Buffs) to BASIC colors only
    let remainingDiscount = totalFlatDiscount;
    BONUS_COLORS.forEach((color) => {
        if (remainingDiscount > 0 && rawCost[color] > 0) {
            const reduction = Math.min(rawCost[color], remainingDiscount);
            rawCost[color] -= reduction;
            remainingDiscount -= reduction;
        }
    });

    let goldCost = 0;
    const gemsPaid: Record<string, number> = {};

    // 3. Calculate Payment
    (Object.entries(rawCost) as Array<[GemInventoryKey, number]>).forEach(([color, needed]) => {
        const available = playerInv[color] || 0;
        const paid = Math.min(needed, available);

        if (color !== 'gold') {
            gemsPaid[color] = paid;
            goldCost += needed - paid;
        }
    });

    // 4. All-Seeing Eye Gold Buff
    const isGoldBuff = buffEffects.goldBuff && card.level === 3;
    if (isGoldBuff) {
        goldCost = Math.ceil(goldCost / 2.0);
    }

    const affordable = (playerInv.gold || 0) >= goldCost;

    return { affordable, goldCost, gemsPaid };
};
