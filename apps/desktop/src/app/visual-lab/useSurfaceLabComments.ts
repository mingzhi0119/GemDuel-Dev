import { useCallback, useEffect, useRef, useState } from 'react';

export const SURFACE_LAB_COMMENTS_STORAGE_KEY = 'gemduel.visualLab.surfaceStyleComments.v1';

export type SurfaceLabStyleComments = Record<string, string>;

const normalizeComment = (value: unknown): string | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const comment = value.replace(/\r\n/g, '\n');
    return comment.trim() ? comment : null;
};

export const normalizeSurfaceLabStyleComments = (value: unknown): SurfaceLabStyleComments => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return Object.entries(value).reduce<SurfaceLabStyleComments>((acc, [setId, comment]) => {
        const normalized = normalizeComment(comment);
        if (normalized) {
            acc[setId] = normalized;
        }
        return acc;
    }, {});
};

export const readSurfaceLabComments = (): SurfaceLabStyleComments => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return {};
    }

    try {
        return normalizeSurfaceLabStyleComments(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_COMMENTS_STORAGE_KEY) ?? '{}')
        );
    } catch {
        return {};
    }
};

export const writeSurfaceLabComments = (comments: SurfaceLabStyleComments) => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return;
    }

    try {
        window.localStorage.setItem(SURFACE_LAB_COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    } catch {
        // Visual Lab comments are local review notes; storage failures should not break preview.
    }
};

export const useSurfaceLabComments = (options?: {
    onChange?: (comments: SurfaceLabStyleComments) => void;
}) => {
    const [styleComments, setStyleComments] =
        useState<SurfaceLabStyleComments>(readSurfaceLabComments);
    const onChangeRef = useRef(options?.onChange);

    useEffect(() => {
        onChangeRef.current = options?.onChange;
    }, [options?.onChange]);

    const setStyleComment = useCallback((setId: string, comment: string) => {
        setStyleComments((current) => {
            const next = { ...current };
            const normalized = normalizeComment(comment);

            if (normalized) {
                next[setId] = normalized;
            } else {
                delete next[setId];
            }

            writeSurfaceLabComments(next);
            onChangeRef.current?.(next);
            return next;
        });
    }, []);

    const replaceSurfaceLabComments = useCallback((comments: SurfaceLabStyleComments) => {
        writeSurfaceLabComments(comments);
        setStyleComments(comments);
    }, []);

    return {
        styleComments,
        setStyleComment,
        replaceSurfaceLabComments,
    };
};
