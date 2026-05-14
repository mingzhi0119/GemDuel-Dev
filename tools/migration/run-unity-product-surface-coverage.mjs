import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), '..', '..');
const defaultModelPath = path.join(
    repoRoot,
    'tools',
    'migration',
    'unity-product-surface-coverage-model.json'
);
const defaultCoverageDir = path.join(repoRoot, 'artifacts', 'unity', 'product-surface-coverage');
const defaultBuiltPlayerSmokeDir = path.join(repoRoot, 'artifacts', 'unity', 'built-player-smoke');
const defaultRulesRuntimePackageDir = path.join(
    repoRoot,
    'artifacts',
    'unity',
    'rules-runtime-package'
);
const defaultLocalPvpFullGameDir = path.join(
    repoRoot,
    'artifacts',
    'electron-unity-parity',
    'local-pvp-built-player-full-game'
);
const defaultPackagedRuntimeFullGameDir = path.join(
    repoRoot,
    'artifacts',
    'electron-unity-parity',
    'local-pvp-built-player-full-game-packaged-runtime'
);
const nowSlug = new Date().toISOString().replace(/[:.]/g, '-');

const usage = `Usage:
  node tools/migration/run-unity-product-surface-coverage.mjs [--collect-existing] [--run-built-player] [--check] [--model <file>] [--out-dir <dir>] [--report <file>] [--html <file>] [--launcher-report <file>] [--max-existing <count>] [launcher-report...]

Builds a finite Unity product-surface coverage report from retained or freshly-run built Windows
player launcher reports and retained Local PVP full-game suite reports. Without --check,
incomplete/blocked product coverage is reported but does not fail the command. With --check, only a
Complete verdict exits 0.
`;

const toRepoPath = (filePath) => {
    if (!filePath || typeof filePath !== 'string') {
        return null;
    }

    const absolute = path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath);
    return path.relative(repoRoot, absolute).replaceAll(path.sep, '/');
};

const uniqueSorted = (values) =>
    [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));

const normalizePath = (filePath) =>
    path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath);

const readJsonFile = (filePath) => JSON.parse(readFileSync(filePath, 'utf8'));

const parseArgs = () => {
    const args = process.argv.slice(2);
    const launcherReports = [];
    let modelPath = defaultModelPath;
    let outDir = defaultCoverageDir;
    let reportPath = null;
    let htmlPath = null;
    let collectExisting = false;
    let runBuiltPlayer = false;
    let check = false;
    let maxExisting = 0;

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (arg === '--help' || arg === '-h') {
            process.stdout.write(usage);
            process.exit(0);
        }

        if (arg === '--collect-existing') {
            collectExisting = true;
            continue;
        }

        if (arg === '--run-built-player') {
            runBuiltPlayer = true;
            continue;
        }

        if (arg === '--check') {
            check = true;
            continue;
        }

        if (arg === '--model') {
            modelPath = requireValue(args, index, '--model');
            index += 1;
            continue;
        }

        if (arg === '--out-dir') {
            outDir = requireValue(args, index, '--out-dir');
            index += 1;
            continue;
        }

        if (arg === '--report') {
            reportPath = requireValue(args, index, '--report');
            index += 1;
            continue;
        }

        if (arg === '--html') {
            htmlPath = requireValue(args, index, '--html');
            index += 1;
            continue;
        }

        if (arg === '--launcher-report') {
            launcherReports.push(requireValue(args, index, '--launcher-report'));
            index += 1;
            continue;
        }

        if (arg === '--max-existing') {
            const parsed = Number.parseInt(requireValue(args, index, '--max-existing'), 10);
            if (!Number.isInteger(parsed) || parsed < 0) {
                throw new Error('--max-existing must be a non-negative integer.');
            }

            maxExisting = parsed;
            index += 1;
            continue;
        }

        if (arg.startsWith('--')) {
            throw new Error(`Unknown option: ${arg}`);
        }

        launcherReports.push(arg);
    }

    outDir = normalizePath(outDir);
    return {
        check,
        collectExisting,
        htmlPath: normalizePath(
            htmlPath ?? path.join(outDir, 'unity-product-surface-coverage-report.html')
        ),
        launcherReports: uniqueSorted(launcherReports.map(normalizePath)),
        maxExisting,
        modelPath: normalizePath(modelPath),
        outDir,
        reportPath: normalizePath(
            reportPath ?? path.join(outDir, 'unity-product-surface-coverage-report.json')
        ),
        runBuiltPlayer,
    };
};

const requireValue = (args, index, flag) => {
    const next = args[index + 1];
    if (!next || next.startsWith('--')) {
        throw new Error(`${flag} requires a value.`);
    }

    return next;
};

const collectFilesRecursive = (dir, predicate) => {
    if (!existsSync(dir)) {
        return [];
    }

    const entries = readdirSync(dir, { withFileTypes: true });
    return entries.flatMap((entry) => {
        const filePath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return collectFilesRecursive(filePath, predicate);
        }

        return predicate(entry.name, filePath) ? [filePath] : [];
    });
};

const collectExistingLauncherReports = (maxExisting) => {
    const retainedDirs = [defaultBuiltPlayerSmokeDir, defaultCoverageDir];
    const launcherReports = retainedDirs
        .filter((dir) => existsSync(dir))
        .flatMap((dir) => collectFilesRecursive(dir, (name) => name.endsWith('.launcher.json')));
    const fullGameReports = [defaultLocalPvpFullGameDir, defaultPackagedRuntimeFullGameDir]
        .flatMap((dir) =>
            collectFilesRecursive(
                dir,
                (name) => name === 'local-pvp-built-player-full-game-suite-report.json'
            )
        )
        .map((filePath) => ({
            filePath,
            mtimeMs: statSync(filePath).mtimeMs,
        }))
        .sort((left, right) => right.mtimeMs - left.mtimeMs)
        .map((entry) => entry.filePath)
        .slice(0, 1);
    const rulesRuntimePackageReports = collectFilesRecursive(
        defaultRulesRuntimePackageDir,
        (name) => name === 'unity-rules-runtime-package-report.json'
    )
        .map((filePath) => ({
            filePath,
            mtimeMs: statSync(filePath).mtimeMs,
        }))
        .sort((left, right) => right.mtimeMs - left.mtimeMs)
        .map((entry) => entry.filePath)
        .slice(0, 1);

    const reports = [...launcherReports, ...fullGameReports, ...rulesRuntimePackageReports]
        .map((filePath) => ({
            filePath,
            mtimeMs: statSync(filePath).mtimeMs,
        }))
        .sort((left, right) => right.mtimeMs - left.mtimeMs)
        .map((entry) => entry.filePath);

    return maxExisting > 0 ? reports.slice(0, maxExisting) : reports;
};

const runBuiltPlayerScenarios = (model, outDir) => {
    const runner = path.join(repoRoot, 'tools', 'migration', 'run-unity-built-player-smoke.mjs');
    const attempts = [];
    const reports = [];
    for (const scenario of model.automationScenarios ?? []) {
        if (scenario.runner !== 'built-player-smoke') {
            continue;
        }

        const stem = `${nowSlug}-${scenario.id}`;
        const launcherReport = path.join(outDir, `${stem}.launcher.json`);
        const args = [
            runner,
            '--seed',
            scenario.seed,
            '--start-mode',
            scenario.startMode,
            '--max-steps',
            String(scenario.maxSteps),
            '--idle-action-preference',
            scenario.idleActionPreference ?? 'balanced',
            '--draft-action-preference',
            scenario.draftActionPreference ?? 'select-first',
            '--timeout-ms',
            String(scenario.timeoutMs ?? 120000),
            '--report',
            path.join(outDir, `${stem}.json`),
            '--stdout',
            path.join(outDir, `${stem}.stdout.log`),
            '--stderr',
            path.join(outDir, `${stem}.stderr.log`),
            '--player-log',
            path.join(outDir, `${stem}.player.log`),
            '--launcher-report',
            launcherReport,
            ...(scenario.includeFlags ?? []),
        ];
        const result = spawnSync(process.execPath, args, {
            cwd: repoRoot,
            encoding: 'utf8',
            maxBuffer: 16 * 1024 * 1024,
            stdio: 'pipe',
            windowsHide: true,
        });
        attempts.push({
            scenarioId: scenario.id,
            launcherReport: toRepoPath(launcherReport),
            exitCode: result.status,
            signal: result.signal,
            stdoutBytes: Buffer.byteLength(result.stdout ?? '', 'utf8'),
            stderrBytes: Buffer.byteLength(result.stderr ?? '', 'utf8'),
            stderrTail: (result.stderr ?? '').slice(-4000) || null,
            error: result.error instanceof Error ? result.error.message : null,
            ok: result.status === 0 && existsSync(launcherReport),
        });
        if (existsSync(launcherReport)) {
            reports.push(launcherReport);
        }
    }

    return { attempts, reports };
};

