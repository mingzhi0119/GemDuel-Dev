import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectCodeownersGovernanceErrors } from './codeownersGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const readJson = (relativePath) =>
    JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));

const issues = collectCodeownersGovernanceErrors({
    codeownersText: fs.readFileSync(path.join(repoRoot, '.github', 'CODEOWNERS'), 'utf8'),
    roleMap: readJson('tools/governance/codeowners-role-map.snapshot.json'),
    boundaryRegistry: readJson('tools/governance/boundary-registry.snapshot.json'),
    contributingText: fs.readFileSync(path.join(repoRoot, 'CONTRIBUTING.md'), 'utf8'),
});

if (issues.length > 0) {
    console.error('CODEOWNERS governance check failed:');
    for (const issue of issues) {
        console.error(`- ${issue}`);
    }
    process.exit(1);
}

console.log('CODEOWNERS governance check passed.');
