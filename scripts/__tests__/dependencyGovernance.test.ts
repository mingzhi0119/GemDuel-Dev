// @vitest-environment node

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
    buildDependencySbomSnapshot,
    collectGovernanceDocumentErrors,
    REQUIRED_OVERRIDE_POLICY,
    RETIRED_DEPENDENCY_WORKAROUNDS,
    collectDependencyGovernanceErrors,
    collectLicenseAllowlistErrors,
    formatAuditSummary,
    parseRuntimeEnvNames,
    collectRuntimeEnvNamesFromRepo,
    collectRuntimeEnvNamesFromEntries,
    collectSbomSnapshotErrors,
    collectTextFileEntries,
} from '../dependencyGovernance.js';
import {
    collectSecretScanErrorsFromEntries,
    collectSecretScanErrorsFromRepo,
} from '../dependencySecretGovernance.js';
import { GOVERNANCE_DOC_PATHS } from '../governanceDocPaths.js';

const dependencyRuntimeGovernanceText = readFileSync(
    path.join(process.cwd(), GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance),
    'utf8'
);

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

    it('returns clean dependency governance errors when the audit is clean', () => {
        expect(
            collectDependencyGovernanceErrors({
                packageJson: {
                    overrides: REQUIRED_OVERRIDE_POLICY,
                },
                runtimeConfigPolicy: {},
                runtimeEnvNames: [],
                governanceDocumentText: dependencyRuntimeGovernanceText,
                auditReport: {
                    metadata: {
                        vulnerabilities: {
                            total: 0,
                        },
                    },
                },
            })
        ).toEqual([]);
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
            'Governed env GEMDUEL_LOG_LEVEL is used in governed source files but missing from RUNTIME_CONFIG_POLICY.'
        );
        expect(errors).toContain(
            `Governed env GEMDUEL_LOG_LEVEL is missing from ${GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance}.`
        );
        expect(errors).toContain('Production audit still reports low severity for qs.');
    });

    it('reports nested override policy drift when a nested override is missing', () => {
        const errors = collectDependencyGovernanceErrors({
            packageJson: {
                overrides: {
                    ...REQUIRED_OVERRIDE_POLICY,
                    anymatch: {},
                },
            },
            runtimeConfigPolicy: {},
            runtimeEnvNames: [],
            governanceDocumentText: dependencyRuntimeGovernanceText,
            auditReport: {
                metadata: {
                    vulnerabilities: {
                        total: 0,
                    },
                },
            },
        });

        expect(errors).toContain('Missing override anymatch -> picomatch@2.3.2.');
    });

    it('requires CI provenance env names to be documented and governed when scripts use them', () => {
        const errors = collectDependencyGovernanceErrors({
            packageJson: { overrides: REQUIRED_OVERRIDE_POLICY },
            runtimeConfigPolicy: {
                GITHUB_SHA: {
                    owner: 'Release Engineering',
                    defaultValue: 'unset',
                    validation: 'CI metadata.',
                    secretHandling: 'CI metadata only.',
                    failureMode: 'Falls back to null.',
                },
            },
            runtimeEnvNames: ['GITHUB_SHA', 'GITHUB_DEFAULT_BRANCH'],
            governanceDocumentText: 'GITHUB_SHA only',
            auditReport: {
                metadata: {
                    vulnerabilities: {
                        total: 0,
                    },
                },
            },
        });

        expect(errors).toContain(
            'Governed env GITHUB_DEFAULT_BRANCH is used in governed source files but missing from RUNTIME_CONFIG_POLICY.'
        );
        expect(errors).toContain(
            `Governed env GITHUB_DEFAULT_BRANCH is missing from ${GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance}.`
        );
    });

    it('flags an empty license allowlist before building the snapshot', () => {
        expect(
            collectLicenseAllowlistErrors({
                packageJson: { name: 'gem-duel', version: '1.0.0' },
                packageLock: {
                    packages: {
                        '': { version: '1.0.0' },
                        'node_modules/foo': { version: '2.0.0', license: 'MIT' },
                    },
                },
                allowedLicenses: [],
            })
        ).toEqual(['License allowlist is empty.']);
    });

    it('requires an expected SBOM snapshot to compare against', () => {
        expect(
            collectSbomSnapshotErrors({
                packageJson: { name: 'gem-duel', version: '1.0.0' },
                packageLock: {
                    packages: {
                        '': { version: '1.0.0' },
                        'node_modules/foo': { version: '2.0.0', license: 'MIT' },
                    },
                },
                expectedSnapshot: null,
            })
        ).toEqual(['Missing dependency SBOM snapshot.']);
    });

    it('fails when a retired dependency workaround is reintroduced', () => {
        const repoRoot = mkdtempSync(path.join(os.tmpdir(), 'dependency-workaround-'));
        try {
            mkdirSync(path.join(repoRoot, 'scripts'), { recursive: true });
            writeFileSync(
                path.join(repoRoot, 'scripts', 'patch-peer.js'),
                'console.log("legacy");'
            );

            const errors = collectDependencyGovernanceErrors({
                packageJson: {
                    overrides: REQUIRED_OVERRIDE_POLICY,
                    scripts: {
                        postinstall: 'node scripts/patch-peer.js',
                    },
                },
                runtimeConfigPolicy: {},
                runtimeEnvNames: [],
                governanceDocumentText:
                    '`scripts/patch-peer.js` is still a governed workaround because packaging needs it.',
                auditReport: {
                    metadata: {
                        vulnerabilities: {
                            total: 0,
                        },
                    },
                },
                repoRoot,
            });

            expect(errors).toContain(
                `Package script postinstall must not reference retired workaround ${RETIRED_DEPENDENCY_WORKAROUNDS[0]}.`
            );
            expect(errors).toContain(
                `Retired dependency workaround ${RETIRED_DEPENDENCY_WORKAROUNDS[0]} must not exist in the repo.`
            );
            expect(errors).toContain(
                `${GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance} must not describe ${RETIRED_DEPENDENCY_WORKAROUNDS[0]} as an active workaround.`
            );
        } finally {
            rmSync(repoRoot, { recursive: true, force: true });
        }
    });

    it('includes test files when explicitly requested', () => {
        const repoRoot = mkdtempSync(path.join(os.tmpdir(), 'dependency-text-files-'));
        try {
            mkdirSync(path.join(repoRoot, 'src', '__tests__'), { recursive: true });
            writeFileSync(
                path.join(repoRoot, 'src', 'main.ts'),
                'const env = process.env.GEMDUEL_ALPHA;'
            );
            writeFileSync(
                path.join(repoRoot, 'src', '__tests__', 'kept.ts'),
                'const env = process.env.GEMDUEL_BETA;'
            );
            writeFileSync(
                path.join(repoRoot, 'src', 'ignored.test.ts'),
                'const env = process.env.GEMDUEL_IGNORED;'
            );

            expect(
                collectTextFileEntries(repoRoot, { includeTests: true }).map(
                    ({ relativePath }) => relativePath
                )
            ).toEqual(['src/__tests__/kept.ts', 'src/main.ts']);
        } finally {
            rmSync(repoRoot, { recursive: true, force: true });
        }
    });

    it('builds a deterministic SBOM snapshot and detects drift', () => {
        const packageJson = { name: 'gem-duel', version: '1.0.0' };
        const packageLock = {
            packages: {
                '': { version: '1.0.0' },
                'node_modules/foo': { version: '2.0.0', license: 'MIT' },
                'node_modules/bar': { version: '3.0.0', license: 'Apache-2.0', dev: true },
            },
        };
        const snapshot = buildDependencySbomSnapshot(packageJson, packageLock);

        expect(snapshot).toMatchObject({
            schemaVersion: 1,
            packageManager: 'npm',
            root: { name: 'gem-duel', version: '1.0.0' },
            componentCount: 3,
            licenseInventory: { MIT: 1, 'Apache-2.0': 1 },
        });
        expect(
            collectSbomSnapshotErrors({
                packageJson,
                packageLock,
                expectedSnapshot: snapshot,
            })
        ).toEqual([]);
        expect(
            collectSbomSnapshotErrors({
                packageJson,
                packageLock,
                expectedSnapshot: { ...snapshot, componentCount: 4 },
            })
        ).toEqual(['Dependency SBOM snapshot drifted from package-lock.json.']);
    });

    it('enforces the license allowlist and flags missing package licenses', () => {
        const errors = collectLicenseAllowlistErrors({
            packageJson: { name: 'gem-duel', version: '1.0.0' },
            packageLock: {
                packages: {
                    '': { version: '1.0.0' },
                    'node_modules/foo': { version: '2.0.0', license: 'MIT' },
                    'node_modules/bar': { version: '3.0.0', license: 'Apache-2.0' },
                    'node_modules/baz': { version: '4.0.0' },
                },
            },
            allowedLicenses: ['MIT'],
        });

        expect(errors).toContain(
            'Package bar@3.0.0 at node_modules/bar uses disallowed license Apache-2.0.'
        );
        expect(errors).toContain(
            'Package baz@4.0.0 at node_modules/baz is missing a license declaration.'
        );
    });

    it('collects runtime env names from source entries and ignores test files', () => {
        const names = collectRuntimeEnvNamesFromEntries([
            {
                relativePath: 'electron/main.js',
                text: 'const a = process.env.GEMDUEL_ALPHA; const b = process.env.GEMDUEL_BETA;',
            },
            {
                relativePath: 'src/__tests__/sample.test.ts',
                text: 'const ignored = process.env.GEMDUEL_IGNORED;',
            },
        ]);

        expect(names).toEqual(['GEMDUEL_ALPHA', 'GEMDUEL_BETA', 'GEMDUEL_IGNORED']);
    });

    it('flags high-confidence secret literals while allowing placeholder values', () => {
        const errors = collectSecretScanErrorsFromEntries([
            {
                relativePath: 'docs/example.md',
                text: [
                    'credential: "ghp_0123456789abcdefghijklmnopqrstuv"',
                    'password: "placeholder"',
                    'const url = "https://user:supersecret@example.com"',
                ].join('\n'),
            },
        ]);

        expect(errors).toContain(
            'docs/example.md:1 assigns a credential-like value to credential.'
        );
        expect(errors).toContain(
            'docs/example.md:3 contains a high-confidence secret-like literal.'
        );
        expect(errors).not.toContainEqual(expect.stringContaining('placeholder'));
    });

    it('requires the governance document to mention the new dependency policy sections', () => {
        expect(collectGovernanceDocumentErrors('## License Allowlist Policy')).toContain(
            `${GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance} is missing ## SBOM Policy.`
        );
    });

    it('scans source files in a repo and skips test fixtures', () => {
        const repoRoot = mkdtempSync(path.join(os.tmpdir(), 'dependency-governance-'));
        try {
            mkdirSync(path.join(repoRoot, 'src', '__tests__'), { recursive: true });
            writeFileSync(
                path.join(repoRoot, 'src', 'main.js'),
                [
                    'const envName = process.env.GEMDUEL_PHASE4_SAMPLE;',
                    'const token = "ghp_0123456789abcdefghijklmnopqrstuv";',
                ].join('\n')
            );
            writeFileSync(
                path.join(repoRoot, 'src', '__tests__', 'ignored.test.ts'),
                'const ignored = process.env.GEMDUEL_IGNORED;'
            );
            writeFileSync(
                path.join(repoRoot, 'workflow.yml'),
                'token: ${{ secrets.GITHUB_TOKEN }}'
            );

            expect(
                collectTextFileEntries(repoRoot, { includeTests: false }).map(
                    ({ relativePath }) => relativePath
                )
            ).toEqual(['src/main.js', 'workflow.yml']);
            expect(collectRuntimeEnvNamesFromRepo(repoRoot)).toEqual(['GEMDUEL_PHASE4_SAMPLE']);
            expect(collectSecretScanErrorsFromRepo(repoRoot)).toEqual([
                'src/main.js:2 contains a high-confidence secret-like literal.',
                'src/main.js:2 assigns a credential-like value to token.',
            ]);
            expect(
                collectSecretScanErrorsFromEntries([
                    {
                        relativePath: 'workflow.yml',
                        text: 'token: ${{ secrets.GITHUB_TOKEN }}',
                    },
                ])
            ).toEqual([]);
        } finally {
            rmSync(repoRoot, { recursive: true, force: true });
        }
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
