import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadReplaySession } from '../loader';
import { replayVNextSchema } from '../schema';
import { simulateAiVsAiReplay, simulateAiVsAiReplayBatch } from '../simulation';

const createDeterministicRandom = (seed = 123_456_789) => {
    let current = seed >>> 0;
    return () => {
        current = (current * 1_664_525 + 1_013_904_223) >>> 0;
        return current / 4_294_967_296;
    };
};

describe('AI vs AI replay simulation', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('simulates a backend-only AI match and returns a replay-ready result', () => {
        vi.spyOn(Math, 'random').mockImplementation(createDeterministicRandom());

        const result = simulateAiVsAiReplay({
            gameVersion: '5.2.11',
            useBuffs: false,
        });
        const session = loadReplaySession(result.replay);

        expect(result.status).toBe('completed');
        expect(replayVNextSchema.safeParse(result.replay).success).toBe(true);
        expect(result.summary.finalStateHash).toBe(session.finalStateHash);
        expect(result.finalStateHash).toBe(session.finalStateHash);
        expect(result.evaluation.confidence).toBeGreaterThanOrEqual(0);
        expect(result.actionsExecuted).toBe(result.replay.replayRevision);
    });

    it('marks truncated simulations as aborted replays', () => {
        vi.spyOn(Math, 'random').mockImplementation(createDeterministicRandom());

        const result = simulateAiVsAiReplay({
            gameVersion: '5.2.11',
            maxActions: 1,
        });

        expect(result.status).toBe('aborted');
        expect(result.abortReason).toBe('max_actions');
        expect(result.replay.match.endReason).toBe('aborted');
        expect(result.summary.endReason).toBe('aborted');
        expect(result.replay.match.winner).toBeNull();
    });

    it('can batch-generate multiple replay samples for backend evaluation runs', () => {
        vi.spyOn(Math, 'random').mockImplementation(createDeterministicRandom());

        const batch = simulateAiVsAiReplayBatch(3, {
            gameVersion: '5.2.11',
            useBuffs: false,
        });

        expect(batch).toHaveLength(3);
        expect(new Set(batch.map((entry) => entry.replay.createdAt)).size).toBe(3);
        expect(batch.every((entry) => entry.status === 'completed')).toBe(true);
    });

    it('keeps buff-enabled simulations replay-stable', () => {
        vi.spyOn(Math, 'random').mockImplementation(createDeterministicRandom());

        const result = simulateAiVsAiReplay({
            gameVersion: '5.2.11',
            useBuffs: true,
            mode: 'LOCAL_PVP',
        });
        const session = loadReplaySession(result.replay);

        expect(result.status).toBe('completed');
        expect(result.replay.summary.finalStateHash).toBe(session.finalStateHash);
    });
});
