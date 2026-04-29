import { useCallback, useState } from 'react';
import type { SurfaceLabAssetSet } from './surfaceLabTypes';

export const SURFACE_LAB_RATINGS_STORAGE_KEY = 'gemduel.visualLab.surfaceStyleRatings.v1';
export const SURFACE_LAB_STYLE_RATINGS = [1, 4, 7, 10] as const;
export const SURFACE_LAB_RATING_FILTER_OPTIONS = ['All', 'Unrated', '1', '4', '7', '10'] as const;

export type SurfaceLabStyleRating = (typeof SURFACE_LAB_STYLE_RATINGS)[number];
export type SurfaceLabRatingFilter = (typeof SURFACE_LAB_RATING_FILTER_OPTIONS)[number];
export type SurfaceLabStyleRatings = Record<string, SurfaceLabStyleRating>;

const isSurfaceLabStyleRating = (value: unknown): value is SurfaceLabStyleRating =>
    SURFACE_LAB_STYLE_RATINGS.includes(value as SurfaceLabStyleRating);

const normalizeStoredRatings = (value: unknown): SurfaceLabStyleRatings => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return Object.entries(value).reduce<SurfaceLabStyleRatings>((acc, [setId, rating]) => {
        if (isSurfaceLabStyleRating(rating)) {
            acc[setId] = rating;
        }
        return acc;
    }, {});
};

export const readSurfaceLabRatings = (): SurfaceLabStyleRatings => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return {};
    }

    try {
        return normalizeStoredRatings(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_RATINGS_STORAGE_KEY) ?? '{}')
        );
    } catch {
        return {};
    }
};

const writeSurfaceLabRatings = (ratings: SurfaceLabStyleRatings) => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return;
    }

    try {
        window.localStorage.setItem(SURFACE_LAB_RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    } catch {
        // Visual Lab ratings are a local convenience; storage failures should not break preview.
    }
};

export const matchesSurfaceLabRatingFilter = (
    set: SurfaceLabAssetSet,
    ratings: SurfaceLabStyleRatings,
    filter: SurfaceLabRatingFilter
): boolean => {
    if (filter === 'All') {
        return true;
    }

    const rating = ratings[set.id];

    if (filter === 'Unrated') {
        return rating === undefined;
    }

    return rating === Number(filter);
};

export const getNextSurfaceLabSelectedSetId = (
    currentSetId: string,
    assetSets: readonly SurfaceLabAssetSet[],
    visibleAssetSets: readonly SurfaceLabAssetSet[]
): string => {
    const currentSet = assetSets.find((set) => set.id === currentSetId);

    if (visibleAssetSets.length === 0) {
        return currentSet?.id ?? assetSets[0]?.id ?? '';
    }

    if (visibleAssetSets.some((set) => set.id === currentSetId)) {
        return currentSetId;
    }

    const sameBatchSet =
        currentSet && visibleAssetSets.find((set) => set.batchLabel === currentSet.batchLabel);

    return sameBatchSet?.id ?? visibleAssetSets[0].id;
};

export const useSurfaceLabRatings = () => {
    const [styleRatings, setStyleRatings] = useState<SurfaceLabStyleRatings>(readSurfaceLabRatings);

    const setStyleRating = useCallback((setId: string, rating: SurfaceLabStyleRating) => {
        setStyleRatings((current) => {
            const next = {
                ...current,
                [setId]: rating,
            };
            writeSurfaceLabRatings(next);
            return next;
        });
    }, []);

    return {
        styleRatings,
        setStyleRating,
    };
};
