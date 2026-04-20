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
                'src/logic/fsmPolicy.ts',
                'src/logic/gameReducer.ts',
                'src/logic/hostApproval.ts',
                'src/logic/networkDispatchPolicy.ts',
                'src/logic/networkChecksums.ts',
                'src/logic/networkProtocol.ts',
                'src/logic/networkRecovery.ts',
                'src/logic/replayImport.ts',
                'src/logic/runtimeSchemas.ts',
                'src/logic/validators.ts',
                'src/app/io/safeReplayImport.ts',
                'src/hooks/useConnectionHealth.ts',
                'src/hooks/useGameNetwork.ts',
                'src/hooks/useOnlineManager.ts',
                'src/logic/actions/boardActions.ts',
                'src/logic/actions/marketActions.ts',
                'electron/desktopGovernance.js',
                'electron/releaseHealth.js',
                'electron/runtimeConfig.js',
                'electron/runtimeHarness.js',
                'electron/preloadContract.cjs',
                'scripts/buildBudgetReport.js',
                'scripts/releaseHealthChecklist.js',
                'scripts/releaseHealthOperations.js',
                'scripts/releaseHealthReport.js',
                'scripts/runtimeDrillGovernance.js',
                'scripts/dependencyGovernance.js',
                'shared/runtimeIcePolicy.js',
            ],
            exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/__tests__/**', '**/tests/**'],
            thresholds: {
                statements: 85,
                lines: 85,
                functions: 90,
                branches: 80,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
