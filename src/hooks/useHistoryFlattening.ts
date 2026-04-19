import { useEffect } from 'react';
import type { GameAction, GameState } from '../types';

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
            gameState.phase === 'IDLE' &&
            historyControls.historyLength > 1 &&
            historyControls.history.some(
                (action) => action.type === 'SELECT_BUFF' || action.type === 'INIT_DRAFT'
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
