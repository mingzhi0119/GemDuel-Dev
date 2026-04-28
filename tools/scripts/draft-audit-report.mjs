/* eslint-disable no-console -- CLI progress */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDraftAuditReportMarkdown, loadGovernanceDraftInputs } from './draftAuditReport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const parseArgs = (argv) => {
    const args = {
        artifactsDir: path.join(repoRoot, 'artifacts', 'governance'),
        out: null,
        utcDate: new Date().toISOString().slice(0, 10),
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--artifacts-dir') {
            args.artifactsDir = path.resolve(process.cwd(), argv[index + 1] ?? args.artifactsDir);
            index += 1;
            continue;
        }

        if (value === '--out') {
            args.out = path.resolve(process.cwd(), argv[index + 1] ?? '');
            index += 1;
            continue;
        }

        if (value === '--utc-date') {
            args.utcDate = argv[index + 1] ?? args.utcDate;
            index += 1;
        }
    }

    return args;
};

const main = () => {
    const args = parseArgs(process.argv.slice(2));
    const inputs = loadGovernanceDraftInputs({
        artifactsDir: args.artifactsDir,
        readFileSync: fs.readFileSync,
        pathJoin: path.join,
    });
    const markdown = buildDraftAuditReportMarkdown({
        ...inputs,
        utcDate: args.utcDate,
    });
    const outPath =
        args.out ?? path.join(args.artifactsDir, `engineering-audit-draft-${args.utcDate}.md`);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, markdown, 'utf8');
    console.log(`Wrote draft audit report to ${outPath}`);
};

main();
