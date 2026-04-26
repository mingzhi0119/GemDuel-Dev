import type { CSSProperties } from 'react';
import type { GemPanelSkin, ThemeName } from '@gemduel/shared/types';
import { GEM_PANEL_CANONICAL_PLAYFIELD_RECT } from '@gemduel/ui/components/gameBoard/gemPanelLayout';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
    normalizeSurfaceThemeSelections,
    type SurfaceThemeSelections,
    type SurfaceThemeVariant,
} from './surfaceTheme';

type SurfaceArtworkSlot = 'shellBackground' | 'tablecloth' | 'gemPanel' | 'marketBackground';
type GemPanelSkinId = 'dashboard' | 'square-dashboard';

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
    tablecloth: 'tablecloth',
    gemPanel: 'gem-panel',
    marketBackground: 'market-background',
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
    light: {
        shellBackground: {
            path: '/assets/surfaces/light/background-shell.png',
        },
        tablecloth: {
            path: '/assets/surfaces/light/tablecloth-playmat.png',
            position: 'center center',
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
        tablecloth: {
            path: '/assets/surfaces/dark/tablecloth-playmat.png',
            position: 'center center',
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

const getSurfaceArtworkAsset = (
    theme: ThemeName,
    slot: SurfaceArtworkSlot,
    variant: SurfaceThemeVariant = 'default'
): SurfaceArtworkAsset => {
    const baseAsset = SURFACE_ARTWORK[theme][slot];

    if (variant === 'default') {
        return baseAsset;
    }

    return {
        ...baseAsset,
        path: `/assets/surfaces/theme-presets/${theme}/${SURFACE_THEME_SLOT_PATHS[slot]}/${variant}.png`,
        ...(slot === 'gemPanel' ? { skinId: 'dashboard' as const } : {}),
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

    return {
        ...GEM_PANEL_SKIN_BASE[skinId],
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
                  'radial-gradient(circle at 50% 42%, rgba(251,252,252,0.97) 0%, rgba(244,247,246,0.93) 58%, rgba(238,242,241,0.98) 100%)',
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
    const darkBase =
        variant === 'default'
            ? {
                  background:
                      'linear-gradient(180deg, rgba(2,6,23,0.96) 0%, rgba(15,23,42,0.92) 100%)',
                  borderColor: 'rgba(51,65,85,0.82)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }
            : {
                  background:
                      'linear-gradient(90deg, rgba(2,6,23,0.97) 0%, rgba(15,23,42,0.94) 42%, rgba(30,41,59,0.90) 100%)',
                  borderColor: 'rgba(250,204,21,0.18)',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.34), inset 0 -1px 0 rgba(250,204,21,0.10)',
              };

    const lightBase =
        variant === 'default'
            ? {
                  background:
                      'linear-gradient(180deg, rgba(251,252,252,0.78) 0%, rgba(244,247,246,0.90) 100%)',
                  borderColor: 'rgba(15,23,42,0.08)',
                  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
              }
            : {
                  background:
                      'linear-gradient(90deg, rgba(255,255,255,0.88) 0%, rgba(248,250,252,0.82) 46%, rgba(226,232,240,0.78) 100%)',
                  borderColor: 'rgba(180,83,9,0.16)',
                  boxShadow: '0 10px 26px rgba(15,23,42,0.08), inset 0 -1px 0 rgba(180,83,9,0.10)',
              };

    return theme === 'dark' ? darkBase : lightBase;
};

export const createPlayMatSurfaceStyle = (
    theme: ThemeName,
    variant: SurfaceThemeVariant = 'default'
): CSSProperties =>
    theme === 'light'
        ? buildSurfaceStyle({
              theme,
              slot: 'tablecloth',
              variant,
              backgroundColor: 'rgba(255,255,255,0.54)',
              overlay:
                  'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(250,247,240,0.58) 100%)',
              border: '1px solid rgba(15,23,42,0.08)',
              boxShadow:
                  '0 12px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.82), inset 0 -8px 16px rgba(15,23,42,0.03)',
          })
        : buildSurfaceStyle({
              theme,
              slot: 'tablecloth',
              variant,
              backgroundColor: 'rgba(15,23,42,0.20)',
              overlay: 'linear-gradient(180deg, rgba(15,23,42,0.28) 0%, rgba(2,6,23,0.38) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)',
          });

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
    variant: SurfaceThemeVariant = 'default'
): CSSProperties =>
    theme === 'light'
        ? buildSurfaceStyle({
              theme,
              slot: 'marketBackground',
              variant,
              backgroundColor: 'rgba(255,255,255,0.48)',
              overlay:
                  'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(248,250,252,0.54) 100%)',
              border: '1px solid rgba(15,23,42,0.07)',
              boxShadow: '0 14px 32px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.74)',
          })
        : buildSurfaceStyle({
              theme,
              slot: 'marketBackground',
              variant,
              backgroundColor: 'rgba(2,6,23,0.24)',
              overlay: 'linear-gradient(180deg, rgba(15,23,42,0.16) 0%, rgba(2,6,23,0.24) 100%)',
              border: '1px solid rgba(255,255,255,0.04)',
              boxShadow: '0 18px 36px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.03)',
          });

export const normalizeGameShellSurfaceTheme = (
    surfaceTheme: SurfaceThemeSelections | undefined
): SurfaceThemeSelections =>
    surfaceTheme ? normalizeSurfaceThemeSelections(surfaceTheme) : DEFAULT_SURFACE_THEME_SELECTIONS;
