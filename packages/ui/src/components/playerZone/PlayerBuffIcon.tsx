import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BUFFS } from '@gemduel/shared/constants';
import { getBuffCategoryLabel } from '@gemduel/shared';
import { getBuffGoalAdjustment, getBuffText } from '@gemduel/shared/data/buffCopy';
import type { Buff, PlayerKey } from '@gemduel/shared/types';
import { LexiconText } from '../../lexicon/LexiconText';
import {
    TOOLTIP_PANEL_BODY_CLASS,
    TOOLTIP_PANEL_CAPTION_CLASS,
    TOOLTIP_PANEL_HEADER_CLASS,
    TOOLTIP_PANEL_META_CLASS,
    getTooltipPanelThemeClass,
} from '../tooltipStyles';

interface PlayerBuffIconProps {
    buff: Buff;
    playerKey: PlayerKey;
    theme: 'light' | 'dark';
    locale: 'en' | 'zh';
    variant?: 'standalone' | 'avatar';
}

const getBuffIconPath = (buffId: string) => `/assets/rogue-buffs/rogue-buff-${buffId}.png`;
const TOOLTIP_PANEL_WIDTH_PX = 320;
const TOOLTIP_VIEWPORT_MARGIN_PX = 16;
const TOOLTIP_ICON_GAP_PX = 18;

