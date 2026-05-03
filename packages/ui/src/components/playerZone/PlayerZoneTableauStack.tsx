import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { GEM_TYPES } from '@gemduel/shared/constants';
import { cn } from '../../utils';
import { Card, STANDARD_CARD_SIZE } from '../Card';
import { PLAYER_ZONE_STACK_OFFSET_X, PLAYER_ZONE_STACK_OFFSET_Y } from './constants';
import { ScaledCardFrame } from './ScaledCardFrame';
import { CardNumberValue, getBonusBadgeBackPath, getPointRibbonPath } from './tableauStackArtwork';
import type { PlayerKey } from '@gemduel/shared/types';
import type { PlayerZoneColorStats, PlayerZoneStackState } from './types';

interface PlayerZoneTableauStackProps {
    player: PlayerKey;
    color: string;
    stats: PlayerZoneColorStats;
    theme: 'light' | 'dark';
    tableauSummaryScale: number;
    summaryBadgeFontPx: number;
    summaryBadgeSizePx: number;
    surfaceVariant?: string;
    onSelectStack: (stack: PlayerZoneStackState) => void;
    title?: string;
    purePointCount?: number;
    royalCount?: number;
}

type PlayerZoneStackSurfaceVisualId =
    | 'crystal-anime'
    | 'royal-luxury'
    | 'dark-arcane'
    | 'clean-boardgame'
    | 'pearl-opaline'
    | 'lotus-porcelain';

interface PlayerZoneStackSurfaceVisual {
    id: PlayerZoneStackSurfaceVisualId;
    emptyClassName: string;
    emptyStyle: CSSProperties;
    backClassName: string;
    backStyle: CSSProperties;
    topCardClassName: string;
    topCardLayerStyle: CSSProperties;
}

