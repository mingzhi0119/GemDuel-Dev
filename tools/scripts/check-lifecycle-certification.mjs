import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    SEAL_COVERAGE_EXCLUSIONS,
    SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
} from '@gemduel/config-vitest/seal-exclusions';
import {
    buildAuditGateSummary,
    collectAuditGateSummaryErrors,
    finalizeAuditGateSummary,
    renderAuditGateMarkdown,
} from './auditGateSummary.js';
import { collectArchitectureBudgetResults } from './architectureBudgets.js';
import { buildBundleBudgetReport } from './buildBudgetReport.js';
import { buildDependencyGateSummaryFromRepo } from './dependencyGateEvidence.js';
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
import { printAndWriteLifecycleFailureSummary } from './lifecycleFailureSummary.js';
import {
    buildLifecycleGovernanceReport,
    renderLifecycleGovernanceMarkdown,
} from './lifecycleGovernanceReport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const parseArgs = (argv) => {
    const args = {
        outDir: path.join(repoRoot, 'artifacts', 'governance'),
        distDir: path.join(repoRoot, 'apps', 'desktop', 'dist'),
        coverageFile: path.join(repoRoot, 'apps', 'desktop', 'coverage', 'coverage-final.json'),
        pretty: true,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--out-dir') {
            args.outDir = path.resolve(repoRoot, argv[index + 1] ?? args.outDir);
            index += 1;
            continue;
        }

        if (value === '--dist-dir') {
            args.distDir = path.resolve(repoRoot, argv[index + 1] ?? args.distDir);
            index += 1;
            continue;
        }

        if (value === '--coverage-file') {
            args.coverageFile = path.resolve(repoRoot, argv[index + 1] ?? args.coverageFile);
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
const readOptionalJsonFile = (absolutePath) =>
    fs.existsSync(absolutePath) ? JSON.parse(fs.readFileSync(absolutePath, 'utf8')) : null;

const writeText = (filePath, value) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, value, 'utf8');
};

const writeJson = (filePath, value, pretty) =>
    writeText(filePath, `${JSON.stringify(value, null, pretty ? 2 : 0)}\n`);

const buildWorkflowTexts = (auditGateSnapshot) =>
    Object.fromEntries(
        Object.keys(auditGateSnapshot.workflowCommands ?? {}).map((workflowPath) => [
            workflowPath,
            readText(workflowPath),
        ])
    );

const findSectionIssueCount = (report, sectionId) =>
    report.sections.find((section) => section.id === sectionId)?.issues.length ?? 1;

