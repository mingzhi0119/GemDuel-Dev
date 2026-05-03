/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    buildLifecycleGovernanceReport,
    renderLifecycleGovernanceMarkdown,
} from './lifecycleGovernanceReport.js';
import {
    buildLifecycleDashboardReport,
    renderLifecycleDashboardMarkdown,
} from './lifecycleDashboard.js';
import { buildBranchCoverageSummary } from './lifecycleCertification.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';
import {
    buildAuditGateSummary,
    collectAuditGateSummaryErrors,
    finalizeAuditGateSummary,
} from './auditGateSummary.js';
import {
    SEAL_COVERAGE_EXCLUSIONS,
    SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
} from '@gemduel/config-vitest/seal-exclusions';
import { collectArchitectureBudgetResults } from './architectureBudgets.js';
import { buildBundleBudgetReport } from './buildBudgetReport.js';
import { buildDependencyGateSummaryFromRepo } from './dependencyGateEvidence.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const parseArgs = (argv) => {
    const args = {
        outDir: path.join(repoRoot, 'artifacts', 'governance'),
        pretty: true,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--out-dir') {
            args.outDir = path.resolve(repoRoot, argv[index + 1] ?? args.outDir);
            index += 1;
            continue;
        }

        if (value === '--compact') {
            args.pretty = false;
        }
    }

    return args;
};

const readText = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readText(relativePath));
const readOptionalJson = (relativePath) => {
    const absolutePath = path.join(repoRoot, relativePath);
    return fs.existsSync(absolutePath) ? JSON.parse(fs.readFileSync(absolutePath, 'utf8')) : null;
};

const writeText = (filePath, value) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, value, 'utf8');
};

const buildWorkflowTexts = (auditGateSnapshot) =>
    Object.fromEntries(
        Object.keys(auditGateSnapshot.workflowCommands ?? {}).map((workflowPath) => [
            workflowPath,
            readText(workflowPath),
        ])
    );

const findSectionIssues = (report, sectionId) =>
    report.sections.find((section) => section.id === sectionId)?.issues.length ?? 1;

export const buildReportFromRepo = ({ generatedAt, provenance }) => {
    const auditGateSnapshot = readJson('tools/governance/audit-gates.snapshot.json');
    return buildLifecycleGovernanceReport({
        generatedAt,
        provenance,
        packageJson: readJson('package.json'),
        repoSettingsSnapshot: readJson('tools/governance/repo-settings.snapshot.json'),
        repoSettingsChecklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
        codeownersText: readText('.github/CODEOWNERS'),
        codeownersRoleMap: readJson('tools/governance/codeowners-role-map.snapshot.json'),
        boundaryRegistry: readJson('tools/governance/boundary-registry.snapshot.json'),
        contributingText: readText('CONTRIBUTING.md'),
        changelogText: readText('CHANGELOG.md'),
        releaseChangelogSnapshot: readJson('tools/governance/release-changelog.snapshot.json'),
        benchmarkBaseline: readJson('tools/governance/benchmark-baselines.snapshot.json'),
        auditGateSnapshot,
        dashboardSnapshot: readJson('tools/governance/lifecycle-dashboard.snapshot.json'),
        sealExclusions: SEAL_COVERAGE_EXCLUSIONS,
        sealExclusionPolicy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
        sealExclusionReviewSnapshot: readJson(
            'tools/governance/seal-exclusions-review.snapshot.json'
        ),
        repoRoot,
        workflowTexts: buildWorkflowTexts(auditGateSnapshot),
    });
};