const STACK_SURFACE_VISUALS: Record<PlayerZoneStackSurfaceVisualId, PlayerZoneStackSurfaceVisual> =
    {
        'crystal-anime': {
            id: 'crystal-anime',
            emptyClassName: 'border-violet-200/28 bg-violet-950/18',
            emptyStyle: {
                borderColor: 'rgba(196,181,253,0.34)',
                backgroundColor: 'rgba(76,29,149,0.16)',
                boxShadow: 'inset 0 0 22px rgba(167,139,250,0.11), 0 12px 28px rgba(24,16,55,0.18)',
            },
            backClassName: 'shadow-none',
            backStyle: {
                boxShadow: '0 12px 24px rgba(48,22,95,0.22), inset 0 0 14px rgba(125,211,252,0.10)',
            },
            topCardClassName: 'shadow-none',
            topCardLayerStyle: {
                filter: 'drop-shadow(0 14px 24px rgba(48,22,95,0.24)) drop-shadow(0 0 12px rgba(125,211,252,0.12))',
            },
        },
        'royal-luxury': {
            id: 'royal-luxury',
            emptyClassName: 'border-amber-200/24 bg-stone-950/20',
            emptyStyle: {
                borderColor: 'rgba(253,230,138,0.30)',
                backgroundColor: 'rgba(41,37,36,0.18)',
                boxShadow: 'inset 0 0 18px rgba(245,158,11,0.08), 0 13px 28px rgba(28,25,23,0.20)',
            },
            backClassName: 'shadow-none',
            backStyle: {
                boxShadow: '0 12px 24px rgba(28,25,23,0.24), inset 0 0 12px rgba(245,158,11,0.11)',
            },
            topCardClassName: 'shadow-none',
            topCardLayerStyle: {
                filter: 'drop-shadow(0 14px 26px rgba(28,25,23,0.26)) drop-shadow(0 0 10px rgba(245,158,11,0.12))',
            },
        },
        'dark-arcane': {
            id: 'dark-arcane',
            emptyClassName: 'border-orange-300/20 bg-zinc-950/26',
            emptyStyle: {
                borderColor: 'rgba(251,146,60,0.24)',
                backgroundColor: 'rgba(24,24,27,0.24)',
                boxShadow: 'inset 0 0 20px rgba(124,45,18,0.18), 0 14px 30px rgba(9,9,11,0.28)',
            },
            backClassName: 'shadow-none',
            backStyle: {
                boxShadow: '0 14px 28px rgba(9,9,11,0.30), inset 0 0 14px rgba(194,65,12,0.12)',
            },
            topCardClassName: 'shadow-none',
            topCardLayerStyle: {
                filter: 'drop-shadow(0 15px 28px rgba(9,9,11,0.34)) drop-shadow(0 0 10px rgba(194,65,12,0.14))',
            },
        },
        'clean-boardgame': {
            id: 'clean-boardgame',
            emptyClassName: 'border-slate-400/22 bg-slate-500/12',
            emptyStyle: {
                borderColor: 'rgba(148,163,184,0.28)',
                backgroundColor: 'rgba(100,116,139,0.12)',
                boxShadow: 'inset 0 0 14px rgba(226,232,240,0.05), 0 10px 22px rgba(15,23,42,0.16)',
            },
            backClassName: 'shadow-none',
            backStyle: {
                boxShadow: '0 10px 22px rgba(15,23,42,0.18), inset 0 0 10px rgba(226,232,240,0.07)',
            },
            topCardClassName: 'shadow-none',
            topCardLayerStyle: {
                filter: 'drop-shadow(0 12px 22px rgba(15,23,42,0.20))',
            },
        },
        'pearl-opaline': {
            id: 'pearl-opaline',
            emptyClassName: 'border-rose-100/55 bg-white/28',
            emptyStyle: {
                borderColor: 'rgba(253,226,226,0.60)',
                backgroundColor: 'rgba(255,251,247,0.34)',
                boxShadow:
                    'inset 0 0 18px rgba(125,211,252,0.10), 0 10px 24px rgba(190,137,126,0.13)',
            },
            backClassName: 'shadow-none',
            backStyle: {
                boxShadow:
                    '0 10px 22px rgba(190,137,126,0.16), inset 0 0 14px rgba(255,255,255,0.18), inset 0 0 18px rgba(125,211,252,0.10)',
            },
            topCardClassName: 'shadow-none',
            topCardLayerStyle: {
                filter: 'drop-shadow(0 12px 22px rgba(190,137,126,0.18)) drop-shadow(0 0 12px rgba(125,211,252,0.10))',
            },
        },
        'lotus-porcelain': {
            id: 'lotus-porcelain',
            emptyClassName: 'border-teal-100/48 bg-cyan-50/18',
            emptyStyle: {
                borderColor: 'rgba(153,246,228,0.46)',
                backgroundColor: 'rgba(236,254,255,0.18)',
                boxShadow:
                    'inset 0 0 18px rgba(20,184,166,0.10), 0 10px 24px rgba(15,118,110,0.14)',
            },
            backClassName: 'shadow-none',
            backStyle: {
                boxShadow:
                    '0 11px 23px rgba(15,118,110,0.17), inset 0 0 13px rgba(244,114,182,0.08), inset 0 0 16px rgba(251,191,36,0.09)',
            },
            topCardClassName: 'shadow-none',
            topCardLayerStyle: {
                filter: 'drop-shadow(0 12px 22px rgba(15,118,110,0.18)) drop-shadow(0 0 10px rgba(244,114,182,0.10))',
            },
        },
    };

const getPlayerZoneStackSurfaceVisual = (
    surfaceVariant: string | undefined
): PlayerZoneStackSurfaceVisual =>
    surfaceVariant && surfaceVariant in STACK_SURFACE_VISUALS
        ? STACK_SURFACE_VISUALS[surfaceVariant as PlayerZoneStackSurfaceVisualId]
        : STACK_SURFACE_VISUALS['clean-boardgame'];

