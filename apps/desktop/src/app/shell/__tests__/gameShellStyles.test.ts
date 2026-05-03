import { describe, expect, it } from 'vitest';
import type { ResponsiveLayout } from '@gemduel/shared/types';
import { createGameShellStyles } from '../gameShellStyles';
import {
    createPlayerZoneSurfaceArtwork,
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
    zoneHeightPx: 520,
    mainGapPx: 24,
};

describe('createGameShellStyles', () => {
    it('wires dark-only surface artwork slots into the game shell', () => {
        const styles = createGameShellStyles('dark', TEST_LAYOUT);

        expect(String(styles.shellStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/royal-luxury/dark/shell-background.png'
        );
        expect(styles.shellStyle.gridTemplateRows).toBe('120px 1520px 520px');
        expect(styles.shellStyle.backgroundSize).toBe('cover, 100% 1640px');
        expect(styles.shellStyle.backgroundPosition).toBe('center, top center');
        expect(styles).not.toHaveProperty('playMatSurfaceStyle');
        expect(String(styles.gemBoardSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/anime-themes/royal-luxury/dark/gem-panel.png'
        );
        expect(styles.gemPanelSkin.id).toBe('square-dashboard');
        expect(styles.gemPanelSkin.artworkPath).toBe(
            '/assets/surfaces/anime-themes/royal-luxury/dark/gem-panel.png'
        );
        expect(styles.marketSurfaceStyle).toEqual({});
        expect(styles.gemPanelSkin.cellCentersNormalized).toHaveLength(25);
        expect(styles.gemPanelSkin.gemDiameterNormalized).toBe(0.1325);
        expect(styles.shellStyle['--gd-shell-control-text' as keyof typeof styles.shellStyle]).toBe(
            '#f8fafc'
        );
        expect(styles.topBarSurfaceStyle.backgroundImage).toBe('none');
        expect(styles.topBarSurfaceStyle.height).toBe('120px');
        expect(styles.playerRailStyle.height).toBe('520px');
        expect(styles.effectsSkin).toBe('anime');
    });

    it('wires the bundled surface theme slots without resizing fixed surfaces', () => {
        const surfaceTheme: SurfaceThemeSelections = {
            background: 'dark-arcane',
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
        expect(styles.gemPanelSkin.cellCentersNormalized).toHaveLength(25);
        expect(styles.gemPanelSkin.gemDiameterNormalized).toBe(0.1371);
        expect(styles.topBarSurfaceStyle.backgroundImage).toBe('none');
        expect(styles.topBarSurfaceVariant).toBe('dark-arcane-shell-fill');
        expect(styles.effectsSkin).toBe('anime');
    });

    it('uses dedicated level card backs for every bundled surface theme', () => {
        expect(SURFACE_THEME_VARIANTS).toContain('pearl-opaline');
        expect(SURFACE_THEME_VARIANTS).toContain('lotus-porcelain');

        for (const variant of SURFACE_THEME_VARIANTS) {
            const surfaceTheme: SurfaceThemeSelections = {
                background: variant,
                gemPanel: variant,
                playerZone: variant,
                effects: 'anime',
            };
            const styles = createGameShellStyles('dark', TEST_LAYOUT, surfaceTheme);
            const paths = ([1, 2, 3] as const).map(
                (level) => styles.marketDeckBackArtwork?.[level]?.path
            );

            expect(paths).toEqual(
                ([1, 2, 3] as const).map(
                    (level) =>
                        `/assets/surfaces/anime-themes/${variant}/dark/market-card-back-l${level}.png`
                )
            );
            expect(new Set(paths).size).toBe(3);
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

        const style = createPlayerZoneSurfaceStyle('dark', 'royal-luxury', 'p2');
        const artwork = createPlayerZoneSurfaceArtwork('dark', 'royal-luxury', 'p2');

        expect(style?.backgroundImage).toContain(
            '/assets/surfaces/anime-themes/royal-luxury/dark/player-zone.png'
        );
        expect(style?.backgroundPosition).toBe('right center');
        expect(style?.backgroundImage).not.toContain('gradient');
        expect(artwork).toEqual({
            primaryPath: '/assets/surfaces/anime-themes/royal-luxury/dark/player-zone-p2.png',
            fallbackPath: '/assets/surfaces/anime-themes/royal-luxury/dark/player-zone.png',
            mirrorFallback: true,
            objectPosition: 'right center',
        });
    });
});
