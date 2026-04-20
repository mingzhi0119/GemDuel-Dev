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
});
