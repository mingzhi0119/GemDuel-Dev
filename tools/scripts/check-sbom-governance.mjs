import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDependencySbomSnapshot, collectSbomSnapshotErrors } from './dependencyGovernance.js';

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
const expectedSnapshot = readJson(
    path.join('tools', 'governance', 'dependency-sbom.snapshot.json')
);

const errors = collectSbomSnapshotErrors({
    packageJson,
    licenseReport,
    expectedSnapshot,
    repoRoot,
});

if (errors.length > 0) {
    console.error('Dependency SBOM gate failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    console.error(
        `- Expected snapshot components: ${expectedSnapshot?.componentCount ?? 'missing'}`
    );
    process.exit(1);
}

const snapshot = buildDependencySbomSnapshot(packageJson, licenseReport, repoRoot);
console.log(
    `Dependency SBOM gate passed. Components=${snapshot.componentCount}, licenses=${Object.keys(snapshot.licenseInventory).length}.`
);
