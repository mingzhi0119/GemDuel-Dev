// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import {
    buildReleaseHealthReport,
    parseReleaseHealthSourceText,
    serializeReleaseHealthReport,
} from '../releaseHealthReport.js';
import { collectReleaseHealthOperationsErrors } from '../releaseHealthOperations.js';

const repoRoot = process.cwd();
const readFile = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readFile(relativePath));

const operationsSnapshot = readJson('electron/governance/release-health-operations.snapshot.json');
const sloText = readFile('OPERATIONS_SLO.md');
const drillText = readFile('OPERATIONS_FAULT_DRILLS.md');

describe('release-health operations governance', () => {
    it('accepts aligned SLO, drill, and snapshot assets', () => {
        expect(
            collectReleaseHealthOperationsErrors({
                sloText,
                drillText,
                operationsSnapshot,
            })
        ).toEqual([]);
    });

    it('reports drift when the operational snapshot or drill docs lose required entries', () => {
        const brokenSnapshot = {
            ...operationsSnapshot,
            indicatorThresholds: {
                ...operationsSnapshot.indicatorThresholds,
            },
        };

        delete brokenSnapshot.indicatorThresholds.peerFailures;

        const errors = collectReleaseHealthOperationsErrors({
            sloText: sloText.replaceAll('ipcRejected', 'ipcRejectedBroken'),
            drillText: drillText.replace('`network-recovery`', 'network recovery'),
            operationsSnapshot: brokenSnapshot,
        });

        expect(errors).toContain('OPERATIONS_SLO.md must mention ipcRejected.');
        expect(errors).toContain(
            'OPERATIONS_FAULT_DRILLS.md must document updater-fail, ipc-reject, and network-recovery drills.'
        );
        expect(errors).toContain(
            'Missing alert threshold for release-health indicator peerFailures.'
        );
    });
});

describe('release-health report exporter', () => {
    it('derives a machine-readable report from raw release-health JSONL logs', () => {
        const rawLog = [
            '[RELEASE_HEALTH] {"source":"main","category":"startup","name":"WINDOW_LOADED","severity":"info","message":"Renderer loaded.","timestamp":"2026-04-19T10:00:00.000Z"}',
            '[RELEASE_HEALTH] {"source":"main","category":"security","name":"IPC_REQUEST_REJECTED","severity":"warn","message":"Rejected.","timestamp":"2026-04-19T10:01:00.000Z"}',
        ].join('\n');

        const source = parseReleaseHealthSourceText(rawLog);
        const report = buildReleaseHealthReport({
            source,
            operationsSnapshot,
            sourcePath: '/tmp/release-health.log',
            generatedAt: '2026-04-19T10:02:00.000Z',
        });

        expect(source.kind).toBe('jsonl-log');
        expect(report.reportVersion).toBe(1);
        expect(report.source.kind).toBe('jsonl-log');
        expect(report.source.summaryProvided).toBe(false);
        expect(report.summary.totalEvents).toBe(2);
        expect(report.summary.indicators).toMatchObject({
            ipcRejected: 1,
        });
        expect(report.status).toBe('incident');
        expect(report.alerts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    indicator: 'ipcRejected',
                    status: 'incident',
                }),
            ])
        );
        expect(JSON.parse(serializeReleaseHealthReport(report, { pretty: false })).status).toBe(
            'incident'
        );
    });

    it('exposes the CLI exporter as a runnable machine-readable tool', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-health-'));
        const inputPath = path.join(tempDir, 'session.log');
        try {
            fs.writeFileSync(
                inputPath,
                [
                    '[RELEASE_HEALTH] {"source":"main","category":"startup","name":"WINDOW_LOADED","severity":"info","message":"Renderer loaded.","timestamp":"2026-04-19T10:00:00.000Z"}',
                    '[RELEASE_HEALTH_SUMMARY] {"startedAt":"2026-04-19T10:00:00.000Z","lastEventAt":"2026-04-19T10:00:00.000Z","totalEvents":1,"severityCounts":{"info":1,"warn":0,"error":0},"indicators":{"startupFailures":0,"runtimeConfigFailures":0,"updaterFailures":0,"peerFailures":0,"recoveryRequests":0,"ipcRejected":0},"counters":{"startup:WINDOW_LOADED":{"count":1,"severity":"info","lastAt":"2026-04-19T10:00:00.000Z"}},"recentEvents":[{"source":"main","category":"startup","name":"WINDOW_LOADED","severity":"info","message":"Renderer loaded.","timestamp":"2026-04-19T10:00:00.000Z"}]}',
                ].join('\n'),
                'utf8'
            );

            const stdout = execFileSync(
                'node',
                ['scripts/export-release-health-report.mjs', inputPath],
                {
                    cwd: repoRoot,
                    encoding: 'utf8',
                }
            );
            const parsed = JSON.parse(stdout);

            expect(parsed.reportVersion).toBe(1);
            expect(parsed.source.kind).toBe('summary');
            expect(parsed.summary.totalEvents).toBe(1);
            expect(parsed.status).toBe('healthy');
        } finally {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });
});
