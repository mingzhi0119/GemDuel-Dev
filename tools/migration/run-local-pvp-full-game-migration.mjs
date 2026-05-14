#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const artifactRoot = path.join(workspaceRoot, 'artifacts', 'electron-unity-parity', 'local-pvp-full-game');
const defaultPlanPath = path.join(artifactRoot, 'plan.json');

const parseArgs = (argv) => {
    const options = {
        url: 'http://127.0.0.1:5173/?parityHarness=1',
        plan: defaultPlanPath,
        outputRoot: artifactRoot,
        viewport: { width: 1920, height: 1080 },
        timeoutMs: 120000,
        startRenderer: true,
        maxSteps: null,
        chunkSize: 3,
        planProvided: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--url') {
            options.url = argv[++index];
        } else if (arg === '--plan') {
            options.plan = path.resolve(argv[++index]);
            options.planProvided = true;
        } else if (arg === '--output-root') {
            options.outputRoot = path.resolve(argv[++index]);
        } else if (arg === '--viewport') {
            options.viewport = parseViewport(argv[++index]);
        } else if (arg === '--timeout-ms') {
            options.timeoutMs = Number(argv[++index]);
        } else if (arg === '--max-steps') {
            options.maxSteps = Number(argv[++index]);
        } else if (arg === '--chunk-size') {
            options.chunkSize = Number(argv[++index]);
        } else if (arg === '--no-start-renderer') {
            options.startRenderer = false;
        } else if (arg === '--help' || arg === '-h') {
            printUsage();
            process.exit(0);
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
        throw new Error(`Invalid --timeout-ms: ${options.timeoutMs}`);
    }
    if (
        options.maxSteps !== null &&
        (!Number.isInteger(options.maxSteps) || options.maxSteps <= 0)
    ) {
        throw new Error(`Invalid --max-steps: ${options.maxSteps}`);
    }
    if (!Number.isInteger(options.chunkSize) || options.chunkSize <= 0) {
        throw new Error(`Invalid --chunk-size: ${options.chunkSize}`);
    }

    return options;
};

const printUsage = () => {
    console.log(
        [
            'Usage: node tools/migration/run-local-pvp-full-game-migration.mjs [options]',
            '',
            'Options:',
            '  --url <url>             Renderer URL. Default: http://127.0.0.1:5173/?parityHarness=1',
            '  --plan <path>           Local PVP full-game plan JSON path.',
            '  --output-root <path>    Artifact directory root.',
            '  --viewport <WxH>        Browser viewport. Default: 1920x1080',
            '  --timeout-ms <ms>       Browser eval timeout. Default: 120000',
            '  --max-steps <n>         Debug only: stop after n UI steps.',
            '  --chunk-size <n>        UI steps per browser eval chunk. Default: 3',
            '  --no-start-renderer     Require an already running renderer.',
            '',
        ].join('\n')
    );
};

const parseViewport = (value) => {
    const match = /^(\d+)x(\d+)$/.exec(value);
    if (!match) {
        throw new Error(`Invalid viewport "${value}". Expected WIDTHxHEIGHT.`);
    }

    return { width: Number(match[1]), height: Number(match[2]) };
};

const resolveCommand = (command) => {
    if (process.platform !== 'win32') {
        return command;
    }

    const lookup = spawnSync('where.exe', [command.endsWith('.cmd') ? command : `${command}.cmd`], {
        encoding: 'utf8',
        windowsHide: true,
    });
    const resolved = lookup.stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find(Boolean);
    return resolved ?? command;
};

const resolveAgentBrowserCommand = () => {
    if (process.env.AGENT_BROWSER_BIN) {
        return process.env.AGENT_BROWSER_BIN;
    }
    if (process.platform !== 'win32') {
        return 'agent-browser';
    }

    const commandShim = resolveCommand('agent-browser');
    const nativeCommand = path.join(
        path.dirname(commandShim),
        'node_modules',
        'agent-browser',
        'bin',
        'agent-browser-win32-x64.exe'
    );
    return existsSync(nativeCommand) ? nativeCommand : commandShim;
};

const useShell = (command) =>
    process.platform === 'win32' && path.extname(command).toLowerCase() !== '.exe';

const stopProcessTree = (pid) => {
    if (!pid) {
        return;
    }
    if (process.platform === 'win32') {
        spawnSync('taskkill.exe', ['/pid', String(pid), '/t', '/f'], {
            stdio: 'ignore',
            windowsHide: true,
        });
        return;
    }
    try {
        process.kill(pid, 'SIGTERM');
    } catch {
        // The process may already have exited.
    }
};

