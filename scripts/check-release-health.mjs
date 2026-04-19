import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectReleaseHealthChecklistErrors } from './releaseHealthChecklist.js';
import { collectReleaseHealthOperationsErrors } from './releaseHealthOperations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const checklistPath = path.join(repoRoot, 'RELEASE_HEALTH_CHECKLIST.md');
const sloPath = path.join(repoRoot, 'OPERATIONS_SLO.md');
const drillPath = path.join(repoRoot, 'OPERATIONS_FAULT_DRILLS.md');
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
        sloText,
        drillText,
        operationsSnapshot,
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
