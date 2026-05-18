import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const usage = `Usage:
  pnpm parity:ui-summary -- --root <artifact-root> [--top 12] [--hotspots 3] [--json] [--sizes]

Summarizes an Electron-vs-Unity ui-alignment artifact without dumping large screenshot reports.
`;

const parseArgs = (argv) => {
    const args = {
        top: 12,
        hotspots: 3,
        json: false,
        sizes: false,
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
            case '--root':
                args.root = next();
                break;
            case '--top':
                args.top = Number(next());
                break;
            case '--hotspots':
                args.hotspots = Number(next());
                break;
            case '--json':
                args.json = true;
                break;
            case '--sizes':
                args.sizes = true;
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

const readJson = async (filePath, fallback = null) => {
    try {
        return JSON.parse(await readFile(filePath, 'utf8'));
    } catch (error) {
        if (error?.code === 'ENOENT') {
            return fallback;
        }
        throw error;
    }
};

const formatPercent = (value) => (Number.isFinite(value) ? `${value.toFixed(6)}%` : 'n/a');

const formatInteger = (value) =>
    Number.isFinite(value) ? new Intl.NumberFormat('en-US').format(Math.round(value)) : 'n/a';

const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes)) {
        return 'n/a';
    }
    if (bytes >= 1024 * 1024) {
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    }
    if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} B`;
};

const inferScenarioId = (row) => {
    const visualDiff = row.artifacts?.visualDiff;
    if (visualDiff) {
        return path.basename(path.dirname(visualDiff));
    }
    const screenshot = row.artifacts?.electronScreenshot ?? row.artifacts?.unityScreenshot;
    if (screenshot) {
        return path.basename(path.dirname(screenshot));
    }
    return row.scenario?.replace(/\s+\([^)]*\)$/, '') ?? 'unknown';
};

const inferViewport = (row) => {
    const visualDiff = row.artifacts?.visualDiff;
    if (visualDiff) {
        return path.basename(visualDiff).replace(/-visual-diff\.json$/i, '');
    }
    const screenshot = row.artifacts?.electronScreenshot ?? row.artifacts?.unityScreenshot;
    if (screenshot) {
        return path.basename(screenshot, path.extname(screenshot));
    }
    const match = /\((\d+x\d+)\)\s*$/.exec(row.scenario ?? '');
    return match?.[1] ?? 'unknown';
};

const summarizeRow = async (row) => {
    const visualDiffPath = row.artifacts?.visualDiff;
    const visualDiff = visualDiffPath ? await readJson(visualDiffPath, null) : null;
    return {
        scenario: inferScenarioId(row),
        scenarioName: row.scenario,
        viewport: inferViewport(row),
        status: row.status,
        visualDiffPath,
        similarityPercent: visualDiff?.similarityPercent,
        mismatchPercent: visualDiff?.mismatchPercent,
        mismatchedPixels: visualDiff?.mismatchedPixels,
        totalPixels: visualDiff?.totalPixels,
        meanAbsoluteDelta: visualDiff?.meanAbsoluteDelta,
        requiredSimilarityPercent: visualDiff?.requiredSimilarityPercent,
        strictPixelOk: visualDiff?.strictPixelOk,
        sizeMismatch: visualDiff?.sizeMismatch,
    };
};

const hotspotScore = (region) => Number(region?.mismatchedPixels ?? 0);

const summarizeHotspotRegion = (region) => ({
    key: region.key,
    mismatchPercent: region.mismatchPercent,
    similarityPercent: region.similarityPercent,
    mismatchedPixels: region.mismatchedPixels,
    rect: {
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
    },
});

const addHotspotRows = (rows, hotspotReport, hotspotLimit) => {
    if (!hotspotReport?.rows) {
        return rows;
    }
    const hotspotByKey = new Map(
        hotspotReport.rows.map((row) => [`${row.scenario}|${row.viewport}`, row])
    );
    return rows.map((row) => {
        const hotspot = hotspotByKey.get(`${row.scenario}|${row.viewport}`);
        const candidateRegions = [
            ...(hotspot?.topDenseSemanticRegions ?? []),
            ...(hotspot?.topNonFullscreenSemanticRegions ?? []),
            ...(hotspot?.topSemanticRegions ?? []),
        ];
        const uniqueRegions = [];
        const seen = new Set();
        for (const region of candidateRegions.sort((a, b) => hotspotScore(b) - hotspotScore(a))) {
            if (!region?.key || seen.has(region.key)) {
                continue;
            }
            seen.add(region.key);
            uniqueRegions.push(summarizeHotspotRegion(region));
            if (uniqueRegions.length >= hotspotLimit) {
                break;
            }
        }
        return {
            ...row,
            hotspots: uniqueRegions,
        };
    });
};

const summarizeCounts = (rows) =>
    rows.reduce((counts, row) => {
        counts[row.status] = (counts[row.status] ?? 0) + 1;
        return counts;
    }, {});

const summarizeFamilies = (rows) => {
    const families = [
        ['rulebook', (row) => row.scenario.includes('rulebook')],
        ['mainMenu', (row) => row.scenario.includes('main-menu')],
        ['settings', (row) => row.scenario.includes('settings')],
        ['preview', (row) => row.scenario.includes('preview')],
        ['dynamicGameplay', (row) =>
            !row.scenario.includes('rulebook') &&
            !row.scenario.includes('main-menu') &&
            !row.scenario.includes('settings') &&
            !row.scenario.includes('preview')],
    ];
    return Object.fromEntries(
        families.map(([name, predicate]) => {
            const familyRows = rows.filter(predicate);
            return [
                name,
                {
                    total: familyRows.length,
                    equivalent: familyRows.filter((row) => row.status === 'Equivalent').length,
                    failing: familyRows.filter((row) => row.status !== 'Equivalent').length,
                },
            ];
        })
    );
};

const aggregateHotspots = (rows, limit) => {
    const byKey = new Map();
    for (const row of rows) {
        for (const hotspot of row.hotspots ?? []) {
            const current =
                byKey.get(hotspot.key) ??
                {
                    key: hotspot.key,
                    rows: 0,
                    mismatchedPixels: 0,
                    maxMismatchPercent: 0,
                    scenarios: new Set(),
                };
            current.rows += 1;
            current.mismatchedPixels += Number(hotspot.mismatchedPixels ?? 0);
            current.maxMismatchPercent = Math.max(
                current.maxMismatchPercent,
                Number(hotspot.mismatchPercent ?? 0)
            );
            current.scenarios.add(`${row.scenario}@${row.viewport}`);
            byKey.set(hotspot.key, current);
        }
    }
    return [...byKey.values()]
        .sort((a, b) => b.mismatchedPixels - a.mismatchedPixels)
        .slice(0, limit)
        .map((entry) => ({
            key: entry.key,
            rows: entry.rows,
            mismatchedPixels: entry.mismatchedPixels,
            maxMismatchPercent: entry.maxMismatchPercent,
            examples: [...entry.scenarios].slice(0, 4),
        }));
};

const collectTopFileSizes = async (root, limit = 12) => {
    const files = [];
    const walk = async (directory) => {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
            const entryPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                await walk(entryPath);
                continue;
            }
            const info = await stat(entryPath);
            files.push({
                path: path.relative(root, entryPath),
                bytes: info.size,
            });
        }
    };
    await walk(root);
    return files.sort((a, b) => b.bytes - a.bytes).slice(0, limit);
};

const buildSummary = async (args) => {
    const root = path.resolve(args.root);
    const matrixPath = path.join(root, 'parity-matrix.json');
    const hotspotPath = path.join(root, 'hotspot-report.json');
    const runnerSummaryPath = path.join(root, 'runner-summary.json');
    const matrix = await readJson(matrixPath);
    if (!Array.isArray(matrix)) {
        throw new Error(`Expected ${matrixPath} to contain an array of matrix rows.`);
    }

    const rowsWithoutHotspots = await Promise.all(matrix.map(summarizeRow));
    const hotspotReport = await readJson(hotspotPath, null);
    const rows = addHotspotRows(rowsWithoutHotspots, hotspotReport, args.hotspots);
    const failingRows = rows
        .filter((row) => row.status !== 'Equivalent')
        .sort((a, b) => (a.similarityPercent ?? 101) - (b.similarityPercent ?? 101));
    const equivalentRows = rows.filter((row) => row.status === 'Equivalent');
    const similarityValues = rows
        .map((row) => row.similarityPercent)
        .filter((value) => Number.isFinite(value));
    const failingSimilarityValues = failingRows
        .map((row) => row.similarityPercent)
        .filter((value) => Number.isFinite(value));
    const runnerSummary = await readJson(runnerSummaryPath, null);
    const topFiles = args.sizes ? await collectTopFileSizes(root) : [];

    return {
        root,
        generatedAt: new Date().toISOString(),
        counts: summarizeCounts(rows),
        rowCount: rows.length,
        viewports: [...new Set(rows.map((row) => row.viewport))],
        runnerCounts: runnerSummary?.counts,
        families: summarizeFamilies(rows),
        similarity: {
            best: Math.max(...similarityValues),
            worst: Math.min(...similarityValues),
            bestFailing: failingSimilarityValues.length ? Math.max(...failingSimilarityValues) : null,
            worstFailing: failingSimilarityValues.length ? Math.min(...failingSimilarityValues) : null,
        },
        failingRows: failingRows.slice(0, args.top),
        equivalentRulebookRows: equivalentRows.filter((row) => row.scenario.includes('rulebook')).length,
        hotspotSummary: aggregateHotspots(failingRows, args.top),
        topFiles,
    };
};

const printSummary = (summary) => {
    console.log(`Artifact root: ${summary.root}`);
    console.log(
        `Rows: ${summary.rowCount} (${Object.entries(summary.counts)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')})`
    );
    console.log(`Viewports: ${summary.viewports.join(', ')}`);
    console.log(
        `Similarity: worst ${formatPercent(summary.similarity.worst)}, best ${formatPercent(
            summary.similarity.best
        )}, worst failing ${formatPercent(summary.similarity.worstFailing)}, best failing ${formatPercent(
            summary.similarity.bestFailing
        )}`
    );
    console.log(
        `Rulebook equivalent rows: ${summary.equivalentRulebookRows}; families: ${Object.entries(
            summary.families
        )
            .map(([name, value]) => `${name} ${value.equivalent}/${value.total}`)
            .join(', ')}`
    );

    if (summary.failingRows.length > 0) {
        console.log('');
        console.log(`Worst failing rows (top ${summary.failingRows.length}):`);
        for (const row of summary.failingRows) {
            const hotspots = (row.hotspots ?? [])
                .map(
                    (hotspot) =>
                        `${hotspot.key} ${formatPercent(hotspot.mismatchPercent)} / ${formatInteger(
                            hotspot.mismatchedPixels
                        )} px`
                )
                .join('; ');
            console.log(
                `- ${row.scenario}@${row.viewport}: ${formatPercent(
                    row.similarityPercent
                )}, mismatched ${formatInteger(row.mismatchedPixels)} px${
                    hotspots ? `; hotspots: ${hotspots}` : ''
                }`
            );
        }
    }

    if (summary.hotspotSummary.length > 0) {
        console.log('');
        console.log(`Recurring hotspot keys (top ${summary.hotspotSummary.length}):`);
        for (const hotspot of summary.hotspotSummary) {
            console.log(
                `- ${hotspot.key}: ${hotspot.rows} rows, ${formatInteger(
                    hotspot.mismatchedPixels
                )} mismatched px, max ${formatPercent(hotspot.maxMismatchPercent)}`
            );
        }
    }

    if (summary.topFiles.length > 0) {
        console.log('');
        console.log(`Largest artifact files (top ${summary.topFiles.length}):`);
        for (const file of summary.topFiles) {
            console.log(`- ${formatBytes(file.bytes)} ${file.path}`);
        }
    }
};

const main = async () => {
    const args = parseArgs(process.argv.slice(2));
    if (args.help || !args.root) {
        console.log(usage);
        process.exit(args.help ? 0 : 1);
    }
    if (!Number.isFinite(args.top) || args.top < 1) {
        throw new Error('--top must be a positive number.');
    }
    if (!Number.isFinite(args.hotspots) || args.hotspots < 0) {
        throw new Error('--hotspots must be zero or a positive number.');
    }

    const summary = await buildSummary(args);
    if (args.json) {
        console.log(JSON.stringify(summary, null, 2));
    } else {
        printSummary(summary);
    }
};

main().catch((error) => {
    console.error(error.stack ?? error.message ?? String(error));
    process.exit(1);
});
