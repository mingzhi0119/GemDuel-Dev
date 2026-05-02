import fs from 'node:fs';
import path from 'node:path';
import {
    SURFACE_REVIEW_PLAN_SCHEMA,
    SURFACE_COMMENTS_STORAGE_KEY,
    SURFACE_RATINGS_STORAGE_KEY,
    SURFACE_REGEN_STORAGE_KEY,
    SURFACE_SLOTS,
    VALID_RATINGS,
    getSurfaceRegenKey,
    groupRecords,
    loadSurfaceManifestRecords,
    sha256,
    toPosix,
} from './visual-lab-surface-review-manifest.mjs';
import {
    buildPromptConstraints,
    createSetEntry,
    getReplacementTargets,
    getTargetDimensions,
} from './visual-lab-surface-review-entries.mjs';
import { normalizeClientRuntimeSets } from './visual-lab-surface-review-runtime-sets.mjs';
/**
 * @param {{
 *   repoRoot: string;
 *   records: Array<Record<string, any>>;
 *   ratings?: Record<string, number>;
 *   regenMarks?: Record<string, boolean>;
 *   comments?: Record<string, string>;
 *   origin?: string;
 *   href?: string;
 *   clientAssetSets?: Array<Record<string, any>>;
 *   createdAt?: string;
 * }} input
 */
