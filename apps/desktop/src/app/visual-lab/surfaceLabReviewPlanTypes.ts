export interface SurfaceLabReviewPlanExportState {
    status: 'idle' | 'exporting' | 'exported' | 'syncing' | 'synced' | 'error';
    message?: string;
    jsonPath?: string;
    markdownPath?: string;
    deleteSetCount?: number;
    regenerateSlotCount?: number;
    warningCount?: number;
    syncedCount?: number;
}
