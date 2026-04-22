/**
 * Market Action Handlers
 *
 * Handles card purchase and reservation mechanics
 */

import { GAME_PHASES } from '../../constants';
import { calculateTransaction } from '../../utils';
import { addFeedback } from '../stateHelpers';
import { finalizeTurn } from '../turnManager';
import { getPlayerScore, getCrownCount } from '../selectors';
import {
    continueAbilityResolution,
    createDeferredEchoReservoirWrite,
    getAbilityResolutionNextPlayer,
    getCardAbilitySnapshot,
    getStoredEchoReservoirSnapshot,
    startPurchaseAbilityResolution,
} from './abilityResolution';
import {
    applyFirstReserveBonus,
    applyReserveBonusGem,
    ensureExtraAllocation,
    grantRandomBasicGems,
    refreshMarketCardSlot,
    returnPaidGemsToBag,
    returnPaidGoldToBag,
    takeGoldFromBoardIfPresent,
} from './marketActionSupport';
import {
    canonicalizeDeterministicSaltToken,
    pickDeterministicBasicGemColor,
} from '../deterministicRandom';
import {
    GameState,
    Card,
    GemColor,
    PlayerKey,
    BuyCardPayload,
    ReserveCardPayload,
    ReserveDeckPayload,
    InitiateBuyJokerPayload,
    InitiateReservePayload,
    InitiateReserveDeckPayload,
} from '../../types';

export const handleInitiateBuyJoker = (
    state: GameState,
    payload: InitiateBuyJokerPayload
): GameState => {
    // Check if adding this card (points/crowns) triggers an instant win
    // We ignore the bonus color points for the check since we haven't picked it yet
    const player = state.turn;
    const currentPoints = getPlayerScore(state, player);
    const currentCrowns = getCrownCount(state, player);
    const winFX = state.playerBuffs?.[player]?.effects?.winCondition || {};

    const pPointsGoal = winFX.points || 20;
    const pCrownsGoal = winFX.crowns || 10;

    const potentialPoints = currentPoints + payload.card.points;
    const potentialCrowns = currentCrowns + (payload.card.crowns || 0);

    if (potentialPoints >= pPointsGoal || potentialCrowns >= pCrownsGoal) {
        // Instant win detected! Auto-assign color to highest scoring color to maximize stats
        const colors: GemColor[] = ['blue', 'white', 'green', 'black', 'red'];
        const bestColor = colors.reduce((a, b) => {
            const pointsA = state.playerTableau[player]
                .filter((c) => c.bonusColor === a)
                .reduce((sum, c) => sum + c.points, 0);
            const pointsB = state.playerTableau[player]
                .filter((c) => c.bonusColor === b)
                .reduce((sum, c) => sum + c.points, 0);
            return pointsA > pointsB ? a : b;
        });

        // Proceed directly to buy with auto-selected color
        return handleBuyCard(state, {
            card: { ...payload.card, bonusColor: bestColor },
            source: payload.source,
            marketInfo: payload.marketInfo,
            randoms: {
                bountyHunterColor: 'red', // Default fallback, will be randomized in logic if needed but not crit for win
            },
        });
    }

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

    const { affordable, goldCost, gemsPaid } = calculateTransaction(
        card,
        inv,
        tableau,
        buff,
        source === 'reserved'
    );

    if (!affordable) {
        state.toastMessage = 'Cannot afford this card!';
        return state;
    }

    returnPaidGemsToBag(state, player, gemsPaid);
    returnPaidGoldToBag(state, player, goldCost);

    // Minimalism: Double Bonus for first 2 cards
    let finalCard = card;
    if (buff?.effects?.passive?.doubleBonusFirst2 && state.playerTableau[player].length < 2) {
        finalCard = { ...card, bonusCount: (card.bonusCount ?? 1) * 2 };
        state.toastMessage = 'Minimalist: Card grants Double Bonus!';
    }

    state.playerTableau[player].push(finalCard);

    // Speculator: Gain 2 gems after buying reserved
    if (source === 'reserved' && buff?.effects?.passive?.buyReservedBonus) {
        const count = buff.effects.passive.buyReservedBonus;
        grantRandomBasicGems(state, player, count, 'buy_reserved_bonus');
        state.toastMessage = `Speculator: Recycled ${count} gems!`;
    }

    // Wonder Architect: Track Level 3 purchases
    if (finalCard.level === 3 && buff?.effects?.passive?.l3Discount) {
        if (!buff.state) buff.state = {};
        buff.state.l3PurchasedCount = ((buff.state.l3PurchasedCount as number) || 0) + 1;
    }

    // Handle crowns
    if (finalCard.crowns && finalCard.crowns > 0) {
        addFeedback(state, player, 'crown', finalCard.crowns);

        // Bounty Hunter: Gain gem for crown
        if (buff?.effects?.passive?.crownBonusGem) {
            const randColor = (randoms?.bountyHunterColor ??
                pickDeterministicBasicGemColor(
                    state,
                    `bounty_hunter:${player}:${canonicalizeDeterministicSaltToken(card.id)}:${state.playerTableau[player].length}`
                )) as GemColor;
            inv[randColor]++;

            ensureExtraAllocation(state)[player][randColor]++;

            addFeedback(state, player, randColor, 1);
            state.toastMessage = 'Bounty Hunter: +1 Gem!';
        }
    }

    // Recycler: Refund one basic gem from cost on lvl 2/3 card
    if (buff?.effects?.passive?.recycler && (card.level === 2 || card.level === 3)) {
        // Find the FIRST color in the cost object that was actually paid for
        const refundColor = (Object.keys(card.cost) as GemColor[]).find(
            (color) => card.cost[color] > 0 && color !== 'pearl' && color !== 'gold'
        );

        if (refundColor) {
            inv[refundColor]++;

            ensureExtraAllocation(state)[player][refundColor]++;

            addFeedback(state, player, refundColor, 1);
            state.toastMessage = `Recycled 1 ${refundColor.toUpperCase()}!`;
        }
    }

    // Refresh market or remove from reserved
    if (source === 'market' && marketInfo) {
        refreshMarketCardSlot(state, marketInfo);
    } else if (source === 'reserved') {
        state.playerReserved[player] = state.playerReserved[player].filter((c) => c.id !== card.id);
    }

    // Determine next turn
    const nextTurn: PlayerKey = player === 'p1' ? 'p2' : 'p1';
    const cardSnapshot = getCardAbilitySnapshot(card);
    const echoSnapshot = getStoredEchoReservoirSnapshot(buff);
    const deferredEchoWrite = createDeferredEchoReservoirWrite(state, player, card);

    startPurchaseAbilityResolution(state, nextTurn, cardSnapshot, echoSnapshot, deferredEchoWrite);

    if (continueAbilityResolution(state) === 'waiting') {
        return state;
    }

    finalizeTurn(state, getAbilityResolutionNextPlayer(state, nextTurn));
    return state;
};

