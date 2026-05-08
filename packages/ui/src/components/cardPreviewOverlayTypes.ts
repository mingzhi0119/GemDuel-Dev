import type { ReactNode } from 'react';
import type { Card as CardType, PlayerKey } from '@gemduel/shared/types';
import type { MarketDeckBackArtworkMap } from './card/cardBackArtwork';
import type { CardPreviewAction } from './cardPreviewActions';

export type CardPreviewMode = 'single' | 'collection';
export type CardPreviewCollectionLayout = 'grid' | 'deck-peek';

export interface CardPreviewOverlayProps {
    isOpen: boolean;
    mode: CardPreviewMode;
    cards: CardType[];
    theme: 'light' | 'dark';
    onClose: () => void;
    title?: string;
    player?: PlayerKey;
    color?: string;
    previewContent?: ReactNode;
    actions?: CardPreviewAction[];
    cardActions?: CardPreviewAction[][];
    collectionLayout?: CardPreviewCollectionLayout;
    deckBackArtwork?: MarketDeckBackArtworkMap;
}
