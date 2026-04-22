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

export type LexiconInteractionMode = 'click' | 'hover';

interface ActiveLexiconPopover {
    termId: LexiconTermId;
    trigger: HTMLElement;
    interaction: LexiconInteractionMode;
}

interface LexiconContextValue {
    activePopover: ActiveLexiconPopover | null;
    openPopover: (
        termId: LexiconTermId,
        trigger: HTMLElement,
        interaction: LexiconInteractionMode
    ) => void;
    togglePopover: (
        termId: LexiconTermId,
        trigger: HTMLElement,
        interaction?: LexiconInteractionMode
    ) => void;
    closePopover: (options?: { restoreFocus?: boolean }) => void;
    registerPopoverElement: (element: HTMLElement | null) => void;
    isWithinPopover: (target: Node | null) => boolean;
}

const noop = () => undefined;

const LexiconContext = createContext<LexiconContextValue>({
    activePopover: null,
    openPopover: noop as LexiconContextValue['openPopover'],
    togglePopover: noop as LexiconContextValue['togglePopover'],
    closePopover: noop as LexiconContextValue['closePopover'],
    registerPopoverElement: noop,
    isWithinPopover: () => false,
});

export function LexiconProvider({ children }: PropsWithChildren) {
    const [activePopover, setActivePopover] = useState<ActiveLexiconPopover | null>(null);
    const popoverElementRef = useRef<HTMLElement | null>(null);

    const registerPopoverElement = useCallback((element: HTMLElement | null) => {
        popoverElementRef.current = element;
    }, []);

    const closePopover = useCallback((options?: { restoreFocus?: boolean }) => {
        setActivePopover((current) => {
            const restoreFocus = options?.restoreFocus ?? current?.interaction === 'click';
            if (restoreFocus) {
                current?.trigger.focus();
            }
            return null;
        });
        popoverElementRef.current = null;
    }, []);

    const openPopover = useCallback(
        (termId: LexiconTermId, trigger: HTMLElement, interaction: LexiconInteractionMode) => {
            setActivePopover({ termId, trigger, interaction });
        },
        []
    );

    const togglePopover = useCallback(
        (
            termId: LexiconTermId,
            trigger: HTMLElement,
            interaction: LexiconInteractionMode = 'click'
        ) => {
            setActivePopover((current) => {
                if (current?.termId === termId && current.trigger === trigger) {
                    trigger.focus();
                    popoverElementRef.current = null;
                    return null;
                }

                return { termId, trigger, interaction };
            });
        },
        []
    );

    const isWithinPopover = useCallback((target: Node | null) => {
        if (!target) {
            return false;
        }

        return popoverElementRef.current?.contains(target) ?? false;
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
                closePopover({ restoreFocus: activePopover.interaction === 'click' });
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
            openPopover,
            togglePopover,
            closePopover,
            registerPopoverElement,
            isWithinPopover,
        }),
        [
            activePopover,
            closePopover,
            isWithinPopover,
            openPopover,
            registerPopoverElement,
            togglePopover,
        ]
    );

    return <LexiconContext.Provider value={value}>{children}</LexiconContext.Provider>;
}

export const useLexicon = () => useContext(LexiconContext);
