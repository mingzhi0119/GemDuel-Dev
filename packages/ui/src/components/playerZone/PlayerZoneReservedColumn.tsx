import { useMemo, useState } from 'react';
import { Card, FEATURED_CARD_SIZE } from '../Card';
import { CardPreviewOverlay } from '../CardPreviewOverlay';
import { ScaledCardFrame } from './ScaledCardFrame';
import type { RefObject } from 'react';
import type { Card as CardType, PlayerKey } from '@gemduel/shared/types';
import { RESERVED_CARD_GAP_PX } from './constants';

interface PlayerZoneReservedColumnProps {
    player: PlayerKey;
    reserved: CardType[];
    reservedRowRef: RefObject<HTMLDivElement | null>;
    reservedCardScale: number;
    isActive: boolean;
    hasPuppetMaster: boolean;
    theme: 'light' | 'dark';
    onBuyReserved: (card: CardType, execute?: boolean) => boolean;
    onDiscardReserved: (cardId: string) => void;
    pendingReservedCardIds?: string[];
    dividerSide?: 'left' | 'right';
}

export function PlayerZoneReservedColumn({
    player,
    reserved,
    reservedRowRef,
    reservedCardScale,
    isActive,
    hasPuppetMaster,
    theme,
    onBuyReserved,
    onDiscardReserved,
    pendingReservedCardIds = [],
    dividerSide = 'left',
}: PlayerZoneReservedColumnProps) {
    const [previewCard, setPreviewCard] = useState<CardType | null>(null);
    const pendingReservedCardIdSet = useMemo(
        () => new Set(pendingReservedCardIds),
        [pendingReservedCardIds]
    );

    return (
        <div
            data-player-zone-column="reserved"
            className={`self-stretch flex items-center min-w-0 transition-colors duration-500 ${
                dividerSide === 'left' ? 'border-l pl-4' : 'border-r pr-4'
            }
          ${theme === 'dark' ? 'border-slate-700' : 'border-stone-300'}
      `}
            style={{ flex: 42 }}
        >
            <div
                ref={reservedRowRef}
                data-reserved-row={player}
                className="w-full flex items-center justify-center overflow-hidden py-2 min-w-0"
            >
                {reserved.length > 0 && (
                    <div
                        className="flex items-center justify-center min-w-0 max-w-full"
                        style={{ gap: `${RESERVED_CARD_GAP_PX}px` }}
                    >
                        {reserved.map((card, i) => {
                            const isPendingPresentation = pendingReservedCardIdSet.has(card.id);
                            const canBuyReserved =
                                !isPendingPresentation && isActive && onBuyReserved(card);

                            return (
                                <ScaledCardFrame
                                    key={card.id || i}
                                    scale={reservedCardScale}
                                    baseSize={FEATURED_CARD_SIZE}
                                >
                                    <div
                                        data-reserved-slot={`${player}-${i}`}
                                        data-card-id={card.id}
                                        data-reserved-card-scale={reservedCardScale.toFixed(3)}
                                        data-reserved-card-pending={
                                            isPendingPresentation ? 'true' : undefined
                                        }
                                        className="relative group/card"
                                        aria-hidden={isPendingPresentation ? 'true' : undefined}
                                        style={
                                            isPendingPresentation
                                                ? {
                                                      visibility: 'hidden',
                                                      pointerEvents: 'none',
                                                  }
                                                : undefined
                                        }
                                    >
                                        <Card
                                            card={card}
                                            size="featured"
                                            canBuy={canBuyReserved}
                                            onClick={() => {
                                                if (canBuyReserved) {
                                                    onBuyReserved(card, true);
                                                    return;
                                                }

                                                setPreviewCard(card);
                                            }}
                                            allowUnavailableClick={true}
                                            isReservedView={true}
                                            theme={theme}
                                            className="transition-transform duration-200 ease-in-out"
                                        />
                                        {hasPuppetMaster && isActive && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDiscardReserved(card.id);
                                                }}
                                                className="absolute -top-2 -right-2 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg border border-white/20 opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-rose-500 z-50"
                                                title="Discard Card (Puppet Master)"
                                            >
                                                <span className="text-[15px] font-black leading-none">
                                                    X
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </ScaledCardFrame>
                            );
                        })}
                    </div>
                )}
                <CardPreviewOverlay
                    isOpen={Boolean(previewCard)}
                    mode="single"
                    cards={previewCard ? [previewCard] : []}
                    theme={theme}
                    onClose={() => setPreviewCard(null)}
                />
            </div>
        </div>
    );
}
