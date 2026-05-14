import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { buildLocalPvpFullGamePlan } from './local-pvp-full-game-plan';
import { handleUnityRulesEngineBridgeRequest } from './unity-rules-engine-bridge';
import type { GameAction, PlayerKey } from '../../packages/shared/src/types';

const DEFAULT_MATCH_COUNT = 100;
const DEFAULT_SEED_PREFIX = 'local-pvp-sim-parity';
const DEFAULT_SEED_START = 20260513;
const DEFAULT_GAME_VERSION = '5.2.11';
const DEFAULT_MAX_ACTIONS = 500;

type SuiteVerdict = 'Complete' | 'Incomplete' | 'Blocked';

interface SuiteOptions {
    matchCount: number;
    seedPrefix: string;
    seedStart: number;
    gameVersion: string;
    maxActions: number;
    outDir: string;
    failFast: boolean;
}

interface StepComparison {
    index: number;
    actionType: string;
    actor: PlayerKey;
    phaseBefore: string;
    phaseAfter: string;
    electronStateHashBefore: string;
    unityStateHashBefore: string;
    electronStateHashAfter: string;
    unityStateHashAfter: string;
    ok: boolean;
    failureReason: string | null;
}

interface MatchComparison {
    index: number;
    seed: string;
    ok: boolean;
    failureReason: string | null;
    logicalActions: number;
    finalWinner: PlayerKey | null;
    electronFinalStateHash: string;
    unityFinalStateHash: string | null;
    replayHash: string;
    traceHash: string;
    actionFamilies: string[];
    phaseEdges: string[];
    firstMismatch: StepComparison | null;
    steps: StepComparison[];
}

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const defaultArtifactRoot = path.join(
    workspaceRoot,
    'artifacts',
    'electron-unity-parity',
    'local-pvp-simulation-100'
);

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const stableHash = (value: unknown): string =>
    createHash('sha256').update(JSON.stringify(value)).digest('hex');

const parseBooleanFlag = (value: string | undefined): boolean =>
    value === undefined || value === 'true' || value === '1';

const resolveWorkspacePath = (value: string): string =>
    path.isAbsolute(value) ? value : path.resolve(workspaceRoot, value);

const parseArgs = (argv = process.argv.slice(2)): SuiteOptions => {
    const values = new Map<string, string | undefined>();
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (!arg.startsWith('--')) {
            throw new Error(`Unknown positional argument: ${arg}`);
        }

        const next = argv[index + 1];
        if (next && !next.startsWith('--')) {
            values.set(arg, next);
            index += 1;
        } else {
            values.set(arg, undefined);
        }
    }

    return {
        matchCount: Number(values.get('--match-count') ?? DEFAULT_MATCH_COUNT),
        seedPrefix: values.get('--seed-prefix') ?? DEFAULT_SEED_PREFIX,
        seedStart: Number(values.get('--seed-start') ?? DEFAULT_SEED_START),
        gameVersion: values.get('--game-version') ?? DEFAULT_GAME_VERSION,
        maxActions: Number(values.get('--max-actions') ?? DEFAULT_MAX_ACTIONS),
        outDir: resolveWorkspacePath(values.get('--out-dir') ?? defaultArtifactRoot),
        failFast: values.has('--fail-fast') ? parseBooleanFlag(values.get('--fail-fast')) : false,
    };
};

const validateOptions = (options: SuiteOptions) => {
    if (!Number.isInteger(options.matchCount) || options.matchCount <= 0) {
        throw new Error(`Invalid --match-count: ${options.matchCount}`);
    }
    if (!Number.isInteger(options.seedStart)) {
        throw new Error(`Invalid --seed-start: ${options.seedStart}`);
    }
    if (!Number.isInteger(options.maxActions) || options.maxActions <= 0) {
        throw new Error(`Invalid --max-actions: ${options.maxActions}`);
    }
};

const commandFromAction = (action: GameAction) => {
    if (action.type === 'INIT' || action.type === 'INIT_DRAFT') {
        throw new Error(`Bootstrap action ${action.type} is not applied through Unity bridge.`);
    }

    const payload = 'payload' in action ? cloneJson(action.payload) : undefined;
    if (
        payload &&
        typeof payload === 'object' &&
        'marketInfo' in payload &&
        payload.marketInfo &&
        typeof payload.marketInfo === 'object' &&
        !('level' in payload)
    ) {
        Object.assign(payload, cloneJson(payload.marketInfo));
    }

    return {
        type: action.type,
        ...(payload === undefined ? {} : { payload }),
    };
};

