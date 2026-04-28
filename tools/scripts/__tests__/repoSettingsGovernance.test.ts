// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
    collectRepoSettingsSnapshotErrors,
    collectWorkflowSecurityErrors,
} from '../repoSettingsGovernance.js';
import { GOVERNANCE_DOC_PATHS } from '../governanceDocPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

const readText = (relativePath: string) =>
    fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const readJson = (relativePath: string) => JSON.parse(readText(relativePath));

const readWorkflowEntries = () =>
    fs
        .readdirSync(path.join(repoRoot, '.github', 'workflows'))
        .filter((fileName) => /\.(ya?ml)$/i.test(fileName))
        .sort((a, b) => a.localeCompare(b))
        .map((fileName) => {
            const relativePath = `.github/workflows/${fileName}`;
            return {
                relativePath,
                text: readText(relativePath),
            };
        });

describe('repo settings workflow governance', () => {
    it('accepts the committed repo settings snapshot, docs, and workflow security policy', () => {
        expect(
            collectRepoSettingsSnapshotErrors({
                snapshot: readJson('tools/governance/repo-settings.snapshot.json'),
                checklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
                workflowEntries: readWorkflowEntries(),
            })
        ).toEqual([]);
    });

    it('rejects tag-pinned workflow actions', () => {
        expect(
            collectWorkflowSecurityErrors({
                checklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
                workflowEntries: [
                    {
                        relativePath: '.github/workflows/example.yml',
                        text: [
                            'jobs:',
                            '    governance:',
                            '        steps:',
                            '            - uses: actions/checkout@v4',
                        ].join('\n'),
                    },
                ],
            })
        ).toContain(
            '.github/workflows/example.yml action actions/checkout@v4 must be pinned to a 40-char SHA.'
        );
    });

    it('rejects write permission outside the release publish job', () => {
        expect(
            collectWorkflowSecurityErrors({
                checklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
                workflowEntries: [
                    {
                        relativePath: '.github/workflows/build.yml',
                        text: [
                            'jobs:',
                            '    release_gates:',
                            '        permissions:',
                            '            contents: write',
                            '        steps: []',
                            '    desktop_package:',
                            '        needs: release_gates',
                            '        steps: []',
                            '    publish_release:',
                            '        needs: desktop_package',
                            '        permissions:',
                            '            contents: write',
                            '        steps: []',
                        ].join('\n'),
                    },
                ],
            })
        ).toContain(
            '.github/workflows/build.yml job release_gates must not request contents: write.'
        );

        expect(
            collectWorkflowSecurityErrors({
                checklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
                workflowEntries: [
                    {
                        relativePath: '.github/workflows/build.yml',
                        text: [
                            'permissions:',
                            '    contents: write',
                            'jobs:',
                            '    release_gates:',
                            '        steps: []',
                            '    desktop_package:',
                            '        needs: release_gates',
                            '        steps: []',
                            '    publish_release:',
                            '        needs: desktop_package',
                            '        permissions:',
                            '            contents: write',
                            '        steps: []',
                        ].join('\n'),
                    },
                ],
            })
        ).toContain('.github/workflows/build.yml must not request workflow-level contents: write.');
    });

    it('rejects release publish jobs that rerun local gates', () => {
        expect(
            collectWorkflowSecurityErrors({
                checklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
                workflowEntries: [
                    {
                        relativePath: '.github/workflows/build.yml',
                        text: [
                            'jobs:',
                            '    release_gates:',
                            '        steps: []',
                            '    desktop_package:',
                            '        needs: release_gates',
                            '        steps: []',
                            '    publish_release:',
                            '        needs: desktop_package',
                            '        permissions:',
                            '            contents: write',
                            '        steps:',
                            '            - run: pnpm release:check',
                        ].join('\n'),
                    },
                ],
            })
        ).toContain(
            '.github/workflows/build.yml job publish_release must only publish verified artifacts and must not run pnpm gates.'
        );
    });
});
