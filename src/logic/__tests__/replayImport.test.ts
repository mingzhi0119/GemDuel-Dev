import { describe, expect, it } from 'vitest';
import { parseReplayFile } from '../replayImport';
import { createGameSetupPayload } from '../gameSetup';

describe('parseReplayFile', () => {
    it('accepts a validated replay envelope', () => {
        const replay = parseReplayFile({
            version: '5.2.11',
            timestamp: '2026-04-19T00:00:00.000Z',
            history: [{ type: 'INIT', payload: createGameSetupPayload('LOCAL_PVP') }],
        });

        expect(replay.ok).toBe(true);
        if (replay.ok) {
            expect(replay.replay.history).toHaveLength(1);
        }
    });

    it('rejects replays that do not begin with a bootstrap action', () => {
        const replay = parseReplayFile({
            version: '5.2.11',
            timestamp: '2026-04-19T00:00:00.000Z',
            history: [{ type: 'TAKE_GEMS', payload: { coords: [{ r: 0, c: 0 }] } }],
        });

        expect(replay.ok).toBe(false);
        if (!replay.ok) {
            expect(replay.reason).toContain('start with INIT or INIT_DRAFT');
        }
    });

    it('rejects malformed actions inside replay history', () => {
        const replay = parseReplayFile({
            version: '5.2.11',
            timestamp: '2026-04-19T00:00:00.000Z',
            history: [
                { type: 'INIT', payload: createGameSetupPayload('LOCAL_PVP') },
                { type: 'SELECT_BUFF', payload: 'privilege_favor' },
            ],
        });

        expect(replay.ok).toBe(false);
    });
});
