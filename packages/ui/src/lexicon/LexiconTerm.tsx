import { useId, useMemo, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { getLexiconLabel, type LexiconTermId } from '@gemduel/shared';
import { useLocale } from '../i18n/LocaleProvider';
import { useLexicon } from './LexiconProvider';
import { TermPopover } from './TermPopover';

interface LexiconTermProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'type'
> {
    termId: LexiconTermId;
    children?: ReactNode;
}

export function LexiconTerm({
    termId,
    children,
    className = '',
    ...buttonProps
}: LexiconTermProps) {
    const { locale } = useLocale();
    const { activePopover, togglePopover } = useLexicon();
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const popoverId = useId();

    const isOpen = activePopover?.termId === termId && activePopover.trigger === buttonRef.current;
    const text = useMemo(
        () => children ?? getLexiconLabel(termId, locale),
        [children, locale, termId]
    );

    return (
        <>
            <button
                {...buttonProps}
                ref={buttonRef}
                type="button"
                aria-haspopup="dialog"
                aria-controls={isOpen ? popoverId : undefined}
                aria-expanded={isOpen}
                onClick={() => {
                    if (buttonRef.current) {
                        togglePopover(termId, buttonRef.current);
                    }
                }}
                className={`inline cursor-pointer underline underline-offset-4 decoration-[1.5px] ${className}`}
            >
                {text}
            </button>
            {isOpen && buttonRef.current ? (
                <TermPopover
                    termId={termId}
                    popoverId={popoverId}
                    anchorElement={buttonRef.current}
                />
            ) : null}
        </>
    );
}
