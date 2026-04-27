import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateTransaction } from '@gemduel/shared/utils';
import { getPlayerScore, getCrownCount } from '@gemduel/shared/logic/selectors';
import { canPlayerInteract } from '@gemduel/shared/logic/interactionAccess';
import { useInteractionFeedback } from './useInteractionFeedback';
import { useBoardInteractionHandlers } from './useBoardInteractionHandlers';
import { useMarketInteractionHandlers } from './useMarketInteractionHandlers';
import { useMetaInteractionHandlers } from './useMetaInteractionHandlers';
import { useDebugInteractionHandlers } from './useDebugInteractionHandlers';
import type {
    Card,
    GameAction,
    GameMode,
    GameState,
    GemCoord,
    PlayerKey,
} from '@gemduel/shared/types';

export const useGameInteractions = (
    gameState: GameState,
    networkDispatch: (action: GameAction) => void,
    currentIndex: number,
    isReviewing: boolean = false,
    isInteractionLocked: boolean = false
) => {
    const { selectedGems, setSelectedGems, clearSelectedGems, errorMsg, setErrorMsg } =
        useInteractionFeedback(currentIndex);
    const [preselectedReserveGold, setPreselectedReserveGold] = useState<GemCoord | null>(null);

    useEffect(() => {
        setPreselectedReserveGold(null);
    }, [currentIndex, gameState.phase, gameState.turn]);

    const clearPreselectedReserveGold = useCallback(() => {
        setPreselectedReserveGold(null);
    }, []);

    const baseCanLocalInteract = useMemo(
        () => canPlayerInteract(gameState, isReviewing),
        [gameState, isReviewing]
    );
    const canLocalInteract = baseCanLocalInteract && !isInteractionLocked;

    const isSelected = useCallback(
        (r: number, c: number) =>
            selectedGems.some((selection) => selection.r === r && selection.c === c),
        [selectedGems]
    );

    const canAfford = useCallback(
        (card: Card, isReserved: boolean = false) => {
            const player = gameState.turn;
            const { affordable } = calculateTransaction(
                card,
                gameState.inventories[player],
                gameState.playerTableau[player],
                gameState.playerBuffs[player],
                isReserved
            );
            return affordable;
        },
        [gameState]
    );

    const boardHandlers = useBoardInteractionHandlers({
        gameState,
        canLocalInteract,
        networkDispatch,
        selectedGems,
        setSelectedGems,
        clearSelectedGems,
        preselectedReserveGold,
        setPreselectedReserveGold,
        setErrorMsg,
    });

    const marketHandlers = useMarketInteractionHandlers({
        gameState,
        canLocalInteract,
        networkDispatch,
        setErrorMsg,
        canAfford,
        preselectedReserveGold,
        clearPreselectedReserveGold,
    });

    const metaHandlers = useMetaInteractionHandlers({
        gameState,
        canLocalInteract,
        networkDispatch,
    });

    const debugHandlers = useDebugInteractionHandlers({
        gameState,
        canLocalInteract,
        networkDispatch,
    });

    const boundGetPlayerScore = useCallback(
        (playerId: PlayerKey) => getPlayerScore(gameState, playerId),
        [gameState]
    );

    const boundGetCrownCount = useCallback(
        (playerId: PlayerKey) => getCrownCount(gameState, playerId),
        [gameState]
    );

    const handlers = useMemo(
        () => ({
            ...metaHandlers,
            ...boardHandlers,
            ...marketHandlers,
            ...debugHandlers,
        }),
        [boardHandlers, debugHandlers, marketHandlers, metaHandlers]
    );

    const getters = useMemo(
        () => ({
            getPlayerScore: boundGetPlayerScore,
            isSelected,
            getCrownCount: boundGetCrownCount,
            canAfford,
            isMyTurn: canLocalInteract,
        }),
        [boundGetCrownCount, boundGetPlayerScore, canAfford, canLocalInteract, isSelected]
    );

    return useMemo(
        () => ({
            selectedGems,
            reserveGoldSelection: preselectedReserveGold,
            errorMsg,
            isMyTurn: canLocalInteract,
            handlers,
            getters,
        }),
        [canLocalInteract, errorMsg, getters, handlers, preselectedReserveGold, selectedGems]
    );
};
