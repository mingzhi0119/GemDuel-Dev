import type { ReactNode } from 'react';
import type { CardPreviewMode } from '@gemduel/ui/components/CardPreviewOverlay';
import {
    createCardPreviewActions,
    type CardPreviewAction,
} from '@gemduel/ui/components/cardPreviewActions';
import type { MarketDeckBackArtworkMap } from '@gemduel/ui/components/card/cardBackArtwork';
import { FEATURED_CARD_SIZE } from '@gemduel/ui/components/card/cardSizing';
import { MarketDeckBack } from '@gemduel/ui/components/market/MarketDeckBack';
import { getLexiconLabel, type AppLocale, type TranslationKey } from '@gemduel/shared';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import type { Card as CardType, PlayerKey, ThemeName } from '@gemduel/shared/types';
import type { AppRouteProps } from '@app/types/ui';
import { getPreviewSourceCard, type CardPreviewState } from './cardPreviewState';

type EffectiveGameMode = AppRouteProps['game']['state']['phase'] | 'REVIEW' | 'GAME_OVER';
type Translate = (key: TranslationKey, params?: Record<string, unknown>) => string;

interface GameShellCardPreviewModel {
    mode: CardPreviewMode;
    cards: CardType[];
    player?: PlayerKey;
    color?: string;
    title?: string;
    previewContent?: ReactNode;
    actions: CardPreviewAction[];
    cardActions: CardPreviewAction[][];
}

interface GameShellCardPreviewModelOptions {
    cardPreview: CardPreviewState | null;
    state: AppRouteProps['game']['state'];
    handlers: AppRouteProps['game']['handlers'];
    canAfford: AppRouteProps['game']['getters']['canAfford'];
    effectiveGameMode: EffectiveGameMode;
    localPlayer: PlayerKey;
    locale: AppLocale;
    t: Translate;
    theme: ThemeName;
    marketDeckBackArtwork?: MarketDeckBackArtworkMap;
}

export const createGameShellCardPreviewModel = ({
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
}: GameShellCardPreviewModelOptions): GameShellCardPreviewModel => {
    if (!cardPreview) {
        return {
            mode: 'single',
            cards: [],
            actions: createCardPreviewActions(),
            cardActions: [],
        };
    }

    const previewSurfacePolicy = getFsmPhaseSurfacePolicy(effectiveGameMode);
    const canRunPreviewAction =
        previewSurfacePolicy.marketInteraction &&
        effectiveGameMode !== 'REVIEW' &&
        effectiveGameMode !== 'GAME_OVER' &&
        (!state.mode || state.mode !== 'ONLINE_MULTIPLAYER' || state.turn === localPlayer);
    const reserveRoomAvailable = state.playerReserved[state.turn].length < 3;
    const buyLabel = getLexiconLabel('buyCard', locale);
    const reserveLabel = getLexiconLabel('reserve', locale);
    const revealLabel = getLexiconLabel('reveal', locale);

    if (cardPreview.kind === 'market-card') {
        const sourceCard = getPreviewSourceCard(state, cardPreview.context);
        const sourceStillMatches = sourceCard?.id === cardPreview.card.id;
        const canBuyPreviewCard =
            canRunPreviewAction && sourceStillMatches && canAfford(cardPreview.card, false);
        const canReservePreviewCard =
            canRunPreviewAction && sourceStillMatches && reserveRoomAvailable;

        return {
            mode: 'single',
            cards: [cardPreview.card],
            title: cardPreview.title,
            actions: createCardPreviewActions(
                {
                    id: 'buy',
                    label: buyLabel,
                    disabled: !canBuyPreviewCard,
                    onAction: () =>
                        handlers.initiateBuy(cardPreview.card, 'market', cardPreview.context),
                },
                {
                    id: 'reserve',
                    label: reserveLabel,
                    disabled: !canReservePreviewCard,
                    onAction: () =>
                        handlers.handleReserveCard(cardPreview.card, cardPreview.context),
                }
            ),
            cardActions: [],
        };
    }

    if (cardPreview.kind === 'reveal-cards') {
        const cards = cardPreview.entries.map((entry) => entry.card);

        return {
            mode: 'collection',
            cards,
            player: cardPreview.player,
            color: 'reveal',
            title: cardPreview.title ?? revealLabel,
            actions: createCardPreviewActions(),
            cardActions: cardPreview.entries.map(({ card, context }) => {
                const sourceCard = getPreviewSourceCard(state, context);
                const sourceStillMatches = sourceCard?.id === card.id;
                const canBuyPreviewCard =
                    canRunPreviewAction && sourceStillMatches && canAfford(card, false);
                const canReservePreviewCard =
                    canRunPreviewAction && sourceStillMatches && reserveRoomAvailable;

                return createCardPreviewActions(
                    {
                        id: 'buy',
                        label: buyLabel,
                        disabled: !canBuyPreviewCard,
                        onAction: () => handlers.initiateBuy(card, 'market', context),
                    },
                    {
                        id: 'reserve',
                        label: reserveLabel,
                        disabled: !canReservePreviewCard,
                        onAction: () => handlers.handleReserveCard(card, context),
                    }
                );
            }),
        };
    }

    if (cardPreview.kind === 'deck-reserve') {
        const deck = state.decks[cardPreview.level];
        const canReserveDeck = canRunPreviewAction && deck.length > 0 && reserveRoomAvailable;

        return {
            mode: 'single',
            cards: [],
            title: cardPreview.title ?? t('market.reserveDeckPreviewTitle'),
            previewContent: (
                <div
                    data-card-preview-deck-reserve={cardPreview.level}
                    className="relative overflow-hidden rounded-lg"
                    style={{
                        width: `${FEATURED_CARD_SIZE.width}px`,
                        height: `${FEATURED_CARD_SIZE.height}px`,
                    }}
                >
                    <MarketDeckBack
                        level={cardPreview.level}
                        count={deck.length}
                        theme={theme}
                        levelLabel={t('market.level', { level: cardPreview.level })}
                        artwork={marketDeckBackArtwork?.[cardPreview.level]}
                    />
                </div>
            ),
            actions: createCardPreviewActions({
                id: 'reserve',
                label: reserveLabel,
                disabled: !canReserveDeck,
                onAction: () => handlers.handleReserveDeck(cardPreview.level),
            }),
            cardActions: [],
        };
    }

    if (cardPreview.kind === 'collection') {
        return {
            mode: cardPreview.mode,
            cards: cardPreview.cards,
            player: cardPreview.player,
            color: cardPreview.color,
            title: cardPreview.title,
            actions: createCardPreviewActions(),
            cardActions: [],
        };
    }

    return {
        mode: 'single',
        cards: cardPreview.cards,
        title: cardPreview.title,
        actions: createCardPreviewActions(),
        cardActions: [],
    };
};
