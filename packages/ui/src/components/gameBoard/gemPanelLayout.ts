import type { GemPanelSkin, NormalizedPoint, NormalizedRect } from '@gemduel/shared/types';

export const GEM_BOARD_DIMENSION = 5;

export const GEM_BOARD_PLAYABLE_SPAN_PX = 375;
export const GEM_BOARD_GEM_SIZE_PX = Math.round(
    (GEM_BOARD_PLAYABLE_SPAN_PX / GEM_BOARD_DIMENSION) * 0.92
);
export const GEM_PANEL_CANONICAL_PLAYFIELD_RECT: NormalizedRect = {
    left: 0.085,
    top: 0.085,
    right: 0.915,
    bottom: 0.915,
};

export interface GemPanelFootprint {
    widthPx: number;
    heightPx: number;
}

export const getGemPanelCellCentersNormalized = (panelSkin: GemPanelSkin): NormalizedPoint[] => {
    if (panelSkin.cellCentersNormalized?.length === GEM_BOARD_DIMENSION * GEM_BOARD_DIMENSION) {
        return panelSkin.cellCentersNormalized;
    }

    const { left, top, right, bottom } = panelSkin.playfieldRectNormalized;
    const cellWidth = (right - left) / GEM_BOARD_DIMENSION;
    const cellHeight = (bottom - top) / GEM_BOARD_DIMENSION;

    return Array.from({ length: GEM_BOARD_DIMENSION * GEM_BOARD_DIMENSION }, (_, index) => {
        const row = Math.floor(index / GEM_BOARD_DIMENSION);
        const col = index % GEM_BOARD_DIMENSION;

        return {
            x: left + cellWidth * (col + 0.5),
            y: top + cellHeight * (row + 0.5),
        };
    });
};

export const calculateGemPanelFootprintPx = (
    panelSkin: GemPanelSkin,
    playableSpanPx = GEM_BOARD_PLAYABLE_SPAN_PX
): GemPanelFootprint => {
    void panelSkin;
    const { left, top, right, bottom } = GEM_PANEL_CANONICAL_PLAYFIELD_RECT;

    return {
        widthPx: Math.round(playableSpanPx / (right - left)),
        heightPx: Math.round(playableSpanPx / (bottom - top)),
    };
};
