import fs from 'node:fs';
import path from 'node:path';
import {
    normalizeArchivePath,
    toPosix,
    updateManifestRecords,
} from './visual-lab-surface-review-manifest.mjs';
import { buildSurfaceReviewPlan, readPlan } from './visual-lab-surface-review-plan-core.mjs';
import { loadSurfaceManifestRecords } from './visual-lab-surface-review-manifest.mjs';
import {
    clearSurfaceReviewStateReplacementNotes,
    getSurfaceReviewStatePath,
    readSurfaceReviewStateFile,
} from './visual-lab-surface-review-state.mjs';

const ensureInside = (root, target) => {
    const relative = path.relative(root, target);
    return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
};

export const applyDeleteRatingOne = ({ repoRoot, planPath, confirm }) => {
    if (!confirm) {
        throw new Error('Refusing to delete rating-1 sets without --confirm-delete-rating1.');
    }

    const { plan, absolutePath } = readPlan(repoRoot, planPath);
    const planDir = path.dirname(absolutePath);
    const deleteSetIds = new Set(plan.deleteSets.map((set) => set.setId));
    const touchedManifests = new Map();
    const deletedFiles = [];
    const missingFiles = [];

    for (const set of plan.deleteSets) {
        for (const asset of set.assets) {
            if (!asset.archivePath) {
                continue;
            }
            const absoluteAssetPath = path.resolve(repoRoot, asset.archivePath);
            const artRoot = path.resolve(repoRoot, 'assets', 'art-library');
            if (!ensureInside(artRoot, absoluteAssetPath)) {
                throw new Error(`Refusing to delete outside art library: ${asset.archivePath}`);
            }
            if (fs.existsSync(absoluteAssetPath)) {
                fs.rmSync(absoluteAssetPath);
                deletedFiles.push(asset.archivePath);
            } else {
                missingFiles.push(asset.archivePath);
            }
        }

        for (const manifestPath of set.manifestPaths) {
            touchedManifests.set(manifestPath, true);
        }
    }

    const manifestResults = [];
    for (const manifestPath of touchedManifests.keys()) {
        const result = updateManifestRecords(repoRoot, manifestPath, ({ setId }) =>
            deleteSetIds.has(setId)
        );
        manifestResults.push({
            manifestPath,
            before: result.before,
            after: result.after,
            removed: result.removedRecords.length,
        });
    }

    const docsUpdated = pruneDocsArtRows(
        repoRoot,
        plan.deleteSets.flatMap((set) => set.assets)
    );
    const report = {
        planPath: toPosix(path.relative(repoRoot, absolutePath)),
        appliedAt: new Date().toISOString(),
        phase: 'delete-rating1',
        deletedSetCount: plan.deleteSets.length,
        deletedFileCount: deletedFiles.length,
        missingFileCount: missingFiles.length,
        manifestResults,
        docsUpdated,
        deletedFiles,
        missingFiles,
    };
    const reportPath = path.join(planDir, 'surface-review-apply-delete-report.json');
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    return { report, reportPath: toPosix(path.relative(repoRoot, reportPath)) };
};

/** @param {{ repoRoot: string; planPath?: string }} input */
const readReviewWorkItem = ({ repoRoot, planPath }) => {
    if (planPath) {
        return {
            ...readPlan(repoRoot, planPath),
            source: 'plan',
        };
    }

    const state = readSurfaceReviewStateFile({ repoRoot });
    if (!state) {
        throw new Error('Missing tmp/visual-lab/surface-review-state.json. Open Visual Lab first.');
    }

    const records = loadSurfaceManifestRecords({ repoRoot });
    return {
        plan: buildSurfaceReviewPlan({
            repoRoot,
            records,
            ratings: state.ratings,
            regenMarks: state.regenMarks,
            comments: state.comments,
            origin: state.source.origin,
            href: state.source.href,
            clientAssetSets: state.assetSets,
        }),
        absolutePath: getSurfaceReviewStatePath({ repoRoot }),
        source: 'state',
        state,
    };
};

