import { useCallback, useEffect, useRef, useState } from 'react';
import type { SurfaceLabAssetSet } from './surfaceLabTypes';
import {
    readSurfaceLabRatings,
    useSurfaceLabRatings,
    type SurfaceLabStyleRatings,
} from './useSurfaceLabRatings';
import {
    readSurfaceLabRegenMarks,
    useSurfaceLabRegenMarks,
    type SurfaceLabRegenMarks,
} from './useSurfaceLabRegenMarks';
import {
    readSurfaceLabComments,
    useSurfaceLabComments,
    type SurfaceLabStyleComments,
} from './useSurfaceLabComments';
import {
    SURFACE_LAB_REVIEW_STATE_ENDPOINT,
    createReviewStateStatus,
    getSurfaceLabReviewStateSourceKind,
    readSurfaceLabSharedReviewStatePayload,
    serializeSurfaceLabAssetSet,
    type SurfaceLabSerializedAssetSet,
    type SurfaceLabSharedReviewState,
} from './surfaceLabReviewStateClient';
import {
    SURFACE_LAB_REVIEW_STATE_FILE_PATH,
    type SurfaceLabReviewStateStatus,
} from './surfaceLabReviewStateTypes';

const SURFACE_LAB_REVIEW_STATE_SYNC_INTERVAL_MS = 2000;

