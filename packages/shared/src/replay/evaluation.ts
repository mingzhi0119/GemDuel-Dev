import { loadReplaySession } from './loader';
import {
    computeActionLegalityMetric,
    computeBuffImpactMetric,
    computeResourceEfficiencyMetric,
    computeTempoMetric,
    computeWinnerConsistencyMetric,
} from './metrics';
import type { EvaluationReport, LoadedReplaySession, ReplayVNext } from './types';

const resolveSession = (input: ReplayVNext | LoadedReplaySession): LoadedReplaySession =>
    'history' in input ? input : loadReplaySession(input);

const resolveReplay = (input: ReplayVNext | LoadedReplaySession): ReplayVNext =>
    'history' in input ? input.replay : input;

export const evaluateReplayPerformance = (
    input: ReplayVNext | LoadedReplaySession
): EvaluationReport => {
    const replay = resolveReplay(input);
    const session = resolveSession(input);

    const winnerConsistency = computeWinnerConsistencyMetric(replay, session);
    const actionLegality = computeActionLegalityMetric(replay, session);
    const tempo = computeTempoMetric(replay.summary);
    const resourceEfficiency = computeResourceEfficiencyMetric(replay, session);
    const buffImpact = computeBuffImpactMetric(replay);
    const confidence =
        (winnerConsistency.score +
            actionLegality.score +
            tempo.score +
            resourceEfficiency.score +
            buffImpact.score) /
        5;

    return {
        winnerConsistency,
        actionLegality,
        tempo,
        resourceEfficiency,
        buffImpact,
        confidence,
    };
};
