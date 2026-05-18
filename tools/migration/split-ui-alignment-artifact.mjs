import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const usage = `Usage:
  pnpm parity:ui-split -- --root <artifact-root> [--out <out-dir>]

Splits a ui-alignment artifact into an active failing workset and a minimal completed-row archive.
The original generated reports are left untouched.
`;

const parseArgs = (argv) => {
    const args = {};

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
            case '--root':
                args.root = next();
                break;
            case '--out':
                args.out = next();
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

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const writeJson = async (filePath, value) => {
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const inferScenarioId = (row) => {
    const visualDiff = row.artifacts?.visualDiff ?? row.visualDiff;
    if (visualDiff) {
        return path.basename(path.dirname(visualDiff));
    }
    const screenshot = row.artifacts?.electronScreenshot ?? row.electronScreenshot;
    if (screenshot) {
        return path.basename(path.dirname(screenshot));
    }
    return row.scenario?.replace(/\s+\([^)]*\)$/, '') ?? 'unknown';
};

const inferViewport = (row) => {
    const visualDiff = row.artifacts?.visualDiff ?? row.visualDiff;
    if (visualDiff) {
        return path.basename(visualDiff).replace(/-visual-diff\.json$/i, '');
    }
    const screenshot = row.artifacts?.electronScreenshot ?? row.electronScreenshot;
    if (screenshot) {
        return path.basename(screenshot, path.extname(screenshot));
    }
    const match = /\((\d+x\d+)\)\s*$/.exec(row.scenarioName ?? row.scenario ?? '');
    return match?.[1] ?? row.viewport ?? 'unknown';
};

const readVisualSummary = async (row) => {
    const visualDiffPath = row.artifacts?.visualDiff;
    if (!visualDiffPath) {
        return {};
    }
    try {
        const visualDiff = await readJson(visualDiffPath);
        return {
            similarityPercent: visualDiff.similarityPercent,
            mismatchPercent: visualDiff.mismatchPercent,
            mismatchedPixels: visualDiff.mismatchedPixels,
            meanAbsoluteDelta: visualDiff.meanAbsoluteDelta,
            requiredSimilarityPercent: visualDiff.requiredSimilarityPercent,
        };
    } catch {
        return {};
    }
};

const completedMatrixSummary = async (row) => ({
    scenario: inferScenarioId(row),
    scenarioName: row.scenario,
    viewport: inferViewport(row),
    status: row.status,
    actionBehaviorResult: row.actionBehaviorResult,
    operationContractResult: row.operationContractResult,
    pixelVisualDiffResult: row.pixelVisualDiffResult,
    ...(await readVisualSummary(row)),
});

const completedHotspotSummary = (row) => ({
    scenario: row.scenario,
    scenarioName: row.scenarioName,
    viewport: row.viewport,
    status: row.status,
    visualSimilarityPercent: row.visualSimilarityPercent,
    visualMismatchPercent: row.visualMismatchPercent,
    pixelThreshold: row.pixelThreshold,
});

const formatPercent = (value) => (Number.isFinite(value) ? `${value.toFixed(6)}%` : 'n/a');

const formatInteger = (value) =>
    Number.isFinite(value) ? new Intl.NumberFormat('en-US').format(Math.round(value)) : 'n/a';

const topHotspotText = (row, limit = 3) => {
    const regions = [
        ...(row.topDenseSemanticRegions ?? []),
        ...(row.topNonFullscreenSemanticRegions ?? []),
        ...(row.topSemanticRegions ?? []),
    ];
    const unique = [];
    const seen = new Set();
    for (const region of regions) {
        if (!region?.key || seen.has(region.key)) {
            continue;
        }
        seen.add(region.key);
        unique.push(
            `${region.key} ${formatPercent(region.mismatchPercent)} / ${formatInteger(
                region.mismatchedPixels
            )} px`
        );
        if (unique.length >= limit) {
            break;
        }
    }
    return unique.join('; ');
};

const writeActiveHotspotMarkdown = async (filePath, rows) => {
    const lines = [
        '# Active UI Alignment Hotspots',
        '',
        'Generated from failing rows only. Completed rows are archived as minimal summaries.',
        '',
        '| Scenario | Viewport | Similarity | Top hotspots |',
        '| --- | --- | ---: | --- |',
    ];

    for (const row of rows) {
        lines.push(
            [
                row.scenario,
                row.viewport,
                formatPercent(row.visualSimilarityPercent),
                topHotspotText(row).replace(/\|/g, '\\|'),
            ]
                .map((value) => String(value ?? ''))
                .join(' | ')
                .replace(/^/, '| ')
                .replace(/$/, ' |')
        );
    }

    await writeFile(filePath, `${lines.join('\n')}\n`);
};

const writeCompletedMarkdown = async (filePath, matrixRows, hotspotRows) => {
    const lines = [
        '# Completed UI Alignment Rows',
        '',
        `Completed matrix rows: ${matrixRows.length}`,
        `Completed hotspot rows: ${hotspotRows.length}`,
        '',
        '| Scenario | Viewport | Similarity | Status |',
        '| --- | --- | ---: | --- |',
    ];

    for (const row of matrixRows) {
        lines.push(
            [
                row.scenario,
                row.viewport,
                formatPercent(row.similarityPercent),
                row.status,
            ]
                .map((value) => String(value ?? ''))
                .join(' | ')
                .replace(/^/, '| ')
                .replace(/$/, ' |')
        );
    }

    await writeFile(filePath, `${lines.join('\n')}\n`);
};

const main = async () => {
    const args = parseArgs(process.argv.slice(2));
    if (args.help || !args.root) {
        console.log(usage);
        process.exit(args.help ? 0 : 1);
    }

    const artifactRoot = path.resolve(args.root);
    const outRoot = path.resolve(args.out ?? path.join(artifactRoot, 'token-safe-archive'));
    const activeRoot = path.join(outRoot, 'active');
    const completedRoot = path.join(outRoot, 'completed');
    await mkdir(activeRoot, { recursive: true });
    await mkdir(completedRoot, { recursive: true });

    const matrixPath = path.join(artifactRoot, 'parity-matrix.json');
    const hotspotPath = path.join(artifactRoot, 'hotspot-report.json');
    const matrixRows = await readJson(matrixPath);
    const hotspotReport = await readJson(hotspotPath);
    if (!Array.isArray(matrixRows)) {
        throw new Error(`Expected ${matrixPath} to contain a row array.`);
    }
    if (!Array.isArray(hotspotReport.rows)) {
        throw new Error(`Expected ${hotspotPath} to contain a rows array.`);
    }

    const activeMatrixRows = matrixRows.filter((row) => row.status !== 'Equivalent');
    const completedMatrixRows = matrixRows.filter((row) => row.status === 'Equivalent');
    const activeHotspotRows = hotspotReport.rows.filter((row) => row.status !== 'Equivalent');
    const completedHotspotRows = hotspotReport.rows.filter((row) => row.status === 'Equivalent');
    const completedMatrixSummaries = await Promise.all(
        completedMatrixRows.map(completedMatrixSummary)
    );
    const completedHotspotSummaries = completedHotspotRows.map(completedHotspotSummary);

    await writeJson(path.join(activeRoot, 'parity-matrix.json'), activeMatrixRows);
    await writeJson(path.join(activeRoot, 'hotspot-report.json'), {
        ...hotspotReport,
        rows: activeHotspotRows,
        splitFrom: artifactRoot,
        splitPolicy: 'active rows keep full hotspot details; completed rows are summarized separately',
    });
    await writeActiveHotspotMarkdown(path.join(activeRoot, 'hotspot-report.md'), activeHotspotRows);
    await writeJson(path.join(completedRoot, 'parity-matrix.summary.json'), completedMatrixSummaries);
    await writeJson(
        path.join(completedRoot, 'hotspot-report.summary.json'),
        completedHotspotSummaries
    );
    await writeCompletedMarkdown(
        path.join(completedRoot, 'summary.md'),
        completedMatrixSummaries,
        completedHotspotSummaries
    );

    const summary = {
        artifactRoot,
        outRoot,
        matrixRows: matrixRows.length,
        activeMatrixRows: activeMatrixRows.length,
        completedMatrixRows: completedMatrixRows.length,
        hotspotRows: hotspotReport.rows.length,
        activeHotspotRows: activeHotspotRows.length,
        completedHotspotRows: completedHotspotRows.length,
        files: {
            activeMatrix: path.join(activeRoot, 'parity-matrix.json'),
            activeHotspotJson: path.join(activeRoot, 'hotspot-report.json'),
            activeHotspotMarkdown: path.join(activeRoot, 'hotspot-report.md'),
            completedMatrixSummary: path.join(completedRoot, 'parity-matrix.summary.json'),
            completedHotspotSummary: path.join(completedRoot, 'hotspot-report.summary.json'),
            completedSummaryMarkdown: path.join(completedRoot, 'summary.md'),
        },
    };
    await writeJson(path.join(outRoot, 'summary.json'), summary);

    console.log(`Wrote token-safe archive: ${outRoot}`);
    console.log(
        `Matrix rows: ${matrixRows.length} -> active ${activeMatrixRows.length}, completed ${completedMatrixRows.length}`
    );
    console.log(
        `Hotspot rows: ${hotspotReport.rows.length} -> active ${activeHotspotRows.length}, completed ${completedHotspotRows.length}`
    );
};

main().catch((error) => {
    console.error(error.stack ?? error.message ?? String(error));
    process.exit(1);
});
