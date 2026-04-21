import fs from 'node:fs';
import path from 'node:path';

export const ARCHITECTURE_BUDGET_SCHEMA_VERSION = 1;

const CONTRACT_START_MARKER = '<!-- architecture-budget-contract:start -->';
const CONTRACT_END_MARKER = '<!-- architecture-budget-contract:end -->';
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const IGNORED_DIRECTORIES = new Set([
    'node_modules',
    'dist',
    'dist_electron',
    'coverage',
    'artifacts',
]);
const ROOT_IMPORT_PREFIXES = [
    'apps/desktop/',
    'packages/shared/',
    'packages/ui/',
    'packages/turn-service/',
    'tools/scripts/',
];
const IMPORT_SPECIFIER_PATTERN =
    /(?:import|export)\s+(?:type\s+)?[\s\S]*?\sfrom\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

const toPosixPath = (value) => value.replaceAll(path.sep, '/');

const isIgnoredPath = (repoPath) =>
    repoPath.includes('/__tests__/') ||
    repoPath.endsWith('.d.ts') ||
    /\.test\.[^.]+$/.test(repoPath) ||
    /\.spec\.[^.]+$/.test(repoPath);

const isSourceFile = (repoPath) =>
    SOURCE_EXTENSIONS.has(path.extname(repoPath)) && !isIgnoredPath(repoPath);

const countLines = (text) => text.split(/\r?\n/).length;

const matchesPathRule = (repoPath, rule) =>
    rule.endsWith('/') ? repoPath.startsWith(rule) : repoPath === rule;

const extractContractJson = (markdownText) => {
    const startIndex = markdownText.indexOf(CONTRACT_START_MARKER);
    const endIndex = markdownText.indexOf(CONTRACT_END_MARKER);
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
        throw new Error('Architecture layer map is missing the machine-readable budget contract.');
    }

    const contractBlock = markdownText.slice(startIndex + CONTRACT_START_MARKER.length, endIndex);
    const fencedJsonMatch = contractBlock.match(/```json\s*([\s\S]*?)\s*```/);
    if (!fencedJsonMatch) {
        throw new Error('Architecture budget contract must be stored as a fenced JSON block.');
    }

    return JSON.parse(fencedJsonMatch[1]);
};

const resolveLayerForPath = (repoPath, layers) =>
    layers.find((layer) => layer.paths.some((rule) => matchesPathRule(repoPath, rule))) ?? null;

const collectLayerRoots = (layers) =>
    Array.from(
        new Set(
            layers.flatMap((layer) =>
                layer.paths.map((rule) => {
                    const normalizedRule = rule.endsWith('/') ? rule.slice(0, -1) : rule;
                    return normalizedRule.split('/')[0];
                })
            )
        )
    );

const walkDirectory = (absoluteDir, repoRoot, files) => {
    if (!fs.existsSync(absoluteDir)) {
        return;
    }

    for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
        const absolutePath = path.join(absoluteDir, entry.name);
        const repoPath = toPosixPath(path.relative(repoRoot, absolutePath));

        if (entry.isDirectory()) {
            if (IGNORED_DIRECTORIES.has(entry.name)) {
                continue;
            }
            walkDirectory(absolutePath, repoRoot, files);
            continue;
        }

        if (isSourceFile(repoPath)) {
            files.add(repoPath);
        }
    }
};

const collectBudgetedSourceFiles = ({ repoRoot, layers }) => {
    const files = new Set();
    for (const root of collectLayerRoots(layers)) {
        walkDirectory(path.join(repoRoot, root), repoRoot, files);
    }

    return Array.from(files).sort();
};

const extractImportSpecifiers = (text) => {
    const specifiers = new Set();
    for (const match of text.matchAll(IMPORT_SPECIFIER_PATTERN)) {
        const specifier = match[1] ?? match[2];
        if (specifier) {
            specifiers.add(specifier);
        }
    }
    return Array.from(specifiers);
};

const resolveCandidateFile = (candidatePath, repoRoot) => {
    const absoluteCandidate = path.join(repoRoot, candidatePath);
    if (fs.existsSync(absoluteCandidate) && fs.statSync(absoluteCandidate).isFile()) {
        return toPosixPath(candidatePath);
    }

    for (const extension of SOURCE_EXTENSIONS) {
        const extendedPath = `${absoluteCandidate}${extension}`;
        if (fs.existsSync(extendedPath) && fs.statSync(extendedPath).isFile()) {
            return toPosixPath(`${candidatePath}${extension}`);
        }
    }

    for (const extension of SOURCE_EXTENSIONS) {
        const indexPath = path.join(absoluteCandidate, `index${extension}`);
        if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
            return toPosixPath(path.join(candidatePath, `index${extension}`));
        }
    }

    return null;
};

