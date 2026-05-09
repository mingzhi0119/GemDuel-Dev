import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');
const defaultUnityExe = 'C:\\Program Files\\Unity\\Hub\\Editor\\6000.4.6f1\\Editor\\Unity.exe';
const resolveAgentBrowserCommand = () => {
    if (process.platform !== 'win32') {
        return 'agent-browser';
    }

    const lookup = spawnSync('where.exe', ['agent-browser.cmd'], {
        encoding: 'utf8',
        windowsHide: true,
    });
    const commandShim = lookup.stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find(Boolean);
    if (!commandShim) {
        return 'agent-browser';
    }

    const nativeCommand = path.join(
        path.dirname(commandShim),
        'node_modules',
        'agent-browser',
        'bin',
        'agent-browser-win32-x64.exe'
    );
    return existsSync(nativeCommand) ? nativeCommand : commandShim;
};
const agentBrowserCommand = resolveAgentBrowserCommand();
const fixturePath = path.join(
    workspaceRoot,
    'fixtures',
    'replay-golden',
    'local-pvp-royal-extra-turn-game-over.replay.json'
);

const scenarioDefinitions = [
    {
        id: 'app-launch-main-menu',
        name: 'App launch / main menu parity',
        revision: null,
        expectedSharedState: 'No active game; mode selection shell visible.',
        electronEntry: 'http://127.0.0.1:5173/?parityHarness=1',
        unityEntry: 'GemDuel.Editor.CaptureUnityParityScenarios',
        actions: [{ action: 'reset' }],
    },
    {
        id: 'local-game-start',
        name: 'Local game start parity',
        revision: null,
        expectedSharedState: 'Replay bootstrap at revision 0 with LOCAL_PVP, p1 turn, IDLE phase.',
        actions: [
            { action: 'reset' },
            {
                action: 'start_local_game',
                payload: { rawText: { __replayText: true }, revision: 0 },
            },
        ],
    },
    {
        id: 'initial-board-render',
        name: 'Initial board render parity',
        revision: 2,
        expectedSharedState:
            'Board, market, royals, inventories, and player zones match post-draft replay revision 2.',
    },
    {
        id: 'market-card-preview',
        name: 'Market card preview parity',
        revision: 2,
        expectedSharedState: 'Preview opens without mutating shared state.',
        actionsAfterLoad: [{ action: 'click_market_card', payload: { level: 1, index: 0 } }],
    },
    {
        id: 'buy-card',
        name: 'Buy card parity',
        revision: 7,
        expectedSharedState:
            'First committed buy_card event applied through the semantic preview action.',
        actionsAfterLoad: [{ action: 'buy_card', payload: { level: 1, index: 0 } }],
    },
    {
        id: 'reserve-card',
        name: 'Reserve card parity',
        revision: 43,
        expectedSharedState:
            'First committed reserve_card event applied through the semantic preview action.',
        actionsAfterLoad: [{ action: 'reserve_card', payload: { level: 3, index: 0 } }],
    },
    {
        id: 'end-turn',
        name: 'End turn parity',
        revision: 10,
        expectedSharedState:
            'First replenish end-turn boundary applied through the semantic action.',
        actionsAfterLoad: [{ action: 'end_turn' }],
    },
    {
        id: 'royal-featured-card-display',
        name: 'Royal / featured card display parity',
        revision: 13,
        expectedSharedState:
            'First committed select_royal event applied through the semantic action.',
        actionsAfterLoad: [{ action: 'choose_royal', payload: { index: 0 } }],
    },
    {
        id: 'player-zone-resource-score',
        name: 'Player zone resource and score parity',
        revision: 14,
        expectedSharedState:
            'Player inventories, tableau, royal, score, and resource zones match revision 14.',
    },
    {
        id: 'settings-theme-equivalent',
        name: 'Settings or theme-equivalent parity',
        revision: 2,
        expectedSharedState: 'Settings menu can open and locale/theme/sound state can be dumped.',
        actionsAfterLoad: [{ action: 'open_settings' }],
    },
    {
        id: 'invalid-action-state',
        name: 'Error/invalid-action state parity',
        revision: 2,
        expectedSharedState: 'Invalid action is rejected and recorded without state mutation.',
        actionsAfterLoad: [{ action: 'invalid_action' }],
    },
];

