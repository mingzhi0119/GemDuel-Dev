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

const createGovernanceAsset = ({
    id,
    kind,
    relativePath,
    producedBy,
    checkedBy = [],
    status = 'governed',
    sourceRefs = [],
}) => ({
    id,
    kind,
    path: relativePath,
    producedBy,
    checkedBy,
    status,
    sourceRefs,
});

const writeTextFile = (absolutePath, contents) => {
    fs.mkdirSync(path.dirname(absolutePath), {
        recursive: true,
    });
    fs.writeFileSync(absolutePath, contents, 'utf8');
};

const main = () => {
    const { outDir, distDir, pretty } = parseArgs(process.argv.slice(2));
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

    const governanceAssets = [
        createGovernanceAsset({
            id: 'dependency-sbom-snapshot',
            kind: 'dependency-sbom',
            relativePath: 'tools/governance/dependency-sbom.snapshot.json',
            producedBy: 'tools/scripts/check-sbom-governance.mjs',
            checkedBy: ['tools/scripts/check-dependency-governance.mjs'],
            sourceRefs: ['pnpm-lock.yaml', 'package.json'],
        }),
        createGovernanceAsset({
            id: 'dependency-license-allowlist',
            kind: 'license-allowlist',
            relativePath: 'tools/governance/dependency-license-allowlist.json',
            producedBy: 'tools/governance/dependency-license-allowlist.json',
            checkedBy: ['tools/scripts/check-license-governance.mjs'],
            sourceRefs: ['pnpm-lock.yaml'],
        }),
        createGovernanceAsset({
            id: 'dependency-runtime-governance-doc',
            kind: 'secret-policy',
            relativePath: GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance,
            producedBy: 'manual-governance-document',
            checkedBy: [
                'tools/scripts/check-dependency-governance.mjs',
                'tools/scripts/check-secret-governance.mjs',
            ],
            sourceRefs: ['apps/desktop/electron/runtimeConfig.js'],
        }),
        createGovernanceAsset({
            id: 'runtime-config-policy-source',
            kind: 'runtime-policy-source',
            relativePath: 'apps/desktop/electron/runtimeConfig.js',
            producedBy: 'apps/desktop/electron/runtimeConfig.js',
            checkedBy: [
                'tools/scripts/check-secret-governance.mjs',
                'tools/scripts/check-dependency-governance.mjs',
            ],
            sourceRefs: [GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance],
        }),
        createGovernanceAsset({
            id: 'runtime-drill-snapshot',
            kind: 'runtime-snapshot',
            relativePath: 'tools/governance/runtime-drill.snapshot.json',
            producedBy: 'tools/governance/runtime-drill.snapshot.json',
            checkedBy: ['tools/scripts/check-runtime-drill-governance.mjs'],
        }),
        createGovernanceAsset({
            id: 'desktop-policy-snapshot',
            kind: 'desktop-policy',
            relativePath: 'tools/governance/desktop-policy.snapshot.json',
            producedBy: 'tools/governance/desktop-policy.snapshot.json',
            checkedBy: ['tools/scripts/check-electron-governance.mjs'],
            sourceRefs: [
                'apps/desktop/electron/preloadContract.cjs',
                'apps/desktop/electron/desktopGovernance.js',
            ],
        }),
        createGovernanceAsset({
            id: 'release-health-operations-snapshot',
            kind: 'operations-snapshot',
            relativePath: 'tools/governance/release-health-operations.snapshot.json',
            producedBy: 'tools/governance/release-health-operations.snapshot.json',
            checkedBy: [
                'tools/scripts/releaseHealthOperations.js',
                'tools/scripts/export-governance-artifacts.mjs',
            ],
        }),
        createGovernanceAsset({
            id: 'boundary-registry-snapshot',
            kind: 'boundary-registry',
            relativePath: 'tools/governance/boundary-registry.snapshot.json',
            producedBy: 'tools/governance/boundary-registry.snapshot.json',
            checkedBy: ['tools/scripts/check-boundary-governance.mjs'],
        }),
        createGovernanceAsset({
            id: 'contract-registry-snapshot',
            kind: 'contract-registry',
            relativePath: 'tools/governance/contract-registry.snapshot.json',
            producedBy: 'tools/governance/contract-registry.snapshot.json',
            checkedBy: ['packages/shared/src/logic/__tests__/contractSnapshot.test.ts'],
            sourceRefs: ['packages/shared/src/logic/contractSnapshot.ts'],
        }),
        createGovernanceAsset({
            id: 'turn-credential-client-source',
            kind: 'turn-lifecycle-source',
            relativePath: 'apps/desktop/electron/turnCredentialClient.js',
            producedBy: 'apps/desktop/electron/turnCredentialClient.js',
            checkedBy: ['apps/desktop/electron/__tests__/turnCredentialClient.test.ts'],
            sourceRefs: [
                'packages/turn-service/src/turnCredentialService.js',
                'apps/desktop/src/app/runtime/useRuntimeAppConfig.ts',
            ],
        }),
        createGovernanceAsset({
            id: 'turn-credential-service-source',
            kind: 'turn-lifecycle-source',
            relativePath: 'packages/turn-service/src/turnCredentialService.js',
            producedBy: 'packages/turn-service/src/turnCredentialService.js',
            checkedBy: ['packages/turn-service/src/__tests__/turnCredentialService.test.ts'],
            sourceRefs: ['apps/desktop/electron/turnCredentialClient.js'],
        }),
        createGovernanceAsset({
            id: 'runtime-relay-loader-source',
            kind: 'turn-lifecycle-source',
            relativePath: 'apps/desktop/src/app/runtime/useRuntimeAppConfig.ts',
            producedBy: 'apps/desktop/src/app/runtime/useRuntimeAppConfig.ts',
            checkedBy: ['apps/desktop/src/app/runtime/__tests__/useRuntimeAppConfig.test.tsx'],
            sourceRefs: [
                'apps/desktop/electron/turnCredentialClient.js',
                'packages/shared/src/config/webrtc.ts',
            ],
        }),
    ];

    const manifest = {
        manifestVersion: 2,
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
        },
    };
    const manifestPath = path.join(outputDir, 'governance-evidence.manifest.json');
    writeTextFile(manifestPath, `${JSON.stringify(manifest, null, pretty ? 2 : 0)}\n`);

    console.log(`Wrote governance artifacts to ${outputDir}`);
};

main();
