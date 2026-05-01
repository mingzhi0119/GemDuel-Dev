import {
    SURFACE_LAB_SLOTS,
    type SurfaceLabAssetSet,
    type SurfaceLabCandidate,
} from './surfaceLabTypes';
import {
    normalizeSurfaceLabStyleRatings,
    type SurfaceLabStyleRatings,
} from './useSurfaceLabRatings';
import {
    normalizeSurfaceLabRegenMarks,
    type SurfaceLabRegenMarks,
} from './useSurfaceLabRegenMarks';
import {
    normalizeSurfaceLabStyleComments,
    type SurfaceLabStyleComments,
} from './useSurfaceLabComments';
import {
    SURFACE_LAB_REVIEW_STATE_FILE_PATH,
    type SurfaceLabReviewStateCounts,
    type SurfaceLabReviewStateSourceKind,
    type SurfaceLabReviewStateStatus,
} from './surfaceLabReviewStateTypes';

export const SURFACE_LAB_REVIEW_STATE_ENDPOINT = '/__surface-lab/review-state.json';

export type SurfaceLabSerializedAssetSet = {
    id: string;
    source: SurfaceLabAssetSet['source'];
    batch: string;
    date: string;
    style: string;
    variant: string;
    slots: Record<string, unknown>;
};

export type SurfaceLabSharedReviewState = {
    revision: number;
    updatedAt?: string;
    ratings: SurfaceLabStyleRatings;
    regenMarks: SurfaceLabRegenMarks;
    comments: SurfaceLabStyleComments;
    counts?: SurfaceLabReviewStateCounts;
};

export type SurfaceLabReviewStateResponse = {
    state: SurfaceLabSharedReviewState | null;
    path: string;
    error?: string;
};

export const getSurfaceLabReviewStateSourceKind = (): SurfaceLabReviewStateSourceKind =>
    typeof window !== 'undefined' && window.electron ? 'electron' : 'browser';

const serializeSurfaceLabCandidate = (candidate: SurfaceLabCandidate) => ({
    batch: candidate.batch,
    date: candidate.date,
    promptId: candidate.promptId,
    slot: candidate.slot,
    playerZoneSide: candidate.playerZoneSide,
    style: candidate.style,
    variant: candidate.variant,
    score: candidate.score,
    risk: candidate.risk,
    dimensions: candidate.dimensions,
    archiveUrl: candidate.archiveUrl,
    source: candidate.source,
});

export const serializeSurfaceLabAssetSet = (
    set: SurfaceLabAssetSet
): SurfaceLabSerializedAssetSet => ({
    id: set.id,
    source: set.source,
    batch: set.batch,
    date: set.date,
    style: set.style,
    variant: set.variant,
    slots: Object.fromEntries(
        SURFACE_LAB_SLOTS.map((slot) => [slot, serializeSurfaceLabCandidate(set.slots[slot])])
    ),
});

const normalizeReviewStateCounts = (value: unknown): SurfaceLabReviewStateCounts | undefined => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return undefined;
    }

    const record = value as Record<string, unknown>;
    const ratings =
        record.ratings && typeof record.ratings === 'object' && !Array.isArray(record.ratings)
            ? (record.ratings as Record<string, unknown>)
            : {};

    return {
        ratings: {
            '1': Number(ratings['1']) || 0,
            '4': Number(ratings['4']) || 0,
            '7': Number(ratings['7']) || 0,
            '10': Number(ratings['10']) || 0,
        },
        regenMarks: Number(record.regenMarks) || 0,
        comments: Number(record.comments) || 0,
        assetSets: Number(record.assetSets) || 0,
        pendingReplacements: Number(record.pendingReplacements) || 0,
        pendingComments: Number(record.pendingComments) || 0,
    };
};

const normalizeSurfaceLabSharedReviewState = (
    value: unknown
): SurfaceLabSharedReviewState | null => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const record = value as Record<string, unknown>;
    const revision = Number(record.revision);

    return {
        revision: Number.isFinite(revision) ? revision : 0,
        updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : undefined,
        ratings: normalizeSurfaceLabStyleRatings(record.ratings),
        regenMarks: normalizeSurfaceLabRegenMarks(record.regenMarks),
        comments: normalizeSurfaceLabStyleComments(record.comments),
        counts: normalizeReviewStateCounts(record.counts),
    };
};

export const readSurfaceLabSharedReviewStatePayload = async (
    response: Response
): Promise<SurfaceLabReviewStateResponse> => {
    const payload = (await response.json()) as {
        state?: unknown;
        path?: unknown;
        error?: unknown;
    };

    return {
        state: normalizeSurfaceLabSharedReviewState(payload.state),
        path: typeof payload.path === 'string' ? payload.path : SURFACE_LAB_REVIEW_STATE_FILE_PATH,
        error: typeof payload.error === 'string' ? payload.error : undefined,
    };
};

export const createReviewStateStatus = (
    state: SurfaceLabSharedReviewState,
    path: string,
    message: string,
    status: SurfaceLabReviewStateStatus['status'] = 'ready'
): SurfaceLabReviewStateStatus => ({
    status,
    path,
    message,
    revision: state.revision,
    updatedAt: state.updatedAt,
    counts: state.counts,
});
