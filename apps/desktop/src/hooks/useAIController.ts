import { useEffect } from 'react';
import { GameState, GameAction } from '@gemduel/shared/types';
import { computeAiAction } from '@gemduel/shared/logic/ai/aiPlayer';

export const useAIController = (
    gameState: GameState,
    recordAction: (action: GameAction) => void,
    isViewingHistory: boolean = false
) => {
    useEffect(() => {
        if (
            !isViewingHistory &&
            gameState &&
            gameState.mode === 'PVE' &&
            gameState.turn === 'p2' &&
            !gameState.winner
        ) {
            const timer = setTimeout(() => {
                const aiAction = computeAiAction(gameState);
                if (aiAction) recordAction(aiAction);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState, recordAction, isViewingHistory]);
};
