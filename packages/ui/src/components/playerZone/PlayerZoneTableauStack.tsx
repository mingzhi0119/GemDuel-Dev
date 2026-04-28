import { motion } from 'framer-motion';
import { GEM_TYPES } from '@gemduel/shared/constants';
import { cn } from '@gemduel/shared/utils';
import { Card, STANDARD_CARD_SIZE } from '../Card';
import {
    PLAYER_ZONE_STACK_OFFSET_X,
    PLAYER_ZONE_STACK_OFFSET_Y,
    SUMMARY_TEXT_COLORS,
} from './constants';
import { ScaledCardFrame } from './ScaledCardFrame';
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
    onSelectStack: (stack: PlayerZoneStackState) => void;
    title?: string;
    purePointCount?: number;
    royalCount?: number;
}

export function PlayerZoneTableauStack({
    player,
    color,
    stats,
    theme,
    tableauSummaryScale,
    summaryBadgeFontPx,
    summaryBadgeSizePx,
    onSelectStack,
    title,
    purePointCount,
    royalCount,
}: PlayerZoneTableauStackProps) {
    const isSpecial = color === 'pure-royal';
    const type = isSpecial
        ? GEM_TYPES.NULL
        : (GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES] ?? GEM_TYPES.NULL);
    const summaryPointColor = isSpecial
        ? '#e5e7eb'
        : (SUMMARY_TEXT_COLORS[type.id] ?? SUMMARY_TEXT_COLORS.black);
    const stackBackClassName = isSpecial
        ? 'rounded border border-slate-300/70 bg-gradient-to-br from-slate-300 via-amber-200 to-slate-700 shadow-sm transition-all duration-200 opacity-40'
        : `rounded border ${type.border} bg-gradient-to-br ${type.color} shadow-sm transition-all duration-200 opacity-40`;
    const emptyBorderClassName = isSpecial
        ? theme === 'dark'
            ? 'border-slate-500/70 bg-slate-800/35'
            : 'border-stone-400/15 bg-white/[0.04]'
        : theme === 'dark'
          ? 'border-slate-600 bg-slate-800/35'
          : 'border-stone-400/10 bg-white/[0.04]';

    return (
        <div
            data-tableau-stack={`${player}-${color}`}
            data-tableau-special-stack={isSpecial ? `${player}-pure-royal` : undefined}
            data-tableau-stack-color={color}
            data-tableau-card-count={stats.cards.length}
            data-tableau-special-pure-count={isSpecial ? purePointCount : undefined}
            data-tableau-special-royal-count={isSpecial ? royalCount : undefined}
            className="flex shrink-0 flex-col items-center gap-1 min-w-[32px]"
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
                                }}
                            >
                                {idx === stats.cards.length - 1 ? (
                                    <Card
                                        card={card}
                                        canBuy={false}
                                        theme={theme}
                                        className="shadow-md"
                                    />
                                ) : (
                                    <div
                                        className={stackBackClassName}
                                        style={{
                                            width: `${STANDARD_CARD_SIZE.width}px`,
                                            height: `${STANDARD_CARD_SIZE.height}px`,
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
                                            className={cn(
                                                'px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-[2px] border shadow-xl transition-colors',
                                                stats.points >= 7
                                                    ? 'border-amber-400 shadow-amber-500/20'
                                                    : 'border-white/20'
                                            )}
                                        >
                                            <span
                                                data-tableau-point-summary={color}
                                                className={cn(
                                                    'text-sm font-black drop-shadow-md',
                                                    stats.points >= 7 &&
                                                        'drop-shadow-[0_0_8px_rgba(255,255,255,0.28)]'
                                                )}
                                                style={{
                                                    color: summaryPointColor,
                                                    textShadow:
                                                        type.id === 'white' || isSpecial
                                                            ? '0 1px 3px rgba(15,23,42,0.95)'
                                                            : '0 1px 3px rgba(15,23,42,0.75)',
                                                }}
                                            >
                                                {stats.points}
                                                {!isSpecial && (
                                                    <span className="text-[0.72em] font-black opacity-90">
                                                        /10
                                                    </span>
                                                )}
                                            </span>
                                        </motion.div>
                                    </div>
                                )}

                                {idx === stats.cards.length - 1 &&
                                    !isSpecial &&
                                    stats.bonusCount > 0 && (
                                        <div className="absolute -bottom-2 -right-2 z-40">
                                            <div
                                                className={`px-1.5 py-0.5 rounded-full border shadow-lg flex gap-0.5 items-center ${
                                                    theme === 'dark'
                                                        ? isSpecial
                                                            ? 'bg-slate-950 text-amber-100 border-amber-300/60'
                                                            : 'bg-slate-950 text-white border-slate-700'
                                                        : isSpecial
                                                          ? 'bg-white text-stone-800 border-amber-300'
                                                          : 'bg-white text-stone-800 border-stone-300'
                                                }`}
                                                style={{
                                                    minWidth: `${summaryBadgeSizePx}px`,
                                                    minHeight: `${summaryBadgeSizePx}px`,
                                                    lineHeight: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <span
                                                    className="font-black"
                                                    style={{
                                                        fontSize: `${summaryBadgeFontPx}px`,
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {stats.bonusCount}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))
                    ) : (
                        <div
                            className={`rounded border border-dashed flex items-center justify-center ${emptyBorderClassName}`}
                            style={{
                                width: `${STANDARD_CARD_SIZE.width}px`,
                                height: `${STANDARD_CARD_SIZE.height}px`,
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
        </div>
    );
}
