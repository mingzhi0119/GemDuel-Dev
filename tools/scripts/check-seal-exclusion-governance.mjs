import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    SEAL_COVERAGE_EXCLUSIONS,
    SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
} from '@gemduel/config-vitest/seal-exclusions';
import { collectSealCoverageExclusionGovernanceErrors } from './sealExclusionGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const args = process.argv.slice(2);
const getFlagValue = (flagName) => {
    const flagIndex = args.indexOf(flagName);
    if (flagIndex === -1) {
        return undefined;
    }

    return args[flagIndex + 1];
};

const todayOverride = getFlagValue('--today');

const errors = collectSealCoverageExclusionGovernanceErrors({
    exclusions: SEAL_COVERAGE_EXCLUSIONS,
    policy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
    repoRoot,
    ...(todayOverride ? { today: todayOverride } : {}),
});

if (errors.length > 0) {
    console.error('Seal coverage exclusion governance check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(
    `Seal coverage exclusion governance check passed for ${SEAL_COVERAGE_EXCLUSIONS.length} reviewed exclusions.`
);