export const buildSurfaceReviewPlan = ({
    repoRoot,
    records,
    ratings = {},
    regenMarks = {},
    comments = {},
    origin = '',
    href = '',
    clientAssetSets = [],
    createdAt = new Date().toISOString(),
}) => {
    const { completeSets, incompleteSets } = groupRecords(records);
    const runtimeSets = normalizeClientRuntimeSets(clientAssetSets);
    const runtimeSetCount = clientAssetSets.filter((set) => set?.source === 'runtime').length;
    const completeSetIds = new Set(completeSets.map((set) => set.id));
    const runtimeSetIds = new Set(runtimeSets.map((set) => set.id));
    const knownSetIds = new Set([...completeSetIds, ...runtimeSetIds]);
    const validRatings = Object.fromEntries(
        Object.entries(ratings).filter(([, rating]) => VALID_RATINGS.has(rating))
    );
    const normalizedComments = Object.fromEntries(
        Object.entries(comments)
            .map(([setId, comment]) => [
                setId,
                typeof comment === 'string' ? comment.replace(/\r\n/g, '\n').trim() : '',
            ])
            .filter(
                ([setId, comment]) => typeof setId === 'string' && knownSetIds.has(setId) && comment
            )
    );
    const staleComments = Object.entries(comments)
        .map(([setId, comment]) => ({
            setId,
            comment: typeof comment === 'string' ? comment.replace(/\r\n/g, '\n').trim() : '',
        }))
        .filter((item) => item.comment && !knownSetIds.has(item.setId));
    const attachComment = (entry) => ({
        ...entry,
        ...(normalizedComments[entry.setId] ? { comment: normalizedComments[entry.setId] } : {}),
    });
    const candidateRatings = completeSets.map((set) => [set, validRatings[set.id]]);
    const deleteSets = candidateRatings
        .filter(([, rating]) => rating === 1)
        .map(([set, rating]) => attachComment(createSetEntry(set, rating)));
    const keepSets = candidateRatings
        .filter(([, rating]) => rating === 4 || rating === 7 || rating === 10)
        .map(([set, rating]) => attachComment(createSetEntry(set, rating)));
    const keepSetIds = new Set(keepSets.map((set) => set.setId));
    const completeSetById = new Map(completeSets.map((set) => [set.id, set]));
    const regenerateSlots = [];
    const matchedRegenKeys = new Set();
    for (const keepSet of keepSets) {
        const sourceSet = completeSetById.get(keepSet.setId);
        if (!sourceSet) {
            continue;
        }
        for (const slot of SURFACE_SLOTS) {
            const regenKey = getSurfaceRegenKey({ ...sourceSet, slot });
            if (regenMarks[regenKey] !== true) {
                continue;
            }
            matchedRegenKeys.add(regenKey);
            regenerateSlots.push({
                source: sourceSet.source ?? 'candidate',
                setId: sourceSet.id,
                batch: sourceSet.batch,
                date: sourceSet.date,
                style: sourceSet.style,
                variant: sourceSet.variant,
                rating: keepSet.rating,
                comment: keepSet.comment ?? '',
                slot,
                regenKey,
                promptId:
                    `SURFACE-REVIEW-${sourceSet.date}-${sourceSet.style}-${sourceSet.variant}-${slot}`.replace(
                        /[^A-Za-z0-9_-]+/g,
                        '-'
                    ),
                targetDimensions: getTargetDimensions(sourceSet.slots[slot]),
                targets: getReplacementTargets(sourceSet, slot),
                promptConstraints: buildPromptConstraints(slot),
            });
        }
    }
    for (const sourceSet of runtimeSets) {
        for (const slot of SURFACE_SLOTS) {
            const regenKey = getSurfaceRegenKey({ ...sourceSet, slot });
            const sourceRecord = sourceSet.slots[slot];
            if (regenMarks[regenKey] !== true || !sourceRecord) {
                continue;
            }

            matchedRegenKeys.add(regenKey);
            regenerateSlots.push({
                source: 'runtime',
                setId: sourceSet.id,
                batch: sourceSet.batch,
                date: sourceSet.date,
                style: sourceSet.style,
                variant: sourceSet.variant,
                rating: null,
                comment: normalizedComments[sourceSet.id] ?? '',
                slot,
                regenKey,
                promptId:
                    `SURFACE-RUNTIME-REVIEW-${sourceSet.date}-${sourceSet.style}-${sourceSet.variant}-${slot}`.replace(
                        /[^A-Za-z0-9_-]+/g,
                        '-'
                    ),
                targetDimensions: getTargetDimensions(sourceRecord),
                targets: getReplacementTargets(sourceSet, slot),
                promptConstraints: buildPromptConstraints(slot),
            });
        }
    }

    const ratingCounts = { 1: 0, 4: 0, 7: 0, 10: 0 };
    for (const rating of Object.values(validRatings)) {
        ratingCounts[rating] += 1;
    }

    const runtimeRated = Object.entries(validRatings)
        .filter(([setId]) => setId.startsWith('runtime:'))
        .map(([setId, rating]) => ({ setId, rating }));
    const staleRatings = Object.entries(validRatings)
        .filter(([setId]) => !setId.startsWith('runtime:') && !completeSetIds.has(setId))
        .map(([setId, rating]) => ({ setId, rating }));
    const orphanRegenMarks = Object.keys(regenMarks)
        .filter((key) => regenMarks[key] === true && !matchedRegenKeys.has(key))
        .map((key) => {
            const parts = key.split(':');
            const setId = parts.slice(0, 4).join(':');
            return {
                key,
                reason: keepSetIds.has(setId)
                    ? 'slot not present on kept complete set'
                    : runtimeSetIds.has(setId)
                      ? 'slot not present on runtime set'
                      : 'set is not a kept 4/7/10 complete candidate set or runtime set',
            };
        });
    const unratedSets = completeSets
        .filter((set) => validRatings[set.id] === undefined)
        .map((set) => ({
            setId: set.id,
            batch: set.batch,
            date: set.date,
            style: set.style,
            variant: set.variant,
        }));
    const clientSetIds = new Set(clientAssetSets.map((set) => set.id).filter(Boolean));
    const serverSetIds = new Set(completeSets.map((set) => set.id));
    const clientMissingOnServer = Array.from(clientSetIds)
        .filter((setId) => !setId.startsWith('runtime:') && !serverSetIds.has(setId))
        .sort();

    const warnings = [
        ...staleRatings.map((item) => `Stale rating ignored: ${item.setId}`),
        ...staleComments.map((item) => `Stale comment ignored: ${item.setId}`),
        ...orphanRegenMarks.map((item) => `Orphan regen mark ignored: ${item.key}`),
        ...clientMissingOnServer.map(
            (setId) => `Client set missing on server manifest scan: ${setId}`
        ),
    ];

    return {
        schema: SURFACE_REVIEW_PLAN_SCHEMA,
        source: {
            origin,
            href,
            createdAt,
            repoRoot: toPosix(repoRoot),
            ratingsStorageKey: SURFACE_RATINGS_STORAGE_KEY,
            regenMarksStorageKey: SURFACE_REGEN_STORAGE_KEY,
            catalogHash: sha256(completeSets.map((set) => set.id).sort()),
            ratingsHash: sha256(validRatings),
            regenHash: sha256(regenMarks),
            commentsStorageKey: SURFACE_COMMENTS_STORAGE_KEY,
            commentsHash: sha256(normalizedComments),
        },
        summary: {
            totalSets: completeSets.length + runtimeSetCount,
            runtimeSets: runtimeSetCount,
            candidateSets: completeSets.length,
            ratedCounts: ratingCounts,
            deleteSetCount: deleteSets.length,
            keepSetCount: keepSets.length,
            regenerateSlotCount: regenerateSlots.length,
            commentCount: Object.keys(normalizedComments).length,
            warningCount: warnings.length,
        },
        comments: normalizedComments,
        deleteSets,
        keepSets,
        regenerateSlots,
        ignored: {
            runtimeRated,
            incompleteSets,
            staleRatings,
            orphanRegenMarks,
            staleComments,
            unratedSets,
            clientMissingOnServer,
        },
        validation: {
            assertions: [
                'deleteSets are complete non-runtime candidate sets rated 1',
                'keepSets are complete non-runtime candidate sets rated 4/7/10',
                'regenerateSlots belong to kept candidate sets or explicitly marked runtime slots',
                'player-zone side-specific sets expand to p1 and p2 targets',
                'runtime assets are never deleted',
            ],
        },
        warnings,
    };
};

