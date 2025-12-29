import { useMemo, useCallback } from 'react';
import { useActionHistory } from './useActionHistory';
import { applyAction } from '../logic/gameReducer';
import { INITIAL_STATE_SKELETON } from '../logic/initialState';
import { GameState, GameAction } from '../types';

export const useGameState = () => {
    // 1. Core State & History
    const {
        history,
        currentIndex,
        recordAction: recordLocalAction,
        undo,
        redo,
        canUndo,
        canRedo,
        importHistory,
        clearAndInit,
    } = useActionHistory();

    // 2. Derive GameState from History
    const gameState = useMemo(() => {
        if (history.length === 0) return INITIAL_STATE_SKELETON;
        let state: GameState | null = null;
        const limit = Math.min(currentIndex, history.length - 1);

        for (let i = 0; i <= limit; i++) {
            if (history[i]) state = applyAction(state, history[i]);
        }
        return state || INITIAL_STATE_SKELETON;
    }, [currentIndex, history]);

    const dispatch = useCallback(
        (action: GameAction) => {
            recordLocalAction(action);
        },
        [recordLocalAction]
    );

    return {
        gameState,
        dispatch,
        historyControls: {
            undo,
            redo,
            canUndo,
            canRedo,
            importHistory,
            clearAndInit,
            currentIndex,
            historyLength: history.length,
            history,
        },
    };
};
