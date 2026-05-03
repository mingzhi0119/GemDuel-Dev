import type { Card as CardType, CardInteractionContext } from '@gemduel/shared/types';
import type { CardBackArtwork } from './cardBackArtwork';
import type { CardSize } from './cardSizing';

export interface CardProps {
    card: CardType | null;
    canBuy?: boolean;
    onClick?: (card: CardType, context?: CardInteractionContext) => void;
    onReserve?: (card: CardType, context?: CardInteractionContext) => void;
    context?: CardInteractionContext;
    isReservedView?: boolean;
    isRoyal?: boolean;
    reserveOnClick?: boolean;
    allowUnavailableClick?: boolean;
    className?: string;
    size?: CardSize;
    theme?: 'light' | 'dark';
    cardBackArtwork?: CardBackArtwork;
}
