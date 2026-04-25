import { useEffect, useId, useRef, useState } from 'react';
import { Coins, Eye, Sparkles, Tag, Trophy, Zap } from 'lucide-react';
import { BUFFS } from '@gemduel/shared/constants';
import type { Buff, PlayerKey } from '@gemduel/shared/types';
import { getBuffGoalAdjustment, getBuffText } from '@gemduel/shared/data/buffCopy';
import { getBuffCategoryLabel } from '@gemduel/shared';
import { LexiconText } from '../../lexicon/LexiconText';

interface TopBarBuffProps {
    buff: Buff;
    playerKey: PlayerKey;
    theme: 'light' | 'dark';
    locale: 'en' | 'zh';
}

const getBuffIcon = (category?: string) => {
    switch (category) {
        case 'economy':
            return { Icon: Coins, color: 'text-amber-400' };
        case 'discount':
            return { Icon: Tag, color: 'text-blue-400' };
        case 'control':
            return { Icon: Zap, color: 'text-red-500' };
        case 'intel':
            return { Icon: Eye, color: 'text-cyan-400' };
        case 'victory':
            return { Icon: Trophy, color: 'text-orange-500' };
        default:
            return { Icon: Sparkles, color: 'text-purple-400' };
    }
};

export const TopBarBuff = ({ buff: rawBuff, playerKey, theme, locale }: TopBarBuffProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const tooltipId = useId();
    const buff = rawBuff
        ? (Object.values(BUFFS).find((b) => b.id === rawBuff.id) as Buff) || rawBuff
        : null;
    const { Icon, color: iconColor } = getBuffIcon(buff?.category);
    const goalAdjustment = buff ? getBuffGoalAdjustment(buff.id, locale) : null;
    const buffCopy = buff ? getBuffText(buff.id, locale) : null;
    const isTooltipOpen = isHovered || isPinned;

    useEffect(() => {
        if (!isPinned) return;
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (!target || rootRef.current?.contains(target)) return;
            setIsPinned(false);
            setIsHovered(false);
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsPinned(false);
                setIsHovered(false);
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPinned]);

    if (!buff || buff.id === 'none' || !buffCopy) return null;

    const levelStyles: Record<number, string> = {
        1:
            theme === 'dark'
                ? 'border-blue-400 bg-blue-900/30 text-blue-200'
                : 'border-blue-500 bg-blue-50 text-blue-700',
        2:
            theme === 'dark'
                ? 'border-purple-400 bg-purple-900/30 text-purple-200'
                : 'border-purple-500 bg-purple-50 text-purple-700',
        3:
            theme === 'dark'
                ? 'border-amber-400 bg-amber-900/30 text-amber-200'
                : 'border-amber-500 bg-amber-50 text-amber-700',
    };
    const levelStyle =
        levelStyles[buff.level] ||
        (theme === 'dark'
            ? 'border-slate-500 bg-slate-500/20 text-slate-300'
            : 'border-slate-400 bg-slate-50 text-slate-600');

    return (
        <div
            ref={rootRef}
            data-buff-root={buff.id}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                if (!isPinned) setIsHovered(false);
            }}
        >
            <button
                type="button"
                data-buff-trigger={buff.id}
                aria-haspopup="dialog"
                aria-controls={isTooltipOpen ? tooltipId : undefined}
                aria-expanded={isTooltipOpen}
                onClick={() => {
                    setIsHovered(true);
                    setIsPinned((current) => !current);
                }}
                className={`flex items-center gap-3 px-5 py-2 rounded-full border text-[13px] font-black uppercase tracking-widest cursor-pointer transition-all hover:scale-105 shadow-md ${levelStyle}`}
            >
                <Icon size={16} className={iconColor} />
                <span>{buffCopy.label}</span>
            </button>

            {isTooltipOpen && (
                <div
                    className="absolute top-full left-1/2 z-[500] w-56 -translate-x-1/2 pt-3"
                    data-buff-tooltip-wrapper={buff.id}
                >
                    <div
                        id={tooltipId}
                        role="dialog"
                        aria-modal="false"
                        data-buff-tooltip={buff.id}
                        onPointerDown={() => setIsPinned(true)}
                        className={`rounded-xl border p-3 shadow-2xl backdrop-blur-md transition-all duration-200 ${
                            theme === 'dark'
                                ? 'border-slate-600 bg-slate-900/98 text-slate-100'
                                : 'border-slate-300 bg-white/98 text-slate-900'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span
                                className={`text-[12px] font-bold uppercase tracking-wider ${playerKey === 'p1' ? 'text-emerald-400' : 'text-blue-400'}`}
                            >
                                {buffCopy.label}
                            </span>
                            <span className="text-[10px] opacity-70 font-mono">
                                LVL {buff.level}
                            </span>
                        </div>
                        <p className="text-[12px] leading-relaxed opacity-90">
                            <LexiconText text={buffCopy.desc} />
                        </p>
                        {goalAdjustment && (
                            <div
                                className={`mt-2 pt-2 space-y-1 border-t ${
                                    theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                                }`}
                            >
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                    {goalAdjustment.title}
                                </div>
                                {goalAdjustment.items.map((item) => (
                                    <div
                                        key={`${buff.id}-${item.label}`}
                                        className="flex items-center justify-between gap-3 text-[10px]"
                                    >
                                        <span className="opacity-80">
                                            <LexiconText text={item.label} />
                                        </span>
                                        <span className="font-mono font-bold text-amber-400">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {buff.category && (
                            <div
                                className={`flex justify-end mt-1.5 pt-1.5 border-t ${
                                    theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                                }`}
                            >
                                <span
                                    className={`text-[10px] font-black uppercase tracking-widest ${iconColor}`}
                                >
                                    {getBuffCategoryLabel(buff.category, locale)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
