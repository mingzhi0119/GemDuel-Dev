import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { getLexiconDescription, getLexiconLabel, type LexiconTermId } from '@gemduel/shared';
import { useLocale } from '../i18n/LocaleProvider';
import { useLexicon, type LexiconInteractionMode } from './LexiconProvider';

interface TermPopoverProps {
    termId: LexiconTermId;
    popoverId: string;
    anchorElement: HTMLElement;
    interaction: LexiconInteractionMode;
}

const EDGE_PADDING_PX = 12;
const POPOVER_WIDTH_PX = 320;
const POPOVER_VERTICAL_GAP_PX = 10;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function TermPopover({ termId, popoverId, anchorElement, interaction }: TermPopoverProps) {
    const { locale } = useLocale();
    const { closePopover, registerPopoverElement } = useLexicon();
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<CSSProperties | null>(null);

    const theme =
        typeof document === 'undefined' ? 'dark' : document.documentElement.dataset.theme || 'dark';

    const computePosition = useMemo(
        () => () => {
            const rect = anchorElement.getBoundingClientRect();
            const availableWidth = Math.min(
                POPOVER_WIDTH_PX,
                window.innerWidth - EDGE_PADDING_PX * 2
            );
            const centeredLeft = rect.left + rect.width / 2 - availableWidth / 2;
            const left = clamp(
                centeredLeft,
                EDGE_PADDING_PX,
                window.innerWidth - availableWidth - EDGE_PADDING_PX
            );

            const measuredHeight = popoverRef.current?.offsetHeight ?? 156;
            const fitsBelow =
                rect.bottom + POPOVER_VERTICAL_GAP_PX + measuredHeight <=
                window.innerHeight - EDGE_PADDING_PX;
            const top = fitsBelow
                ? rect.bottom + POPOVER_VERTICAL_GAP_PX
                : Math.max(EDGE_PADDING_PX, rect.top - measuredHeight - POPOVER_VERTICAL_GAP_PX);

            setPosition({
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                width: `${availableWidth}px`,
            });
        },
        [anchorElement]
    );

    useLayoutEffect(() => {
        computePosition();
    }, [computePosition]);

    useEffect(() => {
        computePosition();
        window.addEventListener('resize', computePosition);
        window.addEventListener('scroll', computePosition, true);
        return () => {
            window.removeEventListener('resize', computePosition);
            window.removeEventListener('scroll', computePosition, true);
        };
    }, [computePosition]);

    useEffect(() => {
        const current = popoverRef.current;
        registerPopoverElement(current);
        if (interaction === 'click') {
            current?.focus();
        }
        return () => registerPopoverElement(null);
    }, [interaction, registerPopoverElement]);

    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div
            id={popoverId}
            ref={popoverRef}
            role="dialog"
            aria-modal="false"
            tabIndex={-1}
            onMouseLeave={
                interaction === 'hover'
                    ? (event) => {
                          const nextTarget = event.relatedTarget as Node | null;
                          if (anchorElement.contains(nextTarget)) {
                              return;
                          }
                          closePopover({ restoreFocus: false });
                      }
                    : undefined
            }
            className={`z-[1100] rounded-2xl border px-4 py-3 shadow-2xl outline-none backdrop-blur-xl ${
                theme === 'light'
                    ? 'border-stone-300 bg-white/96 text-stone-900'
                    : 'border-slate-600 bg-slate-950/96 text-slate-50'
            }`}
            style={position ?? undefined}
        >
            <div
                className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                    theme === 'light' ? 'text-stone-500' : 'text-slate-400'
                }`}
            >
                {getLexiconLabel(termId, locale)}
            </div>
            <div
                className={`mt-2 text-sm leading-6 ${theme === 'light' ? 'text-stone-700' : 'text-slate-200'}`}
            >
                {getLexiconDescription(termId, locale)}
            </div>
        </div>,
        document.body
    );
}
