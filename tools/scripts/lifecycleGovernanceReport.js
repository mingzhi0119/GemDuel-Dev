import { collectAuditGateSummaryErrors, buildAuditGateSummary } from './auditGateSummary.js';
import { collectBenchmarkBaselineErrors } from './lifecycleBenchmarks.js';
import { collectChangelogGovernanceErrors } from './changelogGovernance.js';
import { collectCodeownersGovernanceErrors } from './codeownersGovernance.js';
import { collectLifecycleDashboardSnapshotErrors } from './lifecycleDashboard.js';
import { collectRepoSettingsSnapshotErrors } from './repoSettingsGovernance.js';
import { collectSealCoverageExclusionGovernanceErrors } from './sealExclusionGovernance.js';

const statusFromIssues = (issues) => (issues.length === 0 ? 'passed' : 'failed');

export const buildLifecycleGovernanceReport = ({
    generatedAt,
    packageJson,
    repoSettingsSnapshot,
    repoSettingsChecklistText,
    codeownersText,
    codeownersRoleMap,
    boundaryRegistry,
    contributingText,
    changelogText,
    releaseChangelogSnapshot,
    benchmarkBaseline,
    auditGateSnapshot,
    dashboardSnapshot,
    sealExclusions,
    sealExclusionPolicy,
    sealExclusionReviewSnapshot,
    repoRoot = process.cwd(),
    workflowTexts,
    provenance = {},
}) => {
    const repoSettingsIssues = collectRepoSettingsSnapshotErrors({
        snapshot: repoSettingsSnapshot,
        checklistText: repoSettingsChecklistText,
    });
    const codeownersIssues = collectCodeownersGovernanceErrors({
        codeownersText,
        roleMap: codeownersRoleMap,
        boundaryRegistry,
        contributingText,
    });
    const changelogIssues = collectChangelogGovernanceErrors({
        changelogText,
        releaseSnapshot: releaseChangelogSnapshot,
        packageJson,
    });
    const benchmarkIssues = collectBenchmarkBaselineErrors(benchmarkBaseline);
    const sealExclusionIssues =
        sealExclusions && sealExclusionPolicy && sealExclusionReviewSnapshot
            ? collectSealCoverageExclusionGovernanceErrors({
                  exclusions: sealExclusions,
                  policy: sealExclusionPolicy,
                  reviewSnapshot: sealExclusionReviewSnapshot,
                  repoRoot,
              })
            : ['Lifecycle governance report must receive seal exclusion review evidence.'];
    const dashboardIssues = collectLifecycleDashboardSnapshotErrors(dashboardSnapshot);
    const auditGateSummary = buildAuditGateSummary({
        gateSnapshot: auditGateSnapshot,
        packageJson,
        workflowTexts,
    });
    const auditGateIssues = collectAuditGateSummaryErrors({
        gateSnapshot: auditGateSnapshot,
        summary: auditGateSummary,
    });
    const sections = [
        {
            id: 'repo-settings',
            title: 'Repo Settings Desired State',
            status: statusFromIssues(repoSettingsIssues),
            issues: repoSettingsIssues,
            evidenceRefs: ['tools/governance/repo-settings.snapshot.json'],
        },
        {
            id: 'codeowners',
            title: 'CODEOWNERS Role Map',
            status: statusFromIssues(codeownersIssues),
            issues: codeownersIssues,
            evidenceRefs: [
                'tools/governance/codeowners-role-map.snapshot.json',
                '.github/CODEOWNERS',
            ],
        },
        {
            id: 'release-changelog',
            title: 'Release Changelog Coverage',
            status: statusFromIssues(changelogIssues),
            issues: changelogIssues,
            evidenceRefs: ['tools/governance/release-changelog.snapshot.json', 'CHANGELOG.md'],
        },
        {
            id: 'benchmark-baseline',
            title: 'Lifecycle Benchmark Baseline',
            status: statusFromIssues(benchmarkIssues),
            issues: benchmarkIssues,
            evidenceRefs: ['tools/governance/benchmark-baselines.snapshot.json'],
        },
        {
            id: 'seal-exclusion-review',
            title: 'Seal Exclusion Review Metadata',
            status: statusFromIssues(sealExclusionIssues),
            issues: sealExclusionIssues,
            evidenceRefs: [
                'tools/governance/seal-exclusions-review.snapshot.json',
                'packages/config-vitest/sealExclusions.js',
            ],
        },
        {
            id: 'lifecycle-dashboard',
            title: 'Lifecycle Dashboard Contract',
            status: statusFromIssues(dashboardIssues),
            issues: dashboardIssues,
            evidenceRefs: ['tools/governance/lifecycle-dashboard.snapshot.json'],
        },
        {
            id: 'audit-gates',
            title: 'Lifecycle Gate Summary',
            status: statusFromIssues(auditGateIssues),
            issues: auditGateIssues,
            evidenceRefs: ['tools/governance/audit-gates.snapshot.json'],
            summary: auditGateSummary,
        },
    ];
    const allIssues = sections.flatMap((section) =>
        section.issues.map((issue) => `${section.id}: ${issue}`)
    );

    return {
        schemaVersion: 1,
        generatedAt,
        provenance,
        status: statusFromIssues(allIssues),
        packageVersion: packageJson.version,
        scopeAnchor:
            repoSettingsSnapshot.scope?.scopeAnchor ?? auditGateSnapshot.scopeAnchor ?? null,
        sections,
        summary: {
            sections: sections.length,
            passed: sections.filter((section) => section.status === 'passed').length,
            failed: sections.filter((section) => section.status === 'failed').length,
            issues: allIssues.length,
        },
        issues: allIssues,
    };
};

export const renderLifecycleGovernanceMarkdown = (report) => {
    const lines = [
        '# Lifecycle Governance Report',
        '',
        `- Generated: ${report.generatedAt}`,
        `- Package version: ${report.packageVersion}`,
        `- Status: ${report.status}`,
        `- Scope anchor: ${report.scopeAnchor}`,
        '',
        '| Area | Status | Evidence |',
        '| --- | --- | --- |',
    ];

    for (const section of report.sections) {
        lines.push(
            `| ${section.title} | ${section.status} | ${section.evidenceRefs.map((ref) => `\`${ref}\``).join(', ')} |`
        );
    }

    if (report.issues.length > 0) {
        lines.push('', '## Issues');
        for (const issue of report.issues) {
            lines.push(`- ${issue}`);
        }
    }

    lines.push('');
    return `${lines.join('\n')}\n`;
};
