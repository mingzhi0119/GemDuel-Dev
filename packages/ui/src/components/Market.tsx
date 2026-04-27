import React, { useCallback } from 'react';
import { Card, FEATURED_CARD_SIZE } from './Card';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import { calculateTransaction } from '@gemduel/shared/utils';
import {
    Card as CardType,
    CardActionSource,
    CardInteractionContext,
    DeckState,
    GamePhase,
    GemInventory,
    MarketState,
    PlayerKey,
    Buff,
    InitiateBuyJokerPayload,
} from '@gemduel/shared/types';
import { useT } from '../i18n/LocaleProvider';
import { LexiconTerm } from '../lexicon/LexiconTerm';
import { MarketDeckBack } from './market/MarketDeckBack';
import type { MarketDeckBackArtworkMap } from './card/cardBackArtwork';

interface MarketProps {
    market: MarketState;
    decks: DeckState;
    phase: GamePhase | string;
    turn: PlayerKey;
    inventories: Record<PlayerKey, GemInventory>;
    playerTableau: Record<PlayerKey, CardType[]>;
    playerBuffs: Record<PlayerKey, Buff>;
    handleReserveDeck: (level: number) => void;
    initiateBuy: (
        card: CardType,
        source: CardActionSource,
        marketInfo?: InitiateBuyJokerPayload['marketInfo']
    ) => void;
    handleReserveCard: (card: CardType, marketInfo: CardInteractionContext) => void;
    onPeekDeck?: (level: number) => void;
    theme: 'light' | 'dark';
    reserveModeActive?: boolean;
    isOnline?: boolean;
    localPlayer?: PlayerKey;
    surfaceStyle?: React.CSSProperties;
    deckBackArtwork?: MarketDeckBackArtworkMap;
}

