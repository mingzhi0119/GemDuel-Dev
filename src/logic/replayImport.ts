import { z } from 'zod';
import type { GameAction, GameState, ReplayFile } from '../types';
import { INITIAL_STATE_SKELETON } from './initialState';
import { applyAction } from './gameReducer';
import { isBootstrapAction, isRuntimeActionShapeValid } from './actionValidation';
import { validateCommand } from './commandGate';

const MAX_REPLAY_ACTIONS = 5000;

const replayActionSchema = z.custom<GameAction>((value) => isRuntimeActionShapeValid(value), {
    message: 'Replay contained an invalid action payload.',
});

const replayFileSchema: z.ZodType<ReplayFile> = z.object({
    version: z.string().min(1),
    timestamp: z.string().min(1),
    history: z.array(replayActionSchema).min(1).max(MAX_REPLAY_ACTIONS),
});

export type ReplayParseResult = { ok: true; replay: ReplayFile } | { ok: false; reason: string };

const validateReplayHistory = (history: GameAction[]): ReplayParseResult => {
    const firstAction = history[0];
    if (!isBootstrapAction(firstAction)) {
        return {
            ok: false,
            reason: 'Replay history must start with INIT or INIT_DRAFT.',
        };
    }

    let state: GameState | null = INITIAL_STATE_SKELETON;
    for (let index = 0; index < history.length; index++) {
        const action = history[index];
        const validation = validateCommand(state, action);
        if (!validation.valid) {
            return {
                ok: false,
                reason: `Replay action ${index + 1} was rejected: ${validation.reason || 'Unknown validation error.'}`,
            };
        }

        const nextState = applyAction(state, action);
        if (!nextState || nextState === state) {
            return {
                ok: false,
                reason: `Replay action ${index + 1} could not be applied safely.`,
            };
        }

        state = nextState;
    }

    return {
        ok: true,
        replay: {
            version: 'validated',
            timestamp: new Date(0).toISOString(),
            history,
        },
    };
};

export const parseReplayFile = (value: unknown): ReplayParseResult => {
    const parsed = replayFileSchema.safeParse(value);
    if (!parsed.success) {
        const issue = parsed.error.issues[0];
        return {
            ok: false,
            reason: issue?.message || 'Replay file did not match the expected contract.',
        };
    }

    const replayValidation = validateReplayHistory(parsed.data.history);
    if (!replayValidation.ok) {
        return replayValidation;
    }

    return {
        ok: true,
        replay: parsed.data,
    };
};

export const MAX_REPLAY_FILE_BYTES = 512 * 1024;
