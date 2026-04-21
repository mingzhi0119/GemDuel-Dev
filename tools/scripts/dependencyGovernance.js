import fs from 'node:fs';
import path from 'node:path';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';

export const REQUIRED_OVERRIDE_POLICY = Object.freeze({
    'path-to-regexp': '0.1.13',
    qs: '6.14.2',
    yaml: '2.8.3',
    anymatch: Object.freeze({ picomatch: '2.3.2' }),
    micromatch: Object.freeze({ picomatch: '2.3.2' }),
    readdirp: Object.freeze({ picomatch: '2.3.2' }),
    tinyglobby: Object.freeze({ picomatch: '4.0.4' }),
});
export const RETIRED_DEPENDENCY_WORKAROUNDS = Object.freeze(['tools/scripts/patch-peer.js']);
const REQUIRED_POLICY_FIELDS = Object.freeze([
    'owner',
    'defaultValue',
    'validation',
    'secretHandling',
    'failureMode',
]);
const GOVERNANCE_TEXT_EXTENSIONS = new Set([
    '.js',
    '.mjs',
    '.cjs',
    '.ts',
    '.tsx',
    '.json',
    '.md',
    '.yml',
    '.yaml',
]);
const GOVERNANCE_SCAN_EXCLUDED_DIRS = new Set([
    '.git',
    '.husky',
    '.vite',
    'archive',
    'coverage',
    'dist',
    'node_modules',
]);
const GOVERNANCE_SCAN_EXCLUDED_FILE_SUFFIXES = [
    '.test.ts',
    '.test.tsx',
    '.test.js',
    '.test.mjs',
    '.spec.ts',
    '.spec.tsx',
    '.spec.js',
    '.spec.mjs',
];
const normalizeRelativePath = (repoRoot, absolutePath) =>
    path.relative(repoRoot, absolutePath).split(path.sep).join('/');
const normalizePathLike = (value) => value.split(path.sep).join('/');

const shouldScanFile = (relativePath, includeTests) => {
    const normalizedPath = normalizePathLike(relativePath);

    if (GOVERNANCE_SCAN_EXCLUDED_FILE_SUFFIXES.some((suffix) => normalizedPath.endsWith(suffix))) {
        return false;
    }

    if (!includeTests && /(^|\/)__tests__\//.test(normalizedPath)) {
        return false;
    }

    const ext = path.extname(normalizedPath).toLowerCase();
    return GOVERNANCE_TEXT_EXTENSIONS.has(ext);
};

const walkTextFiles = (repoRoot, includeTests) => {
    const files = [];
    const stack = [''];

    while (stack.length > 0) {
        const relativeDir = stack.pop();
        const absoluteDir = path.join(repoRoot, relativeDir);
        const dirEntries = fs.readdirSync(absoluteDir, { withFileTypes: true });

        for (const entry of dirEntries) {
            if (entry.isDirectory()) {
                if (!GOVERNANCE_SCAN_EXCLUDED_DIRS.has(entry.name)) {
                    stack.push(path.join(relativeDir, entry.name));
                }
                continue;
            }

            const relativePath = path.join(relativeDir, entry.name);
            if (shouldScanFile(relativePath, includeTests)) {
                files.push(relativePath);
            }
        }
    }

    return files.sort((a, b) => a.localeCompare(b));
};

export const collectTextFileEntries = (repoRoot, { includeTests = false } = {}) =>
    walkTextFiles(repoRoot, includeTests).map((relativePath) => ({
        relativePath: normalizePathLike(relativePath),
        text: fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'),
    }));

export const parseRuntimeEnvNames = (text) => {
    const matches = text.matchAll(/process\.env\.([A-Z][A-Z0-9_]*[A-Z0-9])\b/g);
    return Array.from(new Set(Array.from(matches, (match) => match[1]).filter(Boolean))).sort();
};

export const collectRuntimeEnvNamesFromEntries = (entries) => {
    const names = new Set();

    for (const { text } of entries) {
        for (const envName of parseRuntimeEnvNames(text)) {
            names.add(envName);
        }
    }

    return Array.from(names).sort();
};

export const collectRuntimeEnvNamesFromRepo = (repoRoot) =>
    collectRuntimeEnvNamesFromEntries(collectTextFileEntries(repoRoot, { includeTests: false }));

