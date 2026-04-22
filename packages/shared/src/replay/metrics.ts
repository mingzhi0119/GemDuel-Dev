import { getPlayerScore } from '../logic/selectors';
import type {
    EvaluationMetric,
    LoadedReplaySession,
    ReplaySummary,
    ReplayVNext,
} from './types';

const clampScore = (score: number) => Math.max(0, Math.min(1, score));

export const computeTempoMetric = (summary: ReplaySummary): EvaluationMetric => {
    const turns = Math.max(summary.turnCount, 1);
    const actionsPerTurn = summary.totalEvents / turns;
    const score = clampScore(1 - Math.abs(actionsPerTurn - 2.25) / 4);

    return {
        score,
        note: `Average ${actionsPerTurn.toFixed(2)} replay events per turn.`,
    };
};

export const computeResourceEfficiencyMetric = (
    replay: ReplayVNext,
    session: LoadedReplaySession
): EvaluationMetric => {
    const winner = replay.match.winner;
    if (!winner) {
        return {
            score: 0.5,
            note: 'No winner was recorded, so resource efficiency is neutral.',
        };
    }

    const points = getPlayerScore(session.finalState, winner);
    const gems = Math.max(replay.summary.finalGemTotals[winner], 1);
    const score = clampScore(points / Math.max(gems, 1));

    return {
        score,
        note: `${winner} finished with ${points} score across ${gems} gems in inventory.`,
    };
};

export const computeBuffImpactMetric = (replay: ReplayVNext): EvaluationMetric => {
    const activeBuffs = [replay.players.p1.buff.id, replay.players.p2.buff.id].filter(
        (buffId) => buffId !== 'none'
    );
    const score = clampScore(activeBuffs.length / 2);

    return {
        score,
        note:
            activeBuffs.length > 0
                ? `Active buffs detected: ${activeBuffs.join(', ')}.`
                : 'No active buffs were recorded for either player.',
    };
};

export const computeWinnerConsistencyMetric = (
    replay: ReplayVNext,
    session: LoadedReplaySession
): EvaluationMetric => {
    const consistent =
        replay.match.winner === session.finalState.winner &&
        replay.summary.winner === session.finalState.winner &&
        replay.summary.finalStateHash === session.finalStateHash;

    return {
        score: consistent ? 1 : 0,
        note: consistent
            ? 'Replay winner, summary, and final state hash are consistent.'
            : 'Replay winner metadata disagrees with the reconstructed final state.',
    };
};

export const computeActionLegalityMetric = (
    replay: ReplayVNext,
    session: LoadedReplaySession
): EvaluationMetric => ({
    score: replay.summary.finalStateHash === session.finalStateHash ? 1 : 0,
    note:
        replay.summary.finalStateHash === session.finalStateHash
            ? 'All recorded actions replayed to the expected final state hash.'
            : 'Recorded actions did not replay to the expected final state hash.',
});
