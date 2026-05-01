import fs from 'node:fs';
import path from 'node:path';
import {
    SURFACE_COMMENTS_STORAGE_KEY,
    SURFACE_RATINGS_STORAGE_KEY,
    SURFACE_REGEN_STORAGE_KEY,
    SURFACE_SLOTS,
    VALID_RATINGS,
    toPosix,
} from './visual-lab-surface-review-manifest.mjs';

export const SURFACE_REVIEW_STATE_SCHEMA_V1 = 'gemduel.visualLab.surfaceReviewState.v1';
export const SURFACE_REVIEW_STATE_SCHEMA = 'gemduel.visualLab.surfaceReviewState.v2';

const VALID_REGEN_SLOTS = new Set(SURFACE_SLOTS);
const VALID_SOURCE_KINDS = new Set(['electron', 'browser']);

export const getSurfaceReviewStatePath = ({ repoRoot }) =>
    path.join(repoRoot, 'tmp', 'visual-lab', 'surface-review-state.json');

export const getSurfaceReviewStateRelativePath = ({ repoRoot }) =>
    toPosix(path.relative(repoRoot, getSurfaceReviewStatePath({ repoRoot })));

const normalizeSource = (record = {}) => {
    const source = record.source && typeof record.source === 'object' ? record.source : {};
    const sourceKind = record.sourceKind ?? source.kind;

    return {
        kind: VALID_SOURCE_KINDS.has(sourceKind) ? sourceKind : 'browser',
        origin: typeof record.origin === 'string' ? record.origin : (source.origin ?? ''),
        href: typeof record.href === 'string' ? record.href : (source.href ?? ''),
    };
};

export const normalizeSurfaceReviewRatings = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return Object.entries(value).reduce((acc, [setId, rating]) => {
        const normalized = Number(rating);
        if (typeof setId === 'string' && VALID_RATINGS.has(normalized)) {
            acc[setId] = normalized;
        }
        return acc;
    }, {});
};

const getSlotFromRegenKey = (key) => {
    const parts = String(key).split(':');
    return parts.length >= 5 ? parts.at(-1) : '';
};

export const normalizeSurfaceReviewRegenMarks = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return Object.entries(value).reduce((acc, [regenKey, marked]) => {
        const slot = getSlotFromRegenKey(regenKey);
        if (marked === true && VALID_REGEN_SLOTS.has(slot)) {
            acc[regenKey] = true;
        }
        return acc;
    }, {});
};

export const normalizeSurfaceReviewComments = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return Object.entries(value).reduce((acc, [setId, comment]) => {
        if (typeof setId !== 'string' || typeof comment !== 'string') {
            return acc;
        }

        const normalized = comment.replace(/\r\n/g, '\n').trim();
        if (normalized) {
            acc[setId] = normalized;
        }
        return acc;
    }, {});
};

const normalizeCandidate = (candidate, fallbackSlot) => {
    if (!candidate || typeof candidate !== 'object') {
        return null;
    }

    const slot = typeof candidate.slot === 'string' ? candidate.slot : fallbackSlot;
    if (!VALID_REGEN_SLOTS.has(slot)) {
        return null;
    }

    return {
        batch: typeof candidate.batch === 'string' ? candidate.batch : '',
        date: typeof candidate.date === 'string' ? candidate.date : '',
        promptId: typeof candidate.promptId === 'string' ? candidate.promptId : '',
        slot,
        playerZoneSide:
            candidate.playerZoneSide === 'p1' || candidate.playerZoneSide === 'p2'
                ? candidate.playerZoneSide
                : undefined,
        style: typeof candidate.style === 'string' ? candidate.style : '',
        variant: typeof candidate.variant === 'string' ? candidate.variant : '',
        score: typeof candidate.score === 'number' ? candidate.score : null,
        risk: typeof candidate.risk === 'string' ? candidate.risk : '',
        dimensions:
            candidate.dimensions && typeof candidate.dimensions === 'object'
                ? candidate.dimensions
                : null,
        archiveUrl: typeof candidate.archiveUrl === 'string' ? candidate.archiveUrl : '',
        source: candidate.source === 'runtime' ? 'runtime' : 'candidate',
    };
};

export const normalizeSurfaceReviewAssetSets = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((set) => {
            if (!set || typeof set !== 'object') {
                return null;
            }

            const slots = {};
            const rawSlots = set.slots && typeof set.slots === 'object' ? set.slots : {};
            for (const slot of SURFACE_SLOTS) {
                const candidate = normalizeCandidate(rawSlots[slot], slot);
                if (candidate) {
                    slots[slot] = candidate;
                }
            }

            return {
                id: typeof set.id === 'string' ? set.id : '',
                source: set.source === 'runtime' ? 'runtime' : 'candidate',
                batch: typeof set.batch === 'string' ? set.batch : '',
                date: typeof set.date === 'string' ? set.date : '',
                style: typeof set.style === 'string' ? set.style : '',
                variant: typeof set.variant === 'string' ? set.variant : '',
                slots,
            };
        })
        .filter((set) => set && set.id && Object.keys(set.slots).length > 0);
};

