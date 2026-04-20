export type BuffLocale = 'en' | 'zh';
import type { BuffEffects } from '../types';

interface LocalizedBuffText {
    label: string;
    desc: string;
}

interface BuffCopyEntry {
    level: 1 | 2 | 3;
    goal?: NonNullable<BuffEffects['winCondition']>;
    en: LocalizedBuffText;
    zh: LocalizedBuffText;
}

type BuffCopyMap = Record<string, BuffCopyEntry>;

export const BUFF_COPY: BuffCopyMap = {
    privilege_favor: {
        level: 1,
        en: { label: 'Privilege Favor', desc: 'Start with 1 Special Privilege.' },
        zh: { label: '特权眷顾', desc: '开始时获得 1 个特殊特权。' },
    },
    head_start: {
        level: 1,
        goal: { points: 18 },
        en: { label: 'Head Start', desc: 'Start with 1 random basic gem.' },
        zh: { label: '先行一步', desc: '开始时获得 1 个随机基础宝石。' },
    },
    royal_blood: {
        level: 1,
        en: { label: 'Royal Blood', desc: 'Start with 1 Crown.' },
        zh: { label: '皇室血统', desc: '开始时拥有 1 个皇冠。' },
    },
    intelligence: {
        level: 1,
        en: {
            label: 'Intelligence',
            desc: 'Gain optional action: Peek at the top 3 cards of any deck.',
        },
        zh: { label: '情报员', desc: '获得可选行动：查看任意卡组顶部的 3 张牌。' },
    },
    deep_pockets: {
        level: 1,
        en: { label: 'Deep Pockets', desc: 'Gem holding limit increased to 12.' },
        zh: { label: '深口袋', desc: '宝石持有上限增加至 12 个。' },
    },
    backup_supply: {
        level: 1,
        en: { label: 'Backup Supply', desc: 'Start with 2 random basic gems.' },
        zh: { label: '后备补给', desc: '开始时获得 2 个随机基础宝石。' },
    },
    patient_investor: {
        level: 1,
        en: { label: 'Patient Investor', desc: 'Gain 1 Extra Gold on your first Reserve action.' },
        zh: { label: '耐心投资者', desc: '在你的第一次保留行动中获得 1 个额外黄金。' },
    },
    insight: {
        level: 1,
        goal: { points: 18 },
        en: { label: 'Insight', desc: 'You can always see the top card of the Level 1 Deck.' },
        zh: { label: '洞察力', desc: '你始终可以看到 1 级卡组顶部的牌。' },
    },
    down_payment: {
        level: 1,
        en: { label: 'Down Payment', desc: 'Reserved cards cost 1 less (basic gems only).' },
        zh: { label: '预付定金', desc: '保留的卡牌成本减少 1（仅限基础宝石）。' },
    },
    nimble_fingers: {
        level: 1,
        en: { label: 'Nimble Fingers', desc: 'Gain 1 random basic gem when you Reserve a card.' },
        zh: { label: '快手窃贼', desc: '当你执行保留行动时，获得一个随机基础宝石。' },
    },
    pearl_trader: {
        level: 2,
        en: { label: 'Pearl Trader', desc: 'Gem limit increased to 11. Start with 1 Extra Pearl.' },
        zh: { label: '珍珠贸易商', desc: '宝石上限增加至 11。开始时获得 1 个额外珍珠。' },
    },
    gold_reserve: {
        level: 2,
        en: { label: 'Gold Reserve', desc: 'Start with 1 Extra Gold and 1 random Reserved Card.' },
        zh: { label: '黄金储备', desc: '开始时获得 1 个额外黄金和 1 张随机保留卡。' },
    },
    color_preference: {
        level: 2,
        en: {
            label: 'Color Preference',
            desc: 'Random color costs -1 for you (assigned at start).',
        },
        zh: { label: '色彩偏好', desc: '随机一种颜色对你而言成本 -1。' },
    },
    extortion: {
        level: 2,
        en: {
            label: 'Extortion',
            desc: 'Every 2nd time you Replenish the board, steal 1 basic gem from opponent.',
        },
        zh: { label: '巧取豪夺', desc: '你每执行 2 次补给版图，就从对手那里偷取 1 个基础宝石。' },
    },
    flexible_discount: {
        level: 2,
        en: {
            label: 'Flexible Discount',
            desc: 'Reduce cost of Level 2 and 3 cards by 1 (basic gems only).',
        },
        zh: { label: '灵活折扣', desc: '购买 2 级和 3 级卡牌时，基础宝石成本减少 1。' },
    },
    bounty_hunter: {
        level: 2,
        en: {
            label: 'Bounty Hunter',
            desc: 'Gain 1 random basic gem when you buy a card with Crowns.',
        },
        zh: { label: '赏金猎人', desc: '当你购买带有皇冠的卡牌时，获得 1 个随机基础宝石。' },
    },
    recycler: {
        level: 2,
        en: {
            label: 'Recycler',
            desc: 'Start with 1 random basic gem. Refund 1 basic gem when buying a Level 2 or 3 card.',
        },
        zh: {
            label: '回收者',
            desc: '开始时获得 1 个随机基础宝石。购买 2 级或 3 级卡牌时，返还 1 个基础宝石。',
        },
    },
    aggressive_expansion: {
        level: 2,
        en: {
            label: 'Aggressive Expansion',
            desc: 'Gain 1 random basic gem when you Replenish the board.',
        },
        zh: { label: '激进扩张', desc: '当你补给版图时，获得 1 个随机基础宝石。' },
    },
    speculator: {
        level: 2,
        en: { label: 'Speculator', desc: 'Gain 2 random basic gems after buying a reserved card.' },
        zh: { label: '投机商', desc: '购买一张保留卡后，获得 2 个随机基础宝石。' },
    },
    hoarder: {
        level: 2,
        en: {
            label: 'Hoarder',
            desc: 'If holding 3 reserved cards, gain 1 random basic gem at start of turn.',
        },
        zh: {
            label: '资源囤积者',
            desc: '如果你手中持有 3 张保留卡，回合开始自动获得 1 个随机基础宝石。',
        },
    },
    greed_king: {
        level: 3,
        goal: { points: 25 },
        en: { label: 'King of Greed', desc: 'All cards give +1 Point.' },
        zh: { label: '贪婪之王', desc: '所有卡牌额外提供 +1 分。' },
    },
    royal_envoy: {
        level: 3,
        goal: { disableSingleColor: true },
        en: {
            label: 'Royal Envoy',
            desc: 'After your 5th turn fully resolves, pick 1 remaining Royal Card.',
        },
        zh: { label: '皇家特使', desc: '在你的第 5 个回合完整结算后，拿取 1 张剩余皇室卡。' },
    },
    double_agent: {
        level: 3,
        en: {
            label: 'Double Agent',
            desc: 'Each Privilege Scroll takes 2 gems instead of 1. Gem Cap: 8.',
        },
        zh: { label: '双重间谍', desc: '每个特权卷轴改为拿取 2 个宝石。宝石上限：8。' },
    },
    all_seeing_eye: {
        level: 3,
        goal: { singleColor: 13 },
        en: {
            label: 'All-Seeing Eye',
            desc: 'Reveal 2 extra L3 cards. Gold pays double toward missing L3 costs.',
        },
        zh: {
            label: '全知之眼',
            desc: '展示 2 张额外 L3 卡。用黄金补足 3 级卡缺失费用时价值翻倍。',
        },
    },
    wonder_architect: {
        level: 3,
        goal: { crowns: 13, disableSingleColor: true },
        en: {
            label: 'Wonder Architect',
            desc: 'Your first 3 Level 3 cards cost 3 less (basic gems only).',
        },
        zh: { label: '奇迹建筑师', desc: '你的前 3 张 3 级卡基础宝石成本减少 3。' },
    },
    minimalist: {
        level: 3,
        en: {
            label: 'Minimalist',
            desc: 'Your first 2 purchased cards provide Double Bonuses. Gem Cap: 6.',
        },
        zh: { label: '极简主义', desc: '你购买的前 2 张卡提供双倍奖励。宝石上限：6。' },
    },
    pacifist: {
        level: 3,
        en: {
            label: 'Pacifist',
            desc: 'Immune to all negative effects, including opponent Steal, and your standard Privileges cannot be transferred away when the board Privilege supply is empty. Start with 1 Extra Gold and 1 Special Privilege.',
        },
        zh: {
            label: '和平主义者',
            desc: '免疫一切负面效果，包括来自对手的掠夺，且不会因版图特权供应堆为空而给予对手特权。开始时获得 1 个额外黄金和 1 个特殊特权。',
        },
    },
    desperate_gamble: {
        level: 3,
        en: {
            label: 'Desperate Gamble',
            desc: 'Start with 2 Extra Gold. You cannot take 3 Gems with the Take Gems action. Gain 1 Special Privilege every 2 turns.',
        },
        zh: {
            label: '孤注一掷',
            desc: '开始时获得 2 个额外黄金。无法通过“拿取宝石”行动一次拿 3 个宝石。每 2 回合获得 1 个特殊特权。',
        },
    },
    puppet_master: {
        level: 3,
        en: {
            label: 'The Puppet Master',
            desc: 'Gain optional action: discard one reserved card, return it to the bottom of its deck, and gain 1 random basic gem. You may take this action multiple times in the same turn.',
        },
        zh: {
            label: '幕后推手',
            desc: '获得可选行动：弃掉 1 张保留卡，将其放回对应牌库底部，并获得 1 个随机基础宝石。该行动在同一回合可执行多次。',
        },
    },
    collector: {
        level: 3,
        goal: { points: 22 },
        en: {
            label: 'The Collector',
            desc: "You may reserve cards from your opponent's reserved area.",
        },
        zh: { label: '收藏狂人', desc: '你可以从对手的保留区直接保留卡牌。' },
    },
};

