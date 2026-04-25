import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    collectGovernanceEvidenceHealthErrors,
    loadGovernanceEvidence,
} from './governanceEvidenceHealth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const operationsSnapshotPath = path.join(
    repoRoot,
    'tools',
    'governance',
    'release-health-operations.snapshot.json'
);

const parseArgs = (argv) => {
    const operationsSnapshot = JSON.parse(fs.readFileSync(operationsSnapshotPath, 'utf8'));
    const defaultArtifactsDir = path.resolve(
        repoRoot,
        operationsSnapshot?.artifactPolicy?.outputDirectory ?? 'artifacts/governance'
    );
    const args = {
        artifactsDir: defaultArtifactsDir,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--artifacts-dir') {
            args.artifactsDir = path.resolve(repoRoot, argv[index + 1] ?? args.artifactsDir);
            index += 1;
        }
    }

    return args;
};

const main = () => {
    const { artifactsDir } = parseArgs(process.argv.slice(2));
    const { manifest, reports, lifecycleReports } = loadGovernanceEvidence({
        artifactsDir,
        repoRoot,
    });
    const operationsSnapshot = JSON.parse(fs.readFileSync(operationsSnapshotPath, 'utf8'));
    const issues = collectGovernanceEvidenceHealthErrors({
        manifest,
        reports,
        lifecycleReports,
        operationsSnapshot,
    });

    if (issues.length > 0) {
        console.error('Governance evidence health check failed:');
        for (const issue of issues) {
            console.error(`- ${issue}`);
        }
        process.exit(1);
    }

    console.log(`Governance evidence health check passed for ${artifactsDir}.`);
};

main();
