import { useMemo } from 'react';
import { GameState, GemCoord, GameAction } from '@gemduel/shared/types';
import { applyAction } from '@gemduel/shared/logic/gameReducer';
import { buildReplayFullSync, buildReplayRecorderFromHistory } from '@gemduel/shared/replay';
import { useAIController } from './useAIController';
import { useGameState } from './useGameState';
import { useGameNetwork } from './useGameNetwork';
import { useGameInteractions } from './useGameInteractions';
import { useHistoryFlattening } from './useHistoryFlattening';
import { usePlayableHistoryControls } from './usePlayableHistoryControls';
import { useTurnHandoffInteractionLock } from './useTurnHandoffInteractionLock';

export const useGameLogic = (
    shouldConnect: boolean = false,
    targetIP: string = 'localhost',
    isReviewing: boolean = false,
    targetPort: number = 9000,
    appVersion: string = 'dev'
) => {
    // 1. Core State Management
    const { gameState, dispatch, historyControls } = useGameState();
    const localReplayRecorder = useMemo(
        () => buildReplayRecorderFromHistory(historyControls.history, appVersion),
        [appVersion, historyControls.history]
    );
    const localReplayExportState = useMemo(() => {
        if (
            historyControls.history.length === 0 ||
            historyControls.currentIndex === historyControls.history.length - 1
        ) {
            return gameState;
        }

        const firstAction = historyControls.history[0];
        if (!firstAction || !('payload' in firstAction)) {
            return gameState;
        }

        try {
            let terminalState: GameState | null = null;
            for (const action of historyControls.history) {
                const nextState = applyAction(terminalState, action);
                if (!nextState) {
                    return gameState;
                }
                terminalState = nextState;
            }

            return terminalState ?? gameState;
        } catch {
            return gameState;
        }
    }, [gameState, historyControls.currentIndex, historyControls.history]);

    // 2. Network & Authority Layer
    const { online, networkDispatch } = useGameNetwork(
        gameState,
        dispatch,
        historyControls.clearAndInit,
        shouldConnect,
        targetIP,
        targetPort,
        localReplayRecorder
    );

    const isViewingHistory =
        historyControls.historyLength > 0 &&
        historyControls.currentIndex !== historyControls.historyLength - 1;
    const isTurnHandoffInteractionLocked = useTurnHandoffInteractionLock(
        gameState,
        isReviewing,
        isViewingHistory
    );
    const isInteractionLocked = isViewingHistory || isTurnHandoffInteractionLocked;

    // 3. User Interaction Handlers
    const interactions = useGameInteractions(
        gameState,
        networkDispatch,
        historyControls.currentIndex,
        isReviewing,
        isInteractionLocked
    );

    // 4. AI Controller
    useAIController(gameState, networkDispatch, isViewingHistory, isInteractionLocked);

    // 5. History Flattening
    useHistoryFlattening(gameState, historyControls, historyControls.historySource === 'live');
    const playableHistoryControls = usePlayableHistoryControls(
        gameState.mode,
        historyControls,
        isReviewing
    );
    const currentReplay = useMemo(() => {
        const recorder =
            gameState.mode === 'ONLINE_MULTIPLAYER' && !gameState.isHost
                ? (online.authoritativeReplayRecorder ?? null)
                : localReplayRecorder;
        const replayState = recorder === localReplayRecorder ? localReplayExportState : gameState;
        return recorder?.init ? buildReplayFullSync(recorder, replayState).replay : null;
    }, [
        gameState,
        localReplayExportState,
        localReplayRecorder,
        online.authoritativeReplayRecorder,
    ]);

    const result = useMemo(
        () => ({
            state: {
                ...gameState,
                selectedGems: interactions.selectedGems,
                reserveGoldSelection: interactions.reserveGoldSelection ?? null,
                errorMsg: interactions.errorMsg ?? online.statusNotice?.message ?? null,
            } as Readonly<
                GameState & {
                    selectedGems: GemCoord[];
                    reserveGoldSelection: GemCoord | null;
                    errorMsg: string | null;
                }
            >,

            handlers: {
                ...interactions.handlers,
                importHistory: historyControls.importHistory,
            },

            getters: interactions.getters,

            historyControls: playableHistoryControls,

            online,

            replay: {
                currentReplay,
            },
        }),
        [
            currentReplay,
            gameState,
            historyControls.importHistory,
            interactions,
            online,
            playableHistoryControls,
        ]
    );

    return result;
};
