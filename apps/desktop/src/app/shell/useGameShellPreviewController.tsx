import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { MarketDeckBackArtworkMap } from '@gemduel/ui/components/card/cardBackArtwork';
import type {
    PlayerZoneBuffPreviewAction,
    PlayerZoneStackState,
} from '@gemduel/ui/components/playerZone/types';
import { getLexiconLabel, type AppLocale, type TranslationKey } from '@gemduel/shared';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import { canPlayerInteract } from '@gemduel/shared/logic/interactionAccess';
import type {
    Card as CardType,
    CardInteractionContext,
    PlayerKey,
    RoyalCard,
    ThemeName,
} from '@gemduel/shared/types';
import type { AppRouteProps } from '@app/types/ui';
import {
    getRevealPreviewEntries,
    type CardPreviewState,
    type RevealCardPreviewEntry,
} from './cardPreviewState';
import { createGameShellCardPreviewModel } from './gameShellCardPreviewModel';

type EffectiveGameMode = AppRouteProps['game']['state']['phase'] | 'REVIEW' | 'GAME_OVER';
type Translate = (key: TranslationKey, params?: Record<string, unknown>) => string;

interface GameShellPreviewControllerOptions {
    state: AppRouteProps['game']['state'];
    handlers: AppRouteProps['game']['handlers'];
    canAfford: AppRouteProps['game']['getters']['canAfford'];
    effectiveGameMode: EffectiveGameMode;
    localPlayer: PlayerKey;
    locale: AppLocale;
    t: Translate;
    theme: ThemeName;
    marketDeckBackArtwork?: MarketDeckBackArtworkMap;
    isReviewing: boolean;
}

interface PeekPreviewModel {
    isOpen: boolean;
    cards: CardType[];
    title: string;
    previewContent?: ReactNode;
}

export const useGameShellPreviewController = ({
    state,
    handlers,
    canAfford,
    effectiveGameMode,
    localPlayer,
    locale,
    t,
    theme,
    marketDeckBackArtwork,
    isReviewing,
}: GameShellPreviewControllerOptions) => {
    const { activeModal, playerBuffs } = state;
    const { clearPreselectedReserveGold, handleCloseModal } = handlers;
    const [cardPreview, setCardPreview] = useState<CardPreviewState | null>(null);

    const openPreview = useCallback(
        (preview: CardPreviewState) => {
            clearPreselectedReserveGold();
            setCardPreview(preview);
        },
        [clearPreselectedReserveGold]
    );

    const previewMarketCard = useCallback(
        (card: CardType, context: CardInteractionContext) => {
            openPreview({ kind: 'market-card', mode: 'single', card, context });
        },
        [openPreview]
    );

    const previewDeckReserve = useCallback(
        (level: 1 | 2 | 3) => {
            openPreview({ kind: 'deck-reserve', mode: 'single', level });
        },
        [openPreview]
    );

    const previewRoyalCard = useCallback(
        (card: RoyalCard) => {
            openPreview({
                kind: 'royal-card',
                mode: 'single',
                cards: [card as unknown as CardType],
            });
        },
        [openPreview]
    );

    const previewPlayerStack = useCallback(
        (stack: PlayerZoneStackState & { player: PlayerKey }) => {
            openPreview({
                kind: 'collection',
                mode: 'collection',
                cards: stack.cards,
                player: stack.player,
                color: stack.color,
                title: stack.title,
            });
        },
        [openPreview]
    );

    const previewRevealCards = useCallback(
        (player: PlayerKey, entries: RevealCardPreviewEntry[]) => {
            if (entries.length === 0) {
                return;
            }

            openPreview({
                kind: 'reveal-cards',
                mode: 'collection',
                entries,
                player,
                title: getLexiconLabel('reveal', locale),
            });
        },
        [locale, openPreview]
    );

    const previewModel = useMemo(
        () =>
            createGameShellCardPreviewModel({
                cardPreview,
                state,
                handlers,
                canAfford,
                effectiveGameMode,
                localPlayer,
                locale,
                t,
                theme,
                marketDeckBackArtwork,
            }),
        [
            canAfford,
            cardPreview,
            effectiveGameMode,
            handlers,
            locale,
            localPlayer,
            marketDeckBackArtwork,
            state,
            t,
            theme,
        ]
    );

    const buffPreviewActions = useMemo<
        Partial<Record<PlayerKey, PlayerZoneBuffPreviewAction>>
    >(() => {
        const surfacePolicy = getFsmPhaseSurfacePolicy(effectiveGameMode);
        const localCanInteract = canPlayerInteract(state, isReviewing);
        const canUseBuffPreview = (player: PlayerKey) =>
            state.turn === player && surfacePolicy.marketInteraction && localCanInteract;
        const buildAction = (player: PlayerKey): PlayerZoneBuffPreviewAction | undefined => {
            const buff = playerBuffs?.[player];
            if (!buff || buff.id === 'none') {
                return undefined;
            }

            const canUse = canUseBuffPreview(player);
            if (buff.effects?.active === 'peek_deck') {
                return {
                    id: 'peek',
                    label: t('buffPreview.peek'),
                    disabled: !canUse,
                    onClick: () => {
                        clearPreselectedReserveGold();
                        setCardPreview(null);
                        handlers.handlePeekDeck('all');
                    },
                };
            }

            if (buff.effects?.passive?.revealDeck1 || buff.effects?.passive?.extraL3) {
                const entries = getRevealPreviewEntries(state, player);
                return {
                    id: 'reveal',
                    label: getLexiconLabel('reveal', locale),
                    disabled: !canUse || entries.length === 0,
                    onClick: () => previewRevealCards(player, entries),
                };
            }

            return undefined;
        };

        return {
            p1: buildAction('p1'),
            p2: buildAction('p2'),
        };
    }, [
        clearPreselectedReserveGold,
        effectiveGameMode,
        handlers,
        isReviewing,
        locale,
        playerBuffs,
        previewRevealCards,
        state,
        t,
    ]);

    const shouldShowPeekPreview =
        activeModal?.type === 'PEEK' &&
        !isReviewing &&
        (state.mode !== 'ONLINE_MULTIPLAYER' || activeModal.data.initiator === localPlayer);
    const peekPreviewCards = shouldShowPeekPreview ? activeModal.data.cards : [];
    const peekPreviewContent =
        shouldShowPeekPreview && peekPreviewCards.length === 0 ? (
            <div
                data-card-preview-peek-empty="true"
                className="flex h-full w-full items-center justify-center rounded-xl border border-purple-300/30 bg-slate-950/70 px-6 text-center text-sm font-black uppercase tracking-[0.12em] text-purple-100"
            >
                {t('deckPeek.empty')}
            </div>
        ) : undefined;
    const peekPreviewModel: PeekPreviewModel = {
        isOpen: Boolean(shouldShowPeekPreview),
        cards: peekPreviewCards,
        title: t('deckPeek.title'),
        previewContent: peekPreviewContent,
    };

    return {
        buffPreviewActions,
        closeCardPreview: () => setCardPreview(null),
        handleClosePeekPreview: handleCloseModal,
        peekPreviewModel,
        previewDeckReserve,
        previewMarketCard,
        previewModel,
        previewPlayerStack,
        previewRoyalCard,
        isCardPreviewOpen: Boolean(cardPreview),
    };
};
