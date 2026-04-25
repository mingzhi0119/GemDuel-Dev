import { describe, expect, it } from 'vitest';
import {
    calculateGemPanelFootprintPx,
    getGemPanelCellCentersNormalized,
} from '@gemduel/ui/components/gameBoard/gemPanelLayout';
import { getGemPanelSkin } from '../surfaceArtwork';

describe('gem panel skin geometry', () => {
    it('exposes the dashboard skin geometry for future panel skins', () => {
        const skin = getGemPanelSkin('dark');

        expect(skin.id).toBe('dashboard');
        expect(skin.intrinsicWidthPx).toBe(1254);
        expect(skin.intrinsicHeightPx).toBe(1254);
        expect(skin.playfieldRectNormalized).toEqual({
            left: 0.1922,
            top: 0.1571,
            right: 0.807,
            bottom: 0.7871,
        });
    });

    it('derives normalized 5x5 cell centers and a widened footprint from the skin', () => {
        const skin = getGemPanelSkin('light');
        const centers = getGemPanelCellCentersNormalized(skin);
        const footprint = calculateGemPanelFootprintPx(skin);

        expect(centers).toHaveLength(25);
        expect(centers[0]).toEqual({
            x: expect.closeTo(0.25368, 5),
            y: expect.closeTo(0.2201, 5),
        });
        expect(centers[12]).toEqual({
            x: expect.closeTo(0.4996, 5),
            y: expect.closeTo(0.4721, 5),
        });
        expect(centers[24]).toEqual({
            x: expect.closeTo(0.74552, 5),
            y: expect.closeTo(0.7241, 5),
        });
        expect(footprint.widthPx).toBeGreaterThan(375);
        expect(footprint.heightPx).toBeGreaterThan(375);
    });
});
