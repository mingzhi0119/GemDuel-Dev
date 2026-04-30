import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const SURFACE_REVIEW_PLAN_SCHEMA = 'gemduel.visualLab.surfaceReviewPlan.v1';
export const SURFACE_RATINGS_STORAGE_KEY = 'gemduel.visualLab.surfaceStyleRatings.v1';
export const SURFACE_REGEN_STORAGE_KEY = 'gemduel.visualLab.surfaceSlotRegenMarks.v1';

export const SURFACE_SLOTS = [
    'shell-background',
    'topbar',
    'player-zone',
    'gem-panel',
    'market-card-back-l1',
    'market-card-back-l2',
    'market-card-back-l3',
    'royal-card-back',
];

export const SURFACE_SLOT_TARGET_DIMENSIONS = {
    'shell-background': [3840, 2160],
    topbar: [3840, 360],
    'player-zone': [3840, 520],
    'player-zone-p1': [1920, 520],
    'player-zone-p2': [1920, 520],
    'gem-panel': [1254, 1254],
    'market-card-back-l1': [1086, 1448],
    'market-card-back-l2': [1086, 1448],
    'market-card-back-l3': [1086, 1448],
    'royal-card-back': [1086, 1448],
};

export const VALID_RATINGS = new Set([1, 4, 7, 10]);
const CANDIDATE_BATCH_PATTERN = /^surface-autonomous(?:-.+)?-candidates$/;
export const ASSET_PREFIX = 'assets/art-library/';

export const toPosix = (value) => String(value).replace(/\\/g, '/');

const stableStringify = (value) => {
    if (Array.isArray(value)) {
        return `[${value.map((item) => stableStringify(item)).join(',')}]`;
    }

    if (value && typeof value === 'object') {
        return `{${Object.keys(value)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
            .join(',')}}`;
    }

    return JSON.stringify(value);
};

export const sha256 = (value) =>
    crypto.createHash('sha256').update(stableStringify(value)).digest('hex');

export const getFirstString = (...values) => {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) {
            return value;
        }
    }

    return null;
};

const parseDimensionPair = (value) => {
    if (Array.isArray(value) && value.length >= 2) {
        const width = Number(value[0]);
        const height = Number(value[1]);
        return Number.isFinite(width) && Number.isFinite(height) ? [width, height] : undefined;
    }

    if (typeof value === 'string') {
        const match = value.match(/(\d+)\s*x\s*(\d+)/i);
        return match ? [Number(match[1]), Number(match[2])] : undefined;
    }

    if (value && typeof value === 'object') {
        const width = Number(value.width);
        const height = Number(value.height);
        return Number.isFinite(width) && Number.isFinite(height) ? [width, height] : undefined;
    }

    return undefined;
};

const normalizeDimensions = (record) => {
    const rawDimensions =
        record.dimensions && typeof record.dimensions === 'object' ? record.dimensions : {};
    const dimensions = {
        source: parseDimensionPair(
            record.sourceDimensions ?? record.source_dimensions ?? rawDimensions.source
        ),
        target: parseDimensionPair(
            record.targetDimensions ?? record.target_dimensions ?? rawDimensions.target
        ),
        archive: parseDimensionPair(
            record.archiveDimensions ??
                record.archive_dimensions ??
                rawDimensions.archive ??
                record.dimensions
        ),
    };

    return dimensions.source || dimensions.target || dimensions.archive ? dimensions : null;
};

const normalizeRisk = (record) => {
    if (Array.isArray(record.risks)) {
        return record.risks.map((risk) => String(risk)).join('; ');
    }

    return (
        getFirstString(
            record.risk,
            record.normalization,
            record.operation,
            record.recommendation
        ) ?? ''
    );
};

export const getManifestRecords = (manifest) => {
    if (Array.isArray(manifest)) {
        return manifest;
    }

    if (manifest && typeof manifest === 'object' && Array.isArray(manifest.records)) {
        return manifest.records;
    }

    return [];
};

export const setManifestRecords = (manifest, records) => {
    if (Array.isArray(manifest)) {
        return records;
    }

    if (manifest && typeof manifest === 'object') {
        return {
            ...manifest,
            records,
            count: typeof manifest.count === 'number' ? records.length : manifest.count,
            candidateCount:
                typeof manifest.candidateCount === 'number'
                    ? records.length
                    : manifest.candidateCount,
        };
    }

    return manifest;
};

export const normalizeArchivePath = (archivePath) => {
    if (typeof archivePath !== 'string' || !archivePath.trim()) {
        return null;
    }

    const normalized = toPosix(archivePath).replace(/^\.\//, '');
    const prefixIndex = normalized.indexOf(ASSET_PREFIX);

    return prefixIndex >= 0 ? normalized.slice(prefixIndex) : null;
};

export const normalizeSlot = (slot) => {
    if (slot === 'player-zone-p1') {
        return { slot: 'player-zone', rawSlot: slot, playerZoneSide: 'p1' };
    }

    if (slot === 'player-zone-p2') {
        return { slot: 'player-zone', rawSlot: slot, playerZoneSide: 'p2' };
    }

    return SURFACE_SLOTS.includes(slot) ? { slot, rawSlot: slot } : null;
};

export const getSurfaceSetId = ({ batch, date, style, variant }) =>
    `${batch}:${date}:${style}:${variant}`;

export const getSurfaceRegenKey = ({ batch, date, style, variant, slot }) =>
    `${batch}:${date}:${style}:${variant}:${slot}`;

const getManifestLocation = (repoRoot, manifestPath) => {
    const artRoot = path.join(repoRoot, 'assets', 'art-library');
    const parts = path.relative(artRoot, manifestPath).split(path.sep);
    return {
        batch: parts[0] ?? '',
        date: parts[1] ?? '',
    };
};

const collectPreviewManifestPaths = (directory) => {
    if (!fs.existsSync(directory)) {
        return [];
    }

    const paths = [];
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            paths.push(...collectPreviewManifestPaths(entryPath));
        } else if (entry.isFile() && entry.name === 'preview-manifest.json') {
            paths.push(entryPath);
        }
    }

    return paths;
};

