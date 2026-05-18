import { execFile } from 'node:child_process';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const comparePngScript = path.join(workspaceRoot, 'tools', 'migration', 'compare-png.ps1');

const usage = `Usage:
  pnpm parity:ui-root-compare -- --old <old-root> --new <new-root> --out <out-root> [--electron-root <root>] [--scenarios a,b] [--viewports 1920x1080,1366x768] [--common-only]

Compares old Unity and new Unity screenshots against the same fixed Electron baseline.
`;

const parseArgs = (argv) => {
    const args = {
        pixelThreshold: 16,
        positionTolerancePx: 2,
        thresholdPercent: 1,
        requireStrictPixel: true,
        commonOnly: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        const next = () => {
            index += 1;
            if (index >= argv.length) {
                throw new Error(`Missing value for ${arg}`);
            }
            return argv[index];
        };

        switch (arg) {
            case '--old':
                args.oldRoot = next();
                break;
            case '--new':
                args.newRoot = next();
                break;
            case '--electron-root':
                args.electronRoot = next();
                break;
            case '--out':
                args.outRoot = next();
                break;
            case '--scenarios':
                args.scenarios = splitList(next());
                break;
            case '--viewports':
                args.viewports = splitList(next());
                break;
            case '--pixel-threshold':
                args.pixelThreshold = Number(next());
                break;
            case '--position-tolerance-px':
                args.positionTolerancePx = Number(next());
                break;
            case '--threshold-percent':
                args.thresholdPercent = Number(next());
                break;
            case '--allow-mean-delta-pass':
                args.requireStrictPixel = false;
                break;
            case '--common-only':
                args.commonOnly = true;
                break;
            case '--help':
            case '-h':
                args.help = true;
                break;
            default:
                throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return args;
};

const splitList = (value) =>
    String(value)
        .split(/[,\s]+/u)
        .map((item) => item.trim())
        .filter(Boolean);

const resolveRoot = (root) => path.resolve(workspaceRoot, root);

const fileExists = async (filePath) => {
    try {
        await stat(filePath);
        return true;
    } catch {
        return false;
    }
};

const discoverScenarios = async (electronRoot, oldRoot, newRoot) => {
    const electronDir = path.join(electronRoot, 'electron');
    const entries = await readdir(electronDir, { withFileTypes: true });
    const scenarios = [];
    for (const entry of entries) {
        if (!entry.isDirectory()) {
            continue;
        }

        const scenario = entry.name;
        if (
            (await fileExists(path.join(oldRoot, 'unity', scenario))) &&
            (await fileExists(path.join(newRoot, 'unity', scenario)))
        ) {
            scenarios.push(scenario);
        }
    }

    return scenarios.sort();
};

const discoverViewports = async (electronRoot, oldRoot, newRoot, scenarios) => {
    const viewportSet = new Set();
    for (const scenario of scenarios) {
        const electronScenarioDir = path.join(electronRoot, 'electron', scenario);
        let entries = [];
        try {
            entries = await readdir(electronScenarioDir, { withFileTypes: true });
        } catch {
            continue;
        }

        for (const entry of entries) {
            if (!entry.isFile() || !entry.name.endsWith('.png')) {
                continue;
            }

            const viewport = entry.name.slice(0, -'.png'.length);
            if (
                (await fileExists(path.join(oldRoot, 'unity', scenario, `${viewport}.png`))) &&
                (await fileExists(path.join(newRoot, 'unity', scenario, `${viewport}.png`)))
            ) {
                viewportSet.add(viewport);
            }
        }
    }

    return [...viewportSet].sort();
};

const runComparePng = async ({ baselinePath, candidatePath, diffPath, args }) => {
    await mkdir(path.dirname(diffPath), { recursive: true });
    const commandArgs = [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        comparePngScript,
        '-BaselinePath',
        baselinePath,
        '-CandidatePath',
        candidatePath,
        '-DiffPath',
        diffPath,
        '-ThresholdPercent',
        String(args.thresholdPercent),
        '-PixelThreshold',
        String(args.pixelThreshold),
        '-PositionTolerancePx',
        String(args.positionTolerancePx),
    ];

    if (args.requireStrictPixel) {
        commandArgs.push('-RequireStrictPixel');
    }

    const result = await execFileAsync('powershell', commandArgs, {
        cwd: workspaceRoot,
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 16,
    });
    const jsonStart = result.stdout.indexOf('{');
    if (jsonStart < 0) {
        throw new Error(`compare-png.ps1 did not emit JSON for ${candidatePath}`);
    }

    return JSON.parse(result.stdout.slice(jsonStart));
};

const formatDelta = (value) => (value > 0 ? `+${value}` : String(value));

const writeMarkdown = async (summary, outRoot) => {
    const lines = [
        '# Fixed Electron Parity Root Compare',
        '',
        `- Old root: \`${summary.oldRoot}\``,
        `- New root: \`${summary.newRoot}\``,
        `- Electron baseline root: \`${summary.electronBaselineRoot}\``,
        `- Method: \`${summary.method}\``,
        `- Compared rows: ${summary.comparedRows}`,
        `- Skipped rows: ${summary.skippedRows.length}`,
        `- Old mismatched pixels: ${summary.oldTotalMismatchedPixels}`,
        `- New mismatched pixels: ${summary.newTotalMismatchedPixels}`,
        `- Delta mismatched pixels: ${formatDelta(summary.deltaMismatchedPixels)}`,
        `- Rows improved/regressed/unchanged: ${summary.improvedRows}/${summary.regressedRows}/${summary.unchangedRows}`,
        '',
        '| Scenario | Viewport | Old mismatch | New mismatch | Delta | Old similarity | New similarity |',
        '| --- | --- | ---: | ---: | ---: | ---: | ---: |',
    ];

    for (const row of summary.rows) {
        lines.push(
            `| \`${row.scenario}\` | \`${row.viewport}\` | ${row.oldMismatchedPixels} | ${row.newMismatchedPixels} | ${formatDelta(row.deltaMismatchedPixels)} | ${row.oldSimilarityPercent}% | ${row.newSimilarityPercent}% |`
        );
    }

    if (summary.skippedRows.length > 0) {
        lines.push(
            '',
            '## Skipped Rows',
            '',
            '| Scenario | Viewport | Missing screenshots |',
            '| --- | --- | --- |'
        );
        for (const row of summary.skippedRows) {
            lines.push(
                `| \`${row.scenario}\` | \`${row.viewport}\` | ${row.missing
                    .map((missing) => `\`${missing}\``)
                    .join('<br>')} |`
            );
        }
    }

    await writeFile(path.join(outRoot, 'summary.md'), `${lines.join('\n')}\n`, 'utf8');
};

const main = async () => {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        process.stdout.write(usage);
        return;
    }

    if (!args.oldRoot || !args.newRoot || !args.outRoot) {
        throw new Error(usage);
    }

    const oldRoot = resolveRoot(args.oldRoot);
    const newRoot = resolveRoot(args.newRoot);
    const electronRoot = resolveRoot(args.electronRoot ?? args.oldRoot);
    const outRoot = resolveRoot(args.outRoot);
    const scenarios = args.scenarios?.length
        ? args.scenarios
        : await discoverScenarios(electronRoot, oldRoot, newRoot);
    const viewports = args.viewports?.length
        ? args.viewports
        : await discoverViewports(electronRoot, oldRoot, newRoot, scenarios);

    if (scenarios.length === 0) {
        throw new Error('No comparable scenarios found.');
    }
    if (viewports.length === 0) {
        throw new Error('No comparable viewports found.');
    }

    await mkdir(outRoot, { recursive: true });
    const rows = [];
    const skippedRows = [];
    let oldTotalMismatchedPixels = 0;
    let newTotalMismatchedPixels = 0;

    for (const scenario of scenarios) {
        for (const viewport of viewports) {
            const electronPath = path.join(electronRoot, 'electron', scenario, `${viewport}.png`);
            const oldUnityPath = path.join(oldRoot, 'unity', scenario, `${viewport}.png`);
            const newUnityPath = path.join(newRoot, 'unity', scenario, `${viewport}.png`);
            const missing = [];
            for (const [label, filePath] of [
                ['electron', electronPath],
                ['old unity', oldUnityPath],
                ['new unity', newUnityPath],
            ]) {
                if (!(await fileExists(filePath))) {
                    missing.push(`${label}: ${filePath}`);
                }
            }
            if (missing.length > 0) {
                if (args.commonOnly) {
                    skippedRows.push({
                        scenario,
                        viewport,
                        missing,
                    });
                    continue;
                }
                throw new Error(`Missing screenshots for ${scenario} ${viewport}:\n${missing.join('\n')}`);
            }

            const oldDiffPath = path.join(outRoot, 'old', scenario, `${viewport}.png`);
            const newDiffPath = path.join(outRoot, 'new', scenario, `${viewport}.png`);
            const oldResult = await runComparePng({
                baselinePath: electronPath,
                candidatePath: oldUnityPath,
                diffPath: oldDiffPath,
                args,
            });
            const newResult = await runComparePng({
                baselinePath: electronPath,
                candidatePath: newUnityPath,
                diffPath: newDiffPath,
                args,
            });

            oldTotalMismatchedPixels += oldResult.mismatchedPixels;
            newTotalMismatchedPixels += newResult.mismatchedPixels;
            rows.push({
                scenario,
                viewport,
                oldMismatchedPixels: oldResult.mismatchedPixels,
                newMismatchedPixels: newResult.mismatchedPixels,
                deltaMismatchedPixels: newResult.mismatchedPixels - oldResult.mismatchedPixels,
                oldSimilarityPercent: oldResult.similarityPercent,
                newSimilarityPercent: newResult.similarityPercent,
                deltaSimilarityPercent: Number(
                    (newResult.similarityPercent - oldResult.similarityPercent).toFixed(6)
                ),
                oldDiffPath: path.relative(workspaceRoot, oldDiffPath),
                newDiffPath: path.relative(workspaceRoot, newDiffPath),
            });
        }
    }

    if (rows.length === 0) {
        throw new Error('No comparable screenshot rows found.');
    }

    const summary = {
        oldRoot: path.relative(workspaceRoot, oldRoot),
        newRoot: path.relative(workspaceRoot, newRoot),
        electronBaselineRoot: path.relative(workspaceRoot, electronRoot),
        method: `compare-png.ps1 threshold=${args.pixelThreshold} positionTolerancePx=${args.positionTolerancePx} fixed Electron baseline${args.commonOnly ? ' common-only' : ''}`,
        commonOnly: args.commonOnly,
        comparedRows: rows.length,
        skippedRows,
        oldTotalMismatchedPixels,
        newTotalMismatchedPixels,
        deltaMismatchedPixels: newTotalMismatchedPixels - oldTotalMismatchedPixels,
        improvedRows: rows.filter((row) => row.deltaMismatchedPixels < 0).length,
        regressedRows: rows.filter((row) => row.deltaMismatchedPixels > 0).length,
        unchangedRows: rows.filter((row) => row.deltaMismatchedPixels === 0).length,
        rows,
    };

    await writeFile(path.join(outRoot, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    await writeMarkdown(summary, outRoot);
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
};

main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
});
