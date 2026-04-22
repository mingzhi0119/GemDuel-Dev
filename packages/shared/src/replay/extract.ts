import { buildReplaySummary } from './writer';
import { loadReplaySession } from './loader';
import type { ReplaySummary, ReplaySummaryOptions, ReplayVNext } from './types';

export const getReplaySummary = (
    replay: ReplayVNext,
    options: ReplaySummaryOptions = {}
): ReplaySummary => {
    if (!options.recompute) {
        return replay.summary;
    }

    const session = loadReplaySession(replay);
    return {
        ...buildReplaySummary(replay.events, session.finalState, session.finalStateHash),
        summaryDerivedFrom: 'recomputed',
    };
};
