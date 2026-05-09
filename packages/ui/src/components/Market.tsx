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
import {
    READABILITY_HUD_GLASS_CLASS,
    READABILITY_HUD_LABEL_TEXT_STYLE,
} from './readabilityHudStyles';
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
    readabilityTreatment?: boolean;
    enableThreeCardDepth?: boolean;
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
        readabilityTreatment = false,
        enableThreeCardDepth = false,
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
                        data-readability-hud-chip={
                            readabilityTreatment ? 'market-label' : undefined
                        }
                        className={`mb-1 text-center font-black uppercase ${
                            readabilityTreatment
                                ? `${READABILITY_HUD_GLASS_CLASS} rounded-full px-6 py-2 text-[20px] leading-none tracking-[0.18em] antialiased`
                                : 'text-[13px] tracking-[0.34em]'
                        }`}
                        style={{
                            ...(readabilityTreatment ? READABILITY_HUD_LABEL_TEXT_STYLE : {}),
                            color: 'var(--gd-shell-label-primary)',
                            textShadow: readabilityTreatment
                                ? READABILITY_HUD_LABEL_TEXT_STYLE.textShadow
                                : 'var(--gd-shell-text-shadow)',
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
                            enableThreeCardDepth={enableThreeCardDepth}
                        />
                    ))}
                </div>
            </div>
        );
    }
);