const parseArgs = () => {
    const options = {
        outputRoot: null,
        viewports: [
            { width: 1920, height: 1080 },
            { width: 1366, height: 768 },
        ],
        startRenderer: true,
        skipUnity: false,
        unityExe: process.env.UNITY_EXE || defaultUnityExe,
        url: 'http://127.0.0.1:5173/?parityHarness=1',
    };

    for (let index = 2; index < process.argv.length; index += 1) {
        const arg = process.argv[index];
        if (arg === '--out') {
            options.outputRoot = path.resolve(workspaceRoot, process.argv[index + 1]);
            index += 1;
        } else if (arg === '--viewports') {
            options.viewports = parseViewports(process.argv[index + 1]);
            index += 1;
        } else if (arg === '--no-start-electron' || arg === '--no-start-renderer') {
            options.startRenderer = false;
        } else if (arg === '--skip-unity') {
            options.skipUnity = true;
        } else if (arg === '--unity-exe') {
            options.unityExe = process.argv[index + 1];
            index += 1;
        } else if (arg === '--url') {
            options.url = process.argv[index + 1];
            index += 1;
        } else if (arg === '--help') {
            printHelp();
            process.exit(0);
        }
    }

    if (!options.outputRoot) {
        const runId = new Date().toISOString().replace(/[:.]/g, '-');
        options.outputRoot = path.join(workspaceRoot, 'artifacts', 'electron-unity-parity', runId);
    }

    return options;
};

const parseViewports = (value) => {
    const viewports = String(value)
        .split(',')
        .map((part) => {
            const [width, height] = part.split('x').map((piece) => Number(piece.trim()));
            return Number.isFinite(width) && Number.isFinite(height) ? { width, height } : null;
        })
        .filter(Boolean);

    return viewports.length > 0 ? viewports : [{ width: 1920, height: 1080 }];
};

const printHelp = () => {
    process.stdout.write(
        [
            'Usage: pnpm parity:electron-unity [options]',
            '',
            'Options:',
            '  --out <path>             Artifact output root.',
            '  --viewports <list>       Comma list such as 1920x1080,1366x768.',
            '  --no-start-renderer      Require an existing Vite renderer on 127.0.0.1:5173.',
            '  --no-start-electron      Backward-compatible alias for --no-start-renderer.',
            '  --skip-unity             Capture only Electron and mark Unity as blocked.',
            '  --unity-exe <path>       Unity Editor executable.',
            '  --url <url>              Electron parity harness URL.',
            '',
        ].join('\n')
    );
};

