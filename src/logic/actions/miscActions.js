import { addFeedback } from '../stateHelpers';
import { finalizeTurn } from '../turnManager';

export const handleDebugAddCrowns = (state, payload) => {
    const pid = payload;
    if (!state.extraCrowns) state.extraCrowns = { p1: 0, p2: 0 };
    state.extraCrowns[pid] = (state.extraCrowns[pid] || 0) + 1;
    addFeedback(state, pid, 'crown', 1);
    finalizeTurn(state, state.turn); 
    return state;
};

export const handleDebugAddPoints = (state, payload) => {
    const pid = payload;
    if (!state.extraPoints) state.extraPoints = { p1: 0, p2: 0 };
    state.extraPoints[pid] = (state.extraPoints[pid] || 0) + 1;
    finalizeTurn(state, state.turn);
    return state;
};

export const handlePeekDeck = (state, payload) => {
    const { level } = payload; 
    const deck = state.decks[level];
    const top3 = deck.slice(-3).reverse(); 
    state.activeModal = {
        type: 'PEEK',
        data: {
            cards: top3,
            level: level
        }
    };
    return state;
};

export const handleCloseModal = (state) => {
    state.activeModal = null;
    return state;
};
