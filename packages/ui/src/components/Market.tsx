import React, { useCallback } from 'react';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
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
import { MarketLevelRow } from './market/MarketLevelRow';
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
    pendingMarketRefillSlots?: Array<{
        level: 1 | 2 | 3;
        index: number;
        nextCardId?: string | null;
    }>;
    onPreviewCard?: (card: CardType) => void;
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
        pendingMarketRefillSlots = [],
        onPreviewCard,
    }) => {
        const t = useT();
        const surfacePolicy = getFsmPhaseSurfacePolicy(phase);
        const canInteract =
            (!isOnline || turn === localPlayer) && phase !== 'REVIEW' && phase !== 'GAME_OVER';
        const activeBuff = playerBuffs[turn];
        const hasIntelligence =
            activeBuff?.effects?.active === 'peek_deck' &&
            surfacePolicy.marketInteraction &&
            canInteract;
        const isPendingMarketRefillSlot = useCallback(
            (level: 1 | 2 | 3, index: number, cardId: string | null | undefined) =>
                pendingMarketRefillSlots.some(
                    (slot) =>
                        slot.level === level &&
                        slot.index === index &&
                        (!slot.nextCardId || slot.nextCardId === cardId)
                ),
            [pendingMarketRefillSlots]
        );
        const handleBuy = useCallback(
            (card: CardType, context?: CardInteractionContext) => {
                if (!canInteract || !context) {
                    return;
                }

                if (reserveModeActive) {
                    handleReserveCard(card, context);
                    return;
                }

                initiateBuy(card, 'market', context);
            },
            [canInteract, handleReserveCard, initiateBuy, reserveModeActive]
        );
        const handleReserve = useCallback(
            (card: CardType, context?: CardInteractionContext) => {
                if (canInteract && context) {
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

                    {hasIntelligence && (
                        <div
                            className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-3 rounded-xl border animate-in slide-in-from-right-4 fade-in duration-500 z-50 ${
                                theme === 'dark'
                                    ? 'bg-purple-900/20 border-purple-500/30'
                                    : 'bg-purple-50/50 border-purple-200'
                            }`}
                        >
                            <div className="text-purple-400 text-[8px] font-black uppercase tracking-widest text-center whitespace-nowrap">
                                {t('market.intelligence')}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {([3, 2, 1] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => onPeekDeck?.(level)}
                                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
                                    >
                                        {t('market.peek', { level })}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {([3, 2, 1] as const).map((lvl) => (
                        <MarketLevelRow
                            key={lvl}
                            lvl={lvl}
                            marketCards={market[lvl]}
                            deck={decks[lvl]}
                            turn={turn}
                            inventories={inventories}
                            playerTableau={playerTableau}
                            playerBuffs={playerBuffs}
                            marketInteraction={surfacePolicy.marketInteraction}
                            canInteract={canInteract}
                            reserveModeActive={reserveModeActive}
                            isOnline={isOnline}
                            localPlayer={localPlayer}
                            theme={theme}
                            deckBackArtwork={deckBackArtwork}
                            handleReserveDeck={handleReserveDeck}
                            handleBuy={handleBuy}
                            handleReserve={handleReserve}
                            isPendingMarketRefillSlot={isPendingMarketRefillSlot}
                            onPreviewCard={onPreviewCard}
                        />
                    ))}
                </div>
            </div>
        );
    }
);
