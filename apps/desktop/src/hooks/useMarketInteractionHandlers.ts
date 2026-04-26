import { useCallback, useMemo } from 'react';
import { getRandomBasicGemColor } from '@gemduel/shared/logic/gameSetup';
import { canActionRunInPhase, isBonusColorSelectionPhase } from '@gemduel/shared/logic/fsm';
import {
    buildBuyAction,
    buildReserveCardFlow,
    buildReserveDeckFlow,
    buildSelectBonusColorAction,
} from '@gemduel/shared/logic/interactionCommands';
import type {
    Card,
    CardInteractionContext,
    GameAction,
    GameState,
    GemColor,
    GemCoord,
    InitiateBuyJokerPayload,
} from '@gemduel/shared/types';

interface MarketInteractionParams {
    gameState: GameState;
    canLocalInteract: boolean;
    networkDispatch: (action: GameAction) => void;
    setErrorMsg: (value: string | null) => void;
    canAfford: (card: Card, isReserved?: boolean) => boolean;
    preselectedReserveGold: GemCoord | null;
    clearPreselectedReserveGold: () => void;
}

export const useMarketInteractionHandlers = ({
    gameState,
    canLocalInteract,
    networkDispatch,
    setErrorMsg,
    canAfford,
    preselectedReserveGold,
    clearPreselectedReserveGold,
}: MarketInteractionParams) => {
    const handleReserveCard = useCallback(
        (card: Card, marketInfo: CardInteractionContext) => {
            if (!canLocalInteract || gameState.playerReserved[gameState.turn].length >= 3) return;

            if (preselectedReserveGold) {
                networkDispatch({
                    type: 'RESERVE_CARD',
                    payload: { card, ...marketInfo, goldCoords: preselectedReserveGold },
                });
                clearPreselectedReserveGold();
                setErrorMsg(null);
                return;
            }

            const reserveFlow = buildReserveCardFlow(
                card,
                marketInfo,
                gameState.board.flat().some((cell) => cell.type.id === 'gold')
            );
            networkDispatch(reserveFlow.action);
            if (reserveFlow.prompt) setErrorMsg(reserveFlow.prompt);
        },
        [
            canLocalInteract,
            clearPreselectedReserveGold,
            gameState.board,
            gameState.playerReserved,
            gameState.turn,
            networkDispatch,
            preselectedReserveGold,
            setErrorMsg,
        ]
    );

    const handleReserveDeck = useCallback(
        (level: number) => {
            if (!canLocalInteract || gameState.playerReserved[gameState.turn].length >= 3) return;
            if (gameState.decks[level as 1 | 2 | 3].length === 0) {
                return setErrorMsg('Deck empty!');
            }

            if (preselectedReserveGold) {
                networkDispatch({
                    type: 'RESERVE_DECK',
                    payload: { level: level as 1 | 2 | 3, goldCoords: preselectedReserveGold },
                });
                clearPreselectedReserveGold();
                setErrorMsg(null);
                return;
            }

            const reserveFlow = buildReserveDeckFlow(
                level as 1 | 2 | 3,
                gameState.board.flat().some((cell) => cell.type.id === 'gold')
            );
            networkDispatch(reserveFlow.action);
            if (reserveFlow.prompt) setErrorMsg(reserveFlow.prompt);
        },
        [
            canLocalInteract,
            clearPreselectedReserveGold,
            gameState.board,
            gameState.decks,
            gameState.playerReserved,
            gameState.turn,
            networkDispatch,
            preselectedReserveGold,
            setErrorMsg,
        ]
    );

    const initiateBuy = useCallback(
        (
            card: Card,
            source: InitiateBuyJokerPayload['source'] = 'market',
            marketInfo?: InitiateBuyJokerPayload['marketInfo']
        ) => {
            if (!canLocalInteract) return;
            if (preselectedReserveGold && source === 'market' && marketInfo) {
                networkDispatch({
                    type: 'RESERVE_CARD',
                    payload: { card, ...marketInfo, goldCoords: preselectedReserveGold },
                });
                clearPreselectedReserveGold();
                setErrorMsg(null);
                return;
            }

            if (!canAfford(card, source === 'reserved')) {
                return setErrorMsg('Cannot afford!');
            }

            networkDispatch(buildBuyAction(card, source, marketInfo, getRandomBasicGemColor()));
        },
        [
            canAfford,
            canLocalInteract,
            clearPreselectedReserveGold,
            networkDispatch,
            preselectedReserveGold,
            setErrorMsg,
        ]
    );

    const handleSelectBonusColor = useCallback(
        (color: string) => {
            if (
                !canLocalInteract ||
                !isBonusColorSelectionPhase(gameState.phase) ||
                !gameState.pendingBuy
            ) {
                return;
            }

            networkDispatch(
                buildSelectBonusColorAction(
                    gameState.pendingBuy,
                    color as GemColor,
                    getRandomBasicGemColor()
                )
            );
        },
        [canLocalInteract, gameState.pendingBuy, gameState.phase, networkDispatch]
    );

    const handleCancelReserve = useCallback(() => {
        if (canLocalInteract && canActionRunInPhase('CANCEL_RESERVE', gameState.phase)) {
            networkDispatch({ type: 'CANCEL_RESERVE' });
        }
    }, [canLocalInteract, gameState.phase, networkDispatch]);

    const handleCancelPrivilege = useCallback(() => {
        if (canLocalInteract && canActionRunInPhase('CANCEL_PRIVILEGE', gameState.phase)) {
            networkDispatch({ type: 'CANCEL_PRIVILEGE' });
        }
    }, [canLocalInteract, gameState.phase, networkDispatch]);

    const checkAndInitiateBuyReserved = useCallback(
        (card: Card, execute: boolean = false) => {
            if (!canLocalInteract) return false;
            const affordable = canAfford(card, true);
            if (execute && affordable) {
                initiateBuy(card, 'reserved');
            }
            return affordable;
        },
        [canAfford, canLocalInteract, initiateBuy]
    );

    const handleDiscardReserved = useCallback(
        (cardId: string) => {
            if (canLocalInteract) {
                networkDispatch({ type: 'DISCARD_RESERVED', payload: { cardId } });
            }
        },
        [canLocalInteract, networkDispatch]
    );

    return useMemo(
        () => ({
            handleReserveCard,
            handleReserveDeck,
            handleDiscardReserved,
            initiateBuy,
            handleSelectBonusColor,
            handleCancelReserve,
            handleCancelPrivilege,
            checkAndInitiateBuyReserved,
        }),
        [
            checkAndInitiateBuyReserved,
            handleCancelPrivilege,
            handleCancelReserve,
            handleDiscardReserved,
            handleReserveCard,
            handleReserveDeck,
            handleSelectBonusColor,
            initiateBuy,
        ]
    );
};
