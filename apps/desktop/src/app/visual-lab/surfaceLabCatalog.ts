import type { ThemeName } from '@app/types/ui';
import {
    RUNTIME_SURFACE_LAB_THEMES,
    SURFACE_LAB_SLOTS,
    type RuntimeSurfaceLabTheme,
    type SurfaceLabAssetSet,
    type SurfaceLabCandidate,
    type SurfaceLabSlot,
} from './surfaceLabTypes';

const isSurfaceLabSlot = (value: unknown): value is SurfaceLabSlot =>
    typeof value === 'string' && SURFACE_LAB_SLOTS.includes(value as SurfaceLabSlot);

const normalizeSurfaceLabSlot = (
    value: unknown
): { slot: SurfaceLabSlot; playerZoneSide?: 'p1' | 'p2' } | null => {
    if (value === 'player-zone-p1') {
        return { slot: 'player-zone', playerZoneSide: 'p1' };
    }

    if (value === 'player-zone-p2') {
        return { slot: 'player-zone', playerZoneSide: 'p2' };
    }

    return isSurfaceLabSlot(value) ? { slot: value } : null;
};

const getRuntimeSlotFileName = (slot: SurfaceLabSlot): string => {
    switch (slot) {
        case 'shell-background':
            return 'shell-background.png';
        case 'player-zone':
            return 'player-zone.png';
        case 'gem-panel':
            return 'gem-panel.png';
        case 'market-card-back-l1':
            return 'market-card-back-l1.png';
        case 'market-card-back-l2':
            return 'market-card-back-l2.png';
        case 'market-card-back-l3':
            return 'market-card-back-l3.png';
        case 'royal-card-back':
            return 'royal-card-back.png';
    }
};

const createRuntimeCandidate = (
    style: RuntimeSurfaceLabTheme,
    slot: SurfaceLabSlot,
    theme: ThemeName
): SurfaceLabCandidate => ({
    batch: 'runtime',
    date: 'current',
    promptId: `RUNTIME-${style}-${slot}`,
    slot,
    style,
    variant: theme.toUpperCase(),
    score: null,
    risk: 'Runtime-integrated surface asset.',
    dimensions: null,
    archiveUrl: `/assets/surfaces/anime-themes/${style}/${theme}/${getRuntimeSlotFileName(slot)}`,
    source: 'runtime',
});

const RUNTIME_PLAYER_ZONE_SIDE_THEMES = new Set<RuntimeSurfaceLabTheme>(RUNTIME_SURFACE_LAB_THEMES);

const createRuntimePlayerZoneSideCandidate = (
    style: RuntimeSurfaceLabTheme,
    player: 'p1' | 'p2',
    theme: ThemeName
): SurfaceLabCandidate => ({
    batch: 'runtime',
    date: 'current',
    promptId: `RUNTIME-${style}-player-zone-${player}`,
    slot: 'player-zone',
    style,
    variant: theme.toUpperCase(),
    score: null,
    risk: 'Runtime-integrated side-specific player-zone surface asset.',
    dimensions: null,
    archiveUrl: `/assets/surfaces/anime-themes/${style}/${theme}/player-zone-${player}.png`,
    source: 'runtime',
    playerZoneSide: player,
});

export const createRuntimeSurfaceLabAssetSets = (theme: ThemeName): SurfaceLabAssetSet[] =>
    RUNTIME_SURFACE_LAB_THEMES.map((style) => {
        const slots = SURFACE_LAB_SLOTS.reduce<Record<SurfaceLabSlot, SurfaceLabCandidate>>(
            (acc, slot) => {
                acc[slot] = createRuntimeCandidate(style, slot, theme);
                return acc;
            },
            {} as Record<SurfaceLabSlot, SurfaceLabCandidate>
        );
        const playerZoneSideSlots = RUNTIME_PLAYER_ZONE_SIDE_THEMES.has(style)
            ? {
                  p1: createRuntimePlayerZoneSideCandidate(style, 'p1', theme),
                  p2: createRuntimePlayerZoneSideCandidate(style, 'p2', theme),
              }
            : undefined;

        return {
            id: `runtime:${style}:${theme}`,
            source: 'runtime',
            batch: 'runtime',
            batchLabel: 'Runtime Themes',
            date: 'current',
            style,
            variant: theme.toUpperCase(),
            label: `${style} (${theme})`,
            slots,
            playerZoneSideSlots,
        };
    });

