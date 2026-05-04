import type { CSSProperties } from 'react';
import type {
    GemPanelSkin,
    NormalizedGridLines,
    NormalizedPoint,
    NormalizedRect,
    ThemeName,
} from '@gemduel/shared/types';
import {
    calculateGemPanelCellCentersFromIntersections,
    GEM_BOARD_DIMENSION,
    GEM_BOARD_GEM_DIAMETER_NORMALIZED,
    GEM_PANEL_CANONICAL_PLAYFIELD_RECT,
} from '@gemduel/ui/components/gameBoard/gemPanelLayout';
import type {
    CardBackArtwork,
    MarketDeckBackArtworkMap,
} from '@gemduel/ui/components/card/cardBackArtwork';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
    normalizeSurfaceThemeSelections,
    type SurfaceThemeSelections,
    type SurfaceThemeVariant,
} from './surfaceTheme';
import { DESKTOP_SHELL_ARTWORK_HEIGHT_PX } from '../layout/desktopLayoutContract';

type SurfaceArtworkSlot = 'shellBackground' | 'gemPanel' | 'marketBackground';
type GemPanelSkinId = 'dashboard' | 'square-dashboard';
const SURFACE_RUNTIME_MODE = 'dark';

interface SurfaceArtworkAsset {
    path: string;
    size?: string;
    position?: string;
    repeat?: string;
    skinId?: GemPanelSkinId;
}

type ThemeSurfaceArtwork = Record<SurfaceArtworkSlot, SurfaceArtworkAsset>;

const SURFACE_THEME_RUNTIME_BASE_PATH = '/assets/surfaces/anime-themes';

interface GemPanelGeometryConfig {
    playfieldRectNormalized: NormalizedRect;
    cellCentersNormalized: NormalizedPoint[];
    cellGridLinesNormalized: NormalizedGridLines;
    gemDiameterNormalized: number;
}

const createGridLinesFromRect = (rect: NormalizedRect): NormalizedGridLines => {
    const cellWidth = (rect.right - rect.left) / GEM_BOARD_DIMENSION;
    const cellHeight = (rect.bottom - rect.top) / GEM_BOARD_DIMENSION;

    return {
        x: Array.from(
            { length: GEM_BOARD_DIMENSION + 1 },
            (_, index) => rect.left + cellWidth * index
        ),
        y: Array.from(
            { length: GEM_BOARD_DIMENSION + 1 },
            (_, index) => rect.top + cellHeight * index
        ),
    };
};

const createGemPanelGeometry = (
    playfieldRectNormalized: NormalizedRect,
    gemDiameterNormalized = GEM_BOARD_GEM_DIAMETER_NORMALIZED
): GemPanelGeometryConfig => {
    const cellGridLinesNormalized = createGridLinesFromRect(playfieldRectNormalized);

    return {
        playfieldRectNormalized,
        cellCentersNormalized:
            calculateGemPanelCellCentersFromIntersections(cellGridLinesNormalized),
        cellGridLinesNormalized,
        gemDiameterNormalized,
    };
};

const createGemPanelGeometryFromGridLines = (
    xGridLinesNormalized: readonly [number, number, number, number, number, number],
    yGridLinesNormalized: readonly [number, number, number, number, number, number],
    gemDiameterNormalized: number
): GemPanelGeometryConfig => {
    const cellGridLinesNormalized = {
        x: [...xGridLinesNormalized],
        y: [...yGridLinesNormalized],
    };

    return {
        playfieldRectNormalized: {
            left: xGridLinesNormalized[0],
            top: yGridLinesNormalized[0],
            right: xGridLinesNormalized[5],
            bottom: yGridLinesNormalized[5],
        },
        cellCentersNormalized:
            calculateGemPanelCellCentersFromIntersections(cellGridLinesNormalized),
        cellGridLinesNormalized,
        gemDiameterNormalized,
    };
};

