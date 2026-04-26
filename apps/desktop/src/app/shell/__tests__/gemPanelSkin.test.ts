import { describe, expect, it } from 'vitest';
import {
    calculateGemPanelFootprintPx,
    getGemPanelCellCentersNormalized,
} from '@gemduel/ui/components/gameBoard/gemPanelLayout';
import { getGemPanelSkin } from '../surfaceArtwork';
import { SURFACE_THEME_VARIANTS } from '../surfaceTheme';

describe('gem panel skin geometry', () => {
    it('exposes the square dashboard skin geometry for the dark default panel', () => {
        const skin = getGemPanelSkin('dark');

        expect(skin.id).toBe('square-dashboard');
        expect(skin.intrinsicWidthPx).toBe(1254);
        expect(skin.intrinsicHeightPx).toBe(1254);
        expect(skin.playfieldRectNormalized).toEqual({
            left: 0.085,
            top: 0.085,
            right: 0.915,
            bottom: 0.915,
        });
    });

    it('derives normalized 5x5 cell centers and a fixed footprint from the canonical skin', () => {
        const skin = getGemPanelSkin('light');
        const centers = getGemPanelCellCentersNormalized(skin);
        const footprint = calculateGemPanelFootprintPx(skin);

        expect(centers).toHaveLength(25);
        expect(centers[0]).toEqual({
            x: expect.closeTo(0.168, 5),
            y: expect.closeTo(0.168, 5),
        });
        expect(centers[12]).toEqual({
            x: expect.closeTo(0.5, 5),
            y: expect.closeTo(0.5, 5),
        });
        expect(centers[24]).toEqual({
            x: expect.closeTo(0.832, 5),
            y: expect.closeTo(0.832, 5),
        });
        expect(footprint.widthPx).toBe(452);
        expect(footprint.heightPx).toBe(452);
    });

    it('keeps every gem panel theme variant at the same layout footprint', () => {
        const footprints = SURFACE_THEME_VARIANTS.map((variant) =>
            calculateGemPanelFootprintPx(getGemPanelSkin('dark', variant))
        );

        expect(footprints).toEqual(
            SURFACE_THEME_VARIANTS.map(() => ({
                widthPx: 452,
                heightPx: 452,
            }))
        );
    });
});
