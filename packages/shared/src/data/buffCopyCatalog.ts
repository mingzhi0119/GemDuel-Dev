import type { BuffEffects } from '../types';
import type { AppLocale } from '../i18n';
import { getLexiconLabel } from '../lexicon';

export type BuffLocale = AppLocale;

export interface LocalizedBuffText {
    label: string;
    desc: string;
}

export interface BuffCopyEntry {
    level: 1 | 2 | 3;
    goal?: NonNullable<BuffEffects['winCondition']>;
    en: LocalizedBuffText;
    zh: LocalizedBuffText;
}

export type BuffCopyMap = Record<string, BuffCopyEntry>;

const TERM = {
    optionalAction: {
        en: getLexiconLabel('optionalAction', 'en'),
        zh: getLexiconLabel('optionalAction', 'zh'),
    },
    privilegeScroll: {
        en: getLexiconLabel('privilegeScroll', 'en'),
        zh: getLexiconLabel('privilegeScroll', 'zh'),
    },
    specialPrivilege: {
        en: getLexiconLabel('specialPrivilege', 'en'),
        zh: getLexiconLabel('specialPrivilege', 'zh'),
    },
    basicGem: {
        en: getLexiconLabel('basicGem', 'en'),
        zh: getLexiconLabel('basicGem', 'zh'),
    },
    extraGold: {
        en: getLexiconLabel('extraGold', 'en'),
        zh: getLexiconLabel('extraGold', 'zh'),
    },
    extraPearl: {
        en: getLexiconLabel('extraPearl', 'en'),
        zh: getLexiconLabel('extraPearl', 'zh'),
    },
    reserve: {
        en: getLexiconLabel('reserve', 'en'),
        zh: getLexiconLabel('reserve', 'zh'),
    },
    reservedCard: {
        en: getLexiconLabel('reservedCard', 'en'),
        zh: getLexiconLabel('reservedCard', 'zh'),
    },
    replenish: {
        en: getLexiconLabel('replenish', 'en'),
        zh: getLexiconLabel('replenish', 'zh'),
    },
    crowns: {
        en: getLexiconLabel('crowns', 'en'),
        zh: getLexiconLabel('crowns', 'zh'),
    },
    bonus: {
        en: getLexiconLabel('bonus', 'en'),
        zh: getLexiconLabel('bonus', 'zh'),
    },
    royalCard: {
        en: getLexiconLabel('royalCard', 'en'),
        zh: getLexiconLabel('royalCard', 'zh'),
    },
    gemCap: {
        en: getLexiconLabel('gemCap', 'en'),
        zh: getLexiconLabel('gemCap', 'zh'),
    },
    takeGems: {
        en: getLexiconLabel('takeGems', 'en'),
        zh: getLexiconLabel('takeGems', 'zh'),
    },
    steal: {
        en: getLexiconLabel('steal', 'en'),
        zh: getLexiconLabel('steal', 'zh'),
    },
} as const;

