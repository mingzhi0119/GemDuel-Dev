import type { PlayerKey } from '@gemduel/shared/types';

interface ReplayReviewStateOptions {
    winner: PlayerKey | null;
    historySource: 'live' | 'replay-import';
    historyLength: number;
    currentIndex: number;
}

export const getPersistentWinnerForUi = ({
    winner,
    historySource,
    historyLength,
    currentIndex,
}: ReplayReviewStateOptions): PlayerKey | null => {
    if (!winner || historySource !== 'live' || historyLength === 0) {
        return null;
    }

    return currentIndex === historyLength - 1 ? winner : null;
};

export const shouldAutoEnterReplayReview = ({
    historySource,
    historyLength,
}: Pick<ReplayReviewStateOptions, 'historySource' | 'historyLength'>): boolean =>
    historySource === 'replay-import' && historyLength > 0;
