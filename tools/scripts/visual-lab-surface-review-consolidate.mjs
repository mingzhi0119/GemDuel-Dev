import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
    SURFACE_SLOT_TARGET_DIMENSIONS,
    getSurfaceSetId,
    toPosix,
    updateManifestRecords,
} from './visual-lab-surface-review-manifest.mjs';
import { readPlan } from './visual-lab-surface-review-plan-core.mjs';
import {
    createSurfaceReviewStateFile,
    readSurfaceReviewStateFile,
    writeSurfaceReviewStateFile,
} from './visual-lab-surface-review-state.mjs';

const getSourceSetIdsFromPlan = (plan) =>
    new Set([...plan.deleteSets, ...plan.keepSets].map((set) => set.setId));

const getStateSlot = (slot) =>
    slot === 'player-zone-p1' || slot === 'player-zone-p2' ? 'player-zone' : slot;

const readPngDimensions = (filePath) => {
    const buffer = fs.readFileSync(filePath);
    if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
        throw new Error(`Not a PNG file: ${filePath}`);
    }
    return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
};

const copyFileChecked = ({ repoRoot, source, target, expected }) => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const actual = readPngDimensions(source);
    if (expected?.[0] !== actual[0] || expected?.[1] !== actual[1]) {
        const resizeScript = path.join(repoRoot, 'tmp', 'visual-lab', 'png-resize.mjs');
        execFileSync(
            process.execPath,
            [resizeScript, source, target, String(expected[0]), String(expected[1]), 'cover'],
            { stdio: 'pipe' }
        );
        return `center-crop-resize from ${actual.join('x')} to ${expected.join('x')}`;
    }
    fs.copyFileSync(source, target);
    return '';
};

const removeSetsFromManifests = ({ repoRoot, sets }) => {
    const setIds = new Set(sets.map((set) => set.setId));
    const manifestPaths = new Set(sets.flatMap((set) => set.manifestPaths ?? []));
    const results = [];
    for (const manifestPath of manifestPaths) {
        const result = updateManifestRecords(repoRoot, manifestPath, ({ setId }) =>
            setIds.has(setId)
        );
        results.push({
            manifestPath,
            before: result.before,
            after: result.after,
            removed: result.removedRecords.length,
        });
    }
    return results;
};

const buildCuratedAssetSets = (records) => {
    const groups = new Map();
    for (const record of records) {
        const id = getSurfaceSetId(record);
        const group = groups.get(id) ?? {
            id,
            source: 'candidate',
            batch: record.batch,
            date: record.date,
            style: record.style,
            variant: record.variant,
            slots: {},
        };
        const slot = getStateSlot(record.slot);
        group.slots[slot] ??= {
            batch: record.batch,
            date: record.date,
            promptId: record.promptId,
            slot,
            playerZoneSide:
                record.slot === 'player-zone-p1' || record.slot === 'player-zone-p2'
                    ? record.slot.slice(-2)
                    : undefined,
            style: record.style,
            variant: record.variant,
            score: record.score,
            risk: record.risk,
            dimensions: record.dimensions,
            archiveUrl: `/__surface-lab/assets/${record.archivePath.replace(
                /^assets\/art-library\//,
                ''
            )}`,
            source: 'candidate',
        };
        groups.set(id, group);
    }
    return [...groups.values()].sort((a, b) => a.id.localeCompare(b.id));
};