const createEvidenceIndex = () => ({
    actionFamilies: new Map(),
    entrypoints: new Map(),
    oracleEvents: [],
    phaseEdges: new Map(),
    releaseRuntimePackages: [],
    recoveryCases: new Map(),
    settingsProofs: [],
    sourceReports: [],
    visualContracts: new Map(),
});

const addEvidence = (map, id, evidence) => {
    if (!id) {
        return;
    }

    if (!map.has(id)) {
        map.set(id, []);
    }
    map.get(id).push(evidence);
};

const addFamilyEvidence = (index, familyId, legality, evidence) => {
    if (!familyId) {
        return;
    }

    if (!index.actionFamilies.has(familyId)) {
        index.actionFamilies.set(familyId, { legal: [], illegal: [] });
    }

    index.actionFamilies.get(familyId)[legality].push(evidence);
};

const addVisualContractEvidence = (index, contractId, evidence) => {
    addEvidence(index.visualContracts, contractId, evidence);
};

const actionTypeToFamily = new Map([
    ['TAKE_GEMS', 'take_gems'],
    ['BUY_CARD', 'buy'],
    ['INITIATE_BUY_JOKER', 'buy'],
    ['INITIATE_RESERVE', 'reserve'],
    ['RESERVE_CARD', 'reserve'],
    ['INITIATE_RESERVE_DECK', 'reserve_deck'],
    ['RESERVE_DECK', 'reserve_deck'],
    ['CANCEL_RESERVE', 'cancel'],
    ['CANCEL_PRIVILEGE', 'cancel'],
    ['SELECT_ROYAL_CARD', 'royal'],
    ['ACTIVATE_PRIVILEGE', 'privilege'],
    ['USE_PRIVILEGE', 'privilege'],
    ['STEAL_GEM', 'steal'],
    ['TAKE_BONUS_GEM', 'bonus'],
    ['DISCARD_GEM', 'discard'],
    ['DISCARD_RESERVED', 'discard'],
    ['SELECT_BUFF', 'draft_select'],
    ['REROLL_DRAFT_POOL', 'draft_reroll'],
    ['PEEK_DECK', 'peek_modal'],
    ['CLOSE_MODAL', 'peek_modal'],
    ['UNDO', 'replay_undo_redo'],
    ['REDO', 'replay_undo_redo'],
]);

const detailToFamily = (detail) => {
    const normalized = String(detail ?? '').toLowerCase();
    if (normalized.includes('take_bonus_gem')) return 'bonus';
    if (normalized.includes('steal_gem')) return 'steal';
    if (normalized.includes('discard_reserved') || normalized.includes('discard_gem'))
        return 'discard';
    if (normalized.includes('reserve_deck')) return 'reserve_deck';
    if (normalized.includes('reserve_card')) return 'reserve';
    if (normalized.includes('cancel')) return 'cancel';
    if (normalized.includes('select_joker_color')) return 'joker_color';
    if (normalized.includes('buy_card')) return 'buy';
    if (normalized.includes('choose_royal')) return 'royal';
    if (normalized.includes('activate_privilege') || normalized.includes('use_privilege'))
        return 'privilege';
    if (normalized.includes('choose_boon') || normalized.includes('select_buff'))
        return 'draft_select';
    if (normalized.includes('reroll_draft_pool')) return 'draft_reroll';
    if (normalized.includes('peek_deck') || normalized.includes('close_modal')) return 'peek_modal';
    if (normalized.includes('take_gems') || normalized.includes('click_board_cell'))
        return 'take_gems';
    return normalized.replaceAll('-', '_').replace(/\s+/g, '_') || null;
};

const normalizeActionFamily = (family, detail) => {
    const normalized = String(family ?? '')
        .toLowerCase()
        .replaceAll('-', '_')
        .trim();
    switch (normalized) {
        case 'buy_card':
        case 'initiate_buy_joker':
            return 'buy';
        case 'select_royal_card':
            return 'royal';
        case 'initiate_reserve':
        case 'reserve_card':
            return 'reserve';
        case 'initiate_reserve_deck':
        case 'reserve_deck':
            return 'reserve_deck';
        case 'cancel_gem_selection':
        case 'cancel_reserve':
        case 'cancel_privilege':
            return 'cancel';
        case 'select_joker_color':
            return 'joker_color';
        case 'choose_royal':
            return 'royal';
        case 'activate_privilege':
        case 'use_privilege':
            return 'privilege';
        case 'steal_gem':
            return 'steal';
        case 'take_bonus_gem':
            return 'bonus';
        case 'discard_gem':
        case 'discard_reserved':
            return 'discard';
        case 'choose_boon':
        case 'select_buff':
            return 'draft_select';
        case 'reroll_draft_pool':
            return 'draft_reroll';
        case 'peek_deck':
        case 'close_modal':
            return 'peek_modal';
        case 'take_gems':
        case 'click_board_cell':
            return 'take_gems';
        case 'undo':
        case 'redo':
            return 'replay_undo_redo';
        default:
            return detailToFamily(detail) ?? normalized ?? null;
    }
};

const invalidCaseToFamily = (caseId) => {
    const normalized = String(caseId ?? '').toLowerCase();
    if (normalized.includes('select-buff')) return 'draft_select';
    if (normalized.includes('reroll-draft')) return 'draft_reroll';
    if (normalized.includes('take-gems')) return 'take_gems';
    if (normalized.includes('cancel-reserve') || normalized.includes('cancel-privilege'))
        return 'cancel';
    if (normalized.includes('close-modal')) return 'peek_modal';
    if (normalized.includes('joker') || normalized.includes('color')) return 'joker_color';
    if (normalized.includes('buy')) return 'buy';
    if (normalized.includes('reserve-deck')) return 'reserve_deck';
    if (normalized.includes('reserve')) return 'reserve';
    if (normalized.includes('royal')) return 'royal';
    if (normalized.includes('privilege')) return 'privilege';
    if (normalized.includes('steal')) return 'steal';
    if (normalized.includes('bonus')) return 'bonus';
    if (normalized.includes('discard')) return 'discard';
    if (normalized.includes('undo') || normalized.includes('redo')) return 'replay_undo_redo';
    return null;
};

const replayCoverageToRecoveryCase = new Map([
    ['invalid_json', 'invalid_replay_json'],
    ['unsupported_schema', 'unsupported_schema'],
    ['missing_file', 'missing_file'],
    ['corrupted_summary', 'corrupted_summary'],
    ['hash_mismatch', 'hash_mismatch'],
    ['failed_overwrite_load', 'failed_overwrite_load'],
]);

