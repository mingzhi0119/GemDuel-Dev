// @vitest-environment node

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), '..', '..');
const runnerPath = path.join(
    repoRoot,
    'tools',
    'migration',
    'run-unity-product-surface-coverage.mjs'
);
const realModelPath = path.join(
    repoRoot,
    'tools',
    'migration',
    'unity-product-surface-coverage-model.json'
);

let tempRoots: string[] = [];

afterEach(() => {
    for (const tempRoot of tempRoots) {
        rmSync(tempRoot, { force: true, recursive: true });
    }
    tempRoots = [];
});

const makeTempRoot = () => {
    const root = mkdtempSync(path.join(tmpdir(), 'gemduel-product-surface-coverage-'));
    tempRoots.push(root);
    return root;
};

const writeJson = (filePath: string, value: unknown) => {
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, `${JSON.stringify(value, null, 4)}\n`, 'utf8');
};

const runCoverage = (args: string[]) =>
    spawnSync(process.execPath, [runnerPath, ...args], {
        cwd: repoRoot,
        encoding: 'utf8',
        windowsHide: true,
    });

const createLauncherReport = (
    filePath: string,
    options: {
        actionFamily?: string;
        actionDetail?: string;
        phaseBefore?: string;
        phaseAfter?: string;
        startMode?: string;
        settingsCoverageParams?: Record<string, string>;
    } = {}
) => {
    writeJson(filePath, {
        schemaVersion: 1,
        kind: 'unity-built-player-smoke-launcher',
        ok: true,
        exitCode: 0,
        signal: null,
        timedOut: false,
        startedAt: '2026-05-13T00:00:00.000Z',
        completedAt: '2026-05-13T00:00:01.000Z',
        bridgeMailboxEvents: [],
        smoke: {
            kind: 'unity-built-player-smoke-wrapper',
            ok: true,
            seed: 'coverage-unit-seed',
            startMode: options.startMode ?? 'classic',
            smoke: {
                kind: 'unity-localdev-product-surface-smoke',
                ok: true,
                freshLaunch: true,
                seed: 'coverage-unit-seed',
                startMode: options.startMode ?? 'classic',
                actions: [
                    {
                        step: 0,
                        family: options.actionFamily ?? 'take_gems',
                        detail: options.actionDetail ?? 'take_gems',
                        phaseBefore: options.phaseBefore ?? 'IDLE',
                        phaseAfter: options.phaseAfter ?? 'GAME_OVER',
                        stateHash: 'after-action-hash',
                        recordedEvents: 1,
                    },
                ],
                productStateSummary: {
                    phase: options.phaseAfter ?? 'GAME_OVER',
                    turn: 'p1',
                    winner: 'p1',
                    stateHash: 'after-action-hash',
                    summaryFinalStateHash: 'after-action-hash',
                    recordedEvents: 1,
                },
                replayHashSummary: {
                    exportedEvents: 1,
                    exportedSummaryFinalStateHash: 'after-action-hash',
                    controllerCurrentStateHash: 'after-action-hash',
                },
                replayReview: {
                    ok: true,
                    reviewedFinalStateHash: 'after-action-hash',
                },
            },
            replayReleasePath: {
                kind: 'unity-localdev-replay-release-path-smoke',
                ok: true,
                freshLaunch: true,
                coverage: ['invalid_json'],
                replayHashSummary: {
                    exportedEvents: 1,
                    exportedSummaryFinalStateHash: 'after-action-hash',
                    controllerCurrentStateHash: 'after-action-hash',
                },
            },
            settingsReleasePath: {
                kind: 'unity-localdev-settings-release-path-smoke',
                ok: true,
                freshLaunch: true,
                settingsSummary: {
                    coverageParams: options.settingsCoverageParams ?? {
                        audio: 'sound-on',
                        fresh_launch: 'restart',
                        game_mode: 'classic-local-pvp',
                        input: 'mouse-click',
                        locale: 'en',
                        recovery_setting: 'autosave-on',
                        replay_setting: 'review-navigation-on',
                        surface_theme: 'royal-luxury',
                        visibility: 'lan-hidden',
                    },
                    savedSettings: {
                        locale: 'en',
                        surfaceTheme: 'royal-luxury',
                        soundEnabled: true,
                        lanShowOpponentPlayerZoneCards: false,
                        lanShowOpponentGems: false,
                    },
                    reloadedSettings: {
                        locale: 'en',
                        surfaceTheme: 'royal-luxury',
                        soundEnabled: true,
                        lanShowOpponentPlayerZoneCards: false,
                        lanShowOpponentGems: false,
                    },
                    gameStateHashAfter: 'after-settings-hash',
                },
            },
            invalidActionReleasePath: {
                kind: 'unity-localdev-invalid-action-release-path-smoke',
                ok: true,
                freshLaunch: true,
                cases: [
                    {
                        id: 'reject-take-gems-empty-selection',
                        ok: true,
                        accepted: false,
                        stateHashBefore: 'after-action-hash',
                        stateHashAfter: 'after-action-hash',
                        recordedEventsBefore: 1,
                        recordedEventsAfter: 1,
                    },
                ],
            },
        },
    });
};

