import { describe, expect, it } from 'vitest';
import { GAME_PHASES } from '@gemduel/shared/constants';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import type { GameState } from '@gemduel/shared/types';
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

        expect(event?.milestone).toBe('royal-envoy');
        expect(event?.id).toBe('royal-unlock:10:p1:royal-envoy');
    });

    it('uses forced fallback when SELECT_ROYAL starts without a known milestone trigger', () => {
        const { previousState, nextState } = createRoyalTransition();

        const [event] = derivePresentationEvents(previousState, nextState, 11, 'live', false);

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
});
