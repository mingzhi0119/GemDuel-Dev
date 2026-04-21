import { useCallback, useMemo } from 'react';
import { canActionRunInPhase } from '@gemduel/shared/logic/fsm';
import {
    buildGameStartAction,
    buildPeekDeckAction,
    buildSelectBuffAction,
    buildSelectRoyalAction,
} from '@gemduel/shared/logic/interactionCommands';
import { getRandomBasicGemColor } from '@gemduel/shared/logic/gameSetup';
import type { GameAction, GameMode, GameState, RoyalCard } from '@gemduel/shared/types';

interface MetaInteractionParams {
    gameState: GameState;
    canLocalInteract: boolean;
    networkDispatch: (action: GameAction) => void;
}

export const useMetaInteractionHandlers = ({
    gameState,
    canLocalInteract,
    networkDispatch,
}: MetaInteractionParams) => {
    const startGame = useCallback(
        (
            mode: GameMode,
            options: { useBuffs: boolean; isHost?: boolean } = { useBuffs: false }
        ) => {
            networkDispatch(buildGameStartAction(mode, options));
        },
        [networkDispatch]
    );

    const handleSelectRoyal = useCallback(
        (royalCard: RoyalCard) => {
            if (!canLocalInteract || !canActionRunInPhase('SELECT_ROYAL_CARD', gameState.phase))
                return;
            networkDispatch(buildSelectRoyalAction(royalCard));
        },
        [canLocalInteract, gameState.phase, networkDispatch]
    );

    const handleSelectBuff = useCallback(
        (buffId: string) => {
            if (!canLocalInteract || !canActionRunInPhase('SELECT_BUFF', gameState.phase)) return;
            networkDispatch(
                buildSelectBuffAction(
                    buffId,
                    getRandomBasicGemColor(),
                    gameState.turn,
                    gameState.phase,
                    gameState.buffLevel
                )
            );
        },
        [canLocalInteract, gameState.buffLevel, gameState.phase, gameState.turn, networkDispatch]
    );

    const handleCloseModal = useCallback(() => {
        networkDispatch({ type: 'CLOSE_MODAL' });
    }, [networkDispatch]);

    const handlePeekDeck = useCallback(
        (level: number) => {
            if (canLocalInteract && canActionRunInPhase('PEEK_DECK', gameState.phase)) {
                networkDispatch(buildPeekDeckAction(level as 1 | 2 | 3));
            }
        },
        [canLocalInteract, gameState.phase, networkDispatch]
    );

    return useMemo(
        () => ({
            startGame,
            handleSelectRoyal,
            handleSelectBuff,
            handleCloseModal,
            handlePeekDeck,
        }),
        [handleCloseModal, handlePeekDeck, handleSelectBuff, handleSelectRoyal, startGame]
    );
};
