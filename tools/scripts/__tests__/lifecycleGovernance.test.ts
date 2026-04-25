// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
    SEAL_COVERAGE_EXCLUSIONS,
    SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
} from '@gemduel/config-vitest/seal-exclusions';
import { buildAuditGateSummary, collectAuditGateSummaryErrors } from '../auditGateSummary.js';
import {
    buildLifecycleCertificationReport,
    buildBranchCoverageSummary,
} from '../lifecycleCertification.js';
import { buildLifecycleDashboardReport } from '../lifecycleDashboard.js';
import { collectBenchmarkReportErrors } from '../lifecycleBenchmarks.js';
import { collectChangelogGovernanceErrors } from '../changelogGovernance.js';
import { collectCodeownersGovernanceErrors } from '../codeownersGovernance.js';
import { buildLifecycleGovernanceReport } from '../lifecycleGovernanceReport.js';
import {
    collectRepoSettingsLiveDriftErrors,
    collectRepoSettingsSnapshotErrors,
} from '../repoSettingsGovernance.js';
import { GOVERNANCE_DOC_PATHS } from '../governanceDocPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

const readText = (relativePath: string) =>
    fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const readJson = (relativePath: string) => JSON.parse(readText(relativePath));

const packageJson = readJson('package.json');
const repoSettingsSnapshot = readJson('tools/governance/repo-settings.snapshot.json');
const codeownersRoleMap = readJson('tools/governance/codeowners-role-map.snapshot.json');
const boundaryRegistry = readJson('tools/governance/boundary-registry.snapshot.json');
const releaseChangelogSnapshot = readJson('tools/governance/release-changelog.snapshot.json');
const benchmarkBaseline = readJson('tools/governance/benchmark-baselines.snapshot.json');
const auditGateSnapshot = readJson('tools/governance/audit-gates.snapshot.json');
const dashboardSnapshot = readJson('tools/governance/lifecycle-dashboard.snapshot.json');
const certificationSnapshot = readJson('tools/governance/lifecycle-certification.snapshot.json');
const sealExclusionReviewSnapshot = readJson(
    'tools/governance/seal-exclusions-review.snapshot.json'
);
const workflowTexts = Object.fromEntries(
    Object.keys(auditGateSnapshot.workflowCommands).map((workflowPath) => [
        workflowPath,
        readText(workflowPath),
    ])
);
const coverageFixture = {
    'fixture.js': {
        b: {
            0: [1, 1],
        },
    },
};

