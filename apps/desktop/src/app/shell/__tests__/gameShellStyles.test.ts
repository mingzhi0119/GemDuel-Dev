import { describe, expect, it } from 'vitest';
import type { ResponsiveLayout } from '@gemduel/shared/types';
import { GEM_PANEL_CANONICAL_PLAYFIELD_RECT } from '@gemduel/ui/components/gameBoard/gemPanelLayout';
import { createGameShellStyles } from '../gameShellStyles';
import {
    createPlayerZoneSurfaceStyle,
    getPlayerZoneSurfaceVariant,
} from '../playerZoneSurfaceStyles';
import { SURFACE_THEME_VARIANTS, type SurfaceThemeSelections } from '../surfaceTheme';

const TEST_LAYOUT: ResponsiveLayout = {
    layoutMode: 'desktop-4k',
    viewportWidth: 3840,
    viewportHeight: 2160,
    aspectRatio: 16 / 9,
    stageCanvasWidthPx: 3840,
    stageCanvasHeightPx: 2160,
    stageScale: 1,
    stageInsetXPx: 0,
    stageInsetYPx: 0,
    boardScale: 1,
    deckScale: 1,
    zoneScale: 1,
    zoneHeightPx: 420,
    mainGapPx: 24,
};

describe('createGameShellStyles', () => {
    it('wires light mode surface artwork slots into the game shell', () => {
        const styles = createGameShellStyles('light', TEST_LAYOUT);

        expect(String(styles.shellStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/crystal-anime/light/shell-background.png'
        );
        expect(styles).not.toHaveProperty('playMatSurfaceStyle');
        expect(String(styles.gemBoardSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/crystal-anime/light/gem-panel.png'
        );
        expect(styles.gemPanelSkin.id).toBe('square-dashboard');
        expect(styles.gemPanelSkin.artworkPath).toBe(
            '/assets/surfaces/anime-themes/crystal-anime/light/gem-panel.png'
        );
        expect(styles.gemPanelSkin.playfieldRectNormalized).toEqual(
            GEM_PANEL_CANONICAL_PLAYFIELD_RECT
        );
        expect(styles.marketSurfaceStyle).toEqual({});
        expect(String(styles.topBarSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/crystal-anime/light/topbar.png'
        );
        expect(String(styles.topBarSurfaceStyle.backgroundImage)).not.toContain('gradient');
        expect(styles.marketDeckBackArtwork?.[1]?.path).toContain(
            '/assets/surfaces/anime-themes/crystal-anime/light/market-card-back-l1.png'
        );
        expect(
            styles.shellStyle['--gd-shell-label-primary' as keyof typeof styles.shellStyle]
        ).toBe('#f8fafc');
        expect(styles.shellStyle['--gd-topbar-goal-text' as keyof typeof styles.shellStyle]).toBe(
            '#f8fafc'
        );
        expect(styles.shellStyle['--gd-shell-control-text' as keyof typeof styles.shellStyle]).toBe(
            '#102033'
        );
        expect(styles.effectsSkin).toBe('anime');
    });

    it('wires dark mode surface artwork slots into the game shell', () => {
        const styles = createGameShellStyles('dark', TEST_LAYOUT);

        expect(String(styles.shellStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png'
        );
        expect(styles).not.toHaveProperty('playMatSurfaceStyle');
        expect(String(styles.gemBoardSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/crystal-anime/dark/gem-panel.png'
        );
        expect(styles.gemPanelSkin.id).toBe('square-dashboard');
        expect(styles.gemPanelSkin.artworkPath).toBe(
            '/assets/surfaces/anime-themes/crystal-anime/dark/gem-panel.png'
        );
        expect(styles.marketSurfaceStyle).toEqual({});
        expect(styles.gemPanelSkin.playfieldRectNormalized).toEqual(
            GEM_PANEL_CANONICAL_PLAYFIELD_RECT
        );
        expect(styles.effectsSkin).toBe('anime');
    });

    it('wires the bundled surface theme slots without resizing fixed surfaces', () => {
        const surfaceTheme: SurfaceThemeSelections = {
            background: 'dark-arcane',
            topBar: 'royal-luxury',
            gemPanel: 'clean-boardgame',
            playerZone: 'crystal-anime',
            effects: 'anime',
        };
        const styles = createGameShellStyles('dark', TEST_LAYOUT, surfaceTheme);

        expect(String(styles.shellStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/dark-arcane/dark/shell-background.png'
        );
        expect(styles).not.toHaveProperty('playMatSurfaceStyle');
        expect(String(styles.gemBoardSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/clean-boardgame/dark/gem-panel.png'
        );
        expect(styles.gemPanelSkin.artworkPath).toBe(
            '/assets/surfaces/anime-themes/clean-boardgame/dark/gem-panel.png'
        );
        expect(styles.marketSurfaceStyle).toEqual({});
        expect(styles.gemPanelSkin.playfieldRectNormalized).toEqual(
            GEM_PANEL_CANONICAL_PLAYFIELD_RECT
        );
        expect(String(styles.topBarSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/royal-luxury/dark/topbar.png'
        );
        expect(styles.effectsSkin).toBe('anime');
    });

    it('uses high-contrast shell label variables for dark-field light themes', () => {
        const styles = createGameShellStyles('light', TEST_LAYOUT, {
            background: 'dark-arcane',
            topBar: 'dark-arcane',
            gemPanel: 'dark-arcane',
            playerZone: 'dark-arcane',
            effects: 'anime',
        });

        expect(
            styles.shellStyle['--gd-shell-label-primary' as keyof typeof styles.shellStyle]
        ).toBe('#f8fafc');
        expect(styles.shellStyle['--gd-shell-gold-text' as keyof typeof styles.shellStyle]).toBe(
            '#fbbf24'
        );
        expect(
            String(styles.shellStyle['--gd-shell-text-shadow' as keyof typeof styles.shellStyle])
        ).toContain('rgba(0,0,0');
    });

    it('uses dedicated level card backs for every bundled surface theme', () => {
        for (const theme of ['dark', 'light'] as const) {
            for (const variant of SURFACE_THEME_VARIANTS) {
                const surfaceTheme: SurfaceThemeSelections = {
                    background: variant,
                    topBar: variant,
                    gemPanel: variant,
                    playerZone: variant,
                    effects: 'anime',
                };
                const styles = createGameShellStyles(theme, TEST_LAYOUT, surfaceTheme);
                const paths = ([1, 2, 3] as const).map(
                    (level) => styles.marketDeckBackArtwork?.[level]?.path
                );

                expect(paths).toEqual(
                    ([1, 2, 3] as const).map(
                        (level) =>
                            `/assets/surfaces/anime-themes/${variant}/${theme}/market-card-back-l${level}.png`
                    )
                );
                expect(new Set(paths).size).toBe(3);
            }
        }
    });
});

describe('player zone surface preview styles', () => {
    it('defaults to no player zone artwork without a preview query parameter', () => {
        window.history.replaceState({}, '', '/');

        expect(getPlayerZoneSurfaceVariant()).toBe('none');
        expect(createPlayerZoneSurfaceStyle('dark', 'none', 'p1')).toBeUndefined();
    });

    it('wires selected theme variants to runtime anime player zone artwork', () => {
        window.history.replaceState({}, '', '/');

        const style = createPlayerZoneSurfaceStyle('light', 'royal-luxury', 'p2');

        expect(style?.backgroundImage).toContain(
            '/assets/surfaces/anime-themes/royal-luxury/light/player-zone.png'
        );
        expect(style?.backgroundPosition).toBe('right center');
        expect(style?.backgroundImage).not.toContain('gradient');
    });
});
