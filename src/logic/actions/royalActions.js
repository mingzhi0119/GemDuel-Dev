import { ABILITIES } from '../../constants';
import { addFeedback, addPrivilege } from '../stateHelpers';
import { finalizeTurn } from '../turnManager';

export const handleForceRoyalSelection = (state) => {
    state.gameMode = 'SELECT_ROYAL';
    state.nextPlayerAfterRoyal = state.turn === 'p1' ? 'p2' : 'p1';
    state.pendingReserve = null;
    state.pendingBuy = null;
    state.bonusGemTarget = null;
    return state;
};

export const handleSelectRoyalCard = (state, payload) => {
    const { card } = payload;
    const player = state.turn;
    
    state.royalDeck = state.royalDeck.filter(c => c.id !== card.id);
    state.playerRoyals[player].push(card);
    if (card.crowns > 0) addFeedback(state, player, 'crown', card.crowns);

    const abilities = Array.isArray(card.ability) ? card.ability : (card.ability ? [card.ability] : []);
    let nextTurn = state.nextPlayerAfterRoyal || (player === 'p1' ? 'p2' : 'p1');
    
    if (abilities.includes(ABILITIES.AGAIN.id)) {
        nextTurn = player;
    }

    if (abilities.includes(ABILITIES.BONUS_GEM.id)) {
        const hasGem = state.board.some(row => row.some(g => g.type.id === card.bonusColor));
        if (hasGem) {
            state.gameMode = 'BONUS_ACTION';
            state.bonusGemTarget = card.bonusColor;
            if (!state.nextPlayerAfterRoyal) state.nextPlayerAfterRoyal = nextTurn;
            return state;
        } else {
            state.toastMessage = "No matching gem available - Skill skipped";
        }
    }

    if (abilities.includes(ABILITIES.STEAL.id)) {
            const opponent = player === 'p1' ? 'p2' : 'p1';
            const oppBuff = state.playerBuffs?.[opponent];
            if (oppBuff?.effects?.passive?.immuneNegative) {
                state.toastMessage = "Steal blocked by Pacifist!";
            } else {
                const hasStealable = Object.entries(state.inventories[opponent]).some(([key, count]) => key !== 'gold' && count > 0);
                if (hasStealable) {
                    state.gameMode = 'STEAL_ACTION';
                    if (!state.nextPlayerAfterRoyal) state.nextPlayerAfterRoyal = nextTurn;
                    return state;
                } else {
                    state.toastMessage = "No stealable gem from opponent - Skill skipped";
                }
            }
    }

    if (abilities.includes(ABILITIES.SCROLL.id)) {
        const opponent = player === 'p1' ? 'p2' : 'p1';
        if ((state.privileges.p1 + state.privileges.p2) < 3) {
            addPrivilege(state, player);
        }
        else if (state.privileges[opponent] > 0) { 
            state.privileges[opponent]--; 
            addFeedback(state, opponent, 'privilege', -1);
            addPrivilege(state, player); 
        }
    }
    finalizeTurn(state, nextTurn);
    return state;
};