export const loadSurfaceManifestRecords = ({ repoRoot }) => {
    const artRoot = path.join(repoRoot, 'assets', 'art-library');
    if (!fs.existsSync(artRoot)) {
        return [];
    }

    const records = [];
    for (const rootEntry of fs.readdirSync(artRoot, { withFileTypes: true })) {
        if (!rootEntry.isDirectory() || !CANDIDATE_BATCH_PATTERN.test(rootEntry.name)) {
            continue;
        }

        const batchRoot = path.join(artRoot, rootEntry.name);
        for (const manifestPath of collectPreviewManifestPaths(batchRoot)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            const manifestRecords = getManifestRecords(manifest);
            const location = getManifestLocation(repoRoot, manifestPath);
            const manifestRel = toPosix(path.relative(repoRoot, manifestPath));

            manifestRecords.forEach((rawRecord, index) => {
                if (!rawRecord || typeof rawRecord !== 'object') {
                    return;
                }

                const normalizedSlot = normalizeSlot(rawRecord.slot);
                const archivePath = normalizeArchivePath(
                    rawRecord.archive ??
                        rawRecord.archivePath ??
                        rawRecord.archive_path ??
                        rawRecord.archive_relative
                );
                const batch = getFirstString(rawRecord.batch, manifest.batch, location.batch);
                const date = getFirstString(rawRecord.date, manifest.date, location.date);
                const style = getFirstString(rawRecord.style, rawRecord.theme);
                const variant = getFirstString(rawRecord.variant);
                const promptId = getFirstString(rawRecord.promptId, rawRecord.prompt_id);

                if (!batch || !date || !style || !variant || !promptId || !normalizedSlot) {
                    return;
                }

                records.push({
                    batch,
                    date,
                    setId: getSurfaceSetId({ batch, date, style, variant }),
                    promptId,
                    slot: normalizedSlot.slot,
                    rawSlot: normalizedSlot.rawSlot,
                    playerZoneSide: normalizedSlot.playerZoneSide,
                    style,
                    variant,
                    score:
                        typeof rawRecord.score === 'number'
                            ? rawRecord.score
                            : Number(rawRecord.score) || null,
                    risk: normalizeRisk(rawRecord),
                    dimensions: normalizeDimensions(rawRecord),
                    archivePath,
                    archiveUrl: archivePath
                        ? `/__surface-lab/assets/${archivePath.slice(ASSET_PREFIX.length)}`
                        : '',
                    manifestPath: manifestRel,
                    manifestRecordIndex: index,
                });
            });
        }
    }

    return records;
};

export const groupRecords = (records) => {
    const grouped = new Map();

    for (const record of records) {
        const group = grouped.get(record.setId) ?? {
            id: record.setId,
            source: 'candidate',
            batch: record.batch,
            date: record.date,
            style: record.style,
            variant: record.variant,
            records: [],
            slots: {},
            playerZoneSideSlots: {},
        };
        group.records.push(record);
        if (record.slot !== 'player-zone' || !record.playerZoneSide) {
            group.slots[record.slot] ??= record;
        } else {
            group.slots['player-zone'] ??= record;
            group.playerZoneSideSlots[record.playerZoneSide] = record;
        }
        grouped.set(record.setId, group);
    }

    const completeSets = [];
    const incompleteSets = [];
    for (const group of grouped.values()) {
        const hasLegacyPlayerZone = group.records.some(
            (record) => record.slot === 'player-zone' && !record.playerZoneSide
        );
        const hasCompletePlayerZone =
            Boolean(group.slots['player-zone']) &&
            (hasLegacyPlayerZone ||
                Boolean(group.playerZoneSideSlots.p1 && group.playerZoneSideSlots.p2));
        const missingSlots = SURFACE_SLOTS.filter((slot) =>
            slot === 'player-zone' ? !hasCompletePlayerZone : !group.slots[slot]
        );

        if (missingSlots.length) {
            incompleteSets.push({
                setId: group.id,
                batch: group.batch,
                date: group.date,
                style: group.style,
                variant: group.variant,
                missingSlots,
                recordCount: group.records.length,
            });
        } else {
            completeSets.push(group);
        }
    }

    return { completeSets, incompleteSets };
};

export const updateManifestRecords = (repoRoot, manifestPath, shouldRemove, updateRecord) => {
    const absolutePath = path.join(repoRoot, manifestPath);
    const manifest = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    const records = getManifestRecords(manifest);
    const location = getManifestLocation(repoRoot, absolutePath);
    const nextRecords = [];
    const removedRecords = [];

    records.forEach((record, index) => {
        const batch = getFirstString(record.batch, manifest.batch, location.batch);
        const date = getFirstString(record.date, manifest.date, location.date);
        const style = getFirstString(record.style, record.theme);
        const variant = getFirstString(record.variant);
        const setId =
            batch && date && style && variant
                ? getSurfaceSetId({ batch, date, style, variant })
                : '';

        if (shouldRemove({ record, index, setId })) {
            removedRecords.push(record);
            return;
        }

        nextRecords.push(updateRecord ? updateRecord({ record, index, setId }) : record);
    });

    fs.writeFileSync(
        absolutePath,
        `${JSON.stringify(setManifestRecords(manifest, nextRecords), null, 2)}\n`
    );
    return { removedRecords, before: records.length, after: nextRecords.length };
};
