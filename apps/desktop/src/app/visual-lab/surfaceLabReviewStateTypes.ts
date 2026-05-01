export const SURFACE_LAB_REVIEW_STATE_FILE_PATH = 'tmp/visual-lab/surface-review-state.json';

export type SurfaceLabReviewStateSourceKind = 'electron' | 'browser';

export type SurfaceLabReviewStateCounts = {
    ratings: Record<'1' | '4' | '7' | '10', number>;
    regenMarks: number;
    comments: number;
    assetSets: number;
    pendingReplacements: number;
    pendingComments: number;
};

export type SurfaceLabReviewStateStatus = {
    status: 'loading' | 'ready' | 'saving' | 'saved' | 'error' | 'unavailable';
    path: string;
    message: string;
    revision?: number;
    updatedAt?: string;
    counts?: SurfaceLabReviewStateCounts;
};
