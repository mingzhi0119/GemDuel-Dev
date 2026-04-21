import { useEffect, useRef, useState } from 'react';
import type { PlayerKey } from '../../types';
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

    useEffect(() => {
        if (lastFeedback && lastFeedback.uid !== lastSeenFeedbackUid.current) {
            lastSeenFeedbackUid.current = lastFeedback.uid;
            const myItems = lastFeedback.items.filter(
                (item: { player: PlayerKey; type: string; diff: number }) => item.player === player
            );

            if (myItems.some((i: { type: string }) => i.type === 'extortion')) {
                setIsExtortionEffect(true);
                setTimeout(() => setIsExtortionEffect(false), 1000);
            }

            myItems.forEach((item: { type: string; diff: number }) => {
                const id = Date.now() + Math.random();
                const label = item.type.charAt(0).toUpperCase() + item.type.slice(1);
                const quantity = item.diff > 0 ? `+${item.diff}` : `${item.diff}`;
                setFeedbacks((prev) => [...prev, { id, quantity, label, type: item.type }]);
                setTimeout(() => setFeedbacks((prev) => prev.filter((f) => f.id !== id)), 1500);
            });
        }
    }, [lastFeedback, player]);

    return { feedbacks, isExtortionEffect };
}
