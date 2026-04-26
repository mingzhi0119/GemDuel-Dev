import { describe, expect, it } from 'vitest';
import type { ResponsiveLayout } from '@gemduel/shared/types';
import { GEM_PANEL_CANONICAL_PLAYFIELD_RECT } from '@gemduel/ui/components/gameBoard/gemPanelLayout';
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
        expect(styles.gemPanelSkin.playfieldRectNormalized).toEqual(
            GEM_PANEL_CANONICAL_PLAYFIELD_RECT
        );
        expect(String(styles.marketSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/light/background-market.png'
        );
        expect(styles.topBarSurfaceStyle.background).toContain('linear-gradient');
        expect(styles.effectsSkin).toBe('anime');
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
            '/assets/surfaces/dark/panel-gem-board-square.png'
        );
        expect(styles.gemPanelSkin.id).toBe('square-dashboard');
        expect(styles.gemPanelSkin.artworkPath).toBe(
            '/assets/surfaces/dark/panel-gem-board-square.png'
        );
        expect(String(styles.marketSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/dark/background-market.png'
        );
        expect(styles.gemPanelSkin.playfieldRectNormalized).toEqual(
            GEM_PANEL_CANONICAL_PLAYFIELD_RECT
        );
        expect(styles.effectsSkin).toBe('anime');
    });

    it('wires the bundled surface theme slots without resizing fixed surfaces', () => {
        const surfaceTheme: SurfaceThemeSelections = {
            background: 'geek',
            topBar: 'royal',
            gemPanel: 'minimal',
            playerZone: 'wood',
            effects: 'anime',
        };
        const styles = createGameShellStyles('dark', TEST_LAYOUT, surfaceTheme);

        expect(String(styles.shellStyle.backgroundImage)).toContain(
            '/assets/surfaces/theme-presets/dark/shell-background/geek.png'
        );
        expect(String(styles.playMatSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/dark/tablecloth-playmat.png'
        );
        expect(String(styles.gemBoardSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/theme-presets/dark/gem-panel/minimal.png'
        );
        expect(styles.gemPanelSkin.artworkPath).toBe(
            '/assets/surfaces/theme-presets/dark/gem-panel/minimal.png'
        );
        expect(String(styles.marketSurfaceStyle.backgroundImage)).toContain(
            '/assets/surfaces/dark/background-market.png'
        );
        expect(styles.gemPanelSkin.playfieldRectNormalized).toEqual(
            GEM_PANEL_CANONICAL_PLAYFIELD_RECT
        );
        expect(styles.topBarSurfaceStyle.background).toContain('linear-gradient');
        expect(styles.effectsSkin).toBe('anime');
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
