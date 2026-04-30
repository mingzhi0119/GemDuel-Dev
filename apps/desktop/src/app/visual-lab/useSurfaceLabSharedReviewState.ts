import { useCallback, useEffect, useRef } from 'react';
import {
    normalizeSurfaceLabStyleRatings,
    readSurfaceLabRatings,
    useSurfaceLabRatings,
    type SurfaceLabStyleRatings,
} from './useSurfaceLabRatings';
import {
    normalizeSurfaceLabRegenMarks,
    readSurfaceLabRegenMarks,
    useSurfaceLabRegenMarks,
    type SurfaceLabRegenMarks,
} from './useSurfaceLabRegenMarks';

const SURFACE_LAB_REVIEW_STATE_SYNC_INTERVAL_MS = 2000;
const SURFACE_LAB_REVIEW_STATE_ENDPOINT = '/__surface-lab/review-state.json';

type SurfaceLabReviewStateSourceKind = 'electron' | 'browser';

type SurfaceLabSharedReviewState = {
    revision: number;
    ratings: SurfaceLabStyleRatings;
    regenMarks: SurfaceLabRegenMarks;
    source?: {
        kind?: SurfaceLabReviewStateSourceKind;
        origin?: string;
        href?: string;
    };
};

const getSurfaceLabReviewStateSourceKind = (): SurfaceLabReviewStateSourceKind =>
    typeof window !== 'undefined' && window.electron ? 'electron' : 'browser';

const normalizeSurfaceLabSharedReviewState = (
    value: unknown
): SurfaceLabSharedReviewState | null => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const record = value as Record<string, unknown>;
    const source =
        record.source && typeof record.source === 'object'
            ? (record.source as Record<string, unknown>)
            : {};
    const revision = Number(record.revision);

    return {
        revision: Number.isFinite(revision) ? revision : 0,
        ratings: normalizeSurfaceLabStyleRatings(record.ratings),
        regenMarks: normalizeSurfaceLabRegenMarks(record.regenMarks),
        source: {
            kind: source.kind === 'electron' ? 'electron' : 'browser',
            origin: typeof source.origin === 'string' ? source.origin : '',
            href: typeof source.href === 'string' ? source.href : '',
        },
    };
};

const readSurfaceLabSharedReviewStatePayload = async (
    response: Response
): Promise<SurfaceLabSharedReviewState | null> => {
    const payload = (await response.json()) as { state?: unknown };
    return normalizeSurfaceLabSharedReviewState(payload.state);
};

