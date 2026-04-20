import React, { useState, useEffect, useRef } from 'react';
import { Shield, Scroll, Swords, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GEM_TYPES, BONUS_COLORS, BUFFS } from '../constants';
import { GemIcon } from './GemIcon';
import { Card, STANDARD_CARD_SIZE } from './Card';
import { GEM_BOARD_GEM_SIZE_PX } from './GameBoard';
import { FloatingText, FloatingGem } from './VisualFeedback';
import { BUFF_STYLES } from '../styles/buffs';
import { cn } from '../utils';
import {
    PlayerKey,
    GemInventory,
    Card as CardType,
    RoyalCard,
    Buff,
    GemColor,
    GemTypeObject,
} from '../types';

interface PlayerZoneProps {
    player: PlayerKey;
    inventory: GemInventory;
    cards: CardType[];
    reserved: CardType[];
    royals?: RoyalCard[];
    privileges: number;
    extraPrivileges?: number;
    isActive: boolean;
    lastFeedback: {
        uid: string;
        items: Array<{ player: PlayerKey; type: string; diff: number }>;
    } | null;
    onBuyReserved: (card: CardType, execute?: boolean) => boolean;
    onDiscardReserved: (cardId: string) => void;
    onUsePrivilege: () => void;
    isPrivilegeMode: boolean;
    onGemClick: (color: string) => void;
    isStealMode: boolean;
    isDiscardMode: boolean;
    buff: Buff;
    theme: 'light' | 'dark';
    score: number;
    crowns: number;
}

interface StackOverlayProps {
    isOpen: boolean;
    color: string;
    cards: CardType[];
    onClose: () => void;
    theme: 'light' | 'dark';
}

interface ScaledCardFrameProps {
    scale: number;
    children: React.ReactNode;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const TABLEAU_STACK_FALLBACK_SCALE = 0.72;
const TABLEAU_STACK_MIN_SCALE = 0.46;
const TABLEAU_STACK_GAP_PX = 6;
const RESERVED_CARD_FALLBACK_SCALE = 0.88;
const RESERVED_CARD_MIN_SCALE = 0.42;
const RESERVED_CARD_GAP_PX = 8;
const SUMMARY_TEXT_COLORS: Record<string, string> = {
    blue: '#60a5fa',
    white: '#f8fafc',
    green: '#34d399',
    black: '#94a3b8',
    red: '#f87171',
    pearl: '#f472b6',
    gold: '#fbbf24',
};

const ScaledCardFrame: React.FC<ScaledCardFrameProps> = ({ scale, children }) => {
    const safeScale = Number.isFinite(scale) ? scale : 1;
    const scaledWidth = STANDARD_CARD_SIZE.width * safeScale;
    const scaledHeight = STANDARD_CARD_SIZE.height * safeScale;

    return (
        <div
            className="relative shrink-0"
            style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
            }}
        >
            <div
                style={{
                    width: `${STANDARD_CARD_SIZE.width}px`,
                    height: `${STANDARD_CARD_SIZE.height}px`,
                    transform: `scale(${safeScale})`,
                    transformOrigin: 'top left',
                }}
            >
                {children}
            </div>
        </div>
    );
};

