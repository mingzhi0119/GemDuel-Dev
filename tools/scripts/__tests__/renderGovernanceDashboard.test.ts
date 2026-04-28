// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { buildGovernanceDashboardHtml } from '../governanceDashboardHtml.js';

describe('governance dashboard HTML', () => {
    it('builds HTML without throwing and embeds key sections', () => {
        const html = buildGovernanceDashboardHtml({
            generatedAt: '2026-04-27T12:00:00.000Z',
            artifactsLabel: 'artifacts/governance',
            dashboard: {
                status: 'passed',
                completeness: 'complete',
                metrics: [
                    {
                        id: 'coverage-branch',
                        title: 'Branch Coverage',
                        status: 'passed',
                        value: '90% / minimum 88%',
                        evidenceRefs: ['apps/desktop/coverage/coverage-final.json'],
                    },
                ],
            },
            certification: {
                status: 'passed',
                localScore: { score: 10, maxScore: 10 },
                scorecard: [
                    {
                        id: 'dimension-1',
                        title: 'Example',
                        score: 10,
                        status: 'passed',
                        failures: [],
                    },
                ],
                errors: [],
            },
            auditGate: { status: 'passed', errors: [] },
            lifecycle: { status: 'passed', issues: [] },
            bundleBudget: {
                status: 'healthy',
                budget: { observed: 200 },
                generatedAt: '2026-04-27T12:00:00.000Z',
            },
            benchmarks: {
                status: 'passed',
                benchmarks: [{ id: 'reducer-init', medianMs: 1, p95Ms: 2 }],
            },
            perFileCoverage: {
                status: 'passed',
                violations: [],
            },
            manifest: {
                batch: { commitSha: 'abc', gitRef: 'refs/heads/main' },
                artifactPolicy: { retentionDays: 30 },
            },
        });

        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('Lifecycle metrics');
        expect(html).toContain('Branch Coverage');
        expect(html).toContain('Certification scorecard');
        expect(html).toContain('30 days');
    });
});
