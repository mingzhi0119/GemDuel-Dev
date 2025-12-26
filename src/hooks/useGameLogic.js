import { useState, useEffect, useCallback } from 'react';
import { 
    GRID_SIZE, GEM_TYPES, BONUS_COLORS, SPIRAL_ORDER, ABILITIES, ROYAL_CARDS, BUFFS 
} from '../constants';
import { generateGemPool, generateDeck, shuffleArray } from '../utils';
import { useActionHistory } from './useActionHistory';

// --- Reducer / Game Logic Engine ---
const INITIAL_STATE_SKELETON = {
    board: Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => ({ type: { id: 'empty' }, uid: 'skeleton' }))), 
    bag: [], turn: 'p1', gameMode: 'IDLE',
    pendingReserve: null, bonusGemTarget: null, pendingBuy: null, nextPlayerAfterRoyal: null,
    decks: { 1: [], 2: [], 3: [] }, market: { 1: [], 2: [], 3: [] },
    inventories: { p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 }, p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 } },
    privileges: { p1: 0, p2: 1 },
    playerTableau: { p1: [], p2: [] }, playerReserved: { p1: [], p2: [] },
    royalDeck: ROYAL_CARDS || [], playerRoyals: { p1: [], p2: [] },
    royalMilestones: { p1: { 3: false, 6: false }, p2: { 3: false, 6: false } },
    extraPoints: { p1: 0, p2: 0 },
    extraCrowns: { p1: 0, p2: 0 },
    playerBuffs: { p1: BUFFS.NONE, p2: BUFFS.NONE },
    
    // Draft & Phase 4 State
    draftPool: [],
    draftOrder: [], // ['p2', 'p1']
    buffLevel: 0,
    pendingSetup: null, // Stores board/decks during draft
    privilegeGemCount: 0,

    // UI/Modal State (Phase 3)
    activeModal: null, // { type: 'PEEK', data: ... }

    lastFeedback: null,
    toastMessage: null,
    winner: null
};