const addSyntheticReleasePathCoverage = (index, sectionName, section, baseEvidence) => {
    if (!section || section.ok !== true) {
        return;
    }

    const evidence = {
        ...baseEvidence,
        section: sectionName,
        replayHash: extractSectionHash(section),
        recordedEvents: extractSectionEvents(section),
    };

    switch (sectionName) {
        case 'replayReleasePath':
            addEvidence(index.entrypoints, 'replay-import-review', evidence);
            for (const coverageId of section.coverage ?? []) {
                addEvidence(index.recoveryCases, replayCoverageToRecoveryCase.get(coverageId), {
                    ...evidence,
                    caseId: coverageId,
                });
            }
            break;
        case 'recoveryReleasePath':
            addEvidence(index.entrypoints, 'recovery', evidence);
            addEvidence(index.recoveryCases, 'restart_after_recovery_save', evidence);
            for (const coverageId of section.coverage ?? []) {
                addEvidence(index.recoveryCases, coverageId, {
                    ...evidence,
                    caseId: coverageId,
                });
            }
            break;
        case 'settingsReleasePath':
            addEvidence(index.entrypoints, 'settings', evidence);
            index.settingsProofs.push(settingsProofFromSection(section, baseEvidence));
            break;
        case 'chromeReleasePath':
            addEvidence(index.entrypoints, 'rulebook', evidence);
            break;
        case 'replayReviewReleasePath':
            addEvidence(index.entrypoints, 'replay-import-review', evidence);
            addFamilyEvidence(index, 'replay_undo_redo', 'legal', evidence);
            break;
        case 'peekModalReleasePath':
            addFamilyEvidence(index, 'peek_modal', 'legal', evidence);
            addFamilyEvidence(index, 'draft_select', 'legal', evidence);
            addPhaseEdgeEvidence(index, 'modal', 'review', evidence);
            break;
        case 'privilegeCancelReleasePath':
            addFamilyEvidence(index, 'privilege', 'legal', evidence);
            addFamilyEvidence(index, 'cancel', 'legal', evidence);
            addPhaseEdgeEvidence(index, 'IDLE', 'PRIVILEGE_ACTION', evidence);
            addPhaseEdgeEvidence(index, 'PRIVILEGE_ACTION', 'IDLE', evidence);
            break;
        case 'reservedDiscardReleasePath':
            addFamilyEvidence(index, 'reserve', 'legal', evidence);
            addFamilyEvidence(index, 'discard', 'legal', evidence);
            addPhaseEdgeEvidence(index, 'IDLE', 'RESERVE_WAITING_GEM', evidence);
            addPhaseEdgeEvidence(index, 'RESERVE_WAITING_GEM', 'IDLE', evidence);
            break;
        case 'reservedBuyReleasePath':
            addFamilyEvidence(index, 'reserve', 'legal', evidence);
            addFamilyEvidence(index, 'buy', 'legal', evidence);
            break;
        case 'reserveCancelReleasePath':
            addFamilyEvidence(index, 'reserve', 'legal', evidence);
            addFamilyEvidence(index, 'cancel', 'legal', evidence);
            addPhaseEdgeEvidence(index, 'IDLE', 'RESERVE_WAITING_GEM', evidence);
            addPhaseEdgeEvidence(index, 'RESERVE_WAITING_GEM', 'IDLE', evidence);
            break;
        case 'reserveDeckReleasePath':
            addFamilyEvidence(index, 'reserve_deck', 'legal', evidence);
            addPhaseEdgeEvidence(index, 'IDLE', 'RESERVE_WAITING_GEM', evidence);
            addPhaseEdgeEvidence(index, 'RESERVE_WAITING_GEM', 'IDLE', evidence);
            break;
        case 'reserveDeckCancelReleasePath':
            addFamilyEvidence(index, 'reserve_deck', 'legal', evidence);
            addFamilyEvidence(index, 'cancel', 'legal', evidence);
            addPhaseEdgeEvidence(index, 'IDLE', 'RESERVE_WAITING_GEM', evidence);
            addPhaseEdgeEvidence(index, 'RESERVE_WAITING_GEM', 'IDLE', evidence);
            break;
        case 'jokerReleasePath':
            addFamilyEvidence(index, 'buy', 'legal', evidence);
            addFamilyEvidence(index, 'joker_color', 'legal', evidence);
            addPhaseEdgeEvidence(index, 'IDLE', 'SELECT_CARD_COLOR', evidence);
            addPhaseEdgeEvidence(index, 'SELECT_CARD_COLOR', 'IDLE', evidence);
            break;
        default:
            break;
    }
};

const addPhaseEdgeEvidence = (index, from, to, evidence) => {
    if (!from || !to || from === to) {
        return;
    }

    addEvidence(index.phaseEdges, `${from}->${to}`, evidence);
    if (from === 'SELECT_ROYAL' && to === 'IDLE') {
        addEvidence(index.phaseEdges, 'SELECT_ROYAL->same-player-extra-turn', evidence);
    }
    if (to === 'GAME_OVER') {
        addEvidence(index.phaseEdges, 'IDLE->GAME_OVER', evidence);
    }
};

const extractSectionHash = (section) =>
    section?.replayHashSummary?.controllerCurrentStateHash ??
    section?.replayHashSummary?.exportedSummaryFinalStateHash ??
    section?.replayReview?.reviewedFinalStateHash ??
    section?.reviewNavigationSummary?.finalReviewHash ??
    section?.productStateHash ??
    section?.controllerCurrentStateHash ??
    section?.recoverySummary?.continuedStateHash ??
    section?.settingsSummary?.gameStateHashAfter ??
    null;

const extractSectionEvents = (section) =>
    section?.replayHashSummary?.exportedEvents ??
    section?.reviewNavigationSummary?.exportedEvents ??
    section?.recoverySummary?.continuedRecordedEvents ??
    null;

const settingsProofFromSection = (section, baseEvidence) => {
    const coverageParams = section?.settingsSummary?.coverageParams ?? {};
    const settings =
        section?.settingsSummary?.reloadedSettings ??
        section?.settingsSummary?.savedSettings ??
        section?.settingsSummary?.persistedSettings ??
        section?.settings ??
        {};
    const lanCards = settings.lanShowOpponentPlayerZoneCards;
    const lanGems = settings.lanShowOpponentGems;
    const visibility =
        lanCards === false && lanGems === false
            ? 'lan-hidden'
            : lanCards === true
              ? 'lan-cards-visible'
              : lanGems === true
                ? 'lan-gems-visible'
                : null;
    const audio =
        settings.soundEnabled === false
            ? 'sound-off'
            : settings.soundEnabled === true
              ? 'sound-on'
              : null;

    return {
        ...baseEvidence,
        section: 'settingsReleasePath',
        params: {
            audio: coverageParams.audio ?? audio,
            fresh_launch: coverageParams.fresh_launch ?? 'restart',
            game_mode: coverageParams.game_mode ?? 'classic-local-pvp',
            input: coverageParams.input ?? 'mouse-click',
            locale: coverageParams.locale ?? settings.locale ?? null,
            recovery_setting:
                coverageParams.recovery_setting ??
                (section?.recoverySummary ? 'autosave-on' : null),
            replay_setting: coverageParams.replay_setting ?? 'review-navigation-on',
            surface_theme: coverageParams.surface_theme ?? settings.surfaceTheme ?? null,
            visibility: coverageParams.visibility ?? visibility,
        },
        replayHash: extractSectionHash(section),
    };
};

const isFullGameSuiteReport = (report) =>
    report?.kind === 'local-pvp-built-player-full-game-suite-report' ||
    report?.builtPlayer?.suite?.kind === 'unity-localdev-full-game-plan-suite';

const isRulesRuntimePackageReport = (report) =>
    report?.kind === 'unity-rules-runtime-package-report' ||
    report?.releaseRuntimeRulesPackaging?.packagedRuntimeMode === 'packaged-node-esm';

const collectRulesRuntimePackageEvidence = (index, reportPath, report) => {
    const source = toRepoPath(reportPath);
    const status = report?.releaseRuntimeRulesPackaging?.status ?? 'missing';
    const evidence = {
        source,
        ok: report?.ok === true && status === 'covered',
        kind: report?.kind ?? null,
        generatedAt: report?.generatedAt ?? null,
        runtimeDir: report?.runtimeDir ?? null,
        manifestPath: report?.manifestPath ?? null,
        bridgeBundlePath: report?.bridgeBundlePath ?? null,
        packagedFileCount: report?.packagedFiles?.length ?? 0,
        smokeStateHash: report?.smoke?.stateHash ?? null,
        smokeActionType: report?.smoke?.actionType ?? null,
        requiresRepositoryRoot: report?.releaseRuntimeRulesPackaging?.requiresRepositoryRoot,
        requiresPnpm: report?.releaseRuntimeRulesPackaging?.requiresPnpm,
        requiresViteNode: report?.releaseRuntimeRulesPackaging?.requiresViteNode,
        status,
    };
    index.sourceReports.push({
        ...evidence,
        exitCode: report?.smoke?.exitCode ?? null,
        timedOut: false,
        smokeOk: report?.smoke?.responseOk === true,
        productSmokeOk: false,
        failureReason: evidence.ok ? null : `release runtime package status=${status}`,
    });
    if (evidence.ok) {
        index.releaseRuntimePackages.push(evidence);
    }
};

const fullGameRecordFamilies = (record) => {
    const families = new Set();
    const normalized = normalizeActionFamily(record?.actionFamily, record?.action);
    if (normalized && normalized !== 'init' && normalized !== 'replenish') {
        families.add(normalized);
    }
    if (record?.action === 'select_joker_color') {
        families.add('joker_color');
    }
    return [...families];
};