export function PlayerZoneTableauStack({
    player,
    color,
    stats,
    theme,
    tableauSummaryScale,
    summaryBadgeFontPx,
    summaryBadgeSizePx,
    surfaceVariant,
    onSelectStack,
    title,
    purePointCount,
    royalCount,
}: PlayerZoneTableauStackProps) {
    const isSpecial = color === 'pure-royal';
    const type = isSpecial
        ? GEM_TYPES.NULL
        : (GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES] ?? GEM_TYPES.NULL);
    const pointRibbonPath = getPointRibbonPath(color, isSpecial);
    const bonusBadgeBackPath = getBonusBadgeBackPath(color);
    const pointRibbonWidthPx = Math.round(summaryBadgeSizePx * 1.35);
    const pointRibbonHeightPx = Math.round(pointRibbonWidthPx * 1.23);
    const bonusBadgeSizePx = Math.round(summaryBadgeSizePx * 1.28);
    const pointDigitHeightPx = Math.round(summaryBadgeFontPx * 1.6);
    const bonusDigitHeightPx = Math.round(summaryBadgeFontPx * 1.28);
    const surfaceVisual = getPlayerZoneStackSurfaceVisual(surfaceVariant);
    const stackBackClassName = isSpecial
        ? `rounded border border-slate-300/70 bg-gradient-to-br from-slate-300 via-amber-200 to-slate-700 transition-all duration-200 opacity-40 ${surfaceVisual.backClassName}`
        : `rounded border ${type.border} bg-gradient-to-br ${type.color} transition-all duration-200 opacity-40 ${surfaceVisual.backClassName}`;
    const emptyBorderClassName = surfaceVisual.emptyClassName;

    return (
        <button
            type="button"
            data-tableau-stack={`${player}-${color}`}
            data-tableau-special-stack={isSpecial ? `${player}-pure-royal` : undefined}
            data-tableau-stack-color={color}
            data-tableau-card-count={stats.cards.length}
            data-tableau-special-pure-count={isSpecial ? purePointCount : undefined}
            data-tableau-special-royal-count={isSpecial ? royalCount : undefined}
            data-tableau-stack-surface={surfaceVisual.id}
            disabled={stats.cards.length === 0}
            aria-label={`View ${title ?? color} tableau stack`}
            className="flex shrink-0 flex-col items-center gap-1 min-w-[32px] appearance-none border-0 bg-transparent p-0 text-inherit disabled:cursor-default"
            onClick={() =>
                stats.cards.length > 0 &&
                onSelectStack(
                    title
                        ? {
                              color,
                              cards: stats.cards,
                              title,
                          }
                        : {
                              color,
                              cards: stats.cards,
                          }
                )
            }
        >
            <ScaledCardFrame scale={tableauSummaryScale}>
                <motion.div
                    animate={stats.cards.length > 0 ? { scale: [1, 1.1, 1] } : {}}
                    key={
                        isSpecial ? `${purePointCount ?? 0}-${royalCount ?? 0}` : stats.cards.length
                    }
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className={`relative group/stack transition-transform hover:scale-105 active:scale-95 ${
                        stats.cards.length > 0 ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    style={{
                        width: `${STANDARD_CARD_SIZE.width}px`,
                        height: `${STANDARD_CARD_SIZE.height}px`,
                    }}
                >
                    {stats.cards.length > 0 ? (
                        stats.cards.map((card, idx: number) => (
                            <div
                                key={card.id || idx}
                                className="absolute inset-0 z-10"
                                style={{
                                    top: `${idx * PLAYER_ZONE_STACK_OFFSET_Y}px`,
                                    left: `${idx * PLAYER_ZONE_STACK_OFFSET_X}px`,
                                    ...(idx === stats.cards.length - 1
                                        ? surfaceVisual.topCardLayerStyle
                                        : {}),
                                }}
                                data-tableau-top-card-surface={
                                    idx === stats.cards.length - 1 ? surfaceVisual.id : undefined
                                }
                            >
                                {idx === stats.cards.length - 1 ? (
                                    <Card
                                        card={card}
                                        canBuy={false}
                                        theme={theme}
                                        className={surfaceVisual.topCardClassName}
                                    />
                                ) : (
                                    <div
                                        data-tableau-stack-back-surface={surfaceVisual.id}
                                        className={stackBackClassName}
                                        style={{
                                            width: `${STANDARD_CARD_SIZE.width}px`,
                                            height: `${STANDARD_CARD_SIZE.height}px`,
                                            ...surfaceVisual.backStyle,
                                        }}
                                    />
                                )}

                                {idx === stats.cards.length - 1 && stats.points > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                        <motion.div
                                            animate={
                                                stats.points >= 7
                                                    ? {
                                                          scale: [1, 1.1, 1],
                                                          filter: [
                                                              'drop-shadow(0 0 2px #fbbf24)',
                                                              'drop-shadow(0 0 8px #f59e0b)',
                                                              'drop-shadow(0 0 2px #fbbf24)',
                                                          ],
                                                      }
                                                    : {}
                                            }
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                            data-tableau-point-ribbon={color}
                                            className="relative flex items-center justify-center drop-shadow-[0_10px_16px_rgba(0,0,0,0.42)]"
                                            style={{
                                                width: `${pointRibbonWidthPx}px`,
                                                height: `${pointRibbonHeightPx}px`,
                                            }}
                                        >
                                            <img
                                                src={pointRibbonPath}
                                                alt=""
                                                aria-hidden="true"
                                                draggable={false}
                                                data-tableau-point-ribbon-artwork={color}
                                                className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                                            />
                                            <CardNumberValue
                                                type="point"
                                                color={color}
                                                value={stats.points}
                                                heightPx={pointDigitHeightPx}
                                                className={cn(
                                                    'drop-shadow-md',
                                                    stats.points >= 7 &&
                                                        'drop-shadow-[0_0_8px_rgba(255,255,255,0.28)]'
                                                )}
                                            />
                                        </motion.div>
                                    </div>
                                )}

                                {idx === stats.cards.length - 1 &&
                                    !isSpecial &&
                                    stats.bonusCount > 0 && (
                                        <div className="absolute -bottom-2 -right-2 z-40">
                                            <div
                                                data-tableau-bonus-summary={color}
                                                className="relative flex items-center justify-center drop-shadow-[0_8px_14px_rgba(0,0,0,0.42)]"
                                                style={{
                                                    width: `${bonusBadgeSizePx}px`,
                                                    height: `${bonusBadgeSizePx}px`,
                                                    lineHeight: 1,
                                                }}
                                            >
                                                <img
                                                    src={bonusBadgeBackPath}
                                                    alt=""
                                                    aria-hidden="true"
                                                    draggable={false}
                                                    data-tableau-bonus-badge-back={color}
                                                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                                                />
                                                <CardNumberValue
                                                    type="bonus"
                                                    color={color}
                                                    value={stats.bonusCount}
                                                    heightPx={bonusDigitHeightPx}
                                                    className="drop-shadow-[0_1px_3px_rgba(15,23,42,0.85)]"
                                                />
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))
                    ) : (
                        <div
                            data-tableau-empty-stack-surface={surfaceVisual.id}
                            className={`rounded border border-dashed flex items-center justify-center ${emptyBorderClassName}`}
                            style={{
                                width: `${STANDARD_CARD_SIZE.width}px`,
                                height: `${STANDARD_CARD_SIZE.height}px`,
                                ...surfaceVisual.emptyStyle,
                            }}
                        >
                            {!isSpecial && (
                                <div
                                    data-tableau-empty-color-orb={color}
                                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${type.color} ${
                                        theme === 'dark' ? 'opacity-20' : 'opacity-[0.07]'
                                    }`}
                                />
                            )}
                        </div>
                    )}
                </motion.div>
            </ScaledCardFrame>
        </button>
    );
}
