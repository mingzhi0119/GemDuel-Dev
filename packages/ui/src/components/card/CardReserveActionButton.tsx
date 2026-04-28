import type { MouseEvent } from 'react';
import type { Card, CardInteractionContext } from '@gemduel/shared/types';
import { UI_ICON_ARTWORK } from '../uiIconArtwork';

interface CardReserveActionButtonProps {
    card: Card;
    context?: CardInteractionContext;
    iconSizePx: number;
    label: string;
    onReserve: (card: Card, context?: CardInteractionContext) => void;
    paddingPx: number;
}

export function CardReserveActionButton({
    card,
    context,
    iconSizePx,
    label,
    onReserve,
    paddingPx,
}: CardReserveActionButtonProps) {
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onReserve(card, context);
    };

    return (
        <button
            onClick={handleClick}
            className="rounded-full border border-amber-200/80 bg-slate-950/78 text-amber-100 shadow-[0_8px_20px_rgba(0,0,0,0.42),0_0_14px_rgba(251,191,36,0.28)] transition-transform hover:scale-110 hover:border-amber-100 hover:bg-amber-300/22 active:scale-90"
            title={label}
            aria-label={label}
            data-card-reserve-artwork="card-tray"
            style={{ padding: `${paddingPx}px` }}
        >
            <img
                src={UI_ICON_ARTWORK.reserveCardTray}
                alt=""
                aria-hidden="true"
                className="block object-contain"
                draggable={false}
                style={{
                    width: `${iconSizePx}px`,
                    height: `${iconSizePx}px`,
                }}
            />
        </button>
    );
}
