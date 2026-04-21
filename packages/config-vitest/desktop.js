import { configDefaults } from 'vitest/config';
import {
    SEAL_COVERAGE_EXCLUSIONS,
    SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
} from './sealExclusions.js';

export const DESKTOP_TEST_INCLUDE = [
    'src/**/*.{test,spec}.{ts,tsx,js,jsx}',
    'electron/**/*.{test,spec}.{ts,tsx,js,jsx,cjs,mjs}',
    '../../packages/shared/src/**/*.{test,spec}.{ts,tsx,js,jsx}',
    '../../packages/ui/src/**/*.{test,spec}.{ts,tsx,js,jsx}',
    '../../packages/turn-service/src/**/*.{test,spec}.{ts,tsx,js,jsx,cjs,mjs}',
    '../../tools/scripts/__tests__/**/*.{test,spec}.{ts,tsx,js,jsx,cjs,mjs}',
];

export const DESKTOP_SEAL_COVERAGE = {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    all: true,
    include: [
        'src/**',
        'electron/**',
        '../../packages/shared/src/**',
        '../../packages/ui/src/**',
        '../../packages/turn-service/src/**',
        '../../tools/scripts/**',
    ],
    exclude: [
        'node_modules/',
        'dist/',
        'dist_electron/',
        'coverage/',
        'artifacts/',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/tests/**',
        ...SEAL_COVERAGE_EXCLUSIONS.map((entry) => entry.pattern),
    ],
    thresholds: {
        statements: 92,
        lines: 92,
        functions: 95,
        branches: 88,
    },
};

export const createDesktopVitestSettings = () => ({
    globals: true,
    environment: 'happy-dom',
    include: DESKTOP_TEST_INCLUDE,
    exclude: [
        ...configDefaults.exclude,
        '**/node_modules/**',
        '**/.turbo/**',
        '**/.vite/**',
        '**/coverage/**',
        '**/artifacts/**',
    ],
    coverage: DESKTOP_SEAL_COVERAGE,
});

export { SEAL_COVERAGE_EXCLUSIONS, SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY };
