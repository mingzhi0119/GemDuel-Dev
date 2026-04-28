import { DESKTOP_SEAL_COVERAGE } from './desktop.js';

/**
 * Key desktop modules: minimum **line** coverage % (Istanbul / v8 `coverage-final.json`).
 * Used by `check-coverage-perfile-key-modules.mjs` and `vitest.seal.config.ts` (future hard gate).
 *
 * Paths are normalized to repo-relative forward slashes (e.g. `apps/desktop/src/...`).
 */
export const PER_FILE_KEY_MODULE_RULES = [
    {
        id: 'hooks-online-manager',
        minLines: 95,
        match: (relPath) =>
            relPath.startsWith('apps/desktop/src/hooks/onlineManager/') && isTrackedSource(relPath),
    },
    {
        id: 'hooks-game-network',
        minLines: 89,
        match: (relPath) =>
            relPath.startsWith('apps/desktop/src/hooks/gameNetwork/') && isTrackedSource(relPath),
    },
    {
        id: 'app-io',
        minLines: 91,
        match: (relPath) =>
            relPath.startsWith('apps/desktop/src/app/io/') && isTrackedSource(relPath),
    },
    {
        id: 'observability',
        minLines: 100,
        match: (relPath) =>
            relPath.startsWith('apps/desktop/src/observability/') && isTrackedSource(relPath),
    },
    {
        id: 'presentation-events',
        minLines: 94,
        match: (relPath) => {
            if (!relPath.startsWith('apps/desktop/src/app/presentation/')) {
                return false;
            }
            if (!isTrackedSource(relPath)) {
                return false;
            }
            const base = relPath.split('/').pop() ?? '';
            return /presentation.*Events\.(ts|tsx)$/.test(base);
        },
    },
];

const SOURCE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs)$/;

const isTrackedSource = (relPath) => {
    const n = relPath.replace(/\\/g, '/');
    if (!SOURCE_EXT.test(n) || n.endsWith('.d.ts')) {
        return false;
    }
    if (n.includes('/__tests__/') || n.includes('/tests/')) {
        return false;
    }
    return true;
};

const thresholdBlock = (minLines) => ({
    lines: minLines,
    statements: minLines,
    functions: minLines,
    branches: minLines,
});

/**
 * Vitest `coverage.thresholds` for `apps/desktop` (paths relative to that package root).
 * Merge into `defineConfig({ test: { coverage: { thresholds: ... } } })`.
 */
export const buildVitestSealCoverageThresholds = () => {
    const base = DESKTOP_SEAL_COVERAGE.thresholds;
    return {
        ...base,
        perFile: true,
        'src/hooks/onlineManager/**': thresholdBlock(95),
        'src/hooks/gameNetwork/**': thresholdBlock(89),
        'src/app/io/**': thresholdBlock(91),
        'src/observability/**': thresholdBlock(100),
        'src/app/presentation/**/*presentation*Events.ts': thresholdBlock(94),
        'src/app/presentation/**/*presentation*Events.tsx': thresholdBlock(94),
    };
};