export const BUFF_ORDER_BY_LEVEL: Record<1 | 2 | 3, string[]> = {
    1: [
        'privilege_favor',
        'head_start',
        'royal_blood',
        'intelligence',
        'deep_pockets',
        'backup_supply',
        'patient_investor',
        'insight',
        'down_payment',
        'nimble_fingers',
    ],
    2: [
        'pearl_trader',
        'gold_reserve',
        'color_preference',
        'extortion',
        'flexible_discount',
        'bounty_hunter',
        'recycler',
        'aggressive_expansion',
        'speculator',
        'hoarder',
    ],
    3: [
        'greed_king',
        'royal_envoy',
        'double_agent',
        'all_seeing_eye',
        'wonder_architect',
        'minimalist',
        'pacifist',
        'desperate_gamble',
        'puppet_master',
        'collector',
    ],
};

const BUFF_LEVEL_TITLES = {
    en: {
        1: 'Level 1: Minor Tweaks',
        2: 'Level 2: Tactical Shifts',
        3: 'Level 3: Game Changers',
    },
    zh: {
        1: '1 级：微调',
        2: '2 级：流派',
        3: '3 级：规则改变',
    },
} as const;

const GOAL_ADJUSTMENT_COPY = {
    en: {
        title: 'Goal Adjustment',
        points: 'Points',
        crowns: 'Crowns',
        singleColor: 'Points (1 Color)',
        disableSingleColor: 'Single Color Win',
        disabled: 'Disabled',
    },
    zh: {
        title: '目标变更',
        points: '分数',
        crowns: '皇冠',
        singleColor: '单色分数',
        disableSingleColor: '单色获胜',
        disabled: '关闭',
    },
} as const;

