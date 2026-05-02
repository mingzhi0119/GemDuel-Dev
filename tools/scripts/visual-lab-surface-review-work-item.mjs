import {
    getSurfaceReviewStatePath,
    readSurfaceReviewStateFile,
} from './visual-lab-surface-review-state.mjs';
import { buildSurfaceReviewPlan, readPlan } from './visual-lab-surface-review-plan-core.mjs';
import { loadSurfaceManifestRecords } from './visual-lab-surface-review-manifest.mjs';

/** @param {{ repoRoot: string; planPath?: string }} input */
export const readReviewWorkItem = ({ repoRoot, planPath }) => {
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
