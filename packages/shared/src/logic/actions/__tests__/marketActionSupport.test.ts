import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GEM_TYPES } from '../../../constants';
import { BUFF_NONE, type GameState } from '../../../types';
import { createMockState } from '../../__tests__/testHelpers';
import {
    applyFirstReserveBonus,
    applyReserveBonusGem,
    ensureExtraAllocation,
    grantRandomBasicGems,
    refreshMarketCardSlot,
    returnPaidGemsToBag,
    returnPaidGoldToBag,
    takeGoldFromBoardIfPresent,
} from '../marketActionSupport';

const createState = (overrides: Partial<GameState> = {}): GameState =>
    JSON.parse(JSON.stringify(createMockState(overrides))) as GameState;

const getBasicGemTotal = (state: GameState, player: 'p1' | 'p2') =>
    state.inventories[player].red +
    state.inventories[player].green +
    state.inventories[player].blue +
    state.inventories[player].white +
    state.inventories[player].black;

const getBasicExtraAllocationTotal = (state: GameState, player: 'p1' | 'p2') =>
    state.extraAllocation[player].red +
    state.extraAllocation[player].green +
    state.extraAllocation[player].blue +
    state.extraAllocation[player].white +
    state.extraAllocation[player].black;

describe('marketActionSupport', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('initializes and reuses the extra allocation matrix', () => {
        const state = createState();
        delete (state as Partial<GameState>).extraAllocation;

        const first = ensureExtraAllocation(state);
        const second = ensureExtraAllocation(state);

        expect(first).toBe(second);
        expect(first.p1).toEqual({
            blue: 0,
            white: 0,
            green: 0,
            black: 0,
            red: 0,
            gold: 0,
            pearl: 0,
        });
    });

    it('grants random basic gems into both inventories and allocation tracking', () => {
        const state = createState();

        grantRandomBasicGems(state, 'p1', 2);

        expect(getBasicGemTotal(state, 'p1')).toBe(2);
        expect(getBasicExtraAllocationTotal(state, 'p1')).toBe(2);
    });

    it('returns paid gems and gold to the bag while consuming extra allocations first', () => {
        const state = createState();
        state.extraAllocation.p1.blue = 1;
        state.inventories.p1.blue = 3;
        state.inventories.p1.white = 2;
        const bagSize = state.bag.length;

        returnPaidGemsToBag(state, 'p1', { blue: 2, white: 1 });
        returnPaidGoldToBag(state, 'p1', 2);

        expect(state.inventories.p1.blue).toBe(1);
        expect(state.inventories.p1.white).toBe(1);
        expect(state.extraAllocation.p1.blue).toBe(0);
        expect(state.bag).toHaveLength(bagSize + 4);
        const tail = state.bag
            .slice(-4)
            .filter(
                (entry): entry is Exclude<(typeof state.bag)[number], string> =>
                    typeof entry !== 'string'
            );
        expect(tail).toHaveLength(4);
        expect(tail.map((entry) => entry.type.id).sort()).toEqual(
            [GEM_TYPES.BLUE.id, GEM_TYPES.WHITE.id, GEM_TYPES.GOLD.id, GEM_TYPES.GOLD.id].sort()
        );
    });

    it('refreshes regular market slots and trims extra level-3 cards in place', () => {
        const state = createState();
        const deckOne = {
            id: 'deck-one',
            level: 1,
            cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            points: 1,
        };
        const deckTwo = {
            id: 'deck-two',
            level: 1,
            cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            points: 2,
        };
        state.decks[1] = [deckOne, deckTwo] as never[];
        state.market[1] = [null];

        refreshMarketCardSlot(state, { level: 1, idx: 0 });

        expect(state.market[1][0]).toBe(deckTwo);
        expect(state.decks[1]).toEqual([deckOne]);

        const extraA = { id: 'extra-a', level: 3, cost: deckOne.cost, points: 3 };
        const extraB = { id: 'extra-b', level: 3, cost: deckOne.cost, points: 4 };
        const extraC = { id: 'extra-c', level: 3, cost: deckOne.cost, points: 5 };
        state.decks[3] = [extraA, extraB, extraC] as never[];

        refreshMarketCardSlot(state, { level: 3, idx: 0, isExtra: true, extraIdx: 1 });

        expect(state.decks[3]).toEqual([extraA, extraC]);
    });

    it('moves gold from the board and applies reserve bonuses', () => {
        const state = createState();
        state.board[0][0] = { type: GEM_TYPES.GOLD, uid: 'gold-0-0' };
        state.board[0][1] = { type: GEM_TYPES.RED, uid: 'red-0-1' };
        state.inventories.p1.gold = 0;

        takeGoldFromBoardIfPresent(state, 'p1', { r: 0, c: 0 });
        takeGoldFromBoardIfPresent(state, 'p1', { r: 0, c: 1 });
        expect(state.inventories.p1.gold).toBe(1);
        expect(state.board[0][0].type).toBe(GEM_TYPES.EMPTY);

        const buff = {
            ...BUFF_NONE,
            effects: { passive: { firstReserveBonus: 1, reserveBonusGem: true } },
        };
        const firstReserve = applyFirstReserveBonus(state, 'p1', buff);
        const reserveGem = applyReserveBonusGem(state, 'p1', buff);

        expect(firstReserve).toBe(true);
        expect(reserveGem).toBe(true);
        expect(buff.state?.hasReserved).toBe(true);
        expect(state.inventories.p1.gold).toBe(2);
    });
});