export const consolidateSurfaceReviewThemes = ({ repoRoot, planPath, runTimestamp }) => {
    const { plan, absolutePath } = readPlan(repoRoot, planPath);
    const planDir = path.dirname(absolutePath);
    const completionPath = path.join(planDir, 'surface-review-completion.json');
    const completion = fs.existsSync(completionPath)
        ? JSON.parse(fs.readFileSync(completionPath, 'utf8'))
        : null;
    const failures = completion?.failures ?? [];
    if (failures.length) {
        throw new Error(
            `Refusing to consolidate with ${failures.length} replacement failures. Resolve failures first.`
        );
    }

    const timestamp =
        runTimestamp ??
        new Date()
            .toISOString()
            .replace(/[:.]/g, '-')
            .replace(/-000Z$/, 'Z');
    const batch = 'surface-autonomous-curated-theme-candidates';
    const date = timestamp;
    const root = path.join(repoRoot, 'assets', 'art-library', batch, date);
    const styleGroups = new Map();
    for (const set of plan.keepSets) {
        styleGroups.set(set.style, [...(styleGroups.get(set.style) ?? []), set]);
    }

    const mapping = [];
    const records = [];
    const normalizedAssets = [];
    for (const [style, sets] of styleGroups.entries()) {
        const sorted = [...sets].sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            if (b.date !== a.date) return b.date.localeCompare(a.date);
            return a.setId.localeCompare(b.setId);
        });
        sorted.forEach((set, index) => {
            const curatedStyle = sorted.length > 1 ? `${style}-${index + 1}` : style;
            const newSetId = getSurfaceSetId({
                batch,
                date,
                style: curatedStyle,
                variant: 'main',
            });
            mapping.push({
                oldSetId: set.setId,
                newSetId,
                rating: set.rating,
                oldStyle: style,
                curatedStyle,
            });
            for (const asset of set.assets) {
                const rawSlot = asset.rawSlot ?? asset.slot;
                const targetDimensions =
                    SURFACE_SLOT_TARGET_DIMENSIONS[rawSlot] ?? asset.targetDimensions;
                const fileName = `${rawSlot}.png`;
                const sourcePath = path.join(repoRoot, asset.archivePath);
                const archivePath = toPosix(
                    path.join(
                        'assets',
                        'art-library',
                        batch,
                        date,
                        rawSlot,
                        curatedStyle,
                        'main',
                        fileName
                    )
                );
                const targetPath = path.join(repoRoot, archivePath);
                if (!fs.existsSync(sourcePath)) {
                    throw new Error(
                        `Missing source asset during consolidation: ${asset.archivePath}`
                    );
                }
                const normalization = copyFileChecked({
                    repoRoot,
                    source: sourcePath,
                    target: targetPath,
                    expected: targetDimensions,
                });
                if (normalization) {
                    normalizedAssets.push({
                        archivePath,
                        sourceArchivePath: asset.archivePath,
                        normalization,
                    });
                }
                records.push({
                    batch,
                    date,
                    style: curatedStyle,
                    variant: 'main',
                    slot: rawSlot,
                    promptId: `SURFACE-CURATED-${date}-${curatedStyle}-${rawSlot}`,
                    archive: archivePath,
                    archivePath,
                    score: set.rating,
                    dimensions: {
                        archive: targetDimensions,
                        target: targetDimensions,
                    },
                    risk: [
                        'Curated Visual Lab consolidated copy; rating preserved from human review.',
                        normalization,
                    ]
                        .filter(Boolean)
                        .join(' '),
                });
            }
        });
    }

    const manifestDir = path.join(root, 'contact-sheets');
    fs.mkdirSync(manifestDir, { recursive: true });
    const manifestPath = path.join(manifestDir, 'preview-manifest.json');
    fs.writeFileSync(
        manifestPath,
        `${JSON.stringify(
            {
                schemaVersion: 1,
                batch,
                date,
                generatedAtUtc: new Date().toISOString(),
                archiveRoot: toPosix(path.relative(repoRoot, root)),
                candidateOnly: true,
                runtimeOverwrite: false,
                records,
                count: records.length,
            },
            null,
            2
        )}\n`,
        'utf8'
    );

    const manifestResults = removeSetsFromManifests({ repoRoot, sets: plan.keepSets });
    const state = readSurfaceReviewStateFile({ repoRoot });
    let nextState = null;
    if (state) {
        const nextRatings = {};
        for (const [setId, rating] of Object.entries(state.ratings)) {
            if (setId.startsWith('runtime:')) {
                nextRatings[setId] = rating;
            }
        }
        for (const item of mapping) {
            nextRatings[item.newSetId] = item.rating;
        }
        nextState = createSurfaceReviewStateFile({
            previous: state,
            payload: {
                source: state.source,
                ratings: nextRatings,
                regenMarks: {},
                comments: {},
                assetSets: state.assetSets
                    .filter(
                        (set) =>
                            set.source === 'runtime' ||
                            (!(set.batch === batch && set.date === date) &&
                                !getSourceSetIdsFromPlan(plan).has(
                                    `${set.batch}:${set.date}:${set.style}:${set.variant}`
                                ))
                    )
                    .concat(buildCuratedAssetSets(records)),
            },
        });
        writeSurfaceReviewStateFile({ repoRoot, state: nextState });
    }

    const report = {
        schema: 'gemduel.visualLab.surfaceReviewConsolidation.v1',
        planPath: toPosix(path.relative(repoRoot, absolutePath)),
        completedAt: new Date().toISOString(),
        batch,
        date,
        manifestPath: toPosix(path.relative(repoRoot, manifestPath)),
        keptSetCount: plan.keepSets.length,
        recordCount: records.length,
        normalizedAssetCount: normalizedAssets.length,
        normalizedAssets,
        mapping,
        sourceManifestResults: manifestResults,
        stateUpdated: Boolean(nextState),
    };
    const reportPath = path.join(planDir, 'surface-review-consolidation-report.json');
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    return {
        report,
        reportPath: toPosix(path.relative(repoRoot, reportPath)),
    };
};
