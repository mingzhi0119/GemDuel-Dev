/// <reference types="vite/client" />

declare global {
    /** Set by Vite `define` in `vite.config.ts` (dev or `GEMDUEL_ALLOW_VISUAL_LAB` build). */
    const __GEMDUEL_INCLUDE_VISUAL_LAB_BUNDLE__: boolean;

    interface Window {
        /** Injected by `electron/preload.js`; governs `?visualLab=` outside Vite dev. */
        __GEMDUEL_RUNTIME_CONFIG__?: {
            allowVisualLab?: boolean;
        };
    }
}

export {};
