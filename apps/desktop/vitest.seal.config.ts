/**
 * Seal Vitest config with **per-file** coverage thresholds for key modules (P2-2).
 * Not wired to default `pnpm test:coverage` yet (soft gate uses
 * `pnpm run coverage:perfile-modules` after the standard seal run).
 *
 * **Hard gate (planned ~30d after P2-2):** point desktop `test:coverage` at this file, e.g.
 * `vitest --coverage --config vitest.seal.config.ts`
 */
import { defineConfig, mergeConfig } from 'vitest/config';
import { buildVitestSealCoverageThresholds } from '@gemduel/config-vitest/per-file-key-modules';
import baseConfig from './vitest.config';

export default mergeConfig(
    baseConfig,
    defineConfig({
        test: {
            coverage: {
                thresholds: buildVitestSealCoverageThresholds(),
            },
        },
    })
);
