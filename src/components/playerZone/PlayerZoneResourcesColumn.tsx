import { AnimatePresence, motion } from 'framer-motion';
import { GEM_TYPES } from '../../constants';
import { Card, STANDARD_CARD_SIZE } from '../Card';
import { GemIcon } from '../GemIcon';
import { FloatingGem, FloatingText } from '../VisualFeedback';
import { cn } from '../../utils';
import type { RefObject } from 'react';
import type { GemColor, GemInventory, GemTypeObject } from '../../types';
import type { PlayerZoneColorStats, PlayerZoneFeedbackItem, PlayerZoneStackState } from './types';
import {
    PLAYER_ZONE_DISPLAY_COLORS,
    PLAYER_ZONE_STACK_OFFSET_X,
    PLAYER_ZONE_STACK_OFFSET_Y,
    SUMMARY_TEXT_COLORS,
    TABLEAU_STACK_GAP_PX,
} from './constants';
import { ScaledCardFrame } from './ScaledCardFrame';

interface PlayerZoneResourcesColumnProps {
    inventory: GemInventory;
    feedbacks: PlayerZoneFeedbackItem[];
    isStealMode: boolean;
    isDiscardMode: boolean;
    theme: 'light' | 'dark';
    colorStats: Record<string, PlayerZoneColorStats>;
    tableauRowRef: RefObject<HTMLDivElement | null>;
    tableauSummaryScale: number;
    inventoryGemSizePx: number;
    inventoryGemBadgeSizePx: number;
    inventoryGemCountFontPx: number;
    summaryBadgeFontPx: number;
    summaryBadgeSizePx: number;
    onGemClick: (color: string) => void;
    onSelectStack: (stack: PlayerZoneStackState) => void;
}

