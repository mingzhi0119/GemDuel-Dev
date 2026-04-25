import { describe, expect, it } from 'vitest';
import { getPersistentWinnerForUi, shouldAutoEnterReplayReview } from '../replayReviewState';

describe('replayReviewState', () => {
    it('persists the winner modal only for the latest live history step', () => {
        expect(
            getPersistentWinnerForUi({
                winner: 'p1',
                historySource: 'live',
                historyLength: 5,
                currentIndex: 4,
            })
        ).toBe('p1');

        expect(
            getPersistentWinnerForUi({
                winner: 'p1',
                historySource: 'live',
                historyLength: 5,
                currentIndex: 2,
            })
        ).toBeNull();

        expect(
            getPersistentWinnerForUi({
                winner: 'p1',
                historySource: 'replay-import',
                historyLength: 5,
                currentIndex: 4,
            })
        ).toBeNull();
    });

    it('auto-enters review mode for imported replay histories only', () => {
        expect(
            shouldAutoEnterReplayReview({
                historySource: 'replay-import',
                historyLength: 3,
            })
        ).toBe(true);

        expect(
            shouldAutoEnterReplayReview({
                historySource: 'replay-import',
                historyLength: 0,
            })
        ).toBe(false);

        expect(
            shouldAutoEnterReplayReview({
                historySource: 'live',
                historyLength: 3,
            })
        ).toBe(false);
    });
});
