import { describe, expect, it } from 'vitest';
import { createGameSetupPayload } from '../../../logic/gameSetup';
import {
    importReplayFromFile,
    parseReplayTextBoundary,
    validateReplayFileBoundary,
    type ReplayImportFile,
} from '../safeReplayImport';

const createReplayFileStub = (overrides: Partial<ReplayImportFile> = {}): ReplayImportFile => ({
    name: 'replay.json',
    size: 128,
    type: 'application/json',
    text: () =>
        Promise.resolve(
            JSON.stringify({
                version: '5.2.11',
                timestamp: '2026-04-19T00:00:00.000Z',
                history: [{ type: 'INIT', payload: createGameSetupPayload('LOCAL_PVP') }],
            })
        ),
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

    it('rejects schema-invalid replay envelopes', () => {
        const result = parseReplayTextBoundary(
            JSON.stringify({
                version: '5.2.11',
                timestamp: '2026-04-19T00:00:00.000Z',
                history: [{ type: 'TAKE_GEMS', payload: { coords: [{ r: 0, c: 0 }] } }],
            })
        );

        expect(result).toMatchObject({
            ok: false,
            code: 'REPLAY_FILE_INVALID_SCHEMA',
        });
    });

    it('returns a validated replay for well-formed JSON input', async () => {
        const result = await importReplayFromFile(createReplayFileStub());

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.replay.history).toHaveLength(1);
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
