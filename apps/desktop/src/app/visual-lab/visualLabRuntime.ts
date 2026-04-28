/**
 * Pure gate for whether the renderer may honor `?visualLab=` (dev server, tests,
 * or an explicit desktop preload flag).
 */
export const isVisualLabRuntimeUnlocked = (input: {
    isViteDev: boolean;
    allowVisualLabFromBridge: boolean | undefined;
}): boolean => input.isViteDev || input.allowVisualLabFromBridge === true;
