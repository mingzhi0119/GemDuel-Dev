import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const normalizeModuleId = (id: string) => id.replace(/\\/g, '/');
const matchesAny = (id: string, tokens: string[]) => tokens.some((token) => id.includes(token));

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
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

                    if (
                        matchesAny(normalizedId, [
                            '/src/config/webrtc.ts',
                            '/src/hooks/useGameNetwork.ts',
                            '/src/hooks/useOnlineManager.ts',
                            '/src/hooks/gameNetwork/',
                            '/src/hooks/onlineManager/',
                            '/src/logic/network',
                        ])
                    ) {
                        return 'network-core';
                    }

                    if (
                        matchesAny(normalizedId, [
                            '/src/data/realCards.ts',
                            '/src/utils.ts',
                            '/src/logic/actions/',
                            '/src/logic/gameReducer.ts',
                            '/src/logic/turnManager.ts',
                            '/src/logic/selectors.ts',
                            '/src/logic/stateHelpers.ts',
                        ])
                    ) {
                        return 'game-core';
                    }

                    return undefined;
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
});
