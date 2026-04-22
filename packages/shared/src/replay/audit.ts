import { getActionRejectionReason } from '../logic/actionValidation/rules';
import { applyAction } from '../logic/gameReducer';
import { INITIAL_STATE_SKELETON } from '../logic/initialState';
import { stableJsonStringify } from '../utils/stableJson';
import { evaluateReplayPerformance } from './evaluation';
import { getReplaySummary } from './extract';
import { loadReplaySession } from './loader';
import { readReplayVNext } from './reader';
import { buildBootstrapActionFromReplayInit, inflateReplayEventToGameAction } from './runtime';
import {
    ReplayFormatError,
    type ReplayAuditInput,
    type ReplayAuditMismatch,
    type ReplayAuditResult,
    type ReplayBatchAuditResult,
} from './types';

const DEFAULT_CONFIDENCE_EPSILON = 1e-12;

const pushMismatch = (
    mismatches: ReplayAuditMismatch[],
    field: string,
    expected: unknown,
    actual: unknown
) => {
    mismatches.push({
        field,
        expected,
        actual,
    });
};

const pushMismatchIfDifferent = (
    mismatches: ReplayAuditMismatch[],
    field: string,
    expected: unknown,
    actual: unknown
) => {
    if (stableJsonStringify(expected) !== stableJsonStringify(actual)) {
        pushMismatch(mismatches, field, expected, actual);
    }
};

const pushNumericMismatchIfDifferent = (
    mismatches: ReplayAuditMismatch[],
    field: string,
    expected: number,
    actual: number,
    epsilon: number
) => {
    if (Math.abs(expected - actual) > epsilon) {
        pushMismatch(mismatches, field, expected, actual);
    }
};

const validateReplayEventSequence = (
    replay: NonNullable<ReturnType<typeof readReplayVNext>['replay']>
): ReplayAuditMismatch[] => {
    const mismatches: ReplayAuditMismatch[] = [];
    const bootstrapAction = buildBootstrapActionFromReplayInit(replay.init);
    let state = applyAction(INITIAL_STATE_SKELETON, bootstrapAction);

    if (!state) {
        pushMismatch(
            mismatches,
            'sequence.bootstrap',
            'Replay bootstrap must initialize state.',
            null
        );
        return mismatches;
    }

    for (let index = 0; index < replay.events.length; index += 1) {
        const event = replay.events[index]!;
        if (state.turn !== event.actor) {
            pushMismatch(mismatches, `sequence.event[${index}].actor`, event.actor, state.turn);
            break;
        }

        const action = inflateReplayEventToGameAction(state, event, replay.init);
        const rejection = getActionRejectionReason(state, action);
        if (rejection) {
            pushMismatch(
                mismatches,
                `sequence.event[${index}].applicable`,
                'Replay event must inflate into a legal action.',
                {
                    phase: state.phase,
                    actionType: action.type,
                    reason: rejection,
                }
            );
            break;
        }

        const nextState = applyAction(state, action);
        if (!nextState || nextState === state) {
            pushMismatch(
                mismatches,
                `sequence.event[${index}].transition`,
                'Replay event must produce a new state.',
                {
                    phase: state.phase,
                    actionType: action.type,
                }
            );
            break;
        }

        state = nextState;
    }

    return mismatches;
};

