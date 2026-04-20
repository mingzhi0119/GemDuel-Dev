import fs from 'node:fs';
import path from 'node:path';

export const BUNDLE_BUDGET_REPORT_VERSION = 1;

const DEFAULT_MAIN_CHUNK_BUDGET = Object.freeze({
    warningMax: 700,
    incidentMax: 850,
});

const toPosixPath = (value) => value.replaceAll(path.sep, '/');

const assessBudgetStatus = (value, budget) => {
    if (value > budget.incidentMax) {
        return 'incident';
    }

    if (value > budget.warningMax) {
        return 'warning';
    }

    return 'healthy';
};

export const collectJavascriptAssets = (distDir) => {
    const assetsDir = path.join(distDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
        return [];
    }

    return fs
        .readdirSync(assetsDir, {
            withFileTypes: true,
        })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
        .map((entry) => {
            const absolutePath = path.join(assetsDir, entry.name);
            const stats = fs.statSync(absolutePath);
            return {
                path: toPosixPath(path.relative(distDir, absolutePath)),
                sizeBytes: stats.size,
                sizeKb: Number((stats.size / 1024).toFixed(2)),
            };
        })
        .sort((left, right) => right.sizeBytes - left.sizeBytes);
};

export const buildBundleBudgetReport = ({
    distDir,
    operationsSnapshot = {},
    generatedAt = new Date().toISOString(),
    provenance = {},
}) => {
    const javascriptAssets = collectJavascriptAssets(distDir);
    if (javascriptAssets.length === 0) {
        throw new Error(`No JavaScript assets were found under ${distDir}.`);
    }

    const largestChunk = javascriptAssets[0];
    const budget = operationsSnapshot?.bundleBudgets?.mainChunkKb ?? DEFAULT_MAIN_CHUNK_BUDGET;
    const status = assessBudgetStatus(largestChunk.sizeKb, budget);

    return {
        reportVersion: BUNDLE_BUDGET_REPORT_VERSION,
        generatedAt,
        provenance,
        source: {
            distDir: toPosixPath(distDir),
            assetCount: javascriptAssets.length,
        },
        budget: {
            metric: 'mainChunkKb',
            observed: largestChunk.sizeKb,
            warningMax: budget.warningMax,
            incidentMax: budget.incidentMax,
            remainingWarningBudget: Number((budget.warningMax - largestChunk.sizeKb).toFixed(2)),
            remainingIncidentBudget: Number((budget.incidentMax - largestChunk.sizeKb).toFixed(2)),
            breached: status !== 'healthy',
            status,
        },
        largestChunk,
        assets: javascriptAssets.slice(0, 5),
        status,
    };
};

export const serializeBundleBudgetReport = (report, { pretty = true } = {}) =>
    `${JSON.stringify(report, null, pretty ? 2 : 0)}\n`;
