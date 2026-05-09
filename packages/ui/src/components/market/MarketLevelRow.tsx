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
    theme: 'light' | 'dark';
    deckBackArtwork?: MarketDeckBackArtworkMap;
    onPreviewDeckReserve?: (level: 1 | 2 | 3) => void;
    isPendingMarketRefillSlot: (
        level: 1 | 2 | 3,
        index: number,
        cardId: string | null | undefined
    ) => boolean;
    onPreviewCard?: (card: CardType, context: CardInteractionContext) => void;
    enableThreeCardDepth?: boolean;
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
    theme,
    deckBackArtwork,
    onPreviewDeckReserve,
    isPendingMarketRefillSlot,
    onPreviewCard,
    enableThreeCardDepth = false,
}: MarketLevelRowProps) {
    const t = useT();
    const deckArtwork = deckBackArtwork?.[lvl];
    const canPreviewDeckReserve = Boolean(onPreviewDeckReserve) && deck.length > 0;
    const deckBackInteractivityClass = canPreviewDeckReserve
        ? 'cursor-pointer hover:border-emerald-400 focus-visible:border-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 active:scale-[0.98]'
        : deck.length === 0
          ? 'cursor-default opacity-60'
          : 'cursor-default';
    const canBuy = (card: CardType) =>
        marketInteraction &&
        canInteract &&
        calculateTransaction(card, inventories[turn], playerTableau[turn], playerBuffs[turn], false)
            .affordable;

    const renderCard = (card: CardType, context: CardInteractionContext) => {
        const canBuyCard = canBuy(card);

        return (
            <Card
                card={card}
                canBuy={canBuyCard}
                context={context}
                onClick={(previewCard, previewContext) => {
                    if (previewContext) {
                        onPreviewCard?.(previewCard, previewContext);
                    }
                }}
                allowUnavailableClick={Boolean(onPreviewCard)}
                theme={theme}
                size="featured"
                depthLayer={enableThreeCardDepth ? 'market' : undefined}
            />
        );
    };

    return (
        <div className="flex gap-1.5 justify-center items-center relative">
            <div className="relative">
                <div
                    data-market-deck={lvl}
                    data-market-deck-back-artwork-path={deckArtwork?.path ?? 'none'}
                    data-market-deck-back-artwork-variant={deckArtwork?.variant ?? 'none'}
                    role={canPreviewDeckReserve ? 'button' : undefined}
                    tabIndex={canPreviewDeckReserve ? 0 : undefined}
                    onClick={() => canPreviewDeckReserve && onPreviewDeckReserve?.(lvl)}
                    onKeyDown={(event) => {
                        if (
                            !canPreviewDeckReserve ||
                            (event.key !== 'Enter' && event.key !== ' ')
                        ) {
                            return;
                        }

                        event.preventDefault();
                        onPreviewDeckReserve?.(lvl);
                    }}
                    className={`shrink-0 rounded-lg border-2 border-transparent flex flex-col items-center justify-center shadow-md relative overflow-hidden ${deckBackInteractivityClass}`}
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
                                data-market-card-hover-motion="true"
                                data-market-card-pending-refill={
                                    isPendingMarketRefillSlot(lvl, index, card.id)
                                        ? 'true'
                                        : undefined
                                }
                                className="relative transition-transform duration-150 ease-out hover:z-20 hover:scale-[1.025] focus-within:z-20 focus-within:scale-[1.025]"
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
