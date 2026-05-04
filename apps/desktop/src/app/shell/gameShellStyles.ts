import type { CSSProperties } from 'react';
import type { GemPanelSkin, ResponsiveLayout, ThemeName } from '@gemduel/shared/types';
import type { MarketDeckBackArtworkMap } from '@gemduel/ui/components/card/cardBackArtwork';
import {
    createGemPanelSurfaceStyle,
    createMarketSurfaceStyle,
    createShellSurfaceStyle,
    createTopBarSurfaceStyle,
    getGemPanelSkin,
    getSurfaceThemeMarketDeckBackArtwork,
    normalizeGameShellSurfaceTheme,
} from './surfaceArtwork';
import type {
    SurfaceEffectsSkin,
    SurfaceThemeSelections,
    SurfaceThemeVariant,
} from './surfaceTheme';
import {
    DESKTOP_CENTER_HEIGHT_PX,
    DESKTOP_TOP_BAR_HEIGHT_PX,
    DESKTOP_ZONE_HEIGHT_PX,
} from '../layout/desktopLayoutContract';

interface SurfaceTextPalette {
    primary: string;
    muted: string;
    goal: string;
    gold: string;
    action: string;
    control: string;
    controlMuted: string;
    playerOne: string;
    playerTwo: string;
    divider: string;
    shadow: string;
    controlShadow: string;
    chromeHoverIcon: string;
    chromeHoverBackground: string;
}

type SurfaceTextVariableStyle = CSSProperties & Record<`--gd-${string}`, string>;

const DESKTOP_SHELL_GRID_ROWS = `${DESKTOP_TOP_BAR_HEIGHT_PX}px ${DESKTOP_CENTER_HEIGHT_PX}px ${DESKTOP_ZONE_HEIGHT_PX}px`;

const createDesktopShellGridStyle = (layout: ResponsiveLayout): CSSProperties =>
    layout.layoutMode === 'desktop-4k'
        ? {
              gridTemplateRows: DESKTOP_SHELL_GRID_ROWS,
          }
        : {};

const createDesktopTopBarContractStyle = (layout: ResponsiveLayout): CSSProperties =>
    layout.layoutMode === 'desktop-4k'
        ? {
              height: `${DESKTOP_TOP_BAR_HEIGHT_PX}px`,
          }
        : {};

const DARK_FIELD_PALETTE: SurfaceTextPalette = {
    primary: '#f8fafc',
    muted: '#e2e8f0',
    goal: '#f8fafc',
    gold: '#fde68a',
    action: '#f8fafc',
    control: '#f8fafc',
    controlMuted: '#dbeafe',
    playerOne: '#10b981',
    playerTwo: '#3b82f6',
    divider: 'rgba(71,85,105,0.7)',
    shadow: '0 2px 5px rgba(0,0,0,0.86)',
    controlShadow: '0 2px 5px rgba(0,0,0,0.82)',
    chromeHoverIcon: '#ffffff',
    chromeHoverBackground: 'rgba(15,23,42,0.38)',
};

const DARK_TOPBAR_PALETTE: SurfaceTextPalette = {
    primary: '#f8fafc',
    muted: '#dbeafe',
    goal: '#f8fafc',
    gold: '#fde047',
    action: '#f8fafc',
    control: '#f8fafc',
    controlMuted: '#dbeafe',
    playerOne: '#10b981',
    playerTwo: '#3b82f6',
    divider: 'rgba(71,85,105,0.7)',
    shadow: '0 2px 5px rgba(0,0,0,0.88)',
    controlShadow: '0 2px 5px rgba(0,0,0,0.82)',
    chromeHoverIcon: '#ffffff',
    chromeHoverBackground: 'rgba(15,23,42,0.38)',
};

const LIGHT_OXFORD_INK = '#002147';
const LIGHT_MATTE_INK = '#212121';

const LIGHT_FIELD_PALETTE: SurfaceTextPalette = {
    primary: LIGHT_OXFORD_INK,
    muted: LIGHT_MATTE_INK,
    goal: LIGHT_OXFORD_INK,
    gold: '#facc15',
    action: LIGHT_OXFORD_INK,
    control: LIGHT_OXFORD_INK,
    controlMuted: LIGHT_MATTE_INK,
    playerOne: '#047857',
    playerTwo: '#1d4ed8',
    divider: 'rgba(100,116,139,0.52)',
    shadow: '0 1px 1px rgba(255,255,255,0.72)',
    controlShadow: '0 1px 1px rgba(255,255,255,0.68)',
    chromeHoverIcon: LIGHT_OXFORD_INK,
    chromeHoverBackground: 'rgba(255,255,255,0.72)',
};

const LIGHT_TOPBAR_PALETTE: SurfaceTextPalette = {
    primary: LIGHT_OXFORD_INK,
    muted: LIGHT_MATTE_INK,
    goal: LIGHT_OXFORD_INK,
    gold: '#facc15',
    action: LIGHT_OXFORD_INK,
    control: LIGHT_OXFORD_INK,
    controlMuted: LIGHT_MATTE_INK,
    playerOne: '#047857',
    playerTwo: '#1d4ed8',
    divider: 'rgba(100,116,139,0.52)',
    shadow: '0 1px 1px rgba(255,255,255,0.78)',
    controlShadow: '0 1px 1px rgba(255,255,255,0.7)',
    chromeHoverIcon: LIGHT_OXFORD_INK,
    chromeHoverBackground: 'rgba(255,255,255,0.72)',
};

