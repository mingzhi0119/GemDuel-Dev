import { useCallback, useState } from 'react';
import type { SurfaceLabAssetSet } from './surfaceLabTypes';
import type { SurfaceLabStyleRatings } from './useSurfaceLabRatings';
import type { SurfaceLabRegenMarks } from './useSurfaceLabRegenMarks';
import type { SurfaceLabReviewPlanExportState } from './surfaceLabReviewPlanTypes';

type LatestReviewState = {
    ratings: SurfaceLabStyleRatings;
    regenMarks: SurfaceLabRegenMarks;
};

type UseSurfaceLabReviewPlanExportInput = {
    assetSets: readonly SurfaceLabAssetSet[];
    clearSurfaceLabSlotRegenMarks: (keys: readonly string[]) => void;
    getLatestSurfaceLabReviewState: () => LatestReviewState;
};

export function useSurfaceLabReviewPlanExport({
    assetSets,
    clearSurfaceLabSlotRegenMarks,
    getLatestSurfaceLabReviewState,
}: UseSurfaceLabReviewPlanExportInput) {
    const [reviewPlanExport, setReviewPlanExport] = useState<SurfaceLabReviewPlanExportState>({
        status: 'idle',
    });

    const exportReviewPlan = useCallback(async () => {
        setReviewPlanExport({
            status: 'exporting',
            message: 'Freezing current review state',
        });

        try {
            const latestReviewState = getLatestSurfaceLabReviewState();
            const response = await fetch('/__surface-lab/review-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    origin: window.location.origin,
                    href: window.location.href,
                    ratings: latestReviewState.ratings,
                    regenMarks: latestReviewState.regenMarks,
                    assetSets: assetSets.map((set) => ({
                        id: set.id,
                        source: set.source,
                        batch: set.batch,
                        date: set.date,
                        style: set.style,
                        variant: set.variant,
                    })),
                }),
            });
            const payload = (await response.json()) as {
                ok?: boolean;
                error?: string;
                plan?: {
                    summary?: {
                        deleteSetCount?: number;
                        regenerateSlotCount?: number;
                        warningCount?: number;
                    };
                };
                files?: {
                    jsonPath?: string;
                    markdownPath?: string;
                };
            };

            if (!response.ok || !payload.ok) {
                throw new Error(payload.error ?? `Review plan export failed (${response.status})`);
            }

            setReviewPlanExport({
                status: 'exported',
                message: 'Review plan exported',
                jsonPath: payload.files?.jsonPath,
                markdownPath: payload.files?.markdownPath,
                deleteSetCount: payload.plan?.summary?.deleteSetCount ?? 0,
                regenerateSlotCount: payload.plan?.summary?.regenerateSlotCount ?? 0,
                warningCount: payload.plan?.summary?.warningCount ?? 0,
            });
        } catch (error) {
            setReviewPlanExport({
                status: 'error',
                message: error instanceof Error ? error.message : 'Review plan export failed',
            });
        }
    }, [assetSets, getLatestSurfaceLabReviewState]);

    const syncLatestCompletion = useCallback(async () => {
        setReviewPlanExport({
            status: 'syncing',
            message: 'Reading latest replacement completion',
        });

        try {
            const response = await fetch('/__surface-lab/review-completions/latest.json');
            const payload = (await response.json()) as {
                completedRegenKeys?: string[];
                error?: string;
            };

            if (!response.ok) {
                throw new Error(payload.error ?? `Completion sync failed (${response.status})`);
            }

            const completedRegenKeys = payload.completedRegenKeys ?? [];
            clearSurfaceLabSlotRegenMarks(completedRegenKeys);
            setReviewPlanExport({
                status: 'synced',
                message: 'Latest completion synced',
                syncedCount: completedRegenKeys.length,
            });
        } catch (error) {
            setReviewPlanExport({
                status: 'error',
                message: error instanceof Error ? error.message : 'Completion sync failed',
            });
        }
    }, [clearSurfaceLabSlotRegenMarks]);

    return {
        reviewPlanExport,
        exportReviewPlan,
        syncLatestCompletion,
    };
}
