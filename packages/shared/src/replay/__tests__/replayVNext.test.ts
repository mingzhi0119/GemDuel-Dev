import { describe, expect, it } from 'vitest';
import { CLASSIC_CARDS } from '../../data/realCards';
import { applyAction } from '../../logic/gameReducer';
import { buildStartGameAction, createGameSetupPayload } from '../../logic/gameSetup';
import { INITIAL_STATE_SKELETON } from '../../logic/initialState';
import type { GameAction, GameState } from '../../types';
import {
    applyReplaySyncToRecorder,
    buildReplayDeltaSync,
    buildReplayFullSync,
    buildReplayInitSnapshot,
    buildReplayRecorderFromHistory,
    createReplayCheckpoint,
    evaluateReplayPerformance,
    getReplaySummary,
    loadReplaySession,
    readReplayVNext,
    ReplayFormatError,
    replayVNextSchema,
    replaceReplayRecorderFromReplay,
    saveReplayVNext,
    type ReplayVNext,
} from '../index';

const LEGACY_SAMPLE_BYTES = 79_433;
const LEGACY_REPLAY_ENVELOPE = {
    version: 'legacy-history',
    timestamp: '2026-04-21T10:07:15.059Z',
    history: [
        {
            type: 'INIT',
            payload: createGameSetupPayload('LOCAL_PVP'),
        },
    ],
};

const reduceHistoryToState = (history: GameAction[]): GameState => {
    let state: GameState | null = INITIAL_STATE_SKELETON;

    for (const action of history) {
        const nextState = applyAction(state, action);
        if (!nextState) {
            throw new Error(
                `Could not apply action ${action.type} while building replay test state.`
            );
        }
        state = nextState;
    }

    return state;
};

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

const buildDraftReplayFixture = () => {
    const initAction = buildStartGameAction('LOCAL_PVP', { useBuffs: true });
    const initState = applyAction(INITIAL_STATE_SKELETON, initAction);
    if (!initState) {
        throw new Error('Failed to build draft replay init state.');
    }

    const selectBuffAction = {
        type: 'SELECT_BUFF',
        payload: {
            buffId: initState.draftPool[0],
        },
    } as const;
    const finalState = applyAction(initState, selectBuffAction);
    if (!finalState) {
        throw new Error('Failed to apply draft replay buff selection.');
    }

    const history: GameAction[] = [initAction, selectBuffAction];
    const recorder = buildReplayRecorderFromHistory(history, '5.2.11', '2026-04-22T00:00:00.000Z');
    if (!recorder.init) {
        throw new Error('Draft replay fixture did not produce a replay bootstrap snapshot.');
    }

    return {
        history,
        finalState,
        recorder,
        replay: saveReplayVNext({
            replayRevision: recorder.replayRevision,
            gameVersion: recorder.gameVersion,
            createdAt: recorder.createdAt,
            init: recorder.init,
            events: recorder.events,
            checkpoints: recorder.checkpoints,
            currentState: finalState,
            runtimeToInstance: recorder.runtimeToInstance,
        }),
    };
};

