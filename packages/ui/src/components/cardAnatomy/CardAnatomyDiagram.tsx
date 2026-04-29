import React from 'react';
import { Crown } from 'lucide-react';
import { translate, type AppLocale, type LexiconTermId } from '@gemduel/shared';
import { Card as CardComponent, FEATURED_CARD_SIZE } from '../Card';
import { ANATOMY_LAYOUT_CARD } from './cardAnatomyData';
import { LexiconTerm } from '../../lexicon/LexiconTerm';
import { LexiconText } from '../../lexicon/LexiconText';

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
    key: 'prestige' | 'ability' | 'bonus' | 'cost' | 'crowns';
    termId?: LexiconTermId;
    align: 'left' | 'right';
    anchor: string;
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    titleKey:
        | 'anatomy.prestige.title'
        | 'anatomy.ability.title'
        | 'anatomy.bonus.title'
        | 'anatomy.cost.title'
        | 'anatomy.crowns.title';
    titleClassName: string;
    descKeys: ReadonlyArray<
        | 'anatomy.prestige.desc1'
        | 'anatomy.prestige.desc2'
        | 'anatomy.ability.desc'
        | 'anatomy.bonus.desc'
        | 'anatomy.bonus.desc2'
        | 'anatomy.cost.desc'
        | 'anatomy.crowns.desc'
    >;
    strongDescKey?: 'anatomy.crowns.strong';
    crown?: boolean;
}

const labelTitleClass = (colorClass: string) =>
    `block text-[25px] md:text-[28px] font-bold leading-tight ${colorClass}`;

const labelDescClass = (theme: Theme) =>
    `block text-[22px] md:text-[25px] leading-[1.35] ${theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`;