const escapeMarkdown = (value) => String(value).replace(/\|/g, '\\|');
const formatMarkdownCell = (value) =>
    value ? escapeMarkdown(value).replace(/\r?\n/g, '<br>') : '-';

export const renderSurfaceReviewPlanMarkdown = (plan) => {
    const lines = [
        `# Visual Lab Surface Review Plan - ${plan.source.createdAt}`,
        '',
        '## Summary',
        '',
        `- Schema: \`${plan.schema}\``,
        `- Origin: \`${plan.source.origin || 'unknown'}\``,
        `- Candidate complete sets: ${plan.summary.candidateSets}`,
        `- Runtime sets observed: ${plan.summary.runtimeSets}`,
        `- Delete rating-1 sets: ${plan.summary.deleteSetCount}`,
        `- Kept rated sets: ${plan.summary.keepSetCount}`,
        `- Regenerate marked slots: ${plan.summary.regenerateSlotCount}`,
        `- Style comments: ${plan.summary.commentCount ?? Object.keys(plan.comments ?? {}).length}`,
        `- Warnings: ${plan.summary.warningCount}`,
        '',
        '## Delete Sets',
        '',
        '| Set id | Rating | Assets | Comment |',
        '| --- | ---: | ---: | --- |',
        ...plan.deleteSets.map(
            (set) =>
                `| \`${escapeMarkdown(set.setId)}\` | ${set.rating} | ${set.assets.length} | ${formatMarkdownCell(
                    set.comment
                )} |`
        ),
        '',
        '## Keep Sets',
        '',
        '| Set id | Rating | Comment |',
        '| --- | ---: | --- |',
        ...plan.keepSets.map(
            (set) =>
                `| \`${escapeMarkdown(set.setId)}\` | ${set.rating} | ${formatMarkdownCell(
                    set.comment
                )} |`
        ),
        '',
        '## Style Comments',
        '',
        '| Set id | Comment |',
        '| --- | --- |',
        ...(Object.entries(plan.comments ?? {}).length
            ? Object.entries(plan.comments).map(
                  ([setId, comment]) =>
                      `| \`${escapeMarkdown(setId)}\` | ${formatMarkdownCell(comment)} |`
              )
            : ['| - | - |']),
        '',
        '## Regenerate Slots',
        '',
        '| Prompt id | Slot | Rating | Targets |',
        '| --- | --- | --- | ---: |',
        ...plan.regenerateSlots.map(
            (slot) =>
                `| \`${escapeMarkdown(slot.promptId)}\` | \`${slot.slot}\` | ${
                    slot.rating ?? (slot.source === 'runtime' ? 'runtime' : '-')
                } | ${slot.targets.length} |`
        ),
        '',
        '## Warnings',
        '',
        ...(plan.warnings.length ? plan.warnings.map((warning) => `- ${warning}`) : ['- None']),
        '',
        '## Execution',
        '',
        '- Validate: `pnpm visual-lab:surface:review:validate -- --plan <this-json>`',
        '- Delete rating-1 sets: `pnpm visual-lab:surface:review:apply -- --plan <this-json> --phase delete-rating1 --confirm-delete-rating1`',
        '- Prepare replacement prompts: `pnpm visual-lab:surface:review:prepare-replacements -- --plan <this-json>`',
        '- Finalize replacements: `pnpm visual-lab:surface:review:finalize-replacements -- --plan <this-json> --sources <generated-source-map.json>`',
        '',
    ];

    return `${lines.join('\n')}\n`;
};

