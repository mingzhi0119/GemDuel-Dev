import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectChangelogGovernanceErrors } from './changelogGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const readJson = (relativePath) =>
    JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));

const issues = collectChangelogGovernanceErrors({
    changelogText: fs.readFileSync(path.join(repoRoot, 'CHANGELOG.md'), 'utf8'),
    releaseSnapshot: readJson('tools/governance/release-changelog.snapshot.json'),
    packageJson: readJson('package.json'),
});

if (issues.length > 0) {
    console.error('Release changelog governance check failed:');
    for (const issue of issues) {
        console.error(`- ${issue}`);
    }
    process.exit(1);
}

console.log('Release changelog governance check passed.');
