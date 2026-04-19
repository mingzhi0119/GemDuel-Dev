import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { RUNTIME_CONFIG_POLICY } from '../electron/runtimeConfig.js';
import {
    collectDependencyGovernanceErrors,
    formatAuditSummary,
    parseRuntimeEnvNames,
} from './dependencyGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const readJson = (relativePath) =>
    JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));

const readText = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const readAuditReport = () => {
    try {
        const stdout = execSync('npm audit --omit=dev --json', {
            cwd: repoRoot,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true,
        });

        return JSON.parse(stdout);
    } catch (error) {
        if (typeof error.stdout === 'string' && error.stdout.trim().length > 0) {
            return JSON.parse(error.stdout);
        }

        throw error;
    }
};

const packageJson = readJson('package.json');
const governanceDocumentText = readText('DEPENDENCY_RUNTIME_GOVERNANCE.md');
const mainProcessText = readText(path.join('electron', 'main.js'));
const auditReport = readAuditReport();
const runtimeEnvNames = parseRuntimeEnvNames(mainProcessText);

const errors = collectDependencyGovernanceErrors({
    packageJson,
    runtimeConfigPolicy: RUNTIME_CONFIG_POLICY,
    runtimeEnvNames,
    governanceDocumentText,
    auditReport,
});

if (errors.length > 0) {
    console.error('Dependency governance check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    console.error(`- Audit summary: ${formatAuditSummary(auditReport)}`);
    process.exit(1);
}

console.log('Dependency governance check passed.');
console.log(`Production audit summary: ${formatAuditSummary(auditReport)}`);
