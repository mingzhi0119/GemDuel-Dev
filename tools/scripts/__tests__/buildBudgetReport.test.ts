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

    it('classifies warning-band bundle growth against the governed mainChunkKb budget', () => {
        const distDir = createDistFixture([
            ['index-main.js', 650 * 1024],
            ['chunk-a.js', 10 * 1024],
        ]);

        try {
            const report = buildBundleBudgetReport({
                distDir,
                operationsSnapshot: {
                    bundleBudgets: {
                        mainChunkKb: {
                            warningMax: 600,
                            incidentMax: 700,
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

    it('classifies hard-limit bundle growth as an incident', () => {
        const distDir = createDistFixture([
            ['index-main.js', 720 * 1024],
            ['chunk-a.js', 10 * 1024],
        ]);

        try {
            const report = buildBundleBudgetReport({
                distDir,
                operationsSnapshot: {
                    bundleBudgets: {
                        mainChunkKb: {
                            warningMax: 600,
                            incidentMax: 700,
                        },
                    },
                },
            });

            expect(report.status).toBe('incident');
        } finally {
            fs.rmSync(distDir, {
                force: true,
                recursive: true,
            });
        }
    });

    it('uses the default mainChunkKb budget and pretty serialization for healthy builds', () => {
        const distDir = createDistFixture([
            ['index-main.js', 256 * 1024],
            ['chunk-a.js', 8 * 1024],
        ]);

        try {
            const report = buildBundleBudgetReport({
                distDir,
            });

            expect(report.status).toBe('healthy');
            expect(report.budget.warningMax).toBe(600);
            expect(report.budget.incidentMax).toBe(700);
            expect(serializeBundleBudgetReport(report)).toContain('\n  "budget"');
        } finally {
            fs.rmSync(distDir, {
                force: true,
                recursive: true,
            });
        }
    });

    it('returns no JavaScript assets when assets are missing and rejects non-JavaScript-only builds', () => {
        const distDirWithoutAssets = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-budget-empty-'));
        const distDirWithoutJs = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-budget-css-'));
        const assetsDir = path.join(distDirWithoutJs, 'assets');
        fs.mkdirSync(assetsDir, {
            recursive: true,
        });
        fs.writeFileSync(path.join(assetsDir, 'styles.css'), 'body {}', 'utf8');

        try {
            expect(collectJavascriptAssets(distDirWithoutAssets)).toEqual([]);
            expect(() =>
                buildBundleBudgetReport({
                    distDir: distDirWithoutJs,
                })
            ).toThrow(`No JavaScript assets were found under ${distDirWithoutJs}.`);
        } finally {
            fs.rmSync(distDirWithoutAssets, {
                force: true,
                recursive: true,
            });
            fs.rmSync(distDirWithoutJs, {
                force: true,
                recursive: true,
            });
        }
    });
});
