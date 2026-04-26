import { Card, FEATURED_CARD_SIZE } from '../Card';
import { ScaledCardFrame } from './ScaledCardFrame';
import type { RefObject } from 'react';
import type { Card as CardType } from '@gemduel/shared/types';
import { RESERVED_CARD_GAP_PX } from './constants';

interface PlayerZoneReservedColumnProps {
    reserved: CardType[];
    reservedRowRef: RefObject<HTMLDivElement | null>;
    reservedCardScale: number;
    isActive: boolean;
    hasPuppetMaster: boolean;
    theme: 'light' | 'dark';
    onBuyReserved: (card: CardType, execute?: boolean) => boolean;
    onDiscardReserved: (cardId: string) => void;
}

export function PlayerZoneReservedColumn({
    reserved,
    reservedRowRef,
    reservedCardScale,
    isActive,
    hasPuppetMaster,
    theme,
    onBuyReserved,
    onDiscardReserved,
}: PlayerZoneReservedColumnProps) {
    return (
        <div
            className={`self-stretch flex items-center border-l pl-4 min-w-0 transition-colors duration-500
          ${theme === 'dark' ? 'border-slate-700' : 'border-stone-300'}
      `}
            style={{ flex: 42 }}
        >
            <div
                ref={reservedRowRef}
                className="w-full flex items-center justify-center overflow-hidden py-2 min-w-0"
            >
                {reserved.length === 0 && (
                    <span
                        className={`text-[10px] italic w-full text-center ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}
                    >
                        No Reserved Cards
                    </span>
                )}
                {reserved.length > 0 && (
                    <div
                        className="flex items-center justify-center min-w-0 max-w-full"
                        style={{ gap: `${RESERVED_CARD_GAP_PX}px` }}
                    >
                        {reserved.map((card, i) => (
                            <ScaledCardFrame
                                key={card.id || i}
                                scale={reservedCardScale}
                                baseSize={FEATURED_CARD_SIZE}
                            >
                                <div className="relative group/card">
                                    <Card
                                        card={card}
                                        size="featured"
                                        canBuy={isActive && onBuyReserved(card)}
                                        onClick={() =>
                                            isActive &&
                                            onBuyReserved(card) &&
                                            onBuyReserved(card, true)
                                        }
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
