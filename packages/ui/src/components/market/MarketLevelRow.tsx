import { Card, FEATURED_CARD_SIZE } from '../Card';
import { calculateTransaction } from '@gemduel/shared/utils';
import type {
    Card as CardType,
    CardInteractionContext,
    Buff,
    GemInventory,
    PlayerKey,
} from '@gemduel/shared/types';
import { useT } from '../../i18n/LocaleProvider';
import { MarketDeckBack } from './MarketDeckBack';
import type { MarketDeckBackArtworkMap } from '../card/cardBackArtwork';

interface MarketLevelRowProps {
    lvl: 1 | 2 | 3;
    marketCards: Array<CardType | null>;
    deck: CardType[];
    turn: PlayerKey;
    inventories: Record<PlayerKey, GemInventory>;
    playerTableau: Record<PlayerKey, CardType[]>;
    playerBuffs: Record<PlayerKey, Buff>;
    marketInteraction: boolean;
    canInteract: boolean;
    reserveModeActive: boolean;
    isOnline?: boolean;
    localPlayer?: PlayerKey;
    theme: 'light' | 'dark';
    deckBackArtwork?: MarketDeckBackArtworkMap;
    handleReserveDeck: (level: number) => void;
    handleBuy: (card: CardType, context?: CardInteractionContext) => void;
    handleReserve: (card: CardType, context?: CardInteractionContext) => void;
    isPendingMarketRefillSlot: (
        level: 1 | 2 | 3,
        index: number,
        cardId: string | null | undefined
    ) => boolean;
    onPreviewCard?: (card: CardType) => void;
}

export function MarketLevelRow({
    lvl,
    marketCards,
    deck,
    turn,
    inventories,
    playerTableau,
    playerBuffs,
    marketInteraction,
    canInteract,
    reserveModeActive,
    isOnline,
    localPlayer,
    theme,
    deckBackArtwork,
    handleReserveDeck,
    handleBuy,
    handleReserve,
    isPendingMarketRefillSlot,
    onPreviewCard,
}: MarketLevelRowProps) {
    const t = useT();
    const visibilitySource = isOnline && localPlayer ? localPlayer : turn;
    const visibilityBuffs = playerBuffs?.[visibilitySource]?.effects?.passive || {};
    const revealL1 = lvl === 1 && visibilityBuffs.revealDeck1;
    const revealL3 = lvl === 3 && visibilityBuffs.extraL3;
    const topCard = deck.length > 0 ? deck[deck.length - 1] : null;
    const deckArtwork = deckBackArtwork?.[lvl];
    const reserveOnClickActive = reserveModeActive && marketInteraction && canInteract;
    const canReserveDeck = marketInteraction && canInteract && deck.length > 0;
    const extraL3Cards =
        lvl === 3 && revealL3
            ? [
                  deck.length > 1 ? deck[deck.length - 2] : null,
                  deck.length > 2 ? deck[deck.length - 3] : null,
              ].filter((card): card is CardType => Boolean(card))
            : [];
    const canBuy = (card: CardType) =>
        marketInteraction &&
        canInteract &&
        calculateTransaction(card, inventories[turn], playerTableau[turn], playerBuffs[turn], false)
            .affordable;

    const renderCard = (
        card: CardType,
        context: CardInteractionContext,
        options: { isDeckPreview?: boolean } = {}
    ) => {
        const canBuyCard = canBuy(card);

        return (
            <Card
                card={card}
                canBuy={canBuyCard}
                context={context}
                onClick={canBuyCard ? handleBuy : onPreviewCard}
                onReserve={canInteract ? handleReserve : undefined}
                reserveOnClick={reserveOnClickActive}
                allowUnavailableClick={
                    !canBuyCard && !reserveOnClickActive && Boolean(onPreviewCard)
                }
                theme={theme}
                isDeckPreview={options.isDeckPreview}
                size="featured"
            />
        );
    };

    return (
        <div className="flex gap-1.5 justify-center items-center relative">
            <div className="relative">
                {lvl === 1 && revealL1 && topCard && (
                    <div className="absolute right-full mr-4 animate-in slide-in-from-right-4 fade-in duration-500">
                        <div className="relative p-1 border-2 border-dashed border-purple-500/50 rounded-xl">
                            {renderCard(
                                topCard,
                                { level: 1, idx: 0, isExtra: true, extraIdx: 0 },
                                { isDeckPreview: true }
                            )}
                            <div className="absolute inset-0 bg-black/20 rounded-lg pointer-events-none" />
                        </div>
                        <div className="text-[8px] font-black text-purple-400 uppercase tracking-widest text-center mt-1">
                            {t('market.insight')}
                        </div>
                    </div>
                )}

                {lvl === 3 && extraL3Cards.length > 0 && (
                    <div className="absolute right-full mr-4 flex gap-2 top-0">
                        {extraL3Cards.map((card, idx) => (
                            <div
                                key={`extra-${idx}`}
                                className="animate-in slide-in-from-right-4 fade-in duration-500"
                            >
                                {renderCard(card, {
                                    level: 3,
                                    idx,
                                    isExtra: true,
                                    extraIdx: idx + 1,
                                })}
                            </div>
                        ))}
                    </div>
                )}

                <div
                    data-market-deck={lvl}
                    data-market-deck-back-artwork-path={deckArtwork?.path ?? 'none'}
                    data-market-deck-back-artwork-variant={deckArtwork?.variant ?? 'none'}
                    role={canReserveDeck ? 'button' : undefined}
                    tabIndex={canReserveDeck ? 0 : undefined}
                    onClick={() => canReserveDeck && handleReserveDeck(lvl)}
                    onKeyDown={(event) => {
                        if (!canReserveDeck || (event.key !== 'Enter' && event.key !== ' ')) {
                            return;
                        }

                        event.preventDefault();
                        handleReserveDeck(lvl);
                    }}
                    className={`shrink-0 rounded-lg border-2 border-transparent flex flex-col items-center justify-center shadow-md relative overflow-hidden ${
                        canReserveDeck
                            ? 'cursor-pointer hover:border-emerald-400 focus-visible:border-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 active:scale-[0.98]'
                            : 'cursor-default opacity-60'
                    }`}
                    style={{
                        width: `${FEATURED_CARD_SIZE.width}px`,
                        height: `${FEATURED_CARD_SIZE.height}px`,
                        contain: 'layout paint',
                        isolation: 'isolate',
                        transform: 'translateZ(0)',
                    }}
                >
                    <MarketDeckBack
                        level={lvl}
                        count={deck.length}
                        theme={theme}
                        levelLabel={t('market.level', { level: lvl })}
                        artwork={deckArtwork}
                    />
                </div>
            </div>

            <div className="flex gap-1.5">
                {marketCards.map((card, index) => (
                    <div
                        key={`slot-${lvl}-${index}`}
                        data-market-slot={`${lvl}-${index}`}
                        data-market-slot-level={lvl}
                        data-card-id={card?.id ?? 'empty'}
                        className="relative flex items-center justify-center"
                        style={{
                            width: `${FEATURED_CARD_SIZE.width}px`,
                            height: `${FEATURED_CARD_SIZE.height}px`,
                        }}
                    >
                        {card && (
                            <div
                                data-market-card-pending-refill={
                                    isPendingMarketRefillSlot(lvl, index, card.id)
                                        ? 'true'
                                        : undefined
                                }
                                style={
                                    isPendingMarketRefillSlot(lvl, index, card.id)
                                        ? { visibility: 'hidden', pointerEvents: 'none' }
                                        : undefined
                                }
                            >
                                {renderCard(card, { level: lvl, idx: index })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
