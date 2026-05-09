import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

import { format as formatWithPrettier } from 'prettier';

import { applyAction } from '../../packages/shared/src/logic/gameReducer';
import { buildStartGameAction } from '../../packages/shared/src/logic/gameSetup';
import { INITIAL_STATE_SKELETON } from '../../packages/shared/src/logic/initialState';
import { buildSelectBuffAction } from '../../packages/shared/src/logic/interactionCommands';
import {
    buildReplayInitSnapshot,
    buildIdentityRuntimeToInstanceMap,
    createReplayCheckpoint,
    createReplayRecorderInternalState,
    loadReplayStateAtRevision,
    recordReplayAction,
    saveReplayVNext,
    seedReplayRecorderState,
    simulateAiVsAiReplay,
    type ReplayEvent,
    type ReplayVNext,
} from '../../packages/shared/src/replay/index';
import type { GameAction, GameState } from '../../packages/shared/src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');

const DEFAULT_OUT_DIR = path.join(workspaceRoot, 'fixtures', 'replay-golden');
const RULES_VERSION = '5.2.11';
const REPLAY_SCHEMA_VERSION = '1.0';
const REQUIRED_COVERAGE = [
    'local-pvp-opening',
    'reserve',
    'buy',
    'royal-selection',
    'extra-turn',
    'buff',
    'game-over',
] as const;

const FULL_COVERAGE_PARITY_CHECKPOINT_REVISIONS = [8, 11, 44] as const;

type CoverageTag = (typeof REQUIRED_COVERAGE)[number];

const formatJson = (value: unknown) =>
    formatWithPrettier(JSON.stringify(value), {
        parser: 'json',
        printWidth: 100,
        tabWidth: 4,
    });

interface GoldenFixture {
    id: string;
    fileName: string;
    tags: CoverageTag[];
    replay: ReplayVNext;
    source: string;
}

const createDeterministicRandom = (seed: number) => {
    let current = seed >>> 0;
    return () => {
        current = (current * 1_664_525 + 1_013_904_223) >>> 0;
        return current / 4_294_967_296;
    };
};

const withDeterministicMathRandom = <T>(seed: number, work: () => T): T => {
    const originalRandom = Math.random;
    Math.random = createDeterministicRandom(seed);
    try {
        return work();
    } finally {
        Math.random = originalRandom;
    }
};

const parseCliOptions = () => {
    const { values } = parseArgs({
        args: process.argv.slice(2),
        options: {
            'out-dir': { type: 'string' },
            help: { type: 'boolean' },
        },
        allowPositionals: false,
        strict: true,
    });

    if (values.help) {
        process.stdout.write(
            [
                'Usage: pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts [options]',
                '',
                'Options:',
                '  --out-dir <path>  Output directory (default: fixtures/replay-golden)',
                '  --help            Show this help message',
                '',
            ].join('\n')
        );
        process.exit(0);
    }

    return {
        outDir: path.resolve(values['out-dir'] ?? DEFAULT_OUT_DIR),
    };
};

const requireState = (state: GameState | null, actionType: string): GameState => {
    if (!state) {
        throw new Error(`Fixture export failed while applying ${actionType}.`);
    }
    return state;
};

const applyRecordedAction = (
    recorder: ReturnType<typeof createReplayRecorderInternalState>,
    previousState: GameState,
    action: GameAction
): GameState => {
    const nextState = requireState(applyAction(previousState, action), action.type);
    recordReplayAction(recorder, previousState, action, nextState);
    return nextState;
};

