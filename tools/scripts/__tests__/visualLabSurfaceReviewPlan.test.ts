// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    SURFACE_SLOTS,
    SURFACE_SLOT_TARGET_DIMENSIONS,
    applyDeleteRatingOne,
    buildSurfaceReviewPlan,
    consolidateSurfaceReviewThemes,
    finalizeReplacements,
    getSurfaceReviewStatePath,
    loadSurfaceManifestRecords,
    prepareReplacements,
    readSurfaceReviewStateFile,
    repairSurfaceReviewManifestMetadata,
    validateSurfaceReviewPlan,
    validateSurfaceReviewState,
    writeSurfaceReviewStatePayload,
    writeSurfaceReviewPlan,
} from '../visual-lab-surface-review-core.mjs';

const batch = 'surface-autonomous-fixture-candidates';
const date = '2026-04-30';
const FS_TEST_TIMEOUT_MS = 20_000;

const getFixtureDimensions = (slot: string) =>
    SURFACE_SLOT_TARGET_DIMENSIONS[slot as keyof typeof SURFACE_SLOT_TARGET_DIMENSIONS] ?? [
        1254, 1254,
    ];

const createRecord = (style: string, variant: string, slot: string, archiveSlot = slot) => ({
    promptId: `${style}-${variant}-${slot}`,
    slot,
    style,
    variant,
    archivePath: `assets/art-library/${batch}/${date}/${archiveSlot}/${style}/${variant}/${archiveSlot}.png`,
    dimensions: {
        archive: getFixtureDimensions(slot),
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

const createRuntimeClientSet = (style = 'crystal-anime', theme = 'dark') => ({
    id: `runtime:${style}:${theme}`,
    source: 'runtime',
    batch: 'runtime',
    date: 'current',
    style,
    variant: theme.toUpperCase(),
    slots: Object.fromEntries(
        SURFACE_SLOTS.map((slot) => [
            slot,
            {
                batch: 'runtime',
                date: 'current',
                promptId: `RUNTIME-${style}-${slot}`,
                slot,
                style,
                variant: theme.toUpperCase(),
                score: null,
                risk: 'Runtime-integrated surface asset.',
                dimensions: null,
                archiveUrl: `/assets/surfaces/anime-themes/${style}/${theme}/${slot}.png`,
                source: 'runtime',
            },
        ])
    ),
});

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
        writePngHeader(absolutePath, record.dimensions.archive[0], record.dimensions.archive[1]);
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
    it(
        'builds delete, keep, regeneration, ignored, and path-derived set data',
        () => {
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
                comments: {
                    [deleteSetId]: 'Delete this style; too noisy for the board.',
                    [keepSetId]: 'Keep, but regenerate the PlayerZone sides.',
                    [`${batch}:${date}:stale-comment:A`]: 'This comment belongs to a removed set.',
                },
                clientAssetSets: [{ id: 'runtime:clean-boardgame:dark', source: 'runtime' }],
            });

            expect(plan.deleteSets.map((set) => set.setId)).toEqual([deleteSetId]);
            expect(plan.keepSets.map((set) => set.setId)).toEqual([keepSetId]);
            expect(plan.comments).toMatchObject({
                [deleteSetId]: 'Delete this style; too noisy for the board.',
                [keepSetId]: 'Keep, but regenerate the PlayerZone sides.',
            });
            expect(plan.deleteSets[0]).toMatchObject({
                comment: 'Delete this style; too noisy for the board.',
            });
            expect(plan.keepSets[0]).toMatchObject({
                comment: 'Keep, but regenerate the PlayerZone sides.',
            });
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
            expect(plan.ignored.staleComments).toEqual([
                {
                    setId: `${batch}:${date}:stale-comment:A`,
                    comment: 'This comment belongs to a removed set.',
                },
            ]);
            expect(plan.warnings).toContain(
                `Stale comment ignored: ${batch}:${date}:stale-comment:A`
            );
            expect(plan.ignored.orphanRegenMarks[0].key).toBe(`${deleteSetId}:gem-panel`);

            const files = writeSurfaceReviewPlan({ repoRoot, plan });
            const exportedJson = JSON.parse(
                fs.readFileSync(path.join(repoRoot, files.jsonPath), 'utf8')
            );
            const exportedMarkdown = fs.readFileSync(
                path.join(repoRoot, files.markdownPath),
                'utf8'
            );
            expect(exportedJson.source.commentsStorageKey).toBe(
                'gemduel.visualLab.surfaceStyleComments.v1'
            );
            expect(exportedJson.source.commentsHash).toEqual(expect.any(String));
            expect(exportedJson.comments[keepSetId]).toBe(
                'Keep, but regenerate the PlayerZone sides.'
            );
            expect(exportedMarkdown).toContain('## Style Comments');
            expect(exportedMarkdown).toContain('Keep, but regenerate the PlayerZone sides.');
            expect(exportedMarkdown).toContain('Delete this style; too noisy for the board.');
        },
        FS_TEST_TIMEOUT_MS
    );

    it(
        'turns explicitly marked runtime slots into replacement targets',
        () => {
            const { repoRoot } = writeRepoFixture();
            const records = loadSurfaceManifestRecords({ repoRoot });
            const runtimeSet = createRuntimeClientSet();
            const runtimeRegenKey = 'runtime:current:crystal-anime:DARK:shell-background';

            const plan = buildSurfaceReviewPlan({
                repoRoot,
                records,
                regenMarks: {
                    [runtimeRegenKey]: true,
                },
                clientAssetSets: [runtimeSet],
            });

            expect(plan.regenerateSlots).toHaveLength(1);
            expect(plan.regenerateSlots[0]).toMatchObject({
                source: 'runtime',
                setId: 'runtime:current:crystal-anime:DARK',
                slot: 'shell-background',
                regenKey: runtimeRegenKey,
                rating: null,
                targetDimensions: [3840, 1640],
            });
            expect(plan.regenerateSlots[0].targets).toMatchObject([
                {
                    archivePath:
                        'apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png',
                    manifestPath: '',
                },
            ]);
            expect(plan.ignored.orphanRegenMarks).toEqual([]);
            expect(plan.warnings).not.toContain(`Orphan regen mark ignored: ${runtimeRegenKey}`);

            const files = writeSurfaceReviewPlan({ repoRoot, plan });
            const prepared = prepareReplacements({ repoRoot, planPath: files.jsonPath });
            const sourceMap = JSON.parse(
                fs.readFileSync(path.join(repoRoot, prepared.sourceMapPath), 'utf8')
            );
            expect(prepared.sourceCount).toBe(1);
            expect(sourceMap.sources[0]).toMatchObject({
                regenKey: runtimeRegenKey,
                archivePath:
                    'apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png',
                targetDimensions: [3840, 1640],
            });
        },
        FS_TEST_TIMEOUT_MS
    );

    it(
        'normalizes v1 persistent review state into v2 and drops retired slots',
        () => {
            const { repoRoot } = writeRepoFixture();
            const keepSetId = `${batch}:${date}:keep-me:B`;
            const statePath = getSurfaceReviewStatePath({ repoRoot });
            fs.mkdirSync(path.dirname(statePath), { recursive: true });
            fs.writeFileSync(
                statePath,
                `${JSON.stringify(
                    {
                        schema: 'gemduel.visualLab.surfaceReviewState.v1',
                        revision: 4,
                        source: { kind: 'browser', origin: 'http://127.0.0.1:5173', href: '/' },
                        ratings: {
                            [keepSetId]: 10,
                        },
                        regenMarks: {
                            [`${keepSetId}:topbar`]: true,
                            [`${keepSetId}:royal-card-back`]: true,
                        },
                        comments: {
                            [keepSetId]: 'Keep score, replace royal card back.',
                        },
                    },
                    null,
                    2
                )}\n`,
                'utf8'
            );

            const state = readSurfaceReviewStateFile({ repoRoot });

            expect(state).toMatchObject({
                schema: 'gemduel.visualLab.surfaceReviewState.v2',
                revision: 4,
                ratings: { [keepSetId]: 10 },
                regenMarks: { [`${keepSetId}:royal-card-back`]: true },
                comments: { [keepSetId]: 'Keep score, replace royal card back.' },
            });
            expect(state?.regenMarks).not.toHaveProperty(`${keepSetId}:topbar`);
            expect(state?.counts.pendingReplacements).toBe(1);
            expect(state?.pending.replacements[0]).toMatchObject({
                regenKey: `${keepSetId}:royal-card-back`,
                setId: keepSetId,
                slot: 'royal-card-back',
                rating: 10,
            });
        },
        FS_TEST_TIMEOUT_MS
    );

    it(
        'prepares replacement prompts from persistent review state without a plan',
        () => {
            const { repoRoot } = writeRepoFixture();
            const keepSetId = `${batch}:${date}:keep-me:B`;
            writeSurfaceReviewStatePayload({
                repoRoot,
                payload: {
                    origin: 'http://127.0.0.1:5173',
                    href: 'http://127.0.0.1:5173/?visualLab=surfaces',
                    ratings: {
                        [keepSetId]: 10,
                    },
                    regenMarks: {
                        [`${keepSetId}:royal-card-back`]: true,
                    },
                    comments: {
                        [keepSetId]: 'Regenerate the royal back with the same palette.',
                    },
                },
            });

            expect(validateSurfaceReviewState({ repoRoot })).toMatchObject({
                ok: true,
                stage: 'state',
                regenerateSlotCount: 1,
            });

            const prepared = prepareReplacements({ repoRoot });
            const sourceMap = JSON.parse(
                fs.readFileSync(path.join(repoRoot, prepared.sourceMapPath), 'utf8')
            );

            expect(prepared.sourceCount).toBe(1);
            expect(prepared.sourceMapPath).toBe(
                'tmp/visual-lab/surface-review-source-map-template.json'
            );
            expect(sourceMap).toMatchObject({
                planPath: 'tmp/visual-lab/surface-review-state.json',
                reviewSource: 'state',
            });
            expect(sourceMap.sources[0]).toMatchObject({
                regenKey: `${keepSetId}:royal-card-back`,
                setId: keepSetId,
                slot: 'royal-card-back',
                targetDimensions: [1086, 1448],
            });
            expect(sourceMap.sources[0].promptText).toContain(
                'Human review instruction, mandatory: Regenerate the royal back with the same palette.'
            );
            expect(
                fs.readFileSync(path.join(repoRoot, prepared.promptManifestPath), 'utf8')
            ).toContain('Human instruction: Regenerate the royal back with the same palette.');
        },
        FS_TEST_TIMEOUT_MS
    );

    it(
        'finalizes state-backed replacements by clearing marks/comments and preserving ratings',
        () => {
            const { repoRoot } = writeRepoFixture();
            const keepSetId = `${batch}:${date}:keep-me:B`;
            writeSurfaceReviewStatePayload({
                repoRoot,
                payload: {
                    ratings: {
                        [keepSetId]: 10,
                    },
                    regenMarks: {
                        [`${keepSetId}:royal-card-back`]: true,
                    },
                    comments: {
                        [keepSetId]: 'Replace this, but keep the score.',
                    },
                },
            });
            const prepared = prepareReplacements({ repoRoot });
            const sourceMapPath = path.join(repoRoot, prepared.sourceMapPath);
            const sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, 'utf8'));
            const sourcePath = path.join(repoRoot, 'generated', 'state-royal.png');
            writePngHeader(sourcePath, 1086, 1448);
            sourceMap.sources[0].sourcePath = sourcePath;
            fs.writeFileSync(sourceMapPath, `${JSON.stringify(sourceMap, null, 2)}\n`, 'utf8');

            const result = finalizeReplacements({
                repoRoot,
                sourcesPath: prepared.sourceMapPath,
            });
            const state = readSurfaceReviewStateFile({ repoRoot });

            expect(result.completion.failures).toEqual([]);
            expect(result.clearedState).toMatchObject({
                ratings: { [keepSetId]: 10 },
                regenMarks: {},
                comments: {},
            });
            expect(state).toMatchObject({
                ratings: { [keepSetId]: 10 },
                regenMarks: {},
                comments: {},
            });
            expect(state?.revision).toBe(2);
        },
        FS_TEST_TIMEOUT_MS
    );

    it(
        'leaves persistent review state unchanged when finalize has failures',
        () => {
            const { repoRoot } = writeRepoFixture();
            const keepSetId = `${batch}:${date}:keep-me:B`;
            writeSurfaceReviewStatePayload({
                repoRoot,
                payload: {
                    ratings: {
                        [keepSetId]: 7,
                    },
                    regenMarks: {
                        [`${keepSetId}:royal-card-back`]: true,
                    },
                    comments: {
                        [keepSetId]: 'Do not clear this if replacement fails.',
                    },
                },
            });
            const before = readSurfaceReviewStateFile({ repoRoot });
            const prepared = prepareReplacements({ repoRoot });
            const sourceMapPath = path.join(repoRoot, prepared.sourceMapPath);
            const sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, 'utf8'));
            sourceMap.sources[0].failure = 'image generation failed';
            fs.writeFileSync(sourceMapPath, `${JSON.stringify(sourceMap, null, 2)}\n`, 'utf8');

            const result = finalizeReplacements({
                repoRoot,
                sourcesPath: prepared.sourceMapPath,
            });
            const after = readSurfaceReviewStateFile({ repoRoot });

            expect(result.completion.failures).toHaveLength(1);
            expect(result.clearedState).toBeNull();
            expect(after).toEqual(before);
        },
        FS_TEST_TIMEOUT_MS
    );

    it(
        'applies delete-rating1 from the frozen JSON plan and validates pre/post states',
        () => {
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

            expect(validateSurfaceReviewPlan({ repoRoot, planPath: files.jsonPath })).toMatchObject(
                {
                    ok: true,
                    stage: 'pre-delete',
                }
            );

            const result = applyDeleteRatingOne({
                repoRoot,
                planPath: files.jsonPath,
                confirm: true,
            });

            expect(result.report.deletedSetCount).toBe(1);
            expect(result.report.deletedFileCount).toBe(7);
            expect(validateSurfaceReviewPlan({ repoRoot, planPath: files.jsonPath })).toMatchObject(
                {
                    ok: true,
                    stage: 'post-delete',
                }
            );
            expect(
                loadSurfaceManifestRecords({ repoRoot }).some(
                    (record) => record.setId === keepSetId
                )
            ).toBe(true);
        },
        FS_TEST_TIMEOUT_MS
    );

    it(
        'prepares replacement prompts and finalizes exact-size generated PNG sources',
        () => {
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
        },
        FS_TEST_TIMEOUT_MS
    );

    it(
        'repairs character theme manifest metadata for stale Visual Lab state ids',
        () => {
            const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'surface-review-repair-'));
            const manifestDir = path.join(
                repoRoot,
                'assets',
                'art-library',
                'surface-autonomous-character-theme-candidates',
                '2026-05-01T074505Z',
                'contact-sheets'
            );
            fs.mkdirSync(manifestDir, { recursive: true });
            fs.writeFileSync(
                path.join(manifestDir, 'preview-manifest.json'),
                `${JSON.stringify(
                    {
                        batch: '2026-05-01T074505Z',
                        records: [
                            {
                                ...createRecord('genshin-navia', 'A', 'gem-panel'),
                                batch: '2026-05-01T074505Z',
                            },
                        ],
                    },
                    null,
                    2
                )}\n`
            );

            const result = repairSurfaceReviewManifestMetadata({ repoRoot });
            const manifest = JSON.parse(
                fs.readFileSync(path.join(manifestDir, 'preview-manifest.json'), 'utf8')
            );

            expect(result.repaired).toHaveLength(1);
            expect(manifest.batch).toBe('surface-autonomous-character-theme-candidates');
            expect(manifest.date).toBe('2026-05-01T074505Z');
            expect(manifest.records[0]).toMatchObject({
                batch: 'surface-autonomous-character-theme-candidates',
                date: '2026-05-01T074505Z',
            });
        },
        FS_TEST_TIMEOUT_MS
    );

    it(
        'consolidates kept themes into a curated library and migrates ratings',
        () => {
            const { repoRoot } = writeRepoFixture();
            const records = loadSurfaceManifestRecords({ repoRoot });
            const deleteSetId = `${batch}:${date}:delete-me:A`;
            const keepSetId = `${batch}:${date}:keep-me:B`;
            const plan = buildSurfaceReviewPlan({
                repoRoot,
                records,
                ratings: {
                    [deleteSetId]: 1,
                    [keepSetId]: 10,
                    'runtime:clean-boardgame:dark': 7,
                },
            });
            const files = writeSurfaceReviewPlan({ repoRoot, plan });
            writeSurfaceReviewStatePayload({
                repoRoot,
                payload: {
                    ratings: {
                        [deleteSetId]: 1,
                        [keepSetId]: 10,
                        'runtime:clean-boardgame:dark': 7,
                    },
                    regenMarks: {},
                    comments: {},
                    assetSets: [],
                },
            });

            applyDeleteRatingOne({ repoRoot, planPath: files.jsonPath, confirm: true });
            const result = consolidateSurfaceReviewThemes({
                repoRoot,
                planPath: files.jsonPath,
                runTimestamp: '2026-05-02T000000Z',
            });
            const state = readSurfaceReviewStateFile({ repoRoot });
            const curatedSetId =
                'surface-autonomous-curated-theme-candidates:2026-05-02T000000Z:keep-me:main';
            const manifest = JSON.parse(
                fs.readFileSync(
                    path.join(
                        repoRoot,
                        'assets',
                        'art-library',
                        'surface-autonomous-curated-theme-candidates',
                        '2026-05-02T000000Z',
                        'contact-sheets',
                        'preview-manifest.json'
                    ),
                    'utf8'
                )
            );

            expect(result.report.keptSetCount).toBe(1);
            expect(manifest.records).toHaveLength(8);
            expect(manifest.records[0]).toMatchObject({
                batch: 'surface-autonomous-curated-theme-candidates',
                date: '2026-05-02T000000Z',
                style: 'keep-me',
                variant: 'main',
            });
            expect(state?.ratings).toMatchObject({
                [curatedSetId]: 10,
                'runtime:clean-boardgame:dark': 7,
            });
            expect(state?.assetSets.map((set) => set?.id)).toContain(curatedSetId);
            expect(state?.ratings).not.toHaveProperty(keepSetId);
            expect(state?.ratings).not.toHaveProperty(deleteSetId);
        },
        FS_TEST_TIMEOUT_MS
    );
});
