import { buildReplaySummary } from './writer';
import { loadReplaySession } from './loader';
import type { ReplayEndReason } from './types';
import type { ReplaySummary, ReplaySummaryOptions, ReplayVNext } from './types';

const deriveReplayEndReason = (
    replay: ReplayVNext,
    winner: ReplaySummary['winner']
): ReplayEndReason => {
    if (winner) {
        return 'normal';
    }

    return replay.match.endReason === 'aborted' ||
        replay.match.endReason === 'surrender' ||
        replay.match.endReason === 'disconnect'
        ? replay.match.endReason
        : null;
};

export const getReplaySummary = (
    replay: ReplayVNext,
    options: ReplaySummaryOptions = {}
): ReplaySummary => {
    if (!options.recompute) {
        return replay.summary;
    }

    const session = loadReplaySession(replay);
    return {
        ...buildReplaySummary(
            replay.events,
            session.finalState,
            session.finalStateHash,
            deriveReplayEndReason(replay, session.finalState.winner)
        ),
        summaryDerivedFrom: 'recomputed',
    };
};