// Grid lines are the detected 6x6 intersection lattice of each panel image.
const GEM_PANEL_GEOMETRY_BY_SURFACE: Record<SurfaceThemeVariant, GemPanelGeometryConfig> = {
    'crystal-anime': createGemPanelGeometryFromGridLines(
        [0.048, 0.2265, 0.4003, 0.5837, 0.7576, 0.9529],
        [0.0502, 0.2249, 0.3939, 0.5686, 0.7416, 0.9155],
        0.132
    ),
    'royal-luxury': createGemPanelGeometryFromGridLines(
        [0.0941, 0.2561, 0.4182, 0.5802, 0.7423, 0.9043],
        [0.0941, 0.2557, 0.4172, 0.5788, 0.7404, 0.9019],
        0.1325
    ),
    'dark-arcane': createGemPanelGeometryFromGridLines(
        [0.114, 0.2681, 0.4222, 0.5762, 0.7303, 0.8844],
        [0.0989, 0.2547, 0.4105, 0.5663, 0.7222, 0.878],
        0.1263
    ),
    'clean-boardgame': createGemPanelGeometryFromGridLines(
        [0.0805, 0.2477, 0.4148, 0.582, 0.7491, 0.9163],
        [0.0797, 0.2469, 0.414, 0.5812, 0.7483, 0.9155],
        0.1371
    ),
    'pearl-opaline': createGemPanelGeometryFromGridLines(
        [0.0797, 0.2432, 0.4107, 0.5789, 0.748, 0.9099],
        [0.0829, 0.2456, 0.4083, 0.5718, 0.7313, 0.9027],
        0.132
    ),
    'lotus-porcelain': createGemPanelGeometryFromGridLines(
        [0.1212, 0.2799, 0.4258, 0.571, 0.7145, 0.89],
        [0.1356, 0.2839, 0.4266, 0.5694, 0.7137, 0.8788],
        0.132
    ),
};

const GEM_PANEL_SKIN_BASE: Record<GemPanelSkinId, Omit<GemPanelSkin, 'artworkPath'>> = {
    dashboard: {
        id: 'dashboard',
        intrinsicWidthPx: 1254,
        intrinsicHeightPx: 1254,
        playfieldRectNormalized: GEM_PANEL_CANONICAL_PLAYFIELD_RECT,
    },
    'square-dashboard': {
        id: 'square-dashboard',
        intrinsicWidthPx: 1254,
        intrinsicHeightPx: 1254,
        playfieldRectNormalized: GEM_PANEL_CANONICAL_PLAYFIELD_RECT,
    },
};

export const SURFACE_ARTWORK: Record<ThemeName, ThemeSurfaceArtwork> = {
    dark: {
        shellBackground: {
            path: '/assets/surfaces/dark/background-shell.png',
        },
        gemPanel: {
            path: '/assets/surfaces/dark/panel-gem-board-square.png',
            size: '100% 100%',
            position: 'center center',
            skinId: 'square-dashboard',
        },
        marketBackground: {
            path: '/assets/surfaces/dark/background-market.png',
            position: 'center top',
        },
    },
};

const getSurfaceThemeAssetPath = (
    theme: ThemeName,
    variant: SurfaceThemeVariant,
    fileName: string
): string => {
    void theme;
    return `${SURFACE_THEME_RUNTIME_BASE_PATH}/${variant}/${SURFACE_RUNTIME_MODE}/${fileName}.png`;
};

export const getSurfaceThemeMarketDeckBackArtwork = (
    theme: ThemeName,
    variant: SurfaceThemeVariant
): MarketDeckBackArtworkMap =>
    ([1, 2, 3] as const).reduce<MarketDeckBackArtworkMap>((acc, level) => {
        acc[level] = {
            path: getSurfaceThemeAssetPath(theme, variant, `market-card-back-l${level}`),
            variant: `${variant}-${theme}-l${level}`,
        };

        return acc;
    }, {});

export const getSurfaceThemeRoyalCardBackArtwork = (
    theme: ThemeName,
    variant: SurfaceThemeVariant
): CardBackArtwork => ({
    path: getSurfaceThemeAssetPath(theme, variant, 'royal-card-back'),
    variant: `${variant}-${theme}`,
});

