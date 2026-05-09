// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest';
import { collectCardSlabAnchors } from '../threeCardSlabAnchors';

const mockRect = (x: number, y: number, width: number, height: number) =>
    ({
        x,
        y,
        width,
        height,
        top: y,
        left: x,
        right: x + width,
        bottom: y + height,
        toJSON: () => ({}),
    }) as DOMRect;

const addCardAnchor = (layer: 'market' | 'preview' | 'flight', cardId: string, rect: DOMRect) => {
    const element = document.createElement('div');
    element.dataset.threeCardSlab = layer;
    element.dataset.threeCardSlabCardId = cardId;
    element.dataset.threeCardSlabTheme = 'dark';
    element.getBoundingClientRect = () => rect;
    document.body.appendChild(element);
    return element;
};

afterEach(() => {
    document.body.replaceChildren();
});

describe('collectCardSlabAnchors', () => {
    it('collects visible card slab anchors with card metadata', () => {
        addCardAnchor('market', '151-bk', mockRect(20, 30, 118, 157));

        expect(collectCardSlabAnchors()).toEqual([
            expect.objectContaining({
                layer: 'market',
                cardId: '151-bk',
                theme: 'dark',
                royal: false,
                affordable: false,
            }),
        ]);
    });

    it('skips market card anchors while a preview overlay is open', () => {
        addCardAnchor('market', '151-bk', mockRect(20, 30, 118, 157));
        addCardAnchor('preview', '252-wh', mockRect(200, 120, 236, 314));
        const overlay = document.createElement('div');
        overlay.dataset.cardPreviewOverlay = 'true';
        document.body.appendChild(overlay);

        expect(collectCardSlabAnchors().map((anchor) => anchor.layer)).toEqual(['preview']);
    });
});
