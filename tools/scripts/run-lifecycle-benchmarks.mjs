/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { collectBenchmarkReportErrors } from './lifecycleBenchmarks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const parseArgs = (argv) => {
    const args = {
        outDir: path.join(repoRoot, 'artifacts', 'governance'),
        pretty: true,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--out-dir') {
            args.outDir = path.resolve(repoRoot, argv[index + 1] ?? args.outDir);
            index += 1;
            continue;
        }

        if (value === '--compact') {
            args.pretty = false;
        }
    }

    return args;
};

const withDeterministicRandom = (callback) => {
    const originalRandom = Math.random;
    let seed = 0xdecafbad;
    Math.random = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 0x100000000;
    };

    try {
        return callback();
    } finally {
        Math.random = originalRandom;
    }
};

const quantile = (values, percentile) => {
    const sorted = [...values].sort((left, right) => left - right);
    const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * percentile) - 1);
    return sorted[index] ?? 0;
};

const roundMs = (value) => Number(value.toFixed(3));

const loadSharedRuntime = async () => {
    const importShared = (relativePath) => import(new URL(relativePath, import.meta.url).href);
    const [
        aiPlayer,
        constants,
        gameReducer,
        gameSetup,
        initialState,
        networkMessageValidation,
        replayLoader,
        replayReader,
        replayRuntime,
        replaySimulation,
        replayWriter,
        networkTypes,
        testHelpers,
    ] = await Promise.all([
        importShared('../../packages/shared/src/logic/ai/aiPlayer.ts'),
        importShared('../../packages/shared/src/constants.ts'),
        importShared('../../packages/shared/src/logic/gameReducer.ts'),
        importShared('../../packages/shared/src/logic/gameSetup.ts'),
        importShared('../../packages/shared/src/logic/initialState.ts'),
        importShared('../../packages/shared/src/logic/networkMessageValidation.ts'),
        importShared('../../packages/shared/src/replay/loader.ts'),
        importShared('../../packages/shared/src/replay/reader.ts'),
        importShared('../../packages/shared/src/replay/runtime.ts'),
        importShared('../../packages/shared/src/replay/simulation.ts'),
        importShared('../../packages/shared/src/replay/writer.ts'),
        importShared('../../packages/shared/src/types/network.ts'),
        importShared('../../packages/shared/src/logic/__tests__/testHelpers.ts'),
    ]);

    return {
        computeAiAction: aiPlayer.computeAiAction,
        applyAction: gameReducer.applyAction,
        buildStartGameAction: gameSetup.buildStartGameAction,
        INITIAL_STATE_SKELETON: initialState.INITIAL_STATE_SKELETON,
        parseNetworkMessageBoundary: networkMessageValidation.parseNetworkMessageBoundary,
        loadReplaySession: replayLoader.loadReplaySession,
        readReplayVNext: replayReader.readReplayVNext,
        buildIdentityRuntimeToInstanceMap: replayRuntime.buildIdentityRuntimeToInstanceMap,
        simulateAiVsAiReplay: replaySimulation.simulateAiVsAiReplay,
        saveReplayVNext: replayWriter.saveReplayVNext,
        NETWORK_PROTOCOL_VERSION: networkTypes.NETWORK_PROTOCOL_VERSION,
        createMockState: testHelpers.createMockState,
        GEM_TYPES: constants.GEM_TYPES,
    };
};

const cloneGameState = (state) => structuredClone(state);

