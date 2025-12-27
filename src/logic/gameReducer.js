import { 
    handleTakeGems, handleReplenish, handleTakeBonusGem, handleDiscardGem, handleStealGem 
} from './actions/boardActions';
import { 
    handleBuyCard, handleInitiateBuyJoker, handleInitiateReserve, 
    handleInitiateReserveDeck, handleCancelReserve, handleReserveCard, handleReserveDeck 
} from './actions/marketActions';
import { 
    handleSelectRoyalCard, handleForceRoyalSelection 
} from './actions/royalActions';
import { 
    handleUsePrivilege, handleActivatePrivilege 
} from './actions/privilegeActions';
import { 
    handleSelectBuff, handleInit, handleInitDraft 
} from './actions/buffActions';
import {
    handleDebugAddCrowns, handleDebugAddPoints, handlePeekDeck, handleCloseModal
} from './actions/miscActions';

// Main Reducer
export const applyAction = (state, action) => {
    // Deep clone state to ensure immutability during replay
    // Handle null state for safety (though usually handled by INIT)
    const newState = state ? JSON.parse(JSON.stringify(state)) : null;
    
    if (newState) {
        newState.lastFeedback = null; // Clear previous feedback to prevent residuals
        newState.toastMessage = null;
    }

    const { type, payload } = action;

    switch (type) {
        case 'INIT': 
            return handleInit(newState, payload);

        case 'INIT_DRAFT': 
            return handleInitDraft(newState, payload);

        case 'SELECT_BUFF': 
            return handleSelectBuff(newState, payload);

        case 'TAKE_GEMS': 
            return handleTakeGems(newState, payload);

        case 'REPLENISH': 
            return handleReplenish(newState, payload);

        case 'TAKE_BONUS_GEM': 
            return handleTakeBonusGem(newState, payload);

        case 'DISCARD_GEM': 
            return handleDiscardGem(newState, payload);

        case 'DEBUG_ADD_CROWNS': 
            return handleDebugAddCrowns(newState, payload);

        case 'DEBUG_ADD_POINTS': 
            return handleDebugAddPoints(newState, payload);

        case 'INITIATE_BUY_JOKER': 
            return handleInitiateBuyJoker(newState, payload);

        case 'BUY_CARD': 
            return handleBuyCard(newState, payload);

        case 'INITIATE_RESERVE': 
            return handleInitiateReserve(newState, payload);

        case 'INITIATE_RESERVE_DECK': 
            return handleInitiateReserveDeck(newState, payload);

        case 'CANCEL_RESERVE': 
            return handleCancelReserve(newState);

        case 'RESERVE_CARD': 
            return handleReserveCard(newState, payload);

        case 'RESERVE_DECK': 
            return handleReserveDeck(newState, payload);

        case 'STEAL_GEM': 
            return handleStealGem(newState, payload);

        case 'FORCE_ROYAL_SELECTION': 
            return handleForceRoyalSelection(newState);

        case 'SELECT_ROYAL_CARD': 
            return handleSelectRoyalCard(newState, payload);

        case 'ACTIVATE_PRIVILEGE': 
            return handleActivatePrivilege(newState);

        case 'USE_PRIVILEGE': 
            return handleUsePrivilege(newState, payload);
        
        case 'PEEK_DECK': 
            return handlePeekDeck(newState, payload);

        case 'CLOSE_MODAL': 
            return handleCloseModal(newState);

        default:
            console.warn("Unknown action type:", type);
            return newState;
    }
};
