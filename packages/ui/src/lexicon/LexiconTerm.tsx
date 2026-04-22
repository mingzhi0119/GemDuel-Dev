import { useId, useMemo, useRef, type ReactNode } from 'react';
import { getLexiconLabel, type LexiconTermId } from '@gemduel/shared';
import { useLocale } from '../i18n/LocaleProvider';
import { useLexicon } from './LexiconProvider';
import { TermPopover } from './TermPopover';

export type LexiconTermTrigger = 'button' | 'span';

interface LexiconTermProps {
    termId: LexiconTermId;
    children?: ReactNode;
    className?: string;
    interaction?: 'click' | 'hover';
    underline?: boolean;
    as?: LexiconTermTrigger;
}

export function LexiconTerm({
    termId,
    children,
    className = '',
    interaction = 'hover',
    underline = true,
    as = 'button',
}: LexiconTermProps) {
    const { locale } = useLocale();
    const { activePopover, closePopover, isWithinPopover, openPopover, togglePopover } =
        useLexicon();
    const triggerRef = useRef<HTMLElement | null>(null);
    const popoverId = useId();

    const isOpen = activePopover?.termId === termId && activePopover.trigger === triggerRef.current;
    const text = useMemo(
        () => children ?? getLexiconLabel(termId, locale),
        [children, locale, termId]
    );
    const triggerClassName = `inline ${
        interaction === 'hover' ? 'cursor-help' : 'cursor-pointer'
    } ${underline ? 'underline underline-offset-4 decoration-[1.5px]' : ''} ${className}`.trim();

    const openCurrentPopover = () => {
        if (triggerRef.current) {
            openPopover(termId, triggerRef.current, interaction);
        }
    };

    const closeHoveredPopover = (relatedTarget: EventTarget | null) => {
        const nextTarget = relatedTarget as Node | null;
        if (triggerRef.current?.contains(nextTarget)) {
            return;
        }
        if (isWithinPopover(nextTarget)) {
            return;
        }
        closePopover({ restoreFocus: false });
    };

    if (as === 'span') {
        return (
            <>
                <span
                    ref={(element) => {
                        triggerRef.current = element;
                    }}
                    onMouseEnter={interaction === 'hover' ? openCurrentPopover : undefined}
                    onMouseLeave={
                        interaction === 'hover'
                            ? (event) => closeHoveredPopover(event.relatedTarget)
                            : undefined
                    }
                    className={triggerClassName}
                >
                    {text}
                </span>
                {isOpen && triggerRef.current ? (
                    <TermPopover
                        termId={termId}
                        popoverId={popoverId}
                        anchorElement={triggerRef.current}
                        interaction={interaction}
                    />
                ) : null}
            </>
        );
    }

    return (
        <>
            <button
                ref={(element) => {
                    triggerRef.current = element;
                }}
                type="button"
                aria-haspopup="dialog"
                aria-controls={isOpen ? popoverId : undefined}
                aria-expanded={isOpen}
                onClick={
                    interaction === 'click'
                        ? () => {
                              if (triggerRef.current) {
                                  togglePopover(termId, triggerRef.current, interaction);
                              }
                          }
                        : undefined
                }
                onMouseEnter={interaction === 'hover' ? openCurrentPopover : undefined}
                onMouseLeave={
                    interaction === 'hover'
                        ? (event) => closeHoveredPopover(event.relatedTarget)
                        : undefined
                }
                onFocus={interaction === 'hover' ? openCurrentPopover : undefined}
                onBlur={
                    interaction === 'hover'
                        ? (event) => closeHoveredPopover(event.relatedTarget)
                        : undefined
                }
                className={triggerClassName}
            >
                {text}
            </button>
            {isOpen && triggerRef.current ? (
                <TermPopover
                    termId={termId}
                    popoverId={popoverId}
                    anchorElement={triggerRef.current}
                    interaction={interaction}
                />
            ) : null}
        </>
    );
}
