/**
 * Market Action Handlers
 *
 * Handles card purchase and reservation mechanics
 */

import { GEM_TYPES, ABILITIES, GAME_PHASES } from '../../constants';
import { calculateTransaction } from '../../utils';
import { addFeedback, addPrivilege } from '../stateHelpers';
import { finalizeTurn } from '../turnManager';
import {
    GameState,
    Card,
    GemColor,
    PlayerKey,
    BuyCardPayload,
    ReserveCardPayload,
    ReserveDeckPayload,
    CardAbility,
    BoardCell,
    InitiateBuyJokerPayload,
    InitiateReservePayload,
    InitiateReserveDeckPayload,
} from '../../types';

export const handleInitiateBuyJoker = (
    state: GameState,
    payload: InitiateBuyJokerPayload
): GameState => {
    state.pendingBuy = payload;
    state.phase = GAME_PHASES.SELECT_CARD_COLOR;
    return state;
};

export const handleBuyCard = (state: GameState, payload: BuyCardPayload): GameState => {
    const { card, source, marketInfo, randoms } = payload;
    const player = state.turn;
    const inv = state.inventories[player];
    const tableau = state.playerTableau[player];
    const buff = state.playerBuffs?.[player];

    state.pendingBuy = null;

    const { affordable, goldCost, gemsPaid } = calculateTransaction(card, inv, tableau, buff);

    if (!affordable) {
        state.toastMessage = 'Cannot afford this card!';
        return state;
    }

    // Return gems to bag (handling extra allocation)
    Object.entries(gemsPaid).forEach(([color, paid]) => {
        const gemColor = color as GemColor;
        inv[gemColor] -= paid as number;

        let remainingToReturn = paid as number;

        // Check if player has extra allocation for this color
        // If so, consume it (vanish) instead of returning to bag
        if (state.extraAllocation?.[player]?.[gemColor] > 0) {
            const extraAvailable = state.extraAllocation[player][gemColor];
            const amountConsumingExtra = Math.min(extraAvailable, remainingToReturn);

            state.extraAllocation[player][gemColor] -= amountConsumingExtra;
            remainingToReturn -= amountConsumingExtra;
        }

        for (let k = 0; k < remainingToReturn; k++) {
            state.bag.push({
                type: GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES],
                uid: `returned-${color}-${Date.now()}-${k}`,
            } as BoardCell);
        }
    });

    // Return gold to bag
    inv.gold -= goldCost;
    let goldToReturn = goldCost;

    if (state.extraAllocation?.[player]?.gold > 0) {
        const extraGold = state.extraAllocation[player].gold;
        const amountConsuming = Math.min(extraGold, goldToReturn);
        state.extraAllocation[player].gold -= amountConsuming;
        goldToReturn -= amountConsuming;
    }

    for (let k = 0; k < goldToReturn; k++) {
        state.bag.push({
            type: GEM_TYPES.GOLD,
            uid: `returned-gold-${Date.now()}-${k}`,
        } as BoardCell);
    }

    // Minimalism: Double Bonus for first 2 cards
    let finalCard = card;
    if (buff?.effects?.passive?.doubleBonusFirst5 && state.playerTableau[player].length < 2) {
        finalCard = { ...card, bonusCount: (card.bonusCount ?? 1) * 2 };
        state.toastMessage = 'Minimalist: Card grants Double Bonus!';
    }

    state.playerTableau[player].push(finalCard);

    // Handle crowns
    if (finalCard.crowns && finalCard.crowns > 0) {
        addFeedback(state, player, 'crown', finalCard.crowns);

        // Bounty Hunter: Gain gem for crown
        if (buff?.effects?.passive?.crownBonusGem) {
            const basics: GemColor[] = ['red', 'green', 'blue', 'white', 'black'];
            const randColor = (randoms?.bountyHunterColor ||
                basics[Math.floor(Math.random() * basics.length)]) as GemColor;
            inv[randColor]++;

            // Track as extra allocation
            if (!state.extraAllocation) {
                state.extraAllocation = {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                };
            }
            state.extraAllocation[player][randColor]++;

            addFeedback(state, player, randColor, 1);
            state.toastMessage = 'Bounty Hunter: +1 Gem!';
        }
    }

    // Recycler: Refund one gem on lvl 2/3 card
    if (buff?.effects?.passive?.recycler && (card.level === 2 || card.level === 3)) {
        // Discrepancy Fix: Refund the FIRST color in the cost list, not the most numerous.
        const costColors = Object.keys(card.cost).filter(
            (color) => card.cost[color as GemColor] > 0
        );
        const paidColors = Object.keys(gemsPaid).filter((c) => gemsPaid[c as GemColor] > 0);

        // Find the first color from the cost that was actually paid
        const refundColor = costColors.find((c) => paidColors.includes(c)) as GemColor | undefined;

        if (refundColor) {
            inv[refundColor]++;

            // Track as extra allocation
            if (!state.extraAllocation) {
                state.extraAllocation = {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                };
            }
            state.extraAllocation[player][refundColor]++;

            // Attempt to remove a returned gem of the same color from the bag
            for (let i = state.bag.length - 1; i >= 0; i--) {
                const bagItem = state.bag[i];
                if (
                    typeof bagItem === 'object' &&
                    'type' in bagItem &&
                    bagItem.type?.id === refundColor
                ) {
                    state.bag.splice(i, 1);
                    break;
                }
            }
            addFeedback(state, player, refundColor, 1);
            state.toastMessage = 'Recycled 1 Gem!';
        }
    }

    // Refresh market or remove from reserved
    if (source === 'market' && marketInfo) {
        const { level, idx } = marketInfo;
        const deck = state.decks[level];
        const isExtra = marketInfo.isExtra;
        const extraIdx = marketInfo.extraIdx;

        if (isExtra && level === 3 && extraIdx !== undefined) {
            // Remove specific card from deck (extra cards are deck.length - 2 and deck.length - 3)
            // extraIdx 1 -> length-2, extraIdx 2 -> length-3
            const targetIdx = deck.length - (extraIdx + 1);
            if (targetIdx >= 0) {
                deck.splice(targetIdx, 1);
            }
        } else {
            // Normal market behavior
            if (deck.length > 0) {
                state.market[level][idx] = deck.pop()!;
            } else {
                state.market[level][idx] = null;
            }
        }
    } else if (source === 'reserved') {
        state.playerReserved[player] = state.playerReserved[player].filter((c) => c.id !== card.id);
    }

    // Determine next turn
    let nextTurn: PlayerKey = player === 'p1' ? 'p2' : 'p1';
    const abilities = Array.isArray(card.ability)
        ? card.ability
        : card.ability
          ? [card.ability]
          : [];

    // AGAIN ability: repeat turn
    if (abilities.includes(ABILITIES.AGAIN.id as CardAbility)) {
        nextTurn = player;
    }

    // STEAL ability: steal gem from opponent
    if (abilities.includes(ABILITIES.STEAL.id as CardAbility)) {
        const opponent = player === 'p1' ? 'p2' : 'p1';
        const oppBuff = state.playerBuffs?.[opponent];

        // Check if opponent has Pacifist buff
        if (oppBuff?.effects?.passive?.immuneNegative) {
            state.toastMessage = 'Steal blocked by Pacifist!';
        } else {
            const hasStealable = Object.entries(state.inventories[opponent]).some(
                ([key, count]) => key !== 'gold' && count > 0
            );

            if (hasStealable) {
                state.phase = GAME_PHASES.STEAL_ACTION;
                // Save the intended next turn (handles AGAIN ability)
                state.nextPlayerAfterRoyal = nextTurn;
                return state;
            } else {
                state.toastMessage = 'No stealable gem from opponent - Skill skipped';
            }
        }
    }

    // BONUS_GEM ability: take a gem
    if (abilities.includes(ABILITIES.BONUS_GEM.id as CardAbility)) {
        const targetColor = String(card.bonusColor).toUpperCase();
        const hasGem = state.board.some((row) => row.some((g) => g.type.id === card.bonusColor));
        if (hasGem) {
            state.phase = GAME_PHASES.BONUS_ACTION;
            state.bonusGemTarget = GEM_TYPES[targetColor as keyof typeof GEM_TYPES];
            return state;
        } else {
            state.toastMessage = 'No matching gem available - Skill skipped';
        }
    }

    // SCROLL ability: gain privilege
    if (abilities.includes(ABILITIES.SCROLL.id)) {
        const opponent = player === 'p1' ? 'p2' : 'p1';
        if (state.privileges.p1 + state.privileges.p2 < 3) {
            addPrivilege(state, player);
        } else if (state.privileges[opponent] > 0) {
            state.privileges[opponent]--;
            addFeedback(state, opponent, 'privilege', -1);
            addPrivilege(state, player);
        }
    }

    finalizeTurn(state, nextTurn);
    return state;
};

