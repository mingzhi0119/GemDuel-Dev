export type LexiconLocale = 'en' | 'zh';

export type LexiconTermId =
    | 'buff'
    | 'market'
    | 'prestigePoints'
    | 'crowns'
    | 'royal'
    | 'royalCard'
    | 'bonus'
    | 'wildBonus'
    | 'bonusGem'
    | 'extraTurn'
    | 'steal'
    | 'privilege'
    | 'privilegeScroll'
    | 'specialPrivilege'
    | 'optionalAction'
    | 'reserve'
    | 'reservedCard'
    | 'takeGems'
    | 'buyCard'
    | 'replenish'
    | 'gemCap'
    | 'basicGem'
    | 'extraBasicGem'
    | 'extraPearl'
    | 'extraGold'
    | 'cardColor'
    | 'singleColorPoints';

type LexiconMatchMode = 'wholeTerm' | 'exactSubstring';

interface LexiconAliasDefinition {
    value: string;
    wholeTerm?: boolean;
}

export interface LexiconTermDefinition {
    id: LexiconTermId;
    label: Record<LexiconLocale, string>;
    description: Record<LexiconLocale, string>;
    aliases: Record<LexiconLocale, readonly LexiconAliasDefinition[]>;
    matchMode: Record<LexiconLocale, LexiconMatchMode>;
}

export interface LexiconSegmentText {
    type: 'text';
    value: string;
}

export interface LexiconSegmentTerm {
    type: 'term';
    termId: LexiconTermId;
    value: string;
}

export type LexiconSegment = LexiconSegmentText | LexiconSegmentTerm;

interface CompiledLexiconAlias {
    termId: LexiconTermId;
    value: string;
    wholeTerm: boolean;
}

const exact = (value: string): LexiconAliasDefinition => ({ value });
const whole = (value: string): LexiconAliasDefinition => ({ value, wholeTerm: true });