const buildOpeningReplay = (): ReplayVNext => {
    const initAction = buildStartGameAction('LOCAL_PVP', {
        useBuffs: false,
        isHost: true,
        hostPlayer: 'p1',
        seed: 'unity-golden-local-pvp-opening',
    });
    const initialState = requireState(applyAction(INITIAL_STATE_SKELETON, initAction), 'INIT');
    const { init, runtimeToInstance } = buildReplayInitSnapshot(initAction, initialState);

    return saveReplayVNext({
        replayRevision: 0,
        gameVersion: RULES_VERSION,
        createdAt: '2026-05-09T00:00:00.000Z',
        init,
        events: [],
        checkpoints: [createReplayCheckpoint(0, initialState, runtimeToInstance)],
        currentState: initialState,
        runtimeToInstance,
    });
};

const buildBuffDraftReplay = (): ReplayVNext =>
    withDeterministicMathRandom(0x5eed_0001, () => {
        const initAction = buildStartGameAction('LOCAL_PVP', {
            useBuffs: true,
            isHost: true,
            hostPlayer: 'p1',
            seed: 'unity-golden-buff-draft',
        });
        const initState = requireState(
            applyAction(INITIAL_STATE_SKELETON, initAction),
            'INIT_DRAFT'
        );
        const recorder = seedReplayRecorderState(
            createReplayRecorderInternalState(RULES_VERSION, '2026-05-09T00:01:00.000Z'),
            initAction,
            initState
        );

        const p1BuffAction = buildSelectBuffAction(
            initState.draftPool[0] ?? 'none',
            'red',
            initState.turn,
            initState.phase,
            initState.buffLevel
        );
        const afterP1 = applyRecordedAction(recorder, initState, p1BuffAction);
        const p2Pool = afterP1.p2DraftPool ?? afterP1.draftPool;
        const p2BuffAction = buildSelectBuffAction(
            p2Pool[0] ?? 'none',
            'blue',
            afterP1.turn,
            afterP1.phase,
            afterP1.buffLevel
        );
        const finalState = applyRecordedAction(recorder, afterP1, p2BuffAction);

        if (!recorder.init) {
            throw new Error('Buff draft fixture did not create replay init metadata.');
        }

        return saveReplayVNext({
            replayRevision: recorder.replayRevision,
            gameVersion: recorder.gameVersion,
            createdAt: recorder.createdAt,
            init: recorder.init,
            events: recorder.events,
            checkpoints: recorder.checkpoints,
            currentState: finalState,
            runtimeToInstance: recorder.runtimeToInstance,
        });
    });

const hasFullCoverage = (events: ReplayEvent[], replay: ReplayVNext): boolean => {
    const eventTypes = new Set(events.map((event) => event.type));
    const extraTurnEvidence = events.some((event, index) => {
        const previous = events[index - 1];
        return previous?.type === 'select_royal' ? event.actor === previous.actor : false;
    });

    return (
        eventTypes.has('reserve_card') &&
        eventTypes.has('buy_card') &&
        eventTypes.has('select_royal') &&
        extraTurnEvidence &&
        replay.summary.winner !== null &&
        replay.summary.endReason === 'normal'
    );
};

const buildFullCoverageReplay = (): ReplayVNext =>
    withDeterministicMathRandom(0x5eed_0002, () => {
        const knownCoverageSeeds = ['2026-05-09T01:00:00.000Z'];

        for (const createdAt of knownCoverageSeeds) {
            const result = simulateAiVsAiReplay({
                gameVersion: RULES_VERSION,
                useBuffs: true,
                mode: 'LOCAL_PVP',
                createdAt,
            });

            if (
                result.status === 'completed' &&
                hasFullCoverage(result.replay.events, result.replay)
            ) {
                return addParityCheckpoints(
                    result.replay,
                    FULL_COVERAGE_PARITY_CHECKPOINT_REVISIONS
                );
            }
        }

        for (let index = 0; index < 300; index += 1) {
            const createdAt = new Date(Date.UTC(2026, 4, 9, 1, 0, index)).toISOString();
            const result = simulateAiVsAiReplay({
                gameVersion: RULES_VERSION,
                useBuffs: true,
                mode: 'LOCAL_PVP',
                createdAt,
            });

            if (
                result.status === 'completed' &&
                hasFullCoverage(result.replay.events, result.replay)
            ) {
                return addParityCheckpoints(
                    result.replay,
                    FULL_COVERAGE_PARITY_CHECKPOINT_REVISIONS
                );
            }
        }

        throw new Error('Could not generate a deterministic full-coverage replay fixture.');
    });