export const handleInitiateReserve = (
    state: GameState,
    payload: InitiateReservePayload
): GameState => {
    state.pendingReserve = payload;
    state.phase = GAME_PHASES.RESERVE_WAITING_GEM;
    return state;
};

export const handleInitiateReserveDeck = (
    state: GameState,
    payload: InitiateReserveDeckPayload
): GameState => {
    state.pendingReserve = { ...payload, isDeck: true } as GameState['pendingReserve'];
    state.phase = GAME_PHASES.RESERVE_WAITING_GEM;
    return state;
};

export const handleCancelReserve = (state: GameState): GameState => {
    state.pendingReserve = null;
    state.phase = GAME_PHASES.IDLE;
    return state;
};

export const handleReserveCard = (state: GameState, payload: ReserveCardPayload): GameState => {
    const { card, level, idx, goldCoords } = payload;
    const player = state.turn;

    if (state.playerReserved[player].length >= 3) {
        state.toastMessage = 'Reserve limit reached!';
        return state;
    }

    state.playerReserved[player].push(card);

    const isExtra = payload.isExtra;
    const extraIdx = payload.extraIdx;
    const deck = state.decks[level];

    if (isExtra && level === 3 && extraIdx !== undefined) {
        // extraIdx 1 -> length-2, extraIdx 2 -> length-3
        const targetIdx = deck.length - (extraIdx + 1);
        if (targetIdx >= 0) {
            deck.splice(targetIdx, 1);
        }
    } else {
        state.market[level][idx] = deck.length > 0 ? deck.pop()! : null;
    }

    // Take gold gem if available
    if (goldCoords) {
        const { r, c } = goldCoords;
        if (state.board[r][c].type.id === 'gold') {
            state.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
            state.inventories[player].gold++;
            addFeedback(state, player, 'gold', 1);
        }
    }

    // Patient Investor: +1 gold on first reserve
    const buff = state.playerBuffs?.[player];
    if (buff?.effects?.passive?.firstReserveBonus) {
        if (!buff.state) buff.state = {};
        if (!buff.state.hasReserved) {
            buff.state.hasReserved = true;
            state.inventories[player].gold += 1;

            // Register as extra allocation so it won't return to bag
            if (!state.extraAllocation) {
                state.extraAllocation = {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                };
            }
            state.extraAllocation[player].gold = (state.extraAllocation[player].gold || 0) + 1;

            addFeedback(state, player, 'gold', 1);
            state.toastMessage = 'Patient Investor: +1 Extra Gold!';
        }
    }

    state.pendingReserve = null;
    state.phase = GAME_PHASES.IDLE;
    finalizeTurn(state, player === 'p1' ? 'p2' : 'p1');
    return state;
};