describe('lifecycle governance', () => {
    it('accepts the committed lifecycle governance snapshots and docs', () => {
        expect(
            collectRepoSettingsSnapshotErrors({
                snapshot: repoSettingsSnapshot,
                checklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
            })
        ).toEqual([]);

        expect(
            collectCodeownersGovernanceErrors({
                codeownersText: readText('.github/CODEOWNERS'),
                roleMap: codeownersRoleMap,
                boundaryRegistry,
                contributingText: readText('CONTRIBUTING.md'),
            })
        ).toEqual([]);

        expect(
            collectChangelogGovernanceErrors({
                changelogText: readText('CHANGELOG.md'),
                releaseSnapshot: releaseChangelogSnapshot,
                packageJson,
            })
        ).toEqual([]);

        const auditGateSummary = buildAuditGateSummary({
            gateSnapshot: auditGateSnapshot,
            packageJson,
            workflowTexts,
        });
        expect(
            collectAuditGateSummaryErrors({
                gateSnapshot: auditGateSnapshot,
                summary: auditGateSummary,
            })
        ).toEqual([]);
    });

    it('reports known live GitHub drift without mutating settings', () => {
        expect(
            collectRepoSettingsLiveDriftErrors({
                snapshot: repoSettingsSnapshot,
                liveState: {
                    branchProtectionAvailable: false,
                    branchProtection: null,
                    rulesetsAvailable: true,
                    rulesets: [],
                    vulnerabilityAlertsEnabled: false,
                },
            })
        ).toEqual([
            'GitHub default branch main is not protected.',
            'GitHub rulesets are missing an active branch ruleset.',
            'GitHub rulesets are missing an active tag ruleset.',
            'GitHub vulnerability alerts are disabled or unavailable.',
        ]);
    });

    it('rejects missing role mappings, changelog sections, and workflow gates', () => {
        expect(
            collectCodeownersGovernanceErrors({
                codeownersText: readText('.github/CODEOWNERS'),
                roleMap: {
                    ...codeownersRoleMap,
                    boundaryRoleMappings: codeownersRoleMap.boundaryRoleMappings.slice(1),
                },
                boundaryRegistry,
                contributingText: readText('CONTRIBUTING.md'),
            })
        ).toContain('CODEOWNERS role map is missing boundary owner role Frontend + Domain Logic.');

        expect(
            collectChangelogGovernanceErrors({
                changelogText: '# Changelog\n',
                releaseSnapshot: releaseChangelogSnapshot,
                packageJson,
            })
        ).toContain('CHANGELOG.md is missing release heading v5.2.11 - 2025-12-31.');

        const driftedSummary = buildAuditGateSummary({
            gateSnapshot: auditGateSnapshot,
            packageJson: {
                scripts: {},
            },
            workflowTexts: {},
        });
        expect(
            collectAuditGateSummaryErrors({
                gateSnapshot: auditGateSnapshot,
                summary: driftedSummary,
            })
        ).toEqual(
            expect.arrayContaining([
                'Root package.json is missing script lint.',
                '.github/workflows/governance.yml is missing gate command pnpm run repo-settings:check.',
            ])
        );
    });

    it('guards benchmark baselines and lifecycle report composition', () => {
        expect(
            collectBenchmarkReportErrors({
                baseline: benchmarkBaseline,
                report: {
                    benchmarks: benchmarkBaseline.benchmarks.map((benchmark: { id: string }) => ({
                        id: benchmark.id,
                        medianMs: 0.001,
                        p95Ms: 0.002,
                    })),
                },
            })
        ).toEqual([]);

        expect(
            collectBenchmarkReportErrors({
                baseline: benchmarkBaseline,
                report: {
                    benchmarks: [
                        {
                            id: 'reducer-init',
                            medianMs: 99,
                            p95Ms: 999,
                        },
                    ],
                },
            })
        ).toEqual(
            expect.arrayContaining([
                'Benchmark reducer-init median 99ms exceeded 8ms.',
                'Benchmark reducer-init p95 999ms exceeded 20ms.',
                'Benchmark report is missing ai-action.',
            ])
        );

        const report = buildLifecycleGovernanceReport({
            generatedAt: '2026-04-25T00:00:00.000Z',
            packageJson,
            repoSettingsSnapshot,
            repoSettingsChecklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
            codeownersText: readText('.github/CODEOWNERS'),
            codeownersRoleMap,
            boundaryRegistry,
            contributingText: readText('CONTRIBUTING.md'),
            changelogText: readText('CHANGELOG.md'),
            releaseChangelogSnapshot,
            benchmarkBaseline,
            auditGateSnapshot,
            dashboardSnapshot,
            sealExclusions: SEAL_COVERAGE_EXCLUSIONS,
            sealExclusionPolicy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
            sealExclusionReviewSnapshot,
            repoRoot,
            workflowTexts,
        });

        expect(report.status).toBe('passed');
        expect(report.summary.passed).toBe(7);
    });

    it('builds a complete lifecycle dashboard and 10/10 local certification', () => {
        const auditGateSummary = buildAuditGateSummary({
            gateSnapshot: auditGateSnapshot,
            packageJson,
            workflowTexts,
        });
        const auditGateReport = {
            ...auditGateSummary,
            generatedAt: '2026-04-25T00:00:00.000Z',
            status: 'passed',
            errors: [],
        };
        const lifecycleReport = buildLifecycleGovernanceReport({
            generatedAt: '2026-04-25T00:00:00.000Z',
            packageJson,
            repoSettingsSnapshot,
            repoSettingsChecklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
            codeownersText: readText('.github/CODEOWNERS'),
            codeownersRoleMap,
            boundaryRegistry,
            contributingText: readText('CONTRIBUTING.md'),
            changelogText: readText('CHANGELOG.md'),
            releaseChangelogSnapshot,
            benchmarkBaseline,
            auditGateSnapshot,
            dashboardSnapshot,
            sealExclusions: SEAL_COVERAGE_EXCLUSIONS,
            sealExclusionPolicy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
            sealExclusionReviewSnapshot,
            repoRoot,
            workflowTexts,
        });
        const benchmarkReport = {
            status: 'passed',
            errors: [],
            benchmarks: benchmarkBaseline.benchmarks.map((benchmark: { id: string }) => ({
                id: benchmark.id,
                medianMs: 0.001,
                p95Ms: 0.002,
            })),
        };
        const dashboard = buildLifecycleDashboardReport({
            generatedAt: '2026-04-25T00:00:00.000Z',
            dashboardSnapshot,
            lifecycleReport,
            auditGateReport,
            benchmarkBaseline,
            benchmarkReport,
            bundleBudgetReport: {
                status: 'healthy',
                budget: {
                    observed: 250,
                },
            },
            coverageSummary: buildBranchCoverageSummary({
                coverageFinal: coverageFixture,
                minimumPercent: auditGateSnapshot.coverage.branchMinimumPercent,
            }),
            architectureBudgetSummary: {
                errors: 0,
                warnings: 0,
            },
            sealReviewSummary: {
                errors: 0,
                count: SEAL_COVERAGE_EXCLUSIONS.length,
                baselineCount: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY.baselineCount,
            },
            dependencySbomSnapshot: readJson('tools/governance/dependency-sbom.snapshot.json'),
            licenseAllowlist: readJson('tools/governance/dependency-license-allowlist.json'),
            requireCompleteEvidence: true,
        });
        const certification = buildLifecycleCertificationReport({
            generatedAt: '2026-04-25T00:00:00.000Z',
            packageJson,
            certificationSnapshot,
            lifecycleReport,
            auditGateReport,
            dashboardReport: dashboard,
        });

        expect(dashboard.status).toBe('passed');
        expect(dashboard.completeness).toBe('complete');
        expect(certification.status).toBe('passed');
        expect(certification.localScore.score).toBe(10);
    });
});
