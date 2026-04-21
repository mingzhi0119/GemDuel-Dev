import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { resolveManualChunk } from '@gemduel/shared/build/viteManualChunks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '../..');

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
            '@app': resolve(__dirname, './src'),
            '@gemduel/shared': resolve(workspaceRoot, './packages/shared/src'),
            '@gemduel/ui': resolve(workspaceRoot, './packages/ui/src'),
            '@gemduel/turn-service': resolve(workspaceRoot, './packages/turn-service/src'),
        },
    },
});
