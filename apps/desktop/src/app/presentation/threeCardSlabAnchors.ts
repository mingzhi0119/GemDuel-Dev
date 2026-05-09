import type { CardDepthLayer } from '@gemduel/ui/components/card/CardProps';

export interface CardSlabAnchorSnapshot {
    key: string;
    layer: CardDepthLayer;
    cardId: string;
    rect: DOMRect;
    theme: 'light' | 'dark';
    royal: boolean;
    affordable: boolean;
}

const CARD_SLAB_SELECTOR = '[data-three-card-slab]';
const CARD_SLAB_LAYERS = new Set<CardDepthLayer>(['market', 'preview', 'flight']);

const isCardSlabLayer = (value: string | undefined): value is CardDepthLayer =>
    Boolean(value && CARD_SLAB_LAYERS.has(value as CardDepthLayer));

const isUsableRect = (rect: DOMRect): boolean =>
    Number.isFinite(rect.width) &&
    Number.isFinite(rect.height) &&
    rect.width >= 24 &&
    rect.height >= 32;

const isElementVisible = (element: HTMLElement): boolean => {
    const style = element.ownerDocument.defaultView?.getComputedStyle(element);

    return style?.display !== 'none' && style?.visibility !== 'hidden' && style?.opacity !== '0';
};

export const collectCardSlabAnchors = (root: ParentNode = document): CardSlabAnchorSnapshot[] => {
    const previewOpen = Boolean(root.querySelector('[data-card-preview-overlay]'));

    return Array.from(root.querySelectorAll<HTMLElement>(CARD_SLAB_SELECTOR))
        .map<CardSlabAnchorSnapshot | null>((element, index) => {
            const layer = element.dataset.threeCardSlab;

            if (!isCardSlabLayer(layer)) {
                return null;
            }

            if (previewOpen && layer === 'market') {
                return null;
            }

            if (!isElementVisible(element)) {
                return null;
            }

            const rect = element.getBoundingClientRect();
            if (!isUsableRect(rect)) {
                return null;
            }

            const cardId = element.dataset.threeCardSlabCardId ?? 'unknown-card';
            const theme = element.dataset.threeCardSlabTheme === 'light' ? 'light' : 'dark';

            return {
                key: `${layer}:${cardId}:${index}`,
                layer,
                cardId,
                rect,
                theme,
                royal: element.dataset.threeCardSlabRoyal === 'true',
                affordable: element.dataset.threeCardSlabAffordable === 'true',
            };
        })
        .filter((anchor): anchor is CardSlabAnchorSnapshot => anchor !== null);
};