const execFileCapture = (
    command,
    args,
    { input, timeoutMs = 120000, allowFailure = false, stdioMode = 'pipe', env = {} } = {}
) =>
    new Promise((resolve, reject) => {
        const useShell =
            process.platform === 'win32' && path.extname(command).toLowerCase() !== '.exe';
        const capturesOutput = stdioMode !== 'ignore';
        const child = spawn(command, args, {
            cwd: workspaceRoot,
            shell: useShell,
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

const waitForUrl = async (url, timeoutMs) => {
    const started = Date.now();
    let lastError = '';
    while (Date.now() - started < timeoutMs) {
        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (response.ok) {
                return;
            }
            lastError = `HTTP ${response.status}`;
        } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error(`Timed out waiting for ${url}: ${lastError}`);
};

const startRendererDevIfNeeded = async (options) => {
    try {
        await waitForUrl(options.url, 2500);
        return null;
    } catch {
        if (!options.startRenderer) {
            throw new Error(`${options.url} is not reachable and --no-start-renderer was set.`);
        }
    }

    const logPath = path.join(options.outputRoot, 'renderer-dev.log');
    const child = spawn('pnpm', ['run', 'dev'], {
        cwd: workspaceRoot,
        shell: process.platform === 'win32',
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    const chunks = [];
    child.stdout.on('data', (chunk) => chunks.push(chunk));
    child.stderr.on('data', (chunk) => chunks.push(chunk));
    child.on('close', async () => {
        await writeFile(logPath, Buffer.concat(chunks)).catch(() => {});
    });

    try {
        await waitForUrl(options.url, 90000);
    } catch (error) {
        await writeFile(logPath, Buffer.concat(chunks)).catch(() => {});
        stopProcessTree(child.pid);
        throw error;
    }

    return { child, logPath, chunks };
};

const stopProcessTree = (pid) => {
    if (!pid) {
        return;
    }

    if (process.platform === 'win32') {
        spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], {
            stdio: 'ignore',
            windowsHide: true,
        });
        return;
    }

    try {
        process.kill(-pid);
    } catch {
        process.kill(pid);
    }
};

const agent = async (session, args, options = {}) =>
    execFileCapture(agentBrowserCommand, ['--session', session, ...args], {
        ...options,
        env: { AGENT_BROWSER_HEADED: 'false', ...(options.env ?? {}) },
    });

const agentNoOutput = async (session, args, options = {}) =>
    execFileCapture(agentBrowserCommand, ['--session', session, ...args], {
        ...options,
        stdioMode: 'ignore',
        env: { AGENT_BROWSER_HEADED: 'false', ...(options.env ?? {}) },
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

const agentEvalJson = async (session, script, timeoutMs = 60000) => {
    const result = await agent(session, ['eval', '--stdin'], { input: script, timeoutMs });
    return parseAgentJson(result.stdout);
};

const buildElectronScript = (scenario, replayBase64) => {
    const steps = [];
    if (scenario.revision === null) {
        steps.push(...(scenario.actions ?? [{ action: 'reset' }]));
    } else {
        steps.push({
            action: 'load_replay_fixture',
            payload: {
                rawText: { __replayText: true },
                revision: scenario.revision,
            },
        });
        steps.push(...(scenario.actionsAfterLoad ?? []));
    }

    const serializedSteps = JSON.stringify(steps).replaceAll('{"__replayText":true}', 'replayText');

    return `
(async () => {
  const replayText = atob('${replayBase64}');
  const api = window.__GEMDUEL_PARITY__;
  if (!api || !api.isReady()) {
    throw new Error('Electron parity harness is not ready.');
  }
  const steps = ${serializedSteps};
  const results = [];
  for (const step of steps) {
    results.push(await api.dispatch(step.action, step.payload));
  }
  return JSON.stringify({ results, state: api.dumpState() });
})()
`;
};

const captureElectronScenario = async (options, scenario, viewport, replayBase64) => {
    const viewportId = `${viewport.width}x${viewport.height}`;
    const session = `gemduel-parity-${viewportId}-${scenario.id}`;
    const scenarioDir = path.join(options.outputRoot, 'electron', scenario.id);
    await mkdir(scenarioDir, { recursive: true });
    await agentNoOutput(session, [
        'set',
        'viewport',
        String(viewport.width),
        String(viewport.height),
    ]);
    await agentNoOutput(session, ['open', options.url], { timeoutMs: 60000 });
    await agentEvalJson(
        session,
        `
JSON.stringify(Boolean(window.__GEMDUEL_PARITY__ && window.__GEMDUEL_PARITY__.isReady()))
`,
        30000
    );
    const stateResult = await agentEvalJson(
        session,
        buildElectronScript(scenario, replayBase64),
        90000
    );
    const screenshotPath = path.join(scenarioDir, `${viewportId}.png`);
    const statePath = path.join(scenarioDir, `${viewportId}-state.json`);
    await agentNoOutput(session, ['screenshot', screenshotPath], { timeoutMs: 60000 });
    await writeFile(statePath, JSON.stringify(stateResult, null, 4));
    return { screenshotPath, statePath, state: stateResult.state, results: stateResult.results };
};

const runUnityCapture = async (options) => {
    if (options.skipUnity) {
        return { ok: false, blocker: 'Unity capture skipped by --skip-unity.' };
    }

    if (!existsSync(options.unityExe)) {
        return { ok: false, blocker: `Unity executable not found: ${options.unityExe}` };
    }

    const logPath = path.join(options.outputRoot, 'unity-parity-capture.log');
    const viewportArg = options.viewports
        .map((viewport) => `${viewport.width}x${viewport.height}`)
        .join(',');
    const args = [
        '-batchmode',
        '-projectPath',
        path.join(workspaceRoot, 'clients', 'unity'),
        '-executeMethod',
        'GemDuel.Editor.CaptureUnityParityScenarios.CaptureAll',
        '-gemduelParityOut',
        options.outputRoot,
        '-gemduelParityViewports',
        viewportArg,
        '-logFile',
        logPath,
        '-quit',
    ];

    const result = await execFileCapture(options.unityExe, args, {
        timeoutMs: 600000,
        allowFailure: true,
    });
    return {
        ok: result.code === 0,
        code: result.code,
        logPath,
        blocker: result.code === 0 ? null : `Unity capture exited with code ${result.code}.`,
    };
};

const normalizeInstance = (value) => {
    if (value == null) {
        return null;
    }
    if (typeof value === 'string') {
        return value;
    }
    return value.instanceId ?? value.uid ?? value.id ?? value.slotKey ?? JSON.stringify(value);
};

const normalizeUnitySnapshot = (unityState) => {
    const snapshot = unityState?.snapshot ?? {};
    return {
        mode: snapshot.mode ?? unityState?.mode ?? null,
        phase: snapshot.phase ?? unityState?.phase ?? null,
        turn: snapshot.turn ?? unityState?.turn ?? null,
        winner: snapshot.winner ?? unityState?.winner ?? null,
        board: snapshot.board ?? [],
        market: {
            1: (snapshot.market?.[1] ?? snapshot.market?.['1'] ?? []).map(normalizeInstance),
            2: (snapshot.market?.[2] ?? snapshot.market?.['2'] ?? []).map(normalizeInstance),
            3: (snapshot.market?.[3] ?? snapshot.market?.['3'] ?? []).map(normalizeInstance),
        },
        royalDeck: (snapshot.royalDeck ?? []).map(normalizeInstance),
        playerTableau: {
            p1: (snapshot.playerTableau?.p1 ?? []).map(normalizeInstance),
            p2: (snapshot.playerTableau?.p2 ?? []).map(normalizeInstance),
        },
        playerReserved: {
            p1: (snapshot.playerReserved?.p1 ?? []).map(normalizeInstance),
            p2: (snapshot.playerReserved?.p2 ?? []).map(normalizeInstance),
        },
        playerRoyals: {
            p1: (snapshot.playerRoyals?.p1 ?? []).map(normalizeInstance),
            p2: (snapshot.playerRoyals?.p2 ?? []).map(normalizeInstance),
        },
        inventories: snapshot.inventories ?? {},
        privileges: snapshot.privileges ?? {},
        extraPoints: snapshot.extraPoints ?? {},
        extraCrowns: snapshot.extraCrowns ?? {},
        pendingReserve: snapshot.pendingReserve ?? null,
        pendingBuy: snapshot.pendingBuy ?? null,
    };
};

const normalizeElectronState = (electronState) => {
    const game = electronState?.game ?? {};
    return {
        mode: game.mode ?? null,
        phase: game.phase ?? null,
        turn: game.turn ?? null,
        winner: game.winner ?? null,
        board: game.board ?? [],
        market: game.market ?? {},
        royalDeck: game.royalDeck ?? [],
        playerTableau: game.playerTableau ?? {},
        playerReserved: game.playerReserved ?? {},
        playerRoyals: game.playerRoyals ?? {},
        inventories: game.inventories ?? {},
        privileges: game.privileges ?? {},
        extraPoints: game.extraPoints ?? {},
        extraCrowns: game.extraCrowns ?? {},
        pendingReserve: game.pendingReserve ?? null,
        pendingBuy: game.pendingBuy ?? null,
    };
};

const diffState = (electronState, unityState) => {
    const electron = normalizeElectronState(electronState);
    const unity = normalizeUnitySnapshot(unityState);
    const mismatches = [];
    const fields = Object.keys(electron);
    for (const field of fields) {
        const left = JSON.stringify(electron[field]);
        const right = JSON.stringify(unity[field]);
        if (left !== right) {
            mismatches.push({ field, electron: electron[field], unity: unity[field] });
        }
    }

    return { ok: mismatches.length === 0, mismatchCount: mismatches.length, mismatches };
};

const compareScreenshots = async (electronPath, unityPath, diffPath) => {
    const result = await execFileCapture(
        'powershell',
        [
            '-NoProfile',
            '-ExecutionPolicy',
            'Bypass',
            '-File',
            path.join(workspaceRoot, 'tools', 'migration', 'compare-png.ps1'),
            '-BaselinePath',
            electronPath,
            '-CandidatePath',
            unityPath,
            '-DiffPath',
            diffPath,
        ],
        { timeoutMs: 180000, allowFailure: true }
    );
    return parseAgentJson(result.stdout);
};

const roundRectValue = (value) =>
    typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(2)) : null;

const normalizeRect = (rect) => ({
    x: roundRectValue(rect?.x),
    y: roundRectValue(rect?.y),
    width: roundRectValue(rect?.width),
    height: roundRectValue(rect?.height),
});

const summarizeElectronBoxes = (electronState) =>
    (electronState?.visible?.boxes ?? []).map((box) => ({
        key: box.semanticKey || box.key,
        rawKey: box.key,
        semanticKey: box.semanticKey || null,
        selector: box.selector,
        text: box.text ? String(box.text).slice(0, 160) : '',
        rect: normalizeRect(box.rect),
    }));

const summarizeUnityBoxes = (unityState) =>
    (unityState?.visibleTargets ?? []).map((target, index) => {
        const semanticParts = [
            target.kind,
            target.level >= 0 ? `level:${target.level}` : null,
            target.index >= 0 ? `index:${target.index}` : null,
            target.row >= 0 ? `row:${target.row}` : null,
            target.column >= 0 ? `column:${target.column}` : null,
            target.instanceId || target.royalId || target.gemId || target.buffId || null,
        ].filter(Boolean);
        return {
            key:
                target.semanticKey ||
                (semanticParts.length > 0 ? semanticParts.join('|') : `unity-target:${index}`),
            semanticKey: target.semanticKey || null,
            kind: target.kind,
            level: target.level,
            index: target.index,
            row: target.row,
            column: target.column,
            instanceId: target.instanceId || null,
            royalId: target.royalId || null,
            gemId: target.gemId || null,
            buffId: target.buffId || null,
            rect: normalizeRect(target.rect),
        };
    });

const requiredSemanticKeys = [
    'app.shell',
    'main.menu',
    'mode.local',
    'board.root',
    'market.level.1',
    'market.level.2',
    'market.level.3',
    'market.card.1.0',
    'market.card.2.0',
    'market.card.3.0',
    'card.preview.overlay',
    'card.preview.primaryAction',
    'player.current.zone',
    'player.opponent.zone',
    'player.resources',
    'player.score',
    'player.reserved.0',
    'turn.end',
    'royal.featured',
    'settings.panel',
    'error.banner',
];

const buildBoundingBoxReport = (electronState, unityState) => {
    const electron = summarizeElectronBoxes(electronState);
    const unity = summarizeUnityBoxes(unityState);
    const electronByKey = new Map(electron.map((box) => [box.key, box]));
    const unityByKey = new Map(unity.map((box) => [box.key, box]));
    const commonKeys = [...electronByKey.keys()].filter((key) => unityByKey.has(key));
    const electronKeys = new Set(electronByKey.keys());
    const unityKeys = new Set(unityByKey.keys());
    const missingElectronKeys = requiredSemanticKeys.filter(
        (key) => unityKeys.has(key) && !electronKeys.has(key)
    );
    const missingUnityKeys = requiredSemanticKeys.filter(
        (key) => electronKeys.has(key) && !unityKeys.has(key)
    );
    const absentInBothKeys = requiredSemanticKeys.filter(
        (key) => !electronKeys.has(key) && !unityKeys.has(key)
    );
    const comparisons = commonKeys.map((key) => {
        const electronRect = electronByKey.get(key).rect;
        const unityRect = unityByKey.get(key).rect;
        const deltas = {
            x: Math.abs(electronRect.x - unityRect.x),
            y: Math.abs(electronRect.y - unityRect.y),
            width: Math.abs(electronRect.width - unityRect.width),
            height: Math.abs(electronRect.height - unityRect.height),
        };
        return {
            key,
            electron: electronRect,
            unity: unityRect,
            deltas,
            ok: deltas.x <= 2 && deltas.y <= 2 && deltas.width <= 2 && deltas.height <= 2,
        };
    });

    return {
        thresholdPx: 2,
        ok:
            commonKeys.length > 0 &&
            missingElectronKeys.length === 0 &&
            missingUnityKeys.length === 0 &&
            comparisons.every((comparison) => comparison.ok),
        blocker: null,
        electronCount: electron.length,
        unityCount: unity.length,
        commonKeyCount: commonKeys.length,
        missingElectronKeys,
        missingUnityKeys,
        absentInBothKeys,
        comparisons,
        electron,
        unity,
    };
};

const writeMatrix = async (options, matrixRows) => {
    const jsonPath = path.join(options.outputRoot, 'parity-matrix.json');
    const mdPath = path.join(options.outputRoot, 'parity-matrix.md');
    const lines = [
        '# Electron vs Unity Sync Parity Matrix',
        '',
        `Generated: ${new Date().toISOString()}`,
        '',
        '| Scenario | Electron entry | Unity entry | Input script | Expected shared state | Screenshot path | State diff result | Pixel/visual diff result | Status |',
        '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ];

    for (const row of matrixRows) {
        lines.push(
            [
                row.scenario,
                row.electronEntry,
                row.unityEntry,
                row.inputScript,
                row.expectedSharedState,
                row.screenshotPath,
                row.stateDiffResult,
                row.pixelVisualDiffResult,
                row.status,
            ]
                .map((value) =>
                    String(value ?? '')
                        .replace(/\|/g, '\\|')
                        .replace(/\n/g, '<br>')
                )
                .join(' | ')
                .replace(/^/, '| ')
                .replace(/$/, ' |')
        );
    }

    await writeFile(jsonPath, JSON.stringify(matrixRows, null, 4));
    await writeFile(mdPath, lines.join('\n') + '\n');
    return { jsonPath, mdPath };
};

const main = async () => {
    const options = parseArgs();
    await mkdir(options.outputRoot, { recursive: true });
    const replayText = await readFile(fixturePath, 'utf8');
    const replayBase64 = Buffer.from(replayText, 'utf8').toString('base64');
    const rendererDev = await startRendererDevIfNeeded(options);
    const unityResult = await runUnityCapture(options);
    const matrixRows = [];

    try {
        await execFileCapture(agentBrowserCommand, ['close', '--all'], {
            timeoutMs: 30000,
            allowFailure: true,
            stdioMode: 'ignore',
            env: { AGENT_BROWSER_HEADED: 'false' },
        });

        for (const viewport of options.viewports) {
            const viewportId = `${viewport.width}x${viewport.height}`;
            for (const scenario of scenarioDefinitions) {
                const scenarioWithDefaults = {
                    electronEntry: options.url,
                    unityEntry: 'GemDuel.Editor.CaptureUnityParityScenarios',
                    inputScript:
                        scenario.revision === null
                            ? (scenario.actions ?? [{ action: 'reset' }])
                                  .map((step) => step.action)
                                  .join(', ')
                            : `load_replay_fixture(revision=${scenario.revision})${
                                  scenario.actionsAfterLoad
                                      ? ', ' +
                                        scenario.actionsAfterLoad
                                            .map((step) => step.action)
                                            .join(', ')
                                      : ''
                              }`,
                    ...scenario,
                };
                const electron = await captureElectronScenario(
                    options,
                    scenarioWithDefaults,
                    viewport,
                    replayBase64
                );
                const unityScreenshotPath = path.join(
                    options.outputRoot,
                    'unity',
                    scenario.id,
                    `${viewportId}.png`
                );
                const unityStatePath = path.join(
                    options.outputRoot,
                    'unity',
                    scenario.id,
                    `${viewportId}-state.json`
                );
                const stateDiffPath = path.join(
                    options.outputRoot,
                    'diff',
                    scenario.id,
                    `${viewportId}-state-diff.json`
                );
                const imageDiffPath = path.join(
                    options.outputRoot,
                    'diff',
                    scenario.id,
                    `${viewportId}.png`
                );
                await mkdir(path.dirname(stateDiffPath), { recursive: true });

                let stateDiff = {
                    ok: false,
                    mismatchCount: 0,
                    mismatches: [],
                    blocker: unityResult.blocker ?? 'Unity state capture unavailable.',
                };
                let visualDiff = {
                    ok: false,
                    blocker: unityResult.blocker ?? 'Unity screenshot unavailable.',
                    diffPath: imageDiffPath,
                };

                if (
                    unityResult.ok &&
                    existsSync(unityStatePath) &&
                    existsSync(unityScreenshotPath)
                ) {
                    const unityState = JSON.parse(await readFile(unityStatePath, 'utf8'));
                    stateDiff = diffState(electron.state, unityState);
                    visualDiff = await compareScreenshots(
                        electron.screenshotPath,
                        unityScreenshotPath,
                        imageDiffPath
                    );
                    visualDiff.pixelOk = Boolean(visualDiff.ok);
                    visualDiff.boundingBoxes = buildBoundingBoxReport(electron.state, unityState);
                    visualDiff.ok = Boolean(visualDiff.pixelOk && visualDiff.boundingBoxes.ok);
                }

                await writeFile(stateDiffPath, JSON.stringify(stateDiff, null, 4));
                const visualDiffPath = path.join(
                    options.outputRoot,
                    'diff',
                    scenario.id,
                    `${viewportId}-visual-diff.json`
                );
                await writeFile(visualDiffPath, JSON.stringify(visualDiff, null, 4));

                const status = scenario.blocker
                    ? 'Blocker'
                    : stateDiff.ok && visualDiff.ok
                      ? 'Equivalent'
                      : unityResult.ok
                        ? 'Failing'
                        : 'Blocker';

                matrixRows.push({
                    scenario: `${scenario.name} (${viewportId})`,
                    electronEntry: scenarioWithDefaults.electronEntry,
                    unityEntry: scenarioWithDefaults.unityEntry,
                    inputScript: scenarioWithDefaults.inputScript,
                    expectedSharedState: scenario.expectedSharedState,
                    screenshotPath: `Electron: ${electron.screenshotPath}; Unity: ${unityScreenshotPath}; Diff: ${imageDiffPath}`,
                    stateDiffResult: stateDiff.ok
                        ? 'Equivalent'
                        : stateDiff.blocker
                          ? `Blocker (${stateDiff.mismatchCount ?? 0}) -> ${stateDiffPath}`
                          : `Mismatch (${stateDiff.mismatchCount ?? 0}) -> ${stateDiffPath}`,
                    pixelVisualDiffResult: visualDiff.ok
                        ? `Equivalent (${visualDiff.mismatchPercent}%)`
                        : visualDiff.blocker
                          ? `Blocker -> ${visualDiffPath}`
                          : `Failing -> ${visualDiffPath}`,
                    status,
                    artifacts: {
                        electronScreenshot: electron.screenshotPath,
                        electronState: electron.statePath,
                        unityScreenshot: unityScreenshotPath,
                        unityState: unityStatePath,
                        stateDiff: stateDiffPath,
                        visualDiff: visualDiffPath,
                        visualDiffImage: imageDiffPath,
                    },
                    electronResults: electron.results,
                    expectedDebt: scenario.expectedDebt ?? null,
                });
            }
        }
    } finally {
        await execFileCapture(agentBrowserCommand, ['close', '--all'], {
            timeoutMs: 30000,
            allowFailure: true,
            stdioMode: 'ignore',
            env: { AGENT_BROWSER_HEADED: 'false' },
        }).catch(() => {});
        if (rendererDev?.child) {
            await writeFile(rendererDev.logPath, Buffer.concat(rendererDev.chunks)).catch(
                () => {}
            );
            stopProcessTree(rendererDev.child.pid);
        }
    }

    const matrixPaths = await writeMatrix(options, matrixRows);
    await writeFile(
        path.join(options.outputRoot, 'runner-summary.json'),
        JSON.stringify(
            {
                outputRoot: options.outputRoot,
                viewports: options.viewports,
                unity: unityResult,
                matrix: matrixPaths,
                counts: matrixRows.reduce((acc, row) => {
                    acc[row.status] = (acc[row.status] ?? 0) + 1;
                    return acc;
                }, {}),
            },
            null,
            4
        )
    );

    process.stdout.write(`Electron/Unity parity artifacts: ${options.outputRoot}\n`);
    process.stdout.write(`Matrix: ${matrixPaths.mdPath}\n`);
};

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exit(1);
});
