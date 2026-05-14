#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), '..', '..');
const defaultOutputRoot = path.join(
    repoRoot,
    'artifacts',
    'electron-unity-parity',
    'local-pvp-built-player-full-game'
);
const defaultExe = path.join(
    repoRoot,
    'artifacts',
    'unity',
    'build',
    'windows',
    'GemDuelUnity.exe'
);

const parseArgs = () => {
    const values = new Map();
    const args = process.argv.slice(2);
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (!arg.startsWith('--')) {
            continue;
        }

        const next = args[index + 1];
        if (next && !next.startsWith('--')) {
            values.set(arg, next);
            index += 1;
        } else {
            values.set(arg, 'true');
        }
    }

    return {
        matchCount: Number(values.get('--match-count') ?? 100),
        seedPrefix: values.get('--seed-prefix') ?? 'local-pvp-built-player-fullgame-2026-05-13',
        gameVersion: values.get('--game-version') ?? '5.2.11',
        maxActions: Number(values.get('--max-actions') ?? 500),
        maxSeedAttempts: Number(values.get('--max-seed-attempts') ?? 100),
        outputRoot: path.resolve(values.get('--output-root') ?? defaultOutputRoot),
        exe: path.resolve(values.get('--exe') ?? defaultExe),
        timeoutMs: Number(values.get('--timeout-ms') ?? 3600000),
        builtPlayerBatchSize: Number(
            values.get('--built-player-batch-size') ?? values.get('--match-count') ?? 100
        ),
        stopOnFirstFailure: values.get('--stop-on-first-failure') !== 'false',
        skipRun: values.get('--skip-run') === 'true',
        rulesRuntimeMode: values.get('--rules-runtime-mode') ?? 'localdev-mailbox',
        rulesRuntimeDir: values.get('--rules-runtime-dir') ?? null,
    };
};

