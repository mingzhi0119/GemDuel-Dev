import { describe, expect, it } from 'vitest';
import {
    MAIN_GAME_THREE_FEATURES,
    VISUAL_LAB_THREE_FEATURES,
    shouldRenderGemArtworkForThreeFeatures,
} from '../threePresentationFeatures';

describe('three presentation feature flags', () => {
    it('keeps formal gameplay on 2D board artwork even when the pointer layer is running', () => {
        expect(MAIN_GAME_THREE_FEATURES.activeTurnPointer).toBe(true);
        expect(MAIN_GAME_THREE_FEATURES.gemBoard).toBe(false);
        expect(MAIN_GAME_THREE_FEATURES.cardSlab).toBe(false);
        expect(shouldRenderGemArtworkForThreeFeatures(MAIN_GAME_THREE_FEATURES, 'running')).toBe(
            true
        );
    });

    it('lets Visual Lab replace board artwork only after its Three board layer is running', () => {
        expect(VISUAL_LAB_THREE_FEATURES.activeTurnPointer).toBe(true);
        expect(VISUAL_LAB_THREE_FEATURES.gemBoard).toBe(true);
        expect(VISUAL_LAB_THREE_FEATURES.cardSlab).toBe(true);
        expect(shouldRenderGemArtworkForThreeFeatures(VISUAL_LAB_THREE_FEATURES, 'pending')).toBe(
            true
        );
        expect(shouldRenderGemArtworkForThreeFeatures(VISUAL_LAB_THREE_FEATURES, 'running')).toBe(
            false
        );
        expect(
            shouldRenderGemArtworkForThreeFeatures(VISUAL_LAB_THREE_FEATURES, 'webgl-unavailable')
        ).toBe(true);
    });
});
