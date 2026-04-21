import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameAction, GameState } from '../../types';
import type { CommandValidationResult } from '../commandGate';
import { parseReplayFile } from '../replayImport';
import { createGameSetupPayload } from '../gameSetup';

const cloneState = (state: GameState | null): GameState | null =>
    state ? ({ ...state } as GameState) : null;

const replayImportControls = vi.hoisted(() => ({
    validateCommand: vi.fn<
        (state: GameState | null, action: GameAction) => CommandValidationResult
    >(() => ({ valid: true })),
    applyAction: vi.fn<(state: GameState | null, action: GameAction) => GameState | null>(),
}));

vi.mock('../commandGate', () => ({
    validateCommand: (state: GameState | null, action: GameAction) =>
        replayImportControls.validateCommand(state, action),
}));

vi.mock('../gameReducer', () => ({
    applyAction: (state: GameState | null, action: GameAction) =>
        replayImportControls.applyAction(state, action),
}));

describe('parseReplayFile', () => {
    beforeEach(() => {
        replayImportControls.validateCommand.mockReset();
        replayImportControls.applyAction.mockReset();
        replayImportControls.validateCommand.mockReturnValue({ valid: true });
        replayImportControls.applyAction.mockImplementation((state: GameState | null) =>
            cloneState(state)
        );
    });

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

    it('surfaces gate rejections with explicit and fallback reasons', () => {
        replayImportControls.validateCommand
            .mockReturnValueOnce({ valid: true })
            .mockReturnValueOnce({
                valid: false,
                reason: 'Command blocked by policy.',
            });

        const explicitReasonReplay = parseReplayFile({
            version: '5.2.11',
            timestamp: '2026-04-19T00:00:00.000Z',
            history: [
                { type: 'INIT', payload: createGameSetupPayload('LOCAL_PVP') },
                { type: 'CLOSE_MODAL' },
            ],
        });

        expect(explicitReasonReplay).toEqual({
            ok: false,
            reason: 'Replay action 2 was rejected: Command blocked by policy.',
        });

        replayImportControls.validateCommand
            .mockReset()
            .mockReturnValueOnce({ valid: true })
            .mockReturnValueOnce({ valid: false });

        const fallbackReasonReplay = parseReplayFile({
            version: '5.2.11',
            timestamp: '2026-04-19T00:00:00.000Z',
            history: [
                { type: 'INIT', payload: createGameSetupPayload('LOCAL_PVP') },
                { type: 'CLOSE_MODAL' },
            ],
        });

        expect(fallbackReasonReplay).toEqual({
            ok: false,
            reason: 'Replay action 2 was rejected: Unknown validation error.',
        });
    });

    it('rejects replays when a validated action cannot be applied safely', () => {
        replayImportControls.applyAction
            .mockImplementationOnce((state: GameState | null) => cloneState(state))
            .mockImplementationOnce((state: GameState | null) => state);

        const replay = parseReplayFile({
            version: '5.2.11',
            timestamp: '2026-04-19T00:00:00.000Z',
            history: [
                { type: 'INIT', payload: createGameSetupPayload('LOCAL_PVP') },
                { type: 'CLOSE_MODAL' },
            ],
        });

        expect(replay).toEqual({
            ok: false,
            reason: 'Replay action 2 could not be applied safely.',
        });
    });
});
