// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import {
    buildReleaseHealthReport,
    deriveReleaseHealthSummaryFromEvents,
    parseReleaseHealthSourceText,
    serializeReleaseHealthReport,
} from '../releaseHealthReport.js';
import { collectReleaseHealthOperationsErrors } from '../releaseHealthOperations.js';
import { GOVERNANCE_DOC_PATHS } from '../governanceDocPaths.js';

const repoRoot = process.cwd();
const readFile = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readFile(relativePath));

const operationsSnapshot = readJson('electron/governance/release-health-operations.snapshot.json');
const sloText = readFile(GOVERNANCE_DOC_PATHS.operationsSlo);
const drillText = readFile(GOVERNANCE_DOC_PATHS.operationsFaultDrills);

describe('release-health operations governance', () => {
    it('accepts aligned SLO, drill, and snapshot assets', () => {
        expect(
            collectReleaseHealthOperationsErrors({
                sloText,
                drillText,
                operationsSnapshot,
            })
        ).toEqual([]);
    });

    it('reports drift when the operational snapshot or drill docs lose required entries', () => {
        const brokenSnapshot = {
            ...operationsSnapshot,
            indicatorThresholds: {
                ...operationsSnapshot.indicatorThresholds,
            },
        };

        delete brokenSnapshot.indicatorThresholds.peerFailures;
        delete brokenSnapshot.bundleBudgets;

        const errors = collectReleaseHealthOperationsErrors({
            sloText: sloText.replaceAll('ipcRejected', 'ipcRejectedBroken'),
            drillText: drillText.replaceAll('`network-recovery`', 'network recovery'),
            operationsSnapshot: brokenSnapshot,
        });

        expect(errors).toContain(`${GOVERNANCE_DOC_PATHS.operationsSlo} must mention ipcRejected.`);
        expect(errors).toContain(
            `${GOVERNANCE_DOC_PATHS.operationsFaultDrills} must document updater-fail, ipc-reject, and network-recovery drills.`
        );
        expect(errors).toContain(
            'Missing alert threshold for release-health indicator peerFailures.'
        );
        expect(errors).toContain(
            'Release-health operations snapshot must define bundleBudgets.mainChunkKb.'
        );
    });

    it('reports granular schema, threshold, drill, artifact, and bundle budget drift', () => {
        const brokenSnapshot = {
            ...operationsSnapshot,
            schemaVersion: 999,
            sourceFormats: ['release-health-summary'],
            reportVersion: 2,
            indicatorThresholds: {
                ...operationsSnapshot.indicatorThresholds,
                startupFailures: {
                    warningMax: 'broken',
                    incidentMax: 0,
                },
                recoveryRequests: {
                    warningMax: 2,
                    incidentMax: 1,
                },
                rogueIndicator: {
                    warningMax: 0,
                    incidentMax: 0,
                },
            },
            drills: operationsSnapshot.drills.map((drill) => {
                if (drill.id === 'ipc-reject') {
                    return {
                        ...drill,
                        signal: 'WRONG_SIGNAL',
                    };
                }

                if (drill.id === 'network-recovery') {
                    return {
                        ...drill,
                        expectedIndicator: 'ipcRejected',
                    };
                }

                return drill;
            }),
            artifactPolicy: {
                artifactName: '',
                outputDirectory: '',
                retentionDays: 14,
                storageKind: '',
            },
            artifactReports: [
                {
                    id: 'healthy-baseline',
                    sourcePath: 'governance/release-health-fixtures/missing.jsonl',
                    expectedStatus: '',
                },
            ],
            bundleBudgets: {
                mainChunkKb: {
                    warningMax: 900,
                    incidentMax: 800,
                },
            },
        };

        const errors = collectReleaseHealthOperationsErrors({
            sloText,
            drillText,
            operationsSnapshot: brokenSnapshot,
            repoRoot,
        });

        expect(errors).toEqual(
            expect.arrayContaining([
                'Release-health operations snapshot must stay at schema version 2.',
                'Release-health operations snapshot is missing source format release-health-jsonl.',
                'Release-health operations snapshot must document reportVersion 1.',
                'Indicator threshold startupFailures must define numeric warningMax and incidentMax.',
                'Indicator threshold recoveryRequests must keep warningMax at or below incidentMax.',
                'Snapshot contains unknown release-health indicator rogueIndicator.',
                'Drill ipc-reject must capture IPC_REQUEST_REJECTED in the snapshot.',
                'Drill network-recovery must align to indicator recoveryRequests.',
                'artifactPolicy.artifactName must be a non-empty string.',
                'artifactPolicy.outputDirectory must be a non-empty string.',
                'artifactPolicy.retentionDays must be at least 30 days.',
                'artifactPolicy.storageKind must be a non-empty string.',
                'Artifact report healthy-baseline references missing source governance/release-health-fixtures/missing.jsonl.',
                'Artifact report healthy-baseline must define expectedStatus.',
                'Missing governed release-health artifact report updater-fail.',
                'Missing governed release-health artifact report ipc-reject.',
                'Missing governed release-health artifact report network-recovery.',
                'bundleBudgets.mainChunkKb must keep warningMax at or below incidentMax.',
            ])
        );
    });

    it('reports early artifact policy drift when the snapshot omits export metadata', () => {
        const errors = collectReleaseHealthOperationsErrors({
            sloText,
            drillText,
            operationsSnapshot: {
                ...operationsSnapshot,
                artifactPolicy: null,
                artifactReports: [],
            },
            repoRoot,
        });

        expect(errors).toContain(
            'Release-health operations snapshot must define an artifactPolicy block.'
        );
    });
});

