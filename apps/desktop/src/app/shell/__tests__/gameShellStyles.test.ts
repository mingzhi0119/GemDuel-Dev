import { describe, expect, it } from 'vitest';
import type { ResponsiveLayout } from '@gemduel/shared/types';
import { createGameShellStyles } from '../gameShellStyles';
import {
    createPlayerZoneSurfaceStyle,
    getPlayerZoneSurfaceVariant,
} from '../playerZoneSurfaceStyles';
import type { SurfaceThemeSelections } from '../surfaceTheme';

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
            '/assets/surfaces/light/background-shell.png'
        );
        expect(String(styles.playMatSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/light/tablecloth-playmat.png'
        );
        expect(String(styles.gemBoardSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/light/panel-gem-board.png'
        );
        expect(styles.gemPanelSkin.id).toBe('dashboard');
        expect(styles.gemPanelSkin.artworkPath).toBe('/assets/surfaces/light/panel-gem-board.png');
        expect(styles.gemPanelSkin.playfieldRectNormalized).toEqual({
            left: 0.1922,
            top: 0.1571,
            right: 0.807,
            bottom: 0.7871,
        });
        expect(String(styles.marketSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/light/background-market.png'
        );
    });

    it('wires dark mode surface artwork slots into the game shell', () => {
        const styles = createGameShellStyles('dark', TEST_LAYOUT);

        expect(String(styles.shellStyle.backgroundImage)).toContain(
            '/assets/surfaces/dark/background-shell.png'
        );
        expect(String(styles.playMatSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/dark/tablecloth-playmat.png'
        );
        expect(String(styles.gemBoardSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/dark/panel-gem-board.png'
        );
        expect(styles.gemPanelSkin.id).toBe('dashboard');
        expect(styles.gemPanelSkin.artworkPath).toBe('/assets/surfaces/dark/panel-gem-board.png');
        expect(String(styles.marketSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/dark/background-market.png'
        );
    });

    it('wires independent surface theme variants into their slots', () => {
        const surfaceTheme: SurfaceThemeSelections = {
            shellBackground: 'geek',
            tablecloth: 'royal',
            gemPanel: 'minimal',
            marketBackground: 'wood',
            playerZone: 'default',
        };
        const styles = createGameShellStyles('dark', TEST_LAYOUT, surfaceTheme);

        expect(String(styles.shellStyle.backgroundImage)).toContain(
            '/assets/surfaces/theme-presets/dark/shell-background/geek.png'
        );
        expect(String(styles.playMatSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/theme-presets/dark/tablecloth/royal.png'
        );
        expect(String(styles.gemBoardSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/theme-presets/dark/gem-panel/minimal.png'
        );
        expect(styles.gemPanelSkin.artworkPath).toBe(
            '/assets/surfaces/theme-presets/dark/gem-panel/minimal.png'
        );
        expect(String(styles.marketSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/theme-presets/dark/market-background/wood.png'
        );
    });
});

describe('player zone surface preview styles', () => {
    it('defaults to no player zone artwork without a preview query parameter', () => {
        window.history.replaceState({}, '', '/');

        expect(getPlayerZoneSurfaceVariant()).toBe('none');
        expect(createPlayerZoneSurfaceStyle('dark', 'none', 'p1')).toBeUndefined();
        expect(createPlayerZoneSurfaceStyle('dark', 'default', 'p1')).toBeUndefined();
    });

    it('wires known preview variants to theme-specific player zone artwork', () => {
        window.history.replaceState({}, '', '/?playerZoneBg=royal');

        const style = createPlayerZoneSurfaceStyle('light', getPlayerZoneSurfaceVariant(), 'p2');

        expect(style?.backgroundImage).toContain('/assets/surfaces/player-zones/light/royal.png');
        expect(style?.backgroundPosition).toContain('right center');
    });
});