// Helper: Applies Buff Init Effects & Checks Gem Cap
const applyBuffInitEffects = (state) => {
    // Apply Buff OnInit Effects
    ['p1', 'p2'].forEach(pid => {
        const buff = state.playerBuffs[pid];
        if (buff && buff.effects) {
            // Initialize Buff State
            if (!state.playerBuffs[pid].state) state.playerBuffs[pid].state = {};

            // 1. Passive State Initialization (Color Preference)
            // Logic moved to SELECT_BUFF to use a dummy card for visualization & stability.


            // 2. OnInit Resources
            if (buff.id === 'extortion') {
                state.playerBuffs[pid].state.refillCount = 0;
            }
            
            // Pacifist Buff: Start with 1 extra privilege
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
                     for(let i=0; i<count; i++) {
                         const randColor = basics[Math.floor(Math.random() * basics.length)];
                         state.inventories[pid][randColor]++;
                     }
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
                     const lvl = Math.floor(Math.random() * 3) + 1;
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

const applyAction = (state, action) => {
    // Deep clone state to ensure immutability during replay
    // Handle null state for safety (though usually handled by INIT)
    const newState = state ? JSON.parse(JSON.stringify(state)) : null;
    if (newState) {
        newState.lastFeedback = null; // Clear previous feedback to prevent residuals
        newState.toastMessage = null;
    }

    // Helper to aggregate feedback
    const addFeedback = (player, type, diff) => {
        if (!newState.lastFeedback) newState.lastFeedback = { uid: Date.now() + '-' + Math.random(), items: [] };
        const existing = newState.lastFeedback.items.find(i => i.player === player && i.type === type);
        if (existing) existing.diff += diff;
        else newState.lastFeedback.items.push({ player, type, diff });
    };

    const { type, payload } = action;

    // Helper: Add Privilege with Cap/Immunity Check
    const addPrivilege = (pid) => {
        if (newState.privileges[pid] < 3) { // Standard Cap
             newState.privileges[pid]++;
             addFeedback(pid, 'privilege', 1);
        }
    };

    // Helper to finalize turn (check win conditions, etc.)
    const finalizeTurn = (nextPlayer, instantInv = null) => {
        // High Roller: Periodic Privilege Logic
        const nextBuff = newState.playerBuffs?.[nextPlayer];
        if (nextBuff?.effects?.passive?.periodicPrivilege) {
             if (!nextBuff.state) nextBuff.state = {};
             if (typeof nextBuff.state.turnCount === 'undefined') nextBuff.state.turnCount = 0;
             if (typeof nextBuff.state.specialPrivilege === 'undefined') nextBuff.state.specialPrivilege = 0;
             
             nextBuff.state.turnCount++;
             if (nextBuff.state.turnCount % nextBuff.effects.passive.periodicPrivilege === 0) {
                 if (nextBuff.state.specialPrivilege === 0) {
                     nextBuff.state.specialPrivilege = 1;
                     newState.toastMessage = "High Roller: Gained Special Privilege!";
                 }
             }
        }

        const p1Buff = newState.playerBuffs?.p1?.effects?.winCondition || {};
        const p2Buff = newState.playerBuffs?.p2?.effects?.winCondition || {};
        const currentBuff = newState.turn === 'p1' ? p1Buff : p2Buff;

        // Head Start Buff: Reduce points goal to 18
        let POINTS_GOAL = currentBuff.points || 20;
        if (newState.playerBuffs[newState.turn]?.id === 'head_start') {
            POINTS_GOAL = 18;
        }
        const CROWNS_GOAL = currentBuff.crowns || 10;
        const SINGLE_COLOR_GOAL = currentBuff.singleColor || 10;
        const DISABLE_SINGLE_COLOR = currentBuff.disableSingleColor || false;

        const getPoints = (pid) => newState.playerTableau[pid].reduce((a, c) => a + c.points, 0) + newState.playerRoyals[pid].reduce((a, c) => a + c.points, 0) + (newState.extraPoints ? newState.extraPoints[pid] : 0) + 
            ((newState.playerBuffs && newState.playerBuffs[pid].effects?.passive?.pointBonus) 
            ? (newState.playerTableau[pid].length + newState.playerRoyals[pid].length) * newState.playerBuffs[pid].effects.passive.pointBonus 
            : 0);

        const getCrowns = (pid) => [...newState.playerTableau[pid], ...newState.playerRoyals[pid]].reduce((a, c) => a + (c.crowns || 0), 0) + (newState.extraCrowns ? newState.extraCrowns[pid] : 0);
        const getColorPoints = (pid, color) => newState.playerTableau[pid].filter(c => c.bonusColor === color).reduce((a, c) => a + c.points, 0);

        if (getPoints(newState.turn) >= POINTS_GOAL || getCrowns(newState.turn) >= CROWNS_GOAL) { newState.winner = newState.turn; return; }
        
        if (!DISABLE_SINGLE_COLOR) {
            for (const color of BONUS_COLORS) { if (getColorPoints(newState.turn, color) >= SINGLE_COLOR_GOAL) { newState.winner = newState.turn; return; } }
        }

        const invToCheck = instantInv || newState.inventories[newState.turn];
        const totalGems = Object.values(invToCheck).reduce((a, b) => a + b, 0);
        
        // Dynamic Gem Cap
        const gemCap = newState.playerBuffs?.[newState.turn]?.effects?.passive?.gemCap || 10;

        if (totalGems > gemCap) {
            newState.gameMode = 'DISCARD_EXCESS_GEMS';
            // Do not switch turn, wait for discard
            if (!newState.nextPlayerAfterRoyal) newState.nextPlayerAfterRoyal = nextPlayer;
            return;
        }
        newState.turn = nextPlayer;
        newState.gameMode = 'IDLE';
        newState.nextPlayerAfterRoyal = null;
    };

    switch (type) {
        case 'INIT': {
            // Classic Start or Pre-assigned Buffs (Legacy support)
            const initializedState = { ...INITIAL_STATE_SKELETON, ...payload };
            return applyBuffInitEffects(initializedState);
        }

        case 'INIT_DRAFT': {
            // Roguelike Draft Start
            // Payload contains: board, decks, etc (to be stored in pending), plus draftPool, buffLevel
            const { draftPool, buffLevel, ...gameSetup } = payload;
            
            const state = { ...INITIAL_STATE_SKELETON };
            state.draftPool = draftPool;
            state.buffLevel = buffLevel;
            state.pendingSetup = gameSetup;
            state.draftOrder = ['p2', 'p1']; // P2 picks first
            state.gameMode = 'DRAFT_PHASE';
            state.turn = 'p2';
            
            return state;
        }

        case 'SELECT_BUFF': {
            // Support both string (legacy) and object payload
            const buffId = typeof payload === 'object' ? payload.buffId : payload;
            const randomColor = typeof payload === 'object' ? payload.randomColor : null;
            
            const player = newState.turn;
            
            // 1. Assign Buff
            const selectedBuff = newState.draftPool.find(b => b.id === buffId);
            if (selectedBuff) {
                newState.playerBuffs[player] = { ...selectedBuff, state: {} };
                newState.draftPool = newState.draftPool.filter(b => b.id !== buffId);

                // Special handling for Color Preference
                if (selectedBuff.id === 'color_preference' && randomColor) {
                    newState.playerBuffs[player].state.discountColor = randomColor;
                    
                    const dummyCard = {
                        id: `buff-color-pref-${player}-${Date.now()}`, // Date.now() here is fine as it's generated once per action execution
                        points: 0,
                        crowns: 0,
                        bonusColor: randomColor,
                        bonusCount: 1, 
                        level: 0, 
                        cost: {},
                        image: null,
                        isBuff: true // Marker for UI if needed
                    };
                    // Ensure tableau exists
                    if (!newState.playerTableau[player]) newState.playerTableau[player] = [];
                    newState.playerTableau[player].push(dummyCard);
                }
            }

            // 2. Advance Draft
            const currentIdx = newState.draftOrder.indexOf(player);
            if (currentIdx !== -1) {
                const nextPlayer = newState.draftOrder[currentIdx + 1];
                
                if (nextPlayer) {
                    newState.turn = nextPlayer;
                } else {
                    // Draft Complete -> Start Game
                    const setup = newState.pendingSetup;
                    newState.board = setup.board;
                    newState.bag = setup.bag;
                    newState.market = setup.market;
                    newState.decks = setup.decks;
                    newState.pendingSetup = null;
                    newState.draftOrder = [];
                    newState.gameMode = 'IDLE';
                    newState.turn = 'p1'; // Game always starts with P1
                    
                    return applyBuffInitEffects(newState);
                }
            }
            break;
        }

        case 'TAKE_GEMS': {
            const { coords } = payload;
            const newInv = { ...newState.inventories[newState.turn] };
            let pearlCount = 0; let colorCounts = {};
            coords.forEach(({ r, c }) => {
                const gem = newState.board[r][c];
                const gemType = gem.type.id;
                newInv[gemType] = (newInv[gemType] || 0) + 1;
                newState.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` }; // Date.now() in replay is fine as it's just a UID
                if (gemType === 'pearl') pearlCount++;
                colorCounts[gemType] = (colorCounts[gemType] || 0) + 1;
            });
            
            // Feedback for Pearl/Gold
            const specialGems = coords.map(({r,c}) => state.board[r][c].type.id).filter(t => t === 'pearl' || t === 'gold');
            specialGems.forEach(t => addFeedback(newState.turn, t, 1));

            // Privilege Logic
            if (pearlCount >= 2 || Object.values(colorCounts).some(c => c >= 3)) {
                const opponent = newState.turn === 'p1' ? 'p2' : 'p1';
                
                // Pacifist / Immunity Check handled in addPrivilege
                if ((newState.privileges.p1 + newState.privileges.p2) < 3) {
                     addPrivilege(opponent);
                }
                else if (newState.privileges[newState.turn] > 0) { 
                    newState.privileges[newState.turn]--; 
                    addFeedback(newState.turn, 'privilege', -1);
                    addPrivilege(opponent); 
                }
            }
            newState.inventories[newState.turn] = newInv;
            finalizeTurn(newState.turn === 'p1' ? 'p2' : 'p1', newInv);
            break;
        }

        case 'REPLENISH': {
            const opponent = newState.turn === 'p1' ? 'p2' : 'p1';
            const buff = newState.playerBuffs?.[newState.turn];

            if (!newState.board.every(row => row.every(g => g.type.id === 'empty'))) {
                // 1. Standard Privilege Rule (Always applies now)
                if ((newState.privileges.p1 + newState.privileges.p2) < 3) {
                    addPrivilege(opponent);
                }
                else if (newState.privileges[newState.turn] > 0) { 
                    newState.privileges[newState.turn]--; 
                    addFeedback(newState.turn, 'privilege', -1);
                    addPrivilege(opponent);
                }

                // 2. Extortion Buff Check
                const hasExtortion = buff?.effects?.active === 'replenish_steal';
                
                if (hasExtortion) {
                     // Safety Init
                     if (!buff.state) buff.state = {};
                     if (typeof buff.state.refillCount === 'undefined') buff.state.refillCount = 0;
                     
                     buff.state.refillCount++;

                     // Trigger every 2nd refill (2, 4, 6...)
                     if (buff.state.refillCount > 0 && buff.state.refillCount % 2 === 0) {
                         // Extortion immunity (Pacifist on Opponent)
                         const oppBuff = newState.playerBuffs?.[opponent];
                         if (oppBuff?.effects?.passive?.immuneNegative) {
                             newState.toastMessage = "Extortion blocked by Pacifist!";
                         } else {
                             const stealableColors = Object.keys(newState.inventories[opponent])
                                .filter(k => k !== 'gold' && k !== 'pearl' && newState.inventories[opponent][k] > 0);
                             
                             if (stealableColors.length > 0) {
                                 const stolenColor = stealableColors[Math.floor(Math.random() * stealableColors.length)];
                                 newState.inventories[opponent][stolenColor]--;
                                 newState.inventories[newState.turn][stolenColor]++;
                                 
                                 addFeedback(newState.turn, stolenColor, 1);
                                 addFeedback(opponent, stolenColor, -1);
                                 addFeedback(newState.turn, 'extortion', 1); // Trigger visual flash
                                 
                                 newState.toastMessage = `Extortion! Stole 1 ${stolenColor}!`;
                             } else {
                                 newState.toastMessage = "Extortion triggered but opponent has no basic gems.";
                             }
                         }
                     }
                }
            }
            
            // 3. Aggressive Expansion (New Buff)
            if (buff?.effects?.passive?.refillBonus) {
                 const basics = ['red', 'green', 'blue', 'white', 'black'];
                 const randColor = basics[Math.floor(Math.random() * basics.length)];
                 newState.inventories[newState.turn][randColor]++;
                 addFeedback(newState.turn, randColor, 1);
                 newState.toastMessage = "Aggressive Expansion: +1 Gem!";
            }

            for (let i = 0; i < SPIRAL_ORDER.length; i++) {
                const [r, c] = SPIRAL_ORDER[i];
                if (newState.board[r][c].type.id === 'empty' && newState.bag.length > 0) {
                    newState.board[r][c] = newState.bag.pop();
                }
            }
            break;
        }

        case 'TAKE_BONUS_GEM': {
            const { r, c } = payload;
            const gem = newState.board[r][c];
            const gemType = gem.type.id;
            
            newState.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
            newState.inventories[newState.turn][gemType] = (newState.inventories[newState.turn][gemType] || 0) + 1;
            
            newState.bonusGemTarget = null;
            
            const totalGems = Object.values(newState.inventories[newState.turn]).reduce((a, b) => a + b, 0);
            if (totalGems > 10) {
                newState.gameMode = 'DISCARD_EXCESS_GEMS';
                return newState;
            }
            finalizeTurn(newState.nextPlayerAfterRoyal || (newState.turn === 'p1' ? 'p2' : 'p1'));
            break;
        }

        case 'DISCARD_GEM': {
            const gemId = payload;
            const currentInv = newState.inventories[newState.turn];
            if (currentInv[gemId] > 0) {
                currentInv[gemId]--;
                // Return to bag
                newState.bag.push({ type: GEM_TYPES[gemId.toUpperCase()], uid: `discard-${Date.now()}` });
                
                const totalGems = Object.values(currentInv).reduce((a, b) => a + b, 0);
                if (totalGems <= 10) {
                    // Discard complete
                    const nextP = newState.nextPlayerAfterRoyal || (newState.turn === 'p1' ? 'p2' : 'p1');
                    finalizeTurn(nextP, currentInv);
                }
                // If still > 10, stay in DISCARD_EXCESS_GEMS mode (implied)
            }
            break;
        }

        case 'DEBUG_ADD_CROWNS': {
            const pid = payload;
            // Add crowns directly without adding a card
            if (!newState.extraCrowns) newState.extraCrowns = { p1: 0, p2: 0 };
            newState.extraCrowns[pid] = (newState.extraCrowns[pid] || 0) + 1;
            addFeedback(pid, 'crown', 1);
            finalizeTurn(newState.turn); // Check win condition
            break;
        }

        case 'DEBUG_ADD_POINTS': {
            const pid = payload;
            // Add points directly without adding a card
            if (!newState.extraPoints) newState.extraPoints = { p1: 0, p2: 0 };
            newState.extraPoints[pid] = (newState.extraPoints[pid] || 0) + 1;
            finalizeTurn(newState.turn); // Check win condition
            break;
        }

        case 'INITIATE_BUY_JOKER': {
            newState.pendingBuy = payload;
            newState.gameMode = 'SELECT_CARD_COLOR';
            return newState;
        }

        case 'BUY_CARD': {
            const { card, source, marketInfo } = payload;
            const player = newState.turn;
            const inv = newState.inventories[player];
            const tableau = newState.playerTableau[player];
            const buff = newState.playerBuffs?.[player];
            
            // 1. Calculate Payment & Deduct Gems
            newState.pendingBuy = null; // Clear pending state

            const bonuses = BONUS_COLORS.reduce((acc, color) => {
                const baseBonus = tableau.filter(c => c.bonusColor === color).reduce((sum, c) => sum + (c.bonusCount || 1), 0);
                acc[color] = baseBonus;
                return acc;
            }, {});

            // Cost Calculation with Buffs
            const buffDiscountColor = buff?.state?.discountColor;
            // Flexible Discount: Only applies to Level 2 and 3 cards
            const discountAny = (card.level === 2 || card.level === 3) ? (buff?.effects?.passive?.discountAny || 0) : 0;
            const l3Discount = (card.level === 3 && buff?.effects?.passive?.l3Discount) ? buff.effects.passive.l3Discount : 0;
            const totalFlatDiscount = discountAny + l3Discount;
            
            let rawCost = {};
            
            Object.entries(card.cost).forEach(([color, cost]) => {
                let discount = 0;
                if (color !== 'pearl') discount = bonuses[color] || 0;
                if (color === buffDiscountColor && cost > 0) discount += 1;
                
                const needed = Math.max(0, cost - discount);
                rawCost[color] = needed;
            });
            
            let remainingDiscount = totalFlatDiscount;
             Object.keys(rawCost).forEach(color => {
                 if (remainingDiscount > 0 && rawCost[color] > 0) {
                     const reduction = Math.min(rawCost[color], remainingDiscount);
                     rawCost[color] -= reduction;
                     remainingDiscount -= reduction;
                 }
             });

            let goldCost = 0;
            let gemsPaid = {}; // Track for Recycler
            
            Object.entries(rawCost).forEach(([color, needed]) => {
                const available = inv[color] || 0;
                const paid = Math.min(needed, available);
                
                inv[color] -= paid;
                gemsPaid[color] = paid;
                
                for(let k=0; k<paid; k++) {
                    newState.bag.push({ type: GEM_TYPES[color.toUpperCase()], uid: `returned-${color}-${Date.now()}-${k}` });
                }
                goldCost += (needed - paid);
            });
            
            // All-Seeing Eye Gold Buff (Gold counts double for L3)
            const isGoldBuff = buff?.effects?.passive?.goldBuff && card.level === 3;
            if (isGoldBuff) {
                goldCost = Math.ceil(goldCost / 2.0);
            }
            
            inv.gold -= goldCost;
            for(let k=0; k<goldCost; k++) {
                newState.bag.push({ type: GEM_TYPES.GOLD, uid: `returned-gold-${Date.now()}-${k}` });
            }

            // 2. Add Card to Tableau
            if (buff?.effects?.passive?.doubleBonusFirst5 && newState.playerTableau[player].length < 5) {
                card.bonusCount = 2;
                newState.toastMessage = "Minimalism: Card grants Double Bonus!";
            }
            newState.playerTableau[player].push(card);
            if (card.crowns > 0) {
                addFeedback(player, 'crown', card.crowns);
                // Bounty Hunter Check
                if (buff?.effects?.passive?.crownBonusGem) {
                    const basics = ['red', 'green', 'blue', 'white', 'black'];
                    const randColor = basics[Math.floor(Math.random() * basics.length)];
                    inv[randColor]++;
                    addFeedback(player, randColor, 1);
                    newState.toastMessage = "Bounty Hunter: +1 Gem!";
                }
            }
            
            // Recycler Check
            if (buff?.effects?.passive?.recycler && (card.level === 2 || card.level === 3)) {
                // Find a non-gold/pearl gem that was paid
                const paidColors = Object.keys(gemsPaid).filter(c => gemsPaid[c] > 0 && c !== 'pearl');
                if (paidColors.length > 0) {
                    const refundColor = paidColors[0];
                    inv[refundColor]++;
                    // Find and remove matching from bag
                    for (let i = newState.bag.length - 1; i >= 0; i--) {
                        if (newState.bag[i].type.id === refundColor) {
                            newState.bag.splice(i, 1);
                            break;
                        }
                    }
                    addFeedback(player, refundColor, 1);
                    newState.toastMessage = "Recycled 1 Gem!";
                }
            }

            // 3. Remove from Source & Refill
            if (source === 'market') {
                const { level, idx } = marketInfo;
                const deck = newState.decks[level];
                if (deck.length > 0) {
                    newState.market[level][idx] = deck.pop();
                } else {
                    newState.market[level][idx] = null;
                }
            } else if (source === 'reserved') {
                newState.playerReserved[player] = newState.playerReserved[player].filter(c => c.id !== card.id);
            }

            // 4. Handle Abilities
            let nextTurn = player === 'p1' ? 'p2' : 'p1';
            const abilities = Array.isArray(card.ability) ? card.ability : (card.ability ? [card.ability] : []);
            
            if (abilities.includes(ABILITIES.AGAIN.id)) nextTurn = player;
            
            if (abilities.includes(ABILITIES.BONUS_GEM.id)) {
                const hasGem = newState.board.some(row => row.some(g => g.type.id === card.bonusColor));
                if (hasGem) {
                    newState.gameMode = 'BONUS_ACTION';
                    newState.bonusGemTarget = card.bonusColor;
                    return newState; // Wait for bonus action
                } else {
                    newState.toastMessage = "No matching gem available - Skill skipped";
                }
            }
            
            if (abilities.includes(ABILITIES.SCROLL.id)) {
                const opponent = player === 'p1' ? 'p2' : 'p1';
                if ((newState.privileges.p1 + newState.privileges.p2) < 3) {
                    addPrivilege(player);
                }
                else if (newState.privileges[opponent] > 0) { 
                    newState.privileges[opponent]--; 
                    addFeedback(opponent, 'privilege', -1);
                    addPrivilege(player); 
                }
            }

            finalizeTurn(nextTurn);
            break;
        }

        case 'INITIATE_RESERVE': {
            newState.pendingReserve = payload;
            newState.gameMode = 'RESERVE_WAITING_GEM';
            return newState;
        }

        case 'INITIATE_RESERVE_DECK': {
            newState.pendingReserve = { ...payload, isDeck: true };
            newState.gameMode = 'RESERVE_WAITING_GEM';
            return newState;
        }

        case 'CANCEL_RESERVE': {
            newState.pendingReserve = null;
            newState.gameMode = 'IDLE';
            return newState;
        }

        case 'RESERVE_CARD': {
            const { card, level, idx, goldCoords } = payload;
            const player = newState.turn;
            newState.playerReserved[player].push(card);
            
            const deck = newState.decks[level];
            newState.market[level][idx] = deck.length > 0 ? deck.pop() : null;

            // Take Gold if coords provided
            if (goldCoords) {
                const { r, c } = goldCoords;
                if (newState.board[r][c].type.id === 'gold') {
                    newState.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
                    newState.inventories[player].gold++;
                    addFeedback(player, 'gold', 1);
                }
            }
            
            // Patient Investor Logic
            const buff = newState.playerBuffs?.[player];
            if (buff?.effects?.passive?.firstReserveBonus) {
                if (!buff.state) buff.state = {};
                if (!buff.state.hasReserved) {
                    buff.state.hasReserved = true;
                    newState.inventories[player].gold += 2; // Extra gold
                    addFeedback(player, 'gold', 2);
                    newState.toastMessage = "Patient Investor: +2 Gold!";
                }
            }

            newState.pendingReserve = null;
            newState.gameMode = 'IDLE';
            finalizeTurn(player === 'p1' ? 'p2' : 'p1');
            break;
        }

        case 'RESERVE_DECK': {
            const { level, goldCoords } = payload;
            const player = newState.turn;
            
            // Take top card from deck
            if (newState.decks[level].length > 0) {
                const card = newState.decks[level].pop();
                newState.playerReserved[player].push(card);
            }

            // Take Gold if coords provided
            if (goldCoords) {
                const { r, c } = goldCoords;
                if (newState.board[r][c].type.id === 'gold') {
                    newState.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
                    newState.inventories[player].gold++;
                    addFeedback(player, 'gold', 1);
                }
            }
            
            // Patient Investor Logic (Same as above)
            const buff = newState.playerBuffs?.[player];
            if (buff?.effects?.passive?.firstReserveBonus) {
                if (!buff.state) buff.state = {};
                if (!buff.state.hasReserved) {
                    buff.state.hasReserved = true;
                    newState.inventories[player].gold += 2;
                    addFeedback(player, 'gold', 2);
                    newState.toastMessage = "Patient Investor: +2 Gold!";
                }
            }

            newState.pendingReserve = null;
            newState.gameMode = 'IDLE';
            finalizeTurn(player === 'p1' ? 'p2' : 'p1');
            break;
        }

        case 'STEAL_GEM': {
            const { gemId } = payload;
            const player = newState.turn;
            const opponent = player === 'p1' ? 'p2' : 'p1';
            
            if (newState.inventories[opponent][gemId] > 0) {
                newState.inventories[opponent][gemId]--;
                newState.inventories[player][gemId] = (newState.inventories[player][gemId] || 0) + 1;
            }

            addFeedback(player, gemId, 1);
            addFeedback(opponent, gemId, -1);
            
            const totalGems = Object.values(newState.inventories[player]).reduce((a, b) => a + b, 0);
            if (totalGems > 10) {
                 newState.gameMode = 'DISCARD_EXCESS_GEMS';
                 return newState;
            }

            finalizeTurn(newState.nextPlayerAfterRoyal || opponent);
            break;
        }

        case 'FORCE_ROYAL_SELECTION': {
            newState.gameMode = 'SELECT_ROYAL';
            newState.nextPlayerAfterRoyal = newState.turn === 'p1' ? 'p2' : 'p1';
            // Clear any pending states to prevent conflicts
            newState.pendingReserve = null;
            newState.pendingBuy = null;
            newState.bonusGemTarget = null;
            return newState;
        }

        case 'SELECT_ROYAL_CARD': {
            const { card } = payload;
            const player = newState.turn;
            
            // 1. Move card from Royal Deck to Player
            newState.royalDeck = newState.royalDeck.filter(c => c.id !== card.id);
            newState.playerRoyals[player].push(card);
            if (card.crowns > 0) addFeedback(player, 'crown', card.crowns);

            // 2. Handle Abilities
            const abilities = Array.isArray(card.ability) ? card.ability : (card.ability ? [card.ability] : []);
            
            // Determine next turn (default to the pending player, or swap if not set)
            let nextTurn = newState.nextPlayerAfterRoyal || (player === 'p1' ? 'p2' : 'p1');
            
            if (abilities.includes(ABILITIES.AGAIN.id)) {
                nextTurn = player;
            }

            if (abilities.includes(ABILITIES.BONUS_GEM.id)) {
                const hasGem = newState.board.some(row => row.some(g => g.type.id === card.bonusColor));
                if (hasGem) {
                    newState.gameMode = 'BONUS_ACTION';
                    newState.bonusGemTarget = card.bonusColor;
                    if (!newState.nextPlayerAfterRoyal) newState.nextPlayerAfterRoyal = nextTurn;
                    return newState;
                } else {
                    newState.toastMessage = "No matching gem available - Skill skipped";
                }
            }

            if (abilities.includes(ABILITIES.STEAL.id)) {
                 const opponent = player === 'p1' ? 'p2' : 'p1';
                 // Extortion/Steal Immunity (Pacifist)
                 const oppBuff = newState.playerBuffs?.[opponent];
                 if (oppBuff?.effects?.passive?.immuneNegative) {
                     newState.toastMessage = "Steal blocked by Pacifist!";
                 } else {
                     const hasStealable = Object.entries(newState.inventories[opponent]).some(([key, count]) => key !== 'gold' && count > 0);
                     if (hasStealable) {
                         newState.gameMode = 'STEAL_ACTION';
                         if (!newState.nextPlayerAfterRoyal) newState.nextPlayerAfterRoyal = nextTurn;
                         return newState;
                     } else {
                         newState.toastMessage = "No stealable gem from opponent - Skill skipped";
                     }
                 }
            }

            if (abilities.includes(ABILITIES.SCROLL.id)) {
                const opponent = player === 'p1' ? 'p2' : 'p1';
                if ((newState.privileges.p1 + newState.privileges.p2) < 3) {
                    addPrivilege(player);
                }
                else if (newState.privileges[opponent] > 0) { 
                    newState.privileges[opponent]--; 
                    addFeedback(opponent, 'privilege', -1);
                    addPrivilege(player); 
                }
            }

            finalizeTurn(nextTurn);
            break;
        }

        case 'ACTIVATE_PRIVILEGE': {
            newState.gameMode = 'PRIVILEGE_ACTION';
            newState.privilegeGemCount = 0;
            return newState;
        }

        case 'USE_PRIVILEGE': {
            const { r, c } = payload;
            const gem = newState.board[r][c];
            const gemType = gem.type.id;
            
            if (gemType === 'gold' || gemType === 'empty') return newState;

            // 1. Take Gem
            newState.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
            newState.inventories[newState.turn][gemType] = (newState.inventories[newState.turn][gemType] || 0) + 1;
            addFeedback(newState.turn, gemType, 1);
            
            // 2. Buff Logic (Double Agent / High Roller)
            const buff = newState.playerBuffs?.[newState.turn];
            const hasDoubleAgent = buff?.effects?.passive?.privilegeBuff === 2;

            if (hasDoubleAgent) {
                if (typeof newState.privilegeGemCount === 'undefined') newState.privilegeGemCount = 0;
                newState.privilegeGemCount++;

                // Deduct Privilege on FIRST gem only
                if (newState.privilegeGemCount === 1) {
                    // Check Special Privilege first
                    if (buff?.state?.specialPrivilege > 0) {
                        buff.state.specialPrivilege = 0;
                        newState.toastMessage = "Used Special Privilege!";
                    } else if (newState.privileges[newState.turn] > 0) {
                        newState.privileges[newState.turn]--;
                        addFeedback(newState.turn, 'privilege', -1);
                    }
                }

                if (newState.privilegeGemCount < 2) {
                     const hasMoreGems = newState.board.some(row => row.some(g => g.type.id !== 'empty' && g.type.id !== 'gold'));
                     if (hasMoreGems) {
                         newState.toastMessage = "Double Agent: Select 2nd Gem!";
                         return newState;
                     }
                }
                newState.privilegeGemCount = 0;
            } else {
                // Standard Logic
                // Use Special Privilege first if available (High Roller)
                if (buff?.state?.specialPrivilege > 0) {
                     buff.state.specialPrivilege = 0;
                     newState.toastMessage = "Used Special Privilege!";
                } else if (newState.privileges[newState.turn] > 0) {
                    newState.privileges[newState.turn]--;
                    addFeedback(newState.turn, 'privilege', -1);
                }
            }

            newState.gameMode = 'IDLE';
            return newState;
        }
        
        case 'PEEK_DECK': {
            // Intelligence Buff Action
            const { level } = payload; 
            const deck = newState.decks[level];
            const top3 = deck.slice(-3).reverse(); // Top is end of array
            // Instead of Toast, use Active Modal
            newState.activeModal = {
                type: 'PEEK',
                data: {
                    cards: top3,
                    level: level
                }
            };
            return newState;
        }

        case 'CLOSE_MODAL': {
            newState.activeModal = null;
            return newState;
        }

        default:
            console.warn("Unknown action type:", type);
    }
    return newState;
};

export const useGameLogic = () => {
  // 1. Core State & History
  const { history, currentIndex, recordAction, undo, redo, canUndo, canRedo } = useActionHistory();
  const [gameState, setGameState] = useState(null);
  
  // 2. UI/Transient State (Not in history)
  const [selectedGems, setSelectedGems] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // 3. Initialization Logic
  const startGame = useCallback((options = { useBuffs: false }) => {
      const fullPool = generateGemPool();
      const initialBoardFlat = fullPool.slice(0, 25);
      const initialBag = fullPool.slice(25);
      const newBoard = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        const row = [];
        for (let c = 0; c < GRID_SIZE; c++) { row.push(initialBoardFlat[r * GRID_SIZE + c]); }
        newBoard.push(row);
      }
      const d1 = generateDeck(1); const d2 = generateDeck(2); const d3 = generateDeck(3);
      const market = { 3: d3.splice(0, 3), 2: d2.splice(0, 4), 1: d1.splice(0, 5) };
      const decks = { 1: d1, 2: d2, 3: d3 };
      
      const setupData = { board: newBoard, bag: initialBag, market, decks };

      if (options.useBuffs) {
          const level = Math.floor(Math.random() * 3) + 1;
          const levelBuffs = Object.values(BUFFS).filter(b => b.level === level);
          const draftPool = shuffleArray(levelBuffs).slice(0, 3);
          
          recordAction({ 
              type: 'INIT_DRAFT', 
              payload: { 
                  ...setupData, 
                  draftPool, 
                  buffLevel: level 
              } 
          });
      } else {
          recordAction({ type: 'INIT', payload: setupData });
      }
  }, [recordAction]);

  // 4. Rehydration Engine
  useEffect(() => {
    if (history.length === 0) return;
    let state = null;
    // Safety clamp to prevent accessing undefined history if states desync
    const limit = Math.min(currentIndex, history.length - 1);
    
    for (let i = 0; i <= limit; i++) {
        if (history[i]) state = applyAction(state, history[i]);
    }
    setGameState(state);
  }, [currentIndex, history]);

  // --- Helpers & Getters ---
  const getGemAt = (r, c) => (gameState && gameState.board && gameState.board[r] && gameState.board[r][c]) ? gameState.board[r][c] : null;
  const isSelected = (r, c) => selectedGems.some(s => s.r === r && s.c === c);
  
  const canAfford = useCallback((card) => {
    if (!gameState) return false;
    const player = gameState.turn;
    const inv = gameState.inventories[player];
    const tableau = gameState.playerTableau[player];
    const buff = gameState.playerBuffs?.[player];

    const bonuses = BONUS_COLORS.reduce((acc, color) => {
      acc[color] = tableau.filter(c => c.bonusColor === color).reduce((sum, c) => sum + (c.bonusCount || 1), 0);
      return acc;
    }, {});

    const buffDiscountColor = buff?.state?.discountColor;
    // Flexible Discount: Only applies to Level 2 and 3 cards
    const discountAny = (card.level === 2 || card.level === 3) ? (buff?.effects?.passive?.discountAny || 0) : 0;
    const totalFlatDiscount = discountAny + 
                             (card.level === 3 && buff?.effects?.passive?.l3Discount ? buff.effects.passive.l3Discount : 0);

    let rawCost = {};
    Object.entries(card.cost).forEach(([color, cost]) => {
      const discount = (color !== 'pearl' ? (bonuses[color] || 0) : 0) + (color === buffDiscountColor ? 1 : 0);
      rawCost[color] = Math.max(0, cost - discount);
    });

    let remainingDiscount = totalFlatDiscount;
    Object.keys(rawCost).forEach(color => {
      if (remainingDiscount > 0 && rawCost[color] > 0) {
        const reduction = Math.min(rawCost[color], remainingDiscount);
        rawCost[color] -= reduction;
        remainingDiscount -= reduction;
      }
    });

    let goldNeeded = Object.entries(rawCost).reduce((acc, [color, needed]) => acc + Math.max(0, needed - (inv[color] || 0)), 0);
    
    const isGoldBuff = buff?.effects?.passive?.goldBuff && card.level === 3;
    if (isGoldBuff) goldNeeded = Math.ceil(goldNeeded / 2.0);

    return inv.gold >= goldNeeded;
  }, [gameState]);

  const getPlayerScore = (pid) => {
      if (!gameState) return 0;
      const cardPoints = gameState.playerTableau[pid].reduce((acc, c) => acc + c.points, 0);
      const royalPoints = gameState.playerRoyals[pid].reduce((acc, c) => acc + c.points, 0);
      const extra = (gameState.extraPoints && gameState.extraPoints[pid]) || 0;
      
      let buffBonus = 0;
      const buffEffects = gameState.playerBuffs?.[pid]?.effects?.passive;
      if (buffEffects) {
          if (buffEffects.pointBonus) {
              buffBonus += (gameState.playerTableau[pid].length + gameState.playerRoyals[pid].length) * buffEffects.pointBonus;
          }
          if (buffEffects.level1Bonus) {
               const level1Count = gameState.playerTableau[pid].filter(c => c.level === 1).length;
               buffBonus += level1Count * buffEffects.level1Bonus;
          }
      }

      return cardPoints + royalPoints + extra + buffBonus;
  };

  const getCrownCount = (pid) => {
      if (!gameState) return 0;
      const allCards = [...gameState.playerTableau[pid], ...gameState.playerRoyals[pid]];
      const extra = (gameState.extraCrowns && gameState.extraCrowns[pid]) || 0;
      return allCards.reduce((acc, c) => acc + (c.crowns || 0), 0) + extra;
  };

  const validateGemSelection = (gems) => {
    if (gems.length <= 1) return { valid: true, hasGap: false };
    const sorted = [...gems].sort((a, b) => a.r - b.r || a.c - b.c);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const dr = last.r - first.r;
    const dc = last.c - first.c;
    const isRow = dr === 0;
    const isCol = dc === 0;
    const isDiag = Math.abs(dr) === Math.abs(dc);
    if (!isRow && !isCol && !isDiag) return { valid: false, error: "Must be in a straight line." };
    const span = Math.max(Math.abs(dr), Math.abs(dc));
    if (span > 2) return { valid: false, error: "Too far apart (Max 3 gems)." };
    if (sorted.length === 3) {
        const mid = sorted[1];
        if (mid.r * 2 !== first.r + last.r || mid.c * 2 !== first.c + last.c) {
            return { valid: false, error: "Gems must be contiguous." };
        }
    }
    const hasGap = (sorted.length === 2 && span === 2);
    return { valid: true, hasGap, error: null };
  };

  // --- Handlers (Now dispatch actions) ---
  const handleSelfGemClick = (gemId) => {
      if (!gameState || gameState.gameMode !== 'DISCARD_EXCESS_GEMS') return;
      if (gameState.winner) return;
      
      const inv = { ...gameState.inventories[gameState.turn] };
      if (inv[gemId] > 0) {
          recordAction({ type: 'DISCARD_GEM', payload: gemId });
      }
  };

  const handleGemClick = (r, c) => {
    if (!gameState) return;
    const gem = getGemAt(r, c);
    if (gameState.winner) return;
    if (!gem || !gem.type || gem.type.id === 'empty') return;

    if (gameState.gameMode === 'BONUS_ACTION') {
        if (gem.type.id !== gameState.bonusGemTarget) { setErrorMsg(`Must select a ${gameState.bonusGemTarget} gem!`); return; }
        recordAction({ type: 'TAKE_BONUS_GEM', payload: { r, c } });
        return;
    }

    if (gameState.gameMode === 'RESERVE_WAITING_GEM') {
        if (gem.type.id !== 'gold') { setErrorMsg("Must select a Gold gem!"); return; }
        
        if (gameState.pendingReserve.isDeck) {
             recordAction({ type: 'RESERVE_DECK', payload: { ...gameState.pendingReserve, goldCoords: { r, c } } });
        } else {
             recordAction({ type: 'RESERVE_CARD', payload: { ...gameState.pendingReserve, goldCoords: { r, c } } });
        }
        return;
    }

    if (gameState.gameMode === 'PRIVILEGE_ACTION') {
        if (gem.type.id === 'gold') { setErrorMsg("Cannot use Privilege on Gold."); return; }
        recordAction({ type: 'USE_PRIVILEGE', payload: { r, c } });
        return;
    }

    if (gameState.gameMode !== 'IDLE') return;

    if (isSelected(r, c)) {
      setSelectedGems(selectedGems.filter(g => g.r !== r || g.c !== c));
      return;
    }

    if (gem.type.id === 'gold') { setErrorMsg("Cannot take Gold directly!"); return; }
    
    const newSelection = [...selectedGems, { r, c }];
    if (newSelection.length > 3) { setErrorMsg("Max 3 gems."); return; }

    const check = validateGemSelection(newSelection);
    if (!check.valid) {
        setErrorMsg(check.error);
        return;
    }
    setSelectedGems(newSelection);
  };

  const handleOpponentGemClick = (gemId) => {
      if (!gameState || gameState.winner) return;
      if (gameState.gameMode !== 'STEAL_ACTION') return;
      
      if (gemId === 'gold') {
          setErrorMsg("Cannot steal Gold!");
          return;
      }
      
      const opponent = gameState.turn === 'p1' ? 'p2' : 'p1';
      if (gameState.inventories[opponent][gemId] > 0) {
          recordAction({ type: 'STEAL_GEM', payload: { gemId } });
      }
  };

  const handleConfirmTake = () => {
    if (selectedGems.length === 0) return;
    if (gameState.winner) return;
    const check = validateGemSelection(selectedGems);
    if (check.hasGap) { setErrorMsg("Cannot take with gaps! Fill the middle."); return; }
    
    // High Roller restriction: Cannot take 3 gems
    // High Roller restriction: Cannot take 3 gems (unless they are same color, but game rules say 3 same is impossible, only 2 same or 3 distinct)
    // Actually, game rule is: Take up to 3 adjacent gems (column, row, diagonal). 
    // High Roller desc: "Cannot 'Take 3 Gems'". This usually means "Take 3 distinct gems".
    // If user selects 3 gems, block it.
    // If user selects 2 pearl/gold (not possible normally), block.
    // So strictly: if selectedGems.length === 3, block.
    
    const buff = gameState.playerBuffs?.[gameState.turn];
    if (buff?.effects?.passive?.noTake3 && selectedGems.length === 3) {
        setErrorMsg("High Roller: Cannot take 3 gems!");
        return;
    }

    recordAction({ type: 'TAKE_GEMS', payload: { coords: selectedGems } });
    setSelectedGems([]); 
  };

  const handleReplenish = () => {
    if (gameState.winner) return;
    if (gameState.bag.length === 0) { setErrorMsg("Bag empty!"); return; }
    recordAction({ type: 'REPLENISH' });
  };

  const handleReserveCard = (card, level, idx) => {
      if (gameState.winner) return;
      if (gameState.playerReserved[gameState.turn].length >= 3) {
          setErrorMsg("Reserve full (max 3).");
          return;
      }
      
      // Check for gold on board
      let hasGold = false;
      for(let r=0; r<GRID_SIZE; r++) {
          for(let c=0; c<GRID_SIZE; c++) {
              if (gameState.board[r][c].type.id === 'gold') {
                  hasGold = true;
                  break;
              }
          }
          if(hasGold) break;
      }

      if (hasGold) {
          recordAction({ type: 'INITIATE_RESERVE', payload: { card, level, idx } });
          setErrorMsg("Select a Gold gem to take.");
      } else {
          recordAction({ type: 'RESERVE_CARD', payload: { card, level, idx } });
      }
  };
  
  const handleReserveDeck = (level) => {
      if (gameState.winner) return;
      if (gameState.playerReserved[gameState.turn].length >= 3) {
          setErrorMsg("Reserve full (max 3).");
          return;
      }
      if (gameState.decks[level].length === 0) {
          setErrorMsg("Deck empty!");
          return;
      }

      let hasGold = false;
      for(let r=0; r<GRID_SIZE; r++) {
          for(let c=0; c<GRID_SIZE; c++) {
              if (gameState.board[r][c].type.id === 'gold') {
                  hasGold = true;
                  break;
              }
          }
          if(hasGold) break;
      }

      const actionType = hasGold ? 'INITIATE_RESERVE_DECK' : 'RESERVE_DECK';
      recordAction({ type: actionType, payload: { level } });
  };

  const initiateBuy = (card, source = 'market', marketInfo = {}) => {
      if (gameState.winner) return;
      
      const affordable = canAfford(card);

      // Check for Joker (Gold bonus color)
      if (card.bonusColor === 'gold') {
          if (affordable) {
              recordAction({ type: 'INITIATE_BUY_JOKER', payload: { card, source, marketInfo } });
          } else {
              setErrorMsg("Cannot afford this card!");
          }
          return;
      }

      if (affordable) {
          recordAction({ type: 'BUY_CARD', payload: { card, source, marketInfo } });
      } else {
          setErrorMsg("Cannot afford this card!");
      }
  };

  const handleSelectBonusColor = (color) => {
      if (!gameState || gameState.gameMode !== 'SELECT_CARD_COLOR' || !gameState.pendingBuy) return;
      const { card, source, marketInfo } = gameState.pendingBuy;
      const modifiedCard = { ...card, bonusColor: color };
      recordAction({ type: 'BUY_CARD', payload: { card: modifiedCard, source, marketInfo } });
  };

  const handleSelectRoyal = (royalCard) => {
      if (gameState.winner) return;
      recordAction({ type: 'SELECT_ROYAL_CARD', payload: { card: royalCard } });
  };

  const handleCancelReserve = () => { 
      if (gameState.winner) return;
      recordAction({ type: 'CANCEL_RESERVE' });
  };
  const activatePrivilegeMode = () => {
      if (!gameState || gameState.winner) return;
      if (gameState.gameMode !== 'IDLE') return;
      
      if (gameState.privileges[gameState.turn] > 0) {
          const hasNonGold = gameState.board.some(row => row.some(g => g.type.id !== 'empty' && g.type.id !== 'gold'));
          if (!hasNonGold) { setErrorMsg("No gems available."); return; }
          
          recordAction({ type: 'ACTIVATE_PRIVILEGE' });
          setSelectedGems([]);
      }
  };
  const checkAndInitiateBuyReserved = (card, execute = false) => { 
      if (!gameState) return false;
      if (gameState.winner) return false;
      const affordable = canAfford(card);
      if (execute && affordable) initiateBuy(card, 'reserved'); 
      return affordable; 
  };

  const handleDebugAddCrowns = (pid) => {
      if (gameState.winner) return;
      recordAction({ type: 'DEBUG_ADD_CROWNS', payload: pid });
  };

  const handleDebugAddPoints = (pid) => {
      if (gameState.winner) return;
      recordAction({ type: 'DEBUG_ADD_POINTS', payload: pid });
  };

  const handleForceRoyal = () => {
      if (gameState.winner) return;
      recordAction({ type: 'FORCE_ROYAL_SELECTION' });
  };

  const handleSelectBuff = (buffId) => {
      // Pre-calculate random color for determinism (needed for Color Preference)
      const basics = ['red', 'green', 'blue', 'white', 'black'];
      const randomColor = basics[Math.floor(Math.random() * basics.length)];
      recordAction({ type: 'SELECT_BUFF', payload: { buffId, randomColor } });
  };

  const handleCloseModal = () => {
      recordAction({ type: 'CLOSE_MODAL' });
  };

  const handlePeekDeck = (level) => {
      recordAction({ type: 'PEEK_DECK', payload: { level } });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setErrorMsg(null), 2000);
    return () => clearTimeout(timeout);
  }, [errorMsg]);
  
  // Sync toast message from game state to UI state
  useEffect(() => {
    if (gameState?.toastMessage) {
      setErrorMsg(gameState.toastMessage);
    }
  }, [gameState?.toastMessage]);

  // If state is not yet initialized, return skeleton
  const safeState = gameState || INITIAL_STATE_SKELETON;

  return {
    state: { ...safeState, selectedGems, errorMsg },
    handlers: { startGame, handleSelfGemClick, handleGemClick, handleOpponentGemClick, handleConfirmTake, handleReplenish, handleReserveCard, handleReserveDeck, initiateBuy, handleSelectBonusColor, handleSelectRoyal, handleCancelReserve, activatePrivilegeMode, checkAndInitiateBuyReserved, handleDebugAddCrowns, handleDebugAddPoints, handleForceRoyal, handleSelectBuff, handleCloseModal, handlePeekDeck },
    getters: { getPlayerScore, isSelected, getCrownCount, canAfford },
    historyControls: { undo, redo, canUndo, canRedo, currentIndex, historyLength: history.length }
  };
};
