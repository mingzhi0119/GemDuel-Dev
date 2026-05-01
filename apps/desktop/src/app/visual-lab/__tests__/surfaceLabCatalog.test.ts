import { describe, expect, it } from 'vitest';
import {
    createRuntimeSurfaceLabAssetSets,
    normalizeSurfaceLabAssetSets,
    normalizeSurfaceLabCandidates,
} from '../surfaceLabCatalog';
import { SURFACE_LAB_SLOTS, type SurfaceLabCandidate } from '../surfaceLabTypes';

const createCandidate = (
    slot: SurfaceLabCandidate['slot'],
    overrides: Partial<SurfaceLabCandidate> = {}
): SurfaceLabCandidate => ({
    batch: 'surface-autonomous-luminous-styles-candidates',
    date: '2026-04-27',
    promptId: `TEST-${slot}`,
    slot,
    style: 'paper-lantern',
    variant: 'A',
    score: 8.5,
    risk: '',
    dimensions: {
        archive: [1254, 1254],
    },
    archiveUrl: `/__surface-lab/assets/test/${slot}.png`,
    source: 'candidate',
    ...overrides,
});

describe('surface lab catalog', () => {
    it('keeps only valid manifest records and marks them as candidate assets', () => {
        const candidates = normalizeSurfaceLabCandidates([
            createCandidate('gem-panel'),
            { slot: 'unknown', archiveUrl: '/bad.png' },
        ]);

        expect(candidates).toHaveLength(1);
        expect(candidates[0]).toMatchObject({
            slot: 'gem-panel',
            source: 'candidate',
        });
    });

    it('normalizes alternate manifest field names from generated candidate batches', () => {
        const candidates = normalizeSurfaceLabCandidates([
            {
                batch: 'surface-autonomous-extra-styles-candidates',
                date: '2026-04-27',
                prompt_id: 'stormglass-reliquary-shell-background-a',
                slot: 'shell-background',
                style: 'stormglass-reliquary',
                variant: 'a',
                archive_relative:
                    'assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/stormglass-reliquary/a/shell-background.png',
                score: 8.5,
                risks: ['upscaled source', 'verify center calmness'],
                source_dimensions: '1672x941',
                target_dimensions: '3840x1640',
                dimensions: '3840x1640',
            },
        ]);

        expect(candidates).toHaveLength(1);
        expect(candidates[0]).toMatchObject({
            promptId: 'stormglass-reliquary-shell-background-a',
            archiveUrl:
                '/__surface-lab/assets/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/stormglass-reliquary/a/shell-background.png',
            risk: 'upscaled source; verify center calmness',
            dimensions: {
                source: [1672, 941],
                target: [3840, 1640],
                archive: [3840, 1640],
            },
        });
    });

    it('builds complete shell-fill asset sets and filters incomplete styles', () => {
        const complete = SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot));
        const incomplete = SURFACE_LAB_SLOTS.slice(0, -1).map((slot) =>
            createCandidate(slot, {
                style: 'incomplete-style',
            })
        );

        const sets = normalizeSurfaceLabAssetSets([...complete, ...incomplete]);

        expect(sets).toHaveLength(1);
        expect(sets[0].style).toBe('paper-lantern');
        expect(Object.keys(sets[0].slots).sort()).toEqual([...SURFACE_LAB_SLOTS].sort());
    });

    it('accepts side-specific player-zone candidates as a complete player-zone slot', () => {
        const baseRecords = SURFACE_LAB_SLOTS.filter((slot) => slot !== 'player-zone').map((slot) =>
            createCandidate(slot, {
                style: 'side-specific-zone',
            })
        );
        const candidates = normalizeSurfaceLabCandidates([
            ...baseRecords,
            {
                batch: 'surface-autonomous-luminous-styles-candidates',
                date: '2026-04-27',
                promptId: 'PZ-P1',
                slot: 'player-zone-p1',
                style: 'side-specific-zone',
                variant: 'A',
                archiveUrl: '/__surface-lab/assets/side/p1.png',
            },
            {
                batch: 'surface-autonomous-luminous-styles-candidates',
                date: '2026-04-27',
                promptId: 'PZ-P2',
                slot: 'player-zone-p2',
                style: 'side-specific-zone',
                variant: 'A',
                archiveUrl: '/__surface-lab/assets/side/p2.png',
            },
        ]);

        const sets = normalizeSurfaceLabAssetSets(candidates);

        expect(sets).toHaveLength(1);
        expect(sets[0].slots['player-zone'].playerZoneSide).toBe('p1');
        expect(sets[0].playerZoneSideSlots?.p1?.archiveUrl).toBe(
            '/__surface-lab/assets/side/p1.png'
        );
        expect(sets[0].playerZoneSideSlots?.p2?.archiveUrl).toBe(
            '/__surface-lab/assets/side/p2.png'
        );
    });

    it('creates runtime fallback sets for all integrated themes', () => {
        const sets = createRuntimeSurfaceLabAssetSets('dark');

        expect(sets).toHaveLength(5);
        expect(sets[0].source).toBe('runtime');
        expect(sets.map((set) => set.style)).toContain('pearl-opaline');
        expect(sets[0].slots['market-card-back-l3'].archiveUrl).toContain(
            '/assets/surfaces/anime-themes/'
        );
    });
});