const buildApplyActionHotPaths = (createMockState, GEM_TYPES) => {
    const buyCardState = createMockState({
        turn: 'p2',
        inventories: {
            p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            p2: { blue: 5, white: 5, green: 5, black: 5, red: 5, gold: 0, pearl: 0 },
        },
        market: {
            1: [
                {
                    id: 'market-high',
                    level: 1,
                    cost: {
                        blue: 0,
                        white: 0,
                        green: 0,
                        black: 0,
                        red: 0,
                        pearl: 0,
                        gold: 0,
                    },
                    points: 5,
                    bonusColor: 'blue',
                },
            ],
            2: [],
            3: [],
        },
        playerReserved: {
            p1: [],
            p2: [
                {
                    id: 'reserved-low',
                    level: 2,
                    cost: {
                        blue: 0,
                        white: 0,
                        green: 0,
                        black: 0,
                        red: 0,
                        pearl: 0,
                        gold: 0,
                    },
                    points: 1,
                    bonusColor: 'green',
                },
            ],
        },
    });
    const buyCardAction = {
        type: 'BUY_CARD',
        payload: {
            card: buyCardState.market[1][0],
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
            randoms: { bountyHunterColor: 'red' },
        },
    };

    const takeGemsState = createMockState({
        turn: 'p2',
        inventories: {
            p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
        },
        board: [
            [GEM_TYPES.RED, GEM_TYPES.GREEN, GEM_TYPES.BLUE, GEM_TYPES.EMPTY, GEM_TYPES.EMPTY],
            Array.from({ length: 5 }, () => GEM_TYPES.EMPTY),
            Array.from({ length: 5 }, () => GEM_TYPES.EMPTY),
            Array.from({ length: 5 }, () => GEM_TYPES.EMPTY),
            Array.from({ length: 5 }, () => GEM_TYPES.EMPTY),
        ].map((row, r) =>
            row.map((type, c) => ({
                type,
                uid: `${r}-${c}-${type.id}`,
            }))
        ),
        bag: [],
        market: { 1: [], 2: [], 3: [] },
        playerReserved: { p1: [], p2: [] },
    });
    const takeGemsAction = {
        type: 'TAKE_GEMS',
        payload: {
            coords: [
                { r: 0, c: 0 },
                { r: 0, c: 1 },
                { r: 0, c: 2 },
            ],
        },
    };

    const stealGemState = createMockState({
        phase: 'STEAL_ACTION',
        turn: 'p1',
        inventories: {
            p1: {
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                red: 0,
                gold: 0,
                pearl: 0,
            },
            p2: {
                blue: 0,
                white: 0,
                green: 0,
                black: 0,
                red: 2,
                gold: 0,
                pearl: 0,
            },
        },
    });
    const stealGemAction = { type: 'STEAL_GEM', payload: { gemId: 'red' } };

    const closeModalState = createMockState({
        activeModal: {
            type: 'PEEK',
            data: {
                cards: [],
                initiator: 'p1',
            },
        },
    });

    return {
        buyCardState,
        buyCardAction,
        takeGemsState,
        takeGemsAction,
        stealGemState,
        stealGemAction,
        closeModalState,
    };
};

const measure = ({ id, iterations, run }) => {
    const samples = [];
    for (let index = 0; index < iterations; index += 1) {
        const startedAt = performance.now();
        run();
        samples.push(performance.now() - startedAt);
    }

    return {
        id,
        iterations,
        medianMs: roundMs(quantile(samples, 0.5)),
        p95Ms: roundMs(quantile(samples, 0.95)),
        maxMs: roundMs(Math.max(...samples)),
    };
};

const buildFixture = (packageJson, sharedRuntime) =>
    withDeterministicRandom(() => {
        const {
            applyAction,
            buildIdentityRuntimeToInstanceMap,
            buildStartGameAction,
            INITIAL_STATE_SKELETON,
            NETWORK_PROTOCOL_VERSION,
            simulateAiVsAiReplay,
        } = sharedRuntime;
        const startAction = buildStartGameAction('LOCAL_PVP', { useBuffs: false });
        const initialState = applyAction(INITIAL_STATE_SKELETON, startAction);
        if (!initialState) {
            throw new Error('Benchmark fixture failed to initialize game state.');
        }

        const simulation = simulateAiVsAiReplay({
            gameVersion: packageJson.version,
            useBuffs: false,
            maxActions: 80,
            createdAt: '2026-04-25T00:00:00.000Z',
        });
        const replayJson = JSON.stringify(simulation.replay);
        const runtimeToInstance = buildIdentityRuntimeToInstanceMap(
            simulation.replay.init.cardInstances
        );
        const heartbeatPayload = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HEARTBEAT_PING',
            timestamp: 1776688496000,
        };

        return {
            startAction,
            initialState,
            simulation,
            replayJson,
            runtimeToInstance,
            heartbeatPayload,
        };
    });

