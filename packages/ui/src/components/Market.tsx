import React, { useCallback } from 'react';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import {
    Card as CardType,
    CardInteractionContext,
    DeckState,
    GamePhase,
    GemInventory,
    MarketState,
    PlayerKey,
    Buff,
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
    onPreviewDeckReserve?: (level: 1 | 2 | 3) => void;
    theme: 'light' | 'dark';
    isOnline?: boolean;
    localPlayer?: PlayerKey;
    surfaceStyle?: React.CSSProperties;
    deckBackArtwork?: MarketDeckBackArtworkMap;
    pendingMarketRefillSlots?: Array<{
        level: 1 | 2 | 3;
        index: number;
        nextCardId?: string | null;
    }>;
    onPreviewCard?: (card: CardType, context: CardInteractionContext) => void;
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
        onPreviewDeckReserve,
        theme,
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
                            theme={theme}
                            deckBackArtwork={deckBackArtwork}
                            onPreviewDeckReserve={onPreviewDeckReserve}
                            isPendingMarketRefillSlot={isPendingMarketRefillSlot}
                            onPreviewCard={onPreviewCard}
                        />
                    ))}
                </div>
            </div>
        );
    }
);