const collectFullGameSuiteEvidence = (index, reportPath, report) => {
    const suite = report?.builtPlayer?.suite ?? {};
    const source = toRepoPath(reportPath);
    const baseEvidence = {
        source,
        seed: report?.seedPrefix ?? null,
        startedAt: report?.generatedAt ?? null,
        completedAt: report?.generatedAt ?? null,
    };
    index.sourceReports.push({
        ...baseEvidence,
        ok: report?.ok === true && suite?.ok === true,
        kind: report?.kind ?? suite?.kind ?? null,
        exitCode: null,
        timedOut: false,
        smokeOk: suite?.ok === true,
        productSmokeOk: suite?.ok === true,
        failureReason: report?.failureReason ?? suite?.firstFailure?.failureReason ?? null,
    });

    if (report?.ok !== true || suite?.ok !== true) {
        return;
    }

    if (
        report?.rulesRuntimeMode === 'packaged' ||
        suite?.controls?.rulesRuntimeMode === 'packaged'
    ) {
        index.releaseRuntimePackages.push({
            ...baseEvidence,
            section: 'localPvpFullGameSuite',
            status: 'covered',
            runtimeMode: 'packaged',
            detail: '100-game built-player suite executed through packaged rules runtime',
            suiteTraceHash: suite?.suiteTraceHash ?? null,
        });
    }

    const suiteEvidence = {
        ...baseEvidence,
        section: 'localPvpFullGameSuite',
        replayHash: suite?.suiteTraceHash ?? null,
        recordedEvents: null,
    };
    addEvidence(index.entrypoints, 'classic-local-pvp', suiteEvidence);

    const firstActionBudgetMs = 500;
    const replenishBudgetMs = 350;

    for (const match of suite.matches ?? []) {
        if (match?.ok !== true) {
            continue;
        }

        const matchEvidence = {
            ...baseEvidence,
            seed: match.seed ?? baseEvidence.seed,
            section: 'localPvpFullGameMatch',
            replayHash: match.finalState?.replayHash ?? match.finalState?.stateHash ?? null,
            recordedEvents: match.finalState?.recordedEvents ?? null,
        };
        addEvidence(index.entrypoints, 'classic-local-pvp', matchEvidence);
        if (match.replayExport?.ok === true && match.replayReview?.ok === true) {
            addEvidence(index.entrypoints, 'replay-import-review', {
                ...matchEvidence,
                section: 'localPvpFullGameReplayReview',
                replayHash:
                    match.replayReview?.reviewedFinalStateHash ??
                    match.replayExport?.exportedSummaryFinalStateHash ??
                    matchEvidence.replayHash,
                recordedEvents: match.replayExport?.exportedEvents ?? matchEvidence.recordedEvents,
            });
        }

        let firstProductActionRecorded = false;
        for (const record of match.records ?? []) {
            if (record?.covered !== true || record?.ok !== true) {
                continue;
            }

            const evidence = {
                ...matchEvidence,
                detail: record.action ?? record.actionFamily ?? null,
                durationMs: record.durationMs ?? null,
                phaseBefore: record.phase?.before ?? null,
                phaseAfter: record.phase?.after ?? null,
                rect: record.targetGeometry?.rect ?? null,
                replayHash:
                    record.replayHashAfter ?? record.stateHashAfter ?? matchEvidence.replayHash,
                recordedEvents:
                    record.replayEventCountAfter ??
                    record.recordedEvents ??
                    matchEvidence.recordedEvents,
            };
            const legality =
                record.legality?.actualLegal === false || record.legality?.expectedLegal === false
                    ? 'illegal'
                    : 'legal';
            for (const family of fullGameRecordFamilies(record)) {
                addFamilyEvidence(index, family, legality, evidence);
            }
            addPhaseEdgeEvidence(index, record.phase?.before, record.phase?.after, evidence);
            if (record.winner?.before == null && record.winner?.after) {
                addPhaseEdgeEvidence(index, 'IDLE', 'GAME_OVER', {
                    ...evidence,
                    detail: 'winner transition',
                });
            }

            if (
                !firstProductActionRecorded &&
                record.actionFamily !== 'INIT' &&
                Number.isFinite(record.durationMs) &&
                record.durationMs <= firstActionBudgetMs
            ) {
                firstProductActionRecorded = true;
                addVisualContractEvidence(index, 'first_action_latency', {
                    ...evidence,
                    detail: 'first full-game action latency',
                    budgetMs: firstActionBudgetMs,
                });
            }

            if (
                record.actionFamily === 'REPLENISH' &&
                Number.isFinite(record.durationMs) &&
                record.durationMs <= replenishBudgetMs
            ) {
                addVisualContractEvidence(index, 'replenish_latency', {
                    ...evidence,
                    detail: 'full-game replenish latency',
                    budgetMs: replenishBudgetMs,
                });
            }

            if (record.action === 'resolve_pending_reserve_gold') {
                addVisualContractEvidence(index, 'reserve_gold_prompt', {
                    ...evidence,
                    detail: 'full-game reserve Gold prompt target',
                });
            }

            const rect = record.targetGeometry?.rect;
            if (
                record.targetGeometry?.kind === 'ReservedCard' &&
                rect &&
                rect.width <= 120 &&
                rect.height <= 160
            ) {
                addVisualContractEvidence(index, 'reserved_card_mini_stack', {
                    ...evidence,
                    detail: 'full-game reserved mini-stack target',
                });
            }
        }
    }
};

