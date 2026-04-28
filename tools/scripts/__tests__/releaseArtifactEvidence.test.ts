// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    buildReleaseArtifactEvidence,
    collectReleaseArtifactEvidenceErrors,
    collectReleaseArtifactFiles,
    renderReleaseArtifactEvidenceMarkdown,
} from '../releaseArtifactEvidence.js';

describe('release artifact evidence governance', () => {
    it('hashes Windows release outputs and renders checksum evidence', () => {
        const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'release-artifacts-'));
        const distDir = path.join(repoRoot, 'apps', 'desktop', 'dist_electron');
        fs.mkdirSync(distDir, { recursive: true });
        const installerPath = path.join(distDir, 'GemDuel Setup 5.2.11.exe');
        const blockmapPath = path.join(distDir, 'GemDuel Setup 5.2.11.exe.blockmap');
        fs.writeFileSync(installerPath, 'installer-bytes');
        fs.writeFileSync(blockmapPath, 'blockmap-bytes');

        try {
            const artifactFiles = collectReleaseArtifactFiles(distDir);
            const evidence = buildReleaseArtifactEvidence({
                artifactFiles,
                distDir,
                repoRoot,
                generatedAt: '2026-04-28T12:00:00.000Z',
                provenance: {
                    sha: 'abc123',
                },
                requireSigned: true,
                platform: 'win32',
                signatures: new Map([
                    [
                        installerPath,
                        {
                            checked: true,
                            status: 'Valid',
                        },
                    ],
                ]),
            });

            expect(evidence.status).toBe('passed');
            expect(evidence.artifacts).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        fileName: 'GemDuel Setup 5.2.11.exe',
                        kind: 'windows-installer',
                        sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
                        signature: expect.objectContaining({
                            status: 'Valid',
                        }),
                    }),
                ])
            );
            expect(renderReleaseArtifactEvidenceMarkdown(evidence)).toContain(
                'GemDuel Setup 5.2.11.exe'
            );
        } finally {
            fs.rmSync(repoRoot, { recursive: true, force: true });
        }
    });

    it('fails closed for tag-release evidence without valid Windows signatures', () => {
        const evidence = {
            requireSigned: true,
            platform: 'win32',
            artifacts: [
                {
                    path: 'apps/desktop/dist_electron/GemDuel Setup.exe',
                    kind: 'windows-installer',
                    signature: {
                        checked: true,
                        status: 'NotSigned',
                    },
                },
            ],
        };

        expect(collectReleaseArtifactEvidenceErrors(evidence)).toContain(
            'apps/desktop/dist_electron/GemDuel Setup.exe must have a valid Authenticode signature.'
        );
    });
});