export function useSurfaceLabSharedReviewState() {
    const latestReviewStateRevisionRef = useRef(0);
    const isApplyingSharedReviewStateRef = useRef(false);
    const latestStyleRatingsRef = useRef<SurfaceLabStyleRatings>(readSurfaceLabRatings());
    const latestRegenMarksRef = useRef<SurfaceLabRegenMarks>(readSurfaceLabRegenMarks());

    const publishSharedReviewState = useCallback(
        async (next: { ratings?: SurfaceLabStyleRatings; regenMarks?: SurfaceLabRegenMarks }) => {
            const ratings = next.ratings ?? latestStyleRatingsRef.current;
            const regenMarks = next.regenMarks ?? latestRegenMarksRef.current;

            try {
                const response = await fetch(SURFACE_LAB_REVIEW_STATE_ENDPOINT, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sourceKind: getSurfaceLabReviewStateSourceKind(),
                        origin: window.location.origin,
                        href: window.location.href,
                        ratings,
                        regenMarks,
                    }),
                });

                if (!response.ok) {
                    return;
                }

                const state = await readSurfaceLabSharedReviewStatePayload(response);
                if (state) {
                    latestReviewStateRevisionRef.current = Math.max(
                        latestReviewStateRevisionRef.current,
                        state.revision
                    );
                }
            } catch {
                // Shared review state is dev-only coordination; localStorage remains the fallback.
            }
        },
        []
    );

    const handleStyleRatingsChange = useCallback(
        (ratings: SurfaceLabStyleRatings) => {
            latestStyleRatingsRef.current = ratings;

            if (!isApplyingSharedReviewStateRef.current) {
                void publishSharedReviewState({ ratings });
            }
        },
        [publishSharedReviewState]
    );

    const handleRegenMarksChange = useCallback(
        (marks: SurfaceLabRegenMarks) => {
            latestRegenMarksRef.current = marks;

            if (!isApplyingSharedReviewStateRef.current) {
                void publishSharedReviewState({ regenMarks: marks });
            }
        },
        [publishSharedReviewState]
    );

    const { styleRatings, setStyleRating, replaceSurfaceLabRatings } = useSurfaceLabRatings({
        onChange: handleStyleRatingsChange,
    });
    const {
        regenMarks,
        toggleSurfaceLabSlotRegenMark,
        clearSurfaceLabSlotRegenMarks,
        replaceSurfaceLabRegenMarks,
    } = useSurfaceLabRegenMarks({
        onChange: handleRegenMarksChange,
    });

    const applySharedReviewState = useCallback(
        (state: SurfaceLabSharedReviewState) => {
            if (state.revision <= latestReviewStateRevisionRef.current) {
                return;
            }

            latestReviewStateRevisionRef.current = state.revision;
            latestStyleRatingsRef.current = state.ratings;
            latestRegenMarksRef.current = state.regenMarks;
            isApplyingSharedReviewStateRef.current = true;
            replaceSurfaceLabRatings(state.ratings);
            replaceSurfaceLabRegenMarks(state.regenMarks);
            isApplyingSharedReviewStateRef.current = false;
        },
        [replaceSurfaceLabRatings, replaceSurfaceLabRegenMarks]
    );

    useEffect(() => {
        latestStyleRatingsRef.current = styleRatings;
    }, [styleRatings]);

    useEffect(() => {
        latestRegenMarksRef.current = regenMarks;
    }, [regenMarks]);

    useEffect(() => {
        let disposed = false;

        const bootstrapReviewState = async () => {
            try {
                if (getSurfaceLabReviewStateSourceKind() === 'electron') {
                    const response = await fetch(SURFACE_LAB_REVIEW_STATE_ENDPOINT, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            sourceKind: 'electron',
                            origin: window.location.origin,
                            href: window.location.href,
                            ratings: readSurfaceLabRatings(),
                            regenMarks: readSurfaceLabRegenMarks(),
                        }),
                    });

                    if (!response.ok || disposed) {
                        return;
                    }

                    const state = await readSurfaceLabSharedReviewStatePayload(response);
                    if (state && !disposed) {
                        applySharedReviewState(state);
                    }
                    return;
                }

                const response = await fetch(SURFACE_LAB_REVIEW_STATE_ENDPOINT);

                if (!response.ok || disposed) {
                    return;
                }

                const state = await readSurfaceLabSharedReviewStatePayload(response);
                if (state && !disposed) {
                    applySharedReviewState(state);
                }
            } catch {
                // The review-state endpoint exists only in Vite dev; localStorage remains usable.
            }
        };

        void bootstrapReviewState();

        return () => {
            disposed = true;
        };
    }, [applySharedReviewState]);

    useEffect(() => {
        let disposed = false;

        const pollReviewState = async () => {
            try {
                const response = await fetch(SURFACE_LAB_REVIEW_STATE_ENDPOINT);

                if (!response.ok || disposed) {
                    return;
                }

                const state = await readSurfaceLabSharedReviewStatePayload(response);
                if (state && !disposed) {
                    applySharedReviewState(state);
                }
            } catch {
                // Polling is best-effort; user actions still persist locally and retry on change.
            }
        };

        const interval = window.setInterval(
            () => void pollReviewState(),
            SURFACE_LAB_REVIEW_STATE_SYNC_INTERVAL_MS
        );

        return () => {
            disposed = true;
            window.clearInterval(interval);
        };
    }, [applySharedReviewState]);

    const getLatestSurfaceLabReviewState = useCallback(
        () => ({
            ratings: latestStyleRatingsRef.current,
            regenMarks: latestRegenMarksRef.current,
        }),
        []
    );

    return {
        styleRatings,
        setStyleRating,
        regenMarks,
        toggleSurfaceLabSlotRegenMark,
        clearSurfaceLabSlotRegenMarks,
        getLatestSurfaceLabReviewState,
    };
}
