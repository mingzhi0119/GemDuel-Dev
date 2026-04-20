// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

describe('governance artifact exporter', () => {
    it('exports retained release-health reports, a manifest, and a bundle budget report', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-artifacts-'));
        const distDir = path.join(tempDir, 'dist');
        const assetsDir = path.join(distDir, 'assets');
        const outDir = path.join(tempDir, 'artifacts');

        fs.mkdirSync(assetsDir, {
            recursive: true,
        });
        fs.writeFileSync(path.join(assetsDir, 'index-main.js'), 'x'.repeat(720 * 1024), 'utf8');

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

            expect(manifest.releaseHealthReports).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: 'healthy-baseline',
                        status: 'healthy',
                    }),
                ])
            );
            expect(healthyBaseline.retention).toEqual(
                expect.objectContaining({
                    artifactName: 'governance-evidence',
                    retentionDays: 14,
                })
            );
            expect(bundleBudget.status).toBe('warning');
        } finally {
            fs.rmSync(tempDir, {
                force: true,
                recursive: true,
            });
        }
    });
});
