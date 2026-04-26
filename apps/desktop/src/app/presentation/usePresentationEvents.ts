import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GAME_PHASES } from '@gemduel/shared/constants';
import type { GameState } from '@gemduel/shared/types';
import { derivePresentationEvents } from './presentationEvents';
import type { PresentationEvent, PresentationHistorySource } from './presentationTypes';

type PresentationStage = 'intro' | 'selection';

interface UsePresentationEventsParams {
    state: GameState;
    currentIndex: number;
    historySource: PresentationHistorySource;
    isReviewing: boolean;
}

export interface PresentationController {
    activeEvent: PresentationEvent | null;
    activeStage: PresentationStage | null;
    isBlockingRoyalSelection: boolean;
    completeIntro: () => void;
    completeEvent: (eventId: string) => void;
    cancelEvent: (eventId: string) => void;
}

export const usePresentationEvents = ({
    state,
    currentIndex,
    historySource,
    isReviewing,
}: UsePresentationEventsParams): PresentationController => {
    const previousStateRef = useRef<GameState | null>(null);
    const seenEventIdsRef = useRef(new Set<string>());
    const [activeEvent, setActiveEvent] = useState<PresentationEvent | null>(null);
    const [activeStage, setActiveStage] = useState<PresentationStage | null>(null);

    useEffect(() => {
        const previousState = previousStateRef.current;
        const nextEvents = derivePresentationEvents(
            previousState,
            state,
            currentIndex,
            historySource,
            isReviewing
        ).filter((event) => !seenEventIdsRef.current.has(event.id));

        previousStateRef.current = state;

        if (state.phase !== GAME_PHASES.SELECT_ROYAL) {
            setActiveEvent(null);
            setActiveStage(null);
            return;
        }

        if (nextEvents.length === 0) {
            return;
        }

        const nextEvent = nextEvents[0]!;
        seenEventIdsRef.current.add(nextEvent.id);
        setActiveEvent((currentEvent) => currentEvent ?? nextEvent);
        setActiveStage((currentStage) => currentStage ?? 'intro');
    }, [currentIndex, historySource, isReviewing, state]);

    const completeIntro = useCallback(() => {
        setActiveStage((currentStage) => (currentStage === 'intro' ? 'selection' : currentStage));
    }, []);

    const completeEvent = useCallback(
        (eventId: string) => {
            if (activeEvent?.id !== eventId) {
                return;
            }

            setActiveEvent(null);
            setActiveStage(null);
        },
        [activeEvent?.id]
    );

    const cancelEvent = useCallback(
        (eventId: string) => {
            if (activeEvent?.id !== eventId) {
                return;
            }

            setActiveEvent(null);
            setActiveStage(null);
        },
        [activeEvent?.id]
    );

    return useMemo(
        () => ({
            activeEvent,
            activeStage,
            isBlockingRoyalSelection: Boolean(activeEvent),
            completeIntro,
            completeEvent,
            cancelEvent,
        }),
        [activeEvent, activeStage, cancelEvent, completeEvent, completeIntro]
    );
};
