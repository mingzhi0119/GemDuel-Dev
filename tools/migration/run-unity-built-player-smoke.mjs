import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rename, rm, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), '..', '..');
const defaultExe = path.join(
    repoRoot,
    'artifacts',
    'unity',
    'build',
    'windows',
    'GemDuelUnity.exe'
);
const outputDir = path.join(repoRoot, 'artifacts', 'unity', 'built-player-smoke');
const nowSlug = new Date().toISOString().replace(/[:.]/g, '-');

const parseArgs = () => {
    const args = process.argv.slice(2);
    const values = new Map();
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
        exe: values.get('--exe') ?? defaultExe,
        seed: values.get('--seed') ?? 'unity-built-player-smoke',
        maxSteps: values.get('--max-steps') ?? '12',
        startMode: values.get('--start-mode') ?? 'classic',
        idleActionPreference: values.get('--idle-action-preference') ?? 'balanced',
        draftActionPreference: values.get('--draft-action-preference') ?? 'select-first',
        includeReplayReleasePath: values.get('--include-replay-release-path') === 'true',
        includeRecoveryReleasePath: values.get('--include-recovery-release-path') === 'true',
        includeSettingsReleasePath: values.get('--include-settings-release-path') === 'true',
        includeChromeReleasePath: values.get('--include-chrome-release-path') === 'true',
        includeReplayReviewReleasePath:
            values.get('--include-replay-review-release-path') === 'true',
        includeInvalidActionReleasePath:
            values.get('--include-invalid-action-release-path') === 'true',
        includePeekModalReleasePath: values.get('--include-peek-modal-release-path') === 'true',
        includeRecoveryInvalidActionReleasePath:
            values.get('--include-recovery-invalid-action-release-path') === 'true',
        includePrivilegeCancelReleasePath:
            values.get('--include-privilege-cancel-release-path') === 'true',
        includeReservedDiscardReleasePath:
            values.get('--include-reserved-discard-release-path') === 'true',
        includeReservedBuyReleasePath: values.get('--include-reserved-buy-release-path') === 'true',
        includeReserveCancelReleasePath:
            values.get('--include-reserve-cancel-release-path') === 'true',
        includeReserveDeckReleasePath: values.get('--include-reserve-deck-release-path') === 'true',
        includeReserveDeckCancelReleasePath:
            values.get('--include-reserve-deck-cancel-release-path') === 'true',
        includeJokerReleasePath: values.get('--include-joker-release-path') === 'true',
        settingsLocale: values.get('--settings-locale') ?? 'en',
        settingsSurfaceTheme: values.get('--settings-surface-theme') ?? 'pearl-opaline',
        settingsSoundEnabled: values.get('--settings-sound-enabled') ?? 'false',
        settingsVisibility: values.get('--settings-visibility') ?? 'lan-hidden',
        settingsGameMode: values.get('--settings-game-mode') ?? 'classic-local-pvp',
        settingsReplay: values.get('--settings-replay') ?? 'review-navigation-on',
        settingsRecovery: values.get('--settings-recovery') ?? 'autosave-on',
        settingsFreshLaunch: values.get('--settings-fresh-launch') ?? 'restart',
        settingsInput: values.get('--settings-input') ?? 'mouse-click',
        rulesRuntimeMode: values.get('--rules-runtime-mode') ?? 'localdev-mailbox',
        rulesRuntimeDir: values.get('--rules-runtime-dir') ?? null,
        fullGamePlan: values.get('--full-game-plan') ?? null,
        fullGamePlanDir: values.get('--full-game-plan-dir') ?? null,
        fullGamePlanLimit: values.get('--full-game-plan-limit') ?? '100',
        timeoutMs: Number(values.get('--timeout-ms') ?? 120000),
        report: values.get('--report') ?? path.join(outputDir, `smoke-${nowSlug}.json`),
        stdout: values.get('--stdout') ?? path.join(outputDir, `smoke-${nowSlug}.stdout.log`),
        stderr: values.get('--stderr') ?? path.join(outputDir, `smoke-${nowSlug}.stderr.log`),
        playerLog:
            values.get('--player-log') ?? path.join(outputDir, `smoke-${nowSlug}.player.log`),
        launcherReport:
            values.get('--launcher-report') ??
            path.join(outputDir, `smoke-${nowSlug}.launcher.json`),
        replayReleasePathDir:
            values.get('--replay-release-path-dir') ??
            path.join(outputDir, `replay-release-${nowSlug}`),
        replayReviewReleasePathDir:
            values.get('--replay-review-release-path-dir') ??
            path.join(outputDir, `replay-review-release-${nowSlug}`),
    };
};

