import type { CSSProperties } from 'react';
import type { GemPanelSkin, ThemeName } from '@gemduel/shared/types';
import { GEM_PANEL_CANONICAL_PLAYFIELD_RECT } from '@gemduel/ui/components/gameBoard/gemPanelLayout';
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

type SurfaceArtworkSlot = 'shellBackground' | 'gemPanel' | 'marketBackground';
type GemPanelSkinId = 'dashboard' | 'square-dashboard';
type SurfaceRuntimeMode = 'dark' | 'light';

interface SurfaceArtworkAsset {
    path: string;
    size?: string;
    position?: string;
    repeat?: string;
    skinId?: GemPanelSkinId;
}

type ThemeSurfaceArtwork = Record<SurfaceArtworkSlot, SurfaceArtworkAsset>;

const SURFACE_THEME_SLOT_PATHS: Record<SurfaceArtworkSlot, string> = {
    shellBackground: 'shell-background',
    gemPanel: 'gem-panel',
    marketBackground: 'market-background',
};
const SURFACE_THEME_RUNTIME_BASE_PATH = '/assets/surfaces/anime-themes';

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
    light: {
        shellBackground: {
            path: '/assets/surfaces/light/background-shell.png',
        },
        gemPanel: {
            path: '/assets/surfaces/light/panel-gem-board.png',
            size: '100% 100%',
            position: 'center center',
            skinId: 'dashboard',
        },
        marketBackground: {
            path: '/assets/surfaces/light/background-market.png',
            position: 'center top',
        },
    },
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
    const mode: SurfaceRuntimeMode = theme === 'dark' ? 'dark' : 'light';
    return `${SURFACE_THEME_RUNTIME_BASE_PATH}/${variant}/${mode}/${fileName}.png`;
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

    const mode: SurfaceRuntimeMode = theme === 'dark' ? 'dark' : 'light';
    const runtimeAssetName =
        slot === 'shellBackground'
            ? 'shell-background'
            : slot === 'gemPanel'
              ? 'gem-panel'
              : SURFACE_THEME_SLOT_PATHS[slot];

    return {
        ...baseAsset,
        path: `${SURFACE_THEME_RUNTIME_BASE_PATH}/${variant}/${mode}/${runtimeAssetName}.png`,
        ...(slot === 'gemPanel'
            ? {
                  size: '100% 100%',
                  position: 'center center',
                  skinId: 'square-dashboard' as const,
              }
            : {}),
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

const createTopBarArtworkSurfaceStyle = (theme: ThemeName, asset: string): CSSProperties => {
    return {
        backgroundColor: 'transparent',
        backgroundImage: `url("${asset}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderColor: theme === 'light' ? 'rgba(15,23,42,0.12)' : 'rgba(250,204,21,0.18)',
        boxShadow:
            theme === 'light'
                ? '0 10px 24px rgba(15,23,42,0.10)'
                : '0 12px 30px rgba(0,0,0,0.36), inset 0 -1px 0 rgba(250,204,21,0.12)',
    };
};

export const getGemPanelSkin = (
    theme: ThemeName,
    variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.gemPanel
): GemPanelSkin => {
    const asset = getSurfaceArtworkAsset(theme, 'gemPanel', variant);
    const skinId = asset.skinId ?? 'dashboard';

    return {
        ...GEM_PANEL_SKIN_BASE[skinId],
        id: skinId,
        artworkPath: asset.path,
    };
};

export const createShellSurfaceStyle = (
    theme: ThemeName,
    variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.background
): CSSProperties =>
    theme === 'light'
        ? buildSurfaceStyle({
              theme,
              slot: 'shellBackground',
              variant,
              backgroundColor: '#F4F7F6',
              overlay:
                  'linear-gradient(180deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.00) 100%)',
          })
        : buildSurfaceStyle({
              theme,
              slot: 'shellBackground',
              variant,
              backgroundColor: '#020617',
              overlay:
                  'radial-gradient(ellipse at top, rgba(30,41,59,0.92) 0%, rgba(15,17,26,0.94) 56%, rgba(2,6,23,0.98) 100%)',
          });

export const createTopBarSurfaceStyle = (
    theme: ThemeName,
    variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.topBar
): CSSProperties => {
    return createTopBarArtworkSurfaceStyle(
        theme,
        getSurfaceThemeAssetPath(theme, variant, 'topbar')
    );
};

export const createGemPanelSurfaceStyle = (
    theme: ThemeName,
    variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.gemPanel
): CSSProperties =>
    theme === 'light'
        ? buildSurfaceStyle({
              theme,
              slot: 'gemPanel',
              variant,
              backgroundColor: 'transparent',
              overlay:
                  'linear-gradient(180deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.00) 100%)',
              boxShadow: '0 16px 28px rgba(15,23,42,0.12)',
          })
        : buildSurfaceStyle({
              theme,
              slot: 'gemPanel',
              variant,
              backgroundColor: 'transparent',
              overlay:
                  'linear-gradient(180deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.00) 100%)',
              boxShadow: '0 18px 36px rgba(0,0,0,0.32)',
          });

export const createMarketSurfaceStyle = (
    theme: ThemeName,
    variant: SurfaceThemeVariant = DEFAULT_SURFACE_THEME_SELECTIONS.background
): CSSProperties => {
    void theme;
    void variant;
    return {};
};

export const normalizeGameShellSurfaceTheme = (
    surfaceTheme: SurfaceThemeSelections | undefined
): SurfaceThemeSelections =>
    surfaceTheme ? normalizeSurfaceThemeSelections(surfaceTheme) : DEFAULT_SURFACE_THEME_SELECTIONS;
