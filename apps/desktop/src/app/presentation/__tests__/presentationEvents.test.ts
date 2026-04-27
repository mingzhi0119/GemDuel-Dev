import { describe, expect, it } from 'vitest';
import { GAME_PHASES } from '@gemduel/shared/constants';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import type { Card, GameState } from '@gemduel/shared/types';
import { derivePresentationEvents } from '../presentationEvents';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

const createRoyalTransition = () => {
    const previousState = cloneState();
    const nextState = cloneState();

    previousState.phase = GAME_PHASES.IDLE;
    nextState.phase = GAME_PHASES.SELECT_ROYAL;
    previousState.turn = 'p1';
    nextState.turn = 'p1';

    return { previousState, nextState };
};

const RESERVED_FROM_DECK_CARD: Card = {
    id: 'reserve-from-deck-card',
    level: 2,
    cost: {
        blue: 0,
        white: 0,
        green: 0,
        black: 0,
        red: 0,
        pearl: 0,
        gold: 0,
    },
    points: 1,
    ability: 'none',
    bonusColor: 'blue',
    crowns: 0,
    bonusCount: 1,
};

const createCard = (id: string, level: 1 | 2 | 3 = 1): Card => ({
    ...RESERVED_FROM_DECK_CARD,
    id,
    level,
});

const setBoardGem = (
    state: GameState,
    row: number,
    col: number,
    color: 'blue' | 'white' | 'green' | 'black' | 'red' | 'pearl' | 'gold',
    uid = `${color}-${row}-${col}`
) => {
    state.board[row][col] = {
        type: { id: color, color, border: '', label: color },
        uid,
    };
};