export function PlayerZoneResourcesColumn({
    inventory,
    feedbacks,
    isStealMode,
    isDiscardMode,
    theme,
    colorStats,
    tableauRowRef,
    tableauSummaryScale,
    inventoryGemSizePx,
    inventoryGemBadgeSizePx,
    inventoryGemCountFontPx,
    summaryBadgeFontPx,
    summaryBadgeSizePx,
    onGemClick,
    onSelectStack,
}: PlayerZoneResourcesColumnProps) {
    return (
        <div
            className="self-stretch flex flex-col gap-3 shrink-0 justify-center"
            style={{ flex: 65 }}
        >
            <div className="flex gap-3 justify-center items-center">
                {(Object.values(GEM_TYPES) as GemTypeObject[])
                    .filter((g) => g.id !== 'empty')
                    .map((gem) => {
                        const count = inventory[gem.id as GemColor] || 0;
                        const isClickable =
                            (isStealMode && count > 0 && gem.id !== 'gold') ||
                            (isDiscardMode && count > 0);

                        return (
                            <div
                                key={gem.id}
                                onClick={() => isClickable && onGemClick && onGemClick(gem.id)}
                                className={`relative transition-all group ${isClickable ? 'cursor-pointer hover:scale-110 active:scale-95 ring-2 ring-rose-500 rounded-full' : ''}`}
                            >
                                <AnimatePresence>
                                    {feedbacks
                                        .filter((f) => f.type === gem.id)
                                        .map((f) =>
                                            Object.keys(GEM_TYPES)
                                                .map((k) => k.toLowerCase())
                                                .includes(f.type) ? (
                                                <FloatingGem
                                                    key={f.id}
                                                    type={f.type}
                                                    count={parseInt(f.quantity)}
                                                    theme={theme}
                                                />
                                            ) : (
                                                <FloatingText
                                                    key={f.id}
                                                    quantity={f.quantity}
                                                    label={f.label}
                                                />
                                            )
                                        )}
                                </AnimatePresence>
                                <div
                                    style={{
                                        width: `${inventoryGemSizePx}px`,
                                        height: `${inventoryGemSizePx}px`,
                                    }}
                                >
                                    <GemIcon
                                        type={gem}
                                        size="w-full h-full"
                                        count={count}
                                        theme={theme}
                                        countClassName="-bottom-2 -right-2 px-2 py-0.5"
                                        countStyle={{
                                            minWidth: `${inventoryGemBadgeSizePx}px`,
                                            minHeight: `${inventoryGemBadgeSizePx}px`,
                                            fontSize: `${inventoryGemCountFontPx}px`,
                                            lineHeight: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        className={
                                            count === 0 ? 'grayscale opacity-50' : 'shadow-lg'
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>

            <div
                ref={tableauRowRef}
                className="flex w-full items-start justify-start mt-1 overflow-hidden py-2 max-w-full min-w-0"
                style={{ gap: `${TABLEAU_STACK_GAP_PX}px` }}
            >
                {PLAYER_ZONE_DISPLAY_COLORS.map((color) => {
                    const stats = colorStats[color];
                    const type = GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES];
                    const summaryPointColor =
                        SUMMARY_TEXT_COLORS[type.id] ?? SUMMARY_TEXT_COLORS.black;

                    return (
                        <div
                            key={color}
                            className="flex shrink-0 flex-col items-center gap-1 min-w-[32px]"
                            onClick={() =>
                                stats.cards.length > 0 &&
                                onSelectStack({ color, cards: stats.cards })
                            }
                        >
                            <ScaledCardFrame scale={tableauSummaryScale}>
                                <motion.div
                                    animate={stats.cards.length > 0 ? { scale: [1, 1.1, 1] } : {}}
                                    key={stats.cards.length}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    className="relative group/stack cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                    style={{
                                        width: `${STANDARD_CARD_SIZE.width}px`,
                                        height: `${STANDARD_CARD_SIZE.height}px`,
                                    }}
                                >
                                    {stats.cards.length > 0 ? (
                                        stats.cards.map((card, idx) => (
                                            <div
                                                key={idx}
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
                                                        className={`rounded border ${type.border} bg-gradient-to-br ${type.color} shadow-sm transition-all duration-200 opacity-40`}
                                                        style={{
                                                            width: `${STANDARD_CARD_SIZE.width}px`,
                                                            height: `${STANDARD_CARD_SIZE.height}px`,
                                                        }}
                                                    />
                                                )}

                                                {idx === stats.cards.length - 1 &&
                                                    stats.points > 0 && (
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
                                                                    className={cn(
                                                                        'text-sm font-black drop-shadow-md',
                                                                        stats.points >= 7 &&
                                                                            'drop-shadow-[0_0_8px_rgba(255,255,255,0.28)]'
                                                                    )}
                                                                    style={{
                                                                        color: summaryPointColor,
                                                                        textShadow:
                                                                            type.id === 'white'
                                                                                ? '0 1px 3px rgba(15,23,42,0.95)'
                                                                                : '0 1px 3px rgba(15,23,42,0.75)',
                                                                    }}
                                                                >
                                                                    {stats.points}
                                                                </span>
                                                            </motion.div>
                                                        </div>
                                                    )}

                                                {idx === stats.cards.length - 1 &&
                                                    stats.bonusCount > 0 && (
                                                        <div className="absolute -bottom-2 -right-2 z-40">
                                                            <div
                                                                className={`px-1.5 py-0.5 rounded-full border shadow-lg flex gap-0.5 items-center ${theme === 'dark' ? 'bg-slate-950 text-white border-slate-700' : 'bg-white text-stone-800 border-stone-300'}`}
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
                                            className={`rounded border border-dashed flex items-center justify-center ${
                                                theme === 'dark'
                                                    ? 'border-slate-600 bg-slate-800/35'
                                                    : 'border-stone-300 bg-stone-100/70'
                                            }`}
                                            style={{
                                                width: `${STANDARD_CARD_SIZE.width}px`,
                                                height: `${STANDARD_CARD_SIZE.height}px`,
                                            }}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-full bg-gradient-to-br ${type.color} opacity-20`}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </ScaledCardFrame>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
