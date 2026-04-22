import {
    GameState,
    GameAction,
    Card,
    PlayerKey,
    GemCoord,
    BasicGemColor,
    MarketCardRef,
} from '../../types';
import { calculateTransaction } from '../../utils';
import { validateGemSelection } from '../validators';
import {
    canActionRunInPhase,
    getFsmPhaseSurfacePolicy,
    isBonusColorSelectionPhase,
    isDraftSelectionPhase,
    isRoyalSelectionPhase,
} from '../fsm';
import { ABILITIES } from '../../constants';

/**
 * Heuristic-based AI for Gem Duel
 */
export const computeAiAction = (state: GameState): GameAction | null => {
    const aiPlayer = state.turn;
    const opponent = aiPlayer === 'p1' ? 'p2' : 'p1';
    const surfacePolicy = getFsmPhaseSurfacePolicy(state.phase);

    // Priority 0: Handle Setup/Draft Phase
    if (isDraftSelectionPhase(state.phase)) {
        const pool = state.p2DraftPool || state.draftPool || [];
        if (pool.length > 0) {
            const chosenId = pool[Math.floor(Math.random() * pool.length)];
            const basics: BasicGemColor[] = ['red', 'green', 'blue', 'white', 'black'];
            const randomColor = basics[Math.floor(Math.random() * basics.length)];
            const action: GameAction = {
                type: 'SELECT_BUFF',
                payload: { buffId: chosenId, randomColor },
            };
            return action;
        }
        return null;
    }

    // Priority 1: Handle mandatory sub-phases first
    if (
        isRoyalSelectionPhase(state.phase) &&
        canActionRunInPhase('SELECT_ROYAL_CARD', state.phase)
    ) {
        // Just pick the one with most points for now
        const bestRoyal = [...state.royalDeck].sort((a, b) => b.points - a.points)[0];
        if (bestRoyal) {
            const action: GameAction = { type: 'SELECT_ROYAL_CARD', payload: { card: bestRoyal } };
            return action;
        }
    }

    if (
        surfacePolicy.selfGemRailMode === 'discard-self' &&
        canActionRunInPhase('DISCARD_GEM', state.phase)
    ) {
        // Discard the gem type we have the most of, but keep gold/pearls if possible
        const inv = state.inventories[aiPlayer];
        const discardOrder = (['red', 'green', 'blue', 'white', 'black'] as const)
            .filter((color) => inv[color] > 0)
            .sort((a, b) => inv[b] - inv[a]);

        if (discardOrder.length > 0) {
            const action: GameAction = { type: 'DISCARD_GEM', payload: discardOrder[0] };
            return action;
        }
        // Fallback to gold/pearl if no basics
        if (inv.pearl > 0) {
            const action: GameAction = { type: 'DISCARD_GEM', payload: 'pearl' };
            return action;
        }
        if (inv.gold > 0) {
            const action: GameAction = { type: 'DISCARD_GEM', payload: 'gold' };
            return action;
        }
    }

    if (
        surfacePolicy.opponentGemRailMode === 'steal-target' &&
        canActionRunInPhase('STEAL_GEM', state.phase)
    ) {
        const oppInv = state.inventories[opponent];
        const stealable = (['pearl', 'red', 'green', 'blue', 'white', 'black'] as const).filter(
            (c) => oppInv[c] > 0
        );
        if (stealable.length > 0) {
            const action: GameAction = { type: 'STEAL_GEM', payload: { gemId: stealable[0] } };
            return action;
        }
    }

    if (
        surfacePolicy.boardInteractionMode === 'bonus-target' &&
        canActionRunInPhase('TAKE_BONUS_GEM', state.phase)
    ) {
        // Find the target gem on board
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (state.board[r][c].type.id === state.bonusGemTarget?.id) {
                    const action: GameAction = { type: 'TAKE_BONUS_GEM', payload: { r, c } };
                    return action;
                }
            }
        }
    }

    if (isBonusColorSelectionPhase(state.phase) && canActionRunInPhase('BUY_CARD', state.phase)) {
        // Pick red as default for Joker
        const pending = state.pendingBuy!;
        const action: GameAction = {
            type: 'BUY_CARD',
            payload: {
                card: { ...pending.card, bonusColor: 'red' },
                source: pending.source,
                marketInfo: pending.marketInfo ? { ...pending.marketInfo } : undefined,
                randoms: { bountyHunterColor: 'red' },
            },
        };
        return action;
    }

    if (!canActionRunInPhase('TAKE_GEMS', state.phase)) return null;

    // Priority 2: Buy Cards
    const buyableFromMarket: Array<{ card: Card; marketInfo: MarketCardRef }> = [];
    for (const option of getVisibleMarketCards(state, aiPlayer)) {
        if (
            calculateTransaction(
                option.card,
                state.inventories[aiPlayer],
                state.playerTableau[aiPlayer],
                state.playerBuffs[aiPlayer],
                false
            ).affordable
        ) {
            buyableFromMarket.push(option);
        }
    }
    // Check Reserved
    const buyableFromReserved = state.playerReserved[aiPlayer].filter(
        (card) =>
            calculateTransaction(
                card,
                state.inventories[aiPlayer],
                state.playerTableau[aiPlayer],
                state.playerBuffs[aiPlayer],
                true
            ).affordable
    );

    // Pick "best" card to buy (heuristic: most points, then level)
    const allBuyable = [
        ...buyableFromMarket.map((item) => ({ ...item, source: 'market' as const })),
        ...buyableFromReserved.map((card) => ({ card, source: 'reserved' as const })),
    ].sort((a, b) => {
        if (b.card.points !== a.card.points) return b.card.points - a.card.points;
        return b.card.level - a.card.level;
    });

    if (allBuyable.length > 0) {
        const best = allBuyable[0];
        if (best.card.bonusColor === 'gold') {
            const action: GameAction = {
                type: 'INITIATE_BUY_JOKER',
                payload: {
                    card: best.card,
                    source: best.source,
                    marketInfo: 'marketInfo' in best ? { ...best.marketInfo } : undefined,
                },
            };
            return action;
        }
        const action: GameAction = {
            type: 'BUY_CARD',
            payload: {
                card: best.card,
                source: best.source,
                marketInfo: 'marketInfo' in best ? { ...best.marketInfo } : undefined,
                randoms: { bountyHunterColor: 'red' },
            },
        };
        return action;
    }

    // Priority 3: Replenish if board is very empty
    const emptyCount = state.board.flat().filter((cell) => cell.type.id === 'empty').length;
    if (emptyCount > 15 && state.bag.length > 0) {
        const action: GameAction = {
            type: 'REPLENISH',
            payload: { randoms: { expansionColor: 'red', extortionColor: 'blue' } },
        };
        return action;
    }

    // Priority 4: Take Gems
    // Simple heuristic: Find a 3-gem line that gives colors we need for cards in market
    const potentialLines = findValidGemLines(state);
    if (potentialLines.length > 0) {
        const currentTotal = Object.values(state.inventories[aiPlayer]).reduce((a, b) => a + b, 0);
        const playerBuff = state.playerBuffs[aiPlayer];
        const gemCap = playerBuff?.effects?.passive?.gemCap || 10;
        const remainingSpace = gemCap - currentTotal;

        // Sort by length descending
        const sortedLines = potentialLines.sort((a, b) => b.length - a.length);

        // Filter lines that fit in remaining space to avoid discard phase
        const safeLines = sortedLines.filter((line) => line.length <= remainingSpace);

        if (safeLines.length > 0) {
            const action: GameAction = { type: 'TAKE_GEMS', payload: { coords: safeLines[0] } };
            return action;
        }

        // If remainingSpace is 0 or no lines fit, we might be forced to skip or replenish
        // but finding gems usually means remainingSpace > 0.
    }

    // Priority 5: Reserve Card (if we have space)
    if (state.playerReserved[aiPlayer].length < 3) {
        const goldCoord = findGoldCoord(state);
        const reserveTarget = [...getVisibleMarketCards(state, aiPlayer)]
            .filter(
                (option) =>
                    option.card.level >= 2 ||
                    (option.marketInfo.isExtra === true && option.marketInfo.level === 1)
            )
            .sort((left, right) => {
                if (right.card.level !== left.card.level) return right.card.level - left.card.level;
                return right.card.points - left.card.points;
            })[0];

        if (reserveTarget) {
            const action: GameAction = {
                type: 'RESERVE_CARD',
                payload: {
                    card: reserveTarget.card,
                    level: reserveTarget.marketInfo.level,
                    idx: reserveTarget.marketInfo.idx,
                    ...(reserveTarget.marketInfo.isExtra
                        ? {
                              isExtra: true,
                              extraIdx: reserveTarget.marketInfo.extraIdx,
                          }
                        : {}),
                    ...(goldCoord ? { goldCoords: goldCoord } : {}),
                },
            };
            return action;
        }
    }

    // Final fallback: Replenish if anything left in bag
    if (state.bag.length > 0) {
        const action: GameAction = {
            type: 'REPLENISH',
            payload: { randoms: { expansionColor: 'red', extortionColor: 'blue' } },
        };
        return action;
    }

    return null; // Should not happen in a normal game
};

