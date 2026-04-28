import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { computeFileMetrics, roundPct } from './coverageIstanbulMetrics.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_REPO_ROOT = path.resolve(__dirname, '../..');

const THRESHOLDS = {
    statements: 92,
    lines: 92,
    functions: 95,
    branches: 88,
};

const SOURCE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs)$/;

const INCLUDED_PREFIXES = [
    'apps/desktop/src/',
    'apps/desktop/electron/',
    'packages/shared/src/',
    'packages/ui/src/',
    'packages/turn-service/src/',
    'tools/scripts/',
];

const parseArgs = (argv) => {
    const args = {
        repoRoot: DEFAULT_REPO_ROOT,
        coverageFile: 'apps/desktop/coverage/coverage-final.json',
        outMd: 'artifacts/governance/coverage-diff.md',
        base: null,
        head: null,
        appendStepSummary: false,
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
        if (a === '--out-md') {
            args.outMd = argv[i + 1] ?? args.outMd;
            i += 1;
            continue;
        }
        if (a === '--base') {
            args.base = argv[i + 1] ?? null;
            i += 1;
            continue;
        }
        if (a === '--head') {
            args.head = argv[i + 1] ?? null;
            i += 1;
            continue;
        }
        if (a === '--append-step-summary') {
            args.appendStepSummary = true;
        }
    }

    return args;
};

const isIncludedSource = (relPath) => {
    const n = relPath.replace(/\\/g, '/');
    if (!SOURCE_EXT.test(n) || n.endsWith('.d.ts')) {
        return false;
    }
    if (n.includes('/__tests__/') || n.includes('/tests/')) {
        return false;
    }
    return INCLUDED_PREFIXES.some((p) => n.startsWith(p));
};

