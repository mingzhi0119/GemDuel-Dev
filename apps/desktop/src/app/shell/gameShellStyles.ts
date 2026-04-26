import type { CSSProperties } from 'react';
import type { GemPanelSkin, ResponsiveLayout, ThemeName } from '@gemduel/shared/types';
import {
    createGemPanelSurfaceStyle,
    createMarketSurfaceStyle,
    createPlayMatSurfaceStyle,
    createShellSurfaceStyle,
    createTopBarSurfaceStyle,
    getGemPanelSkin,
    normalizeGameShellSurfaceTheme,
} from './surfaceArtwork';
import type { SurfaceEffectsSkin, SurfaceThemeSelections } from './surfaceTheme';

export interface GameShellStyles {
    shellStyle: CSSProperties;
    topBarSurfaceStyle: CSSProperties;
    scaledZoneWrapperStyle: CSSProperties;
    playMatSurfaceStyle: CSSProperties;
    playMatDividerStyle: CSSProperties;
    playerRailStyle: CSSProperties;
    gemBoardSurfaceStyle: CSSProperties;
    gemPanelSkin: GemPanelSkin;
    marketSurfaceStyle: CSSProperties;
    effectsSkin: SurfaceEffectsSkin;
}

export const createGameShellStyles = (
    theme: ThemeName,
    layout: ResponsiveLayout,
    surfaceTheme?: SurfaceThemeSelections
): GameShellStyles => {
    const resolvedSurfaceTheme = normalizeGameShellSurfaceTheme(surfaceTheme);

    return {
        shellStyle: createShellSurfaceStyle(theme, resolvedSurfaceTheme.background),
        topBarSurfaceStyle: createTopBarSurfaceStyle(theme, resolvedSurfaceTheme.topBar),
        scaledZoneWrapperStyle: {
            width: `${100 / layout.zoneScale}%`,
            height: `${100 / layout.zoneScale}%`,
            transform: `scale(${layout.zoneScale})`,
            transformOrigin: 'center center',
        } as CSSProperties,
        playMatSurfaceStyle: createPlayMatSurfaceStyle(theme),
        playMatDividerStyle:
            theme === 'light'
                ? ({ backgroundColor: 'rgba(15,23,42,0.08)' } as CSSProperties)
                : ({ backgroundColor: 'rgba(148,163,184,0.12)' } as CSSProperties),
        playerRailStyle: {
            height: `${layout.zoneHeightPx}px`,
            ...(theme === 'light'
                ? {
                      background:
                          'linear-gradient(180deg, rgba(251,252,252,0.78) 0%, rgba(244,247,246,0.92) 100%)',
                      borderTop: '1px solid rgba(15,23,42,0.08)',
                      boxShadow: '0 -10px 20px rgba(15,23,42,0.04)',
                  }
                : {
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                  }),
        } as CSSProperties,
        gemBoardSurfaceStyle: createGemPanelSurfaceStyle(theme, resolvedSurfaceTheme.gemPanel),
        gemPanelSkin: getGemPanelSkin(theme, resolvedSurfaceTheme.gemPanel),
        marketSurfaceStyle: createMarketSurfaceStyle(theme),
        effectsSkin: resolvedSurfaceTheme.effects,
    };
};
