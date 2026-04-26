import { useEffect, useId, useRef, useState } from 'react';
import { Coins, Eye, Sparkles, Tag, Trophy, Zap } from 'lucide-react';
import { BUFFS } from '@gemduel/shared/constants';
import type { Buff, PlayerKey } from '@gemduel/shared/types';
import { getBuffGoalAdjustment, getBuffText } from '@gemduel/shared/data/buffCopy';
import { getBuffCategoryLabel } from '@gemduel/shared';
import { LexiconText } from '../../lexicon/LexiconText';
import {
    TOOLTIP_PANEL_BODY_CLASS,
    TOOLTIP_PANEL_CAPTION_CLASS,
    TOOLTIP_PANEL_CLASS,
    TOOLTIP_PANEL_HEADER_CLASS,
    TOOLTIP_PANEL_META_CLASS,
    TOOLTIP_PANEL_WIDTH_CLASS,
    getTooltipPanelThemeClass,
} from '../tooltipStyles';

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
    const tooltipSideClass = playerKey === 'p1' ? 'left-0' : 'right-0';

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
        1: theme === 'dark' ? 'text-blue-200' : 'text-blue-700',
        2: theme === 'dark' ? 'text-purple-200' : 'text-purple-700',
        3: theme === 'dark' ? 'text-amber-200' : 'text-amber-700',
    };
    const levelStyle =
        levelStyles[buff.level] || (theme === 'dark' ? 'text-slate-300' : 'text-slate-600');

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
                className={`flex items-center gap-5 px-2 py-1 text-[26px] font-black uppercase tracking-widest cursor-pointer transition-all hover:scale-105 ${levelStyle}`}
            >
                <Icon size={32} className={iconColor} />
                <span>{buffCopy.label}</span>
            </button>

            {isTooltipOpen && (
                <div
                    className={`absolute top-full z-[500] pt-4 ${tooltipSideClass}`}
                    data-buff-tooltip-wrapper={buff.id}
                >
                    <div
                        id={tooltipId}
                        role="dialog"
                        aria-modal="false"
                        data-buff-tooltip={buff.id}
                        data-tooltip-size="standard-panel"
                        onPointerDown={() => setIsPinned(true)}
                        className={`${TOOLTIP_PANEL_WIDTH_CLASS} ${TOOLTIP_PANEL_CLASS} ${getTooltipPanelThemeClass(theme)} transition-all duration-200`}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <span
                                className={`${TOOLTIP_PANEL_HEADER_CLASS} ${playerKey === 'p1' ? 'text-emerald-400' : 'text-blue-400'}`}
                            >
                                {buffCopy.label}
                            </span>
                            <span className={TOOLTIP_PANEL_META_CLASS}>LVL {buff.level}</span>
                        </div>
                        <p className={TOOLTIP_PANEL_BODY_CLASS}>
                            <LexiconText text={buffCopy.desc} />
                        </p>
                        {goalAdjustment && (
                            <div
                                className={`mt-4 space-y-2 border-t pt-3 ${
                                    theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                                }`}
                            >
                                <div className={`${TOOLTIP_PANEL_CAPTION_CLASS} opacity-75`}>
                                    {goalAdjustment.title}
                                </div>
                                {goalAdjustment.items.map((item) => (
                                    <div
                                        key={`${buff.id}-${item.label}`}
                                        className="flex items-center justify-between gap-4 text-[14px] leading-snug"
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
                                className={`mt-4 flex justify-end border-t pt-3 ${
                                    theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                                }`}
                            >
                                <span className={`${TOOLTIP_PANEL_CAPTION_CLASS} ${iconColor}`}>
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
