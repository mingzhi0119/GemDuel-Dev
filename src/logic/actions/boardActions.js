import { GEM_TYPES, SPIRAL_ORDER } from '../../constants';
import { addFeedback, addPrivilege } from '../stateHelpers';
import { finalizeTurn } from '../turnManager';

export const handleTakeGems = (state, payload) => {
    const { coords } = payload;
    const newInv = { ...state.inventories[state.turn] };
    let pearlCount = 0; let colorCounts = {};
    coords.forEach(({ r, c }) => {
        const gem = state.board[r][c];
        const gemType = gem.type.id;
        newInv[gemType] = (newInv[gemType] || 0) + 1;
        state.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
        if (gemType === 'pearl') pearlCount++;
        colorCounts[gemType] = (colorCounts[gemType] || 0) + 1;
    });
    
    const specialGems = coords.map(({r,c}) => state.board[r][c].type.id).filter(t => t === 'pearl' || t === 'gold');
    specialGems.forEach(t => addFeedback(state, state.turn, t, 1));

    if (pearlCount >= 2 || Object.values(colorCounts).some(c => c >= 3)) {
        const opponent = state.turn === 'p1' ? 'p2' : 'p1';
        if ((state.privileges.p1 + state.privileges.p2) < 3) {
                addPrivilege(state, opponent);
        }
        else if (state.privileges[state.turn] > 0) { 
            state.privileges[state.turn]--; 
            addFeedback(state, state.turn, 'privilege', -1);
            addPrivilege(state, opponent); 
        }
    }
    state.inventories[state.turn] = newInv;
    finalizeTurn(state, state.turn === 'p1' ? 'p2' : 'p1', newInv);
    return state;
};

export const handleReplenish = (state, payload) => {
    const { randoms } = payload || {};
    const opponent = state.turn === 'p1' ? 'p2' : 'p1';
    const buff = state.playerBuffs?.[state.turn];

    if (!state.board.every(row => row.every(g => g.type.id === 'empty'))) {
        if ((state.privileges.p1 + state.privileges.p2) < 3) {
            addPrivilege(state, opponent);
        }
        else if (state.privileges[state.turn] > 0) { 
            state.privileges[state.turn]--; 
            addFeedback(state, state.turn, 'privilege', -1);
            addPrivilege(state, opponent);
        }

        const hasExtortion = buff?.effects?.active === 'replenish_steal';
        
        if (hasExtortion) {
                if (!buff.state) buff.state = {};
                if (typeof buff.state.refillCount === 'undefined') buff.state.refillCount = 0;
                buff.state.refillCount++;

                if (buff.state.refillCount > 0 && buff.state.refillCount % 2 === 0) {
                    const oppBuff = state.playerBuffs?.[opponent];
                    if (oppBuff?.effects?.passive?.immuneNegative) {
                        state.toastMessage = "Extortion blocked by Pacifist!";
                    } else {
                        let stolenColor = randoms?.extortionColor;
                        if (!stolenColor) {
                        const stealableColors = Object.keys(state.inventories[opponent])
                            .filter(k => k !== 'gold' && k !== 'pearl' && state.inventories[opponent][k] > 0);
                        if (stealableColors.length > 0) {
                            stolenColor = stealableColors[Math.floor(Math.random() * stealableColors.length)];
                        }
                        }

                        if (stolenColor) {
                            state.inventories[opponent][stolenColor]--;
                            state.inventories[state.turn][stolenColor]++;
                            addFeedback(state, state.turn, stolenColor, 1);
                            addFeedback(state, opponent, stolenColor, -1);
                            addFeedback(state, state.turn, 'extortion', 1); 
                            state.toastMessage = `Extortion! Stole 1 ${stolenColor}!`;
                        } else {
                            state.toastMessage = "Extortion triggered but opponent has no basic gems.";
                        }
                    }
                }
        }
    }
    
    if (buff?.effects?.passive?.refillBonus) {
            const randColor = randoms?.expansionColor || ['red', 'green', 'blue', 'white', 'black'][Math.floor(Math.random() * 5)];
            state.inventories[state.turn][randColor]++;
            addFeedback(state, state.turn, randColor, 1);
            state.toastMessage = "Aggressive Expansion: +1 Gem!";
    }

    for (let i = 0; i < SPIRAL_ORDER.length; i++) {
        const [r, c] = SPIRAL_ORDER[i];
        if (state.board[r][c].type.id === 'empty' && state.bag.length > 0) {
            state.board[r][c] = state.bag.pop();
        }
    }
    return state;
};

export const handleTakeBonusGem = (state, payload) => {
    const { r, c } = payload;
    const gem = state.board[r][c];
    const gemType = gem.type.id;
    state.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
    state.inventories[state.turn][gemType] = (state.inventories[state.turn][gemType] || 0) + 1;
    state.bonusGemTarget = null;
    const totalGems = Object.values(state.inventories[state.turn]).reduce((a, b) => a + b, 0);
    if (totalGems > 10) {
        state.gameMode = 'DISCARD_EXCESS_GEMS';
        return state;
    }
    finalizeTurn(state, state.nextPlayerAfterRoyal || (state.turn === 'p1' ? 'p2' : 'p1'));
    return state;
};

export const handleDiscardGem = (state, payload) => {
    const gemId = payload;
    const currentInv = state.inventories[state.turn];
    if (currentInv[gemId] > 0) {
        currentInv[gemId]--;
        state.bag.push({ type: GEM_TYPES[gemId.toUpperCase()], uid: `discard-${Date.now()}` });
        const totalGems = Object.values(currentInv).reduce((a, b) => a + b, 0);
        if (totalGems <= 10) {
            const nextP = state.nextPlayerAfterRoyal || (state.turn === 'p1' ? 'p2' : 'p1');
            finalizeTurn(state, nextP, currentInv);
        }
    }
    return state;
};

export const handleStealGem = (state, payload) => {
    const { gemId } = payload;
    const player = state.turn;
    const opponent = player === 'p1' ? 'p2' : 'p1';
    
    if (state.inventories[opponent][gemId] > 0) {
        state.inventories[opponent][gemId]--;
        state.inventories[player][gemId] = (state.inventories[player][gemId] || 0) + 1;
    }
    addFeedback(state, player, gemId, 1);
    addFeedback(state, opponent, gemId, -1);
    const totalGems = Object.values(state.inventories[player]).reduce((a, b) => a + b, 0);
    if (totalGems > 10) {
            state.gameMode = 'DISCARD_EXCESS_GEMS';
            return state;
    }
    finalizeTurn(state, state.nextPlayerAfterRoyal || opponent);
    return state;
};