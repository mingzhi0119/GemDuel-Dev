import { afterEach, describe, expect, it, vi } from 'vitest';
import { BUFFS } from '../../constants';
import { generateGameStateHash } from '../../utils/checksum';
import { applyAction } from '../gameReducer';
import { createGameSetupPayload } from '../gameSetup';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { pickDeterministicBasicGemColor } from '../deterministicRandom';
import type { GameAction, GameState, PlayerKey } from '../../types';

const cloneState = <T>(value: T): T => structuredClone(value);
const RUNTIME_CARD_SUFFIX_PATTERN = /-\d{13}-[a-z0-9]+$/i;

const toReplayInstanceState = (state: GameState): GameState => {
    const nextState = cloneState(state);
    const counters = new Map<string, number>();

    const convertCard = <T extends { id: string } | null>(card: T): T => {
        if (!card) {
            return card;
        }

        const templateId = card.id.replace(RUNTIME_CARD_SUFFIX_PATTERN, '');
        const nextSeq = counters.get(templateId) ?? 0;
        counters.set(templateId, nextSeq + 1);
        return {
            ...card,
            id: `c:${templateId}#${nextSeq}`,
        };
    };

    nextState.market = {
        1: nextState.market[1].map((card) => convertCard(card)),
        2: nextState.market[2].map((card) => convertCard(card)),
        3: nextState.market[3].map((card) => convertCard(card)),
    };
    nextState.decks = {
        1: nextState.decks[1].map((card) => convertCard(card)!),
        2: nextState.decks[2].map((card) => convertCard(card)!),
        3: nextState.decks[3].map((card) => convertCard(card)!),
    };
    nextState.playerTableau = {
        p1: nextState.playerTableau.p1.map((card) => convertCard(card)!),
        p2: nextState.playerTableau.p2.map((card) => convertCard(card)!),
    };
    nextState.playerReserved = {
        p1: nextState.playerReserved.p1.map((card) => convertCard(card)!),
        p2: nextState.playerReserved.p2.map((card) => convertCard(card)!),
    };

    return nextState;
};

const createInitializedState = (): GameState => {
    const initAction = {
        type: 'INIT',
        payload: createGameSetupPayload('LOCAL_PVP'),
    } as const;
    const nextState = applyAction(INITIAL_STATE_SKELETON, initAction);
    if (!nextState) {
        throw new Error('Failed to build initialized test state.');
    }

    return nextState;
};

const moveMarketCardToReserved = (
    state: GameState,
    player: PlayerKey,
    level: 1 | 2 | 3,
    idx: number
) => {
    const card = state.market[level][idx];
    if (!card) {
        throw new Error(`Missing market card at level ${level}, index ${idx}.`);
    }

    state.playerReserved[player].push(card);
    state.market[level][idx] = state.decks[level].pop() ?? null;
};

const createSpeculatorPurchaseState = (): GameState => {
    const state = createInitializedState();
    moveMarketCardToReserved(state, 'p1', 1, 0);
    state.playerBuffs.p1 = cloneState(BUFFS.SPECULATOR);
    state.playerBuffs.p1.state = {};
    state.inventories.p1 = {
        red: 10,
        green: 10,
        blue: 10,
        white: 10,
        black: 10,
        gold: 10,
        pearl: 10,
    };
    return state;
};

const findMarketCrownCard = (state: GameState): { level: 1 | 2 | 3; idx: number } => {
    for (const level of [1, 2, 3] as const) {
        for (let idx = 0; idx < state.market[level].length; idx += 1) {
            const card = state.market[level][idx];
            if (card && (card.crowns ?? 0) > 0 && card.bonusColor !== 'gold') {
                return { level, idx };
            }
        }
    }

    throw new Error('Could not find a crown-bearing non-joker market card for testing.');
};

const createBountyHunterPurchaseState = (): {
    state: GameState;
    level: 1 | 2 | 3;
    idx: number;
} => {
    const state = createInitializedState();
    const { level, idx } = findMarketCrownCard(state);
    state.playerBuffs.p1 = cloneState(BUFFS.BOUNTY_HUNTER);
    state.playerBuffs.p1.state = {};
    state.inventories.p1 = {
        red: 10,
        green: 10,
        blue: 10,
        white: 10,
        black: 10,
        gold: 10,
        pearl: 10,
    };
    return { state, level, idx };
};

