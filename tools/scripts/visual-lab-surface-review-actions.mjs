import fs from 'node:fs';
import path from 'node:path';
import { toPosix, updateManifestRecords } from './visual-lab-surface-review-manifest.mjs';
import { readPlan } from './visual-lab-surface-review-plan-core.mjs';
import { readSurfaceReviewStateFile } from './visual-lab-surface-review-state.mjs';
import { readReviewWorkItem } from './visual-lab-surface-review-work-item.mjs';

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