const runBenchmarks = ({ packageJson, baseline, sharedRuntime }) => {
    const {
        applyAction,
        computeAiAction,
        createMockState,
        GEM_TYPES,
        INITIAL_STATE_SKELETON,
        loadReplaySession,
        parseNetworkMessageBoundary,
        readReplayVNext,
        saveReplayVNext,
        simulateAiVsAiReplay,
    } = sharedRuntime;
    const fixture = buildFixture(packageJson, sharedRuntime);
    const hotPaths = buildApplyActionHotPaths(createMockState, GEM_TYPES);
    const benchmarkIterations = new Map(
        baseline.benchmarks.map((benchmark) => [
            benchmark.id,
            Math.max(
                benchmark.iterations ?? 0,
                baseline.measurementPolicy?.minimumIterations ?? 50
            ),
        ])
    );

    const applyInnerRepeats = 48;

    return [
        measure({
            id: 'reducer-init',
            iterations: benchmarkIterations.get('reducer-init') ?? 100,
            run: () => applyAction(INITIAL_STATE_SKELETON, fixture.startAction),
        }),
        measure({
            id: 'ai-action',
            iterations: benchmarkIterations.get('ai-action') ?? 100,
            run: () => computeAiAction(fixture.initialState),
        }),
        measure({
            id: 'protocol-validation',
            iterations: benchmarkIterations.get('protocol-validation') ?? 100,
            run: () => parseNetworkMessageBoundary(fixture.heartbeatPayload),
        }),
        measure({
            id: 'replay-load-save',
            iterations: benchmarkIterations.get('replay-load-save') ?? 50,
            run: () => {
                const { replay } = readReplayVNext(fixture.replayJson, { verifySummary: 'sample' });
                const session = loadReplaySession(replay);
                saveReplayVNext({
                    replayRevision: replay.replayRevision,
                    gameVersion: replay.gameVersion,
                    createdAt: replay.createdAt,
                    init: replay.init,
                    events: replay.events,
                    checkpoints: replay.checkpoints ?? [],
                    currentState: session.finalState,
                    runtimeToInstance: fixture.runtimeToInstance,
                    endReason: replay.summary.endReason,
                });
            },
        }),
        measure({
            id: 'apply-action-buy-card',
            iterations: benchmarkIterations.get('apply-action-buy-card') ?? 50,
            run: () => {
                for (let index = 0; index < applyInnerRepeats; index += 1) {
                    applyAction(cloneGameState(hotPaths.buyCardState), hotPaths.buyCardAction);
                }
            },
        }),
        measure({
            id: 'apply-action-take-gems',
            iterations: benchmarkIterations.get('apply-action-take-gems') ?? 50,
            run: () => {
                for (let index = 0; index < applyInnerRepeats; index += 1) {
                    applyAction(cloneGameState(hotPaths.takeGemsState), hotPaths.takeGemsAction);
                }
            },
        }),
        measure({
            id: 'apply-action-steal-gem',
            iterations: benchmarkIterations.get('apply-action-steal-gem') ?? 50,
            run: () => {
                for (let index = 0; index < applyInnerRepeats; index += 1) {
                    applyAction(cloneGameState(hotPaths.stealGemState), hotPaths.stealGemAction);
                }
            },
        }),
        measure({
            id: 'apply-action-close-modal',
            iterations: benchmarkIterations.get('apply-action-close-modal') ?? 50,
            run: () => {
                for (let index = 0; index < applyInnerRepeats; index += 1) {
                    applyAction(cloneGameState(hotPaths.closeModalState), { type: 'CLOSE_MODAL' });
                }
            },
        }),
        measure({
            id: 'replay-simulate-100',
            iterations: benchmarkIterations.get('replay-simulate-100') ?? 12,
            run: () =>
                withDeterministicRandom(() => {
                    simulateAiVsAiReplay({
                        gameVersion: packageJson.version,
                        useBuffs: false,
                        maxActions: 100,
                        createdAt: '2026-04-25T00:00:00.000Z',
                    });
                }),
        }),
        measure({
            id: 'replay-simulate-500',
            iterations: benchmarkIterations.get('replay-simulate-500') ?? 8,
            run: () =>
                withDeterministicRandom(() => {
                    simulateAiVsAiReplay({
                        gameVersion: packageJson.version,
                        useBuffs: false,
                        maxActions: 500,
                        createdAt: '2026-04-25T00:00:00.000Z',
                    });
                }),
        }),
        measure({
            id: 'replay-simulate-1000',
            iterations: benchmarkIterations.get('replay-simulate-1000') ?? 4,
            run: () =>
                withDeterministicRandom(() => {
                    simulateAiVsAiReplay({
                        gameVersion: packageJson.version,
                        useBuffs: false,
                        maxActions: 1000,
                        createdAt: '2026-04-25T00:00:00.000Z',
                    });
                }),
        }),
    ];
};

const writeJson = (filePath, value, pretty) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, pretty ? 2 : 0)}\n`, 'utf8');
};

const main = async () => {
    const args = parseArgs(process.argv.slice(2));
    const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
    const baseline = JSON.parse(
        fs.readFileSync(
            path.join(repoRoot, 'tools', 'governance', 'benchmark-baselines.snapshot.json'),
            'utf8'
        )
    );
    const generatedAt = new Date().toISOString();
    const report = {
        schemaVersion: 1,
        generatedAt,
        provenance: {
            generatedBy: 'tools/scripts/run-lifecycle-benchmarks.mjs',
            sha: process.env.GITHUB_SHA ?? null,
            ref: process.env.GITHUB_REF ?? null,
        },
        packageVersion: packageJson.version,
        benchmarks: runBenchmarks({
            packageJson,
            baseline,
            sharedRuntime: await loadSharedRuntime(),
        }),
    };
    const errors = collectBenchmarkReportErrors({
        report,
        baseline,
    });

    report.status = errors.length > 0 ? 'failed' : 'passed';
    report.errors = errors;
    writeJson(path.join(args.outDir, 'lifecycle-benchmarks.report.json'), report, args.pretty);

    if (errors.length > 0) {
        console.error('Lifecycle benchmark check failed:');
        for (const error of errors) {
            console.error(`- ${error}`);
        }
        process.exit(1);
    }

    console.log(
        `Lifecycle benchmark check passed and wrote ${path.join(args.outDir, 'lifecycle-benchmarks.report.json')}.`
    );
};

await main();
