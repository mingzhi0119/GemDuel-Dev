import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectLicenseAllowlistErrors } from './dependencyGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const readJson = (relativePath) =>
    JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));

const packageJson = readJson('package.json');
const packageLock = readJson('package-lock.json');
const allowlist = readJson(path.join('governance', 'dependency-license-allowlist.json'));

const errors = collectLicenseAllowlistErrors({
    packageJson,
    packageLock,
    allowedLicenses: allowlist.allowedLicenses,
});

if (errors.length > 0) {
    console.error('License allowlist gate failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(
    `License allowlist gate passed. Allowed licenses: ${allowlist.allowedLicenses.length}.`
);
