import { describe, expect, it } from 'vitest';

import { runLocalPvpSimulationParitySuite } from './run-local-pvp-simulation-parity-suite';

describe('runLocalPvpSimulationParitySuite', () => {
    it('compares generated Local PVP matches through the Unity rules bridge', () => {
        const report = runLocalPvpSimulationParitySuite({
            matchCount: 2,
            seedPrefix: 'local-pvp-sim-parity-unit',
            seedStart: 20260513,
            gameVersion: '5.2.11',
            maxActions: 500,
            outDir: 'unused',
            failFast: true,
        });

        expect(report.ok).toBe(true);
        expect(report.verdict).toBe('Complete');
        expect(report.controls.usedFixtureGameplayDriver).toBe(false);
        expect(report.controls.usedCheckpointStateReplacement).toBe(false);
        expect(report.summary.passed).toBe(2);
        expect(report.summary.coveredActionFamilies).toContain('TAKE_GEMS');
        expect(report.matches.every((match) => match.steps.length > 0)).toBe(true);
        expect(
            report.matches.every(
                (match) => match.electronFinalStateHash === match.unityFinalStateHash
            )
        ).toBe(true);
    });
});
