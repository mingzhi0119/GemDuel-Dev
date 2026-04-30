import {
    SURFACE_SLOT_TARGET_DIMENSIONS,
    SURFACE_SLOTS,
    getFirstString,
    getSurfaceSetId,
    normalizeSlot,
    toPosix,
} from './visual-lab-surface-review-manifest.mjs';

const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));

const parseRuntimeSetId = (setId) => {
    if (typeof setId !== 'string') {
        return {};
    }

    const match = setId.match(/^runtime:([^:]+):([^:]+)$/);
    return match ? { style: match[1], theme: match[2] } : {};
};

const getRuntimeArchivePath = (candidate) => {
    const archivePath = getFirstString(
        candidate.archivePath,
        candidate.archive,
        candidate.archive_path,
        candidate.archive_relative
    );
    const normalizedArchivePath = archivePath ? toPosix(archivePath).replace(/^\.\//, '') : '';

    if (normalizedArchivePath.startsWith('apps/desktop/public/assets/')) {
        return normalizedArchivePath;
    }

    if (normalizedArchivePath.startsWith('assets/surfaces/')) {
        return `apps/desktop/public/${normalizedArchivePath}`;
    }

    const archiveUrl = getFirstString(candidate.archiveUrl);
    if (!archiveUrl) {
        return '';
    }

    const normalizedUrl = toPosix(archiveUrl).trim();
    const pathname = (() => {
        try {
            return new URL(normalizedUrl, 'http://surface-lab.local').pathname;
        } catch {
            return normalizedUrl;
        }
    })();

    if (pathname.startsWith('/assets/')) {
        return `apps/desktop/public${pathname}`;
    }

    if (pathname.startsWith('assets/')) {
        return `apps/desktop/public/${pathname}`;
    }

    return '';
};

const normalizeRuntimeDimensions = (dimensions, rawSlot) => {
    if (isRecord(dimensions)) {
        return dimensions;
    }

    const target = SURFACE_SLOT_TARGET_DIMENSIONS[rawSlot];
    return target ? { target } : null;
};

export const normalizeClientRuntimeSets = (clientAssetSets) =>
    clientAssetSets.flatMap((set) => {
        if (!isRecord(set) || set.source !== 'runtime') {
            return [];
        }

        const parsedSetId = parseRuntimeSetId(set.id);
        const batch = getFirstString(set.batch, 'runtime');
        const date = getFirstString(set.date, 'current');
        const style = getFirstString(set.style, parsedSetId.style);
        const variant = getFirstString(
            set.variant,
            parsedSetId.theme ? parsedSetId.theme.toUpperCase() : null
        );

        if (!batch || !date || !style || !variant) {
            return [];
        }

        const rawSlots = isRecord(set.slots) ? set.slots : {};
        const runtimeSet = {
            id: getSurfaceSetId({ batch, date, style, variant }),
            source: 'runtime',
            batch,
            date,
            style,
            variant,
            records: [],
            slots: {},
            playerZoneSideSlots: {},
        };

        for (const slot of SURFACE_SLOTS) {
            const candidate = rawSlots[slot];
            if (!isRecord(candidate)) {
                continue;
            }

            const normalizedSlot = normalizeSlot(getFirstString(candidate.slot, slot));
            if (!normalizedSlot || normalizedSlot.slot !== slot) {
                continue;
            }

            const archivePath = getRuntimeArchivePath(candidate);
            if (!archivePath) {
                continue;
            }

            const record = {
                batch,
                date,
                setId: runtimeSet.id,
                promptId:
                    getFirstString(candidate.promptId) ??
                    `RUNTIME-${style}-${variant}-${normalizedSlot.rawSlot}`,
                slot: normalizedSlot.slot,
                rawSlot: normalizedSlot.rawSlot,
                playerZoneSide: normalizedSlot.playerZoneSide,
                style,
                variant,
                score: typeof candidate.score === 'number' ? candidate.score : null,
                risk: getFirstString(candidate.risk) ?? 'Runtime-integrated surface asset.',
                dimensions: normalizeRuntimeDimensions(
                    candidate.dimensions,
                    normalizedSlot.rawSlot
                ),
                archivePath,
                archiveUrl: getFirstString(candidate.archiveUrl) ?? '',
                manifestPath: '',
            };

            runtimeSet.records.push(record);
            runtimeSet.slots[normalizedSlot.slot] ??= record;
            if (normalizedSlot.playerZoneSide) {
                runtimeSet.playerZoneSideSlots[normalizedSlot.playerZoneSide] = record;
            }
        }

        return runtimeSet.records.length ? [runtimeSet] : [];
    });