describe('derivePresentationEvents', () => {
    it('enqueues royal unlock when entering SELECT_ROYAL at 3 crowns', () => {
        const { previousState, nextState } = createRoyalTransition();
        nextState.royalMilestones.p1[3] = true;

        const events = derivePresentationEvents(previousState, nextState, 4, 'live', false);

        expect(events).toEqual([
            {
                id: 'royal-unlock:4:p1:3',
                type: 'royal-unlock',
                player: 'p1',
                milestone: 3,
                createdAtIndex: 4,
            },
        ]);
    });

    it('enqueues royal unlock when entering SELECT_ROYAL at 6 crowns', () => {
        const { previousState, nextState } = createRoyalTransition();
        previousState.royalMilestones.p1[3] = true;
        nextState.royalMilestones.p1[3] = true;
        nextState.royalMilestones.p1[6] = true;

        const [event] = derivePresentationEvents(previousState, nextState, 9, 'live', false);

        expect(event).toMatchObject({
            id: 'royal-unlock:9:p1:6',
            player: 'p1',
            milestone: 6,
        });
    });

    it('uses royal-envoy fallback when SELECT_ROYAL starts without a milestone flip', () => {
        const { previousState, nextState } = createRoyalTransition();
        nextState.toastMessage = 'Royal Envoy opens the royal selection.';

        const [event] = derivePresentationEvents(previousState, nextState, 10, 'live', false);

        expect(event?.type).toBe('royal-unlock');
        if (event?.type !== 'royal-unlock') {
            throw new Error('Expected royal-unlock presentation event');
        }
        expect(event?.milestone).toBe('royal-envoy');
        expect(event?.id).toBe('royal-unlock:10:p1:royal-envoy');
    });

    it('uses forced fallback when SELECT_ROYAL starts without a known milestone trigger', () => {
        const { previousState, nextState } = createRoyalTransition();

        const [event] = derivePresentationEvents(previousState, nextState, 11, 'live', false);

        expect(event?.type).toBe('royal-unlock');
        if (event?.type !== 'royal-unlock') {
            throw new Error('Expected royal-unlock presentation event');
        }
        expect(event?.milestone).toBe('forced');
        expect(event?.id).toBe('royal-unlock:11:p1:forced');
    });

    it('does not enqueue in review mode or replay-import history', () => {
        const { previousState, nextState } = createRoyalTransition();
        nextState.royalMilestones.p1[3] = true;

        expect(derivePresentationEvents(previousState, nextState, 4, 'live', true)).toEqual([]);
        expect(
            derivePresentationEvents(previousState, nextState, 4, 'replay-import', false)
        ).toEqual([]);
    });

    it('does not enqueue duplicate events once already in SELECT_ROYAL', () => {
        const previousState = cloneState();
        const nextState = cloneState();
        previousState.phase = GAME_PHASES.SELECT_ROYAL;
        nextState.phase = GAME_PHASES.SELECT_ROYAL;
        nextState.royalMilestones.p1[3] = true;

        expect(derivePresentationEvents(previousState, nextState, 4, 'live', false)).toEqual([]);
    });

    it('marks deck reservations as deck-sourced card reserve flights', () => {
        const previousState = cloneState();
        const nextState = cloneState();
        nextState.playerReserved.p1 = [RESERVED_FROM_DECK_CARD];

        const [event] = derivePresentationEvents(previousState, nextState, 12, 'live', false);

        expect(event?.type).toBe('card-reserve');
        if (event?.type !== 'card-reserve') {
            throw new Error('Expected card-reserve presentation event');
        }
        expect(event.cardIds).toEqual([RESERVED_FROM_DECK_CARD.id]);
        expect(event.cards[0]).toMatchObject({
            cardId: RESERVED_FROM_DECK_CARD.id,
            source: { kind: 'deck', level: 2 },
            targetIndex: 0,
        });
    });

    it('tracks market reserve, market acquire, and reserved-to-tableau card flights', () => {
        const marketCard = createCard('market-card', 1);
        const reservedCard = createCard('reserved-card', 2);
        const previousState = cloneState();
        const nextState = cloneState();
        previousState.market[1] = [marketCard];
        previousState.playerReserved.p1 = [reservedCard];
        nextState.playerReserved.p1 = [marketCard];
        nextState.playerTableau.p1 = [reservedCard];

        const events = derivePresentationEvents(previousState, nextState, 13, 'live', false);

        expect(events).toEqual([
            expect.objectContaining({
                type: 'card-acquire',
                cardIds: ['reserved-card'],
                cards: [
                    expect.objectContaining({
                        cardId: 'reserved-card',
                        source: { kind: 'reserved', index: 0 },
                        targetIndex: 0,
                    }),
                ],
            }),
            expect.objectContaining({
                type: 'card-reserve',
                cardIds: ['market-card'],
                cards: [
                    expect.objectContaining({
                        cardId: 'market-card',
                        source: { kind: 'market', level: 1, index: 0 },
                        targetIndex: 0,
                    }),
                ],
            }),
        ]);
    });

    it('emits market-refill when a market slot changes', () => {
        const previousState = cloneState();
        const nextState = cloneState();
        previousState.market[2] = [createCard('old-market-card', 2)];
        nextState.market[2] = [createCard('new-market-card', 2)];

        const [event] = derivePresentationEvents(previousState, nextState, 14, 'live', false);

        expect(event).toEqual({
            id: 'market-refill:14:2.0:old-market-card>new-market-card',
            type: 'market-refill',
            slots: [
                expect.objectContaining({
                    level: 2,
                    index: 0,
                    previousCardId: 'old-market-card',
                    nextCardId: 'new-market-card',
                }),
            ],
            createdAtIndex: 14,
        });
    });

    it('emits gem flight, steal, discard, and board drop events from state deltas', () => {
        const previousState = cloneState();
        const nextState = cloneState();
        previousState.phase = GAME_PHASES.DISCARD_EXCESS_GEMS;
        nextState.phase = GAME_PHASES.IDLE;
        previousState.inventories.p1.blue = 1;
        nextState.inventories.p1.blue = 3;
        previousState.inventories.p1.red = 2;
        nextState.inventories.p1.red = 1;
        previousState.inventories.p1.green = 1;
        nextState.inventories.p1.green = 0;
        previousState.inventories.p2.green = 0;
        nextState.inventories.p2.green = 1;
        setBoardGem(previousState, 0, 0, 'blue', 'blue-before');
        setBoardGem(nextState, 0, 0, 'green', 'green-after');

        const events = derivePresentationEvents(previousState, nextState, 15, 'live', false);

        expect(events).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 'gem-steal:15:p1:p2:green:1',
                    type: 'gem-steal',
                    fromPlayer: 'p1',
                    toPlayer: 'p2',
                    deltas: { green: 1 },
                }),
                expect.objectContaining({
                    id: 'gem-flight:15:p1:blue:2',
                    type: 'gem-flight',
                    player: 'p1',
                    deltas: { blue: 2 },
                    sources: [{ row: 0, col: 0, color: 'blue' }],
                }),
                expect.objectContaining({
                    id: 'gem-discard:15:p1:red:1',
                    type: 'gem-discard',
                    player: 'p1',
                    deltas: { red: 1 },
                }),
                expect.objectContaining({
                    id: 'gem-drop:15:0.0',
                    type: 'gem-drop',
                    cells: [{ row: 0, col: 0, color: 'green' }],
                }),
            ])
        );
    });

    it('emits ability callouts for phase, feedback, extra-turn, resolution, toast, and handoff changes', () => {
        const previousState = cloneState();
        const nextState = cloneState();
        nextState.phase = GAME_PHASES.BONUS_ACTION;
        nextState.turn = 'p2';
        nextState.pendingExtraTurn = true;
        nextState.abilityResolution = { nextPlayer: 'p1', pending: [], resolved: [] };
        nextState.lastFeedback = {
            uid: 'feedback-1',
            items: [
                { player: 'p1', type: 'crown', diff: 2 },
                { player: 'p1', type: 'privilege', diff: 1 },
                { player: 'p2', type: 'extortion', diff: 1 },
                { player: 'p2', type: 'mystery', diff: 1 },
            ],
        };
        nextState.toastMessage = 'A custom ability resolved.';

        const events = derivePresentationEvents(previousState, nextState, 16, 'live', false);

        expect(events).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ type: 'ability-callout', callout: 'bonus-gem' }),
                expect.objectContaining({ type: 'ability-callout', callout: 'extra-turn' }),
                expect.objectContaining({
                    type: 'ability-callout',
                    callout: 'ability-resolution',
                }),
                expect.objectContaining({ type: 'ability-callout', callout: 'crown' }),
                expect.objectContaining({
                    type: 'ability-callout',
                    callout: 'privilege-gain',
                }),
                expect.objectContaining({ type: 'ability-callout', callout: 'extortion' }),
                expect.objectContaining({ type: 'ability-callout', callout: 'buff' }),
                expect.objectContaining({ type: 'ability-callout', callout: 'toast' }),
                expect.objectContaining({
                    id: 'turn-handoff:16:p1:p2',
                    type: 'turn-handoff',
                    fromPlayer: 'p1',
                    toPlayer: 'p2',
                }),
            ])
        );
    });
});
