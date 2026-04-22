import React from 'react';
import { Crown } from 'lucide-react';
import { translate, type AppLocale } from '@gemduel/shared';
import { Card as CardComponent, STANDARD_CARD_SIZE } from '../Card';
import { SAMPLE_CARD } from './cardAnatomyData';

type Theme = 'light' | 'dark';
type Lang = AppLocale;

interface CardAnatomyDiagramProps {
    theme: Theme;
    lang: Lang;
}

interface ConnectorTarget {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    fill: string;
}

interface LabelConfig {
    key: 'prestige' | 'bonus' | 'ability' | 'cost' | 'crowns';
    align: 'left' | 'right';
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    titleKey:
        | 'anatomy.prestige.title'
        | 'anatomy.bonus.title'
        | 'anatomy.ability.title'
        | 'anatomy.cost.title'
        | 'anatomy.crowns.title';
    titleClassName: string;
    descKeys: ReadonlyArray<
        | 'anatomy.prestige.desc1'
        | 'anatomy.prestige.desc2'
        | 'anatomy.bonus.desc'
        | 'anatomy.ability.desc'
        | 'anatomy.cost.desc'
        | 'anatomy.crowns.desc'
    >;
    strongDescKey?: 'anatomy.crowns.strong';
    crown?: boolean;
}

const labelTitleClass = (colorClass: string) =>
    `block text-base md:text-lg font-bold leading-tight ${colorClass}`;

const labelDescClass = (theme: Theme) =>
    `block text-sm md:text-base leading-6 ${theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`;

const LabelBlock: React.FC<{ theme: Theme; lang: Lang; label: LabelConfig }> = ({
    theme,
    lang,
    label,
}) => (
    <div
        className={`absolute ${label.align === 'right' ? 'text-right' : 'text-left'}`}
        style={{
            top: label.top !== undefined ? `${label.top}px` : undefined,
            bottom: label.bottom !== undefined ? `${label.bottom}px` : undefined,
            left: `${label.left}px`,
            width: `${label.width}px`,
        }}
    >
        {label.crown ? (
            <div className="flex items-center gap-1">
                <Crown
                    size={16}
                    className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}
                    fill="currentColor"
                />
                <span className={labelTitleClass(label.titleClassName)}>
                    {translate(lang, label.titleKey)}
                </span>
            </div>
        ) : (
            <span className={labelTitleClass(label.titleClassName)}>
                {translate(lang, label.titleKey)}
            </span>
        )}
        {label.descKeys.map((key) => (
            <span key={key} className={labelDescClass(theme)}>
                {translate(lang, key)}
            </span>
        ))}
        {label.strongDescKey && (
            <span
                className={`block text-sm md:text-base font-bold leading-6 ${label.crown ? (theme === 'dark' ? 'text-yellow-500' : 'text-yellow-700') : theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`}
            >
                {translate(lang, label.strongDescKey)}
            </span>
        )}
    </div>
);

export const CardAnatomyDiagram: React.FC<CardAnatomyDiagramProps> = ({ theme, lang }) => {
    const isDark = theme === 'dark';
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 500 });

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
    const strokeColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(120, 113, 108, 0.5)';
    const anchorFill = isDark ? '#fbbf24' : '#d97706';

    const connectorTargets: Record<LabelConfig['key'], ConnectorTarget> = {
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

    const labels: LabelConfig[] = [
        {
            key: 'prestige',
            align: 'right',
            top: topLabelTopPx,
            left: cardLeftPx - sideGapPx - labelWidthPx,
            width: labelWidthPx,
            titleKey: 'anatomy.prestige.title',
            titleClassName: isDark ? 'text-amber-400' : 'text-amber-600',
            descKeys: ['anatomy.prestige.desc1', 'anatomy.prestige.desc2'],
        },
        {
            key: 'bonus',
            align: 'left',
            top: topLabelTopPx,
            left: cardLeftPx + cardWidthPx + sideGapPx,
            width: labelWidthPx,
            titleKey: 'anatomy.bonus.title',
            titleClassName: isDark ? 'text-blue-400' : 'text-blue-600',
            descKeys: ['anatomy.bonus.desc'],
        },
        {
            key: 'ability',
            align: 'right',
            top: abilityLabelTopPx,
            left: cardLeftPx - sideGapPx - labelWidthPx - 14,
            width: labelWidthPx + 14,
            titleKey: 'anatomy.ability.title',
            titleClassName: isDark ? 'text-purple-400' : 'text-purple-600',
            descKeys: ['anatomy.ability.desc'],
        },
        {
            key: 'cost',
            align: 'right',
            bottom: bottomLabelBottomPx,
            left: cardLeftPx - sideGapPx - labelWidthPx,
            width: labelWidthPx,
            titleKey: 'anatomy.cost.title',
            titleClassName: isDark ? 'text-emerald-400' : 'text-emerald-600',
            descKeys: ['anatomy.cost.desc'],
        },
        {
            key: 'crowns',
            align: 'left',
            bottom: bottomLabelBottomPx,
            left: cardLeftPx + cardWidthPx + sideGapPx,
            width: labelWidthPx,
            titleKey: 'anatomy.crowns.title',
            titleClassName: isDark ? 'text-yellow-400' : 'text-yellow-600',
            descKeys: ['anatomy.crowns.desc'],
            strongDescKey: 'anatomy.crowns.strong',
            crown: true,
        },
    ];

    const createConnectorPath = (startX: number, startY: number, endX: number, endY: number) => {
        const controlX = startX + (endX - startX) * 0.58;
        const controlY = startY + (endY - startY) * 0.32;
        return `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;
    };

    return (
        <section>
            <h4
                className={`text-xl font-black uppercase tracking-wider mb-3 ${isDark ? 'text-slate-200' : 'text-stone-700'}`}
            >
                {translate(lang, 'anatomy.heading')}
            </h4>
            <div
                ref={containerRef}
                className="relative w-full h-[460px] lg:h-[500px] flex justify-center items-center select-none"
            >
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

                {labels.map((label) => (
                    <LabelBlock key={label.key} theme={theme} lang={lang} label={label} />
                ))}

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
                    <defs>
                        <marker id="dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
                            <circle cx="3" cy="3" r="2" fill={anchorFill} />
                        </marker>
                    </defs>

                    {dimensions.width > 0 &&
                        labels.map((label) => {
                            const target = connectorTargets[label.key];
                            return (
                                <React.Fragment key={label.key}>
                                    <path
                                        d={createConnectorPath(
                                            target.startX,
                                            target.startY,
                                            target.endX,
                                            target.endY
                                        )}
                                        fill="none"
                                        stroke={strokeColor}
                                        strokeWidth="1.5"
                                        strokeDasharray="4 4"
                                    />
                                    <circle
                                        cx={target.endX}
                                        cy={target.endY}
                                        r="3"
                                        fill={target.fill}
                                    />
                                </React.Fragment>
                            );
                        })}
                </svg>
            </div>
        </section>
    );
};