const collectEvidence = (launcherReports) => {
    const index = createEvidenceIndex();
    for (const reportPath of launcherReports) {
        let launcher;
        try {
            launcher = readJsonFile(reportPath);
        } catch (error) {
            index.sourceReports.push({
                path: toRepoPath(reportPath),
                ok: false,
                failureReason: error instanceof Error ? error.message : String(error),
            });
            continue;
        }

        if (isFullGameSuiteReport(launcher)) {
            collectFullGameSuiteEvidence(index, reportPath, launcher);
            continue;
        }

        if (isRulesRuntimePackageReport(launcher)) {
            collectRulesRuntimePackageEvidence(index, reportPath, launcher);
            continue;
        }

        const wrapper = launcher?.smoke ?? {};
        const smoke = wrapper?.smoke ?? {};
        const baseEvidence = {
            source: toRepoPath(reportPath),
            seed: wrapper?.seed ?? smoke?.seed ?? null,
            startedAt: launcher?.startedAt ?? wrapper?.startedAt ?? smoke?.startedAt ?? null,
            completedAt:
                launcher?.completedAt ?? wrapper?.completedAt ?? smoke?.completedAt ?? null,
        };
        const sourceSummary = {
            ...baseEvidence,
            ok: launcher?.ok === true,
            kind: launcher?.kind ?? null,
            exitCode: launcher?.exitCode ?? null,
            timedOut: launcher?.timedOut ?? null,
            smokeOk: wrapper?.ok === true,
            productSmokeOk: smoke?.ok === true,
            failureReason:
                launcher?.failureReason ?? wrapper?.failureReason ?? smoke?.failureReason ?? null,
        };
        index.sourceReports.push(sourceSummary);

        if (launcher?.ok !== true || wrapper?.ok !== true) {
            continue;
        }

        if (
            launcher?.environment?.rulesRuntimeMode === 'packaged' &&
            launcher?.rulesRuntimeManifest?.launchContract?.requiresPnpm === false &&
            launcher?.rulesRuntimeManifest?.launchContract?.requiresViteNode === false
        ) {
            index.releaseRuntimePackages.push({
                ...baseEvidence,
                section: 'builtPlayerLauncher',
                status: 'covered',
                runtimeMode: 'packaged',
                runtimeDir: launcher.environment.rulesRuntimeDir ?? null,
                manifestKind: launcher.rulesRuntimeManifest.kind ?? null,
            });
        }

        const productEvidence = {
            ...baseEvidence,
            section: 'productSmoke',
            replayHash: smoke?.productStateSummary?.stateHash ?? null,
            recordedEvents: smoke?.productStateSummary?.recordedEvents ?? null,
        };
        if (smoke?.ok === true && smoke?.freshLaunch === true) {
            if (smoke.startMode === 'roguelike') {
                addEvidence(index.entrypoints, 'roguelike-local-pvp', productEvidence);
            } else {
                addEvidence(index.entrypoints, 'classic-local-pvp', productEvidence);
            }

            for (const action of smoke.actions ?? []) {
                const family = normalizeActionFamily(action.family, action.detail);
                addFamilyEvidence(index, family, 'legal', {
                    ...productEvidence,
                    detail: action.detail ?? null,
                    phaseBefore: action.phaseBefore ?? null,
                    phaseAfter: action.phaseAfter ?? null,
                    replayHash: action.stateHash ?? productEvidence.replayHash,
                    recordedEvents: action.recordedEvents ?? productEvidence.recordedEvents,
                    durationMs: action.durationMs ?? null,
                });
                addPhaseEdgeEvidence(index, action.phaseBefore, action.phaseAfter, {
                    ...productEvidence,
                    detail: action.detail ?? null,
                    replayHash: action.stateHash ?? productEvidence.replayHash,
                });
            }

            if (smoke.performanceSummary?.ok === true) {
                addVisualContractEvidence(index, 'first_action_latency', {
                    ...productEvidence,
                    detail: 'first action latency',
                    durationMs: smoke.performanceSummary.firstActionDurationMs ?? null,
                    budgetMs: smoke.performanceSummary.firstActionBudgetMs ?? null,
                });
                if (smoke.performanceSummary.replenishMaxDurationMs != null) {
                    addVisualContractEvidence(index, 'replenish_latency', {
                        ...productEvidence,
                        detail: 'replenish latency',
                        durationMs: smoke.performanceSummary.replenishMaxDurationMs,
                        budgetMs: smoke.performanceSummary.replenishBudgetMs ?? null,
                    });
                }
            }
        }

        for (const event of launcher.bridgeMailboxEvents ?? []) {
            index.oracleEvents.push({
                source: toRepoPath(reportPath),
                actionType: event.responseActionType ?? null,
                auditResponseSha256: event.auditResponseSha256 ?? null,
                rejectionCode: event.rejectionCode ?? null,
                responseOk: event.responseOk === true,
            });
            if (event?.responseOk === false) {
                addFamilyEvidence(
                    index,
                    actionTypeToFamily.get(event.responseActionType),
                    'illegal',
                    {
                        ...baseEvidence,
                        section: 'bridgeMailbox',
                        actionType: event.responseActionType ?? null,
                        rejectionCode: event.rejectionCode ?? null,
                    }
                );
            }
        }

        const invalidSections = [
            ['invalidActionReleasePath', wrapper?.invalidActionReleasePath],
            ['recoveryInvalidActionReleasePath', wrapper?.recoveryInvalidActionReleasePath],
        ];
        for (const [sectionName, section] of invalidSections) {
            if (section?.ok !== true) {
                continue;
            }
            for (const invalidCase of section.cases ?? []) {
                const family = invalidCaseToFamily(invalidCase.id);
                addFamilyEvidence(index, family, 'illegal', {
                    ...baseEvidence,
                    section: sectionName,
                    caseId: invalidCase.id ?? null,
                    replayHash:
                        invalidCase.stateHashAfter ?? invalidCase.replayStateHashAfter ?? null,
                    stateUnchanged:
                        invalidCase.stateHashBefore === invalidCase.stateHashAfter ||
                        invalidCase.recoveryStateHashBefore === invalidCase.recoveryStateHashAfter,
                    replayUnpolluted:
                        invalidCase.recordedEventsBefore === invalidCase.recordedEventsAfter ||
                        invalidCase.replayRecordedEventsBefore ===
                            invalidCase.replayRecordedEventsAfter,
                });
            }
            if (sectionName === 'recoveryInvalidActionReleasePath') {
                addEvidence(index.entrypoints, 'recovery', {
                    ...baseEvidence,
                    section: sectionName,
                    replayHash: section?.recoverySummary?.continuedStateHash ?? null,
                });
            }
        }

        for (const sectionName of [
            'replayReleasePath',
            'recoveryReleasePath',
            'settingsReleasePath',
            'chromeReleasePath',
            'replayReviewReleasePath',
            'peekModalReleasePath',
            'privilegeCancelReleasePath',
            'reservedDiscardReleasePath',
            'reservedBuyReleasePath',
            'reserveCancelReleasePath',
            'reserveDeckReleasePath',
            'reserveDeckCancelReleasePath',
            'jokerReleasePath',
        ]) {
            addSyntheticReleasePathCoverage(
                index,
                sectionName,
                wrapper?.[sectionName],
                baseEvidence
            );
        }

        collectVisualContracts(index, wrapper, baseEvidence);
    }

    return index;
};

const collectVisualContracts = (index, wrapper, baseEvidence) => {
    const settingsSection = wrapper?.settingsReleasePath;
    if (
        settingsSection?.ok === true &&
        settingsSection.visualContractSummary?.settingsMenu?.ok === true
    ) {
        addVisualContractEvidence(index, 'settings_menu_electron_pixel_parity', {
            ...baseEvidence,
            section: 'settingsReleasePath',
            detail: 'settings menu Electron pixel contract',
            visualContract: settingsSection.visualContractSummary.settingsMenu,
        });
    }

    for (const [sectionName, section] of [
        ['reserveCancelReleasePath', wrapper?.reserveCancelReleasePath],
        ['reserveDeckReleasePath', wrapper?.reserveDeckReleasePath],
        ['reserveDeckCancelReleasePath', wrapper?.reserveDeckCancelReleasePath],
    ]) {
        const summary =
            section?.reserveCancelSummary ??
            section?.reserveDeckSummary ??
            section?.reserveDeckCancelSummary ??
            {};
        if (
            section?.ok === true &&
            (summary.goldPromptVisibleBeforeCancel === true ||
                summary.goldPromptVisibleBeforeReserve === true)
        ) {
            addVisualContractEvidence(index, 'reserve_gold_prompt', {
                ...baseEvidence,
                section: sectionName,
                detail: 'reserve gold prompt visible',
                replayHash: extractSectionHash(section),
            });
        }
    }

    for (const [sectionName, section] of [
        ['reservedBuyReleasePath', wrapper?.reservedBuyReleasePath],
        ['reserveDeckReleasePath', wrapper?.reserveDeckReleasePath],
    ]) {
        const summary = section?.reservedBuySummary ?? section?.reserveDeckSummary ?? {};
        if (
            section?.ok === true &&
            (summary.reservedCardVisualRectBeforeBuy ||
                summary.reservedCardVisualRectAfterReserve ||
                summary.reservedCardVisualRect)
        ) {
            addVisualContractEvidence(index, 'reserved_card_mini_stack', {
                ...baseEvidence,
                section: sectionName,
                detail: 'reserved card mini stack bounds',
                replayHash: extractSectionHash(section),
                rect:
                    summary.reservedCardVisualRectBeforeBuy ??
                    summary.reservedCardVisualRectAfterReserve ??
                    summary.reservedCardVisualRect,
            });
        }
    }
};

const buildSettingsTuples = (model) => {
    const parameters = new Map(
        (model.settings?.parameters ?? []).map((entry) => [entry.id, entry.values ?? []])
    );
    const requiredTuples = [];
    for (const set of model.settings?.combinationSets ?? []) {
        const parameterIds = set.parameters ?? [];
        const parameterSubsets = choose(parameterIds, set.strength ?? 2);
        for (const subset of parameterSubsets) {
            const valueProducts = product(subset.map((paramId) => parameters.get(paramId) ?? []));
            for (const values of valueProducts) {
                const params = Object.fromEntries(
                    subset.map((paramId, index) => [paramId, values[index]])
                );
                requiredTuples.push({
                    id: tupleId(set.id, params),
                    setId: set.id,
                    strength: set.strength ?? 2,
                    params,
                    required: set.required !== false,
                });
            }
        }
    }

    return requiredTuples;
};

const choose = (values, count) => {
    if (count <= 0) return [[]];
    if (values.length < count) return [];
    if (count === 1) return values.map((value) => [value]);
    const result = [];
    for (let index = 0; index <= values.length - count; index += 1) {
        for (const tail of choose(values.slice(index + 1), count - 1)) {
            result.push([values[index], ...tail]);
        }
    }
    return result;
};

const product = (dimensions) => {
    if (dimensions.length === 0) {
        return [[]];
    }

    const [head, ...tail] = dimensions;
    return head.flatMap((value) => product(tail).map((values) => [value, ...values]));
};

const tupleId = (setId, params) =>
    `${setId}:${Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('|')}`;

