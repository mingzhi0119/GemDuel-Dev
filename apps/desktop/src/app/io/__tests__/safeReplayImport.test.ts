import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import { applyAction } from '@gemduel/shared/logic/gameReducer';
import { createGameSetupPayload } from '@gemduel/shared/logic/gameSetup';
import { buildReplayInitSnapshot, saveReplayVNext } from '@gemduel/shared/replay';
import {
    importReplayFromFile,
    parseReplayTextBoundary,
    validateReplayFileBoundary,
    type ReplayImportFile,
} from '../safeReplayImport';

const createReplayJson = () => {
    const setup = createGameSetupPayload('LOCAL_PVP');
    const initAction = { type: 'INIT', payload: setup } as const;
    const nextState = applyAction(INITIAL_STATE_SKELETON, initAction);
    if (!nextState) {
        throw new Error('Failed to create replay fixture.');
    }

    const { init, runtimeToInstance } = buildReplayInitSnapshot(initAction, nextState);
    return JSON.stringify(
        saveReplayVNext({
            replayRevision: 0,
            gameVersion: '5.2.11',
            createdAt: '2026-04-19T00:00:00.000Z',
            init,
            events: [],
            currentState: nextState,
            runtimeToInstance,
        })
    );
};

const createReplayFileStub = (overrides: Partial<ReplayImportFile> = {}): ReplayImportFile => ({
    name: 'replay.json',
    size: 128,
    type: 'application/json',
    text: () => Promise.resolve(createReplayJson()),
    ...overrides,
});

describe('safe replay import boundary', () => {
    it('rejects files that exceed the size ceiling', () => {
        const result = validateReplayFileBoundary({
            name: 'replay.json',
            size: 512 * 1024 + 1,
            type: 'application/json',
        });

        expect(result).toMatchObject({
            ok: false,
            code: 'REPLAY_FILE_TOO_LARGE',
        });
    });

    it('rejects unsupported local file types', () => {
        const result = validateReplayFileBoundary({
            name: 'replay.txt',
            size: 128,
            type: 'text/plain',
        });

        expect(result).toMatchObject({
            ok: false,
            code: 'REPLAY_FILE_UNSUPPORTED_TYPE',
        });
    });

    it('rejects invalid JSON before schema validation', () => {
        const result = parseReplayTextBoundary('{not-valid-json');

        expect(result).toMatchObject({
            ok: false,
            code: 'REPLAY_FILE_INVALID_JSON',
        });
    });

    it('rejects unsupported legacy replay envelopes', () => {
        const result = parseReplayTextBoundary(
            JSON.stringify({
                version: '5.2.11',
                timestamp: '2026-04-19T00:00:00.000Z',
                history: [{ type: 'TAKE_GEMS', payload: { coords: [{ r: 0, c: 0 }] } }],
            })
        );

        expect(result).toMatchObject({
            ok: false,
            code: 'UNSUPPORTED_REPLAY_VERSION',
            detail: 'detectedVersion=legacy-history',
        });
    });

    it('returns a validated replay session for Replay vNext input', async () => {
        const result = await importReplayFromFile(createReplayFileStub());

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.session.history).toHaveLength(1);
            expect(result.replay.schemaVersion).toBe('1.0');
        }
    });

    it('fails closed when the local file read rejects', async () => {
        const result = await importReplayFromFile(
            createReplayFileStub({
                text: () => Promise.reject(new Error('read failed')),
            })
        );

        expect(result).toMatchObject({
            ok: false,
            code: 'REPLAY_FILE_READ_FAILED',
        });
    });
});
