// @vitest-environment node

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
    SEAL_COVERAGE_EXCLUSIONS,
    SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
} from '@gemduel/config-vitest/seal-exclusions';
import { collectSealCoverageExclusionGovernanceErrors } from '../sealExclusionGovernance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');
const reviewSnapshot = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'tools', 'governance', 'seal-exclusions-review.snapshot.json'),
        'utf8'
    )
);
const sampleShellExclusion = SEAL_COVERAGE_EXCLUSIONS.find(({ category }) => category === 'shell');
const sampleLeafExclusion = SEAL_COVERAGE_EXCLUSIONS.find(({ category }) => category === 'leaf');
const today = new Date('2026-04-21T00:00:00.000Z');

describe('seal exclusion governance', () => {
    it('accepts the reviewed repo exclusions at the current baseline', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: SEAL_COVERAGE_EXCLUSIONS,
            policy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
            reviewSnapshot,
            repoRoot,
            today,
        });

        expect(errors).toEqual([]);
    });

    it('rejects exclusions that grow beyond the reviewed baseline', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: [
                ...SEAL_COVERAGE_EXCLUSIONS,
                {
                    ...sampleLeafExclusion!,
                    pattern: 'packages/ui/src/components/Unexpected.tsx',
                },
            ],
            policy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
            repoRoot,
            today,
        });

        expect(errors).toContain(
            `Seal coverage exclusions grew beyond the reviewed baseline (${SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY.baselineCount + 1} > ${SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY.baselineCount}).`
        );
    });

    it('rejects missing review metadata and overdue review dates', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: [
                {
                    ...sampleLeafExclusion!,
                    pattern: 'packages/ui/src/components/MissingReview.tsx',
                    lastReviewedOn: '',
                },
                {
                    ...sampleLeafExclusion!,
                    pattern: 'packages/ui/src/components/StaleReview.tsx',
                    lastReviewedOn: '2026-03-01',
                },
            ],
            policy: {
                ...SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
                baselineCount: 100,
            },
            repoRoot,
            today,
        });

        expect(errors).toContain(
            'Seal coverage exclusion packages/ui/src/components/MissingReview.tsx must define lastReviewedOn in YYYY-MM-DD format.'
        );
        expect(errors).toContain(
            'Seal coverage exclusion packages/ui/src/components/StaleReview.tsx is overdue for review (51 > 30 days).'
        );
    });

    it('requires shell exclusions to carry a valid ADR path and forbids ADRs on non-shell entries', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: [
                {
                    ...sampleShellExclusion!,
                    pattern: 'apps/desktop/src/app/shell/MissingAdr.tsx',
                    adrPath: '',
                },
                {
                    ...sampleLeafExclusion!,
                    pattern: 'packages/ui/src/components/LeafWithAdr.tsx',
                    adrPath: path.posix.join(
                        'docs',
                        'adr',
                        '0008-seal-coverage-exclusion-governance.md'
                    ),
                },
                {
                    ...sampleShellExclusion!,
                    pattern: 'apps/desktop/src/app/shell/BadAdr.tsx',
                    adrPath: 'docs/adr/missing-shell-adr.md',
                },
            ],
            policy: {
                ...SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
                baselineCount: 100,
            },
            repoRoot,
            today,
        });

        expect(errors).toContain(
            'Seal coverage shell exclusion apps/desktop/src/app/shell/MissingAdr.tsx must define an ADR path.'
        );
        expect(errors).toContain(
            'Seal coverage exclusion packages/ui/src/components/LeafWithAdr.tsx must not define adrPath outside the shell category.'
        );
        expect(errors).toContain(
            'Seal coverage shell exclusion apps/desktop/src/app/shell/BadAdr.tsx references missing ADR docs/adr/missing-shell-adr.md.'
        );
    });

    it('rejects invalid categories and review cadences beyond the 30 day policy', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: [
                {
                    ...sampleLeafExclusion!,
                    pattern: 'packages/ui/src/components/BadCategory.tsx',
                    category: 'unknown',
                },
                {
                    ...sampleLeafExclusion!,
                    pattern: 'packages/ui/src/components/SlowReview.tsx',
                    reviewCadenceDays: 45,
                },
            ],
            policy: {
                ...SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
                baselineCount: 100,
            },
            repoRoot,
            today,
        });

        expect(errors).toContain(
            'Seal coverage exclusion packages/ui/src/components/BadCategory.tsx uses invalid category unknown.'
        );
        expect(errors).toContain(
            'Seal coverage exclusion packages/ui/src/components/SlowReview.tsx exceeds the maximum review cadence (45 > 30).'
        );
    });

    it('requires review snapshot owner roles for every governed category', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: SEAL_COVERAGE_EXCLUSIONS,
            policy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
            reviewSnapshot: {
                ...reviewSnapshot,
                ownerRolesByCategory: {
                    ...reviewSnapshot.ownerRolesByCategory,
                    leaf: '',
                },
            },
            repoRoot,
            today,
        });

        expect(errors).toContain(
            'Seal coverage exclusion review snapshot must define an owner role for category leaf.'
        );
        expect(errors).toContain(
            'Seal coverage exclusion ../../packages/ui/src/components/CardAnatomyPage.tsx has no owner role for category leaf.'
        );
    });
});
