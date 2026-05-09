// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

const createTempArtifactsDir = () =>
    fs.mkdtempSync(path.join(os.tmpdir(), 'governance-dashboard-'));

describe('governance dashboard CLI', () => {
    it('fails by default when the retained evidence manifest is missing', () => {
        const artifactsDir = createTempArtifactsDir();

        try {
            const result = spawnSync(
                'node',
                ['tools/scripts/render-governance-dashboard.mjs', '--artifacts-dir', artifactsDir],
                {
                    cwd: repoRoot,
                    encoding: 'utf8',
                }
            );

            expect(result.status).toBe(1);
            expect(result.stderr).toContain(
                'Governance dashboard requires a complete evidence manifest'
            );
            expect(fs.existsSync(path.join(artifactsDir, 'governance-dashboard.html'))).toBe(false);
        } finally {
            fs.rmSync(artifactsDir, { recursive: true, force: true });
        }
    });

    it('can render an explicitly partial diagnostic dashboard without a manifest', () => {
        const artifactsDir = createTempArtifactsDir();

        try {
            const result = spawnSync(
                'node',
                [
                    'tools/scripts/render-governance-dashboard.mjs',
                    '--artifacts-dir',
                    artifactsDir,
                    '--allow-partial',
                ],
                {
                    cwd: repoRoot,
                    encoding: 'utf8',
                }
            );

            expect(result.status).toBe(0);
            const htmlPath = path.join(artifactsDir, 'governance-dashboard.html');
            expect(fs.existsSync(htmlPath)).toBe(true);
            expect(fs.readFileSync(htmlPath, 'utf8')).toContain(
                'Partial diagnostic dashboard: governance evidence manifest was not loaded.'
            );
        } finally {
            fs.rmSync(artifactsDir, { recursive: true, force: true });
        }
    });
});
