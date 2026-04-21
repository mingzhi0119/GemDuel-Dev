import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectArchitectureBudgetResults } from './architectureBudgets.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const architectureLayerMapText = fs.readFileSync(
    path.join(repoRoot, GOVERNANCE_DOC_PATHS.architectureLayerMap),
    'utf8'
);
const { errors, warnings } = collectArchitectureBudgetResults({
    architectureLayerMapText,
    repoRoot,
});

if (warnings.length > 0) {
    console.warn('Architecture budget warnings:');
    for (const warning of warnings) {
        console.warn(`- ${warning}`);
    }
}

if (errors.length > 0) {
    console.error('Architecture budget check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log('Architecture budget check passed.');
