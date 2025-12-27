import { BONUS_COLORS } from '../constants';

export const finalizeTurn = (state, nextPlayer, instantInv = null) => {
    // High Roller: Periodic Privilege Logic
    const nextBuff = state.playerBuffs?.[nextPlayer];
    if (nextBuff?.effects?.passive?.periodicPrivilege) {
            if (!nextBuff.state) nextBuff.state = {};
            if (typeof nextBuff.state.turnCount === 'undefined') nextBuff.state.turnCount = 0;
            if (typeof nextBuff.state.specialPrivilege === 'undefined') nextBuff.state.specialPrivilege = 0;
            
            nextBuff.state.turnCount++;
            if (nextBuff.state.turnCount % nextBuff.effects.passive.periodicPrivilege === 0) {
                if (nextBuff.state.specialPrivilege === 0) {
                    nextBuff.state.specialPrivilege = 1;
                    state.toastMessage = "High Roller: Gained Special Privilege!";
                }
            }
    }

    const p1Buff = state.playerBuffs?.p1?.effects?.winCondition || {};
    const p2Buff = state.playerBuffs?.p2?.effects?.winCondition || {};
    const currentBuff = state.turn === 'p1' ? p1Buff : p2Buff;

    const POINTS_GOAL = currentBuff.points || 20;
    const CROWNS_GOAL = currentBuff.crowns || 10;
    const SINGLE_COLOR_GOAL = currentBuff.singleColor || 10;
    const DISABLE_SINGLE_COLOR = currentBuff.disableSingleColor || false;

    const getPoints = (pid) => state.playerTableau[pid].reduce((a, c) => a + c.points, 0) + state.playerRoyals[pid].reduce((a, c) => a + c.points, 0) + (state.extraPoints ? state.extraPoints[pid] : 0) + 
        ((state.playerBuffs && state.playerBuffs[pid].effects?.passive?.pointBonus) 
        ? (state.playerTableau[pid].length + state.playerRoyals[pid].length) * state.playerBuffs[pid].effects.passive.pointBonus 
        : 0);

    const getCrowns = (pid) => [...state.playerTableau[pid], ...state.playerRoyals[pid]].reduce((a, c) => a + (c.crowns || 0), 0) + (state.extraCrowns ? state.extraCrowns[pid] : 0);
    const getColorPoints = (pid, color) => state.playerTableau[pid].filter(c => c.bonusColor === color).reduce((a, c) => a + c.points, 0);

    if (getPoints(state.turn) >= POINTS_GOAL || getCrowns(state.turn) >= CROWNS_GOAL) { state.winner = state.turn; return; }
    
    if (!DISABLE_SINGLE_COLOR) {
        for (const color of BONUS_COLORS) { if (getColorPoints(state.turn, color) >= SINGLE_COLOR_GOAL) { state.winner = state.turn; return; } }
    }

    // Check Royal Milestones
    const crowns = getCrowns(state.turn);
    const milestones = state.royalMilestones[state.turn];
    if ((crowns >= 3 && !milestones[3]) || (crowns >= 6 && !milestones[6])) {
        if (state.royalDeck.length > 0) {
            const milestoneHit = crowns >= 6 && !milestones[6] ? 6 : 3;
            state.royalMilestones[state.turn][milestoneHit] = true;
            state.gameMode = 'SELECT_ROYAL';
            state.nextPlayerAfterRoyal = nextPlayer;
            return;
        }
    }

    const invToCheck = instantInv || state.inventories[state.turn];
    const totalGems = Object.values(invToCheck).reduce((a, b) => a + b, 0);
    
    // Dynamic Gem Cap
    const gemCap = state.playerBuffs?.[state.turn]?.effects?.passive?.gemCap || 10;

    if (totalGems > gemCap) {
        state.gameMode = 'DISCARD_EXCESS_GEMS';
        // Do not switch turn, wait for discard
        if (!state.nextPlayerAfterRoyal) state.nextPlayerAfterRoyal = nextPlayer;
        return;
    }
    state.turn = nextPlayer;
    state.gameMode = 'IDLE';
    state.nextPlayerAfterRoyal = null;
};