const collectActionFamilies = (steps: StepComparison[]): string[] =>
    Array.from(new Set(steps.map((step) => step.actionType))).sort();

const collectPhaseEdges = (steps: StepComparison[]): string[] =>
    Array.from(new Set(steps.map((step) => `${step.phaseBefore} -> ${step.phaseAfter}`))).sort();

const runOneMatch = (index: number, seed: string, options: SuiteOptions): MatchComparison => {
    const plan = buildLocalPvpFullGamePlan({
        seed,
        gameVersion: options.gameVersion,
        maxActions: options.maxActions,
    });
    const replayHash = stableHash(plan.replay);
    const start = handleUnityRulesEngineBridgeRequest({
        kind: 'start',
        mode: 'LOCAL_PVP',
        useBuffs: false,
        seed,
        hostPlayer: 'p1',
    });

    const steps: StepComparison[] = [];
    let unityStateHash: string | null = start.ok ? start.stateHash : null;
    let unityState = start.ok ? start.state : null;
    let firstMismatch: StepComparison | null = null;
    let failureReason: string | null = null;

    if (!start.ok) {
        failureReason = start.rejection.reason;
    } else {
        const bootstrapTrace = plan.logicalActions[0];
        if (!bootstrapTrace || start.stateHash !== bootstrapTrace.stateHashAfter) {
            failureReason =
                'Unity start hash mismatch: ' +
                start.stateHash +
                ' != ' +
                (bootstrapTrace?.stateHashAfter ?? '<missing electron bootstrap hash>');
        }
    }

    for (const trace of plan.logicalActions.slice(1)) {
        if (failureReason || !start.ok || !unityState) {
            break;
        }

        const beforeHash = unityStateHash ?? '<missing>';
        const response = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: unityState,
            actor: trace.actorBefore,
            command: commandFromAction(trace.action),
        });

        const ok =
            response.ok &&
            beforeHash === trace.stateHashBefore &&
            response.stateHash === trace.stateHashAfter;
        const step: StepComparison = {
            index: trace.index,
            actionType: trace.action.type,
            actor: trace.actorBefore,
            phaseBefore: trace.phaseBefore,
            phaseAfter: trace.phaseAfter,
            electronStateHashBefore: trace.stateHashBefore,
            unityStateHashBefore: beforeHash,
            electronStateHashAfter: trace.stateHashAfter,
            unityStateHashAfter: response.ok ? response.stateHash : '<rejected>',
            ok,
            failureReason: ok
                ? null
                : response.ok
                  ? `Hash mismatch after ${trace.action.type}.`
                  : response.rejection.reason,
        };
        steps.push(step);

        if (!ok) {
            firstMismatch = step;
            failureReason = step.failureReason;
            break;
        }

        unityState = response.state;
        unityStateHash = response.stateHash;
    }

    const finalWinner = start.ok && unityState ? (unityState.winner as PlayerKey | null) : null;
    const finalHashMatches = unityStateHash === plan.oracle.finalStateHash;
    const winnerMatches = finalWinner === plan.oracle.winner;
    if (!failureReason && (!finalHashMatches || !winnerMatches)) {
        failureReason =
            'Final result mismatch: hash ' +
            unityStateHash +
            ' vs ' +
            plan.oracle.finalStateHash +
            ', winner ' +
            finalWinner +
            ' vs ' +
            plan.oracle.winner +
            '.';
    }

    return {
        index,
        seed,
        ok: !failureReason,
        failureReason,
        logicalActions: plan.logicalActions.length,
        finalWinner,
        electronFinalStateHash: plan.oracle.finalStateHash,
        unityFinalStateHash: unityStateHash,
        replayHash,
        traceHash: stableHash(steps),
        actionFamilies: collectActionFamilies(steps),
        phaseEdges: collectPhaseEdges(steps),
        firstMismatch,
        steps,
    };
};

