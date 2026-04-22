import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type PropsWithChildren,
} from 'react';
import type { LexiconTermId } from '@gemduel/shared';

interface ActiveLexiconPopover {
    termId: LexiconTermId;
    trigger: HTMLButtonElement;
}

interface LexiconContextValue {
    activePopover: ActiveLexiconPopover | null;
    togglePopover: (termId: LexiconTermId, trigger: HTMLButtonElement) => void;
    closePopover: (options?: { restoreFocus?: boolean }) => void;
    registerPopoverElement: (element: HTMLElement | null) => void;
}

const noop = () => undefined;

const LexiconContext = createContext<LexiconContextValue>({
    activePopover: null,
    togglePopover: noop as LexiconContextValue['togglePopover'],
    closePopover: noop as LexiconContextValue['closePopover'],
    registerPopoverElement: noop,
});

export function LexiconProvider({ children }: PropsWithChildren) {
    const [activePopover, setActivePopover] = useState<ActiveLexiconPopover | null>(null);
    const popoverElementRef = useRef<HTMLElement | null>(null);

    const registerPopoverElement = useCallback((element: HTMLElement | null) => {
        popoverElementRef.current = element;
    }, []);

    const closePopover = useCallback((options?: { restoreFocus?: boolean }) => {
        setActivePopover((current) => {
            if (options?.restoreFocus !== false) {
                current?.trigger.focus();
            }
            return null;
        });
        popoverElementRef.current = null;
    }, []);

    const togglePopover = useCallback((termId: LexiconTermId, trigger: HTMLButtonElement) => {
        setActivePopover((current) => {
            if (current?.termId === termId && current.trigger === trigger) {
                trigger.focus();
                popoverElementRef.current = null;
                return null;
            }

            return { termId, trigger };
        });
    }, []);

    useEffect(() => {
        if (!activePopover) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (!target) {
                return;
            }

            if (activePopover.trigger.contains(target)) {
                return;
            }

            if (popoverElementRef.current?.contains(target)) {
                return;
            }

            closePopover({ restoreFocus: false });
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closePopover();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [activePopover, closePopover]);

    const value = useMemo<LexiconContextValue>(
        () => ({
            activePopover,
            togglePopover,
            closePopover,
            registerPopoverElement,
        }),
        [activePopover, closePopover, registerPopoverElement, togglePopover]
    );

    return <LexiconContext.Provider value={value}>{children}</LexiconContext.Provider>;
}

export const useLexicon = () => useContext(LexiconContext);