const createFullGameSuiteReport = (filePath: string) => {
    writeJson(filePath, {
        schemaVersion: 1,
        kind: 'local-pvp-built-player-full-game-suite-report',
        ok: true,
        seedPrefix: 'coverage-full-game',
        builtPlayer: {
            suite: {
                kind: 'unity-localdev-full-game-plan-suite',
                ok: true,
                suiteTraceHash: 'suite-trace-hash',
                matches: [
                    {
                        ok: true,
                        seed: 'coverage-full-game-001',
                        finalState: {
                            stateHash: 'final-hash',
                            replayHash: 'final-hash',
                            recordedEvents: 6,
                        },
                        replayExport: {
                            ok: true,
                            exportedEvents: 6,
                            exportedSummaryFinalStateHash: 'final-hash',
                        },
                        replayReview: {
                            ok: true,
                            reviewedFinalStateHash: 'final-hash',
                        },
                        records: [
                            {
                                covered: true,
                                ok: true,
                                actionFamily: 'INITIATE_BUY_JOKER',
                                action: 'confirm_preview_action',
                                durationMs: 90,
                                phase: { before: 'IDLE', after: 'SELECT_CARD_COLOR' },
                                stateHashAfter: 'joker-pending',
                                replayHashAfter: 'joker-pending',
                                replayEventCountAfter: 1,
                                legality: { expectedLegal: true, actualLegal: true },
                                targetGeometry: {
                                    kind: 'MarketCard',
                                    rect: { width: 100, height: 140 },
                                },
                                winner: { before: null, after: null },
                            },
                            {
                                covered: true,
                                ok: true,
                                actionFamily: 'BUY_CARD',
                                action: 'select_joker_color',
                                durationMs: 70,
                                phase: { before: 'SELECT_CARD_COLOR', after: 'IDLE' },
                                stateHashAfter: 'joker-bought',
                                replayHashAfter: 'joker-bought',
                                replayEventCountAfter: 2,
                                legality: { expectedLegal: true, actualLegal: true },
                                targetGeometry: {
                                    kind: 'ColorChoice',
                                    rect: { width: 64, height: 64 },
                                },
                                winner: { before: null, after: null },
                            },
                            {
                                covered: true,
                                ok: true,
                                actionFamily: 'REPLENISH',
                                action: 'end_turn',
                                durationMs: 120,
                                phase: { before: 'IDLE', after: 'IDLE' },
                                stateHashAfter: 'replenished',
                                replayHashAfter: 'replenished',
                                replayEventCountAfter: 3,
                                legality: { expectedLegal: true, actualLegal: true },
                                targetGeometry: {
                                    kind: 'TurnButton',
                                    rect: { width: 96, height: 40 },
                                },
                                winner: { before: null, after: null },
                            },
                            {
                                covered: true,
                                ok: true,
                                actionFamily: 'RESERVE_CARD',
                                action: 'resolve_pending_reserve_gold',
                                durationMs: 80,
                                phase: { before: 'RESERVE_WAITING_GEM', after: 'IDLE' },
                                stateHashAfter: 'reserved',
                                replayHashAfter: 'reserved',
                                replayEventCountAfter: 4,
                                legality: { expectedLegal: true, actualLegal: true },
                                targetGeometry: { kind: 'Gem', rect: { width: 72, height: 72 } },
                                winner: { before: null, after: null },
                            },
                            {
                                covered: true,
                                ok: true,
                                actionFamily: 'BUY_CARD',
                                action: 'click_player_reserved',
                                durationMs: 60,
                                phase: { before: 'IDLE', after: 'IDLE' },
                                stateHashAfter: 'reserved-preview',
                                replayHashAfter: 'reserved-preview',
                                replayEventCountAfter: 4,
                                legality: { expectedLegal: true, actualLegal: true },
                                targetGeometry: {
                                    kind: 'ReservedCard',
                                    rect: { width: 111, height: 148 },
                                },
                                winner: { before: null, after: null },
                            },
                            {
                                covered: true,
                                ok: true,
                                actionFamily: 'BUY_CARD',
                                action: 'confirm_preview_action',
                                durationMs: 75,
                                phase: { before: 'IDLE', after: 'IDLE' },
                                stateHashAfter: 'final-hash',
                                replayHashAfter: 'final-hash',
                                replayEventCountAfter: 6,
                                legality: { expectedLegal: true, actualLegal: true },
                                targetGeometry: {
                                    kind: 'PreviewButton',
                                    rect: { width: 160, height: 48 },
                                },
                                winner: { before: null, after: 'p1' },
                            },
                        ],
                    },
                ],
            },
        },
    });
};