describe('Replay vNext', () => {
    it('accepts the minimal Replay vNext schema and rejects malformed variants', () => {
        const replay = createMinimalReplay();

        expect(replayVNextSchema.safeParse(replay).success).toBe(true);
        expect(replayVNextSchema.safeParse({ ...replay, schemaVersion: '0.9' }).success).toBe(
            false
        );
        expect(
            replayVNextSchema.safeParse({
                ...replay,
                events: [{ type: 'buy_card', actor: 'p1' }],
            }).success
        ).toBe(false);
        expect(replayVNextSchema.safeParse({ ...replay, summary: null }).success).toBe(false);
    });

    it('round-trips writer -> reader -> loader and preserves the final state hash', () => {
        const replay = createMinimalReplay();

        const readResult = readReplayVNext(JSON.stringify(replay), {
            verifySummary: 'sample',
        });
        const session = loadReplaySession(readResult.replay);

        expect(readResult.diagnostics.detectedVersion).toBe('1.0');
        expect(readResult.diagnostics.summaryIntegrity).toBe('ok');
        expect(session.finalStateHash).toBe(replay.summary.finalStateHash);
        expect(session.finalState.winner).toBe(replay.match.winner);
    });

    it('preserves concrete Joker bonus colors on tableau snapshot reload', () => {
        const setup = createGameSetupPayload('LOCAL_PVP');
        const jokerTemplate = CLASSIC_CARDS.find(
            (card) => card.level === 1 && card.bonusColor === 'gold'
        );
        if (!jokerTemplate) {
            throw new Error('Expected a level 1 Joker card template.');
        }

        setup.market[1][0] = { ...jokerTemplate };
        const initAction = { type: 'INIT', payload: setup } as const;
        const initState = applyAction(INITIAL_STATE_SKELETON, initAction);
        if (!initState?.market[1][0]) {
            throw new Error('Failed to create a replay state with a visible Joker.');
        }

        const currentState: GameState = {
            ...initState,
            playerTableau: {
                ...initState.playerTableau,
                p1: [{ ...initState.market[1][0], bonusColor: 'red' }],
            },
        };
        const { init, runtimeToInstance } = buildReplayInitSnapshot(initAction, initState);
        const replay = saveReplayVNext({
            replayRevision: 0,
            gameVersion: '5.2.11',
            createdAt: '2026-05-11T00:00:00.000Z',
            init,
            events: [],
            checkpoints: [createReplayCheckpoint(0, currentState, runtimeToInstance)],
            currentState,
            runtimeToInstance,
        });
        const session = loadReplaySession(replay);

        expect(session.finalState.playerTableau.p1[0]).toMatchObject({
            bonusColor: 'red',
            bonusCount: 1,
        });
        expect(session.finalStateHash).toBe(replay.summary.finalStateHash);
    });

    it('marks tampered summaries as mismatched during full verification', () => {
        const { replay } = buildDraftReplayFixture();
        const tamperedReplay = {
            ...replay,
            summary: {
                ...replay.summary,
                finalStateHash: 'tampered-hash',
            },
        };

        const result = readReplayVNext(JSON.stringify(tamperedReplay), {
            verifySummary: 'full',
        });

        expect(result.diagnostics.summaryIntegrity).toBe('mismatch');
    });

    it('reduces the legacy sample size by more than 60 percent', () => {
        const { replay } = buildDraftReplayFixture();
        const replayBytes = Buffer.byteLength(JSON.stringify(replay), 'utf8');
        const reduction = 1 - replayBytes / LEGACY_SAMPLE_BYTES;

        expect(reduction).toBeGreaterThan(0.6);
    });

    it('rejects legacy replay input with UNSUPPORTED_REPLAY_VERSION diagnostics', () => {
        const rawLegacy = JSON.stringify(LEGACY_REPLAY_ENVELOPE);

        expect(() => readReplayVNext(rawLegacy)).toThrowError(ReplayFormatError);

        try {
            readReplayVNext(rawLegacy);
        } catch (error) {
            expect(error).toBeInstanceOf(ReplayFormatError);
            expect((error as ReplayFormatError).code).toBe('UNSUPPORTED_REPLAY_VERSION');
            expect((error as ReplayFormatError).detectedVersion).toBe('legacy-history');
        }
    });

    it('returns complete summary and evaluation metadata', () => {
        const { replay } = buildDraftReplayFixture();
        const summary = getReplaySummary(replay, { recompute: true });
        const evaluation = evaluateReplayPerformance(replay);

        expect(summary.summaryDerivedFrom).toBe('recomputed');
        expect(summary.finalStateHash).toBeTruthy();
        expect(summary.totalEvents).toBe(replay.events.length);
        expect(evaluation.winnerConsistency.score).toBeGreaterThanOrEqual(0);
        expect(evaluation.actionLegality.score).toBeGreaterThanOrEqual(0);
        expect(evaluation.tempo.score).toBeGreaterThanOrEqual(0);
        expect(evaluation.resourceEfficiency.score).toBeGreaterThanOrEqual(0);
        expect(evaluation.buffImpact.score).toBeGreaterThanOrEqual(0);
        expect(evaluation.confidence).toBeGreaterThanOrEqual(0);
    });

    it('supports full+delta replay sync with idempotency and revision-gap detection', () => {
        const {
            history,
            finalState: fullState,
            recorder: fullRecorder,
        } = buildDraftReplayFixture();
        const partialHistory = history.slice(0, 1);
        const partialRecorder = buildReplayRecorderFromHistory(partialHistory, '5.2.11');
        const partialState = reduceHistoryToState(partialHistory);
        const guestRecorder = replaceReplayRecorderFromReplay(
            buildReplayFullSync(partialRecorder, partialState).replay
        );

        const deltaSync = buildReplayDeltaSync(
            fullRecorder,
            fullState,
            guestRecorder.replayRevision
        );
        expect(deltaSync.kind).toBe('delta');
        if (deltaSync.kind !== 'delta') {
            throw new Error('Expected a replay delta sync.');
        }

        applyReplaySyncToRecorder(guestRecorder, deltaSync);
        expect(guestRecorder.replayRevision).toBe(fullRecorder.replayRevision);

        const idempotentSync = buildReplayDeltaSync(
            fullRecorder,
            fullState,
            guestRecorder.replayRevision
        );
        expect(idempotentSync.kind).toBe('delta');
        applyReplaySyncToRecorder(guestRecorder, idempotentSync);
        expect(guestRecorder.replayRevision).toBe(fullRecorder.replayRevision);

        const gapGuest = replaceReplayRecorderFromReplay(
            buildReplayFullSync(partialRecorder, partialState).replay
        );
        const gapSync = buildReplayDeltaSync(fullRecorder, fullState, fullRecorder.replayRevision);

        expect(() => applyReplaySyncToRecorder(gapGuest, gapSync)).toThrow(
            'Replay delta revision gap detected.'
        );
    });
});
