// @vitest-environment node

import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    SEAL_COVERAGE_EXCLUSIONS,
    SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
} from '../../vitest.seal.exclusions';
import { collectSealCoverageExclusionGovernanceErrors } from '../sealExclusionGovernance.js';

const repoRoot = process.cwd();
const sampleShellExclusion = SEAL_COVERAGE_EXCLUSIONS.find(({ category }) => category === 'shell');
const sampleLeafExclusion = SEAL_COVERAGE_EXCLUSIONS.find(({ category }) => category === 'leaf');

describe('seal exclusion governance', () => {
    it('accepts the reviewed repo exclusions at the current baseline', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: SEAL_COVERAGE_EXCLUSIONS,
            policy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
            repoRoot,
            today: '2026-04-21',
        });

        expect(errors).toEqual([]);
    });

    it('rejects exclusions that grow beyond the reviewed baseline', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: [
                ...SEAL_COVERAGE_EXCLUSIONS,
                {
                    ...sampleLeafExclusion!,
                    pattern: 'src/components/Unexpected.tsx',
                },
            ],
            policy: SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
            repoRoot,
            today: '2026-04-21',
        });

        expect(errors).toContain(
            'Seal coverage exclusions grew beyond the reviewed baseline (74 > 73).'
        );
    });

    it('rejects missing review metadata and overdue review dates', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: [
                {
                    ...sampleLeafExclusion!,
                    pattern: 'src/components/MissingReview.tsx',
                    lastReviewedOn: '',
                },
                {
                    ...sampleLeafExclusion!,
                    pattern: 'src/components/StaleReview.tsx',
                    lastReviewedOn: '2026-03-01',
                },
            ],
            policy: {
                ...SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
                baselineCount: 100,
            },
            repoRoot,
            today: '2026-04-21',
        });

        expect(errors).toContain(
            'Seal coverage exclusion src/components/MissingReview.tsx must define lastReviewedOn in YYYY-MM-DD format.'
        );
        expect(errors).toContain(
            'Seal coverage exclusion src/components/StaleReview.tsx is overdue for review (51 > 30 days).'
        );
    });

    it('requires shell exclusions to carry a valid ADR path and forbids ADRs on non-shell entries', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: [
                {
                    ...sampleShellExclusion!,
                    pattern: 'src/app/shell/MissingAdr.tsx',
                    adrPath: '',
                },
                {
                    ...sampleLeafExclusion!,
                    pattern: 'src/components/LeafWithAdr.tsx',
                    adrPath: path.posix.join(
                        'docs',
                        'adr',
                        '0008-seal-coverage-exclusion-governance.md'
                    ),
                },
                {
                    ...sampleShellExclusion!,
                    pattern: 'src/app/shell/BadAdr.tsx',
                    adrPath: 'docs/adr/missing-shell-adr.md',
                },
            ],
            policy: {
                ...SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
                baselineCount: 100,
            },
            repoRoot,
            today: '2026-04-21',
        });

        expect(errors).toContain(
            'Seal coverage shell exclusion src/app/shell/MissingAdr.tsx must define an ADR path.'
        );
        expect(errors).toContain(
            'Seal coverage exclusion src/components/LeafWithAdr.tsx must not define adrPath outside the shell category.'
        );
        expect(errors).toContain(
            'Seal coverage shell exclusion src/app/shell/BadAdr.tsx references missing ADR docs/adr/missing-shell-adr.md.'
        );
    });

    it('rejects invalid categories and review cadences beyond the 30 day policy', () => {
        const errors = collectSealCoverageExclusionGovernanceErrors({
            exclusions: [
                {
                    ...sampleLeafExclusion!,
                    pattern: 'src/components/BadCategory.tsx',
                    category: 'unknown',
                },
                {
                    ...sampleLeafExclusion!,
                    pattern: 'src/components/SlowReview.tsx',
                    reviewCadenceDays: 45,
                },
            ],
            policy: {
                ...SEAL_COVERAGE_EXCLUSION_GOVERNANCE_POLICY,
                baselineCount: 100,
            },
            repoRoot,
            today: '2026-04-21',
        });

        expect(errors).toContain(
            'Seal coverage exclusion src/components/BadCategory.tsx uses invalid category unknown.'
        );
        expect(errors).toContain(
            'Seal coverage exclusion src/components/SlowReview.tsx exceeds the maximum review cadence (45 > 30).'
        );
    });
});