export function useSurfaceLabSharedReviewState(assetSets: readonly SurfaceLabAssetSet[] = []) {
    const latestReviewStateRevisionRef = useRef(-1);
    const isApplyingSharedReviewStateRef = useRef(false);
    const hasBootstrappedReviewStateRef = useRef(false);
    const latestStyleRatingsRef = useRef<SurfaceLabStyleRatings>(readSurfaceLabRatings());
    const latestRegenMarksRef = useRef<SurfaceLabRegenMarks>(readSurfaceLabRegenMarks());
    const latestStyleCommentsRef = useRef<SurfaceLabStyleComments>(readSurfaceLabComments());
    const latestAssetSetsRef = useRef<SurfaceLabSerializedAssetSet[]>(
        assetSets.map(serializeSurfaceLabAssetSet)
    );
    const [reviewStateStatus, setReviewStateStatus] = useState<SurfaceLabReviewStateStatus>({
        status: 'loading',
        path: SURFACE_LAB_REVIEW_STATE_FILE_PATH,
        message: 'Checking review state file',
    });

    const publishSharedReviewState = useCallback(
        async (next: {
            ratings?: SurfaceLabStyleRatings;
            regenMarks?: SurfaceLabRegenMarks;
            comments?: SurfaceLabStyleComments;
        }) => {
            const ratings = next.ratings ?? latestStyleRatingsRef.current;
            const regenMarks = next.regenMarks ?? latestRegenMarksRef.current;
            const comments = next.comments ?? latestStyleCommentsRef.current;

            setReviewStateStatus((current) => ({
                ...current,
                status: 'saving',
                message: 'Writing review state file',
            }));

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
                        comments,
                        assetSets: latestAssetSetsRef.current,
                    }),
                });
                const payload = await readSurfaceLabSharedReviewStatePayload(response);

                if (!response.ok || !payload.state) {
                    throw new Error(payload.error ?? `State write failed (${response.status})`);
                }

                latestReviewStateRevisionRef.current = Math.max(
                    latestReviewStateRevisionRef.current,
                    payload.state.revision
                );
                setReviewStateStatus(
                    createReviewStateStatus(
                        payload.state,
                        payload.path,
                        'Review state saved',
                        'saved'
                    )
                );
                return payload.state;
            } catch (error) {
                setReviewStateStatus((current) => ({
                    ...current,
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Review state write failed',
                }));
                return null;
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

    const handleStyleCommentsChange = useCallback(
        (comments: SurfaceLabStyleComments) => {
            latestStyleCommentsRef.current = comments;

            if (!isApplyingSharedReviewStateRef.current) {
                void publishSharedReviewState({ comments });
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
    const { styleComments, setStyleComment, replaceSurfaceLabComments } = useSurfaceLabComments({
        onChange: handleStyleCommentsChange,
    });

    const applySharedReviewState = useCallback(
        (state: SurfaceLabSharedReviewState, path: string) => {
            if (state.revision < latestReviewStateRevisionRef.current) {
                setReviewStateStatus(
                    createReviewStateStatus(state, path, 'Review state already current')
                );
                return;
            }

            latestReviewStateRevisionRef.current = state.revision;
            latestStyleRatingsRef.current = state.ratings;
            latestRegenMarksRef.current = state.regenMarks;
            latestStyleCommentsRef.current = state.comments;
            isApplyingSharedReviewStateRef.current = true;
            replaceSurfaceLabRatings(state.ratings);
            replaceSurfaceLabRegenMarks(state.regenMarks);
            replaceSurfaceLabComments(state.comments);
            isApplyingSharedReviewStateRef.current = false;
            setReviewStateStatus(createReviewStateStatus(state, path, 'Review state loaded'));
        },
        [replaceSurfaceLabComments, replaceSurfaceLabRatings, replaceSurfaceLabRegenMarks]
    );

    useEffect(() => {
        latestStyleRatingsRef.current = styleRatings;
    }, [styleRatings]);

    useEffect(() => {
        latestRegenMarksRef.current = regenMarks;
    }, [regenMarks]);

    useEffect(() => {
        latestStyleCommentsRef.current = styleComments;
    }, [styleComments]);

    useEffect(() => {
        latestAssetSetsRef.current = assetSets.map(serializeSurfaceLabAssetSet);

        if (hasBootstrappedReviewStateRef.current) {
            void publishSharedReviewState({});
        }
    }, [assetSets, publishSharedReviewState]);

    useEffect(() => {
        let disposed = false;

        const bootstrapReviewState = async () => {
            try {
                const response = await fetch(SURFACE_LAB_REVIEW_STATE_ENDPOINT);

                if (disposed) {
                    return;
                }

                if (response.ok) {
                    const payload = await readSurfaceLabSharedReviewStatePayload(response);
                    if (payload.state && !disposed) {
                        applySharedReviewState(payload.state, payload.path);
                        hasBootstrappedReviewStateRef.current = true;
                        void publishSharedReviewState({});
                    }
                    return;
                }

                if (response.status === 404) {
                    hasBootstrappedReviewStateRef.current = true;
                    await publishSharedReviewState({
                        ratings: readSurfaceLabRatings(),
                        regenMarks: readSurfaceLabRegenMarks(),
                        comments: readSurfaceLabComments(),
                    });
                    return;
                }

                const payload = await readSurfaceLabSharedReviewStatePayload(response);
                throw new Error(
                    payload.error ?? `Review state endpoint failed (${response.status})`
                );
            } catch (error) {
                if (!disposed) {
                    setReviewStateStatus((current) => ({
                        ...current,
                        status: 'unavailable',
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Review state file unavailable',
                    }));
                }
            }
        };

        void bootstrapReviewState();

        return () => {
            disposed = true;
        };
    }, [applySharedReviewState, publishSharedReviewState]);

    useEffect(() => {
        let disposed = false;

        const pollReviewState = async () => {
            try {
                const response = await fetch(SURFACE_LAB_REVIEW_STATE_ENDPOINT);

                if (!response.ok || disposed) {
                    return;
                }

                const payload = await readSurfaceLabSharedReviewStatePayload(response);
                if (payload.state && !disposed) {
                    applySharedReviewState(payload.state, payload.path);
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
            comments: latestStyleCommentsRef.current,
        }),
        []
    );

    return {
        styleRatings,
        setStyleRating,
        regenMarks,
        toggleSurfaceLabSlotRegenMark,
        clearSurfaceLabSlotRegenMarks,
        styleComments,
        setStyleComment,
        reviewStateStatus,
        getLatestSurfaceLabReviewState,
    };
}
