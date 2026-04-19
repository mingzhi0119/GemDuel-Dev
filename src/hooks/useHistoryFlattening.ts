import { useEffect } from 'react';
import type { GameAction, GameState } from '../types';
import { shouldFlattenHistory } from '../logic/historyFlattening';

interface HistoryFlatteningControls {
    history: GameAction[];
    historyLength: number;
    clearAndInit: (action: GameAction) => void;
}

export const useHistoryFlattening = (
    gameState: GameState,
    historyControls: HistoryFlatteningControls
) => {
    useEffect(() => {
        if (
            shouldFlattenHistory(
                gameState.phase,
                historyControls.historyLength,
                historyControls.history
            )
        ) {
            const flattenedAction: GameAction = {
                type: 'FLATTEN',
                payload: JSON.parse(JSON.stringify(gameState)),
            };
            historyControls.clearAndInit(flattenedAction);
        }
    }, [
        gameState,
        gameState.phase,
        historyControls,
        historyControls.clearAndInit,
        historyControls.history,
        historyControls.historyLength,
    ]);
};
