// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const operationsSnapshot = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'electron', 'governance', 'release-health-operations.snapshot.json'),
        'utf8'
    )
);
const defaultGovernanceArtifactsDir = path.resolve(
    repoRoot,
    operationsSnapshot.artifactPolicy.outputDirectory
);
const defaultDistDir = path.join(repoRoot, 'dist');

const runNode = (args: string[]) =>
    spawnSync('node', args, {
        cwd: repoRoot,
        encoding: 'utf8',
    });

const createDistDir = (sizeKb: number) => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-cli-dist-'));
    const distDir = path.join(tempDir, 'dist');
    const assetsDir = path.join(distDir, 'assets');

    fs.mkdirSync(assetsDir, {
        recursive: true,
    });
    fs.writeFileSync(path.join(assetsDir, 'index-main.js'), 'x'.repeat(sizeKb * 1024), 'utf8');

    return {
        tempDir,
        distDir,
    };
};

const withReplacedRepoPath = (
    targetPath: string,
    setup: (targetPath: string) => void,
    run: () => void
) => {
    const backupPath = `${targetPath}.codex-backup-${Date.now()}`;
    const hadExistingPath = fs.existsSync(targetPath);

    if (hadExistingPath) {
        fs.renameSync(targetPath, backupPath);
    }

    fs.mkdirSync(path.dirname(targetPath), {
        recursive: true,
    });

    try {
        setup(targetPath);
        run();
    } finally {
        fs.rmSync(targetPath, {
            force: true,
            recursive: true,
        });

        if (hadExistingPath) {
            fs.renameSync(backupPath, targetPath);
        }
    }
};

const writeGovernanceArtifacts = (outDir: string, sizeKb = 620) => {
    const { tempDir, distDir } = createDistDir(sizeKb);

    try {
        execFileSync(
            'node',
            ['scripts/export-governance-artifacts.mjs', '--out-dir', outDir, '--dist-dir', distDir],
            {
                cwd: repoRoot,
                encoding: 'utf8',
            }
        );
    } finally {
        fs.rmSync(tempDir, {
            force: true,
            recursive: true,
        });
    }
};

const writeUnhealthyGovernanceArtifacts = (outDir: string) => {
    fs.mkdirSync(outDir, {
        recursive: true,
    });

    fs.writeFileSync(
        path.join(outDir, 'governance-evidence.manifest.json'),
        JSON.stringify(
            {
                artifactPolicy: {
                    artifactName: 'governance-evidence',
                    retentionDays: 30,
                },
                release: {
                    releaseHealthReports: [
                        {
                            id: 'healthy-baseline',
                            path: 'healthy-baseline.release-health.report.json',
                            expectedStatus: 'healthy',
                        },
                    ],
                },
            },
            null,
            2
        ),
        'utf8'
    );
    fs.writeFileSync(
        path.join(outDir, 'healthy-baseline.release-health.report.json'),
        JSON.stringify(
            {
                status: 'incident',
                summary: {
                    startedAt: null,
                    lastEventAt: null,
                    totalEvents: 0,
                    severityCounts: {
                        info: 0,
                        warn: 0,
                        error: 1,
                    },
                    indicators: {
                        startupFailures: 1,
                        runtimeConfigFailures: 0,
                        updaterFailures: 0,
                        peerFailures: 0,
                        recoveryRequests: 0,
                        ipcRejected: 0,
                    },
                    reasonCodeCounts: {},
                    counters: {},
                    recentEvents: [],
                },
                alerts: [
                    {
                        indicator: 'startupFailures',
                        status: 'incident',
                        value: 1,
                    },
                ],
            },
            null,
            2
        ),
        'utf8'
    );
};

describe('governance CLI wrappers', () => {
    it('runs the build-budget wrapper against the default dist directory when the bundle stays healthy', () => {
        const distAlreadyPresent = fs.existsSync(defaultDistDir);

        if (!distAlreadyPresent) {
            fs.mkdirSync(path.join(defaultDistDir, 'assets'), {
                recursive: true,
            });
            fs.writeFileSync(
                path.join(defaultDistDir, 'assets', 'runtime-core.js'),
                'x'.repeat(220 * 1024),
                'utf8'
            );
        }

        try {
            const result = runNode(['scripts/check-build-budget.mjs']);

            expect(result.status).toBe(0);
            expect(result.stdout).toContain('Build budget check passed:');
        } finally {
            if (!distAlreadyPresent) {
                fs.rmSync(defaultDistDir, {
                    force: true,
                    recursive: true,
                });
            }
        }
    });

    it('surfaces warning, incident, and missing-dist outcomes from the build-budget wrapper', () => {
        const warningBuild = createDistDir(650);
        const incidentBuild = createDistDir(750);
        const missingDistDir = path.join(os.tmpdir(), `missing-dist-${Date.now()}`);

        try {
            const warningResult = runNode([
                'scripts/check-build-budget.mjs',
                '--dist-dir',
                warningBuild.distDir,
            ]);
            expect(warningResult.status).toBe(0);
            expect(warningResult.stderr).toContain('Build budget warning:');

            const incidentResult = runNode([
                'scripts/check-build-budget.mjs',
                '--dist-dir',
                incidentBuild.distDir,
            ]);
            expect(incidentResult.status).toBe(1);
            expect(incidentResult.stderr).toContain('Build budget check failed:');

            const missingResult = runNode([
                'scripts/check-build-budget.mjs',
                '--dist-dir',
                missingDistDir,
            ]);
            expect(missingResult.status).toBe(1);
            expect(missingResult.stderr).toContain('does not exist');
        } finally {
            fs.rmSync(warningBuild.tempDir, {
                force: true,
                recursive: true,
            });
            fs.rmSync(incidentBuild.tempDir, {
                force: true,
                recursive: true,
            });
        }
    });

    it('uses the default governance artifact directory when the retained evidence is healthy', () => {
        withReplacedRepoPath(
            defaultGovernanceArtifactsDir,
            (targetPath) => {
                writeGovernanceArtifacts(targetPath);
            },
            () => {
                const result = runNode(['scripts/check-governance-evidence-health.mjs']);

                expect(result.status).toBe(0);
                expect(result.stdout).toContain(
                    `Governance evidence health check passed for ${defaultGovernanceArtifactsDir}.`
                );
            }
        );
    });

    it('fails the governance evidence wrapper when the retained report drifts out of healthy status', () => {
        const tempArtifactsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-wrapper-'));

        try {
            writeUnhealthyGovernanceArtifacts(tempArtifactsDir);

            const result = runNode([
                'scripts/check-governance-evidence-health.mjs',
                '--artifacts-dir',
                tempArtifactsDir,
            ]);

            expect(result.status).toBe(1);
            expect(result.stderr).toContain('Governance evidence health check failed:');
            expect(result.stderr).toContain('startupFailures:incident:1');
        } finally {
            fs.rmSync(tempArtifactsDir, {
                force: true,
                recursive: true,
            });
        }
    });
});
