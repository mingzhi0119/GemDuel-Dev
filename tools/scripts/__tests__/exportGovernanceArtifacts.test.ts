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

describe('governance artifact exporter', () => {
    it('exports retained release-health reports, a manifest, and a bundle budget report', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-artifacts-'));
        const distDir = path.join(tempDir, 'dist');
        const assetsDir = path.join(distDir, 'assets');
        const outDir = path.join(tempDir, 'artifacts');

        fs.mkdirSync(assetsDir, {
            recursive: true,
        });
        fs.writeFileSync(path.join(assetsDir, 'index-main.js'), 'x'.repeat(650 * 1024), 'utf8');

        try {
            execFileSync(
                'node',
                [
                    'tools/scripts/export-governance-artifacts.mjs',
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

            expect(manifest.manifestVersion).toBe(2);
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
                ])
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