const buildHtmlReport = (report: ReturnType<typeof runLocalPvpSimulationParitySuite>): string => {
    const rows = report.matches
        .map(
            (match) =>
                `<tr><td>${match.index}</td><td>${match.seed}</td><td>${match.ok ? 'PASS' : 'FAIL'}</td><td>${match.logicalActions}</td><td>${match.finalWinner ?? ''}</td><td><code>${match.electronFinalStateHash}</code></td><td>${match.failureReason ?? ''}</td></tr>`
        )
        .join('\n');
    return `<!doctype html>
<html lang="en">
<meta charset="utf-8" />
<title>Local PVP Simulation Parity Suite</title>
<style>
body{font-family:system-ui,sans-serif;margin:24px;background:#0f172a;color:#e2e8f0}
table{border-collapse:collapse;width:100%;background:#111827}
th,td{border:1px solid #334155;padding:8px;text-align:left}
code{font-family:ui-monospace,monospace}
.pass{color:#34d399}.fail{color:#fb7185}
</style>
<h1>Local PVP Simulation Parity Suite</h1>
<p>Verdict: <strong class="${report.ok ? 'pass' : 'fail'}">${report.verdict}</strong></p>
<p>${report.summary.passed}/${report.summary.matchCount} matches passed. Trace hash: <code>${report.summary.suiteTraceHash}</code></p>
<table>
<thead><tr><th>#</th><th>Seed</th><th>Status</th><th>Actions</th><th>Winner</th><th>Final Hash</th><th>Failure</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</html>
`;
};

export const runLocalPvpSimulationParitySuite = (options: SuiteOptions) => {
    validateOptions(options);
    const startedAt = new Date().toISOString();
    const matches: MatchComparison[] = [];
    for (let index = 0; index < options.matchCount; index += 1) {
        const seed = `${options.seedPrefix}-${options.seedStart + index}`;
        const match = runOneMatch(index, seed, options);
        matches.push(match);
        if (!match.ok && options.failFast) {
            break;
        }
    }

    const failed = matches.filter((match) => !match.ok);
    const coveredActionFamilies = Array.from(
        new Set(matches.flatMap((match) => match.actionFamilies))
    ).sort();
    const coveredPhaseEdges = Array.from(
        new Set(matches.flatMap((match) => match.phaseEdges))
    ).sort();
    const ok = matches.length === options.matchCount && failed.length === 0;
    const verdict: SuiteVerdict = ok ? 'Complete' : matches.length === 0 ? 'Blocked' : 'Incomplete';
    return {
        schemaVersion: 1,
        kind: 'local-pvp-simulation-electron-unity-parity-suite',
        startedAt,
        finishedAt: new Date().toISOString(),
        ok,
        verdict,
        scope: {
            included: ['Local PVP'],
            exempt: [
                'Roguelike Local PVP',
                'Replay Import/Review',
                'Settings matrix',
                'Recovery matrix',
                'LAN',
                'Online',
                'Visual Lab',
            ],
        },
        controls: {
            electronOracle: 'TypeScript shared simulation expanded to Electron Local PVP UI flow',
            unityOracle: 'Unity live rules bridge command execution',
            usedFixtureGameplayDriver: false,
            usedCheckpointStateReplacement: false,
        },
        options,
        summary: {
            matchCount: options.matchCount,
            executedMatches: matches.length,
            passed: matches.length - failed.length,
            failed: failed.length,
            coveredActionFamilies,
            coveredPhaseEdges,
            suiteTraceHash: stableHash(matches.map((match) => match.traceHash)),
            firstFailure: failed[0]?.failureReason ?? null,
        },
        matches,
    };
};

const isDirectRun = () =>
    process.argv.some((arg) =>
        arg.replace(/\\/g, '/').endsWith('run-local-pvp-simulation-parity-suite.ts')
    );

if (isDirectRun()) {
    const options = parseArgs();
    const report = runLocalPvpSimulationParitySuite(options);
    mkdirSync(options.outDir, { recursive: true });
    const jsonPath = path.join(options.outDir, 'local-pvp-simulation-parity-suite-report.json');
    const htmlPath = path.join(options.outDir, 'local-pvp-simulation-parity-suite-report.html');
    writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    writeFileSync(htmlPath, buildHtmlReport(report), 'utf8');
    console.log(
        JSON.stringify(
            {
                ok: report.ok,
                verdict: report.verdict,
                summary: report.summary,
                reportJsonPath: jsonPath,
                reportHtmlPath: htmlPath,
            },
            null,
            2
        )
    );
    if (!report.ok) {
        process.exitCode = 1;
    }
}
