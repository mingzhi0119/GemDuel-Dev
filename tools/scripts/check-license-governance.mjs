import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectLicenseAllowlistErrors } from './dependencyGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const readJson = (relativePath) =>
    JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));

const readLicenseReport = () =>
    JSON.parse(
        execSync('pnpm licenses list --json', {
            cwd: repoRoot,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true,
        })
    );

const packageJson = readJson('package.json');
const licenseReport = readLicenseReport();
const allowlist = readJson(path.join('tools', 'governance', 'dependency-license-allowlist.json'));

const errors = collectLicenseAllowlistErrors({
    packageJson,
    licenseReport,
    allowedLicenses: allowlist.allowedLicenses,
    repoRoot,
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
