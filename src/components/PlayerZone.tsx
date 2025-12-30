import React, { useState, useEffect, useRef } from 'react';
import { Shield, Scroll, Swords, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GEM_TYPES, BONUS_COLORS, BUFFS } from '../constants';
import { GemIcon } from './GemIcon';
import { Card } from './Card';
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
    BuffEffects,
    GemTypeObject,
} from '../types';

interface BuffDisplayProps {
    buff?: Buff;
    theme: 'light' | 'dark';
    playerKey: PlayerKey;
}

const BuffDisplay: React.FC<BuffDisplayProps> = ({ buff: rawBuff, theme }) => {
    if (!rawBuff || rawBuff.id === 'none') return null;

    // RECONSTRUCTION: Get full static data (icons, desc) from local constants using ID
    const buff = (Object.values(BUFFS).find((b) => b.id === rawBuff.id) as Buff) || rawBuff;
    const levelStyle = BUFF_STYLES[buff.level] || 'border-slate-500 bg-slate-500/20 text-slate-300';

    // Use the state from the serialized buff (where dynamic info like discountColor is stored)
    const buffState = rawBuff.state || {};
    const discountColor = buffState.discountColor as string | undefined;

    let description = discountColor
        ? buff.desc.replace('Random color', `Random color (${discountColor})`)
        : buff.desc;

    // Fixed alignment to avoid overlapping with adjacent zones (especially P1 overlay close button)
    const alignClasses = 'left-0';

    const winCondition = (buff.effects as BuffEffects).winCondition;

    // Remove redundant Win Condition info from description if Victory Goals section exists
    if (winCondition) {
        description = description
            .replace(/Win Condition:.*?\./gi, '')
            .replace(/Win Condition:.*?$/gi, '')
            .replace(/\(No Single Color Win\)/gi, '')
            .replace(/No Single Color Win\.?/gi, '')
            .trim();
    }

    return (
        <div className="relative group/buff mt-2 w-fit">
            <div
                className={`
                flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider cursor-help transition-all hover:scale-105
                ${levelStyle}
            `}
            >
                <Sparkles size={10} />
                <span className="truncate max-w-[60px]">{buff.label}</span>
            </div>

            {/* Tooltip */}
            <div
                className={`
                absolute bottom-full ${alignClasses} mb-2 w-48 p-3 rounded-lg border shadow-xl backdrop-blur-md z-[500] opacity-0 group-hover/buff:opacity-100 transition-opacity duration-200
                ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'}
            `}
            >
                <div className="flex items-center justify-between mb-1">
                    <span
                        className={`text-xs font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}
                    >
                        {buff.label}
                    </span>
                    <span className="text-[9px] opacity-60 uppercase">Lvl {buff.level}</span>
                </div>
                <p className="text-[10px] leading-snug opacity-90">{description}</p>
                {buff.effects?.winCondition && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold uppercase opacity-70">
                            Victory Goals:
                        </span>
                        {buff.effects.winCondition.points && (
                            <div className="text-[10px] flex justify-between">
                                <span>Points:</span> <span>{buff.effects.winCondition.points}</span>
                            </div>
                        )}
                        {buff.effects.winCondition.crowns && (
                            <div className="text-[10px] flex justify-between">
                                <span>Crowns:</span> <span>{buff.effects.winCondition.crowns}</span>
                            </div>
                        )}
                        {buff.effects.winCondition.singleColor && (
                            <div className="text-[10px] flex justify-between">
                                <span>Single Color:</span>{' '}
                                <span>{buff.effects.winCondition.singleColor}</span>
                            </div>
                        )}
                        {buff.effects.winCondition.disableSingleColor && (
                            <div className="text-[10px] text-rose-400">
                                Single Color Victory Disabled
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

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
    royals = [],
    privileges,
    extraPrivileges = 0,
    isActive,
    lastFeedback,
    onBuyReserved,
    onUsePrivilege,
    isPrivilegeMode,
    onGemClick,
    isStealMode,
    isDiscardMode,
    buff,
    theme,
}) => {
    const safeCards = Array.isArray(cards) ? cards : [];
    const [selectedStack, setSelectedStack] = useState<{ color: string; cards: CardType[] } | null>(
        null
    );

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

    return (
        <div
            className={`flex w-full h-full flex-row items-center p-4 transition-all duration-500 gap-4
        ${
            isActive
                ? theme === 'dark'
                    ? 'bg-slate-900/80'
                    : 'bg-white/80'
                : theme === 'dark'
                  ? 'bg-slate-950/40 opacity-90'
                  : 'bg-slate-100/40 opacity-90'
        }
        ${isActive ? `ring-1 ${player === 'p1' ? 'ring-emerald-500/30' : 'ring-blue-500/30'}` : ''} 
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
                className={`flex flex-col gap-3 min-w-[80px] shrink-0 items-center justify-center border-r pr-4 transition-colors duration-500
          ${theme === 'dark' ? 'border-slate-800' : 'border-slate-300'}
      `}
            >
                <div className="flex flex-col items-center gap-1">
                    <div
                        className={`p-2 rounded-full shadow-lg ${isActive ? (player === 'p1' ? 'bg-emerald-600 shadow-emerald-900/50' : 'bg-blue-600 shadow-blue-900/50') : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}
                    >
                        {player === 'p1' ? (
                            <Shield
                                size={20}
                                className={
                                    theme === 'dark' || isActive ? 'text-white' : 'text-slate-600'
                                }
                            />
                        ) : (
                            <Swords
                                size={20}
                                className={
                                    theme === 'dark' || isActive ? 'text-white' : 'text-slate-600'
                                }
                            />
                        )}
                    </div>
                    <h3
                        className={`font-bold text-xs whitespace-nowrap uppercase tracking-wider ${isActive ? (player === 'p1' ? 'text-emerald-400' : 'text-blue-400') : 'text-slate-500'}`}
                    >
                        {player === 'p1' ? 'Player 1' : 'Player 2'}
                    </h3>
                    <BuffDisplay buff={buff} theme={theme} playerKey={player} />
                </div>
                <div className="flex items-center gap-1 justify-center flex-wrap max-w-[80px]">
                    {Array.from({ length: Math.max(0, privileges) }).map((_, i) => (
                        <button
                            key={`std-${i}`}
                            disabled={!isActive || isPrivilegeMode}
                            onClick={onUsePrivilege}
                            className={`transition-all ${isActive && !isPrivilegeMode ? 'hover:scale-110 hover:text-amber-100 cursor-pointer animate-pulse' : 'opacity-80 cursor-default'}`}
                        >
                            <Scroll
                                size={16}
                                fill="#fcd34d"
                                className={theme === 'dark' ? 'text-amber-200' : 'text-amber-500'}
                            />
                        </button>
                    ))}
                    {/* Extra Privileges (Gold) */}
                    {Array.from({ length: Math.max(0, extraPrivileges) }).map((_, i) => (
                        <button
                            key={`extra-${i}`}
                            disabled={!isActive || isPrivilegeMode}
                            onClick={onUsePrivilege}
                            className={`transition-all ${isActive && !isPrivilegeMode ? 'hover:scale-110 hover:text-yellow-200 cursor-pointer animate-pulse' : 'opacity-80 cursor-default'}`}
                            title="Special Privilege (Protected)"
                        >
                            <Scroll
                                size={16}
                                fill="#fbbf24"
                                className="text-yellow-500 drop-shadow-md"
                            />
                        </button>
                    ))}
                    {privileges === 0 && extraPrivileges === 0 && (
                        <Scroll
                            size={16}
                            className={theme === 'dark' ? 'text-slate-800' : 'text-slate-300'}
                        />
                    )}
                </div>
            </div>

            {/* Module 2: Resources (Inventory & Stacks) */}
            <div className="flex flex-col gap-3 shrink-0 justify-center" style={{ flex: 65 }}>
                {/* Gems Row */}
                <div className="flex gap-3 justify-center">
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
                                    <GemIcon
                                        type={gem}
                                        size="w-10 h-10"
                                        count={count}
                                        className={
                                            count === 0 ? 'grayscale opacity-30' : 'shadow-lg'
                                        }
                                    />
                                </div>
                            );
                        })}
                </div>

                {/* Card Stacks & Bonuses */}
                <div className="flex gap-3 items-start justify-center mt-1">
                    {displayColors.map((color) => {
                        const stats = colorStats[color];
                        const type = GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES];

                        return (
                            <div
                                key={color}
                                className="flex flex-col items-center gap-1 min-w-[32px]"
                                onClick={() =>
                                    stats.cards.length > 0 &&
                                    setSelectedStack({ color, cards: stats.cards })
                                }
                            >
                                <motion.div
                                    animate={stats.cards.length > 0 ? { scale: [1, 1.1, 1] } : {}}
                                    key={stats.cards.length}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    className="relative w-[72px] h-[96px] group/stack cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                >
                                    {stats.cards.length > 0 ? (
                                        stats.cards.map((card: CardType, idx: number) => (
                                            <div
                                                key={idx}
                                                className="absolute inset-0 z-10"
                                                style={{
                                                    top: `${idx * -2}px`,
                                                    left: `${idx * 1}px`,
                                                }}
                                            >
                                                {/* Only the top card is fully rendered, but we keep the structure for stacking */}
                                                {idx === stats.cards.length - 1 ? (
                                                    <Card
                                                        card={card}
                                                        canBuy={false}
                                                        size="small"
                                                        theme={theme}
                                                        className="shadow-md"
                                                    />
                                                ) : (
                                                    <div
                                                        className={`w-[72px] h-[96px] rounded border ${type.border} bg-gradient-to-br ${type.color} shadow-sm transition-all duration-200 opacity-40`}
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
                                                                        stats.points >= 7
                                                                            ? 'text-amber-400'
                                                                            : 'text-amber-200/90'
                                                                    )}
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
                                                                className={`px-1.5 py-0.5 rounded-full border shadow-lg flex gap-0.5 items-center ${theme === 'dark' ? 'bg-slate-950 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-300'}`}
                                                            >
                                                                <span className="text-[10px] font-black">
                                                                    {stats.bonusCount}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            className={`w-[72px] h-[96px] rounded border border-dashed flex items-center justify-center ${theme === 'dark' ? 'border-slate-800 bg-slate-900/20' : 'border-slate-300 bg-slate-200/20'}`}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-full bg-gradient-to-br ${type.color} opacity-20`}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Module 3: Reserved & Royals (Compact) */}
            <div
                className={`flex flex-col justify-center gap-2 border-l pl-4 min-w-0 transition-colors duration-500
          ${theme === 'dark' ? 'border-slate-800' : 'border-slate-300'}
      `}
                style={{ flex: 35 }}
            >
                {/* Reserved Section - No Stacking */}
                <div className="w-full flex items-center justify-start gap-2 overflow-x-auto py-1">
                    {reserved.length === 0 && (
                        <span className="text-[10px] text-slate-700 italic w-full text-center">
                            No Reserved Cards
                        </span>
                    )}
                    {reserved.map((card, i) => (
                        <div
                            key={i}
                            className="transition-transform duration-200 ease-in-out shrink-0"
                        >
                            <Card
                                card={card}
                                canBuy={isActive && onBuyReserved(card)}
                                onClick={() =>
                                    isActive && onBuyReserved(card) && onBuyReserved(card, true)
                                }
                                isReservedView={true}
                                size="small"
                                theme={theme}
                            />
                        </div>
                    ))}
                </div>

                {/* Royal Section - No Stacking */}
                <div className="w-full flex items-center justify-start gap-2 overflow-x-auto py-1">
                    {royals.length === 0 && (
                        <span className="text-[10px] text-slate-700 italic w-full text-center">
                            No Royal Cards
                        </span>
                    )}
                    {royals.map((card, i) => (
                        <div
                            key={i}
                            className="transition-transform duration-200 ease-in-out shrink-0"
                        >
                            <Card
                                card={card as unknown as CardType}
                                isRoyal={true}
                                size="small"
                                theme={theme}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
