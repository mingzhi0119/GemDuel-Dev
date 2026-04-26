import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { processGemClick, processOpponentGemClick } from '@gemduel/shared/logic/interactionManager';
import { buildReplenishAction } from '@gemduel/shared/logic/interactionCommands';
import { canActionRunInPhase, getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import { validateGemSelection } from '@gemduel/shared/logic/validators';
import { getRandomBasicGemColor } from '@gemduel/shared/logic/gameSetup';
import type { GameAction, GameState, GemColor, GemCoord } from '@gemduel/shared/types';

type GemDragSelectionIntent = 'select' | 'deselect';

interface BoardInteractionParams {
    gameState: GameState;
    canLocalInteract: boolean;
    networkDispatch: (action: GameAction) => void;
    selectedGems: GemCoord[];
    setSelectedGems: Dispatch<SetStateAction<GemCoord[]>>;
    clearSelectedGems: () => void;
    preselectedReserveGold: GemCoord | null;
    setPreselectedReserveGold: Dispatch<SetStateAction<GemCoord | null>>;
    setErrorMsg: (value: string | null) => void;
}

export const useBoardInteractionHandlers = ({
    gameState,
    canLocalInteract,
    networkDispatch,
    selectedGems,
    setSelectedGems,
    clearSelectedGems,
    preselectedReserveGold,
    setPreselectedReserveGold,
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
            const clickedGem = gameState.board[r]?.[c];
            if (
                surfacePolicy.boardInteractionMode === 'selection' &&
                clickedGem?.type?.id === 'gold'
            ) {
                const nextCoord = { r, c };
                const isSameGold =
                    preselectedReserveGold?.r === r && preselectedReserveGold?.c === c;
                setPreselectedReserveGold(isSameGold ? null : nextCoord);
                clearSelectedGems();
                setErrorMsg(isSameGold ? null : 'Select a card or deck to reserve.');
                return;
            }

            const result = processGemClick(gameState, r, c, selectedGems);
            if (result.error) return setErrorMsg(result.error);
            if (result.action) return networkDispatch(result.action);
            if (result.newSelection) {
                setPreselectedReserveGold(null);
                setSelectedGems(result.newSelection);
            }
        },
        [
            canLocalInteract,
            clearSelectedGems,
            gameState,
            networkDispatch,
            preselectedReserveGold,
            selectedGems,
            setErrorMsg,
            setPreselectedReserveGold,
            setSelectedGems,
            surfacePolicy.boardInteractionMode,
        ]
    );

    const handleGemDragSelection = useCallback(
        (coords: GemCoord[], intent: GemDragSelectionIntent = 'select') => {
            if (
                !canLocalInteract ||
                gameState.winner ||
                surfacePolicy.boardInteractionMode !== 'selection'
            ) {
                return;
            }
            if (coords.length === 0 || coords.length > 3) return;

            if (intent === 'deselect') {
                const coordsToRemove = new Set(coords.map((coord) => `${coord.r}:${coord.c}`));
                const nextSelection = selectedGems.filter(
                    (selection) => !coordsToRemove.has(`${selection.r}:${selection.c}`)
                );

                if (nextSelection.length === selectedGems.length) return;

                setErrorMsg(null);
                setPreselectedReserveGold(null);
                setSelectedGems(nextSelection);
                return;
            }

            const check = validateGemSelection(coords);
            if (!check.valid || check.hasGap) return;

            const buff = gameState.playerBuffs?.[gameState.turn];
            if (buff?.effects?.passive?.noTake3 && coords.length === 3) {
                return setErrorMsg('Cannot take 3 gems!');
            }

            setErrorMsg(null);
            setPreselectedReserveGold(null);
            setSelectedGems(coords);
        },
        [
            canLocalInteract,
            gameState.playerBuffs,
            gameState.turn,
            gameState.winner,
            selectedGems,
            setErrorMsg,
            setPreselectedReserveGold,
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
        setPreselectedReserveGold(null);
        clearSelectedGems();
    }, [
        canLocalInteract,
        clearSelectedGems,
        gameState.playerBuffs,
        gameState.phase,
        gameState.turn,
        networkDispatch,
        selectedGems,
        setErrorMsg,
        setPreselectedReserveGold,
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
        setPreselectedReserveGold(null);
    }, [
        canLocalInteract,
        gameState.bag.length,
        gameState.inventories,
        gameState.turn,
        networkDispatch,
        setPreselectedReserveGold,
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
        setPreselectedReserveGold(null);
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
        setPreselectedReserveGold,
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
