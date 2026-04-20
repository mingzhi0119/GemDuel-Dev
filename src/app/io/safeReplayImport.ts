import type { BoundaryFailure, ReplayFile, ReplayImportErrorCode } from '../../types';
import { MAX_REPLAY_FILE_BYTES, parseReplayFile } from '../../logic/replayImport';

const ALLOWED_REPLAY_MIME_TYPES = new Set(['application/json', 'text/json']);

export interface ReplayImportFile {
    name: string;
    size: number;
    type: string;
    text: () => Promise<string>;
}

export type ReplayImportResult =
    | {
          ok: true;
          replay: ReplayFile;
      }
    | BoundaryFailure<ReplayImportErrorCode>;

type ReplayBoundaryValidationResult = { ok: true } | BoundaryFailure<ReplayImportErrorCode>;

const hasJsonShape = (file: Pick<ReplayImportFile, 'name' | 'type'>) =>
    ALLOWED_REPLAY_MIME_TYPES.has(file.type) ||
    (file.type.length === 0 && file.name.toLowerCase().endsWith('.json'));

export const validateReplayFileBoundary = (
    file: Pick<ReplayImportFile, 'name' | 'size' | 'type'>
): ReplayBoundaryValidationResult => {
    if (file.size > MAX_REPLAY_FILE_BYTES) {
        return {
            ok: false,
            boundaryId: 'replay-local-file-read',
            code: 'REPLAY_FILE_TOO_LARGE',
            message: `Replay file exceeded the ${MAX_REPLAY_FILE_BYTES}-byte safety limit.`,
            runtimeSignal: 'REPLAY_BOUNDARY_REJECTED',
        };
    }

    if (!hasJsonShape(file)) {
        return {
            ok: false,
            boundaryId: 'replay-local-file-read',
            code: 'REPLAY_FILE_UNSUPPORTED_TYPE',
            message: 'Replay import only accepts JSON files.',
            runtimeSignal: 'REPLAY_BOUNDARY_REJECTED',
        };
    }

    return {
        ok: true,
    };
};

export const parseReplayTextBoundary = (rawText: string): ReplayImportResult => {
    try {
        const parsedJson = JSON.parse(rawText);
        const replay = parseReplayFile(parsedJson);
        if (!replay.ok) {
            return {
                ok: false,
                boundaryId: 'replay-schema-deterministic-replay',
                code: 'REPLAY_FILE_INVALID_SCHEMA',
                message: 'Replay JSON did not satisfy the expected replay contract.',
                detail: replay.reason,
                runtimeSignal: 'REPLAY_BOUNDARY_REJECTED',
            };
        }

        return {
            ok: true,
            replay: replay.replay,
        };
    } catch (error) {
        return {
            ok: false,
            boundaryId: 'replay-local-file-read',
            code: 'REPLAY_FILE_INVALID_JSON',
            message: 'Replay file could not be parsed as JSON text.',
            detail: error instanceof Error ? error.message : String(error),
            runtimeSignal: 'REPLAY_BOUNDARY_REJECTED',
        };
    }
};

export const importReplayFromFile = async (file: ReplayImportFile): Promise<ReplayImportResult> => {
    const boundaryValidation = validateReplayFileBoundary(file);
    if (!boundaryValidation.ok) {
        return boundaryValidation;
    }

    try {
        const rawText = await file.text();
        return parseReplayTextBoundary(rawText);
    } catch (error) {
        return {
            ok: false,
            boundaryId: 'replay-local-file-read',
            code: 'REPLAY_FILE_READ_FAILED',
            message: 'Replay file could not be read from the local filesystem.',
            detail: error instanceof Error ? error.message : String(error),
            runtimeSignal: 'REPLAY_BOUNDARY_REJECTED',
        };
    }
};
