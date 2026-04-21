import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    collectReleaseChecklistProvenanceErrors,
    collectReleaseHealthChecklistErrors,
} from './releaseHealthChecklist.js';
import { collectReleaseHealthOperationsErrors } from './releaseHealthOperations.js';
import { createGitRunner } from './releaseTagProvenance.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const checklistPath = path.join(repoRoot, GOVERNANCE_DOC_PATHS.releaseHealthChecklist);
const sloPath = path.join(repoRoot, GOVERNANCE_DOC_PATHS.operationsSlo);
const drillPath = path.join(repoRoot, GOVERNANCE_DOC_PATHS.operationsFaultDrills);
const operationsSnapshotPath = path.join(
    repoRoot,
    'electron',
    'governance',
    'release-health-operations.snapshot.json'
);
const checklistText = fs.readFileSync(checklistPath, 'utf8');
const sloText = fs.readFileSync(sloPath, 'utf8');
const drillText = fs.readFileSync(drillPath, 'utf8');
const operationsSnapshot = JSON.parse(fs.readFileSync(operationsSnapshotPath, 'utf8'));

const issues = collectReleaseHealthChecklistErrors(checklistText);
issues.push(
    ...collectReleaseHealthOperationsErrors({
        repoRoot,
        sloText,
        drillText,
        operationsSnapshot,
    })
);
issues.push(
    ...collectReleaseChecklistProvenanceErrors({
        commitSha: process.env.GITHUB_SHA ?? null,
        defaultBranch: process.env.GITHUB_DEFAULT_BRANCH ?? null,
        releaseRef: process.env.GITHUB_REF ?? null,
        git: createGitRunner(repoRoot),
    })
);

if (issues.length > 0) {
    console.error('Release health checklist check failed:');
    for (const issue of issues) {
        console.error(`- ${issue}`);
    }
    process.exit(1);
}

console.log('Release health checklist check passed.');
console.log('Release-health operations SLO and drill assets passed.');
