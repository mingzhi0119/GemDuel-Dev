import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PER_FILE_KEY_MODULE_RULES } from '@gemduel/config-vitest/per-file-key-modules';
import { isSealCoverageExcludedDesktopPath } from '@gemduel/config-vitest/seal-exclusions';
import { computeFileMetrics } from './coverageIstanbulMetrics.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_REPO_ROOT = path.resolve(__dirname, '../..');

const SCHEMA_VERSION = 1;

const parseArgs = (argv) => {
    const args = {
        repoRoot: DEFAULT_REPO_ROOT,
        coverageFile: 'apps/desktop/coverage/coverage-final.json',
        outJson: 'artifacts/governance/coverage-perfile-key-modules.report.json',
        enforce: false,
    };

    for (let i = 0; i < argv.length; i += 1) {
        const a = argv[i];
        if (a === '--repo-root') {
            args.repoRoot = path.resolve(argv[i + 1] ?? args.repoRoot);
            i += 1;
            continue;
        }
        if (a === '--coverage-file') {
            args.coverageFile = argv[i + 1] ?? args.coverageFile;
            i += 1;
            continue;
        }
        if (a === '--out-json') {
            args.outJson = argv[i + 1] ?? args.outJson;
            i += 1;
            continue;
        }
        if (a === '--enforce') {
            args.enforce = true;
        }
    }

    return args;
};

const absToRepoRel = (absKey, repoRoot) => {
    const a = path.resolve(absKey).replace(/\\/g, '/');
    const r = path.resolve(repoRoot).replace(/\\/g, '/');
    const prefix = `${r}/`;
    if (!a.startsWith(prefix)) {
        return null;
    }
    return a.slice(prefix.length);
};

const findApplicableRule = (relPath) => {
    let best = null;
    for (const rule of PER_FILE_KEY_MODULE_RULES) {
        if (rule.match(relPath)) {
            if (!best || rule.minLines > best.minLines) {
                best = {
                    id: rule.id,
                    minLines: rule.minLines,
                };
            }
        }
    }
    return best;
};

const main = () => {
    const args = parseArgs(process.argv.slice(2));
    const repoRoot = args.repoRoot;
    const absCoverage = path.isAbsolute(args.coverageFile)
        ? args.coverageFile
        : path.join(repoRoot, args.coverageFile);
    const absOut = path.isAbsolute(args.outJson) ? args.outJson : path.join(repoRoot, args.outJson);

    const generatedAt = new Date().toISOString();
    /** @type {{ schemaVersion: number, generatedAt: string, status: string, violations: unknown[], notes?: string }} */
    const report = {
        schemaVersion: SCHEMA_VERSION,
        generatedAt,
        status: 'passed',
        violations: [],
    };

    if (!fs.existsSync(absCoverage)) {
        report.status = 'failed';
        report.notes = `Coverage file missing: ${path.relative(repoRoot, absCoverage).replace(/\\/g, '/')}`;
        report.violations.push({
            file: path.relative(repoRoot, absCoverage).replace(/\\/g, '/'),
            ruleId: 'coverage-artifact',
            minimumLines: 1,
            actualLines: 0,
            detail: 'Run pnpm run test:coverage first.',
        });
        fs.mkdirSync(path.dirname(absOut), {
            recursive: true,
        });
        fs.writeFileSync(absOut, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
        console.warn(`[coverage-perfile-key-modules] ${report.notes}`);
        if (args.enforce) {
            process.exit(1);
        }
        process.exit(0);
    }

    let coverageFinal = {};
    try {
        coverageFinal = JSON.parse(fs.readFileSync(absCoverage, 'utf8'));
    } catch {
        report.status = 'failed';
        report.notes = 'coverage-final.json could not be parsed.';
        report.violations.push({
            file: path.relative(repoRoot, absCoverage).replace(/\\/g, '/'),
            ruleId: 'coverage-artifact',
            minimumLines: 1,
            actualLines: 0,
            detail: 'Invalid JSON',
        });
        fs.mkdirSync(path.dirname(absOut), {
            recursive: true,
        });
        fs.writeFileSync(absOut, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
        console.warn(`[coverage-perfile-key-modules] ${report.notes}`);
        if (args.enforce) {
            process.exit(1);
        }
        process.exit(0);
    }

    for (const absKey of Object.keys(coverageFinal)) {
        const rel = absToRepoRel(absKey, repoRoot);
        if (!rel) {
            continue;
        }
        const desktopRel = rel.replace(/^apps\/desktop\//, '');
        if (isSealCoverageExcludedDesktopPath(desktopRel)) {
            continue;
        }

        const rule = findApplicableRule(rel);
        if (!rule) {
            continue;
        }
        const entry = coverageFinal[absKey];
        const m = computeFileMetrics(entry);
        const actual = m?.lines ?? 0;
        if (actual < rule.minLines) {
            report.violations.push({
                file: rel,
                ruleId: rule.id,
                minimumLines: rule.minLines,
                actualLines: actual,
            });
        }
    }

    if (report.violations.length > 0) {
        report.status = 'failed';
        for (const v of report.violations) {
            console.warn(
                `[coverage-perfile-key-modules] ${v.file} (${v.ruleId}): lines ${v.actualLines}% < ${v.minimumLines}%`
            );
        }
    }

    fs.mkdirSync(path.dirname(absOut), {
        recursive: true,
    });
    fs.writeFileSync(absOut, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

    process.stdout.write(
        `Wrote ${path.relative(repoRoot, absOut).replace(/\\/g, '/')} (${report.status}, ${report.violations.length} violations)\n`
    );

    if (args.enforce && report.status === 'failed') {
        process.exit(1);
    }
};

main();
