import type {
    GemPanelSkin,
    NormalizedGridLines,
    NormalizedPoint,
    NormalizedRect,
} from '@gemduel/shared/types';

export const GEM_BOARD_DIMENSION = 5;

export const GEM_BOARD_PLAYABLE_SPAN_PX = 375;
export const GEM_BOARD_GEM_SIZE_PX = Math.round(
    (GEM_BOARD_PLAYABLE_SPAN_PX / GEM_BOARD_DIMENSION) * 0.92
);
export const GEM_BOARD_GEM_DIAMETER_NORMALIZED =
    GEM_BOARD_GEM_SIZE_PX / Math.round(GEM_BOARD_PLAYABLE_SPAN_PX / 0.83);
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

export interface GemPanelResolvedGeometry {
    panelFootprint: GemPanelFootprint;
    cellCenters: NormalizedPoint[];
    cellGridLines: NormalizedGridLines;
    gemDiameterPx: number;
}

export const getGemPanelCellGridLinesNormalized = (
    panelSkin: GemPanelSkin
): NormalizedGridLines => {
    if (
        panelSkin.cellGridLinesNormalized?.x.length === GEM_BOARD_DIMENSION + 1 &&
        panelSkin.cellGridLinesNormalized.y.length === GEM_BOARD_DIMENSION + 1
    ) {
        return panelSkin.cellGridLinesNormalized;
    }

    const { left, top, right, bottom } = panelSkin.playfieldRectNormalized;
    const cellWidth = (right - left) / GEM_BOARD_DIMENSION;
    const cellHeight = (bottom - top) / GEM_BOARD_DIMENSION;

    return {
        x: Array.from({ length: GEM_BOARD_DIMENSION + 1 }, (_, index) => left + cellWidth * index),
        y: Array.from({ length: GEM_BOARD_DIMENSION + 1 }, (_, index) => top + cellHeight * index),
    };
};

export const calculateGemPanelCellCentersFromIntersections = (
    cellGridLines: NormalizedGridLines
): NormalizedPoint[] =>
    Array.from({ length: GEM_BOARD_DIMENSION * GEM_BOARD_DIMENSION }, (_, index) => {
        const row = Math.floor(index / GEM_BOARD_DIMENSION);
        const col = index % GEM_BOARD_DIMENSION;
        const left = cellGridLines.x[col] ?? 0;
        const right = cellGridLines.x[col + 1] ?? left;
        const top = cellGridLines.y[row] ?? 0;
        const bottom = cellGridLines.y[row + 1] ?? top;
        const topLeft = { x: left, y: top };
        const topRight = { x: right, y: top };
        const bottomLeft = { x: left, y: bottom };
        const bottomRight = { x: right, y: bottom };
        const diagonalA = {
            x: (topLeft.x + bottomRight.x) / 2,
            y: (topLeft.y + bottomRight.y) / 2,
        };
        const diagonalB = {
            x: (topRight.x + bottomLeft.x) / 2,
            y: (topRight.y + bottomLeft.y) / 2,
        };

        return {
            x: (diagonalA.x + diagonalB.x) / 2,
            y: (diagonalA.y + diagonalB.y) / 2,
        };
    });

export const getGemPanelCellCentersNormalized = (panelSkin: GemPanelSkin): NormalizedPoint[] => {
    if (panelSkin.cellCentersNormalized?.length === GEM_BOARD_DIMENSION * GEM_BOARD_DIMENSION) {
        return panelSkin.cellCentersNormalized;
    }

    return calculateGemPanelCellCentersFromIntersections(
        getGemPanelCellGridLinesNormalized(panelSkin)
    );
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

export const calculateGemPanelGemDiameterPx = (
    panelSkin: GemPanelSkin,
    panelFootprint = calculateGemPanelFootprintPx(panelSkin)
): number => {
    const normalizedDiameter =
        panelSkin.gemDiameterNormalized ?? GEM_BOARD_GEM_SIZE_PX / panelFootprint.widthPx;

    return Math.round(
        Math.min(panelFootprint.widthPx, panelFootprint.heightPx) * normalizedDiameter
    );
};

export const resolveGemPanelGeometry = (panelSkin: GemPanelSkin): GemPanelResolvedGeometry => {
    const panelFootprint = calculateGemPanelFootprintPx(panelSkin);

    return {
        panelFootprint,
        cellCenters: getGemPanelCellCentersNormalized(panelSkin),
        cellGridLines: getGemPanelCellGridLinesNormalized(panelSkin),
        gemDiameterPx: calculateGemPanelGemDiameterPx(panelSkin, panelFootprint),
    };
};
