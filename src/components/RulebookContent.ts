import { buildBuffCompendium } from '../data/buffCopy';

export interface RulebookPage {
    title: { en: string; zh: string };
    body: { en: string; zh: string };
    isCustom?: string; // If set, renders a custom component instead of text
}

export const RULEBOOK_CONTENT: RulebookPage[] = [
    {
        title: { en: 'Introduction', zh: '介绍' },
        body: {
            en: `
Welcome to Gem Duel

Gem Duel is a 2-player game where you play as a guild master of jewelers. You will compete against your opponent to acquire the most prestigious Gem cards, gain the favor of the Royal Court, and ultimately become the most renowned jeweler in the realm.

Goal of the Game

There are three default ways to win the game. The game ends immediately if you meet any of these conditions when your turn finishes resolving:

1.  20 Prestige Points total.
2.  10 Crowns collected.
3.  10 Prestige Points on cards of a single color.

Note: In Roguelike Mode, some Buffs change one or more of these targets.

Components

    Game Board: A 5x5 grid holding up to 25 Gem tokens.
    Gem Tokens:
        Basic: Blue, White, Green, Black, Red (4 of each).
        Special: Pearl (2), Gold (3).
    Cards: 3 levels of Gem cards (Level 1, 2, 3).
    Royal Cards: Special cards awarded for collecting Crowns.
    Privilege Scrolls: Tokens that allow extra actions.
        `,
            zh: `
欢迎来到 Gem Duel

《Gem Duel》是一款双人游戏，你将扮演珠宝商公会的会长。你将与对手竞争，获取最负盛名的宝石卡，赢得皇室的青睐，并最终成为王国中最著名的珠宝商。

游戏目标

默认有三种获胜方式。如果在你的回合结算完成时满足以下任一条件，游戏立即结束：

1.  20点声望值。
2.  收集10个皇冠。
3.  单一颜色卡牌获得10点声望值。

注意：在肉鸽模式中，部分增益会改动这些目标。

游戏组件

    游戏版图：一个 5x5 的网格，最多可容纳 25 个宝石代币。
    宝石代币：
        基础：蓝色、白色、绿色、黑色、红色（各 4 个）。
        特殊：珍珠 (2 个)、黄金 (3 个)。
    卡牌：3 个等级的宝石卡（1级、2级、3级）。
    皇室卡：通过收集皇冠获得的特殊奖励卡。
    特权卷轴：允许执行额外行动的代币。
`,
        },
    },
    {
        // Custom page rendered by CardAnatomyPage component
        title: { en: 'Card Anatomy & Abilities', zh: '卡牌结构与能力' },
        body: { en: '', zh: '' },
        isCustom: 'card_anatomy',
    },
    {
        title: { en: 'Turn Overview', zh: '回合概述' },
        body: {
            en: `
Main Actions

Optional Actions

Optional Actions happen before your Main Action and do not end your turn.

1.  Privilege Scroll:
    Return 1 Scroll to the supply to take 1 Non-Gold Gem from the board.
    You may use Privilege Scrolls multiple times in the same turn.

2.  Replenish:
    If there are still tokens in the bag, you may replenish the board.
    Your opponent then gains 1 standard Privilege Scroll.
    That scroll is normally taken from the board Privilege supply; only if the board Privilege supply is empty does it transfer from your side instead.
    Replenish the board by filling empty spaces on the Gem grid in spiral order.

You must perform **exactly one** of the following Main Actions:

1.  Take Gems from the Board:
    Select up to 3 consecutive tokens in a contiguous line (row, column, or diagonal).
    You cannot take Gold tokens with this action.
    You cannot take tokens if there is a gap between them.
    If your opponent takes 3 tokens of the same basic color, or 2 Pearls, you gain 1 Privilege Scroll.

2.  Reserve a Card:
    Reserve 1 Card from the Market (or the top of a deck) into your hand.
    If at least 1 Gold token is on the board, you also take **exactly 1 Gold token** as part of the Reserve.
    You can hold a maximum of 3 Reserved cards.
    If no Gold is available, you may still Reserve a card.

3.  Buy a Card:
    Buy a card from the Market or your Reserved hand.
    Pay the cost shown on the card using your Gems and/or Bonuses.

Forced Resolution

At the end of the turn, resolve the following in order:

1.  Special Abilities: Bonus Gem / Steal / Privilege
    Resolve any Bonus Gem, Steal, or Privilege card abilities triggered by this action.

2.  Gain a Royal Card:
    If your total Crowns reaches a Royal milestone and the Royal Court still has a Royal Card available, you must take one before moving on.

3.  Discard:
    If you are above your Gem limit after all required effects resolve, discard down to your current Gem limit (10 by default).

4.  Special Ability: Extra Turn
    If you gained an Extra Turn ability this turn, immediately take that extra turn.
        `,
            zh: `
主要行动

可选行动

可选行动发生在主要行动前，并且不会结束你的回合。

1.  特权卷轴：
    将 1 个卷轴归还至供应堆，从版图上拿取 1 个非黄金宝石。
    你可以在同一回合中多次使用特权卷轴。

2.  补给：
    如果袋子里还有代币，你可以补给版图。
    此后你的对手获得 1 个标准特权卷轴。
    这个卷轴通常来自版图特权供应堆；只有当版图特权供应堆已空时，才会改为从你这边转移 1 个。
    补给版图时，按螺旋顺序填补宝石面板上的空位。

你必须执行以下**恰好一个**主要行动：

1.  从版图拿取宝石：
    选择最多 3 个连续 的代币，它们必须排成一条直线（行、列或对角线）。
    你不能通过此行动拿取黄金代币。
    如果代币之间有空隙，你不能同时拿取它们。
    如果你的对手一次拿到 3 个相同基础颜色的宝石，或 2 个珍珠，你会获得 1 个特权卷轴。

2.  保留 1 张卡牌：
    从市场（或卡组顶端）保留 1 张卡牌到你的手中。
    如果版图上存在至少 1 个黄金代币，则此次保留还会额外拿取**恰好 1 个黄金代币**。
    你最多可以持有 3 张保留卡牌。
    如果没有黄金可用，你仍然可以执行保留。

3.  购买卡牌：
    从市场或你的保留卡牌中购买一张卡。
    使用你的宝石和/或奖励支付卡牌上显示的成本。

强制结算

回合结束时，按以下顺序进行结算：

1.  特殊能力：奖励宝石 / 掠夺 / 特权
    结算本次行动触发的奖励宝石 / 掠夺 / 特权卡牌能力。

2.  获取皇室卡：
    如果你的皇冠总数达到皇室里程碑，且皇室区还有皇室卡，则你必须先获取 1 张皇室卡。

3.  弃牌：
    当所有强制效果结算完成后，如果你的宝石数量仍高于当前上限，则弃到当前宝石上限为止（默认上限为 10）。

4.  特殊能力：额外回合
    如果你在本回合获得额外回合能力，立刻获得额外的一个回合！
`,
        },
    },
    {
        title: { en: 'Buying Cards & Bonuses', zh: '购买卡牌与奖励' },
        body: {
            en: `
Cost & Payment

Each card shows its cost in Gems (bottom left).
Bonuses: Cards you have already bought provide Bonuses (top right gem icon).
    1 Bonus reduces the cost of future cards of that color by 1.
    Example: If a card costs 3 Blue and you have 2 Blue Bonuses, you only pay 1 Blue Gem.
Gold (Joker): Gold tokens can replace any missing Gem cost, including Pearls.
Pearls: Pearls cannot be discounted by Bonuses.

Abilities

Some cards have special abilities (icons at the top center):

Play Again: Take another turn immediately.
Bonus Gem: Take 1 Gem of the card's color from the Board (if available).
Steal: Steal 1 non-Gold Gem from your opponent.
Privilege: Take 1 Privilege Scroll from the board Privilege supply (or from the opponent if that supply is empty).
        `,
            zh: `
成本与支付

每张卡牌左下角显示其宝石成本。
奖励：你已经购买的卡牌会提供奖励（右上角的宝石图标）。
    1 个奖励可以使未来购买该颜色卡牌的成本减少 1。
    例如：如果一张卡需要 3 个蓝色，而你有 2 个蓝色奖励，你只需支付 1 个蓝色宝石。
黄金：黄金代币可以替代任何缺失的费用，包括珍珠。
珍珠：珍珠不能被奖励抵扣。

能力

某些卡牌具有特殊能力（顶部中央的图标）：

再次行动：立即获得额外的一个回合。
奖励宝石：从版图上拿取 1 个与该卡牌颜色相同的宝石（如果有）。
掠夺：从对手那里偷取 1 个非黄金宝石。
特权：从版图特权供应堆拿取 1 个特权卷轴（如果该供应堆为空，则从对手处拿取）。
`,
        },
    },
    {
        title: { en: 'The Royal Court', zh: '皇室法院' },
        body: {
            en: `
Crowns & Royals

Some cards display Crowns (bottom-right of the card).
When you collect 3 Crowns, if the Royal Court still has a Royal Card available, you must immediately take 1.
When you collect 6 Crowns, if the Royal Court still has a Royal Card available, you must immediately take another 1.
Royal Cards provide Prestige Points and sometimes special abilities.
Royal Cards do not have a cost; they are free rewards.
Royal Cards count towards your total score and Crown count, but do not provide color bonuses.

Winning Condition Check

At the end of your turn, check if you have met any of the 3 default victory conditions:
1.  20 Points
2.  10 Crowns
3.  10 Points in one color

Some Roguelike Buffs replace one of these targets. If your active target is met, you win immediately.
        `,
            zh: `
皇冠与皇室卡

某些卡牌上显示有皇冠（卡牌右下方）。
当你收集到 3 个皇冠时，如果皇室区还有皇室卡，则必须立即获取 1 张。
当你收集到 6 个皇冠时，如果皇室区还有皇室卡，则必须立即再获取 1 张。
皇室卡提供声望值，有时还带有特殊能力。
皇室卡没有成本，它们是免费的奖励。
皇室卡计入你的总分和皇冠总数，但不提供颜色奖励。

获胜条件检查

在你的回合结束时，检查是否满足以下 3 个默认获胜条件之一：
1.  20 分
2.  10 个皇冠
3.  单一颜色获得 10 分

部分肉鸽增益会替换其中的某个目标。只要你满足当前生效的目标，就会立即获胜。
`,
        },
    },
    {
        title: { en: 'Tokens & Limits', zh: '代币与限制' },
        body: {
            en: `
Token Limits

Default Gem Cap: 10. At the end of your turn, if you still have more than your Gem Cap (including Gold and Pearls), you must discard down to that limit.
Some Roguelike Buffs raise or lower your Gem Cap.

Privilege Scrolls

Used before your Main Action to take 1 non-Gold Gem from the board.
You also gain 1 Privilege Scroll when your opponent takes 3 tokens of the same basic color, or 2 Pearls, in a single Take Gems action.
If either player would gain a standard Privilege Scroll while the board Privilege supply is empty, that scroll is taken from the opponent instead.

Extra Resources (Roguelike Only)

Extra Gems: Some buffs provide "Extra" gems. These do NOT return to the bag when spent—they vanish from the game. The system automatically spends these first.
Special Privileges: Some buffs grant golden "Special" scrolls. They cannot be taken by your opponent, are spent before normal scrolls, and you can have at most 1 Special Privilege at any time.
        `,
            zh: `
代币限制

默认宝石上限为 10：在你的回合结束时，如果你持有的代币（包括黄金和珍珠）仍然超过你的宝石上限，就必须弃到该上限为止。
部分肉鸽增益会提高或降低这个上限。

特权卷轴

用于在主要行动前从版图上拿取 1 个非黄金宝石。
如果你的对手在一次“拿取宝石”行动中拿到 3 个相同基础颜色的宝石，或 2 个珍珠，你也会获得 1 个特权卷轴。
如果任意一方要获得标准特权卷轴，但版图特权供应堆已空，则会改为从对手处拿取。

额外资源（仅限肉鸽模式）

额外宝石：某些增益提供“额外”宝石。这些宝石在花费后不会回到布袋中，而是直接从游戏中消失。系统会自动优先消耗此类宝石。
特殊特权：某些增益提供金色的“特殊”卷轴。它们不会被对手拿走，会优先于普通卷轴被消耗，且你最多同时持有 1 个特殊特权。
`,
        },
    },
    {
        title: { en: 'Roguelike Mode (New!)', zh: '肉鸽模式（新！）' },
        body: {
            en: `
Roguelike Mode: Unique Starting Buffs

In this mode, players start with asymmetric abilities ("Buffs") that alter their strategy.
Before the game starts, a random **Buff Level (1-3)** is chosen.
Player 1 drafts 1 Buff from a pool of 3.
Player 2 then drafts 1 Buff from a pool of 4: Player 1's chosen Buff, plus 3 new Buffs.

Buff Levels

Level 1 (Minor Tweak): Small boosts to start the game.
Level 2 (Tactical Shift): Changes resource management or card costs.
Level 3 (Game Changer): Powerful effects with major trade-offs.

Resource Note:
Buffs that grant initial gems or mid-game bonuses use the **Extra Resource** system (they vanish when spent).
        `,
            zh: `
肉鸽模式：独特的初始增益

在此模式下，玩家开始时拥有不对称的能力，这些能力会改变他们的策略。
游戏开始前，会随机选择一个 **增益等级（1-3）**。
玩家 1 会先从 3 个增益中选择 1 个。
随后玩家 2 会从一个 4 选 1 池中选择自己的增益：其中包含玩家 1 选中的 1 个增益，以及 3 个新的增益。

Buff 等级

1 级 (微调)：游戏开始时的小幅提升。
2 级 (战术转变)：改变资源管理或卡牌成本。
3 级 (规则改变)：强大的效果，但伴随着重大的权衡。

资源提示：
所有提供初始宝石或局中奖励宝石的增益均采用**额外资源**系统（花费后即消失）。
`,
        },
    },
    {
        title: { en: 'Buff Compendium', zh: '增益手册' },
        body: {
            en: buildBuffCompendium('en'),
            zh: buildBuffCompendium('zh'),
        },
    },
];
