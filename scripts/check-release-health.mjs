import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectReleaseHealthChecklistErrors } from './releaseHealthChecklist.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const checklistPath = path.join(repoRoot, 'RELEASE_HEALTH_CHECKLIST.md');
const checklistText = fs.readFileSync(checklistPath, 'utf8');

const issues = collectReleaseHealthChecklistErrors(checklistText);

if (issues.length > 0) {
    console.error('Release health checklist check failed:');
    for (const issue of issues) {
        console.error(`- ${issue}`);
    }
    process.exit(1);
}

console.log('Release health checklist check passed.');
