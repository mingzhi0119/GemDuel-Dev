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
        'ai-audits',
        new Date().toISOString().replace(/[:.]/g, '-')
    );

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

const printUsage = () => {
    process.stdout.write(
        [
            'Usage: pnpm --dir tools/scripts run ai:replays:audit -- [options]',
            '',
            'Options:',
            '  --count <n>         Number of AI vs AI matches to simulate and audit (default: 100)',
            '  --mode <mode>       LOCAL_PVP or PVE (default: LOCAL_PVP)',
            '  --max-actions <n>   Abort a match after this many actions (default: 1200)',
            '  --use-buffs         Enable buff draft during simulation',
            '  --out-dir <path>    Output directory for replay exports and audit report',
            '  --no-write          Skip writing replay JSON files and reports',
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
        count: values.count ? parsePositiveInteger(values.count, '--count') : 100,
        mode: values.mode ? parseMode(values.mode) : 'LOCAL_PVP',
        useBuffs: values['use-buffs'] ?? false,
        maxActions: values['max-actions']
            ? parsePositiveInteger(values['max-actions'], '--max-actions')
            : 1_200,
        writeFiles: values.write ?? true,
        outDir: path.resolve(values['out-dir'] ?? buildDefaultOutDir()),
    };
};

const loadReplayApi = async () => {
    const replayModulePath = ['..', '..', 'packages', 'shared', 'src', 'replay', 'index.ts'].join('/');
    return import(replayModulePath);
};

const formatSignalMessage = (args) =>
    args
        .map((value) => {
            if (typeof value === 'string') {
                return value;
            }

            try {
                return JSON.stringify(value);
            } catch {
                return String(value);
            }
        })
        .join(' ');

const classifySignal = (message) => {
    if (message.includes('[COMMAND_GATE]')) {
        return 'COMMAND_GATE';
    }
    if (message.includes('[FSM] Rolled back action')) {
        return 'FSM_ROLLBACK';
    }
    if (message.includes('[FSM] Rejected bootstrap action')) {
        return 'BOOTSTRAP_REJECTED';
    }
    return 'OTHER';
};

const summarizeSignals = (entries) => {
    const byCategory = entries.reduce((accumulator, entry) => {
        accumulator[entry.category] = (accumulator[entry.category] ?? 0) + 1;
        return accumulator;
    }, {});
    const byMessage = entries.reduce((accumulator, entry) => {
        accumulator[entry.message] = (accumulator[entry.message] ?? 0) + 1;
        return accumulator;
    }, {});

    return {
        totalCount: entries.length,
        byCategory,
        topMessages: Object.entries(byMessage)
            .sort((left, right) => right[1] - left[1])
            .slice(0, 10)
            .map(([message, count]) => ({ message, count })),
    };
};

const captureEngineSignals = async (work) => {
    const entries = [];
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args) => {
        const message = formatSignalMessage(args);
        entries.push({
            level: 'warn',
            category: classifySignal(message),
            message,
        });
    };
    console.error = (...args) => {
        const message = formatSignalMessage(args);
        entries.push({
            level: 'error',
            category: classifySignal(message),
            message,
        });
    };

    try {
        const result = await work();
        return {
            result,
            signals: summarizeSignals(entries),
        };
    } finally {
        console.warn = originalWarn;
        console.error = originalError;
    }
};