export const auditReplay = ({
    id,
    value,
    expected,
    verifySummary = 'full',
    confidenceEpsilon = DEFAULT_CONFIDENCE_EPSILON,
}: ReplayAuditInput): ReplayAuditResult => {
    try {
        const { replay, diagnostics } = readReplayVNext(value, {
            verifySummary,
        });
        const session = loadReplaySession(replay);
        const recomputedSummary = getReplaySummary(replay, { recompute: true });
        const evaluation = evaluateReplayPerformance(session);
        const mismatches = validateReplayEventSequence(replay);

        if (diagnostics.summaryIntegrity === 'mismatch') {
            pushMismatch(
                mismatches,
                'diagnostics.summaryIntegrity',
                'ok',
                diagnostics.summaryIntegrity
            );
        }

        pushMismatchIfDifferent(
            mismatches,
            'summary.finalStateHash',
            replay.summary.finalStateHash,
            session.finalStateHash
        );
        pushMismatchIfDifferent(
            mismatches,
            'recomputedSummary.finalStateHash',
            replay.summary.finalStateHash,
            recomputedSummary.finalStateHash
        );
        pushMismatchIfDifferent(
            mismatches,
            'match.winner',
            replay.match.winner,
            session.finalState.winner
        );
        pushMismatchIfDifferent(
            mismatches,
            'summary.winner',
            replay.summary.winner,
            session.finalState.winner
        );
        pushMismatchIfDifferent(
            mismatches,
            'summary.endReason',
            replay.summary.endReason,
            recomputedSummary.endReason
        );
        pushMismatchIfDifferent(
            mismatches,
            'summary.turnCount',
            replay.summary.turnCount,
            recomputedSummary.turnCount
        );
        pushMismatchIfDifferent(
            mismatches,
            'summary.totalEvents',
            replay.summary.totalEvents,
            recomputedSummary.totalEvents
        );
        pushMismatchIfDifferent(
            mismatches,
            'summary.eventsByType',
            replay.summary.eventsByType,
            recomputedSummary.eventsByType
        );
        pushMismatchIfDifferent(
            mismatches,
            'summary.eventsByPlayer',
            replay.summary.eventsByPlayer,
            recomputedSummary.eventsByPlayer
        );
        pushMismatchIfDifferent(
            mismatches,
            'summary.finalScores',
            replay.summary.finalScores,
            recomputedSummary.finalScores
        );
        pushMismatchIfDifferent(
            mismatches,
            'summary.finalCrowns',
            replay.summary.finalCrowns,
            recomputedSummary.finalCrowns
        );
        pushMismatchIfDifferent(
            mismatches,
            'summary.finalGemTotals',
            replay.summary.finalGemTotals,
            recomputedSummary.finalGemTotals
        );

        if (expected) {
            if (expected.fileName !== undefined) {
                pushMismatchIfDifferent(mismatches, 'expected.fileName', expected.fileName, id);
            }
            if (expected.winner !== undefined) {
                pushMismatchIfDifferent(
                    mismatches,
                    'expected.winner',
                    expected.winner,
                    session.finalState.winner
                );
            }
            if (expected.endReason !== undefined) {
                pushMismatchIfDifferent(
                    mismatches,
                    'expected.endReason',
                    expected.endReason,
                    recomputedSummary.endReason
                );
            }
            if (expected.turnCount !== undefined) {
                pushMismatchIfDifferent(
                    mismatches,
                    'expected.turnCount',
                    expected.turnCount,
                    recomputedSummary.turnCount
                );
            }
            if (expected.totalEvents !== undefined) {
                pushMismatchIfDifferent(
                    mismatches,
                    'expected.totalEvents',
                    expected.totalEvents,
                    recomputedSummary.totalEvents
                );
            }
            if (expected.finalStateHash !== undefined) {
                pushMismatchIfDifferent(
                    mismatches,
                    'expected.finalStateHash',
                    expected.finalStateHash,
                    session.finalStateHash
                );
            }
            if (expected.confidence !== undefined) {
                pushNumericMismatchIfDifferent(
                    mismatches,
                    'expected.confidence',
                    expected.confidence,
                    evaluation.confidence,
                    confidenceEpsilon
                );
            }
        }

        return {
            id,
            ok: mismatches.length === 0,
            diagnostics,
            loadedFinalStateHash: session.finalStateHash,
            loadedWinner: session.finalState.winner,
            recomputedSummary,
            evaluation,
            mismatches,
        };
    } catch (error) {
        if (error instanceof ReplayFormatError) {
            return {
                id,
                ok: false,
                mismatches: [],
                error: {
                    code: error.code,
                    message: error.message,
                    detectedVersion: error.detectedVersion,
                },
            };
        }

        return {
            id,
            ok: false,
            mismatches: [],
            error: {
                code: 'REPLAY_AUDIT_EXCEPTION',
                message: error instanceof Error ? error.message : String(error),
            },
        };
    }
};

export const auditReplayBatch = (inputs: ReplayAuditInput[]): ReplayBatchAuditResult => {
    const results = inputs.map((input) => auditReplay(input));
    const mismatchCounts = results.reduce<Record<string, number>>((accumulator, result) => {
        for (const mismatch of result.mismatches) {
            accumulator[mismatch.field] = (accumulator[mismatch.field] ?? 0) + 1;
        }
        return accumulator;
    }, {});
    const errorCounts = results.reduce<Record<string, number>>((accumulator, result) => {
        if (result.error) {
            accumulator[result.error.code] = (accumulator[result.error.code] ?? 0) + 1;
        }
        return accumulator;
    }, {});
    const failedCount = results.filter((result) => !result.ok).length;

    return {
        ok: failedCount === 0,
        auditedCount: inputs.length,
        passedCount: inputs.length - failedCount,
        failedCount,
        mismatchCounts,
        errorCounts,
        results,
    };
};
