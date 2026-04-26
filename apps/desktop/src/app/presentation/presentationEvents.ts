import { GAME_PHASES } from '@gemduel/shared/constants';
import type { GameState, PlayerKey } from '@gemduel/shared/types';
import type {
    PresentationEvent,
    PresentationHistorySource,
    RoyalUnlockMilestone,
} from './presentationTypes';

const getMilestoneFlip = (
    previousState: GameState,
    nextState: GameState,
    player: PlayerKey
): 3 | 6 | null => {
    const previousMilestones = previousState.royalMilestones[player];
    const nextMilestones = nextState.royalMilestones[player];

    if (!previousMilestones?.[6] && nextMilestones?.[6]) {
        return 6;
    }

    if (!previousMilestones?.[3] && nextMilestones?.[3]) {
        return 3;
    }

    return null;
};

const getRoyalUnlockMilestone = (
    previousState: GameState,
    nextState: GameState,
    player: PlayerKey
): RoyalUnlockMilestone => {
    const milestoneFlip = getMilestoneFlip(previousState, nextState, player);
    if (milestoneFlip) {
        return milestoneFlip;
    }

    if (nextState.toastMessage?.toLowerCase().includes('royal envoy')) {
        return 'royal-envoy';
    }

    return 'forced';
};

export const derivePresentationEvents = (
    previousState: GameState | null,
    nextState: GameState,
    currentIndex: number,
    historySource: PresentationHistorySource,
    isReviewing: boolean
): PresentationEvent[] => {
    if (!previousState || isReviewing || historySource !== 'live') {
        return [];
    }

    if (
        previousState.phase === GAME_PHASES.SELECT_ROYAL ||
        nextState.phase !== GAME_PHASES.SELECT_ROYAL ||
        nextState.royalDeck.length === 0
    ) {
        return [];
    }

    const player = nextState.turn;
    const milestone = getRoyalUnlockMilestone(previousState, nextState, player);

    return [
        {
            id: `royal-unlock:${currentIndex}:${player}:${milestone}`,
            type: 'royal-unlock',
            player,
            milestone,
            createdAtIndex: currentIndex,
        },
    ];
};