const main = () => {
    const args = parseArgs(process.argv.slice(2));
    const generatedAt = new Date().toISOString();
    const report = buildReportFromRepo({
        generatedAt,
        provenance: {
            generatedBy: 'tools/scripts/generate-governance-report.mjs',
            sha: process.env.GITHUB_SHA ?? null,
            ref: process.env.GITHUB_REF ?? null,
        },
    });
    const jsonPath = path.join(args.outDir, 'lifecycle-governance.report.json');
    const markdownPath = path.join(args.outDir, 'lifecycle-governance.report.md');
    const dashboardSnapshot = readJson('tools/governance/lifecycle-dashboard.snapshot.json');
    const auditGateSnapshot = readJson('tools/governance/audit-gates.snapshot.json');
    const workflowTexts = buildWorkflowTexts(auditGateSnapshot);
    const auditGateSummary = buildAuditGateSummary({
        gateSnapshot: auditGateSnapshot,
        packageJson: readJson('package.json'),
        workflowTexts,
    });
    const auditGateReport = finalizeAuditGateSummary({
        summary: auditGateSummary,
        errors: collectAuditGateSummaryErrors({
            gateSnapshot: auditGateSnapshot,
            summary: auditGateSummary,
        }),
        generatedAt,
        provenance: {
            generatedBy: 'tools/scripts/generate-governance-report.mjs',
            sha: process.env.GITHUB_SHA ?? null,
            ref: process.env.GITHUB_REF ?? null,
        },
    });
    const coverageFinal = readOptionalJson('apps/desktop/coverage/coverage-final.json') ?? {};
    const architectureBudgetSummary = collectArchitectureBudgetResults({
        architectureLayerMapText: readText(GOVERNANCE_DOC_PATHS.architectureLayerMap),
        repoRoot,
    });
    const distDir = path.join(repoRoot, 'apps', 'desktop', 'dist');
    const bundleBudgetReport = fs.existsSync(distDir)
        ? buildBundleBudgetReport({
              distDir,
              operationsSnapshot: readJson(
                  'tools/governance/release-health-operations.snapshot.json'
              ),
              generatedAt,
              provenance: {
                  generatedBy: 'tools/scripts/generate-governance-report.mjs',
              },
          })
        : null;
    const benchmarkBaseline = readJson('tools/governance/benchmark-baselines.snapshot.json');
    const dependencySbomSnapshot = readJson('tools/governance/dependency-sbom.snapshot.json');
    const licenseAllowlist = readJson('tools/governance/dependency-license-allowlist.json');
    const dependencyGateSummary = buildDependencyGateSummaryFromRepo({
        repoRoot,
        packageJson: readJson('package.json'),
        dependencySbomSnapshot,
        licenseAllowlist,
        governanceDocumentText: readText(GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance),
    });
    const dashboard = buildLifecycleDashboardReport({
        generatedAt,
        dashboardSnapshot,
        lifecycleReport: report,
        auditGateReport,
        benchmarkBaseline,
        benchmarkReport: readOptionalJson('artifacts/governance/lifecycle-benchmarks.report.json'),
        bundleBudgetReport,
        coverageSummary: buildBranchCoverageSummary({
            coverageFinal,
            minimumPercent: auditGateSnapshot.coverage.branchMinimumPercent,
        }),
        coveragePerFileKeyModulesReport: readOptionalJson(
            'artifacts/governance/coverage-perfile-key-modules.report.json'
        ),
        architectureBudgetSummary: {
            errors: architectureBudgetSummary.errors.length,
            warnings: architectureBudgetSummary.warnings.length,
        },
        sealReviewSummary: {
            errors: findSectionIssues(report, 'seal-exclusion-review'),
            count: SEAL_COVERAGE_EXCLUSIONS.length,
            baselineCount: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY.baselineCount,
        },
        dependencySbomSnapshot,
        licenseAllowlist,
        dependencyGateSummary,
        provenance: {
            generatedBy: 'tools/scripts/generate-governance-report.mjs',
            sha: process.env.GITHUB_SHA ?? null,
            ref: process.env.GITHUB_REF ?? null,
        },
        requireCompleteEvidence: false,
    });
    const dashboardJsonPath = path.join(args.outDir, 'lifecycle-governance.dashboard.json');
    const dashboardMarkdownPath = path.join(args.outDir, 'lifecycle-governance.dashboard.md');

    writeText(jsonPath, `${JSON.stringify(report, null, args.pretty ? 2 : 0)}\n`);
    writeText(markdownPath, renderLifecycleGovernanceMarkdown(report));
    writeText(dashboardJsonPath, `${JSON.stringify(dashboard, null, args.pretty ? 2 : 0)}\n`);
    writeText(dashboardMarkdownPath, renderLifecycleDashboardMarkdown(dashboard));

    if (report.status !== 'passed') {
        console.error('Lifecycle governance report failed:');
        for (const issue of report.issues) {
            console.error(`- ${issue}`);
        }
        process.exit(1);
    }

    console.log(`Lifecycle governance report passed and wrote ${jsonPath}.`);
};

main();
