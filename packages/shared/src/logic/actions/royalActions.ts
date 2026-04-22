/**
 * Royal Action Handlers
 *
 * Handles royal card selection and related abilities
 */

import { GAME_PHASES } from '../../constants';
import { addFeedback } from '../stateHelpers';
import {
    clearAbilityResolution,
    continueAbilityResolution,
    getAbilityResolutionNextPlayer,
    getCardAbilitySnapshot,
    startRoyalAbilityResolution,
} from './abilityResolution';
import { finalizeTurn } from '../turnManager';
import { GameState, SelectRoyalPayload } from '../../types';

export const handleForceRoyalSelection = (state: GameState): GameState => {
    state.phase = GAME_PHASES.SELECT_ROYAL;
    state.nextPlayerAfterRoyal = state.turn === 'p1' ? 'p2' : 'p1';
    state.pendingReserve = null;
    state.pendingBuy = null;
    clearAbilityResolution(state);
    return state;
};

export const handleSelectRoyalCard = (state: GameState, payload: SelectRoyalPayload): GameState => {
    const { card } = payload;
    const player = state.turn;

    // Add card to player's royals
    state.royalDeck = state.royalDeck.filter((c) => c.id !== card.id);
    state.playerRoyals[player].push(card);

    // Add crown feedback
    if (card.crowns && card.crowns > 0) addFeedback(state, player, 'crown', card.crowns);

    const nextTurn = state.nextPlayerAfterRoyal || (player === 'p1' ? 'p2' : 'p1');
    startRoyalAbilityResolution(state, nextTurn, getCardAbilitySnapshot(card));

    if (continueAbilityResolution(state) === 'waiting') {
        return state;
    }

    finalizeTurn(state, getAbilityResolutionNextPlayer(state, nextTurn));
    return state;
};
