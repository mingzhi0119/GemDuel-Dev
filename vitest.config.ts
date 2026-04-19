import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            all: true,
            include: [
                'src/config/webrtc.ts',
                'src/logic/actionValidation.ts',
                'src/logic/commandGate.ts',
                'src/logic/fsm.ts',
                'src/logic/gameReducer.ts',
                'src/logic/networkChecksums.ts',
                'src/logic/networkProtocol.ts',
                'src/logic/replayImport.ts',
                'src/logic/runtimeSchemas.ts',
                'src/logic/validators.ts',
                'src/logic/actions/boardActions.ts',
                'src/logic/actions/marketActions.ts',
                'electron/desktopGovernance.js',
                'electron/runtimeConfig.js',
                'electron/preloadContract.cjs',
            ],
            exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/__tests__/**', '**/tests/**'],
            thresholds: {
                statements: 70,
                lines: 70,
                functions: 75,
                branches: 60,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
