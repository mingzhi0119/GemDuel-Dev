import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    buildReleaseHealthReport,
    parseReleaseHealthSourceText,
    serializeReleaseHealthReport,
} from './releaseHealthReport.js';
import { buildBundleBudgetReport, serializeBundleBudgetReport } from './buildBudgetReport.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';
import { renderAuditGateMarkdown } from './auditGateSummary.js';
import {
    buildLifecycleArtifactReports,
    renderLifecycleCertificationMarkdown,
    renderLifecycleDashboardMarkdown,
    renderLifecycleGovernanceMarkdown,
} from './lifecycleArtifactReports.js';
import { buildGovernanceAssets } from './governanceArtifactAssets.js';
import { printAndWriteLifecycleFailureSummary } from './lifecycleFailureSummary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const operationsSnapshotPath = path.join(
    repoRoot,
    'tools',
    'governance',
    'release-health-operations.snapshot.json'
);

const parseArgs = (argv) => {
    const args = {
        outDir: null,
        distDir: path.join(repoRoot, 'apps', 'desktop', 'dist'),
        coverageFile: path.join(repoRoot, 'apps', 'desktop', 'coverage', 'coverage-final.json'),
        pretty: true,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--out-dir') {
            args.outDir = argv[index + 1] ?? null;
            index += 1;
            continue;
        }

        if (value === '--dist-dir') {
            args.distDir = argv[index + 1] ?? args.distDir;
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

const buildProvenance = () => ({
    repository: process.env.GITHUB_REPOSITORY ?? null,
    sha: process.env.GITHUB_SHA ?? null,
    ref: process.env.GITHUB_REF ?? null,
    workflowName: process.env.GITHUB_WORKFLOW ?? null,
    runId: process.env.GITHUB_RUN_ID ?? null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
    jobName: process.env.GITHUB_JOB ?? null,
    generatedBy: 'tools/scripts/export-governance-artifacts.mjs',
});

const toRepoRelativePath = (absolutePath) =>
    path.relative(repoRoot, absolutePath).replaceAll(path.sep, '/');

const writeTextFile = (absolutePath, contents) => {
    fs.mkdirSync(path.dirname(absolutePath), {
        recursive: true,
    });
    fs.writeFileSync(absolutePath, contents, 'utf8');
};

const main = () => {
    const { outDir, distDir, coverageFile, pretty } = parseArgs(process.argv.slice(2));
    const operationsSnapshot = JSON.parse(fs.readFileSync(operationsSnapshotPath, 'utf8'));
    const artifactPolicy = operationsSnapshot.artifactPolicy ?? {
        artifactName: 'governance-evidence',
        retentionDays: 30,
        outputDirectory: 'artifacts/governance',
        storageKind: 'github-actions-artifact',
    };
    const outputDir = path.resolve(
        repoRoot,
        outDir ?? artifactPolicy.outputDirectory ?? 'artifacts/governance'
    );
    const relativeOutputDir = toRepoRelativePath(outputDir);
    const provenance = buildProvenance();
    const generatedAt = new Date().toISOString();
    const releaseHealthOutputs = [];

    for (const artifactReport of operationsSnapshot.artifactReports ?? []) {
        const sourcePath = path.resolve(repoRoot, artifactReport.sourcePath);
        const report = buildReleaseHealthReport({
            source: parseReleaseHealthSourceText(fs.readFileSync(sourcePath, 'utf8')),
            operationsSnapshot,
            generatedAt,
            provenance,
            retention: {
                artifactName: artifactPolicy.artifactName,
                retentionDays: artifactPolicy.retentionDays,
                storageKind: artifactPolicy.storageKind,
            },
            sourcePath,
            drillLabel: artifactReport.drillId ?? null,
        });

        if (artifactReport.expectedStatus && artifactReport.expectedStatus !== report.status) {
            throw new Error(
                `Artifact report ${artifactReport.id} expected status ${artifactReport.expectedStatus} but exported ${report.status}.`
            );
        }

        const reportPath = path.join(outputDir, `${artifactReport.id}.release-health.report.json`);
        writeTextFile(reportPath, serializeReleaseHealthReport(report, { pretty }));
        releaseHealthOutputs.push({
            id: artifactReport.id,
            title: artifactReport.title,
            expectedStatus: artifactReport.expectedStatus ?? null,
            status: report.status,
            path: toRepoRelativePath(reportPath),
        });
    }

    let bundleBudgetOutput = null;
    const absoluteDistDir = path.resolve(repoRoot, distDir);
    if (fs.existsSync(absoluteDistDir)) {
        const bundleBudgetReport = buildBundleBudgetReport({
            distDir: absoluteDistDir,
            generatedAt,
            operationsSnapshot,
            provenance,
        });
        const bundleBudgetPath = path.join(outputDir, 'bundle-budget.report.json');
        writeTextFile(
            bundleBudgetPath,
            serializeBundleBudgetReport(bundleBudgetReport, { pretty })
        );
        bundleBudgetOutput = {
            status: bundleBudgetReport.status,
            path: toRepoRelativePath(bundleBudgetPath),
        };
    }

    const { auditGateReport, lifecycleReport, dashboardReport, certificationReport } =
        buildLifecycleArtifactReports({
            repoRoot,
            outputDir,
            distDir: absoluteDistDir,
            coverageFile,
            generatedAt,
            provenance,
            requireCompleteEvidence: true,
        });
    const auditGateReportPath = path.join(outputDir, 'audit-gates.report.json');
    const auditGateMarkdownPath = path.join(outputDir, 'audit-gates.report.md');
    writeTextFile(
        auditGateReportPath,
        `${JSON.stringify(auditGateReport, null, pretty ? 2 : 0)}\n`
    );
    writeTextFile(auditGateMarkdownPath, renderAuditGateMarkdown(auditGateReport));

    const lifecycleReportPath = path.join(outputDir, 'lifecycle-governance.report.json');
    const lifecycleMarkdownPath = path.join(outputDir, 'lifecycle-governance.report.md');
    writeTextFile(
        lifecycleReportPath,
        `${JSON.stringify(lifecycleReport, null, pretty ? 2 : 0)}\n`
    );
    writeTextFile(lifecycleMarkdownPath, renderLifecycleGovernanceMarkdown(lifecycleReport));

    const dashboardReportPath = path.join(outputDir, 'lifecycle-governance.dashboard.json');
    const dashboardMarkdownPath = path.join(outputDir, 'lifecycle-governance.dashboard.md');
    writeTextFile(
        dashboardReportPath,
        `${JSON.stringify(dashboardReport, null, pretty ? 2 : 0)}\n`
    );
    writeTextFile(dashboardMarkdownPath, renderLifecycleDashboardMarkdown(dashboardReport));

    const certificationReportPath = path.join(outputDir, 'lifecycle-certification.report.json');
    const certificationMarkdownPath = path.join(outputDir, 'lifecycle-certification.report.md');
    writeTextFile(
        certificationReportPath,
        `${JSON.stringify(certificationReport, null, pretty ? 2 : 0)}\n`
    );
    writeTextFile(
        certificationMarkdownPath,
        renderLifecycleCertificationMarkdown(certificationReport)
    );

    const governanceLifecycleFailed =
        auditGateReport.errors.length > 0 ||
        lifecycleReport.status !== 'passed' ||
        dashboardReport.status !== 'passed' ||
        certificationReport.status !== 'passed';

    if (governanceLifecycleFailed) {
        printAndWriteLifecycleFailureSummary({
            repoRoot,
            absoluteOutDir: outputDir,
            auditGateReport,
            lifecycleReport,
            dashboardReport,
            certificationReport,
        });
    }

    if (auditGateReport.errors.length > 0) {
        throw new Error(`Audit gate report contains ${auditGateReport.errors.length} issue(s).`);
    }

    if (lifecycleReport.status !== 'passed') {
        throw new Error(
            `Lifecycle governance report contains ${lifecycleReport.issues.length} issue(s).`
        );
    }

    if (dashboardReport.status !== 'passed') {
        throw new Error(
            `Lifecycle governance dashboard failed ${dashboardReport.errors.length} check(s).`
        );
    }

    if (certificationReport.status !== 'passed') {
        throw new Error(
            `Lifecycle governance certification failed ${certificationReport.errors.length} check(s).`
        );
    }

    const governanceAssets = buildGovernanceAssets();

    const manifest = {
        manifestVersion: 3,
        generatedAt,
        provenance,
        batch: {
            releaseVersion: packageJson.version,
            commitSha: provenance.sha,
            gitRef: provenance.ref,
            outputDirectory: relativeOutputDir,
            artifactName: artifactPolicy.artifactName,
        },
        artifactPolicy,
        operationsSnapshotVersion: operationsSnapshot.schemaVersion ?? null,
        release: {
            releaseHealthReports: releaseHealthOutputs,
            bundleBudgetReport: bundleBudgetOutput,
        },
        dependency: {
            retiredWorkarounds: [],
            sbomSnapshot: governanceAssets.find((asset) => asset.id === 'dependency-sbom-snapshot'),
            licenseAllowlist: governanceAssets.find(
                (asset) => asset.id === 'dependency-license-allowlist'
            ),
        },
        secretGovernance: {
            policyDocument: governanceAssets.find(
                (asset) => asset.id === 'dependency-runtime-governance-doc'
            ),
            runtimePolicySource: governanceAssets.find(
                (asset) => asset.id === 'runtime-config-policy-source'
            ),
            gateScripts: [
                'tools/scripts/check-secret-governance.mjs',
                'tools/scripts/check-dependency-governance.mjs',
            ],
        },
        runtime: {
            auditedAssets: governanceAssets.filter((asset) =>
                [
                    'runtime-drill-snapshot',
                    'desktop-policy-snapshot',
                    'release-health-operations-snapshot',
                    'boundary-registry-snapshot',
                    'contract-registry-snapshot',
                ].includes(asset.id)
            ),
            turnLifecycleSources: governanceAssets.filter(
                (asset) => asset.kind === 'turn-lifecycle-source'
            ),
        },
        lifecycle: {
            status: lifecycleReport.status,
            repoSettingsSnapshot: governanceAssets.find(
                (asset) => asset.id === 'repo-settings-snapshot'
            ),
            codeownersRoleMap: governanceAssets.find(
                (asset) => asset.id === 'codeowners-role-map-snapshot'
            ),
            releaseChangelogSnapshot: governanceAssets.find(
                (asset) => asset.id === 'release-changelog-snapshot'
            ),
            benchmarkBaseline: governanceAssets.find(
                (asset) => asset.id === 'benchmark-baseline-snapshot'
            ),
            auditGateSnapshot: governanceAssets.find(
                (asset) => asset.id === 'audit-gates-snapshot'
            ),
            lifecycleDashboardSnapshot: governanceAssets.find(
                (asset) => asset.id === 'lifecycle-dashboard-snapshot'
            ),
            lifecycleCertificationSnapshot: governanceAssets.find(
                (asset) => asset.id === 'lifecycle-certification-snapshot'
            ),
            sealExclusionsReviewSnapshot: governanceAssets.find(
                (asset) => asset.id === 'seal-exclusions-review-snapshot'
            ),
            auditGateReport: {
                status: auditGateReport.status,
                path: toRepoRelativePath(auditGateReportPath),
                markdownPath: toRepoRelativePath(auditGateMarkdownPath),
            },
            governanceReport: {
                status: lifecycleReport.status,
                path: toRepoRelativePath(lifecycleReportPath),
                markdownPath: toRepoRelativePath(lifecycleMarkdownPath),
            },
            dashboardReport: {
                status: dashboardReport.status,
                completeness: dashboardReport.completeness,
                path: toRepoRelativePath(dashboardReportPath),
                markdownPath: toRepoRelativePath(dashboardMarkdownPath),
            },
            certificationReport: {
                status: certificationReport.status,
                path: toRepoRelativePath(certificationReportPath),
                markdownPath: toRepoRelativePath(certificationMarkdownPath),
            },
        },
        governanceAssets,
        evidenceRefs: {
            runtimeDrillSnapshot: 'tools/governance/runtime-drill.snapshot.json',
            operationsSnapshot: 'tools/governance/release-health-operations.snapshot.json',
            desktopPolicySnapshot: 'tools/governance/desktop-policy.snapshot.json',
            boundaryRegistry: 'tools/governance/boundary-registry.snapshot.json',
            contractRegistry: 'tools/governance/contract-registry.snapshot.json',
            dependencySbomSnapshot: 'tools/governance/dependency-sbom.snapshot.json',
            dependencyLicenseAllowlist: 'tools/governance/dependency-license-allowlist.json',
            dependencyRuntimeGovernance: GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance,
            repoSettingsSnapshot: 'tools/governance/repo-settings.snapshot.json',
            codeownersRoleMap: 'tools/governance/codeowners-role-map.snapshot.json',
            releaseChangelogSnapshot: 'tools/governance/release-changelog.snapshot.json',
            benchmarkBaseline: 'tools/governance/benchmark-baselines.snapshot.json',
            auditGateSnapshot: 'tools/governance/audit-gates.snapshot.json',
            lifecycleDashboardSnapshot: 'tools/governance/lifecycle-dashboard.snapshot.json',
            lifecycleCertificationSnapshot:
                'tools/governance/lifecycle-certification.snapshot.json',
            sealExclusionsReviewSnapshot: 'tools/governance/seal-exclusions-review.snapshot.json',
        },
    };
    const manifestPath = path.join(outputDir, 'governance-evidence.manifest.json');
    writeTextFile(manifestPath, `${JSON.stringify(manifest, null, pretty ? 2 : 0)}\n`);

    console.log(`Wrote governance artifacts to ${outputDir}`);
};

main();
