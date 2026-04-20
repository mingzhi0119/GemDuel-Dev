import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const normalizeModuleId = (id: string) => id.replace(/\\/g, '/');
const matchesAny = (id: string, tokens: string[]) => tokens.some((token) => id.includes(token));

const runtimeCoreTokens = [
    '/src/config/webrtc.ts',
    '/src/data/realCards.ts',
    '/src/hooks/useGameNetwork.ts',
    '/src/hooks/useOnlineManager.ts',
    '/src/hooks/gameNetwork/',
    '/src/hooks/onlineManager/',
    '/src/logic/actions/',
    '/src/logic/gameReducer.ts',
    '/src/logic/turnManager.ts',
    '/src/logic/selectors.ts',
    '/src/logic/stateHelpers.ts',
    '/src/logic/network',
    '/src/utils.ts',
];

export const resolveManualChunk = (id: string) => {
    const normalizedId = normalizeModuleId(id);

    if (normalizedId.includes('/node_modules/')) {
        if (matchesAny(normalizedId, ['/react/', '/react-dom/', '/scheduler/'])) {
            return 'react-vendor';
        }

        if (matchesAny(normalizedId, ['/framer-motion/'])) {
            return 'motion-vendor';
        }

        if (matchesAny(normalizedId, ['/peerjs/', '/peer/'])) {
            return 'network-vendor';
        }

        if (matchesAny(normalizedId, ['/lucide-react/', '/canvas-confetti/'])) {
            return 'ui-vendor';
        }
    }

    // Keep multiplayer/runtime logic in one chunk so Rollup does not split a live
    // circular dependency into separate files that can trip TDZ initialization.
    if (matchesAny(normalizedId, runtimeCoreTokens)) {
        return 'runtime-core';
    }

    return undefined;
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: resolveManualChunk,
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
});