export function PlayerBuffIcon({
    buff: rawBuff,
    playerKey,
    theme,
    locale,
    variant = 'standalone',
}: PlayerBuffIconProps) {
    const [isTriggerHovered, setIsTriggerHovered] = useState(false);
    const [isTooltipHovered, setIsTooltipHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number } | null>(
        null
    );
    const rootRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const closeTimerRef = useRef<number | null>(null);
    const tooltipId = useId();
    const buff = rawBuff
        ? (Object.values(BUFFS).find((candidate) => candidate.id === rawBuff.id) as Buff) || rawBuff
        : null;
    const buffCopy = buff ? getBuffText(buff.id, locale) : null;
    const goalAdjustment = buff ? getBuffGoalAdjustment(buff.id, locale) : null;
    const isTooltipOpen = isTriggerHovered || isTooltipHovered || isPinned;

    const clearCloseTimer = () => {
        if (closeTimerRef.current === null || typeof window === 'undefined') return;
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
    };

    const scheduleTriggerClose = () => {
        if (isPinned || typeof window === 'undefined') return;
        clearCloseTimer();
        closeTimerRef.current = window.setTimeout(() => {
            setIsTriggerHovered(false);
            closeTimerRef.current = null;
        }, 160);
    };

    const updateTooltipPosition = () => {
        const rect = rootRef.current?.getBoundingClientRect();
        if (!rect || typeof window === 'undefined') return;

        const preferredLeft = playerKey === 'p1' ? rect.right - TOOLTIP_PANEL_WIDTH_PX : rect.left;
        const maxLeft = window.innerWidth - TOOLTIP_PANEL_WIDTH_PX - TOOLTIP_VIEWPORT_MARGIN_PX;

        setTooltipPosition({
            left: Math.max(
                TOOLTIP_VIEWPORT_MARGIN_PX,
                Math.min(preferredLeft, Math.max(TOOLTIP_VIEWPORT_MARGIN_PX, maxLeft))
            ),
            top: rect.top - TOOLTIP_ICON_GAP_PX,
        });
    };

    useEffect(() => {
        if (!isPinned) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (
                !target ||
                rootRef.current?.contains(target) ||
                tooltipRef.current?.contains(target)
            ) {
                return;
            }
            setIsPinned(false);
            setIsTriggerHovered(false);
            setIsTooltipHovered(false);
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsPinned(false);
                setIsTriggerHovered(false);
                setIsTooltipHovered(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPinned]);

    useEffect(() => {
        return () => clearCloseTimer();
    }, []);

    useEffect(() => {
        if (!isTooltipOpen) return;

        updateTooltipPosition();
        window.addEventListener('resize', updateTooltipPosition);
        window.addEventListener('scroll', updateTooltipPosition, true);
        return () => {
            window.removeEventListener('resize', updateTooltipPosition);
            window.removeEventListener('scroll', updateTooltipPosition, true);
        };
    }, [isTooltipOpen, playerKey]);

    if (!buff || buff.id === 'none' || !buffCopy) return null;

    const tooltip =
        isTooltipOpen && tooltipPosition && typeof document !== 'undefined'
            ? createPortal(
                  <div
                      ref={tooltipRef}
                      className="fixed z-[1000] pb-4"
                      data-player-buff-tooltip-wrapper={buff.id}
                      style={{
                          left: tooltipPosition.left,
                          top: tooltipPosition.top,
                          width: TOOLTIP_PANEL_WIDTH_PX,
                          transform: 'translateY(-100%)',
                      }}
                  >
                      <div
                          id={tooltipId}
                          role="dialog"
                          aria-modal="false"
                          data-player-buff-tooltip={buff.id}
                          data-tooltip-size="compact-panel"
                          onPointerDown={() => setIsPinned(true)}
                          onMouseEnter={() => {
                              clearCloseTimer();
                              setIsTooltipHovered(true);
                          }}
                          onMouseLeave={() => {
                              if (!isPinned) setIsTooltipHovered(false);
                          }}
                          className={`rounded-2xl border px-4 py-3 text-sm leading-6 shadow-2xl backdrop-blur-xl ${getTooltipPanelThemeClass(theme)} transition-all duration-200`}
                      >
                          <div className="mb-2 flex items-center justify-between gap-4">
                              <span
                                  className={`${TOOLTIP_PANEL_HEADER_CLASS} text-[13px] ${playerKey === 'p1' ? 'text-emerald-400' : 'text-blue-400'}`}
                              >
                                  {buffCopy.label}
                              </span>
                              <span className={`${TOOLTIP_PANEL_META_CLASS} text-[11px]`}>
                                  LVL {buff.level}
                              </span>
                          </div>
                          <p className={`${TOOLTIP_PANEL_BODY_CLASS} text-sm leading-6`}>
                              <LexiconText text={buffCopy.desc} interaction="click" />
                          </p>
                          {goalAdjustment && (
                              <div
                                  className={`mt-3 space-y-2 border-t pt-3 ${
                                      theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                                  }`}
                              >
                                  <div
                                      className={`${TOOLTIP_PANEL_CAPTION_CLASS} text-[11px] opacity-75`}
                                  >
                                      {goalAdjustment.title}
                                  </div>
                                  {goalAdjustment.items.map((item) => (
                                      <div
                                          key={`${buff.id}-${item.label}`}
                                          className="flex items-center justify-between gap-4 text-sm leading-6"
                                      >
                                          <span className="opacity-80">
                                              <LexiconText text={item.label} interaction="click" />
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
                                  className={`mt-3 flex justify-end border-t pt-3 ${
                                      theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                                  }`}
                              >
                                  <span className={`${TOOLTIP_PANEL_CAPTION_CLASS} text-[11px]`}>
                                      {getBuffCategoryLabel(buff.category, locale)}
                                  </span>
                              </div>
                          )}
                      </div>
                  </div>,
                  document.body
              )
            : null;

    return (
        <div
            ref={rootRef}
            data-player-buff-icon-root={playerKey}
            data-player-buff-id={buff.id}
            className="relative flex items-center justify-center"
            onMouseEnter={() => {
                clearCloseTimer();
                updateTooltipPosition();
                setIsTriggerHovered(true);
            }}
            onMouseLeave={() => {
                scheduleTriggerClose();
            }}
        >
            <button
                type="button"
                data-player-buff-icon-trigger={buff.id}
                aria-label={buffCopy.label}
                aria-haspopup="dialog"
                aria-controls={isTooltipOpen ? tooltipId : undefined}
                aria-expanded={isTooltipOpen}
                onClick={() => {
                    clearCloseTimer();
                    updateTooltipPosition();
                    setIsTriggerHovered(true);
                    setIsPinned((current) => !current);
                }}
                className={`flex items-center justify-center rounded-full bg-transparent p-0 transition-all hover:scale-105 ${
                    variant === 'avatar' ? 'h-[116px] w-[116px]' : 'h-[116px] w-[116px]'
                }`}
            >
                <img
                    src={getBuffIconPath(buff.id)}
                    alt=""
                    data-player-buff-icon-image={buff.id}
                    draggable={false}
                    decoding="async"
                    className="h-full w-full rounded-full object-cover"
                />
            </button>
            {tooltip}
        </div>
    );
}