export interface BuffGoalAdjustmentItem {
    label: string;
    value: string;
}

export interface BuffGoalAdjustment {
    title: string;
    items: BuffGoalAdjustmentItem[];
}

export function getBuffText(id: string, locale: BuffLocale): LocalizedBuffText {
    return BUFF_COPY[id]?.[locale] ?? { label: id, desc: '' };
}

export function getBuffWinCondition(id: string): BuffEffects['winCondition'] | undefined {
    const goal = BUFF_COPY[id]?.goal;
    return goal ? { ...goal } : undefined;
}

export function getBuffGoalAdjustment(id: string, locale: BuffLocale): BuffGoalAdjustment | null {
    const goal = BUFF_COPY[id]?.goal;
    if (!goal) {
        return null;
    }

    const copy = GOAL_ADJUSTMENT_COPY[locale];
    const items: BuffGoalAdjustmentItem[] = [];

    if (goal.points) {
        items.push({ label: copy.points, value: String(goal.points) });
    }
    if (goal.crowns) {
        items.push({ label: copy.crowns, value: String(goal.crowns) });
    }
    if (goal.singleColor) {
        items.push({ label: copy.singleColor, value: String(goal.singleColor) });
    }
    if (goal.disableSingleColor) {
        items.push({ label: copy.disableSingleColor, value: copy.disabled });
    }

    return items.length > 0 ? { title: copy.title, items } : null;
}

function buildBuffInlineGoalSummary(id: string, locale: BuffLocale): string {
    const goal = BUFF_COPY[id]?.goal;
    if (!goal) {
        return '';
    }

    const segments: string[] = [];

    if (locale === 'en') {
        if (goal.points) {
            segments.push(`Win Condition: ${goal.points} Points.`);
        }
        if (goal.crowns) {
            segments.push(`Win Condition: ${goal.crowns} Crowns.`);
        }
        if (goal.singleColor) {
            segments.push(`Win Condition: ${goal.singleColor} Points in one color.`);
        }
        if (goal.disableSingleColor) {
            segments.push('No Single Color Win.');
        }
    } else {
        if (goal.points) {
            segments.push(`获胜条件：${goal.points} 分。`);
        }
        if (goal.crowns) {
            segments.push(`获胜条件：${goal.crowns} 个皇冠。`);
        }
        if (goal.singleColor) {
            segments.push(`获胜条件：单色 ${goal.singleColor} 分。`);
        }
        if (goal.disableSingleColor) {
            segments.push('取消单色获胜。');
        }
    }

    return segments.join(' ');
}

export function buildBuffCompendium(locale: BuffLocale): string {
    return ([1, 2, 3] as const)
        .map((level) => {
            const title = BUFF_LEVEL_TITLES[locale][level];
            const entries = BUFF_ORDER_BY_LEVEL[level]
                .map((id) => {
                    const copy = getBuffText(id, locale);
                    const goalSummary = buildBuffInlineGoalSummary(id, locale);
                    return `${copy.label}: ${[copy.desc, goalSummary].filter(Boolean).join(' ')}`;
                })
                .join('\n');

            return `${title}\n\n${entries}`;
        })
        .join('\n\n');
}
