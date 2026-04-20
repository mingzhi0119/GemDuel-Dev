// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { collectReleaseTagProvenanceErrors, createGitRunner } from '../releaseTagProvenance.js';

const createTempGitRepo = () => {
    const repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-provenance-'));
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
    fs.writeFileSync(path.join(repoDir, 'README.md'), '# release provenance\n', 'utf8');
    git(['add', 'README.md']);
    git(['commit', '-m', 'initial']);
    const mainSha = git(['rev-parse', 'HEAD']);
    git(['update-ref', 'refs/remotes/origin/main', mainSha]);

    return {
        repoDir,
        git,
        mainSha,
    };
};

describe('release tag provenance', () => {
    it('rejects missing tag refs, missing commit SHAs, and missing default branches', () => {
        expect(
            collectReleaseTagProvenanceErrors({
                commitSha: '',
                defaultBranch: '',
                releaseRef: 'refs/heads/main',
                git: () => '',
            })
        ).toEqual([
            'Release provenance check requires a tag ref (refs/tags/*).',
            'Release provenance check requires a commit SHA.',
            'Release provenance check requires a default branch name.',
        ]);
    });

    it('rejects releases when the default branch ref is unavailable locally', () => {
        expect(
            collectReleaseTagProvenanceErrors({
                commitSha: 'abc123',
                defaultBranch: 'main',
                releaseRef: 'refs/tags/v5.2.11',
                git: () => {
                    throw new Error('missing remote ref');
                },
            })
        ).toEqual(['Default branch ref refs/remotes/origin/main is not available locally.']);
    });

    it('accepts release tags that point to commits reachable from the default branch and rejects off-branch tags', () => {
        const { repoDir, git, mainSha } = createTempGitRepo();

        try {
            const gitRunner = createGitRunner(repoDir);
            expect(
                collectReleaseTagProvenanceErrors({
                    commitSha: mainSha,
                    defaultBranch: 'main',
                    releaseRef: 'refs/tags/v5.2.11',
                    git: gitRunner,
                })
            ).toEqual([]);

            git(['checkout', '-b', 'feature/release-drift']);
            fs.writeFileSync(path.join(repoDir, 'README.md'), '# drifted release\n', 'utf8');
            git(['add', 'README.md']);
            git(['commit', '-m', 'feature only']);
            const featureSha = git(['rev-parse', 'HEAD']);

            expect(
                collectReleaseTagProvenanceErrors({
                    commitSha: featureSha,
                    defaultBranch: 'main',
                    releaseRef: 'refs/tags/v5.2.12',
                    git: gitRunner,
                })
            ).toContain(
                `Release commit ${featureSha} is not reachable from refs/remotes/origin/main.`
            );
        } finally {
            fs.rmSync(repoDir, {
                force: true,
                recursive: true,
            });
        }
    }, 15000);
});
