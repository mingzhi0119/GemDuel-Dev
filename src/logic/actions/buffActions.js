import { INITIAL_STATE_SKELETON } from '../initialState';

// Helper: Applies Buff Init Effects & Checks Gem Cap
export const applyBuffInitEffects = (state, initRandoms = {}) => {
    // Apply Buff OnInit Effects
    ['p1', 'p2'].forEach(pid => {
        const buff = state.playerBuffs[pid];
        const randoms = initRandoms[pid] || {};

        if (buff && buff.effects) {
            if (!state.playerBuffs[pid].state) state.playerBuffs[pid].state = {};

            if (buff.id === 'extortion') {
                state.playerBuffs[pid].state.refillCount = 0;
            }
            
            if (buff.id === 'pacifist') {
                state.privileges[pid] = Math.min(3, state.privileges[pid] + 1);
            }

            if (buff.effects.onInit) {
                const fx = buff.effects.onInit;
                
                if (fx.privilege) {
                    state.privileges[pid] += fx.privilege;
                }
                if (fx.randomGem) {
                     const count = typeof fx.randomGem === 'number' ? fx.randomGem : 1;
                     const basics = ['red', 'green', 'blue', 'white', 'black'];
                     const randColors = randoms.randomGems || Array.from({length: count}, () => basics[Math.floor(Math.random() * basics.length)]);
                     randColors.slice(0, count).forEach(randColor => {
                         state.inventories[pid][randColor]++;
                     });
                }
                if (fx.crowns) {
                    if (!state.extraCrowns) state.extraCrowns = { p1: 0, p2: 0 };
                    state.extraCrowns[pid] += fx.crowns;
                }
                if (fx.pearl) {
                    state.inventories[pid].pearl += fx.pearl;
                }
                if (fx.gold) {
                    state.inventories[pid].gold += fx.gold;
                }
                if (fx.reserveCard) {
                     const lvl = randoms.reserveCardLevel || Math.floor(Math.random() * 3) + 1;
                     if (state.decks[lvl].length > 0) {
                         const card = state.decks[lvl].pop();
                         state.playerReserved[pid].push(card);
                     }
                }
            }
        }
    });

    // Check for Gem Cap Overflow
    const p1Cap = state.playerBuffs?.p1?.effects?.passive?.gemCap || 10;
    const p1Total = Object.values(state.inventories.p1).reduce((a,b)=>a+b, 0);
    
    if (p1Total > p1Cap) {
        state.turn = 'p1';
        state.gameMode = 'DISCARD_EXCESS_GEMS';
        state.nextPlayerAfterRoyal = 'p1'; 
    } else {
         const p2Cap = state.playerBuffs?.p2?.effects?.passive?.gemCap || 10;
         const p2Total = Object.values(state.inventories.p2).reduce((a,b)=>a+b, 0);
         if (p2Total > p2Cap) {
             state.turn = 'p2';
             state.gameMode = 'DISCARD_EXCESS_GEMS';
             state.nextPlayerAfterRoyal = 'p1';
         }
    }
    return state;
};

export const handleInit = (state, payload) => {
    // Fix: Deep clone skeleton to prevent mutating the constant
    const skeleton = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON));
    const initializedState = { ...skeleton, ...payload };
    return applyBuffInitEffects(initializedState, payload.initRandoms);
};

export const handleInitDraft = (state, payload) => {
    const { draftPool, buffLevel, ...gameSetup } = payload;
    // Fix: Deep clone skeleton
    const newState = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON));
    
    newState.draftPool = draftPool;
    newState.buffLevel = buffLevel;
    newState.pendingSetup = gameSetup;
    newState.draftOrder = ['p2', 'p1']; 
    newState.gameMode = 'DRAFT_PHASE';
    newState.turn = 'p2';
    return newState;
};

export const handleSelectBuff = (state, payload) => {
    const buffId = typeof payload === 'object' ? payload.buffId : payload;
    const randomColor = typeof payload === 'object' ? payload.randomColor : null;
    const initRandoms = typeof payload === 'object' ? payload.initRandoms : {};
    const player = state.turn;
    
    const selectedBuff = state.draftPool.find(b => b.id === buffId);
    if (selectedBuff) {
        state.playerBuffs[player] = { ...selectedBuff, state: {} };
        state.draftPool = state.draftPool.filter(b => b.id !== buffId);

        if (selectedBuff.id === 'color_preference' && randomColor) {
            state.playerBuffs[player].state.discountColor = randomColor;
            const dummyCard = {
                id: `buff-color-pref-${player}-${Date.now()}`,
                points: 0, crowns: 0, bonusColor: randomColor, bonusCount: 1, 
                level: 0, cost: {}, image: null, isBuff: true 
            };
            if (!state.playerTableau[player]) state.playerTableau[player] = [];
            state.playerTableau[player].push(dummyCard);
        }
    }

    const currentIdx = state.draftOrder.indexOf(player);
    if (currentIdx !== -1) {
        const nextPlayer = state.draftOrder[currentIdx + 1];
        if (nextPlayer) {
            state.turn = nextPlayer;
        } else {
            const setup = state.pendingSetup;
            state.board = setup.board;
            state.bag = setup.bag;
            state.market = setup.market;
            state.decks = setup.decks;
            state.pendingSetup = null;
            state.draftOrder = [];
            state.gameMode = 'IDLE';
            state.turn = 'p1'; 
            return applyBuffInitEffects(state, initRandoms);
        }
    }
    return state;
};