const countSurfaceReviewRatings = (ratings) => {
    const counts = {
        1: 0,
        4: 0,
        7: 0,
        10: 0,
    };

    Object.values(ratings).forEach((rating) => {
        counts[rating] += 1;
    });

    return counts;
};

const getSetIdFromRegenKey = (regenKey) => String(regenKey).split(':').slice(0, -1).join(':');

const createPendingSummary = ({ ratings, regenMarks, comments, assetSets }) => {
    const replacements = Object.keys(regenMarks)
        .sort()
        .map((regenKey) => {
            const slot = getSlotFromRegenKey(regenKey);
            const setId = getSetIdFromRegenKey(regenKey);
            const set = assetSets.find(
                (candidateSet) =>
                    candidateSet.id === setId ||
                    `${candidateSet.batch}:${candidateSet.date}:${candidateSet.style}:${candidateSet.variant}` ===
                        setId
            );
            const candidate = set?.slots?.[slot];

            return {
                regenKey,
                setId,
                slot,
                source: set?.source ?? candidate?.source ?? 'unknown',
                style: set?.style ?? '',
                variant: set?.variant ?? '',
                promptId: candidate?.promptId ?? '',
                archiveUrl: candidate?.archiveUrl ?? '',
                rating: ratings[setId] ?? null,
            };
        });
    const commentEntries = Object.entries(comments)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([setId, comment]) => ({
            setId,
            rating: ratings[setId] ?? null,
            comment,
        }));

    return {
        replacements,
        comments: commentEntries,
    };
};

export const normalizeSurfaceReviewStateFile = (value) => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const schema = value.schema;
    if (
        schema &&
        schema !== SURFACE_REVIEW_STATE_SCHEMA &&
        schema !== SURFACE_REVIEW_STATE_SCHEMA_V1
    ) {
        return null;
    }

    const ratings = normalizeSurfaceReviewRatings(value.ratings);
    const regenMarks = normalizeSurfaceReviewRegenMarks(value.regenMarks);
    const comments = normalizeSurfaceReviewComments(value.comments);
    const assetSets = normalizeSurfaceReviewAssetSets(value.assetSets);
    const pending = createPendingSummary({ ratings, regenMarks, comments, assetSets });

    return {
        schema: SURFACE_REVIEW_STATE_SCHEMA,
        updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '',
        revision: Number.isFinite(Number(value.revision)) ? Number(value.revision) : 0,
        source: normalizeSource(value),
        storageKeys: {
            ratings: SURFACE_RATINGS_STORAGE_KEY,
            regenMarks: SURFACE_REGEN_STORAGE_KEY,
            comments: SURFACE_COMMENTS_STORAGE_KEY,
        },
        counts: {
            ratings: countSurfaceReviewRatings(ratings),
            regenMarks: Object.keys(regenMarks).length,
            comments: Object.keys(comments).length,
            assetSets: assetSets.length,
            pendingReplacements: pending.replacements.length,
            pendingComments: pending.comments.length,
        },
        ratings,
        regenMarks,
        comments,
        assetSets,
        pending,
    };
};

export const readSurfaceReviewStateFile = ({ repoRoot }) => {
    const statePath = getSurfaceReviewStatePath({ repoRoot });
    if (!fs.existsSync(statePath)) {
        return null;
    }

    return normalizeSurfaceReviewStateFile(JSON.parse(fs.readFileSync(statePath, 'utf8')));
};

export const createSurfaceReviewStateFile = ({ payload, previous = null }) => {
    const normalized = normalizeSurfaceReviewStateFile({
        ...payload,
        source: normalizeSource(payload),
        revision: (previous?.revision ?? 0) + 1,
        updatedAt: new Date().toISOString(),
    });

    if (!normalized) {
        throw new Error('Invalid Visual Lab surface review state payload.');
    }

    return normalized;
};

export const writeSurfaceReviewStateFile = ({ repoRoot, state }) => {
    const statePath = getSurfaceReviewStatePath({ repoRoot });
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    return statePath;
};

export const writeSurfaceReviewStatePayload = ({ repoRoot, payload }) => {
    const previous = readSurfaceReviewStateFile({ repoRoot });
    const state = createSurfaceReviewStateFile({ payload, previous });
    writeSurfaceReviewStateFile({ repoRoot, state });
    return state;
};

export const clearSurfaceReviewStateReplacementNotes = ({ repoRoot }) => {
    const previous = readSurfaceReviewStateFile({ repoRoot });
    if (!previous) {
        return null;
    }

    const state = createSurfaceReviewStateFile({
        previous,
        payload: {
            source: previous.source,
            ratings: previous.ratings,
            regenMarks: {},
            comments: {},
            assetSets: previous.assetSets,
        },
    });
    writeSurfaceReviewStateFile({ repoRoot, state });
    return state;
};
