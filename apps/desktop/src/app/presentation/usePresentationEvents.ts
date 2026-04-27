import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GAME_PHASES } from '@gemduel/shared/constants';
import type { GameState } from '@gemduel/shared/types';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import { derivePresentationEvents } from './presentationEvents';
import type { PresentationEvent, PresentationHistorySource } from './presentationTypes';

type PresentationStage = 'intro' | 'selection' | 'pulse';

interface UsePresentationEventsParams {
    state: GameState;
    currentIndex: number;
    historySource: PresentationHistorySource;
    isReviewing: boolean;
}

const getPresentationEventDurationMs = (
    event: PresentationEvent,
    prefersReducedMotion: boolean
): number => {
    if (prefersReducedMotion) {
        return event.type === 'ability-callout' ? 260 : 180;
    }

    switch (event.type) {
        case 'ability-callout':
            return 1150;
        case 'turn-handoff':
            return 650;
        case 'card-acquire':
        case 'card-reserve':
        case 'market-refill':
            return 860;
        case 'gem-flight':
        case 'gem-drop':
        case 'gem-steal':
        case 'gem-discard':
            return 820;
        default:
            return 720;
    }
};

export interface PresentationController {
    activeEvent: PresentationEvent | null;
    activeStage: PresentationStage | null;
    queuedEventCount: number;
    isBlockingRoyalSelection: boolean;
    pendingReservedCardIds: string[];
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
    const activeEventRef = useRef<PresentationEvent | null>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [activeEvent, setActiveEvent] = useState<PresentationEvent | null>(null);
    const [activeStage, setActiveStage] = useState<PresentationStage | null>(null);
    const [eventQueue, setEventQueue] = useState<PresentationEvent[]>([]);

    useEffect(() => {
        activeEventRef.current = activeEvent;
    }, [activeEvent]);

    const getEventDedupeKey = useCallback(
        (event: PresentationEvent) => `${historySource}:${event.createdAtIndex}:${event.id}`,
        [historySource]
    );

    useLayoutEffect(() => {
        const previousState = previousStateRef.current;

        if (isReviewing || historySource !== 'live') {
            previousStateRef.current = state;
            setEventQueue([]);
            setActiveEvent(null);
            setActiveStage(null);
            return;
        }

        const nextEvents = derivePresentationEvents(
            previousState,
            state,
            currentIndex,
            historySource,
            isReviewing
        ).filter((event) => !seenEventIdsRef.current.has(getEventDedupeKey(event)));

        previousStateRef.current = state;

        if (
            state.phase !== GAME_PHASES.SELECT_ROYAL &&
            activeEventRef.current?.type === 'royal-unlock'
        ) {
            setActiveEvent(null);
            setActiveStage(null);
        }

        if (nextEvents.length === 0) {
            return;
        }

        for (const nextEvent of nextEvents) {
            seenEventIdsRef.current.add(getEventDedupeKey(nextEvent));
        }
        setEventQueue((currentQueue) => [...currentQueue, ...nextEvents]);
    }, [currentIndex, getEventDedupeKey, historySource, isReviewing, state]);

    useLayoutEffect(() => {
        if (activeEvent || eventQueue.length === 0) {
            return;
        }

        const [nextEvent, ...remainingEvents] = eventQueue;
        setEventQueue(remainingEvents);
        setActiveEvent(nextEvent ?? null);
        setActiveStage(nextEvent?.type === 'royal-unlock' ? 'intro' : 'pulse');
    }, [activeEvent, eventQueue]);

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

    useEffect(() => {
        if (!activeEvent || activeEvent.type === 'royal-unlock') {
            return undefined;
        }

        const timeoutMs = getPresentationEventDurationMs(activeEvent, prefersReducedMotion);
        const timeoutId = window.setTimeout(() => {
            completeEvent(activeEvent.id);
        }, timeoutMs);

        return () => window.clearTimeout(timeoutId);
    }, [activeEvent, completeEvent, prefersReducedMotion]);

    const hasPendingRoyalUnlock = eventQueue.some((event) => event.type === 'royal-unlock');
    const pendingReservedCardIds = useMemo(() => {
        const ids = new Set<string>();
        const collect = (event: PresentationEvent | null) => {
            if (event?.type !== 'card-reserve') {
                return;
            }
            event.cardIds.forEach((cardId) => ids.add(cardId));
        };

        collect(activeEvent);
        eventQueue.forEach(collect);
        return Array.from(ids);
    }, [activeEvent, eventQueue]);

    return useMemo(
        () => ({
            activeEvent,
            activeStage,
            queuedEventCount: eventQueue.length,
            isBlockingRoyalSelection: activeEvent?.type === 'royal-unlock' || hasPendingRoyalUnlock,
            pendingReservedCardIds,
            completeIntro,
            completeEvent,
            cancelEvent,
        }),
        [
            activeEvent,
            activeStage,
            cancelEvent,
            completeEvent,
            completeIntro,
            eventQueue.length,
            hasPendingRoyalUnlock,
            pendingReservedCardIds,
        ]
    );
};