const findSingleGemAction = (state: GameState): Extract<GameAction, { type: 'TAKE_GEMS' }> => {
    for (let r = 0; r < state.board.length; r += 1) {
        for (let c = 0; c < state.board[r].length; c += 1) {
            const gemId = state.board[r][c].type.id;
            if (gemId !== 'empty' && gemId !== 'gold') {
                return {
                    type: 'TAKE_GEMS',
                    payload: {
                        coords: [{ r, c }],
                    },
                };
            }
        }
    }

    throw new Error('Could not find a playable gem on the board.');
};

const createHoarderTurnState = (): {
    state: GameState;
    action: Extract<GameAction, { type: 'TAKE_GEMS' }>;
} => {
    const state = createInitializedState();
    moveMarketCardToReserved(state, 'p2', 1, 0);
    moveMarketCardToReserved(state, 'p2', 1, 1);
    moveMarketCardToReserved(state, 'p2', 1, 2);
    state.playerBuffs.p2 = cloneState(BUFFS.HOARDER);
    state.playerBuffs.p2.state = {};

    return {
        state,
        action: findSingleGemAction(state),
    };
};

describe('deterministic bonus rewards', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('keeps reserved-purchase bonus gems deterministic across identical states', () => {
        const randomSequence = [0.0, 0.2, 0.4, 0.6, 0.8];
        vi.spyOn(Math, 'random').mockImplementation(() => randomSequence.shift() ?? 0.9);

        const baseState = createSpeculatorPurchaseState();
        const stateA = cloneState(baseState);
        const stateB = cloneState(baseState);
        const actionA: GameAction = {
            type: 'BUY_CARD',
            payload: {
                card: stateA.playerReserved.p1[0],
                source: 'reserved',
            },
        };
        const actionB: GameAction = {
            type: 'BUY_CARD',
            payload: {
                card: stateB.playerReserved.p1[0],
                source: 'reserved',
            },
        };

        const nextA = applyAction(stateA, actionA);
        const nextB = applyAction(stateB, actionB);

        expect(nextA).not.toBeNull();
        expect(nextB).not.toBeNull();
        expect(nextA?.inventories.p1).toEqual(nextB?.inventories.p1);
        expect(nextA?.extraAllocation.p1).toEqual(nextB?.extraAllocation.p1);
    });

    it('keeps turn-transition hoarder rewards deterministic across identical states', () => {
        const randomSequence = [0.1, 0.3, 0.5, 0.7, 0.9];
        vi.spyOn(Math, 'random').mockImplementation(() => randomSequence.shift() ?? 0.95);

        const { state: baseState, action } = createHoarderTurnState();
        const stateA = cloneState(baseState);
        const stateB = cloneState(baseState);

        const nextA = applyAction(stateA, action);
        const nextB = applyAction(stateB, action);

        expect(nextA).not.toBeNull();
        expect(nextB).not.toBeNull();
        expect(nextA?.inventories.p2).toEqual(nextB?.inventories.p2);
        expect(nextA?.extraAllocation.p2).toEqual(nextB?.extraAllocation.p2);
    });

    it('normalizes runtime and replay card identities into the same deterministic seed', () => {
        const runtimeState = createSpeculatorPurchaseState();
        const replayState = toReplayInstanceState(runtimeState);
        const salt = 'reserve_bonus_gem:p1:0';

        expect(generateGameStateHash(runtimeState)).toBe(generateGameStateHash(replayState));
        expect(pickDeterministicBasicGemColor(runtimeState, salt)).toBe(
            pickDeterministicBasicGemColor(replayState, salt)
        );
    });

    it('keeps bounty-hunter crown rewards stable across runtime and replay card ids', () => {
        const { state: runtimeState, level, idx } = createBountyHunterPurchaseState();
        const replayState = toReplayInstanceState(runtimeState);
        const runtimeCard = runtimeState.market[level][idx];
        const replayCard = replayState.market[level][idx];

        if (!runtimeCard || !replayCard) {
            throw new Error('Expected matching market cards for bounty-hunter test.');
        }

        const runtimeNext = applyAction(runtimeState, {
            type: 'BUY_CARD',
            payload: {
                card: runtimeCard,
                source: 'market',
                marketInfo: { level, idx },
            },
        });
        const replayNext = applyAction(replayState, {
            type: 'BUY_CARD',
            payload: {
                card: replayCard,
                source: 'market',
                marketInfo: { level, idx },
            },
        });

        expect(runtimeNext).not.toBeNull();
        expect(replayNext).not.toBeNull();
        expect(runtimeNext?.inventories.p1).toEqual(replayNext?.inventories.p1);
        expect(runtimeNext?.extraAllocation.p1).toEqual(replayNext?.extraAllocation.p1);
    });
});