const main = () => {
    const args = parseArgs(process.argv.slice(2));
    const generatedAt = new Date().toISOString();
    const provenance = {
        generatedBy: 'tools/scripts/check-lifecycle-certification.mjs',
        sha: process.env.GITHUB_SHA ?? null,
        ref: process.env.GITHUB_REF ?? null,
    };
    const packageJson = readJson('package.json');
    const auditGateSnapshot = readJson('tools/governance/audit-gates.snapshot.json');
    const workflowTexts = buildWorkflowTexts(auditGateSnapshot);
    const auditGateSummary = buildAuditGateSummary({
        gateSnapshot: auditGateSnapshot,
        packageJson,
        workflowTexts,
    });
    const auditGateErrors = collectAuditGateSummaryErrors({
        gateSnapshot: auditGateSnapshot,
        summary: auditGateSummary,
    });
    const auditGateReport = finalizeAuditGateSummary({
        summary: auditGateSummary,
        errors: auditGateErrors,
        generatedAt,
        provenance,
    });
    const benchmarkBaseline = readJson('tools/governance/benchmark-baselines.snapshot.json');
    const lifecycleReport = buildLifecycleGovernanceReport({
        generatedAt,
        packageJson,
        repoSettingsSnapshot: readJson('tools/governance/repo-settings.snapshot.json'),
        repoSettingsChecklistText: readText(GOVERNANCE_DOC_PATHS.repoSettingsChecklist),
        codeownersText: readText('.github/CODEOWNERS'),
        codeownersRoleMap: readJson('tools/governance/codeowners-role-map.snapshot.json'),
        boundaryRegistry: readJson('tools/governance/boundary-registry.snapshot.json'),
        contributingText: readText('CONTRIBUTING.md'),
        changelogText: readText('CHANGELOG.md'),
        releaseChangelogSnapshot: readJson('tools/governance/release-changelog.snapshot.json'),
        benchmarkBaseline,
        auditGateSnapshot,
        dashboardSnapshot: readJson('tools/governance/lifecycle-dashboard.snapshot.json'),
        sealExclusions: SEAL_COVERAGE_EXCLUSIONS,
        sealExclusionPolicy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
        sealExclusionReviewSnapshot: readJson(
            'tools/governance/seal-exclusions-review.snapshot.json'
        ),
        repoRoot,
        workflowTexts,
        provenance,
    });
    const architectureBudgetSummary = collectArchitectureBudgetResults({
        architectureLayerMapText: readText(GOVERNANCE_DOC_PATHS.architectureLayerMap),
        repoRoot,
    });
    const coverageSummary = buildBranchCoverageSummary({
        coverageFinal: JSON.parse(fs.readFileSync(args.coverageFile, 'utf8')),
        minimumPercent: auditGateSnapshot.coverage.branchMinimumPercent,
    });
    const operationsSnapshot = readJson('tools/governance/release-health-operations.snapshot.json');
    const bundleBudgetReport = fs.existsSync(args.distDir)
        ? buildBundleBudgetReport({
              distDir: args.distDir,
              operationsSnapshot,
              generatedAt,
              provenance,
          })
        : null;
    const dependencySbomSnapshot = readJson('tools/governance/dependency-sbom.snapshot.json');
    const licenseAllowlist = readJson('tools/governance/dependency-license-allowlist.json');
    const dependencyGateSummary = buildDependencyGateSummaryFromRepo({
        repoRoot,
        packageJson,
        dependencySbomSnapshot,
        licenseAllowlist,
        governanceDocumentText: readText(GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance),
    });
    const dashboardReport = buildLifecycleDashboardReport({
        generatedAt,
        dashboardSnapshot: readJson('tools/governance/lifecycle-dashboard.snapshot.json'),
        lifecycleReport,
        auditGateReport,
        benchmarkBaseline,
        benchmarkReport: readOptionalJsonFile(
            path.join(args.outDir, 'lifecycle-benchmarks.report.json')
        ),
        bundleBudgetReport,
        coverageSummary,
        coveragePerFileKeyModulesReport: readOptionalJsonFile(
            path.join(args.outDir, 'coverage-perfile-key-modules.report.json')
        ),
        architectureBudgetSummary: {
            errors: architectureBudgetSummary.errors.length,
            warnings: architectureBudgetSummary.warnings.length,
        },
        sealReviewSummary: {
            errors: findSectionIssueCount(lifecycleReport, 'seal-exclusion-review'),
            count: SEAL_COVERAGE_EXCLUSIONS.length,
            baselineCount: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY.baselineCount,
        },
        dependencySbomSnapshot,
        licenseAllowlist,
        dependencyGateSummary,
        provenance,
        requireCompleteEvidence: true,
    });
    const certificationReport = buildLifecycleCertificationReport({
        generatedAt,
        packageJson,
        certificationSnapshot: readJson('tools/governance/lifecycle-certification.snapshot.json'),
        lifecycleReport,
        auditGateReport,
        dashboardReport,
        provenance,
    });

    writeJson(path.join(args.outDir, 'audit-gates.report.json'), auditGateReport, args.pretty);
    writeText(
        path.join(args.outDir, 'audit-gates.report.md'),
        renderAuditGateMarkdown(auditGateReport)
    );
    writeJson(
        path.join(args.outDir, 'lifecycle-governance.report.json'),
        lifecycleReport,
        args.pretty
    );
    writeText(
        path.join(args.outDir, 'lifecycle-governance.report.md'),
        renderLifecycleGovernanceMarkdown(lifecycleReport)
    );
    writeJson(
        path.join(args.outDir, 'lifecycle-governance.dashboard.json'),
        dashboardReport,
        args.pretty
    );
    writeText(
        path.join(args.outDir, 'lifecycle-governance.dashboard.md'),
        renderLifecycleDashboardMarkdown(dashboardReport)
    );
    writeJson(
        path.join(args.outDir, 'lifecycle-certification.report.json'),
        certificationReport,
        args.pretty
    );
    writeText(
        path.join(args.outDir, 'lifecycle-certification.report.md'),
        renderLifecycleCertificationMarkdown(certificationReport)
    );

    const errors = [
        ...auditGateReport.errors,
        ...lifecycleReport.issues,
        ...dashboardReport.errors,
        ...certificationReport.errors,
    ];
    if (errors.length > 0) {
        printAndWriteLifecycleFailureSummary({
            repoRoot,
            absoluteOutDir: args.outDir,
            auditGateReport,
            lifecycleReport,
            dashboardReport,
            certificationReport,
        });
        console.error('Lifecycle certification failed:');
        for (const error of errors) {
            console.error(`- ${error}`);
        }
        process.exit(1);
    }

    console.log(
        `Lifecycle certification passed with local score ${certificationReport.localScore.score}/10 and wrote ${path.join(args.outDir, 'lifecycle-certification.report.json')}.`
    );
};

main();
