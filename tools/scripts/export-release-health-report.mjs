import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    buildReleaseHealthReport,
    parseReleaseHealthSourceText,
    serializeReleaseHealthReport,
} from './releaseHealthReport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const operationsSnapshotPath = path.join(
    repoRoot,
    'tools',
    'governance',
    'release-health-operations.snapshot.json'
);

const readStdin = async () =>
    new Promise((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
        });
        process.stdin.on('end', () => resolve(data));
        process.stdin.on('error', reject);
    });

const parseArgs = (argv) => {
    const args = {
        inputPath: '-',
        outPath: null,
        pretty: true,
    };

    const positional = [];
    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--out') {
            args.outPath = argv[index + 1] ?? null;
            index += 1;
            continue;
        }

        if (value === '--compact') {
            args.pretty = false;
            continue;
        }

        if (value === '--pretty') {
            args.pretty = true;
            continue;
        }

        positional.push(value);
    }

    if (positional[0]) {
        args.inputPath = positional[0];
    }

    return args;
};

const readOperationsSnapshot = () => JSON.parse(fs.readFileSync(operationsSnapshotPath, 'utf8'));

const buildProvenance = () => ({
    repository: process.env.GITHUB_REPOSITORY ?? null,
    sha: process.env.GITHUB_SHA ?? null,
    ref: process.env.GITHUB_REF ?? null,
    workflowName: process.env.GITHUB_WORKFLOW ?? null,
    runId: process.env.GITHUB_RUN_ID ?? null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
    jobName: process.env.GITHUB_JOB ?? null,
    generatedBy: 'tools/scripts/export-release-health-report.mjs',
});

const readInputText = async (inputPath) => {
    if (!inputPath || inputPath === '-') {
        return readStdin();
    }

    return fs.readFileSync(path.resolve(repoRoot, inputPath), 'utf8');
};

const main = async () => {
    const { inputPath, outPath, pretty } = parseArgs(process.argv.slice(2));
    const sourceText = await readInputText(inputPath);
    const source = parseReleaseHealthSourceText(sourceText);
    const report = buildReleaseHealthReport({
        source,
        operationsSnapshot: readOperationsSnapshot(),
        provenance: buildProvenance(),
        sourcePath: inputPath === '-' ? null : path.resolve(repoRoot, inputPath),
    });
    const outputText = serializeReleaseHealthReport(report, { pretty });

    if (outPath) {
        fs.writeFileSync(path.resolve(repoRoot, outPath), outputText, 'utf8');
        console.log(`Wrote release-health report to ${path.resolve(repoRoot, outPath)}`);
        return;
    }

    process.stdout.write(outputText);
};

main().catch((error) => {
    console.error('Failed to export release-health report:');
    console.error(error instanceof Error ? (error.stack ?? error.message) : String(error));
    process.exit(1);
});
