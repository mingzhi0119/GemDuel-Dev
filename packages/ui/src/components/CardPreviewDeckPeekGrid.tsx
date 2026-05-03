import { motion } from 'framer-motion';
import { Card, FEATURED_CARD_SIZE } from './Card';
import type { MarketDeckBackArtworkMap } from './card/cardBackArtwork';
import { DECK_PEEK_COLUMNS } from './cardPreviewOverlayLayout';
import type { DeckPeekGroup, DeckPeekLayout } from './cardPreviewOverlayLayout';

interface CardPreviewDeckPeekGridProps {
    groups: DeckPeekGroup[];
    layout: DeckPeekLayout;
    orderLabels: string[];
    theme: 'light' | 'dark';
    deckBackArtwork?: MarketDeckBackArtworkMap;
}

export function CardPreviewDeckPeekGrid({
    groups,
    layout,
    orderLabels,
    theme,
    deckBackArtwork,
}: CardPreviewDeckPeekGridProps) {
    return (
        <div
            data-card-preview-deck-grid="true"
            className="grid overflow-visible"
            style={{
                gap: `${layout.rowGapPx}px`,
                width: `${layout.gridWidth}px`,
                minHeight: `${layout.gridHeight}px`,
            }}
        >
            {groups.map((group, groupIndex) => (
                <div
                    key={`deck-peek-level-${group.level}`}
                    data-card-preview-deck-row={group.level}
                    className="grid items-center overflow-visible"
                    style={{
                        columnGap: `${layout.columnGapPx}px`,
                        gridTemplateColumns: `${layout.levelLabelWidthPx}px repeat(${DECK_PEEK_COLUMNS}, ${layout.width}px)`,
                    }}
                >
                    <div
                        data-card-preview-deck-back={group.level}
                        className="relative overflow-hidden rounded-md border border-amber-100/30 bg-slate-950/70 shadow-[0_16px_34px_rgba(0,0,0,0.35)]"
                        style={{
                            width: `${layout.levelLabelWidthPx}px`,
                            height: `${layout.levelLabelHeightPx}px`,
                        }}
                    >
                        {deckBackArtwork?.[group.level] ? (
                            <img
                                src={deckBackArtwork[group.level]?.path}
                                alt=""
                                aria-hidden="true"
                                draggable={false}
                                data-card-preview-deck-back-img={group.level}
                                data-card-back-variant={deckBackArtwork[group.level]?.variant}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-violet-950 to-black text-xl font-black uppercase tracking-[0.18em] text-amber-100/80 sm:text-2xl">
                                L{group.level}
                            </div>
                        )}
                    </div>
                    {group.cards.map((card, index) => (
                        <motion.div
                            key={card.id || `${group.level}-${index}`}
                            data-card-preview-card={card.id}
                            className="relative overflow-visible rounded-xl"
                            initial={{ opacity: 0, y: 18, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                delay: (groupIndex * DECK_PEEK_COLUMNS + index) * 0.035,
                                duration: 0.2,
                                ease: 'easeOut',
                            }}
                            style={{
                                width: `${layout.width}px`,
                                height: `${layout.height}px`,
                            }}
                        >
                            <div
                                data-card-preview-card-frame={card.id}
                                className="relative overflow-visible rounded-xl shadow-[0_22px_56px_rgba(0,0,0,0.42)]"
                                style={{
                                    width: `${layout.width}px`,
                                    height: `${layout.height}px`,
                                }}
                            >
                                <div
                                    className="absolute left-0 top-0"
                                    style={{
                                        width: `${FEATURED_CARD_SIZE.width}px`,
                                        height: `${FEATURED_CARD_SIZE.height}px`,
                                        transform: `scale(${layout.scale})`,
                                        transformOrigin: 'top left',
                                    }}
                                >
                                    <Card
                                        card={card}
                                        canBuy={false}
                                        theme={theme}
                                        size="featured"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ))}
            <div
                data-card-preview-deck-order-row="true"
                className="grid items-start overflow-visible"
                style={{
                    columnGap: `${layout.columnGapPx}px`,
                    gridTemplateColumns: `${layout.levelLabelWidthPx}px repeat(${DECK_PEEK_COLUMNS}, ${layout.width}px)`,
                }}
            >
                <div aria-hidden="true" />
                {orderLabels.map((orderLabel) => (
                    <div
                        key={orderLabel}
                        data-card-preview-card-order-label={orderLabel}
                        className="flex items-start justify-center text-xl font-black uppercase tracking-[0.18em] text-amber-100/85 sm:text-2xl"
                        style={{
                            height: `${layout.orderLabelHeightPx}px`,
                        }}
                    >
                        {orderLabel}
                    </div>
                ))}
            </div>
        </div>
    );
}