const buildFindings = (auditReport, signalSummary) => {
    const findings = [];

    if (auditReport.failedCount > 0) {
        findings.push({
            severity: 'P0',
            category: 'replay-integrity',
            message: `${auditReport.failedCount} replay audits failed integrity checks.`,
        });
    }

    const fsmRollbacks = signalSummary.byCategory.FSM_ROLLBACK ?? 0;
    if (fsmRollbacks > 0) {
        findings.push({
            severity: 'P1',
            category: 'fsm-rollback',
            message: `Observed ${fsmRollbacks} post-action FSM rollbacks during generated replay simulation.`,
        });
    }

    const bootstrapRejections = signalSummary.byCategory.BOOTSTRAP_REJECTED ?? 0;
    if (bootstrapRejections > 0) {
        findings.push({
            severity: 'P1',
            category: 'bootstrap-rejection',
            message: `Observed ${bootstrapRejections} bootstrap state rejections during replay simulation.`,
        });
    }

    const commandGateRejections = signalSummary.byCategory.COMMAND_GATE ?? 0;
    if (commandGateRejections > 0) {
        findings.push({
            severity: 'P3',
            category: 'command-gate-noise',
            message: `Observed ${commandGateRejections} command gate rejections while AI heuristics searched for legal actions.`,
        });
    }

    return findings;
};

const main = async () => {
    const options = parseCliOptions();
    const { simulateAiVsAiReplayBatch, auditReplayBatch } = await loadReplayApi();
    const { result, signals } = await captureEngineSignals(async () => {
        const results = simulateAiVsAiReplayBatch(options.count, {
            gameVersion,
            mode: options.mode,
            useBuffs: options.useBuffs,
            maxActions: options.maxActions,
        });
        const manifest = buildManifest(options, results);
        const audit = auditReplayBatch(
            results.map((entry, index) => {
                const manifestEntry = manifest.matches[index];
                return {
                    id: manifestEntry.fileName,
                    value: entry.replay,
                    expected: {
                        fileName: manifestEntry.fileName,
                        winner: manifestEntry.winner,
                        endReason: manifestEntry.endReason,
                        turnCount: manifestEntry.turnCount,
                        totalEvents: manifestEntry.totalEvents,
                        finalStateHash: manifestEntry.finalStateHash,
                        confidence: manifestEntry.confidence,
                    },
                };
            })
        );

        return {
            results,
            manifest,
            audit,
        };
    });

    const auditResultById = new Map(result.audit.results.map((entry) => [entry.id, entry]));
    const report = {
        generatedAt: new Date().toISOString(),
        options: {
            count: options.count,
            mode: options.mode,
            useBuffs: options.useBuffs,
            maxActions: options.maxActions,
        },
        aggregate: result.manifest.aggregate,
        audit: {
            ok: result.audit.ok,
            auditedCount: result.audit.auditedCount,
            passedCount: result.audit.passedCount,
            failedCount: result.audit.failedCount,
            mismatchCounts: result.audit.mismatchCounts,
            errorCounts: result.audit.errorCounts,
        },
        engineSignals: signals,
        findings: buildFindings(result.audit, signals),
        matches: result.manifest.matches.map((entry) => {
            const auditEntry = auditResultById.get(entry.fileName);
            return {
                ...entry,
                auditStatus: auditEntry?.ok ? 'ok' : 'failed',
                loadedFinalStateHash: auditEntry?.loadedFinalStateHash,
                loadedWinner: auditEntry?.loadedWinner,
                mismatchFields: auditEntry?.mismatches.map((mismatch) => mismatch.field) ?? [],
                auditErrorCode: auditEntry?.error?.code,
            };
        }),
    };

    if (options.writeFiles) {
        await mkdir(options.outDir, { recursive: true });
        await Promise.all(
            result.results.map((entry, index) =>
                writeFile(
                    path.join(
                        options.outDir,
                        buildReplayFileName(index, entry.summary.finalStateHash)
                    ),
                    JSON.stringify(entry.replay),
                    'utf8'
                )
            )
        );
        await writeFile(
            path.join(options.outDir, 'manifest.json'),
            JSON.stringify(result.manifest, null, 2),
            'utf8'
        );
        await writeFile(
            path.join(options.outDir, 'audit.report.json'),
            JSON.stringify(report, null, 2),
            'utf8'
        );
    }

    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (!result.audit.ok) {
        process.exit(1);
    }
};

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
});
