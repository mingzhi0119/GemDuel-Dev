import type { ThemeName } from '@app/types/ui';
import type { PlayerKey } from '@gemduel/shared/types';

export const SURFACE_LAB_SLOTS = [
    'shell-background',
    'player-zone',
    'gem-panel',
    'market-card-back-l1',
    'market-card-back-l2',
    'market-card-back-l3',
    'royal-card-back',
] as const;

export type SurfaceLabSlot = (typeof SURFACE_LAB_SLOTS)[number];
export type SurfaceLabSource = 'runtime' | 'candidate';

export interface SurfaceLabDimensions {
    target?: readonly [number, number];
    source?: readonly [number, number];
    archive?: readonly [number, number];
}

export interface SurfaceLabCandidate {
    batch: string;
    date: string;
    promptId: string;
    slot: SurfaceLabSlot;
    playerZoneSide?: PlayerKey;
    style: string;
    variant: string;
    score: number | null;
    risk: string;
    dimensions: SurfaceLabDimensions | null;
    archiveUrl: string;
    source: SurfaceLabSource;
}

export interface SurfaceLabAssetSet {
    id: string;
    source: SurfaceLabSource;
    batch: string;
    batchLabel: string;
    date: string;
    style: string;
    variant: string;
    label: string;
    slots: Record<SurfaceLabSlot, SurfaceLabCandidate>;
    playerZoneSideSlots?: Partial<Record<PlayerKey, SurfaceLabCandidate>>;
}

export interface SurfaceLabCatalog {
    status: 'loading' | 'ready' | 'error';
    error?: string;
    candidates: SurfaceLabCandidate[];
    assetSets: SurfaceLabAssetSet[];
}

export type VisualLabMode = 'surfaces' | 'motion';

export const RUNTIME_SURFACE_LAB_THEMES = [
    'crystal-anime',
    'royal-luxury',
    'dark-arcane',
    'clean-boardgame',
    'pearl-opaline',
] as const;

export type RuntimeSurfaceLabTheme = (typeof RUNTIME_SURFACE_LAB_THEMES)[number];

export interface SurfaceLabStyleOptions {
    theme: ThemeName;
    assetSlots: Record<SurfaceLabSlot, SurfaceLabCandidate>;
}
