import fs from 'node:fs';
import path from 'node:path';

const ALLOWED_EXCLUSION_CATEGORIES = new Set(['leaf', 'static', 'wrapper', 'shell']);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseIsoDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const parsed = new Date(`${value}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeToday = (today) => {
    if (today instanceof Date) {
        return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    }

    const parsedDate = parseIsoDate(today);
    if (!parsedDate) {
        throw new Error(`Invalid review date ${today}. Expected YYYY-MM-DD.`);
    }

    return parsedDate;
};

const daysSinceReview = (reviewedOn, today) =>
    Math.floor((today.getTime() - reviewedOn.getTime()) / MS_PER_DAY);

export const collectSealCoverageExclusionGovernanceErrors = ({
    exclusions,
    policy,
    repoRoot,
    today = new Date(),
}) => {
    const errors = [];

    if (!Array.isArray(exclusions) || exclusions.length === 0) {
        return ['Seal coverage exclusions must declare a non-empty explicit exclusions array.'];
    }

    if (
        !policy ||
        typeof policy !== 'object' ||
        typeof policy.baselineCount !== 'number' ||
        typeof policy.maxReviewCadenceDays !== 'number'
    ) {
        return ['Seal coverage exclusion governance policy is missing required numeric limits.'];
    }

    const normalizedToday = normalizeToday(today);

    if (exclusions.length > policy.baselineCount) {
        errors.push(
            `Seal coverage exclusions grew beyond the reviewed baseline (${exclusions.length} > ${policy.baselineCount}).`
        );
    }

    for (const exclusion of exclusions) {
        if (!exclusion || typeof exclusion !== 'object') {
            errors.push('Seal coverage exclusion entries must be objects.');
            continue;
        }

        if (typeof exclusion.pattern !== 'string' || exclusion.pattern.trim().length === 0) {
            errors.push('Seal coverage exclusions must define a non-empty pattern.');
        }

        if (typeof exclusion.reason !== 'string' || exclusion.reason.trim().length === 0) {
            errors.push(
                `Seal coverage exclusion ${exclusion.pattern ?? '<unknown>'} must define a non-empty reason.`
            );
        }

        if (!ALLOWED_EXCLUSION_CATEGORIES.has(exclusion.category)) {
            errors.push(
                `Seal coverage exclusion ${exclusion.pattern ?? '<unknown>'} uses invalid category ${String(exclusion.category)}.`
            );
        }

        if (
            typeof exclusion.reviewCadenceDays !== 'number' ||
            !Number.isInteger(exclusion.reviewCadenceDays) ||
            exclusion.reviewCadenceDays <= 0
        ) {
            errors.push(
                `Seal coverage exclusion ${exclusion.pattern ?? '<unknown>'} must define a positive integer reviewCadenceDays.`
            );
        } else if (exclusion.reviewCadenceDays > policy.maxReviewCadenceDays) {
            errors.push(
                `Seal coverage exclusion ${exclusion.pattern ?? '<unknown>'} exceeds the maximum review cadence (${exclusion.reviewCadenceDays} > ${policy.maxReviewCadenceDays}).`
            );
        }

        const reviewedOn = parseIsoDate(exclusion.lastReviewedOn);
        if (!reviewedOn) {
            errors.push(
                `Seal coverage exclusion ${exclusion.pattern ?? '<unknown>'} must define lastReviewedOn in YYYY-MM-DD format.`
            );
        } else if (daysSinceReview(reviewedOn, normalizedToday) > exclusion.reviewCadenceDays) {
            errors.push(
                `Seal coverage exclusion ${exclusion.pattern ?? '<unknown>'} is overdue for review (${daysSinceReview(reviewedOn, normalizedToday)} > ${exclusion.reviewCadenceDays} days).`
            );
        }

        if (exclusion.category === 'shell') {
            if (typeof exclusion.adrPath !== 'string' || exclusion.adrPath.trim().length === 0) {
                errors.push(
                    `Seal coverage shell exclusion ${exclusion.pattern ?? '<unknown>'} must define an ADR path.`
                );
            } else if (!fs.existsSync(path.join(repoRoot, exclusion.adrPath))) {
                errors.push(
                    `Seal coverage shell exclusion ${exclusion.pattern ?? '<unknown>'} references missing ADR ${exclusion.adrPath}.`
                );
            }
        } else if (exclusion.adrPath) {
            errors.push(
                `Seal coverage exclusion ${exclusion.pattern ?? '<unknown>'} must not define adrPath outside the shell category.`
            );
        }
    }

    return errors;
};