const LIGHT_TEXT_SURFACE_VARIANTS = new Set<SurfaceThemeVariant>([
    'pearl-opaline',
    'lotus-porcelain',
]);

const getFieldPalette = (theme: ThemeName, variant: SurfaceThemeVariant): SurfaceTextPalette => {
    void theme;
    return LIGHT_TEXT_SURFACE_VARIANTS.has(variant) ? LIGHT_FIELD_PALETTE : DARK_FIELD_PALETTE;
};

const getTopBarPalette = (theme: ThemeName, variant: SurfaceThemeVariant): SurfaceTextPalette => {
    void theme;
    return LIGHT_TEXT_SURFACE_VARIANTS.has(variant) ? LIGHT_TOPBAR_PALETTE : DARK_TOPBAR_PALETTE;
};

const createSurfaceTextVariableStyle = (
    theme: ThemeName,
    fieldVariant: SurfaceThemeVariant
): SurfaceTextVariableStyle => {
    const field = getFieldPalette(theme, fieldVariant);
    const topBar = getTopBarPalette(theme, fieldVariant);

    return {
        '--gd-shell-label-primary': field.primary,
        '--gd-shell-label-muted': field.muted,
        '--gd-shell-goal-text': field.goal,
        '--gd-shell-gold-text': field.gold,
        '--gd-shell-action-text': field.action,
        '--gd-shell-control-text': field.control,
        '--gd-shell-control-muted': field.controlMuted,
        '--gd-shell-text-shadow': field.shadow,
        '--gd-shell-control-text-shadow': field.controlShadow,
        '--gd-shell-p1-text': field.playerOne,
        '--gd-shell-p2-text': field.playerTwo,
        '--gd-shell-divider': field.divider,
        '--gd-topbar-label-primary': topBar.primary,
        '--gd-topbar-label-muted': topBar.muted,
        '--gd-topbar-goal-text': topBar.goal,
        '--gd-topbar-gold-text': topBar.gold,
        '--gd-topbar-action-text': topBar.action,
        '--gd-topbar-control-text': topBar.control,
        '--gd-topbar-control-muted': topBar.controlMuted,
        '--gd-topbar-text-shadow': topBar.shadow,
        '--gd-topbar-control-text-shadow': topBar.controlShadow,
        '--gd-topbar-p1-text': topBar.playerOne,
        '--gd-topbar-p2-text': topBar.playerTwo,
        '--gd-topbar-divider': topBar.divider,
        '--gd-chrome-icon': topBar.primary,
        '--gd-chrome-icon-hover': topBar.chromeHoverIcon,
        '--gd-chrome-focus': topBar.gold,
        '--gd-chrome-hover-bg': topBar.chromeHoverBackground,
        '--gd-chrome-text-shadow': topBar.shadow,
    } as SurfaceTextVariableStyle;
};

export interface GameShellStyles {
    shellStyle: CSSProperties;
    topBarSurfaceStyle: CSSProperties;
    scaledZoneWrapperStyle: CSSProperties;
    playerRailStyle: CSSProperties;
    gemBoardSurfaceStyle: CSSProperties;
    gemPanelSkin: GemPanelSkin;
    marketSurfaceStyle: CSSProperties;
    marketDeckBackArtwork?: MarketDeckBackArtworkMap;
    effectsSkin: SurfaceEffectsSkin;
    shellSurfaceVariant: string;
    topBarSurfaceVariant: string;
}

export const createGameShellStyles = (
    theme: ThemeName,
    layout: ResponsiveLayout,
    surfaceTheme?: SurfaceThemeSelections
): GameShellStyles => {
    const resolvedSurfaceTheme = normalizeGameShellSurfaceTheme(surfaceTheme);
    const shellVariant = resolvedSurfaceTheme.background;
    const shellStyle = {
        ...createShellSurfaceStyle(theme, resolvedSurfaceTheme.background),
        ...createSurfaceTextVariableStyle(theme, shellVariant),
        ...createDesktopShellGridStyle(layout),
    } as CSSProperties;

    return {
        shellStyle,
        topBarSurfaceStyle: {
            ...createTopBarSurfaceStyle(theme, resolvedSurfaceTheme.background),
            ...createDesktopTopBarContractStyle(layout),
        } as CSSProperties,
        scaledZoneWrapperStyle: {
            width: `${100 / layout.zoneScale}%`,
            height: `${100 / layout.zoneScale}%`,
            transform: `scale(${layout.zoneScale})`,
            transformOrigin: 'center center',
        } as CSSProperties,
        playerRailStyle: {
            height: `${layout.zoneHeightPx}px`,
            background: 'transparent',
            borderTop: '1px solid rgba(148,163,184,0.18)',
            boxShadow: 'none',
        } as CSSProperties,
        gemBoardSurfaceStyle: createGemPanelSurfaceStyle(theme, resolvedSurfaceTheme.gemPanel),
        gemPanelSkin: getGemPanelSkin(theme, resolvedSurfaceTheme.gemPanel),
        marketSurfaceStyle: createMarketSurfaceStyle(theme, resolvedSurfaceTheme.background),
        marketDeckBackArtwork: getSurfaceThemeMarketDeckBackArtwork(
            theme,
            resolvedSurfaceTheme.background
        ),
        effectsSkin: resolvedSurfaceTheme.effects,
        shellSurfaceVariant: resolvedSurfaceTheme.background,
        topBarSurfaceVariant: `${resolvedSurfaceTheme.background}-shell-fill`,
    };
};
