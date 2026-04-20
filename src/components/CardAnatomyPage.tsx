import React from 'react';
import { RotateCcw, Hand, Plus, Scroll, Crown } from 'lucide-react';
import { Card as CardComponent, STANDARD_CARD_SIZE } from './Card';
import { Card as CardType } from '../types';

// ==========================================
// Types & Interfaces
// ==========================================
interface CardAnatomyPageProps {
    theme: 'light' | 'dark';
    lang: 'en' | 'zh';
}

// ==========================================
// Mock Data Configuration
// ==========================================

/**
 * Sample Card Data
 * Used to display a standardized L2 card for anatomy explanation.
 * Features: Level 2, Blue Bonus, Special Ability, Crown, Moderate Cost.
 */
const SAMPLE_CARD: CardType = {
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

/**
 * Glossary Data
 * Defines the content for the grid section below the diagram.
 */
const ABILITIES = [
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
];

// ==========================================
// Component Implementation
// ==========================================

export const CardAnatomyPage: React.FC<CardAnatomyPageProps> = ({ theme, lang }) => {
    const isDark = theme === 'dark';
    const containerRef = React.useRef<HTMLDivElement>(null);
    const diagramHeightPx = 500;

    // State to track container size for responsive SVG drawing
    const [dimensions, setDimensions] = React.useState({ width: 0, height: diagramHeightPx });

    /**
     * Responsive Logic
     * Updates SVG coordinate system when the window resizes.
     */
    React.useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
            const observer = new ResizeObserver(updateDimensions);
            observer.observe(containerRef.current);
            window.addEventListener('resize', updateDimensions);

            return () => {
                observer.disconnect();
                window.removeEventListener('resize', updateDimensions);
            };
        }

        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Visual Constants
    const strokeColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(120, 113, 108, 0.5)';
    const anchorFill = isDark ? '#fbbf24' : '#d97706';

    // Text Style Constants (For consistency across labels)
    const labelTitleClass = `block text-base md:text-lg font-bold leading-tight`;
    const labelDescClass = `block text-sm md:text-base leading-6 ${isDark ? 'text-slate-400' : 'text-stone-500'}`;
    const standardCardScale = STANDARD_CARD_SIZE.width / 96;
    const scaleCardMetric = (value: number) => Math.max(1, Math.round(value * standardCardScale));

    const compactLayout = dimensions.width > 0 && dimensions.width < 920;
    const cardScale = compactLayout ? 1.7 : dimensions.width < 1120 ? 1.85 : 1.95;
    const cardWidthPx = STANDARD_CARD_SIZE.width * cardScale;
    const cardHeightPx = STANDARD_CARD_SIZE.height * cardScale;
    const cardLeftPx = dimensions.width / 2 - cardWidthPx / 2;
    const cardTopPx = dimensions.height / 2 - cardHeightPx / 2;
    const labelWidthPx = compactLayout ? 180 : 220;
    const sideGapPx = compactLayout ? 46 : 74;
    const topLabelTopPx = compactLayout ? 24 : 30;
    const bottomLabelBottomPx = compactLayout ? 24 : 32;
    const abilityLabelTopPx = Math.max(128, dimensions.height / 2 - (compactLayout ? 48 : 56));
    const topInsetPx = scaleCardMetric(4);
    const sideInsetPx = scaleCardMetric(6);
    const topClusterGapPx = scaleCardMetric(4);
    const pointFontSizePx = scaleCardMetric(18);
    const abilityIconSizePx = scaleCardMetric(12);
    const abilityBadgePaddingPx = scaleCardMetric(2);
    const abilityBadgeSizePx = abilityIconSizePx + abilityBadgePaddingPx * 2;
    const pointWidthPx =
        Number(SAMPLE_CARD.points) > 0
            ? Math.round(String(SAMPLE_CARD.points).length * pointFontSizePx * 0.62)
            : 0;
    const topClusterHeightPx = Math.max(pointFontSizePx, abilityBadgeSizePx);
    const abilityAnchorXWithinCardPx =
        sideInsetPx +
        (pointWidthPx > 0 ? pointWidthPx + topClusterGapPx : 0) +
        abilityBadgeSizePx / 2;
    const abilityAnchorYWithinCardPx = topInsetPx + topClusterHeightPx / 2;

    const createConnectorPath = (startX: number, startY: number, endX: number, endY: number) => {
        const controlX = startX + (endX - startX) * 0.58;
        const controlY = startY + (endY - startY) * 0.32;
        return `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;
    };

    const connectorTargets = {
        prestige: {
            startX: cardLeftPx - 24,
            startY: topLabelTopPx + 42,
            endX: cardLeftPx + 24,
            endY: cardTopPx + 34,
            fill: isDark ? '#fbbf24' : '#d97706',
        },
        bonus: {
            startX: cardLeftPx + cardWidthPx + 24,
            startY: topLabelTopPx + 42,
            endX: cardLeftPx + cardWidthPx - 24,
            endY: cardTopPx + 34,
            fill: isDark ? '#60a5fa' : '#2563eb',
        },
        ability: {
            startX: cardLeftPx - 28,
            startY: abilityLabelTopPx + 34,
            endX: cardLeftPx + abilityAnchorXWithinCardPx * cardScale,
            endY: cardTopPx + abilityAnchorYWithinCardPx * cardScale,
            fill: isDark ? '#c084fc' : '#9333ea',
        },
        cost: {
            startX: cardLeftPx - 24,
            startY: dimensions.height - bottomLabelBottomPx - 42,
            endX: cardLeftPx + 34,
            endY: cardTopPx + cardHeightPx - 62,
            fill: isDark ? '#34d399' : '#059669',
        },
        crowns: {
            startX: cardLeftPx + cardWidthPx + 24,
            startY: dimensions.height - bottomLabelBottomPx - 42,
            endX: cardLeftPx + cardWidthPx - 28,
            endY: cardTopPx + cardHeightPx - 34,
            fill: isDark ? '#facc15' : '#ca8a04',
        },
    };

    return (
        <div className="flex flex-col gap-10">
            {/* ------------------------------------------------------------ */}
            {/* Section 1: Interactive Anatomy Diagram                       */}
            {/* Contains the scaled card, floating labels, and SVG connectors */}
            {/* ------------------------------------------------------------ */}
            <section>
                <h4
                    className={`text-xl font-black uppercase tracking-wider mb-3 ${isDark ? 'text-slate-200' : 'text-stone-700'}`}
                >
                    {lang === 'en' ? 'Card Layout' : '卡牌结构'}
                </h4>

                <div
                    ref={containerRef}
                    className="relative w-full h-[460px] lg:h-[500px] flex justify-center items-center select-none"
                >
                    {/* Layer 1: The Mock Card */}
                    <div
                        className="z-10 origin-center shadow-2xl rounded-lg"
                        style={{ transform: `scale(${cardScale})` }}
                    >
                        <CardComponent
                            card={SAMPLE_CARD}
                            canBuy={false}
                            theme={theme}
                            size="default"
                            className="pointer-events-none"
                        />
                    </div>

                    {/* Layer 2: The Labels */}
                    {/* Positioned absolutely relative to the container. */}
                    {/* Note: Percentages here should align roughly with SVG start points. */}

                    {/* Top Left: Prestige */}
                    <div
                        className="absolute text-right"
                        style={{
                            top: `${topLabelTopPx}px`,
                            left: `${cardLeftPx - sideGapPx - labelWidthPx}px`,
                            width: `${labelWidthPx}px`,
                        }}
                    >
                        <span
                            className={`${labelTitleClass} ${isDark ? 'text-amber-400' : 'text-amber-600'}`}
                        >
                            {lang === 'en' ? 'Prestige Points' : '声望值'}
                        </span>
                        {/* FIX: Changed color from yellow to slate/stone for hierarchy */}
                        <span className={labelDescClass}>
                            {lang === 'en' ? '20 Total Points to Win!' : '20个总分数即可获胜！'}
                        </span>
                        <span className={`${labelDescClass} whitespace-nowrap`}>
                            {lang === 'en'
                                ? '10 Single Color Points to Win!'
                                : '10个同色分数即可获胜！'}
                        </span>
                    </div>

                    {/* Top Right: Bonus */}
                    <div
                        className="absolute text-left"
                        style={{
                            top: `${topLabelTopPx}px`,
                            left: `${cardLeftPx + cardWidthPx + sideGapPx}px`,
                            width: `${labelWidthPx}px`,
                        }}
                    >
                        <span
                            className={`${labelTitleClass} ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                            {lang === 'en' ? 'Gem Bonus' : '宝石奖励'}
                        </span>
                        <span className={labelDescClass}>
                            {lang === 'en' ? 'Discount on future buys' : '未来购买折扣'}
                        </span>
                    </div>

                    {/* Left Center: Ability */}
                    <div
                        className="absolute text-right"
                        style={{
                            top: `${abilityLabelTopPx}px`,
                            left: `${cardLeftPx - sideGapPx - labelWidthPx - 14}px`,
                            width: `${labelWidthPx + 14}px`,
                        }}
                    >
                        <span
                            className={`${labelTitleClass} ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                        >
                            {lang === 'en' ? 'Special Ability' : '特殊能力'}
                        </span>
                        <span className={labelDescClass}>
                            {lang === 'en' ? 'Icon triggers on buy' : '购买时触发效果'}
                        </span>
                    </div>

                    {/* Bottom Left: Cost */}
                    <div
                        className="absolute text-right"
                        style={{
                            bottom: `${bottomLabelBottomPx}px`,
                            left: `${cardLeftPx - sideGapPx - labelWidthPx}px`,
                            width: `${labelWidthPx}px`,
                        }}
                    >
                        <span
                            className={`${labelTitleClass} ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                        >
                            {lang === 'en' ? 'Gem Cost' : '宝石成本'}
                        </span>
                        <span className={labelDescClass}>
                            {lang === 'en' ? 'Price to purchase' : '购买价格'}
                        </span>
                    </div>

                    {/* Bottom Right: Crowns */}
                    <div
                        className="absolute text-left"
                        style={{
                            bottom: `${bottomLabelBottomPx}px`,
                            left: `${cardLeftPx + cardWidthPx + sideGapPx}px`,
                            width: `${labelWidthPx}px`,
                        }}
                    >
                        <div className="flex items-center gap-1">
                            <Crown
                                size={16}
                                className={isDark ? 'text-yellow-400' : 'text-yellow-500'}
                                fill="currentColor"
                            />
                            <span
                                className={`${labelTitleClass} ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}
                            >
                                {lang === 'en' ? 'Crowns' : '皇冠'}
                            </span>
                        </div>
                        <span className={labelDescClass}>
                            {lang === 'en' ? 'Collect for Royals.' : '收集以解锁皇室卡。'}
                        </span>
                        <span
                            className={`block text-sm md:text-base font-bold leading-6 ${isDark ? 'text-yellow-500' : 'text-yellow-700'}`}
                        >
                            {lang === 'en' ? '10 Crowns to Win!' : '10个即可获胜！'}
                        </span>
                    </div>

                    {/* Layer 3: SVG Connectors */}
                    {/* Overlays the entire area. Used to draw lines from Labels to Card Elements. */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
                        <defs>
                            <marker id="dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
                                <circle cx="3" cy="3" r="2" fill={anchorFill} />
                            </marker>
                        </defs>

                        {/* Guard clause: Wait for dimensions to stabilize before drawing */}
                        {dimensions.width > 0 && (
                            <>
                                {/* PATH LOGIC:
                                    M = Move to Start (Near Label)
                                    Q = Quadratic Bezier Curve Control Point
                                    Final Coords = End Point (On Card UI Element)
                                 */}

                                {/* 1. Prestige (Top Left) */}
                                <path
                                    d={createConnectorPath(
                                        connectorTargets.prestige.startX,
                                        connectorTargets.prestige.startY,
                                        connectorTargets.prestige.endX,
                                        connectorTargets.prestige.endY
                                    )}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                />
                                <circle
                                    cx={connectorTargets.prestige.endX}
                                    cy={connectorTargets.prestige.endY}
                                    r="3"
                                    fill={connectorTargets.prestige.fill}
                                />

                                {/* 2. Gem Bonus (Top Right) */}
                                <path
                                    d={createConnectorPath(
                                        connectorTargets.bonus.startX,
                                        connectorTargets.bonus.startY,
                                        connectorTargets.bonus.endX,
                                        connectorTargets.bonus.endY
                                    )}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                />
                                <circle
                                    cx={connectorTargets.bonus.endX}
                                    cy={connectorTargets.bonus.endY}
                                    r="3"
                                    fill={connectorTargets.bonus.fill}
                                />

                                {/* 3. Ability (Top Center) */}
                                <path
                                    d={createConnectorPath(
                                        connectorTargets.ability.startX,
                                        connectorTargets.ability.startY,
                                        connectorTargets.ability.endX,
                                        connectorTargets.ability.endY
                                    )}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                />
                                <circle
                                    cx={connectorTargets.ability.endX}
                                    cy={connectorTargets.ability.endY}
                                    r="3"
                                    fill={connectorTargets.ability.fill}
                                />

                                {/* 4. Cost (Bottom Left) */}
                                <path
                                    d={createConnectorPath(
                                        connectorTargets.cost.startX,
                                        connectorTargets.cost.startY,
                                        connectorTargets.cost.endX,
                                        connectorTargets.cost.endY
                                    )}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                />
                                <circle
                                    cx={connectorTargets.cost.endX}
                                    cy={connectorTargets.cost.endY}
                                    r="3"
                                    fill={connectorTargets.cost.fill}
                                />

                                {/* 5. Crowns (Bottom Right) */}
                                <path
                                    d={createConnectorPath(
                                        connectorTargets.crowns.startX,
                                        connectorTargets.crowns.startY,
                                        connectorTargets.crowns.endX,
                                        connectorTargets.crowns.endY
                                    )}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                />
                                <circle
                                    cx={connectorTargets.crowns.endX}
                                    cy={connectorTargets.crowns.endY}
                                    r="3"
                                    fill={connectorTargets.crowns.fill}
                                />
                            </>
                        )}
                    </svg>
                </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Section 2: Special Abilities Glossary                        */}
            {/* Grid layout explaining icons                                 */}
            {/* ------------------------------------------------------------ */}
            <section>
                <h4
                    className={`text-xl font-black uppercase tracking-wider mb-5 ${isDark ? 'text-slate-200' : 'text-stone-700'}`}
                >
                    {lang === 'en' ? 'Special Abilities' : '特殊能力'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    {ABILITIES.map((ability) => {
                        const Icon = ability.icon;
                        return (
                            <div
                                key={ability.id}
                                className={`flex items-start gap-5 p-5 md:p-6 rounded-xl border transition-colors ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-stone-50 border-stone-200'}`}
                            >
                                <div
                                    className={`p-3 rounded-xl ${ability.color} shadow-md flex items-center justify-center shrink-0`}
                                >
                                    <Icon size={24} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span
                                        className={`text-lg md:text-xl font-bold ${isDark ? 'text-white' : 'text-stone-800'}`}
                                    >
                                        {ability.label[lang]}
                                    </span>
                                    <span
                                        className={`text-[15px] md:text-base leading-7 ${isDark ? 'text-slate-400' : 'text-stone-500'}`}
                                    >
                                        {ability.desc[lang]}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};
