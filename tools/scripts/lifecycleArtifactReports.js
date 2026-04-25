import fs from 'node:fs';
import path from 'node:path';
import {
    SEAL_COVERAGE_EXCLUSIONS,
    SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
} from '@gemduel/config-vitest/seal-exclusions';
import {
    buildAuditGateSummary,
    collectAuditGateSummaryErrors,
    finalizeAuditGateSummary,
} from './auditGateSummary.js';
import { collectArchitectureBudgetResults } from './architectureBudgets.js';
import { buildBundleBudgetReport } from './buildBudgetReport.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';
import {
    buildLifecycleDashboardReport,
    renderLifecycleDashboardMarkdown,
} from './lifecycleDashboard.js';
import {
    buildBranchCoverageSummary,
    buildLifecycleCertificationReport,
    renderLifecycleCertificationMarkdown,
} from './lifecycleCertification.js';
import {
    buildLifecycleGovernanceReport,
    renderLifecycleGovernanceMarkdown,
} from './lifecycleGovernanceReport.js';

const readText = (repoRoot, relativePath) =>
    fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const readJson = (repoRoot, relativePath) => JSON.parse(readText(repoRoot, relativePath));
const readOptionalJsonFile = (absolutePath) =>
    fs.existsSync(absolutePath) ? JSON.parse(fs.readFileSync(absolutePath, 'utf8')) : null;

const buildWorkflowTexts = ({ repoRoot, auditGateSnapshot }) =>
    Object.fromEntries(
        Object.keys(auditGateSnapshot.workflowCommands ?? {}).map((workflowPath) => [
            workflowPath,
            readText(repoRoot, workflowPath),
        ])
    );

const findSectionIssueCount = (report, sectionId) =>
    report.sections.find((section) => section.id === sectionId)?.issues.length ?? 1;

export const buildLifecycleArtifactReports = ({
    repoRoot,
    outputDir,
    distDir,
    coverageFile,
    generatedAt,
    provenance,
    requireCompleteEvidence,
}) => {
    const packageJson = readJson(repoRoot, 'package.json');
    const auditGateSnapshot = readJson(repoRoot, 'tools/governance/audit-gates.snapshot.json');
    const workflowTexts = buildWorkflowTexts({ repoRoot, auditGateSnapshot });
    const auditGateSummary = buildAuditGateSummary({
        gateSnapshot: auditGateSnapshot,
        packageJson,
        workflowTexts,
    });
    const auditGateReport = finalizeAuditGateSummary({
        summary: auditGateSummary,
        errors: collectAuditGateSummaryErrors({
            gateSnapshot: auditGateSnapshot,
            summary: auditGateSummary,
        }),
        generatedAt,
        provenance,
    });
    const benchmarkBaseline = readJson(
        repoRoot,
        'tools/governance/benchmark-baselines.snapshot.json'
    );
    const lifecycleReport = buildLifecycleGovernanceReport({
        generatedAt,
        packageJson,
        repoSettingsSnapshot: readJson(repoRoot, 'tools/governance/repo-settings.snapshot.json'),
        repoSettingsChecklistText: readText(repoRoot, GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
        codeownersText: readText(repoRoot, '.github/CODEOWNERS'),
        codeownersRoleMap: readJson(repoRoot, 'tools/governance/codeowners-role-map.snapshot.json'),
        boundaryRegistry: readJson(repoRoot, 'tools/governance/boundary-registry.snapshot.json'),
        contributingText: readText(repoRoot, 'CONTRIBUTING.md'),
        changelogText: readText(repoRoot, 'CHANGELOG.md'),
        releaseChangelogSnapshot: readJson(
            repoRoot,
            'tools/governance/release-changelog.snapshot.json'
        ),
        benchmarkBaseline,
        auditGateSnapshot,
        dashboardSnapshot: readJson(repoRoot, 'tools/governance/lifecycle-dashboard.snapshot.json'),
        sealExclusions: SEAL_COVERAGE_EXCLUSIONS,
        sealExclusionPolicy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
        sealExclusionReviewSnapshot: readJson(
            repoRoot,
            'tools/governance/seal-exclusions-review.snapshot.json'
        ),
        repoRoot,
        workflowTexts,
        provenance,
    });
    const architectureBudgetSummary = collectArchitectureBudgetResults({
        architectureLayerMapText: readText(repoRoot, GOVERNANCE_DOC_PATHS.architectureLayerMap),
        repoRoot,
    });
    const bundleBudgetReport = fs.existsSync(distDir)
        ? buildBundleBudgetReport({
              distDir,
              operationsSnapshot: readJson(
                  repoRoot,
                  'tools/governance/release-health-operations.snapshot.json'
              ),
              generatedAt,
              provenance,
          })
        : null;
    const dashboardReport = buildLifecycleDashboardReport({
        generatedAt,
        dashboardSnapshot: readJson(repoRoot, 'tools/governance/lifecycle-dashboard.snapshot.json'),
        lifecycleReport,
        auditGateReport,
        benchmarkBaseline,
        benchmarkReport: readOptionalJsonFile(
            path.join(outputDir, 'lifecycle-benchmarks.report.json')
        ),
        bundleBudgetReport,
        coverageSummary: buildBranchCoverageSummary({
            coverageFinal: JSON.parse(fs.readFileSync(coverageFile, 'utf8')),
            minimumPercent: auditGateSnapshot.coverage.branchMinimumPercent,
        }),
        architectureBudgetSummary: {
            errors: architectureBudgetSummary.errors.length,
            warnings: architectureBudgetSummary.warnings.length,
        },
        sealReviewSummary: {
            errors: findSectionIssueCount(lifecycleReport, 'seal-exclusion-review'),
            count: SEAL_COVERAGE_EXCLUSIONS.length,
            baselineCount: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY.baselineCount,
        },
        dependencySbomSnapshot: readJson(
            repoRoot,
            'tools/governance/dependency-sbom.snapshot.json'
        ),
        licenseAllowlist: readJson(repoRoot, 'tools/governance/dependency-license-allowlist.json'),
        provenance,
        requireCompleteEvidence,
    });
    const certificationReport = buildLifecycleCertificationReport({
        generatedAt,
        packageJson,
        certificationSnapshot: readJson(
            repoRoot,
            'tools/governance/lifecycle-certification.snapshot.json'
        ),
        lifecycleReport,
        auditGateReport,
        dashboardReport,
        provenance,
    });

    return {
        auditGateReport,
        lifecycleReport,
        dashboardReport,
        certificationReport,
    };
};

export {
    renderLifecycleCertificationMarkdown,
    renderLifecycleDashboardMarkdown,
    renderLifecycleGovernanceMarkdown,
};