const execFileCapture = (
    command,
    args,
    { input, timeoutMs = 120000, allowFailure = false, stdioMode = 'pipe', env = {} } = {}
) =>
    new Promise((resolve, reject) => {
        const capturesOutput = stdioMode !== 'ignore';
        const child = spawn(command, args, {
            cwd: workspaceRoot,
            shell: useShell(command),
            windowsHide: true,
            stdio: capturesOutput ? ['pipe', 'pipe', 'pipe'] : 'ignore',
            env: { ...process.env, ...env },
        });
        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => {
            stopProcessTree(child.pid);
            reject(new Error(`${command} ${args.join(' ')} timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        if (capturesOutput) {
            child.stdout.on('data', (chunk) => {
                stdout += chunk.toString();
            });
            child.stderr.on('data', (chunk) => {
                stderr += chunk.toString();
            });
        }
        child.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
        child.on('close', (code) => {
            clearTimeout(timer);
            if (code !== 0 && !allowFailure) {
                reject(
                    new Error(
                        `${command} ${args.join(' ')} failed with ${code}\n${stdout}\n${stderr}`
                    )
                );
                return;
            }
            resolve({ code, stdout, stderr });
        });

        if (input && child.stdin) {
            child.stdin.write(input);
        }
        child.stdin?.end();
    });

const parseAgentJson = (stdout) => {
    const trimmed = stdout.trim();
    try {
        const value = JSON.parse(trimmed);
        return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
        const start = Math.min(
            ...['{', '['].map((char) => trimmed.indexOf(char)).filter((index) => index >= 0)
        );
        const end = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));
        if (!Number.isFinite(start) || end < start) {
            throw new Error(`Could not parse agent-browser JSON output:\n${stdout}`);
        }
        const value = JSON.parse(trimmed.slice(start, end + 1));
        return typeof value === 'string' ? JSON.parse(value) : value;
    }
};

const agent = async (agentBrowserCommand, session, args, options = {}) =>
    execFileCapture(agentBrowserCommand, ['--session', session, ...args], {
        ...options,
        env: { AGENT_BROWSER_HEADED: 'false', ...(options.env ?? {}) },
    });

const agentNoOutput = async (agentBrowserCommand, session, args, options = {}) =>
    execFileCapture(agentBrowserCommand, ['--session', session, ...args], {
        ...options,
        stdioMode: 'ignore',
        env: { AGENT_BROWSER_HEADED: 'false', ...(options.env ?? {}) },
    });

const agentEvalJson = async (agentBrowserCommand, session, script, timeoutMs) => {
    const result = await agent(agentBrowserCommand, session, ['eval', '--stdin'], {
        input: script,
        timeoutMs,
    });
    return parseAgentJson(result.stdout);
};

const buildToolingFailureReport = (plan, outputDir, error, lastProgress) => ({
    schemaVersion: 1,
    kind: 'local-pvp-full-game-electron-run-report',
    generatedAt: new Date().toISOString(),
    ok: false,
    verdict: 'Blocked',
    failureReason: `agent-browser chunk eval failed: ${error instanceof Error ? error.message : String(error)}`,
    plan: {
        id: plan.planId ?? null,
        seed: plan.oracle?.seed ?? null,
        gameVersion: plan.oracle?.gameVersion ?? null,
        logicalActions: plan.logicalActions?.length ?? null,
        uiSteps: plan.uiSteps?.length ?? null,
        executedUiSteps: lastProgress?.executedUiSteps ?? 0,
        lastCommitStepId: null,
    },
    scope: plan.scope,
    oracle: plan.oracle,
    finalChecks: {
        winner: { actual: null, expected: plan.oracle?.winner ?? null },
        replayRevision: { actual: null, expected: plan.oracle?.replayRevision ?? null },
        replayEventCount: { actual: null, expected: plan.oracle?.replayRevision ?? null },
    finalStateHash: { actual: null, expected: plan.oracle?.finalStateHash ?? null },
    },
    traceHashes: null,
    finalMismatches: [],
    failures: [
        {
            reason: 'agent-browser chunk eval failed',
            detail: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : null,
            lastProgress,
            outputDir,
        },
    ],
    finalState: null,
    coverage: {
        entrypoints: {
            declared: plan.coverageTargets?.entrypoints ?? [],
            covered: lastProgress?.executedUiSteps ? (plan.coverageTargets?.entrypoints ?? []) : [],
            exempt: plan.scope?.exempt ?? [],
        },
        actionFamilies: {
            declared: plan.coverageTargets?.actionFamilies ?? [],
            covered: [],
        },
        phaseEdges: {
            declared: plan.coverageTargets?.phaseEdges ?? [],
            covered: [],
        },
        semanticKeys: [],
        drivers: ['agent-browser'],
    },
    records: [],
});


const closeAgentBrowserSession = async (agentBrowserCommand, session) => {
    try {
        await agentNoOutput(agentBrowserCommand, session, ['close'], {
            timeoutMs: 30000,
            allowFailure: true,
        });
    } catch {
        // The browser may already be closed after a hard failure.
    }
};

const isRendererReachable = async (url) => {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        return response.status >= 200 && response.status < 500;
    } catch {
        return false;
    }
};

const waitForRenderer = async (url, timeoutMs) => {
    const started = Date.now();
    let lastError = '';
    while (Date.now() - started < timeoutMs) {
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (response.status >= 200 && response.status < 500) {
                return;
            }
            lastError = `HTTP ${response.status}`;
        } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(`Renderer did not become reachable at ${url}: ${lastError}`);
};

const startRendererIfNeeded = async (options) => {
    if (await isRendererReachable(options.url)) {
        return null;
    }
    if (!options.startRenderer) {
        throw new Error(`Renderer is not reachable at ${options.url}`);
    }

    const pnpm = resolveCommand('pnpm');
    const child = spawn(pnpm, ['--dir', 'apps/desktop', 'dev', '--', '--host', '127.0.0.1'], {
        cwd: workspaceRoot,
        shell: useShell(pnpm),
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, BROWSER: 'none' },
    });
    let outputTail = '';
    const appendOutput = (chunk) => {
        outputTail += chunk.toString();
        if (outputTail.length > 8192) {
            outputTail = outputTail.slice(-8192);
        }
    };
    child.stdout.on('data', appendOutput);
    child.stderr.on('data', appendOutput);

    try {
        await waitForRenderer(options.url, 45000);
    } catch (error) {
        stopProcessTree(child.pid);
        throw new Error(`${error instanceof Error ? error.message : String(error)}\n${outputTail}`);
    }
    return child;
};

const ensurePlan = async (planPath, { regenerate }) => {
    if (!regenerate && existsSync(planPath)) {
        return JSON.parse(await readFile(planPath, 'utf8'));
    }

    await mkdir(path.dirname(planPath), { recursive: true });
    const pnpm = resolveCommand('pnpm');
    const result = await execFileCapture(
        pnpm,
        [
            '--dir',
            'tools/scripts',
            'exec',
            'vite-node',
            '--script',
            '../../tools/migration/local-pvp-full-game-plan.ts',
        ],
        { timeoutMs: 120000 }
    );
    const plan = JSON.parse(result.stdout);
    await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
    return plan;
};

const buildBrowserScript = (plan, maxSteps) => {
    const planBase64 = Buffer.from(JSON.stringify(plan), 'utf8').toString('base64');
    const maxStepsLiteral = maxSteps === null ? 'null' : String(maxSteps);
    return `
(async () => {
  const plan = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(${JSON.stringify(
      planBase64
  )}), (char) => char.charCodeAt(0))));
  const maxSteps = ${maxStepsLiteral};
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const waitForParity = async () => {
    const started = performance.now();
    while (performance.now() - started < 30000) {
      const api = window.__GEMDUEL_PARITY__;
      if (api && typeof api.isReady === "function" && api.isReady()) {
        return api;
      }
      await sleep(100);
    }
    throw new Error("window.__GEMDUEL_PARITY__ was not ready within 30000ms");
  };
  const findBox = (state, semanticKey) => {
    if (!semanticKey) return null;
    return state?.visible?.boxes?.find((box) => box.semanticKey === semanticKey) ?? null;
  };
  const centerOf = (box) => {
    if (!box?.rect) return null;
    const x = box.rect.x + box.rect.width / 2;
    const y = box.rect.y + box.rect.height / 2;
    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      viewportX: Number((x / window.innerWidth).toFixed(6)),
      viewportY: Number((y / window.innerHeight).toFixed(6)),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  };
  const matchesExpected = (actual, expected) => expected == null || actual === expected;
  const api = await waitForParity();
  const targetSteps = maxSteps ? plan.uiSteps.slice(0, maxSteps) : plan.uiSteps;
  const records = [];
  const failures = [];
  const drivers = new Set();
  const coveredFamilies = new Set();
  const coveredEdges = new Set();
  const coveredSemanticKeys = new Set();
  let lastCommitStepId = null;

  for (const step of targetSteps) {
    const before = api.dumpState();
    const targetBox = findBox(before, step.semanticKey);
    const center = centerOf(targetBox);
    const phaseBefore = before?.game?.phase ?? null;
    const turnBefore = before?.game?.turn ?? null;
    const revisionBefore = before?.replay?.replayRevision ?? before?.history?.currentIndex ?? null;
    const hashBefore = before?.replay?.summaryFinalStateHash ?? before?.game?.stateHash ?? null;
    const targetRequired = Boolean(step.semanticKey) && step.action !== "start_local_game";
    if (targetRequired && !targetBox) {
      failures.push({
        stepId: step.id,
        reason: "target box missing before dispatch",
        action: step.action,
        semanticKey: step.semanticKey,
        phaseBefore,
        turnBefore,
      });
      break;
    }

    const result = await api.dispatch(step.action, step.payload ?? {});
    await sleep(650);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const after = api.dumpState();
    const phaseAfter = after?.game?.phase ?? null;
    const turnAfter = after?.game?.turn ?? null;
    const winnerAfter = after?.game?.winner ?? null;
    const revisionAfter = after?.replay?.replayRevision ?? after?.history?.currentIndex ?? null;
    const hashAfter = after?.replay?.summaryFinalStateHash ?? after?.game?.stateHash ?? null;
    const driver = result?.driver ?? "unknown";
    drivers.add(driver);
    if (step.actionType) coveredFamilies.add(step.actionType);
    if (step.expectedPhaseAfter) coveredEdges.add(phaseBefore + " -> " + step.expectedPhaseAfter);
    if (step.semanticKey) coveredSemanticKeys.add(step.semanticKey);
    if (step.commitsReplayEvent) lastCommitStepId = step.id;

    const record = {
      id: step.id,
      logicalActionIndex: step.logicalActionIndex,
      actionType: step.actionType,
      action: step.action,
      semanticKey: step.semanticKey,
      targetBox: targetBox
        ? {
            semanticKey: targetBox.semanticKey,
            x: Number(targetBox.rect.x.toFixed(2)),
            y: Number(targetBox.rect.y.toFixed(2)),
            width: Number(targetBox.rect.width.toFixed(2)),
            height: Number(targetBox.rect.height.toFixed(2)),
          }
        : null,
      clickCenter: center,
      before: {
        phase: phaseBefore,
        turn: turnBefore,
        replayRevision: revisionBefore,
        stateHash: hashBefore,
      },
      after: {
        phase: phaseAfter,
        turn: turnAfter,
        winner: winnerAfter,
        replayRevision: revisionAfter,
        stateHash: hashAfter,
      },
      result: {
        ok: Boolean(result?.ok),
        driver,
        detail: result?.detail ?? null,
      },
      expected: {
        phaseAfter: step.expectedPhaseAfter,
        turnAfter: step.expectedTurnAfter,
        winnerAfter: step.expectedWinnerAfter,
        replayRevisionAfter: step.expectedReplayRevisionAfter,
        stateHashAfter: step.expectedStateHashAfter,
      },
    };
    records.push(record);

    if (!result?.ok) {
      failures.push({
        stepId: step.id,
        reason: "dispatch failed",
        action: step.action,
        semanticKey: step.semanticKey,
        detail: result?.detail ?? null,
      });
      break;
    }
    if (driver === "replay-state-import") {
      failures.push({
        stepId: step.id,
        reason: "replay fixture driver used; full-game migration requires live UI/semantic actions",
        action: step.action,
        semanticKey: step.semanticKey,
      });
      break;
    }

    const assertState = step.commitsReplayEvent || step.action === "start_local_game";
    if (assertState) {
      const mismatches = [];
      if (!matchesExpected(phaseAfter, step.expectedPhaseAfter)) {
        mismatches.push({ field: "phaseAfter", actual: phaseAfter, expected: step.expectedPhaseAfter });
      }
      if (!matchesExpected(turnAfter, step.expectedTurnAfter)) {
        mismatches.push({ field: "turnAfter", actual: turnAfter, expected: step.expectedTurnAfter });
      }
      if (!matchesExpected(winnerAfter, step.expectedWinnerAfter)) {
        mismatches.push({ field: "winnerAfter", actual: winnerAfter, expected: step.expectedWinnerAfter });
      }
      if (!matchesExpected(revisionAfter, step.expectedReplayRevisionAfter)) {
        mismatches.push({ field: "replayRevisionAfter", actual: revisionAfter, expected: step.expectedReplayRevisionAfter });
      }
      if (!matchesExpected(hashAfter, step.expectedStateHashAfter)) {
        mismatches.push({ field: "stateHashAfter", actual: hashAfter, expected: step.expectedStateHashAfter });
      }
      if (mismatches.length > 0) {
        failures.push({
          stepId: step.id,
          reason: "post-step oracle mismatch",
          action: step.action,
          semanticKey: step.semanticKey,
          mismatches,
        });
        break;
      }
    }
  }

  const finalState = api.dumpState();
  const completedAllSteps = records.length === targetSteps.length && failures.length === 0;
  const finalChecks = {
    winner: { actual: finalState?.game?.winner ?? null, expected: plan.oracle?.winner ?? null },
    replayRevision: {
      actual: finalState?.replay?.replayRevision ?? finalState?.history?.currentIndex ?? null,
      expected: plan.oracle?.replayRevision ?? null,
    },
    replayEventCount: {
      actual: finalState?.replay?.eventCount ?? null,
      expected: plan.oracle?.replayRevision ?? null,
    },
    finalStateHash: {
      actual: finalState?.replay?.summaryFinalStateHash ?? finalState?.game?.stateHash ?? null,
      expected: plan.oracle?.finalStateHash ?? null,
    },
  };
  const finalMismatches = [];
  if (completedAllSteps && !maxSteps) {
    for (const [field, check] of Object.entries(finalChecks)) {
      if (check.expected != null && check.actual !== check.expected) {
        finalMismatches.push({ field, actual: check.actual, expected: check.expected });
      }
    }
  }
  const ok = completedAllSteps && finalMismatches.length === 0;
  const failureReason = ok
    ? null
    : failures[0]?.reason ?? (finalMismatches.length ? "final oracle mismatch" : "not all steps completed");

  return JSON.stringify({
    schemaVersion: 1,
    kind: "local-pvp-full-game-electron-run-report",
    generatedAt: new Date().toISOString(),
    ok,
    verdict: ok ? "Complete" : "Blocked",
    failureReason,
    plan: {
      id: plan.planId ?? null,
      seed: plan.oracle?.seed ?? null,
      gameVersion: plan.oracle?.gameVersion ?? null,
      logicalActions: plan.logicalActions?.length ?? null,
      uiSteps: plan.uiSteps?.length ?? null,
      executedUiSteps: records.length,
      lastCommitStepId,
    },
    scope: plan.scope,
    oracle: plan.oracle,
    finalChecks,
    finalMismatches,
    failures,
    finalState: {
      game: finalState?.game ?? null,
      replay: finalState?.replay ?? null,
      history: finalState?.history ?? null,
    },
    coverage: {
      entrypoints: {
        declared: plan.coverageTargets?.entrypoints ?? [],
        covered: records.length > 0 ? (plan.coverageTargets?.entrypoints ?? []) : [],
        exempt: plan.scope?.exempt ?? [],
      },
      actionFamilies: {
        declared: plan.coverageTargets?.actionFamilies ?? [],
        covered: Array.from(coveredFamilies).sort(),
      },
      phaseEdges: {
        declared: plan.coverageTargets?.phaseEdges ?? [],
        covered: Array.from(coveredEdges).sort(),
      },
      semanticKeys: Array.from(coveredSemanticKeys).sort(),
      drivers: Array.from(drivers).sort(),
    },
    records,
  });
})().catch((error) => {
  console.log(JSON.stringify({
    schemaVersion: 1,
    kind: "local-pvp-full-game-electron-run-report",
    generatedAt: new Date().toISOString(),
    ok: false,
    verdict: "Blocked",
    failureReason: error?.message ?? String(error),
    failures: [{ reason: error?.message ?? String(error), stack: error?.stack ?? null }],
  }));
});
`;
};

const buildBrowserInitScript = (plan, maxSteps) => {
    const planBase64 = Buffer.from(JSON.stringify(plan), 'utf8').toString('base64');
    const maxStepsLiteral = maxSteps === null ? 'null' : String(maxSteps);
    return `
(() => {
  const plan = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(${JSON.stringify(
      planBase64
  )}), (char) => char.charCodeAt(0))));
  window.__GEMDUEL_LOCAL_PVP_FULL_GAME__ = {
    plan,
    maxSteps: ${maxStepsLiteral},
    cursor: 0,
    records: [],
    failures: [],
    coveredFamilies: [],
    coveredEdges: [],
    coveredSemanticKeys: [],
    drivers: [],
    lastCommitStepId: null,
    settleDelayMs: 50,
    commitSettleDelayMs: 300,
    turnHandoffDelayMs: 650,
    targetWaitMs: 1200,
  };
  return JSON.stringify({ ok: true, total: (${maxStepsLiteral} ? plan.uiSteps.slice(0, ${maxStepsLiteral}).length : plan.uiSteps.length) });
})()
`;
};

const buildBrowserChunkScript = (chunkSize) => `
(async () => {
  const state = window.__GEMDUEL_LOCAL_PVP_FULL_GAME__;
  if (!state) {
    throw new Error("Local PVP full-game runner was not initialized.");
  }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const waitForParity = async () => {
    const started = performance.now();
    while (performance.now() - started < 30000) {
      const api = window.__GEMDUEL_PARITY__;
      if (api && typeof api.isReady === "function" && api.isReady()) {
        return api;
      }
      await sleep(100);
    }
    throw new Error("window.__GEMDUEL_PARITY__ was not ready within 30000ms");
  };
  const addUnique = (array, value) => {
    if (value != null && !array.includes(value)) array.push(value);
  };
  const findBox = (dump, semanticKey) => {
    if (!semanticKey) return null;
    return dump?.visible?.boxes?.find((box) => box.semanticKey === semanticKey) ?? null;
  };
  const waitFrames = () =>
    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const summarizeVisible = (dump) => ({
    selectedGems: dump?.game?.selectedGems ?? [],
    phase: dump?.game?.phase ?? null,
    turn: dump?.game?.turn ?? null,
    semanticKeys: [
      ...new Set(
        (dump?.visible?.boxes ?? [])
          .map((box) => box.semanticKey)
          .filter((key) => typeof key === "string" && key.length > 0)
      ),
    ].sort(),
    actionBoxes: (dump?.visible?.boxes ?? [])
      .filter((box) => box.selector === "[data-game-action]" || box.semanticKey === "board.selection.confirm" || box.semanticKey === "turn.end")
      .map((box) => ({
        semanticKey: box.semanticKey ?? null,
        text: box.text ?? "",
        dataset: box.dataset ?? {},
        rect: box.rect ?? null,
      })),
    textDigest: dump?.visible?.textDigest ?? null,
  });
  const waitForTargetBox = async (api, semanticKey, targetRequired) => {
    let dump = api.dumpState();
    let box = findBox(dump, semanticKey);
    if (!targetRequired || box) {
      return { dump, box, waitedMs: 0 };
    }

    const started = performance.now();
    let waitedMs = 0;
    while (performance.now() - started < state.targetWaitMs) {
      await sleep(50);
      await waitFrames();
      dump = api.dumpState();
      box = findBox(dump, semanticKey);
      waitedMs = Math.round(performance.now() - started);
      if (box) {
        return { dump, box, waitedMs };
      }
    }

    return { dump, box: null, waitedMs };
  };
  const centerOf = (box) => {
    if (!box?.rect) return null;
    const x = box.rect.x + box.rect.width / 2;
    const y = box.rect.y + box.rect.height / 2;
    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      viewportX: Number((x / window.innerWidth).toFixed(6)),
      viewportY: Number((y / window.innerHeight).toFixed(6)),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  };
  const matchesExpected = (actual, expected) => expected == null || actual === expected;
  const hashText = (text) => {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  };
  const targetSteps = state.maxSteps ? state.plan.uiSteps.slice(0, state.maxSteps) : state.plan.uiSteps;
  const buildReport = () => {
    const finalState = window.__GEMDUEL_PARITY__?.dumpState?.() ?? null;
    const completedAllSteps = state.records.length === targetSteps.length && state.failures.length === 0;
    const finalChecks = {
      winner: { actual: finalState?.game?.winner ?? null, expected: state.plan.oracle?.winner ?? null },
      replayRevision: {
        actual: finalState?.replay?.replayRevision ?? finalState?.history?.currentIndex ?? null,
        expected: state.plan.oracle?.replayRevision ?? null,
      },
      replayEventCount: {
        actual: finalState?.replay?.eventCount ?? null,
        expected: state.plan.oracle?.replayRevision ?? null,
      },
      finalStateHash: {
        actual: finalState?.replay?.summaryFinalStateHash ?? finalState?.game?.stateHash ?? null,
        expected: state.plan.oracle?.finalStateHash ?? null,
      },
    };
    const finalMismatches = [];
    if (completedAllSteps && !state.maxSteps) {
      for (const [field, check] of Object.entries(finalChecks)) {
        if (check.expected != null && check.actual !== check.expected) {
          finalMismatches.push({ field, actual: check.actual, expected: check.expected });
        }
      }
    }
    const traceHashes = {
      clickPathHash: hashText(JSON.stringify(state.records.map((record) => ({
        id: record.id,
        action: record.action,
        semanticKey: record.semanticKey,
        clickCenter: record.clickCenter,
      })))),
      stateTraceHash: hashText(JSON.stringify(state.records.map((record) => ({
        id: record.id,
        phase: record.after?.phase ?? null,
        turn: record.after?.turn ?? null,
        replayRevision: record.after?.replayRevision ?? null,
        stateHash: record.after?.stateHash ?? null,
      })))),
      finalVisibleHash: hashText(JSON.stringify((finalState?.visible?.boxes ?? [])
        .filter((box) => box.semanticKey)
        .map((box) => ({
          semanticKey: box.semanticKey,
          rect: box.rect,
          text: box.text,
        })))),
    };
    const ok = completedAllSteps && finalMismatches.length === 0;
    return {
      schemaVersion: 1,
      kind: "local-pvp-full-game-electron-run-report",
      generatedAt: new Date().toISOString(),
      ok,
      verdict: ok ? "Complete" : "Blocked",
      failureReason: ok
        ? null
        : state.failures[0]?.reason ?? (finalMismatches.length ? "final oracle mismatch" : "not all steps completed"),
      plan: {
        id: state.plan.planId ?? null,
        seed: state.plan.oracle?.seed ?? null,
        gameVersion: state.plan.oracle?.gameVersion ?? null,
        logicalActions: state.plan.logicalActions?.length ?? null,
        uiSteps: state.plan.uiSteps?.length ?? null,
        executedUiSteps: state.records.length,
        lastCommitStepId: state.lastCommitStepId,
      },
      scope: state.plan.scope,
      oracle: state.plan.oracle,
      finalChecks,
      traceHashes,
      finalMismatches,
      failures: state.failures,
      finalState: {
        game: finalState?.game ?? null,
        replay: finalState?.replay ?? null,
        history: finalState?.history ?? null,
        visible: finalState?.visible
          ? {
              textDigest: finalState.visible.textDigest ?? null,
              boxes: (finalState.visible.boxes ?? [])
                .filter((box) => box.semanticKey)
                .map((box) => ({
                  semanticKey: box.semanticKey,
                  selector: box.selector,
                  text: box.text,
                  dataset: box.dataset,
                  rect: box.rect,
                })),
            }
          : null,
      },
      coverage: {
        entrypoints: {
          declared: state.plan.coverageTargets?.entrypoints ?? [],
          covered: state.records.length > 0 ? (state.plan.coverageTargets?.entrypoints ?? []) : [],
          exempt: state.plan.scope?.exempt ?? [],
        },
        actionFamilies: {
          declared: state.plan.coverageTargets?.actionFamilies ?? [],
          covered: [...state.coveredFamilies].sort(),
        },
        phaseEdges: {
          declared: state.plan.coverageTargets?.phaseEdges ?? [],
          covered: [...state.coveredEdges].sort(),
        },
        semanticKeys: [...state.coveredSemanticKeys].sort(),
        drivers: [...state.drivers].sort(),
      },
      records: state.records,
    };
  };

  const api = await waitForParity();
  const end = Math.min(state.cursor + ${Number(chunkSize)}, targetSteps.length);
  for (; state.cursor < end; state.cursor += 1) {
    const step = targetSteps[state.cursor];
    const targetRequired = Boolean(step.semanticKey) && step.action !== "start_local_game";
    const targetLookup = await waitForTargetBox(api, step.semanticKey, targetRequired);
    const before = targetLookup.dump;
    const targetBox = targetLookup.box;
    const center = centerOf(targetBox);
    const phaseBefore = before?.game?.phase ?? null;
    const turnBefore = before?.game?.turn ?? null;
    const revisionBefore = before?.replay?.replayRevision ?? before?.history?.currentIndex ?? null;
    const hashBefore = before?.replay?.summaryFinalStateHash ?? before?.game?.stateHash ?? null;
    if (targetRequired && !targetBox) {
      state.failures.push({
        stepId: step.id,
        reason: "target box missing before dispatch",
        action: step.action,
        semanticKey: step.semanticKey,
        phaseBefore,
        turnBefore,
        waitedMs: targetLookup.waitedMs,
        visible: summarizeVisible(before),
      });
      break;
    }

    const result = await api.dispatch(step.action, step.payload ?? {});
    await sleep(state.settleDelayMs);
    await waitFrames();
    let after = api.dumpState();
    const needsTurnHandoffSettle =
      (step.commitsReplayEvent || step.action === "start_local_game") &&
      before?.game?.turn !== after?.game?.turn;
    if (needsTurnHandoffSettle) {
      await sleep(state.turnHandoffDelayMs);
      await waitFrames();
      after = api.dumpState();
    } else if (step.commitsReplayEvent || step.action === "start_local_game") {
      await sleep(state.commitSettleDelayMs);
      await waitFrames();
      after = api.dumpState();
    }
    const phaseAfter = after?.game?.phase ?? null;
    const turnAfter = after?.game?.turn ?? null;
    const winnerAfter = after?.game?.winner ?? null;
    const revisionAfter = after?.replay?.replayRevision ?? after?.history?.currentIndex ?? null;
    const hashAfter = after?.replay?.summaryFinalStateHash ?? after?.game?.stateHash ?? null;
    const driver = result?.driver ?? "unknown";
    addUnique(state.drivers, driver);
    if (result?.ok) {
      addUnique(state.coveredSemanticKeys, step.semanticKey);
    }

    const record = {
      id: step.id,
      logicalActionIndex: step.logicalActionIndex,
      actionType: step.actionType,
      action: step.action,
      semanticKey: step.semanticKey,
      targetBox: targetBox
        ? {
            semanticKey: targetBox.semanticKey,
            x: Number(targetBox.rect.x.toFixed(2)),
            y: Number(targetBox.rect.y.toFixed(2)),
            width: Number(targetBox.rect.width.toFixed(2)),
            height: Number(targetBox.rect.height.toFixed(2)),
          }
        : null,
      clickCenter: center,
      targetWaitMs: targetLookup.waitedMs,
      before: {
        phase: phaseBefore,
        turn: turnBefore,
        replayRevision: revisionBefore,
        stateHash: hashBefore,
        selectedGems: before?.game?.selectedGems ?? [],
      },
      after: {
        phase: phaseAfter,
        turn: turnAfter,
        winner: winnerAfter,
        replayRevision: revisionAfter,
        stateHash: hashAfter,
        selectedGems: after?.game?.selectedGems ?? [],
      },
      result: { ok: Boolean(result?.ok), driver, detail: result?.detail ?? null },
      expected: {
        phaseAfter: step.expectedPhaseAfter,
        turnAfter: step.expectedTurnAfter,
        winnerAfter: step.expectedWinnerAfter,
        replayRevisionAfter: step.expectedReplayRevisionAfter,
        stateHashAfter: step.expectedStateHashAfter,
      },
    };
    state.records.push(record);

    if (!result?.ok) {
      state.failures.push({
        stepId: step.id,
        reason: "dispatch failed",
        action: step.action,
        semanticKey: step.semanticKey,
        detail: result?.detail ?? null,
      });
      state.cursor += 1;
      break;
    }
    if (driver === "replay-state-import") {
      state.failures.push({
        stepId: step.id,
        reason: "replay fixture driver used; full-game migration requires live UI/semantic actions",
        action: step.action,
        semanticKey: step.semanticKey,
      });
      state.cursor += 1;
      break;
    }

    const assertState = step.commitsReplayEvent || step.action === "start_local_game";
    let stateMatchedOracle = true;
    if (assertState) {
      const mismatches = [];
      if (!matchesExpected(phaseAfter, step.expectedPhaseAfter)) {
        mismatches.push({ field: "phaseAfter", actual: phaseAfter, expected: step.expectedPhaseAfter });
      }
      if (!matchesExpected(turnAfter, step.expectedTurnAfter)) {
        mismatches.push({ field: "turnAfter", actual: turnAfter, expected: step.expectedTurnAfter });
      }
      if (!matchesExpected(winnerAfter, step.expectedWinnerAfter)) {
        mismatches.push({ field: "winnerAfter", actual: winnerAfter, expected: step.expectedWinnerAfter });
      }
      if (!matchesExpected(revisionAfter, step.expectedReplayRevisionAfter)) {
        mismatches.push({ field: "replayRevisionAfter", actual: revisionAfter, expected: step.expectedReplayRevisionAfter });
      }
      if (!matchesExpected(hashAfter, step.expectedStateHashAfter)) {
        mismatches.push({ field: "stateHashAfter", actual: hashAfter, expected: step.expectedStateHashAfter });
      }
      if (mismatches.length > 0) {
        stateMatchedOracle = false;
        state.failures.push({
          stepId: step.id,
          reason: "post-step oracle mismatch",
          action: step.action,
          semanticKey: step.semanticKey,
          mismatches,
        });
        state.cursor += 1;
        break;
      }
    }
    if (assertState && stateMatchedOracle) {
      addUnique(state.coveredFamilies, step.actionType);
      if (step.expectedPhaseAfter) {
        addUnique(state.coveredEdges, phaseBefore + " -> " + step.expectedPhaseAfter);
      }
      if (step.commitsReplayEvent) state.lastCommitStepId = step.id;
    }
  }

  const done = state.cursor >= targetSteps.length || state.failures.length > 0;
  return JSON.stringify(done
    ? { done: true, report: buildReport() }
    : { done: false, cursor: state.cursor, total: targetSteps.length, executedUiSteps: state.records.length });
})().catch((error) => {
  console.log(JSON.stringify({
    done: true,
    report: {
      schemaVersion: 1,
      kind: "local-pvp-full-game-electron-run-report",
      generatedAt: new Date().toISOString(),
      ok: false,
      verdict: "Blocked",
      failureReason: error?.message ?? String(error),
      failures: [{ reason: error?.message ?? String(error), stack: error?.stack ?? null }],
    },
  }));
});
`;

const escapeHtml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

const buildHtmlReport = (report, jsonFileName) => {
    const failures = report.failures ?? [];
    const finalMismatches = report.finalMismatches ?? [];
    const families = report.coverage?.actionFamilies?.covered ?? [];
    const edges = report.coverage?.phaseEdges?.covered ?? [];
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Local PVP Full Game Migration Report</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; margin: 32px; color: #172033; background: #f7f9fc; }
    main { max-width: 1120px; margin: 0 auto; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    h2 { margin-top: 28px; font-size: 18px; }
    .verdict { display: inline-block; padding: 6px 12px; border-radius: 6px; background: ${
        report.ok ? '#d8f7df' : '#ffe0df'
    }; color: ${report.ok ? '#0a6b22' : '#9b1711'}; font-weight: 700; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 16px; }
    .box { background: white; border: 1px solid #d9e2ef; border-radius: 8px; padding: 14px 16px; }
    code { background: #edf2fa; padding: 2px 5px; border-radius: 4px; }
    table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #d9e2ef; }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e7edf6; vertical-align: top; font-size: 13px; }
    th { background: #edf2fa; }
    ul { margin: 8px 0 0; padding-left: 20px; }
    pre { overflow: auto; background: #172033; color: #f7f9fc; padding: 14px; border-radius: 8px; }
  </style>
</head>
<body>
  <main>
    <h1>Local PVP Full Game Migration Report</h1>
    <div class="verdict">${escapeHtml(report.verdict ?? (report.ok ? 'Complete' : 'Blocked'))}</div>
    <p>JSON: <code>${escapeHtml(jsonFileName)}</code></p>
    <div class="grid">
      <div class="box"><strong>Seed</strong><br />${escapeHtml(report.plan?.seed ?? '')}</div>
      <div class="box"><strong>UI steps</strong><br />${escapeHtml(report.plan?.uiSteps ?? '')}</div>
      <div class="box"><strong>Executed steps</strong><br />${escapeHtml(
          report.plan?.executedUiSteps ?? ''
      )}</div>
      <div class="box"><strong>Final hash</strong><br />${escapeHtml(
          report.finalChecks?.finalStateHash?.actual ?? ''
      )}</div>
      <div class="box"><strong>Click path hash</strong><br />${escapeHtml(
          report.traceHashes?.clickPathHash ?? ''
      )}</div>
    </div>
    <h2>Final Checks</h2>
    <table>
      <thead><tr><th>Field</th><th>Actual</th><th>Expected</th></tr></thead>
      <tbody>
        ${Object.entries(report.finalChecks ?? {})
            .map(
                ([field, check]) =>
                    `<tr><td>${escapeHtml(field)}</td><td>${escapeHtml(
                        check.actual
                    )}</td><td>${escapeHtml(check.expected)}</td></tr>`
            )
            .join('\n')}
      </tbody>
    </table>
    <h2>Coverage</h2>
    <div class="grid">
      <div class="box"><strong>Action families</strong><ul>${families
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join('')}</ul></div>
      <div class="box"><strong>Phase edges</strong><ul>${edges
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join('')}</ul></div>
    </div>
    <h2>Failures</h2>
    ${
        failures.length || finalMismatches.length
            ? `<pre>${escapeHtml(JSON.stringify({ failures, finalMismatches }, null, 2))}</pre>`
            : '<p>No failures recorded.</p>'
    }
  </main>
</body>
</html>
`;
};

