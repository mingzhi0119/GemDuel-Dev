export const getPlayerScore = (state, pid) => {
    if (!state) return 0;
    const cardPoints = state.playerTableau[pid].reduce((acc, c) => acc + c.points, 0);
    const royalPoints = state.playerRoyals[pid].reduce((acc, c) => acc + c.points, 0);
    const extra = (state.extraPoints && state.extraPoints[pid]) || 0;
    
    let buffBonus = 0;
    const buffEffects = state.playerBuffs?.[pid]?.effects?.passive;
    if (buffEffects) {
        if (buffEffects.pointBonus) {
            buffBonus += (state.playerTableau[pid].length + state.playerRoyals[pid].length) * buffEffects.pointBonus;
        }
    }

    return cardPoints + royalPoints + extra + buffBonus;
};

export const getCrownCount = (state, pid) => {
    if (!state) return 0;
    const allCards = [...state.playerTableau[pid], ...state.playerRoyals[pid]];
    const extra = (state.extraCrowns && state.extraCrowns[pid]) || 0;
    return allCards.reduce((acc, c) => acc + (c.crowns || 0), 0) + extra;
};
