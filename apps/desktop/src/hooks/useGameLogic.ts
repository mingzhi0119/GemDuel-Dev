import { useMemo } from 'react';
import { GameState, GemCoord, GameAction } from '@gemduel/shared/types';
import { useAIController } from './useAIController';
import { useGameState } from './useGameState';
import { useGameNetwork } from './useGameNetwork';
import { useGameInteractions } from './useGameInteractions';
import { useHistoryFlattening } from './useHistoryFlattening';
import { usePlayableHistoryControls } from './usePlayableHistoryControls';

export const useGameLogic = (
    shouldConnect: boolean = false,
    targetIP: string = 'localhost',
    isReviewing: boolean = false
) => {
    // 1. Core State Management
    const { gameState, dispatch, historyControls } = useGameState();

    // 2. Network & Authority Layer
    const { online, networkDispatch } = useGameNetwork(
        gameState,
        dispatch,
        historyControls.clearAndInit,
        shouldConnect,
        targetIP
    );

    // 3. User Interaction Handlers
    const interactions = useGameInteractions(
        gameState,
        networkDispatch,
        historyControls.currentIndex,
        isReviewing
    );

    const isViewingHistory =
        historyControls.historyLength > 0 &&
        historyControls.currentIndex < historyControls.historyLength - 1;

    // 4. AI Controller
    useAIController(gameState, networkDispatch, isViewingHistory);

    // 5. History Flattening
    useHistoryFlattening(gameState, historyControls);
    const playableHistoryControls = usePlayableHistoryControls(gameState.mode, historyControls);

    const result = useMemo(
        () => ({
            state: {
                ...gameState,
                selectedGems: interactions.selectedGems,
                errorMsg: interactions.errorMsg ?? online.statusNotice?.message ?? null,
            } as Readonly<GameState & { selectedGems: GemCoord[]; errorMsg: string | null }>,

            handlers: {
                ...interactions.handlers,
                importHistory: historyControls.importHistory,
            },

            getters: interactions.getters,

            historyControls: playableHistoryControls,

            online,
        }),
        [gameState, historyControls.importHistory, interactions, online, playableHistoryControls]
    );

    return result;
};
