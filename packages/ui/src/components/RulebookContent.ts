import { buildBuffCompendium } from '@gemduel/shared/data/buffCopy';
import { TERMS } from './rulebookTerms';

export interface RulebookLocalizedText {
    en: string;
    zh: string;
}

export type RulebookBlock =
    | {
          type: 'lead';
          text: RulebookLocalizedText;
      }
    | {
          type: 'section';
          title: RulebookLocalizedText;
          text?: RulebookLocalizedText;
          items: RulebookLocalizedText[];
      }
    | {
          type: 'callout';
          title?: RulebookLocalizedText;
          text: RulebookLocalizedText;
      };

export interface RulebookPage {
    title: RulebookLocalizedText;
    summary?: RulebookLocalizedText;
    blocks?: RulebookBlock[];
    body?: RulebookLocalizedText;
    isCustom?: 'card_anatomy' | 'player_zone' | 'center_area' | 'topbar';
}

export const RULEBOOK_CONTENT: RulebookPage[] = [
    {
        title: { en: 'Quick Start', zh: '快速上手' },
        summary: {
            en: 'Gem Duel is a 2-player card and token duel. You win by ending your turn with one active victory target met.',
            zh: '《Gem Duel》是一款双人卡牌与宝石对决。只要在你的回合结算结束时满足任一当前胜利目标，你就会获胜。',
        },
        blocks: [
            {
                type: 'section',
                title: { en: 'Default victory targets', zh: '默认胜利目标' },
                items: [
                    {
                        en: `Reach 20 ${TERMS.prestigePoints.en}.`,
                        zh: `达到 20 点${TERMS.prestigePoints.zh}。`,
                    },
                    {
                        en: `Collect 10 ${TERMS.crowns.en}.`,
                        zh: `收集 10 个${TERMS.crowns.zh}。`,
                    },
                    {
                        en: `Reach 10 ${TERMS.singleColorPoints.en}.`,
                        zh: `达到 10 点${TERMS.singleColorPoints.zh}。`,
                    },
                ],
            },
            {
                type: 'section',
                title: { en: 'Table components', zh: '桌面组件' },
                items: [
                    {
                        en: 'A 5x5 board holds up to 25 Gem tokens.',
                        zh: '5x5 宝石版图最多容纳 25 个宝石代币。',
                    },
                    {
                        en: 'Standard Gems are blue, white, green, black, and red. Special Gems are Pearl and Gold.',
                        zh: '基础宝石包括蓝、白、绿、黑、红。特殊宝石包括珍珠和黄金。',
                    },
                    {
                        en: `Market cards have 3 levels. The ${TERMS.royal.en} holds ${TERMS.royalCard.en}s chosen at ${TERMS.crowns.en} milestones.`,
                        zh: `市场卡牌分为 3 个等级。${TERMS.royal.zh}展示通过${TERMS.crowns.zh}里程碑选择的${TERMS.royalCard.zh}。`,
                    },
                    {
                        en: `${TERMS.privilegeScroll.en}s are optional-action tokens that let you take 1 non-Gold Gem before your main action.`,
                        zh: `${TERMS.privilegeScroll.zh}是可选行动资源，可在主要行动前拿取 1 个非黄金宝石。`,
                    },
                ],
            },
            {
                type: 'callout',
                title: { en: 'Roguelike note', zh: '肉鸽提示' },
                text: {
                    en: 'Roguelike Buffs can replace victory targets, change limits, and add extra resources. The active targets shown in game are authoritative.',
                    zh: '肉鸽增益可能替换胜利目标、改变上限或提供额外资源。游戏内当前显示的目标始终优先。',
                },
            },
        ],
    },
    {
        title: { en: 'Card Anatomy & Abilities', zh: '卡牌结构与能力' },
        isCustom: 'card_anatomy',
    },
    {
        title: { en: 'Player Zone', zh: '玩家区' },
        isCustom: 'player_zone',
        summary: {
            en: 'Your player zone shows owned cards, reserved cards, resources, and Privilege Scrolls.',
            zh: '玩家区展示你的已购卡、保留卡、宝石资源和特权卷轴。',
        },
        blocks: [
            {
                type: 'section',
                title: { en: 'Owned cards', zh: '已购卡与牌库' },
                items: [
                    {
                        en: 'When you gain a card, it enters your personal tableau and becomes part of your card library.',
                        zh: '当你获得一张卡后，它会进入你的个人场上区域，并成为你的牌库内容。',
                    },
                    {
                        en: 'Click a color stack, or the pure-points stack, to inspect every card you own in that group.',
                        zh: '点击某个颜色牌库或纯分数牌库，可以查看你拥有的该色或纯分数的所有卡牌。',
                    },
                    {
                        en: `${TERMS.bonus.en} discounts and ${TERMS.singleColorPoints.en} are read from these owned-card stacks.`,
                        zh: `${TERMS.bonus.zh}折扣和${TERMS.singleColorPoints.zh}都会从这些已购卡堆中计算。`,
                    },
                ],
            },
            {
                type: 'section',
                title: { en: 'Reserved cards', zh: '保留区' },
                items: [
                    {
                        en: 'When you reserve a card, it moves into your personal reserve area.',
                        zh: '当你保留一张卡时，它会进入你的个人保留区。',
                    },
                    {
                        en: 'Reserved cards can only be bought by you.',
                        zh: '保留区中的卡牌只能由你购买。',
                    },
                    {
                        en: 'Click the reserve area to inspect your reserved cards and buy them when you can pay the cost.',
                        zh: '点击保留区可以查看你保留的牌，并在能支付费用时从这里购买。',
                    },
                ],
            },
            {
                type: 'section',
                title: { en: `${TERMS.privilegeScroll.en}s`, zh: TERMS.privilegeScroll.zh },
                items: [
                    {
                        en: `${TERMS.privilegeScroll.en}s appear below your avatar after you gain them.`,
                        zh: `当你获得${TERMS.privilegeScroll.zh}后，它会显示在你的头像下方。`,
                    },
                    {
                        en: `At the start of your turn, click a ${TERMS.privilegeScroll.en} to take 1 non-Gold Gem from the board before your main action.`,
                        zh: `在你的回合开始时，可以点击${TERMS.privilegeScroll.zh}，并从盘面拿取 1 个非黄金宝石，然后再执行主要行动。`,
                    },
                    {
                        en: 'Your gem row shows the resources you can spend, steal, discard, or count against the Gem Cap.',
                        zh: '你的宝石资源行会显示可用于支付、被掠夺、弃置或计入宝石上限的资源。',
                    },
                ],
            },
        ],
    },
    {
        title: { en: 'Main Field', zh: '主战区' },
        isCustom: 'center_area',
        summary: {
            en: 'The Main Field contains the Market, the board, and the Royal Area.',
            zh: '主战区包含市场、宝石盘面和皇室区。',
        },
        blocks: [
            {
                type: 'section',
                title: { en: TERMS.market.en, zh: TERMS.market.zh },
                items: [
                    {
                        en: 'The Market shows face-up cards by level, plus each level deck.',
                        zh: '市场按等级展示公开卡牌，并显示每个等级的牌堆。',
                    },
                    {
                        en: 'Click a face-up card to preview it, then buy or reserve from the Preview panel.',
                        zh: '点击公开卡会先打开预览面板，然后从预览中购买或保留。',
                    },
                    {
                        en: 'Deck previews let you reserve the top card when that action is legal.',
                        zh: '当行动合法时，牌堆预览可以让你保留牌堆顶牌。',
                    },
                ],
            },
            {
                type: 'section',
                title: { en: 'Board', zh: '盘面' },
                items: [
                    {
                        en: `The board is where you take Gems with ${TERMS.takeGems.en}, ${TERMS.bonusGem.en}, and ${TERMS.privilegeScroll.en}s.`,
                        zh: `盘面用于通过${TERMS.takeGems.zh}、${TERMS.bonusGem.zh}和${TERMS.privilegeScroll.zh}拿取宝石。`,
                    },
                    {
                        en: 'Normal gem-taking uses a legal straight line. Gold cannot be taken by normal gem-taking.',
                        zh: '普通拿取宝石需要选择合法直线。黄金不能通过普通拿取宝石获得。',
                    },
                    {
                        en: 'Follow-up phases highlight the required target, such as Gold after reserve or a matching gem after Bonus Gem.',
                        zh: '后续阶段会高亮必须选择的目标，例如保留后的黄金，或奖励宝石能力后的同色宝石。',
                    },
                ],
            },
            {
                type: 'section',
                title: { en: TERMS.royal.en, zh: TERMS.royal.zh },
                items: [
                    {
                        en: `${TERMS.royalCard.en}s are displayed on the right side of the board. When you reach 3 or 6 ${TERMS.crowns.en}, you must choose one to gain.`,
                        zh: `${TERMS.royalCard.zh}显示在盘面右侧，在你达到3/6个${TERMS.crowns.zh}时你必须选择一个获取。`,
                    },
                    {
                        en: `${TERMS.royalCard.en}s are free pure-points cards that provide points and special abilities.`,
                        zh: `${TERMS.royalCard.zh}是免费的纯分数卡，提供分数和特殊能力。`,
                    },
                    {
                        en: `Click ${TERMS.royalCard.en}s to inspect them outside selection, or choose one when the game enters the ${TERMS.royal.en} selection phase.`,
                        zh: `非选择阶段可点击${TERMS.royalCard.zh}查看；当游戏进入${TERMS.royal.zh}选择阶段时，可点击其中一张获得。`,
                    },
                ],
            },
        ],
    },
    {
        title: { en: 'Battle Status Bar', zh: '战况栏' },
        isCustom: 'topbar',
        summary: {
            en: 'The Battle Status Bar shows both players’ current victory pressure and whose turn is active.',
            zh: '战况栏显示双方当前胜利进度，以及现在轮到哪一方行动。',
        },
        blocks: [
            {
                type: 'section',
                title: { en: 'Scores and goals', zh: '分数与目标' },
                items: [
                    {
                        en: `${TERMS.prestigePoints.en} are shown beside each player’s score icon, with the active target shown after the slash.`,
                        zh: `${TERMS.prestigePoints.zh}显示在每名玩家的分数图标旁，斜杠后的数字是当前目标。`,
                    },
                    {
                        en: `${TERMS.crowns.en} are shown beside each player’s crown icon, with the active Crown target shown after the slash.`,
                        zh: `${TERMS.crowns.zh}显示在每名玩家的皇冠图标旁，斜杠后的数字是当前皇冠目标。`,
                    },
                    {
                        en: 'Buffs may change these target values, so the Battle Status Bar is the live source of truth.',
                        zh: '增益可能改变这些目标数值，因此战况栏显示的是当前实时目标。',
                    },
                ],
            },
            {
                type: 'section',
                title: { en: 'Turn state', zh: '回合状态' },
                items: [
                    {
                        en: 'The center of the bar shows P1 and P2 turn counts.',
                        zh: '战况栏中央显示 P1 与 P2 的回合计数。',
                    },
                    {
                        en: 'The active player is highlighted so you can tell whose turn is currently resolving.',
                        zh: '当前行动方会被高亮，方便判断正在结算谁的回合。',
                    },
                    {
                        en: 'In online play, a small marker appears when it is your turn.',
                        zh: '在线对局中，轮到你行动时会出现额外提示。',
                    },
                ],
            },
        ],
    },
    {
        title: { en: 'Turn Flow', zh: '回合流程' },
        summary: {
            en: 'Optional actions happen first. Then you must perform exactly one main action. Forced resolution finishes the turn.',
            zh: '先执行可选行动，然后必须执行恰好一个主要行动，最后按顺序完成强制结算。',
        },
        blocks: [
            {
                type: 'section',
                title: { en: `${TERMS.optionalAction.en}s`, zh: TERMS.optionalAction.zh },
                items: [
                    {
                        en: `${TERMS.privilegeScroll.en}: Return 1 Scroll to take 1 non-Gold Gem from the board.`,
                        zh: `${TERMS.privilegeScroll.zh}：归还 1 个卷轴，从版图拿取 1 个非黄金宝石。`,
                    },
                    {
                        en: `${TERMS.replenish.en}: Fill board gaps from the bag in spiral order. Your opponent gains 1 standard ${TERMS.privilegeScroll.en}.`,
                        zh: `${TERMS.replenish.zh}：按螺旋顺序从布袋补满空位。对手获得 1 个标准${TERMS.privilegeScroll.zh}。`,
                    },
                ],
            },
            {
                type: 'section',
                title: { en: 'Main actions', zh: '主要行动' },
                items: [
                    {
                        en: `${TERMS.takeGems.en}: Take up to 3 consecutive tokens in one straight row, column, or diagonal. Gold cannot be taken this way.`,
                        zh: `${TERMS.takeGems.zh}：拿取最多 3 个连续且排成直线的代币，方向可以是行、列或对角线。不能以此方式拿取黄金。`,
                    },
                    {
                        en: `${TERMS.reserve.en}: Reserve 1 Market card or top deck card. If Gold is on the board, take exactly 1 Gold with the reserve.`,
                        zh: `${TERMS.reserve.zh}：保留 1 张市场卡或牌堆顶牌。若版图上有黄金，此次保留必须同时拿取恰好 1 个黄金。`,
                    },
                    {
                        en: `${TERMS.buyCard.en}: Buy a Market or Reserved card by paying Gems after ${TERMS.bonus.en} discounts.`,
                        zh: `${TERMS.buyCard.zh}：使用宝石并结算${TERMS.bonus.zh}折扣后，购买市场或保留区卡牌。`,
                    },
                ],
            },
            {
                type: 'section',
                title: { en: 'Forced resolution order', zh: '强制结算顺序' },
                items: [
                    {
                        en: `Resolve triggered abilities: ${TERMS.bonusGem.en}, ${TERMS.steal.en}, and ${TERMS.privilege.en}.`,
                        zh: `结算触发能力：${TERMS.bonusGem.zh}、${TERMS.steal.zh}和${TERMS.privilege.zh}。`,
                    },
                    {
                        en: `If a ${TERMS.royal.en} milestone is reached, choose the required ${TERMS.royalCard.en}.`,
                        zh: `如果达到${TERMS.royal.zh}里程碑，先选择必须获得的${TERMS.royalCard.zh}。`,
                    },
                    {
                        en: `If you exceed your ${TERMS.gemCap.en}, discard down to the current limit.`,
                        zh: `如果超过当前${TERMS.gemCap.zh}，弃到该上限为止。`,
                    },
                    {
                        en: `If an ${TERMS.extraTurn.en} was gained, immediately take that extra turn.`,
                        zh: `如果获得${TERMS.extraTurn.zh}，立刻进入额外回合。`,
                    },
                ],
            },
        ],
    },
    {
        title: { en: 'Buying Cards', zh: '购买卡牌' },
        summary: {
            en: 'Cards become cheaper as your tableau grows. Gold covers missing cost, and Pearls remain special.',
            zh: '你的已购卡越多，后续购买越便宜。黄金可补足费用，珍珠始终按特殊资源处理。',
        },
        blocks: [
            {
                type: 'section',
                title: { en: 'Payment', zh: '支付规则' },
                items: [
                    {
                        en: `${TERMS.bonus.en}es reduce future costs of the same card color by 1 each.`,
                        zh: `每个同色${TERMS.bonus.zh}会使未来购买该颜色卡牌的费用减少 1。`,
                    },
                    {
                        en: 'Gold can replace any missing Gem cost, including Pearl.',
                        zh: '黄金可以替代任意缺失费用，包括珍珠。',
                    },
                    {
                        en: `Pearl costs are not reduced by ${TERMS.bonus.en}es.`,
                        zh: `珍珠费用不会被${TERMS.bonus.zh}抵扣。`,
                    },
                ],
            },
            {
                type: 'section',
                title: { en: 'Card abilities', zh: '卡牌能力' },
                items: [
                    {
                        en: `${TERMS.extraTurn.en}: Take another turn immediately after this turn resolves.`,
                        zh: `${TERMS.extraTurn.zh}：本回合结算后立即再进行一个回合。`,
                    },
                    {
                        en: `${TERMS.bonusGem.en}: Take 1 Gem matching the card color from the board if available.`,
                        zh: `${TERMS.bonusGem.zh}：若版图上有与卡牌颜色相同的宝石，拿取 1 个。`,
                    },
                    {
                        en: `${TERMS.steal.en}: Steal 1 non-Gold Gem from your opponent.`,
                        zh: `${TERMS.steal.zh}：从对手处偷取 1 个非黄金宝石。`,
                    },
                    {
                        en: `${TERMS.privilege.en}: Take 1 ${TERMS.privilegeScroll.en} from the board supply, or from the opponent if that supply is empty.`,
                        zh: `${TERMS.privilege.zh}：从版图供应堆拿取 1 个${TERMS.privilegeScroll.zh}；若供应堆为空，则从对手处拿取。`,
                    },
                ],
            },
        ],
    },
    {
        title: { en: 'Tokens & Limits', zh: '代币与限制' },
        summary: {
            en: 'Gem limits, scroll transfers, and buff-created resources all matter at the end of a turn.',
            zh: '宝石上限、卷轴转移和增益创造资源都会影响回合结束时的处理。',
        },
        blocks: [
            {
                type: 'section',
                title: { en: TERMS.gemCap.en, zh: TERMS.gemCap.zh },
                items: [
                    {
                        en: `The default ${TERMS.gemCap.en} is 10.`,
                        zh: `默认${TERMS.gemCap.zh}为 10。`,
                    },
                    {
                        en: 'Gold and Pearl count toward the limit.',
                        zh: '黄金和珍珠都会计入上限。',
                    },
                    {
                        en: `Roguelike Buffs can raise or lower your ${TERMS.gemCap.en}.`,
                        zh: `肉鸽增益可以提高或降低你的${TERMS.gemCap.zh}。`,
                    },
                ],
            },
            {
                type: 'section',
                title: { en: `${TERMS.privilegeScroll.en}s`, zh: TERMS.privilegeScroll.zh },
                items: [
                    {
                        en: `Use 1 before your main action to take 1 non-Gold Gem from the board.`,
                        zh: '在主要行动前使用 1 个，从版图拿取 1 个非黄金宝石。',
                    },
                    {
                        en: `You gain 1 when your opponent takes 3 same-color basic Gems or 2 Pearls with ${TERMS.takeGems.en}.`,
                        zh: `当对手通过${TERMS.takeGems.zh}拿到 3 个同色基础宝石或 2 个珍珠时，你获得 1 个。`,
                    },
                    {
                        en: 'If the board supply is empty, a standard scroll gain transfers 1 scroll from the opponent instead.',
                        zh: '如果版图供应堆为空，标准卷轴获取会改为从对手处转移 1 个。',
                    },
                ],
            },
            {
                type: 'section',
                title: { en: 'Extra resources', zh: '额外资源' },
                items: [
                    {
                        en: `${TERMS.extraBasicGem.en}s, ${TERMS.extraPearl.en}s, and ${TERMS.extraGold.en} vanish after being spent instead of returning to the bag.`,
                        zh: `${TERMS.extraBasicGem.zh}、${TERMS.extraPearl.zh}和${TERMS.extraGold.zh}在花费后会消失，不会回到布袋。`,
                    },
                    {
                        en: `${TERMS.specialPrivilege.en}s are protected golden scrolls. They cannot be taken by the opponent, are spent first, and are capped at 1.`,
                        zh: `${TERMS.specialPrivilege.zh}是受保护的金色卷轴。它们不能被对手拿走，会优先花费，且最多持有 1 个。`,
                    },
                ],
            },
        ],
    },
    {
        title: { en: 'Roguelike & Buff Compendium', zh: '肉鸽与增益手册' },
        summary: {
            en: 'Roguelike Mode gives both players asymmetric starting Buffs before the duel begins.',
            zh: '肉鸽模式会在对局开始前给予双方不对称的初始增益。',
        },
        blocks: [
            {
                type: 'section',
                title: { en: 'Draft setup', zh: '选择流程' },
                items: [
                    {
                        en: 'A random Buff Level from 1 to 3 is chosen before the game.',
                        zh: '游戏开始前会随机选择一个 1 到 3 的增益等级。',
                    },
                    {
                        en: 'P1 drafts 1 Buff from 3 options.',
                        zh: 'P1 从 3 个选项中选择 1 个增益。',
                    },
                    {
                        en: "P2 drafts from 4 options: P1's chosen Buff plus 3 new Buffs.",
                        zh: 'P2 从 4 个选项中选择：包括 P1 已选的增益以及 3 个新增益。',
                    },
                ],
            },
        ],
        body: {
            en: buildBuffCompendium('en'),
            zh: buildBuffCompendium('zh'),
        },
    },
];

const collectBlockText = (block: RulebookBlock, locale: keyof RulebookLocalizedText): string[] => {
    if (block.type === 'lead') {
        return [block.text[locale]];
    }

    if (block.type === 'callout') {
        return [block.title?.[locale], block.text[locale]].filter(Boolean) as string[];
    }

    return [
        block.title[locale],
        block.text?.[locale],
        ...block.items.map((item) => item[locale]),
    ].filter(Boolean) as string[];
};

export const getRulebookPageText = (
    page: RulebookPage,
    locale: keyof RulebookLocalizedText
): string =>
    [
        page.title[locale],
        page.summary?.[locale],
        ...(page.blocks ?? []).flatMap((block) => collectBlockText(block, locale)),
        page.body?.[locale],
    ]
        .filter(Boolean)
        .join('\n');

export const getRulebookSearchText = (): string =>
    RULEBOOK_CONTENT.flatMap((page) => [
        getRulebookPageText(page, 'en'),
        getRulebookPageText(page, 'zh'),
    ]).join('\n');
