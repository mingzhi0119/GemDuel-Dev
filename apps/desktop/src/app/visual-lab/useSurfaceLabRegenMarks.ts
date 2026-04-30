import { useCallback, useEffect, useRef, useState } from 'react';
import {
    SURFACE_LAB_SLOTS,
    type SurfaceLabAssetSet,
    type SurfaceLabCandidate,
} from './surfaceLabTypes';

export const SURFACE_LAB_REGEN_MARKS_STORAGE_KEY = 'gemduel.visualLab.surfaceSlotRegenMarks.v1';
export const SURFACE_LAB_REGEN_FILTER_OPTIONS = ['All', 'Needs regen', 'Clean'] as const;

export type SurfaceLabRegenFilter = (typeof SURFACE_LAB_REGEN_FILTER_OPTIONS)[number];
export type SurfaceLabRegenMarks = Record<string, true>;

export const getSurfaceLabSlotRegenKey = (candidate: SurfaceLabCandidate): string =>
    `${candidate.batch}:${candidate.date}:${candidate.style}:${candidate.variant}:${candidate.slot}`;

export const normalizeSurfaceLabRegenMarks = (value: unknown): SurfaceLabRegenMarks => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return Object.entries(value).reduce<SurfaceLabRegenMarks>((acc, [key, marked]) => {
        if (marked === true) {
            acc[key] = true;
        }
        return acc;
    }, {});
};

export const readSurfaceLabRegenMarks = (): SurfaceLabRegenMarks => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return {};
    }

    try {
        return normalizeSurfaceLabRegenMarks(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_REGEN_MARKS_STORAGE_KEY) ?? '{}')
        );
    } catch {
        return {};
    }
};

export const writeSurfaceLabRegenMarks = (marks: SurfaceLabRegenMarks) => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return;
    }

    try {
        window.localStorage.setItem(SURFACE_LAB_REGEN_MARKS_STORAGE_KEY, JSON.stringify(marks));
    } catch {
        // Visual Lab marks are local review state; storage failures should not break preview.
    }
};

export const isSurfaceLabSlotMarkedForRegen = (
    candidate: SurfaceLabCandidate,
    marks: SurfaceLabRegenMarks
): boolean => marks[getSurfaceLabSlotRegenKey(candidate)] === true;

const hasMarkedSlot = (set: SurfaceLabAssetSet, marks: SurfaceLabRegenMarks): boolean =>
    SURFACE_LAB_SLOTS.some((slot) => isSurfaceLabSlotMarkedForRegen(set.slots[slot], marks));

export const matchesSurfaceLabRegenFilter = (
    set: SurfaceLabAssetSet,
    marks: SurfaceLabRegenMarks,
    filter: SurfaceLabRegenFilter
): boolean => {
    if (filter === 'All') {
        return true;
    }

    const marked = hasMarkedSlot(set, marks);

    return filter === 'Needs regen' ? marked : !marked;
};

export const useSurfaceLabRegenMarks = (options?: {
    onChange?: (marks: SurfaceLabRegenMarks) => void;
}) => {
    const [regenMarks, setRegenMarks] = useState<SurfaceLabRegenMarks>(readSurfaceLabRegenMarks);
    const onChangeRef = useRef(options?.onChange);

    useEffect(() => {
        onChangeRef.current = options?.onChange;
    }, [options?.onChange]);

    const toggleSurfaceLabSlotRegenMark = useCallback((candidate: SurfaceLabCandidate) => {
        setRegenMarks((current) => {
            const key = getSurfaceLabSlotRegenKey(candidate);
            const next = { ...current };

            if (next[key]) {
                delete next[key];
            } else {
                next[key] = true;
            }

            writeSurfaceLabRegenMarks(next);
            onChangeRef.current?.(next);
            return next;
        });
    }, []);

    const clearSurfaceLabSlotRegenMarks = useCallback((keys: readonly string[]) => {
        if (keys.length === 0) {
            return;
        }

        setRegenMarks((current) => {
            const next = { ...current };
            let changed = false;

            keys.forEach((key) => {
                if (next[key]) {
                    delete next[key];
                    changed = true;
                }
            });

            if (changed) {
                writeSurfaceLabRegenMarks(next);
                onChangeRef.current?.(next);
            }

            return changed ? next : current;
        });
    }, []);

    const replaceSurfaceLabRegenMarks = useCallback((marks: SurfaceLabRegenMarks) => {
        writeSurfaceLabRegenMarks(marks);
        setRegenMarks(marks);
    }, []);

    return {
        regenMarks,
        toggleSurfaceLabSlotRegenMark,
        clearSurfaceLabSlotRegenMarks,
        replaceSurfaceLabRegenMarks,
    };
};
