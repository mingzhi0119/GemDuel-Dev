import type { VisualLabMode } from './surfaceLabTypes';

export const getVisualLabMode = (): VisualLabMode | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const rawMode = new URLSearchParams(window.location.search).get('visualLab');

    return rawMode === 'surfaces' || rawMode === 'motion' ? rawMode : null;
};
