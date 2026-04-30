import { SURFACE_SLOT_TARGET_DIMENSIONS } from './visual-lab-surface-review-manifest.mjs';

export const getTargetDimensions = (record) =>
    record.dimensions?.target ??
    record.dimensions?.archive ??
    SURFACE_SLOT_TARGET_DIMENSIONS[record.rawSlot] ??
    SURFACE_SLOT_TARGET_DIMENSIONS[record.slot];

export const createAssetEntry = (record) => ({
    slot: record.slot,
    rawSlot: record.rawSlot,
    playerZoneSide: record.playerZoneSide,
    promptId: record.promptId,
    archivePath: record.archivePath,
    archiveUrl: record.archiveUrl,
    manifestPath: record.manifestPath,
    targetDimensions: getTargetDimensions(record),
});

export const createSetEntry = (set, rating) => ({
    setId: set.id,
    batch: set.batch,
    date: set.date,
    style: set.style,
    variant: set.variant,
    rating,
    manifestPaths: Array.from(new Set(set.records.map((record) => record.manifestPath))).sort(),
    assets: set.records.map(createAssetEntry),
});

export const buildPromptConstraints = (slot) => {
    const common =
        'No text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, UI labels, baked cards, baked counters, gameplay controls, hover rings, or selection states. React renders all labels, counts, icons, levels, gems, buttons, and gameplay affordances.';

    if (slot === 'shell-background') {
        return `${common} Shell may use theme-related landscapes, distant architecture, environment wonders, or natural wonders, but must stay one low-contrast, low-noise wide global background with no strong focal subject, framed panel, tablecloth, playmat, center rectangle, platform, giant sun/moon disk, character, or monster.`;
    }

    if (slot === 'royal-card-back') {
        return `${common} Royal card back must have a complete prestige center focus such as sovereign ornament, crown-like abstract motif, ceremonial medallion, jewel core, or crest-like non-readable geometry; no large empty center.`;
    }

    if (slot.startsWith('market-card-back')) {
        return `${common} Market L1/L2/L3 must remain a coherent tiered card-back family; L1 must still include a restrained center ornament and may not have an empty center.`;
    }

    if (slot === 'gem-panel') {
        return `${common} Gem panel must be a straight, front-facing, calibratable 5x5 grid of empty wells.`;
    }

    return common;
};

export const getReplacementTargets = (set, slot) => {
    if (slot === 'player-zone' && set.playerZoneSideSlots.p1 && set.playerZoneSideSlots.p2) {
        return [set.playerZoneSideSlots.p1, set.playerZoneSideSlots.p2].map(createAssetEntry);
    }

    return [createAssetEntry(set.slots[slot])];
};