export const validateSurfaceReviewState = ({ repoRoot }) => {
    const state = readSurfaceReviewStateFile({ repoRoot });
    if (!state) {
        return {
            ok: false,
            stage: 'state-missing',
            errors: ['Missing tmp/visual-lab/surface-review-state.json.'],
        };
    }

    const { plan } = readReviewWorkItem({ repoRoot });
    return {
        ok: true,
        stage: 'state',
        errors: [],
        revision: state.revision,
        updatedAt: state.updatedAt,
        counts: state.counts,
        deleteSetCount: plan.deleteSets.length,
        keepSetCount: plan.keepSets.length,
        regenerateSlotCount: plan.regenerateSlots.length,
        warningCount: plan.warnings.length,
    };
};

const pruneDocsArtRows = (repoRoot, assets) => {
    const docsArt = path.join(repoRoot, 'docs', 'art');
    const needles = new Set(
        assets
            .flatMap((asset) => [asset.archivePath, asset.promptId])
            .filter(Boolean)
            .map(toPosix)
    );
    const updated = [];

    const visit = (dir) => {
        if (!fs.existsSync(dir)) {
            return;
        }
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const entryPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                visit(entryPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                const lines = fs.readFileSync(entryPath, 'utf8').split(/\r?\n/);
                const next = [];
                let removedLineCount = 0;
                for (const line of lines) {
                    const hit =
                        line.startsWith('| ') &&
                        Array.from(needles).some(
                            (needle) => needle && toPosix(line).includes(needle)
                        );
                    if (hit) {
                        removedLineCount += 1;
                    } else {
                        next.push(line);
                    }
                }
                if (removedLineCount) {
                    fs.writeFileSync(entryPath, next.join('\n'), 'utf8');
                    updated.push({
                        path: toPosix(path.relative(repoRoot, entryPath)),
                        removedLineCount,
                    });
                }
            }
        }
    };

    visit(docsArt);
    return updated;
};

/** @param {{ repoRoot: string; planPath?: string }} input */
export const prepareReplacements = ({ repoRoot, planPath }) => {
    const { plan, absolutePath, source } = readReviewWorkItem({ repoRoot, planPath });
    const planDir = path.dirname(absolutePath);
    const promptManifestPath = path.join(planDir, 'surface-review-replacement-prompts.md');
    const sourceMapPath = path.join(planDir, 'surface-review-source-map-template.json');
    const promptLines = [
        '# Visual Lab Surface Replacement Prompts',
        '',
        'Use `C:\\Users\\sange\\.codex\\skills\\imagegen-asset-library-flow\\SKILL.md`.',
        'Worker agents must use the imagegen skill and built-in image_gen, must not edit the repo, and must return prompt id, prompt text, generated source path, and failures only.',
        '',
    ];

    for (const item of plan.regenerateSlots) {
        const dimensions = item.targetDimensions.join('x');
        promptLines.push(
            `## ${item.promptId}`,
            '',
            `Slot: \`${item.slot}\``,
            `Style set: \`${item.setId}\``,
            `Target: \`${dimensions}\``,
            '',
            item.promptConstraints,
            '',
            `Generate one PNG for each target listed in the JSON source-map template. Preserve style identity for ${item.style} ${item.variant}.`,
            ''
        );
    }

    const sourceMap = {
        schema: 'gemduel.visualLab.surfaceReviewReplacementSources.v1',
        planPath: toPosix(path.relative(repoRoot, absolutePath)),
        reviewSource: source,
        sources: plan.regenerateSlots.flatMap((item) =>
            item.targets.map((target) => ({
                promptId: item.promptId,
                regenKey: item.regenKey,
                setId: item.setId,
                slot: item.slot,
                rawSlot: target.rawSlot,
                archivePath: target.archivePath,
                targetDimensions: target.targetDimensions,
                sourcePath: '',
                failure: '',
            }))
        ),
    };

    fs.writeFileSync(promptManifestPath, `${promptLines.join('\n')}\n`, 'utf8');
    fs.writeFileSync(sourceMapPath, `${JSON.stringify(sourceMap, null, 2)}\n`, 'utf8');

    return {
        promptManifestPath: toPosix(path.relative(repoRoot, promptManifestPath)),
        sourceMapPath: toPosix(path.relative(repoRoot, sourceMapPath)),
        promptCount: plan.regenerateSlots.length,
        sourceCount: sourceMap.sources.length,
    };
};

const readPngDimensions = (filePath) => {
    const buffer = fs.readFileSync(filePath);
    if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
        throw new Error(`Not a PNG file: ${filePath}`);
    }
    return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
};

