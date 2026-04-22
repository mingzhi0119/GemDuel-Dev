import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadReplaySession } from '../loader';
import { readReplayVNext } from '../reader';
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

    it('preserves an explicit replay creation timestamp', () => {
        vi.spyOn(Math, 'random').mockImplementation(createDeterministicRandom());

        const createdAt = '2026-04-22T12:34:56.000Z';
        const result = simulateAiVsAiReplay({
            gameVersion: '5.2.11',
            useBuffs: true,
            createdAt,
        });

        expect(result.replay.createdAt).toBe(createdAt);
    });

    it('forces a winner when the simulation reaches max actions', () => {
        vi.spyOn(Math, 'random').mockImplementation(createDeterministicRandom());

        const result = simulateAiVsAiReplay({
            gameVersion: '5.2.11',
            maxActions: 1,
        });

        expect(result.status).toBe('completed');
        expect(result.abortReason).toBeNull();
        expect(result.replay.match.endReason).toBe('normal');
        expect(result.summary.endReason).toBe('normal');
        expect(result.replay.match.winner).toBe('p1');
        expect(result.summary.winner).toBe('p1');

        const readResult = readReplayVNext(JSON.stringify(result.replay), {
            verifySummary: 'full',
        });
        expect(readResult.diagnostics.summaryIntegrity).toBe('ok');
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

    it('keeps serialized buff-enabled replays stable after schema validation', () => {
        vi.spyOn(Math, 'random').mockImplementation(createDeterministicRandom());

        const result = simulateAiVsAiReplay({
            gameVersion: '5.2.11',
            useBuffs: true,
            mode: 'LOCAL_PVP',
        });
        const readResult = readReplayVNext(JSON.stringify(result.replay), {
            verifySummary: 'full',
        });
        const session = loadReplaySession(readResult.replay);

        expect(readResult.diagnostics.summaryIntegrity).toBe('ok');
        expect(session.finalStateHash).toBe(result.replay.summary.finalStateHash);
    });

    it('replays buff-enabled simulation batches without command-gate or FSM warnings', () => {
        vi.spyOn(Math, 'random').mockImplementation(createDeterministicRandom());
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const batch = simulateAiVsAiReplayBatch(20, {
            gameVersion: '5.2.11',
            useBuffs: true,
            mode: 'LOCAL_PVP',
        });
        const messages = [...warnSpy.mock.calls, ...errorSpy.mock.calls]
            .map((args) => args.map((value) => String(value)).join(' '))
            .filter((message) => message.includes('[COMMAND_GATE]') || message.includes('[FSM]'));

        expect(batch).toHaveLength(20);
        expect(messages).toEqual([]);
    });
});