/**
 * Brute force search for valid gem lines on the board
 */
function findValidGemLines(state: GameState): GemCoord[][] {
    const validLines: GemCoord[][] = [];

    // Check all cells as starting points
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (state.board[r][c].type.id === 'empty' || state.board[r][c].type.id === 'gold')
                continue;

            // Try all directions: horizontal, vertical, 2 diagonals
            const directions = [
                [0, 1],
                [1, 0],
                [1, 1],
                [1, -1],
            ];

            for (const [dr, dc] of directions) {
                // Try lengths 3, 2, 1
                for (let len = 3; len >= 1; len--) {
                    const line: GemCoord[] = [];
                    let possible = true;
                    for (let i = 0; i < len; i++) {
                        const nr = r + dr * i;
                        const nc = c + dc * i;
                        if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5) {
                            possible = false;
                            break;
                        }
                        const cell = state.board[nr][nc];
                        if (cell.type.id === 'empty' || cell.type.id === 'gold') {
                            possible = false;
                            break;
                        }
                        line.push({ r: nr, c: nc });
                    }

                    if (possible && validateGemSelection(line).valid) {
                        validLines.push(line);
                    }
                }
            }
        }
    }
    return validLines;
}

const getVisibleMarketCards = (state: GameState, player: PlayerKey) => {
    const visibleCards: Array<{
        card: Card;
        marketInfo: MarketCardRef;
    }> = [];

    for (const lvl of [3, 2, 1] as const) {
        for (let i = 0; i < state.market[lvl].length; i += 1) {
            const card = state.market[lvl][i];
            if (card) {
                visibleCards.push({
                    card,
                    marketInfo: { level: lvl, idx: i },
                });
            }
        }
    }

    const visibilityBuffs = state.playerBuffs[player]?.effects?.passive;
    if (visibilityBuffs?.revealDeck1) {
        const topCard = state.decks[1][state.decks[1].length - 1];
        if (topCard) {
            visibleCards.push({
                card: topCard,
                marketInfo: { level: 1, idx: 0, isExtra: true, extraIdx: 0 },
            });
        }
    }

    if (visibilityBuffs?.extraL3) {
        const extraCards = [
            state.decks[3][state.decks[3].length - 2],
            state.decks[3][state.decks[3].length - 3],
        ];
        extraCards.forEach((card, index) => {
            if (!card) {
                return;
            }
            visibleCards.push({
                card,
                marketInfo: { level: 3, idx: index, isExtra: true, extraIdx: index + 1 },
            });
        });
    }

    return visibleCards;
};

const findGoldCoord = (state: GameState): GemCoord | null => {
    for (let r = 0; r < 5; r += 1) {
        for (let c = 0; c < 5; c += 1) {
            if (state.board[r][c].type.id === 'gold') {
                return { r, c };
            }
        }
    }

    return null;
};
