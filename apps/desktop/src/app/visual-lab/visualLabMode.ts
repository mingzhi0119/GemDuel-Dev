import type { VisualLabMode } from './surfaceLabTypes';
import { isVisualLabRuntimeUnlocked } from './visualLabRuntime';

export const getVisualLabMode = (): VisualLabMode | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const allowVisualLabFromBridge = window.__GEMDUEL_RUNTIME_CONFIG__?.allowVisualLab === true;

    if (
        !isVisualLabRuntimeUnlocked({
            isViteDev: import.meta.env.DEV,
            allowVisualLabFromBridge,
        })
    ) {
        return null;
    }

    const rawMode = new URLSearchParams(window.location.search).get('visualLab');

    return rawMode === 'surfaces' || rawMode === 'motion' ? rawMode : null;
};
