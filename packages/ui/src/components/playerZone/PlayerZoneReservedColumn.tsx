import { useMemo, useState } from 'react';
import { Card, FEATURED_CARD_SIZE } from '../Card';
import { CardPreviewOverlay } from '../CardPreviewOverlay';
import { createCardPreviewActions } from '../cardPreviewActions';
import { ScaledCardFrame } from './ScaledCardFrame';
import { isHiddenReservedCard } from '@gemduel/shared/logic/multiplayerVisibility';
import { getLexiconLabel } from '@gemduel/shared';
import { useLocale } from '../../i18n/LocaleProvider';
import type { RefObject } from 'react';
import type {
    Card as CardType,
    PlayerKey,
    ReservedCardView,
    ReservedCardVisibility,
} from '@gemduel/shared/types';
import {
    RESERVED_CARD_TARGET_SLOTS,
    RESERVED_MINI_STACK_OFFSET_X_PX,
    RESERVED_MINI_STACK_OFFSET_Y_PX,
} from './constants';

interface PlayerZoneReservedColumnProps {
    player: PlayerKey;
    reserved: ReservedCardView[];
    reservedRowRef: RefObject<HTMLDivElement | null>;
    reservedCardScale: number;
    canUseReservedActions: boolean;
    hasPuppetMaster: boolean;
    theme: 'light' | 'dark';
    onBuyReserved: (card: CardType, execute?: boolean) => boolean;
    onDiscardReserved: (cardId: string) => void;
    pendingReservedCardIds?: string[];
    dividerSide?: 'left' | 'right';
    readabilityTreatment?: boolean;
    reservedVisibility?: ReservedCardVisibility;
}

const isFaceCard = (card: ReservedCardView): card is CardType => !isHiddenReservedCard(card);

const getReservedCardSlotKey = (card: ReservedCardView, slotIndex: number): string =>
    isHiddenReservedCard(card) ? card.slotKey : card.id || `${slotIndex}`;

const ReservedCardBack = ({ slotIndex, theme }: { slotIndex: number; theme: 'light' | 'dark' }) => (
    <div
        aria-label={`Reserved card back ${slotIndex + 1}`}
        data-reserved-card-back="true"
        className={`relative overflow-hidden rounded-lg border ${
            theme === 'dark'
                ? 'border-cyan-200/35 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950'
                : 'border-stone-300 bg-gradient-to-br from-stone-800 via-slate-800 to-cyan-900'
        }`}
        style={{
            width: `${FEATURED_CARD_SIZE.width}px`,
            height: `${FEATURED_CARD_SIZE.height}px`,
        }}
    >
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(45deg,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute inset-3 rounded-md border border-white/12" />
        <div
            aria-hidden="true"
            className={`absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-center text-[12px] font-black uppercase tracking-[0.18em] ${
                theme === 'dark'
                    ? 'border-white/15 bg-black/38 text-slate-100'
                    : 'border-white/25 bg-black/28 text-white'
            }`}
        >
            Reserved
        </div>
    </div>
);

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
    readabilityTreatment = false,
    reservedVisibility = 'faces',
}: PlayerZoneReservedColumnProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { locale } = useLocale();
    const shouldRenderBacks =
        reservedVisibility === 'backs' || reserved.some((card) => isHiddenReservedCard(card));
    const visibleReservedCards = useMemo(() => reserved.filter(isFaceCard), [reserved]);
    const pendingReservedCardIdSet = useMemo(
        () => new Set(pendingReservedCardIds),
        [pendingReservedCardIds]
    );
    const previewCards = useMemo(
        () => (shouldRenderBacks ? [] : visibleReservedCards.slice(0, RESERVED_CARD_TARGET_SLOTS)),
        [shouldRenderBacks, visibleReservedCards]
    );
    const previewCardActions = useMemo(
        () =>
            previewCards.map((card) => {
                if (!canUseReservedActions || shouldRenderBacks) {
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
        [
            canUseReservedActions,
            locale,
            onBuyReserved,
            pendingReservedCardIdSet,
            previewCards,
            shouldRenderBacks,
        ]
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
            data-readability-hud-chip={readabilityTreatment ? 'player-reserved' : undefined}
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
                        data-reserved-visibility={shouldRenderBacks ? 'backs' : 'faces'}
                        className="relative shrink-0"
                        style={{
                            width: `${reservedMiniStackWidth}px`,
                            height: `${reservedMiniStackHeight}px`,
                        }}
                    >
                        {reserved.map((card, i) => {
                            const slotKey = getReservedCardSlotKey(card, i);
                            const isPendingPresentation =
                                isFaceCard(card) && pendingReservedCardIdSet.has(card.id);
                            const canBuyReserved =
                                isFaceCard(card) &&
                                !isPendingPresentation &&
                                !shouldRenderBacks &&
                                canUseReservedActions &&
                                onBuyReserved(card);

                            return (
                                <div
                                    key={slotKey}
                                    data-reserved-slot={`${player}-${i}`}
                                    data-card-id={
                                        shouldRenderBacks || !isFaceCard(card) ? undefined : card.id
                                    }
                                    data-reserved-hidden={shouldRenderBacks ? 'true' : undefined}
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
                                            {shouldRenderBacks || !isFaceCard(card) ? (
                                                <ReservedCardBack slotIndex={i} theme={theme} />
                                            ) : (
                                                <>
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
                                                </>
                                            )}
                                        </div>
                                    </ScaledCardFrame>
                                </div>
                            );
                        })}
                    </div>
                )}
                {!shouldRenderBacks && (
                    <CardPreviewOverlay
                        isOpen={isPreviewOpen}
                        mode="collection"
                        cards={previewCards}
                        theme={theme}
                        onClose={() => setIsPreviewOpen(false)}
                        cardActions={previewCardActions}
                    />
                )}
            </div>
        </div>
    );
}
