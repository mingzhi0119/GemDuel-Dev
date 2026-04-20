import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    buildReleaseHealthReport,
    parseReleaseHealthSourceText,
    serializeReleaseHealthReport,
} from './releaseHealthReport.js';
import { buildBundleBudgetReport, serializeBundleBudgetReport } from './buildBudgetReport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const operationsSnapshotPath = path.join(
    repoRoot,
    'electron',
    'governance',
    'release-health-operations.snapshot.json'
);

const parseArgs = (argv) => {
    const args = {
        outDir: null,
        distDir: path.join(repoRoot, 'dist'),
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
    generatedBy: 'scripts/export-governance-artifacts.mjs',
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
        retentionDays: 14,
        outputDirectory: 'artifacts/governance',
        storageKind: 'github-actions-artifact',
    };
    const outputDir = path.resolve(
        repoRoot,
        outDir ?? artifactPolicy.outputDirectory ?? 'artifacts/governance'
    );
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
            path: path.relative(repoRoot, reportPath).replaceAll(path.sep, '/'),
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
            path: path.relative(repoRoot, bundleBudgetPath).replaceAll(path.sep, '/'),
        };
    }

    const manifest = {
        manifestVersion: 1,
        generatedAt,
        provenance,
        artifactPolicy,
        operationsSnapshotVersion: operationsSnapshot.schemaVersion ?? null,
        releaseHealthReports: releaseHealthOutputs,
        bundleBudgetReport: bundleBudgetOutput,
        evidenceRefs: {
            runtimeDrillSnapshot: 'electron/governance/runtime-drill.snapshot.json',
            operationsSnapshot: 'electron/governance/release-health-operations.snapshot.json',
            desktopPolicySnapshot: 'electron/governance/desktop-policy.snapshot.json',
            boundaryRegistry: 'governance/boundary-registry.snapshot.json',
        },
    };
    const manifestPath = path.join(outputDir, 'governance-evidence.manifest.json');
    writeTextFile(manifestPath, `${JSON.stringify(manifest, null, pretty ? 2 : 0)}\n`);

    console.log(`Wrote governance artifacts to ${outputDir}`);
};

main();
