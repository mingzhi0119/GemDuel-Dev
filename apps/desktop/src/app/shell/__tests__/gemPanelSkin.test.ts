import { describe, expect, it } from 'vitest';
import {
    calculateGemPanelCellCentersFromIntersections,
    calculateGemPanelFootprintPx,
    calculateGemPanelGemDiameterPx,
    getGemPanelCellCentersNormalized,
} from '@gemduel/ui/components/gameBoard/gemPanelLayout';
import { getGemPanelSkin } from '../surfaceArtwork';
import { SURFACE_THEME_VARIANTS } from '../surfaceTheme';

describe('gem panel skin geometry', () => {
    it('calculates cell centers from grid-line intersections', () => {
        const centers = calculateGemPanelCellCentersFromIntersections({
            x: [0.1, 0.26, 0.42, 0.58, 0.74, 0.9],
            y: [0.08, 0.24, 0.4, 0.56, 0.72, 0.88],
        });

        expect(centers).toHaveLength(25);
        expect(centers[0]).toEqual({
            x: expect.closeTo(0.18, 5),
            y: expect.closeTo(0.16, 5),
        });
        expect(centers[12]).toEqual({
            x: expect.closeTo(0.5, 5),
            y: expect.closeTo(0.48, 5),
        });
    });

    it('exposes calibrated square dashboard skin geometry for the default panel', () => {
        const skin = getGemPanelSkin('dark');

        expect(skin.id).toBe('square-dashboard');
        expect(skin.intrinsicWidthPx).toBe(1254);
        expect(skin.intrinsicHeightPx).toBe(1254);
        expect(skin.playfieldRectNormalized).toEqual({
            left: 0.0941,
            top: 0.0941,
            right: 0.9043,
            bottom: 0.9019,
        });
        expect(skin.cellCentersNormalized).toHaveLength(25);
        expect(skin.cellGridLinesNormalized).toEqual({
            x: [0.0941, 0.2561, 0.4182, 0.5802, 0.7423, 0.9043],
            y: [0.0941, 0.2557, 0.4172, 0.5788, 0.7404, 0.9019],
        });
        expect(skin.gemDiameterNormalized).toBe(0.1325);
    });

    it('resolves normalized 5x5 cell centers and a fixed footprint from the calibrated skin', () => {
        const skin = getGemPanelSkin('dark');
        const centers = getGemPanelCellCentersNormalized(skin);
        const footprint = calculateGemPanelFootprintPx(skin);

        expect(centers).toHaveLength(25);
        expect(centers[0]).toEqual({
            x: expect.closeTo(0.1751, 5),
            y: expect.closeTo(0.1749, 5),
        });
        expect(centers[12]).toEqual({
            x: expect.closeTo(0.4992, 5),
            y: expect.closeTo(0.498, 5),
        });
        expect(centers[24]).toEqual({
            x: expect.closeTo(0.8233, 5),
            y: expect.closeTo(0.82115, 5),
        });
        expect(footprint.widthPx).toBe(452);
        expect(footprint.heightPx).toBe(452);
        expect(calculateGemPanelGemDiameterPx(skin, footprint)).toBe(60);
    });

    it('keeps every gem panel theme variant calibrated within the fixed layout footprint', () => {
        for (const variant of SURFACE_THEME_VARIANTS) {
            const skin = getGemPanelSkin('dark', variant);
            const footprint = calculateGemPanelFootprintPx(skin);
            const centers = getGemPanelCellCentersNormalized(skin);
            const gemDiameterPx = calculateGemPanelGemDiameterPx(skin, footprint);

            expect(footprint).toEqual({
                widthPx: 452,
                heightPx: 452,
            });
            expect(centers).toHaveLength(25);
            expect(skin.cellGridLinesNormalized?.x).toHaveLength(6);
            expect(skin.cellGridLinesNormalized?.y).toHaveLength(6);
            expect(centers[12].x).toBeGreaterThan(0.48);
            expect(centers[12].x).toBeLessThan(0.52);
            expect(centers[12].y).toBeGreaterThan(0.47);
            expect(centers[12].y).toBeLessThan(0.52);
            expect(gemDiameterPx).toBeGreaterThanOrEqual(57);
            expect(gemDiameterPx).toBeLessThanOrEqual(63);
        }
    });
});