const readTextIfExists = async (filePath) => {
    try {
        return await readFile(filePath, 'utf8');
    } catch {
        return '';
    }
};

const createBridgeFailureResponse = (reason) => ({
    ok: false,
    replayRevision: 0,
    state: null,
    stateHash: '',
    actionType: '',
    rejection: {
        code: 'BRIDGE_EXECUTION_FAILED',
        reason,
    },
});

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

const writeJsonAtomically = async (filePath, payload) => {
    const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tempPath, `${JSON.stringify(payload, null, 4)}\n`, 'utf8');
    await rename(tempPath, filePath);
};

const writeTextAtomically = async (filePath, text) => {
    const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tempPath, text, 'utf8');
    await rename(tempPath, filePath);
};

const startMailboxBridge = async (mailboxDir, rulesRuntimeDir = null) => {
    const requestDir = path.join(mailboxDir, 'requests');
    const responseDir = path.join(mailboxDir, 'responses');
    const auditResponseDir = path.join(responseDir, 'audit');
    const serverMailboxDir = path.join(mailboxDir, 'server');
    const serverRequestDir = path.join(serverMailboxDir, 'requests');
    const serverResponseDir = path.join(serverMailboxDir, 'responses');
    await rm(mailboxDir, { recursive: true, force: true });
    await mkdir(requestDir, { recursive: true });
    await mkdir(responseDir, { recursive: true });
    await mkdir(auditResponseDir, { recursive: true });
    await mkdir(serverRequestDir, { recursive: true });
    await mkdir(serverResponseDir, { recursive: true });

    const viteNodeScript = path.join(
        repoRoot,
        'tools',
        'scripts',
        'node_modules',
        'vite-node',
        'vite-node.mjs'
    );
    const bridgeScript = path.join(repoRoot, 'tools', 'migration', 'unity-rules-engine-bridge.ts');
    const packagedNodeScript = rulesRuntimeDir ? path.join(rulesRuntimeDir, 'node.exe') : null;
    const packagedBridgeScript = rulesRuntimeDir
        ? path.join(rulesRuntimeDir, 'unity-rules-engine-bridge.mjs')
        : null;
    const processed = new Set();
    const active = new Set();
    const events = [];
    const bridgeStdout = [];
    const bridgeStderr = [];
    let stopped = false;
    let bridgeExit = null;
    let bridgeError = null;

    const bridgeProcess = rulesRuntimeDir
        ? spawn(packagedNodeScript, [packagedBridgeScript, '--mailbox', serverMailboxDir], {
              cwd: rulesRuntimeDir,
              env: {
                  ...process.env,
                  GEMDUEL_RULES_RUNTIME_DIR: rulesRuntimeDir,
                  GEMDUEL_UNITY_CATALOG_DIR: path.join(rulesRuntimeDir, 'catalog'),
              },
              windowsHide: true,
          })
        : spawn(
              process.execPath,
              [viteNodeScript, '--script', bridgeScript, '--mailbox', serverMailboxDir],
              {
                  cwd: repoRoot,
                  env: {
                      ...process.env,
                      GEMDUEL_REPOSITORY_ROOT: repoRoot,
                  },
                  windowsHide: true,
              }
          );
    bridgeProcess.stdout?.on('data', (chunk) => bridgeStdout.push(Buffer.from(chunk)));
    bridgeProcess.stderr?.on('data', (chunk) => bridgeStderr.push(Buffer.from(chunk)));
    bridgeProcess.on('close', (code, signal) => {
        bridgeExit = { code, signal };
    });
    bridgeProcess.on('error', (error) => {
        bridgeError = error;
        bridgeExit = {
            code: null,
            signal: null,
        };
    });

    const bridgeStderrText = () => Buffer.concat(bridgeStderr).toString('utf8').slice(-4000);

    const waitForServerResponse = async (responsePath, timeoutMs = 30000) => {
        const deadline = Date.now() + timeoutMs;
        while (Date.now() < deadline) {
            if (existsSync(responsePath)) {
                return true;
            }

            if (bridgeExit) {
                return false;
            }

            await new Promise((resolve) => {
                setTimeout(resolve, 20);
            });
        }

        return false;
    };

    const handleRequest = async (fileName) => {
        if (!fileName.endsWith('.json') || processed.has(fileName)) {
            return;
        }

        processed.add(fileName);
        const requestPath = path.join(requestDir, fileName);
        const responsePath = path.join(responseDir, fileName);
        const auditResponsePath = path.join(auditResponseDir, fileName);
        const serverRequestPath = path.join(serverRequestDir, fileName);
        const serverResponsePath = path.join(serverResponseDir, fileName);
        const startedAt = new Date().toISOString();
        const run = (async () => {
            let response = null;
            let signal = null;
            let exitCode = 0;
            try {
                const rawRequest = await readFile(requestPath, 'utf8');
                if (bridgeError) {
                    throw bridgeError;
                }

                if (bridgeExit) {
                    throw new Error(
                        `Persistent bridge exited before handling ${fileName}, code=${bridgeExit.code}, signal=${bridgeExit.signal}. ${bridgeStderrText()}`
                    );
                }

                await writeTextAtomically(serverRequestPath, rawRequest);
                const responseReady = await waitForServerResponse(serverResponsePath);
                if (!responseReady) {
                    throw new Error(
                        `Persistent bridge did not produce a response for ${fileName}. ${
                            bridgeExit
                                ? `code=${bridgeExit.code}, signal=${bridgeExit.signal}.`
                                : 'timed out.'
                        } ${bridgeStderrText()}`
                    );
                }

                const rawResponse = await readFile(serverResponsePath, 'utf8');
                await writeTextAtomically(auditResponsePath, rawResponse);
                response = JSON.parse(rawResponse);
                await unlink(serverResponsePath).catch(() => {});
            } catch (error) {
                exitCode = bridgeExit?.code ?? null;
                signal = bridgeExit?.signal ?? null;
                response = createBridgeFailureResponse(
                    error instanceof Error ? error.message : String(error)
                );
                await writeJsonAtomically(auditResponsePath, response);
            }

            const auditResponseBuffer = await readFile(auditResponsePath);
            await writeJsonAtomically(responsePath, response);
            await unlink(requestPath).catch(() => {});
            await unlink(serverRequestPath).catch(() => {});
            events.push({
                request: fileName,
                auditResponse: path
                    .relative(mailboxDir, auditResponsePath)
                    .replaceAll(path.sep, '/'),
                auditResponseBytes: auditResponseBuffer.byteLength,
                auditResponseSha256: sha256(auditResponseBuffer),
                startedAt,
                completedAt: new Date().toISOString(),
                exitCode,
                signal,
                stderr: bridgeStderrText(),
                responseOk: response?.ok === true,
                responseActionType: response?.actionType ?? null,
                rejectionCode: response?.rejection?.code ?? null,
            });
        })();

        active.add(run);
        try {
            await run;
        } finally {
            active.delete(run);
        }
    };

    const poll = async () => {
        if (stopped) {
            return;
        }

        const files = await readdir(requestDir).catch(() => []);
        await Promise.all(files.map((fileName) => handleRequest(fileName)));
    };

    const timer = setInterval(() => {
        void poll();
    }, 25);

    return {
        mailboxDir,
        requestDir,
        responseDir,
        events,
        stop: async () => {
            clearInterval(timer);
            await poll();
            stopped = true;
            await Promise.all([...active]);
            if (!bridgeProcess.killed && bridgeExit == null) {
                bridgeProcess.kill();
            }
        },
    };
};

