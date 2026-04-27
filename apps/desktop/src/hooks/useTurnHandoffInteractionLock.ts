import { useLayoutEffect, useRef, useState } from 'react';
import type { GameState } from '@gemduel/shared/types';

export const TURN_HANDOFF_INTERACTION_LOCK_MS = 500;

export const useTurnHandoffInteractionLock = (
    gameState: GameState,
    isReviewing: boolean,
    isViewingHistory: boolean
): boolean => {
    const previousTurnRef = useRef(gameState.turn);
    const [isLocked, setIsLocked] = useState(false);

    useLayoutEffect(() => {
        const previousTurn = previousTurnRef.current;
        previousTurnRef.current = gameState.turn;

        if (isReviewing || isViewingHistory || gameState.winner) {
            setIsLocked(false);
            return undefined;
        }

        if (previousTurn === gameState.turn) {
            return undefined;
        }

        setIsLocked(true);
        const timeoutId = window.setTimeout(() => {
            setIsLocked(false);
        }, TURN_HANDOFF_INTERACTION_LOCK_MS);

        return () => window.clearTimeout(timeoutId);
    }, [gameState.turn, gameState.winner, isReviewing, isViewingHistory]);

    return isLocked;
};
