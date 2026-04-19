import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { processGemClick, processOpponentGemClick } from '../logic/interactionManager';
import { buildReplenishAction } from '../logic/interactionCommands';
import { validateGemSelection } from '../logic/validators';
import { getRandomBasicGemColor } from '../logic/gameSetup';
import type { GameAction, GameState, GemColor, GemCoord } from '../types';

interface BoardInteractionParams {
    gameState: GameState;
    canLocalInteract: boolean;
    networkDispatch: (action: GameAction) => void;
    selectedGems: GemCoord[];
    setSelectedGems: Dispatch<SetStateAction<GemCoord[]>>;
    clearSelectedGems: () => void;
    setErrorMsg: (value: string | null) => void;
}

export const useBoardInteractionHandlers = ({
    gameState,
    canLocalInteract,
    networkDispatch,
    selectedGems,
    setSelectedGems,
    clearSelectedGems,
    setErrorMsg,
}: BoardInteractionParams) => {
    const handleSelfGemClick = useCallback(
        (gemId: string) => {
            if (!canLocalInteract || gameState.phase !== 'DISCARD_EXCESS_GEMS') return;
            networkDispatch({ type: 'DISCARD_GEM', payload: gemId });
        },
        [canLocalInteract, gameState.phase, networkDispatch]
    );

    const handleGemClick = useCallback(
        (r: number, c: number) => {
            if (!canLocalInteract || gameState.winner) return;
            const result = processGemClick(gameState, r, c, selectedGems);
            if (result.error) return setErrorMsg(result.error);
            if (result.action) return networkDispatch(result.action);
            if (result.newSelection) setSelectedGems(result.newSelection);
        },
        [canLocalInteract, gameState, networkDispatch, selectedGems, setErrorMsg, setSelectedGems]
    );

    const handleOpponentGemClick = useCallback(
        (gemId: string) => {
            if (!canLocalInteract) return;
            const result = processOpponentGemClick(gameState, gemId as GemColor);
            if (result.error) return setErrorMsg(result.error);
            if (result.action) networkDispatch(result.action);
        },
        [canLocalInteract, gameState, networkDispatch, setErrorMsg]
    );

    const handleConfirmTake = useCallback(() => {
        if (!canLocalInteract || selectedGems.length === 0) return;
        const check = validateGemSelection(selectedGems);
        if (!check.valid) return setErrorMsg(check.error || 'Invalid!');
        if (check.hasGap) return setErrorMsg('Gap detected!');

        const buff = gameState.playerBuffs?.[gameState.turn];
        if (buff?.effects?.passive?.noTake3 && selectedGems.length === 3) {
            return setErrorMsg('Cannot take 3 gems!');
        }

        networkDispatch({ type: 'TAKE_GEMS', payload: { coords: selectedGems } });
        clearSelectedGems();
    }, [
        canLocalInteract,
        clearSelectedGems,
        gameState.playerBuffs,
        gameState.turn,
        networkDispatch,
        selectedGems,
        setErrorMsg,
    ]);

    const handleReplenish = useCallback(() => {
        if (!canLocalInteract || gameState.bag.length === 0) return;
        const opponent = gameState.turn === 'p1' ? 'p2' : 'p1';
        const stealable = Object.keys(gameState.inventories[opponent]).filter(
            (key) => key !== 'gold' && key !== 'pearl' && gameState.inventories[opponent][key] > 0
        );
        const extortionColor =
            stealable.length > 0
                ? (stealable[Math.floor(Math.random() * stealable.length)] as GemColor)
                : undefined;

        networkDispatch(buildReplenishAction(getRandomBasicGemColor(), extortionColor));
    }, [
        canLocalInteract,
        gameState.bag.length,
        gameState.inventories,
        gameState.turn,
        networkDispatch,
    ]);

    const activatePrivilegeMode = useCallback(() => {
        if (!canLocalInteract || gameState.phase !== 'IDLE') return;

        const hasPrivilege =
            gameState.privileges[gameState.turn] > 0 ||
            (gameState.extraPrivileges && gameState.extraPrivileges[gameState.turn] > 0);

        if (!hasPrivilege) return;
        if (
            !gameState.board.flat().some((gem) => gem.type.id !== 'empty' && gem.type.id !== 'gold')
        ) {
            return setErrorMsg('No gems.');
        }

        networkDispatch({ type: 'ACTIVATE_PRIVILEGE' });
        clearSelectedGems();
    }, [
        canLocalInteract,
        clearSelectedGems,
        gameState.board,
        gameState.extraPrivileges,
        gameState.phase,
        gameState.privileges,
        gameState.turn,
        networkDispatch,
        setErrorMsg,
    ]);

    return useMemo(
        () => ({
            handleSelfGemClick,
            handleGemClick,
            handleOpponentGemClick,
            handleConfirmTake,
            handleReplenish,
            activatePrivilegeMode,
        }),
        [
            activatePrivilegeMode,
            handleConfirmTake,
            handleGemClick,
            handleOpponentGemClick,
            handleReplenish,
            handleSelfGemClick,
        ]
    );
};