const addParityCheckpoints = (replay: ReplayVNext, revisions: readonly number[]): ReplayVNext => {
    const runtimeToInstance = buildIdentityRuntimeToInstanceMap(replay.init.cardInstances);
    const checkpoints = new Map(
        (replay.checkpoints ?? []).map((checkpoint) => [checkpoint.revision, checkpoint])
    );

    for (const revision of revisions) {
        if (revision < 0 || revision > replay.replayRevision) {
            throw new Error(`Parity checkpoint revision ${revision} is outside replay bounds.`);
        }

        const state = loadReplayStateAtRevision(replay, revision);
        checkpoints.set(revision, createReplayCheckpoint(revision, state, runtimeToInstance));
    }

    return {
        ...replay,
        checkpoints: [...checkpoints.values()].sort(
            (left, right) => left.revision - right.revision
        ),
    };
};

const buildFixtureManifest = (fixtures: GoldenFixture[]) => ({
    schemaVersion: 1,
    generatedAt: '2026-05-09T00:00:00.000Z',
    generatedBy: 'tools/migration/export-unity-fixtures.ts',
    rulesVersion: RULES_VERSION,
    replaySchemaVersion: REPLAY_SCHEMA_VERSION,
    hashContract: {
        id: 'replay-state-hash-v1',
        implementation: 'packages/shared/src/replay/stateHash.ts',
        serializer: 'serializeReplayStateSnapshot + stableJsonStringify',
    },
    requiredCoverage: REQUIRED_COVERAGE,
    fixtures: fixtures.map(({ id, fileName, tags, replay, source }) => ({
        id,
        fileName,
        tags,
        schemaVersion: replay.schemaVersion,
        replayRevision: replay.replayRevision,
        expectedFinalStateHash: replay.summary.finalStateHash,
        expectedWinner: replay.summary.winner,
        expectedEndReason: replay.summary.endReason,
        expectedTotalEvents: replay.summary.totalEvents,
        expectedTurnCount: replay.summary.turnCount,
        source,
    })),
});

const main = async () => {
    const { outDir } = parseCliOptions();
    const fixtures: GoldenFixture[] = [
        {
            id: 'local-pvp-opening',
            fileName: 'local-pvp-opening.replay.json',
            tags: ['local-pvp-opening'],
            replay: buildOpeningReplay(),
            source: 'Deterministic INIT replay with no post-bootstrap events.',
        },
        {
            id: 'buff-draft-opening',
            fileName: 'buff-draft-opening.replay.json',
            tags: ['buff'],
            replay: buildBuffDraftReplay(),
            source: 'Deterministic INIT_DRAFT replay with both players selecting buffs.',
        },
        {
            id: 'local-pvp-royal-extra-turn-game-over',
            fileName: 'local-pvp-royal-extra-turn-game-over.replay.json',
            tags: ['reserve', 'buy', 'royal-selection', 'extra-turn', 'game-over'],
            replay: buildFullCoverageReplay(),
            source: 'Deterministic AI local PvP replay selected for reserve/buy/royal extra-turn/game-over coverage.',
        },
    ];
    const manifest = buildFixtureManifest(fixtures);

    await mkdir(outDir, { recursive: true });
    await Promise.all(
        fixtures.map(async (fixture) =>
            writeFile(path.join(outDir, fixture.fileName), await formatJson(fixture.replay), 'utf8')
        )
    );
    const manifestJson = await formatJson(manifest);
    await writeFile(path.join(outDir, 'manifest.json'), manifestJson);

    process.stdout.write(manifestJson);
};

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
});
