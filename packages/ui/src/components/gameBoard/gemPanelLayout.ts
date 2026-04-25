import type { GemPanelSkin, NormalizedPoint } from '@gemduel/shared/types';

export const GEM_BOARD_DIMENSION = 5;

export const GEM_BOARD_PLAYABLE_SPAN_PX = 375;
export const GEM_BOARD_GEM_SIZE_PX = Math.round(
    (GEM_BOARD_PLAYABLE_SPAN_PX / GEM_BOARD_DIMENSION) * 0.92
);

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
    const { left, top, right, bottom } = panelSkin.playfieldRectNormalized;

    return {
        widthPx: Math.round(playableSpanPx / (right - left)),
        heightPx: Math.round(playableSpanPx / (bottom - top)),
    };
};