export const Market: React.FC<MarketProps> = React.memo(
    ({
        market,
        decks,
        phase,
        turn,
        inventories,
        playerTableau,
        playerBuffs,
        handleReserveDeck,
        initiateBuy,
        handleReserveCard,
        onPeekDeck,
        theme,
        reserveModeActive = false,
        isOnline,
        localPlayer,
        surfaceStyle,
        deckBackArtwork,
    }) => {
        const t = useT();
        const surfacePolicy = getFsmPhaseSurfacePolicy(phase);
        // Validation: Is it my turn and not in review/game over?
        const canInteract =
            (!isOnline || turn === localPlayer) && phase !== 'REVIEW' && phase !== 'GAME_OVER';
        const activeBuff = playerBuffs[turn];
        const hasIntelligence =
            activeBuff?.effects?.active === 'peek_deck' &&
            surfacePolicy.marketInteraction &&
            canInteract;

        // Optimization: Stable callback for buying cards
        const handleBuy = useCallback(
            (card: CardType, context?: CardInteractionContext) => {
                if (canInteract && card && context) {
                    if (reserveModeActive) {
                        handleReserveCard(card, context);
                        return;
                    }

                    initiateBuy(card, 'market', context);
                }
            },
            [canInteract, handleReserveCard, initiateBuy, reserveModeActive]
        );

        // Optimization: Stable callback for reserving cards
        const handleReserve = useCallback(
            (card: CardType, context?: CardInteractionContext) => {
                if (canInteract && card && context) {
                    handleReserveCard(card, context);
                }
            },
            [handleReserveCard, canInteract]
        );

        return (
            <div
                data-surface-slot="market-background"
                className={`relative shrink-0 overflow-visible rounded-[2.5rem] p-5 transition-all duration-500 ${
                    !canInteract ? 'opacity-80' : ''
                }`}
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ ...surfaceStyle, borderRadius: 'inherit' }}
                />

                <div className="relative z-10 flex flex-col gap-2.5 items-center">
                    <h2
                        className="mb-1 text-center text-[13px] font-black uppercase tracking-[0.34em]"
                        style={{
                            color: 'var(--gd-shell-label-primary)',
                            textShadow: 'var(--gd-shell-text-shadow)',
                        }}
                    >
                        <LexiconTerm termId="market" className="normal-case" underline={false}>
                            {t('market.title')}
                        </LexiconTerm>
                    </h2>

                    {/* Intelligence Network Floating Action (Positioned Left) */}
                    {hasIntelligence && (
                        <div
                            className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-3 rounded-xl border animate-in slide-in-from-right-4 fade-in duration-500 z-50
                        ${theme === 'dark' ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-50/50 border-purple-200'}
                    `}
                        >
                            <div className="text-purple-400 text-[8px] font-black uppercase tracking-widest text-center whitespace-nowrap">
                                {t('market.intelligence')}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {[3, 2, 1].map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => onPeekDeck && onPeekDeck(lvl)}
                                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
                                    >
                                        {t('market.peek', { level: lvl })}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {([3, 2, 1] as const).map((lvl) => {
                        // Visibility Logic
                        const visibilitySource = isOnline && localPlayer ? localPlayer : turn;
                        const visibilityBuffs =
                            playerBuffs?.[visibilitySource]?.effects?.passive || {};

                        const revealL1 = lvl === 1 && visibilityBuffs.revealDeck1;
                        const revealL3 = lvl === 3 && visibilityBuffs.extraL3;

                        const deck = decks[lvl];
                        const topCard = deck.length > 0 ? deck[deck.length - 1] : null;
                        const deckArtwork = deckBackArtwork?.[lvl];

                        const extraL3Cards =
                            lvl === 3 && revealL3
                                ? [
                                      deck.length > 1 ? deck[deck.length - 2] : null,
                                      deck.length > 2 ? deck[deck.length - 3] : null,
                                  ].filter(Boolean)
                                : [];

                        return (
                            <div
                                key={lvl}
                                className="flex gap-1.5 justify-center items-center relative"
                            >
                                {/* Deck Container */}
                                <div className="relative">
                                    {/* Insight Buff (L1 Peek) - Positioned to the left of L1 Deck */}
                                    {lvl === 1 && revealL1 && topCard && (
                                        <div className="absolute right-full mr-4 animate-in slide-in-from-right-4 fade-in duration-500">
                                            <div className="relative p-1 border-2 border-dashed border-purple-500/50 rounded-xl">
                                                <Card
                                                    card={topCard}
                                                    canBuy={
                                                        surfacePolicy.marketInteraction &&
                                                        canInteract &&
                                                        calculateTransaction(
                                                            topCard,
                                                            inventories[turn],
                                                            playerTableau[turn],
                                                            playerBuffs[turn],
                                                            false
                                                        ).affordable
                                                    }
                                                    context={{
                                                        level: 1,
                                                        idx: 0,
                                                        isExtra: true,
                                                        extraIdx: 0,
                                                    }}
                                                    onClick={handleBuy}
                                                    onReserve={
                                                        canInteract ? handleReserve : undefined
                                                    }
                                                    reserveOnClick={
                                                        reserveModeActive &&
                                                        surfacePolicy.marketInteraction &&
                                                        canInteract
                                                    }
                                                    theme={theme}
                                                    isDeckPreview={true}
                                                    size="featured"
                                                />
                                                <div className="absolute inset-0 bg-black/20 rounded-lg pointer-events-none" />
                                            </div>
                                            <div className="text-[8px] font-black text-purple-400 uppercase tracking-widest text-center mt-1">
                                                {t('market.insight')}
                                            </div>
                                        </div>
                                    )}

                                    {/* Extra Cards for All-Seeing Eye (Positioned absolutely to the left) */}
                                    {lvl === 3 && extraL3Cards.length > 0 && (
                                        <div className="absolute right-full mr-4 flex gap-2 top-0">
                                            {extraL3Cards.map((card, idx) => (
                                                <div
                                                    key={`extra-${idx}`}
                                                    className="animate-in slide-in-from-right-4 fade-in duration-500"
                                                >
                                                    <Card
                                                        card={card}
                                                        canBuy={
                                                            surfacePolicy.marketInteraction &&
                                                            canInteract &&
                                                            card !== null &&
                                                            calculateTransaction(
                                                                card,
                                                                inventories[turn],
                                                                playerTableau[turn],
                                                                playerBuffs[turn],
                                                                false
                                                            ).affordable
                                                        }
                                                        context={{
                                                            level: 3,
                                                            idx,
                                                            isExtra: true,
                                                            extraIdx: idx + 1,
                                                        }}
                                                        onClick={handleBuy}
                                                        onReserve={
                                                            canInteract ? handleReserve : undefined
                                                        }
                                                        reserveOnClick={
                                                            reserveModeActive &&
                                                            surfacePolicy.marketInteraction &&
                                                            canInteract
                                                        }
                                                        theme={theme}
                                                        size="featured"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div
                                        data-market-deck={lvl}
                                        data-market-deck-back-artwork-path={
                                            deckArtwork?.path ?? 'none'
                                        }
                                        data-market-deck-back-artwork-variant={
                                            deckArtwork?.variant ?? 'none'
                                        }
                                        onClick={() =>
                                            surfacePolicy.marketInteraction &&
                                            canInteract &&
                                            handleReserveDeck(lvl)
                                        }
                                        className={`shrink-0 rounded-lg border-2 flex flex-col items-center justify-center shadow-md relative overflow-hidden
                            ${
                                surfacePolicy.marketInteraction &&
                                canInteract &&
                                decks[lvl].length > 0
                                    ? (theme === 'dark'
                                          ? 'border-slate-600 hover:border-emerald-400'
                                          : 'border-slate-400 hover:border-emerald-500') +
                                      ' cursor-pointer active:scale-[0.98]'
                                    : (theme === 'dark'
                                          ? 'border-slate-700 opacity-60'
                                          : 'border-slate-300 opacity-55') + ' cursor-default'
                            }
                        `}
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
                                            count={decks[lvl].length}
                                            theme={theme}
                                            levelLabel={t('market.level', { level: lvl })}
                                            artwork={deckArtwork}
                                        />
                                    </div>
                                </div>

                                {/* Market Cards */}
                                <div className="flex gap-1.5">
                                    {market[lvl].map((card: CardType | null, i: number) => (
                                        <div
                                            key={`slot-${lvl}-${i}`}
                                            data-market-slot={`${lvl}-${i}`}
                                            data-market-slot-level={lvl}
                                            data-card-id={card?.id ?? 'empty'}
                                            className="relative flex items-center justify-center"
                                            style={{
                                                width: `${FEATURED_CARD_SIZE.width}px`,
                                                height: `${FEATURED_CARD_SIZE.height}px`,
                                            }}
                                        >
                                            {card && (
                                                <Card
                                                    key={card.id}
                                                    card={card}
                                                    canBuy={
                                                        surfacePolicy.marketInteraction &&
                                                        canInteract &&
                                                        calculateTransaction(
                                                            card,
                                                            inventories[turn],
                                                            playerTableau[turn],
                                                            playerBuffs[turn],
                                                            false
                                                        ).affordable
                                                    }
                                                    context={{
                                                        level: lvl as 1 | 2 | 3,
                                                        idx: i,
                                                    }}
                                                    onClick={handleBuy}
                                                    onReserve={
                                                        canInteract ? handleReserve : undefined
                                                    }
                                                    reserveOnClick={
                                                        reserveModeActive &&
                                                        surfacePolicy.marketInteraction &&
                                                        canInteract
                                                    }
                                                    theme={theme}
                                                    size="featured"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
);
