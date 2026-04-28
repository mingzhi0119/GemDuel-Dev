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
            if (!canLocalInteract || gameState.playerReserved[gameState.turn].length >= 3) {
                return false;
            }

            if (preselectedReserveGold) {
                if (!canActionRunInPhase('RESERVE_CARD', gameState.phase)) {
                    return false;
                }

                networkDispatch({
                    type: 'RESERVE_CARD',
                    payload: { card, ...marketInfo, goldCoords: preselectedReserveGold },
                });
                clearPreselectedReserveGold();
                setErrorMsg(null);
                return true;
            }

            const reserveFlow = buildReserveCardFlow(
                card,
                marketInfo,
                gameState.board.flat().some((cell) => cell.type.id === 'gold')
            );
            if (!canActionRunInPhase(reserveFlow.action.type, gameState.phase)) {
                return false;
            }

            networkDispatch(reserveFlow.action);
            if (reserveFlow.prompt) setErrorMsg(reserveFlow.prompt);
            return true;
        },
        [
            canLocalInteract,
            clearPreselectedReserveGold,
            gameState.board,
            gameState.phase,
            gameState.playerReserved,
            gameState.turn,
            networkDispatch,
            preselectedReserveGold,
            setErrorMsg,
        ]
    );

    const handleReserveDeck = useCallback(
        (level: number) => {
            if (!canLocalInteract || gameState.playerReserved[gameState.turn].length >= 3) {
                return false;
            }
            if (gameState.decks[level as 1 | 2 | 3].length === 0) {
                setErrorMsg('Deck empty!');
                return false;
            }

            if (preselectedReserveGold) {
                if (!canActionRunInPhase('RESERVE_DECK', gameState.phase)) {
                    return false;
                }

                networkDispatch({
                    type: 'RESERVE_DECK',
                    payload: { level: level as 1 | 2 | 3, goldCoords: preselectedReserveGold },
                });
                clearPreselectedReserveGold();
                setErrorMsg(null);
                return true;
            }

            const reserveFlow = buildReserveDeckFlow(
                level as 1 | 2 | 3,
                gameState.board.flat().some((cell) => cell.type.id === 'gold')
            );
            if (!canActionRunInPhase(reserveFlow.action.type, gameState.phase)) {
                return false;
            }

            networkDispatch(reserveFlow.action);
            if (reserveFlow.prompt) setErrorMsg(reserveFlow.prompt);
            return true;
        },
        [
            canLocalInteract,
            clearPreselectedReserveGold,
            gameState.board,
            gameState.decks,
            gameState.phase,
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
            if (!canLocalInteract) return false;

            const actionType = card.bonusColor === 'gold' ? 'INITIATE_BUY_JOKER' : 'BUY_CARD';
            if (!canActionRunInPhase(actionType, gameState.phase)) {
                return false;
            }

            if (!canAfford(card, source === 'reserved')) {
                setErrorMsg('Cannot afford!');
                return false;
            }

            networkDispatch(buildBuyAction(card, source, marketInfo, getRandomBasicGemColor()));
            return true;
        },
        [canAfford, canLocalInteract, gameState.phase, networkDispatch, setErrorMsg]
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
            const actionType = card.bonusColor === 'gold' ? 'INITIATE_BUY_JOKER' : 'BUY_CARD';
            if (!canActionRunInPhase(actionType, gameState.phase)) return false;

            const affordable = canAfford(card, true);
            if (execute && affordable) {
                initiateBuy(card, 'reserved');
            }
            return affordable;
        },
        [canAfford, canLocalInteract, gameState.phase, initiateBuy]
    );

    const handleDiscardReserved = useCallback(
        (cardId: string) => {
            if (canLocalInteract && canActionRunInPhase('DISCARD_RESERVED', gameState.phase)) {
                networkDispatch({ type: 'DISCARD_RESERVED', payload: { cardId } });
            }
        },
        [canLocalInteract, gameState.phase, networkDispatch]
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
            clearPreselectedReserveGold,
        }),
        [
            checkAndInitiateBuyReserved,
            clearPreselectedReserveGold,
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