const buildCoverageReport = (model, modelPath, launcherReports, runAttempts, artifactLinks) => {
    const index = collectEvidence(launcherReports);
    const failures = [];

    const entrypoints = (model.entrypoints ?? []).map((entrypoint) => {
        const evidence = index.entrypoints.get(entrypoint.id) ?? [];
        const covered = evidence.length > 0;
        const approvedExclusion = entrypoint.userApprovedExclusion === true;
        const blocked =
            entrypoint.required === true &&
            !covered &&
            entrypoint.implementationStatus === 'not-implemented' &&
            !approvedExclusion;
        const status = covered
            ? 'covered'
            : approvedExclusion
              ? 'skipped'
              : blocked
                ? 'blocked'
                : entrypoint.required
                  ? 'missing'
                  : 'skipped';
        if (entrypoint.required && status !== 'covered' && status !== 'skipped') {
            failures.push(`${entrypoint.id}: ${status}`);
        }
        return {
            id: entrypoint.id,
            label: entrypoint.label,
            required: entrypoint.required === true && !approvedExclusion,
            implementationStatus: entrypoint.implementationStatus,
            userApprovedExclusion: approvedExclusion,
            status,
            evidenceCount: evidence.length,
            evidence: trimEvidence(evidence),
        };
    });

    const actionFamilies = (model.actionFamilies ?? []).map((family) => {
        const evidence = index.actionFamilies.get(family.id) ?? { legal: [], illegal: [] };
        const legalCovered = family.legalEvidenceRequired !== true || evidence.legal.length > 0;
        const illegalCovered =
            family.illegalEvidenceRequired !== true || evidence.illegal.length > 0;
        const covered = legalCovered && illegalCovered;
        if (family.required && !covered) {
            failures.push(
                `${family.id}: missing ${[
                    legalCovered ? null : 'legal',
                    illegalCovered ? null : 'illegal',
                ]
                    .filter(Boolean)
                    .join('+')} evidence`
            );
        }
        return {
            id: family.id,
            label: family.label,
            required: family.required === true,
            status: covered ? 'covered' : 'missing',
            legalEvidenceCount: evidence.legal.length,
            illegalEvidenceCount: evidence.illegal.length,
            legalEvidence: trimEvidence(evidence.legal),
            illegalEvidence: trimEvidence(evidence.illegal),
        };
    });

    const phaseEdges = (model.phaseEdges ?? []).map((edge) => {
        const evidence = index.phaseEdges.get(edge.id) ?? [];
        const covered = evidence.length > 0;
        const required = edge.required === true;
        if (required && !covered) {
            failures.push(`${edge.id}: missing phase-edge evidence`);
        }
        return {
            id: edge.id,
            from: edge.from,
            to: edge.to,
            required,
            status: covered ? 'covered' : required ? 'missing' : 'skipped',
            reachability: edge.reachability ?? null,
            exclusionReason: edge.exclusionReason ?? null,
            evidenceCount: evidence.length,
            evidence: trimEvidence(evidence),
        };
    });

    const recoveryCases = (model.recoveryCases ?? []).map((recoveryCase) => {
        const evidence = index.recoveryCases.get(recoveryCase.id) ?? [];
        const covered = evidence.length > 0;
        if (recoveryCase.required && !covered) {
            failures.push(`${recoveryCase.id}: missing recovery evidence`);
        }
        return {
            id: recoveryCase.id,
            required: recoveryCase.required === true,
            status: covered ? 'covered' : 'missing',
            evidenceCount: evidence.length,
            evidence: trimEvidence(evidence),
        };
    });

    const settingsTuples = buildSettingsTuples(model);
    const settingsCombinations = settingsTuples.map((tuple) => {
        const evidence = index.settingsProofs.filter((proof) =>
            Object.entries(tuple.params).every(([key, value]) => proof.params?.[key] === value)
        );
        const covered = evidence.length > 0;
        if (tuple.required && !covered) {
            failures.push(`${tuple.id}: missing settings combination evidence`);
        }
        return {
            id: tuple.id,
            setId: tuple.setId,
            strength: tuple.strength,
            params: tuple.params,
            required: tuple.required,
            status: covered ? 'covered' : 'missing',
            evidenceCount: evidence.length,
            evidence: trimEvidence(evidence),
        };
    });

    const visualContracts = (model.visualContracts ?? []).map((contract) => {
        const evidence = index.visualContracts.get(contract.id) ?? [];
        const covered = evidence.length > 0;
        if (contract.required && !covered) {
            failures.push(`${contract.id}: missing visual/latency contract evidence`);
        }
        return {
            id: contract.id,
            label: contract.label,
            required: contract.required === true,
            status: covered ? 'covered' : 'missing',
            evidenceCount: evidence.length,
            evidence: trimEvidence(evidence),
        };
    });

    const releasePackageEvidence = index.releaseRuntimePackages;
    const hasRuntimePackageReport = releasePackageEvidence.some(
        (entry) =>
            entry.kind === 'unity-rules-runtime-package-report' ||
            entry.section === 'rulesRuntimePackage'
    );
    const hasPackagedBuiltPlayerEvidence = releasePackageEvidence.some(
        (entry) =>
            entry.section === 'builtPlayerLauncher' || entry.section === 'localPvpFullGameSuite'
    );
    const releasePackagingCovered = hasRuntimePackageReport && hasPackagedBuiltPlayerEvidence;
    const releasePackaging = {
        required: model.releaseRuntimeRulesPackaging?.required === true,
        status:
            model.releaseRuntimeRulesPackaging?.required === true
                ? releasePackagingCovered
                    ? 'covered'
                    : (model.releaseRuntimeRulesPackaging.status ?? 'blocked')
                : 'not-required',
        reason: releasePackagingCovered
            ? null
            : (model.releaseRuntimeRulesPackaging?.blockedReason ?? null),
        evidenceCount: releasePackageEvidence.length,
        evidence: trimEvidence(releasePackageEvidence),
        packageReportCovered: hasRuntimePackageReport,
        packagedBuiltPlayerCovered: hasPackagedBuiltPlayerEvidence,
    };
    if (releasePackaging.required && releasePackaging.status !== 'covered') {
        failures.push(`releaseRuntimeRulesPackaging: ${releasePackaging.status}`);
    }

    const blocked = [
        ...entrypoints.filter((entry) => entry.status === 'blocked'),
        releasePackaging.required && releasePackaging.status !== 'covered'
            ? releasePackaging
            : null,
    ].filter(Boolean);
    const missing = failures.length;
    const verdict = missing === 0 ? 'Complete' : blocked.length > 0 ? 'Blocked' : 'Incomplete';
    const oracleEvidence = {
        eventCount: index.oracleEvents.length,
        acceptedCount: index.oracleEvents.filter((event) => event.responseOk === true).length,
        rejectedCount: index.oracleEvents.filter((event) => event.responseOk === false).length,
        digestCount: index.oracleEvents.filter((event) => event.auditResponseSha256).length,
        actionTypes: uniqueSorted(index.oracleEvents.map((event) => event.actionType)),
    };
    const sourceReports = index.sourceReports;
    const summary = {
        sourceReportCount: sourceReports.length,
        passingSourceReportCount: sourceReports.filter((report) => report.ok === true).length,
        runAttemptCount: runAttempts.length,
        coveredEntrypoints: entrypoints.filter((entry) => entry.status === 'covered').length,
        requiredEntrypoints: entrypoints.filter((entry) => entry.required).length,
        coveredActionFamilies: actionFamilies.filter((entry) => entry.status === 'covered').length,
        requiredActionFamilies: actionFamilies.filter((entry) => entry.required).length,
        coveredPhaseEdges: phaseEdges.filter((entry) => entry.status === 'covered').length,
        requiredPhaseEdges: phaseEdges.filter((entry) => entry.required).length,
        coveredRecoveryCases: recoveryCases.filter((entry) => entry.status === 'covered').length,
        requiredRecoveryCases: recoveryCases.filter((entry) => entry.required).length,
        coveredSettingsTuples: settingsCombinations.filter((entry) => entry.status === 'covered')
            .length,
        requiredSettingsTuples: settingsCombinations.filter((entry) => entry.required).length,
        coveredVisualContracts: visualContracts.filter((entry) => entry.status === 'covered')
            .length,
        requiredVisualContracts: visualContracts.filter((entry) => entry.required).length,
        oracleEventCount: oracleEvidence.eventCount,
        oracleRejectedCount: oracleEvidence.rejectedCount,
        failureCount: failures.length,
    };
    const coverage = {
        entrypoints,
        actionFamilies,
        phaseEdges,
        recoveryCases,
        settingsCombinations,
        visualContracts,
        releaseRuntimeRulesPackaging: releasePackaging,
    };
    const completionAudit = buildCompletionAudit({
        artifactLinks,
        coverage,
        failures,
        model,
        modelPath,
        oracleEvidence,
        runAttempts,
        sourceReports,
        summary,
        verdict,
    });

    return {
        schemaVersion: 1,
        kind: 'unity-product-surface-coverage-report',
        generatedAt: new Date().toISOString(),
        model: {
            path: toRepoPath(modelPath),
            kind: model.kind,
            schemaVersion: model.schemaVersion,
            updatedAt: model.updatedAt,
        },
        verdict,
        coverageMode:
            verdict === 'Complete'
                ? 'complete product-surface coverage'
                : (model.completionPolicy?.boundedRepresentativeLabel ??
                  'bounded representative coverage'),
        summary,
        coverage,
        oracleEvidence,
        completionAudit,
        sourceReports,
        runAttempts,
        failures,
        artifactLinks,
    };
};