const collectOverrideErrors = (packageJson) => {
    const overrides = packageJson.overrides ?? packageJson.pnpm?.overrides ?? {};
    const errors = [];

    for (const [key, expectedValue] of Object.entries(REQUIRED_OVERRIDE_POLICY)) {
        const actualValue = overrides[key];

        if (typeof expectedValue === 'string' && actualValue !== expectedValue) {
            errors.push(`Missing override ${key}@${expectedValue}.`);
        }

        if (expectedValue && typeof expectedValue === 'object') {
            for (const [nestedKey, nestedValue] of Object.entries(expectedValue)) {
                const pnpmNestedValue = overrides[`${key}>${nestedKey}`];
                const nestedActualValue =
                    actualValue && typeof actualValue === 'object' ? actualValue[nestedKey] : null;

                if (nestedActualValue !== nestedValue && pnpmNestedValue !== nestedValue) {
                    errors.push(`Missing override ${key} -> ${nestedKey}@${nestedValue}.`);
                }
            }
        }
    }

    return errors;
};

const collectRetiredWorkaroundErrors = ({
    packageJson,
    governanceDocumentText,
    repoRoot = process.cwd(),
}) => {
    const errors = [];
    const scriptEntries = Object.entries(packageJson?.scripts ?? {});

    for (const relativePath of RETIRED_DEPENDENCY_WORKAROUNDS) {
        for (const [scriptName, scriptCommand] of scriptEntries) {
            if (typeof scriptCommand === 'string' && scriptCommand.includes(relativePath)) {
                errors.push(
                    `Package script ${scriptName} must not reference retired workaround ${relativePath}.`
                );
            }
        }

        if (fs.existsSync(path.join(repoRoot, relativePath))) {
            errors.push(
                `Retired dependency workaround ${relativePath} must not exist in the repo.`
            );
        }

        if (governanceDocumentText.includes(`\`${relativePath}\` is still a governed workaround`)) {
            errors.push(
                `${GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance} must not describe ${relativePath} as an active workaround.`
            );
        }
    }

    return errors;
};

export const collectRuntimePolicyErrors = ({
    runtimeConfigPolicy,
    runtimeEnvNames,
    governanceDocumentText,
}) => {
    const errors = [];
    const policyNames = Object.keys(runtimeConfigPolicy).sort();

    for (const envName of runtimeEnvNames) {
        if (!policyNames.includes(envName)) {
            errors.push(
                `Governed env ${envName} is used in governed source files but missing from RUNTIME_CONFIG_POLICY.`
            );
        }

        if (!governanceDocumentText.includes(envName)) {
            errors.push(
                `Governed env ${envName} is missing from ${GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance}.`
            );
        }
    }

    for (const [envName, entry] of Object.entries(runtimeConfigPolicy)) {
        for (const field of REQUIRED_POLICY_FIELDS) {
            if (typeof entry?.[field] !== 'string' || entry[field].trim().length === 0) {
                errors.push(`Governed env policy ${envName} is missing the ${field} field.`);
            }
        }
    }

    return errors;
};

const collectAuditErrors = (auditReport) => {
    const totalVulnerabilities = auditReport?.metadata?.vulnerabilities?.total ?? 0;

    if (totalVulnerabilities === 0) {
        return [];
    }

    const errors = [];
    for (const [name, vulnerability] of Object.entries(auditReport.vulnerabilities ?? {})) {
        errors.push(
            `Production audit still reports ${vulnerability.severity} severity for ${name}.`
        );
    }

    return errors;
};

export const formatAuditSummary = (auditReport) => {
    const counts = auditReport?.metadata?.vulnerabilities ?? {};
    return `info=${counts.info ?? 0}, low=${counts.low ?? 0}, moderate=${counts.moderate ?? 0}, high=${counts.high ?? 0}, critical=${counts.critical ?? 0}`;
};

const getLicenseReportVersion = (versions, index) => {
    if (!Array.isArray(versions) || versions.length === 0) {
        return null;
    }

    return versions[Math.min(index, versions.length - 1)] ?? null;
};