const getSurfaceArtworkAsset = (
    theme: ThemeName,
    slot: SurfaceArtworkSlot,
    variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.background
): SurfaceArtworkAsset => {
    const baseAsset = SURFACE_ARTWORK[theme][slot];

    if (slot === 'marketBackground') {
        return baseAsset;
    }

    const runtimeAssetName = slot === 'gemPanel' ? 'gem-panel' : 'shell-background';

    return {
        ...baseAsset,
        path: `${SURFACE_THEME_RUNTIME_BASE_PATH}/${variant}/${SURFACE_RUNTIME_MODE}/${runtimeAssetName}.png`,
        ...(slot === 'gemPanel'
            ? {
                  size: '100% 100%',
                  position: 'center center',
                  skinId: 'square-dashboard' as const,
              }
            : {
                  size: `100% ${DESKTOP_SHELL_ARTWORK_HEIGHT_PX}px`,
                  position: 'top center',
                  repeat: 'no-repeat',
              }),
    };
};

interface SurfaceStyleOptions {
    theme: ThemeName;
    slot: SurfaceArtworkSlot;
    variant?: SurfaceThemeVariant;
    backgroundColor: string;
    overlay: string;
    border?: string;
    boxShadow?: string;
}

const buildSurfaceStyle = ({
    theme,
    slot,
    variant,
    backgroundColor,
    overlay,
    border,
    boxShadow,
}: SurfaceStyleOptions): CSSProperties => {
    const asset = getSurfaceArtworkAsset(theme, slot, variant);

    return {
        backgroundColor,
        backgroundImage: `${overlay}, url("${asset.path}")`,
        backgroundSize: `cover, ${asset.size ?? 'cover'}`,
        backgroundPosition: `center, ${asset.position ?? 'center'}`,
        backgroundRepeat: `no-repeat, ${asset.repeat ?? 'no-repeat'}`,
        border,
        boxShadow,
    };
};

export const getGemPanelSkin = (
    theme: ThemeName,
    variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.gemPanel
): GemPanelSkin => {
    const asset = getSurfaceArtworkAsset(theme, 'gemPanel', variant);
    const skinId = asset.skinId ?? 'dashboard';
    const fallbackGeometry = createGemPanelGeometry(
        GEM_PANEL_SKIN_BASE[skinId].playfieldRectNormalized
    );
    const geometry = GEM_PANEL_GEOMETRY_BY_SURFACE[variant] ?? fallbackGeometry;

    return {
        ...GEM_PANEL_SKIN_BASE[skinId],
        id: skinId,
        artworkPath: asset.path,
        playfieldRectNormalized: geometry.playfieldRectNormalized,
        cellCentersNormalized: geometry.cellCentersNormalized,
        cellGridLinesNormalized: geometry.cellGridLinesNormalized,
        gemDiameterNormalized: geometry.gemDiameterNormalized,
    };
};

export const createShellSurfaceStyle = (
    theme: ThemeName,
    variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.background
): CSSProperties =>
    buildSurfaceStyle({
        theme,
        slot: 'shellBackground',
        variant,
        backgroundColor: '#020617',
        overlay: 'linear-gradient(180deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.00) 100%)',
    });

export const createTopBarSurfaceStyle = (
    theme: ThemeName,
    _variant?: SurfaceThemeVariant
): CSSProperties => {
    void theme;
    void _variant;
    return {
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        backgroundRepeat: 'no-repeat',
        borderColor: 'transparent',
        boxShadow: 'none',
    };
};

export const createGemPanelSurfaceStyle = (
    theme: ThemeName,
    variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.gemPanel
): CSSProperties =>
    buildSurfaceStyle({
        theme,
        slot: 'gemPanel',
        variant,
        backgroundColor: 'transparent',
        overlay: 'linear-gradient(180deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.00) 100%)',
        boxShadow: '0 18px 36px rgba(0,0,0,0.32)',
    });

export const createMarketSurfaceStyle = (
    _theme: ThemeName,
    _variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.background
): CSSProperties => (void _theme, void _variant, {});

export const normalizeGameShellSurfaceTheme = (
    surfaceTheme: SurfaceThemeSelections | undefined
): SurfaceThemeSelections =>
    surfaceTheme ? normalizeSurfaceThemeSelections(surfaceTheme) : DEFAULT_SURFACE_THEME_SELECTIONS;
