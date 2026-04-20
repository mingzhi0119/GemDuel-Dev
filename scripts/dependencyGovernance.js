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
export const RETIRED_DEPENDENCY_WORKAROUNDS = Object.freeze(['scripts/patch-peer.js']);

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
    const overrides = packageJson.overrides ?? {};
    const errors = [];

    for (const [key, expectedValue] of Object.entries(REQUIRED_OVERRIDE_POLICY)) {
        const actualValue = overrides[key];

        if (typeof expectedValue === 'string' && actualValue !== expectedValue) {
            errors.push(`Missing override ${key}@${expectedValue}.`);
        }

        if (expectedValue && typeof expectedValue === 'object') {
            for (const [nestedKey, nestedValue] of Object.entries(expectedValue)) {
                if (actualValue?.[nestedKey] !== nestedValue) {
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
                `Runtime env ${envName} is used in runtime source files but missing from RUNTIME_CONFIG_POLICY.`
            );
        }

        if (!governanceDocumentText.includes(envName)) {
            errors.push(
                `Runtime env ${envName} is missing from ${GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance}.`
            );
        }
    }

    for (const [envName, entry] of Object.entries(runtimeConfigPolicy)) {
        for (const field of REQUIRED_POLICY_FIELDS) {
            if (typeof entry?.[field] !== 'string' || entry[field].trim().length === 0) {
                errors.push(`Runtime policy ${envName} is missing the ${field} field.`);
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

const getPackageNameFromPath = (relativePath, packageJson) => {
    if (relativePath === '') {
        return packageJson.name;
    }

    const parts = relativePath.split('node_modules/').filter(Boolean);
    return parts.at(-1) ?? relativePath;
};

const getPackageLicense = (entry) => {
    if (typeof entry?.license === 'string' && entry.license.trim().length > 0) {
        return entry.license.trim();
    }

    return null;
};

export const buildDependencySbomSnapshot = (packageJson, packageLock) => {
    const components = Object.entries(packageLock?.packages ?? {})
        .map(([relativePath, entry]) => ({
            path: normalizeRelativePath('.', relativePath).replace(/^\.$/, ''),
            name: getPackageNameFromPath(relativePath, packageJson),
            version: entry?.version ?? null,
            license: getPackageLicense(entry),
            dev: Boolean(entry?.dev),
        }))
        .sort((a, b) => a.path.localeCompare(b.path));

    const licenseInventory = {};
    for (const component of components) {
        if (!component.license) {
            continue;
        }

        licenseInventory[component.license] = (licenseInventory[component.license] ?? 0) + 1;
    }

    return {
        schemaVersion: 1,
        packageManager: 'npm',
        root: {
            name: packageJson.name,
            version: packageJson.version,
        },
        componentCount: components.length,
        licenseInventory,
        components,
    };
};

export const collectLicenseAllowlistErrors = ({ packageJson, packageLock, allowedLicenses }) => {
    const errors = [];
    const allowlist = new Set((allowedLicenses ?? []).filter(Boolean));

    if (allowlist.size === 0) {
        errors.push('License allowlist is empty.');
        return errors;
    }

    const snapshot = buildDependencySbomSnapshot(packageJson, packageLock);
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

export const collectSbomSnapshotErrors = ({ packageJson, packageLock, expectedSnapshot }) => {
    const actualSnapshot = buildDependencySbomSnapshot(packageJson, packageLock);
    if (!expectedSnapshot || typeof expectedSnapshot !== 'object') {
        return ['Missing dependency SBOM snapshot.'];
    }

    const actualJson = JSON.stringify(actualSnapshot);
    const expectedJson = JSON.stringify(expectedSnapshot);
    if (actualJson === expectedJson) {
        return [];
    }

    return ['Dependency SBOM snapshot drifted from package-lock.json.'];
};

export const collectGovernanceDocumentErrors = (governanceDocumentText) => {
    const requiredSections = [
        '## License Allowlist Policy',
        '## SBOM Policy',
        '## Secret Scanning and Env Drift Policy',
        '## CI Coverage',
        'governance/dependency-license-allowlist.json',
        'governance/dependency-sbom.snapshot.json',
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
