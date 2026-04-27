import type { GemCoord } from '@gemduel/shared/types';
import {
    GEM_BOARD_DIMENSION,
    GEM_BOARD_GEM_SIZE_PX,
    type GemPanelFootprint,
} from './gemPanelLayout';

interface NormalizedCellCenter {
    x: number;
    y: number;
}

interface RectLike {
    left: number;
    top: number;
    width: number;
    height: number;
}

export const findNearestGemCoordFromPointer = ({
    clientX,
    clientY,
    rect,
    panelFootprint,
    cellCenters,
}: {
    clientX: number;
    clientY: number;
    rect: RectLike;
    panelFootprint: GemPanelFootprint;
    cellCenters: NormalizedCellCenter[];
}): GemCoord | null => {
    if (rect.width <= 0 || rect.height <= 0) {
        return null;
    }

    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;
    const renderedGemSize =
        Math.min(
            (rect.width / panelFootprint.widthPx) * GEM_BOARD_GEM_SIZE_PX,
            (rect.height / panelFootprint.heightPx) * GEM_BOARD_GEM_SIZE_PX
        ) * 0.7;
    const hitRadiusSq = Math.pow(renderedGemSize / 2, 2);

    let nearestCoord: GemCoord | null = null;
    let nearestDistanceSq = Number.POSITIVE_INFINITY;

    cellCenters.forEach((center, index) => {
        const centerX = center.x * rect.width;
        const centerY = center.y * rect.height;
        const dx = pointerX - centerX;
        const dy = pointerY - centerY;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq <= hitRadiusSq && distanceSq < nearestDistanceSq) {
            nearestCoord = {
                r: Math.floor(index / GEM_BOARD_DIMENSION),
                c: index % GEM_BOARD_DIMENSION,
            };
            nearestDistanceSq = distanceSq;
        }
    });

    return nearestCoord;
};