const flattenLicenseReportComponents = (licenseReport, repoRoot) =>
    Object.entries(licenseReport ?? {})
        .flatMap(([licenseName, entries]) => {
            if (!Array.isArray(entries)) {
                return [];
            }

            return entries.flatMap((entry) => {
                const paths = Array.isArray(entry?.paths) ? entry.paths : [];
                if (paths.length === 0) {
                    return [];
                }

                return paths.map((absolutePath, index) => ({
                    path: normalizeRelativePath(repoRoot, absolutePath),
                    name: entry?.name ?? path.basename(String(absolutePath)),
                    version: getLicenseReportVersion(entry?.versions, index),
                    license:
                        typeof entry?.license === 'string' && entry.license.trim().length > 0
                            ? entry.license.trim()
                            : licenseName,
                    dev: false,
                }));
            });
        })
        .sort((a, b) => a.path.localeCompare(b.path));

export const buildDependencySbomSnapshot = (
    packageJson,
    licenseReport,
    repoRoot = process.cwd()
) => {
    const components = flattenLicenseReportComponents(licenseReport, repoRoot);

    const licenseInventory = {};
    for (const component of components) {
        if (!component.license) {
            continue;
        }

        licenseInventory[component.license] = (licenseInventory[component.license] ?? 0) + 1;
    }

    return {
        schemaVersion: 1,
        packageManager: 'pnpm',
        root: {
            name: packageJson.name,
            version: packageJson.version,
        },
        componentCount: components.length,
        licenseInventory,
        components,
    };
};

export const collectLicenseAllowlistErrors = ({
    packageJson,
    licenseReport,
    allowedLicenses,
    repoRoot = process.cwd(),
}) => {
    const errors = [];
    const allowlist = new Set((allowedLicenses ?? []).filter(Boolean));

    if (allowlist.size === 0) {
        errors.push('License allowlist is empty.');
        return errors;
    }

    const snapshot = buildDependencySbomSnapshot(packageJson, licenseReport, repoRoot);
    for (const component of snapshot.components) {
        if (component.path === '') {
            continue;
        }

        if (!component.license) {
            errors.push(
                `Package ${component.name}@${component.version} at ${component.path} is missing a license declaration.`
            );
            continue;
        }

        if (!allowlist.has(component.license)) {
            errors.push(
                `Package ${component.name}@${component.version} at ${component.path} uses disallowed license ${component.license}.`
            );
        }
    }

    return errors;
};

export const collectSbomSnapshotErrors = ({
    packageJson,
    licenseReport,
    expectedSnapshot,
    repoRoot = process.cwd(),
}) => {
    const actualSnapshot = buildDependencySbomSnapshot(packageJson, licenseReport, repoRoot);
    if (!expectedSnapshot || typeof expectedSnapshot !== 'object') {
        return ['Missing dependency SBOM snapshot.'];
    }

    const actualJson = JSON.stringify(actualSnapshot);
    const expectedJson = JSON.stringify(expectedSnapshot);
    if (actualJson === expectedJson) {
        return [];
    }

    return ['Dependency SBOM snapshot drifted from pnpm licenses inventory.'];
};

export const collectGovernanceDocumentErrors = (governanceDocumentText) => {
    const requiredSections = [
        '## License Allowlist Policy',
        '## SBOM Policy',
        '## Secret Scanning and Env Drift Policy',
        '## CI Coverage',
        'tools/governance/dependency-license-allowlist.json',
        'tools/governance/dependency-sbom.snapshot.json',
    ];

    return requiredSections
        .filter((section) => !governanceDocumentText.includes(section))
        .map(
            (section) =>
                `${GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance} is missing ${section}.`
        );
};

export const collectDependencyGovernanceErrors = ({
    packageJson,
    runtimeConfigPolicy,
    runtimeEnvNames,
    governanceDocumentText,
    auditReport,
    repoRoot = process.cwd(),
}) => [
    ...collectOverrideErrors(packageJson),
    ...collectRetiredWorkaroundErrors({
        packageJson,
        governanceDocumentText,
        repoRoot,
    }),
    ...collectRuntimePolicyErrors({
        runtimeConfigPolicy,
        runtimeEnvNames,
        governanceDocumentText,
    }),
    ...collectAuditErrors(auditReport),
];
