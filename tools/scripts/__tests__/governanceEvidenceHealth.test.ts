// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildReleaseHealthReport } from '../releaseHealthReport.js';
import {
    collectGovernanceEvidenceHealthErrors,
    loadGovernanceEvidence,
} from '../governanceEvidenceHealth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');
const benchmarkBaseline = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'tools', 'governance', 'benchmark-baselines.snapshot.json'),
        'utf8'
    )
);
const OPERATIONS_SNAPSHOT = {
    indicatorThresholds: {
        startupFailures: { warningMax: 0, incidentMax: 0 },
        runtimeConfigFailures: { warningMax: 0, incidentMax: 0 },
        updaterFailures: { warningMax: 0, incidentMax: 0 },
        peerFailures: { warningMax: 0, incidentMax: 0 },
        recoveryRequests: { warningMax: 0, incidentMax: 1 },
        ipcRejected: { warningMax: 0, incidentMax: 0 },
    },
    alertRouting: {
        startupFailures: 'pager',
        runtimeConfigFailures: 'pager',
        updaterFailures: 'pager',
        peerFailures: 'pager',
        recoveryRequests: 'warn',
        ipcRejected: 'pager',
    },
    drills: [],
};
const createSummary = (indicators: Partial<Record<string, number>> = {}) => ({
    startedAt: null,
    lastEventAt: null,
    totalEvents: 0,
    severityCounts: {
        info: 0,
        warn: 0,
        error: 0,
    },
    indicators: {
        startupFailures: 0,
        runtimeConfigFailures: 0,
        updaterFailures: 0,
        peerFailures: 0,
        recoveryRequests: 0,
        ipcRejected: 0,
        ...indicators,
    },
    reasonCodeCounts: {},
    counters: {},
    recentEvents: [],
});
const createReport = (indicators: Partial<Record<string, number>> = {}) =>
    buildReleaseHealthReport({
        source: {
            kind: 'summary',
            summaryProvided: true,
            events: [],
            summary: createSummary(indicators),
        },
        operationsSnapshot: OPERATIONS_SNAPSHOT,
        generatedAt: '2026-04-20T00:00:00.000Z',
        provenance: {},
        retention: null,
        sourcePath: null,
        drillLabel: null,
    });

const writeJson = (filePath: string, value: unknown) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
};

const writeBenchmarkReport = (outDir: string) => {
    writeJson(path.join(outDir, 'lifecycle-benchmarks.report.json'), {
        schemaVersion: 1,
        status: 'passed',
        errors: [],
        benchmarks: benchmarkBaseline.benchmarks.map((benchmark: { id: string }) => ({
            id: benchmark.id,
            medianMs: 0.001,
            p95Ms: 0.002,
        })),
    });
};

const writeCoverageFixture = (tempDir: string) => {
    const coverageFile = path.join(tempDir, 'coverage-final.json');
    writeJson(coverageFile, {
        'fixture.js': {
            b: {
                0: [1, 1],
            },
        },
    });
    return coverageFile;
};