const LEXICON_TERM_LIST: readonly LexiconTermDefinition[] = [
    {
        id: 'buff',
        label: { en: 'Buff', zh: '增益' },
        description: {
            en: 'A special game modifier that changes your starting resources, actions, costs, or victory targets.',
            zh: '增益会改变你的起始资源、行动方式、费用结构或获胜目标。',
        },
        aliases: {
            en: [whole('Buff'), whole('Buffs')],
            zh: [exact('增益')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'market',
        label: { en: 'Market', zh: '市场' },
        description: {
            en: 'The shared area with face-up cards and deck access, where players buy or reserve cards.',
            zh: '市场是双方共用的公开购牌区，你可以在这里购买或保留卡牌。',
        },
        aliases: {
            en: [whole('Market')],
            zh: [exact('市场')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'prestigePoints',
        label: { en: 'Prestige Points', zh: '声望值' },
        description: {
            en: 'Prestige Points are your score. Reach the required total to win.',
            zh: '声望值就是你的分数，达到要求的总数即可获胜。',
        },
        aliases: {
            en: [whole('Prestige Point'), whole('Prestige Points')],
            zh: [exact('声望值')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'crowns',
        label: { en: 'Crowns', zh: '皇冠' },
        description: {
            en: 'Crowns advance royal rewards and can also satisfy a victory condition.',
            zh: '皇冠会推进皇室奖励，也可能直接满足获胜条件。',
        },
        aliases: {
            en: [whole('Crown'), whole('Crowns')],
            zh: [exact('皇冠')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'royal',
        label: { en: 'Royal', zh: '皇室' },
        description: {
            en: 'Royal refers to the shared royal reward area and the milestone system tied to Crowns.',
            zh: '皇室指与皇冠里程碑相连的共享皇室奖励区和整套机制。',
        },
        aliases: {
            en: [whole('Royal'), whole('Royals'), whole('Royal Court')],
            zh: [exact('皇室'), exact('皇室庭院'), exact('皇室法院')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'royalCard',
        label: { en: 'Royal Card', zh: '皇室卡' },
        description: {
            en: 'A Royal Card is a free reward gained from Royal milestones instead of being purchased with gems.',
            zh: '皇室卡是通过皇室里程碑获得的免费奖励卡，而不是用宝石购买的卡。',
        },
        aliases: {
            en: [whole('Royal Card'), whole('Royal Cards')],
            zh: [exact('皇室卡')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'bonus',
        label: { en: 'Bonus', zh: '奖励' },
        description: {
            en: 'Bonus is a permanent discount from cards you own. It is different from Bonus Gem.',
            zh: '奖励是你已拥有卡牌提供的永久折扣，它和“奖励宝石”不是同一个概念。',
        },
        aliases: {
            en: [whole('Bonus'), whole('Bonuses'), whole('Color Bonus'), whole('Color Bonuses')],
            zh: [exact('奖励'), exact('颜色奖励')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'wildBonus',
        label: { en: 'Wild Bonus', zh: '万能奖励' },
        description: {
            en: 'When you buy this card, choose a Card Color. The card then provides Bonus in that color and counts toward Single-Color Points for that color.',
            zh: '购买这张卡时先选择一种卡牌颜色，之后它会按该颜色提供奖励，并按该颜色计入单色分数。',
        },
        aliases: {
            en: [whole('Wild Bonus'), whole('Wild bonus')],
            zh: [exact('万能奖励')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'bonusGem',
        label: { en: 'Bonus Gem', zh: '奖励宝石' },
        description: {
            en: 'Bonus Gem is a triggered effect that gives you a gem from the board after buying a card.',
            zh: '奖励宝石是购买卡牌后触发的效果，会让你从版图上获得一颗宝石。',
        },
        aliases: {
            en: [whole('Bonus Gem'), whole('Bonus Gems'), whole('Take Gem')],
            zh: [exact('奖励宝石'), exact('拿取宝石')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'extraTurn',
        label: { en: 'Extra Turn', zh: '额外回合' },
        description: {
            en: 'Extra Turn lets you immediately take another full turn after the current one finishes resolving.',
            zh: '额外回合会让你在当前回合结算完成后，立刻再执行一个完整回合。',
        },
        aliases: {
            en: [whole('Extra Turn'), whole('Play Again')],
            zh: [exact('额外回合'), exact('再次行动')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'steal',
        label: { en: 'Steal', zh: '掠夺' },
        description: {
            en: 'Steal takes a non-Gold gem from your opponent.',
            zh: '掠夺会从对手那里拿走一颗非黄金宝石。',
        },
        aliases: {
            en: [whole('Steal'), whole('Steal Gem'), whole('Capture / Steal')],
            zh: [exact('掠夺'), exact('掠夺宝石')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'privilege',
        label: { en: 'Privilege', zh: '特权' },
        description: {
            en: 'Privilege is the action family related to taking gems with scrolls and other privilege-based effects.',
            zh: '特权指围绕卷轴取宝石及其相关效果的一整组行动机制。',
        },
        aliases: {
            en: [whole('Privilege'), whole('Take Scroll')],
            zh: [exact('特权')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'privilegeScroll',
        label: { en: 'Privilege Scroll', zh: '特权卷轴' },
        description: {
            en: 'A Privilege Scroll is a token you spend before your main action to take gems directly from the board.',
            zh: '特权卷轴是一种在主要行动前消耗的代币，可直接从版图上拿取宝石。',
        },
        aliases: {
            en: [whole('Privilege Scroll'), whole('Privilege Scrolls')],
            zh: [exact('特权卷轴')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'specialPrivilege',
        label: { en: 'Special Privilege', zh: '特殊特权' },
        description: {
            en: 'A protected privilege resource granted by specific buffs. It is spent before normal Privilege Scrolls and cannot be transferred away normally.',
            zh: '特殊特权是由特定增益提供的受保护特权资源，会优先于普通特权卷轴消耗，通常也不会被转移走。',
        },
        aliases: {
            en: [whole('Special Privilege')],
            zh: [exact('特殊特权')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'optionalAction',
        label: { en: 'Optional Action', zh: '可选行动' },
        description: {
            en: 'Optional Actions happen before your main action and do not end your turn by themselves.',
            zh: '可选行动发生在主要行动前，本身不会直接结束你的回合。',
        },
        aliases: {
            en: [
                whole('Optional Action'),
                whole('Optional Actions'),
                whole('optional action'),
                whole('optional actions'),
            ],
            zh: [exact('可选行动')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'reserve',
        label: { en: 'Reserve', zh: '保留' },
        description: {
            en: 'Reserve puts a card aside for later purchase, usually while also taking Gold if one is available on the board.',
            zh: '保留会把一张卡先放到你的保留区，之后再购买；若版图上有黄金，通常还能顺便获得黄金。',
        },
        aliases: {
            en: [whole('Reserve'), whole('Reserve a Card')],
            zh: [exact('保留')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'reservedCard',
        label: { en: 'Reserved Card', zh: '保留卡' },
        description: {
            en: 'A Reserved Card is a card you have set aside to buy later from your personal reserve area.',
            zh: '保留卡是你先放到个人保留区、稍后再购买的卡牌。',
        },
        aliases: {
            en: [
                whole('Reserved Card'),
                whole('Reserved Cards'),
                whole('reserved card'),
                whole('reserved cards'),
            ],
            zh: [exact('保留卡'), exact('保留卡牌')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'takeGems',
        label: { en: 'Take Gems', zh: '拿取宝石' },
        description: {
            en: 'Take Gems is the main action for taking a legal line of gems from the board.',
            zh: '拿取宝石是从版图上拿走一条合法宝石线的主要行动。',
        },
        aliases: {
            en: [whole('Take Gems')],
            zh: [exact('拿取宝石')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'buyCard',
        label: { en: 'Buy Card', zh: '购买卡牌' },
        description: {
            en: 'Buy Card spends your resources to add a card from the Market or your reserve to your tableau.',
            zh: '购买卡牌会消耗你的资源，把市场或保留区中的卡牌加入你的场上区域。',
        },
        aliases: {
            en: [whole('Buy Card'), whole('Buy a Card')],
            zh: [exact('购买卡牌'), exact('购买一张卡')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'replenish',
        label: { en: 'Replenish', zh: '补给' },
        description: {
            en: 'Replenish refills empty board spaces from the bag and usually grants your opponent a Privilege Scroll.',
            zh: '补给会用袋中的宝石填满版图空位，通常还会让对手获得一个特权卷轴。',
        },
        aliases: {
            en: [whole('Replenish'), whole('Replenish the board'), whole('Refill')],
            zh: [exact('补给'), exact('补给版图')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'gemCap',
        label: { en: 'Gem Cap', zh: '宝石持有上限' },
        description: {
            en: 'Gem Cap is the maximum number of gems you may still hold after all required end-of-turn effects resolve.',
            zh: '宝石持有上限是指在所有强制结算完成后，你最终还能保留的宝石数量上限。',
        },
        aliases: {
            en: [whole('Gem Cap'), whole('Gem Caps'), whole('Gem Limit')],
            zh: [exact('宝石持有上限'), exact('宝石上限')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'basicGem',
        label: { en: 'Basic Gem', zh: '基础宝石' },
        description: {
            en: 'Basic Gems are the five standard colors: blue, white, green, black, and red.',
            zh: '基础宝石指五种标准颜色：蓝、白、绿、黑、红。',
        },
        aliases: {
            en: [whole('Basic Gem'), whole('Basic Gems'), whole('basic gem'), whole('basic gems')],
            zh: [exact('基础宝石')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'extraBasicGem',
        label: { en: 'Extra Basic Gem', zh: '额外基础宝石' },
        description: {
            en: 'An Extra Basic Gem is buff-created bonus stock that disappears when spent instead of returning to the bag.',
            zh: '额外基础宝石是由增益创造的额外资源，花掉后会直接消失，而不会回到袋中。',
        },
        aliases: {
            en: [
                whole('Extra Basic Gem'),
                whole('Extra Basic Gems'),
                whole('extra basic gem'),
                whole('extra basic gems'),
            ],
            zh: [exact('额外基础宝石'), exact('额外宝石')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'extraPearl',
        label: { en: 'Extra Pearl', zh: '额外珍珠' },
        description: {
            en: 'An Extra Pearl is a buff-created pearl resource that disappears when spent.',
            zh: '额外珍珠是由增益创造的珍珠资源，花掉后会直接消失。',
        },
        aliases: {
            en: [whole('Extra Pearl')],
            zh: [exact('额外珍珠')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'extraGold',
        label: { en: 'Extra Gold', zh: '额外黄金' },
        description: {
            en: 'An Extra Gold is buff-created gold that disappears when spent instead of returning to the bag.',
            zh: '额外黄金是由增益创造的黄金资源，花掉后会直接消失，而不会回到袋中。',
        },
        aliases: {
            en: [whole('Extra Gold')],
            zh: [exact('额外黄金')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'cardColor',
        label: { en: 'Card Color', zh: '卡牌颜色' },
        description: {
            en: 'Card Color determines which Bonus a card provides and which Single-Color Points total it contributes to.',
            zh: '卡牌颜色决定这张卡会提供哪种奖励，也决定它会计入哪一种单色分数。',
        },
        aliases: {
            en: [
                whole('Card Color'),
                whole('Card Colors'),
                whole('Select Card Color'),
                whole('Joker Color'),
                whole('Select Joker Color'),
            ],
            zh: [
                exact('卡牌颜色'),
                exact('选择卡牌颜色'),
                exact('小丑颜色'),
                exact('选择小丑颜色'),
            ],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
    {
        id: 'singleColorPoints',
        label: { en: 'Single-Color Points', zh: '单色分数' },
        description: {
            en: 'Single-Color Points are the total Prestige Points from cards that share the same Card Color.',
            zh: '单色分数是来自同一种卡牌颜色的全部声望值总和。',
        },
        aliases: {
            en: [
                whole('Single-Color Points'),
                whole('Single Color Points'),
                whole('Points in one color'),
                whole('Points (1 Color)'),
            ],
            zh: [exact('单色分数')],
        },
        matchMode: { en: 'wholeTerm', zh: 'exactSubstring' },
    },
] as const;

export const LEXICON_VERSION = `${LEXICON_TERM_LIST.length}`;

export const LEXICON_TERMS: Record<LexiconTermId, LexiconTermDefinition> = LEXICON_TERM_LIST.reduce(
    (acc, term) => {
        acc[term.id] = term;
        return acc;
    },
    {} as Record<LexiconTermId, LexiconTermDefinition>
);

export const LEXICON_TERM_IDS = LEXICON_TERM_LIST.map(
    (term) => term.id
) as readonly LexiconTermId[];

const isAsciiWordBoundaryChar = (value: string | undefined) =>
    value !== undefined && /^[A-Za-z0-9_-]$/.test(value);

const passesWholeTermBoundary = (text: string, index: number, value: string) => {
    const before = index > 0 ? text[index - 1] : undefined;
    const afterIndex = index + value.length;
    const after = afterIndex < text.length ? text[afterIndex] : undefined;
    return !isAsciiWordBoundaryChar(before) && !isAsciiWordBoundaryChar(after);
};

const compiledMatcherCache = new Map<string, readonly CompiledLexiconAlias[]>();

const compileLexiconAliases = (locale: LexiconLocale): readonly CompiledLexiconAlias[] => {
    const cacheKey = `${locale}:${LEXICON_VERSION}`;
    const existing = compiledMatcherCache.get(cacheKey);
    if (existing) {
        return existing;
    }

    const seen = new Set<string>();
    const aliases: CompiledLexiconAlias[] = [];

    for (const termId of LEXICON_TERM_IDS) {
        const term = LEXICON_TERMS[termId];
        const defaultWholeTerm = term.matchMode[locale] === 'wholeTerm';
        const definitions = [
            { value: term.label[locale], wholeTerm: defaultWholeTerm },
            ...term.aliases[locale].map((alias) => ({
                value: alias.value,
                wholeTerm: alias.wholeTerm ?? defaultWholeTerm,
            })),
        ];

        for (const alias of definitions) {
            const dedupeKey = `${term.id}:${alias.value}`;
            if (seen.has(dedupeKey)) {
                continue;
            }

            seen.add(dedupeKey);
            aliases.push({
                termId: term.id,
                value: alias.value,
                wholeTerm: alias.wholeTerm,
            });
        }
    }

    aliases.sort((left, right) => right.value.length - left.value.length);
    compiledMatcherCache.set(cacheKey, aliases);
    return aliases;
};

export const getLexiconLabel = (termId: LexiconTermId, locale: LexiconLocale) =>
    LEXICON_TERMS[termId].label[locale];

export const getLexiconDescription = (termId: LexiconTermId, locale: LexiconLocale) =>
    LEXICON_TERMS[termId].description[locale];

export const getLexiconTerm = (termId: LexiconTermId) => LEXICON_TERMS[termId];

export const segmentLexiconText = (
    text: string,
    locale: LexiconLocale
): readonly LexiconSegment[] => {
    if (!text) {
        return [{ type: 'text', value: text }];
    }

    const aliases = compileLexiconAliases(locale);
    const segments: LexiconSegment[] = [];
    let cursor = 0;

    while (cursor < text.length) {
        let matchedAlias: CompiledLexiconAlias | null = null;

        for (const alias of aliases) {
            if (!text.startsWith(alias.value, cursor)) {
                continue;
            }
            if (alias.wholeTerm && !passesWholeTermBoundary(text, cursor, alias.value)) {
                continue;
            }
            matchedAlias = alias;
            break;
        }

        if (!matchedAlias) {
            const previous = segments[segments.length - 1];
            const currentChar = text[cursor];
            if (previous?.type === 'text') {
                previous.value += currentChar;
            } else {
                segments.push({ type: 'text', value: currentChar });
            }
            cursor += 1;
            continue;
        }

        segments.push({
            type: 'term',
            termId: matchedAlias.termId,
            value: matchedAlias.value,
        });
        cursor += matchedAlias.value.length;
    }

    return segments;
};
