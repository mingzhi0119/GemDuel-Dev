import { useCallback, useMemo } from 'react';
import { buildDebugAction } from '../logic/interactionCommands';
import type { GameAction, GameState, PlayerKey } from '../types';

interface DebugInteractionParams {
    gameState: GameState;
    canLocalInteract: boolean;
    networkDispatch: (action: GameAction) => void;
}

export const useDebugInteractionHandlers = ({
    gameState,
    canLocalInteract,
    networkDispatch,
}: DebugInteractionParams) => {
    const handleDebugAddCrowns = useCallback(
        (playerId: PlayerKey) => {
            if (!gameState.winner) {
                networkDispatch(buildDebugAction('DEBUG_ADD_CROWNS', playerId));
            }
        },
        [gameState.winner, networkDispatch]
    );

    const handleDebugAddPoints = useCallback(
        (playerId: PlayerKey) => {
            if (!gameState.winner) {
                networkDispatch(buildDebugAction('DEBUG_ADD_POINTS', playerId));
            }
        },
        [gameState.winner, networkDispatch]
    );

    const handleDebugAddPrivilege = useCallback(
        (playerId: PlayerKey) => {
            if (!gameState.winner) {
                networkDispatch(buildDebugAction('DEBUG_ADD_PRIVILEGE', playerId));
            }
        },
        [gameState.winner, networkDispatch]
    );

    const handleForceRoyal = useCallback(() => {
        if (!gameState.winner) {
            networkDispatch(buildDebugAction('FORCE_ROYAL_SELECTION'));
        }
    }, [gameState.winner, networkDispatch]);

    const handleRerollBuffs = useCallback(
        (level?: number) => {
            if (canLocalInteract) {
                networkDispatch({
                    type: 'DEBUG_REROLL_BUFFS',
                    payload: { level },
                });
            }
        },
        [canLocalInteract, networkDispatch]
    );

    return useMemo(
        () => ({
            handleDebugAddCrowns,
            handleDebugAddPoints,
            handleDebugAddPrivilege,
            handleForceRoyal,
            handleRerollBuffs,
        }),
        [
            handleDebugAddCrowns,
            handleDebugAddPoints,
            handleDebugAddPrivilege,
            handleForceRoyal,
            handleRerollBuffs,
        ]
    );
};