const LabelBlock: React.FC<{ theme: Theme; lang: Lang; label: LabelConfig }> = ({
    theme,
    lang,
    label,
}) => (
    <div
        data-card-anatomy-label={label.key}
        data-card-anatomy-anchor={label.anchor}
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
                    size={24}
                    className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}
                    fill="currentColor"
                />
                <span className={labelTitleClass(label.titleClassName)}>
                    {label.termId ? (
                        <LexiconTerm termId={label.termId}>
                            {translate(lang, label.titleKey)}
                        </LexiconTerm>
                    ) : (
                        translate(lang, label.titleKey)
                    )}
                </span>
            </div>
        ) : (
            <span className={labelTitleClass(label.titleClassName)}>
                {label.termId ? (
                    <LexiconTerm termId={label.termId}>
                        {translate(lang, label.titleKey)}
                    </LexiconTerm>
                ) : (
                    translate(lang, label.titleKey)
                )}
            </span>
        )}
        {label.descKeys.map((key) => (
            <span key={key} className={labelDescClass(theme)}>
                <LexiconText text={translate(lang, key)} />
            </span>
        ))}
        {label.strongDescKey && (
            <span
                className={`block text-[22px] font-bold leading-[1.35] md:text-[25px] ${label.crown ? (theme === 'dark' ? 'text-yellow-500' : 'text-yellow-700') : theme === 'dark' ? 'text-slate-400' : 'text-stone-500'}`}
            >
                <LexiconText text={translate(lang, label.strongDescKey)} />
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

    const compactLayout = dimensions.width > 0 && dimensions.width < 920;
    const cardScale = compactLayout ? 1.7 : dimensions.width < 1120 ? 2.2 : 2.95;
    const cardWidthPx = FEATURED_CARD_SIZE.width * cardScale;
    const cardHeightPx = FEATURED_CARD_SIZE.height * cardScale;
    const cardLeftPx = dimensions.width / 2 - cardWidthPx / 2;
    const cardTopPx = dimensions.height / 2 - cardHeightPx / 2;
    const labelWidthPx = compactLayout ? 230 : 330;
    const sideGapPx = compactLayout ? 36 : 104;
    const topLabelTopPx = compactLayout ? 32 : 54;
    const bottomLabelBottomPx = compactLayout ? 32 : 54;
    const abilityLabelTopPx = compactLayout ? 232 : 250;
    const bonusLabelTopPx = compactLayout ? 210 : 232;
    const strokeColor = isDark ? '#f8fafc' : '#1f2937';
    const strokeHaloColor = isDark ? 'rgba(2, 6, 23, 0.92)' : 'rgba(255, 255, 255, 0.92)';
    const anchorFill = isDark ? '#fbbf24' : '#d97706';

    const connectorTargets: Record<LabelConfig['key'], ConnectorTarget> = {
        prestige: {
            startX: cardLeftPx - 24,
            startY: topLabelTopPx + 42,
            endX: cardLeftPx + cardWidthPx * 0.16,
            endY: cardTopPx + cardHeightPx * 0.09,
            fill: isDark ? '#fbbf24' : '#d97706',
        },
        ability: {
            startX: cardLeftPx - 24,
            startY: abilityLabelTopPx + 42,
            endX: cardLeftPx + cardWidthPx * 0.14,
            endY: cardTopPx + cardHeightPx * 0.17,
            fill: isDark ? '#c084fc' : '#7c3aed',
        },
        bonus: {
            startX: cardLeftPx + cardWidthPx + 24,
            startY: bonusLabelTopPx + 42,
            endX: cardLeftPx + cardWidthPx * 0.86,
            endY: cardTopPx + cardHeightPx * 0.13,
            fill: isDark ? '#60a5fa' : '#2563eb',
        },
        cost: {
            startX: cardLeftPx - 24,
            startY: dimensions.height - bottomLabelBottomPx - 42,
            endX: cardLeftPx + cardWidthPx * 0.14,
            endY: cardTopPx + cardHeightPx * 0.78,
            fill: isDark ? '#34d399' : '#059669',
        },
        crowns: {
            startX: cardLeftPx + cardWidthPx + 24,
            startY: topLabelTopPx + 42,
            endX: cardLeftPx + cardWidthPx * 0.52,
            endY: cardTopPx + cardHeightPx * 0.11,
            fill: isDark ? '#facc15' : '#ca8a04',
        },
    };

    const labels: LabelConfig[] = [
        {
            key: 'prestige',
            align: 'right',
            anchor: 'top-left-score-ribbon',
            top: topLabelTopPx,
            left: cardLeftPx - sideGapPx - labelWidthPx,
            width: labelWidthPx,
            titleKey: 'anatomy.prestige.title',
            termId: 'prestigePoints',
            titleClassName: isDark ? 'text-amber-400' : 'text-amber-600',
            descKeys: ['anatomy.prestige.desc1', 'anatomy.prestige.desc2'],
        },
        {
            key: 'ability',
            align: 'right',
            anchor: 'left-ability-medallion',
            top: abilityLabelTopPx,
            left: cardLeftPx - sideGapPx - labelWidthPx,
            width: labelWidthPx,
            titleKey: 'anatomy.ability.title',
            titleClassName: isDark ? 'text-purple-300' : 'text-purple-600',
            descKeys: ['anatomy.ability.desc'],
        },
        {
            key: 'bonus',
            align: 'left',
            anchor: 'top-right-wild-bonus',
            top: bonusLabelTopPx,
            left: cardLeftPx + cardWidthPx + sideGapPx,
            width: labelWidthPx,
            titleKey: 'anatomy.bonus.title',
            termId: 'bonus',
            titleClassName: isDark ? 'text-blue-400' : 'text-blue-600',
            descKeys: ['anatomy.bonus.desc', 'anatomy.bonus.desc2'],
        },
        {
            key: 'cost',
            align: 'right',
            anchor: 'lower-left-gem-cost',
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
            anchor: 'top-center-crowns',
            top: topLabelTopPx,
            left: cardLeftPx + cardWidthPx + sideGapPx,
            width: labelWidthPx,
            titleKey: 'anatomy.crowns.title',
            termId: 'crowns',
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
                className={`mb-4 text-[34px] font-black uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-stone-700'}`}
            >
                {translate(lang, 'anatomy.heading')}
            </h4>
            <div
                ref={containerRef}
                className="relative flex h-[680px] w-full select-none items-center justify-center lg:h-[760px]"
            >
                <div
                    data-card-anatomy-card-scale="preview"
                    className="z-10 origin-center rounded-lg shadow-2xl"
                    style={{ transform: `scale(${cardScale})` }}
                >
                    <CardComponent
                        card={ANATOMY_LAYOUT_CARD}
                        canBuy={false}
                        theme={theme}
                        size="featured"
                        className="pointer-events-none"
                    />
                </div>

                {labels.map((label) => (
                    <LabelBlock key={label.key} theme={theme} lang={lang} label={label} />
                ))}

                <svg
                    data-card-anatomy-connector-contrast="strong"
                    data-card-anatomy-connector-stroke-width="4"
                    data-card-anatomy-connector-halo-width="8"
                    className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
                >
                    <defs>
                        <marker id="dot" markerWidth="12" markerHeight="12" refX="6" refY="6">
                            <circle cx="6" cy="6" r="4" fill={anchorFill} />
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
                                        stroke={strokeHaloColor}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d={createConnectorPath(
                                            target.startX,
                                            target.startY,
                                            target.endX,
                                            target.endY
                                        )}
                                        fill="none"
                                        stroke={strokeColor}
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx={target.endX}
                                        cy={target.endY}
                                        r="7"
                                        fill={target.fill}
                                        stroke={strokeHaloColor}
                                        strokeWidth="3"
                                    />
                                </React.Fragment>
                            );
                        })}
                </svg>
            </div>
        </section>
    );
};
