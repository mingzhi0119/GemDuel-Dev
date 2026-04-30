#!/usr/bin/env node
/* eslint-disable no-console */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    applyDeleteRatingOne,
    finalizeReplacements,
    prepareReplacements,
    validateSurfaceReviewPlan,
} from './visual-lab-surface-review-core.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

const args = process.argv.slice(2);
const command = args[0];

const getArg = (name) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
};

const hasFlag = (name) => args.includes(name);

const requirePlan = () => {
    const planPath = getArg('--plan');
    if (!planPath) {
        throw new Error('Missing required --plan <surface-review-plan.json>.');
    }
    return planPath;
};

try {
    if (command === 'validate') {
        const result = validateSurfaceReviewPlan({
            repoRoot,
            planPath: requirePlan(),
        });
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.ok ? 0 : 1);
    }

    if (command === 'apply') {
        const phase = getArg('--phase');
        if (phase !== 'delete-rating1') {
            throw new Error('Only --phase delete-rating1 is currently supported.');
        }
        const result = applyDeleteRatingOne({
            repoRoot,
            planPath: requirePlan(),
            confirm: hasFlag('--confirm-delete-rating1'),
        });
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    }

    if (command === 'prepare-replacements') {
        const result = prepareReplacements({
            repoRoot,
            planPath: requirePlan(),
        });
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    }

    if (command === 'finalize-replacements') {
        const sourcesPath = getArg('--sources');
        if (!sourcesPath) {
            throw new Error('Missing required --sources <generated-source-map.json>.');
        }
        const result = finalizeReplacements({
            repoRoot,
            planPath: requirePlan(),
            sourcesPath,
        });
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.completion.failures.length === 0 ? 0 : 1);
    }

    throw new Error(
        'Usage: visual-lab-surface-review.mjs <validate|apply|prepare-replacements|finalize-replacements> --plan <path>'
    );
} catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
}