const getCandidateSetId = (candidate: SurfaceLabCandidate): string =>
    `${candidate.batch}:${candidate.date}:${candidate.style}:${candidate.variant}`;

const getCandidateLabel = (candidate: SurfaceLabCandidate): string =>
    candidate.variant === 'main' ? candidate.style : `${candidate.style} ${candidate.variant}`;

const getBatchLabel = (batch: string, date: string): string =>
    `${batch.replace(/^surface-autonomous-/, '').replace(/-candidates$/, '')} / ${date}`;

const getFirstString = (...values: unknown[]): string | null => {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) {
            return value;
        }
    }

    return null;
};

const parseDimensionPair = (value: unknown): readonly [number, number] | undefined => {
    if (Array.isArray(value) && value.length >= 2) {
        const width = Number(value[0]);
        const height = Number(value[1]);
        return Number.isFinite(width) && Number.isFinite(height) ? [width, height] : undefined;
    }

    if (typeof value === 'string') {
        const match = value.match(/(\d+)\s*x\s*(\d+)/i);
        if (match) {
            return [Number(match[1]), Number(match[2])];
        }
    }

    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const width = Number(record.width);
        const height = Number(record.height);
        return Number.isFinite(width) && Number.isFinite(height) ? [width, height] : undefined;
    }

    return undefined;
};

const normalizeDimensions = (
    record: Record<string, unknown>
): SurfaceLabCandidate['dimensions'] => {
    const rawDimensions =
        record.dimensions && typeof record.dimensions === 'object'
            ? (record.dimensions as Record<string, unknown>)
            : {};
    const dimensions = {
        source: parseDimensionPair(
            record.sourceDimensions ?? record.source_dimensions ?? rawDimensions.source
        ),
        target: parseDimensionPair(
            record.targetDimensions ?? record.target_dimensions ?? rawDimensions.target
        ),
        archive: parseDimensionPair(
            record.archiveDimensions ??
                record.archive_dimensions ??
                rawDimensions.archive ??
                record.dimensions
        ),
    };

    return dimensions.source || dimensions.target || dimensions.archive ? dimensions : null;
};

const normalizeArchiveUrl = (record: Record<string, unknown>): string | null => {
    const existingUrl = getFirstString(record.archiveUrl);

    if (existingUrl) {
        return existingUrl;
    }

    const archivePath = getFirstString(
        record.archive,
        record.archivePath,
        record.archive_path,
        record.archive_relative
    );

    if (!archivePath) {
        return null;
    }

    const normalized = archivePath.replace(/\\/g, '/');
    const prefix = 'assets/art-library/';
    const prefixIndex = normalized.indexOf(prefix);

    return prefixIndex >= 0
        ? `/__surface-lab/assets/${normalized.slice(prefixIndex + prefix.length)}`
        : null;
};

const normalizeRisk = (record: Record<string, unknown>): string => {
    if (Array.isArray(record.risks)) {
        return record.risks.map((risk) => String(risk)).join('; ');
    }

    return (
        getFirstString(
            record.risk,
            record.normalization,
            record.operation,
            record.recommendation
        ) ?? ''
    );
};

