import fs from 'node:fs';
import path from 'node:path';
import {
    getManifestRecords,
    setManifestRecords,
    toPosix,
} from './visual-lab-surface-review-manifest.mjs';
import { loadSurfaceManifestRecords } from './visual-lab-surface-review-manifest.mjs';
import {
    buildSurfaceReviewPlan,
    writeSurfaceReviewPlan,
} from './visual-lab-surface-review-plan-core.mjs';
import { readSurfaceReviewStateFile } from './visual-lab-surface-review-state.mjs';

const MANIFEST_REPAIR_PREFIX = toPosix(
    path.join('assets', 'art-library', 'surface-autonomous-character-theme-candidates')
);

const shouldRepairManifestMetadata = (manifestPath) => {
    const normalized = toPosix(manifestPath);
    return (
        normalized.includes(`${MANIFEST_REPAIR_PREFIX}/2026-05-01T074505Z/`) ||
        normalized.includes(`${MANIFEST_REPAIR_PREFIX}/2026-05-01T083328Z/`)
    );
};

const getManifestPathBatchDate = (repoRoot, manifestPath) => {
    const relative = toPosix(path.relative(repoRoot, manifestPath));
    const parts = relative.split('/');
    return {
        batch: parts[2] ?? '',
        date: parts[3] ?? '',
    };
};

export const repairSurfaceReviewManifestMetadata = ({ repoRoot }) => {
    const artRoot = path.join(repoRoot, 'assets', 'art-library');
    const repaired = [];
    const visit = (dir) => {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const entryPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                visit(entryPath);
            } else if (entry.isFile() && entry.name === 'preview-manifest.json') {
                if (!shouldRepairManifestMetadata(entryPath)) continue;
                const { batch, date } = getManifestPathBatchDate(repoRoot, entryPath);
                if (!batch || !date) continue;
                const manifest = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
                const records = getManifestRecords(manifest);
                const nextRecords = records.map((record) => ({
                    ...record,
                    batch,
                    date,
                }));
                const nextManifest = {
                    ...setManifestRecords(manifest, nextRecords),
                    batch,
                    date,
                };
                const before = JSON.stringify(manifest);
                const after = JSON.stringify(nextManifest);
                if (before !== after) {
                    fs.writeFileSync(entryPath, `${JSON.stringify(nextManifest, null, 2)}\n`);
                    repaired.push({
                        manifestPath: toPosix(path.relative(repoRoot, entryPath)),
                        batch,
                        date,
                        recordCount: nextRecords.length,
                    });
                }
            }
        }
    };
    visit(artRoot);
    return { repaired };
};

export const writeCurrentSurfaceReviewPlan = ({ repoRoot, repair = true }) => {
    const repairResult = repair ? repairSurfaceReviewManifestMetadata({ repoRoot }) : null;
    const state = readSurfaceReviewStateFile({ repoRoot });
    if (!state) {
        throw new Error('Missing tmp/visual-lab/surface-review-state.json. Open Visual Lab first.');
    }
    const records = loadSurfaceManifestRecords({ repoRoot });
    const plan = buildSurfaceReviewPlan({
        repoRoot,
        records,
        ratings: state.ratings,
        regenMarks: state.regenMarks,
        comments: state.comments,
        origin: state.source.origin,
        href: state.source.href,
        clientAssetSets: state.assetSets,
    });
    const files = writeSurfaceReviewPlan({ repoRoot, plan });
    return {
        repair: repairResult,
        files,
        summary: plan.summary,
        warnings: plan.warnings,
    };
};
