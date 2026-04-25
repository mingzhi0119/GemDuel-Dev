// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');
const benchmarkBaseline = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'tools', 'governance', 'benchmark-baselines.snapshot.json'),
        'utf8'
    )
);

const writeBenchmarkReport = (outDir: string) => {
    fs.mkdirSync(outDir, {
        recursive: true,
    });
    fs.writeFileSync(
        path.join(outDir, 'lifecycle-benchmarks.report.json'),
        JSON.stringify(
            {
                schemaVersion: 1,
                status: 'passed',
                errors: [],
                benchmarks: benchmarkBaseline.benchmarks.map((benchmark: { id: string }) => ({
                    id: benchmark.id,
                    medianMs: 0.001,
                    p95Ms: 0.002,
                })),
            },
            null,
            2
        ),
        'utf8'
    );
};

const writeCoverageFixture = (tempDir: string) => {
    const coverageFile = path.join(tempDir, 'coverage-final.json');
    fs.writeFileSync(
        coverageFile,
        JSON.stringify({
            'fixture.js': {
                b: {
                    0: [1, 1],
                },
            },
        }),
        'utf8'
    );
    return coverageFile;
};

describe('governance artifact exporter', () => {
    it('exports retained release-health reports, a manifest, and a bundle budget report', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-artifacts-'));
        const distDir = path.join(tempDir, 'dist');
        const assetsDir = path.join(distDir, 'assets');
        const outDir = path.join(tempDir, 'artifacts');
        const coverageFile = writeCoverageFixture(tempDir);

        fs.mkdirSync(assetsDir, {
            recursive: true,
        });
        fs.writeFileSync(path.join(assetsDir, 'index-main.js'), 'x'.repeat(650 * 1024), 'utf8');
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

            const manifest = JSON.parse(
                fs.readFileSync(path.join(outDir, 'governance-evidence.manifest.json'), 'utf8')
            );
            const healthyBaseline = JSON.parse(
                fs.readFileSync(
                    path.join(outDir, 'healthy-baseline.release-health.report.json'),
                    'utf8'
                )
            );
            const bundleBudget = JSON.parse(
                fs.readFileSync(path.join(outDir, 'bundle-budget.report.json'), 'utf8')
            );

            expect(manifest.manifestVersion).toBe(3);
            expect(manifest.batch).toMatchObject({
                releaseVersion: '5.2.11',
            });
            expect(manifest.release.releaseHealthReports).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: 'healthy-baseline',
                        status: 'healthy',
                    }),
                ])
            );
            expect(manifest.dependency).toMatchObject({
                retiredWorkarounds: [],
                sbomSnapshot: expect.objectContaining({
                    path: 'tools/governance/dependency-sbom.snapshot.json',
                }),
                licenseAllowlist: expect.objectContaining({
                    path: 'tools/governance/dependency-license-allowlist.json',
                }),
            });
            expect(manifest.secretGovernance).toMatchObject({
                policyDocument: expect.objectContaining({
                    path: 'docs/governance/dependency-runtime-governance.md',
                }),
                runtimePolicySource: expect.objectContaining({
                    path: 'apps/desktop/electron/runtimeConfig.js',
                }),
            });
            expect(manifest.runtime.turnLifecycleSources).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        path: 'apps/desktop/electron/turnCredentialClient.js',
                    }),
                    expect.objectContaining({
                        path: 'packages/turn-service/src/turnCredentialService.js',
                    }),
                    expect.objectContaining({
                        path: 'apps/desktop/src/app/runtime/useRuntimeAppConfig.ts',
                    }),
                ])
            );
            expect(manifest.governanceAssets).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: 'dependency-sbom-snapshot',
                    }),
                    expect.objectContaining({
                        id: 'desktop-policy-snapshot',
                    }),
                    expect.objectContaining({
                        id: 'repo-settings-snapshot',
                    }),
                    expect.objectContaining({
                        id: 'audit-gates-snapshot',
                    }),
                    expect.objectContaining({
                        id: 'lifecycle-certification-snapshot',
                    }),
                    expect.objectContaining({
                        id: 'seal-exclusions-review-snapshot',
                    }),
                ])
            );
            expect(manifest.lifecycle).toMatchObject({
                status: 'passed',
                repoSettingsSnapshot: expect.objectContaining({
                    path: 'tools/governance/repo-settings.snapshot.json',
                }),
                codeownersRoleMap: expect.objectContaining({
                    path: 'tools/governance/codeowners-role-map.snapshot.json',
                }),
                releaseChangelogSnapshot: expect.objectContaining({
                    path: 'tools/governance/release-changelog.snapshot.json',
                }),
                auditGateReport: expect.objectContaining({
                    status: 'passed',
                }),
                governanceReport: expect.objectContaining({
                    status: 'passed',
                }),
                dashboardReport: expect.objectContaining({
                    status: 'passed',
                    completeness: 'complete',
                }),
                certificationReport: expect.objectContaining({
                    status: 'passed',
                }),
            });
            expect(fs.existsSync(path.join(outDir, 'audit-gates.report.json'))).toBe(true);
            expect(fs.existsSync(path.join(outDir, 'audit-gates.report.md'))).toBe(true);
            expect(fs.existsSync(path.join(outDir, 'lifecycle-governance.report.json'))).toBe(true);
            expect(fs.existsSync(path.join(outDir, 'lifecycle-governance.report.md'))).toBe(true);
            expect(fs.existsSync(path.join(outDir, 'lifecycle-governance.dashboard.json'))).toBe(
                true
            );
            expect(fs.existsSync(path.join(outDir, 'lifecycle-certification.report.json'))).toBe(
                true
            );
            expect(healthyBaseline.retention).toEqual(
                expect.objectContaining({
                    artifactName: 'governance-evidence',
                    retentionDays: 30,
                })
            );
            expect(bundleBudget.status).toBe('warning');
            expect(manifest.release.bundleBudgetReport).toEqual(
                expect.objectContaining({
                    path: expect.stringContaining('bundle-budget.report.json'),
                })
            );
        } finally {
            fs.rmSync(tempDir, {
                force: true,
                recursive: true,
            });
        }
    });
});
