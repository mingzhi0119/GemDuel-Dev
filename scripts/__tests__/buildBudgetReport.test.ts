// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    buildBundleBudgetReport,
    collectJavascriptAssets,
    serializeBundleBudgetReport,
} from '../buildBudgetReport.js';

const createDistFixture = (assetSizes: Array<[string, number]>) => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-budget-'));
    const assetsDir = path.join(tempDir, 'assets');
    fs.mkdirSync(assetsDir, {
        recursive: true,
    });

    for (const [fileName, size] of assetSizes) {
        fs.writeFileSync(path.join(assetsDir, fileName), 'x'.repeat(size), 'utf8');
    }

    return tempDir;
};

describe('bundle budget report', () => {
    it('collects JavaScript assets in descending size order', () => {
        const distDir = createDistFixture([
            ['chunk-a.js', 120],
            ['chunk-b.js', 240],
            ['chunk-c.css', 999],
        ]);

        try {
            expect(collectJavascriptAssets(distDir).map((asset) => asset.path)).toEqual([
                'assets/chunk-b.js',
                'assets/chunk-a.js',
            ]);
        } finally {
            fs.rmSync(distDir, {
                force: true,
                recursive: true,
            });
        }
    });

    it('classifies the largest chunk against the governed mainChunkKb budget', () => {
        const distDir = createDistFixture([
            ['index-main.js', 760 * 1024],
            ['chunk-a.js', 10 * 1024],
        ]);

        try {
            const report = buildBundleBudgetReport({
                distDir,
                operationsSnapshot: {
                    bundleBudgets: {
                        mainChunkKb: {
                            warningMax: 700,
                            incidentMax: 850,
                        },
                    },
                },
                generatedAt: '2026-04-19T12:00:00.000Z',
                provenance: {
                    generatedBy: 'test',
                },
            });

            expect(report.status).toBe('warning');
            expect(report.largestChunk.path).toBe('assets/index-main.js');
            expect(
                JSON.parse(serializeBundleBudgetReport(report, { pretty: false })).budget.metric
            ).toBe('mainChunkKb');
        } finally {
            fs.rmSync(distDir, {
                force: true,
                recursive: true,
            });
        }
    });
});
