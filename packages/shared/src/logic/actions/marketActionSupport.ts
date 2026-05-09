import { GEM_TYPES } from '../../constants';
import { addFeedback, createStateScopedUid } from '../stateHelpers';
import type { BoardCell, Buff, BuyCardPayload, GameState, GemColor, PlayerKey } from '../../types';
import { pickDeterministicBasicGemColor } from '../deterministicRandom';

const createEmptyAllocationRow = () => ({
    blue: 0,
    white: 0,
    green: 0,
    black: 0,
    red: 0,
    gold: 0,
    pearl: 0,
});

export const ensureExtraAllocation = (state: GameState) => {
    if (!state.extraAllocation) {
        state.extraAllocation = {
            p1: createEmptyAllocationRow(),
            p2: createEmptyAllocationRow(),
        };
    }

    return state.extraAllocation;
};

export const grantRandomBasicGems = (
    state: GameState,
    player: PlayerKey,
    count: number,
    reason = 'bonus'
) => {
    const extraAllocation = ensureExtraAllocation(state);

    for (let index = 0; index < count; index += 1) {
        const gemColor = pickDeterministicBasicGemColor(state, `${reason}:${player}:${index}`);
        state.inventories[player][gemColor] += 1;
        extraAllocation[player][gemColor] += 1;
        addFeedback(state, player, gemColor, 1);
    }
};

export const returnPaidGemsToBag = (
    state: GameState,
    player: PlayerKey,
    gemsPaid: Partial<Record<GemColor, number>>
) => {
    for (const [color, paid] of Object.entries(gemsPaid)) {
        const gemColor = color as GemColor;
        const paidCount = paid ?? 0;
        if (paidCount <= 0) {
            continue;
        }

        state.inventories[player][gemColor] -= paidCount;
        let remainingToReturn = paidCount;
        const extraAvailable = state.extraAllocation?.[player]?.[gemColor] ?? 0;

        if (extraAvailable > 0) {
            const consumedExtra = Math.min(extraAvailable, remainingToReturn);
            ensureExtraAllocation(state)[player][gemColor] -= consumedExtra;
            remainingToReturn -= consumedExtra;
        }

        for (let index = 0; index < remainingToReturn; index += 1) {
            state.bag.push({
                type: GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES],
                uid: createStateScopedUid(state, `returned-${color}`, state.bag.length + index),
            } as BoardCell);
        }
    }
};

export const returnPaidGoldToBag = (state: GameState, player: PlayerKey, goldCost: number) => {
    if (goldCost <= 0) {
        return;
    }

    state.inventories[player].gold -= goldCost;
    let goldToReturn = goldCost;
    const extraGold = state.extraAllocation?.[player]?.gold ?? 0;

    if (extraGold > 0) {
        const consumedExtra = Math.min(extraGold, goldToReturn);
        ensureExtraAllocation(state)[player].gold -= consumedExtra;
        goldToReturn -= consumedExtra;
    }

    for (let index = 0; index < goldToReturn; index += 1) {
        state.bag.push({
            type: GEM_TYPES.GOLD,
            uid: createStateScopedUid(state, 'returned-gold', state.bag.length + index),
        } as BoardCell);
    }
};

export const refreshMarketCardSlot = (
    state: GameState,
    marketInfo: NonNullable<BuyCardPayload['marketInfo']>
) => {
    const { level, idx, isExtra, extraIdx } = marketInfo;
    const deck = state.decks[level];

    if (isExtra && extraIdx !== undefined) {
        const targetIdx = deck.length - (extraIdx + 1);
        if (targetIdx >= 0) {
            deck.splice(targetIdx, 1);
        }
        return;
    }

    state.market[level][idx] = deck.length > 0 ? deck.pop()! : null;
};

export const takeGoldFromBoardIfPresent = (
    state: GameState,
    player: PlayerKey,
    goldCoords?: { r: number; c: number }
) => {
    if (!goldCoords) {
        return;
    }

    const { r, c } = goldCoords;
    if (state.board[r][c].type.id !== 'gold') {
        return;
    }

    state.board[r][c] = {
        type: GEM_TYPES.EMPTY,
        uid: createStateScopedUid(state, `empty-${r}-${c}`),
    };
    state.inventories[player].gold += 1;
    addFeedback(state, player, 'gold', 1);
};

export const applyFirstReserveBonus = (state: GameState, player: PlayerKey, buff?: Buff | null) => {
    if (!buff?.effects?.passive?.firstReserveBonus) {
        return false;
    }

    if (!buff.state) {
        buff.state = {};
    }

    if (buff.state.hasReserved) {
        return false;
    }

    buff.state.hasReserved = true;
    state.inventories[player].gold += 1;
    ensureExtraAllocation(state)[player].gold += 1;
    addFeedback(state, player, 'gold', 1);
    state.toastMessage = 'Patient Investor: +1 Extra Gold!';
    return true;
};

export const applyReserveBonusGem = (state: GameState, player: PlayerKey, buff?: Buff | null) => {
    if (!buff?.effects?.passive?.reserveBonusGem) {
        return false;
    }

    grantRandomBasicGems(state, player, 1, 'reserve_bonus_gem');
    state.toastMessage = 'Nimble Fingers: +1 Gem!';
    return true;
};
