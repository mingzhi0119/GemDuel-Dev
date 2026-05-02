import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
    normalizeArchivePath,
    toPosix,
    updateManifestRecords,
} from './visual-lab-surface-review-manifest.mjs';
import { clearSurfaceReviewStateReplacementNotes } from './visual-lab-surface-review-state.mjs';
import { readReviewWorkItem } from './visual-lab-surface-review-work-item.mjs';

const quotePromptValue = (value) =>
    String(value ?? '')
        .replace(/\s+/g, ' ')
        .trim();

const createReplacementPromptText = (item, target) => {
    const dimensions = target.targetDimensions.join('x');
    const comment = quotePromptValue(item.comment);
    const commentInstruction = comment
        ? `Human review instruction, mandatory: ${comment}. Obey this even if it conflicts with the prior candidate image.`
        : 'No extra human review instruction for this slot.';
    const ratingText = item.rating === null || item.rating === undefined ? 'runtime' : item.rating;

    return [
        `Create one exact ${dimensions} PNG for GemDuel Visual Lab replacement prompt ${item.promptId}.`,
        `Source kind: ${item.source}. Style set: ${item.setId}. Style: ${item.style}. Former variant: ${item.variant}. Human rating: ${ratingText}.`,
        `Slot: ${target.rawSlot}; target archive path: ${target.archivePath}.`,
        `Original candidate asset path to improve: ${target.archivePath}.`,
        commentInstruction,
        item.promptConstraints,
        'Preserve the successful style identity from the original set, but fix the marked slot according to the human instruction.',
        'Do not include text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake readable glyphs, UI labels, counters, cards, buttons, hover rings, selection states, screenshots, contact-sheet layouts, or app chrome.',
        'React renders all labels, counts, icons, levels, gems, buttons, cards, hover rings, selection states, and gameplay affordances.',
        'Return a single clean game asset image only.',
    ].join(' ');
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
        const comment = item.comment
            ? `Human instruction: ${item.comment}`
            : 'Human instruction: -';
        promptLines.push(
            `## ${item.promptId}`,
            '',
            `Slot: \`${item.slot}\``,
            `Style set: \`${item.setId}\``,
            `Rating: \`${item.rating ?? 'runtime'}\``,
            `Target: \`${dimensions}\``,
            comment,
            '',
            item.promptConstraints,
            '',
            `Generate one PNG for each target listed below. Preserve style identity for ${item.style} ${item.variant}.`,
            '',
            ...item.targets.flatMap((target) => [
                `### ${item.promptId} / ${target.rawSlot}`,
                '',
                createReplacementPromptText(item, target),
                '',
            ]),
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
                promptText: createReplacementPromptText(item, target),
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

const normalizeGeneratedSource = ({ repoRoot, planDir, source, actual, expected }) => {
    const resizeScript = path.join(repoRoot, 'tmp', 'visual-lab', 'png-resize.mjs');
    if (!fs.existsSync(resizeScript)) {
        throw new Error('missing tmp/visual-lab/png-resize.mjs normalization helper');
    }

    const safeName = `${source.promptId}-${source.rawSlot}`.replace(/[^A-Za-z0-9_.-]+/g, '-');
    const normalizedPath = path.join(planDir, 'normalized-sources', `${safeName}.png`);
    fs.mkdirSync(path.dirname(normalizedPath), { recursive: true });
    execFileSync(
        process.execPath,
        [
            resizeScript,
            path.resolve(source.sourcePath),
            normalizedPath,
            String(expected[0]),
            String(expected[1]),
            'cover',
        ],
        { stdio: 'pipe' }
    );
    return {
        normalizedPath,
        normalization: `center-crop-resize from ${actual.join('x')} to ${expected.join('x')}`,
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
        let copySourcePath = sourcePath;
        let finalDimensions = actual;
        let normalization = '';
        if (expected?.[0] !== actual[0] || expected?.[1] !== actual[1]) {
            try {
                const normalized = normalizeGeneratedSource({
                    repoRoot,
                    planDir,
                    source,
                    actual,
                    expected,
                });
                copySourcePath = normalized.normalizedPath;
                normalization = normalized.normalization;
                finalDimensions = readPngDimensions(copySourcePath);
            } catch (error) {
                failures.push({
                    ...source,
                    failure: `dimension mismatch: expected ${expected?.join('x')}, got ${actual.join('x')}; normalization failed: ${error instanceof Error ? error.message : String(error)}`,
                });
                continue;
            }
        }

        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.copyFileSync(copySourcePath, targetPath);
        replacements.push({
            ...source,
            sourcePath: toPosix(sourcePath),
            normalizedSourcePath: normalization ? toPosix(copySourcePath) : '',
            targetPath: toPosix(path.relative(repoRoot, targetPath)),
            dimensions: finalDimensions,
            normalization,
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
                    normalizedSourcePath: replacement.normalizedSourcePath,
                    replacementPromptId: replacement.promptId,
                    replacementGeneratedAt: new Date().toISOString(),
                    risk: [
                        'Replaced by Visual Lab surface review finalize step; human re-review required.',
                        replacement.normalization,
                    ]
                        .filter(Boolean)
                        .join(' '),
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