const resolvePnpmPath = () => {
    if (process.env.GEMDUEL_PNPM_PATH && existsSync(process.env.GEMDUEL_PNPM_PATH)) {
        return process.env.GEMDUEL_PNPM_PATH;
    }

    const pathParts = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean);
    const candidates =
        process.platform === 'win32' ? ['pnpm.CMD', 'pnpm.cmd', 'pnpm.exe', 'pnpm'] : ['pnpm'];

    for (const pathPart of pathParts) {
        for (const candidate of candidates) {
            const pnpmPath = path.join(pathPart, candidate);
            if (existsSync(pnpmPath)) {
                return pnpmPath;
            }
        }
    }

    return null;
};

const resolveDefaultRulesRuntimeDir = (exePath) => {
    const parsed = path.parse(exePath);
    return path.join(parsed.dir, `${parsed.name}_Data`, 'StreamingAssets', 'GemDuelRulesRuntime');
};

const readJsonIfExists = async (filePath) => {
    if (!filePath || !existsSync(filePath)) {
        return null;
    }

    try {
        return JSON.parse(await readFile(filePath, 'utf8'));
    } catch (error) {
        return {
            parseError: error instanceof Error ? error.message : String(error),
        };
    }
};

const run = async () => {
    const options = parseArgs();
    const usePackagedRulesRuntime = options.rulesRuntimeMode === 'packaged';
    if (!usePackagedRulesRuntime && options.rulesRuntimeMode !== 'localdev-mailbox') {
        throw new Error(
            `Unknown --rules-runtime-mode ${options.rulesRuntimeMode}. Expected packaged or localdev-mailbox.`
        );
    }

    const rulesRuntimeDir = path.resolve(
        options.rulesRuntimeDir ?? resolveDefaultRulesRuntimeDir(options.exe)
    );
    if (usePackagedRulesRuntime && !existsSync(path.join(rulesRuntimeDir, 'manifest.json'))) {
        throw new Error(
            `Packaged rules runtime is missing manifest.json at ${rulesRuntimeDir}. Run pnpm unity:rules-runtime:package after the Unity Windows build.`
        );
    }

    await mkdir(path.dirname(options.report), { recursive: true });
    await mkdir(path.dirname(options.launcherReport), { recursive: true });
    const pnpmPath = resolvePnpmPath();
    const mailbox = await startMailboxBridge(
        path.join(outputDir, `mailbox-${nowSlug}`),
        usePackagedRulesRuntime ? rulesRuntimeDir : null
    );

    const args = [
        '-batchmode',
        '-nographics',
        '-logFile',
        options.playerLog,
        '--gemduel-built-player-smoke',
        '--gemduel-smoke-report',
        options.report,
        '--gemduel-smoke-seed',
        options.seed,
        '--gemduel-smoke-max-steps',
        options.maxSteps,
        '--gemduel-smoke-start-mode',
        options.startMode,
        '--gemduel-smoke-idle-action-preference',
        options.idleActionPreference,
        '--gemduel-smoke-draft-action-preference',
        options.draftActionPreference,
    ];
    if (options.includeReplayReleasePath) {
        args.push(
            '--gemduel-smoke-include-replay-release-path',
            '--gemduel-smoke-replay-release-dir',
            options.replayReleasePathDir
        );
    }
    if (options.includeRecoveryReleasePath) {
        args.push('--gemduel-smoke-include-recovery-release-path');
    }
    if (options.includeSettingsReleasePath) {
        args.push(
            '--gemduel-smoke-include-settings-release-path',
            '--gemduel-smoke-settings-locale',
            options.settingsLocale,
            '--gemduel-smoke-settings-surface-theme',
            options.settingsSurfaceTheme,
            '--gemduel-smoke-settings-sound-enabled',
            options.settingsSoundEnabled,
            '--gemduel-smoke-settings-visibility',
            options.settingsVisibility,
            '--gemduel-smoke-settings-game-mode',
            options.settingsGameMode,
            '--gemduel-smoke-settings-replay',
            options.settingsReplay,
            '--gemduel-smoke-settings-recovery',
            options.settingsRecovery,
            '--gemduel-smoke-settings-fresh-launch',
            options.settingsFreshLaunch,
            '--gemduel-smoke-settings-input',
            options.settingsInput
        );
    }
    if (options.includeChromeReleasePath) {
        args.push('--gemduel-smoke-include-chrome-release-path');
    }
    if (options.includeReplayReviewReleasePath) {
        args.push(
            '--gemduel-smoke-include-replay-review-release-path',
            '--gemduel-smoke-replay-review-release-dir',
            options.replayReviewReleasePathDir
        );
    }
    if (options.includeInvalidActionReleasePath) {
        args.push('--gemduel-smoke-include-invalid-action-release-path');
    }
    if (options.includePeekModalReleasePath) {
        args.push('--gemduel-smoke-include-peek-modal-release-path');
    }
    if (options.includeRecoveryInvalidActionReleasePath) {
        args.push('--gemduel-smoke-include-recovery-invalid-action-release-path');
    }
    if (options.includePrivilegeCancelReleasePath) {
        args.push('--gemduel-smoke-include-privilege-cancel-release-path');
    }
    if (options.includeReservedDiscardReleasePath) {
        args.push('--gemduel-smoke-include-reserved-discard-release-path');
    }
    if (options.includeReservedBuyReleasePath) {
        args.push('--gemduel-smoke-include-reserved-buy-release-path');
    }
    if (options.includeReserveCancelReleasePath) {
        args.push('--gemduel-smoke-include-reserve-cancel-release-path');
    }
    if (options.includeReserveDeckReleasePath) {
        args.push('--gemduel-smoke-include-reserve-deck-release-path');
    }
    if (options.includeReserveDeckCancelReleasePath) {
        args.push('--gemduel-smoke-include-reserve-deck-cancel-release-path');
    }
    if (options.includeJokerReleasePath) {
        args.push('--gemduel-smoke-include-joker-release-path');
    }
    if (options.fullGamePlan) {
        args.push('--gemduel-smoke-full-game-plan', options.fullGamePlan);
    }
    if (options.fullGamePlanDir) {
        args.push('--gemduel-smoke-full-game-plan-dir', options.fullGamePlanDir);
        args.push('--gemduel-smoke-full-game-plan-limit', options.fullGamePlanLimit);
    }

    const stdoutChunks = [];
    const stderrChunks = [];
    const startedAt = new Date().toISOString();
    const childEnv = {
        ...process.env,
        ...(usePackagedRulesRuntime
            ? {
                  GEMDUEL_RULES_RUNTIME_DIR: rulesRuntimeDir,
                  GEMDUEL_UNITY_CATALOG_DIR: path.join(rulesRuntimeDir, 'catalog'),
                  GEMDUEL_RULES_BRIDGE_MAILBOX_DIR: mailbox.mailboxDir,
              }
            : {
                  GEMDUEL_REPOSITORY_ROOT: repoRoot,
                  GEMDUEL_RULES_BRIDGE_MAILBOX_DIR: mailbox.mailboxDir,
                  ...(pnpmPath ? { GEMDUEL_PNPM_PATH: pnpmPath } : {}),
              }),
    };
    if (usePackagedRulesRuntime) {
        delete childEnv.GEMDUEL_REPOSITORY_ROOT;
        delete childEnv.GEMDUEL_PNPM_PATH;
    }

    const child = spawn(options.exe, args, {
        cwd: repoRoot,
        env: childEnv,
        windowsHide: true,
    });

    child.stdout.on('data', (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    child.stderr.on('data', (chunk) => stderrChunks.push(Buffer.from(chunk)));

    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
    }, options.timeoutMs);

    const exit = await new Promise((resolve) => {
        child.on('close', (code, signal) => resolve({ code, signal }));
        child.on('error', (error) => resolve({ code: null, signal: null, error }));
    });
    clearTimeout(timer);
    if (mailbox) {
        await mailbox.stop();
    }

    const stdout = Buffer.concat(stdoutChunks).toString('utf8');
    const stderr = Buffer.concat(stderrChunks).toString('utf8');
    await writeFile(options.stdout, stdout);
    await writeFile(options.stderr, stderr);

    let smokeReport = null;
    const smokeReportText = await readTextIfExists(options.report);
    if (smokeReportText) {
        try {
            smokeReport = JSON.parse(smokeReportText);
        } catch (error) {
            smokeReport = {
                ok: false,
                parseError: error instanceof Error ? error.message : String(error),
            };
        }
    }

    const playerLog = await readTextIfExists(options.playerLog);
    const rulesRuntimeManifest = usePackagedRulesRuntime
        ? await readJsonIfExists(path.join(rulesRuntimeDir, 'manifest.json'))
        : null;
    const launcherReport = {
        schemaVersion: 1,
        kind: 'unity-built-player-smoke-launcher',
        startedAt,
        completedAt: new Date().toISOString(),
        ok: exit.code === 0 && smokeReport?.ok === true && !timedOut,
        exitCode: exit.code,
        signal: exit.signal,
        timedOut,
        exe: options.exe,
        cwd: repoRoot,
        environment: {
            repositoryRoot: usePackagedRulesRuntime ? null : repoRoot,
            pnpmPath: usePackagedRulesRuntime ? null : pnpmPath,
            mailboxDir: mailbox?.mailboxDir ?? null,
            rulesRuntimeMode: options.rulesRuntimeMode,
            rulesRuntimeDir: usePackagedRulesRuntime ? rulesRuntimeDir : null,
            unityCatalogDir: usePackagedRulesRuntime ? path.join(rulesRuntimeDir, 'catalog') : null,
        },
        args,
        paths: {
            stdout: options.stdout,
            stderr: options.stderr,
            playerLog: options.playerLog,
            smokeReport: options.report,
            launcherReport: options.launcherReport,
            bridgeMailbox: mailbox?.mailboxDir ?? null,
            replayReleasePathDir: options.includeReplayReleasePath
                ? options.replayReleasePathDir
                : null,
            replayReviewReleasePathDir: options.includeReplayReviewReleasePath
                ? options.replayReviewReleasePathDir
                : null,
        },
        rulesRuntimeManifest,
        bridgeMailboxEvents: mailbox?.events ?? [],
        stdoutBytes: Buffer.byteLength(stdout),
        stderrBytes: Buffer.byteLength(stderr),
        playerLogBytes: Buffer.byteLength(playerLog),
        smoke: smokeReport,
        failureReason: timedOut
            ? `Unity built-player smoke timed out after ${options.timeoutMs} ms.`
            : exit.error
              ? String(exit.error)
              : (smokeReport?.failureReason ??
                smokeReport?.smoke?.failureReason ??
                smokeReport?.replayReleasePath?.failureReason ??
                smokeReport?.recoveryReleasePath?.failureReason ??
                smokeReport?.settingsReleasePath?.failureReason ??
                smokeReport?.chromeReleasePath?.failureReason ??
                smokeReport?.replayReviewReleasePath?.failureReason ??
                smokeReport?.invalidActionReleasePath?.failureReason ??
                smokeReport?.peekModalReleasePath?.failureReason ??
                smokeReport?.recoveryInvalidActionReleasePath?.failureReason ??
                smokeReport?.privilegeCancelReleasePath?.failureReason ??
                smokeReport?.reservedDiscardReleasePath?.failureReason ??
                smokeReport?.reservedBuyReleasePath?.failureReason ??
                smokeReport?.reserveCancelReleasePath?.failureReason ??
                smokeReport?.reserveDeckReleasePath?.failureReason ??
                smokeReport?.reserveDeckCancelReleasePath?.failureReason ??
                smokeReport?.jokerReleasePath?.failureReason ??
                smokeReport?.fullGamePlanSuite?.failureReason ??
                null),
    };

    await writeFile(options.launcherReport, `${JSON.stringify(launcherReport, null, 4)}\n`);
    process.stdout.write(`${JSON.stringify(launcherReport, null, 4)}\n`);
    process.exit(launcherReport.ok ? 0 : 1);
};

run().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exit(1);
});
