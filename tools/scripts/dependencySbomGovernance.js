import path from 'node:path';

const PLATFORM_SCOPED_BINARY_PATTERNS = Object.freeze([
    /^@esbuild\//,
    /^@rollup\/rollup-(android|darwin|freebsd|linux|openbsd|win32)-/i,
    /^@turbo\/(darwin|linux|windows)-/i,
]);

export const DEPENDENCY_SBOM_SNAPSHOT_OPTIONS = Object.freeze({
    excludePlatformScopedBinaries: true,
    normalizeInstallPaths: true,
});

const normalizeRelativePath = (repoRoot, absolutePath) =>
    path.relative(repoRoot, absolutePath).split(path.sep).join('/');

const isPlatformScopedBinaryName = (value = '') =>
    PLATFORM_SCOPED_BINARY_PATTERNS.some((pattern) => pattern.test(value));

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

const sortSbomComponents = (components) =>
    [...components].sort((a, b) => {
        const nameDiff = String(a.name).localeCompare(String(b.name));
        if (nameDiff !== 0) {
            return nameDiff;
        }

        const versionDiff = String(a.version).localeCompare(String(b.version));
        if (versionDiff !== 0) {
            return versionDiff;
        }

        const licenseDiff = String(a.license).localeCompare(String(b.license));
        if (licenseDiff !== 0) {
            return licenseDiff;
        }

        return String(a.path).localeCompare(String(b.path));
    });

const normalizeSbomComponents = (
    components,
    { excludePlatformScopedBinaries = false, normalizeInstallPaths = false } = {}
) => {
    const filteredComponents = excludePlatformScopedBinaries
        ? components.filter(
              (component) =>
                  !isPlatformScopedBinaryName(component.name) &&
                  !isPlatformScopedBinaryName(component.path)
          )
        : components;

    const sortedComponents = sortSbomComponents(filteredComponents);
    if (!normalizeInstallPaths) {
        return sortedComponents;
    }

    const occurrenceCounts = new Map();
    return sortedComponents.map((component) => {
        const occurrenceKey = `${component.name}\u0000${component.version}\u0000${component.license}`;
        const occurrence = (occurrenceCounts.get(occurrenceKey) ?? 0) + 1;
        occurrenceCounts.set(occurrenceKey, occurrence);

        return {
            ...component,
            path: `inventory/${component.name}@${component.version}/${occurrence}`,
        };
    });
};

export const buildDependencySbomSnapshot = (
    packageJson,
    licenseReport,
    repoRoot = process.cwd(),
    { excludePlatformScopedBinaries = false, normalizeInstallPaths = false } = {}
) => {
    const components = normalizeSbomComponents(
        flattenLicenseReportComponents(licenseReport, repoRoot),
        {
            excludePlatformScopedBinaries,
            normalizeInstallPaths,
        }
    );

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
        ...(excludePlatformScopedBinaries
            ? {
                  normalization: {
                      excludePlatformScopedBinaries: true,
                      ...(normalizeInstallPaths
                          ? {
                                normalizeInstallPaths: true,
                            }
                          : {}),
                  },
              }
            : normalizeInstallPaths
              ? {
                    normalization: {
                        normalizeInstallPaths: true,
                    },
                }
              : {}),
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
    snapshotOptions = {},
}) => {
    const actualSnapshot = buildDependencySbomSnapshot(
        packageJson,
        licenseReport,
        repoRoot,
        snapshotOptions
    );
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