export const normalizeSurfaceLabCandidates = (records: unknown[]): SurfaceLabCandidate[] =>
    records.flatMap((record) => {
        if (!record || typeof record !== 'object') {
            return [];
        }

        const candidate = record as Record<string, unknown>;
        const promptId = getFirstString(candidate.promptId, candidate.prompt_id);
        const archiveUrl = normalizeArchiveUrl(candidate);
        const style = getFirstString(candidate.style);
        const variant = getFirstString(candidate.variant);
        const normalizedSlot = normalizeSurfaceLabSlot(candidate.slot);

        if (
            typeof candidate.batch !== 'string' ||
            typeof candidate.date !== 'string' ||
            !promptId ||
            !style ||
            !variant ||
            !archiveUrl ||
            !normalizedSlot
        ) {
            return [];
        }

        return [
            {
                batch: candidate.batch,
                date: candidate.date,
                promptId,
                slot: normalizedSlot.slot,
                playerZoneSide: normalizedSlot.playerZoneSide,
                style,
                variant,
                score: typeof candidate.score === 'number' ? candidate.score : null,
                risk: normalizeRisk(candidate),
                dimensions: normalizeDimensions(candidate),
                archiveUrl,
                source: 'candidate' as const,
            },
        ];
    });

export const normalizeSurfaceLabAssetSets = (
    candidates: readonly SurfaceLabCandidate[]
): SurfaceLabAssetSet[] => {
    const grouped = new Map<string, SurfaceLabCandidate[]>();

    candidates.forEach((candidate) => {
        const key = getCandidateSetId(candidate);
        grouped.set(key, [...(grouped.get(key) ?? []), candidate]);
    });

    return Array.from(grouped.entries())
        .flatMap(([id, group]) => {
            const slots = group.reduce<Partial<Record<SurfaceLabSlot, SurfaceLabCandidate>>>(
                (acc, candidate) => {
                    if (candidate.slot !== 'player-zone' || !candidate.playerZoneSide) {
                        acc[candidate.slot] = candidate;
                    } else if (!acc['player-zone']) {
                        acc['player-zone'] = candidate;
                    }

                    return acc;
                },
                {}
            );
            const playerZoneSideSlots = group.reduce<
                Partial<Record<'p1' | 'p2', SurfaceLabCandidate>>
            >((acc, candidate) => {
                if (candidate.slot === 'player-zone' && candidate.playerZoneSide) {
                    acc[candidate.playerZoneSide] = candidate;
                }

                return acc;
            }, {});
            const hasLegacyPlayerZone = group.some(
                (candidate) => candidate.slot === 'player-zone' && !candidate.playerZoneSide
            );
            const hasCompletePlayerZone =
                Boolean(slots['player-zone']) &&
                (hasLegacyPlayerZone || Boolean(playerZoneSideSlots.p1 && playerZoneSideSlots.p2));
            const missingSlot = SURFACE_LAB_SLOTS.find((slot) =>
                slot === 'player-zone' ? !hasCompletePlayerZone : !slots[slot]
            );
            const first = group[0];

            if (!first || missingSlot) {
                return [];
            }

            return [
                {
                    id,
                    source: 'candidate' as const,
                    batch: first.batch,
                    batchLabel: getBatchLabel(first.batch, first.date),
                    date: first.date,
                    style: first.style,
                    variant: first.variant,
                    label: getCandidateLabel(first),
                    slots: slots as Record<SurfaceLabSlot, SurfaceLabCandidate>,
                    playerZoneSideSlots,
                },
            ];
        })
        .sort((a, b) => {
            if (a.date !== b.date) {
                return b.date.localeCompare(a.date);
            }

            if (a.batch !== b.batch) {
                return a.batch.localeCompare(b.batch);
            }

            if (a.style !== b.style) {
                return a.style.localeCompare(b.style);
            }

            return a.variant.localeCompare(b.variant);
        });
};

export const createSurfaceLabAssetSets = (
    candidates: readonly SurfaceLabCandidate[],
    theme: ThemeName
): SurfaceLabAssetSet[] => [
    ...normalizeSurfaceLabAssetSets(candidates),
    ...createRuntimeSurfaceLabAssetSets(theme),
];
