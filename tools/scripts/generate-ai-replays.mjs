import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const gameVersion = process.env.npm_package_version ?? '0.0.0-dev';

const parsePositiveInteger = (value, flagName) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`${flagName} must be a positive integer.`);
    }
    return parsed;
};

const parseMode = (value) => {
    if (value === 'LOCAL_PVP' || value === 'PVE') {
        return value;
    }
    throw new Error('mode must be either LOCAL_PVP or PVE.');
};

const buildDefaultOutDir = () =>
    path.join(
        workspaceRoot,
        'Replay',
        'ai-batches',
        new Date().toISOString().replace(/[:.]/g, '-')
    );

const printUsage = () => {
    process.stdout.write(
        [
            'Usage: pnpm --dir tools/scripts run ai:replays -- [options]',
            '',
            'Options:',
            '  --count <n>         Number of AI vs AI matches to simulate (default: 5)',
            '  --mode <mode>       LOCAL_PVP or PVE (default: LOCAL_PVP)',
            '  --max-actions <n>   Abort a match after this many actions (default: 1200)',
            '  --use-buffs         Enable buff draft during simulation',
            '  --out-dir <path>    Output directory for replay exports',
            '  --no-write          Skip writing JSON files and print summary only',
            '  --help              Show this help message',
            '',
        ].join('\n')
    );
};

const parseCliOptions = () => {
    const forwardedArgs = process.argv.slice(2);
    const normalizedArgs =
        forwardedArgs.length > 0 && forwardedArgs[0] === '--'
            ? forwardedArgs.slice(1)
            : forwardedArgs;
    const { values } = parseArgs({
        args: normalizedArgs,
        options: {
            count: { type: 'string' },
            mode: { type: 'string' },
            'max-actions': { type: 'string' },
            'use-buffs': { type: 'boolean' },
            'out-dir': { type: 'string' },
            write: { type: 'boolean' },
            help: { type: 'boolean' },
        },
        allowPositionals: false,
        allowNegative: true,
        strict: true,
    });

    if (values.help) {
        printUsage();
        process.exit(0);
    }

    return {
        count: values.count ? parsePositiveInteger(values.count, '--count') : 5,
        mode: values.mode ? parseMode(values.mode) : 'LOCAL_PVP',
        useBuffs: values['use-buffs'] ?? false,
        maxActions: values['max-actions']
            ? parsePositiveInteger(values['max-actions'], '--max-actions')
            : 1_200,
        writeFiles: values.write ?? true,
        outDir: path.resolve(values['out-dir'] ?? buildDefaultOutDir()),
    };
};

const buildReplayFileName = (index, finalStateHash) =>
    `GemDuel_AIReplay_v1_${String(index + 1).padStart(3, '0')}_${finalStateHash}.json`;

const buildManifest = (options, results) => {
    const wins = results.reduce((accumulator, result) => {
        const winner = result.replay.match.winner ?? 'none';
        accumulator[winner] = (accumulator[winner] ?? 0) + 1;
        return accumulator;
    }, {});

    const averageConfidence =
        results.reduce((sum, result) => sum + result.evaluation.confidence, 0) / results.length;
    const averageTurns =
        results.reduce((sum, result) => sum + result.summary.turnCount, 0) / results.length;

    return {
        generatedAt: new Date().toISOString(),
        options: {
            count: options.count,
            mode: options.mode,
            useBuffs: options.useBuffs,
            maxActions: options.maxActions,
        },
        aggregate: {
            completed: results.filter((result) => result.status === 'completed').length,
            aborted: results.filter((result) => result.status === 'aborted').length,
            averageConfidence,
            averageTurns,
            wins,
        },
        matches: results.map((result, index) => ({
            index: index + 1,
            fileName: buildReplayFileName(index, result.summary.finalStateHash),
            status: result.status,
            abortReason: result.abortReason,
            winner: result.replay.match.winner,
            endReason: result.replay.match.endReason,
            turnCount: result.summary.turnCount,
            totalEvents: result.summary.totalEvents,
            finalStateHash: result.summary.finalStateHash,
            confidence: result.evaluation.confidence,
        })),
    };
};

const loadSimulationApi = async () => {
    const replayModulePath = ['..', '..', 'packages', 'shared', 'src', 'replay', 'index.ts'].join('/');
    return import(replayModulePath);
};

const main = async () => {
    const options = parseCliOptions();
    const { simulateAiVsAiReplayBatch } = await loadSimulationApi();
    const results = simulateAiVsAiReplayBatch(options.count, {
        gameVersion,
        mode: options.mode,
        useBuffs: options.useBuffs,
        maxActions: options.maxActions,
    });
    const manifest = buildManifest(options, results);

    if (options.writeFiles) {
        await mkdir(options.outDir, { recursive: true });
        await Promise.all(
            results.map((result, index) =>
                writeFile(
                    path.join(options.outDir, buildReplayFileName(index, result.summary.finalStateHash)),
                    JSON.stringify(result.replay),
                    'utf8'
                )
            )
        );
        await writeFile(
            path.join(options.outDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2),
            'utf8'
        );
    }

    process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
};

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
});
