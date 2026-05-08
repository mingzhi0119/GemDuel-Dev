import { useCallback, useEffect, useRef } from 'react';
import type { AppVisualLabMode } from '../../types/ui';

interface UseVisualLabExitResetOptions {
    visualLabMode: AppVisualLabMode | null;
    historyLength: number;
    resetToStartPage: () => void;
}

export const useVisualLabExitReset = ({
    visualLabMode,
    historyLength,
    resetToStartPage,
}: UseVisualLabExitResetOptions) => {
    const previousVisualLabModeRef = useRef<AppVisualLabMode | null>(visualLabMode);
    const shouldResetVisualLabFixtureRef = useRef(Boolean(visualLabMode));

    useEffect(() => {
        const previous = previousVisualLabModeRef.current;
        if (visualLabMode && !previous) {
            shouldResetVisualLabFixtureRef.current = historyLength === 0;
        }
        if (!visualLabMode && previous && shouldResetVisualLabFixtureRef.current) {
            resetToStartPage();
            shouldResetVisualLabFixtureRef.current = false;
        }
        previousVisualLabModeRef.current = visualLabMode;
    }, [historyLength, resetToStartPage, visualLabMode]);

    return useCallback(() => {
        shouldResetVisualLabFixtureRef.current = historyLength === 0;
    }, [historyLength]);
};
