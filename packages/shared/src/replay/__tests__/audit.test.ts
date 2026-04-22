import { describe, expect, it } from 'vitest';
import { applyAction } from '../../logic/gameReducer';
import { createGameSetupPayload } from '../../logic/gameSetup';
import { INITIAL_STATE_SKELETON } from '../../logic/initialState';
import {
    auditReplay,
    auditReplayBatch,
    buildReplayInitSnapshot,
    saveReplayVNext,
    type ReplayVNext,
} from '../index';

const createMinimalReplay = (): ReplayVNext => {
    const setup = createGameSetupPayload('LOCAL_PVP');
    const initAction = { type: 'INIT', payload: setup } as const;
    const nextState = applyAction(INITIAL_STATE_SKELETON, initAction);
    if (!nextState) {
        throw new Error('Failed to create minimal replay fixture.');
    }

    const { init, runtimeToInstance } = buildReplayInitSnapshot(initAction, nextState);
    return saveReplayVNext({
        replayRevision: 0,
        gameVersion: '5.2.11',
        createdAt: '2026-04-22T00:00:00.000Z',
        init,
        events: [],
        currentState: nextState,
        runtimeToInstance,
    });
};

describe('replay audit', () => {
    it('passes a valid replay with matching expectations', () => {
        const replay = createMinimalReplay();

        const result = auditReplay({
            id: 'minimal.json',
            value: replay,
            expected: {
                fileName: 'minimal.json',
                winner: null,
                endReason: null,
                turnCount: 0,
                totalEvents: 0,
                finalStateHash: replay.summary.finalStateHash,
            },
        });

        expect(result.ok).toBe(true);
        expect(result.mismatches).toEqual([]);
        expect(result.diagnostics?.summaryIntegrity).toBe('ok');
    });

    it('flags tampered summary hashes as audit mismatches', () => {
        const replay = createMinimalReplay();
        const tamperedReplay = {
            ...replay,
            summary: {
                ...replay.summary,
                finalStateHash: 'tampered-hash',
            },
        };

        const result = auditReplay({
            id: 'tampered.json',
            value: tamperedReplay,
        });

        expect(result.ok).toBe(false);
        expect(
            result.mismatches.some((mismatch) => mismatch.field === 'diagnostics.summaryIntegrity')
        ).toBe(true);
        expect(
            result.mismatches.some((mismatch) => mismatch.field === 'summary.finalStateHash')
        ).toBe(true);
    });

    it('aggregates batch mismatch counts and failures', () => {
        const replay = createMinimalReplay();
        const batch = auditReplayBatch([
            {
                id: 'good.json',
                value: replay,
                expected: { fileName: 'good.json', finalStateHash: replay.summary.finalStateHash },
            },
            {
                id: 'bad.json',
                value: {
                    ...replay,
                    summary: {
                        ...replay.summary,
                        finalStateHash: 'tampered-hash',
                    },
                },
            },
        ]);

        expect(batch.ok).toBe(false);
        expect(batch.auditedCount).toBe(2);
        expect(batch.passedCount).toBe(1);
        expect(batch.failedCount).toBe(1);
        expect(batch.mismatchCounts['summary.finalStateHash']).toBe(1);
    });

    it('flags illegal replay event sequences even when the file still parses', () => {
        const replay = createMinimalReplay();
        const invalidReplay = {
            ...replay,
            events: [
                {
                    type: 'steal_gem',
                    actor: 'p1',
                    gemId: 'blue',
                },
            ],
        } satisfies ReplayVNext;

        const result = auditReplay({
            id: 'invalid-sequence.json',
            value: invalidReplay,
        });

        expect(result.ok).toBe(false);
        expect(
            result.mismatches.some((mismatch) => mismatch.field.startsWith('sequence.event[0].'))
        ).toBe(true);
    });
});
