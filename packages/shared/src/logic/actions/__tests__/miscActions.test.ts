import { describe, expect, it, vi } from 'vitest';
import { GEM_TYPES } from '../../../constants';
import { createMockState } from '../../__tests__/testHelpers';
import {
    handleCloseModal,
    handleDebugAddCrowns,
    handleDebugAddPoints,
    handleDebugAddPrivilege,
    handlePeekDeck,
} from '../miscActions';

vi.mock('../../stateHelpers', () => ({
    addFeedback: vi.fn(),
    addPrivilege: vi.fn(),
}));

vi.mock('../../turnManager', () => ({
    finalizeTurn: vi.fn(),
}));

const stateFactory = () =>
    JSON.parse(JSON.stringify(createMockState())) as ReturnType<typeof createMockState>;

describe('miscActions', () => {
    it('adds debug crowns and points through the turn finalizer', async () => {
        const { finalizeTurn } = await import('../../turnManager');
        const state = stateFactory();

        handleDebugAddCrowns(state, 'p1');
        handleDebugAddPoints(state, 'p2');

        expect(state.extraCrowns.p1).toBe(1);
        expect(state.extraPoints.p2).toBe(1);
        expect(finalizeTurn).toHaveBeenCalledWith(state, 'p1');
        expect(finalizeTurn).toHaveBeenCalledTimes(2);
    });

    it('routes debug privilege gain through the shared privilege helper', async () => {
        const { addPrivilege } = await import('../../stateHelpers');
        const state = stateFactory();

        handleDebugAddPrivilege(state, 'p2');

        expect(addPrivilege).toHaveBeenCalledWith(state, 'p2');
    });

    it('opens the peek modal with the top three cards in reverse order', () => {
        const state = stateFactory();
        const topCard = {
            id: 'deck-4',
            level: 1,
            cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            points: 4,
        };
        const midCard = {
            id: 'deck-3',
            level: 1,
            cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            points: 3,
        };
        const lowCard = {
            id: 'deck-2',
            level: 1,
            cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            points: 2,
        };
        state.decks[1] = [
            { id: 'deck-1', level: 1, cost: topCard.cost, points: 1 } as never,
            lowCard as never,
            midCard as never,
            topCard as never,
        ];

        handlePeekDeck(state, { level: 1 });

        expect(state.activeModal?.type).toBe('PEEK');
        expect(state.activeModal?.data.cards).toEqual([topCard, midCard, lowCard]);
        expect(state.activeModal?.data.initiator).toBe(state.turn);
    });

    it('opens the peek modal with L3, L2, and L1 top cards flattened in order', () => {
        const state = stateFactory();
        const createCard = (id: string, level: 1 | 2 | 3, points: number) =>
            ({
                id,
                level,
                cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                points,
            }) as never;

        state.decks[3] = [
            createCard('l3-low', 3, 1),
            createCard('l3-mid', 3, 2),
            createCard('l3-top', 3, 3),
        ];
        state.decks[2] = [
            createCard('l2-low', 2, 1),
            createCard('l2-mid', 2, 2),
            createCard('l2-top', 2, 3),
        ];
        state.decks[1] = [
            createCard('l1-low', 1, 1),
            createCard('l1-mid', 1, 2),
            createCard('l1-top', 1, 3),
        ];

        handlePeekDeck(state, { levels: [3, 2, 1] });

        expect(state.activeModal?.data.cards.map((card) => card.id)).toEqual([
            'l3-top',
            'l3-mid',
            'l3-low',
            'l2-top',
            'l2-mid',
            'l2-low',
            'l1-top',
            'l1-mid',
            'l1-low',
        ]);
    });

    it('closes the active modal without mutating other state', () => {
        const state = stateFactory();
        state.activeModal = {
            type: 'PEEK',
            data: {
                cards: [
                    {
                        id: 'c-1',
                        level: 1,
                        cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                        points: 1,
                    } as never,
                ],
                initiator: 'p1',
            },
        };

        handleCloseModal(state);

        expect(state.activeModal).toBeNull();
    });
});