describe('governance evidence health', () => {
    it('accepts exported governance evidence when the retained baseline stays healthy', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-evidence-health-'));
        const distDir = path.join(tempDir, 'dist');
        const assetsDir = path.join(distDir, 'assets');
        const outDir = path.join(tempDir, 'artifacts');
        const coverageFile = writeCoverageFixture(tempDir);

        fs.mkdirSync(assetsDir, {
            recursive: true,
        });
        fs.writeFileSync(path.join(assetsDir, 'index-main.js'), 'x'.repeat(620 * 1024), 'utf8');
        writeBenchmarkReport(outDir);

        try {
            execFileSync(
                'node',
                [
                    'tools/scripts/export-governance-artifacts.mjs',
                    '--out-dir',
                    outDir,
                    '--dist-dir',
                    distDir,
                    '--coverage-file',
                    coverageFile,
                ],
                {
                    cwd: repoRoot,
                    encoding: 'utf8',
                }
            );

            const { manifest, reports, lifecycleReports } = loadGovernanceEvidence({
                artifactsDir: outDir,
                repoRoot,
            });

            expect(
                collectGovernanceEvidenceHealthErrors({
                    manifest,
                    reports,
                    lifecycleReports,
                    operationsSnapshot: OPERATIONS_SNAPSHOT,
                })
            ).toEqual([]);
        } finally {
            fs.rmSync(tempDir, {
                force: true,
                recursive: true,
            });
        }
    });

    it('reports unhealthy baseline indicators and missing retained reports', () => {
        const manifest = {
            artifactPolicy: {
                artifactName: 'governance-evidence',
                retentionDays: 30,
            },
            release: {
                releaseHealthReports: [
                    {
                        id: 'healthy-baseline',
                        path: 'artifacts/governance/healthy-baseline.release-health.report.json',
                        expectedStatus: 'healthy',
                    },
                ],
            },
        };

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest,
                reports: {
                    'artifacts/governance/healthy-baseline.release-health.report.json':
                        createReport({ startupFailures: 1 }),
                },
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toEqual(
            expect.arrayContaining([
                'Governance evidence report healthy-baseline contains non-healthy indicators: startupFailures:incident:1.',
                'Governance evidence report healthy-baseline is in incident state.',
            ])
        );

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest,
                reports: {},
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toContain('Governance evidence report healthy-baseline is missing from the artifact.');
    });

    it('fails when the retained artifact manifest is missing or the retention window drops below 30 days', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-evidence-missing-'));

        try {
            expect(() =>
                loadGovernanceEvidence({
                    artifactsDir: tempDir,
                    repoRoot,
                })
            ).toThrow(
                `Governance evidence manifest is missing at ${path.join(tempDir, 'governance-evidence.manifest.json')}.`
            );

            expect(
                collectGovernanceEvidenceHealthErrors({
                    manifest: {
                        artifactPolicy: {
                            artifactName: 'governance-evidence',
                            retentionDays: 14,
                        },
                        release: {
                            releaseHealthReports: [
                                {
                                    id: 'healthy-baseline',
                                    path: 'artifacts/governance/healthy-baseline.release-health.report.json',
                                    expectedStatus: 'healthy',
                                },
                            ],
                        },
                    },
                    reports: {
                        'artifacts/governance/healthy-baseline.release-health.report.json':
                            createReport(),
                    },
                    operationsSnapshot: OPERATIONS_SNAPSHOT,
                })
            ).toContain('Governance evidence retention must be at least 30 days.');
        } finally {
            fs.rmSync(tempDir, {
                force: true,
                recursive: true,
            });
        }
    });

    it('loads retained reports via repo-root, artifacts-dir, basename fallback, and missing-file branches', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-evidence-load-'));
        const tempRepoRoot = path.join(tempDir, 'repo-root');
        const artifactsDir = path.join(tempDir, 'artifacts');
        const repoRootReportPath = 'reports/repo-root.report.json';
        const artifactsRelativePath = 'nested/artifacts-relative.report.json';
        const basenameFallbackPath = 'missing/folders/basename-fallback.report.json';
        const missingPath = 'missing/folders/not-found.report.json';

        try {
            writeJson(path.join(tempRepoRoot, repoRootReportPath), {
                status: 'healthy',
                alerts: [{ indicator: 'startupFailures', status: 'healthy', value: 0 }],
            });
            writeJson(path.join(artifactsDir, artifactsRelativePath), {
                status: 'healthy',
                alerts: [{ indicator: 'peerFailures', status: 'healthy', value: 0 }],
            });
            writeJson(path.join(artifactsDir, 'basename-fallback.report.json'), {
                status: 'healthy',
                alerts: [{ indicator: 'ipcRejected', status: 'healthy', value: 0 }],
            });
            writeJson(path.join(artifactsDir, 'governance-evidence.manifest.json'), {
                artifactPolicy: {
                    artifactName: 'governance-evidence',
                    retentionDays: 30,
                },
                release: {
                    releaseHealthReports: [
                        { id: 'repo-root', path: repoRootReportPath, expectedStatus: 'healthy' },
                        {
                            id: 'artifacts-relative',
                            path: artifactsRelativePath,
                            expectedStatus: 'healthy',
                        },
                        {
                            id: 'basename-fallback',
                            path: basenameFallbackPath,
                            expectedStatus: 'healthy',
                        },
                        { id: 'missing-report', path: missingPath, expectedStatus: 'healthy' },
                        { id: 'skip-empty', path: '', expectedStatus: 'healthy' },
                    ],
                },
            });

            const { reports } = loadGovernanceEvidence({
                artifactsDir,
                repoRoot: tempRepoRoot,
            });

            expect(reports).toEqual({
                [repoRootReportPath]: {
                    status: 'healthy',
                    alerts: [{ indicator: 'startupFailures', status: 'healthy', value: 0 }],
                },
                [artifactsRelativePath]: {
                    status: 'healthy',
                    alerts: [{ indicator: 'peerFailures', status: 'healthy', value: 0 }],
                },
                [basenameFallbackPath]: {
                    status: 'healthy',
                    alerts: [{ indicator: 'ipcRejected', status: 'healthy', value: 0 }],
                },
                [missingPath]: null,
            });
        } finally {
            fs.rmSync(tempDir, {
                force: true,
                recursive: true,
            });
        }
    });

    it('validates manifest shape, artifact policy, governed selection, and report-entry requirements', () => {
        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest: null,
                reports: {},
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toEqual(['Governance evidence manifest must be a JSON object.']);

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest: {
                    release: {
                        releaseHealthReports: [
                            {
                                id: 'healthy-baseline',
                                path: 'artifacts/governance/healthy.release-health.report.json',
                            },
                        ],
                    },
                },
                reports: {
                    'artifacts/governance/healthy.release-health.report.json': createReport(),
                },
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toContain('Governance evidence manifest must define artifactPolicy.');

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest: {
                    artifactPolicy: {
                        artifactName: 'wrong-name',
                        retentionDays: 29.5,
                    },
                    release: {
                        releaseHealthReports: [
                            {
                                id: 'healthy-baseline',
                                path: 'artifacts/governance/healthy.release-health.report.json',
                            },
                        ],
                    },
                },
                reports: {
                    'artifacts/governance/healthy.release-health.report.json': createReport(),
                },
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toEqual(
            expect.arrayContaining([
                'Governance evidence manifest must retain the governance-evidence artifact name.',
                'Governance evidence retention must be at least 30 days.',
            ])
        );

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest: {
                    artifactPolicy: {
                        artifactName: 'governance-evidence',
                        retentionDays: 30,
                    },
                    release: {},
                },
                reports: {},
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toContain('Governance evidence manifest must enumerate releaseHealthReports.');

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest: {
                    artifactPolicy: {
                        artifactName: 'governance-evidence',
                        retentionDays: 30,
                    },
                    release: {
                        releaseHealthReports: [{ id: 'warning-only', expectedStatus: 'warning' }],
                    },
                },
                reports: {},
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toContain(
            'Governance evidence manifest must include at least one governed healthy release-health report.'
        );

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest: {
                    artifactPolicy: {
                        artifactName: 'governance-evidence',
                        retentionDays: 30,
                    },
                    release: {
                        releaseHealthReports: [
                            {
                                id: 'missing-path',
                                expectedStatus: 'healthy',
                            },
                            {
                                id: 'empty-alerts',
                                path: 'artifacts/governance/empty-alerts.release-health.report.json',
                                expectedStatus: 'healthy',
                            },
                        ],
                    },
                },
                reports: {
                    'artifacts/governance/empty-alerts.release-health.report.json': {
                        status: 'healthy',
                        summary: createSummary(),
                        alerts: [],
                    },
                },
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toEqual(
            expect.arrayContaining([
                'Governance evidence report missing-path must define a path.',
                'Governance evidence report empty-alerts must expose alert entries.',
            ])
        );
    });

    it('treats omitted expectedStatus as governed and only allowlists recoveryRequests warnings by default', () => {
        const manifest = {
            artifactPolicy: {
                artifactName: 'governance-evidence',
                retentionDays: 30,
            },
            release: {
                releaseHealthReports: [
                    {
                        id: 'default-governed',
                        path: 'artifacts/governance/default-governed.release-health.report.json',
                    },
                ],
            },
        };
        const reports = {
            'artifacts/governance/default-governed.release-health.report.json': createReport({
                recoveryRequests: 1,
                startupFailures: 1,
            }),
        };

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest,
                reports,
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toEqual([
            'Governance evidence report default-governed contains non-healthy indicators: startupFailures:incident:1.',
            'Governance evidence report default-governed is in incident state.',
        ]);

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest,
                reports,
                operationsSnapshot: OPERATIONS_SNAPSHOT,
                allowedWarningIndicators: [],
            })
        ).toEqual([
            'Governance evidence report default-governed contains non-healthy indicators: startupFailures:incident:1, recoveryRequests:warning:1.',
            'Governance evidence report default-governed is in incident state.',
        ]);
    });

    it('fails when a retained report drifts from recomputed thresholds or drill expectations', () => {
        const manifest = {
            artifactPolicy: {
                artifactName: 'governance-evidence',
                retentionDays: 30,
            },
            release: {
                releaseHealthReports: [
                    {
                        id: 'healthy-baseline',
                        path: 'artifacts/governance/healthy.release-health.report.json',
                        expectedStatus: 'healthy',
                    },
                    {
                        id: 'network-recovery',
                        path: 'artifacts/governance/network-recovery.release-health.report.json',
                        expectedStatus: 'warning',
                    },
                ],
            },
        };
        const driftedHealthy = createReport();
        driftedHealthy.alerts = driftedHealthy.alerts.map((alert) =>
            alert.indicator === 'startupFailures' ? { ...alert, warningMax: 1 } : alert
        ) as typeof driftedHealthy.alerts;
        driftedHealthy.status = 'warning';

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest,
                reports: {
                    'artifacts/governance/healthy.release-health.report.json': driftedHealthy,
                    'artifacts/governance/network-recovery.release-health.report.json':
                        createReport(),
                },
                operationsSnapshot: OPERATIONS_SNAPSHOT,
            })
        ).toEqual(
            expect.arrayContaining([
                'Governance evidence report healthy-baseline declared status warning but recomputed as healthy.',
                'Governance evidence report healthy-baseline drifted on alert startupFailures.',
                'Governance evidence report network-recovery expected status warning but recomputed as healthy.',
            ])
        );
    });
});
