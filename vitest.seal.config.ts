import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { SEAL_COVERAGE_EXCLUDE_PATTERNS } from './vitest.seal.exclusions';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            all: true,
            include: ['src/**', 'electron/**', 'scripts/**', 'shared/**'],
            exclude: [
                'node_modules/',
                'dist/',
                'coverage/',
                'artifacts/',
                '**/*.d.ts',
                '**/__tests__/**',
                '**/tests/**',
                ...SEAL_COVERAGE_EXCLUDE_PATTERNS,
            ],
            thresholds: {
                statements: 92,
                lines: 92,
                functions: 95,
                branches: 88,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