const createCompleteTestModel = (filePath: string) => {
    writeJson(filePath, {
        schemaVersion: 1,
        kind: 'unity-product-surface-coverage-model',
        updatedAt: '2026-05-13',
        completionPolicy: {
            boundedRepresentativeLabel: 'bounded representative coverage',
        },
        entrypoints: [
            {
                id: 'classic-local-pvp',
                label: 'Classic Local PvP',
                required: true,
                implementationStatus: 'implemented',
                freshLaunchRequired: true,
            },
        ],
        actionFamilies: [
            {
                id: 'take_gems',
                label: 'take gems',
                required: true,
                legalEvidenceRequired: true,
                illegalEvidenceRequired: true,
            },
        ],
        phaseEdges: [
            {
                id: 'IDLE->GAME_OVER',
                from: 'IDLE',
                to: 'GAME_OVER',
                required: true,
            },
        ],
        recoveryCases: [
            {
                id: 'invalid_replay_json',
                required: true,
            },
        ],
        settings: {
            parameters: [
                {
                    id: 'locale',
                    values: ['en'],
                },
                {
                    id: 'visibility',
                    values: ['lan-hidden'],
                },
            ],
            combinationSets: [
                {
                    id: 'locale-visibility-pairwise',
                    strength: 2,
                    required: true,
                    parameters: ['locale', 'visibility'],
                },
            ],
        },
        releaseRuntimeRulesPackaging: {
            required: false,
        },
    });
};

const createFullGameCoverageModel = (filePath: string) => {
    writeJson(filePath, {
        schemaVersion: 1,
        kind: 'unity-product-surface-coverage-model',
        updatedAt: '2026-05-14',
        completionPolicy: {
            boundedRepresentativeLabel: 'bounded representative coverage',
        },
        entrypoints: [
            {
                id: 'classic-local-pvp',
                label: 'Classic Local PvP',
                required: true,
                implementationStatus: 'implemented',
            },
            {
                id: 'replay-import-review',
                label: 'Replay Import/Review',
                required: true,
                implementationStatus: 'implemented',
            },
        ],
        actionFamilies: [
            {
                id: 'buy',
                label: 'buy',
                required: true,
                legalEvidenceRequired: true,
                illegalEvidenceRequired: false,
            },
            {
                id: 'joker_color',
                label: 'joker color',
                required: true,
                legalEvidenceRequired: true,
                illegalEvidenceRequired: false,
            },
        ],
        phaseEdges: [
            {
                id: 'IDLE->SELECT_CARD_COLOR',
                from: 'IDLE',
                to: 'SELECT_CARD_COLOR',
                required: true,
            },
            {
                id: 'SELECT_CARD_COLOR->IDLE',
                from: 'SELECT_CARD_COLOR',
                to: 'IDLE',
                required: true,
            },
            {
                id: 'IDLE->GAME_OVER',
                from: 'IDLE',
                to: 'GAME_OVER',
                required: true,
            },
        ],
        visualContracts: [
            {
                id: 'first_action_latency',
                label: 'First action latency',
                required: true,
            },
            {
                id: 'replenish_latency',
                label: 'Replenish latency',
                required: true,
            },
            {
                id: 'reserve_gold_prompt',
                label: 'Reserve Gold prompt',
                required: true,
            },
            {
                id: 'reserved_card_mini_stack',
                label: 'Reserved mini stack',
                required: true,
            },
        ],
        releaseRuntimeRulesPackaging: {
            required: false,
        },
    });
};