export const BUFF_COPY: BuffCopyMap = {
    privilege_favor: {
        level: 1,
        en: { label: 'Privilege Favor', desc: `Start with 1 ${TERM.specialPrivilege.en}.` },
        zh: { label: '特权眷顾', desc: `开始时获得 1 个${TERM.specialPrivilege.zh}。` },
    },
    head_start: {
        level: 1,
        goal: { points: 18 },
        en: { label: 'Head Start', desc: `Start with 1 random ${TERM.basicGem.en}.` },
        zh: { label: '先行一步', desc: `开始时获得 1 个随机${TERM.basicGem.zh}。` },
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
            desc: `Gain ${TERM.optionalAction.en}: Peek at the top 3 cards of any deck.`,
        },
        zh: { label: '情报员', desc: `获得${TERM.optionalAction.zh}：查看任意卡组顶部的 3 张牌。` },
    },
    deep_pockets: {
        level: 1,
        en: { label: 'Deep Pockets', desc: `${TERM.gemCap.en} increased to 12.` },
        zh: { label: '深口袋', desc: `${TERM.gemCap.zh}增加至 12。` },
    },
    backup_supply: {
        level: 1,
        en: { label: 'Backup Supply', desc: `Start with 2 random ${TERM.basicGem.en}s.` },
        zh: { label: '后备补给', desc: `开始时获得 2 个随机${TERM.basicGem.zh}。` },
    },
    patient_investor: {
        level: 1,
        en: {
            label: 'Patient Investor',
            desc: `Gain 1 ${TERM.extraGold.en} on your first ${TERM.reserve.en} action.`,
        },
        zh: {
            label: '耐心投资者',
            desc: `在你的第一次${TERM.reserve.zh}行动中获得 1 个${TERM.extraGold.zh}。`,
        },
    },
    insight: {
        level: 1,
        goal: { points: 18 },
        en: { label: 'Insight', desc: 'You can always see the top card of the Level 1 Deck.' },
        zh: { label: '洞察力', desc: '你始终可以看到 1 级卡组顶部的牌。' },
    },
    down_payment: {
        level: 1,
        en: {
            label: 'Down Payment',
            desc: `${TERM.reservedCard.en}s cost 1 less (${TERM.basicGem.en.toLowerCase()}s only).`,
        },
        zh: {
            label: '预付定金',
            desc: `${TERM.reservedCard.zh}成本减少 1（仅限${TERM.basicGem.zh}）。`,
        },
    },
    nimble_fingers: {
        level: 1,
        en: {
            label: 'Nimble Fingers',
            desc: `Gain 1 random ${TERM.basicGem.en} when you ${TERM.reserve.en} a card.`,
        },
        zh: {
            label: '快手窃贼',
            desc: `当你执行${TERM.reserve.zh}行动时，获得 1 个随机${TERM.basicGem.zh}。`,
        },
    },
    pearl_trader: {
        level: 2,
        en: {
            label: 'Pearl Trader',
            desc: `${TERM.gemCap.en} increased to 11. Start with 1 ${TERM.extraPearl.en}.`,
        },
        zh: {
            label: '珍珠贸易商',
            desc: `${TERM.gemCap.zh}增加至 11。开始时获得 1 个${TERM.extraPearl.zh}。`,
        },
    },
    gold_reserve: {
        level: 2,
        en: {
            label: 'Gold Reserve',
            desc: `Start with 1 ${TERM.extraGold.en} and 1 random ${TERM.reservedCard.en}.`,
        },
        zh: {
            label: '黄金储备',
            desc: `开始时获得 1 个${TERM.extraGold.zh}和 1 张随机${TERM.reservedCard.zh}。`,
        },
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
            desc: `Every 2nd time you ${TERM.replenish.en}, steal 1 ${TERM.basicGem.en} from opponent.`,
        },
        zh: {
            label: '巧取豪夺',
            desc: `你每执行 2 次${TERM.replenish.zh}，就从对手那里偷取 1 个${TERM.basicGem.zh}。`,
        },
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
            desc: `Gain 1 random ${TERM.basicGem.en} when you buy a card with ${TERM.crowns.en}.`,
        },
        zh: {
            label: '赏金猎人',
            desc: `当你购买带有${TERM.crowns.zh}的卡牌时，获得 1 个随机${TERM.basicGem.zh}。`,
        },
    },
    recycler: {
        level: 2,
        en: {
            label: 'Recycler',
            desc: `Start with 1 random ${TERM.basicGem.en}. Refund 1 ${TERM.basicGem.en} when buying a Level 2 or 3 card.`,
        },
        zh: {
            label: '回收者',
            desc: `开始时获得 1 个随机${TERM.basicGem.zh}。购买 2 级或 3 级卡牌时，返还 1 个${TERM.basicGem.zh}。`,
        },
    },
    aggressive_expansion: {
        level: 2,
        en: {
            label: 'Aggressive Expansion',
            desc: `Gain 1 random ${TERM.basicGem.en} when you ${TERM.replenish.en}.`,
        },
        zh: {
            label: '激进扩张',
            desc: `当你${TERM.replenish.zh}时，获得 1 个随机${TERM.basicGem.zh}。`,
        },
    },
    speculator: {
        level: 2,
        en: {
            label: 'Speculator',
            desc: `Gain 2 random ${TERM.basicGem.en}s after buying a ${TERM.reservedCard.en.toLowerCase()}.`,
        },
        zh: {
            label: '投机商',
            desc: `购买一张${TERM.reservedCard.zh}后，获得 2 个随机${TERM.basicGem.zh}。`,
        },
    },
    hoarder: {
        level: 2,
        en: {
            label: 'Hoarder',
            desc: `If holding 3 ${TERM.reservedCard.en}s, gain 1 random ${TERM.basicGem.en} at start of turn.`,
        },
        zh: {
            label: '资源囤积者',
            desc: `如果你手中持有 3 张${TERM.reservedCard.zh}，回合开始自动获得 1 个随机${TERM.basicGem.zh}。`,
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
            desc: `After your 5th turn fully resolves, pick 1 remaining ${TERM.royalCard.en}.`,
        },
        zh: {
            label: '皇家特使',
            desc: `在你的第 5 个回合完整结算后，拿取 1 张剩余${TERM.royalCard.zh}。`,
        },
    },
    double_agent: {
        level: 3,
        en: {
            label: 'Double Agent',
            desc: `Each ${TERM.privilegeScroll.en} takes 2 gems instead of 1. ${TERM.gemCap.en}: 8.`,
        },
        zh: {
            label: '双重间谍',
            desc: `每个${TERM.privilegeScroll.zh}改为拿取 2 个宝石。${TERM.gemCap.zh}：8。`,
        },
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
    echo_reservoir: {
        level: 3,
        en: {
            label: 'Echo Reservoir',
            desc: "Remember your opponent's last purchased card abilities. Each development-card purchase echoes that memory once, then clears it.",
        },
        zh: {
            label: '蓄能回响',
            desc: '记住对手上一张已购买发展卡的特殊能力。你每次购买发展卡时都会结算一次回响，并在结算后清空记忆。',
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
            desc: `Your first 2 purchased cards provide double ${TERM.bonus.en}es. ${TERM.gemCap.en}: 6.`,
        },
        zh: {
            label: '极简主义',
            desc: `你购买的前 2 张卡提供双倍${TERM.bonus.zh}。${TERM.gemCap.zh}：6。`,
        },
    },
    pacifist: {
        level: 3,
        en: {
            label: 'Pacifist',
            desc: `Immune to all negative effects, including opponent ${TERM.steal.en}, and your standard ${TERM.privilegeScroll.en}s cannot be transferred away when the board Privilege supply is empty. Start with 1 ${TERM.extraGold.en} and 1 ${TERM.specialPrivilege.en}.`,
        },
        zh: {
            label: '和平主义者',
            desc: `免疫一切负面效果，包括来自对手的${TERM.steal.zh}，且不会因版图特权供应堆为空而给予对手普通${TERM.privilegeScroll.zh}。开始时获得 1 个${TERM.extraGold.zh}和 1 个${TERM.specialPrivilege.zh}。`,
        },
    },
    desperate_gamble: {
        level: 3,
        en: {
            label: 'Desperate Gamble',
            desc: `Start with 2 ${TERM.extraGold.en}. You cannot take 3 Gems with the ${TERM.takeGems.en} action. Gain 1 ${TERM.specialPrivilege.en} every 2 turns.`,
        },
        zh: {
            label: '孤注一掷',
            desc: `开始时获得 2 个${TERM.extraGold.zh}。无法通过“${TERM.takeGems.zh}”行动一次拿 3 个宝石。每 2 回合获得 1 个${TERM.specialPrivilege.zh}。`,
        },
    },
    puppet_master: {
        level: 3,
        en: {
            label: 'The Puppet Master',
            desc: `Gain ${TERM.optionalAction.en}: discard one ${TERM.reservedCard.en.toLowerCase()}, return it to the bottom of its deck, and gain 1 random ${TERM.basicGem.en}. You may take this action multiple times in the same turn.`,
        },
        zh: {
            label: '幕后推手',
            desc: `获得${TERM.optionalAction.zh}：弃掉 1 张${TERM.reservedCard.zh}，将其放回对应牌库底部，并获得 1 个随机${TERM.basicGem.zh}。该行动在同一回合可执行多次。`,
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
        'echo_reservoir',
        'wonder_architect',
        'minimalist',
        'pacifist',
        'desperate_gamble',
        'puppet_master',
        'collector',
    ],
};

export const BUFF_LEVEL_TITLES = {
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

export const GOAL_ADJUSTMENT_COPY = {
    en: {
        title: 'Goal Adjustment',
        points: getLexiconLabel('prestigePoints', 'en'),
        crowns: getLexiconLabel('crowns', 'en'),
        singleColor: getLexiconLabel('singleColorPoints', 'en'),
        disableSingleColor: 'Single-Color Points Win',
        disabled: 'Disabled',
    },
    zh: {
        title: '目标变更',
        points: getLexiconLabel('prestigePoints', 'zh'),
        crowns: getLexiconLabel('crowns', 'zh'),
        singleColor: getLexiconLabel('singleColorPoints', 'zh'),
        disableSingleColor: '单色分数获胜',
        disabled: '关闭',
    },
} as const;
