import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    collectGovernanceDocumentErrors,
    collectRuntimeEnvNamesFromEntries,
    collectRuntimePolicyErrors,
    collectTextFileEntries,
} from './dependencyGovernance.js';
import { collectSecretScanErrorsFromEntries } from './dependencySecretGovernance.js';
import { RUNTIME_CONFIG_POLICY } from '@gemduel/shared/runtimeConfigPolicy.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const readText = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const governanceDocumentText = readText(GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance);
const textEntries = collectTextFileEntries(repoRoot, { includeTests: false });
const secretErrors = collectSecretScanErrorsFromEntries(textEntries);
const runtimeEnvNames = collectRuntimeEnvNamesFromEntries(textEntries);
const runtimeErrors = collectRuntimePolicyErrors({
    runtimeConfigPolicy: RUNTIME_CONFIG_POLICY,
    runtimeEnvNames,
    governanceDocumentText,
});
const documentErrors = collectGovernanceDocumentErrors(governanceDocumentText);
const errors = [...secretErrors, ...runtimeErrors, ...documentErrors];

if (errors.length > 0) {
    console.error('Secret and env drift gate failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(
    `Secret and env drift gate passed. Scanned ${textEntries.length} text files and found ${runtimeEnvNames.length} governed env names.`
);