const gitNameOnly = (repoRoot, base, head) => {
    const out = execFileSync('git', ['diff', '--name-only', base, head], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    return out
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
};

const resolveDiffRange = (repoRoot, baseArg, headArg) => {
    if (baseArg && headArg) {
        return [baseArg, headArg];
    }
    try {
        const base = execFileSync('git', ['merge-base', 'origin/main', 'HEAD'], {
            cwd: repoRoot,
            encoding: 'utf8',
        }).trim();
        return [base, 'HEAD'];
    } catch {
        try {
            const base = execFileSync('git', ['rev-parse', 'HEAD~1'], {
                cwd: repoRoot,
                encoding: 'utf8',
            }).trim();
            const head = execFileSync('git', ['rev-parse', 'HEAD'], {
                cwd: repoRoot,
                encoding: 'utf8',
            }).trim();
            return [base, head];
        } catch {
            return [null, null];
        }
    }
};

const findCoverageKey = (coverageFinal, repoRoot, relPath) => {
    const relNorm = relPath.replace(/\\/g, '/');
    const abs = path.resolve(repoRoot, relPath).replace(/\\/g, '/');
    for (const key of Object.keys(coverageFinal ?? {})) {
        const k = key.replace(/\\/g, '/');
        if (k === abs || k.endsWith(`/${relNorm}`) || k.endsWith(relNorm)) {
            return key;
        }
    }
    return null;
};

const gap = (threshold, pct) => Math.max(0, roundPct(threshold - pct));

const scoreFile = (m) => {
    if (!m) {
        return (
            gap(THRESHOLDS.lines, 0) +
            gap(THRESHOLDS.branches, 0) +
            gap(THRESHOLDS.functions, 0) +
            gap(THRESHOLDS.statements, 0)
        );
    }
    return (
        gap(THRESHOLDS.lines, m.lines) +
        gap(THRESHOLDS.branches, m.branches) +
        gap(THRESHOLDS.functions, m.functions) +
        gap(THRESHOLDS.statements, m.statements)
    );
};

const failsThresholds = (m) => {
    if (!m) {
        return true;
    }
    return (
        m.lines < THRESHOLDS.lines ||
        m.branches < THRESHOLDS.branches ||
        m.functions < THRESHOLDS.functions ||
        m.statements < THRESHOLDS.statements
    );
};

const buildMarkdown = ({
    changedSources,
    coverageFinal,
    repoRoot,
    coveragePath,
    coverageExists,
}) => {
    const lines = [];
    lines.push('## Coverage diff (PR touched files)');
    lines.push('');
    lines.push(
        coverageExists
            ? `Coverage data: \`${coveragePath}\` (loaded).`
            : `**No coverage file** at \`${coveragePath}\` — run \`pnpm run test:coverage\` after fixing tests.`
    );

    let totalDeduction = 0;
    const rows = [];

    for (const rel of changedSources) {
        const key = coverageExists ? findCoverageKey(coverageFinal, repoRoot, rel) : null;
        const entry = key ? coverageFinal[key] : null;
        const m = entry ? computeFileMetrics(entry) : null;
        const deduction = scoreFile(m);
        totalDeduction += deduction;
        const fail = failsThresholds(m);
        const uncovered = !m || (m.lines === 0 && m.statements === 0);
        const prefix = uncovered ? '**NEW/UNCOVERED** ' : '';
        rows.push({
            rel,
            line: m ? `${m.lines}%` : '0%',
            br: m ? `${m.branches}%` : '0%',
            fn: m ? `${m.functions}%` : '0%',
            st: m ? `${m.statements}%` : '0%',
            deduction: String(roundPct(deduction)),
            status: fail ? 'FAIL' : 'ok',
            prefix,
        });
    }

    lines.push('');
    lines.push(`**Total deduction (sum of gap vs thresholds):** ${roundPct(totalDeduction)}`);
    lines.push('');
    lines.push('### Fix entry');
    lines.push('');
    lines.push(
        '- Run focused coverage: `pnpm --dir apps/desktop vitest --coverage --run <path/to/file.test.ts>`'
    );
    lines.push('- Full seal run: `pnpm run test:coverage`');
    lines.push(
        '- Seal exclusions (ADR-backed only): `docs/adr/0008-seal-coverage-exclusion-governance.md`'
    );
    lines.push('- After changing exclusions: `pnpm run seal-exclusions:check`');
    lines.push('');

    if (rows.length === 0) {
        lines.push('_No matching source files in this diff (see desktop coverage include paths)._');
        lines.push('');
        return `${lines.join('\n')}\n`;
    }

    lines.push('### Per-file (lines / branches / functions / statements)');
    lines.push('');
    lines.push(
        '| File | Lines | Branches | Funcs | Stmts | Deduction | Status |',
        '| --- | --- | --- | --- | --- | ---: | --- |'
    );
    for (const r of rows) {
        lines.push(
            `| ${r.prefix}\`${r.rel}\` | ${r.line} | ${r.br} | ${r.fn} | ${r.st} | ${r.deduction} | **${r.status}** |`
        );
    }
    lines.push('');
    lines.push(
        `_Thresholds: lines ≥ ${THRESHOLDS.lines}%, statements ≥ ${THRESHOLDS.statements}%, functions ≥ ${THRESHOLDS.functions}%, branches ≥ ${THRESHOLDS.branches}%._`
    );
    lines.push('');
    return `${lines.join('\n')}\n`;
};

const main = () => {
    const args = parseArgs(process.argv.slice(2));
    const repoRoot = args.repoRoot;
    const absCoverage = path.isAbsolute(args.coverageFile)
        ? args.coverageFile
        : path.join(repoRoot, args.coverageFile);
    const absOutMd = path.isAbsolute(args.outMd) ? args.outMd : path.join(repoRoot, args.outMd);

    const [base, head] = resolveDiffRange(repoRoot, args.base, args.head);
    let changed = [];
    if (base && head) {
        try {
            changed = gitNameOnly(repoRoot, base, head);
        } catch {
            changed = [];
        }
    }

    const changedSources = changed
        .map((p) => p.replace(/\\/g, '/'))
        .filter((p) => isIncludedSource(p));

    let coverageFinal = {};
    let coverageExists = false;
    if (fs.existsSync(absCoverage)) {
        try {
            coverageFinal = JSON.parse(fs.readFileSync(absCoverage, 'utf8'));
            coverageExists = true;
        } catch {
            coverageFinal = {};
            coverageExists = false;
        }
    }

    const md = buildMarkdown({
        changedSources,
        coverageFinal,
        repoRoot,
        coveragePath: path.relative(repoRoot, absCoverage).replace(/\\/g, '/'),
        coverageExists,
    });

    fs.mkdirSync(path.dirname(absOutMd), { recursive: true });
    fs.writeFileSync(absOutMd, md, 'utf8');

    if (args.appendStepSummary && process.env.GITHUB_STEP_SUMMARY) {
        const summaryPath = process.env.GITHUB_STEP_SUMMARY;
        const prev = fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, 'utf8') : '';
        fs.writeFileSync(summaryPath, prev ? `${md}\n${prev}` : md, 'utf8');
    }

    process.stdout.write(`Wrote ${path.relative(repoRoot, absOutMd).replace(/\\/g, '/')}\n`);
};

main();
