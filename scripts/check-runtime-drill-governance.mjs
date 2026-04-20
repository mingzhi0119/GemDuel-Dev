import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    buildRuntimeDrillSnapshot,
    collectRuntimeDrillSnapshotErrors,
} from './runtimeDrillGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const expectedSnapshotPath = path.join(
    repoRoot,
    'electron',
    'governance',
    'runtime-drill.snapshot.json'
);

const expectedSnapshot = JSON.parse(fs.readFileSync(expectedSnapshotPath, 'utf8'));
const actualSnapshot = buildRuntimeDrillSnapshot();
const issues = collectRuntimeDrillSnapshotErrors({
    expectedSnapshot,
    actualSnapshot,
});

if (issues.length > 0) {
    console.error('Runtime drill governance check failed:');
    for (const issue of issues) {
        console.error(`- ${issue}`);
    }
    process.exit(1);
}

console.log(
    `Runtime drill governance check passed for ${actualSnapshot.scenarios.length} governed scenarios.`
);
