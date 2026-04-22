import { getReplaySummary } from './extract';
import { replayVNextSchema } from './schema';
import type { ReplayReaderOptions, ReplayReadDiagnostics, ReplayVNext } from './types';
import { REPLAY_VNEXT_SCHEMA_VERSION, ReplayFormatError } from './types';

const normalizeReplayInput = (value: string | unknown): unknown => {
    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch (error) {
        throw new ReplayFormatError(
            'REPLAY_FILE_INVALID_JSON',
            error instanceof Error ? error.message : 'Replay file could not be parsed as JSON.'
        );
    }
};

const detectReplayVersion = (value: unknown): ReplayReadDiagnostics['detectedVersion'] => {
    if (!value || typeof value !== 'object') {
        return 'unknown';
    }

    const candidate = value as Record<string, unknown>;
    if (
        typeof candidate.version === 'string' &&
        typeof candidate.timestamp === 'string' &&
        Array.isArray(candidate.history)
    ) {
        return 'legacy-history';
    }

    if (typeof candidate.schemaVersion === 'string') {
        return candidate.schemaVersion === REPLAY_VNEXT_SCHEMA_VERSION
            ? REPLAY_VNEXT_SCHEMA_VERSION
            : 'unsupported-vnext';
    }

    return 'unknown';
};

const getSummaryIntegrity = (
    replay: ReplayVNext,
    verifySummary: ReplayReaderOptions['verifySummary']
): ReplayReadDiagnostics['summaryIntegrity'] => {
    if (!verifySummary || verifySummary === 'none') {
        return 'unchecked';
    }

    const recomputed = getReplaySummary(replay, { recompute: true });
    if (verifySummary === 'sample') {
        return replay.summary.finalStateHash === recomputed.finalStateHash &&
            replay.summary.winner === recomputed.winner &&
            replay.summary.totalEvents === recomputed.totalEvents &&
            replay.summary.endReason === recomputed.endReason
            ? 'ok'
            : 'mismatch';
    }

    const fullMatch =
        replay.summary.turnCount === recomputed.turnCount &&
        replay.summary.totalEvents === recomputed.totalEvents &&
        JSON.stringify(replay.summary.eventsByType) === JSON.stringify(recomputed.eventsByType) &&
        JSON.stringify(replay.summary.eventsByPlayer) ===
            JSON.stringify(recomputed.eventsByPlayer) &&
        replay.summary.winner === recomputed.winner &&
        replay.summary.endReason === recomputed.endReason &&
        JSON.stringify(replay.summary.finalScores) === JSON.stringify(recomputed.finalScores) &&
        JSON.stringify(replay.summary.finalCrowns) === JSON.stringify(recomputed.finalCrowns) &&
        JSON.stringify(replay.summary.finalGemTotals) ===
            JSON.stringify(recomputed.finalGemTotals) &&
        replay.summary.finalStateHash === recomputed.finalStateHash;

    return fullMatch ? 'ok' : 'mismatch';
};

export const readReplayVNext = (
    value: string | unknown,
    options: ReplayReaderOptions = {}
): { replay: ReplayVNext; diagnostics: ReplayReadDiagnostics } => {
    const normalized = normalizeReplayInput(value);
    const detectedVersion = detectReplayVersion(normalized);

    if (detectedVersion === 'legacy-history' || detectedVersion === 'unsupported-vnext') {
        throw new ReplayFormatError(
            'UNSUPPORTED_REPLAY_VERSION',
            'This replay was recorded with an unsupported legacy format.',
            detectedVersion
        );
    }

    const parsed = replayVNextSchema.safeParse(normalized);
    if (!parsed.success) {
        throw new ReplayFormatError(
            'REPLAY_FILE_INVALID_SCHEMA',
            parsed.error.issues[0]?.message ??
                'Replay file did not match the Replay vNext 1.0 schema.',
            detectedVersion
        );
    }

    const replay = parsed.data;
    return {
        replay,
        diagnostics: {
            detectedVersion: REPLAY_VNEXT_SCHEMA_VERSION,
            summaryIntegrity: getSummaryIntegrity(replay, options.verifySummary ?? 'none'),
        },
    };
};