describe('release-health report exporter', () => {
    it('derives a machine-readable report from raw release-health JSONL logs', () => {
        const rawLog = [
            '[RELEASE_HEALTH] {"source":"main","category":"startup","name":"WINDOW_LOADED","severity":"info","message":"Renderer loaded.","timestamp":"2026-04-19T10:00:00.000Z"}',
            '[RELEASE_HEALTH] {"source":"main","category":"security","name":"IPC_REQUEST_REJECTED","severity":"warn","message":"Rejected.","timestamp":"2026-04-19T10:01:00.000Z","context":{"reasonCode":"IPC_REQUEST_REJECTED"}}',
        ].join('\n');

        const source = parseReleaseHealthSourceText(rawLog);
        const report = buildReleaseHealthReport({
            source,
            operationsSnapshot,
            sourcePath: '/tmp/release-health.log',
            generatedAt: '2026-04-19T10:02:00.000Z',
        });

        expect(source.kind).toBe('jsonl-log');
        expect(report.reportVersion).toBe(1);
        expect(report.operationsSnapshotVersion).toBe(2);
        expect(report.source.kind).toBe('jsonl-log');
        expect(report.source.summaryProvided).toBe(false);
        expect(report.summary.totalEvents).toBe(2);
        expect(report.summary.indicators).toMatchObject({
            ipcRejected: 1,
        });
        expect(report.summary.reasonCodeCounts).toEqual({
            IPC_REQUEST_REJECTED: 1,
        });
        expect(report.status).toBe('incident');
        expect(report.alerts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    indicator: 'ipcRejected',
                    status: 'incident',
                    budget: expect.objectContaining({
                        observed: 1,
                        breached: true,
                    }),
                }),
            ])
        );
        expect(JSON.parse(serializeReleaseHealthReport(report, { pretty: false })).status).toBe(
            'incident'
        );
    });

    it('parses empty and summary-only sources, truncates recent events, and emits warning status', () => {
        expect(parseReleaseHealthSourceText('   \n')).toEqual({
            kind: 'empty',
            summaryProvided: false,
            events: [],
            summary: null,
        });
        expect(() => parseReleaseHealthSourceText('not release health telemetry')).toThrow(
            'No release-health events or summary were found in the input.'
        );

        const derivedSummary = deriveReleaseHealthSummaryFromEvents(
            Array.from({ length: 30 }, (_, index) => ({
                source: 'main',
                category: index === 0 ? 'startup' : index === 1 ? 'peer' : 'recovery',
                name:
                    index === 2
                        ? 'APP_RUNTIME_CONFIG_FAILED'
                        : index === 3
                          ? 'IPC_REQUEST_REJECTED'
                          : `EVENT_${index}`,
                severity: index === 0 || index === 1 ? 'error' : index === 3 ? 'warn' : 'info',
                message: `event ${index}`,
                context:
                    index === 3
                        ? {
                              reasonCode: 'IPC_REQUEST_REJECTED',
                          }
                        : undefined,
                ...(index === 29
                    ? {}
                    : { timestamp: `2026-04-19T10:${String(index).padStart(2, '0')}:00.000Z` }),
            }))
        );

        expect(derivedSummary.recentEvents).toHaveLength(25);
        expect(derivedSummary.indicators).toMatchObject({
            startupFailures: 1,
            runtimeConfigFailures: 1,
            peerFailures: 1,
            recoveryRequests: 28,
            ipcRejected: 1,
        });
        expect(derivedSummary.reasonCodeCounts).toEqual({
            IPC_REQUEST_REJECTED: 1,
        });

        const summaryOnlySource = parseReleaseHealthSourceText(
            JSON.stringify({
                ...derivedSummary,
                indicators: {
                    ...derivedSummary.indicators,
                    startupFailures: 0,
                    runtimeConfigFailures: 0,
                    updaterFailures: 0,
                    peerFailures: 0,
                    recoveryRequests: 1,
                    ipcRejected: 0,
                },
            })
        );
        const report = buildReleaseHealthReport({
            source: summaryOnlySource,
            operationsSnapshot: {
                indicatorThresholds: {
                    recoveryRequests: {
                        warningMax: 0,
                        incidentMax: 1,
                    },
                },
            },
            generatedAt: '2026-04-19T11:00:00.000Z',
            provenance: {
                generatedBy: 'unit-test',
            },
            drillLabel: 'network-recovery',
        });

        expect(summaryOnlySource.kind).toBe('summary');
        expect(report.status).toBe('warning');
        expect(report.drills).toEqual([]);
        expect(report.notes).toEqual([]);
        expect(report.provenance).toEqual({
            generatedBy: 'unit-test',
        });
        expect(report.drillLabel).toBe('network-recovery');
        expect(report.alerts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    indicator: 'recoveryRequests',
                    status: 'warning',
                    budget: expect.objectContaining({
                        observed: 1,
                        remainingWarningBudget: -1,
                        remainingIncidentBudget: 0,
                    }),
                }),
            ])
        );
    });

    it('covers updater failures, timestamp fallbacks, and release-health parser rejection cases', () => {
        const source = parseReleaseHealthSourceText(
            [
                '[RELEASE_HEALTH] ',
                '[RELEASE_HEALTH] 1',
                '[RELEASE_HEALTH_SUMMARY] ',
                '[RELEASE_HEALTH_SUMMARY] 1',
                '[RELEASE_HEALTH] {"source":"renderer","category":"updater","name":"UPDATER_CHECK_FAILED","severity":"error","message":"Updater failed."}',
            ].join('\n')
        );
        const report = buildReleaseHealthReport({
            source,
            operationsSnapshot,
            retention: {
                artifactName: 'governance-evidence',
                retentionDays: 30,
                storageKind: 'github-actions-artifact',
            },
            generatedAt: '2026-04-19T12:00:00.000Z',
        });

        expect(source.kind).toBe('jsonl-log');
        expect(source.events).toHaveLength(1);
        expect(report.summary.indicators.updaterFailures).toBe(1);
        expect(report.summary.counters['updater:UPDATER_CHECK_FAILED']).toEqual({
            count: 1,
            severity: 'error',
            lastAt: null,
        });
        expect(report.retention).toEqual({
            artifactName: 'governance-evidence',
            retentionDays: 30,
            storageKind: 'github-actions-artifact',
        });
        expect(JSON.parse(serializeReleaseHealthReport(report)).retention.retentionDays).toBe(30);
    });

    it('exposes the CLI exporter as a runnable machine-readable tool', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-health-'));
        const inputPath = path.join(tempDir, 'session.log');
        try {
            fs.writeFileSync(
                inputPath,
                [
                    '[RELEASE_HEALTH] {"source":"main","category":"startup","name":"WINDOW_LOADED","severity":"info","message":"Renderer loaded.","timestamp":"2026-04-19T10:00:00.000Z"}',
                    '[RELEASE_HEALTH_SUMMARY] {"startedAt":"2026-04-19T10:00:00.000Z","lastEventAt":"2026-04-19T10:00:00.000Z","totalEvents":1,"severityCounts":{"info":1,"warn":0,"error":0},"indicators":{"startupFailures":0,"runtimeConfigFailures":0,"updaterFailures":0,"peerFailures":0,"recoveryRequests":0,"ipcRejected":0},"counters":{"startup:WINDOW_LOADED":{"count":1,"severity":"info","lastAt":"2026-04-19T10:00:00.000Z"}},"recentEvents":[{"source":"main","category":"startup","name":"WINDOW_LOADED","severity":"info","message":"Renderer loaded.","timestamp":"2026-04-19T10:00:00.000Z"}]}',
                ].join('\n'),
                'utf8'
            );

            const stdout = execFileSync(
                'node',
                ['scripts/export-release-health-report.mjs', inputPath],
                {
                    cwd: repoRoot,
                    encoding: 'utf8',
                }
            );
            const parsed = JSON.parse(stdout);

            expect(parsed.reportVersion).toBe(1);
            expect(parsed.provenance.generatedBy).toBe('scripts/export-release-health-report.mjs');
            expect(parsed.source.kind).toBe('summary');
            expect(parsed.summary.totalEvents).toBe(1);
            expect(parsed.status).toBe('healthy');
        } finally {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });
});
