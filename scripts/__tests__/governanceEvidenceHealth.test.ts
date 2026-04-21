// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import {
    collectGovernanceEvidenceHealthErrors,
    loadGovernanceEvidence,
} from '../governanceEvidenceHealth.js';

const repoRoot = process.cwd();

const writeJson = (filePath: string, value: unknown) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
};

describe('governance evidence health', () => {
    it('accepts exported governance evidence when the retained baseline stays healthy', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-evidence-health-'));
        const distDir = path.join(tempDir, 'dist');
        const assetsDir = path.join(distDir, 'assets');
        const outDir = path.join(tempDir, 'artifacts');

        fs.mkdirSync(assetsDir, {
            recursive: true,
        });
        fs.writeFileSync(path.join(assetsDir, 'index-main.js'), 'x'.repeat(620 * 1024), 'utf8');

        try {
            execFileSync(
                'node',
                [
                    'scripts/export-governance-artifacts.mjs',
                    '--out-dir',
                    outDir,
                    '--dist-dir',
                    distDir,
                ],
                {
                    cwd: repoRoot,
                    encoding: 'utf8',
                }
            );

            const { manifest, reports } = loadGovernanceEvidence({
                artifactsDir: outDir,
                repoRoot,
            });

            expect(
                collectGovernanceEvidenceHealthErrors({
                    manifest,
                    reports,
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
                    'artifacts/governance/healthy-baseline.release-health.report.json': {
                        status: 'incident',
                        alerts: [
                            {
                                indicator: 'startupFailures',
                                status: 'incident',
                                value: 1,
                            },
                        ],
                    },
                },
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
                        'artifacts/governance/healthy-baseline.release-health.report.json': {
                            status: 'healthy',
                            alerts: [
                                {
                                    indicator: 'startupFailures',
                                    status: 'healthy',
                                    value: 0,
                                },
                            ],
                        },
                    },
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
                    'artifacts/governance/healthy.release-health.report.json': {
                        status: 'healthy',
                        alerts: [{ indicator: 'startupFailures', status: 'healthy', value: 0 }],
                    },
                },
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
                    'artifacts/governance/healthy.release-health.report.json': {
                        status: 'healthy',
                        alerts: [{ indicator: 'startupFailures', status: 'healthy', value: 0 }],
                    },
                },
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
                        alerts: [],
                    },
                },
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
            'artifacts/governance/default-governed.release-health.report.json': {
                status: 'healthy',
                alerts: [
                    {
                        indicator: 'recoveryRequests',
                        status: 'warning',
                        value: 1,
                    },
                    {
                        indicator: 'startupFailures',
                        status: 'warning',
                        value: 1,
                    },
                ],
            },
        };

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest,
                reports,
            })
        ).toEqual([
            'Governance evidence report default-governed contains non-healthy indicators: startupFailures:warning:1.',
        ]);

        expect(
            collectGovernanceEvidenceHealthErrors({
                manifest,
                reports,
                allowedWarningIndicators: [],
            })
        ).toEqual([
            'Governance evidence report default-governed contains non-healthy indicators: recoveryRequests:warning:1, startupFailures:warning:1.',
        ]);
    });
});
