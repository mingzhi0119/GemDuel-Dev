using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using GemDuel.Catalog;
using GemDuel.Core;
using GemDuel.Platform;
using GemDuel.Replay;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using TMPro;
using UnityEngine;

namespace GemDuel.Presentation
{
    public sealed class GemDuelGameController : MonoBehaviour
    {
        private const string DefaultFixtureFileName = "local-pvp-royal-extra-turn-game-over.replay.json";
        private const string RecoverySaveName = "gemduel.recovery.v1";
        private const string LocalDevReplayFileName = "localdev.replay.json";
        private const float CardPreviewAspectRatio = 1448f / 1086f;
        private const int MaxTakeGemsSelectionCount = 3;
        private const int SharedPrivilegeSupplySize = 3;
        private const float ElectronSettingsCssScale = 1.5f;
        private const float ElectronShellVisualScale = 0.5f;
        private const float ElectronSettingsScale = ElectronSettingsCssScale * ElectronShellVisualScale;
        private const float ElectronSettingsMenuCssWidth = 248f;
        private const float ElectronSettingsMenuWidth = ElectronSettingsMenuCssWidth * ElectronSettingsScale;
        private const float ElectronSettingsMenuHeight = 228.83f;
        private const float ElectronSettingsContentInset = 8.25f;
        private const float ElectronSettingsTitleFontPx = 11f * ElectronSettingsScale;
        private const float ElectronSettingsSectionLabelFontPx = 10f * ElectronSettingsScale;
        private const float ElectronSettingsRowFontPx = 13f * ElectronSettingsScale;
        private const float ElectronSettingsLocaleFontPx = 12f * ElectronSettingsScale;
        private const float ElectronSettingsRowHeight = 31.61f;
        private const float ElectronSettingsRowGap = 6f * ElectronSettingsScale;
        private const float SettingsPanelX = 1722f;
        private const float SettingsPanelY = 60f;
        private const float SettingsPanelWidth = ElectronSettingsMenuWidth;
        private const float SettingsPanelHeight = ElectronSettingsMenuHeight;
        private const float SettingsControlX = SettingsPanelX + ElectronSettingsContentInset;
        private const float SettingsControlWidth = SettingsPanelWidth - ElectronSettingsContentInset * 2f;
        private const float SettingsTitleY = 74.64f;
        private const float SettingsLocaleLabelY = 92.85f;
        private const float SettingsLocaleX = SettingsControlX + 3f;
        private const float SettingsLocaleY = 104.66f;
        private const float SettingsLocaleWidth = SettingsControlWidth - 6f;
        private const float SettingsLocaleHeight = 28.5f;
        private const float SettingsRowStartY = 140.66f;
        private const float SettingsRowHeight = ElectronSettingsRowHeight;
        private const float SettingsRowGap = ElectronSettingsRowHeight + ElectronSettingsRowGap;
        private const float SettingsTitleFontSize = ElectronSettingsTitleFontPx / 108f;
        private const float SettingsSectionLabelFontSize = ElectronSettingsSectionLabelFontPx / 108f;
        private const float SettingsLocaleFontSize = ElectronSettingsLocaleFontPx / 108f;
        private const float SettingsRowFontSize = ElectronSettingsRowFontPx / 108f;
        private const float SettingsIconFontSize = 20f * ElectronSettingsScale / 108f;
        private static readonly string[] GemOrder = { "blue", "white", "green", "black", "red", "pearl", "gold" };
        private static readonly string[] ReplayInitLevels = { "1", "2", "3" };
        private static readonly int[] ReplayInitMarketSlotsByLevel = { 5, 4, 3 };
        private static readonly string[] JokerBonusColorOrder = { "red", "green", "blue", "white", "black", "pearl" };
        private static readonly string[] PlayerZoneResourceOrder = { "red", "green", "blue", "white", "black", "pearl", "gold" };
        private static readonly string[] PlayerZoneTableauOrder = { "red", "green", "blue", "white", "black", "pure-royal" };
        private const string RulebookSourceOfTruth = "packages/ui/src/components/RulebookContent.ts";
        private static readonly RulebookPageContent[] RulebookPages =
        {
            new RulebookPageContent(
                "Quick Start",
                "快速上手",
                "Gem Duel is a 2-player card and token duel. You win by ending your turn with one active victory target met.",
                "《Gem Duel》是一款双人卡牌与宝石对决。只要在你的回合结算结束时满足任一当前胜利目标，你就会获胜。",
                new RulebookSectionContent(
                    "Default victory targets",
                    "默认胜利目标",
                    new[]
                    {
                        new LocalizedRulebookText("Reach 20 Prestige Points.", "达到 20 点声望值。"),
                        new LocalizedRulebookText("Collect 10 Crowns.", "收集 10 个皇冠。"),
                        new LocalizedRulebookText("Reach 10 Single-Color Points.", "达到 10 点单色分数。"),
                    }
                ),
                new RulebookSectionContent(
                    "Table components",
                    "桌面组件",
                    new[]
                    {
                        new LocalizedRulebookText("A 5x5 board holds up to 25 Gem tokens.", "5x5 宝石版图最多容纳 25 个宝石代币。"),
                        new LocalizedRulebookText("Standard Gems are blue, white, green, black, and red. Special Gems are Pearl and Gold.", "基础宝石包括蓝、白、绿、黑、红。特殊宝石包括珍珠和黄金。"),
                        new LocalizedRulebookText("Market cards have 3 levels. The Royal Area holds Royal Cards chosen at Crown milestones.", "市场卡牌分为 3 个等级。皇室区展示通过皇冠里程碑选择的皇室卡。"),
                        new LocalizedRulebookText("Privilege Scrolls are optional-action tokens that let you take 1 non-Gold Gem before your main action.", "特权卷轴是可选行动资源，可在主要行动前拿取 1 个非黄金宝石。"),
                    }
                ),
                new RulebookSectionContent(
                    "Roguelike note",
                    "肉鸽提示",
                    new[]
                    {
                        new LocalizedRulebookText("Roguelike Buffs can replace victory targets, change limits, and add extra resources. The active targets shown in game are authoritative.", "肉鸽增益可能替换胜利目标、改变上限或提供额外资源。游戏内当前显示的目标始终优先。"),
                    },
                    "callout"
                )
            ),
            new RulebookPageContent(
                "Card Anatomy & Abilities",
                "卡牌结构与能力",
                "Original Electron page: Card Layout diagram plus Special Abilities glossary.",
                "Electron 原版页面：卡牌结构图示与特殊能力词条。",
                new RulebookSectionContent(
                    "Card Layout",
                    "卡牌结构",
                    new[]
                    {
                        new LocalizedRulebookText("Prestige Points: 20 total points to win, or 10 Single-Color Points to win.", "声望值：总分达到 20 即可获胜，或单色分数达到 10 即可获胜。"),
                        new LocalizedRulebookText("Bonus: discount on future buys. Wild Bonus may become any basic color discount.", "奖励：为后续购买提供折扣。万能奖励可任选一种基础颜色作为折扣。"),
                        new LocalizedRulebookText("Special Ability: icon triggers on buy.", "特殊能力：购买时触发图标效果。"),
                        new LocalizedRulebookText("Gem Cost: price to purchase.", "宝石成本：购买所需价格。"),
                        new LocalizedRulebookText("Crowns: unlock Royal Area picks. 10 Crowns to win.", "皇冠：收集后会触发皇室区选择。10 个即可获胜。"),
                    },
                    "figure"
                ),
                new RulebookSectionContent(
                    "Special Abilities",
                    "特殊能力",
                    new[]
                    {
                        new LocalizedRulebookText("Extra Turn: immediately take another turn after this one.", "额外回合：立即获得额外的一个回合。"),
                        new LocalizedRulebookText("Bonus Gem: take 1 Gem of the card's color from the board.", "奖励宝石：从版图上拿取 1 个与该卡牌颜色相同的宝石。"),
                        new LocalizedRulebookText("Steal: steal 1 non-Gold Gem from your opponent.", "掠夺：从对手那里偷取 1 个非黄金宝石。"),
                        new LocalizedRulebookText("Privilege: take 1 Privilege Scroll, or steal one if the supply is empty.", "特权：拿取 1 个特权卷轴；如果供应堆为空，则从对手处拿取。"),
                    }
                )
            ),
            new RulebookPageContent(
                "Player Zone",
                "玩家区",
                "Your player zone shows owned cards, reserved cards, resources, and Privilege Scrolls.",
                "玩家区展示你的已购卡、保留卡、宝石资源和特权卷轴。",
                new RulebookSectionContent(
                    "Player Zone Figure",
                    "玩家区图示",
                    new[]
                    {
                        new LocalizedRulebookText("Reserve", "保留区"),
                        new LocalizedRulebookText("Tableau / Library", "牌库 / 已购卡"),
                        new LocalizedRulebookText("Buffs (Rogue Only)", "Buffs（肉鸽限定）"),
                        new LocalizedRulebookText("Scrolls", "特权卷轴"),
                        new LocalizedRulebookText("Gems", "宝石资源"),
                    },
                    "figure"
                ),
                new RulebookSectionContent(
                    "Owned cards",
                    "已购卡与牌库",
                    new[]
                    {
                        new LocalizedRulebookText("When you gain a card, it enters your personal tableau and becomes part of your card library.", "当你获得一张卡后，它会进入你的个人场上区域，并成为你的牌库内容。"),
                        new LocalizedRulebookText("Click a color stack, or the pure-points stack, to inspect every card you own in that group.", "点击某个颜色牌库或纯分数牌库，可以查看你拥有的该色或纯分数的所有卡牌。"),
                        new LocalizedRulebookText("Bonus discounts and Single-Color Points are read from these owned-card stacks.", "奖励折扣和单色分数都会从这些已购卡堆中计算。"),
                    }
                ),
                new RulebookSectionContent(
                    "Reserved cards",
                    "保留区",
                    new[]
                    {
                        new LocalizedRulebookText("When you reserve a card, it moves into your personal reserve area.", "当你保留一张卡时，它会进入你的个人保留区。"),
                        new LocalizedRulebookText("Reserved cards can only be bought by you.", "保留区中的卡牌只能由你购买。"),
                        new LocalizedRulebookText("Click the reserve area to inspect your reserved cards and buy them when you can pay the cost.", "点击保留区可以查看你保留的牌，并在能支付费用时从这里购买。"),
                    }
                ),
                new RulebookSectionContent(
                    "Privilege Scrolls",
                    "特权卷轴",
                    new[]
                    {
                        new LocalizedRulebookText("Privilege Scrolls appear below your avatar after you gain them.", "当你获得特权卷轴后，它会显示在你的头像下方。"),
                        new LocalizedRulebookText("At the start of your turn, click a Privilege Scroll to take 1 non-Gold Gem from the board before your main action.", "在你的回合开始时，可以点击特权卷轴，并从盘面拿取 1 个非黄金宝石，然后再执行主要行动。"),
                        new LocalizedRulebookText("Your gem row shows the resources you can spend, steal, discard, or count against the Gem Cap.", "你的宝石资源行会显示可用于支付、被掠夺、弃置或计入宝石上限的资源。"),
                    }
                )
            ),
            new RulebookPageContent(
                "Main Field",
                "主战区",
                "The Main Field contains the Market, the board, and the Royal Area.",
                "主战区包含市场、宝石盘面和皇室区。",
                new RulebookSectionContent(
                    "Main Field Figure",
                    "主战区图示",
                    new[]
                    {
                        new LocalizedRulebookText("Market", "市场"),
                        new LocalizedRulebookText("Board", "盘面"),
                        new LocalizedRulebookText("Royal Area", "皇室区"),
                    },
                    "figure"
                ),
                new RulebookSectionContent(
                    "Market",
                    "市场",
                    new[]
                    {
                        new LocalizedRulebookText("The Market shows face-up cards by level, plus each level deck.", "市场按等级展示公开卡牌，并显示每个等级的牌堆。"),
                        new LocalizedRulebookText("Click a face-up card to preview it, then buy or reserve from the Preview panel.", "点击公开卡会先打开预览面板，然后从预览中购买或保留。"),
                        new LocalizedRulebookText("Deck previews let you reserve the top card when that action is legal.", "当行动合法时，牌堆预览可以让你保留牌堆顶牌。"),
                    }
                ),
                new RulebookSectionContent(
                    "Board",
                    "盘面",
                    new[]
                    {
                        new LocalizedRulebookText("The board is where you take Gems with Take Gems, Bonus Gem, and Privilege Scrolls.", "盘面用于通过拿取宝石、奖励宝石和特权卷轴拿取宝石。"),
                        new LocalizedRulebookText("Normal gem-taking uses a legal straight line. Gold cannot be taken by normal gem-taking.", "普通拿取宝石需要选择合法直线。黄金不能通过普通拿取宝石获得。"),
                        new LocalizedRulebookText("Follow-up phases highlight the required target, such as Gold after reserve or a matching gem after Bonus Gem.", "后续阶段会高亮必须选择的目标，例如保留后的黄金，或奖励宝石能力后的同色宝石。"),
                    }
                ),
                new RulebookSectionContent(
                    "Royal Area",
                    "皇室区",
                    new[]
                    {
                        new LocalizedRulebookText("Royal Cards are displayed on the right side of the board. At 3 or 6 Crowns, you must choose one to gain.", "皇室卡显示在盘面右侧，在你达到3/6个皇冠时你必须选择一个获取。"),
                        new LocalizedRulebookText("Royal Cards are free pure-points cards that provide points and special abilities.", "皇室卡是免费的纯分数卡，提供分数和特殊能力。"),
                        new LocalizedRulebookText("Click Royal Cards to inspect them outside selection, or choose one during Royal Area selection.", "非选择阶段可点击皇室卡查看；当游戏进入皇室区选择阶段时，可点击其中一张获得。"),
                    }
                )
            ),
            new RulebookPageContent(
                "Battle Status Bar",
                "战况栏",
                "The Battle Status Bar shows both players' current victory pressure and whose turn is active.",
                "战况栏显示双方当前胜利进度，以及现在轮到哪一方行动。",
                new RulebookSectionContent(
                    "Battle Status Bar Figure",
                    "战况栏图示",
                    new[]
                    {
                        new LocalizedRulebookText("P1 Crowns / Goals", "P1 皇冠 / 目标"),
                        new LocalizedRulebookText("P1 Points / Goal", "P1 分数 / 目标"),
                        new LocalizedRulebookText("Turn Counts", "回合计数"),
                        new LocalizedRulebookText("P2 Crowns / Goals", "P2 皇冠 / 目标"),
                        new LocalizedRulebookText("P2 Points / Goal", "P2 分数 / 目标"),
                    },
                    "figure"
                ),
                new RulebookSectionContent(
                    "Scores and goals",
                    "分数与目标",
                    new[]
                    {
                        new LocalizedRulebookText("Prestige Points are shown beside each player's score icon, with the active target shown after the slash.", "声望值显示在每名玩家的分数图标旁，斜杠后的数字是当前目标。"),
                        new LocalizedRulebookText("Crowns are shown beside each player's crown icon, with the active Crown target shown after the slash.", "皇冠显示在每名玩家的皇冠图标旁，斜杠后的数字是当前皇冠目标。"),
                        new LocalizedRulebookText("Buffs may change these target values, so the Battle Status Bar is the live source of truth.", "增益可能改变这些目标数值，因此战况栏显示的是当前实时目标。"),
                    }
                ),
                new RulebookSectionContent(
                    "Turn state",
                    "回合状态",
                    new[]
                    {
                        new LocalizedRulebookText("The center of the bar shows P1 and P2 turn counts.", "战况栏中央显示 P1 与 P2 的回合计数。"),
                        new LocalizedRulebookText("The active player is highlighted so you can tell whose turn is currently resolving.", "当前行动方会被高亮，方便判断正在结算谁的回合。"),
                        new LocalizedRulebookText("In online play, a small marker appears when it is your turn.", "在线对局中，轮到你行动时会出现额外提示。"),
                    }
                )
            ),
            new RulebookPageContent(
                "Turn Flow",
                "回合流程",
                "Optional actions happen first. Then you must perform exactly one main action. Forced resolution finishes the turn.",
                "先执行可选行动，然后必须执行恰好一个主要行动，最后按顺序完成强制结算。",
                new RulebookSectionContent(
                    "Optional Actions",
                    "可选行动",
                    new[]
                    {
                        new LocalizedRulebookText("Privilege Scroll: Return 1 Scroll to take 1 non-Gold Gem from the board.", "特权卷轴：归还 1 个卷轴，从版图拿取 1 个非黄金宝石。"),
                        new LocalizedRulebookText("Replenish: Fill board gaps from the bag in spiral order. Your opponent gains 1 standard Privilege Scroll.", "补给：按螺旋顺序从布袋补满空位。对手获得 1 个标准特权卷轴。"),
                    }
                ),
                new RulebookSectionContent(
                    "Main actions",
                    "主要行动",
                    new[]
                    {
                        new LocalizedRulebookText("Take Gems: Take up to 3 consecutive tokens in one straight row, column, or diagonal. Gold cannot be taken this way.", "拿取宝石：拿取最多 3 个连续且排成直线的代币，方向可以是行、列或对角线。不能以此方式拿取黄金。"),
                        new LocalizedRulebookText("Reserve: Reserve 1 Market card or top deck card. If Gold is on the board, take exactly 1 Gold with the reserve.", "保留：保留 1 张市场卡或牌堆顶牌。若版图上有黄金，此次保留必须同时拿取恰好 1 个黄金。"),
                        new LocalizedRulebookText("Buy Card: Buy a Market or Reserved card by paying Gems after Bonus discounts.", "购买卡牌：使用宝石并结算奖励折扣后，购买市场或保留区卡牌。"),
                    }
                ),
                new RulebookSectionContent(
                    "Forced resolution order",
                    "强制结算顺序",
                    new[]
                    {
                        new LocalizedRulebookText("Resolve triggered abilities: Bonus Gem, Steal, and Privilege.", "结算触发能力：奖励宝石、掠夺和特权。"),
                        new LocalizedRulebookText("If a Royal Area milestone is reached, choose the required Royal Card.", "如果达到皇室区里程碑，先选择必须获得的皇室卡。"),
                        new LocalizedRulebookText("If you exceed your Gem Cap, discard down to the current limit.", "如果超过当前宝石持有上限，弃到该上限为止。"),
                        new LocalizedRulebookText("If an Extra Turn was gained, immediately take that extra turn.", "如果获得额外回合，立刻进入额外回合。"),
                    }
                )
            ),
            new RulebookPageContent(
                "Buying Cards",
                "购买卡牌",
                "Cards become cheaper as your tableau grows. Gold covers missing cost, and Pearls remain special.",
                "你的已购卡越多，后续购买越便宜。黄金可补足费用，珍珠始终按特殊资源处理。",
                new RulebookSectionContent(
                    "Payment",
                    "支付规则",
                    new[]
                    {
                        new LocalizedRulebookText("Bonuses reduce future costs of the same card color by 1 each.", "每个同色奖励会使未来购买该颜色卡牌的费用减少 1。"),
                        new LocalizedRulebookText("Gold can replace any missing Gem cost, including Pearl.", "黄金可以替代任意缺失费用，包括珍珠。"),
                        new LocalizedRulebookText("Pearl costs are not reduced by Bonuses.", "珍珠费用不会被奖励抵扣。"),
                    }
                ),
                new RulebookSectionContent(
                    "Card abilities",
                    "卡牌能力",
                    new[]
                    {
                        new LocalizedRulebookText("Extra Turn: Take another turn immediately after this turn resolves.", "额外回合：本回合结算后立即再进行一个回合。"),
                        new LocalizedRulebookText("Bonus Gem: Take 1 Gem matching the card color from the board if available.", "奖励宝石：若版图上有与卡牌颜色相同的宝石，拿取 1 个。"),
                        new LocalizedRulebookText("Steal: Steal 1 non-Gold Gem from your opponent.", "掠夺：从对手处偷取 1 个非黄金宝石。"),
                        new LocalizedRulebookText("Privilege: Take 1 Privilege Scroll from the board supply, or from the opponent if that supply is empty.", "特权：从版图供应堆拿取 1 个特权卷轴；若供应堆为空，则从对手处拿取。"),
                    }
                )
            ),
            new RulebookPageContent(
                "Tokens & Limits",
                "代币与限制",
                "Gem limits, scroll transfers, and buff-created resources all matter at the end of a turn.",
                "宝石上限、卷轴转移和增益创造资源都会影响回合结束时的处理。",
                new RulebookSectionContent(
                    "Gem Cap",
                    "宝石持有上限",
                    new[]
                    {
                        new LocalizedRulebookText("The default Gem Cap is 10.", "默认宝石持有上限为 10。"),
                        new LocalizedRulebookText("Gold and Pearl count toward the limit.", "黄金和珍珠都会计入上限。"),
                        new LocalizedRulebookText("Roguelike Buffs can raise or lower your Gem Cap.", "肉鸽增益可以提高或降低你的宝石持有上限。"),
                    }
                ),
                new RulebookSectionContent(
                    "Privilege Scrolls",
                    "特权卷轴",
                    new[]
                    {
                        new LocalizedRulebookText("Use 1 before your main action to take 1 non-Gold Gem from the board.", "在主要行动前使用 1 个，从版图拿取 1 个非黄金宝石。"),
                        new LocalizedRulebookText("You gain 1 when your opponent takes 3 same-color basic Gems or 2 Pearls with Take Gems.", "当对手通过拿取宝石拿到 3 个同色基础宝石或 2 个珍珠时，你获得 1 个。"),
                        new LocalizedRulebookText("If the board supply is empty, a standard scroll gain transfers 1 scroll from the opponent instead.", "如果版图供应堆为空，标准卷轴获取会改为从对手处转移 1 个。"),
                    }
                ),
                new RulebookSectionContent(
                    "Extra resources",
                    "额外资源",
                    new[]
                    {
                        new LocalizedRulebookText("Extra Basic Gems, Extra Pearls, and Extra Gold vanish after being spent instead of returning to the bag.", "额外基础宝石、额外珍珠和额外黄金在花费后会消失，不会回到布袋。"),
                        new LocalizedRulebookText("Special Privileges are protected golden scrolls. They cannot be taken by the opponent, are spent first, and are capped at 1.", "特殊特权是受保护的金色卷轴。它们不能被对手拿走，会优先花费，且最多持有 1 个。"),
                    }
                )
            ),
            new RulebookPageContent(
                "Roguelike & Buff Compendium",
                "肉鸽与增益手册",
                "Roguelike Mode gives both players asymmetric starting Buffs before the duel begins.",
                "肉鸽模式会在对局开始前给予双方不对称的初始增益。",
                new RulebookSectionContent(
                    "Draft setup",
                    "选择流程",
                    new[]
                    {
                        new LocalizedRulebookText("A random Buff Level from 1 to 3 is chosen before the game.", "游戏开始前会随机选择一个 1 到 3 的增益等级。"),
                        new LocalizedRulebookText("P1 drafts 1 Buff from 3 options.", "P1 从 3 个选项中选择 1 个增益。"),
                        new LocalizedRulebookText("P2 drafts from 4 options: P1's chosen Buff plus 3 new Buffs.", "P2 从 4 个选项中选择：包括 P1 已选的增益以及 3 个新增益。"),
                    }
                ),
                new RulebookSectionContent(
                    "Buff Compendium",
                    "增益手册",
                    new[]
                    {
                        new LocalizedRulebookText("The original Electron page appends buildBuffCompendium('en') from @gemduel/shared/data/buffCopy.", "Electron 原版页面会追加 @gemduel/shared/data/buffCopy 的 buildBuffCompendium('zh') 内容。"),
                        new LocalizedRulebookText("Unity reads the same runtime Buff catalog for draft labels and descriptions; this page keeps the compendium source linked in the snapshot.", "Unity 草稿标签与描述读取同一运行时增益目录；本页在快照中保留手册来源。"),
                    },
                    "body"
                )
            ),
        };
        private static readonly string[] SurfaceThemeVariants =
        {
            "crystal-anime",
            "royal-luxury",
            "dark-arcane",
            "clean-boardgame",
            "pearl-opaline",
            "lotus-porcelain",
        };

        private readonly LocalDevPlatformServices platformServices = new LocalDevPlatformServices();
        private readonly GameReducer reducer = new GameReducer();
        private readonly List<Vector2Int> selectedGemCoords = new List<Vector2Int>();
        private IGameRulesEngine rulesEngine = new TypeScriptGameRulesEngine();
        private ReplayVNext activeReplay;
        private ReplayVNext liveRecordedReplay;
        private JObject activeRulesInit = new JObject();
        private UnityCatalog catalog;
        private GameState currentState;
        private GameObject renderRoot;
        private readonly List<GameObject> renderedRoots = new List<GameObject>();
        private TMP_Text statusText;
        private TMP_Text guideText;
        private int nextFixtureEventIndex;
        private bool isMainMenu;
        private bool settingsOpen;
        private bool settingsSurfaceDropdownOpen;
        private bool rulebookOpen;
        private int rulebookPage;
        private string settingsLocale = "zh";
        private readonly string settingsTheme = "dark";
        private string settingsSurfaceTheme = "royal-luxury";
        private bool settingsSoundEnabled = true;
        private bool settingsLanShowOpponentPlayerZoneCards = true;
        private bool settingsLanShowOpponentGems = true;
        private string settingsPersistenceStatus = "not-written";
        private string settingsPersistencePath = string.Empty;
        private string settingsPersistenceError = string.Empty;
        private string replayPersistenceStatus = "not-written";
        private string replayPersistencePath = string.Empty;
        private string replayPersistenceError = string.Empty;
        private string recoveryPersistenceStatus = "not-written";
        private string recoveryPersistenceError = string.Empty;
        private string errorBanner = string.Empty;
        private PreviewContext previewContext;
        private HoverContext hoverContext;
        private Texture2D previewBackgroundTexture;
        private int automationViewportWidth = 1920;
        private int automationViewportHeight = 1080;
        private bool previewBackdropCaptureEnabled;
        private bool automationInteractiveReplayMode;
        private bool previewInteractionLayoutSticky;
        private readonly Dictionary<string, Texture2D> textureCache = new Dictionary<string, Texture2D>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, Texture2D> roundedTextureCache = new Dictionary<string, Texture2D>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, Texture2D> grayscaleTextureCache = new Dictionary<string, Texture2D>(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, Texture2D> displayTextureCache = new Dictionary<string, Texture2D>(StringComparer.OrdinalIgnoreCase);
        private Texture2D draftBackgroundTexture;
        private TMP_FontAsset uiFontAsset;
        private Material uiFontMaterial;
        private string uiFontPresetKey = string.Empty;
        private float renderOpacity = 1f;
        private bool compensateTextWeight;
        private string lastAutomationDriver = "setup";
        private string lastAutomationDetail = string.Empty;

        public int ReplayEventsCompleted
        {
            get { return nextFixtureEventIndex; }
        }

        public int ReplayEventsTotal
        {
            get { return activeReplay == null ? 0 : activeReplay.Events.Count; }
        }

        public string Winner
        {
            get { return currentState == null ? null : currentState.Winner; }
        }

        public string LastAutomationDriver
        {
            get { return lastAutomationDriver; }
        }

        public string LastAutomationDetail
        {
            get { return lastAutomationDetail; }
        }

        public string GetBoardGemForAutomation(int row, int column)
        {
            return GetCurrentBoardGemId(row, column);
        }

        private string GetCurrentBoardGemId(int row, int column)
        {
            if (currentState == null || row < 0 || column < 0)
            {
                return string.Empty;
            }

            if (!(currentState.Snapshot["board"] is JArray board) || row >= board.Count)
            {
                return string.Empty;
            }

            if (!(board[row] is JArray boardRow) || column >= boardRow.Count)
            {
                return string.Empty;
            }

            return boardRow[column].Value<string>() ?? string.Empty;
        }

        public int GetInventoryCountForAutomation(string player, string gemId)
        {
            if (currentState == null)
            {
                return 0;
            }

            return ((JObject)((JObject)currentState.Snapshot["inventories"])[player]).Value<int>(gemId);
        }

        public bool ApplyFixtureEventsForAutomation(int targetRevision, out string error)
        {
            return SetReplayReviewRevisionForAutomation(targetRevision, out error);
        }

        public void SetAutomationViewport(int width, int height)
        {
            automationViewportWidth = Math.Max(1, width);
            automationViewportHeight = Math.Max(1, height);
            BuildCamera();
            var camera = Camera.main;
            if (camera != null)
            {
                camera.aspect = AutomationAspect;
            }
        }

        public void SetPreviewBackdropCaptureForAutomation(bool enabled)
        {
            previewBackdropCaptureEnabled = enabled;
        }

        public void LoadMainMenuForAutomation()
        {
            EnsureInputController();
            BuildCamera();
            BuildStatusText();
            LoadSettings();
            catalog = new CatalogLoader().LoadDefault();
            activeReplay = null;
            liveRecordedReplay = null;
            activeRulesInit = new JObject();
            currentState = null;
            nextFixtureEventIndex = 0;
            selectedGemCoords.Clear();
            previewContext = null;
            hoverContext = null;
            previewInteractionLayoutSticky = false;
            ClearPreviewBackgroundTexture();
            settingsOpen = false;
            settingsSurfaceDropdownOpen = false;
            rulebookOpen = false;
            errorBanner = string.Empty;
            automationInteractiveReplayMode = false;
            isMainMenu = true;
            RenderState();
            SetStatus("Unity app shell ready.");
        }

        public bool RunSemanticActionForAutomation(string action, JObject payload, out string error)
        {
            error = string.Empty;
            payload = payload ?? new JObject();
            lastAutomationDriver = "semantic";
            lastAutomationDetail = string.Empty;
            if (
                action != "start_local_game"
                && action != "start_roguelike_game"
                && action != "load_replay_fixture"
                && action != "choose_mode"
                && action != "force_royal_selection"
            )
            {
                automationInteractiveReplayMode = true;
            }

            switch (action)
            {
                case "start_local_game":
                    if (payload["rawText"] != null || payload.Value<bool?>("fixture") == true)
                    {
                        LoadFixtureForRuntime(DefaultFixtureFileName);
                        lastAutomationDriver = "setup-load-fixture";
                        lastAutomationDetail = "Loaded the local PvP replay fixture into the Unity scene.";
                        return true;
                    }

                    var seed = payload.Value<string>("seed") ?? "unity-localdev";
                    if (!StartLocalGameForRuntime(seed, out error))
                    {
                        lastAutomationDriver = "rules-engine-start-rejected";
                        lastAutomationDetail = error;
                        return false;
                    }

                    lastAutomationDriver = "setup-live-rules-engine";
                    lastAutomationDetail = "Started Local PvP through the TypeScript rules-engine bridge.";
                    return true;
                case "start_roguelike_game":
                    var roguelikeSeed = payload.Value<string>("seed") ?? "unity-localdev-roguelike";
                    if (!StartLocalGameForRuntime(roguelikeSeed, out error, true))
                    {
                        lastAutomationDriver = "rules-engine-start-rejected";
                        lastAutomationDetail = error;
                        return false;
                    }

                    lastAutomationDriver = "setup-live-rules-engine";
                    lastAutomationDetail = "Started Roguelike Local PvP draft through the TypeScript rules-engine bridge.";
                    return true;
                case "load_replay_fixture":
                    LoadFixtureForRuntime(DefaultFixtureFileName);
                    lastAutomationDriver = "setup-load-fixture";
                    lastAutomationDetail = "Loaded the local PvP replay fixture into the Unity scene.";
                    if (payload.Value<int?>("revision") is int revision)
                    {
                        return ApplyFixtureEventsForAutomation(revision, out error);
                    }

                    return true;
                case "choose_mode":
                    isMainMenu = true;
                    settingsOpen = false;
                    settingsSurfaceDropdownOpen = false;
                    rulebookOpen = false;
                    previewContext = null;
                    hoverContext = null;
                    previewInteractionLayoutSticky = false;
                    ClearPreviewBackgroundTexture();
                    errorBanner = string.Empty;
                    RenderState();
                    SetStatus("Mode selected: " + (payload.Value<string>("mode") ?? "classic"));
                    lastAutomationDriver = "setup-route";
                    lastAutomationDetail = "Prepared mode selection state without mutating gameplay.";
                    return true;
                case "choose_boon":
                    return ClickVisibleBuffForAutomation(payload, out error);
                case "reroll_draft_pool":
                    var requestedDraftLevel = payload.Value<int?>("level");
                    return ClickVisibleTargetForAutomation(
                        target =>
                            target.Kind == "ActionButton"
                            && target.EventType == "reroll-draft"
                            && (!requestedDraftLevel.HasValue || target.Level == requestedDraftLevel.Value),
                        requestedDraftLevel.HasValue
                            ? "draft reroll level " + requestedDraftLevel.Value
                            : "draft reroll",
                        out error
                    );
                case "peek_deck":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.EventType == "peek-deck",
                        "deck peek",
                        out error
                    );
                case "close_modal":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.EventType == "close-modal",
                        "modal close",
                        out error
                    );
                case "hover_boon":
                    return HoverVisibleBuffForAutomation(payload, out error);
                case "click_chrome_rulebook":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.EventType == "open_rulebook",
                        "rulebook control",
                        out error
                    );
                case "close_rulebook":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.SemanticKey == "rulebook.close",
                        "rulebook close",
                        out error
                    );
                case "rulebook_next":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.EventType == "rulebook_next",
                        "rulebook next",
                        out error
                    );
                case "rulebook_prev":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.EventType == "rulebook_prev",
                        "rulebook previous",
                        out error
                    );
                case "click_chrome_restart":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.EventType == "restart_local_pvp",
                        "restart control",
                        out error
                    );
                case "hover_chrome_control":
                    return HoverChromeControlForAutomation(payload, out error);
                case "click_market_card":
                    return ClickVisibleMarketCardForAutomation(payload, out error);
                case "click_market_deck":
                    return ClickVisibleMarketDeckForAutomation(payload, out error);
                case "hover_market_card":
                    return HoverMarketCardForAutomation(payload, out error);
                case "hover_market_deck":
                    return HoverMarketDeckForAutomation(payload, out error);
                case "click_preview_blank":
                    return ClickPreviewBlankForAutomation(payload, out error);
                case "buy_card":
                    return RunPreviewAction("buy_card", payload, out error);
                case "reserve_card":
                    return RunPreviewAction("reserve_card", payload, out error);
                case "click_player_reserved":
                    return ClickVisibleTargetForAutomation(
                        target =>
                            target.Kind == "ReservedCard"
                            && target.Index == (payload.Value<int?>("index") ?? 0),
                        "reserved card " + (payload.Value<int?>("index") ?? 0),
                        out error
                    );
                case "hover_player_reserved":
                    return HoverPlayerReservedForAutomation(payload, out error);
                case "confirm_preview_action":
                    var requestedPreviewActionId = payload.Value<string>("actionId") ?? "buy";
                    var actionId = "preview-buy";
                    if (requestedPreviewActionId == "reserve")
                    {
                        actionId = "preview-reserve";
                    }
                    else if (requestedPreviewActionId == "discard")
                    {
                        actionId = "preview-discard";
                    }
                    var actionSemanticKey = PreviewActionSemanticKey(actionId);
                    return ClickVisibleTargetForAutomation(
                        target =>
                            target.Kind == "ActionButton"
                            && target.EventType == actionId
                            && (
                                string.IsNullOrEmpty(actionSemanticKey)
                                || target.SemanticKey == actionSemanticKey
                            ),
                        actionId,
                        out error
                    );
                case "discard_reserved":
                    return RunPreviewAction("discard", payload, out error);
                case "select_joker_color":
                case "select_card_color":
                    var bonusColor = payload.Value<string>("color") ?? payload.Value<string>("gemId") ?? "red";
                    return ClickVisibleTargetForAutomation(
                        target =>
                            target.Kind == "BonusColor"
                            && target.EventType == "select-card-color"
                            && target.GemId == bonusColor,
                        "bonus color " + bonusColor,
                        out error
                    );
                case "click_board_cell":
                    return ClickBoardCellForAutomation(payload, out error);
                case "resolve_pending_reserve_gold":
                case "use_privilege":
                    return ClickBoardCellForAutomation(payload, out error);
                case "hover_board_cell":
                    return HoverBoardCellForAutomation(payload, out error);
                case "confirm_gem_selection":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.EventType == "confirm-gems",
                        "gem selection confirm",
                        out error
                    );
                case "cancel_gem_selection":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.EventType == "cancel-gems",
                        "gem selection cancel",
                        out error
                    );
                case "take_bonus_gem":
                    return ClickFollowUpGemForAutomation("take_bonus_gem", payload, out error);
                case "steal_gem":
                    return ClickInventoryGemForAutomation("steal_gem", payload, out error);
                case "discard_gem":
                    return ClickInventoryGemForAutomation("discard_gem", payload, out error);
                case "hover_player_gem":
                    return HoverPlayerGemForAutomation(payload, out error);
                case "activate_privilege":
                    return ClickVisibleTargetForAutomation(
                        target =>
                            target.Kind == "ActionButton"
                            && target.EventType == "activate-privilege",
                        "privilege activation",
                        out error
                    );
                case "replenish":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "ActionButton" && target.EventType == "replenish",
                        "replenish action",
                        out error
                    );
                case "end_turn":
                    return RunEndTurnAction(out error);
                case "force_royal_selection":
                    SetStatus("Royal selection requested.");
                    return true;
                case "choose_royal":
                    return ChooseRoyal(
                        payload.Value<int?>("index") ?? 0,
                        payload.Value<string>("royalId"),
                        out error
                    );
                case "open_settings":
                    return ClickSettingsForAutomation(out error);
                case "change_setting":
                    return ClickSettingForAutomation(payload, out error);
                case "settings_save":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "SettingsControl" && target.EventType == "settings-save",
                        "settings save",
                        out error
                    );
                case "settings_load":
                    return ClickVisibleTargetForAutomation(
                        target => target.Kind == "SettingsControl" && target.EventType == "settings-load",
                        "settings load",
                        out error
                    );
                case "close_settings":
                    settingsOpen = false;
                    settingsSurfaceDropdownOpen = false;
                    hoverContext = null;
                    RenderState();
                    SetStatus("Settings closed.");
                    lastAutomationDriver = "unity-hit-target";
                    lastAutomationDetail = "Closed settings through semantic outside-click equivalent.";
                    return true;
                case "invalid_action":
                    errorBanner = "Invalid semantic action";
                    RenderState();
                    SetStatus("Invalid semantic action rejected.");
                    lastAutomationDriver = "rejected-intent";
                    lastAutomationDetail = "Rejected invalid semantic intent without mutating shared state.";
                    return true;
                default:
                    error = "Unsupported semantic action: " + action;
                    errorBanner = error;
                    RenderState();
                    SetStatus(error);
                    return false;
            }
        }

        public bool RunLiveRulesCommandForAutomation(
            string commandType,
            JObject payload,
            string actorOverride,
            out string error
        )
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No live game is active.";
                lastAutomationDriver = "live-rules-engine-command-rejected";
                lastAutomationDetail = error;
                return false;
            }

            if (activeReplay != null)
            {
                error = "Automation live rules commands are not available during replay review.";
                lastAutomationDriver = "live-rules-engine-command-rejected";
                lastAutomationDetail = error;
                return false;
            }

            if (activeRulesInit == null || activeRulesInit.Count == 0)
            {
                error = "Live rules engine session is not available.";
                lastAutomationDriver = "live-rules-engine-command-rejected";
                lastAutomationDetail = error;
                return false;
            }

            lastAutomationDriver = "live-rules-engine-command";
            lastAutomationDetail = commandType;
            var ok = ApplyLiveRulesCommand(commandType, payload ?? new JObject(), actorOverride);
            if (ok)
            {
                lastAutomationDetail = "Applied live rules command " + commandType + ".";
                return true;
            }

            error = string.IsNullOrEmpty(errorBanner)
                ? "Live rules command rejected."
                : errorBanner;
            lastAutomationDriver = "live-rules-engine-command-rejected";
            lastAutomationDetail = error;
            return false;
        }

        public JObject BuildAutomationStateSnapshot(int viewportWidth, int viewportHeight)
        {
            var snapshot = currentState == null ? BuildShellSnapshot() : (JObject)currentState.Snapshot.DeepClone();
            var state = new JObject
            {
                ["source"] = "unity",
                ["revision"] = nextFixtureEventIndex,
                ["totalEvents"] = ReplayEventsTotal,
                ["winner"] = Winner,
                ["statusText"] = statusText == null ? string.Empty : statusText.text,
                ["guideText"] = guideText == null ? string.Empty : guideText.text,
                ["viewport"] = new JObject
                {
                    ["width"] = viewportWidth,
                    ["height"] = viewportHeight,
                },
                ["snapshot"] = snapshot,
                ["visibleTargets"] = BuildVisibleTargetSnapshot(viewportWidth, viewportHeight),
                ["typography"] = BuildTypographySnapshot(),
                ["settings"] = BuildSettingsSnapshot(),
                ["visualContracts"] = BuildVisualContractSnapshot(viewportWidth, viewportHeight),
                ["replay"] = BuildReplaySnapshot(),
                ["recovery"] = BuildRecoverySnapshot(),
                ["gemSelection"] = BuildGemSelectionSnapshot(),
                ["preview"] = previewContext == null
                    ? null
                    : new JObject
                    {
                        ["source"] = previewContext.Source,
                        ["level"] = previewContext.Level,
                        ["index"] = previewContext.Index,
                        ["instanceId"] = previewContext.InstanceId,
                        ["player"] = previewContext.Player,
                        ["color"] = previewContext.Color,
                        ["cardCount"] = previewContext.InstanceIds == null ? 0 : previewContext.InstanceIds.Count,
                        ["instanceIds"] = previewContext.InstanceIds == null ? new JArray() : new JArray(previewContext.InstanceIds),
                    },
                ["rulebook"] = BuildRulebookSnapshot(),
                ["hover"] = BuildHoverSnapshot(),
                ["errorBanner"] = string.IsNullOrEmpty(errorBanner) ? null : errorBanner,
            };

            state["phase"] = snapshot.Value<string>("phase");
            state["turn"] = snapshot.Value<string>("turn");
            state["mode"] = snapshot.Value<string>("mode");

            return state;
        }

        private JObject BuildRulebookSnapshot()
        {
            var locale = RulebookLocale();
            var clampedPage = Mathf.Clamp(rulebookPage, 0, Math.Max(0, RulebookPages.Length - 1));
            var page = RulebookPages[clampedPage];
            var sections = new JArray();
            foreach (var section in page.Sections)
            {
                var items = new JArray();
                foreach (var item in section.Items)
                {
                    items.Add(item.Text(locale));
                }

                sections.Add(
                    new JObject
                    {
                        ["type"] = section.Type,
                        ["title"] = section.Title.Text(locale),
                        ["items"] = items,
                    }
                );
            }

            return new JObject
            {
                ["open"] = rulebookOpen,
                ["page"] = clampedPage,
                ["pageCount"] = RulebookPages.Length,
                ["locale"] = locale,
                ["sourceOfTruth"] = RulebookSourceOfTruth,
                ["rendererSource"] = "packages/ui/src/components/Rulebook.tsx",
                ["title"] = page.Title.Text(locale),
                ["summary"] = page.Summary.Text(locale),
                ["pageTitlesEn"] = new JArray(RulebookPages.Select(entry => entry.Title.En)),
                ["pageTitlesZh"] = new JArray(RulebookPages.Select(entry => entry.Title.Zh)),
                ["sections"] = sections,
            };
        }

        private JObject BuildReplaySnapshot()
        {
            var currentStateHash = currentState == null ? null : new ReplayStateHasher().Hash(currentState);
            return new JObject
            {
                ["loaded"] = activeReplay != null,
                ["revision"] = nextFixtureEventIndex,
                ["totalEvents"] = ReplayEventsTotal,
                ["canUndo"] = activeReplay != null && nextFixtureEventIndex > 0,
                ["canRedo"] = activeReplay != null && nextFixtureEventIndex < ReplayEventsTotal,
                ["schemaVersion"] = activeReplay == null ? null : activeReplay.SchemaVersion,
                ["summaryFinalStateHash"] = activeReplay == null ? null : activeReplay.Summary?.FinalStateHash,
                ["currentStateHash"] = currentStateHash,
                ["liveRecording"] = liveRecordedReplay == null
                    ? null
                    : new JObject
                    {
                        ["recording"] = true,
                        ["revision"] = liveRecordedReplay.ReplayRevision,
                        ["recordedEvents"] = liveRecordedReplay.Events.Count,
                        ["canExport"] = liveRecordedReplay.Init != null,
                        ["summaryFinalStateHash"] = liveRecordedReplay.Summary?.FinalStateHash,
                        ["winner"] = liveRecordedReplay.Summary?.Winner,
                    },
                ["persistence"] = new JObject
                {
                    ["status"] = replayPersistenceStatus,
                    ["path"] = string.IsNullOrEmpty(replayPersistencePath) ? null : replayPersistencePath,
                    ["error"] = string.IsNullOrEmpty(replayPersistenceError) ? null : replayPersistenceError,
                },
            };
        }

        private JObject BuildRecoverySnapshot()
        {
            var currentStateHash = currentState == null ? null : new ReplayStateHasher().Hash(currentState);
            return new JObject
            {
                ["status"] = recoveryPersistenceStatus,
                ["error"] = string.IsNullOrEmpty(recoveryPersistenceError) ? null : recoveryPersistenceError,
                ["kind"] = currentState == null
                    ? null
                    : activeReplay == null && activeRulesInit.Count > 0
                        ? "live-rules-engine"
                        : "replay-review",
                ["availableForCurrentState"] = currentState != null && activeReplay == null && activeRulesInit.Count > 0,
                ["revision"] = currentState == null ? 0 : nextFixtureEventIndex,
                ["currentStateHash"] = currentStateHash,
            };
        }

        private JObject BuildSettingsSnapshot()
        {
            return new JObject
            {
                ["locale"] = settingsLocale,
                ["theme"] = settingsTheme,
                ["surfaceTheme"] = settingsSurfaceTheme,
                ["soundEnabled"] = settingsSoundEnabled,
                ["lanShowOpponentPlayerZoneCards"] = settingsLanShowOpponentPlayerZoneCards,
                ["lanShowOpponentGems"] = settingsLanShowOpponentGems,
                ["panelOpen"] = settingsOpen,
                ["surfaceDropdownOpen"] = settingsSurfaceDropdownOpen,
                ["persistence"] = new JObject
                {
                    ["status"] = settingsPersistenceStatus,
                    ["path"] = string.IsNullOrEmpty(settingsPersistencePath) ? null : settingsPersistencePath,
                    ["error"] = string.IsNullOrEmpty(settingsPersistenceError) ? null : settingsPersistenceError,
                },
            };
        }

        private JObject BuildVisualContractSnapshot(int viewportWidth, int viewportHeight)
        {
            return new JObject
            {
                ["settingsMenu"] = BuildSettingsMenuVisualContract(viewportWidth, viewportHeight),
            };
        }

        private JObject BuildSettingsMenuVisualContract(int viewportWidth, int viewportHeight)
        {
            var panel = SettingsPanelRect();
            var rowHeightPx = ScaleReferenceY(SettingsRowHeight, viewportHeight);
            var rowFontPx = ScreenFontPx(SettingsRowFontSize, viewportHeight);
            var titleFontPx = ScreenFontPx(SettingsTitleFontSize, viewportHeight);
            var sectionLabelFontPx = ScreenFontPx(SettingsSectionLabelFontSize, viewportHeight);
            var localeFontPx = ScreenFontPx(SettingsLocaleFontSize, viewportHeight);
            var iconFontPx = ScreenFontPx(SettingsIconFontSize, viewportHeight);
            var rowRatio = rowHeightPx <= 0f ? 0f : rowFontPx / rowHeightPx;
            var electronRowRatio = ElectronSettingsRowFontPx / ElectronSettingsRowHeight;
            return new JObject
            {
                ["open"] = settingsOpen,
                ["sourceOfTruth"] = "apps/desktop/src/app/chrome/AppChrome.tsx settings menu",
                ["electronReference"] = new JObject
                {
                    ["menuWidthCssPx"] = ElectronSettingsMenuCssWidth,
                    ["menuCssScale"] = ElectronSettingsCssScale,
                    ["shellVisualScale"] = ElectronShellVisualScale,
                    ["finalScale"] = ElectronSettingsScale,
                    ["menuWidthPx"] = ElectronSettingsMenuWidth,
                    ["menuHeightPx"] = ElectronSettingsMenuHeight,
                    ["contentInsetPx"] = ElectronSettingsContentInset,
                    ["titleFontPx"] = ElectronSettingsTitleFontPx,
                    ["sectionLabelFontPx"] = ElectronSettingsSectionLabelFontPx,
                    ["localeFontPx"] = ElectronSettingsLocaleFontPx,
                    ["rowFontPx"] = ElectronSettingsRowFontPx,
                    ["rowHeightPx"] = ElectronSettingsRowHeight,
                    ["rowGapPx"] = ElectronSettingsRowGap,
                    ["rowFontToHeightRatio"] = Math.Round(electronRowRatio, 4),
                },
                ["unityContract"] = new JObject
                {
                    ["panelRect"] = BuildReferenceRectSnapshot(
                        panel,
                        viewportWidth,
                        viewportHeight
                    ),
                    ["controlRect"] = BuildReferenceRectSnapshot(
                        new Rect(SettingsControlX, SettingsRowStartY, SettingsControlWidth, SettingsRowHeight),
                        viewportWidth,
                        viewportHeight
                    ),
                    ["titleFontPx"] = Math.Round(titleFontPx, 2),
                    ["sectionLabelFontPx"] = Math.Round(sectionLabelFontPx, 2),
                    ["localeFontPx"] = Math.Round(localeFontPx, 2),
                    ["rowFontPx"] = Math.Round(rowFontPx, 2),
                    ["iconFontPx"] = Math.Round(iconFontPx, 2),
                    ["rowHeightPx"] = Math.Round(rowHeightPx, 2),
                    ["rowGapPx"] = Math.Round(ScaleReferenceY(SettingsRowGap - SettingsRowHeight, viewportHeight), 2),
                    ["rowFontToHeightRatio"] = Math.Round(rowRatio, 4),
                    ["surfaceDropdownExpandsPanel"] = false,
                },
                ["thresholds"] = new JObject
                {
                    ["maxPanelWidthDeltaPx"] = 1.0,
                    ["maxPanelHeightDeltaPx"] = 2.0,
                    ["maxRowFontDeltaPx"] = 1.0,
                    ["maxRowHeightDeltaPx"] = 1.0,
                    ["maxRowRatioDelta"] = 0.02,
                },
                ["ok"] =
                    Math.Abs(ScaleReferenceX(SettingsPanelWidth, viewportWidth) - ScaleReferenceX(ElectronSettingsMenuWidth, viewportWidth)) <= 1f
                    && Math.Abs(rowFontPx - ScaleReferenceY(ElectronSettingsRowFontPx, viewportHeight)) <= 1f
                    && Math.Abs(rowHeightPx - ScaleReferenceY(ElectronSettingsRowHeight, viewportHeight)) <= 1f
                    && Math.Abs(rowRatio - electronRowRatio) <= 0.02f,
            };
        }

        private JObject BuildGemSelectionSnapshot()
        {
            return new JObject
            {
                ["count"] = selectedGemCoords.Count,
                ["limit"] = MaxTakeGemsSelectionCount,
                ["canConfirm"] = selectedGemCoords.Count > 0 && ValidateGemSelection(selectedGemCoords, true, out _),
                ["coords"] = new JArray(
                    selectedGemCoords.Select(coord => new JObject { ["r"] = coord.x, ["c"] = coord.y })
                ),
            };
        }

        private JObject BuildHoverSnapshot()
        {
            if (hoverContext == null)
            {
                return null;
            }

            return new JObject
            {
                ["semanticKey"] = hoverContext.SemanticKey,
                ["kind"] = hoverContext.Kind,
                ["eventType"] = hoverContext.EventType,
                ["row"] = hoverContext.Row,
                ["column"] = hoverContext.Column,
                ["level"] = hoverContext.Level,
                ["index"] = hoverContext.Index,
                ["instanceId"] = string.IsNullOrEmpty(hoverContext.InstanceId) ? null : hoverContext.InstanceId,
                ["royalId"] = string.IsNullOrEmpty(hoverContext.RoyalId) ? null : hoverContext.RoyalId,
                ["gemId"] = string.IsNullOrEmpty(hoverContext.GemId) ? null : hoverContext.GemId,
                ["buffId"] = string.IsNullOrEmpty(hoverContext.BuffId) ? null : hoverContext.BuffId,
                ["cursor"] = "pointer",
                ["visualState"] = "hover",
            };
        }

        private JArray BuildTypographySnapshot()
        {
            var samples = new JArray();
            foreach (var mesh in FindObjectsByType<TMP_Text>(FindObjectsSortMode.None))
            {
                if (mesh == null || string.IsNullOrEmpty(mesh.name) || !IsTypographyEvidenceText(mesh.name))
                {
                    continue;
                }

                var evidence = mesh.GetComponent<TextEvidence>();
                samples.Add(
                    new JObject
                    {
                        ["key"] = mesh.name,
                        ["text"] = mesh.text,
                        ["font"] = mesh.font == null ? null : mesh.font.name,
                        ["fontSize"] = Math.Round(mesh.fontSize, 3),
                        ["characterSize"] = Math.Round(evidence == null ? 0f : evidence.CharacterSize, 5),
                        ["fontStyle"] = evidence == null ? mesh.fontStyle.ToString() : evidence.RequestedStyle.ToString(),
                        ["alignment"] = evidence == null ? AlignmentNameForText(mesh.alignment) : AlignmentNameForAnchor(evidence.Anchor),
                        ["anchor"] = evidence == null ? mesh.alignment.ToString() : evidence.Anchor.ToString(),
                        ["lineSpacing"] = Math.Round(evidence == null ? 1.12f : evidence.LineSpacing, 3),
                    }
                );
            }

            return samples;
        }

        private static bool IsTypographyEvidenceText(string name)
        {
            return name.StartsWith("Draft Title ", StringComparison.Ordinal)
                || name.StartsWith("Draft Description ", StringComparison.Ordinal)
                || name.StartsWith("Draft Footer ", StringComparison.Ordinal)
                || name.StartsWith("Market Label", StringComparison.Ordinal)
                || name.StartsWith("Royals Label", StringComparison.Ordinal)
                || name.StartsWith("Privilege Scroll Placeholder", StringComparison.Ordinal)
                || name.StartsWith("Deck Label ", StringComparison.Ordinal)
                || name.Contains(" Resource Count ")
                || name.StartsWith("Preview Action Text ", StringComparison.Ordinal)
                || name.StartsWith("Action Text ", StringComparison.Ordinal)
                || name.StartsWith("Settings ", StringComparison.Ordinal);
        }

        public string DumpAutomationStateJson(int viewportWidth, int viewportHeight)
        {
            return BuildAutomationStateSnapshot(viewportWidth, viewportHeight).ToString(Formatting.Indented);
        }

        public bool ImportReplayJsonForAutomation(string replayJson, out string error)
        {
            error = string.Empty;
            try
            {
                if (string.IsNullOrWhiteSpace(replayJson))
                {
                    error = "Replay JSON is empty.";
                    return RejectSemanticAction(error);
                }

                var replay = JsonConvert.DeserializeObject<ReplayVNext>(replayJson);
                LoadReplayForReview(replay);
                RenderState();
                replayPersistenceStatus = "loaded-json";
                replayPersistencePath = string.Empty;
                replayPersistenceError = string.Empty;
                SetStatus("Replay imported for review.");
                return true;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                replayPersistenceStatus = "error";
                replayPersistenceError = error;
                return RejectSemanticAction("Replay import failed: " + error);
            }
        }

        public bool ImportReplayFromPathForAutomation(string path, out string error)
        {
            error = string.Empty;
            try
            {
                if (string.IsNullOrWhiteSpace(path))
                {
                    error = "Replay import path is empty.";
                    return RejectSemanticAction(error);
                }

                var imported = ImportReplayJsonForAutomation(File.ReadAllText(path), out error);
                if (imported)
                {
                    replayPersistenceStatus = "loaded";
                    replayPersistencePath = path;
                    replayPersistenceError = string.Empty;
                }

                return imported;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                replayPersistenceStatus = "error";
                replayPersistencePath = path ?? string.Empty;
                replayPersistenceError = error;
                return RejectSemanticAction("Replay import failed: " + error);
            }
        }

        public bool ExportReplayJsonForAutomation(out string replayJson, out string error)
        {
            replayJson = string.Empty;
            error = string.Empty;
            var exportReplay = activeReplay ?? liveRecordedReplay;
            if (exportReplay == null)
            {
                error = "No replay is loaded for export.";
                return RejectSemanticAction(error);
            }

            replayJson = JsonConvert.SerializeObject(exportReplay, Formatting.Indented);
            SetStatus("Replay exported for review.");
            return true;
        }

        public bool ExportReplayToPathForAutomation(string path, out string error)
        {
            error = string.Empty;
            if (!ExportReplayJsonForAutomation(out var replayJson, out error))
            {
                return false;
            }

            try
            {
                var directory = Path.GetDirectoryName(path);
                if (!string.IsNullOrEmpty(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                File.WriteAllText(path, replayJson);
                replayPersistenceStatus = "saved";
                replayPersistencePath = path;
                replayPersistenceError = string.Empty;
                SetStatus("Replay exported for review.");
                return true;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                replayPersistenceStatus = "error";
                replayPersistencePath = path ?? string.Empty;
                replayPersistenceError = error;
                return RejectSemanticAction("Replay export failed: " + error);
            }
        }

        public string ResolveLocalDevReplayPathForAutomation()
        {
            return ResolveLocalDevReplayPath();
        }

        public bool ImportLocalDevReplayForAutomation(out string error)
        {
            return ImportReplayFromPathForAutomation(ResolveLocalDevReplayPath(), out error);
        }

        public bool ExportLocalDevReplayForAutomation(out string error)
        {
            return ExportReplayToPathForAutomation(ResolveLocalDevReplayPath(), out error);
        }

        public bool SetReplayReviewRevisionForAutomation(int targetRevision, out string error)
        {
            error = string.Empty;
            if (activeReplay == null)
            {
                error = "No replay is loaded for review.";
                return RejectSemanticAction(error);
            }

            try
            {
                var clampedRevision = Math.Max(0, Math.Min(targetRevision, activeReplay.Events.Count));
                currentState = ReplayBootstrapper.Bootstrap(activeReplay);
                nextFixtureEventIndex = 0;
                selectedGemCoords.Clear();
                previewContext = null;
                hoverContext = null;
                previewInteractionLayoutSticky = false;
                settingsOpen = false;
                settingsSurfaceDropdownOpen = false;
                rulebookOpen = false;
                errorBanner = string.Empty;
                isMainMenu = false;

                while (nextFixtureEventIndex < clampedRevision)
                {
                    var result = ApplyReplayEvent(activeReplay.Events[nextFixtureEventIndex]);
                    if (!result.Ok)
                    {
                        error = result.Error;
                        return RejectSemanticAction(error);
                    }
                }

                ClearPreviewBackgroundTexture();
                RenderState();
                SetStatus("Replay review revision " + nextFixtureEventIndex + " / " + ReplayEventsTotal + ".");
                return true;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return RejectSemanticAction("Replay review failed: " + error);
            }
        }

        public bool LoadRecoveredGameForAutomation(out string error)
        {
            return TryLoadRecoveredGame(out error, true);
        }

        public bool ClickViewportPointForAutomation(float viewportX, float viewportY, int viewportWidth, int viewportHeight, out string error)
        {
            error = string.Empty;
            var camera = Camera.main;
            if (camera == null)
            {
                error = "Unity scene has no camera for click dispatch.";
                return RejectSemanticAction(error);
            }

            var width = Math.Max(1, viewportWidth);
            var height = Math.Max(1, viewportHeight);
            camera.aspect = (float)width / height;
            var world = camera.ViewportToWorldPoint(new Vector3(viewportX / width, 1f - viewportY / height, 0f));
            var target = GemDuelInputController.FindVisibleTargetAtWorld(world);
            if (target == null)
            {
                error = "No clickable Unity target at viewport point " + viewportX + "," + viewportY + ".";
                return RejectSemanticAction(error);
            }

            var clickedDescription = DescribeTarget(target);
            HandleVisibleTarget(target);
            lastAutomationDriver = "unity-hit-target";
            lastAutomationDetail =
                "Clicked " + clickedDescription + " through GemDuelInputController hit testing.";
            return true;
        }

        public bool SetHoveredTarget(GemDuelViewTarget target)
        {
            var nextHover = target == null || !target.Clickable || !IsStableHoverTarget(target)
                ? null
                : HoverContext.FromTarget(target);
            if (HoverContext.SameTarget(hoverContext, nextHover))
            {
                return nextHover != null;
            }

            hoverContext = nextHover;
            RenderState();
            return nextHover != null;
        }

        public bool IsStableHoverTarget(GemDuelViewTarget target)
        {
            if (target == null || !target.Clickable)
            {
                return false;
            }

            switch (target.Kind)
            {
                case "Buff":
                case "MarketCard":
                case "MarketDeck":
                case "Royal":
                case "Gem":
                case "ReservedCard":
                case "InventoryGem":
                case "BonusColor":
                case "SettingsControl":
                case "Mode":
                case "TableauStack":
                    return true;
                case "ActionButton":
                    return IsStableActionHoverTarget(target.EventType);
                default:
                    return false;
            }
        }

        public bool IsTakeGemsBoardGemTarget(GemDuelViewTarget target)
        {
            if (target == null || target.Kind != "Gem" || !target.Clickable)
            {
                return false;
            }

            var gemId = GetCurrentBoardGemId(target.Row, target.Column);
            if (string.IsNullOrEmpty(gemId))
            {
                gemId = target.GemId;
            }

            if (gemId == "empty" || gemId == "gold")
            {
                return false;
            }

            if (activeReplay == null)
            {
                return currentState != null && currentState.Phase == "IDLE";
            }

            var next = GetNextEvent();
            return next != null
                && next.Value<string>("type") == "take_gems"
                && target.GemId != "empty"
                && target.GemId != "gold";
        }

        public bool TryHandleTakeGemsDragTarget(GemDuelViewTarget target, out string detail)
        {
            detail = string.Empty;
            if (!IsTakeGemsBoardGemTarget(target))
            {
                detail = "Board gem drag ignored non-selectable target.";
                return false;
            }

            var limit = activeReplay == null
                ? MaxTakeGemsSelectionCount
                : GetTakeGemsSelectionLimit(GetNextEvent());
            if (!TryFillSkippedDragMidpoint(target, limit, out var midpointDetail))
            {
                detail = midpointDetail;
                RenderState();
                return false;
            }

            var targetGemId = GetCurrentBoardGemId(target.Row, target.Column);
            if (string.IsNullOrEmpty(targetGemId))
            {
                targetGemId = target.GemId;
            }

            var ok = SelectTakeGemsCoord(target.Row, target.Column, targetGemId, limit, true, out var targetDetail);
            detail = string.IsNullOrEmpty(midpointDetail)
                ? targetDetail
                : midpointDetail + " " + targetDetail;
            return ok;
        }

        public string[] GetSelectedTakeGemDragKeysForInput()
        {
            return selectedGemCoords.Select(coord => coord.x + ":" + coord.y).ToArray();
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        public static void EnsureSceneController()
        {
            if (FindAnyObjectByType<GemDuelGameController>() != null)
            {
                return;
            }

            var root = new GameObject("GemDuel Game");
            root.AddComponent<GemDuelGameController>();
            root.AddComponent<GemDuelInputController>();
        }

        private void EnsureInputController()
        {
            if (FindAnyObjectByType<GemDuelInputController>() != null)
            {
                return;
            }

            gameObject.AddComponent<GemDuelInputController>();
        }

        private async void Start()
        {
            EnsureInputController();
            await platformServices.Init();
            LoadSettings();
            if (!TryLoadRecoveredGame(out _, false))
            {
                LoadMainMenuForAutomation();
            }
        }

        public bool StartLocalGameForRuntime(string seed, out string error, bool useBuffs = false)
        {
            error = string.Empty;
            try
            {
                EnsureInputController();
                BuildCamera();
                BuildStatusText();
                catalog = new CatalogLoader().LoadDefault();
                var result = rulesEngine.StartLocalGame(seed, useBuffs);
                if (!result.Ok || result.State == null)
                {
                    error = string.IsNullOrEmpty(result.Error)
                        ? "Rules engine did not return a playable local PvP state."
                        : result.Error;
                    errorBanner = error;
                    RenderState();
                    SetStatus(error);
                    return false;
                }

                activeReplay = null;
                activeRulesInit = result.Init == null ? new JObject() : (JObject)result.Init.DeepClone();
                currentState = new GameState(result.State, result.ReplayRevision);
                StartLiveReplayRecording(result, seed, useBuffs);
                nextFixtureEventIndex = result.ReplayRevision;
                WarmLiveRulesEngineApplyPath();
                isMainMenu = false;
                settingsOpen = false;
                settingsSurfaceDropdownOpen = false;
                rulebookOpen = false;
                selectedGemCoords.Clear();
                previewContext = null;
                hoverContext = null;
                previewInteractionLayoutSticky = false;
                ClearPreviewBackgroundTexture();
                errorBanner = string.Empty;
                automationInteractiveReplayMode = true;
                PersistRecoverySnapshot();
                RenderState();
                SetStatus("Local PvP started through the rules engine.");
                return true;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                errorBanner = "Rules engine start failed: " + error;
                RenderState();
                SetStatus(errorBanner);
                return false;
            }
        }

        private void WarmLiveRulesEngineApplyPath()
        {
            if (currentState == null)
            {
                return;
            }

            try
            {
                rulesEngine.ApplyCommand(
                    currentState,
                    new GameRulesCommand
                    {
                        Type = "TAKE_GEMS",
                        Actor = currentState.Turn,
                        Payload = new JObject { ["coords"] = new JArray() },
                    }
                );

                if (GetBagCount() > 0)
                {
                    rulesEngine.ApplyCommand(
                        new GameState((JObject)currentState.Snapshot.DeepClone(), currentState.Revision),
                        new GameRulesCommand
                        {
                            Type = "REPLENISH",
                            Actor = currentState.Turn,
                            Payload = new JObject(),
                        }
                    );
                }
            }
            catch
            {
                // Warmup is best-effort; the first real command still reports bridge failures.
            }
        }

        public void LoadFixtureForRuntime(string fixtureFileName)
        {
            EnsureInputController();
            BuildCamera();
            BuildStatusText();
            isMainMenu = false;
            settingsOpen = false;
            previewContext = null;
            previewInteractionLayoutSticky = false;
            ClearPreviewBackgroundTexture();
            errorBanner = string.Empty;
            automationInteractiveReplayMode = false;
            LoadFixture(fixtureFileName);
            RenderState();
            SetStatus("Unity game view ready. Visible actions are wired through the replay audit runner.");
        }

        public bool PlayReplayToEndForAutomation(out string error)
        {
            error = string.Empty;
            while (activeReplay != null && nextFixtureEventIndex < activeReplay.Events.Count)
            {
                var result = ApplyReplayEvent(activeReplay.Events[nextFixtureEventIndex]);
                if (!result.Ok)
                {
                    error = result.Error;
                    return false;
                }
            }

            var complete = currentState != null && currentState.Winner == activeReplay.Summary.Winner;
            if (complete)
            {
                SetStatus("Replay local PvP complete | winner " + currentState.Winner);
            }

            return complete;
        }

        public void ApplyNextFixtureEvent()
        {
            if (activeReplay == null || currentState == null)
            {
                SetStatus("No local PvP fixture is loaded.");
                return;
            }

            if (nextFixtureEventIndex >= activeReplay.Events.Count)
            {
                SetStatus("Replay PvP complete | winner " + (currentState.Winner ?? "none"));
                return;
            }

            var replayEvent = activeReplay.Events[nextFixtureEventIndex];
            var result = ApplyReplayEvent(replayEvent);
            if (!result.Ok)
            {
                SetStatus(result.Error);
                return;
            }

            SetStatus("Debug step applied | " + DescribeEvent(replayEvent));
        }

        public void HandleVisibleTarget(GemDuelViewTarget target)
        {
            if (target == null || !target.Clickable)
            {
                return;
            }

            if (target.Kind == "Mode" && target.EventType == "start_local_game")
            {
                hoverContext = null;
                StartLocalGameForRuntime("unity-localdev", out _);
                return;
            }

            if (target.Kind == "Mode" && target.EventType == "start_roguelike_game")
            {
                hoverContext = null;
                StartLocalGameForRuntime("unity-localdev-roguelike", out _, true);
                return;
            }

            if (target.Kind == "Mode" && target.EventType == "open_online")
            {
                OpenUnavailableShellEntry("Online is not available in this Unity build.");
                return;
            }

            if (target.Kind == "Mode" && target.EventType == "open_lan")
            {
                OpenUnavailableShellEntry("LAN is not available in this Unity build.");
                return;
            }

            if (target.Kind == "Mode" && target.EventType == "open_visual_lab")
            {
                OpenUnavailableShellEntry("Visual Lab is not available in this Unity build.");
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "open_rulebook")
            {
                hoverContext = null;
                settingsOpen = false;
                settingsSurfaceDropdownOpen = false;
                rulebookOpen = true;
                rulebookPage = 0;
                previewContext = null;
                errorBanner = string.Empty;
                RenderState();
                SetStatus("Rulebook opened.");
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "restart_local_pvp")
            {
                hoverContext = null;
                LoadMainMenuForAutomation();
                SetStatus("Local PvP restarted.");
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "close_rulebook")
            {
                hoverContext = null;
                rulebookOpen = false;
                RenderState();
                SetStatus("Rulebook closed.");
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "rulebook_prev")
            {
                hoverContext = null;
                rulebookPage = target.Index >= 0
                    ? Mathf.Clamp(target.Index, 0, RulebookPages.Length - 1)
                    : Mathf.Max(0, rulebookPage - 1);
                RenderState();
                SetStatus("Rulebook page " + (rulebookPage + 1) + " / " + RulebookPages.Length + ".");
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "rulebook_next")
            {
                hoverContext = null;
                rulebookPage = target.Index >= 0
                    ? Mathf.Clamp(target.Index, 0, RulebookPages.Length - 1)
                    : Mathf.Min(RulebookPages.Length - 1, rulebookPage + 1);
                RenderState();
                SetStatus("Rulebook page " + (rulebookPage + 1) + " / " + RulebookPages.Length + ".");
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "replay_import_localdev")
            {
                hoverContext = null;
                ImportLocalDevReplayForAutomation(out _);
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "replay_export_localdev")
            {
                hoverContext = null;
                ExportLocalDevReplayForAutomation(out _);
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "open_settings")
            {
                hoverContext = null;
                settingsOpen = true;
                settingsSurfaceDropdownOpen = false;
                rulebookOpen = false;
                errorBanner = string.Empty;
                RenderState();
                SetStatus("Settings opened.");
                return;
            }

            if (target.Kind == "SettingsControl")
            {
                HandleSettingsControl(target);
                return;
            }

            if (currentState == null)
            {
                return;
            }

            automationInteractiveReplayMode = true;

            if (target.Kind == "ActionButton" && target.EventType == "replay_undo")
            {
                HandleReplayReviewControl(-1);
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "replay_redo")
            {
                HandleReplayReviewControl(1);
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "close-modal")
            {
                hoverContext = null;
                if (activeReplay == null)
                {
                    ApplyLiveRulesCommand("CLOSE_MODAL", new JObject());
                }
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "preview-close")
            {
                previewContext = null;
                hoverContext = null;
                previewInteractionLayoutSticky = true;
                ClearPreviewBackgroundTexture();
                errorBanner = string.Empty;
                RenderState();
                SetStatus("Preview closed.");
                return;
            }

            if (target.Kind == "PreviewCard")
            {
                SetStatus("Previewing card.");
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "preview-buy")
            {
                hoverContext = null;
                ConfirmPreviewAction("buy", out _);
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "preview-reserve")
            {
                hoverContext = null;
                ConfirmPreviewAction("reserve", out _);
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "preview-discard")
            {
                hoverContext = null;
                ConfirmPreviewAction("discard", out _);
                return;
            }

            if (target.Kind == "MarketCard")
            {
                hoverContext = null;
                PreviewMarketCard(target.Level, target.Index, out _);
                return;
            }

            if (target.Kind == "MarketDeck")
            {
                hoverContext = null;
                PreviewMarketDeck(target.Level, out _);
                return;
            }

            if (target.Kind == "ReservedCard")
            {
                hoverContext = null;
                PreviewReservedCard(target.Index, out _);
                return;
            }

            if (target.Kind == "TableauStack")
            {
                hoverContext = null;
                PreviewTableauStack(target.BuffId, target.GemId, out _);
                return;
            }

            var nextEvent = GetNextEvent();
            if (activeReplay == null)
            {
                HandleLiveRulesTarget(target);
                return;
            }

            if (nextEvent == null)
            {
                SetStatus("Match complete | winner " + (currentState.Winner ?? "none"));
                return;
            }

            var eventType = nextEvent.Value<string>("type") ?? string.Empty;
            if (target.Kind == "Royal" && eventType != "select_royal")
            {
                hoverContext = null;
                PreviewRoyalCard(target.RoyalId, target.Index, out _);
                return;
            }

            if (eventType == "take_gems")
            {
                HandleTakeGemsTarget(target, nextEvent);
                return;
            }

            if (eventType == "take_bonus_gem")
            {
                if (target.Kind == "Gem" && MatchesCoord((JObject)nextEvent["coord"], target.Row, target.Column))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Select the highlighted bonus gem.");
                return;
            }

            if (eventType == "reserve_card" && currentState.Phase == "RESERVE_WAITING_GEM")
            {
                if (target.Kind == "Gem" && MatchesCoord((JObject)nextEvent["goldCoord"], target.Row, target.Column))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Select the highlighted Gold gem for reserve.");
                return;
            }

            if (eventType == "select_royal")
            {
                if (target.Kind == "Royal" && target.RoyalId == nextEvent.Value<string>("royalId"))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Select the highlighted royal card.");
                return;
            }

            if (eventType == "select_buff")
            {
                if (target.Kind == "Buff" && target.BuffId == nextEvent.Value<string>("buffId"))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Select the highlighted buff.");
                return;
            }

            if (eventType == "replenish")
            {
                if (target.Kind == "ActionButton" && target.EventType == "replenish")
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }

                SetStatus("Use the visible Replenish action.");
                return;
            }

            if ((eventType == "steal_gem" || eventType == "discard_gem") && target.Kind == "InventoryGem")
            {
                if (target.EventType == eventType && target.GemId == nextEvent.Value<string>("gemId"))
                {
                    ApplyVisibleEvent(nextEvent);
                    return;
                }
            }

            SetStatus("Next action: " + DescribeEvent(nextEvent));
        }

        private void OpenUnavailableShellEntry(string message)
        {
            hoverContext = null;
            settingsOpen = false;
            settingsSurfaceDropdownOpen = false;
            rulebookOpen = false;
            previewContext = null;
            errorBanner = message;
            RenderState();
            SetStatus(message);
        }

        private void HandleSettingsControl(GemDuelViewTarget target)
        {
            hoverContext = null;
            settingsOpen = true;
            errorBanner = string.Empty;

            var status = string.Empty;
            switch (target.EventType)
            {
                case "settings-save":
                    if (ExportLocalDevReplayForAutomation(out var settingsReplayExportError))
                    {
                        settingsOpen = false;
                        settingsSurfaceDropdownOpen = false;
                        RenderState();
                        SetStatus("Replay exported for review.");
                        return;
                    }

                    RenderState();
                    SetStatus("Replay export failed: " + settingsReplayExportError);
                    return;
                case "settings-load":
                    status = "Replay load picker opened.";
                    RenderState();
                    SetStatus(status);
                    return;
                case "replay_export_localdev":
                    if (ExportLocalDevReplayForAutomation(out var exportError))
                    {
                        settingsOpen = false;
                        settingsSurfaceDropdownOpen = false;
                        RenderState();
                        SetStatus("Replay exported for review.");
                        return;
                    }

                    RenderState();
                    SetStatus("Replay export failed: " + exportError);
                    return;
                case "replay_import_localdev":
                    if (ImportLocalDevReplayForAutomation(out var importError))
                    {
                        settingsOpen = false;
                        settingsSurfaceDropdownOpen = false;
                        RenderState();
                        SetStatus("Replay imported for review.");
                        return;
                    }

                    RenderState();
                    SetStatus("Replay import failed: " + importError);
                    return;
                case "settings-locale-en":
                    settingsLocale = "en";
                    status = "Locale changed: English.";
                    break;
                case "settings-locale-zh":
                    settingsLocale = "zh";
                    status = "Locale changed: Chinese.";
                    break;
                case "settings-sound-toggle":
                    settingsSoundEnabled = !settingsSoundEnabled;
                    status = settingsSoundEnabled ? "Sound enabled." : "Sound disabled.";
                    break;
                case "settings-lan-player-zone-toggle":
                    settingsLanShowOpponentPlayerZoneCards = !settingsLanShowOpponentPlayerZoneCards;
                    status = settingsLanShowOpponentPlayerZoneCards
                        ? "LAN opponent card visibility enabled."
                        : "LAN opponent card visibility disabled.";
                    break;
                case "settings-lan-gems-toggle":
                    settingsLanShowOpponentGems = !settingsLanShowOpponentGems;
                    status = settingsLanShowOpponentGems
                        ? "LAN opponent gem visibility enabled."
                        : "LAN opponent gem visibility disabled.";
                    break;
                case "settings-surface-control":
                    settingsSurfaceDropdownOpen = !settingsSurfaceDropdownOpen;
                    status = "Surface theme menu " + (settingsSurfaceDropdownOpen ? "opened." : "closed.");
                    RenderState();
                    SetStatus(status);
                    return;
                default:
                    if (target.EventType.StartsWith("settings-surface-", StringComparison.Ordinal))
                    {
                        var selectedVariant = target.EventType.Substring("settings-surface-".Length);
                        if (IsSurfaceThemeVariant(selectedVariant))
                        {
                            settingsSurfaceTheme = selectedVariant;
                            settingsSurfaceDropdownOpen = false;
                            status = "Theme selected: " + selectedVariant + ".";
                            break;
                        }
                    }

                    errorBanner = "Unsupported settings control.";
                    RenderState();
                    SetStatus(errorBanner);
                    return;
            }

            if (!PersistSettings())
            {
                status = "Settings persistence failed: " + settingsPersistenceError;
            }

            RenderState();
            SetStatus(status);
        }

        private static bool IsSurfaceThemeVariant(string value)
        {
            return SurfaceThemeVariants.Any(variant => variant == value);
        }

        private bool LoadSettings()
        {
            try
            {
                var path = ResolveSettingsPersistencePath();
                settingsPersistencePath = path;
                if (!File.Exists(path))
                {
                    settingsPersistenceStatus = "missing";
                    settingsPersistenceError = string.Empty;
                    return false;
                }

                var payload = JObject.Parse(File.ReadAllText(path));
                var locale = payload.Value<string>("locale");
                if (locale == "en" || locale == "zh")
                {
                    settingsLocale = locale;
                }

                var surfaceTheme = payload.Value<string>("surfaceTheme");
                if (IsSurfaceThemeVariant(surfaceTheme))
                {
                    settingsSurfaceTheme = surfaceTheme;
                }

                var sound = payload["soundEnabled"];
                if (sound != null && sound.Type == JTokenType.Boolean)
                {
                    settingsSoundEnabled = sound.Value<bool>();
                }

                var lanPlayerZoneCards = payload["lanShowOpponentPlayerZoneCards"];
                if (lanPlayerZoneCards != null && lanPlayerZoneCards.Type == JTokenType.Boolean)
                {
                    settingsLanShowOpponentPlayerZoneCards = lanPlayerZoneCards.Value<bool>();
                }

                var lanGems = payload["lanShowOpponentGems"];
                if (lanGems != null && lanGems.Type == JTokenType.Boolean)
                {
                    settingsLanShowOpponentGems = lanGems.Value<bool>();
                }

                settingsSurfaceDropdownOpen = false;
                settingsPersistenceStatus = "loaded";
                settingsPersistenceError = string.Empty;
                return true;
            }
            catch (Exception ex)
            {
                settingsPersistenceStatus = "error";
                settingsPersistenceError = ex.Message;
                errorBanner = "Settings load failed.";
                return false;
            }
        }

        private void HandleReplayReviewControl(int delta)
        {
            if (activeReplay == null)
            {
                SetStatus("No replay is loaded for review.");
                return;
            }

            var targetRevision = nextFixtureEventIndex + delta;
            if (targetRevision < 0 || targetRevision > ReplayEventsTotal)
            {
                SetStatus("Replay review is already at the boundary.");
                return;
            }

            SetReplayReviewRevisionForAutomation(targetRevision, out _);
        }

        private string ResolveSettingsPersistencePath()
        {
            var directory = RepositoryPaths.ResolveFromRoot("artifacts", "unity", "settings");
            Directory.CreateDirectory(directory);
            return Path.Combine(directory, "gemduel.preferences.v1.json");
        }

        private string ResolveLocalDevReplayPath()
        {
            var directory = RepositoryPaths.ResolveFromRoot("artifacts", "unity", "replay-io");
            Directory.CreateDirectory(directory);
            return Path.Combine(directory, LocalDevReplayFileName);
        }

        private bool PersistSettings()
        {
            try
            {
                settingsPersistencePath = ResolveSettingsPersistencePath();
                var payload = new JObject
                {
                    ["locale"] = settingsLocale,
                    ["theme"] = settingsTheme,
                    ["surfaceTheme"] = settingsSurfaceTheme,
                    ["soundEnabled"] = settingsSoundEnabled,
                    ["lanShowOpponentPlayerZoneCards"] = settingsLanShowOpponentPlayerZoneCards,
                    ["lanShowOpponentGems"] = settingsLanShowOpponentGems,
                    ["updatedAt"] = DateTime.UtcNow.ToString("O"),
                    ["source"] = "unity-local-pvp",
                };
                File.WriteAllText(settingsPersistencePath, payload.ToString(Formatting.Indented));
                settingsPersistenceStatus = "saved";
                settingsPersistenceError = string.Empty;
                return true;
            }
            catch (Exception ex)
            {
                settingsPersistenceStatus = "error";
                settingsPersistenceError = ex.Message;
                errorBanner = "Settings persistence failed.";
                return false;
            }
        }

        private bool PersistRecoverySnapshot()
        {
            if (currentState == null || activeReplay != null || activeRulesInit == null || activeRulesInit.Count == 0)
            {
                recoveryPersistenceStatus = "skipped";
                recoveryPersistenceError = string.Empty;
                return false;
            }

            try
            {
                var payload = new JObject
                {
                    ["schemaVersion"] = 1,
                    ["kind"] = "live-rules-engine",
                    ["savedAt"] = DateTime.UtcNow.ToString("O"),
                    ["replayRevision"] = nextFixtureEventIndex,
                    ["state"] = (JObject)currentState.Snapshot.DeepClone(),
                    ["init"] = (JObject)activeRulesInit.DeepClone(),
                    ["stateHash"] = new ReplayStateHasher().Hash(currentState),
                    ["source"] = "unity-localdev",
                };
                if (liveRecordedReplay != null)
                {
                    payload["liveReplay"] = JObject.FromObject(liveRecordedReplay);
                }

                platformServices
                    .WriteCloudSave(
                        RecoverySaveName,
                        Encoding.UTF8.GetBytes(payload.ToString(Formatting.Indented))
                    )
                    .GetAwaiter()
                    .GetResult();
                recoveryPersistenceStatus = "saved";
                recoveryPersistenceError = string.Empty;
                return true;
            }
            catch (Exception ex)
            {
                recoveryPersistenceStatus = "error";
                recoveryPersistenceError = ex.Message;
                return false;
            }
        }

        private bool TryLoadRecoveredGame(out string error, bool surfaceErrors)
        {
            error = string.Empty;
            try
            {
                var payloadBytes = platformServices.ReadCloudSave(RecoverySaveName).GetAwaiter().GetResult();
                if (payloadBytes == null || payloadBytes.Length == 0)
                {
                    error = "No LocalDev recovery save exists.";
                    recoveryPersistenceStatus = "missing";
                    recoveryPersistenceError = string.Empty;
                    return surfaceErrors ? RejectSemanticAction(error) : false;
                }

                var payload = JObject.Parse(Encoding.UTF8.GetString(payloadBytes));
                if (payload.Value<int?>("schemaVersion") != 1)
                {
                    throw new InvalidOperationException("Unsupported recovery schema version.");
                }

                if (payload.Value<string>("kind") != "live-rules-engine")
                {
                    throw new InvalidOperationException("Unsupported recovery kind: " + payload.Value<string>("kind"));
                }

                var init = payload["init"] as JObject;
                var state = payload["state"] as JObject;
                if (init == null || init.Count == 0 || state == null)
                {
                    throw new InvalidOperationException("Recovery payload is missing bridge init or state.");
                }

                BuildCamera();
                BuildStatusText();
                catalog = new CatalogLoader().LoadDefault();
                var recoveredRevision = payload.Value<int?>("replayRevision") ?? 0;
                var recoveredState = new GameState((JObject)state.DeepClone(), recoveredRevision);
                var expectedHash = payload.Value<string>("stateHash");
                var actualHash = new ReplayStateHasher().Hash(recoveredState);
                if (!string.IsNullOrEmpty(expectedHash) && actualHash != expectedHash)
                {
                    throw new InvalidOperationException(
                        "Recovery state hash mismatch: expected " + expectedHash + ", got " + actualHash + "."
                    );
                }

                rulesEngine.RestoreSession(init);
                activeRulesInit = (JObject)init.DeepClone();
                liveRecordedReplay = payload["liveReplay"] is JObject liveReplay
                    ? JsonConvert.DeserializeObject<ReplayVNext>(liveReplay.ToString(Formatting.None))
                    : null;
                activeReplay = null;
                currentState = recoveredState;
                nextFixtureEventIndex = recoveredRevision;
                isMainMenu = false;
                settingsOpen = false;
                settingsSurfaceDropdownOpen = false;
                rulebookOpen = false;
                selectedGemCoords.Clear();
                previewContext = null;
                hoverContext = null;
                previewInteractionLayoutSticky = false;
                ClearPreviewBackgroundTexture();
                errorBanner = string.Empty;
                automationInteractiveReplayMode = true;
                recoveryPersistenceStatus = "loaded";
                recoveryPersistenceError = string.Empty;
                RenderState();
                SetStatus("Recovered LocalDev game state.");
                return true;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                recoveryPersistenceStatus = "error";
                recoveryPersistenceError = error;
                if (surfaceErrors)
                {
                    return RejectSemanticAction("Recovery load failed: " + error);
                }

                return false;
            }
        }

        private void ApplyVisibleEvent(JObject replayEvent)
        {
            hoverContext = null;
            var result = ApplyReplayEvent(replayEvent);
            if (!result.Ok)
            {
                SetStatus(result.Error);
                return;
            }

            if (nextFixtureEventIndex >= activeReplay.Events.Count)
            {
                SetStatus("Replay PvP complete | winner " + (currentState.Winner ?? "none"));
                return;
            }

            SetStatus("Applied visible action | " + DescribeEvent(replayEvent));
        }

        private void StartLiveReplayRecording(
            GameRulesResult result,
            string seed,
            bool useBuffs
        )
        {
            var init = JsonConvert.DeserializeObject<ReplayInitSnapshot>(
                result.Init.ToString(Formatting.None)
            ) ?? new ReplayInitSnapshot();
            var mode = init.Mode;
            liveRecordedReplay = new ReplayVNext
            {
                SchemaVersion = "1.0",
                ReplayRevision = 0,
                GameVersion = "unity-localdev",
                CreatedAt = DateTime.UtcNow.ToString("O"),
                Match = new ReplayMatchInfo
                {
                    Mode = string.IsNullOrEmpty(mode) ? "LOCAL_PVP" : mode,
                    Seed = seed,
                    Started = true,
                    Ended = false,
                },
                Players = new Dictionary<string, ReplayPlayer>
                {
                    ["p1"] = new ReplayPlayer(),
                    ["p2"] = new ReplayPlayer(),
                },
                Init = init,
                Events = new List<JObject>(),
                Checkpoints = new List<ReplayCheckpoint>(),
                Summary = new ReplaySummary(),
            };
            AddLiveReplayCheckpoint(0, result.State);
            RefreshLiveReplaySummary(result.StateHash);
        }

        private void RecordLiveReplayEvent(
            string commandType,
            JObject payload,
            string actor,
            JObject beforeSnapshot,
            GameRulesResult result
        )
        {
            if (liveRecordedReplay == null)
            {
                return;
            }

            var replayEvent = BuildLiveReplayEvent(commandType, payload ?? new JObject(), actor, beforeSnapshot, result);
            if (replayEvent == null)
            {
                replayPersistenceStatus = "recording-partial";
                replayPersistenceError = "Live action " + commandType + " was applied but not recorded.";
                return;
            }

            liveRecordedReplay.Events.Add(replayEvent);
            var revision = liveRecordedReplay.Events.Count;
            AddLiveReplayCheckpoint(revision, result.State);
            RefreshLiveReplaySummary(result.StateHash);
            replayPersistenceStatus = "recording";
            replayPersistenceError = string.Empty;
        }

        private void AddLiveReplayCheckpoint(int revision, JObject state)
        {
            liveRecordedReplay.Checkpoints.RemoveAll(candidate => candidate.Revision == revision);
            liveRecordedReplay.Checkpoints.Add(
                new ReplayCheckpoint
                {
                    Revision = revision,
                    State = state == null ? new JObject() : (JObject)state.DeepClone(),
                }
            );
        }

        private void RefreshLiveReplaySummary(string stateHash)
        {
            if (liveRecordedReplay == null)
            {
                return;
            }

            var winner = currentState == null ? null : currentState.Winner;
            liveRecordedReplay.ReplayRevision = liveRecordedReplay.Events.Count;
            liveRecordedReplay.Summary.TotalEvents = liveRecordedReplay.Events.Count;
            liveRecordedReplay.Summary.TurnCount = liveRecordedReplay.Events.Count;
            liveRecordedReplay.Summary.Winner = winner;
            liveRecordedReplay.Summary.EndReason = string.IsNullOrEmpty(winner) ? null : "game_over";
            liveRecordedReplay.Summary.FinalStateHash = string.IsNullOrEmpty(stateHash)
                ? currentState == null ? string.Empty : new ReplayStateHasher().Hash(currentState)
                : stateHash;
            liveRecordedReplay.Match.Winner = winner;
            liveRecordedReplay.Match.EndReason = liveRecordedReplay.Summary.EndReason;
            liveRecordedReplay.Match.Ended = !string.IsNullOrEmpty(winner);
        }

        private JObject BuildLiveReplayEvent(
            string commandType,
            JObject payload,
            string actor,
            JObject beforeSnapshot,
            GameRulesResult result
        )
        {
            var replayEvent = new JObject { ["actor"] = actor };
            switch (commandType)
            {
                case "SELECT_BUFF":
                    replayEvent["type"] = "select_buff";
                    replayEvent["buffId"] = payload.Value<string>("buffId");
                    break;
                case "TAKE_GEMS":
                    replayEvent["type"] = "take_gems";
                    replayEvent["coords"] = payload["coords"] == null ? new JArray() : payload["coords"].DeepClone();
                    break;
                case "REPLENISH":
                    replayEvent["type"] = "replenish";
                    break;
                case "TAKE_BONUS_GEM":
                    replayEvent["type"] = "take_bonus_gem";
                    replayEvent["coord"] = BuildCoord(payload);
                    break;
                case "STEAL_GEM":
                    replayEvent["type"] = "steal_gem";
                    replayEvent["gemId"] = payload.Value<string>("gemId");
                    break;
                case "DISCARD_GEM":
                    replayEvent["type"] = "discard_gem";
                    replayEvent["gemId"] = payload.Value<string>("gemId");
                    break;
                case "SELECT_ROYAL_CARD":
                    replayEvent["type"] = "select_royal";
                    replayEvent["royalId"] = payload.Value<string>("royalId");
                    break;
                case "INITIATE_BUY_JOKER":
                    replayEvent["type"] = "initiate_buy_joker";
                    if (
                        payload.Value<string>("source") == "reserved"
                        || !string.IsNullOrEmpty(payload.Value<string>("instanceId"))
                    )
                    {
                        replayEvent["source"] = "reserved";
                        replayEvent["instanceId"] = payload.Value<string>("instanceId");
                    }
                    else
                    {
                        replayEvent["source"] = "market";
                        AddMarketReplayFields(replayEvent, payload, beforeSnapshot);
                    }
                    break;
                case "BUY_CARD":
                    replayEvent["type"] = "buy_card";
                    replayEvent["source"] = "market";
                    replayEvent["bonusColor"] = payload.Value<string>("bonusColor");
                    AddMarketReplayFields(replayEvent, payload, beforeSnapshot);
                    break;
                case "BUY_RESERVED_CARD":
                    replayEvent["type"] = "buy_card";
                    replayEvent["source"] = "reserved";
                    replayEvent["instanceId"] = payload.Value<string>("instanceId");
                    replayEvent["bonusColor"] = payload.Value<string>("bonusColor");
                    break;
                case "INITIATE_RESERVE":
                    replayEvent["type"] = "initiate_reserve";
                    AddMarketReplayFields(replayEvent, payload, beforeSnapshot);
                    break;
                case "INITIATE_RESERVE_DECK":
                    replayEvent["type"] = "initiate_reserve_deck";
                    replayEvent["level"] = payload.Value<int?>("level") ?? 1;
                    replayEvent["instanceId"] = ResolveDeckInstanceId(beforeSnapshot, payload);
                    break;
                case "RESERVE_CARD":
                    replayEvent["type"] = "reserve_card";
                    AddMarketReplayFields(replayEvent, payload, beforeSnapshot);
                    replayEvent["goldCoord"] = BuildGoldCoord(payload);
                    break;
                case "RESERVE_DECK":
                    replayEvent["type"] = "reserve_deck";
                    replayEvent["level"] = payload.Value<int?>("level") ?? 1;
                    replayEvent["instanceId"] = ResolveDeckInstanceId(beforeSnapshot, payload);
                    replayEvent["goldCoord"] = BuildGoldCoord(payload);
                    break;
                case "CANCEL_RESERVE":
                    replayEvent["type"] = "cancel_reserve";
                    break;
                case "DISCARD_RESERVED":
                    replayEvent["type"] = "discard_reserved";
                    replayEvent["instanceId"] = payload.Value<string>("cardId") ?? payload.Value<string>("instanceId");
                    break;
                case "ACTIVATE_PRIVILEGE":
                    replayEvent["type"] = "activate_privilege";
                    break;
                case "USE_PRIVILEGE":
                    replayEvent["type"] = "use_privilege";
                    replayEvent["coord"] = BuildCoord(payload);
                    break;
                case "CANCEL_PRIVILEGE":
                    replayEvent["type"] = "cancel_privilege";
                    break;
                case "REROLL_DRAFT_POOL":
                    replayEvent["type"] = "reroll_draft_pool";
                    if (payload["level"] != null)
                    {
                        replayEvent["level"] = payload.Value<int>("level");
                    }
                    break;
                case "PEEK_DECK":
                    replayEvent["type"] = "peek_deck";
                    if (payload["level"] != null)
                    {
                        replayEvent["level"] = payload.Value<int>("level");
                    }
                    if (payload["levels"] != null)
                    {
                        replayEvent["levels"] = payload["levels"].DeepClone();
                    }
                    replayEvent["cards"] =
                        result.State?["activeModal"]?["data"]?["cards"]?.DeepClone() ?? new JArray();
                    break;
                case "CLOSE_MODAL":
                    replayEvent["type"] = "close_modal";
                    break;
                default:
                    return null;
            }

            return replayEvent;
        }

        private static JObject BuildCoord(JObject payload)
        {
            return new JObject
            {
                ["r"] = payload.Value<int?>("r") ?? 0,
                ["c"] = payload.Value<int?>("c") ?? 0,
            };
        }

        private static JObject BuildGoldCoord(JObject payload)
        {
            if (payload["goldCoords"] is JObject goldCoords)
            {
                return (JObject)goldCoords.DeepClone();
            }

            if (payload["goldCoord"] is JObject goldCoord)
            {
                return (JObject)goldCoord.DeepClone();
            }

            return null;
        }

        private static void AddMarketReplayFields(JObject replayEvent, JObject payload, JObject beforeSnapshot)
        {
            var level = payload.Value<int?>("level") ?? 1;
            var index = payload.Value<int?>("idx") ?? payload.Value<int?>("index") ?? 0;
            replayEvent["instanceId"] = ResolveMarketInstanceId(beforeSnapshot, level, index);
            replayEvent["marketRef"] = new JObject
            {
                ["level"] = level,
                ["idx"] = index,
            };
        }

        private static string ResolveMarketInstanceId(JObject snapshot, int level, int index)
        {
            var market = snapshot?["market"] as JObject;
            var row = market?[level.ToString()] as JArray;
            if (row == null || index < 0 || index >= row.Count)
            {
                return string.Empty;
            }

            return row[index].Value<string>() ?? string.Empty;
        }

        private static string ResolveDeckInstanceId(JObject snapshot, JObject payload)
        {
            var level = payload.Value<int?>("level") ?? 1;
            var decks = snapshot?["decks"] as JObject;
            var deck = decks?[level.ToString()] as JArray;
            return deck == null || deck.Count == 0 ? string.Empty : deck.Last.Value<string>();
        }

        private ReducerResult ApplyReplayEvent(JObject replayEvent)
        {
            var result = reducer.ApplyReplayEvent(currentState, replayEvent, activeReplay.Checkpoints);
            if (!result.Ok)
            {
                return result;
            }

            var eventType = replayEvent.Value<string>("type") ?? string.Empty;
            PreviewContext nextPreviewContext = null;
            nextFixtureEventIndex += 1;
            LoadReplayAuditCheckpointIfPresent();
            selectedGemCoords.Clear();
            previewContext = null;
            settingsOpen = false;
            settingsSurfaceDropdownOpen = false;
            rulebookOpen = false;
            errorBanner = string.Empty;
            isMainMenu = false;
            if (nextPreviewContext != null)
            {
                RenderState();
                CapturePreviewBackgroundTexture();
                previewContext = nextPreviewContext;
                RenderState();
                return result;
            }

            ClearPreviewBackgroundTexture();
            RenderState();
            return result;
        }

        private void LoadReplayAuditCheckpointIfPresent()
        {
            if (activeReplay == null || currentState == null)
            {
                return;
            }

            var checkpoint = activeReplay.Checkpoints.FirstOrDefault(
                candidate => candidate.Revision == currentState.Revision
            );
            if (checkpoint == null)
            {
                return;
            }

            currentState.LoadReplayAuditSnapshot(
                GameReducer.NormalizeReplayAuditSnapshot(checkpoint.State),
                checkpoint.Revision
            );
        }

        private void HandleTakeGemsTarget(GemDuelViewTarget target, JObject nextEvent)
        {
            if (target.Kind == "ActionButton" && target.EventType == "confirm-gems")
            {
                ConfirmTakeGemsSelection(nextEvent);
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "cancel-gems")
            {
                CancelTakeGemsSelection();
                return;
            }

            if (target.Kind != "Gem")
            {
                SetStatus("Select one to three board gems, then confirm or cancel.");
                return;
            }

            if (target.GemId == "empty")
            {
                SetStatus("That board space is empty.");
                return;
            }

            if (target.GemId == "gold")
            {
                SetStatus("Gold cannot be taken as a normal board gem.");
                return;
            }

            SelectTakeGemsCoord(
                target.Row,
                target.Column,
                target.GemId,
                GetTakeGemsSelectionLimit(nextEvent),
                true,
                out _
            );
        }

        private void ConfirmTakeGemsSelection(JObject nextEvent)
        {
            if (selectedGemCoords.Count == 0)
            {
                SetStatus("Select at least one board gem before confirming.");
                return;
            }

            if (!ValidateGemSelection(selectedGemCoords, true, out var validationError))
            {
                SetStatus(validationError);
                return;
            }

            ApplyVisibleEvent(BuildTakeGemsEvent(nextEvent));
        }

        private void HandleLiveRulesTarget(GemDuelViewTarget target)
        {
            if (currentState.Phase == "RESERVE_WAITING_GEM")
            {
                HandleLiveReserveWaitingTarget(target);
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "close-modal")
            {
                ApplyLiveRulesCommand("CLOSE_MODAL", new JObject());
                return;
            }

            if (currentState.Phase == "BONUS_ACTION")
            {
                HandleLiveBoardCoordTarget(target, "TAKE_BONUS_GEM", "Select the highlighted bonus gem.");
                return;
            }

            if (currentState.Phase == "STEAL_ACTION")
            {
                HandleLiveInventoryGemTarget(target, "steal_gem", "STEAL_GEM", "Select an opponent gem to steal.");
                return;
            }

            if (currentState.Phase == "DISCARD_EXCESS_GEMS")
            {
                HandleLiveInventoryGemTarget(target, "discard_gem", "DISCARD_GEM", "Select one of your gems to discard.");
                return;
            }

            if (currentState.Phase == "SELECT_ROYAL")
            {
                HandleLiveRoyalSelectionTarget(target);
                return;
            }

            if (currentState.Phase == "PRIVILEGE_ACTION")
            {
                HandleLivePrivilegeTarget(target);
                return;
            }

            if (currentState.Phase == "SELECT_CARD_COLOR")
            {
                HandleLiveCardColorTarget(target);
                return;
            }

            if (currentState.Phase == "DRAFT_PHASE")
            {
                HandleLiveDraftTarget(target);
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "replenish")
            {
                if (!CanReplenishBoard())
                {
                    SetStatus("Replenish is unavailable because the bag is empty.");
                    return;
                }

                ApplyLiveRulesCommand("REPLENISH", new JObject());
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "peek-deck")
            {
                ApplyLiveRulesCommand("PEEK_DECK", new JObject { ["levels"] = new JArray(3, 2, 1) });
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "activate-privilege")
            {
                ApplyLiveRulesCommand("ACTIVATE_PRIVILEGE", new JObject());
                return;
            }

            if (target.Kind == "Royal")
            {
                PreviewRoyalCard(target.RoyalId, target.Index, out _);
                return;
            }

            if (currentState.Phase == "IDLE")
            {
                HandleLiveTakeGemsTarget(target);
                return;
            }

            SetStatus("No live Unity command is wired for phase " + currentState.Phase + ".");
        }

        private void HandleLiveDraftTarget(GemDuelViewTarget target)
        {
            if (target.Kind == "ActionButton" && target.EventType == "reroll-draft")
            {
                var payload = new JObject();
                if (target.Level >= 1 && target.Level <= 3)
                {
                    payload["level"] = target.Level;
                }

                ApplyLiveRulesCommand("REROLL_DRAFT_POOL", payload);
                return;
            }

            if (target.Kind == "Buff" && !string.IsNullOrEmpty(target.BuffId))
            {
                ApplyLiveRulesCommand("SELECT_BUFF", new JObject { ["buffId"] = target.BuffId });
                return;
            }

            SetStatus("Select a draft buff or refresh the draft pool.");
        }

        private void HandleLiveBoardCoordTarget(GemDuelViewTarget target, string commandType, string guidance)
        {
            if (target.Kind != "Gem")
            {
                SetStatus(guidance);
                return;
            }

            ApplyLiveRulesCommand(commandType, new JObject { ["r"] = target.Row, ["c"] = target.Column });
        }

        private void HandleLiveInventoryGemTarget(
            GemDuelViewTarget target,
            string expectedEventType,
            string commandType,
            string guidance
        )
        {
            if (target.Kind != "InventoryGem" || target.EventType != expectedEventType)
            {
                SetStatus(guidance);
                return;
            }

            ApplyLiveRulesCommand(commandType, new JObject { ["gemId"] = target.GemId });
        }

        private void HandleLiveRoyalSelectionTarget(GemDuelViewTarget target)
        {
            if (target.Kind != "Royal")
            {
                SetStatus("Select one of the visible royal cards.");
                return;
            }

            ApplyLiveRulesCommand("SELECT_ROYAL_CARD", new JObject { ["royalId"] = target.RoyalId });
        }

        private void HandleLivePrivilegeTarget(GemDuelViewTarget target)
        {
            if (target.Kind == "ActionButton" && target.EventType == "cancel-gems")
            {
                ApplyLiveRulesCommand("CANCEL_PRIVILEGE", new JObject());
                return;
            }

            HandleLiveBoardCoordTarget(target, "USE_PRIVILEGE", "Select a non-Gold board gem for privilege.");
        }

        private void HandleLiveCardColorTarget(GemDuelViewTarget target)
        {
            if (target.Kind != "BonusColor" || target.EventType != "select-card-color")
            {
                SetStatus("Choose a bonus color for the Joker.");
                return;
            }

            var payload = BuildPendingBuyCommandPayload(target.GemId);
            if (payload == null)
            {
                SetStatus("No pending Joker buy is waiting for color selection.");
                return;
            }

            ApplyLiveRulesCommand(payload.Value<string>("commandType"), (JObject)payload["payload"]);
        }

        private void HandleLiveReserveWaitingTarget(GemDuelViewTarget target)
        {
            if (target.Kind == "ActionButton" && target.EventType == "cancel-gems")
            {
                ApplyLiveRulesCommand("CANCEL_RESERVE", new JObject());
                return;
            }

            if (target.Kind != "Gem")
            {
                SetStatus("Select a Gold gem for reserve, or cancel.");
                return;
            }

            if (target.GemId != "gold")
            {
                SetStatus("Select a Gold gem for reserve.");
                return;
            }

            var pendingReserve = currentState.Snapshot["pendingReserve"] as JObject;
            if (pendingReserve == null)
            {
                SetStatus("No reserve action is waiting for a Gold gem.");
                return;
            }

            var commandType = pendingReserve.Value<bool?>("isDeck") == true
                ? "RESERVE_DECK"
                : "RESERVE_CARD";
            var payload = new JObject
            {
                ["level"] = pendingReserve.Value<int?>("level") ?? 1,
                ["idx"] = pendingReserve.Value<int?>("idx") ?? pendingReserve.Value<int?>("index") ?? 0,
                ["goldCoords"] = new JObject { ["r"] = target.Row, ["c"] = target.Column },
            };
            ApplyLiveRulesCommand(commandType, payload);
        }

        private void HandleLiveTakeGemsTarget(GemDuelViewTarget target)
        {
            if (target.Kind == "ActionButton" && target.EventType == "confirm-gems")
            {
                ConfirmLiveTakeGemsSelection();
                return;
            }

            if (target.Kind == "ActionButton" && target.EventType == "cancel-gems")
            {
                CancelTakeGemsSelection();
                return;
            }

            if (target.Kind != "Gem")
            {
                SetStatus("Select one to three board gems, then confirm or cancel.");
                return;
            }

            var gemId = GetCurrentBoardGemId(target.Row, target.Column);
            if (string.IsNullOrEmpty(gemId))
            {
                gemId = target.GemId;
            }

            if (gemId == "empty")
            {
                SetStatus("That board space is empty.");
                return;
            }

            if (gemId == "gold")
            {
                SetStatus("Gold cannot be taken as a normal board gem.");
                return;
            }

            SelectTakeGemsCoord(
                target.Row,
                target.Column,
                gemId,
                MaxTakeGemsSelectionCount,
                true,
                out _
            );
        }

        private void ConfirmLiveTakeGemsSelection()
        {
            if (selectedGemCoords.Count == 0)
            {
                SetStatus("Select at least one board gem before confirming.");
                return;
            }

            if (!ValidateGemSelection(selectedGemCoords, true, out var validationError))
            {
                SetStatus(validationError);
                return;
            }

            var coords = new JArray();
            foreach (var selected in selectedGemCoords)
            {
                coords.Add(new JObject { ["r"] = selected.x, ["c"] = selected.y });
            }

            ApplyLiveRulesCommand("TAKE_GEMS", new JObject { ["coords"] = coords });
        }

        private bool ApplyLiveRulesCommand(string commandType, JObject payload, string actorOverride = null)
        {
            var actor = string.IsNullOrEmpty(actorOverride) ? currentState.Turn : actorOverride;
            var beforeSnapshot = (JObject)currentState.Snapshot.DeepClone();
            var result = rulesEngine.ApplyCommand(
                currentState,
                new GameRulesCommand
                {
                    Type = commandType,
                    Actor = actor,
                    Payload = payload ?? new JObject(),
                }
            );

            if (!result.Ok || result.State == null)
            {
                selectedGemCoords.Clear();
                errorBanner = string.IsNullOrEmpty(result.Error) ? "Live command rejected." : result.Error;
                RenderState();
                SetStatus(errorBanner);
                return false;
            }

            currentState = new GameState(result.State, result.ReplayRevision);
            if (result.Init != null && result.Init.Count > 0)
            {
                activeRulesInit = (JObject)result.Init.DeepClone();
            }

            RecordLiveReplayEvent(commandType, payload ?? new JObject(), actor, beforeSnapshot, result);

            nextFixtureEventIndex = result.ReplayRevision;
            selectedGemCoords.Clear();
            previewContext = null;
            hoverContext = null;
            previewInteractionLayoutSticky = false;
            settingsOpen = false;
            settingsSurfaceDropdownOpen = false;
            rulebookOpen = false;
            errorBanner = string.Empty;
            isMainMenu = false;
            PersistRecoverySnapshot();
            RenderState();
            SetStatus("Applied live action | " + result.ActionType);
            return true;
        }

        private void CancelTakeGemsSelection()
        {
            selectedGemCoords.Clear();
            RenderState();
            SetStatus("Gem selection cancelled.");
        }

        private bool SelectTakeGemsCoord(
            int row,
            int column,
            string gemId,
            int limit,
            bool renderAfterMutation,
            out string detail
        )
        {
            detail = string.Empty;
            if (gemId == "empty")
            {
                detail = "That board space is empty.";
                SetStatus(detail);
                return false;
            }

            if (gemId == "gold")
            {
                detail = "Gold cannot be taken as a normal board gem.";
                SetStatus(detail);
                return false;
            }

            var selected = new Vector2Int(row, column);
            if (selectedGemCoords.Contains(selected))
            {
                selectedGemCoords.Remove(selected);
                if (renderAfterMutation)
                {
                    RenderState();
                }

                detail = "Deselected board gem " + row + "," + column + ".";
                SetStatus("Selected " + selectedGemCoords.Count + "/" + limit + " board gems. Confirm or cancel.");
                return true;
            }

            if (selectedGemCoords.Count >= limit)
            {
                detail = "Take-gems selection is full.";
                SetStatus(detail);
                return false;
            }

            var candidate = new List<Vector2Int>(selectedGemCoords) { selected };
            var isFinalSelection = candidate.Count >= limit;
            if (!ValidateGemSelection(candidate, isFinalSelection, out var validationError))
            {
                detail = validationError;
                SetStatus(validationError);
                return false;
            }

            selectedGemCoords.Add(selected);
            if (renderAfterMutation)
            {
                RenderState();
            }

            detail = "Selected board gem " + row + "," + column + ".";
            SetStatus("Selected " + selectedGemCoords.Count + "/" + limit + " board gems. Confirm or cancel.");
            return true;
        }

        private bool TryFillSkippedDragMidpoint(GemDuelViewTarget target, int limit, out string detail)
        {
            detail = string.Empty;
            var targetCoord = new Vector2Int(target.Row, target.Column);
            if (selectedGemCoords.Count != 1 || selectedGemCoords.Contains(targetCoord))
            {
                return true;
            }

            var start = selectedGemCoords[0];
            var dr = targetCoord.x - start.x;
            var dc = targetCoord.y - start.y;
            var span = Math.Max(Math.Abs(dr), Math.Abs(dc));
            var isStraight = dr == 0 || dc == 0 || Math.Abs(dr) == Math.Abs(dc);
            if (!isStraight || span != 2)
            {
                return true;
            }

            var midpoint = new Vector2Int(
                start.x + (dr == 0 ? 0 : dr / 2),
                start.y + (dc == 0 ? 0 : dc / 2)
            );
            if (selectedGemCoords.Contains(midpoint))
            {
                return true;
            }

            var midpointGemId = GetBoardGemForAutomation(midpoint.x, midpoint.y);
            if (midpointGemId == "empty" || midpointGemId == "gold")
            {
                detail = "Board gem drag skipped a non-selectable midpoint.";
                SetStatus(detail);
                return false;
            }

            if (!SelectTakeGemsCoord(midpoint.x, midpoint.y, midpointGemId, limit, false, out var midpointDetail))
            {
                detail = midpointDetail;
                return false;
            }

            detail = "Auto-selected skipped midpoint " + midpoint.x + "," + midpoint.y + ".";
            return true;
        }

        private bool PreviewMarketCard(int level, int index, out string error)
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No game is active.";
                return RejectSemanticAction(error);
            }

            var market = (JObject)currentState.Snapshot["market"];
            var row = (JArray)market[level.ToString()];
            if (row == null || index < 0 || index >= row.Count)
            {
                error = "No market card at " + level + "-" + index + ".";
                return RejectSemanticAction(error);
            }

            PreparePreviewBackgroundCapture();
            previewContext = new PreviewContext
            {
                Source = "market",
                Level = level,
                Index = index,
                InstanceId = row[index].Value<string>(),
            };
            hoverContext = null;
            isMainMenu = false;
            settingsOpen = false;
            errorBanner = string.Empty;
            RenderState();
            SetStatus("Previewing market card " + previewContext.InstanceId + ".");
            return true;
        }

        private bool PreviewMarketDeck(int level, out string error)
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No game is active.";
                return RejectSemanticAction(error);
            }

            var decks = (JObject)currentState.Snapshot["decks"];
            var deck = (JArray)decks?[level.ToString()];
            if (deck == null || deck.Count == 0)
            {
                error = "No market deck cards at level " + level + ".";
                return RejectSemanticAction(error);
            }

            PreparePreviewBackgroundCapture();
            previewContext = new PreviewContext
            {
                Source = "deck",
                Level = level,
                Index = -1,
                InstanceId = string.Empty,
            };
            hoverContext = null;
            isMainMenu = false;
            settingsOpen = false;
            errorBanner = string.Empty;
            RenderState();
            SetStatus("Previewing market deck L" + level + " reserve.");
            return true;
        }

        private bool PreviewReservedCard(int index, out string error)
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No game is active.";
                return RejectSemanticAction(error);
            }

            var player = currentState.Turn;
            var reserved = (JArray)((JObject)currentState.Snapshot["playerReserved"])[player];
            if (reserved == null || index < 0 || index >= reserved.Count)
            {
                error = "No reserved card at " + index + ".";
                return RejectSemanticAction(error);
            }

            PreparePreviewBackgroundCapture();
            previewContext = new PreviewContext
            {
                Source = "reserved",
                Level = -1,
                Index = index,
                InstanceId = reserved[index].Value<string>(),
            };
            hoverContext = null;
            settingsOpen = false;
            errorBanner = string.Empty;
            RenderState();
            SetStatus("Previewing reserved card " + previewContext.InstanceId + ".");
            return true;
        }

        private bool PreviewRoyalCard(string royalId, int index, out string error)
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No game is active.";
                return RejectSemanticAction(error);
            }

            var royalDeck = (JArray)currentState.Snapshot["royalDeck"];
            if (royalDeck == null)
            {
                error = "No royal deck is active.";
                return RejectSemanticAction(error);
            }

            var resolvedIndex = index;
            if (resolvedIndex < 0 || resolvedIndex >= royalDeck.Count || royalDeck[resolvedIndex].Value<string>() != royalId)
            {
                resolvedIndex = -1;
                for (var candidate = 0; candidate < royalDeck.Count; candidate += 1)
                {
                    if (royalDeck[candidate].Value<string>() == royalId)
                    {
                        resolvedIndex = candidate;
                        break;
                    }
                }
            }

            if (resolvedIndex < 0)
            {
                error = "No royal card " + royalId + ".";
                return RejectSemanticAction(error);
            }

            PreparePreviewBackgroundCapture();
            previewContext = new PreviewContext
            {
                Source = "royal",
                Level = -1,
                Index = resolvedIndex,
                InstanceId = royalId,
            };
            hoverContext = null;
            settingsOpen = false;
            errorBanner = string.Empty;
            RenderState();
            SetStatus("Previewing royal card " + previewContext.InstanceId + ".");
            return true;
        }

        private bool PreviewTableauStack(string player, string color, out string error)
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No game is active.";
                return RejectSemanticAction(error);
            }

            if (string.IsNullOrEmpty(player) || string.IsNullOrEmpty(color))
            {
                error = "No tableau stack to preview.";
                return RejectSemanticAction(error);
            }

            var instanceIds = GetPlayerTableauCardIds(player, color);
            if (instanceIds.Count == 0)
            {
                error = "No tableau cards in " + player + " " + color + " stack.";
                return RejectSemanticAction(error);
            }

            PreparePreviewBackgroundCapture();
            previewContext = new PreviewContext
            {
                Source = "tableau",
                Level = -1,
                Index = -1,
                InstanceId = instanceIds[instanceIds.Count - 1],
                Player = player,
                Color = color,
                InstanceIds = instanceIds,
            };
            hoverContext = null;
            settingsOpen = false;
            errorBanner = string.Empty;
            RenderState();
            SetStatus("Previewing " + player + " " + color + " stack (" + instanceIds.Count + " cards).");
            return true;
        }

        private bool RunPreviewAction(string eventType, JObject payload, out string error)
        {
            var level = payload.Value<int?>("level") ?? 1;
            var index = payload.Value<int?>("index") ?? 0;
            if (
                previewContext == null
                || previewContext.Source != "market"
                || previewContext.Level != level
                || previewContext.Index != index
            )
            {
                if (!ClickVisibleMarketCardForAutomation(payload, out error))
                {
                    return false;
                }
            }

            var actionEventType = eventType == "buy_card"
                ? "preview-buy"
                : eventType == "discard_reserved" || eventType == "discard"
                    ? "preview-discard"
                    : "preview-reserve";
            var actionSemanticKey = PreviewActionSemanticKey(actionEventType);
            var clickedPreviewAction = ClickVisibleTargetForAutomation(
                target =>
                    target.Kind == "ActionButton"
                    && target.EventType == actionEventType
                    && (
                        string.IsNullOrEmpty(actionSemanticKey)
                        || target.SemanticKey == actionSemanticKey
                    ),
                actionEventType,
                out error
            );
            if (!clickedPreviewAction || eventType != "reserve_card")
            {
                return clickedPreviewAction;
            }

            var next = GetNextEvent();
            if (!(next?["goldCoord"] is JObject goldCoord))
            {
                return true;
            }

            return ClickVisibleTargetForAutomation(
                target => target.Kind == "Gem" && MatchesCoord(goldCoord, target.Row, target.Column),
                "reserve gold " + goldCoord.Value<int>("r") + "-" + goldCoord.Value<int>("c"),
                out error
            );
        }

        private static string PreviewActionSemanticKey(string actionEventType)
        {
            switch (actionEventType)
            {
                case "preview-buy":
                    return "card.preview.primaryAction";
                case "preview-reserve":
                    return "card.preview.action.reserve";
                case "preview-discard":
                    return "card.preview.action.discard";
                default:
                    return string.Empty;
            }
        }

        private bool ConfirmPreviewAction(string actionId, out string error)
        {
            error = string.Empty;
            if (previewContext == null)
            {
                error = "No active preview.";
                return RejectSemanticAction(error);
            }

            var expectedEventType = "buy_card";
            if (actionId == "reserve")
            {
                expectedEventType = "reserve_card";
            }
            else if (actionId == "discard")
            {
                expectedEventType = "discard_reserved";
            }
            var next = GetNextEvent();
            if (activeReplay == null)
            {
                return ConfirmLivePreviewAction(actionId, out error);
            }

            if (
                next != null
                && next.Value<string>("type") == expectedEventType
                && MatchesMarketRef(next, previewContext.Level, previewContext.Index)
            )
            {
                if (expectedEventType == "reserve_card" && next["goldCoord"] is JObject)
                {
                    BeginReserveGoldSelection(next);
                    return true;
                }

                ApplyVisibleEvent(next);
                return true;
            }

            error = "Preview action " + actionId + " is not legal now.";
            return RejectSemanticAction(error);
        }

        private bool ConfirmLivePreviewAction(string actionId, out string error)
        {
            error = string.Empty;
            if (previewContext.Source == "market")
            {
                if (actionId == "buy")
                {
                    if (IsJokerInstanceId(previewContext.InstanceId))
                    {
                        return ApplyLiveRulesCommand(
                            "INITIATE_BUY_JOKER",
                            new JObject
                            {
                                ["level"] = previewContext.Level,
                                ["idx"] = previewContext.Index,
                            }
                        );
                    }

                    return ApplyLiveRulesCommand(
                        "BUY_CARD",
                        new JObject
                        {
                            ["level"] = previewContext.Level,
                            ["idx"] = previewContext.Index,
                            ["bonusColor"] = "red",
                        }
                    );
                }

                return ApplyLiveReserveCommand(
                    "INITIATE_RESERVE",
                    "RESERVE_CARD",
                    new JObject
                    {
                        ["level"] = previewContext.Level,
                        ["idx"] = previewContext.Index,
                    }
                );
            }

            if (previewContext.Source == "deck" && actionId == "reserve")
            {
                return ApplyLiveReserveCommand(
                    "INITIATE_RESERVE_DECK",
                    "RESERVE_DECK",
                    new JObject { ["level"] = previewContext.Level }
                );
            }

            if (previewContext.Source == "reserved" && actionId == "buy")
            {
                if (IsJokerInstanceId(previewContext.InstanceId))
                {
                    return ApplyLiveRulesCommand(
                        "INITIATE_BUY_JOKER",
                        new JObject
                        {
                            ["source"] = "reserved",
                            ["instanceId"] = previewContext.InstanceId,
                        }
                    );
                }

                return ApplyLiveRulesCommand(
                    "BUY_RESERVED_CARD",
                    new JObject
                    {
                        ["instanceId"] = previewContext.InstanceId,
                        ["bonusColor"] = "red",
                    }
                );
            }

            if (previewContext.Source == "reserved" && actionId == "discard")
            {
                return ApplyLiveRulesCommand(
                    "DISCARD_RESERVED",
                    new JObject { ["cardId"] = previewContext.InstanceId }
                );
            }

            error = "Preview action " + actionId + " is not legal for this card.";
            return RejectSemanticAction(error);
        }

        private bool ApplyLiveReserveCommand(string initiateCommand, string directCommand, JObject payload)
        {
            if (HasBoardGold())
            {
                return ApplyLiveRulesCommand(initiateCommand, payload);
            }

            return ApplyLiveRulesCommand(directCommand, payload);
        }

        private bool HasBoardGold()
        {
            if (currentState == null)
            {
                return false;
            }

            var board = currentState.Snapshot["board"] as JArray;
            if (board == null)
            {
                return false;
            }

            return board.OfType<JArray>().Any(row => row.Any(cell => cell.Value<string>() == "gold"));
        }

        private void BeginReserveGoldSelection(JObject reserveEvent)
        {
            currentState.Snapshot["phase"] = "RESERVE_WAITING_GEM";
            currentState.Snapshot["pendingReserve"] = new JObject
            {
                ["level"] = previewContext.Level,
                ["idx"] = previewContext.Index,
                ["isDeck"] = false,
                ["card"] = previewContext.InstanceId,
                ["goldCoord"] = reserveEvent["goldCoord"]?.DeepClone(),
            };
            previewContext = null;
            hoverContext = null;
            ClearPreviewBackgroundTexture();
            RenderState();
            var goldCoord = (JObject)reserveEvent["goldCoord"];
            SetStatus(
                "Select the highlighted Gold gem for reserve " +
                goldCoord.Value<int>("r") +
                "-" +
                goldCoord.Value<int>("c") +
                "."
            );
        }

        private bool RunEndTurnAction(out string error)
        {
            error = string.Empty;
            var next = GetNextEvent();
            if (activeReplay == null)
            {
                return ClickVisibleTargetForAutomation(
                    target => target.Kind == "ActionButton" && target.EventType == "replenish",
                    "replenish action",
                    out error
                );
            }

            if (next != null && next.Value<string>("type") == "replenish")
            {
                return ClickVisibleTargetForAutomation(
                    target => target.Kind == "ActionButton" && target.EventType == "replenish",
                    "replenish action",
                    out error
                );
            }

            error = "No visible end-turn action is available.";
            return RejectSemanticAction(error);
        }

        private bool ChooseRoyal(int index, string royalIdOverride, out string error)
        {
            error = string.Empty;
            if (currentState == null)
            {
                error = "No game is active.";
                return RejectSemanticAction(error);
            }

            var royalDeck = (JArray)currentState.Snapshot["royalDeck"];
            if (royalDeck == null)
            {
                error = "No royal deck is available.";
                return RejectSemanticAction(error);
            }

            var resolvedIndex = -1;
            if (!string.IsNullOrEmpty(royalIdOverride))
            {
                for (var candidateIndex = 0; candidateIndex < royalDeck.Count; candidateIndex++)
                {
                    if (royalDeck[candidateIndex].Value<string>() == royalIdOverride)
                    {
                        resolvedIndex = candidateIndex;
                        break;
                    }
                }

                if (resolvedIndex < 0)
                {
                    error = "No royal " + royalIdOverride + " in the royal deck.";
                    return RejectSemanticAction(error);
                }
            }
            else if (index >= 0 && index < royalDeck.Count)
            {
                resolvedIndex = index;
            }

            if (resolvedIndex < 0)
            {
                error = "No royal at index " + index + ".";
                return RejectSemanticAction(error);
            }

            var next = GetNextEvent();
            var royalId = royalDeck[resolvedIndex].Value<string>();
            if (activeReplay == null && currentState.Phase == "SELECT_ROYAL")
            {
                return ClickVisibleTargetForAutomation(
                    target => target.Kind == "Royal" && target.RoyalId == royalId,
                    "royal " + royalId,
                    out error
                );
            }

            if (next != null && next.Value<string>("type") == "select_royal" && next.Value<string>("royalId") == royalId)
            {
                return ClickVisibleTargetForAutomation(
                    target => target.Kind == "Royal" && target.RoyalId == royalId,
                    "royal " + royalId,
                    out error
                );
            }

            error = "Royal " + royalId + " is not legal now.";
            return RejectSemanticAction(error);
        }

        private bool RejectSemanticAction(string message)
        {
            lastAutomationDetail = message;
            errorBanner = message;
            RenderState();
            SetStatus(message);
            return false;
        }

        private bool ClickVisibleBuffForAutomation(JObject payload, out string error)
        {
            var buffId = payload.Value<string>("buffId");
            var index = payload.Value<int?>("index");
            return ClickVisibleTargetForAutomation(
                target =>
                    target.Kind == "Buff"
                    && (
                        (!string.IsNullOrEmpty(buffId) && target.BuffId == buffId)
                        || (!index.HasValue && string.IsNullOrEmpty(buffId))
                        || (index.HasValue && target.Index == index.Value)
                    ),
                "visible boon card",
                out error
            );
        }

        private bool HoverVisibleBuffForAutomation(JObject payload, out string error)
        {
            var buffId = payload.Value<string>("buffId");
            var index = payload.Value<int?>("index");
            return HoverVisibleTargetForAutomation(
                target =>
                    target.Kind == "Buff"
                    && (
                        (!string.IsNullOrEmpty(buffId) && target.BuffId == buffId)
                        || (!index.HasValue && string.IsNullOrEmpty(buffId))
                        || (index.HasValue && target.Index == index.Value)
                    ),
                "visible boon card",
                out error
            );
        }

        private bool HoverVisibleTargetForAutomation(
            Func<GemDuelViewTarget, bool> predicate,
            string description,
            out string error
        )
        {
            error = string.Empty;
            var candidates = FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None)
                .Where(target =>
                    target != null
                    && target.isActiveAndEnabled
                    && target.gameObject.activeInHierarchy
                    && target.Clickable
                    && predicate(target))
                .OrderBy(target => target.Index < 0 ? int.MaxValue : target.Index)
                .ThenBy(target => string.IsNullOrEmpty(target.SemanticKey) ? 1 : 0)
                .ThenBy(target => target.Size.x * target.Size.y)
                .ThenBy(target => target.transform.position.z)
                .ToList();
            if (candidates.Count == 0)
            {
                error = "No clickable Unity hover target for " + description + ".";
                return RejectSemanticAction(error);
            }

            var camera = Camera.main;
            if (camera == null)
            {
                error = "Unity scene has no camera for hover dispatch.";
                return RejectSemanticAction(error);
            }

            if (!TryResolveAutomationHit(candidates, predicate, out var target, out var dispatchTarget, out var blockedTarget, out var blocker))
            {
                error = "Clickable Unity hover target for " + description + " is blocked by " + DescribeTarget(blocker) + " at " + DescribeTarget(blockedTarget) + ".";
                return RejectSemanticAction(error);
            }

            var controller = FindAnyObjectByType<GemDuelInputController>() ?? gameObject.AddComponent<GemDuelInputController>();
            var screenPoint = camera.WorldToScreenPoint(target.transform.position);
            var targetDescription = DescribeTarget(dispatchTarget);
            var ok = controller.TryHoverScreenPointForEvidence(screenPoint, out var detail);
            lastAutomationDriver = ok ? "unity-hover-target" : "missing-unity-hover-target";
            lastAutomationDetail = ok
                ? "Hovered " + targetDescription + " through GemDuelInputController hit testing."
                : detail;
            if (!ok)
            {
                error = detail;
            }

            return ok;
        }

        private bool ClickVisibleMarketCardForAutomation(JObject payload, out string error)
        {
            var level = payload.Value<int?>("level") ?? 1;
            var index = payload.Value<int?>("index") ?? 0;
            return ClickVisibleTargetForAutomation(
                target => target.Kind == "MarketCard" && target.Level == level && target.Index == index,
                "market card " + level + "-" + index,
                out error
            );
        }

        private bool ClickVisibleMarketDeckForAutomation(JObject payload, out string error)
        {
            var level = payload.Value<int?>("level") ?? 1;
            return ClickVisibleTargetForAutomation(
                target => target.Kind == "MarketDeck" && target.Level == level,
                "market deck " + level,
                out error
            );
        }

        private bool HoverChromeControlForAutomation(JObject payload, out string error)
        {
            var control = payload.Value<string>("control") ?? "settings";
            var semanticKey = control == "rulebook"
                ? "chrome.rulebook"
                : control == "restart"
                    ? "chrome.restart"
                    : "settings.control";
            return HoverVisibleTargetForAutomation(
                target => target.SemanticKey == semanticKey,
                "chrome " + control + " control",
                out error
            );
        }

        private bool HoverMarketCardForAutomation(JObject payload, out string error)
        {
            var level = payload.Value<int?>("level") ?? 1;
            var index = payload.Value<int?>("index") ?? 0;
            return HoverVisibleTargetForAutomation(
                target => target.Kind == "MarketCard" && target.Level == level && target.Index == index,
                "market card " + level + "-" + index,
                out error
            );
        }

        private bool HoverMarketDeckForAutomation(JObject payload, out string error)
        {
            var level = payload.Value<int?>("level") ?? 1;
            return HoverVisibleTargetForAutomation(
                target => target.Kind == "MarketDeck" && target.Level == level,
                "market deck " + level,
                out error
            );
        }

        private bool ClickBoardCellForAutomation(JObject payload, out string error)
        {
            var row = payload.Value<int?>("row") ?? payload.Value<int?>("r") ?? 0;
            var column = payload.Value<int?>("column") ?? payload.Value<int?>("c") ?? 0;
            var expectedGemId = GetCurrentBoardGemId(row, column);
            return ClickVisibleTargetForAutomation(
                target =>
                    target.Kind == "Gem"
                    && target.Row == row
                    && target.Column == column
                    && (string.IsNullOrEmpty(expectedGemId) || target.GemId == expectedGemId),
                "board cell " + row + "-" + column,
                out error
            );
        }

        private bool HoverBoardCellForAutomation(JObject payload, out string error)
        {
            var row = payload.Value<int?>("row") ?? payload.Value<int?>("r") ?? 0;
            var column = payload.Value<int?>("column") ?? payload.Value<int?>("c") ?? 0;
            return HoverVisibleTargetForAutomation(
                target => target.Kind == "Gem" && target.Row == row && target.Column == column,
                "board cell " + row + "-" + column,
                out error
            );
        }

        private bool ClickFollowUpGemForAutomation(string eventType, JObject payload, out string error)
        {
            var next = GetNextEvent();
            var coord = payload["coord"] as JObject;
            if (coord == null && next != null)
            {
                coord = next["coord"] as JObject;
            }
            var row = payload.Value<int?>("row") ?? payload.Value<int?>("r") ?? coord?.Value<int?>("r") ?? 0;
            var column = payload.Value<int?>("column") ?? payload.Value<int?>("c") ?? coord?.Value<int?>("c") ?? 0;
            return ClickVisibleTargetForAutomation(
                target => target.Kind == "Gem" && target.Row == row && target.Column == column,
                eventType + " cell " + row + "-" + column,
                out error
            );
        }

        private bool ClickInventoryGemForAutomation(string eventType, JObject payload, out string error)
        {
            var gemId = payload.Value<string>("gemId") ?? GetNextEvent()?.Value<string>("gemId") ?? "red";
            var role = payload.Value<string>("role");
            if (string.IsNullOrEmpty(role))
            {
                role = eventType == "steal_gem" ? "opponent" : "current";
            }

            var semanticKey = role == "opponent"
                ? "player.opponent.gem." + gemId
                : "player.current.gem." + gemId;
            var playerGemTargets = FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None)
                .Any(target =>
                    target != null
                    && target.isActiveAndEnabled
                    && target.gameObject.activeInHierarchy
                    && target.Clickable
                    && target.Kind == "InventoryGem"
                    && target.EventType == eventType
                    && target.GemId == gemId
                    && target.SemanticKey == semanticKey);
            if (playerGemTargets)
            {
                return ClickVisibleTargetForAutomation(
                    target =>
                        target.Kind == "InventoryGem" &&
                        target.EventType == eventType &&
                        target.GemId == gemId &&
                        target.SemanticKey == semanticKey,
                    eventType + " " + role + " player gem " + gemId,
                    out error
                );
            }

            return ClickVisibleTargetForAutomation(
                target => target.Kind == "InventoryGem" && target.EventType == eventType && target.GemId == gemId,
                eventType + " gem " + gemId,
                out error
            );
        }

        private bool HoverPlayerGemForAutomation(JObject payload, out string error)
        {
            var role = payload.Value<string>("role") ?? "current";
            var gemId = payload.Value<string>("gemId") ?? "red";
            var semanticKey = role == "opponent"
                ? "player.opponent.gem." + gemId
                : "player.current.gem." + gemId;
            return HoverVisibleTargetForAutomation(
                target => target.SemanticKey == semanticKey,
                role + " player gem " + gemId,
                out error
            );
        }

        private bool HoverPlayerReservedForAutomation(JObject payload, out string error)
        {
            var index = payload.Value<int?>("index") ?? 0;
            return HoverVisibleTargetForAutomation(
                target => target.Kind == "ReservedCard" && target.Index == index,
                "reserved card " + index,
                out error
            );
        }

        private bool ClickPreviewBlankForAutomation(JObject payload, out string error)
        {
            var viewportWidth = payload.Value<int?>("viewportWidth") ?? automationViewportWidth;
            var viewportHeight = payload.Value<int?>("viewportHeight") ?? automationViewportHeight;
            var x = payload.Value<float?>("x") ?? 240f;
            var y = payload.Value<float?>("y") ?? 280f;
            return ClickViewportPointForAutomation(x, y, viewportWidth, viewportHeight, out error);
        }

        private bool ClickSettingForAutomation(JObject payload, out string error)
        {
            error = string.Empty;
            if (!settingsOpen)
            {
                error = "Settings panel is not open.";
                return RejectSemanticAction(error);
            }

            var name = payload.Value<string>("name") ?? string.Empty;
            if (name == "locale")
            {
                var value = payload.Value<string>("value") ?? string.Empty;
                if (value != "en" && value != "zh")
                {
                    error = "Unsupported locale setting value: " + value + ".";
                    return RejectSemanticAction(error);
                }

                return ClickVisibleTargetForAutomation(
                    target => target.Kind == "SettingsControl" && target.EventType == "settings-locale-" + value,
                    "settings locale " + value,
                    out error
                );
            }

            if (name == "soundEnabled")
            {
                var value = payload["value"];
                if (value == null || value.Type != JTokenType.Boolean)
                {
                    error = "soundEnabled setting requires a boolean value.";
                    return RejectSemanticAction(error);
                }

                var desired = value.Value<bool>();
                if (settingsSoundEnabled == desired)
                {
                    if (
                        !ClickVisibleTargetForAutomation(
                            target => target.Kind == "SettingsControl" && target.EventType == "settings-sound-toggle",
                            "settings sound toggle",
                            out error
                        )
                    )
                    {
                        return false;
                    }
                }

                return ClickVisibleTargetForAutomation(
                    target => target.Kind == "SettingsControl" && target.EventType == "settings-sound-toggle",
                    "settings sound toggle",
                    out error
                );
            }

            if (name == "lanShowOpponentPlayerZoneCards")
            {
                var value = payload["value"];
                if (value == null || value.Type != JTokenType.Boolean)
                {
                    error = "lanShowOpponentPlayerZoneCards setting requires a boolean value.";
                    return RejectSemanticAction(error);
                }

                var desired = value.Value<bool>();
                settingsLanShowOpponentPlayerZoneCards = desired;
                if (!PersistSettings())
                {
                    error = "settings LAN card visibility persistence failed: " + settingsPersistenceError;
                    return RejectSemanticAction(error);
                }

                RenderState();
                SetStatus("LAN opponent card visibility " + (desired ? "enabled." : "disabled."));
                return true;
            }

            if (name == "lanShowOpponentGems")
            {
                var value = payload["value"];
                if (value == null || value.Type != JTokenType.Boolean)
                {
                    error = "lanShowOpponentGems setting requires a boolean value.";
                    return RejectSemanticAction(error);
                }

                var desired = value.Value<bool>();
                settingsLanShowOpponentGems = desired;
                if (!PersistSettings())
                {
                    error = "settings LAN gem visibility persistence failed: " + settingsPersistenceError;
                    return RejectSemanticAction(error);
                }

                RenderState();
                SetStatus("LAN opponent gem visibility " + (desired ? "enabled." : "disabled."));
                return true;
            }

            if (name == "surfaceTheme")
            {
                var value = payload.Value<string>("value") ?? string.Empty;
                if (!IsSurfaceThemeVariant(value))
                {
                    error = "Unsupported surface theme setting value: " + value + ".";
                    return RejectSemanticAction(error);
                }

                if (!settingsSurfaceDropdownOpen)
                {
                    if (
                        !ClickVisibleTargetForAutomation(
                            target => target.Kind == "SettingsControl" && target.EventType == "settings-surface-control",
                            "settings surface theme control",
                            out error
                        )
                    )
                    {
                        return false;
                    }
                }

                return ClickVisibleTargetForAutomation(
                    target => target.Kind == "SettingsControl" && target.EventType == "settings-surface-" + value,
                    "settings surface theme " + value,
                    out error
                );
            }

            error = "Unsupported setting: " + name + ".";
            return RejectSemanticAction(error);
        }

        private bool ClickSettingsForAutomation(out string error)
        {
            return ClickVisibleTargetForAutomation(
                target => target.Kind == "ActionButton" && target.EventType == "open_settings",
                "settings control",
                out error
            );
        }

        private bool ClickVisibleTargetForAutomation(
            Func<GemDuelViewTarget, bool> predicate,
            string description,
            out string error
        )
        {
            error = string.Empty;
            var candidates = FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None)
                .Where(target =>
                    target != null
                    && target.isActiveAndEnabled
                    && target.gameObject.activeInHierarchy
                    && target.Clickable
                    && predicate(target))
                .OrderBy(target => target.Index < 0 ? int.MaxValue : target.Index)
                .ThenBy(target => string.IsNullOrEmpty(target.SemanticKey) ? 1 : 0)
                .ThenBy(target => target.Size.x * target.Size.y)
                .ThenBy(target => target.transform.position.z)
                .ToList();
            if (candidates.Count == 0)
            {
                error = "No clickable Unity target for " + description + ".";
                return RejectSemanticAction(error);
            }

            if (!TryResolveAutomationHit(candidates, predicate, out _, out var dispatchTarget, out var blockedTarget, out var blocker))
            {
                error = "Clickable Unity target for " + description + " is blocked by " + DescribeTarget(blocker) + " at " + DescribeTarget(blockedTarget) + ".";
                return RejectSemanticAction(error);
            }

            var clickedDescription = DescribeTarget(dispatchTarget);
            HandleVisibleTarget(dispatchTarget);
            lastAutomationDriver = "unity-hit-target";
            lastAutomationDetail =
                "Clicked " + clickedDescription + " through GemDuelInputController hit testing.";
            return true;
        }

        private static bool TryResolveAutomationHit(
            IReadOnlyList<GemDuelViewTarget> candidates,
            Func<GemDuelViewTarget, bool> predicate,
            out GemDuelViewTarget candidateTarget,
            out GemDuelViewTarget dispatchTarget,
            out GemDuelViewTarget blockedTarget,
            out GemDuelViewTarget blocker
        )
        {
            candidateTarget = null;
            dispatchTarget = null;
            blockedTarget = null;
            blocker = null;
            foreach (var candidate in candidates)
            {
                var hit = GemDuelInputController.FindVisibleTargetAtWorld(candidate.transform.position);
                var hitMatchesPredicate = hit != null && predicate(hit);
                if (hit == candidate || IsEquivalentAutomationHit(candidate, hit) || hitMatchesPredicate)
                {
                    candidateTarget = candidate;
                    dispatchTarget = hitMatchesPredicate ? hit : candidate;
                    return true;
                }

                if (blockedTarget == null)
                {
                    blockedTarget = candidate;
                    blocker = hit;
                }
            }

            return false;
        }

        private static bool IsEquivalentAutomationHit(GemDuelViewTarget expected, GemDuelViewTarget hit)
        {
            if (expected == null || hit == null)
            {
                return false;
            }

            if (
                !string.IsNullOrEmpty(expected.SemanticKey)
                && expected.SemanticKey == hit.SemanticKey
            )
            {
                return true;
            }

            return
                expected.Kind == "Gem"
                && hit.Kind == "Gem"
                && (
                    (
                        !string.IsNullOrEmpty(expected.SemanticKey)
                        && expected.SemanticKey == hit.SemanticKey
                    )
                    || (
                        expected.Row == hit.Row
                        && expected.Column == hit.Column
                    )
                );
        }

        private static string DescribeTarget(GemDuelViewTarget target)
        {
            if (target == null)
            {
                return "no target";
            }

            var id =
                !string.IsNullOrEmpty(target.BuffId) ? target.BuffId :
                !string.IsNullOrEmpty(target.InstanceId) ? target.InstanceId :
                !string.IsNullOrEmpty(target.RoyalId) ? target.RoyalId :
                !string.IsNullOrEmpty(target.GemId) ? target.GemId :
                target.EventType;
            var location = target.Row >= 0 || target.Column >= 0
                ? " r" + target.Row + "c" + target.Column
                : string.Empty;
            var key = string.IsNullOrEmpty(target.SemanticKey)
                ? string.Empty
                : " [" + target.SemanticKey + "]";
            return target.Kind + (string.IsNullOrEmpty(id) ? string.Empty : " " + id) + location + key;
        }

        private void LoadFixture(string fixtureFileName)
        {
            var fixturePath = RepositoryPaths.ResolveFromRoot("fixtures", "replay-golden", fixtureFileName);
            var replay = JsonConvert.DeserializeObject<ReplayVNext>(File.ReadAllText(fixturePath));
            LoadReplayForReview(replay);
        }

        private void LoadReplayForReview(ReplayVNext replay)
        {
            if (replay == null)
            {
                throw new InvalidOperationException("Replay JSON could not be parsed.");
            }

            replay.Events = replay.Events ?? new List<JObject>();
            replay.Checkpoints = replay.Checkpoints ?? new List<ReplayCheckpoint>();
            var loader = new CatalogLoader();
            var replayCatalog = loader.LoadDefault();
            var bootstrapState = ValidateReplayForReview(loader, replayCatalog, replay);
            catalog = replayCatalog;
            activeReplay = replay;
            liveRecordedReplay = null;
            activeRulesInit = new JObject();
            currentState = bootstrapState;
            nextFixtureEventIndex = 0;
            isMainMenu = false;
            selectedGemCoords.Clear();
            previewContext = null;
            hoverContext = null;
            settingsOpen = false;
            settingsSurfaceDropdownOpen = false;
            rulebookOpen = false;
            errorBanner = string.Empty;
            ClearPreviewBackgroundTexture();
        }

        private GameState ValidateReplayForReview(
            CatalogLoader loader,
            UnityCatalog replayCatalog,
            ReplayVNext replay
        )
        {
            if (replay.SchemaVersion != "1.0")
            {
                throw new InvalidOperationException(
                    "Unsupported replay schema version: " + (replay.SchemaVersion ?? "null")
                );
            }

            if (replay.Init == null)
            {
                throw new InvalidOperationException("Replay is missing an init snapshot.");
            }

            if (replay.Summary == null)
            {
                throw new InvalidOperationException("Replay is missing a summary.");
            }

            if (replay.Summary.TotalEvents != replay.Events.Count)
            {
                throw new InvalidOperationException(
                    "Replay summary totalEvents mismatch: expected "
                        + replay.Events.Count
                        + " got "
                        + replay.Summary.TotalEvents
                        + "."
                );
            }

            ValidateReplayInitShape(replay.Init);
            loader.ValidateReplayReferences(replayCatalog, replay);
            var bootstrapState = ReplayBootstrapper.Bootstrap(replay);
            var finalState = ReplayBootstrapper.Bootstrap(replay);
            var validator = new GameReducer();
            for (var index = 0; index < replay.Events.Count; index += 1)
            {
                var result = validator.ApplyReplayEvent(finalState, replay.Events[index], replay.Checkpoints);
                if (!result.Ok)
                {
                    throw new InvalidOperationException(
                        "Replay event "
                            + index
                            + " could not be reviewed: "
                            + result.Error
                    );
                }

                var checkpoint = replay.Checkpoints.FirstOrDefault(
                    candidate => candidate.Revision == finalState.Revision
                );
                if (checkpoint != null)
                {
                    finalState.LoadReplayAuditSnapshot(
                        GameReducer.NormalizeReplayAuditSnapshot(checkpoint.State),
                        checkpoint.Revision
                    );
                }
            }

            var finalHash = new ReplayStateHasher().Hash(finalState);
            if (!string.IsNullOrEmpty(replay.Summary.FinalStateHash) && finalHash != replay.Summary.FinalStateHash)
            {
                throw new InvalidOperationException(
                    "Replay summary finalStateHash mismatch: expected "
                        + replay.Summary.FinalStateHash
                        + " got "
                        + finalHash
                        + "."
                );
            }

            if (replay.Summary.Winner != finalState.Winner)
            {
                throw new InvalidOperationException(
                    "Replay summary winner mismatch: expected "
                        + (replay.Summary.Winner ?? "null")
                        + " got "
                        + (finalState.Winner ?? "null")
                        + "."
                );
            }

            return bootstrapState;
        }

        private static void ValidateReplayInitShape(ReplayInitSnapshot init)
        {
            if (init == null)
            {
                throw new InvalidOperationException("Replay is missing an init snapshot.");
            }

            if (init.ActionType != "INIT" && init.ActionType != "INIT_DRAFT")
            {
                throw new InvalidOperationException(
                    "Replay init actionType is unsupported: " + (init.ActionType ?? "null") + "."
                );
            }

            if (init.Mode != "LOCAL_PVP")
            {
                throw new InvalidOperationException(
                    "Replay init mode is unsupported: " + (init.Mode ?? "null") + "."
                );
            }

            if (init.HostPlayer != "p1" && init.HostPlayer != "p2")
            {
                throw new InvalidOperationException(
                    "Replay init hostPlayer is invalid: " + (init.HostPlayer ?? "null") + "."
                );
            }

            ValidateReplayInitBoard(init.Board);
            ValidateReplayInitGemArray(init.Bag, "bag");

            if (init.CardInstances == null || init.CardInstances.Count == 0)
            {
                throw new InvalidOperationException("Replay init cardInstances must not be empty.");
            }

            var seenCardInstances = new HashSet<string>(StringComparer.Ordinal);
            ValidateReplayInitCardGroups(
                init.Market,
                "market",
                ReplayInitMarketSlotsByLevel,
                init.CardInstances,
                seenCardInstances
            );
            ValidateReplayInitCardGroups(
                init.Decks,
                "decks",
                null,
                init.CardInstances,
                seenCardInstances
            );
            ValidateReplayInitStringList(init.RoyalDeck, "royalDeck");
            if (init.ActionType == "INIT_DRAFT")
            {
                ValidateReplayInitStringList(init.DraftPool, "draftPool");
                if (init.DraftPool == null || init.DraftPool.Count == 0)
                {
                    throw new InvalidOperationException("Replay init draftPool must not be empty for INIT_DRAFT.");
                }
            }
        }

        private static void ValidateReplayInitBoard(JArray board)
        {
            if (board == null || board.Count != 5)
            {
                throw new InvalidOperationException("Replay init board must contain 5 rows.");
            }

            for (var rowIndex = 0; rowIndex < board.Count; rowIndex += 1)
            {
                if (!(board[rowIndex] is JArray row) || row.Count != 5)
                {
                    throw new InvalidOperationException(
                        "Replay init board row " + rowIndex + " must contain 5 cells."
                    );
                }

                ValidateReplayInitGemArray(row, "board row " + rowIndex);
            }
        }

        private static void ValidateReplayInitGemArray(JArray gems, string label)
        {
            if (gems == null)
            {
                throw new InvalidOperationException("Replay init " + label + " must be an array.");
            }

            for (var index = 0; index < gems.Count; index += 1)
            {
                var gem = gems[index]?.Value<string>();
                if (string.IsNullOrWhiteSpace(gem) || !GemOrder.Contains(gem))
                {
                    throw new InvalidOperationException(
                        "Replay init " + label + " contains invalid gem at index " + index + "."
                    );
                }
            }
        }

        private static void ValidateReplayInitCardGroups(
            JObject groups,
            string label,
            int[] expectedCounts,
            Dictionary<string, string> cardInstances,
            HashSet<string> seenCardInstances
        )
        {
            if (groups == null)
            {
                throw new InvalidOperationException("Replay init " + label + " must be an object.");
            }

            for (var levelIndex = 0; levelIndex < ReplayInitLevels.Length; levelIndex += 1)
            {
                var level = ReplayInitLevels[levelIndex];
                if (!(groups[level] is JArray cards))
                {
                    throw new InvalidOperationException(
                        "Replay init " + label + " level " + level + " must be an array."
                    );
                }

                if (expectedCounts != null && cards.Count != expectedCounts[levelIndex])
                {
                    throw new InvalidOperationException(
                        "Replay init "
                            + label
                            + " level "
                            + level
                            + " must contain "
                            + expectedCounts[levelIndex]
                            + " cards."
                    );
                }

                for (var cardIndex = 0; cardIndex < cards.Count; cardIndex += 1)
                {
                    var instanceId = cards[cardIndex]?.Value<string>();
                    if (string.IsNullOrWhiteSpace(instanceId))
                    {
                        throw new InvalidOperationException(
                            "Replay init " + label + " level " + level + " contains an empty card instance."
                        );
                    }

                    if (!cardInstances.ContainsKey(instanceId))
                    {
                        throw new InvalidOperationException(
                            "Replay init "
                                + label
                                + " level "
                                + level
                                + " references missing card instance "
                                + instanceId
                                + "."
                        );
                    }

                    if (!seenCardInstances.Add(instanceId))
                    {
                        throw new InvalidOperationException(
                            "Replay init card instance " + instanceId + " appears more than once."
                        );
                    }
                }
            }
        }

        private static void ValidateReplayInitStringList(IReadOnlyList<string> values, string label)
        {
            if (values == null)
            {
                throw new InvalidOperationException("Replay init " + label + " must be an array.");
            }

            for (var index = 0; index < values.Count; index += 1)
            {
                if (string.IsNullOrWhiteSpace(values[index]))
                {
                    throw new InvalidOperationException(
                        "Replay init " + label + " contains an empty entry at index " + index + "."
                    );
                }
            }
        }

        private float AutomationAspect
        {
            get { return (float)automationViewportWidth / automationViewportHeight; }
        }

        private Vector2 AutomationViewportWorldSize()
        {
            const float worldHeight = 10f;
            return new Vector2(worldHeight * AutomationAspect, worldHeight);
        }

        private void RenderState()
        {
            if (isMainMenu || currentState == null)
            {
                ClearRenderedState();
                CreateRenderedStateRoot();
                RenderMainMenu();
                if (settingsOpen)
                {
                    RenderSettingsOverlay();
                }

                if (rulebookOpen)
                {
                    RenderRulebookOverlay();
                }

                if (!string.IsNullOrEmpty(errorBanner))
                {
                    RenderErrorBanner();
                }

                return;
            }

            if (currentState == null)
            {
                SetStatus("No replay state loaded.");
                return;
            }

            if (currentState.Phase == "DRAFT_PHASE")
            {
                RenderDraftPhase();
                return;
            }

            ClearRenderedState();
            CreateRenderedStateRoot();

            CreatePanel("Shell Semantic Bounds", new Vector3(0f, 0f, 0.45f), AutomationViewportWorldSize(), new Color(0f, 0f, 0f, 0f), false, null, "app.shell");
            CreateImagePanelPx(
                "Shell Background Artwork",
                new Rect(0f, 0f, 1920f, 820f),
                0.43f,
                "surfaces",
                "anime-themes",
                "royal-luxury",
                "dark",
                "shell-background.png"
            );
            CreatePanelPx("Shell Bottom Fill", 0f, 820f, 1920f, 260f, 0.42f, new Color(0.02f, 0.04f, 0.08f));

            RenderTopbar();
            RenderMarket();
            RenderBoard();
            RenderRoyals();
            RenderPlayerZone("p1", new Vector3(-4.4f, -3.85f, 0f));
            RenderPlayerZone("p2", new Vector3(4.4f, -3.85f, 0f));
            RenderReplayActionSurface();
            RenderReplayControls();
            RenderLiveReplayRecordingControls();
            if (previewContext != null)
            {
                RenderPreviewOverlay();
            }

            if (HasActivePeekModal())
            {
                RenderPeekDeckModal();
            }

            if (settingsOpen)
            {
                RenderSettingsOverlay();
            }

            if (rulebookOpen)
            {
                RenderRulebookOverlay();
            }

            if (!string.IsNullOrEmpty(errorBanner))
            {
                RenderErrorBanner();
            }
        }

        private void RenderMainMenu()
        {
            CreatePanel("Shell Background", new Vector3(0f, 0f, 0.45f), AutomationViewportWorldSize(), new Color(0.0f, 0.015f, 0.055f), false, null, "app.shell");
            CreatePanel("Main Menu Surface", new Vector3(0f, 0f, 0.34f), AutomationViewportWorldSize(), new Color(0f, 0f, 0f, 0f), false, null, "main.menu");

            WithTextWeightCompensation(() =>
            {
                CreateRoundedPanelPx("Visual Lab", 1775f, 17f, 128f, 32f, 8f, 1f, new Color(0.23f, 0.55f, 0.72f), new Color(0.01f, 0.04f, 0.09f));
                CreateFlaskIconPx(1789f, 32f, new Color(0.65f, 0.95f, 0.99f));
                CreateText("Visual Lab Title", ViewportPoint(1844f, 30f, -0.02f), "VISUAL LAB", 0.034f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Visual Lab Subtitle", ViewportPoint(1844f, 39f, -0.02f), "SURFACES / MOTION / READABILITY", 0.018f, new Color(0.66f, 0.73f, 0.82f), TextAnchor.MiddleCenter, FontStyle.Bold);

                CreateText("Menu Title", ViewportPoint(960f, 190f, 0f), "宝石：对决", 0.55f, new Color(0.96f, 0.62f, 0.04f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Menu Subtitle", ViewportPoint(960f, 268f, 0f), "战术焕新对决", 0.16f, new Color(0.48f, 0.52f, 0.61f), TextAnchor.MiddleCenter, FontStyle.Normal);

                CreateRoundedPanelPx("Locale Toggle", 858f, 301f, 204f, 57f, 28f, 1f, new Color(0.2f, 0.25f, 0.35f), new Color(0.04f, 0.07f, 0.12f));
                CreateRoundedPanelPx("Locale Toggle Active", 979f, 309f, 75f, 42f, 21f, 0f, new Color(0f, 0f, 0f, 0f), new Color(0.06f, 0.73f, 0.51f), -0.01f);
                CreateText("Locale English", ViewportPoint(922f, 330f, -0.02f), "English", 0.095f, new Color(0.78f, 0.83f, 0.91f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Locale Chinese", ViewportPoint(1017f, 330f, -0.02f), "中文", 0.105f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);

                CreateRoundedPanelPx("Mode Local Card", 558f, 455f, 384f, 239f, 24f, 3f, new Color(0.73f, 0.77f, 0.85f), new Color(0.07f, 0.08f, 0.13f));
                CreateRoundedPanelPx("Mode Rogue Card", 978f, 455f, 384f, 239f, 24f, 3f, new Color(0.73f, 0.77f, 0.85f), new Color(0.07f, 0.08f, 0.13f));
                CreateText("Mode Local Text", ViewportPoint(750f, 552f, -0.02f), "经典模式", 0.19f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode Local Body", ViewportPoint(750f, 612f, -0.02f), "标准规则，纯粹策略。", 0.086f, new Color(0.67f, 0.69f, 0.77f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode Roguelike Text", ViewportPoint(1142f, 552f, -0.02f), "肉鸽模式", 0.18f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateRoundedPanelPx("Mode Rogue Badge", 1233f, 535f, 32f, 32f, 16f, 0f, new Color(0f, 0f, 0f, 0f), new Color(0.61f, 0.28f, 0.94f), -0.01f);
                CreateText("Mode Rogue Badge Text", ViewportPoint(1249f, 551f, -0.02f), "新", 0.065f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode Roguelike Body", ViewportPoint(1142f, 612f, -0.02f), "随机起始增益与不同流派展开。", 0.08f, new Color(0.67f, 0.69f, 0.77f), TextAnchor.MiddleCenter, FontStyle.Bold);
            });

            CreatePanelPx("Visual Lab Semantic Target", 1775f, 17f, 128f, 32f, -0.08f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "Mode";
                target.EventType = "open_visual_lab";
            }, "mode.visualLab");

            var localModeRect = new Rect(558f, 455f, 384f, 239f);
            CreatePanelPx("Mode Local Semantic Target", localModeRect.x, localModeRect.y, localModeRect.width, localModeRect.height, -0.08f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "Mode";
                target.EventType = "start_local_game";
            }, "mode.local");

            var roguelikeModeRect = new Rect(978f, 455f, 384f, 239f);
            CreatePanelPx("Mode Roguelike Semantic Target", roguelikeModeRect.x, roguelikeModeRect.y, roguelikeModeRect.width, roguelikeModeRect.height, -0.08f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "Mode";
                target.EventType = "start_roguelike_game";
            }, "mode.roguelike");

            CreatePanelPx("Menu Divider", 800f, 792f, 320f, 1f, new Color(0.08f, 0.11f, 0.18f));
                CreateRoundedPanelPx("Mode Online", 672f, 817f, 263f, 118f, 24f, 3f, new Color(0.06f, 0.21f, 0.43f), new Color(0.02f, 0.05f, 0.14f));
                CreateRoundedPanelPx("Mode LAN", 960f, 817f, 288f, 118f, 24f, 3f, new Color(0.02f, 0.35f, 0.29f), new Color(0.012f, 0.059f, 0.114f));
            WithTextWeightCompensation(() =>
            {
                CreateGlobeIconPx(738f, 876f, new Color(0.38f, 0.65f, 0.98f));
                CreateText("Mode Online Text", ViewportPoint(829f, 864f, -0.02f), "在线对决", 0.14f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode Online Body", ViewportPoint(829f, 896f, -0.02f), "远程多人联机", 0.073f, new Color(0.58f, 0.63f, 0.73f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateRadioIconPx(1026f, 876f, new Color(0.2f, 0.83f, 0.6f));
                CreateText("Mode LAN Text", ViewportPoint(1149f, 864f, -0.02f), "局域网对决", 0.14f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Mode LAN Body", ViewportPoint(1149f, 896f, -0.02f), "自动匹配附近玩家", 0.073f, new Color(0.58f, 0.63f, 0.73f), TextAnchor.MiddleCenter, FontStyle.Bold);
            });
            CreatePanelPx("Mode Online Semantic Target", 672f, 817f, 263f, 118f, -0.08f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "Mode";
                target.EventType = "open_online";
            }, "mode.online");
            CreatePanelPx("Mode LAN Semantic Target", 960f, 817f, 288f, 118f, -0.08f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "Mode";
                target.EventType = "open_lan";
            }, "mode.lan");
            CreateText("Menu Footer", ViewportPoint(960f, 1059f, -0.02f), "选择一个模式开始", 0.024f, new Color(0.43f, 0.46f, 0.55f), TextAnchor.MiddleCenter);
            CreateActionButtonPx(
                "规则",
                "open_rulebook",
                648f,
                963f,
                152f,
                54f,
                new Color(0.28f, 0.24f, 0.43f),
                "chrome.rulebook"
            );
            CreateActionButtonPx(
                "导入回放",
                "replay_import_localdev",
                826f,
                963f,
                268f,
                54f,
                new Color(0.08f, 0.33f, 0.48f),
                "replay.import.localdev"
            );
            CreateActionButtonPx(
                "设置",
                "open_settings",
                1120f,
                963f,
                152f,
                54f,
                new Color(0.2f, 0.3f, 0.42f),
                "settings.control"
            );
        }

        private void RenderDraftPhase()
        {
            ClearRenderedState();
            CreateRenderedStateRoot();
            CreateImagePanel("Draft Background", new Vector3(0f, 0f, 0.45f), AutomationViewportWorldSize(), GetDraftBackgroundTexture(), false, null, "app.shell");
            WithTextWeightCompensation(() =>
            {
                var currentDraftLevel = GetCurrentDraftLevel();
                CreateText("Draft Shell Label", ViewportPoint(1840f, 29f, 0f), "▱ 草稿自定义", 0.055f, new Color(0.95f, 0.72f, 0.05f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateRoundedPanelPx("Draft Customize Panel", 1552f, 58f, 352f, 82f, 22f, 1f, new Color(0.08f, 0.11f, 0.2f), new Color(0.01f, 0.02f, 0.06f, 0.92f));
                CreateRoundedPanelPx("Draft Refresh Button", 1563f, 75f, 126f, 48f, 14f, 0f, new Color(0f, 0f, 0f, 0f), new Color(0.86f, 0.57f, 0.0f), -0.01f);
                CreateText("Draft Refresh Text", ViewportPoint(1626f, 100f, -0.02f), "↻  刷新池", 0.075f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreatePanelPx("Draft Refresh Target", 1563f, 75f, 126f, 48f, -0.04f, new Color(0f, 0f, 0f, 0f), true, target =>
                {
                    target.Kind = "ActionButton";
                    target.EventType = "reroll-draft";
                    target.Level = currentDraftLevel;
                }, "draft.refresh");
                CreatePanelPx("Draft Customize Divider", 1706f, 80f, 1f, 36f, -0.01f, new Color(0.16f, 0.18f, 0.27f));
                CreateText("Draft L1", ViewportPoint(1757f, 100f, -0.02f), "L1", 0.068f, new Color(0.58f, 0.63f, 0.73f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Draft L2", ViewportPoint(1810f, 100f, -0.02f), "L2", 0.068f, new Color(0.58f, 0.63f, 0.73f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateDraftLevelTarget(1, 1733f, currentDraftLevel);
                CreateDraftLevelTarget(2, 1786f, currentDraftLevel);
                CreateDraftLevelTarget(3, 1840f, currentDraftLevel);
                CreateText("Draft L3", ViewportPoint(1864f, 100f, -0.02f), "L3", 0.068f, currentDraftLevel == 3 ? new Color(0.16f, 0.11f, 0.02f) : new Color(0.58f, 0.63f, 0.73f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Draft Header", ViewportPoint(960f, 168f, 0f), "✧ 肉鸽选增益 ✧", 0.4f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Draft Mode", ViewportPoint(960f, 225f, 0f), "三级规则改变选秀", 0.2f, new Color(0.62f, 0.62f, 0.72f), TextAnchor.MiddleCenter, FontStyle.Bold);
            });
            CreateRoundedPanelPx("Draft Player Pill", 822f, 311f, 276f, 80f, 40f, 2f, new Color(0.02f, 0.73f, 0.55f), new Color(0.0f, 0.18f, 0.17f, 0.78f));
            WithTextWeightCompensation(() =>
            {
                CreateText("Draft Player Shield", ViewportPoint(879f, 352f, -0.02f), "♢", 0.14f, new Color(0.04f, 0.78f, 0.58f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Draft Player", ViewportPoint(987f, 353f, -0.02f), DraftPromptLabel(), 0.2f, new Color(0.04f, 0.78f, 0.58f), TextAnchor.MiddleCenter, FontStyle.Bold);
            });

            var draftPool = GetVisibleDraftPool();
            const float cardWidth = 384f;
            const float gap = 36f;
            var startX = (1920f - draftPool.Count * cardWidth - Math.Max(0, draftPool.Count - 1) * gap) * 0.5f;
            const float rootWidth = 1644f;
            const float rootX = (1920f - rootWidth) * 0.5f;
            CreatePanelPx(
                "Draft Card Scale Reference",
                rootX,
                440f,
                rootWidth,
                480f,
                -0.07f,
                new Color(0f, 0f, 0f, 0f),
                false,
                null,
                "draft.root"
            );
            for (var index = 0; index < draftPool.Count; index += 1)
            {
                var buffId = draftPool[index];
                var copy = ResolveDraftBuffCopy(buffId);
                RenderDraftCard(
                    startX + index * (cardWidth + gap),
                    index,
                    buffId,
                    copy.Icon,
                    copy.Category,
                    copy.Title,
                    copy.Description,
                    copy.FooterLabel,
                    copy.FooterValue
                );
            }

            RenderReplayControls();
            RenderLiveReplayRecordingControls();
            RenderTopbarControls();
            if (settingsOpen)
            {
                RenderSettingsOverlay();
            }

            if (rulebookOpen)
            {
                RenderRulebookOverlay();
            }

            if (!string.IsNullOrEmpty(errorBanner))
            {
                RenderErrorBanner();
            }
        }

        private List<string> GetVisibleDraftPool()
        {
            if (currentState == null)
            {
                return new List<string>();
            }

            var snapshot = currentState.Snapshot;
            var turn = snapshot.Value<string>("turn") ?? "p1";
            var poolToken = turn == "p2" && snapshot["p2DraftPool"] is JArray p2Pool
                ? p2Pool
                : snapshot["draftPool"] as JArray;
            return poolToken == null
                ? new List<string>()
                : poolToken.Values<string>().Where(value => !string.IsNullOrEmpty(value)).ToList();
        }

        private int GetCurrentDraftLevel()
        {
            if (currentState == null)
            {
                return 3;
            }

            var snapshot = currentState.Snapshot;
            if (snapshot.Value<string>("turn") == "p2")
            {
                return snapshot.Value<int?>("p2DraftLevel")
                    ?? snapshot.Value<int?>("buffLevel")
                    ?? 3;
            }

            return snapshot.Value<int?>("buffLevel") ?? 3;
        }

        private void CreateDraftLevelTarget(int level, float x, int currentDraftLevel)
        {
            if (currentDraftLevel == level)
            {
                CreateRoundedPanelPx(
                    "Draft L" + level + " Active",
                    x,
                    75f,
                    48f,
                    48f,
                    12f,
                    0f,
                    new Color(0f, 0f, 0f, 0f),
                    new Color(1f, 0.78f, 0.17f),
                    -0.01f
                );
            }

            CreatePanelPx(
                "Draft L" + level + " Target",
                x,
                75f,
                48f,
                48f,
                -0.04f,
                new Color(0f, 0f, 0f, 0f),
                true,
                target =>
                {
                    target.Kind = "ActionButton";
                    target.EventType = "reroll-draft";
                    target.Level = level;
                },
                "draft.level." + level
            );
        }

        private string DraftPromptLabel()
        {
            var player = currentState?.Snapshot.Value<string>("turn") == "p2" ? "P2" : "P1";
            var count = GetVisibleDraftPool().Count;
            return player + "：" + Math.Max(1, count) + " 选 1";
        }

        private bool IsHovered(string semanticKey)
        {
            return hoverContext != null && hoverContext.SemanticKey == semanticKey;
        }

        private bool IsHoveredAction(string eventType, string semanticKey = null)
        {
            if (hoverContext == null || hoverContext.Kind != "ActionButton")
            {
                return false;
            }

            if (!string.IsNullOrEmpty(semanticKey) && hoverContext.SemanticKey == semanticKey)
            {
                return true;
            }

            return hoverContext.EventType == eventType;
        }

        private static bool IsStableActionHoverTarget(string eventType)
        {
            switch (eventType)
            {
                case "open_rulebook":
                case "close_rulebook":
                case "rulebook_prev":
                case "rulebook_next":
                case "restart_local_pvp":
                case "open_settings":
                case "preview-close":
                case "preview-buy":
                case "preview-reserve":
                case "confirm-gems":
                case "cancel-gems":
                case "replenish":
                case "peek-deck":
                case "close-modal":
                case "activate-privilege":
                    return true;
                default:
                    return false;
            }
        }

        private DraftBuffCopy ResolveDraftBuffCopy(string buffId)
        {
            var fallback = catalog != null && catalog.Buffs.TryGetValue(buffId, out var buff)
                ? buff
                : null;
            switch (buffId)
            {
                case "collector":
                    return new DraftBuffCopy("⚡", "控制", "收藏狂人", "你可以从对手的保留区直接保留卡牌。", "声望值:", "22");
                case "royal_envoy":
                    return new DraftBuffCopy("🏆", "胜利", "皇家特使", "在你的第 5 个回合完整结算后，拿取 1\n张剩余皇室卡。", "单色分数获胜:", "关闭");
                case "minimalist":
                    return new DraftBuffCopy("◎", "经济", "极简主义", "你购买的前 2 张卡提供双倍奖励。\n宝石持有上限：8。", string.Empty, string.Empty);
                case "echo_reservoir":
                    return new DraftBuffCopy("◉", "情报", "蓄能回响", "记住对手上一张已购买发展卡的特殊能力。\n你每次购买发展卡时都会结算一次回响，并在结算后清空记忆。", string.Empty, string.Empty);
                case "wonder_architect":
                    return new DraftBuffCopy("◇", "胜利", "奇观建筑师", "你的皇家卡和特殊得分路线更容易\n形成终局压力。", string.Empty, string.Empty);
                default:
                    return new DraftBuffCopy(
                        IconForBuffCategory(fallback?.Category),
                        CategoryLabelForBuff(fallback?.Category),
                        fallback?.Label ?? buffId,
                        ShortLabel(fallback?.Description ?? buffId, 56),
                        string.Empty,
                        string.Empty
                    );
            }
        }

        private static string IconForBuffCategory(string category)
        {
            switch (category)
            {
                case "control":
                    return "⚡";
                case "victory":
                    return "🏆";
                case "economy":
                    return "◎";
                case "intel":
                    return "◉";
                case "discount":
                    return "◆";
                default:
                    return "✧";
            }
        }

        private static string CategoryLabelForBuff(string category)
        {
            switch (category)
            {
                case "control":
                    return "控制";
                case "victory":
                    return "胜利";
                case "economy":
                    return "经济";
                case "intel":
                    return "情报";
                case "discount":
                    return "折扣";
                default:
                    return "增益";
            }
        }

        private void RenderDraftCard(
            float x,
            int index,
            string buffId,
            string icon,
            string category,
            string title,
            string description,
            string footerLabel,
            string footerValue
        )
        {
            var semanticKey = "draft.buff." + index;
            var isHovered = IsHovered(semanticKey);
            if (isHovered)
            {
                CreateHoverFramePx("Draft Hover " + title, x - 8f, 432f, 400f, 496f, 28f, -0.06f);
            }

            CreateRoundedPanelPx("Draft Card " + title, x, 440f, 384f, 480f, 24f, 3f, new Color(0.95f, 0.68f, 0.04f), new Color(0.15f, 0.08f, 0.085f));
            CreatePanelPx("Draft Card Target " + title, x, 440f, 384f, 480f, -0.08f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "Buff";
                target.EventType = "select_buff";
                target.Index = index;
                target.BuffId = buffId;
            }, semanticKey);
            CreateRoundedPanelPx("Draft Icon " + title, x + 32f, 472f, 56f, 56f, 16f, 0f, new Color(0f, 0f, 0f, 0f), new Color(0.32f, 0.21f, 0.22f), -0.04f);
            CreateRoundedPanelPx("Draft Level " + title, x + 279f, 472f, 68f, 40f, 20f, 1f, new Color(0.41f, 0.32f, 0.31f), new Color(0.23f, 0.11f, 0.12f), -0.04f);
            WithTextWeightCompensation(() =>
            {
                CreateText("Draft Icon Text " + title, ViewportPoint(x + 60f, 502f, -0.02f), icon, 0.16f, new Color(1f, 0.71f, 0.08f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Draft Level Text " + title, ViewportPoint(x + 313f, 493f, -0.02f), "LVL 3", 0.1f, new Color(0.75f, 0.65f, 0.35f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Draft Category " + title, ViewportPoint(x + 331f, 528f, -0.02f), category, 0.07f, new Color(0.7f, 0.58f, 0.34f), TextAnchor.MiddleRight, FontStyle.Bold);
                CreateText("Draft Title " + title, ViewportPoint(x + 33f, 576f, -0.02f), title, 0.195f, isHovered ? Color.white : new Color(1f, 0.93f, 0.54f), TextAnchor.MiddleLeft, FontStyle.Bold);
                CreateText("Draft Description " + title, ViewportPoint(x + 33f, 646f, -0.02f), description, 0.105f, isHovered ? new Color(1f, 0.89f, 0.5f) : new Color(0.86f, 0.74f, 0.33f), TextAnchor.MiddleLeft, FontStyle.Bold);
            });
            CreatePanelPx("Draft Divider " + title, x + 32f, 814f, 318f, 2f, -0.04f, new Color(0.34f, 0.22f, 0.2f));
            if (!string.IsNullOrEmpty(footerLabel))
            {
                WithTextWeightCompensation(() =>
                {
                    CreateText("Draft Footer Label " + title, ViewportPoint(x + 33f, 848f, -0.02f), footerLabel, 0.085f, new Color(0.74f, 0.62f, 0.3f), TextAnchor.MiddleLeft, FontStyle.Bold);
                    CreateText("Draft Footer Value " + title, ViewportPoint(x + 350f, 878f, -0.02f), footerValue, 0.085f, new Color(1f, 0.84f, 0.22f), TextAnchor.MiddleRight, FontStyle.Bold);
                });
            }
        }

        private void RenderPreviewOverlay()
        {
            var isDeckPreview = previewContext != null && previewContext.Source == "deck";
            var isTableauCollectionPreview =
                previewContext != null
                && previewContext.Source == "tableau"
                && previewContext.InstanceIds != null
                && previewContext.InstanceIds.Count > 0;
            var cardLabel = previewContext == null
                ? "Card Preview"
                : isDeckPreview
                    ? "Deck L" + previewContext.Level
                    : isTableauCollectionPreview
                        ? previewContext.Player + " " + previewContext.Color + " stack"
                    : previewContext.InstanceId;
            if (previewBackgroundTexture != null)
            {
                CreateImagePanel(
                    "Preview Blurred Background",
                    new Vector3(0f, 0f, -0.27f),
                    AutomationViewportWorldSize(),
                    previewBackgroundTexture
                );
            }

            CreatePanelPx("Preview Overlay", 0f, 0f, 1920f, 1080f, -0.28f, new Color(0.02f, 0.03f, 0.06f, 0.22f), false, null, "card.preview.overlay");
            CreatePanelPx("Preview Backdrop Target", 0f, 0f, 1920f, 1080f, -0.35f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "ActionButton";
                target.EventType = "preview-close";
            }, "card.preview.backdrop");
            WithTextWeightCompensation(() =>
            {
                CreateText("Preview Title", ViewportPoint(960f, 132f, -0.3f), "C A R D   P R E V I E W", 0.2f, new Color(1f, 0.94f, 0.65f), TextAnchor.MiddleCenter, FontStyle.Bold);
            });
            if (IsHovered("card.preview.close"))
            {
                CreateRoundedPanelPx("Preview Close Hover", 1844f, 20f, 56f, 56f, 28f, 2f, new Color(1f, 0.92f, 0.45f, 0.95f), new Color(1f, 0.88f, 0.2f, 0.08f), -0.355f);
            }
            CreateRoundedPanelPx("Preview Close", 1848f, 24f, 48f, 48f, 24f, 1f, new Color(1f, 1f, 1f, 0.2f), new Color(0.02f, 0.04f, 0.08f, 0.75f), -0.3f);
            CreatePanelPx("Preview Close Target", 1848f, 24f, 48f, 48f, -0.36f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "ActionButton";
                target.EventType = "preview-close";
            }, "card.preview.close");
            CreateText("Preview Close Text", ViewportPoint(1872f, 48f, -0.32f), "×", 0.13f, Color.white, TextAnchor.MiddleCenter);
            if (isTableauCollectionPreview)
            {
                RenderPreviewCardCollection(previewContext.InstanceIds, previewContext.Player, previewContext.Color);
            }
            else
            {
                var previewRect = GetSingleCardPreviewRect();
                if (isDeckPreview)
                {
                    CreateImagePanelPx(
                        "Preview Deck Back L" + previewContext.Level,
                        previewRect,
                        -0.34f,
                        false,
                        null,
                        null,
                        "surfaces",
                        "anime-themes",
                        "royal-luxury",
                        "dark",
                        "market-card-back-l" + previewContext.Level + ".png"
                    );
                }
                else if (!string.IsNullOrEmpty(cardLabel))
                {
                    CreateCardArtwork("Preview Card", cardLabel, previewRect, -0.34f);
                }
                else
                {
                    CreatePanelPx("Preview Card", previewRect.x, previewRect.y, previewRect.width, previewRect.height, -0.34f, new Color(0.86f, 0.83f, 0.74f));
                }
                CreatePanelPx("Preview Card Hit Blocker", previewRect.x, previewRect.y, previewRect.width, previewRect.height, -0.37f, new Color(0f, 0f, 0f, 0f), true, target =>
                {
                    target.Kind = "PreviewCard";
                    target.EventType = "preview-card";
                    target.InstanceId = cardLabel;
                }, "card.preview.card");
            }
            var showMarketBuyAction = CanShowMarketPreviewAction();
            var showReservedBuyAction = CanShowReservedPreviewBuyAction();
            var showMarketReserveAction = CanShowMarketPreviewReserveAction();
            var showReservedDiscardAction = CanShowReservedPreviewDiscardAction();
            if (showMarketBuyAction || showReservedBuyAction)
            {
                CreatePreviewActionButtonPx(
                    "购买",
                    "preview-buy",
                    768f,
                    905.2f,
                    184f,
                    56f,
                    new Color(0.24f, 0.5f, 0.32f),
                    "card.preview.primaryAction"
                );
            }

            if (showReservedDiscardAction)
            {
                CreatePreviewActionButtonPx(
                    "弃置",
                    "preview-discard",
                    showReservedBuyAction ? 568f : 768f,
                    905.2f,
                    184f,
                    56f,
                    new Color(0.62f, 0.18f, 0.24f),
                    "card.preview.action.discard"
                );
            }

            if (showMarketReserveAction || CanConfirmDeckReserveAction())
            {
                var reserveActionX = isDeckPreview && !showMarketBuyAction ? 868f : 968f;
                var reserveActionY = 905.2f;
                var reserveActionWidth = 184f;
                var reserveActionHeight = 56f;
                if (isDeckPreview && !showMarketBuyAction)
                {
                    var viewportWidth = Math.Max(1f, automationViewportWidth);
                    var viewportHeight = Math.Max(1f, automationViewportHeight);
                    var actualButtonWidth = 184f;
                    var actualButtonHeight = 56f;
                    var actualBottom = Mathf.Clamp(viewportHeight * 0.11f, 72f, 150f);
                    reserveActionX = ((viewportWidth - actualButtonWidth) * 0.5f) * 1920f / viewportWidth;
                    reserveActionY = (viewportHeight - actualBottom - actualButtonHeight) * 1080f / viewportHeight;
                    reserveActionWidth = actualButtonWidth * 1920f / viewportWidth;
                    reserveActionHeight = actualButtonHeight * 1080f / viewportHeight;
                }
                CreatePreviewActionButtonPx(
                    "保留",
                    "preview-reserve",
                    reserveActionX,
                    reserveActionY,
                    reserveActionWidth,
                    reserveActionHeight,
                    new Color(0.24f, 0.32f, 0.5f),
                    "card.preview.action.reserve"
                );
            }
        }

        private void RenderPreviewCardCollection(IReadOnlyList<string> instanceIds, string player, string color)
        {
            var visibleCount = Math.Min(12, instanceIds.Count);
            var columns = Math.Min(4, Math.Max(1, visibleCount));
            var rows = Math.Max(1, Mathf.CeilToInt(visibleCount / 4f));
            var viewportWidth = Math.Max(1f, automationViewportWidth);
            var viewportHeight = Math.Max(1f, automationViewportHeight);
            var gapPx = viewportWidth < 768f ? 12f : 24f;
            var maxRowWidth = viewportWidth * 0.9f;
            var widthByColumns = (maxRowWidth - gapPx * Math.Max(0, columns - 1)) / columns;
            var availableHeight = Math.Max(180f, viewportHeight - 260f);
            var widthByRows = (availableHeight - gapPx * Math.Max(0, rows - 1)) / rows / CardPreviewAspectRatio;
            var cardWidthPx = Mathf.Round(Mathf.Max(72f, Math.Min(1086f, Math.Min(widthByColumns, widthByRows))));
            var cardHeightPx = Mathf.Round(cardWidthPx * CardPreviewAspectRatio);
            var gridHeightPx = cardHeightPx * rows + gapPx * Math.Max(0, rows - 1);
            var startYPx = (viewportHeight - gridHeightPx) * 0.5f + 16f;

            WithTextWeightCompensation(() =>
            {
                var label = player.ToUpperInvariant() + " " + TableauColorLabel(color) + "  " + instanceIds.Count + " cards";
                CreateText(
                    "Preview Tableau Collection Label",
                    ViewportPoint(960f, 192f, -0.32f),
                    label,
                    0.085f,
                    new Color(0.82f, 0.88f, 0.98f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
            });

            for (var index = 0; index < visibleCount; index += 1)
            {
                var row = index / 4;
                var column = index % 4;
                var rowCount = Math.Min(4, visibleCount - row * 4);
                var rowWidthPx = cardWidthPx * rowCount + gapPx * Math.Max(0, rowCount - 1);
                var xPx = (viewportWidth - rowWidthPx) * 0.5f + column * (cardWidthPx + gapPx);
                var yPx = startYPx + row * (cardHeightPx + gapPx);
                var rect = new Rect(
                    xPx / viewportWidth * 1920f,
                    yPx / viewportHeight * 1080f,
                    cardWidthPx / viewportWidth * 1920f,
                    cardHeightPx / viewportHeight * 1080f
                );
                var instanceId = instanceIds[index];
                CreateCardArtwork("Preview Collection Card " + index, instanceId, rect, -0.34f);
                CreatePanelPx(
                    "Preview Collection Card Target " + index,
                    rect.x,
                    rect.y,
                    rect.width,
                    rect.height,
                    -0.37f,
                    new Color(0f, 0f, 0f, 0f),
                    true,
                    target =>
                    {
                        target.Kind = "PreviewCard";
                        target.EventType = "preview-card";
                        target.InstanceId = instanceId;
                        target.Index = index;
                    },
                    "card.preview.collection." + index
                );
            }
        }

        private static string TableauColorLabel(string color)
        {
            switch (color)
            {
                case "pure-royal":
                    return "纯分/皇室";
                case "red":
                    return "红";
                case "green":
                    return "绿";
                case "blue":
                    return "蓝";
                case "white":
                    return "白";
                case "black":
                    return "黑";
                case "pearl":
                    return "珍珠";
                default:
                    return color ?? string.Empty;
            }
        }

        private Rect GetSingleCardPreviewRect()
        {
            var viewportWidth = Math.Max(1f, automationViewportWidth);
            var viewportHeight = Math.Max(1f, automationViewportHeight);
            var gapPx = 24f;
            var widthByFourCardRow = (viewportWidth * 0.9f - gapPx * 3f) / 4f;
            var availableCardAreaHeight = Math.Max(180f, viewportHeight - 230f);
            var widthByRows = availableCardAreaHeight / CardPreviewAspectRatio;
            var widthPx = Mathf.Round(Mathf.Max(72f, Math.Min(1086f, Math.Min(widthByFourCardRow, widthByRows))));
            var heightPx = Mathf.Round(widthPx * CardPreviewAspectRatio);
            var xPx = (viewportWidth - widthPx) * 0.5f;
            var yPx = (viewportHeight - heightPx) * 0.5f;

            return new Rect(
                xPx / viewportWidth * 1920f,
                yPx / viewportHeight * 1080f,
                widthPx / viewportWidth * 1920f,
                heightPx / viewportHeight * 1080f
            );
        }

        private void RenderRulebookOverlay()
        {
            var pageCount = RulebookPages.Length;
            rulebookPage = Mathf.Clamp(rulebookPage, 0, Math.Max(0, pageCount - 1));
            var canPrev = rulebookPage > 0;
            var canNext = rulebookPage < pageCount - 1;
            var locale = RulebookLocale();
            var isEnglish = locale == "en";
            var page = RulebookPages[rulebookPage];
            var title = page.Title.Text(locale);
            var summary = page.Summary.Text(locale);
            CreatePanelPx("Rulebook Overlay", 0f, 0f, 1920f, 1080f, -0.26f, new Color(0f, 0f, 0f, 0.82f), true, target =>
            {
                target.Kind = "ActionButton";
                target.EventType = "close_rulebook";
            }, "rulebook.overlay");
            CreateRoundedPanelPx("Rulebook Panel", 38.4f, 64.8f, 1843.2f, 950.4f, 16f, 1f, new Color(1f, 0.93f, 0.68f, 0.16f), new Color(0.02f, 0.03f, 0.06f, 0.96f), -0.29f);
            CreatePanelPx("Rulebook Panel Target", 38.4f, 64.8f, 1843.2f, 950.4f, -0.31f, new Color(0f, 0f, 0f, 0f), false, null, "rulebook.panel");
            CreatePanelPx("Rulebook Header", 38.4f, 64.8f, 1843.2f, 92f, -0.32f, new Color(0.01f, 0.02f, 0.05f, 0.78f));
            WithTextWeightCompensation(() =>
            {
                CreateText("Rulebook Chrome Title", ViewportPoint(178f, 112f, -0.34f), isEnglish ? "Rulebook" : "游戏说明书", 0.12f, new Color(1f, 0.94f, 0.65f), TextAnchor.MiddleLeft, FontStyle.Bold);
                CreateText("Rulebook Page Indicator", ViewportPoint(960f, 112f, -0.34f), "PAGE " + (rulebookPage + 1) + " / " + pageCount, 0.09f, new Color(0.74f, 0.8f, 0.92f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Rulebook Source Label", ViewportPoint(1742f, 112f, -0.34f), RulebookSourceOfTruth, 0.047f, new Color(0.54f, 0.62f, 0.76f), TextAnchor.MiddleRight, FontStyle.Bold);
            });

            var navStartX = 74f;
            var navY = 168f;
            var navWidth = 190f;
            var navGap = 8f;
            for (var index = 0; index < pageCount; index += 1)
            {
                var x = navStartX + index * (navWidth + navGap);
                var y = navY;
                var active = index == rulebookPage;
                CreateRoundedPanelPx(
                    "Rulebook Nav " + index,
                    x,
                    y,
                    navWidth,
                    48f,
                    8f,
                    1f,
                    active ? new Color(1f, 0.86f, 0.28f, 0.78f) : new Color(1f, 1f, 1f, 0.08f),
                    active ? new Color(0.93f, 0.7f, 0.1f, 0.92f) : new Color(0.08f, 0.1f, 0.16f, 0.78f),
                    -0.33f
                );
                CreatePanelPx(
                    "Rulebook Nav Target " + index,
                    x,
                    y,
                    navWidth,
                    48f,
                    -0.36f,
                    new Color(0f, 0f, 0f, 0f),
                    index != rulebookPage,
                    target =>
                    {
                        target.Kind = "ActionButton";
                        target.EventType = index < rulebookPage ? "rulebook_prev" : index > rulebookPage ? "rulebook_next" : string.Empty;
                        target.Index = index;
                    },
                    "rulebook.nav." + index
                );
                WithTextWeightCompensation(() =>
                    CreateText(
                        "Rulebook Nav Text " + index,
                        ViewportPoint(x + 12f, y + 25f, -0.37f),
                        (index + 1) + ". " + RulebookPages[index].Title.Text(locale),
                        isEnglish ? 0.043f : 0.052f,
                        active ? new Color(0.04f, 0.05f, 0.08f) : new Color(0.78f, 0.84f, 0.94f),
                        TextAnchor.MiddleLeft,
                        FontStyle.Bold
                    )
                );
            }

            WithTextWeightCompensation(() =>
            {
                CreateText("Rulebook Title", ViewportPoint(156f, 276f, -0.34f), title, isEnglish ? 0.18f : 0.22f, new Color(1f, 0.92f, 0.58f), TextAnchor.MiddleLeft, FontStyle.Bold);
                CreateText("Rulebook Summary", ViewportPoint(156f, 336f, -0.34f), WrapRulebookTextForSingleMesh(summary, isEnglish ? 112 : 58), isEnglish ? 0.065f : 0.078f, new Color(0.86f, 0.9f, 0.96f), TextAnchor.MiddleLeft, FontStyle.Bold);
            });
            RenderRulebookPageSections(page, locale);

            CreateActionButtonPx(
                isEnglish ? "Prev" : "上一页",
                "rulebook_prev",
                156f,
                912f,
                184f,
                56f,
                new Color(0.92f, 0.68f, 0.12f),
                "rulebook.prev",
                canPrev
            );
            CreateActionButtonPx(
                isEnglish ? "Next" : "下一页",
                "rulebook_next",
                1580f,
                912f,
                184f,
                56f,
                new Color(0.92f, 0.68f, 0.12f),
                "rulebook.next",
                canNext
            );
            CreateRoundedPanelPx("Rulebook Close", 1816f, 84f, 48f, 48f, 24f, 1f, new Color(1f, 1f, 1f, 0.2f), new Color(0.02f, 0.04f, 0.08f, 0.86f), -0.34f);
            CreatePanelPx("Rulebook Close Target", 1816f, 84f, 48f, 48f, -0.36f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "ActionButton";
                target.EventType = "close_rulebook";
            }, "rulebook.close");
            CreateText("Rulebook Close Text", ViewportPoint(1840f, 108f, -0.37f), "×", 0.13f, Color.white, TextAnchor.MiddleCenter);
        }

        private void RenderRulebookPageSections(RulebookPageContent page, string locale)
        {
            var sections = page.Sections.Take(4).ToList();
            if (sections.Count == 0)
            {
                return;
            }

            var columns = sections.Count == 1 ? 1 : sections.Count == 3 ? 3 : 2;
            var rows = Mathf.CeilToInt((float)sections.Count / columns);
            var startX = 156f;
            var startY = 390f;
            var areaWidth = 1608f;
            var areaHeight = 486f;
            var gap = 18f;
            var cardWidth = (areaWidth - gap * (columns - 1)) / columns;
            var cardHeight = (areaHeight - gap * (rows - 1)) / rows;
            for (var index = 0; index < sections.Count; index += 1)
            {
                var row = index / columns;
                var column = index % columns;
                RenderRulebookSectionCard(
                    sections[index],
                    locale,
                    startX + column * (cardWidth + gap),
                    startY + row * (cardHeight + gap),
                    cardWidth,
                    cardHeight,
                    columns,
                    index
                );
            }
        }

        private void RenderRulebookSectionCard(
            RulebookSectionContent section,
            string locale,
            float x,
            float y,
            float width,
            float height,
            int columns,
            int index
        )
        {
            var isCallout = section.Type == "callout";
            var isFigure = section.Type == "figure";
            var border = isCallout
                ? new Color(1f, 0.79f, 0.28f, 0.38f)
                : isFigure
                    ? new Color(0.38f, 0.7f, 1f, 0.34f)
                    : new Color(1f, 1f, 1f, 0.1f);
            var fill = isCallout
                ? new Color(0.24f, 0.16f, 0.04f, 0.46f)
                : isFigure
                    ? new Color(0.04f, 0.12f, 0.2f, 0.56f)
                    : new Color(1f, 1f, 1f, 0.045f);
            CreateRoundedPanelPx("Rulebook Section " + index, x, y, width, height, 8f, 1f, border, fill, -0.33f);
            var isEnglish = locale == "en";
            var maxChars = columns == 3
                ? (isEnglish ? 34 : 18)
                : columns == 2
                    ? (isEnglish ? 58 : 30)
                    : (isEnglish ? 104 : 56);
            var lineHeight = isEnglish ? 27f : 29f;
            var bodyFont = isEnglish ? 0.052f : 0.062f;
            var maxLines = Math.Max(2, Mathf.FloorToInt((height - 76f) / lineHeight));
            var lineY = y + 36f;
            WithTextWeightCompensation(() =>
                CreateText(
                    "Rulebook Section Title " + index,
                    ViewportPoint(x + 22f, lineY, -0.37f),
                    section.Title.Text(locale),
                    isEnglish ? 0.059f : 0.071f,
                    isCallout ? new Color(1f, 0.89f, 0.48f) : new Color(1f, 0.88f, 0.55f),
                    TextAnchor.MiddleLeft,
                    FontStyle.Bold
                )
            );

            lineY += 38f;
            var emitted = 0;
            foreach (var item in section.Items)
            {
                var lines = WrapRulebookParagraph("• " + item.Text(locale), maxChars);
                foreach (var line in lines)
                {
                    if (emitted >= maxLines)
                    {
                        WithTextWeightCompensation(() =>
                            CreateText(
                                "Rulebook Section More " + index,
                                ViewportPoint(x + 22f, lineY, -0.37f),
                                "...",
                                bodyFont,
                                new Color(0.72f, 0.78f, 0.88f),
                                TextAnchor.MiddleLeft,
                                FontStyle.Bold
                            )
                        );
                        return;
                    }

                    var lineName = "Rulebook Section Body " + index + "-" + emitted;
                    var currentLineY = lineY;
                    WithTextWeightCompensation(() =>
                        CreateText(
                            lineName,
                            ViewportPoint(x + 22f, currentLineY, -0.37f),
                            line,
                            bodyFont,
                            new Color(0.84f, 0.89f, 0.96f),
                            TextAnchor.MiddleLeft,
                            FontStyle.Bold
                        )
                    );
                    lineY += lineHeight;
                    emitted += 1;
                }
            }
        }

        private string RulebookLocale()
        {
            return settingsLocale == "en" ? "en" : "zh";
        }

        private static string WrapRulebookTextForSingleMesh(string text, int maxChars)
        {
            return string.Join("\n", WrapRulebookParagraph(text, maxChars));
        }

        private static List<string> WrapRulebookParagraph(string text, int maxChars)
        {
            var lines = new List<string>();
            if (string.IsNullOrEmpty(text))
            {
                return lines;
            }

            foreach (var rawParagraph in text.Split('\n'))
            {
                var remaining = rawParagraph.Trim();
                while (remaining.Length > maxChars)
                {
                    var splitAt = remaining.LastIndexOf(' ', Math.Min(maxChars, remaining.Length - 1));
                    if (splitAt < Math.Max(8, maxChars / 2))
                    {
                        splitAt = maxChars;
                    }

                    lines.Add(remaining.Substring(0, splitAt).TrimEnd());
                    remaining = remaining.Substring(splitAt).TrimStart();
                }

                if (remaining.Length > 0)
                {
                    lines.Add(remaining);
                }
            }

            return lines;
        }

        private void RenderSettingsOverlay()
        {
            var rect = SettingsPanelRect();
            const float controlX = SettingsControlX;
            const float controlWidth = SettingsControlWidth;
            const float localeSegmentWidth = SettingsLocaleWidth * 0.5f;
            CreateRoundedPanelPx("Settings Panel", rect.x, rect.y, rect.width, rect.height, 12f, 0.75f, new Color(0.22f, 0.28f, 0.4f), new Color(0.06f, 0.08f, 0.13f, 0.97f), -0.3f);
            CreatePanelPx("Settings Panel Target", rect.x, rect.y, rect.width, rect.height, -0.31f, new Color(0f, 0f, 0f, 0f), false, null, "settings.panel");
            WithTextWeightCompensation(() =>
            {
                CreateText("Settings Title", ViewportPoint(controlX, SettingsTitleY, -0.32f), "设置", SettingsTitleFontSize, new Color(0.78f, 0.84f, 0.94f), TextAnchor.MiddleLeft, FontStyle.Bold);
                CreateText("Settings Locale Label", ViewportPoint(SettingsLocaleX, SettingsLocaleLabelY, -0.32f), "语言", SettingsSectionLabelFontSize, new Color(0.63f, 0.69f, 0.8f), TextAnchor.MiddleLeft, FontStyle.Bold);
            });
            CreateRoundedPanelPx("Settings Locale Segmented", SettingsLocaleX, SettingsLocaleY, SettingsLocaleWidth, SettingsLocaleHeight, 14.25f, 0.75f, new Color(0.2f, 0.28f, 0.42f), new Color(0.04f, 0.08f, 0.15f), -0.32f);
            if (settingsLocale == "en")
            {
                CreateRoundedPanelPx("Settings Locale Active", SettingsLocaleX + 3.75f, SettingsLocaleY + 3.75f, localeSegmentWidth - 7.5f, SettingsLocaleHeight - 7.5f, 10.5f, 0f, new Color(0f, 0f, 0f, 0f), new Color(0.02f, 0.73f, 0.51f), -0.33f);
            }
            else
            {
                CreateRoundedPanelPx("Settings Locale Active", SettingsLocaleX + localeSegmentWidth + 3.75f, SettingsLocaleY + 3.75f, localeSegmentWidth - 7.5f, SettingsLocaleHeight - 7.5f, 10.5f, 0f, new Color(0f, 0f, 0f, 0f), new Color(0.02f, 0.73f, 0.51f), -0.33f);
            }
            CreateSettingsControlTarget("Settings Locale English Target", SettingsLocaleX, SettingsLocaleY, localeSegmentWidth, SettingsLocaleHeight, "settings-locale-en", "settings.locale.en");
            CreateSettingsControlTarget("Settings Locale Chinese Target", SettingsLocaleX + localeSegmentWidth, SettingsLocaleY, localeSegmentWidth, SettingsLocaleHeight, "settings-locale-zh", "settings.locale.zh");
            WithTextWeightCompensation(() =>
            {
                CreateText("Settings Locale English", ViewportPoint(SettingsLocaleX + localeSegmentWidth * 0.5f, SettingsLocaleY + SettingsLocaleHeight * 0.5f, -0.34f), "English", SettingsLocaleFontSize, new Color(0.86f, 0.9f, 0.96f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Settings Locale Chinese", ViewportPoint(SettingsLocaleX + localeSegmentWidth * 1.5f, SettingsLocaleY + SettingsLocaleHeight * 0.5f, -0.34f), "中文", SettingsLocaleFontSize, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
            });
            RenderSettingsRow("Sound", controlX, SettingsRowStartY, settingsSoundEnabled ? "♬" : "×", "音效", false, "settings-sound-toggle", "settings.sound");
            RenderSettingsRow("Replay Save", controlX, SettingsRowStartY + SettingsRowGap, "▣", "保存", false, "settings-save", "settings.save");
            RenderSettingsRow("Replay Load", controlX, SettingsRowStartY + SettingsRowGap * 2f, "▤", "读取", false, "settings-load", "settings.load");
            RenderSettingsRow("Theme", controlX, SettingsRowStartY + SettingsRowGap * 3f, "⚙", SurfaceThemeLabel(settingsSurfaceTheme), true, "settings-surface-control", "settings.surface.control");
            if (settingsSurfaceDropdownOpen)
            {
                var dropdownY = SettingsRowStartY + SettingsRowGap * 4f - 3f;
                var dropdownHeight = 12f + SurfaceThemeVariants.Length * 48f;
                CreateRoundedPanelPx(
                    "Settings Surface Dropdown",
                    controlX,
                    dropdownY,
                    controlWidth,
                    dropdownHeight,
                    12f,
                    1.5f,
                    new Color(0.28f, 0.35f, 0.5f, 0.94f),
                    new Color(0.02f, 0.04f, 0.08f, 0.98f),
                    -0.37f
                );
                for (var index = 0; index < SurfaceThemeVariants.Length; index += 1)
                {
                    var variant = SurfaceThemeVariants[index];
                    RenderSettingsRow(
                        "Theme Option " + variant,
                        controlX + 6f,
                        dropdownY + 6f + index * 48f,
                        variant == settingsSurfaceTheme ? "✓" : " ",
                        SurfaceThemeLabel(variant),
                        false,
                        "settings-surface-" + variant,
                        "settings.surface." + variant,
                        controlWidth - 12f,
                        48f,
                        -0.38f
                    );
                }
            }
        }

        private static Rect SettingsPanelRect()
        {
            return new Rect(SettingsPanelX, SettingsPanelY, SettingsPanelWidth, SettingsPanelHeight);
        }

        private static float ScaleReferenceX(float referencePx, int viewportWidth)
        {
            return referencePx * Math.Max(1, viewportWidth) / 1920f;
        }

        private static float ScaleReferenceY(float referencePx, int viewportHeight)
        {
            return referencePx * Math.Max(1, viewportHeight) / 1080f;
        }

        private static float ScreenFontPx(float worldFontSize, int viewportHeight)
        {
            return worldFontSize / 10f * Math.Max(1, viewportHeight);
        }

        private static JObject BuildReferenceRectSnapshot(Rect rect, int viewportWidth, int viewportHeight)
        {
            return new JObject
            {
                ["x"] = Math.Round(ScaleReferenceX(rect.x, viewportWidth), 2),
                ["y"] = Math.Round(ScaleReferenceY(rect.y, viewportHeight), 2),
                ["width"] = Math.Round(ScaleReferenceX(rect.width, viewportWidth), 2),
                ["height"] = Math.Round(ScaleReferenceY(rect.height, viewportHeight), 2),
            };
        }

        private static string SurfaceThemeLabel(string variant)
        {
            switch (variant)
            {
                case "crystal-anime":
                    return "水晶动漫";
                case "royal-luxury":
                    return "皇室奢华";
                case "dark-arcane":
                    return "暗黑秘法";
                case "clean-boardgame":
                    return "桌游清爽";
                case "pearl-opaline":
                    return "珍珠虹彩";
                case "lotus-porcelain":
                    return "莲瓷";
                default:
                    return variant;
            }
        }

        private void RenderSettingsRow(
            string name,
            float x,
            float y,
            string icon,
            string label,
            bool dropdown,
            string eventType = null,
            string semanticKey = null,
            float rowWidth = SettingsControlWidth,
            float rowHeight = SettingsRowHeight,
            float z = -0.32f
        )
        {
            CreateRoundedPanelPx("Settings Row " + name, x, y, rowWidth, rowHeight, 6f, 0.75f, new Color(0.2f, 0.28f, 0.42f), new Color(0.05f, 0.08f, 0.14f), z);
            if (!string.IsNullOrEmpty(eventType))
            {
                CreateSettingsControlTarget("Settings Row Target " + name, x, y, rowWidth, rowHeight, eventType, semanticKey, z - 0.04f);
            }

            WithTextWeightCompensation(() =>
            {
                CreateText("Settings Row Icon " + name, ViewportPoint(x + 17f, y + rowHeight * 0.5f, z - 0.02f), icon, SettingsIconFontSize, new Color(0.86f, 0.9f, 0.96f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Settings Row Label " + name, ViewportPoint(x + 33f, y + rowHeight * 0.5f, z - 0.02f), label, SettingsRowFontSize, new Color(0.86f, 0.9f, 0.96f), TextAnchor.MiddleLeft, FontStyle.Bold);
                if (dropdown)
                {
                    CreateText("Settings Row Dropdown " + name, ViewportPoint(x + rowWidth - 13f, y + rowHeight * 0.5f, z - 0.02f), "⌄", SettingsRowFontSize, new Color(0.86f, 0.9f, 0.96f), TextAnchor.MiddleCenter, FontStyle.Bold);
                }
            });
        }

        private void CreateSettingsControlTarget(
            string name,
            float x,
            float y,
            float width,
            float height,
            string eventType,
            string semanticKey,
            float z = -0.36f
        )
        {
            CreatePanelPx(name, x, y, width, height, z, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "SettingsControl";
                target.EventType = eventType;
            }, semanticKey);
        }

        private void RenderErrorBanner()
        {
            CreatePanel("Error Banner", new Vector3(0f, 3.72f, -0.35f), new Vector2(5.6f, 0.48f), new Color(0.5f, 0.12f, 0.12f), false, target =>
            {
                target.Kind = "ErrorBanner";
            }, "error.banner");
            CreateText("Error Banner Text", new Vector3(0f, 3.72f, -0.38f), errorBanner, 0.13f, Color.white, TextAnchor.MiddleCenter);
        }

        private void RenderTopbar()
        {
            var p1Crowns = GetCrowns("p1");
            var p2Crowns = GetCrowns("p2");
            var p1Score = GetScore("p1");
            var p2Score = GetScore("p2");
            var p1Turns = GetPlayerTurnCount("p1");
            var p2Turns = GetPlayerTurnCount("p2");

            WithTextWeightCompensation(() =>
            {
                RenderTopbarScoreGroup("p1", 347f, p1Crowns, p1Score);
                RenderTopbarScoreGroup("p2", 1307f, p2Crowns, p2Score);

                CreateRoundedPanelPx("Topbar Turn Core", 814f, 14f, 292f, 36f, 18f, 1f, new Color(0.28f, 0.4f, 0.58f, 0.72f), new Color(0.02f, 0.06f, 0.13f, 0.72f), -0.04f);
                CreateText("Turn P1 Label", ViewportPoint(853f, 31f, -0.06f), "P1", 0.18f, new Color(0.2f, 0.95f, 0.72f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Turn P1 Count", ViewportPoint(888f, 31f, -0.06f), p1Turns.ToString(), 0.15f, new Color(0.2f, 0.95f, 0.72f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Turn P1 Word", ViewportPoint(932f, 31f, -0.06f), "回合", 0.1f, new Color(0.9f, 0.94f, 1f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreatePanelPx("Turn Core Divider", 960f, 21f, 1f, 20f, -0.06f, new Color(0.44f, 0.52f, 0.66f, 0.72f));
                CreateText("Turn P2 Word", ViewportPoint(988f, 31f, -0.06f), "回合", 0.1f, new Color(0.9f, 0.94f, 1f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Turn P2 Count", ViewportPoint(1031f, 31f, -0.06f), p2Turns.ToString(), 0.15f, new Color(0.9f, 0.94f, 1f), TextAnchor.MiddleCenter, FontStyle.Bold);
                CreateText("Turn P2 Label", ViewportPoint(1069f, 31f, -0.06f), "P2", 0.18f, new Color(0.3f, 0.58f, 1f), TextAnchor.MiddleCenter, FontStyle.Bold);

                RenderTurnPointer(currentState.Turn == "p1" ? 848f : 1072f);
                RenderTopbarControls();
            });
        }

        private void RenderTopbarScoreGroup(string player, float x, int crowns, int score)
        {
            CreateRoundedPanelPx(
                player + " Topbar Score Group",
                x - 4f,
                4f,
                276f,
                50f,
                25f,
                1f,
                new Color(0.78f, 0.9f, 1f, 0.34f),
                new Color(0.02f, 0.05f, 0.12f, 0.46f),
                -0.035f
            );
            var crownTextX = x + 79f;
            var scoreIconX = x + 152f;
            var scoreTextX = x + 207f;
            CreateImagePanelPx(player + " Crown Icon", new Rect(x, 0f, 54f, 54f), -0.04f, "ui-icons", "crown-gold-green-screen.png");
            CreateText(player + " Crown Value", ViewportPoint(crownTextX, 31f, -0.06f), crowns.ToString(), 0.3f, new Color(1f, 0.87f, 0.26f), TextAnchor.MiddleCenter, FontStyle.Bold);
            CreateText(player + " Crown Goal", ViewportPoint(crownTextX + 40f, 34f, -0.06f), "/10", 0.17f, new Color(1f, 0.87f, 0.26f), TextAnchor.MiddleCenter, FontStyle.Bold);

            CreateImagePanelPx(player + " Point Icon", new Rect(scoreIconX, 2f, 47f, 55f), -0.04f, "ui-icons", "point-ribbon-silver-short.png");
            CreateText(player + " Point Value", ViewportPoint(scoreTextX, 31f, -0.06f), score.ToString(), 0.3f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
            CreateText(player + " Point Goal", ViewportPoint(scoreTextX + 44f, 34f, -0.06f), "/20", 0.17f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
        }

        private void RenderTurnPointer(float centerX)
        {
            CreatePanelPx("Topbar Pointer Upper", centerX - 6f, 54f, 12f, 28f, -0.06f, new Color(0.98f, 0.72f, 0.12f, 0.95f));
            CreatePanelPx("Topbar Pointer Lower", centerX - 4f, 78f, 8f, 32f, -0.06f, new Color(0.74f, 0.36f, 0.04f, 0.86f));
        }

        private void RenderTopbarControls()
        {
            CreateTopbarControl(1784f, string.Empty, "chrome.rulebook", "open_rulebook");
            CreateTopbarControl(1834f, "↶", "chrome.restart", "restart_local_pvp");
            CreateTopbarControl(1884f, "⚙", "settings.control", "open_settings");
        }

        private void CreateTopbarControl(float centerX, string label, string semanticKey, string eventType)
        {
            if (!string.IsNullOrEmpty(semanticKey) && IsHovered(semanticKey))
            {
                CreateHoverFramePx("Topbar Control Hover " + label, centerX - 27f, 3f, 54f, 54f, 27f, -0.07f);
            }

            CreateRoundedPanelPx("Topbar Control " + label, centerX - 24f, 6f, 48f, 48f, 24f, 1f, new Color(0.72f, 0.78f, 0.9f, 0.56f), new Color(0.03f, 0.04f, 0.08f, 0.68f), -0.04f);
            CreatePanelPx("Topbar Target " + label, centerX - 24f, 6f, 48f, 48f, -0.08f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "ActionButton";
                target.EventType = eventType;
            }, semanticKey);

            if (semanticKey == "chrome.rulebook")
            {
                CreateBookIconPx(centerX, 30f, Color.white, -0.06f);
            }
            else
            {
                CreateText("Topbar Control Label " + label, ViewportPoint(centerX, 30f, -0.06f), label, 0.14f, Color.white, TextAnchor.MiddleCenter, FontStyle.Bold);
            }
        }

        private void RenderBoard()
        {
            var frameRect = BoardFrameRect();
            RenderSharedPrivilegeSupply(frameRect);
            CreateImagePanelPx(
                "Board Frame",
                frameRect,
                0f,
                false,
                null,
                "board.root",
                "surfaces",
                "anime-themes",
                "royal-luxury",
                "dark",
                "gem-panel.png"
            );

            var board = (JArray)currentState.Snapshot["board"];
            for (var row = 0; row < 5; row += 1)
            {
                for (var column = 0; column < 5; column += 1)
                {
                    var gemId = board[row][column].Value<string>();
                    CreateGem(row, column, gemId);
                }
            }
        }

        private void RenderSharedPrivilegeSupply(Rect boardRect)
        {
            var p1Privileges = GetIntAt("privileges", "p1");
            var p2Privileges = GetIntAt("privileges", "p2");
            var remaining = Math.Max(0, SharedPrivilegeSupplySize - (p1Privileges + p2Privileges));
            const float chipWidth = 198f;
            const float chipHeight = 34f;
            var x = boardRect.x + boardRect.width * 0.5f - chipWidth * 0.5f;
            var y = boardRect.y - 43f;
            CreateRoundedPanelPx(
                "Shared Privilege Supply",
                x,
                y,
                chipWidth,
                chipHeight,
                17f,
                1f,
                new Color(1f, 0.84f, 0.28f, 0.28f),
                new Color(0.03f, 0.04f, 0.08f, 0.7f),
                -0.05f
            );
            CreatePanelPx(
                "Shared Privilege Supply Target",
                x,
                y,
                chipWidth,
                chipHeight,
                -0.08f,
                new Color(0f, 0f, 0f, 0f),
                false,
                target =>
                {
                    target.Kind = "PrivilegeSupply";
                    target.InstanceId = remaining.ToString();
                },
                "privilege.supply"
            );

            WithTextWeightCompensation(() =>
            {
                CreateText(
                    "Shared Privilege Supply Label",
                    ViewportPoint(x + 54f, y + chipHeight * 0.5f + 1f, -0.07f),
                    "特权",
                    0.063f,
                    new Color(0.86f, 0.9f, 0.96f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
                CreateText(
                    "Shared Privilege Supply Count",
                    ViewportPoint(x + chipWidth - 36f, y + chipHeight * 0.5f + 1f, -0.07f),
                    remaining + "/" + SharedPrivilegeSupplySize,
                    0.075f,
                    remaining > 0 ? new Color(1f, 0.87f, 0.26f) : new Color(0.55f, 0.6f, 0.7f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
            });

            for (var index = 0; index < SharedPrivilegeSupplySize; index += 1)
            {
                var active = index < remaining;
                var centerX = x + 92f + index * 22f;
                var centerY = y + chipHeight * 0.5f;
                RenderPrivilegeSupplyScrollIcon(centerX, centerY, active);
            }
        }

        private void RenderPrivilegeSupplyScrollIcon(float centerX, float centerY, bool active)
        {
            var shellColor = active ? new Color(1f, 0.82f, 0.22f, 0.86f) : new Color(0.42f, 0.46f, 0.54f, 0.42f);
            var fillColor = active ? new Color(0.18f, 0.1f, 0.02f, 0.82f) : new Color(0.08f, 0.09f, 0.12f, 0.72f);
            CreateRoundedPanelPx("Supply Scroll Shell " + centerX, centerX - 8.5f, centerY - 5f, 17f, 10f, 4f, 0.8f, shellColor, fillColor, -0.07f);
            CreateRoundedPanelPx("Supply Scroll Left " + centerX, centerX - 11f, centerY - 4f, 4.5f, 8f, 2f, 0.6f, shellColor, fillColor, -0.071f);
            CreateRoundedPanelPx("Supply Scroll Right " + centerX, centerX + 6.5f, centerY - 4f, 4.5f, 8f, 2f, 0.6f, shellColor, fillColor, -0.071f);
        }

        private void RenderMarket()
        {
            WithRenderOpacity(0.8f, () =>
            {
                WithTextWeightCompensation(() =>
                    CreateText(
                        "Market Label",
                        ViewportPoint(520f, 126f, 0f),
                        "市场",
                        0.22f,
                        new Color(0.95f, 0.97f, 1f),
                        TextAnchor.MiddleCenter,
                        FontStyle.Bold
                    )
                );
                var market = (JObject)currentState.Snapshot["market"];
                var decks = (JObject)currentState.Snapshot["decks"];
                for (var level = 3; level >= 1; level -= 1)
                {
                    var deckRect = MarketDeckRect(level);
                    CreateDeckBack(level, ((JArray)decks[level.ToString()]).Count, deckRect);
                    var row = (JArray)market[level.ToString()];
                    for (var index = 0; index < row.Count; index += 1)
                    {
                        var instanceId = row[index].Value<string>();
                        var cardRect = MarketCardRect(level, index);
                        CreateMarketCard(instanceId, level, index, cardRect);
                    }
                }
            });
        }

        private void RenderRoyals()
        {
            var featuredRect = RoyalFeaturedRect();
            var panelRect = new Rect(
                featuredRect.x - 16.45f,
                featuredRect.y - 69.4f,
                featuredRect.width + 32.9f,
                featuredRect.height + 83.4f
            );
            CreateRoundedPanelPx(
                "Royals Glass Frame",
                panelRect.x,
                panelRect.y,
                panelRect.width,
                panelRect.height,
                28f,
                1.2f,
                new Color(0.86f, 0.96f, 1f, 0.4f),
                new Color(0.02f, 0.05f, 0.12f, 0.28f),
                -0.02f
            );
            WithTextWeightCompensation(() =>
                CreateText(
                    "Royals Label",
                    ViewportPoint(1644f, 164f, -0.055f),
                    "♕ 皇室区",
                    0.15f,
                    new Color(1f, 0.88f, 0.45f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                )
            );
            CreatePanelPx("Royals Semantic Frame", featuredRect.x, featuredRect.y, featuredRect.width, featuredRect.height, new Color(0f, 0f, 0f, 0f), false, null, "royal.featured");
            var royalDeck = (JArray)currentState.Snapshot["royalDeck"];
            if (royalDeck.Count == 0)
            {
                CreateText("Royals Empty", new Vector3(6.25f, 0.65f, 0f), "Royal deck claimed", 0.16f, new Color(0.86f, 0.8f, 0.62f), TextAnchor.MiddleCenter);
            }

            for (var index = 0; index < Math.Min(4, royalDeck.Count); index += 1)
            {
                CreateRoyalCard(royalDeck[index].Value<string>(), index, RoyalCardRect(index));
            }
        }

        private void RenderPlayerZone(string player, Vector3 center)
        {
            var isActive = currentState.Turn == player && currentState.Winner == null;
            var zoneRect = PlayerZoneRect(player);
            CreateImagePanelPx(
                player + " Zone Frame",
                zoneRect,
                0f,
                false,
                null,
                isActive ? "player.current.zone" : "player.opponent.zone",
                "surfaces",
                "anime-themes",
                "royal-luxury",
                "dark",
                player == "p1" ? "player-zone-p1.png" : "player-zone-p2.png"
            );
            if (isActive)
            {
                var resourcesRect = PlayerResourcesRect(player);
                var scoreRect = PlayerScoreRect(player);
                CreatePanelPx(player + " Resources Target", resourcesRect.x, resourcesRect.y, resourcesRect.width, resourcesRect.height, new Color(0f, 0f, 0f, 0f), false, null, "player.resources");
                CreatePanelPx(player + " Score Target", scoreRect.x, scoreRect.y, scoreRect.width, scoreRect.height, new Color(0f, 0f, 0f, 0f), false, null, "player.score");
            }
            RenderPlayerZoneContent(player, zoneRect, isActive);

            if (isActive)
            {
                var reserved = (JArray)((JObject)currentState.Snapshot["playerReserved"])[player];
                var reservedSlotCount = Math.Min(reserved.Count, 3);
                for (var index = 0; index < reserved.Count; index += 1)
                {
                    var reservedRect = PlayerReservedClickableRect(player, index, reservedSlotCount);
                    CreatePanelPx(
                        player + " Reserved Target " + index,
                        reservedRect.x,
                        reservedRect.y,
                        reservedRect.width,
                        reservedRect.height,
                        -0.14f - index * 0.01f,
                        new Color(0f, 0f, 0f, 0f),
                        true,
                        target =>
                        {
                            target.Kind = "ReservedCard";
                            target.Index = index;
                            target.InstanceId = reserved[index].Value<string>();
                        },
                        "player.reserved." + index
                    );
                }
            }
        }

        private void RenderPlayerZoneContent(string player, Rect zoneRect, bool isActive)
        {
            _ = zoneRect;
            var reservedRect = PlayerReservedColumnRect(player);
            var resourcesRect = PlayerResourcesRect(player);
            var identityRect = PlayerScoreRect(player);

            RenderPlayerReservedColumn(player, reservedRect);
            RenderPlayerResourcesColumn(player, resourcesRect);
            RenderPlayerIdentityColumn(player, identityRect, isActive);
        }

        private void RenderPlayerIdentityColumn(string player, Rect rect, bool isActive)
        {
            var dividerX = player == "p1" ? rect.x : rect.xMax - 1f;
            CreatePanelPx(player + " Identity Divider", dividerX, rect.y + 6f, 1f, rect.height - 12f, -0.07f, new Color(0.32f, 0.39f, 0.5f, 0.55f));

            var accent = player == "p1" ? new Color(0.06f, 0.78f, 0.58f) : new Color(0.18f, 0.45f, 0.95f);
            var muted = new Color(0.63f, 0.69f, 0.78f);
            var avatarCenterX = rect.x + rect.width * 0.5f;
            CreateRoundedPanelPx(
                player + " Avatar Outer",
                avatarCenterX - 30f,
                rect.y + 64f,
                60f,
                60f,
                30f,
                2f,
                isActive ? new Color(1f, 0.84f, 0.28f, 0.82f) : new Color(0.72f, 0.8f, 0.94f, 0.42f),
                new Color(0.02f, 0.05f, 0.12f, 0.68f),
                -0.08f
            );
            CreateRoundedPanelPx(
                player + " Avatar Inner",
                avatarCenterX - 21f,
                rect.y + 73f,
                42f,
                42f,
                21f,
                1f,
                new Color(0.96f, 0.9f, 0.55f, 0.34f),
                isActive ? new Color(accent.r, accent.g, accent.b, 0.22f) : new Color(0.16f, 0.2f, 0.28f, 0.58f),
                -0.09f
            );
            CreateText(player + " Avatar Icon", ViewportPoint(avatarCenterX, rect.y + 94f, -0.1f), player == "p1" ? "♜" : "⚔", 0.105f, isActive ? Color.white : muted, TextAnchor.MiddleCenter, FontStyle.Bold);
            CreateText(player + " Zone Label", ViewportPoint(avatarCenterX, rect.y + 148f, -0.1f), player.ToUpperInvariant(), 0.16f, isActive ? accent : muted, TextAnchor.MiddleCenter, FontStyle.Bold);

            var privileges = GetIntAt("privileges", player);
            var extraPrivileges = GetIntAt("extraPrivileges", player);
            var totalPrivileges = Math.Max(0, privileges + extraPrivileges);
            var canUsePrivilege =
                isActive
                && activeReplay == null
                && currentState != null
                && currentState.Phase == "IDLE"
                && currentState.Winner == null;
            if (totalPrivileges == 0)
            {
                CreateText(player + " Empty Privilege", ViewportPoint(avatarCenterX, rect.y + 193f, -0.1f), "◷", 0.08f, new Color(0.43f, 0.5f, 0.6f), TextAnchor.MiddleCenter);
                return;
            }

            for (var index = 0; index < Math.Min(totalPrivileges, 4); index += 1)
            {
                var column = index % 2;
                var row = index / 2;
                var x = avatarCenterX - 18f + column * 36f;
                var y = rect.y + 178f + row * 34f;
                RenderPlayerPrivilegeScroll(player, index, x, y, index < privileges, canUsePrivilege);
            }
        }

        private void RenderPlayerPrivilegeScroll(
            string player,
            int index,
            float centerX,
            float centerY,
            bool standard,
            bool clickable
        )
        {
            var semanticKey = player == currentState?.Turn ? "player.current.privilege" : "player.opponent.privilege";
            var shellColor = standard
                ? new Color(1f, 0.82f, 0.22f, 0.86f)
                : new Color(1f, 0.62f, 0.12f, 0.9f);
            var fillColor = standard
                ? new Color(0.18f, 0.1f, 0.02f, 0.82f)
                : new Color(0.22f, 0.08f, 0.02f, 0.86f);
            var targetRect = new Rect(centerX - 22f, centerY - 17f, 44f, 34f);
            if (clickable && (IsHoveredAction("activate-privilege", semanticKey) || IsHovered(semanticKey)))
            {
                CreateHoverFramePx(
                    player + " Privilege Scroll Hover " + index,
                    targetRect.x - 3f,
                    targetRect.y - 3f,
                    targetRect.width + 6f,
                    targetRect.height + 6f,
                    12f,
                    -0.13f
                );
            }

            CreateRoundedPanelPx(
                player + " Privilege Scroll Shell " + index,
                centerX - 17f,
                centerY - 10f,
                34f,
                20f,
                8f,
                1f,
                shellColor,
                fillColor,
                -0.1f
            );
            CreateRoundedPanelPx(
                player + " Privilege Scroll Left Cap " + index,
                centerX - 22f,
                centerY - 8f,
                9f,
                16f,
                4.5f,
                0.8f,
                shellColor,
                new Color(0.32f, 0.18f, 0.03f, 0.94f),
                -0.11f
            );
            CreateRoundedPanelPx(
                player + " Privilege Scroll Right Cap " + index,
                centerX + 13f,
                centerY - 8f,
                9f,
                16f,
                4.5f,
                0.8f,
                shellColor,
                new Color(0.32f, 0.18f, 0.03f, 0.94f),
                -0.11f
            );
            CreateText(
                player + " Privilege Scroll Mark " + index,
                ViewportPoint(centerX, centerY, -0.12f),
                "≋",
                0.048f,
                new Color(1f, 0.92f, 0.56f),
                TextAnchor.MiddleCenter,
                FontStyle.Bold
            );

            if (!clickable)
            {
                return;
            }

            CreatePanelPx(
                player + " Privilege Scroll Target " + index,
                targetRect.x,
                targetRect.y,
                targetRect.width,
                targetRect.height,
                -0.14f,
                new Color(0f, 0f, 0f, 0f),
                true,
                target =>
                {
                    target.Kind = "ActionButton";
                    target.EventType = "activate-privilege";
                    target.InstanceId = player;
                    target.Index = index;
                },
                semanticKey
            );
        }

        private void RenderPlayerResourcesColumn(string player, Rect rect)
        {
            var inventory = (JObject)((JObject)currentState.Snapshot["inventories"])[player];
            const float gemSize = 54f;
            const float gemGap = 6f;
            var totalGemWidth = PlayerZoneResourceOrder.Length * gemSize + (PlayerZoneResourceOrder.Length - 1) * gemGap;
            var gemX = rect.x + (rect.width - totalGemWidth) * 0.5f;
            var gemY = rect.y + 12.91f;
            for (var index = 0; index < PlayerZoneResourceOrder.Length; index += 1)
            {
                var gemId = PlayerZoneResourceOrder[index];
                var count = inventory.Value<int>(gemId);
                var gemRect = new Rect(gemX + index * (gemSize + gemGap), gemY, gemSize, gemSize);
                var next = GetNextEvent();
                var liveEventType = string.Empty;
                if (activeReplay == null && count > 0)
                {
                    if (currentState.Phase == "DISCARD_EXCESS_GEMS" && player == currentState.Turn)
                    {
                        liveEventType = "discard_gem";
                    }
                    else if (currentState.Phase == "STEAL_ACTION" && player != currentState.Turn && gemId != "gold")
                    {
                        liveEventType = "steal_gem";
                    }
                }

                var eventType = string.IsNullOrEmpty(liveEventType)
                    ? next?.Value<string>("type") ?? string.Empty
                    : liveEventType;
                var nextActor = next?.Value<string>("actor");
                var semanticTurn =
                    (eventType == "steal_gem" || eventType == "discard_gem") && !string.IsNullOrEmpty(nextActor)
                        ? nextActor
                        : currentState.Turn;
                var semanticKey = player == semanticTurn
                    ? "player.current.gem." + gemId
                    : "player.opponent.gem." + gemId;
                var isReplayActionTarget =
                    next != null &&
                    (
                        (eventType == "discard_gem" && next.Value<string>("actor") == player && next.Value<string>("gemId") == gemId) ||
                        (eventType == "steal_gem" && next.Value<string>("actor") != player && next.Value<string>("gemId") == gemId)
                    );
                var isStateActionTarget =
                    !string.IsNullOrEmpty(liveEventType) ||
                    isReplayActionTarget;
                if (IsHovered(semanticKey))
                {
                    CreateHoverFramePx(
                        player + " Resource Gem Hover " + gemId,
                        gemRect.x - 4f,
                        gemRect.y - 4f,
                        gemRect.width + 8f,
                        gemRect.height + 8f,
                        18f,
                        -0.12f
                    );
                }

                if (isStateActionTarget)
                {
                    CreateHoverFramePx(
                        player + " Resource Gem Action Target " + gemId,
                        gemRect.x - 3f,
                        gemRect.y - 3f,
                        gemRect.width + 6f,
                        gemRect.height + 6f,
                        18f,
                        -0.12f
                    );
                }

                if (count == 0)
                {
                    WithRenderOpacity(0.5f, () => CreateGemArtwork(player + " Resource Gem " + gemId, gemId, gemRect, -0.09f, grayscale: true));
                }
                else
                {
                    CreateGemArtwork(player + " Resource Gem " + gemId, gemId, gemRect, -0.09f);
                }
                CreatePanelPx(
                    player + " Resource Gem Target " + gemId,
                    gemRect.x,
                    gemRect.y,
                    gemRect.width,
                    gemRect.height,
                    -0.14f,
                    new Color(0f, 0f, 0f, 0f),
                    true,
                    target =>
                    {
                        target.Kind = "InventoryGem";
                        target.EventType = isStateActionTarget ? eventType : string.Empty;
                        target.GemId = gemId;
                        target.InstanceId = player;
                    },
                    semanticKey
                );

                var badgeSize = 31f;
                CreateRoundedPanelPx(
                    player + " Resource Count Badge " + gemId,
                    gemRect.xMax - badgeSize + 6f,
                    gemRect.yMax - badgeSize + 6f,
                    badgeSize,
                    badgeSize,
                    badgeSize * 0.5f,
                    0f,
                    new Color(0f, 0f, 0f, 0f),
                    new Color(0.04f, 0.05f, 0.08f, 0.88f),
                    -0.1f
                );
                WithTextWeightCompensation(() =>
                    CreateText(
                        player + " Resource Count " + gemId,
                        ViewportPoint(gemRect.xMax - badgeSize * 0.5f + 6f, gemRect.yMax - badgeSize * 0.5f + 6f, -0.11f),
                        count.ToString(),
                        0.076f,
                        count > 0 ? Color.white : new Color(0.64f, 0.69f, 0.78f),
                        TextAnchor.MiddleCenter,
                        FontStyle.Bold
                    )
                );
            }

            const int stackCount = 6;
            const float stackGap = 6f;
            var stackScale = Mathf.Clamp((rect.width - stackGap * (stackCount - 1)) / (120f * stackCount), 0.46f, 1f);
            var stackWidth = 120f * stackScale;
            var stackHeight = 160f * stackScale;
            var stackX = rect.x + (rect.width - (stackWidth * stackCount + stackGap * (stackCount - 1))) * 0.5f;
            var stackY = rect.y + 82f;
            for (var index = 0; index < PlayerZoneTableauOrder.Length; index += 1)
            {
                var color = PlayerZoneTableauOrder[index];
                var stackRect = new Rect(stackX + index * (stackWidth + stackGap), stackY, stackWidth, stackHeight);
                var cardIds = GetPlayerTableauCardIds(player, color);
                if (cardIds.Count == 0)
                {
                    RenderEmptyTableauSlot(player, color, stackRect);
                }
                else
                {
                    RenderTableauStack(player, color, stackRect, cardIds, stackScale);
                }
            }
        }

        private void RenderPlayerReservedColumn(string player, Rect rect)
        {
            var reserved = (JArray)((JObject)currentState.Snapshot["playerReserved"])[player];
            if (reserved.Count == 0)
            {
                return;
            }

            var slotCount = Math.Min(reserved.Count, 3);

            for (var index = 0; index < slotCount; index += 1)
            {
                var item = reserved[index];
                var instanceId = item.Type == JTokenType.String ? item.Value<string>() : ((JObject)item).Value<string>("instanceId");
                var cardRect = PlayerReservedRect(player, index, slotCount);
                CreateCardArtwork(player + " Reserved Card " + index, instanceId, cardRect, -0.09f);
                CreatePanelPx(
                    player + " Reserved Visual Target " + index,
                    cardRect.x,
                    cardRect.y,
                    cardRect.width,
                    cardRect.height,
                    -0.11f,
                    new Color(0f, 0f, 0f, 0f),
                    false,
                    target =>
                    {
                        target.Kind = "ReservedCardVisual";
                        target.Index = index;
                        target.InstanceId = instanceId;
                    },
                    "player." + player + ".reserved." + index + ".visual"
                );
            }
        }

        private void RenderEmptyTableauSlot(string player, string color, Rect rect)
        {
            CreateRoundedPanelPx(player + " Empty Tableau " + color, rect.x, rect.y, rect.width, rect.height, 4f, 1f, new Color(0.99f, 0.9f, 0.54f, 0.16f), new Color(0.16f, 0.14f, 0.14f, 0.16f), -0.08f);
            if (color != "pure-royal")
            {
                var dotSize = Math.Max(8f, rect.width * 0.16f);
                var dotColor = ColorForGem(color);
                dotColor.a = 0.2f;
                CreateRoundedPanelPx(player + " Empty Tableau Dot " + color, rect.center.x - dotSize * 0.5f, rect.center.y - dotSize * 0.5f, dotSize, dotSize, dotSize * 0.5f, 0f, new Color(0f, 0f, 0f, 0f), dotColor, -0.1f);
            }
        }

        private void RenderTableauStack(string player, string color, Rect rect, IReadOnlyList<string> cardIds, float stackScale)
        {
            var topCardRect = rect;
            for (var index = 0; index < cardIds.Count; index += 1)
            {
                var isTop = index == cardIds.Count - 1;
                var cardRect = new Rect(
                    rect.x + index * (2f * stackScale),
                    rect.y - index * (3f * stackScale),
                    rect.width,
                    rect.height
                );
                if (isTop)
                {
                    topCardRect = cardRect;
                    CreateCardArtwork(player + " Tableau " + color + " " + index, cardIds[index], cardRect, -0.1f);
                }
                else
                {
                    CreateRoundedPanelPx(player + " Tableau Back " + color + " " + index, cardRect.x, cardRect.y, cardRect.width, cardRect.height, 4f, 1f, new Color(0.65f, 0.58f, 0.4f, 0.32f), new Color(0.04f, 0.06f, 0.1f, 0.82f), -0.09f);
                }
            }

            var stats = GetPlayerTableauStats(player, color);
            if (stats.points > 0)
            {
                CreateRoundedPanelPx(player + " Tableau Points " + color, rect.center.x - 15f, rect.center.y - 18f, 30f, 36f, 5f, 1f, new Color(1f, 0.76f, 0.18f), new Color(0.12f, 0.08f, 0.04f, 0.92f), -0.12f);
                CreateText(player + " Tableau Points Text " + color, ViewportPoint(rect.center.x, rect.center.y, -0.13f), stats.points.ToString(), 0.06f, new Color(1f, 0.9f, 0.32f), TextAnchor.MiddleCenter, FontStyle.Bold);
            }

            if (stats.bonus > 0 && color != "pure-royal")
            {
                var badgeSize = 24f;
                CreateRoundedPanelPx(player + " Tableau Bonus " + color, rect.xMax - badgeSize + 4f, rect.yMax - badgeSize + 4f, badgeSize, badgeSize, badgeSize * 0.5f, 1f, new Color(0.08f, 0.1f, 0.14f), ColorForGem(color), -0.12f);
                CreateText(player + " Tableau Bonus Text " + color, ViewportPoint(rect.xMax + 4f - badgeSize * 0.5f, rect.yMax + 4f - badgeSize * 0.5f, -0.13f), stats.bonus.ToString(), 0.045f, TextColorForGem(color), TextAnchor.MiddleCenter, FontStyle.Bold);
            }

            var semanticRole = player == currentState.Turn ? "current" : "opponent";
            var semanticKey = "player." + semanticRole + ".tableau." + color;
            var stackTargetRect = new Rect(
                Math.Min(rect.x, topCardRect.x),
                Math.Min(rect.y, topCardRect.y),
                Math.Max(rect.xMax, topCardRect.xMax) - Math.Min(rect.x, topCardRect.x),
                Math.Max(rect.yMax, topCardRect.yMax) - Math.Min(rect.y, topCardRect.y)
            );
            if (IsHovered(semanticKey))
            {
                CreateHoverFramePx(
                    player + " Tableau Hover " + color,
                    stackTargetRect.x - 3f,
                    stackTargetRect.y - 3f,
                    stackTargetRect.width + 6f,
                    stackTargetRect.height + 6f,
                    6f,
                    -0.13f
                );
            }

            CreatePanelPx(
                player + " Tableau Target " + color,
                stackTargetRect.x,
                stackTargetRect.y,
                stackTargetRect.width,
                stackTargetRect.height,
                -0.14f,
                new Color(0f, 0f, 0f, 0f),
                true,
                target =>
                {
                    target.Kind = "TableauStack";
                    target.EventType = "preview-tableau";
                    target.InstanceId = cardIds[cardIds.Count - 1];
                    target.GemId = color;
                    target.BuffId = player;
                },
                semanticKey
            );
        }

        private void RenderReplayActionSurface()
        {
            var nextEvent = GetNextEvent();
            if (activeReplay == null && currentState != null && currentState.Phase == "SELECT_CARD_COLOR")
            {
                RenderCardColorSelectionControls();
                return;
            }

            if (
                activeReplay == null
                && currentState != null
                && (currentState.Phase == "PRIVILEGE_ACTION" || currentState.Phase == "RESERVE_WAITING_GEM")
            )
            {
                RenderStandaloneCancelAction();
                return;
            }

            if (nextEvent == null)
            {
                if (activeReplay == null && currentState != null && currentState.Phase == "IDLE")
                {
                    if (selectedGemCoords.Count > 0)
                    {
                        RenderTakeGemsSelectionControls(null);
                        return;
                    }

                    RenderReplenishAction();
                    RenderDeckPeekAction();
                }

                return;
            }

            var eventType = nextEvent.Value<string>("type") ?? string.Empty;
            if (eventType == "take_gems")
            {
                RenderTakeGemsSelectionControls(nextEvent);
            }
            else if (eventType == "replenish")
            {
                RenderReplenishAction();
            }
            else if (eventType == "select_buff")
            {
                RenderBuffChoice(nextEvent);
            }
            else if (eventType == "steal_gem" || eventType == "discard_gem")
            {
                CreateText("State Action Label", new Vector3(0f, -1.52f, 0f), eventType == "steal_gem" ? "Steal Gem" : "Discard Gem", 0.13f, Color.white, TextAnchor.MiddleCenter);
                CreateInventoryGemButton(nextEvent.Value<string>("gemId"), eventType, new Vector3(0f, -1.86f, 0f), 0.38f);
            }
        }

        private void RenderReplenishAction()
        {
            var board = BoardFrameRect();
            var bagCount = GetBagCount();
            var enabled = activeReplay != null || CanReplenishBoard();
            var actionWidth = 184f;
            var actionHeight = 56f;
            var actionTopGap = 16f;
            var label = settingsLocale == "zh"
                ? "补给 (" + bagCount + ")"
                : "Replenish (" + bagCount + ")";

            CreateActionButtonPx(
                label,
                "replenish",
                board.x + board.width * 0.5f - actionWidth * 0.5f,
                board.y + board.height + actionTopGap,
                actionWidth,
                actionHeight,
                new Color(0.18f, 0.55f, 0.86f),
                "turn.end",
                enabled
            );
        }

        private int GetBagCount()
        {
            var bag = currentState?.Snapshot["bag"] as JArray;
            return bag == null ? 0 : bag.Count;
        }

        private bool CanReplenishBoard()
        {
            return activeReplay == null
                && currentState != null
                && currentState.Phase == "IDLE"
                && currentState.Winner == null
                && GetBagCount() > 0;
        }

        private void RenderDeckPeekAction()
        {
            if (activeReplay != null || currentState == null || currentState.Phase != "IDLE" || !HasActivePeekDeckAbility())
            {
                return;
            }

            var board = BoardFrameRect();
            var actionWidth = 156f;
            var actionHeight = 44f;
            var actionTopGap = 16f;
            if (UseCompactLiveActionLayout())
            {
                actionWidth = board.width * (126f / 412.87f);
                actionHeight = board.height * (38.36f / 412.87f);
                actionTopGap = board.height * (17.36f / 412.87f);
            }

            CreateActionButtonPx(
                "窥视牌库",
                "peek-deck",
                board.x + board.width * 0.5f + 104f,
                board.y + board.height + actionTopGap,
                actionWidth,
                actionHeight,
                new Color(0.35f, 0.18f, 0.68f),
                "buff.peek"
            );
        }

        private void RenderStandaloneCancelAction()
        {
            var board = BoardFrameRect();
            var actionWidth = 136f;
            var actionHeight = 44f;
            var actionTopGap = 16f;
            if (UseCompactLiveActionLayout())
            {
                actionWidth = board.width * (136.51f / 412.87f);
                actionHeight = board.height * (38.36f / 412.87f);
                actionTopGap = board.height * (17.36f / 412.87f);
            }

            CreateActionButtonPx(
                "取消",
                "cancel-gems",
                board.x + board.width * 0.5f - actionWidth * 0.5f,
                board.y + board.height + actionTopGap,
                actionWidth,
                actionHeight,
                new Color(0.36f, 0.42f, 0.55f),
                "board.selection.cancel"
            );
        }

        private void RenderCardColorSelectionControls()
        {
            var pendingBuy = currentState?.Snapshot["pendingBuy"] as JObject;
            if (pendingBuy == null)
            {
                return;
            }

            var board = BoardFrameRect();
            var swatchSize = 42f;
            var gap = 12f;
            var totalWidth = JokerBonusColorOrder.Length * swatchSize + (JokerBonusColorOrder.Length - 1) * gap;
            var startX = board.x + board.width * 0.5f - totalWidth * 0.5f;
            var y = board.y + board.height + 18f;
            WithTextWeightCompensation(() =>
            {
                CreateText(
                    "Joker Bonus Color Label",
                    ViewportPoint(board.x + board.width * 0.5f, y - 18f, -0.14f),
                    "Bonus Color",
                    0.075f,
                    new Color(1f, 0.94f, 0.65f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
            });

            for (var index = 0; index < JokerBonusColorOrder.Length; index += 1)
            {
                var color = JokerBonusColorOrder[index];
                CreateBonusColorButtonPx(color, startX + index * (swatchSize + gap), y, swatchSize);
            }
        }

        private void RenderTakeGemsSelectionControls(JObject nextEvent)
        {
            _ = nextEvent;
            if (selectedGemCoords.Count == 0)
            {
                return;
            }

            var board = BoardFrameRect();
            var actionWidth = 136f;
            var actionHeight = 44f;
            var actionGap = 16f;
            var actionTopGap = 16f;
            if (UseCompactLiveActionLayout())
            {
                actionWidth = board.width * (136.51f / 412.87f);
                actionHeight = board.height * (38.36f / 412.87f);
                actionGap = board.width * (14f / 412.87f);
                actionTopGap = board.height * (17.36f / 412.87f);
            }

            var valid = ValidateGemSelection(selectedGemCoords, true, out _);
            var totalWidth = actionWidth * 2f + actionGap;
            var x = board.x + board.width * 0.5f - totalWidth * 0.5f;
            var y = board.y + board.height + actionTopGap;
            WithTextWeightCompensation(() =>
            {
                CreateText(
                    "Gem Selection Count",
                    ViewportPoint(board.x + board.width * 0.5f, y - 17f, -0.14f),
                    selectedGemCoords.Count + "/" + MaxTakeGemsSelectionCount,
                    0.085f,
                    valid ? new Color(0.82f, 0.95f, 0.85f) : new Color(1f, 0.72f, 0.4f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
            });
            CreateActionButtonPx(
                "确认",
                "confirm-gems",
                x,
                y,
                actionWidth,
                actionHeight,
                valid ? new Color(0.08f, 0.58f, 0.36f) : new Color(0.38f, 0.28f, 0.18f),
                "board.selection.confirm"
            );
            CreateActionButtonPx(
                "取消",
                "cancel-gems",
                x + actionWidth + actionGap,
                y,
                actionWidth,
                actionHeight,
                new Color(0.36f, 0.42f, 0.55f),
                "board.selection.cancel"
            );
        }

        private void RenderReplayControls()
        {
            if (activeReplay == null || currentState == null)
            {
                return;
            }

            var x = currentState.Phase == "DRAFT_PHASE" ? 1552f : 1524f;
            var y = currentState.Phase == "DRAFT_PHASE" ? 154f : 663f;
            const float width = 253f;
            const float height = 81f;
            CreateRoundedPanelPx(
                "Replay Controls Panel",
                x,
                y,
                width,
                height,
                18f,
                1f,
                new Color(0.86f, 0.96f, 1f, 0.3f),
                new Color(0.02f, 0.05f, 0.12f, 0.18f),
                -0.09f
            );

            CreateReplayControlButton("undo", x + 15f, y + 15f, "↢", nextFixtureEventIndex > 0);
            CreateReplayControlButton("redo", x + width - 69f, y + 15f, "↣", nextFixtureEventIndex < ReplayEventsTotal);

            var currentStep = Math.Max(0, nextFixtureEventIndex);
            var historyLength = ReplayEventsTotal;
            WithTextWeightCompensation(() =>
            {
                CreateText(
                    "Replay Controls Label",
                    ViewportPoint(x + width * 0.5f, y + 28f, -0.12f),
                    "操作",
                    0.06f,
                    new Color(0.72f, 0.78f, 0.88f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
                CreateText(
                    "Replay Controls Count",
                    ViewportPoint(x + width * 0.5f, y + 57f, -0.12f),
                    currentStep + " / " + historyLength,
                    0.12f,
                    Color.white,
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
            });
        }

        private void CreateReplayControlButton(string action, float x, float y, string glyph, bool enabled)
        {
            var border = enabled ? new Color(0.86f, 0.96f, 1f, 0.32f) : new Color(0.45f, 0.52f, 0.64f, 0.3f);
            var fill = enabled ? new Color(0.05f, 0.09f, 0.16f, 0.76f) : new Color(0.03f, 0.05f, 0.09f, 0.5f);
            CreateRoundedPanelPx("Replay " + action + " Button", x, y, 54f, 54f, 12f, 1f, border, fill, -0.11f);
            CreatePanelPx(
                "Replay " + action + " Target",
                x,
                y,
                54f,
                54f,
                -0.135f,
                new Color(0f, 0f, 0f, 0f),
                enabled,
                target =>
                {
                    target.Kind = "ActionButton";
                    target.EventType = "replay_" + action;
                },
                "replay.control." + action
            );
            CreateText(
                "Replay " + action + " Glyph",
                ViewportPoint(x + 27f, y + 27f, -0.125f),
                glyph,
                0.1f,
                enabled ? Color.white : new Color(0.58f, 0.64f, 0.74f),
                TextAnchor.MiddleCenter,
                FontStyle.Bold
            );
        }

        private void RenderLiveReplayRecordingControls()
        {
            // Electron exposes replay save/load through the top-right settings menu.
        }

        private void RenderBuffChoice(JObject nextEvent)
        {
            var buffId = nextEvent.Value<string>("buffId");
            var player = nextEvent.Value<string>("actor");
            CreateText("Buff Prompt", new Vector3(0f, -1.52f, 0f), player.ToUpperInvariant() + " buff draft", 0.13f, Color.white, TextAnchor.MiddleCenter);
            CreatePanel("Buff Card " + buffId, new Vector3(0f, -1.9f, 0f), new Vector2(1.7f, 0.55f), new Color(0.18f, 0.26f, 0.48f), true, target =>
            {
                target.Kind = "Buff";
                target.BuffId = buffId;
            });
            CreateText("Buff Text " + buffId, new Vector3(0f, -1.9f, -0.02f), LabelForBuff(buffId), 0.11f, Color.white, TextAnchor.MiddleCenter);
        }

        private void CreateGem(int row, int column, string gemId)
        {
            var rect = BoardCellRect(row, column);
            var isSelected = selectedGemCoords.Contains(new Vector2Int(row, column));
            var selectedIndex = selectedGemCoords.FindIndex(coord => coord.x == row && coord.y == column);
            var isReserveGoldPrompt = IsReserveGoldPromptGem(row, column, gemId);
            var semanticKey = "board.cell." + row + "." + column;
            if (IsHovered(semanticKey))
            {
                CreateHoverFramePx("Gem Hover " + row + "," + column, rect.x - 3f, rect.y - 3f, rect.width + 6f, rect.height + 6f, 16f, -0.07f);
            }

            if (isSelected)
            {
                CreateRoundedPanelPx(
                    "Gem Selected Highlight " + row + "," + column,
                    rect.x - 6f,
                    rect.y - 6f,
                    rect.width + 12f,
                    rect.height + 12f,
                    18f,
                    5f,
                    new Color(0.22f, 1f, 0.58f, 0.98f),
                    new Color(0.04f, 0.42f, 0.18f, 0.18f),
                    -0.08f
                );
                var badgeSize = 22f;
                CreateRoundedPanelPx(
                    "Gem Selected Badge " + row + "," + column,
                    rect.xMax - badgeSize + 8f,
                    rect.y - 8f,
                    badgeSize,
                    badgeSize,
                    badgeSize * 0.5f,
                    1.5f,
                    new Color(1f, 1f, 1f, 0.92f),
                    new Color(0.04f, 0.34f, 0.16f, 0.96f),
                    -0.09f
                );
                CreateText(
                    "Gem Selected Badge Text " + row + "," + column,
                    ViewportPoint(rect.xMax - badgeSize * 0.5f + 8f, rect.y - 8f + badgeSize * 0.5f, -0.1f),
                    Math.Max(1, selectedIndex + 1).ToString(),
                    0.055f,
                    Color.white,
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
            }

            if (isReserveGoldPrompt)
            {
                CreateRoundedPanelPx(
                    "Reserve Gold Prompt " + row + "," + column,
                    rect.x - 7f,
                    rect.y - 7f,
                    rect.width + 14f,
                    rect.height + 14f,
                    18f,
                    4.5f,
                    new Color(1f, 0.84f, 0.2f, 0.98f),
                    new Color(1f, 0.7f, 0.08f, 0.2f),
                    -0.075f
                );
                CreateRoundedPanelPx(
                    "Reserve Gold Prompt Badge " + row + "," + column,
                    rect.xMax - 13f,
                    rect.y - 13f,
                    24f,
                    24f,
                    12f,
                    1.5f,
                    new Color(1f, 0.96f, 0.62f, 0.92f),
                    new Color(0.5f, 0.25f, 0.02f, 0.96f),
                    -0.09f
                );
                CreateText(
                    "Reserve Gold Prompt Text " + row + "," + column,
                    ViewportPoint(rect.xMax - 1f, rect.y - 1f, -0.1f),
                    "!",
                    0.058f,
                    Color.white,
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
                CreatePanelPx(
                    "Reserve Gold Prompt Target " + row + "," + column,
                    rect.x - 7f,
                    rect.y - 7f,
                    rect.width + 14f,
                    rect.height + 14f,
                    -0.11f,
                    new Color(0f, 0f, 0f, 0f),
                    false,
                    target =>
                    {
                        target.Kind = "ReserveGoldPrompt";
                        target.EventType = "reserve-gold-prompt";
                        target.Row = row;
                        target.Column = column;
                        target.GemId = "gold";
                    },
                    "board.reserveGoldPrompt." + row + "." + column
                );
            }

            if (gemId == "empty")
            {
                CreatePanelPx("Gem " + row + "," + column + " empty", rect.x, rect.y, rect.width, rect.height, new Color(0f, 0f, 0f, 0f), false, null, semanticKey);
                return;
            }

            CreateGemArtwork("Gem " + row + "," + column + " " + gemId, gemId, rect, -0.05f, true, target =>
            {
                target.Kind = "Gem";
                target.Row = row;
                target.Column = column;
                target.GemId = gemId;
            }, semanticKey);
        }

        private bool IsReserveGoldPromptGem(int row, int column, string gemId)
        {
            if (currentState == null || currentState.Phase != "RESERVE_WAITING_GEM" || gemId != "gold")
            {
                return false;
            }

            var next = GetNextEvent();
            if (next?.Value<string>("type") == "reserve_card" && next["goldCoord"] is JObject replayGoldCoord)
            {
                return MatchesCoord(replayGoldCoord, row, column);
            }

            var pendingReserve = currentState.Snapshot["pendingReserve"] as JObject;
            if (pendingReserve?["goldCoord"] is JObject pendingGoldCoord)
            {
                return MatchesCoord(pendingGoldCoord, row, column);
            }

            if (pendingReserve?["goldCoords"] is JObject pendingGoldCoords)
            {
                return MatchesCoord(pendingGoldCoords, row, column);
            }

            return true;
        }

        private Rect MarketDeckRect(int level)
        {
            return new Rect(
                43.1f + (level - 1) * 79.8f,
                579.13f - (level - 1) * 214.835f,
                153.46f,
                204.61f
            );
        }

        private Rect MarketCardRect(int level, int index)
        {
            var deck = MarketDeckRect(level);
            return new Rect(deck.x + 159.59f + index * 159.595f, deck.y, 153.46f, 204.61f);
        }

        private Rect BoardFrameRect()
        {
            return new Rect(1002.47f, BoardOffsetY(), 412.87f, 412.87f);
        }

        private Rect BoardCellRect(int row, int column)
        {
            return new Rect(1047.36f + column * 66.905f, BoardOffsetY() + 44.8f + row * 66.705f, 54.81f, 54.81f);
        }

        private float BoardOffsetY()
        {
            if (currentState == null)
            {
                return 227.17f;
            }

            var reserved = (JObject)currentState.Snapshot["playerReserved"];
            var activeReserved = reserved?[currentState.Turn] as JArray;
            return activeReserved != null && activeReserved.Count > 0 ? 224.43f : 227.17f;
        }

        private Rect RoyalFeaturedRect()
        {
            return new Rect(1488.45f, 206.4f + RoyalCourtInteractiveOffsetY(), 323.28f, 425.58f);
        }

        private static Rect PlayerZoneRect(string player)
        {
            return new Rect(player == "p1" ? 1.5f : 961.5f, 822f, 957f, 256.5f);
        }

        private static Rect PlayerScoreRect(string player)
        {
            return new Rect(player == "p1" ? 886f : 969.5f, 830f, 64.5f, 240.5f);
        }

        private static Rect PlayerResourcesRect(string player)
        {
            return new Rect(player == "p1" ? 211.88f : 1042f, 830f, 666.12f, 240.5f);
        }

        private static Rect PlayerReservedColumnRect(string player)
        {
            return new Rect(player == "p1" ? 9.5f : 1716.12f, 830f, 194.38f, 240.5f);
        }

        private static Rect PlayerReservedRect(string player, int index, int slotCount)
        {
            var rect = PlayerReservedColumnRect(player);
            var scale = PlayerReservedCardScale(rect, slotCount);
            var cardWidth = 150f * scale;
            var cardHeight = 200f * scale;
            var offsetX = 34f * scale;
            var offsetY = 44f * scale;
            var totalWidth = cardWidth + Math.Max(slotCount - 1, 0) * offsetX;
            var totalHeight = cardHeight + Math.Max(slotCount - 1, 0) * offsetY;
            var startX = rect.x + (rect.width - totalWidth) * 0.5f;
            var startY = rect.y + (rect.height - totalHeight) * 0.5f;

            return new Rect(startX + index * offsetX, startY + index * offsetY, cardWidth, cardHeight);
        }

        private static Rect PlayerReservedClickableRect(string player, int index, int slotCount)
        {
            var cardRect = PlayerReservedRect(player, index, slotCount);
            if (index >= Math.Max(slotCount - 1, 0))
            {
                return cardRect;
            }

            var nextRect = PlayerReservedRect(player, index + 1, slotCount);
            var exposedWidth = nextRect.x - cardRect.x;
            if (exposedWidth <= 0f)
            {
                return cardRect;
            }

            var safeWidth = Mathf.Clamp(exposedWidth, 18f, cardRect.width);
            return new Rect(cardRect.x, cardRect.y, safeWidth, cardRect.height);
        }

        private static float PlayerReservedCardScale(Rect rect, int slotCount)
        {
            var safeSlotCount = Math.Max(1, Math.Min(slotCount, 3));
            var miniStackWidth = 150f + Math.Max(safeSlotCount - 1, 0) * 34f;
            return Mathf.Clamp(rect.width / miniStackWidth, 0.42f, 0.74f);
        }

        private Rect RoyalCardRect(int index)
        {
            return new Rect(
                1490f + (index % 2) * 169f,
                207f + RoyalCourtInteractiveOffsetY() + (index / 2) * 221f,
                153f,
                204f
            );
        }

        private float RoyalCourtInteractiveOffsetY()
        {
            return 0f;
        }

        private string PreviousReplayEventType()
        {
            if (activeReplay == null || nextFixtureEventIndex <= 0 || nextFixtureEventIndex > activeReplay.Events.Count)
            {
                return string.Empty;
            }

            return activeReplay.Events[nextFixtureEventIndex - 1].Value<string>("type") ?? string.Empty;
        }

        private bool CanConfirmPreviewAction(string eventType)
        {
            if (previewContext == null || previewContext.Source != "market")
            {
                return false;
            }

            var next = GetNextEvent();
            return next != null &&
                next.Value<string>("type") == eventType &&
                MatchesMarketRef(next, previewContext.Level, previewContext.Index);
        }

        private bool CanShowMarketPreviewAction()
        {
            return CanConfirmPreviewAction("buy_card")
                || (IsMarketInteractionPhase() && IsActiveMarketPreviewCardStillPresent());
        }

        private bool CanShowReservedPreviewBuyAction()
        {
            if (
                activeReplay != null
                || previewContext == null
                || previewContext.Source != "reserved"
                || currentState == null
                || !IsMarketInteractionPhase()
            )
            {
                return false;
            }

            var reservedByPlayer = currentState.Snapshot["playerReserved"] as JObject;
            var reserved = reservedByPlayer?[currentState.Turn] as JArray;
            return reserved != null
                && reserved.Any(instanceId => instanceId.Value<string>() == previewContext.InstanceId);
        }

        private bool CanShowReservedPreviewDiscardAction()
        {
            if (
                activeReplay != null
                || previewContext == null
                || previewContext.Source != "reserved"
                || currentState == null
                || !IsMarketInteractionPhase()
                || !HasActiveDiscardReservedAbility()
            )
            {
                return false;
            }

            var reservedByPlayer = currentState.Snapshot["playerReserved"] as JObject;
            var reserved = reservedByPlayer?[currentState.Turn] as JArray;
            return reserved != null
                && reserved.Any(instanceId => instanceId.Value<string>() == previewContext.InstanceId);
        }

        private bool HasActiveDiscardReservedAbility()
        {
            var playerBuffs = currentState?.Snapshot["playerBuffs"] as JObject;
            var buffContainer = playerBuffs?[currentState.Turn] as JObject;
            var buff = buffContainer?["buff"] as JObject ?? buffContainer;
            var effects = buff?["effects"] as JObject;
            return effects?.Value<string>("active") == "discard_reserved"
                || buff?.Value<string>("id") == "puppet_master";
        }

        private bool HasActivePeekDeckAbility()
        {
            var playerBuffs = currentState?.Snapshot["playerBuffs"] as JObject;
            var buffContainer = playerBuffs?[currentState.Turn] as JObject;
            var buff = buffContainer?["buff"] as JObject ?? buffContainer;
            var effects = buff?["effects"] as JObject;
            return effects?.Value<string>("active") == "peek_deck"
                || buff?.Value<string>("id") == "intelligence";
        }

        private bool HasActivePeekModal()
        {
            var activeModal = currentState?.Snapshot["activeModal"] as JObject;
            return activeModal?.Value<string>("type") == "PEEK";
        }

        private void RenderPeekDeckModal()
        {
            var activeModal = currentState?.Snapshot["activeModal"] as JObject;
            var data = activeModal?["data"] as JObject;
            var cards = data?["cards"] as JArray ?? new JArray();
            CreatePanelPx(
                "Peek Modal Scrim",
                0f,
                0f,
                1920f,
                1080f,
                -0.33f,
                new Color(0.01f, 0.015f, 0.04f, 0.76f),
                false,
                null,
                "modal.peek"
            );
            CreateRoundedPanelPx(
                "Peek Modal Panel",
                240f,
                112f,
                1440f,
                856f,
                24f,
                2f,
                new Color(0.7f, 0.78f, 0.98f, 0.34f),
                new Color(0.03f, 0.05f, 0.14f, 0.96f),
                -0.36f
            );
            WithTextWeightCompensation(() =>
            {
                CreateText(
                    "Peek Modal Title",
                    ViewportPoint(960f, 164f, -0.39f),
                    "牌库窥视",
                    0.18f,
                    new Color(0.86f, 0.92f, 1f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
                CreateText(
                    "Peek Modal Count",
                    ViewportPoint(960f, 210f, -0.39f),
                    cards.Count + " cards",
                    0.075f,
                    new Color(0.58f, 0.66f, 0.82f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
            });

            var cardIds = cards.Values<string>().Where(value => !string.IsNullOrEmpty(value)).ToList();
            var levels = new[] { 3, 2, 1 };
            const float cardWidth = 154f;
            const float cardHeight = 205.2f;
            const float columnGap = 22f;
            const float rowGap = 18f;
            const float deckBackWidth = 130f;
            var rowStartX = 463f;
            var rowY = 260f;
            var globalCardIndex = 0;
            foreach (var level in levels)
            {
                var group = cardIds.Where(instanceId => ResolveCardLevel(instanceId) == level).Take(3).ToList();
                if (group.Count == 0)
                {
                    continue;
                }

                var y = rowY;
                var deckRect = new Rect(rowStartX - deckBackWidth - 28f, y, deckBackWidth, cardHeight);
                CreateImagePanelPx(
                    "Peek Modal Deck Back L" + level,
                    deckRect,
                    -0.39f,
                    false,
                    null,
                    "modal.peek.level." + level,
                    "surfaces",
                    "anime-themes",
                    "royal-luxury",
                    "dark",
                    "market-card-back-l" + level + ".png"
                );
                WithTextWeightCompensation(() =>
                    CreateText(
                        "Peek Modal Level Label " + level,
                        ViewportPoint(deckRect.center.x, deckRect.yMax + 18f, -0.4f),
                        "L" + level,
                        0.07f,
                        new Color(1f, 0.86f, 0.34f),
                        TextAnchor.MiddleCenter,
                        FontStyle.Bold
                    )
                );

                for (var index = 0; index < group.Count; index += 1)
                {
                    var x = rowStartX + index * (cardWidth + columnGap);
                    var instanceId = group[index];
                    var rect = new Rect(x, y, cardWidth, cardHeight);
                    CreateCardArtwork("Peek Modal Card " + globalCardIndex, instanceId, rect, -0.39f);
                    CreatePanelPx(
                        "Peek Modal Card Target " + globalCardIndex,
                        rect.x,
                        rect.y,
                        rect.width,
                        rect.height,
                        -0.42f,
                        new Color(0f, 0f, 0f, 0f),
                        false,
                        null,
                        "modal.peek.card." + globalCardIndex
                    );
                    globalCardIndex += 1;
                }

                rowY += cardHeight + rowGap;
            }

            if (globalCardIndex == 0)
            {
                var fallbackCount = Math.Min(9, cardIds.Count);
                for (var index = 0; index < fallbackCount; index += 1)
                {
                    var row = index / 3;
                    var column = index % 3;
                    var x = rowStartX + column * (cardWidth + columnGap);
                    var y = 260f + row * (cardHeight + rowGap);
                    var rect = new Rect(x, y, cardWidth, cardHeight);
                    CreateCardArtwork("Peek Modal Card " + index, cardIds[index], rect, -0.39f);
                    CreatePanelPx(
                        "Peek Modal Card Target " + index,
                        rect.x,
                        rect.y,
                        rect.width,
                        rect.height,
                        -0.42f,
                        new Color(0f, 0f, 0f, 0f),
                        false,
                        null,
                        "modal.peek.card." + index
                    );
                }
            }

            var orderLabels = new[] { "第一", "第二", "第三" };
            for (var index = 0; index < orderLabels.Length; index += 1)
            {
                CreateText(
                    "Peek Modal Order Label " + index,
                    ViewportPoint(rowStartX + index * (cardWidth + columnGap) + cardWidth * 0.5f, 906f, -0.39f),
                    orderLabels[index],
                    0.068f,
                    new Color(1f, 0.88f, 0.48f),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
                CreatePanelPx(
                    "Peek Modal Order Target " + index,
                    rowStartX + index * (cardWidth + columnGap),
                    884f,
                    cardWidth,
                    48f,
                    -0.42f,
                    new Color(0f, 0f, 0f, 0f),
                    false,
                    null,
                    "modal.peek.order." + index
                );
            }

            CreateActionButtonPx(
                "关闭",
                "close-modal",
                872f,
                938f,
                176f,
                52f,
                new Color(0.26f, 0.32f, 0.48f),
                "modal.peek.close"
            );
        }

        private bool CanShowMarketPreviewReserveAction()
        {
            return CanConfirmPreviewAction("reserve_card")
                || (
                    IsMarketInteractionPhase()
                    && IsActiveMarketPreviewCardStillPresent()
                    && HasActivePlayerReserveRoom()
                );
        }

        private bool IsActiveMarketPreviewCardStillPresent()
        {
            if (previewContext == null || previewContext.Source != "market" || currentState == null)
            {
                return false;
            }

            var market = (JObject)currentState.Snapshot["market"];
            var row = (JArray)market?[previewContext.Level.ToString()];
            return row != null
                && previewContext.Index >= 0
                && previewContext.Index < row.Count
                && row[previewContext.Index].Value<string>() == previewContext.InstanceId;
        }

        private bool HasActivePlayerReserveRoom()
        {
            if (currentState == null)
            {
                return false;
            }

            var player = currentState.Turn;
            var reservedByPlayer = (JObject)currentState.Snapshot["playerReserved"];
            var reserved = (JArray)reservedByPlayer?[player];
            return reserved == null || reserved.Count < 3;
        }

        private bool IsMarketInteractionPhase()
        {
            return currentState != null && currentState.Phase == "IDLE";
        }

        private static bool IsJokerInstanceId(string instanceId)
        {
            return !string.IsNullOrEmpty(instanceId) && instanceId.Contains("-jo#");
        }

        private JObject BuildPendingBuyCommandPayload(string bonusColor)
        {
            var pendingBuy = currentState?.Snapshot["pendingBuy"] as JObject;
            if (pendingBuy == null || string.IsNullOrEmpty(bonusColor))
            {
                return null;
            }

            var commandPayload = new JObject { ["bonusColor"] = bonusColor };
            var source = pendingBuy.Value<string>("source") ?? "market";
            if (source == "reserved")
            {
                commandPayload["instanceId"] = pendingBuy.Value<string>("instanceId") ?? string.Empty;
                return new JObject
                {
                    ["commandType"] = "BUY_RESERVED_CARD",
                    ["payload"] = commandPayload,
                };
            }

            var marketRef = pendingBuy["marketRef"] as JObject;
            if (marketRef == null)
            {
                return null;
            }

            commandPayload["level"] = marketRef.Value<int?>("level") ?? 1;
            commandPayload["idx"] = marketRef.Value<int?>("idx") ?? 0;
            if (marketRef.Value<bool?>("isExtra") == true)
            {
                commandPayload["isExtra"] = true;
                commandPayload["extraIdx"] = marketRef.Value<int?>("extraIdx") ?? 0;
            }

            return new JObject
            {
                ["commandType"] = "BUY_CARD",
                ["payload"] = commandPayload,
            };
        }

        private bool CanConfirmDeckReserveAction()
        {
            if (previewContext == null || previewContext.Source != "deck" || currentState == null)
            {
                return false;
            }

            if (!IsMarketInteractionPhase())
            {
                return false;
            }

            var decks = (JObject)currentState.Snapshot["decks"];
            var deck = (JArray)decks?[previewContext.Level.ToString()];
            if (deck == null || deck.Count == 0)
            {
                return false;
            }

            return HasActivePlayerReserveRoom();
        }

        private void CreateDeckBack(int level, int count, Rect rect)
        {
            var pos = ViewportRectCenter(rect, 0f);
            var clickable = count > 0;
            CreateImagePanelPx(
                "Deck L" + level,
                rect,
                0f,
                clickable,
                target =>
                {
                    target.Kind = "MarketDeck";
                    target.EventType = "click_market_deck";
                    target.Level = level;
                },
                "market.level." + level,
                "surfaces",
                "anime-themes",
                "royal-luxury",
                "dark",
                "market-card-back-l" + level + ".png"
            );
            WithTextWeightCompensation(() =>
                CreateText(
                    "Deck Label L" + level,
                    pos + new Vector3(0f, -0.46f, -0.02f),
                    count.ToString(),
                    0.095f,
                    Color.white,
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                )
            );
        }

        private void CreateMarketCard(string instanceId, int level, int index, Rect rect)
        {
            var isTarget = IsNextMarketCard(instanceId, level, index);
            var semanticKey = "market.card." + level + "." + index;
            if (IsHovered(semanticKey))
            {
                CreateHoverFramePx("Market Hover " + instanceId, rect.x - 4f, rect.y - 4f, rect.width + 8f, rect.height + 8f, 8f, -0.07f);
            }

            if (isTarget)
            {
                CreatePanelPx("Market Highlight " + instanceId, rect.x - 2f, rect.y - 2f, rect.width + 4f, rect.height + 4f, new Color(1f, 0.82f, 0.22f));
            }

            CreateCardArtwork("Market Card " + instanceId, instanceId, rect, -0.05f, true, target =>
            {
                target.Kind = "MarketCard";
                target.Level = level;
                target.Index = index;
                target.InstanceId = instanceId;
            }, semanticKey);
        }

        private void CreateRoyalCard(string royalId, int index, Rect rect)
        {
            var next = GetNextEvent();
            var isReplayTarget = next?.Value<string>("type") == "select_royal" && next?.Value<string>("royalId") == royalId;
            var isLiveTarget = activeReplay == null && currentState != null && currentState.Phase == "SELECT_ROYAL";
            var eventType = isReplayTarget || isLiveTarget ? "select_royal" : string.Empty;
            var semanticKey = "royal.card." + index;
            if (IsHovered(semanticKey))
            {
                CreateHoverFramePx("Royal Hover " + royalId, rect.x - 4f, rect.y - 4f, rect.width + 8f, rect.height + 8f, 8f, -0.07f);
            }

            if (isReplayTarget || isLiveTarget)
            {
                CreateRoundedPanelPx(
                    "Royal Highlight " + royalId,
                    rect.x - 4f,
                    rect.y - 4f,
                    rect.width + 8f,
                    rect.height + 8f,
                    10f,
                    4f,
                    new Color(1f, 0.82f, 0.22f, 0.98f),
                    new Color(1f, 0.74f, 0.08f, 0.08f),
                    -0.07f
                );
            }

            CreateCardArtwork("Royal Card " + royalId, royalId, rect, -0.05f, true, target =>
            {
                target.Kind = "Royal";
                target.RoyalId = royalId;
                target.Index = index;
                target.EventType = eventType;
            }, semanticKey);
        }

        private void CreateInventoryGem(string player, string gemId, int count, Vector3 pos)
        {
            var next = GetNextEvent();
            var liveEventType = string.Empty;
            if (activeReplay == null && count > 0)
            {
                if (currentState.Phase == "DISCARD_EXCESS_GEMS" && player == currentState.Turn)
                {
                    liveEventType = "discard_gem";
                }
                else if (currentState.Phase == "STEAL_ACTION" && player != currentState.Turn && gemId != "gold")
                {
                    liveEventType = "steal_gem";
                }
            }

            var eventType = string.IsNullOrEmpty(liveEventType)
                ? next?.Value<string>("type") ?? string.Empty
                : liveEventType;
            var nextActor = next?.Value<string>("actor");
            var semanticTurn =
                (eventType == "steal_gem" || eventType == "discard_gem") && !string.IsNullOrEmpty(nextActor)
                    ? nextActor
                    : currentState.Turn;
            var isReplayActionTarget =
                next != null &&
                (
                    (eventType == "discard_gem" && next.Value<string>("actor") == player && next.Value<string>("gemId") == gemId) ||
                    (eventType == "steal_gem" && next.Value<string>("actor") != player && next.Value<string>("gemId") == gemId)
                );
            var isStateActionTarget =
                !string.IsNullOrEmpty(liveEventType) ||
                isReplayActionTarget;
            var semanticKey = player == semanticTurn
                ? "player.current.gem." + gemId
                : "player.opponent.gem." + gemId;
            if (IsHovered(semanticKey))
            {
                var hoverCenter = WorldToReferenceViewport(pos);
                CreateHoverFramePx("Inventory Gem Hover " + player + gemId, hoverCenter.x - 21f, hoverCenter.y - 21f, 42f, 42f, 21f, -0.07f);
            }

            if (isStateActionTarget)
            {
                CreatePanel("Inventory Highlight " + player + gemId, pos + new Vector3(0f, 0f, 0.08f), new Vector2(0.32f, 0.32f), new Color(1f, 0.82f, 0.22f));
            }

            var inventoryRect = new Rect(
                0f,
                0f,
                34f,
                34f
            );
            var center = WorldToReferenceViewport(pos);
            inventoryRect.x = center.x - inventoryRect.width * 0.5f;
            inventoryRect.y = center.y - inventoryRect.height * 0.5f;
            CreateGemArtwork("Inventory Gem " + player + gemId, gemId, inventoryRect, -0.05f, isStateActionTarget, target =>
            {
                target.Kind = "InventoryGem";
                target.EventType = eventType;
                target.GemId = gemId;
                target.InstanceId = player;
            }, semanticKey);
            CreateText("Inventory Gem Text " + player + gemId, pos + new Vector3(0f, -0.27f, -0.02f), count.ToString(), 0.08f, Color.white, TextAnchor.MiddleCenter);
        }

        private void CreateInventoryGemButton(string gemId, string eventType, Vector3 pos, float size)
        {
            CreatePanel("Action Gem " + gemId, pos, new Vector2(size, size), ColorForGem(gemId), true, target =>
            {
                target.Kind = "InventoryGem";
                target.EventType = eventType;
                target.GemId = gemId;
            });
            CreateText("Action Gem Text " + gemId, pos + new Vector3(0f, -0.35f, -0.02f), ShortGem(gemId), 0.08f, Color.white, TextAnchor.MiddleCenter);
        }

        private void CreateBonusColorButtonPx(string gemId, float x, float y, float size)
        {
            var semanticKey = "card.color." + gemId;
            if (IsHovered(semanticKey))
            {
                CreateHoverFramePx("Bonus Color Hover " + gemId, x - 4f, y - 4f, size + 8f, size + 8f, 8f, -0.13f);
            }

            CreateRoundedPanelPx(
                "Bonus Color " + gemId,
                x,
                y,
                size,
                size,
                8f,
                1f,
                new Color(1f, 1f, 1f, 0.52f),
                ColorForGem(gemId),
                -0.12f
            );
            CreatePanelPx("Bonus Color Target " + gemId, x, y, size, size, -0.145f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "BonusColor";
                target.EventType = "select-card-color";
                target.GemId = gemId;
            }, semanticKey);
            CreateText(
                "Bonus Color Text " + gemId,
                ViewportPoint(x + size * 0.5f, y + size * 0.5f, -0.15f),
                ShortGem(gemId),
                0.052f,
                TextColorForGem(gemId),
                TextAnchor.MiddleCenter,
                FontStyle.Bold
            );
        }

        private void CreateActionButton(string text, string eventType, Vector3 pos, Vector2 size, Color color, string semanticKey = null)
        {
            if (IsHoveredAction(eventType, semanticKey))
            {
                var center = WorldToReferenceViewport(pos);
                var rectSize = new Vector2(size.x / AutomationViewportWorldSize().x * 1920f, size.y / AutomationViewportWorldSize().y * 1080f);
                CreateHoverFramePx(
                    "Action Hover " + eventType,
                    center.x - rectSize.x * 0.5f - 4f,
                    center.y - rectSize.y * 0.5f - 4f,
                    rectSize.x + 8f,
                    rectSize.y + 8f,
                    12f,
                    pos.z - 0.03f
                );
            }

            CreatePanel("Action " + eventType, pos, size, color, true, target =>
            {
                target.Kind = "ActionButton";
                target.EventType = eventType;
            }, semanticKey);
            WithTextWeightCompensation(() =>
                CreateText(
                    "Action Text " + eventType,
                    pos + new Vector3(0f, 0f, -0.02f),
                    text,
                    0.12f,
                    Color.white,
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                )
            );
        }

        private void CreateActionButtonPx(
            string text,
            string eventType,
            float x,
            float y,
            float width,
            float height,
            Color color,
            string semanticKey = null,
            bool enabled = true
        )
        {
            var overlayAction = eventType == "close-modal"
                || eventType == "rulebook_prev"
                || eventType == "rulebook_next";
            var panelZ = overlayAction ? -0.38f : eventType == "cancel-gems" ? -0.2f : -0.12f;
            var targetZ = overlayAction ? -0.405f : eventType == "cancel-gems" ? -0.23f : -0.145f;
            var textZ = overlayAction ? -0.4f : eventType == "cancel-gems" ? -0.225f : -0.14f;
            var fillColor = enabled ? color : new Color(0.16f, 0.18f, 0.23f, 0.76f);
            var borderColor = enabled ? new Color(1f, 1f, 1f, 0.28f) : new Color(0.45f, 0.5f, 0.6f, 0.28f);
            var textColor = enabled ? Color.white : new Color(0.6f, 0.66f, 0.76f);
            if (enabled && IsHoveredAction(eventType, semanticKey))
            {
                CreateHoverFramePx("Action Hover " + eventType, x - 4f, y - 4f, width + 8f, height + 8f, 16f, panelZ - 0.01f);
            }

            CreateRoundedPanelPx(
                "Action " + eventType,
                x,
                y,
                width,
                height,
                height * 0.5f,
                1f,
                borderColor,
                fillColor,
                panelZ
            );
            CreatePanelPx("Action Target " + eventType, x, y, width, height, targetZ, new Color(0f, 0f, 0f, 0f), enabled, target =>
            {
                target.Kind = "ActionButton";
                target.EventType = eventType;
            }, semanticKey);
            WithTextWeightCompensation(() =>
                CreateText(
                    "Action Text " + eventType,
                    ViewportPoint(x + width * 0.5f, y + height * 0.5f, textZ),
                    text,
                    0.12f,
                    textColor,
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                )
            );
        }

        private void CreatePreviewActionButtonPx(
            string text,
            string eventType,
            float x,
            float y,
            float width,
            float height,
            Color color,
            string semanticKey = null
        )
        {
            if (IsHoveredAction(eventType, semanticKey))
            {
                CreateHoverFramePx("Preview Action Hover " + eventType, x - 4f, y - 4f, width + 8f, height + 8f, 16f, -0.405f);
            }

            CreateRoundedPanelPx(
                "Preview Action " + eventType,
                x,
                y,
                width,
                height,
                14f,
                1f,
                new Color(1f, 0.9f, 0.42f, 0.4f),
                color,
                -0.36f
            );
            CreatePanelPx("Preview Action Target " + eventType, x, y, width, height, -0.4f, new Color(0f, 0f, 0f, 0f), true, target =>
            {
                target.Kind = "ActionButton";
                target.EventType = eventType;
            }, semanticKey);
            CreateText(
                "Preview Action Text " + eventType,
                ViewportPoint(x + width * 0.5f, y + height * 0.5f, -0.42f),
                text,
                0.12f,
                Color.white,
                TextAnchor.MiddleCenter
            );
        }

        private Vector3 ViewportPoint(float x, float y, float z = 0f)
        {
            var size = AutomationViewportWorldSize();
            return new Vector3((x / 1920f - 0.5f) * size.x, (0.5f - y / 1080f) * size.y, z);
        }

        private Vector3 ViewportRectCenter(Rect rect, float z = 0f)
        {
            return ViewportPoint(rect.x + rect.width * 0.5f, rect.y + rect.height * 0.5f, z);
        }

        private Vector2 ViewportSize(float width, float height)
        {
            var size = AutomationViewportWorldSize();
            return new Vector2(width / 1920f * size.x, height / 1080f * size.y);
        }

        private Vector2 WorldToReferenceViewport(Vector3 worldPosition)
        {
            var size = AutomationViewportWorldSize();
            return new Vector2(
                (worldPosition.x / size.x + 0.5f) * 1920f,
                (0.5f - worldPosition.y / size.y) * 1080f
            );
        }

        private GameObject CreateImagePanelPx(string name, Rect rect, float z, params string[] assetSegments)
        {
            return CreateImagePanelPx(name, rect, z, false, null, null, assetSegments);
        }

        private GameObject CreateImagePanelPx(
            string name,
            Rect rect,
            float z,
            bool clickable,
            Action<GemDuelViewTarget> configureTarget,
            string semanticKey,
            params string[] assetSegments
        )
        {
            var texture = LoadPublicTexture(assetSegments);
            if (texture == null)
            {
                return CreatePanelPx(
                    name,
                    rect.x,
                    rect.y,
                    rect.width,
                    rect.height,
                    new Color(0f, 0f, 0f, 0f),
                    clickable,
                    configureTarget,
                    semanticKey
                );
            }

            return CreateImagePanel(
                name,
                ViewportRectCenter(rect, z),
                ViewportSize(rect.width, rect.height),
                GetDisplayTexture(texture, rect.width, rect.height),
                clickable,
                configureTarget,
                semanticKey
            );
        }

        private GameObject CreateCardArtwork(
            string name,
            string instanceIdOrCardId,
            Rect rect,
            float z,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            var cardId = ResolveCardId(instanceIdOrCardId);
            if (string.IsNullOrEmpty(cardId))
            {
                return CreateCardFallbackArtwork(name, instanceIdOrCardId, rect, z, clickable, configureTarget, semanticKey);
            }

            var texture = LoadPublicTexture("cards", cardId + ".png");
            if (texture == null)
            {
                return CreateCardFallbackArtwork(name, cardId, rect, z, clickable, configureTarget, semanticKey);
            }

            return CreateImagePanel(
                name,
                ViewportRectCenter(rect, z),
                ViewportSize(rect.width, rect.height),
                GetDisplayTexture(texture, rect.width, rect.height),
                clickable,
                configureTarget,
                semanticKey
            );
        }

        private GameObject CreateCardFallbackArtwork(
            string name,
            string label,
            Rect rect,
            float z,
            bool clickable,
            Action<GemDuelViewTarget> configureTarget,
            string semanticKey
        )
        {
            var card = ResolveCard(label);
            var bonusColor = card == null ? GuessBonusColorFromInstanceId(label) : card.BonusColor;
            var fill = ColorForGem(bonusColor);
            fill.a = 0.82f;
            CreateRoundedPanelPx(name + " Fallback", rect.x, rect.y, rect.width, rect.height, 8f, 1.5f, new Color(0.9f, 0.96f, 1f, 0.35f), fill, z);
            WithTextWeightCompensation(() =>
            {
                CreateText(
                    name + " Fallback Id",
                    ViewportPoint(rect.center.x, rect.y + rect.height * 0.36f, z - 0.02f),
                    ShortLabel(string.IsNullOrEmpty(label) ? "card" : label, 16),
                    Math.Min(0.09f, rect.width / 1700f),
                    TextColorForGem(bonusColor),
                    TextAnchor.MiddleCenter,
                    FontStyle.Bold
                );
                var points = card == null ? string.Empty : card.Points.ToString();
                if (!string.IsNullOrEmpty(points) && points != "0")
                {
                    CreateText(
                        name + " Fallback Points",
                        ViewportPoint(rect.x + 22f, rect.y + 24f, z - 0.02f),
                        points,
                        0.07f,
                        TextColorForGem(bonusColor),
                        TextAnchor.MiddleCenter,
                        FontStyle.Bold
                    );
                }
            });

            return CreatePanelPx(
                name + " Fallback Target",
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                z - 0.04f,
                new Color(0f, 0f, 0f, 0f),
                clickable,
                configureTarget,
                semanticKey
            );
        }

        private GameObject CreateGemArtwork(
            string name,
            string gemId,
            Rect rect,
            float z,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null,
            bool grayscale = false
        )
        {
            var fileName = GemArtworkFileName(gemId);
            if (string.IsNullOrEmpty(fileName))
            {
                return CreatePanelPx(
                    name,
                    rect.x,
                    rect.y,
                    rect.width,
                    rect.height,
                    ColorForGem(gemId),
                    clickable,
                    configureTarget,
                    semanticKey
                );
            }

            var texture = LoadPublicTexture("gems", fileName);
            if (texture == null)
            {
                return CreatePanelPx(
                    name,
                    rect.x,
                    rect.y,
                    rect.width,
                    rect.height,
                    ColorForGem(gemId),
                    clickable,
                    configureTarget,
                    semanticKey
                );
            }

            return CreateImagePanel(
                name,
                ViewportRectCenter(rect, z),
                ViewportSize(rect.width, rect.height),
                GetDisplayTexture(grayscale ? GetGrayscaleTexture(texture) : texture, rect.width, rect.height),
                clickable,
                configureTarget,
                semanticKey
            );
        }

        private Texture2D GetGrayscaleTexture(Texture2D source)
        {
            if (source == null)
            {
                return null;
            }

            var key = source.name + "|grayscale";
            if (grayscaleTextureCache.TryGetValue(key, out var cached))
            {
                return cached;
            }

            try
            {
                var pixels = source.GetPixels32();
                for (var index = 0; index < pixels.Length; index += 1)
                {
                    var pixel = pixels[index];
                    var gray = (byte)Mathf.RoundToInt(pixel.r * 0.299f + pixel.g * 0.587f + pixel.b * 0.114f);
                    pixels[index] = new Color32(gray, gray, gray, pixel.a);
                }

                var texture = new Texture2D(source.width, source.height, TextureFormat.RGBA32, false);
                texture.name = key;
                texture.wrapMode = TextureWrapMode.Clamp;
                texture.filterMode = source.filterMode;
                texture.SetPixels32(pixels);
                texture.Apply(false, true);
                grayscaleTextureCache[key] = texture;
                return texture;
            }
            catch
            {
                return source;
            }
        }

        private Texture2D GetDisplayTexture(Texture2D source, float displayWidth, float displayHeight)
        {
            if (source == null)
            {
                return null;
            }

            var targetWidth = Math.Max(1, Mathf.RoundToInt(displayWidth));
            var targetHeight = Math.Max(1, Mathf.RoundToInt(displayHeight));
            if (source.width <= targetWidth * 1.08f && source.height <= targetHeight * 1.08f)
            {
                return source;
            }

            var key = source.name + "|display|" + targetWidth.ToString() + "x" + targetHeight.ToString();
            if (displayTextureCache.TryGetValue(key, out var cached))
            {
                return cached;
            }

            try
            {
                var sourcePixels = source.GetPixels32();
                var targetPixels = new Color32[targetWidth * targetHeight];
                var scaleX = source.width / (float)targetWidth;
                var scaleY = source.height / (float)targetHeight;

                for (var y = 0; y < targetHeight; y += 1)
                {
                    var y0 = Mathf.Clamp(Mathf.FloorToInt(y * scaleY), 0, source.height - 1);
                    var y1 = Mathf.Clamp(Mathf.CeilToInt((y + 1) * scaleY), y0 + 1, source.height);
                    for (var x = 0; x < targetWidth; x += 1)
                    {
                        var x0 = Mathf.Clamp(Mathf.FloorToInt(x * scaleX), 0, source.width - 1);
                        var x1 = Mathf.Clamp(Mathf.CeilToInt((x + 1) * scaleX), x0 + 1, source.width);
                        long r = 0;
                        long g = 0;
                        long b = 0;
                        long a = 0;
                        var count = 0;
                        for (var sy = y0; sy < y1; sy += 1)
                        {
                            var rowOffset = sy * source.width;
                            for (var sx = x0; sx < x1; sx += 1)
                            {
                                var pixel = sourcePixels[rowOffset + sx];
                                r += pixel.r;
                                g += pixel.g;
                                b += pixel.b;
                                a += pixel.a;
                                count += 1;
                            }
                        }

                        if (count <= 0)
                        {
                            targetPixels[y * targetWidth + x] = sourcePixels[y0 * source.width + x0];
                            continue;
                        }

                        targetPixels[y * targetWidth + x] = new Color32(
                            (byte)(r / count),
                            (byte)(g / count),
                            (byte)(b / count),
                            (byte)(a / count)
                        );
                    }
                }

                var texture = new Texture2D(targetWidth, targetHeight, TextureFormat.RGBA32, false);
                texture.name = key;
                texture.wrapMode = TextureWrapMode.Clamp;
                texture.filterMode = FilterMode.Bilinear;
                texture.SetPixels32(targetPixels);
                texture.Apply(false, true);
                displayTextureCache[key] = texture;
                return texture;
            }
            catch
            {
                return source;
            }
        }

        private Texture2D GetDraftBackgroundTexture()
        {
            if (draftBackgroundTexture != null)
            {
                return draftBackgroundTexture;
            }

            const int width = 960;
            const int height = 540;
            var baseColor = new Color(0.008f, 0.024f, 0.09f, 1f);
            var purple = new Color(0.34f, 0.11f, 0.53f, 1f);
            var pixels = new Color32[width * height];
            var center = new Vector2(width * 0.5f, height * 0.5f);
            var radius = height * 0.48f;

            for (var y = 0; y < height; y += 1)
            {
                for (var x = 0; x < width; x += 1)
                {
                    var distance = Vector2.Distance(new Vector2(x + 0.5f, y + 0.5f), center);
                    var falloff = Mathf.Clamp01(1f - distance / radius);
                    falloff = falloff * falloff * 0.12f;
                    pixels[y * width + x] = (Color32)Color.Lerp(baseColor, purple, falloff);
                }
            }

            draftBackgroundTexture = new Texture2D(width, height, TextureFormat.RGBA32, false)
            {
                name = "GemDuel Draft Radial Background",
                wrapMode = TextureWrapMode.Clamp,
                filterMode = FilterMode.Bilinear,
            };
            draftBackgroundTexture.SetPixels32(pixels);
            draftBackgroundTexture.Apply(false, true);
            return draftBackgroundTexture;
        }

        private GameObject CreateImagePanel(
            string name,
            Vector3 position,
            Vector2 size,
            Texture2D texture,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            var panel = GameObject.CreatePrimitive(PrimitiveType.Quad);
            panel.name = name;
            panel.transform.SetParent(renderRoot == null ? transform : renderRoot.transform, false);
            panel.transform.position = position;
            panel.transform.localScale = new Vector3(size.x, size.y, 1f);
            var renderer = panel.GetComponent<MeshRenderer>();
            var material = new Material(Shader.Find("Sprites/Default"));
            material.mainTexture = texture;
            material.color = ApplyRenderOpacity(Color.white);
            renderer.sharedMaterial = material;

            if (clickable || !string.IsNullOrEmpty(semanticKey))
            {
                var target = panel.AddComponent<GemDuelViewTarget>();
                target.Size = size;
                target.SemanticKey = semanticKey ?? string.Empty;
                target.Clickable = clickable;
                configureTarget?.Invoke(target);
            }

            if (!clickable)
            {
                var collider = panel.GetComponent("MeshCollider");
                if (collider != null)
                {
                    DestroyUnityObject(collider);
                }
            }

            return panel;
        }

        private GameObject CreatePanelPx(
            string name,
            float x,
            float y,
            float width,
            float height,
            Color color,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            return CreatePanel(
                name,
                ViewportRectCenter(new Rect(x, y, width, height), 0f),
                ViewportSize(width, height),
                color,
                clickable,
                configureTarget,
                semanticKey
            );
        }

        private GameObject CreatePanelPx(
            string name,
            float x,
            float y,
            float width,
            float height,
            float z,
            Color color,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            return CreatePanel(
                name,
                ViewportRectCenter(new Rect(x, y, width, height), z),
                ViewportSize(width, height),
                color,
                clickable,
                configureTarget,
                semanticKey
            );
        }

        private void CreateOutlinedPanelPx(
            string name,
            float x,
            float y,
            float width,
            float height,
            float borderPx,
            Color borderColor,
            Color fillColor
        )
        {
            CreatePanelPx(name + " Border", x, y, width, height, 0f, borderColor);
            CreatePanelPx(
                name + " Fill",
                x + borderPx,
                y + borderPx,
                width - borderPx * 2f,
                height - borderPx * 2f,
                -0.01f,
                fillColor
            );
        }

        private GameObject CreateRoundedPanelPx(
            string name,
            float x,
            float y,
            float width,
            float height,
            float radiusPx,
            float borderPx,
            Color borderColor,
            Color fillColor,
            float z = 0f
        )
        {
            var texture = GetRoundedRectTexture(width, height, radiusPx, borderPx, borderColor, fillColor);
            return CreateImagePanel(
                name,
                ViewportRectCenter(new Rect(x, y, width, height), z),
                ViewportSize(width, height),
                texture
            );
        }

        private void CreateHoverFramePx(string name, float x, float y, float width, float height, float radiusPx, float z)
        {
            CreateRoundedPanelPx(
                name,
                x,
                y,
                width,
                height,
                radiusPx,
                4f,
                new Color(1f, 0.86f, 0.22f, 0.95f),
                new Color(1f, 0.74f, 0.08f, 0.08f),
                z
            );
        }

        private Texture2D GetRoundedRectTexture(
            float width,
            float height,
            float radiusPx,
            float borderPx,
            Color borderColor,
            Color fillColor
        )
        {
            var pixelWidth = Math.Max(1, Mathf.RoundToInt(width));
            var pixelHeight = Math.Max(1, Mathf.RoundToInt(height));
            var radius = Mathf.Max(0f, radiusPx);
            var border = Mathf.Max(0f, borderPx);
            var key = string.Join(
                "|",
                pixelWidth.ToString(),
                pixelHeight.ToString(),
                radius.ToString("0.##"),
                border.ToString("0.##"),
                ColorUtility.ToHtmlStringRGBA(borderColor),
                ColorUtility.ToHtmlStringRGBA(fillColor)
            );
            if (roundedTextureCache.TryGetValue(key, out var cached))
            {
                return cached;
            }

            var texture = new Texture2D(pixelWidth, pixelHeight, TextureFormat.RGBA32, false);
            texture.wrapMode = TextureWrapMode.Clamp;
            texture.filterMode = FilterMode.Bilinear;
            var pixels = new Color32[pixelWidth * pixelHeight];
            var transparent = new Color32(0, 0, 0, 0);
            var fill32 = (Color32)fillColor;
            var border32 = (Color32)borderColor;

            for (var y = 0; y < pixelHeight; y += 1)
            {
                for (var x = 0; x < pixelWidth; x += 1)
                {
                    var alphaOuter = RoundedRectAlpha(x + 0.5f, y + 0.5f, pixelWidth, pixelHeight, radius);
                    if (alphaOuter <= 0f)
                    {
                        pixels[y * pixelWidth + x] = transparent;
                        continue;
                    }

                    var alphaInner = border <= 0f
                        ? alphaOuter
                        : RoundedRectAlpha(
                            x + 0.5f - border,
                            y + 0.5f - border,
                            pixelWidth - border * 2f,
                            pixelHeight - border * 2f,
                            Mathf.Max(0f, radius - border)
                        );
                    var color = alphaInner > 0.5f ? fill32 : border32;
                    color.a = (byte)Mathf.RoundToInt(color.a * alphaOuter);
                    pixels[y * pixelWidth + x] = color;
                }
            }

            texture.SetPixels32(pixels);
            texture.Apply(false, true);
            roundedTextureCache[key] = texture;
            return texture;
        }

        private static float RoundedRectAlpha(float x, float y, float width, float height, float radius)
        {
            if (width <= 0f || height <= 0f)
            {
                return 0f;
            }

            radius = Mathf.Min(radius, width * 0.5f, height * 0.5f);
            var dx = Mathf.Max(radius - x, 0f, x - (width - radius));
            var dy = Mathf.Max(radius - y, 0f, y - (height - radius));
            var distance = Mathf.Sqrt(dx * dx + dy * dy) - radius;
            return Mathf.Clamp01(0.5f - distance);
        }

        private GameObject CreatePanel(
            string name,
            Vector3 position,
            Vector2 size,
            Color color,
            bool clickable = false,
            Action<GemDuelViewTarget> configureTarget = null,
            string semanticKey = null
        )
        {
            var panel = GameObject.CreatePrimitive(PrimitiveType.Quad);
            panel.name = name;
            panel.transform.SetParent(renderRoot == null ? transform : renderRoot.transform, false);
            panel.transform.position = position;
            panel.transform.localScale = new Vector3(size.x, size.y, 1f);
            var renderer = panel.GetComponent<MeshRenderer>();
            var material = new Material(Shader.Find("Sprites/Default"));
            material.color = ApplyRenderOpacity(color);
            renderer.sharedMaterial = material;

            if (clickable || !string.IsNullOrEmpty(semanticKey))
            {
                var target = panel.AddComponent<GemDuelViewTarget>();
                target.Size = size;
                target.SemanticKey = semanticKey ?? string.Empty;
                target.Clickable = clickable;
                configureTarget?.Invoke(target);
            }

            if (!clickable)
            {
                var collider = panel.GetComponent("MeshCollider");
                if (collider != null)
                {
                    DestroyUnityObject(collider);
                }
            }

            return panel;
        }

        private TMP_Text CreateText(string name, Vector3 position, string text, float size, Color color, TextAnchor anchor, FontStyle style = FontStyle.Normal)
        {
            return CreateTextMesh(name, position, text, size, color, anchor, style);
        }

        private TextMeshPro CreateTextMesh(string name, Vector3 position, string text, float size, Color color, TextAnchor anchor, FontStyle style)
        {
            var label = new GameObject(name);
            label.transform.SetParent(renderRoot == null ? transform : renderRoot.transform, false);
            label.transform.position = position;
            var mesh = label.AddComponent<TextMeshPro>();
            ConfigureText(mesh, text, size, color, anchor, style);
            return mesh;
        }

        private void ConfigureText(TMP_Text mesh, string text, float size, Color color, TextAnchor anchor, FontStyle style)
        {
            var scale = Mathf.Max(0.0001f, size * (14f / 128f));
            mesh.transform.localScale = new Vector3(scale, scale, 1f);
            mesh.text = text;
            mesh.font = ResolveUiFontAsset();
            mesh.fontSize = 128f;
            mesh.fontStyle = FontStyleForTextMeshPro(style);
            mesh.alignment = TextAlignmentForAnchor(anchor);
            mesh.color = ApplyRenderOpacity(color);
            mesh.enableWordWrapping = false;
            mesh.overflowMode = TextOverflowModes.Overflow;
            mesh.richText = false;
            mesh.lineSpacing = 0f;
            mesh.margin = Vector4.zero;
            mesh.rectTransform.pivot = PivotForAnchor(anchor);
            mesh.rectTransform.sizeDelta = new Vector2(1000f, 220f);

            var material = ResolveUiFontMaterial();
            if (material != null)
            {
                mesh.fontSharedMaterial = material;
            }

            var evidence = mesh.GetComponent<TextEvidence>() ?? mesh.gameObject.AddComponent<TextEvidence>();
            evidence.Anchor = anchor;
            evidence.CharacterSize = scale;
            evidence.LineSpacing = 1.12f;
            evidence.RequestedStyle = style;
        }

        private void CreateGlobeIconPx(float centerX, float centerY, Color color)
        {
            CreateRoundedPanelPx("Mode Online Icon Outer", centerX - 12f, centerY - 12f, 24f, 24f, 12f, 2f, color, new Color(0f, 0f, 0f, 0f), -0.02f);
            CreateRoundedPanelPx("Mode Online Icon Meridian", centerX - 5f, centerY - 12f, 10f, 24f, 5f, 1.5f, color, new Color(0f, 0f, 0f, 0f), -0.021f);
            CreatePanelPx("Mode Online Icon Equator", centerX - 11f, centerY - 1f, 22f, 2f, -0.022f, color);
        }

        private void CreateRadioIconPx(float centerX, float centerY, Color color)
        {
            CreateRoundedPanelPx("Mode LAN Icon Outer", centerX - 12f, centerY - 12f, 24f, 24f, 12f, 2f, color, new Color(0f, 0f, 0f, 0f), -0.02f);
            CreateRoundedPanelPx("Mode LAN Icon Middle", centerX - 7f, centerY - 7f, 14f, 14f, 7f, 1.5f, color, new Color(0f, 0f, 0f, 0f), -0.021f);
            CreateRoundedPanelPx("Mode LAN Icon Dot", centerX - 2.5f, centerY - 2.5f, 5f, 5f, 2.5f, 0f, new Color(0f, 0f, 0f, 0f), color, -0.022f);
        }

        private void CreateBookIconPx(float centerX, float centerY, Color color, float z)
        {
            CreateRoundedPanelPx("Rulebook Icon Left Page", centerX - 16f, centerY - 14f, 15f, 28f, 3f, 1.4f, color, new Color(0f, 0f, 0f, 0f), z);
            CreateRoundedPanelPx("Rulebook Icon Right Page", centerX + 1f, centerY - 14f, 15f, 28f, 3f, 1.4f, color, new Color(0f, 0f, 0f, 0f), z - 0.001f);
            CreatePanelPx("Rulebook Icon Spine", centerX - 1f, centerY - 12f, 2f, 24f, z - 0.002f, color);
            CreatePanelPx("Rulebook Icon Left Line", centerX - 12f, centerY - 4f, 8f, 1.5f, z - 0.003f, color);
            CreatePanelPx("Rulebook Icon Right Line", centerX + 5f, centerY - 4f, 8f, 1.5f, z - 0.003f, color);
            CreatePanelPx("Rulebook Icon Right Line 2", centerX + 5f, centerY + 4f, 8f, 1.5f, z - 0.003f, color);
        }

        private void CreateFlaskIconPx(float centerX, float centerY, Color color)
        {
            CreatePanelPx("Visual Lab Icon Neck", centerX - 2f, centerY - 8f, 4f, 8f, -0.02f, color);
            CreatePanelPx("Visual Lab Icon Lip", centerX - 5f, centerY - 9f, 10f, 2f, -0.021f, color);
            CreatePanelPx("Visual Lab Icon Base", centerX - 7f, centerY + 6f, 14f, 2f, -0.021f, color);
            CreatePanelPx("Visual Lab Icon Left", centerX - 7f, centerY + 1f, 2f, 7f, -0.021f, color);
            CreatePanelPx("Visual Lab Icon Right", centerX + 5f, centerY + 1f, 2f, 7f, -0.021f, color);
            CreatePanelPx("Visual Lab Icon Liquid", centerX - 5f, centerY + 3f, 10f, 2f, -0.022f, color);
        }

        private Vector3 TextPixelOffset(float x, float y)
        {
            var size = AutomationViewportWorldSize();
            return new Vector3((x / 1920f) * size.x, (-y / 1080f) * size.y, 0f);
        }

        private static TextAlignmentOptions TextAlignmentForAnchor(TextAnchor anchor)
        {
            switch (anchor)
            {
                case TextAnchor.LowerLeft:
                    return TextAlignmentOptions.BottomLeft;
                case TextAnchor.MiddleLeft:
                    return TextAlignmentOptions.MidlineLeft;
                case TextAnchor.UpperLeft:
                    return TextAlignmentOptions.TopLeft;
                case TextAnchor.LowerRight:
                    return TextAlignmentOptions.BottomRight;
                case TextAnchor.MiddleRight:
                    return TextAlignmentOptions.MidlineRight;
                case TextAnchor.UpperRight:
                    return TextAlignmentOptions.TopRight;
                case TextAnchor.LowerCenter:
                    return TextAlignmentOptions.Bottom;
                case TextAnchor.UpperCenter:
                    return TextAlignmentOptions.Top;
                default:
                    return TextAlignmentOptions.Midline;
            }
        }

        private static Vector2 PivotForAnchor(TextAnchor anchor)
        {
            var x = 0.5f;
            var y = 0.5f;
            switch (anchor)
            {
                case TextAnchor.LowerLeft:
                case TextAnchor.MiddleLeft:
                case TextAnchor.UpperLeft:
                    x = 0f;
                    break;
                case TextAnchor.LowerRight:
                case TextAnchor.MiddleRight:
                case TextAnchor.UpperRight:
                    x = 1f;
                    break;
            }

            switch (anchor)
            {
                case TextAnchor.LowerLeft:
                case TextAnchor.LowerCenter:
                case TextAnchor.LowerRight:
                    y = 0f;
                    break;
                case TextAnchor.UpperLeft:
                case TextAnchor.UpperCenter:
                case TextAnchor.UpperRight:
                    y = 1f;
                    break;
            }

            return new Vector2(x, y);
        }

        private void WithRenderOpacity(float opacity, Action render)
        {
            var previousOpacity = renderOpacity;
            renderOpacity *= Mathf.Clamp01(opacity);
            try
            {
                render();
            }
            finally
            {
                renderOpacity = previousOpacity;
            }
        }

        private Color ApplyRenderOpacity(Color color)
        {
            color.a *= renderOpacity;
            return color;
        }

        private void WithTextWeightCompensation(Action render)
        {
            var previous = compensateTextWeight;
            compensateTextWeight = true;
            try
            {
                render();
            }
            finally
            {
                compensateTextWeight = previous;
            }
        }

        private TMP_FontAsset ResolveUiFontAsset()
        {
            if (uiFontAsset != null)
            {
                return uiFontAsset;
            }

            uiFontPresetKey = ResolveUiFontPresetKey();
            uiFontAsset = Resources.Load<TMP_FontAsset>(UiFontResourceForPreset(uiFontPresetKey))
                ?? Resources.Load<TMP_FontAsset>("GemDuelFonts/NotoSansSC-SDF")
                ?? TMP_Settings.defaultFontAsset;
            return uiFontAsset;
        }

        private Material ResolveUiFontMaterial()
        {
            if (uiFontMaterial != null)
            {
                return uiFontMaterial;
            }

            var fontAsset = ResolveUiFontAsset();
            if (uiFontPresetKey == "noto-sans-sc")
            {
                uiFontMaterial = Resources.Load<Material>("GemDuelFonts/GemDuelTextMaterial-Readable");
            }

            return uiFontMaterial ?? (fontAsset == null ? null : fontAsset.material);
        }

        private static string ResolveUiFontPresetKey()
        {
            var requested = Environment.GetEnvironmentVariable("GEMDUEL_UNITY_FONT_PRESET");
            switch ((requested ?? string.Empty).Trim().ToLowerInvariant())
            {
                case "noto-serif-sc":
                case "serif":
                    return "noto-serif-sc";
                case "zcool-qingke":
                case "zcool":
                case "display":
                    return "zcool-qingke";
                default:
                    return "noto-sans-sc";
            }
        }

        private static string UiFontResourceForPreset(string presetKey)
        {
            switch (presetKey)
            {
                case "noto-serif-sc":
                    return "GemDuelFonts/NotoSerifSC-SDF";
                case "zcool-qingke":
                    return "GemDuelFonts/ZCOOLQingKeHuangYou-SDF";
                default:
                    return "GemDuelFonts/NotoSansSC-SDF";
            }
        }

        private static FontStyles FontStyleForTextMeshPro(FontStyle style)
        {
            switch (style)
            {
                case FontStyle.Bold:
                    return FontStyles.Bold;
                case FontStyle.Italic:
                    return FontStyles.Italic;
                case FontStyle.BoldAndItalic:
                    return FontStyles.Bold | FontStyles.Italic;
                default:
                    return FontStyles.Normal;
            }
        }

        private static string AlignmentNameForAnchor(TextAnchor anchor)
        {
            switch (anchor)
            {
                case TextAnchor.LowerLeft:
                case TextAnchor.MiddleLeft:
                case TextAnchor.UpperLeft:
                    return "Left";
                case TextAnchor.LowerRight:
                case TextAnchor.MiddleRight:
                case TextAnchor.UpperRight:
                    return "Right";
                default:
                    return "Center";
            }
        }

        private static string AlignmentNameForText(TextAlignmentOptions alignment)
        {
            var name = alignment.ToString();
            if (name.Contains("Left"))
            {
                return "Left";
            }

            if (name.Contains("Right"))
            {
                return "Right";
            }

            return "Center";
        }

        private Texture2D LoadPublicTexture(params string[] assetSegments)
        {
            var resourcePath = PublicResourcePath(assetSegments);
            if (textureCache.TryGetValue(resourcePath, out var cachedTexture))
            {
                return cachedTexture;
            }

            var texture = Resources.Load<Texture2D>(resourcePath);
            if (texture == null)
            {
                return null;
            }

            texture.wrapMode = TextureWrapMode.Clamp;
            texture.filterMode = FilterMode.Bilinear;
            textureCache[resourcePath] = texture;
            return texture;
        }

        private static string PublicResourcePath(params string[] assetSegments)
        {
            var joined = string.Join("/", assetSegments).Replace("\\", "/");
            if (joined.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
            {
                joined = joined.Substring(0, joined.Length - ".png".Length);
            }

            return "GemDuelPublicAssets/" + joined;
        }

        private void BuildStatusText()
        {
            var status = GameObject.Find("Status Topbar") ?? new GameObject("Status Topbar");
            status.transform.position = new Vector3(100f, 100f, 0f);
            statusText = status.GetComponent<TMP_Text>();
            if (statusText == null)
            {
                statusText = status.AddComponent<TextMeshPro>();
            }
            ConfigureText(statusText, "Loading GemDuel sidecar...", 0.12f, new Color(0.78f, 0.84f, 0.92f, 0f), TextAnchor.MiddleLeft, FontStyle.Normal);
        }

        private void SetStatus(string message)
        {
            if (statusText != null)
            {
                statusText.text = message;
            }
        }

        private void ClearRenderedState()
        {
            if (renderedRoots.Count > 0)
            {
                foreach (var root in renderedRoots.ToArray())
                {
                    RetireRenderedStateObject(root);
                }

                renderedRoots.Clear();
                renderRoot = null;
                return;
            }

            foreach (var obj in FindObjectsByType<GameObject>(FindObjectsSortMode.None))
            {
                if (obj == null)
                {
                    continue;
                }

                if (obj.name == "GemDuel Rendered State")
                {
                    RetireRenderedStateObject(obj);
                }
            }
        }

        private void CreateRenderedStateRoot()
        {
            renderRoot = new GameObject("GemDuel Rendered State");
            renderedRoots.Add(renderRoot);
        }

        private static void RetireRenderedStateObject(GameObject target)
        {
            if (target == null)
            {
                return;
            }

            foreach (var viewTarget in target.GetComponentsInChildren<GemDuelViewTarget>(true))
            {
                viewTarget.Clickable = false;
                viewTarget.enabled = false;
            }

            target.SetActive(false);
            DestroyUnityObject(target);
        }

        private void PreparePreviewBackgroundCapture()
        {
            if (previewContext != null)
            {
                previewContext = null;
                RenderState();
            }

            CapturePreviewBackgroundTexture();
        }

        private void CapturePreviewBackgroundTexture()
        {
            ClearPreviewBackgroundTexture();
            if (!Application.isPlaying && !previewBackdropCaptureEnabled)
            {
                return;
            }

            var camera = Camera.main;
            if (camera == null)
            {
                return;
            }

            var width = Math.Max(1, automationViewportWidth);
            var height = Math.Max(1, automationViewportHeight);
            const int downsample = 6;
            var previewWidth = Math.Max(1, width / downsample);
            var previewHeight = Math.Max(1, height / downsample);
            var renderTexture = new RenderTexture(previewWidth, previewHeight, 16)
            {
                filterMode = FilterMode.Bilinear,
                wrapMode = TextureWrapMode.Clamp,
            };
            var previewTexture = new Texture2D(previewWidth, previewHeight, TextureFormat.RGB24, false)
            {
                filterMode = FilterMode.Bilinear,
                wrapMode = TextureWrapMode.Clamp,
            };
            var previousTarget = camera.targetTexture;
            var previousActive = RenderTexture.active;
            var previousAspect = camera.aspect;

            try
            {
                camera.aspect = (float)width / height;
                camera.targetTexture = renderTexture;
                RenderTexture.active = renderTexture;
                camera.Render();
                previewTexture.ReadPixels(new Rect(0, 0, previewWidth, previewHeight), 0, 0);
                previewTexture.Apply(false, false);
                previewBackgroundTexture = previewTexture;
                previewTexture = null;
            }
            finally
            {
                camera.targetTexture = previousTarget;
                camera.aspect = previousAspect;
                RenderTexture.active = previousActive;
                DestroyUnityObject(renderTexture);
                if (previewTexture != null)
                {
                    DestroyUnityObject(previewTexture);
                }
            }
        }

        private void ClearPreviewBackgroundTexture()
        {
            if (previewBackgroundTexture == null)
            {
                return;
            }

            DestroyUnityObject(previewBackgroundTexture);
            previewBackgroundTexture = null;
        }

        private void OnDestroy()
        {
            ClearPreviewBackgroundTexture();
        }

        private static void BuildCamera()
        {
            var existing = Camera.main;
            if (existing != null)
            {
                existing.orthographic = true;
                existing.orthographicSize = 5f;
                existing.transform.position = new Vector3(0f, 0f, -10f);
                existing.backgroundColor = new Color(0.05f, 0.06f, 0.08f);
                return;
            }

            var cameraObject = new GameObject("Main Camera");
            var camera = cameraObject.AddComponent<Camera>();
            camera.tag = "MainCamera";
            camera.orthographic = true;
            camera.orthographicSize = 5f;
            camera.backgroundColor = new Color(0.05f, 0.06f, 0.08f);
            cameraObject.transform.position = new Vector3(0f, 0f, -10f);
        }

        private JObject GetNextEvent()
        {
            if (activeReplay == null || nextFixtureEventIndex >= activeReplay.Events.Count)
            {
                return null;
            }

            return activeReplay.Events[nextFixtureEventIndex];
        }

        private bool IsNextCoord(int row, int column)
        {
            var next = GetNextEvent();
            var eventType = next?.Value<string>("type");
            if (eventType == "take_gems")
            {
                return ContainsCoord((JArray)next["coords"], row, column);
            }

            if (eventType == "take_bonus_gem")
            {
                return MatchesCoord((JObject)next["coord"], row, column);
            }

            if (eventType == "reserve_card" && currentState.Phase == "RESERVE_WAITING_GEM")
            {
                return MatchesCoord((JObject)next["goldCoord"], row, column);
            }

            return false;
        }

        private bool IsNextMarketCard(string instanceId, int level, int index)
        {
            var next = GetNextEvent();
            var eventType = next?.Value<string>("type");
            return (eventType == "buy_card" || eventType == "reserve_card") &&
                next.Value<string>("instanceId") == instanceId &&
                MatchesMarketRef(next, level, index);
        }

        private static bool ContainsCoord(JArray coords, int row, int column)
        {
            return coords.Any(coord => MatchesCoord((JObject)coord, row, column));
        }

        private static bool MatchesCoord(JObject coord, int row, int column)
        {
            return coord != null && coord.Value<int>("r") == row && coord.Value<int>("c") == column;
        }

        private static bool MatchesMarketRef(JObject replayEvent, GemDuelViewTarget target)
        {
            return replayEvent.Value<string>("instanceId") == target.InstanceId && MatchesMarketRef(replayEvent, target.Level, target.Index);
        }

        private static bool MatchesMarketRef(JObject replayEvent, int level, int index)
        {
            var marketRef = (JObject)replayEvent["marketRef"];
            return marketRef != null && marketRef.Value<int>("level") == level && marketRef.Value<int>("idx") == index;
        }

        private JObject BuildTakeGemsEvent(JObject template)
        {
            var replayEvent = (JObject)template.DeepClone();
            var coords = new JArray();
            foreach (var selected in selectedGemCoords)
            {
                coords.Add(new JObject { ["r"] = selected.x, ["c"] = selected.y });
            }

            replayEvent["coords"] = coords;
            return replayEvent;
        }

        private static int GetTakeGemsSelectionLimit(JObject replayEvent)
        {
            _ = replayEvent;
            return MaxTakeGemsSelectionCount;
        }

        private JArray BuildVisibleTargetSnapshot(int viewportWidth, int viewportHeight)
        {
            var targets = new JArray();
            var camera = Camera.main;
            if (camera != null && viewportHeight > 0)
            {
                camera.aspect = (float)viewportWidth / viewportHeight;
            }

            foreach (var target in FindObjectsByType<GemDuelViewTarget>(FindObjectsSortMode.None))
            {
                if (
                    target == null
                    || !target.isActiveAndEnabled
                    || !target.gameObject.activeInHierarchy
                )
                {
                    continue;
                }

                var item = new JObject
                {
                    ["kind"] = target.Kind,
                    ["semanticKey"] = target.SemanticKey,
                    ["eventType"] = target.EventType,
                    ["row"] = target.Row,
                    ["column"] = target.Column,
                    ["level"] = target.Level,
                    ["index"] = target.Index,
                    ["instanceId"] = target.InstanceId,
                    ["royalId"] = target.RoyalId,
                    ["gemId"] = target.GemId,
                    ["buffId"] = target.BuffId,
                    ["clickable"] = target.Clickable,
                    ["inputDriver"] = target.Clickable ? "unity-hit-target" : "semantic-bounds",
                    ["world"] = new JObject
                    {
                        ["x"] = Math.Round(target.transform.position.x, 3),
                        ["y"] = Math.Round(target.transform.position.y, 3),
                        ["z"] = Math.Round(target.transform.position.z, 3),
                        ["width"] = Math.Round(target.Size.x, 3),
                        ["height"] = Math.Round(target.Size.y, 3),
                    },
                };

                if (camera != null && target.Size != Vector2.zero)
                {
                    var half = target.Size * 0.5f;
                    var min = camera.WorldToViewportPoint(
                        target.transform.position - new Vector3(half.x, half.y, 0f)
                    );
                    var max = camera.WorldToViewportPoint(
                        target.transform.position + new Vector3(half.x, half.y, 0f)
                    );
                    item["rect"] = new JObject
                    {
                        ["x"] = Math.Round(min.x * viewportWidth, 2),
                        ["y"] = Math.Round((1f - max.y) * viewportHeight, 2),
                        ["width"] = Math.Round((max.x - min.x) * viewportWidth, 2),
                        ["height"] = Math.Round((max.y - min.y) * viewportHeight, 2),
                    };
                }

                targets.Add(item);
            }

            targets = DeduplicateVisibleTargets(targets);
            AppendSyntheticAutomationActionTargets(targets);
            return targets;
        }

        private static JArray DeduplicateVisibleTargets(JArray rawTargets)
        {
            var bestByKey = new Dictionary<string, JObject>(StringComparer.Ordinal);
            foreach (var item in rawTargets.OfType<JObject>())
            {
                var key = item.Value<string>("semanticKey");
                if (string.IsNullOrEmpty(key))
                {
                    continue;
                }

                if (!bestByKey.TryGetValue(key, out var existing) || IsBetterVisibleTarget(item, existing))
                {
                    bestByKey[key] = item;
                }
            }

            var emittedKeys = new HashSet<string>(StringComparer.Ordinal);
            var deduped = new JArray();
            foreach (var item in rawTargets.OfType<JObject>())
            {
                var key = item.Value<string>("semanticKey");
                if (string.IsNullOrEmpty(key))
                {
                    deduped.Add(item);
                    continue;
                }

                if (!emittedKeys.Add(key))
                {
                    continue;
                }

                deduped.Add(bestByKey[key]);
            }

            return deduped;
        }

        private static bool IsBetterVisibleTarget(JObject candidate, JObject existing)
        {
            var candidateClickable = candidate.Value<bool>("clickable");
            var existingClickable = existing.Value<bool>("clickable");
            if (candidateClickable != existingClickable)
            {
                return candidateClickable;
            }

            var candidateKind = candidate.Value<string>("kind") ?? string.Empty;
            var existingKind = existing.Value<string>("kind") ?? string.Empty;
            if (candidateKind.Length != existingKind.Length)
            {
                return candidateKind.Length > existingKind.Length;
            }

            if (candidate.Value<string>("semanticKey") == existing.Value<string>("semanticKey"))
            {
                var candidateActionable = !string.IsNullOrEmpty(candidate.Value<string>("eventType"));
                var existingActionable = !string.IsNullOrEmpty(existing.Value<string>("eventType"));
                if (candidateActionable != existingActionable)
                {
                    return candidateActionable;
                }
            }

            var candidateZ = candidate["world"]?.Value<double?>("z") ?? double.MaxValue;
            var existingZ = existing["world"]?.Value<double?>("z") ?? double.MaxValue;
            return candidateZ < existingZ;
        }

        private void AppendSyntheticAutomationActionTargets(JArray targets)
        {
            var overlay = FindSemanticTarget(targets, "card.preview.overlay");
            if (overlay != null && FindSemanticTarget(targets, "card.preview.primaryAction") == null)
            {
                var rect = overlay["rect"] as JObject;
                if (rect != null)
                {
                    var actionWidth = 184d;
                    var actionHeight = 56d;
                    var actionGap = 16d;
                    var bottom = Math.Min(150d, Math.Max(72d, rect.Value<double>("height") * 0.11d));
                    targets.Add(
                        BuildSyntheticAutomationTarget(
                            "card.preview.primaryAction",
                            rect.Value<double>("x") + rect.Value<double>("width") / 2d - (actionWidth * 2d + actionGap) / 2d,
                            rect.Value<double>("y") + rect.Value<double>("height") - bottom - actionHeight,
                            actionWidth,
                            actionHeight
                        )
                    );
                }
            }

            var board = FindSemanticTarget(targets, "board.root");
            if (board != null && FindSemanticTarget(targets, "turn.end") == null)
            {
                var rect = board["rect"] as JObject;
                if (rect != null)
                {
                    var boardWidth = rect.Value<double>("width");
                    var boardHeight = rect.Value<double>("height");
                    var actionWidth = 184d;
                    var actionHeight = 56d;
                    var actionTopGap = 16d;
                    if (UseCompactSyntheticTurnEndTarget())
                    {
                        actionWidth = boardWidth * (136.51d / 412.87d);
                        actionHeight = boardHeight * (38.36d / 412.87d);
                        actionTopGap = boardHeight * (17.36d / 412.87d);
                    }

                    targets.Add(
                        BuildSyntheticAutomationTarget(
                            "turn.end",
                            rect.Value<double>("x") + rect.Value<double>("width") / 2d - actionWidth / 2d,
                            rect.Value<double>("y") + rect.Value<double>("height") + actionTopGap,
                            actionWidth,
                            actionHeight
                        )
                    );
                }
            }
        }

        private bool UseCompactSyntheticTurnEndTarget()
        {
            if (!automationInteractiveReplayMode)
            {
                return false;
            }

            if (previewContext != null || settingsOpen || !string.IsNullOrEmpty(errorBanner))
            {
                return true;
            }

            if (previewInteractionLayoutSticky)
            {
                return true;
            }

            var previousEventType = PreviousReplayEventType();
            return previousEventType == "replenish" || previousEventType == "select_royal";
        }

        private bool UseCompactLiveActionLayout()
        {
            if (!automationInteractiveReplayMode)
            {
                return false;
            }

            return previewContext != null
                || previewInteractionLayoutSticky
                || settingsOpen
                || !string.IsNullOrEmpty(errorBanner);
        }

        private static JObject FindSemanticTarget(JArray targets, string semanticKey)
        {
            foreach (var target in targets)
            {
                var item = target as JObject;
                if (item != null && item.Value<string>("semanticKey") == semanticKey)
                {
                    return item;
                }
            }

            return null;
        }

        private static JObject BuildSyntheticAutomationTarget(
            string semanticKey,
            double x,
            double y,
            double width,
            double height
        )
        {
            return new JObject
            {
                ["kind"] = "Synthetic",
                ["semanticKey"] = semanticKey,
                ["eventType"] = "parity-synthetic",
                ["row"] = -1,
                ["column"] = -1,
                ["level"] = -1,
                ["index"] = -1,
                ["instanceId"] = null,
                ["royalId"] = null,
                ["gemId"] = null,
                ["buffId"] = null,
                ["clickable"] = false,
                ["inputDriver"] = "synthetic-bounds",
                ["world"] = new JObject
                {
                    ["x"] = 0,
                    ["y"] = 0,
                    ["width"] = 0,
                    ["height"] = 0,
                },
                ["rect"] = new JObject
                {
                    ["x"] = Math.Round(x, 2),
                    ["y"] = Math.Round(y, 2),
                    ["width"] = Math.Round(width, 2),
                    ["height"] = Math.Round(height, 2),
                },
            };
        }

        private static bool ValidateGemSelection(IReadOnlyList<Vector2Int> coords, bool isFinalSelection, out string error)
        {
            error = string.Empty;
            if (coords.Count <= 1)
            {
                return true;
            }

            var sorted = coords.OrderBy(coord => coord.x).ThenBy(coord => coord.y).ToList();
            for (var i = 0; i < sorted.Count - 1; i += 1)
            {
                if (sorted[i] == sorted[i + 1])
                {
                    error = "Select unique gems.";
                    return false;
                }
            }

            var first = sorted[0];
            var last = sorted[sorted.Count - 1];
            var dr = last.x - first.x;
            var dc = last.y - first.y;
            var isRow = dr == 0;
            var isColumn = dc == 0;
            var isDiagonal = Math.Abs(dr) == Math.Abs(dc);
            if (!isRow && !isColumn && !isDiagonal)
            {
                error = "Gems must form a straight row, column, or diagonal.";
                return false;
            }

            var span = Math.Max(Math.Abs(dr), Math.Abs(dc));
            if (span > 2)
            {
                error = "Take-gems selection can span at most three adjacent cells.";
                return false;
            }

            if (coords.Count == 2 && span > 1)
            {
                if (isFinalSelection)
                {
                    error = "Two-gem selections cannot have a gap.";
                    return false;
                }

                return true;
            }

            for (var i = 1; i < sorted.Count - 1; i += 1)
            {
                var gem = sorted[i];
                var crossProduct = (gem.x - first.x) * dc - (gem.y - first.y) * dr;
                if (crossProduct != 0)
                {
                    error = "Gems must form a straight row, column, or diagonal.";
                    return false;
                }
            }

            if (coords.Count == 3)
            {
                var middle = sorted[1];
                var expectedMiddle = new Vector2Int(
                    first.x + (dr == 0 ? 0 : dr > 0 ? 1 : -1),
                    first.y + (dc == 0 ? 0 : dc > 0 ? 1 : -1)
                );
                if (middle != expectedMiddle)
                {
                    error = "Three selected gems must be contiguous.";
                    return false;
                }
            }

            return true;
        }

        private string DescribeEvent(JObject replayEvent)
        {
            if (replayEvent == null)
            {
                return "complete";
            }

            var type = replayEvent.Value<string>("type") ?? "unknown";
            var actor = replayEvent.Value<string>("actor") ?? "?";
            switch (type)
            {
                case "take_gems":
                    return actor + " take " + ((JArray)replayEvent["coords"]).Count + " board gem(s)";
                case "take_bonus_gem":
                    return actor + " take bonus board gem";
                case "buy_card":
                    return actor + " buy " + replayEvent.Value<string>("instanceId");
                case "reserve_card":
                    return actor + " reserve " + replayEvent.Value<string>("instanceId");
                case "select_royal":
                    return actor + " select royal " + replayEvent.Value<string>("royalId");
                case "select_buff":
                    return actor + " select buff " + replayEvent.Value<string>("buffId");
                case "steal_gem":
                    return actor + " steal " + replayEvent.Value<string>("gemId");
                case "discard_gem":
                    return actor + " discard " + replayEvent.Value<string>("gemId");
                case "replenish":
                    return actor + " replenish board";
                default:
                    return actor + " " + type;
            }
        }

        private CardDef ResolveCard(string instanceId)
        {
            var cardId = ResolveCardId(instanceId);
            if (catalog == null || string.IsNullOrEmpty(cardId))
            {
                return null;
            }

            catalog.Cards.TryGetValue(cardId, out var card);
            return card;
        }

        private int ResolveCardLevel(string instanceId)
        {
            var card = ResolveCard(instanceId);
            if (card != null && card.Level >= 1 && card.Level <= 3)
            {
                return card.Level;
            }

            var cardId = ResolveCardId(instanceId);
            if (!string.IsNullOrEmpty(cardId))
            {
                switch (cardId[0])
                {
                    case '1':
                        return 1;
                    case '2':
                        return 2;
                    case '3':
                        return 3;
                }
            }

            return -1;
        }

        private string ResolveCardId(string instanceIdOrCardId)
        {
            if (string.IsNullOrEmpty(instanceIdOrCardId))
            {
                return null;
            }

            if (activeReplay != null && activeReplay.Init.CardInstances.TryGetValue(instanceIdOrCardId, out var cardId))
            {
                return cardId;
            }

            var liveCardInstances = activeRulesInit?["cardInstances"] as JObject;
            if (liveCardInstances != null && liveCardInstances.TryGetValue(instanceIdOrCardId, out var liveCardIdToken))
            {
                var liveCardId = liveCardIdToken.Value<string>();
                if (!string.IsNullOrEmpty(liveCardId))
                {
                    return liveCardId;
                }
            }

            return instanceIdOrCardId;
        }

        private static string GemArtworkFileName(string gemId)
        {
            switch (gemId)
            {
                case "blue":
                    return "blue.png";
                case "white":
                    return "white.png";
                case "green":
                    return "green.png";
                case "black":
                    return "black.png";
                case "red":
                    return "red.png";
                case "pearl":
                    return "pearl.png";
                case "gold":
                    return "gold.png";
                default:
                    return null;
            }
        }

        private static string GuessBonusColorFromInstanceId(string instanceId)
        {
            if (string.IsNullOrEmpty(instanceId))
            {
                return "null";
            }

            if (instanceId.Contains("-bl"))
            {
                return "blue";
            }

            if (instanceId.Contains("-wh"))
            {
                return "white";
            }

            if (instanceId.Contains("-gr"))
            {
                return "green";
            }

            if (instanceId.Contains("-bk"))
            {
                return "black";
            }

            if (instanceId.Contains("-re"))
            {
                return "red";
            }

            if (instanceId.Contains("-pe"))
            {
                return "pearl";
            }

            if (instanceId.Contains("-jo") || instanceId.Contains("-go"))
            {
                return "gold";
            }

            return "null";
        }

        private string BuildTableauSummary(string player)
        {
            var counts = new Dictionary<string, int>(StringComparer.Ordinal);
            foreach (var color in GemOrder)
            {
                counts[color] = 0;
            }

            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                var instanceId = entry.Value<string>("instanceId");
                var card = ResolveCard(instanceId);
                if (card != null && counts.ContainsKey(card.BonusColor))
                {
                    counts[card.BonusColor] += Math.Max(1, card.BonusCount);
                }
            }

            return "tableau " + string.Join(" ", GemOrder.Select(color => ShortGem(color) + ":" + counts[color]));
        }

        private List<string> GetPlayerTableauCardIds(string player, string color)
        {
            var ids = new List<string>();
            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                var instanceId = entry.Value<string>("instanceId");
                var card = ResolveCard(instanceId);
                var bonusColor = card?.BonusColor ?? GuessBonusColorFromInstanceId(instanceId);
                var isSpecial = bonusColor == "null" || bonusColor == "pearl";
                if ((color == "pure-royal" && isSpecial) || bonusColor == color)
                {
                    ids.Add(instanceId);
                }
            }

            if (color == "pure-royal")
            {
                var royals = (JArray)((JObject)currentState.Snapshot["playerRoyals"])[player];
                foreach (var royalToken in royals)
                {
                    ids.Add(royalToken.Value<string>());
                }
            }

            return ids;
        }

        private (int points, int bonus) GetPlayerTableauStats(string player, string color)
        {
            var points = 0;
            var bonus = 0;
            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                var instanceId = entry.Value<string>("instanceId");
                var card = ResolveCard(instanceId);
                if (card == null)
                {
                    continue;
                }

                var isSpecial = card.BonusColor == "null" || card.BonusColor == "pearl";
                if ((color == "pure-royal" && isSpecial) || card.BonusColor == color)
                {
                    points += card.Points;
                    bonus += Math.Max(0, card.BonusCount);
                }
            }

            if (color == "pure-royal")
            {
                var royals = (JArray)((JObject)currentState.Snapshot["playerRoyals"])[player];
                foreach (var royalToken in royals)
                {
                    if (catalog.Royals.TryGetValue(royalToken.Value<string>(), out var royal))
                    {
                        points += royal.Points;
                    }
                }
            }

            return (points, bonus);
        }

        private int GetScore(string player)
        {
            var score = GetIntAt("extraPoints", player);
            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                score += ResolveCard(entry.Value<string>("instanceId"))?.Points ?? 0;
            }

            var royals = (JArray)((JObject)currentState.Snapshot["playerRoyals"])[player];
            foreach (var royalToken in royals)
            {
                if (catalog.Royals.TryGetValue(royalToken.Value<string>(), out var royal))
                {
                    score += royal.Points;
                }
            }

            return score;
        }

        private int GetCrowns(string player)
        {
            var crowns = GetIntAt("extraCrowns", player);
            var tableau = (JArray)((JObject)currentState.Snapshot["playerTableau"])[player];
            foreach (var entry in tableau)
            {
                crowns += ResolveCard(entry.Value<string>("instanceId"))?.Crowns ?? 0;
            }

            var royals = (JArray)((JObject)currentState.Snapshot["playerRoyals"])[player];
            foreach (var royalToken in royals)
            {
                if (catalog.Royals.TryGetValue(royalToken.Value<string>(), out var royal))
                {
                    crowns += royal.Crowns;
                }
            }

            return crowns;
        }

        private int GetPlayerTurnCount(string player)
        {
            var counts = (JObject)currentState.Snapshot["playerTurnCounts"];
            return counts == null ? 0 : counts.Value<int>(player);
        }

        private int GetArrayCount(string root, string player)
        {
            var value = (JObject)currentState.Snapshot[root];
            return value == null ? 0 : ((JArray)value[player]).Count;
        }

        private int GetIntAt(string root, string player)
        {
            var value = (JObject)currentState.Snapshot[root];
            return value == null ? 0 : value.Value<int>(player);
        }

        private string LabelForBuff(string buffId)
        {
            if (catalog != null && catalog.Buffs.TryGetValue(buffId, out var buff) && !string.IsNullOrEmpty(buff.Label))
            {
                return ShortLabel(buff.Label, 18);
            }

            return buffId;
        }

        private static string ShortLabel(string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value) || value.Length <= maxLength)
            {
                return value;
            }

            return value.Substring(0, maxLength - 1) + ".";
        }

        private static string ShortGem(string gemId)
        {
            switch (gemId)
            {
                case "blue":
                    return "BL";
                case "white":
                    return "WH";
                case "green":
                    return "GR";
                case "black":
                    return "BK";
                case "red":
                    return "RE";
                case "pearl":
                    return "PE";
                case "gold":
                    return "GO";
                case "null":
                    return "PO";
                default:
                    return "--";
            }
        }

        private static Color TextColorForGem(string gemId)
        {
            return gemId == "white" || gemId == "gold" || gemId == "pearl" || gemId == "green"
                ? Color.black
                : Color.white;
        }

        private static Color ColorForGem(string gemId)
        {
            switch (gemId)
            {
                case "blue":
                    return new Color(0.1f, 0.35f, 0.95f);
                case "white":
                    return new Color(0.86f, 0.88f, 0.9f);
                case "green":
                    return new Color(0.15f, 0.7f, 0.35f);
                case "black":
                    return new Color(0.08f, 0.08f, 0.1f);
                case "red":
                    return new Color(0.9f, 0.2f, 0.16f);
                case "pearl":
                    return new Color(0.95f, 0.55f, 0.78f);
                case "gold":
                    return new Color(1f, 0.72f, 0.12f);
                case "null":
                    return new Color(0.62f, 0.64f, 0.68f);
                default:
                    return new Color(0.2f, 0.2f, 0.22f);
            }
        }

        private static JObject BuildShellSnapshot()
        {
            var emptyInventory = new JObject
            {
                ["blue"] = 0,
                ["white"] = 0,
                ["green"] = 0,
                ["black"] = 0,
                ["red"] = 0,
                ["gold"] = 0,
                ["pearl"] = 0,
            };

            var emptyPlayerArrays = new JObject
            {
                ["p1"] = new JArray(),
                ["p2"] = new JArray(),
            };

            return new JObject
            {
                ["mode"] = "LOCAL_PVP",
                ["phase"] = "IDLE",
                ["turn"] = "p1",
                ["winner"] = null,
                ["board"] = new JArray(
                    Enumerable.Range(0, 5).Select(_ =>
                        new JArray("empty", "empty", "empty", "empty", "empty")
                    )
                ),
                ["bag"] = new JArray(),
                ["market"] = new JObject
                {
                    ["1"] = new JArray(),
                    ["2"] = new JArray(),
                    ["3"] = new JArray(),
                },
                ["decks"] = new JObject
                {
                    ["1"] = new JArray(),
                    ["2"] = new JArray(),
                    ["3"] = new JArray(),
                },
                ["royalDeck"] = new JArray("r91-ro", "r92-ro", "r93-ro", "r94-ro"),
                ["playerTableau"] = emptyPlayerArrays.DeepClone(),
                ["playerReserved"] = emptyPlayerArrays.DeepClone(),
                ["playerRoyals"] = emptyPlayerArrays.DeepClone(),
                ["inventories"] = new JObject
                {
                    ["p1"] = emptyInventory.DeepClone(),
                    ["p2"] = emptyInventory.DeepClone(),
                },
                ["privileges"] = new JObject
                {
                    ["p1"] = 0,
                    ["p2"] = 1,
                },
                ["extraPoints"] = new JObject
                {
                    ["p1"] = 0,
                    ["p2"] = 0,
                },
                ["extraCrowns"] = new JObject
                {
                    ["p1"] = 0,
                    ["p2"] = 0,
                },
                ["pendingReserve"] = null,
                ["pendingBuy"] = null,
            };
        }

        private sealed class PreviewContext
        {
            public string Source;
            public int Level;
            public int Index;
            public string InstanceId;
            public string Player;
            public string Color;
            public List<string> InstanceIds;
        }

        private sealed class HoverContext
        {
            public string SemanticKey;
            public string Kind;
            public string EventType;
            public int Row;
            public int Column;
            public int Level;
            public int Index;
            public string InstanceId;
            public string RoyalId;
            public string GemId;
            public string BuffId;

            public static HoverContext FromTarget(GemDuelViewTarget target)
            {
                return new HoverContext
                {
                    SemanticKey = string.IsNullOrEmpty(target.SemanticKey)
                        ? BuildTargetKey(target)
                        : target.SemanticKey,
                    Kind = target.Kind,
                    EventType = target.EventType,
                    Row = target.Row,
                    Column = target.Column,
                    Level = target.Level,
                    Index = target.Index,
                    InstanceId = target.InstanceId,
                    RoyalId = target.RoyalId,
                    GemId = target.GemId,
                    BuffId = target.BuffId,
                };
            }

            public static bool SameTarget(HoverContext left, HoverContext right)
            {
                if (left == null || right == null)
                {
                    return left == null && right == null;
                }

                return left.SemanticKey == right.SemanticKey
                    && left.Kind == right.Kind
                    && left.EventType == right.EventType
                    && left.Row == right.Row
                    && left.Column == right.Column
                    && left.Level == right.Level
                    && left.Index == right.Index
                    && left.InstanceId == right.InstanceId
                    && left.RoyalId == right.RoyalId
                    && left.GemId == right.GemId
                    && left.BuffId == right.BuffId;
            }

            private static string BuildTargetKey(GemDuelViewTarget target)
            {
                var parts = new[]
                {
                    target.Kind,
                    target.EventType,
                    target.Level >= 0 ? "level:" + target.Level : string.Empty,
                    target.Index >= 0 ? "index:" + target.Index : string.Empty,
                    target.Row >= 0 ? "row:" + target.Row : string.Empty,
                    target.Column >= 0 ? "column:" + target.Column : string.Empty,
                    target.InstanceId,
                    target.RoyalId,
                    target.GemId,
                    target.BuffId,
                };
                return string.Join("|", parts.Where(part => !string.IsNullOrEmpty(part)));
            }
        }

        private sealed class DraftBuffCopy
        {
            public DraftBuffCopy(
                string icon,
                string category,
                string title,
                string description,
                string footerLabel,
                string footerValue
            )
            {
                Icon = icon;
                Category = category;
                Title = title;
                Description = description;
                FooterLabel = footerLabel;
                FooterValue = footerValue;
            }

            public string Icon { get; private set; }
            public string Category { get; private set; }
            public string Title { get; private set; }
            public string Description { get; private set; }
            public string FooterLabel { get; private set; }
            public string FooterValue { get; private set; }
        }

        private sealed class LocalizedRulebookText
        {
            public LocalizedRulebookText(string en, string zh)
            {
                En = en;
                Zh = zh;
            }

            public string En { get; private set; }
            public string Zh { get; private set; }

            public string Text(string locale)
            {
                return locale == "en" ? En : Zh;
            }
        }

        private sealed class RulebookSectionContent
        {
            public RulebookSectionContent(
                string titleEn,
                string titleZh,
                IReadOnlyList<LocalizedRulebookText> items,
                string type = "section"
            )
            {
                Title = new LocalizedRulebookText(titleEn, titleZh);
                Items = items.ToArray();
                Type = type;
            }

            public LocalizedRulebookText Title { get; private set; }
            public IReadOnlyList<LocalizedRulebookText> Items { get; private set; }
            public string Type { get; private set; }
        }

        private sealed class RulebookPageContent
        {
            public RulebookPageContent(
                string titleEn,
                string titleZh,
                string summaryEn,
                string summaryZh,
                params RulebookSectionContent[] sections
            )
            {
                Title = new LocalizedRulebookText(titleEn, titleZh);
                Summary = new LocalizedRulebookText(summaryEn, summaryZh);
                Sections = sections ?? Array.Empty<RulebookSectionContent>();
            }

            public LocalizedRulebookText Title { get; private set; }
            public LocalizedRulebookText Summary { get; private set; }
            public IReadOnlyList<RulebookSectionContent> Sections { get; private set; }
        }

        private sealed class TextEvidence : MonoBehaviour
        {
            public TextAnchor Anchor { get; set; }
            public float CharacterSize { get; set; }
            public float LineSpacing { get; set; }
            public FontStyle RequestedStyle { get; set; }
        }

        private static void DestroyUnityObject(UnityEngine.Object target)
        {
            if (target == null)
            {
                return;
            }

            if (Application.isPlaying)
            {
                Destroy(target);
            }
            else
            {
                DestroyImmediate(target);
            }
        }
    }
}
