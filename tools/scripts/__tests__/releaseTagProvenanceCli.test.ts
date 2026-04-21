// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

const createTempGitRepo = () => {
    const repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-provenance-cli-'));
    const git = (args: string[]) =>
        execFileSync('git', args, {
            cwd: repoDir,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
        }).trim();

    git(['init']);
    git(['checkout', '-b', 'main']);
    git(['config', 'user.email', 'codex@example.com']);
    git(['config', 'user.name', 'Codex']);
    fs.writeFileSync(path.join(repoDir, 'README.md'), '# release provenance cli\n', 'utf8');
    git(['add', 'README.md']);
    git(['commit', '-m', 'initial']);
    const mainSha = git(['rev-parse', 'HEAD']);
    git(['update-ref', 'refs/remotes/origin/main', mainSha]);

    return {
        repoDir,
        mainSha,
    };
};

describe('release tag provenance CLI', () => {
    it('passes when the tag points to a commit reachable from origin/main', () => {
        const { repoDir, mainSha } = createTempGitRepo();

        try {
            const result = spawnSync(
                'node',
                [
                    'tools/scripts/check-release-tag-provenance.mjs',
                    '--release-ref',
                    'refs/tags/v5.2.11',
                    '--default-branch',
                    'main',
                    '--commit-sha',
                    mainSha,
                    '--repo-root',
                    repoDir,
                ],
                {
                    cwd: repoRoot,
                    encoding: 'utf8',
                }
            );

            expect(result.status).toBe(0);
            expect(result.stdout).toContain(
                'Release tag provenance check passed for refs/tags/v5.2.11 against origin/main.'
            );
        } finally {
            fs.rmSync(repoDir, {
                force: true,
                recursive: true,
            });
        }
    }, 15000);

    it('fails when required provenance parameters are missing', () => {
        const result = spawnSync('node', ['tools/scripts/check-release-tag-provenance.mjs'], {
            cwd: repoRoot,
            encoding: 'utf8',
            env: {
                ...process.env,
                GITHUB_SHA: '',
                GITHUB_DEFAULT_BRANCH: '',
                GITHUB_REF: '',
            },
        });

        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Release tag provenance check failed:');
        expect(result.stderr).toContain('Release provenance check requires a tag ref');
        expect(result.stderr).toContain('Release provenance check requires a commit SHA.');
        expect(result.stderr).toContain('Release provenance check requires a default branch name.');
    });
});
