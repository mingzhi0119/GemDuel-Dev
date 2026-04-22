import {
    ReplayFormatError,
    loadReplaySession,
    readReplayVNext,
    type LoadedReplaySession,
    type ReplayReadDiagnostics,
    type ReplayVNext,
} from '@gemduel/shared/replay';
import type { BoundaryFailure, ReplayImportErrorCode } from '@gemduel/shared/types';

const ALLOWED_REPLAY_MIME_TYPES = new Set(['application/json', 'text/json']);
export const MAX_REPLAY_FILE_BYTES = 512 * 1024;

export interface ReplayImportFile {
    name: string;
    size: number;
    type: string;
    text: () => Promise<string>;
}

export type ReplayImportResult =
    | {
          ok: true;
          replay: ReplayVNext;
          session: LoadedReplaySession;
          diagnostics: ReplayReadDiagnostics;
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
        const { replay, diagnostics } = readReplayVNext(rawText, {
            verifySummary: 'sample',
        });
        const session = loadReplaySession(replay);

        return {
            ok: true,
            replay,
            session,
            diagnostics,
        };
    } catch (error) {
        if (error instanceof ReplayFormatError) {
            return {
                ok: false,
                boundaryId: 'replay-schema-deterministic-replay',
                code: error.code,
                message: error.message,
                detail:
                    error.detectedVersion !== undefined
                        ? `detectedVersion=${error.detectedVersion}`
                        : undefined,
                runtimeSignal: 'REPLAY_BOUNDARY_REJECTED',
            };
        }

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
