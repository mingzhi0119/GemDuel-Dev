/**
 * Miscellaneous Action Handlers
 *
 * Debug utilities, modals, and special actions
 */

import { addFeedback, addPrivilege } from '../stateHelpers';
import { finalizeTurn } from '../turnManager';
import { GameState, PlayerKey, PeekDeckPayload } from '../../types';

/**
 * Debug: Add crowns to a player
 */
export const handleDebugAddCrowns = (state: GameState, payload: PlayerKey): GameState => {
    const pid = payload;
    if (!state.extraCrowns) state.extraCrowns = { p1: 0, p2: 0 };
    state.extraCrowns[pid] = (state.extraCrowns[pid] || 0) + 1;
    addFeedback(state, pid, 'crown', 1);
    finalizeTurn(state, state.turn);
    return state;
};

/**
 * Debug: Add points to a player
 */
export const handleDebugAddPoints = (state: GameState, payload: PlayerKey): GameState => {
    const pid = payload;
    if (!state.extraPoints) state.extraPoints = { p1: 0, p2: 0 };
    state.extraPoints[pid] = (state.extraPoints[pid] || 0) + 1;
    finalizeTurn(state, state.turn);
    return state;
};

/**
 * Debug: Add privilege scroll to a player
 */
export const handleDebugAddPrivilege = (state: GameState, payload: PlayerKey): GameState => {
    addPrivilege(state, payload);
    return state;
};

/**
 * Peek at top 3 cards of a deck (Intelligence ability)
 */
export const handlePeekDeck = (draft: GameState, payload: PeekDeckPayload): void => {
    const levels = payload.levels?.length ? payload.levels : payload.level ? [payload.level] : [];
    const cards = levels.flatMap((level) => draft.decks[level].slice(-3).reverse());

    draft.activeModal = {
        type: 'PEEK',
        data: {
            cards,
            initiator: draft.turn,
        },
    };
};

/**
 * Close any active modal
 */
export const handleCloseModal = (state: GameState): GameState => {
    state.activeModal = null;
    return state;
};