export const handleReserveDeck = (state: GameState, payload: ReserveDeckPayload): GameState => {
    const { level, goldCoords } = payload;
    const player = state.turn;

    if (state.playerReserved[player].length >= 3) {
        state.toastMessage = 'Reserve limit reached!';
        return state;
    }

    if (state.decks[level].length > 0) {
        const card = state.decks[level].pop()!;
        state.playerReserved[player].push(card);
    }

    // Take gold gem if available
    if (goldCoords) {
        const { r, c } = goldCoords;
        if (state.board[r][c].type.id === 'gold') {
            state.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
            state.inventories[player].gold++;
            addFeedback(state, player, 'gold', 1);
        }
    }

    // Patient Investor: +1 gold on first reserve
    const buff = state.playerBuffs?.[player];
    if (buff?.effects?.passive?.firstReserveBonus) {
        if (!buff.state) buff.state = {};
        if (!buff.state.hasReserved) {
            buff.state.hasReserved = true;
            state.inventories[player].gold += 1;

            // Register as extra allocation so it won't return to bag
            if (!state.extraAllocation) {
                state.extraAllocation = {
                    p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                    p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                };
            }
            state.extraAllocation[player].gold = (state.extraAllocation[player].gold || 0) + 1;

            addFeedback(state, player, 'gold', 1);
            state.toastMessage = 'Patient Investor: +1 Extra Gold!';
        }
    }

    state.pendingReserve = null;
    state.phase = GAME_PHASES.IDLE;
    finalizeTurn(state, player === 'p1' ? 'p2' : 'p1');
    return state;
};
