import type { ThreeLayerStatus } from './ThreePresentationLayer';

export interface ThreePresentationFeatureFlags {
    activeTurnPointer: boolean;
    gemBoard: boolean;
    cardSlab: boolean;
    hideGemArtworkWhenThreeBoardRuns: boolean;
}

export const MAIN_GAME_THREE_FEATURES: ThreePresentationFeatureFlags = {
    activeTurnPointer: true,
    gemBoard: false,
    cardSlab: false,
    hideGemArtworkWhenThreeBoardRuns: false,
};

export const VISUAL_LAB_THREE_FEATURES: ThreePresentationFeatureFlags = {
    activeTurnPointer: true,
    gemBoard: true,
    cardSlab: true,
    hideGemArtworkWhenThreeBoardRuns: true,
};

export const shouldRenderGemArtworkForThreeFeatures = (
    features: ThreePresentationFeatureFlags,
    status: ThreeLayerStatus
): boolean => !features.hideGemArtworkWhenThreeBoardRuns || status !== 'running';