describe('run-unity-product-surface-coverage', () => {
    it('reports Complete only when every declared model requirement has evidence', () => {
        const root = makeTempRoot();
        const modelPath = path.join(root, 'coverage-model.json');
        const launcherPath = path.join(root, 'launcher.json');
        const reportPath = path.join(root, 'report.json');
        const htmlPath = path.join(root, 'report.html');
        createCompleteTestModel(modelPath);
        createLauncherReport(launcherPath);

        const result = runCoverage([
            '--model',
            modelPath,
            '--report',
            reportPath,
            '--html',
            htmlPath,
            '--launcher-report',
            launcherPath,
            '--check',
        ]);

        expect(result.status, result.stderr).toBe(0);
        const report = JSON.parse(readFileSync(reportPath, 'utf8'));
        expect(report.verdict).toBe('Complete');
        expect(report.coverageMode).toBe('complete product-surface coverage');
        expect(report.summary.failureCount).toBe(0);
        expect(report.coverage.actionFamilies[0]).toMatchObject({
            id: 'take_gems',
            status: 'covered',
            legalEvidenceCount: 1,
            illegalEvidenceCount: 1,
        });
        expect(report.completionAudit.promptToArtifactChecklist).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: '1.freeze-product-scope',
                    status: 'covered',
                }),
                expect.objectContaining({
                    id: '8.coverage-report',
                    status: 'covered',
                }),
            ])
        );
        expect(readFileSync(htmlPath, 'utf8')).toContain('Unity Product Surface Coverage');
        expect(readFileSync(htmlPath, 'utf8')).toContain('Completion Audit');
    });

    it('imports Local PVP full-game suite reports as product-surface evidence', () => {
        const root = makeTempRoot();
        const modelPath = path.join(root, 'coverage-model.json');
        const fullGamePath = path.join(root, 'local-pvp-built-player-full-game-suite-report.json');
        const reportPath = path.join(root, 'report.json');
        const htmlPath = path.join(root, 'report.html');
        createFullGameCoverageModel(modelPath);
        createFullGameSuiteReport(fullGamePath);

        const result = runCoverage([
            '--model',
            modelPath,
            '--report',
            reportPath,
            '--html',
            htmlPath,
            '--launcher-report',
            fullGamePath,
            '--check',
        ]);

        expect(result.status, result.stderr).toBe(0);
        const report = JSON.parse(readFileSync(reportPath, 'utf8'));
        expect(report.verdict).toBe('Complete');
        expect(report.coverage.entrypoints).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 'classic-local-pvp', status: 'covered' }),
                expect.objectContaining({ id: 'replay-import-review', status: 'covered' }),
            ])
        );
        expect(report.coverage.actionFamilies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 'buy', status: 'covered' }),
                expect.objectContaining({ id: 'joker_color', legalEvidenceCount: 1 }),
            ])
        );
        expect(report.coverage.phaseEdges).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 'IDLE->GAME_OVER', status: 'covered' }),
            ])
        );
        expect(report.coverage.visualContracts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 'first_action_latency', status: 'covered' }),
                expect.objectContaining({ id: 'replenish_latency', status: 'covered' }),
                expect.objectContaining({ id: 'reserve_gold_prompt', status: 'covered' }),
                expect.objectContaining({ id: 'reserved_card_mini_stack', status: 'covered' }),
            ])
        );
    });

    it('does not let historical failed retained reports downgrade passing built-player evidence', () => {
        const root = makeTempRoot();
        const modelPath = path.join(root, 'coverage-model.json');
        const fullGamePath = path.join(root, 'local-pvp-built-player-full-game-suite-report.json');
        const failedLauncherPath = path.join(root, 'old-failed.launcher.json');
        const reportPath = path.join(root, 'report.json');
        const htmlPath = path.join(root, 'report.html');
        createFullGameCoverageModel(modelPath);
        createFullGameSuiteReport(fullGamePath);
        writeJson(failedLauncherPath, {
            schemaVersion: 1,
            kind: 'unity-built-player-smoke-launcher',
            ok: false,
            failureReason: 'historical failed launch retained for audit history',
        });

        const result = runCoverage([
            '--model',
            modelPath,
            '--report',
            reportPath,
            '--html',
            htmlPath,
            '--launcher-report',
            fullGamePath,
            '--launcher-report',
            failedLauncherPath,
            '--check',
        ]);

        expect(result.status, result.stderr).toBe(0);
        const report = JSON.parse(readFileSync(reportPath, 'utf8'));
        expect(report.summary.sourceReportCount).toBe(2);
        expect(report.summary.passingSourceReportCount).toBe(1);
        expect(report.completionAudit.promptToArtifactChecklist).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: '2.built-player-harness',
                    status: 'covered',
                    gap: null,
                }),
            ])
        );
    });

    it('uses settings release-path coverage parameters for matrix tuples', () => {
        const root = makeTempRoot();
        const modelPath = path.join(root, 'coverage-model.json');
        const launcherPath = path.join(root, 'launcher.json');
        const reportPath = path.join(root, 'report.json');
        const htmlPath = path.join(root, 'report.html');
        writeJson(modelPath, {
            schemaVersion: 1,
            kind: 'unity-product-surface-coverage-model',
            updatedAt: '2026-05-14',
            completionPolicy: {
                boundedRepresentativeLabel: 'bounded representative coverage',
            },
            entrypoints: [],
            actionFamilies: [],
            phaseEdges: [],
            recoveryCases: [],
            settings: {
                parameters: [
                    { id: 'locale', values: ['zh'] },
                    { id: 'visibility', values: ['lan-gems-visible'] },
                    { id: 'game_mode', values: ['roguelike-local-pvp'] },
                ],
                combinationSets: [
                    {
                        id: 'settings-coverage-params-3wise',
                        strength: 3,
                        required: true,
                        parameters: ['locale', 'visibility', 'game_mode'],
                    },
                ],
            },
            releaseRuntimeRulesPackaging: {
                required: false,
            },
        });
        createLauncherReport(launcherPath, {
            settingsCoverageParams: {
                audio: 'sound-off',
                fresh_launch: 'fresh',
                game_mode: 'roguelike-local-pvp',
                input: 'drag-select',
                locale: 'zh',
                recovery_setting: 'autosave-off',
                replay_setting: 'review-navigation-off',
                surface_theme: 'clean-boardgame',
                visibility: 'lan-gems-visible',
            },
        });

        const result = runCoverage([
            '--model',
            modelPath,
            '--report',
            reportPath,
            '--html',
            htmlPath,
            '--launcher-report',
            launcherPath,
            '--check',
        ]);

        expect(result.status, result.stderr).toBe(0);
        const report = JSON.parse(readFileSync(reportPath, 'utf8'));
        expect(report.verdict).toBe('Complete');
        expect(report.summary.coveredSettingsTuples).toBe(1);
    });

    it('keeps the real model blocked until required product surfaces and packaging are covered', () => {
        const root = makeTempRoot();
        const launcherPath = path.join(root, 'launcher.json');
        const reportPath = path.join(root, 'report.json');
        const htmlPath = path.join(root, 'report.html');
        createLauncherReport(launcherPath, {
            actionFamily: 'choose_royal',
            actionDetail: 'choose_royal',
            phaseBefore: 'SELECT_ROYAL',
            phaseAfter: 'IDLE',
        });

        const result = runCoverage([
            '--model',
            realModelPath,
            '--report',
            reportPath,
            '--html',
            htmlPath,
            '--launcher-report',
            launcherPath,
        ]);

        expect(result.status, result.stderr).toBe(0);
        const report = JSON.parse(readFileSync(reportPath, 'utf8'));
        expect(report.verdict).toBe('Blocked');
        expect(report.coverage.entrypoints).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 'lan',
                    required: false,
                    status: 'skipped',
                    userApprovedExclusion: true,
                }),
                expect.objectContaining({
                    id: 'online',
                    required: false,
                    status: 'skipped',
                    userApprovedExclusion: true,
                }),
                expect.objectContaining({
                    id: 'visual-lab',
                    required: false,
                    status: 'skipped',
                    userApprovedExclusion: true,
                }),
            ])
        );
        expect(report.coverage.releaseRuntimeRulesPackaging.status).toBe('blocked-until-packaged');
        expect(report.coverage.phaseEdges).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 'SELECT_CARD_COLOR->BONUS_ACTION',
                    required: false,
                    status: 'skipped',
                    reachability: 'unreachable-current-catalog',
                }),
            ])
        );
        expect(report.completionAudit.finalStatus).toBe('not-achieved');
        expect(report.completionAudit.promptToArtifactChecklist).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 'completion.lan-online-visual-lab',
                    status: 'covered',
                }),
                expect.objectContaining({
                    id: 'completion.release-runtime-rules-packaging',
                    status: 'blocked',
                }),
            ])
        );
        expect(report.coverage.actionFamilies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 'royal',
                    legalEvidenceCount: 1,
                }),
            ])
        );
    });
});