const statusFromCounts = (covered, required, blocked = false) => {
    if (blocked) return 'blocked';
    if (required === 0) return 'not-required';
    if (covered === required) return 'covered';
    if (covered > 0) return 'partial';
    return 'missing';
};

const completionItem = (id, requirement, status, evidence, gap = null) => ({
    id,
    requirement,
    status,
    evidence: evidence.filter(Boolean),
    gap,
});

const buildCompletionAudit = ({
    artifactLinks,
    coverage,
    failures,
    model,
    modelPath,
    oracleEvidence,
    runAttempts,
    sourceReports,
    summary,
    verdict,
}) => {
    const blockedEntrypoints = coverage.entrypoints
        .filter((entry) => entry.status === 'blocked')
        .map((entry) => entry.id);
    const approvedExcludedEntrypoints = coverage.entrypoints
        .filter((entry) => entry.userApprovedExclusion === true && entry.status === 'skipped')
        .map((entry) => entry.id);
    const missingActionFamilies = coverage.actionFamilies
        .filter((family) => family.required && family.status !== 'covered')
        .map(
            (family) =>
                `${family.id}(legal=${family.legalEvidenceCount},illegal=${family.illegalEvidenceCount})`
        );
    const missingPhaseEdges = coverage.phaseEdges
        .filter((edge) => edge.required && edge.status !== 'covered')
        .map((edge) => edge.id);
    const missingRecoveryCases = coverage.recoveryCases
        .filter((recoveryCase) => recoveryCase.required && recoveryCase.status !== 'covered')
        .map((recoveryCase) => recoveryCase.id);
    const missingSettingsTuples = coverage.settingsCombinations
        .filter((tuple) => tuple.required && tuple.status !== 'covered')
        .map((tuple) => tuple.id);
    const missingVisualContracts = coverage.visualContracts
        .filter((contract) => contract.required && contract.status !== 'covered')
        .map((contract) => contract.id);
    const passingRunAttempts = runAttempts.filter((attempt) => attempt.ok === true).length;
    const failedRunAttempts = runAttempts.filter((attempt) => attempt.ok !== true).length;
    const historicalFailedSourceReports = Math.max(
        0,
        summary.sourceReportCount - summary.passingSourceReportCount
    );
    const builtPlayerHarnessStatus =
        runAttempts.length > 0
            ? failedRunAttempts > 0
                ? 'partial'
                : 'covered'
            : summary.sourceReportCount > 0
              ? summary.passingSourceReportCount > 0
                  ? 'covered'
                  : 'missing'
              : 'missing';
    const builtPlayerHarnessGap =
        runAttempts.length > 0
            ? failedRunAttempts > 0
                ? 'At least one fresh built-player scenario failed.'
                : null
            : summary.sourceReportCount > 0 && summary.passingSourceReportCount === 0
              ? 'No retained passing built-player scenario exists.'
              : null;
    const releasePackagingCovered =
        coverage.releaseRuntimeRulesPackaging.required !== true ||
        coverage.releaseRuntimeRulesPackaging.status === 'covered';

    const promptToArtifactChecklist = [
        completionItem(
            '1.freeze-product-scope',
            'Freeze declared product entries, command families, phases, recovery categories, and settings parameters in unity-product-surface-coverage-model.json.',
            'covered',
            [
                toRepoPath(modelPath),
                `entrypoints=${model.entrypoints?.length ?? 0}`,
                `actionFamilies=${model.actionFamilies?.length ?? 0}`,
                `phases=${model.phases?.length ?? 0}`,
                `phaseEdges=${model.phaseEdges?.length ?? 0}`,
                `recoveryCases=${model.recoveryCases?.length ?? 0}`,
                `settingsCombinationSets=${model.settings?.combinationSets?.length ?? 0}`,
            ]
        ),
        completionItem(
            '2.built-player-harness',
            'Run product-surface evidence against the built Windows player from fresh launch and retain launcher reports.',
            builtPlayerHarnessStatus,
            [
                'tools/migration/run-unity-product-surface-coverage.mjs',
                'tools/migration/run-unity-built-player-smoke.mjs',
                `sourceReports=${summary.sourceReportCount}`,
                `passingSourceReports=${summary.passingSourceReportCount}`,
                `historicalFailedSourceReports=${historicalFailedSourceReports}`,
                `runAttempts=${summary.runAttemptCount}`,
                `passingRunAttempts=${passingRunAttempts}`,
                `failedRunAttempts=${failedRunAttempts}`,
            ],
            builtPlayerHarnessGap
        ),
        completionItem(
            '3.model-driven-exploration',
            'Use model/phase-driven exploration instead of treating a fixed seed list as the coverage claim.',
            model.deterministicExploration && model.automationScenarios?.length > 0
                ? 'covered'
                : 'missing',
            [
                'tools/migration/unity-product-surface-coverage-model.json#deterministicExploration',
                `automationScenarios=${model.automationScenarios?.length ?? 0}`,
                model.deterministicExploration?.strategy,
            ]
        ),
        completionItem(
            '4.phase-edge-coverage',
            'Each required FSM edge must have built-player hash/replay trace evidence.',
            statusFromCounts(summary.coveredPhaseEdges, summary.requiredPhaseEdges),
            [
                `covered=${summary.coveredPhaseEdges}/${summary.requiredPhaseEdges}`,
                artifactLinks.reportJson,
            ],
            missingPhaseEdges.length > 0 ? missingPhaseEdges.join(', ') : null
        ),
        completionItem(
            '5.recovery-matrix',
            'Each declared recovery/error case must prove visible failure handling, unchanged state, unpolluted replay, and continued legal operation.',
            statusFromCounts(summary.coveredRecoveryCases, summary.requiredRecoveryCases),
            [
                `covered=${summary.coveredRecoveryCases}/${summary.requiredRecoveryCases}`,
                artifactLinks.reportJson,
            ],
            missingRecoveryCases.length > 0 ? missingRecoveryCases.join(', ') : null
        ),
        completionItem(
            '6.settings-combinations',
            'Settings coverage must use pairwise/3-wise tuples and prove save/restart/load/game-start/hash isolation.',
            statusFromCounts(summary.coveredSettingsTuples, summary.requiredSettingsTuples),
            [
                `covered=${summary.coveredSettingsTuples}/${summary.requiredSettingsTuples}`,
                artifactLinks.reportJson,
            ],
            missingSettingsTuples.length > 0
                ? `${missingSettingsTuples.length} settings tuple(s) still missing.`
                : null
        ),
        completionItem(
            '7.typescript-oracle-and-replay-hash',
            'Unity traces must tie back to TypeScript oracle validity, replay-state hash, export/import/review hash, and no fixture gameplay driver/checkpoint replacement.',
            oracleEvidence.eventCount > 0 &&
                oracleEvidence.digestCount > 0 &&
                releasePackagingCovered
                ? 'covered'
                : oracleEvidence.eventCount > 0
                  ? 'partial'
                  : 'missing',
            [
                `oracleEvents=${oracleEvidence.eventCount}`,
                `oracleRejected=${oracleEvidence.rejectedCount}`,
                `oracleDigests=${oracleEvidence.digestCount}`,
                artifactLinks.reportJson,
            ],
            releasePackagingCovered
                ? null
                : 'Oracle bridge evidence exists, but release-runtime rules packaging is not solved.'
        ),
        completionItem(
            '8.coverage-report',
            'Generate machine-readable JSON and HTML reports with coverage mapping, failure reasons, replay hashes, artifact links, and final verdict.',
            artifactLinks.reportJson && artifactLinks.reportHtml ? 'covered' : 'missing',
            [artifactLinks.reportJson, artifactLinks.reportHtml, `verdict=${verdict}`]
        ),
        completionItem(
            '9.visual-and-latency-contracts',
            'Unity built-player evidence must fail on Electron settings-menu pixel drift, missing reserve Gold prompts, oversized reserved cards, and first/Replenish UI latency regressions.',
            statusFromCounts(summary.coveredVisualContracts, summary.requiredVisualContracts),
            [
                `covered=${summary.coveredVisualContracts}/${summary.requiredVisualContracts}`,
                artifactLinks.reportJson,
            ],
            missingVisualContracts.length > 0 ? missingVisualContracts.join(', ') : null
        ),
        completionItem(
            'completion.entrypoints',
            'All declared entrypoints have built-player fresh-launch evidence.',
            statusFromCounts(
                summary.coveredEntrypoints,
                summary.requiredEntrypoints,
                blockedEntrypoints.length > 0
            ),
            [`covered=${summary.coveredEntrypoints}/${summary.requiredEntrypoints}`],
            blockedEntrypoints.length > 0 ? blockedEntrypoints.join(', ') : null
        ),
        completionItem(
            'completion.action-families',
            'All required action families have both legal and illegal evidence.',
            statusFromCounts(summary.coveredActionFamilies, summary.requiredActionFamilies),
            [`covered=${summary.coveredActionFamilies}/${summary.requiredActionFamilies}`],
            missingActionFamilies.length > 0 ? missingActionFamilies.join(', ') : null
        ),
        completionItem(
            'completion.lan-online-visual-lab',
            'LAN, Online, and Visual Lab are implemented or explicitly approved exclusions.',
            blockedEntrypoints.some((id) => ['lan', 'online', 'visual-lab'].includes(id))
                ? 'blocked'
                : 'covered',
            [...blockedEntrypoints, ...approvedExcludedEntrypoints],
            blockedEntrypoints.length > 0
                ? 'Required entrypoints are not implemented and no user-approved exclusion is recorded.'
                : null
        ),
        completionItem(
            'completion.release-runtime-rules-packaging',
            'Release-runtime rules packaging is solved without LocalDev fixture/checkpoint replacement dependence.',
            releasePackagingCovered ? 'covered' : 'blocked',
            [coverage.releaseRuntimeRulesPackaging.status],
            coverage.releaseRuntimeRulesPackaging.reason
        ),
    ];

    const missingOrWeakRequirements = promptToArtifactChecklist
        .filter((item) => !['covered', 'not-required'].includes(item.status))
        .map((item) => ({
            id: item.id,
            status: item.status,
            gap: item.gap,
        }));

    return {
        objective:
            'Build a Unity product-surface coverage suite that freezes the finite model, runs built-player model-driven evidence, checks recovery/settings coverage, and reports whether coverage is Complete, Incomplete, or Blocked.',
        finalStatus:
            verdict === 'Complete' && missingOrWeakRequirements.length === 0
                ? 'achieved'
                : 'not-achieved',
        finalVerdict: verdict,
        promptToArtifactChecklist,
        missingOrWeakRequirements,
        failureCount: failures.length,
        sourceReportCount: sourceReports.length,
    };
};

