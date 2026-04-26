import type { PlayerKey } from '@gemduel/shared/types';

export type RoyalUnlockMilestone = 3 | 6 | 'royal-envoy' | 'forced';

export type PresentationEvent = {
    id: string;
    type: 'royal-unlock';
    player: PlayerKey;
    milestone: RoyalUnlockMilestone;
    createdAtIndex: number;
};

export type PresentationHistorySource = 'live' | 'replay-import';
