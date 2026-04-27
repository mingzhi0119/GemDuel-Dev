export type PresentationPreviewMode = 'slow';

const PREVIEW_TIMING_SCALE: Record<PresentationPreviewMode, number> = {
    slow: 3,
};

export const getPresentationTimingScale = (previewMode?: PresentationPreviewMode): number =>
    previewMode ? PREVIEW_TIMING_SCALE[previewMode] : 1;

export const getPresentationDurationMs = (
    durationMs: number,
    previewMode?: PresentationPreviewMode
): number => Math.round(durationMs * getPresentationTimingScale(previewMode));

export const getPresentationDurationSeconds = (
    durationSeconds: number,
    previewMode?: PresentationPreviewMode
): number => durationSeconds * getPresentationTimingScale(previewMode);