const timestampForPath = (iso) => iso.replace(/[:.]/g, '-');

export const writeSurfaceReviewPlan = ({ repoRoot, plan }) => {
    const outDir = path.join(
        repoRoot,
        'docs',
        'art',
        'visual-lab-review-plans',
        timestampForPath(plan.source.createdAt)
    );
    fs.mkdirSync(outDir, { recursive: true });
    const jsonPath = path.join(outDir, 'surface-review-plan.json');
    const markdownPath = path.join(outDir, 'surface-review-plan.md');

    fs.writeFileSync(jsonPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
    fs.writeFileSync(markdownPath, renderSurfaceReviewPlanMarkdown(plan), 'utf8');

    return {
        outDir: toPosix(path.relative(repoRoot, outDir)),
        jsonPath: toPosix(path.relative(repoRoot, jsonPath)),
        markdownPath: toPosix(path.relative(repoRoot, markdownPath)),
    };
};

export const readPlan = (repoRoot, planPath) => {
    const absolutePath = path.resolve(repoRoot, planPath);
    const plan = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    if (plan.schema !== SURFACE_REVIEW_PLAN_SCHEMA) {
        throw new Error(`Unsupported surface review plan schema: ${plan.schema}`);
    }
    return { plan, absolutePath };
};

export const validateSurfaceReviewPlan = ({ repoRoot, planPath }) => {
    const { plan } = readPlan(repoRoot, planPath);
    const records = loadSurfaceManifestRecords({ repoRoot });
    const { completeSets } = groupRecords(records);
    const currentSetIds = new Set(completeSets.map((set) => set.id));
    const deletePresent = plan.deleteSets.filter((set) => currentSetIds.has(set.setId));
    const deleteMissing = plan.deleteSets.filter((set) => !currentSetIds.has(set.setId));
    const keptMissing = plan.keepSets.filter((set) => !currentSetIds.has(set.setId));
    const errors = [];

    if (deletePresent.length > 0 && deleteMissing.length > 0) {
        errors.push(
            'Delete phase is partial: some deleteSets are still present and some are missing.'
        );
    }
    for (const set of keptMissing) {
        errors.push(`Kept set missing from current Visual Lab manifest: ${set.setId}`);
    }

    return {
        ok: errors.length === 0,
        stage:
            deletePresent.length === plan.deleteSets.length
                ? 'pre-delete'
                : deleteMissing.length === plan.deleteSets.length
                  ? 'post-delete'
                  : 'partial-delete',
        errors,
        deleteSetCount: plan.deleteSets.length,
        deleteSetsPresent: deletePresent.length,
        deleteSetsMissing: deleteMissing.length,
        keptMissing: keptMissing.map((set) => set.setId),
    };
};
