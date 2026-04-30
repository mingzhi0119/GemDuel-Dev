// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    SURFACE_SLOTS,
    applyDeleteRatingOne,
    buildSurfaceReviewPlan,
    finalizeReplacements,
    loadSurfaceManifestRecords,
    prepareReplacements,
    validateSurfaceReviewPlan,
    writeSurfaceReviewPlan,
} from '../visual-lab-surface-review-core.mjs';

const batch = 'surface-autonomous-fixture-candidates';
const date = '2026-04-30';

const createRecord = (style: string, variant: string, slot: string, archiveSlot = slot) => ({
    promptId: `${style}-${variant}-${slot}`,
    slot,
    style,
    variant,
    archivePath: `assets/art-library/${batch}/${date}/${archiveSlot}/${style}/${variant}/${archiveSlot}.png`,
    dimensions: {
        archive:
            slot.startsWith('market-card-back') || slot === 'royal-card-back'
                ? [1086, 1448]
                : [1254, 1254],
    },
});

const createSetRecords = (style: string, variant: string, sideSpecific = false) => [
    ...SURFACE_SLOTS.filter((slot) => slot !== 'player-zone').map((slot) =>
        createRecord(style, variant, slot)
    ),
    ...(sideSpecific
        ? [
              createRecord(style, variant, 'player-zone-p1'),
              createRecord(style, variant, 'player-zone-p2'),
          ]
        : [createRecord(style, variant, 'player-zone')]),
];

const writeRepoFixture = () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'surface-review-plan-'));
    const manifestDir = path.join(repoRoot, 'assets', 'art-library', batch, date, 'contact-sheets');
    fs.mkdirSync(manifestDir, { recursive: true });
    const records = [
        ...createSetRecords('delete-me', 'A'),
        ...createSetRecords('keep-me', 'B', true),
    ];
    fs.writeFileSync(
        path.join(manifestDir, 'preview-manifest.json'),
        `${JSON.stringify({ records }, null, 2)}\n`,
        'utf8'
    );
    records.forEach((record) => {
        const absolutePath = path.join(repoRoot, record.archivePath);
        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
        fs.writeFileSync(absolutePath, 'asset');
    });
    return { repoRoot };
};

const writePngHeader = (filePath: string, width: number, height: number) => {
    const buffer = Buffer.alloc(24);
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer, 0);
    buffer.writeUInt32BE(13, 8);
    buffer.write('IHDR', 12, 'ascii');
    buffer.writeUInt32BE(width, 16);
    buffer.writeUInt32BE(height, 20);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
};

describe('Visual Lab surface review plan', () => {
    it('builds delete, keep, regeneration, ignored, and path-derived set data', () => {
        const { repoRoot } = writeRepoFixture();
        const records = loadSurfaceManifestRecords({ repoRoot });
        const deleteSetId = `${batch}:${date}:delete-me:A`;
        const keepSetId = `${batch}:${date}:keep-me:B`;
        const plan = buildSurfaceReviewPlan({
            repoRoot,
            records,
            origin: 'http://127.0.0.1:5173',
            ratings: {
                [deleteSetId]: 1,
                [keepSetId]: 7,
                'runtime:clean-boardgame:dark': 1,
                [`${batch}:${date}:stale:A`]: 4,
            },
            regenMarks: {
                [`${keepSetId}:player-zone`]: true,
                [`${deleteSetId}:gem-panel`]: true,
            },
            clientAssetSets: [{ id: 'runtime:clean-boardgame:dark', source: 'runtime' }],
        });

        expect(plan.deleteSets.map((set) => set.setId)).toEqual([deleteSetId]);
        expect(plan.keepSets.map((set) => set.setId)).toEqual([keepSetId]);
        expect(plan.regenerateSlots).toHaveLength(1);
        expect(plan.regenerateSlots[0].targets.map((target) => target.rawSlot).sort()).toEqual([
            'player-zone-p1',
            'player-zone-p2',
        ]);
        expect(plan.ignored.runtimeRated).toEqual([
            { setId: 'runtime:clean-boardgame:dark', rating: 1 },
        ]);
        expect(plan.ignored.staleRatings).toEqual([
            { setId: `${batch}:${date}:stale:A`, rating: 4 },
        ]);
        expect(plan.ignored.orphanRegenMarks[0].key).toBe(`${deleteSetId}:gem-panel`);
    });

    it('applies delete-rating1 from the frozen JSON plan and validates pre/post states', () => {
        const { repoRoot } = writeRepoFixture();
        const records = loadSurfaceManifestRecords({ repoRoot });
        const deleteSetId = `${batch}:${date}:delete-me:A`;
        const keepSetId = `${batch}:${date}:keep-me:B`;
        const plan = buildSurfaceReviewPlan({
            repoRoot,
            records,
            ratings: {
                [deleteSetId]: 1,
                [keepSetId]: 4,
            },
        });
        const files = writeSurfaceReviewPlan({ repoRoot, plan });

        expect(validateSurfaceReviewPlan({ repoRoot, planPath: files.jsonPath })).toMatchObject({
            ok: true,
            stage: 'pre-delete',
        });

        const result = applyDeleteRatingOne({
            repoRoot,
            planPath: files.jsonPath,
            confirm: true,
        });

        expect(result.report.deletedSetCount).toBe(1);
        expect(result.report.deletedFileCount).toBe(8);
        expect(validateSurfaceReviewPlan({ repoRoot, planPath: files.jsonPath })).toMatchObject({
            ok: true,
            stage: 'post-delete',
        });
        expect(
            loadSurfaceManifestRecords({ repoRoot }).some((record) => record.setId === keepSetId)
        ).toBe(true);
    });

    it('prepares replacement prompts and finalizes exact-size generated PNG sources', () => {
        const { repoRoot } = writeRepoFixture();
        const records = loadSurfaceManifestRecords({ repoRoot });
        const keepSetId = `${batch}:${date}:keep-me:B`;
        const plan = buildSurfaceReviewPlan({
            repoRoot,
            records,
            ratings: {
                [keepSetId]: 10,
            },
            regenMarks: {
                [`${keepSetId}:royal-card-back`]: true,
            },
        });
        const files = writeSurfaceReviewPlan({ repoRoot, plan });
        const prepared = prepareReplacements({ repoRoot, planPath: files.jsonPath });
        const sourceMap = JSON.parse(
            fs.readFileSync(path.join(repoRoot, prepared.sourceMapPath), 'utf8')
        );
        const sourcePath = path.join(repoRoot, 'generated', 'royal.png');
        writePngHeader(sourcePath, 1086, 1448);
        sourceMap.sources[0].sourcePath = sourcePath;
        fs.writeFileSync(
            path.join(repoRoot, prepared.sourceMapPath),
            `${JSON.stringify(sourceMap, null, 2)}\n`,
            'utf8'
        );

        const result = finalizeReplacements({
            repoRoot,
            planPath: files.jsonPath,
            sourcesPath: prepared.sourceMapPath,
        });

        expect(result.completion.completedRegenKeys).toEqual([`${keepSetId}:royal-card-back`]);
        expect(result.completion.failures).toEqual([]);
    });
});