const execFileCapture = (command, args, { timeoutMs = 120000 } = {}) =>
    new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: repoRoot,
            shell: process.platform === 'win32' && !command.toLowerCase().endsWith('.exe'),
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, GEMDUEL_REPOSITORY_ROOT: repoRoot },
        });
        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => {
            child.kill('SIGKILL');
            reject(new Error(`${command} ${args.join(' ')} timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });
        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });
        child.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
        child.on('close', (code, signal) => {
            clearTimeout(timer);
            if (code === 0) {
                resolve({ stdout, stderr, code, signal });
                return;
            }

            const error = new Error(
                `${command} ${args.join(' ')} failed with code ${code}, signal ${signal}.\n${stderr}`
            );
            error.stdout = stdout;
            error.stderr = stderr;
            error.code = code;
            error.signal = signal;
            reject(error);
        });
    });

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

const shortErrorText = (error) =>
    [
        error instanceof Error ? error.message : String(error),
        error?.stderr ?? '',
        error?.stdout ?? '',
    ]
        .join('\n')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1000);

const isRetryablePlanGenerationError = (error) =>
    /not UI-legal under Electron command gate|Local PVP oracle simulation did not complete/.test(
        shortErrorText(error)
    );

const generatePlans = async (options, runDir) => {
    const planDir = path.join(runDir, 'plans');
    await mkdir(planDir, { recursive: true });
    const generated = [];
    const skipped = [];
    let candidateIndex = 0;
    const maxCandidates = options.matchCount * options.maxSeedAttempts;

    while (generated.length < options.matchCount) {
        if (candidateIndex >= maxCandidates) {
            throw new Error(
                `Could not generate ${options.matchCount} Electron-legal Local PVP plans after ${candidateIndex} candidate seeds.`
            );
        }

        candidateIndex += 1;
        const seed = `${options.seedPrefix}-${String(candidateIndex).padStart(3, '0')}`;
        const matchIndex = generated.length + 1;
        const planPath = path.join(planDir, `plan-${String(matchIndex).padStart(3, '0')}.json`);
        try {
            await execFileCapture(
                'pnpm',
                [
                    '--dir',
                    'tools/scripts',
                    'exec',
                    'vite-node',
                    '--script',
                    '../../tools/migration/local-pvp-full-game-plan.ts',
                    '--seed',
                    seed,
                    '--game-version',
                    options.gameVersion,
                    '--max-actions',
                    String(options.maxActions),
                    '--out',
                    planPath,
                ],
                { timeoutMs: 120000 }
            );
        } catch (error) {
            if (!isRetryablePlanGenerationError(error)) {
                throw error;
            }

            skipped.push({
                seed,
                reason: shortErrorText(error),
            });
            continue;
        }

        const planText = await readFile(planPath, 'utf8');
        const plan = JSON.parse(planText);
        generated.push({
            seed,
            planPath,
            uiSteps: plan.uiSteps?.length ?? 0,
            logicalActions: plan.logicalActions?.length ?? 0,
            replayRevision: plan.oracle?.replayRevision ?? null,
            finalStateHash: plan.oracle?.finalStateHash ?? null,
            winner: plan.oracle?.winner ?? null,
            sha256: sha256(planText),
        });
    }

    return { planDir, generated, skipped, candidateSeedsEvaluated: candidateIndex };
};

const percentile = (values, ratio) => {
    if (values.length === 0) {
        return 0;
    }

    const sorted = [...values].sort((left, right) => left - right);
    const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * ratio) - 1));
    return sorted[index];
};

const runBuiltPlayerSuite = async (options, runDir, planDir, matchCount = options.matchCount) => {
    const reportPath = path.join(runDir, 'unity-full-game-smoke.json');
    const launcherReportPath = path.join(runDir, 'unity-full-game-smoke.launcher.json');
    const stdoutPath = path.join(runDir, 'unity-full-game-smoke.stdout.log');
    const stderrPath = path.join(runDir, 'unity-full-game-smoke.stderr.log');
    const playerLogPath = path.join(runDir, 'unity-full-game-smoke.player.log');
    let launchError = null;
    try {
        await execFileCapture(
            process.execPath,
            [
                'tools/migration/run-unity-built-player-smoke.mjs',
                '--exe',
                options.exe,
                '--full-game-plan-dir',
                planDir,
                '--full-game-plan-limit',
                String(matchCount),
                '--timeout-ms',
                String(options.timeoutMs),
                '--report',
                reportPath,
                '--launcher-report',
                launcherReportPath,
                '--stdout',
                stdoutPath,
                '--stderr',
                stderrPath,
                '--player-log',
                playerLogPath,
                '--rules-runtime-mode',
                options.rulesRuntimeMode,
                ...(options.rulesRuntimeDir
                    ? ['--rules-runtime-dir', options.rulesRuntimeDir]
                    : []),
            ],
            { timeoutMs: options.timeoutMs + 30000 }
        );
    } catch (error) {
        launchError = error;
    }

    const launcher = existsSync(launcherReportPath)
        ? JSON.parse(await readFile(launcherReportPath, 'utf8'))
        : null;
    if (launchError && launcher == null) {
        throw launchError;
    }

    return {
        reportPath,
        launcherReportPath,
        stdoutPath,
        stderrPath,
        playerLogPath,
        launcher,
        launchError: launchError ? shortErrorText(launchError) : null,
    };
};

const createPlanChunk = async (runDir, generated, startIndex, endIndex, batchIndex) => {
    const batchDir = path.join(
        runDir,
        'batches',
        `batch-${String(batchIndex + 1).padStart(3, '0')}`
    );
    const chunkPlanDir = path.join(batchDir, 'plans');
    await mkdir(chunkPlanDir, { recursive: true });
    for (const plan of generated.slice(startIndex, endIndex)) {
        await copyFile(plan.planPath, path.join(chunkPlanDir, path.basename(plan.planPath)));
    }

    return {
        batchIndex,
        startIndex,
        endIndex,
        batchDir,
        planDir: chunkPlanDir,
        matchCount: endIndex - startIndex,
    };
};

const buildPerformanceSummary = (matches) => {
    const durations = matches.flatMap((match) =>
        (match.records ?? [])
            .map((record) => Number(record.durationMs))
            .filter((value) => Number.isFinite(value))
    );
    const totalDurationMs = durations.reduce((sum, value) => sum + value, 0);
    return {
        recordedUiSteps: durations.length,
        totalDurationMs,
        averageStepDurationMs:
            durations.length > 0 ? Math.round(totalDurationMs / durations.length) : 0,
        p95StepDurationMs: percentile(durations, 0.95),
        maxStepDurationMs: durations.length > 0 ? Math.max(...durations) : 0,
    };
};

const combineBatchSuites = (options, batchRuns) => {
    const suites = batchRuns.map(
        (batch) => batch.builtPlayer.launcher?.smoke?.fullGamePlanSuite ?? null
    );
    const matches = [];
    const coveredActionFamilies = new Set();
    const coveredPhaseEdges = new Set();
    let executedMatches = 0;
    let passed = 0;
    let failed = 0;
    let firstFailure = null;

    for (let batchIndex = 0; batchIndex < batchRuns.length; batchIndex += 1) {
        const batch = batchRuns[batchIndex];
        const suite = suites[batchIndex];
        executedMatches += Number(suite?.executedMatches ?? 0);
        passed += Number(suite?.passed ?? 0);
        failed += Number(suite?.failed ?? 0);
        for (const family of suite?.coveredActionFamilies ?? []) {
            coveredActionFamilies.add(family);
        }

        for (const edge of suite?.coveredPhaseEdges ?? []) {
            coveredPhaseEdges.add(edge);
        }

        for (const match of suite?.matches ?? []) {
            matches.push({
                ...match,
                globalMatchIndex: batch.startIndex + Number(match.matchIndex ?? 0),
                batchIndex,
                batchMatchIndex: match.matchIndex,
            });
        }

        if (firstFailure == null && suite?.firstFailure) {
            firstFailure = {
                ...suite.firstFailure,
                globalMatchIndex: batch.startIndex + Number(suite.firstFailure.matchIndex ?? 0),
                batchIndex,
            };
        }
    }

    const ok =
        batchRuns.length > 0 &&
        batchRuns.every((batch) => batch.builtPlayer.launcher?.ok === true) &&
        suites.every((suite) => suite?.ok === true) &&
        executedMatches === options.matchCount &&
        passed === options.matchCount &&
        failed === 0;
    const batchSummaries = batchRuns.map((batch, index) => {
        const suite = suites[index];
        return {
            batchIndex: batch.batchIndex,
            startIndex: batch.startIndex,
            endIndex: batch.endIndex,
            matchCount: batch.matchCount,
            ok: suite?.ok === true,
            executedMatches: suite?.executedMatches ?? 0,
            passed: suite?.passed ?? 0,
            failed: suite?.failed ?? 0,
            suiteTraceHash: suite?.suiteTraceHash ?? null,
            launcherReportPath: batch.builtPlayer.launcherReportPath,
            smokeReportPath: batch.builtPlayer.reportPath,
            playerLogPath: batch.builtPlayer.playerLogPath,
            failureReason:
                suite?.failureReason ??
                batch.builtPlayer.launcher?.failureReason ??
                batch.builtPlayer.launchError ??
                null,
        };
    });

    return {
        schemaVersion: 1,
        kind: 'unity-localdev-full-game-plan-suite-batched',
        ok,
        verdict: ok ? 'BuiltPlayerUiComplete' : 'Incomplete',
        requestedMatches: options.matchCount,
        plannedMatches: options.matchCount,
        executedMatches,
        passed,
        failed,
        batchSize: options.builtPlayerBatchSize,
        scope: {
            included: ['Local PVP'],
            exempt: ['LAN', 'Online', 'Visual Lab'],
        },
        controls: {
            driver: 'built Windows Unity Player',
            rulesEngine: 'TypeScript IGameRulesEngine bridge',
            rulesRuntimeMode: options.rulesRuntimeMode,
            uiDriver: 'GemDuelGameController semantic target hit testing',
            execution: 'batched built-player chunks with aggregate report',
            stopOnFirstFailure: options.stopOnFirstFailure,
        },
        batches: batchSummaries,
        matches,
        coveredActionFamilies: [...coveredActionFamilies].sort(),
        coveredPhaseEdges: [...coveredPhaseEdges].sort(),
        performanceSummary: buildPerformanceSummary(matches),
        suiteTraceHash: sha256(
            JSON.stringify(
                batchSummaries.map((batch) => ({
                    ok: batch.ok,
                    startIndex: batch.startIndex,
                    endIndex: batch.endIndex,
                    suiteTraceHash: batch.suiteTraceHash,
                }))
            )
        ),
        firstFailure,
    };
};

const runBuiltPlayerSuiteBatched = async (options, runDir, generated) => {
    const batchSize = Math.max(1, Math.min(options.builtPlayerBatchSize, options.matchCount));
    if (batchSize >= options.matchCount) {
        return runBuiltPlayerSuite(options, runDir, path.join(runDir, 'plans'), options.matchCount);
    }

    const batchRuns = [];
    for (
        let startIndex = 0, batchIndex = 0;
        startIndex < generated.length;
        startIndex += batchSize, batchIndex += 1
    ) {
        const endIndex = Math.min(generated.length, startIndex + batchSize);
        const chunk = await createPlanChunk(runDir, generated, startIndex, endIndex, batchIndex);
        const builtPlayer = await runBuiltPlayerSuite(
            options,
            chunk.batchDir,
            chunk.planDir,
            chunk.matchCount
        );
        batchRuns.push({ ...chunk, builtPlayer });
        const suite = builtPlayer.launcher?.smoke?.fullGamePlanSuite;
        if (suite?.ok !== true || builtPlayer.launcher?.ok !== true) {
            break;
        }
    }

    const suite = combineBatchSuites(options, batchRuns);
    return {
        launcherReportPath: null,
        reportPath: null,
        stdoutPath: null,
        stderrPath: null,
        playerLogPath: null,
        launchError:
            batchRuns.find((batch) => batch.builtPlayer.launchError)?.builtPlayer.launchError ??
            null,
        launcher: {
            ok: suite.ok,
            smoke: {
                fullGamePlanSuite: suite,
            },
            batches: suite.batches,
        },
        batches: batchRuns.map((batch) => ({
            batchIndex: batch.batchIndex,
            startIndex: batch.startIndex,
            endIndex: batch.endIndex,
            matchCount: batch.matchCount,
            batchDir: batch.batchDir,
            planDir: batch.planDir,
            launcherReportPath: batch.builtPlayer.launcherReportPath,
            smokeReportPath: batch.builtPlayer.reportPath,
            stdoutPath: batch.builtPlayer.stdoutPath,
            stderrPath: batch.builtPlayer.stderrPath,
            playerLogPath: batch.builtPlayer.playerLogPath,
            launchError: batch.builtPlayer.launchError,
        })),
    };
};

const buildHtml = (report) => {
    const escape = (value) =>
        String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');
    const suite = report.builtPlayer?.suite ?? {};
    const firstFailure = report.firstFailure ? JSON.stringify(report.firstFailure, null, 2) : '';
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Local PVP Built Player Full Game Suite</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; margin: 32px; background: #f7f9fc; color: #172033; }
    main { max-width: 1120px; margin: 0 auto; }
    .verdict { display: inline-block; padding: 6px 12px; border-radius: 6px; font-weight: 700; background: ${report.ok ? '#d8f7df' : '#ffe0df'}; color: ${report.ok ? '#0a6b22' : '#9b1711'}; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin: 16px 0; }
    .box { background: white; border: 1px solid #d9e2ef; border-radius: 8px; padding: 14px 16px; }
    table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #d9e2ef; }
    td, th { padding: 8px 10px; border-bottom: 1px solid #e7edf6; text-align: left; font-size: 13px; }
    th { background: #edf2fa; }
    pre { background: #172033; color: #f7f9fc; padding: 14px; border-radius: 8px; overflow: auto; }
  </style>
</head>
<body>
<main>
  <h1>Local PVP Built Player Full Game Suite</h1>
  <div class="verdict">${escape(report.verdict)}</div>
  <div class="grid">
    <div class="box"><strong>Requested</strong><br>${escape(report.requestedMatches)}</div>
    <div class="box"><strong>Executed</strong><br>${escape(suite.executedMatches)}</div>
    <div class="box"><strong>Passed</strong><br>${escape(suite.passed)}</div>
    <div class="box"><strong>Failed</strong><br>${escape(suite.failed)}</div>
    <div class="box"><strong>Suite hash</strong><br>${escape(suite.suiteTraceHash)}</div>
  </div>
  <h2>Artifacts</h2>
  <table><tbody>
    ${Object.entries(report.paths ?? {})
        .map(([key, value]) => `<tr><th>${escape(key)}</th><td>${escape(value)}</td></tr>`)
        .join('')}
  </tbody></table>
  <h2>First Failure</h2>
  ${firstFailure ? `<pre>${escape(firstFailure)}</pre>` : '<p>No failure recorded.</p>'}
</main>
</body>
</html>
`;
};

const main = async () => {
    const options = parseArgs();
    if (!Number.isInteger(options.matchCount) || options.matchCount < 1) {
        throw new Error(`Invalid --match-count: ${options.matchCount}`);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const runDir = path.join(options.outputRoot, timestamp);
    await mkdir(runDir, { recursive: true });
    const { planDir, generated, skipped, candidateSeedsEvaluated } = await generatePlans(
        options,
        runDir
    );

    let builtPlayer = null;
    let failureReason = null;
    if (!options.skipRun) {
        if (!existsSync(options.exe)) {
            failureReason = `Built Windows Unity Player executable was not found: ${options.exe}`;
        } else {
            try {
                builtPlayer = await runBuiltPlayerSuiteBatched(options, runDir, generated);
            } catch (error) {
                failureReason = error instanceof Error ? error.message : String(error);
            }
        }
    }

    const suite = builtPlayer?.launcher?.smoke?.fullGamePlanSuite ?? null;
    const ok =
        Boolean(builtPlayer?.launcher?.ok) &&
        suite?.ok === true &&
        suite?.executedMatches === options.matchCount &&
        suite?.passed === options.matchCount &&
        suite?.failed === 0;
    const report = {
        schemaVersion: 1,
        kind: 'local-pvp-built-player-full-game-suite-report',
        generatedAt: new Date().toISOString(),
        ok,
        verdict: ok ? 'BuiltPlayerUiComplete' : 'Incomplete',
        finalMigrationStatus: 'Incomplete',
        finalMigrationStatusReason:
            'This report covers built Windows Unity Player Local PVP full-game UI evidence only. Product-surface coverage must still aggregate release-runtime packaging, settings/recovery breadth, visual/layout/perf matrix, and non-Local-PVP exempt policy before final Complete.',
        failureReason: ok
            ? null
            : (failureReason ??
              suite?.failureReason ??
              builtPlayer?.launcher?.failureReason ??
              builtPlayer?.launchError ??
              null),
        requestedMatches: options.matchCount,
        seedPrefix: options.seedPrefix,
        builtPlayerBatchSize: options.builtPlayerBatchSize,
        rulesRuntimeMode: options.rulesRuntimeMode,
        rulesRuntimeDir: options.rulesRuntimeDir,
        plans: {
            directory: planDir,
            generatedCount: generated.length,
            candidateSeedsEvaluated,
            skippedCount: skipped.length,
            skipped,
            generated,
        },
        builtPlayer: builtPlayer
            ? {
                  launcherReportPath: builtPlayer.launcherReportPath,
                  smokeReportPath: builtPlayer.reportPath,
                  stdoutPath: builtPlayer.stdoutPath,
                  stderrPath: builtPlayer.stderrPath,
                  playerLogPath: builtPlayer.playerLogPath,
                  launchError: builtPlayer.launchError,
                  batches: builtPlayer.batches ?? null,
                  launcherOk: builtPlayer.launcher?.ok ?? false,
                  exitCode: builtPlayer.launcher?.exitCode ?? null,
                  timedOut: builtPlayer.launcher?.timedOut ?? null,
                  suite,
              }
            : null,
        firstFailure: suite?.firstFailure ?? null,
        paths: {
            runDir,
            planDir,
            launcherReport: builtPlayer?.launcherReportPath ?? null,
            batches: builtPlayer?.batches?.map((batch) => batch.batchDir) ?? null,
        },
    };
    const reportPath = path.join(runDir, 'local-pvp-built-player-full-game-suite-report.json');
    const htmlPath = path.join(runDir, 'local-pvp-built-player-full-game-suite-report.html');
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    await writeFile(htmlPath, buildHtml(report), 'utf8');
    console.log(
        JSON.stringify(
            {
                ok: report.ok,
                verdict: report.verdict,
                finalMigrationStatus: report.finalMigrationStatus,
                failureReason: report.failureReason,
                reportPath,
                htmlPath,
                requestedMatches: report.requestedMatches,
                executedMatches: suite?.executedMatches ?? 0,
                passed: suite?.passed ?? 0,
                failed: suite?.failed ?? 0,
            },
            null,
            2
        )
    );
    if (!report.ok) {
        process.exitCode = 1;
    }
};

main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
});