/** @param {{ repoRoot: string; planPath?: string; sourcesPath: string }} input */
export const finalizeReplacements = ({ repoRoot, planPath, sourcesPath }) => {
    const { plan, absolutePath, source } = readReviewWorkItem({ repoRoot, planPath });
    const planDir = path.dirname(absolutePath);
    const sourceMap = JSON.parse(fs.readFileSync(path.resolve(repoRoot, sourcesPath), 'utf8'));
    const sources = Array.isArray(sourceMap) ? sourceMap : (sourceMap.sources ?? []);
    const failures = [];
    const replacements = [];
    const completedRegenKeys = new Set();

    for (const source of sources) {
        if (source.failure) {
            failures.push(source);
            continue;
        }
        if (!source.sourcePath) {
            failures.push({ ...source, failure: 'missing sourcePath' });
            continue;
        }

        const sourcePath = path.resolve(source.sourcePath);
        const targetPath = path.resolve(repoRoot, source.archivePath);
        const expected = source.targetDimensions;
        const actual = readPngDimensions(sourcePath);
        if (expected?.[0] !== actual[0] || expected?.[1] !== actual[1]) {
            failures.push({
                ...source,
                failure: `dimension mismatch: expected ${expected?.join('x')}, got ${actual.join('x')}`,
            });
            continue;
        }

        fs.copyFileSync(sourcePath, targetPath);
        replacements.push({
            ...source,
            sourcePath: toPosix(sourcePath),
            targetPath: toPosix(path.relative(repoRoot, targetPath)),
            dimensions: actual,
        });
        completedRegenKeys.add(source.regenKey);
    }

    const manifests = new Set(
        replacements
            .map((replacement) => {
                const item = plan.regenerateSlots.find(
                    (slot) => slot.regenKey === replacement.regenKey
                );
                const target = item?.targets.find(
                    (candidate) => candidate.archivePath === replacement.archivePath
                );
                return target?.manifestPath;
            })
            .filter(Boolean)
    );

    for (const manifestPath of manifests) {
        updateManifestRecords(
            repoRoot,
            manifestPath,
            () => false,
            ({ record }) => {
                const archivePath = normalizeArchivePath(
                    record.archive ??
                        record.archivePath ??
                        record.archive_path ??
                        record.archive_relative
                );
                const replacement = replacements.find((item) => item.archivePath === archivePath);
                if (!replacement) {
                    return record;
                }
                return {
                    ...record,
                    source: replacement.sourcePath,
                    sourcePath: replacement.sourcePath,
                    replacementPromptId: replacement.promptId,
                    replacementGeneratedAt: new Date().toISOString(),
                    risk: 'Replaced by Visual Lab surface review finalize step; human re-review required.',
                    dimensions: {
                        ...(record.dimensions && typeof record.dimensions === 'object'
                            ? record.dimensions
                            : {}),
                        source: replacement.dimensions,
                        archive: replacement.dimensions,
                    },
                };
            }
        );
    }

    const completion = {
        schema: 'gemduel.visualLab.surfaceReviewCompletion.v1',
        planPath: toPosix(path.relative(repoRoot, absolutePath)),
        reviewSource: source,
        completedAt: new Date().toISOString(),
        completedRegenKeys: Array.from(completedRegenKeys).sort(),
        replacements,
        failures,
    };
    const completionPath = path.join(planDir, 'surface-review-completion.json');
    fs.writeFileSync(completionPath, `${JSON.stringify(completion, null, 2)}\n`, 'utf8');

    const clearedState =
        failures.length === 0 ? clearSurfaceReviewStateReplacementNotes({ repoRoot }) : null;

    return {
        completion,
        completionPath: toPosix(path.relative(repoRoot, completionPath)),
        clearedState,
    };
};

export const findLatestCompletion = ({ repoRoot }) => {
    const plansRoot = path.join(repoRoot, 'docs', 'art', 'visual-lab-review-plans');
    if (!fs.existsSync(plansRoot)) {
        return null;
    }

    const completions = [];
    for (const entry of fs.readdirSync(plansRoot, { withFileTypes: true })) {
        if (!entry.isDirectory()) {
            continue;
        }
        const completionPath = path.join(plansRoot, entry.name, 'surface-review-completion.json');
        if (fs.existsSync(completionPath)) {
            completions.push(completionPath);
        }
    }
    completions.sort();
    const latest = completions.at(-1);
    return latest ? JSON.parse(fs.readFileSync(latest, 'utf8')) : null;
};
