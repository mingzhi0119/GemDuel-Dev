import { Hand, Plus, RotateCcw, Scroll } from 'lucide-react';
import type { Card as CardType } from '../../types';

export const SAMPLE_CARD: CardType = {
    id: 'anatomy-sample',
    level: 2,
    bonusColor: 'blue',
    bonusCount: 1,
    points: 2,
    crowns: 1,
    ability: 'again',
    cost: {
        blue: 0,
        white: 3,
        green: 2,
        black: 0,
        red: 0,
        pearl: 0,
        gold: 0,
    },
};

export const ABILITIES = [
    {
        id: 'play_again',
        icon: RotateCcw,
        color: 'bg-amber-500',
        label: { en: 'Extra Turn', zh: '再次行动' },
        desc: {
            en: 'Immediately take another turn after this one.',
            zh: '立即获得额外的一个回合。',
        },
    },
    {
        id: 'bonus_gem',
        icon: Plus,
        color: 'bg-emerald-500',
        label: { en: 'Bonus Gem', zh: '奖励宝石' },
        desc: {
            en: "Take 1 Gem of the card's color from the board.",
            zh: '从版图上拿取 1 个与该卡牌颜色相同的宝石。',
        },
    },
    {
        id: 'steal',
        icon: Hand,
        color: 'bg-rose-500',
        label: { en: 'Capture / Steal', zh: '掠夺' },
        desc: {
            en: 'Steal 1 non-Gold Gem from your opponent.',
            zh: '从对手那里偷取 1 个非黄金宝石。',
        },
    },
    {
        id: 'scroll',
        icon: Scroll,
        color: 'bg-purple-500',
        label: { en: 'Privilege', zh: '特权' },
        desc: {
            en: 'Take 1 Privilege Scroll (or steal if supply is empty).',
            zh: '拿取 1 个特权卷轴（如果供应堆为空，则从对手处拿取）。',
        },
    },
] as const;
