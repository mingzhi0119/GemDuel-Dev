// @vitest-environment node

import { describe, expect, it } from 'vitest';
import {
    collectReleaseChecklistProvenanceErrors,
    REQUIRED_RELEASE_CHECKLIST_COMMANDS,
    collectReleaseHealthChecklistErrors,
    getReleaseHealthIndicatorKeys,
} from '../releaseHealthChecklist.js';
import { GOVERNANCE_DOC_PATHS } from '../governanceDocPaths.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const createTempGitRepo = () => {
    const repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-health-checklist-'));
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
    fs.writeFileSync(path.join(repoDir, 'README.md'), '# release checklist\n', 'utf8');
    git(['add', 'README.md']);
    git(['commit', '-m', 'initial']);
    const mainSha = git(['rev-parse', 'HEAD']);
    git(['update-ref', 'refs/remotes/origin/main', mainSha]);

    return { repoDir, mainSha, git };
};

describe('release health checklist governance', () => {
    it('exposes the required release commands as a stable contract', () => {
        expect(REQUIRED_RELEASE_CHECKLIST_COMMANDS).toEqual([
            'npm run lint',
            'npm test',
            'npm run test:security',
            'npm run test:coverage',
            'npm run desktop:check',
            'npm run release:check',
            'npm run release:provenance:check',
            'npm run governance:evidence:check',
        ]);
    });

    it('reports missing commands, missing indicators, and missing operator snapshot guidance', () => {
        const errors = collectReleaseHealthChecklistErrors('# Release Checklist\n\n- `npm test`');

        expect(errors).toContain('Missing required checklist command npm run lint.');
        expect(errors).toContain('Missing required checklist command npm run test:security.');
        expect(errors).toContain('Checklist must link to the release-health SLO document.');
        expect(errors).toContain('Checklist must link to the fault drill runbook.');
        expect(errors).toContain(
            'Checklist must document the release-health report export script.'
        );
        expect(errors).toContain(
            'Checklist must document the retained governance artifact export script.'
        );
        expect(errors).toContain(
            'Checklist must document how operators fetch the sanitized release-health snapshot.'
        );
        expect(errors).toContain(
            `Missing release-health indicator ${getReleaseHealthIndicatorKeys()[0]}.`
        );
    });

    it('accepts a checklist that documents every command, indicator, and operator note', () => {
        const checklistText = [
            ...REQUIRED_RELEASE_CHECKLIST_COMMANDS.map((command) => `- \`${command}\``),
            ...getReleaseHealthIndicatorKeys().map((indicatorKey) => `- \`${indicatorKey}\``),
            `- \`${GOVERNANCE_DOC_PATHS.operationsSlo}\``,
            `- \`${GOVERNANCE_DOC_PATHS.operationsFaultDrills}\``,
            '- `scripts/export-release-health-report.mjs`',
            '- `scripts/export-governance-artifacts.mjs`',
            '- `window.electron.getReleaseHealthSnapshot()`',
        ].join('\n');

        expect(collectReleaseHealthChecklistErrors(checklistText)).toEqual([]);
    });

    it('skips provenance enforcement outside tag context and enforces it for tag releases', () => {
        expect(
            collectReleaseChecklistProvenanceErrors({
                commitSha: '',
                defaultBranch: '',
                releaseRef: 'refs/heads/main',
                git: () => '',
            })
        ).toEqual([]);

        const { repoDir, mainSha } = createTempGitRepo();

        try {
            expect(
                collectReleaseChecklistProvenanceErrors({
                    commitSha: mainSha,
                    defaultBranch: 'main',
                    releaseRef: 'refs/tags/v5.2.11',
                    git: (args) =>
                        execFileSync('git', args, {
                            cwd: repoDir,
                            encoding: 'utf8',
                            stdio: ['ignore', 'pipe', 'pipe'],
                        }).trim(),
                })
            ).toEqual([]);
        } finally {
            fs.rmSync(repoDir, { recursive: true, force: true });
        }
    }, 15000);
});
