import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBundleBudgetReport } from './buildBudgetReport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const distFlagIndex = process.argv.indexOf('--dist-dir');
const distDir =
    distFlagIndex >= 0 && process.argv[distFlagIndex + 1]
        ? path.resolve(repoRoot, process.argv[distFlagIndex + 1])
        : path.join(repoRoot, 'apps', 'desktop', 'dist');

if (!fs.existsSync(distDir)) {
    console.error(`Build budget check failed: dist directory ${distDir} does not exist.`);
    process.exit(1);
}

const operationsSnapshot = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'tools', 'governance', 'release-health-operations.snapshot.json'),
        'utf8'
    )
);

const report = buildBundleBudgetReport({
    distDir,
    operationsSnapshot,
    provenance: {
        generatedBy: 'tools/scripts/check-build-budget.mjs',
    },
});

const summary = `${report.largestChunk.path} observed ${report.budget.observed} kB (warning >= ${report.budget.warningMax}, incident > ${report.budget.incidentMax}).`;

if (report.status === 'incident') {
    console.error(`Build budget check failed: ${summary}`);
    process.exit(1);
}

if (report.status === 'warning') {
    console.warn(`Build budget warning: ${summary}`);
} else {
    console.log(`Build budget check passed: ${summary}`);
}
