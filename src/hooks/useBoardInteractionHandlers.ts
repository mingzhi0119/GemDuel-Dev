import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { processGemClick, processOpponentGemClick } from '../logic/interactionManager';
import { buildReplenishAction } from '../logic/interactionCommands';
import { canActionRunInPhase, getFsmPhaseSurfacePolicy } from '../logic/fsm';
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
    const surfacePolicy = getFsmPhaseSurfacePolicy(gameState.phase);

    const handleSelfGemClick = useCallback(
        (gemId: string) => {
            if (!canLocalInteract || surfacePolicy.selfGemRailMode !== 'discard-self') return;
            networkDispatch({ type: 'DISCARD_GEM', payload: gemId });
        },
        [canLocalInteract, networkDispatch, surfacePolicy.selfGemRailMode]
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

    const handleGemDragSelection = useCallback(
        (coords: GemCoord[]) => {
            if (
                !canLocalInteract ||
                gameState.winner ||
                surfacePolicy.boardInteractionMode !== 'selection'
            ) {
                return;
            }
            if (coords.length === 0 || coords.length > 3) return;

            const check = validateGemSelection(coords);
            if (!check.valid || check.hasGap) return;

            const buff = gameState.playerBuffs?.[gameState.turn];
            if (buff?.effects?.passive?.noTake3 && coords.length === 3) {
                return setErrorMsg('Cannot take 3 gems!');
            }

            setErrorMsg(null);
            setSelectedGems(coords);
        },
        [
            canLocalInteract,
            gameState.phase,
            gameState.playerBuffs,
            gameState.turn,
            gameState.winner,
            setErrorMsg,
            setSelectedGems,
            surfacePolicy.boardInteractionMode,
        ]
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
        if (
            !canLocalInteract ||
            selectedGems.length === 0 ||
            !canActionRunInPhase('TAKE_GEMS', gameState.phase)
        ) {
            return;
        }
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
        const stealable = (Object.keys(gameState.inventories[opponent]) as GemColor[]).filter(
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
        if (!canLocalInteract || !canActionRunInPhase('ACTIVATE_PRIVILEGE', gameState.phase))
            return;

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
            handleGemDragSelection,
            handleOpponentGemClick,
            handleConfirmTake,
            handleReplenish,
            activatePrivilegeMode,
        }),
        [
            activatePrivilegeMode,
            handleConfirmTake,
            handleGemClick,
            handleGemDragSelection,
            handleOpponentGemClick,
            handleReplenish,
            handleSelfGemClick,
        ]
    );
};
