/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEAL_COVERAGE_EXCLUSIONS } from '@gemduel/config-vitest/seal-exclusions';
import { buildSealExclusionsMonthlySnapshot } from './sealExclusionMonthly.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const getFlagValue = (flagName, argv) => {
    const flagIndex = argv.indexOf(flagName);
    if (flagIndex === -1) {
        return undefined;
    }
    return argv[flagIndex + 1];
};

const argv = process.argv.slice(2);
const monthArg = getFlagValue('--month', argv);
const month =
    monthArg && /^\d{4}-\d{2}$/.test(monthArg) ? monthArg : new Date().toISOString().slice(0, 7);

const generatedAt = new Date().toISOString();
const snapshot = buildSealExclusionsMonthlySnapshot(SEAL_COVERAGE_EXCLUSIONS, {
    month,
    generatedAt,
});

const outPath = path.join(repoRoot, 'tools', 'governance', 'seal-exclusions-monthly.snapshot.json');
fs.writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Wrote ${path.relative(repoRoot, outPath).replaceAll(path.sep, '/')}`);
