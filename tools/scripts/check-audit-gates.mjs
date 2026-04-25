import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    buildAuditGateSummary,
    collectAuditGateSummaryErrors,
    finalizeAuditGateSummary,
    renderAuditGateMarkdown,
} from './auditGateSummary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const parseArgs = (argv) => {
    const args = {
        outDir: path.join(repoRoot, 'artifacts', 'governance'),
        pretty: true,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--out-dir') {
            args.outDir = path.resolve(repoRoot, argv[index + 1] ?? args.outDir);
            index += 1;
            continue;
        }

        if (value === '--compact') {
            args.pretty = false;
        }
    }

    return args;
};

const readJson = (relativePath) =>
    JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));

const writeJson = (filePath, value, pretty) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, pretty ? 2 : 0)}\n`, 'utf8');
};

const writeText = (filePath, value) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, value, 'utf8');
};

const main = () => {
    const args = parseArgs(process.argv.slice(2));
    const gateSnapshot = readJson('tools/governance/audit-gates.snapshot.json');
    const workflowTexts = Object.fromEntries(
        Object.keys(gateSnapshot.workflowCommands ?? {}).map((workflowPath) => [
            workflowPath,
            fs.readFileSync(path.join(repoRoot, workflowPath), 'utf8'),
        ])
    );
    const summary = buildAuditGateSummary({
        gateSnapshot,
        packageJson: readJson('package.json'),
        workflowTexts,
    });
    const errors = collectAuditGateSummaryErrors({
        gateSnapshot,
        summary,
    });
    const report = finalizeAuditGateSummary({
        summary,
        errors,
        generatedAt: new Date().toISOString(),
        provenance: {
            generatedBy: 'tools/scripts/check-audit-gates.mjs',
            sha: process.env.GITHUB_SHA ?? null,
            ref: process.env.GITHUB_REF ?? null,
        },
    });

    writeJson(path.join(args.outDir, 'audit-gates.report.json'), report, args.pretty);
    writeText(path.join(args.outDir, 'audit-gates.report.md'), renderAuditGateMarkdown(report));

    if (errors.length > 0) {
        console.error('Audit gate summary failed:');
        for (const error of errors) {
            console.error(`- ${error}`);
        }
        process.exit(1);
    }

    console.log(
        `Audit gate summary passed and wrote ${path.join(args.outDir, 'audit-gates.report.json')}.`
    );
};

main();
