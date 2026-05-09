/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildGovernanceDashboardHtml } from './governanceDashboardHtml.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const parseArgs = (argv) => {
    const args = {
        artifactsDir: path.join(repoRoot, 'artifacts', 'governance'),
        extraEvidenceDirs: [],
        allowPartial: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const value = argv[index];
        if (value === '--artifacts-dir') {
            args.artifactsDir = path.resolve(repoRoot, argv[index + 1] ?? args.artifactsDir);
            index += 1;
            continue;
        }

        if (value === '--extra-evidence-dirs') {
            const raw = argv[index + 1] ?? '';
            index += 1;
            args.extraEvidenceDirs = raw
                .split(',')
                .map((entry) => entry.trim())
                .filter(Boolean)
                .map((entry) => path.resolve(repoRoot, entry));
            continue;
        }

        if (value === '--allow-partial') {
            args.allowPartial = true;
        }
    }

    return args;
};

const readOptionalJson = (absolutePath) => {
    if (!fs.existsSync(absolutePath)) {
        return null;
    }

    try {
        return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    } catch {
        return null;
    }
};

const summarizeRetainedDirs = (dirs) => {
    if (!dirs.length) {
        return '';
    }

    const counts = dirs.map((dir) => {
        const jsonCount = fs.existsSync(dir)
            ? fs.readdirSync(dir).filter((name) => name.endsWith('.json')).length
            : 0;
        return `${path.relative(repoRoot, dir).replaceAll(path.sep, '/')} (${jsonCount} json files)`;
    });

    return `Additional evidence directories scanned: ${counts.join('; ')}.`;
};

const main = () => {
    const { artifactsDir, extraEvidenceDirs, allowPartial } = parseArgs(process.argv.slice(2));
    const generatedAt = new Date().toISOString();

    const dashboard = readOptionalJson(
        path.join(artifactsDir, 'lifecycle-governance.dashboard.json')
    );
    const certification = readOptionalJson(
        path.join(artifactsDir, 'lifecycle-certification.report.json')
    );
    const auditGate = readOptionalJson(path.join(artifactsDir, 'audit-gates.report.json'));
    const lifecycle = readOptionalJson(path.join(artifactsDir, 'lifecycle-governance.report.json'));
    const bundleBudget = readOptionalJson(path.join(artifactsDir, 'bundle-budget.report.json'));
    const benchmarks = readOptionalJson(
        path.join(artifactsDir, 'lifecycle-benchmarks.report.json')
    );
    const perFileCoverage = readOptionalJson(
        path.join(artifactsDir, 'coverage-perfile-key-modules.report.json')
    );
    const manifestPath = path.join(artifactsDir, 'governance-evidence.manifest.json');
    const manifest = readOptionalJson(manifestPath);

    if (!manifest && !allowPartial) {
        console.error(
            `Governance dashboard requires a complete evidence manifest at ${path.relative(repoRoot, manifestPath).replaceAll(path.sep, '/')}.`
        );
        console.error(
            'Run `pnpm governance:artifacts --out-dir artifacts/governance` first, or pass `--allow-partial` for a diagnostic dashboard.'
        );
        process.exit(1);
    }

    const retainedNote = [
        !manifest && allowPartial
            ? 'Partial diagnostic dashboard: governance evidence manifest was not loaded.'
            : '',
        'GitHub Actions retains governance-evidence artifacts for 30 days; download historical ZIPs to compare trends locally.',
        summarizeRetainedDirs(extraEvidenceDirs),
    ]
        .filter(Boolean)
        .join(' ');

    const html = buildGovernanceDashboardHtml({
        generatedAt,
        artifactsLabel:
            path.relative(repoRoot, artifactsDir).replaceAll(path.sep, '/') ||
            'artifacts/governance',
        retainedEvidenceNote: retainedNote,
        dashboard,
        certification,
        auditGate,
        lifecycle,
        bundleBudget,
        benchmarks,
        perFileCoverage,
        manifest,
    });

    const outPath = path.join(artifactsDir, 'governance-dashboard.html');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`Wrote ${path.relative(repoRoot, outPath).replaceAll(path.sep, '/')}`);
};

main();
