// @vitest-environment node

import { describe, expect, it } from 'vitest';
import {
    REQUIRED_OVERRIDE_POLICY,
    collectDependencyGovernanceErrors,
    formatAuditSummary,
    parseRuntimeEnvNames,
} from '../dependencyGovernance.js';

describe('dependency governance', () => {
    it('extracts governed env names from the main process', () => {
        expect(
            parseRuntimeEnvNames(`
                const a = process.env.GEMDUEL_DISABLE_UPDATES;
                const b = process.env.GEMDUEL_LOG_LEVEL;
                const c = process.env.UNRELATED;
                const d = process.env.GEMDUEL_LOG_LEVEL;
            `)
        ).toEqual(['GEMDUEL_DISABLE_UPDATES', 'GEMDUEL_LOG_LEVEL', 'UNRELATED']);
    });

    it('reports missing overrides, missing policy coverage, and live audit findings', () => {
        const errors = collectDependencyGovernanceErrors({
            packageJson: { overrides: {} },
            runtimeConfigPolicy: {
                GEMDUEL_DISABLE_UPDATES: {
                    owner: 'Desktop Platform',
                    defaultValue: 'false',
                    validation: 'Boolean string.',
                    secretHandling: 'No secrets.',
                    failureMode: 'Fallback to false.',
                },
            },
            runtimeEnvNames: ['GEMDUEL_DISABLE_UPDATES', 'GEMDUEL_LOG_LEVEL'],
            governanceDocumentText: 'GEMDUEL_DISABLE_UPDATES only',
            auditReport: {
                vulnerabilities: {
                    qs: { severity: 'low' },
                },
                metadata: {
                    vulnerabilities: {
                        total: 1,
                        info: 0,
                        low: 1,
                        moderate: 0,
                        high: 0,
                        critical: 0,
                    },
                },
            },
        });

        expect(errors).toContain(
            `Missing override path-to-regexp@${REQUIRED_OVERRIDE_POLICY['path-to-regexp']}.`
        );
        expect(errors).toContain(
            'Runtime env GEMDUEL_LOG_LEVEL is used in electron/main.js but missing from RUNTIME_CONFIG_POLICY.'
        );
        expect(errors).toContain(
            'Runtime env GEMDUEL_LOG_LEVEL is missing from DEPENDENCY_RUNTIME_GOVERNANCE.md.'
        );
        expect(errors).toContain('Production audit still reports low severity for qs.');
    });

    it('summarizes audit counts in a stable format', () => {
        expect(
            formatAuditSummary({
                metadata: {
                    vulnerabilities: {
                        info: 0,
                        low: 1,
                        moderate: 2,
                        high: 3,
                        critical: 4,
                    },
                },
            })
        ).toBe('info=0, low=1, moderate=2, high=3, critical=4');
    });
});