const main = async () => {
    const options = parseArgs(process.argv.slice(2));
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(options.outputRoot, timestamp);
    await mkdir(outputDir, { recursive: true });

    const plan = await ensurePlan(options.plan, { regenerate: !options.planProvided });
    await writeFile(path.join(outputDir, 'plan.json'), `${JSON.stringify(plan, null, 2)}\n`, 'utf8');

    const rendererProcess = await startRendererIfNeeded(options);
    const agentBrowserCommand = resolveAgentBrowserCommand();
    const session = `gemduel-local-pvp-full-game-${Date.now()}`;
    let lastProgress = null;

    try {
        await agentNoOutput(
            agentBrowserCommand,
            session,
            ['set', 'viewport', String(options.viewport.width), String(options.viewport.height)],
            { timeoutMs: 30000 }
        );
        await agentNoOutput(agentBrowserCommand, session, ['open', options.url], {
            timeoutMs: 60000,
        });
        await agentEvalJson(
            agentBrowserCommand,
            session,
            buildBrowserInitScript(plan, options.maxSteps),
            30000
        );
        let report = null;
        for (let chunkIndex = 0; chunkIndex < 1000; chunkIndex += 1) {
            const chunkResult = await agentEvalJson(
                agentBrowserCommand,
                session,
                buildBrowserChunkScript(options.chunkSize),
                options.timeoutMs
            );
            if (chunkResult.done) {
                report = chunkResult.report;
                break;
            }
            lastProgress = chunkResult;
            console.error(
                `Local PVP full-game progress: ${chunkResult.executedUiSteps}/${chunkResult.total}`
            );
        }
        if (!report) {
            throw new Error('Local PVP full-game runner did not finish within chunk limit.');
        }
        const reportJsonPath = path.join(outputDir, 'local-pvp-full-game-electron-report.json');
        const reportHtmlPath = path.join(outputDir, 'local-pvp-full-game-electron-report.html');
        const screenshotPath = path.join(outputDir, 'final.png');
        await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
        await writeFile(reportHtmlPath, buildHtmlReport(report, path.basename(reportJsonPath)), 'utf8');
        await agentNoOutput(agentBrowserCommand, session, ['screenshot', screenshotPath], {
            timeoutMs: 60000,
            allowFailure: true,
        });

        console.log(
            JSON.stringify(
                {
                    ok: Boolean(report.ok),
                    verdict: report.verdict,
                    failureReason: report.failureReason,
                    outputDir,
                    reportJsonPath,
                    reportHtmlPath,
                    screenshotPath,
                    uiSteps: report.plan?.uiSteps,
                    executedUiSteps: report.plan?.executedUiSteps,
                    logicalActions: report.plan?.logicalActions,
                    finalChecks: report.finalChecks,
                },
                null,
                2
            )
        );
        if (!report.ok) {
            process.exitCode = 1;
        }
    } catch (error) {
        const report = buildToolingFailureReport(plan, outputDir, error, lastProgress);
        const reportJsonPath = path.join(outputDir, 'local-pvp-full-game-electron-report.json');
        const reportHtmlPath = path.join(outputDir, 'local-pvp-full-game-electron-report.html');
        await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
        await writeFile(reportHtmlPath, buildHtmlReport(report, path.basename(reportJsonPath)), 'utf8');
        console.log(
            JSON.stringify(
                {
                    ok: false,
                    verdict: report.verdict,
                    failureReason: report.failureReason,
                    outputDir,
                    reportJsonPath,
                    reportHtmlPath,
                    uiSteps: report.plan?.uiSteps,
                    executedUiSteps: report.plan?.executedUiSteps,
                    logicalActions: report.plan?.logicalActions,
                    finalChecks: report.finalChecks,
                },
                null,
                2
            )
        );
        process.exitCode = 1;
    } finally {
        await closeAgentBrowserSession(agentBrowserCommand, session);
        stopProcessTree(rendererProcess?.pid);
    }
};

main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
});
