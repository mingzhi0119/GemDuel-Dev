import { ROGUE_CARDS } from '@gemduel/shared/data/realCards';

const findAnatomyCard = (id: string) => {
    const card = ROGUE_CARDS.find((candidate) => candidate.id === id);
    if (!card) {
        throw new Error(`Expected ${id} to exist in ROGUE_CARDS.`);
    }
    return card;
};

export const ANATOMY_LAYOUT_CARD = findAnatomyCard('373-jo');

export const ABILITIES = [
    {
        id: 'play_again',
        termId: 'extraTurn',
        iconPath: '/assets/ui-icons/abilities/ability-extra-turn-medallion.png',
        label: { en: 'Extra Turn', zh: '额外回合' },
        desc: {
            en: 'Immediately take another turn after this one.',
            zh: '立即获得额外的一个回合。',
        },
    },
    {
        id: 'bonus_gem',
        termId: 'bonusGem',
        iconPath: '/assets/ui-icons/abilities/ability-bonus-gem-medallion.png',
        label: { en: 'Bonus Gem', zh: '奖励宝石' },
        desc: {
            en: "Take 1 Gem of the card's color from the board.",
            zh: '从版图上拿取 1 个与该卡牌颜色相同的宝石。',
        },
    },
    {
        id: 'steal',
        termId: 'steal',
        iconPath: '/assets/ui-icons/abilities/ability-steal-medallion.png',
        label: { en: 'Steal', zh: '掠夺' },
        desc: {
            en: 'Steal 1 non-Gold Gem from your opponent.',
            zh: '从对手那里偷取 1 个非黄金宝石。',
        },
    },
    {
        id: 'scroll',
        termId: 'privilege',
        iconPath: '/assets/ui-icons/abilities/ability-privilege-medallion.png',
        label: { en: 'Privilege', zh: '特权' },
        desc: {
            en: 'Take 1 Privilege Scroll (or steal if supply is empty).',
            zh: '拿取 1 个特权卷轴（如果供应堆为空，则从对手处拿取）。',
        },
    },
] as const;
