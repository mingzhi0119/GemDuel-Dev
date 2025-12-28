/**
 * Main Game Reducer
 *
 * Central dispatcher for all game actions.
 * Uses Immer for efficient immutable state updates.
 */

import { produce } from 'immer';
import {
    handleTakeGems,
    handleReplenish,
    handleTakeBonusGem,
    handleDiscardGem,
    handleStealGem,
} from './actions/boardActions';
import {
    handleBuyCard,
    handleInitiateBuyJoker,
    handleInitiateReserve,
    handleInitiateReserveDeck,
    handleCancelReserve,
    handleReserveCard,
    handleReserveDeck,
} from './actions/marketActions';
import { handleSelectRoyalCard, handleForceRoyalSelection } from './actions/royalActions';
import {
    handleUsePrivilege,
    handleActivatePrivilege,
    handleCancelPrivilege,
} from './actions/privilegeActions';
import { handleSelectBuff, handleInit, handleInitDraft } from './actions/buffActions';
import {
    handleDebugAddCrowns,
    handleDebugAddPoints,
    handleDebugAddPrivilege,
    handlePeekDeck,
    handleCloseModal,
} from './actions/miscActions';
import { GameState } from '../types';

/**
 * Game action interface
 */
export interface GameAction {
    type: string;
    payload?: any;
}

/**
 * Main reducer function
 *
 * Dispatches actions to appropriate handlers using Immer for efficient
 * immutable state updates. All handlers receive a draft state that can be
 * modified directly - Immer ensures immutability under the hood.
 *
 * @param state - Current game state
 * @param action - Action to apply
 * @returns New game state (or same state for null inputs)
 */
export const applyAction = (state: GameState | null, action: GameAction): GameState | null => {
    const { type, payload } = action;

    // 1. BOOTSTRAP / SYNC ACTIONS: These create or overwrite state regardless of its current existence
    if (type === 'INIT') {
        return handleInit(null, payload);
    }
    if (type === 'INIT_DRAFT') {
        return handleInitDraft(null, payload);
    }
    if (type === 'FORCE_SYNC' || type === 'FLATTEN') {
        return payload; // Atomic state replacement
    }

    // 2. STATE GUARD: For all other actions, we need an existing state
    if (!state) {
        return null;
    }

    // 3. MUTATION ACTIONS: Using Immer produce()
    return produce(state, (draft) => {
        // Clear transient UI feedback
        draft.lastFeedback = null;
        draft.toastMessage = null;

        switch (type) {
            // ========== INITIALIZATION & SETUP ==========
            case 'SELECT_BUFF':
                handleSelectBuff(draft, payload);
                break;

            // ========== BOARD ACTIONS ==========
            case 'TAKE_GEMS':
                handleTakeGems(draft, payload);
                break;

            case 'REPLENISH':
                handleReplenish(draft, payload);
                break;

            case 'TAKE_BONUS_GEM':
                handleTakeBonusGem(draft, payload);
                break;

            case 'DISCARD_GEM':
                handleDiscardGem(draft, payload);
                break;

            case 'STEAL_GEM':
                handleStealGem(draft, payload);
                break;

            // ========== MARKET ACTIONS ==========
            case 'INITIATE_BUY_JOKER':
                handleInitiateBuyJoker(draft, payload);
                break;

            case 'BUY_CARD':
                handleBuyCard(draft, payload);
                break;

            case 'INITIATE_RESERVE':
                handleInitiateReserve(draft, payload);
                break;

            case 'INITIATE_RESERVE_DECK':
                handleInitiateReserveDeck(draft, payload);
                break;

            case 'CANCEL_RESERVE':
                handleCancelReserve(draft);
                break;

            case 'RESERVE_CARD':
                handleReserveCard(draft, payload);
                break;

            case 'RESERVE_DECK':
                handleReserveDeck(draft, payload);
                break;

            // ========== PRIVILEGE ACTIONS ==========
            case 'ACTIVATE_PRIVILEGE':
                handleActivatePrivilege(draft);
                break;

            case 'USE_PRIVILEGE':
                handleUsePrivilege(draft, payload);
                break;

            case 'CANCEL_PRIVILEGE':
                handleCancelPrivilege(draft);
                break;

            // ========== ROYAL ACTIONS ==========
            case 'FORCE_ROYAL_SELECTION':
                handleForceRoyalSelection(draft);
                break;

            case 'SELECT_ROYAL_CARD':
                handleSelectRoyalCard(draft, payload);
                break;

            // ========== DEBUG ACTIONS ==========
            case 'DEBUG_ADD_CROWNS':
                handleDebugAddCrowns(draft, payload);
                break;

            case 'UNDO':
            case 'REDO':
                if (draft.mode === 'ONLINE_MULTIPLAYER') {
                    console.warn('Undo/Redo blocked in Online Mode');
                    return;
                }
                break;

            case 'DEBUG_ADD_POINTS':
                handleDebugAddPoints(draft, payload);
                break;

            case 'DEBUG_ADD_PRIVILEGE':
                handleDebugAddPrivilege(draft, payload);
                break;

            // ========== MODAL ACTIONS ==========
            case 'PEEK_DECK':
                handlePeekDeck(draft, payload);
                break;

            case 'CLOSE_MODAL':
                handleCloseModal(draft);
                break;

            // ========== FALLBACK ==========
            default:
                console.warn('Unknown action type:', type);
                break;
        }
    });
};
