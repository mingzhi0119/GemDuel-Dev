import { useCallback, useMemo } from 'react';
import { canActionRunInPhase } from '@gemduel/shared/logic/fsm';
import {
    buildGameStartAction,
    buildPeekDeckAction,
    buildRerollDraftPoolAction,
    buildSelectBuffAction,
    buildSelectRoyalAction,
} from '@gemduel/shared/logic/interactionCommands';
import { getRandomBasicGemColor } from '@gemduel/shared/logic/gameSetup';
import type { GameAction, GameMode, GameState, PlayerKey, RoyalCard } from '@gemduel/shared/types';

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
            options: { useBuffs: boolean; isHost?: boolean; hostPlayer?: PlayerKey } = {
                useBuffs: false,
            }
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

    const handleRerollBuffs = useCallback(
        (level?: number) => {
            if (
                !canLocalInteract ||
                gameState.mode === 'ONLINE_MULTIPLAYER' ||
                (gameState.mode === 'PVE' && gameState.turn !== gameState.localPlayer) ||
                !canActionRunInPhase('REROLL_DRAFT_POOL', gameState.phase)
            ) {
                return;
            }

            networkDispatch(
                buildRerollDraftPoolAction(level === undefined ? undefined : (level as 1 | 2 | 3))
            );
        },
        [
            canLocalInteract,
            gameState.localPlayer,
            gameState.mode,
            gameState.phase,
            gameState.turn,
            networkDispatch,
        ]
    );

    const handlePeekDeck = useCallback(
        (level: number | 'all' = 'all') => {
            if (canLocalInteract && canActionRunInPhase('PEEK_DECK', gameState.phase)) {
                networkDispatch(
                    buildPeekDeckAction(level === 'all' ? 'all' : (level as 1 | 2 | 3))
                );
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
            handleRerollBuffs,
            handlePeekDeck,
        }),
        [
            handleCloseModal,
            handlePeekDeck,
            handleRerollBuffs,
            handleSelectBuff,
            handleSelectRoyal,
            startGame,
        ]
    );
};