export const handleDiscardReserved = (state: GameState, payload: { cardId: string }): GameState => {
    const player = state.turn;
    const cardIdx = state.playerReserved[player].findIndex((c) => c.id === payload.cardId);
    if (cardIdx === -1) return state;

    const card = state.playerReserved[player].splice(cardIdx, 1)[0];
    const buff = state.playerBuffs?.[player];

    if (buff?.effects?.active === 'discard_reserved' || buff?.id === 'puppet_master') {
        grantRandomBasicGems(state, player, 1, 'discard_reserved_bonus');
        state.toastMessage = 'Puppet Master: Card recycled!';
        // Put card at bottom of its corresponding deck
        if (card.level >= 1 && card.level <= 3) {
            state.decks[card.level as 1 | 2 | 3].unshift(card);
        }
    }

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
    const { card, level, idx, goldCoords, isSteal } = payload;
    const player = state.turn;
    const opponent = player === 'p1' ? 'p2' : 'p1';
    const buff = state.playerBuffs?.[player];

    if (state.playerReserved[player].length >= 3) {
        state.toastMessage = 'Reserve limit reached!';
        return state;
    }

    if (isSteal) {
        if (!buff?.effects?.passive?.stealReserved) {
            state.toastMessage = 'Requires Collector buff!';
            return state;
        }
        // Remove from opponent hand
        state.playerReserved[opponent] = state.playerReserved[opponent].filter(
            (c) => c.id !== card.id
        );
        state.playerReserved[player].push(card);
        state.toastMessage = 'The Collector: Card stolen!';
    } else {
        state.playerReserved[player].push(card);

        const isExtra = payload.isExtra;
        const extraIdx = payload.extraIdx;
        const deck = state.decks[level];

        if (isExtra && extraIdx !== undefined) {
            const targetIdx = deck.length - (extraIdx + 1);
            if (targetIdx >= 0) {
                deck.splice(targetIdx, 1);
            }
        } else if (level && idx !== undefined && state.market[level]) {
            state.market[level][idx] = deck.length > 0 ? deck.pop()! : null;
        }
    }

    takeGoldFromBoardIfPresent(state, player, goldCoords);
    applyFirstReserveBonus(state, player, buff);

    state.pendingReserve = null;
    state.phase = GAME_PHASES.IDLE;

    applyReserveBonusGem(state, player, buff);

    finalizeTurn(state, player === 'p1' ? 'p2' : 'p1');
    return state;
};

export const handleReserveDeck = (state: GameState, payload: ReserveDeckPayload): GameState => {
    const { level, goldCoords } = payload;
    const player = state.turn;
    const buff = state.playerBuffs?.[player];

    if (state.playerReserved[player].length >= 3) {
        state.toastMessage = 'Reserve limit reached!';
        return state;
    }

    if (state.decks[level].length > 0) {
        const card = state.decks[level].pop()!;
        state.playerReserved[player].push(card);
    }

    takeGoldFromBoardIfPresent(state, player, goldCoords);
    applyFirstReserveBonus(state, player, buff);

    state.pendingReserve = null;
    state.phase = GAME_PHASES.IDLE;

    applyReserveBonusGem(state, player, buff);

    finalizeTurn(state, player === 'p1' ? 'p2' : 'p1');
    return state;
};
