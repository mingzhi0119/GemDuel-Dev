import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlayerKey } from '@gemduel/shared/types';
import type { PlayerZoneFeedbackItem } from './types';

export function usePlayerZoneFeedback(
    player: PlayerKey,
    lastFeedback: {
        uid: string;
        items: Array<{ player: PlayerKey; type: string; diff: number }>;
    } | null
) {
    const [feedbacks, setFeedbacks] = useState<PlayerZoneFeedbackItem[]>([]);
    const [isExtortionEffect, setIsExtortionEffect] = useState(false);
    const lastSeenFeedbackUid = useRef<string | null>(null);
    const pendingTimeouts = useRef(new Set<ReturnType<typeof setTimeout>>());

    const scheduleTimeout = useCallback((callback: () => void, delay: number) => {
        const timeout = setTimeout(() => {
            pendingTimeouts.current.delete(timeout);
            callback();
        }, delay);

        pendingTimeouts.current.add(timeout);
    }, []);

    useEffect(() => {
        return () => {
            pendingTimeouts.current.forEach((timeout) => clearTimeout(timeout));
            pendingTimeouts.current.clear();
        };
    }, []);

    useEffect(() => {
        if (lastFeedback && lastFeedback.uid !== lastSeenFeedbackUid.current) {
            lastSeenFeedbackUid.current = lastFeedback.uid;
            const myItems = lastFeedback.items.filter(
                (item: { player: PlayerKey; type: string; diff: number }) => item.player === player
            );

            if (myItems.some((i: { type: string }) => i.type === 'extortion')) {
                setIsExtortionEffect(true);
                scheduleTimeout(() => setIsExtortionEffect(false), 1000);
            }

            myItems.forEach((item: { type: string; diff: number }) => {
                const id = Date.now() + Math.random();
                const label = item.type.charAt(0).toUpperCase() + item.type.slice(1);
                const quantity = item.diff > 0 ? `+${item.diff}` : `${item.diff}`;
                setFeedbacks((prev) => [...prev, { id, quantity, label, type: item.type }]);
                scheduleTimeout(
                    () => setFeedbacks((prev) => prev.filter((f) => f.id !== id)),
                    1500
                );
            });
        }
    }, [lastFeedback, player, scheduleTimeout]);

    return { feedbacks, isExtortionEffect };
}
