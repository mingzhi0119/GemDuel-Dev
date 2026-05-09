import type { GemColor } from '@gemduel/shared/types';

export interface GemArtworkAsset {
    path: string;
    alt: string;
}

export const GEM_ARTWORK_ASSETS: Record<GemColor, GemArtworkAsset> = {
    blue: {
        path: '/assets/gems/blue.png',
        alt: 'Blue gem artwork',
    },
    white: {
        path: '/assets/gems/white.png',
        alt: 'White gem artwork',
    },
    green: {
        path: '/assets/gems/green.png',
        alt: 'Green gem artwork',
    },
    black: {
        path: '/assets/gems/black.png',
        alt: 'Black gem artwork',
    },
    red: {
        path: '/assets/gems/red.png',
        alt: 'Red gem artwork',
    },
    pearl: {
        path: '/assets/gems/pearl.png',
        alt: 'Pearl gem artwork',
    },
    gold: {
        path: '/assets/gems/gold.png',
        alt: 'Gold gem artwork',
    },
};

export const getGemArtworkAssetPath = (gemId: GemColor): string => GEM_ARTWORK_ASSETS[gemId].path;
