import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createDesktopVitestSettings } from '@gemduel/config-vitest/desktop';

export default defineConfig({
    define: {
        __GEMDUEL_INCLUDE_VISUAL_LAB_BUNDLE__: true,
    },
    plugins: [react()],
    test: createDesktopVitestSettings(),
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, './src'),
            '@gemduel/shared': path.resolve(__dirname, '../../packages/shared/src'),
            '@gemduel/ui': path.resolve(__dirname, '../../packages/ui/src'),
            '@gemduel/turn-service': path.resolve(__dirname, '../../packages/turn-service/src'),
        },
    },
});