const resolveImportTarget = ({ importerPath, specifier, repoRoot }) => {
    if (specifier.startsWith('@app/')) {
        return resolveCandidateFile(
            path.posix.join('apps/desktop/src', specifier.slice('@app/'.length)),
            repoRoot
        );
    }

    if (specifier.startsWith('@gemduel/shared/')) {
        return resolveCandidateFile(
            path.posix.join('packages/shared/src', specifier.slice('@gemduel/shared/'.length)),
            repoRoot
        );
    }

    if (specifier.startsWith('@gemduel/ui/')) {
        return resolveCandidateFile(
            path.posix.join('packages/ui/src', specifier.slice('@gemduel/ui/'.length)),
            repoRoot
        );
    }

    if (specifier.startsWith('@gemduel/turn-service/')) {
        return resolveCandidateFile(
            path.posix.join(
                'packages/turn-service/src',
                specifier.slice('@gemduel/turn-service/'.length)
            ),
            repoRoot
        );
    }

    if (specifier.startsWith('./') || specifier.startsWith('../')) {
        const importerDirectory = path.posix.dirname(importerPath);
        const relativeCandidate = path.posix.normalize(
            path.posix.join(importerDirectory, specifier)
        );
        return resolveCandidateFile(relativeCandidate, repoRoot);
    }

    if (ROOT_IMPORT_PREFIXES.some((prefix) => specifier.startsWith(prefix))) {
        return resolveCandidateFile(specifier, repoRoot);
    }

    return null;
};

export const extractArchitectureBudgetContract = (architectureLayerMapText) => {
    const contract = extractContractJson(architectureLayerMapText);

    if (contract.schemaVersion !== ARCHITECTURE_BUDGET_SCHEMA_VERSION) {
        throw new Error(
            `Architecture budget contract must stay at schema version ${ARCHITECTURE_BUDGET_SCHEMA_VERSION}.`
        );
    }

    if (!Array.isArray(contract.layers) || contract.layers.length === 0) {
        throw new Error('Architecture budget contract must define at least one layer.');
    }

    if (!Array.isArray(contract.approvedExceptions)) {
        throw new Error('Architecture budget contract must define an approvedExceptions array.');
    }

    return contract;
};

export const collectArchitectureBudgetResults = ({ architectureLayerMapText, repoRoot }) => {
    const contract = extractArchitectureBudgetContract(architectureLayerMapText);
    const errors = [];
    const warnings = [];
    const exceptionMap = new Map(
        contract.approvedExceptions.map((exception) => [exception.path, exception])
    );

    for (const exception of contract.approvedExceptions) {
        if (
            typeof exception.path !== 'string' ||
            typeof exception.adrPath !== 'string' ||
            typeof exception.approvedMaxLines !== 'number'
        ) {
            errors.push(
                'Architecture budget exceptions must define path, adrPath, and approvedMaxLines.'
            );
            continue;
        }

        const absoluteExceptionPath = path.join(repoRoot, exception.path);
        if (!fs.existsSync(absoluteExceptionPath)) {
            errors.push(`Architecture budget exception references missing file ${exception.path}.`);
        }

        const absoluteAdrPath = path.join(repoRoot, exception.adrPath);
        if (!fs.existsSync(absoluteAdrPath)) {
            errors.push(
                `Architecture budget exception for ${exception.path} references missing ADR ${exception.adrPath}.`
            );
        }
    }

    for (const filePath of collectBudgetedSourceFiles({
        repoRoot,
        layers: contract.layers,
    })) {
        const layer = resolveLayerForPath(filePath, contract.layers);
        if (!layer) {
            continue;
        }

        const absoluteFilePath = path.join(repoRoot, filePath);
        const sourceText = fs.readFileSync(absoluteFilePath, 'utf8');
        const lineCount = countLines(sourceText);
        const approvedException = exceptionMap.get(filePath);

        if (lineCount > layer.incidentMaxLines) {
            if (!approvedException) {
                errors.push(
                    `${filePath} exceeds the hard ${layer.label} budget (${lineCount} > ${layer.incidentMaxLines}).`
                );
            } else if (lineCount > approvedException.approvedMaxLines) {
                errors.push(
                    `${filePath} exceeds its ADR-backed ceiling (${lineCount} > ${approvedException.approvedMaxLines}).`
                );
            }
        } else if (lineCount > layer.warningMaxLines && !approvedException) {
            warnings.push(
                `${filePath} exceeds the review budget for ${layer.label} (${lineCount} > ${layer.warningMaxLines}).`
            );
        }

        for (const specifier of extractImportSpecifiers(sourceText)) {
            const targetPath = resolveImportTarget({
                importerPath: filePath,
                specifier,
                repoRoot,
            });

            if (!targetPath) {
                continue;
            }

            for (const forbiddenPath of layer.forbiddenImportPaths ?? []) {
                if (matchesPathRule(targetPath, forbiddenPath)) {
                    errors.push(
                        `${filePath} must not import ${targetPath} under the ${layer.label} layer rules.`
                    );
                }
            }
        }
    }

    return {
        contract,
        errors,
        warnings,
    };
};