const trimEvidence = (evidence) =>
    evidence.slice(0, 12).map((entry) => ({
        caseId: entry.caseId ?? null,
        budgetMs: entry.budgetMs ?? null,
        detail: entry.detail ?? null,
        durationMs: entry.durationMs ?? null,
        phaseAfter: entry.phaseAfter ?? null,
        phaseBefore: entry.phaseBefore ?? null,
        rect: entry.rect ?? null,
        recordedEvents: entry.recordedEvents ?? null,
        replayHash: entry.replayHash ?? null,
        section: entry.section ?? null,
        seed: entry.seed ?? null,
        source: entry.source ?? null,
        stateUnchanged: entry.stateUnchanged ?? null,
        replayUnpolluted: entry.replayUnpolluted ?? null,
    }));

const htmlEscape = (value) =>
    String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

const evidenceCell = (row) =>
    row.legalEvidenceCount !== undefined || row.illegalEvidenceCount !== undefined
        ? `${row.legalEvidenceCount ?? 0}/${row.illegalEvidenceCount ?? 0}`
        : (row.evidenceCount ?? 0);

const renderRows = (rows) =>
    rows
        .map(
            (row) =>
                `<tr><td>${htmlEscape(row.id)}</td><td>${htmlEscape(row.status)}</td><td>${htmlEscape(
                    evidenceCell(row)
                )}</td><td>${htmlEscape(row.required)}</td></tr>`
        )
        .join('\n');

const renderHtml = (report) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Unity Product Surface Coverage</title>
<style>
body { font-family: Arial, sans-serif; margin: 24px; color: #172033; background: #f8fafc; }
h1, h2 { margin: 0 0 12px; }
section { margin: 24px 0; }
table { border-collapse: collapse; width: 100%; background: white; }
th, td { border: 1px solid #d8dee9; padding: 8px 10px; text-align: left; font-size: 13px; }
th { background: #e9eef6; }
.verdict { display: inline-block; padding: 6px 10px; border-radius: 4px; background: ${report.verdict === 'Complete' ? '#d7f5df' : report.verdict === 'Blocked' ? '#ffe2df' : '#fff0c2'}; }
code { background: #edf2f7; padding: 2px 4px; border-radius: 3px; }
</style>
</head>
<body>
<h1>Unity Product Surface Coverage</h1>
<p class="verdict"><strong>${htmlEscape(report.verdict)}</strong> - ${htmlEscape(report.coverageMode)}</p>
<p>Generated at <code>${htmlEscape(report.generatedAt)}</code> from <code>${htmlEscape(report.model.path)}</code>.</p>
<section>
<h2>Summary</h2>
<pre>${htmlEscape(JSON.stringify(report.summary, null, 2))}</pre>
</section>
<section>
<h2>Completion Audit</h2>
<p>Final status: <code>${htmlEscape(report.completionAudit.finalStatus)}</code></p>
<table><thead><tr><th>ID</th><th>Status</th><th>Gap</th></tr></thead><tbody>${report.completionAudit.promptToArtifactChecklist
    .map(
        (item) =>
            `<tr><td>${htmlEscape(item.id)}</td><td>${htmlEscape(item.status)}</td><td>${htmlEscape(item.gap ?? '')}</td></tr>`
    )
    .join('\n')}</tbody></table>
</section>
<section><h2>Entrypoints</h2><table><thead><tr><th>ID</th><th>Status</th><th>Evidence</th><th>Required</th></tr></thead><tbody>${renderRows(report.coverage.entrypoints)}</tbody></table></section>
<section><h2>Action Families</h2><table><thead><tr><th>ID</th><th>Status</th><th>Legal/Illegal Evidence</th><th>Required</th></tr></thead><tbody>${renderRows(report.coverage.actionFamilies)}</tbody></table></section>
<section><h2>Phase Edges</h2><table><thead><tr><th>ID</th><th>Status</th><th>Evidence</th><th>Required</th></tr></thead><tbody>${renderRows(report.coverage.phaseEdges)}</tbody></table></section>
<section><h2>Recovery Cases</h2><table><thead><tr><th>ID</th><th>Status</th><th>Evidence</th><th>Required</th></tr></thead><tbody>${renderRows(report.coverage.recoveryCases)}</tbody></table></section>
<section><h2>Visual Contracts</h2><table><thead><tr><th>ID</th><th>Status</th><th>Evidence</th><th>Required</th></tr></thead><tbody>${renderRows(report.coverage.visualContracts ?? [])}</tbody></table></section>
<section><h2>Failures</h2><pre>${htmlEscape(report.failures.join('\n'))}</pre></section>
</body>
</html>
`;

const run = async () => {
    const options = parseArgs();
    await mkdir(options.outDir, { recursive: true });
    const model = readJsonFile(options.modelPath);
    const launched = options.runBuiltPlayer
        ? runBuiltPlayerScenarios(model, options.outDir)
        : { attempts: [], reports: [] };
    const collected = options.collectExisting
        ? collectExistingLauncherReports(options.maxExisting)
        : [];
    const launcherReports = uniqueSorted([
        ...options.launcherReports,
        ...launched.reports,
        ...collected,
    ]);
    const report = buildCoverageReport(
        model,
        options.modelPath,
        launcherReports,
        launched.attempts,
        {
            reportJson: toRepoPath(options.reportPath),
            reportHtml: toRepoPath(options.htmlPath),
        }
    );
    await writeFile(options.reportPath, `${JSON.stringify(report, null, 4)}\n`, 'utf8');
    await writeFile(options.htmlPath, renderHtml(report), 'utf8');
    process.stdout.write(
        `${JSON.stringify(
            {
                report: toRepoPath(options.reportPath),
                html: toRepoPath(options.htmlPath),
                verdict: report.verdict,
                coverageMode: report.coverageMode,
                summary: report.summary,
            },
            null,
            4
        )}\n`
    );

    if (options.check && report.verdict !== 'Complete') {
        process.stderr.write(`${report.failures.slice(0, 50).join('\n')}\n`);
        if (report.failures.length > 50) {
            process.stderr.write(`... ${report.failures.length - 50} more failure(s)\n`);
        }
        process.exit(1);
    }
};

run().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exit(1);
});
