import { useEffect, useMemo, useState } from 'react';
import type { ThemeName } from '@app/types/ui';
import { createSurfaceLabAssetSets, normalizeSurfaceLabCandidates } from './surfaceLabCatalog';
import type { SurfaceLabCatalog, SurfaceLabCandidate } from './surfaceLabTypes';

interface SurfaceLabCandidatesResponse {
    candidates?: unknown[];
    error?: string;
}

export const useSurfaceLabCatalog = (theme: ThemeName): SurfaceLabCatalog => {
    const [status, setStatus] = useState<SurfaceLabCatalog['status']>('loading');
    const [error, setError] = useState<string | undefined>();
    const [candidates, setCandidates] = useState<SurfaceLabCandidate[]>([]);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setStatus('loading');
            setError(undefined);

            try {
                const response = await fetch('/__surface-lab/candidates.json');

                if (!response.ok) {
                    throw new Error(`Surface lab catalog returned ${response.status}`);
                }

                const payload = (await response.json()) as SurfaceLabCandidatesResponse;
                const normalized = normalizeSurfaceLabCandidates(payload.candidates ?? []);

                if (!isMounted) {
                    return;
                }

                setCandidates(normalized);
                setStatus('ready');
                setError(payload.error);
            } catch (loadError) {
                if (!isMounted) {
                    return;
                }

                setCandidates([]);
                setStatus('error');
                setError(loadError instanceof Error ? loadError.message : 'Catalog unavailable');
            }
        };

        void load();

        return () => {
            isMounted = false;
        };
    }, []);

    const assetSets = useMemo(
        () => createSurfaceLabAssetSets(candidates, theme),
        [candidates, theme]
    );

    return {
        status,
        error,
        candidates,
        assetSets,
    };
};