const StackOverlay: React.FC<StackOverlayProps> = ({ isOpen, color, cards, onClose, theme }) => {
    if (!isOpen) return null;
    const type = GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES] || GEM_TYPES.NULL;

    const colorMap: Record<string, string> = {
        blue: '#60a5fa', // blue-400
        white: '#f1f5f9', // slate-100
        green: '#34d399', // emerald-400
        black: '#94a3b8', // slate-400
        red: '#f87171', // red-400
        pearl: '#f472b6', // pink-400
        gold: '#fbbf24', // amber-400
    };

    const textColor = colorMap[type.id] || '#94a3b8';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-[600] rounded-2xl flex flex-col overflow-hidden shadow-inner ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'}`}
        >
            {/* Color Label */}
            <div className="absolute top-3 left-4 z-[610] flex items-center gap-2">
                <span
                    className="text-sm font-black uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm"
                    style={{ color: textColor }}
                >
                    Color: {type.label}
                </span>
            </div>

            <div className="absolute top-2 right-2 z-[610]">
                <button
                    onClick={onClose}
                    className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 ${theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                >
                    <Shield size={16} className="rotate-45" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-wrap items-center justify-center gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.id || i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                    >
                        <Card card={card} canBuy={false} theme={theme} size="default" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export const PlayerZone: React.FC<PlayerZoneProps> = ({
    player,
    inventory,
    cards,
    reserved,
    privileges,
    extraPrivileges = 0,
    isActive,
    lastFeedback,
    onBuyReserved,
    onDiscardReserved,
    onUsePrivilege,
    isPrivilegeMode,
    onGemClick,
    isStealMode,
    isDiscardMode,
    buff,
    theme,
}) => {
    const stackOffsetY = Math.round((STANDARD_CARD_SIZE.height / 96) * -2);
    const stackOffsetX = Math.round((STANDARD_CARD_SIZE.width / 72) * 1);
    const inventoryGemSizePx = GEM_BOARD_GEM_SIZE_PX;
    const inventoryGemBadgeSizePx = Math.round(inventoryGemSizePx * 0.42);
    const inventoryGemCountFontPx = Math.round(inventoryGemSizePx * 0.24);
    const safeCards = Array.isArray(cards) ? cards : [];
    const [selectedStack, setSelectedStack] = useState<{ color: string; cards: CardType[] } | null>(
        null
    );
    const tableauRowRef = useRef<HTMLDivElement | null>(null);
    const reservedRowRef = useRef<HTMLDivElement | null>(null);
    const [tableauRowWidth, setTableauRowWidth] = useState(0);
    const [reservedRowWidth, setReservedRowWidth] = useState(0);

    const hasPuppetMaster =
        buff?.effects?.active === 'discard_reserved' || buff?.id === 'puppet_master';

    // --- Visual Feedback Logic ---
    interface FeedbackItem {
        id: number;
        quantity: string;
        label: string;
        type: string;
    }
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [isExtortionEffect, setIsExtortionEffect] = useState(false);
    const lastSeenFeedbackUid = useRef<string | null>(null);

    // Only display stacks for valid gem colors.
    // Pure point cards (gray) are direct score contributions and not stacked visually.
    const displayColors = [...BONUS_COLORS];

    useEffect(() => {
        if (lastFeedback && lastFeedback.uid !== lastSeenFeedbackUid.current) {
            lastSeenFeedbackUid.current = lastFeedback.uid;
            const myItems = lastFeedback.items.filter(
                (item: { player: PlayerKey; type: string; diff: number }) => item.player === player
            );

            if (myItems.some((i: { type: string }) => i.type === 'extortion')) {
                setIsExtortionEffect(true);
                setTimeout(() => setIsExtortionEffect(false), 1000);
            }

            myItems.forEach((item: { type: string; diff: number }) => {
                const id = Date.now() + Math.random();
                const label = item.type.charAt(0).toUpperCase() + item.type.slice(1);
                const quantity = item.diff > 0 ? `+${item.diff}` : `${item.diff}`;
                setFeedbacks((prev) => [...prev, { id, quantity, label, type: item.type }]);
                setTimeout(() => setFeedbacks((prev) => prev.filter((f) => f.id !== id)), 1500);
            });
        }
    }, [lastFeedback, player]);

    useEffect(() => {
        const updateRowWidths = () => {
            const nextTableauWidth = tableauRowRef.current?.clientWidth ?? 0;
            const nextReservedWidth = reservedRowRef.current?.clientWidth ?? 0;

            setTableauRowWidth((current) =>
                current === nextTableauWidth ? current : nextTableauWidth
            );
            setReservedRowWidth((current) =>
                current === nextReservedWidth ? current : nextReservedWidth
            );
        };

        updateRowWidths();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', updateRowWidths);
            return () => window.removeEventListener('resize', updateRowWidths);
        }

        const observer = new ResizeObserver(updateRowWidths);
        if (tableauRowRef.current) observer.observe(tableauRowRef.current);
        if (reservedRowRef.current) observer.observe(reservedRowRef.current);
        window.addEventListener('resize', updateRowWidths);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateRowWidths);
        };
    }, []);

    const colorStats = displayColors.reduce(
        (acc: Record<string, { cards: CardType[]; bonusCount: number; points: number }>, color) => {
            const colorCards = safeCards.filter((c) => c.bonusColor === color);
            acc[color] = {
                cards: colorCards,
                bonusCount: colorCards.reduce((sum, c) => sum + (c.bonusCount ?? 1), 0),
                points: colorCards.reduce((sum, c) => sum + c.points, 0),
            };
            return acc;
        },
        {}
    );
    const tableauSummaryGapTotalPx = Math.max(displayColors.length - 1, 0) * TABLEAU_STACK_GAP_PX;
    const tableauSummaryScale =
        tableauRowWidth > 0
            ? Math.max(
                  TABLEAU_STACK_MIN_SCALE,
                  (tableauRowWidth - tableauSummaryGapTotalPx) /
                      (displayColors.length * STANDARD_CARD_SIZE.width)
              )
            : TABLEAU_STACK_FALLBACK_SCALE;
    const summaryDisplayScale = clamp(tableauSummaryScale, TABLEAU_STACK_MIN_SCALE, 1);
    const summaryBadgeFontPx = Math.round(inventoryGemCountFontPx / summaryDisplayScale);
    const summaryBadgeSizePx = Math.round(inventoryGemBadgeSizePx / summaryDisplayScale);
    const reservedGapTotalPx = Math.max(reserved.length - 1, 0) * RESERVED_CARD_GAP_PX;
    const reservedCardScale =
        reserved.length > 0 && reservedRowWidth > 0
            ? clamp(
                  (reservedRowWidth - reservedGapTotalPx) /
                      (reserved.length * STANDARD_CARD_SIZE.width),
                  RESERVED_CARD_MIN_SCALE,
                  1
              )
            : RESERVED_CARD_FALLBACK_SCALE;

    return (
        <div
            className={`flex w-full h-full flex-row items-stretch p-4 transition-all duration-500 gap-4
        ${
            isActive
                ? theme === 'dark'
                    ? 'bg-slate-900/80'
                    : 'bg-white/80'
                : theme === 'dark'
                  ? 'bg-slate-950/40 opacity-90'
                  : 'bg-slate-100/40 opacity-90'
        }
        ${isStealMode ? 'ring-2 ring-rose-500 animate-pulse' : ''}
        ${isDiscardMode && isActive ? 'ring-2 ring-red-500 animate-pulse' : ''}
        ${isExtortionEffect ? 'ring-4 ring-purple-500 bg-purple-500/10 animate-pulse' : ''}
    `}
        >
            <AnimatePresence>
                {selectedStack && (
                    <StackOverlay
                        isOpen={true}
                        color={selectedStack.color}
                        cards={selectedStack.cards}
                        onClose={() => setSelectedStack(null)}
                        theme={theme}
                    />
                )}
            </AnimatePresence>

            {/* Module 1: Identity & Privileges */}
            <div
                className={`self-stretch flex flex-col gap-5 min-w-[128px] shrink-0 items-center justify-center border-r pr-3 transition-colors duration-500
          ${theme === 'dark' ? 'border-slate-700' : 'border-stone-300'}
      `}
            >
                <div className="flex flex-col items-center gap-2">
                    <div
                        className={`p-3 rounded-full ${isActive ? (player === 'p1' ? 'bg-emerald-600' : 'bg-blue-600') : theme === 'dark' ? 'bg-slate-700' : 'bg-stone-300'}`}
                    >
                        {player === 'p1' ? (
                            <Shield
                                size={30}
                                className={
                                    theme === 'dark' || isActive ? 'text-white' : 'text-stone-600'
                                }
                            />
                        ) : (
                            <Swords
                                size={30}
                                className={
                                    theme === 'dark' || isActive ? 'text-white' : 'text-stone-600'
                                }
                            />
                        )}
                    </div>
                    <h3
                        className={`font-black text-[15px] whitespace-nowrap uppercase tracking-[0.14em] ${
                            isActive
                                ? player === 'p1'
                                    ? 'text-emerald-500'
                                    : 'text-blue-500'
                                : theme === 'dark'
                                  ? 'text-slate-300'
                                  : 'text-stone-600'
                        }`}
                    >
                        {player === 'p1' ? 'Player 1' : 'Player 2'}
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 justify-items-start h-[72px] items-start">
                    {(() => {
                        const total = privileges + extraPrivileges;
                        const items = [];
                        let currentIndex = 0;

                        // Collect standard scrolls
                        for (let i = 0; i < Math.max(0, privileges); i++) {
                            const idx = currentIndex++;
                            items.push(
                                <button
                                    key={`std-${i}`}
                                    disabled={!isActive || isPrivilegeMode}
                                    onClick={onUsePrivilege}
                                    className={cn(
                                        'transition-all',
                                        isActive && !isPrivilegeMode
                                            ? 'hover:scale-110 hover:text-amber-100 cursor-pointer animate-pulse'
                                            : 'opacity-80 cursor-default',
                                        (total === 1 || (total === 3 && idx === 2)) &&
                                            'col-span-2 justify-self-center'
                                    )}
                                >
                                    <Scroll
                                        size={30}
                                        fill="#fcd34d"
                                        className={
                                            theme === 'dark' ? 'text-amber-200' : 'text-amber-500'
                                        }
                                    />
                                </button>
                            );
                        }

                        // Collect extra scrolls
                        for (let i = 0; i < Math.max(0, extraPrivileges); i++) {
                            const idx = currentIndex++;
                            items.push(
                                <button
                                    key={`extra-${i}`}
                                    disabled={!isActive || isPrivilegeMode}
                                    onClick={onUsePrivilege}
                                    className={cn(
                                        'transition-all',
                                        isActive && !isPrivilegeMode
                                            ? 'hover:scale-110 hover:text-yellow-200 cursor-pointer animate-pulse'
                                            : 'opacity-80 cursor-default',
                                        (total === 1 || (total === 3 && idx === 2)) &&
                                            'col-span-2 justify-self-center'
                                    )}
                                    title="Special Privilege (Protected)"
                                >
                                    <Scroll size={30} fill="#fbbf24" className="text-yellow-500" />
                                </button>
                            );
                        }

                        if (items.length === 0) {
                            return (
                                <div className="col-span-2 justify-self-center">
                                    <Scroll
                                        size={30}
                                        className={
                                            theme === 'dark' ? 'text-slate-500' : 'text-stone-400'
                                        }
                                    />
                                </div>
                            );
                        }

                        return items;
                    })()}
                </div>
            </div>

            {/* Module 2: Resources (Inventory & Stacks) */}
            <div
                className="self-stretch flex flex-col gap-3 shrink-0 justify-center"
                style={{ flex: 65 }}
            >
                {/* Gems Row */}
                <div className="flex gap-3 justify-center items-center">
                    {(Object.values(GEM_TYPES) as GemTypeObject[])
                        .filter((g) => g.id !== 'empty') // Neutral is for card bg only
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
                                                // If the label is a Gem Color (e.g. 'Blue'), show FloatingGem
                                                // Otherwise show FloatingText (e.g. for text-based feedback if any, though mostly colors now)
                                                // Actually, let's prefer FloatingGem for valid gem types
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

                {/* Card Stacks & Bonuses */}
                <div
                    ref={tableauRowRef}
                    className="flex w-full items-start justify-start mt-1 overflow-hidden py-2 max-w-full min-w-0"
                    style={{ gap: `${TABLEAU_STACK_GAP_PX}px` }}
                >
                    {displayColors.map((color) => {
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
                                    setSelectedStack({ color, cards: stats.cards })
                                }
                            >
                                <ScaledCardFrame scale={tableauSummaryScale}>
                                    <motion.div
                                        animate={
                                            stats.cards.length > 0 ? { scale: [1, 1.1, 1] } : {}
                                        }
                                        key={stats.cards.length}
                                        transition={{ duration: 0.4, ease: 'easeOut' }}
                                        className="relative group/stack cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                        style={{
                                            width: `${STANDARD_CARD_SIZE.width}px`,
                                            height: `${STANDARD_CARD_SIZE.height}px`,
                                        }}
                                    >
                                        {stats.cards.length > 0 ? (
                                            stats.cards.map((card: CardType, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="absolute inset-0 z-10"
                                                    style={{
                                                        top: `${idx * stackOffsetY}px`,
                                                        left: `${idx * stackOffsetX}px`,
                                                    }}
                                                >
                                                    {/* Only the top card is fully rendered, but we keep the structure for stacking */}
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

                                                    {/* Global Score Indicator (Center of the top card) */}
                                                    {idx === stats.cards.length - 1 &&
                                                        stats.points > 0 && (
                                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                                                <motion.div
                                                                    animate={
                                                                        stats.points >= 7
                                                                            ? {
                                                                                  scale: [
                                                                                      1, 1.1, 1,
                                                                                  ],
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

                                                    {/* Global Bonus Indicator (Bottom Right of the top card) */}
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

            {/* Module 3: Hand / Reserved Cards */}
            <div
                className={`self-stretch flex items-center border-l pl-4 min-w-0 transition-colors duration-500
          ${theme === 'dark' ? 'border-slate-700' : 'border-stone-300'}
      `}
                style={{ flex: 35 }}
            >
                <div
                    ref={reservedRowRef}
                    className="w-full flex items-center justify-center overflow-hidden py-2 min-w-0"
                >
                    {reserved.length === 0 && (
                        <span
                            className={`text-[10px] italic w-full text-center ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}
                        >
                            No Reserved Cards
                        </span>
                    )}
                    {reserved.length > 0 && (
                        <div
                            className="flex items-center justify-center min-w-0 max-w-full"
                            style={{ gap: `${RESERVED_CARD_GAP_PX}px` }}
                        >
                            {reserved.map((card, i) => (
                                <ScaledCardFrame key={card.id || i} scale={reservedCardScale}>
                                    <div className="relative group/card">
                                        <Card
                                            card={card}
                                            canBuy={isActive && onBuyReserved(card)}
                                            onClick={() =>
                                                isActive &&
                                                onBuyReserved(card) &&
                                                onBuyReserved(card, true)
                                            }
                                            isReservedView={true}
                                            theme={theme}
                                            className="transition-transform duration-200 ease-in-out"
                                        />
                                        {hasPuppetMaster && isActive && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDiscardReserved(card.id);
                                                }}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg border border-white/20 opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-rose-500 z-50"
                                                title="Discard Card (Puppet Master)"
                                            >
                                                <span className="text-[10px] font-black">X</span>
                                            </button>
                                        )}
                                    </div>
                                </ScaledCardFrame>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
