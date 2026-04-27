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

interface SurfaceTextPalette {
    primary: string;
    muted: string;
    goal: string;
    gold: string;
    action: string;
    control: string;
    controlMuted: string;
    shadow: string;
    controlShadow: string;
}

type SurfaceTextVariableStyle = CSSProperties & Record<`--gd-${string}`, string>;

const DARK_FIELD_PALETTE: SurfaceTextPalette = {
    primary: '#f8fafc',
    muted: '#e2e8f0',
    goal: '#f8fafc',
    gold: '#fde68a',
    action: '#f8fafc',
    control: '#f8fafc',
    controlMuted: '#dbeafe',
    shadow: '0 2px 5px rgba(0,0,0,0.86)',
    controlShadow: '0 2px 5px rgba(0,0,0,0.82)',
};

const DARK_TOPBAR_PALETTE: SurfaceTextPalette = {
    primary: '#f8fafc',
    muted: '#dbeafe',
    goal: '#f8fafc',
    gold: '#fde047',
    action: '#f8fafc',
    control: '#f8fafc',
    controlMuted: '#dbeafe',
    shadow: '0 2px 5px rgba(0,0,0,0.88)',
    controlShadow: '0 2px 5px rgba(0,0,0,0.82)',
};

const getFieldPalette = (theme: ThemeName, variant: SurfaceThemeVariant): SurfaceTextPalette => {
    void theme;
    void variant;
    return DARK_FIELD_PALETTE;
};

const getTopBarPalette = (theme: ThemeName): SurfaceTextPalette => {
    void theme;
    return DARK_TOPBAR_PALETTE;
};

const createSurfaceTextVariableStyle = (
    theme: ThemeName,
    fieldVariant: SurfaceThemeVariant
): SurfaceTextVariableStyle => {
    const field = getFieldPalette(theme, fieldVariant);
    const topBar = getTopBarPalette(theme);

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
        '--gd-topbar-label-primary': topBar.primary,
        '--gd-topbar-label-muted': topBar.muted,
        '--gd-topbar-goal-text': topBar.goal,
        '--gd-topbar-gold-text': topBar.gold,
        '--gd-topbar-action-text': topBar.action,
        '--gd-topbar-control-text': topBar.control,
        '--gd-topbar-control-muted': topBar.controlMuted,
        '--gd-topbar-text-shadow': topBar.shadow,
        '--gd-topbar-control-text-shadow': topBar.controlShadow,
        '--gd-chrome-icon': topBar.primary,
        '--gd-chrome-icon-hover': '#ffffff',
        '--gd-chrome-focus': topBar.gold,
        '--gd-chrome-hover-bg': 'rgba(15,23,42,0.38)',
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
    } as CSSProperties;

    return {
        shellStyle,
        topBarSurfaceStyle: createTopBarSurfaceStyle(theme, resolvedSurfaceTheme.topBar),
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
        marketSurfaceStyle: createMarketSurfaceStyle(theme),
        marketDeckBackArtwork: getSurfaceThemeMarketDeckBackArtwork(
            theme,
            resolvedSurfaceTheme.background
        ),
        effectsSkin: resolvedSurfaceTheme.effects,
        shellSurfaceVariant: resolvedSurfaceTheme.background,
        topBarSurfaceVariant: resolvedSurfaceTheme.topBar,
    };
};
