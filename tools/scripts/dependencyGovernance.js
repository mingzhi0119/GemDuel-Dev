import fs from 'node:fs';
import path from 'node:path';
import { GOVERNANCE_DOC_PATHS } from './governanceDocPaths.js';
export {
    DEPENDENCY_SBOM_SNAPSHOT_OPTIONS,
    buildDependencySbomSnapshot,
    collectLicenseAllowlistErrors,
    collectSbomSnapshotErrors,
} from './dependencySbomGovernance.js';

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
export const TRACKED_DEPENDENCY_CACHE_PREFIXES = Object.freeze(['.vite/deps/']);
export const ELECTRON_BASELINE_PACKAGES = Object.freeze(['electron', 'electron-builder']);
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
    'artifacts',
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
const normalizePathLike = (value) => value.split(path.sep).join('/');

const getDependencySpec = (packageJson, dependencyName) =>
    packageJson?.devDependencies?.[dependencyName] ?? packageJson?.dependencies?.[dependencyName];

const stripRangePrefix = (versionSpec = '') => versionSpec.replace(/^[~^]/, '');

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

/**
 * @param {{ trackedFiles?: string[] }} options
 */
export const collectTrackedDependencyCacheErrors = ({ trackedFiles = [] }) => {
    const trackedCacheFiles = Array.from(
        new Set(
            trackedFiles
                .map(normalizePathLike)
                .filter((trackedFile) =>
                    TRACKED_DEPENDENCY_CACHE_PREFIXES.some((prefix) =>
                        trackedFile.startsWith(prefix)
                    )
                )
        )
    ).sort((a, b) => a.localeCompare(b));

    return trackedCacheFiles.map(
        (trackedFile) => `Tracked dependency cache ${trackedFile} must be removed from git.`
    );
};

/**
 * @param {{
 *   packageJson?: Record<string, any>,
 *   desktopPackageJson?: Record<string, any> | null,
 *   governanceDocumentText?: string,
 * }} options
 */
export const collectElectronVersionBaselineErrors = ({
    packageJson,
    desktopPackageJson = null,
    governanceDocumentText = '',
}) => {
    const errors = [];
    if (!desktopPackageJson) {
        return errors;
    }

    for (const dependencyName of ELECTRON_BASELINE_PACKAGES) {
        const rootSpec = getDependencySpec(packageJson, dependencyName);
        const desktopSpec = getDependencySpec(desktopPackageJson, dependencyName);

        if (!rootSpec || !desktopSpec) {
            errors.push(
                `Electron baseline package ${dependencyName} must be declared in both root and apps/desktop package manifests.`
            );
            continue;
        }

        if (rootSpec !== desktopSpec) {
            errors.push(
                `Electron baseline package ${dependencyName} must match apps/desktop (${desktopSpec}); root currently declares ${rootSpec}.`
            );
        }
    }

    const desktopElectronSpec = getDependencySpec(desktopPackageJson, 'electron');
    const expectedBuildVersion = stripRangePrefix(desktopElectronSpec);
    const buildElectronVersion = desktopPackageJson?.build?.electronVersion;
    if (buildElectronVersion !== expectedBuildVersion) {
        errors.push(
            `apps/desktop build.electronVersion must match app Electron exact version ${expectedBuildVersion}; found ${buildElectronVersion ?? '<missing>'}.`
        );
    }

    for (const requiredToken of ['app-owned Electron baseline', 'tracked `.vite/deps`']) {
        if (!governanceDocumentText.includes(requiredToken)) {
            errors.push(
                `${GOVERNANCE_DOC_PATHS.dependencyRuntimeGovernance} must mention ${requiredToken}.`
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

export const collectGovernanceDocumentErrors = (governanceDocumentText) => {
    const requiredSections = [
        '## License Allowlist Policy',
        '## SBOM Policy',
        '## Dependency Baseline And Cache Hygiene',
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

/**
 * @param {{
 *   packageJson: Record<string, any>,
 *   desktopPackageJson?: Record<string, any> | null,
 *   trackedFiles?: string[],
 *   runtimeConfigPolicy: Record<string, any>,
 *   runtimeEnvNames: string[],
 *   governanceDocumentText: string,
 *   auditReport: Record<string, any>,
 *   repoRoot?: string,
 * }} options
 */
export const collectDependencyGovernanceErrors = ({
    packageJson,
    desktopPackageJson = null,
    trackedFiles = [],
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
    ...collectTrackedDependencyCacheErrors({ trackedFiles }),
    ...collectElectronVersionBaselineErrors({
        packageJson,
        desktopPackageJson,
        governanceDocumentText,
    }),
    ...collectRuntimePolicyErrors({
        runtimeConfigPolicy,
        runtimeEnvNames,
        governanceDocumentText,
    }),
    ...collectAuditErrors(auditReport),
];
