import { useMemo, useState } from 'react';
import { Card, FEATURED_CARD_SIZE } from '../Card';
import { CardPreviewOverlay } from '../CardPreviewOverlay';
import { createCardPreviewActions } from '../cardPreviewActions';
import { ScaledCardFrame } from './ScaledCardFrame';
import { getLexiconLabel } from '@gemduel/shared';
import { useLocale } from '../../i18n/LocaleProvider';
import type { RefObject } from 'react';
import type { Card as CardType, PlayerKey } from '@gemduel/shared/types';
import {
    RESERVED_CARD_TARGET_SLOTS,
    RESERVED_MINI_STACK_OFFSET_X_PX,
    RESERVED_MINI_STACK_OFFSET_Y_PX,
} from './constants';

interface PlayerZoneReservedColumnProps {
    player: PlayerKey;
    reserved: CardType[];
    reservedRowRef: RefObject<HTMLDivElement | null>;
    reservedCardScale: number;
    canUseReservedActions: boolean;
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
    canUseReservedActions,
    hasPuppetMaster,
    theme,
    onBuyReserved,
    onDiscardReserved,
    pendingReservedCardIds = [],
    dividerSide = 'left',
}: PlayerZoneReservedColumnProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { locale } = useLocale();
    const pendingReservedCardIdSet = useMemo(
        () => new Set(pendingReservedCardIds),
        [pendingReservedCardIds]
    );
    const previewCards = useMemo(() => reserved.slice(0, RESERVED_CARD_TARGET_SLOTS), [reserved]);
    const previewCardActions = useMemo(
        () =>
            previewCards.map((card) => {
                if (!canUseReservedActions) {
                    return createCardPreviewActions();
                }

                const canBuyReserved =
                    !pendingReservedCardIdSet.has(card.id) && onBuyReserved(card);

                return createCardPreviewActions({
                    id: 'buy',
                    label: getLexiconLabel('buyCard', locale),
                    disabled: !canBuyReserved,
                    onAction: () => onBuyReserved(card, true),
                });
            }),
        [canUseReservedActions, locale, onBuyReserved, pendingReservedCardIdSet, previewCards]
    );
    const reservedMiniStackSlots = Math.min(
        Math.max(reserved.length, 1),
        RESERVED_CARD_TARGET_SLOTS
    );
    const reservedMiniStackWidth =
        (FEATURED_CARD_SIZE.width +
            Math.max(reservedMiniStackSlots - 1, 0) * RESERVED_MINI_STACK_OFFSET_X_PX) *
        reservedCardScale;
    const reservedMiniStackHeight =
        (FEATURED_CARD_SIZE.height +
            Math.max(reservedMiniStackSlots - 1, 0) * RESERVED_MINI_STACK_OFFSET_Y_PX) *
        reservedCardScale;

    return (
        <div
            data-player-zone-column="reserved"
            className={`self-stretch flex items-center min-w-0 transition-colors duration-500 ${
                dividerSide === 'left' ? 'border-l pl-3' : 'border-r pr-3'
            }
          ${theme === 'dark' ? 'border-slate-700' : 'border-stone-300'}
      `}
            style={{ flex: 22 }}
        >
            <div
                ref={reservedRowRef}
                data-reserved-row={player}
                className="w-full flex items-center justify-center overflow-visible py-2 min-w-0"
            >
                {reserved.length > 0 && (
                    <div
                        data-reserved-mini-stack={player}
                        className="relative shrink-0"
                        style={{
                            width: `${reservedMiniStackWidth}px`,
                            height: `${reservedMiniStackHeight}px`,
                        }}
                    >
                        {reserved.map((card, i) => {
                            const isPendingPresentation = pendingReservedCardIdSet.has(card.id);
                            const canBuyReserved =
                                !isPendingPresentation &&
                                canUseReservedActions &&
                                onBuyReserved(card);

                            return (
                                <div
                                    key={card.id || i}
                                    data-reserved-slot={`${player}-${i}`}
                                    data-card-id={card.id}
                                    data-reserved-card-scale={reservedCardScale.toFixed(3)}
                                    data-reserved-card-pending={
                                        isPendingPresentation ? 'true' : undefined
                                    }
                                    className="absolute group/card"
                                    aria-hidden={isPendingPresentation ? 'true' : undefined}
                                    style={{
                                        left: `${i * RESERVED_MINI_STACK_OFFSET_X_PX * reservedCardScale}px`,
                                        top: `${i * RESERVED_MINI_STACK_OFFSET_Y_PX * reservedCardScale}px`,
                                        zIndex: i + 1,
                                        ...(isPendingPresentation
                                            ? {
                                                  visibility: 'hidden',
                                                  pointerEvents: 'none',
                                              }
                                            : {}),
                                    }}
                                >
                                    <ScaledCardFrame
                                        scale={reservedCardScale}
                                        baseSize={FEATURED_CARD_SIZE}
                                    >
                                        <div className="relative">
                                            <Card
                                                card={card}
                                                size="featured"
                                                canBuy={canBuyReserved}
                                                onClick={() => setIsPreviewOpen(true)}
                                                allowUnavailableClick={true}
                                                isReservedView={true}
                                                theme={theme}
                                                className="transition-transform duration-200 ease-in-out"
                                            />
                                            {hasPuppetMaster && canUseReservedActions && (
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
                                </div>
                            );
                        })}
                    </div>
                )}
                <CardPreviewOverlay
                    isOpen={isPreviewOpen}
                    mode="collection"
                    cards={previewCards}
                    theme={theme}
                    onClose={() => setIsPreviewOpen(false)}
                    cardActions={previewCardActions}
                />
            </div>
        </div>
    );
}
