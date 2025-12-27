import { GEM_TYPES, ABILITIES } from '../../constants';
import { calculateTransaction } from '../../utils';
import { addFeedback, addPrivilege } from '../stateHelpers';
import { finalizeTurn } from '../turnManager';

export const handleInitiateBuyJoker = (state, payload) => {
    state.pendingBuy = payload;
    state.gameMode = 'SELECT_CARD_COLOR';
    return state;
};

export const handleBuyCard = (state, payload) => {
    const { card, source, marketInfo, randoms } = payload;
    const player = state.turn;
    const inv = state.inventories[player];
    const tableau = state.playerTableau[player];
    const buff = state.playerBuffs?.[player];
    
    state.pendingBuy = null; 

    const { goldCost, gemsPaid } = calculateTransaction(card, inv, tableau, buff);

    Object.entries(gemsPaid).forEach(([color, paid]) => {
        inv[color] -= paid;
        for(let k=0; k<paid; k++) {
            state.bag.push({ type: GEM_TYPES[color.toUpperCase()], uid: `returned-${color}-${Date.now()}-${k}` });
        }
    });
    inv.gold -= goldCost;
    for(let k=0; k<goldCost; k++) {
        state.bag.push({ type: GEM_TYPES.GOLD, uid: `returned-gold-${Date.now()}-${k}` });
    }

    if (buff?.effects?.passive?.doubleBonusFirst5 && state.playerTableau[player].length < 5) {
        card.bonusCount = 2;
        state.toastMessage = "Minimalism: Card grants Double Bonus!";
    }
    state.playerTableau[player].push(card);
    if (card.crowns > 0) {
        addFeedback(state, player, 'crown', card.crowns);
        if (buff?.effects?.passive?.crownBonusGem) {
            const basics = ['red', 'green', 'blue', 'white', 'black'];
            const randColor = randoms?.bountyHunterColor || basics[Math.floor(Math.random() * basics.length)];
            inv[randColor]++;
            addFeedback(state, player, randColor, 1);
            state.toastMessage = "Bounty Hunter: +1 Gem!";
        }
    }
    
    if (buff?.effects?.passive?.recycler && (card.level === 2 || card.level === 3)) {
        const paidColors = Object.keys(gemsPaid).filter(c => gemsPaid[c] > 0 && c !== 'pearl');
        if (paidColors.length > 0) {
            const refundColor = paidColors[0];
            inv[refundColor]++;
            for (let i = state.bag.length - 1; i >= 0; i--) {
                if (state.bag[i].type.id === refundColor) {
                    state.bag.splice(i, 1);
                    break;
                }
            }
            addFeedback(state, player, refundColor, 1);
            state.toastMessage = "Recycled 1 Gem!";
        }
    }

    if (source === 'market') {
        const { level, idx } = marketInfo;
        const deck = state.decks[level];
        if (deck.length > 0) {
            state.market[level][idx] = deck.pop();
        } else {
            state.market[level][idx] = null;
        }
    } else if (source === 'reserved') {
        state.playerReserved[player] = state.playerReserved[player].filter(c => c.id !== card.id);
    }

    let nextTurn = player === 'p1' ? 'p2' : 'p1';
    const abilities = Array.isArray(card.ability) ? card.ability : (card.ability ? [card.ability] : []);
    
    if (abilities.includes(ABILITIES.AGAIN.id)) nextTurn = player;
    
    if (abilities.includes(ABILITIES.BONUS_GEM.id)) {
        const hasGem = state.board.some(row => row.some(g => g.type.id === card.bonusColor));
        if (hasGem) {
            state.gameMode = 'BONUS_ACTION';
            state.bonusGemTarget = card.bonusColor;
            return state; 
        } else {
            state.toastMessage = "No matching gem available - Skill skipped";
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

export const handleInitiateReserve = (state, payload) => {
    state.pendingReserve = payload;
    state.gameMode = 'RESERVE_WAITING_GEM';
    return state;
};

export const handleInitiateReserveDeck = (state, payload) => {
    state.pendingReserve = { ...payload, isDeck: true };
    state.gameMode = 'RESERVE_WAITING_GEM';
    return state;
};

export const handleCancelReserve = (state) => {
    state.pendingReserve = null;
    state.gameMode = 'IDLE';
    return state;
};

export const handleReserveCard = (state, payload) => {
    const { card, level, idx, goldCoords } = payload;
    const player = state.turn;
    state.playerReserved[player].push(card);
    
    const deck = state.decks[level];
    state.market[level][idx] = deck.length > 0 ? deck.pop() : null;

    if (goldCoords) {
        const { r, c } = goldCoords;
        if (state.board[r][c].type.id === 'gold') {
            state.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
            state.inventories[player].gold++;
            addFeedback(state, player, 'gold', 1);
        }
    }
    
    const buff = state.playerBuffs?.[player];
    if (buff?.effects?.passive?.firstReserveBonus) {
        if (!buff.state) buff.state = {};
        if (!buff.state.hasReserved) {
            buff.state.hasReserved = true;
            state.inventories[player].gold += 2; 
            addFeedback(state, player, 'gold', 2);
            state.toastMessage = "Patient Investor: +2 Gold!";
        }
    }

    state.pendingReserve = null;
    state.gameMode = 'IDLE';
    finalizeTurn(state, player === 'p1' ? 'p2' : 'p1');
    return state;
};

export const handleReserveDeck = (state, payload) => {
    const { level, goldCoords } = payload;
    const player = state.turn;
    
    if (state.decks[level].length > 0) {
        const card = state.decks[level].pop();
        state.playerReserved[player].push(card);
    }

    if (goldCoords) {
        const { r, c } = goldCoords;
        if (state.board[r][c].type.id === 'gold') {
            state.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
            state.inventories[player].gold++;
            addFeedback(state, player, 'gold', 1);
        }
    }
    
    const buff = state.playerBuffs?.[player];
    if (buff?.effects?.passive?.firstReserveBonus) {
        if (!buff.state) buff.state = {};
        if (!buff.state.hasReserved) {
            buff.state.hasReserved = true;
            state.inventories[player].gold += 2;
            addFeedback(state, player, 'gold', 2);
            state.toastMessage = "Patient Investor: +2 Gold!";
        }
    }

    state.pendingReserve = null;
    state.gameMode = 'IDLE';
    finalizeTurn(state, player === 'p1' ? 'p2' : 'p1');
    return state;
};
