import { execSync } from 'node:child_process';
import {
    DEPENDENCY_SBOM_SNAPSHOT_OPTIONS,
    collectGovernanceDocumentErrors,
    collectLicenseAllowlistErrors,
    collectRuntimeEnvNamesFromEntries,
    collectRuntimePolicyErrors,
    collectSbomSnapshotErrors,
    collectTextFileEntries,
} from './dependencyGovernance.js';
import { collectSecretScanErrorsFromEntries } from './dependencySecretGovernance.js';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';
import { RUNTIME_CONFIG_POLICY } from '@gemduel/shared/runtimeConfigPolicy.js';

const buildGate = ({ id, title, errors, evidenceRefs }) => ({
    id,
    title,
    status: errors.length === 0 ? 'passed' : 'failed',
    errors,
    evidenceRefs,
});

export const readPnpmLicenseReport = (repoRoot) =>
    JSON.parse(
        execSync('pnpm licenses list --json', {
            cwd: repoRoot,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true,
        })
    );

export const buildDependencyGateSummary = ({
    packageJson,
    licenseReport,
    dependencySbomSnapshot,
    licenseAllowlist,
    textEntries,
    runtimeConfigPolicy = RUNTIME_CONFIG_POLICY,
    governanceDocumentText,
    repoRoot,
}) => {
    const runtimeEnvNames = collectRuntimeEnvNamesFromEntries(textEntries);
    const licenseErrors = collectLicenseAllowlistErrors({
        packageJson,
        licenseReport,
        allowedLicenses: licenseAllowlist?.allowedLicenses,
        repoRoot,
    });
    const sbomErrors = collectSbomSnapshotErrors({
        packageJson,
        licenseReport,
        expectedSnapshot: dependencySbomSnapshot,
        repoRoot,
        snapshotOptions: DEPENDENCY_SBOM_SNAPSHOT_OPTIONS,
    });
    const secretAndRuntimeErrors = [
        ...collectSecretScanErrorsFromEntries(textEntries),
        ...collectRuntimePolicyErrors({
            runtimeConfigPolicy,
            runtimeEnvNames,
            governanceDocumentText,
        }),
        ...collectGovernanceDocumentErrors(governanceDocumentText),
    ];

    const gates = [
        buildGate({
            id: 'licenses',
            title: 'License allowlist gate',
            errors: licenseErrors,
            evidenceRefs: ['tools/governance/dependency-license-allowlist.json'],
        }),
        buildGate({
            id: 'sbom',
            title: 'Dependency SBOM drift gate',
            errors: sbomErrors,
            evidenceRefs: ['tools/governance/dependency-sbom.snapshot.json'],
        }),
        buildGate({
            id: 'secrets-runtime',
            title: 'Secret and runtime env drift gate',
            errors: secretAndRuntimeErrors,
            evidenceRefs: [GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance],
        }),
    ];

    return {
        schemaVersion: 1,
        status: gates.every((gate) => gate.status === 'passed') ? 'passed' : 'failed',
        gates,
        summary: {
            componentCount: dependencySbomSnapshot?.componentCount ?? null,
            allowedLicenseCount: licenseAllowlist?.allowedLicenses?.length ?? null,
            scannedTextFiles: textEntries.length,
            governedEnvNames: runtimeEnvNames.length,
        },
    };
};

export const buildDependencyGateSummaryFromRepo = ({
    repoRoot,
    packageJson,
    dependencySbomSnapshot,
    licenseAllowlist,
    governanceDocumentText,
}) =>
    buildDependencyGateSummary({
        packageJson,
        licenseReport: readPnpmLicenseReport(repoRoot),
        dependencySbomSnapshot,
        licenseAllowlist,
        textEntries: collectTextFileEntries(repoRoot, { includeTests: false }),
        governanceDocumentText,
        repoRoot,
    });
