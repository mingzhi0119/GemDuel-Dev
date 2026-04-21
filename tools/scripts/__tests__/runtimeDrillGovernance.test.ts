// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
    buildRuntimeDrillSnapshot,
    collectRuntimeDrillSnapshotErrors,
} from '../runtimeDrillGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');
const readJson = (relativePath: string) =>
    JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));

describe('runtime drill governance', () => {
    it('matches the committed runtime drill snapshot', () => {
        const expectedSnapshot = readJson('tools/governance/runtime-drill.snapshot.json');
        const actualSnapshot = buildRuntimeDrillSnapshot();

        expect(
            collectRuntimeDrillSnapshotErrors({
                expectedSnapshot,
                actualSnapshot,
            })
        ).toEqual([]);
    });

    it('covers the governed drill scenario IDs', () => {
        const snapshot = buildRuntimeDrillSnapshot();

        expect(snapshot.scenarios.map((scenario) => scenario.id)).toEqual([
            'window-unavailable',
            'window-load-failed',
            'ipc-payload-reject',
            'updater-notifications',
            'updater-failure-threshold',
            'updater-disabled',
        ]);
    });

    it('reports drift when scenario ordering or events change', () => {
        const actualSnapshot = buildRuntimeDrillSnapshot();
        const brokenSnapshot = {
            ...actualSnapshot,
            scenarios: actualSnapshot.scenarios.slice(1),
        };

        expect(
            collectRuntimeDrillSnapshotErrors({
                expectedSnapshot: brokenSnapshot,
                actualSnapshot,
            })
        ).toContain('Runtime drill scenario IDs drifted from the audited snapshot.');
    });
});
