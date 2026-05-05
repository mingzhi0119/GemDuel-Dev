import { getVisibleReservedCards } from '@gemduel/shared/logic/multiplayerVisibility';
import type { GameState, PlayerKey } from '@gemduel/shared/types';
import type {
    CardFlightPresentationItem,
    CardFlightSource,
    PresentationEvent,
} from './presentationTypes';

const PLAYER_KEYS = ['p1', 'p2'] as const satisfies readonly PlayerKey[];
const MARKET_LEVELS = [1, 2, 3] as const;

const findMarketCardSource = (
    state: GameState,
    cardId: string
): Extract<CardFlightSource, { kind: 'market' }> | null => {
    for (const level of MARKET_LEVELS) {
        const index = state.market[level].findIndex((card) => card?.id === cardId);
        if (index >= 0) {
            return { kind: 'market', level, index };
        }
    }

    return null;
};

const findReservedCardIndex = (state: GameState, player: PlayerKey, cardId: string): number =>
    getVisibleReservedCards(state.playerReserved[player]).findIndex((card) => card.id === cardId);

const getNewCardIds = (
    previousCards: Array<{ id: string }>,
    nextCards: Array<{ id: string }>
): string[] => {
    const previousIds = new Set(previousCards.map((card) => card.id));
    return nextCards.map((card) => card.id).filter((cardId) => !previousIds.has(cardId));
};

const createCardFlightItems = (
    previousState: GameState,
    nextState: GameState,
    player: PlayerKey,
    cardIds: string[],
    target: 'tableau' | 'reserved'
): CardFlightPresentationItem[] =>
    cardIds.reduce<CardFlightPresentationItem[]>((items, cardId) => {
        const nextCollection =
            target === 'tableau'
                ? nextState.playerTableau[player]
                : getVisibleReservedCards(nextState.playerReserved[player]);
        const card = nextCollection.find((nextCard) => nextCard.id === cardId);

        if (!card) {
            return items;
        }

        const reservedIndex = findReservedCardIndex(previousState, player, cardId);
        const marketSource = findMarketCardSource(previousState, cardId);
        let source: CardFlightSource = { kind: 'unknown' };

        if (target === 'tableau' && reservedIndex >= 0) {
            source = { kind: 'reserved', index: reservedIndex };
        } else if (marketSource) {
            source = marketSource;
        } else if (target === 'reserved') {
            source = { kind: 'deck', level: card.level };
        }

        items.push({
            cardId,
            card,
            bonusColor: card.bonusColor,
            source,
            targetIndex: nextCollection.findIndex((nextCard) => nextCard.id === cardId),
        });

        return items;
    }, []);

export const deriveCardEvents = (
    previousState: GameState,
    nextState: GameState,
    currentIndex: number
): PresentationEvent[] => {
    const events: PresentationEvent[] = [];

    for (const player of PLAYER_KEYS) {
        const acquiredCardIds = getNewCardIds(
            previousState.playerTableau[player],
            nextState.playerTableau[player]
        );
        if (acquiredCardIds.length > 0) {
            const cards = createCardFlightItems(
                previousState,
                nextState,
                player,
                acquiredCardIds,
                'tableau'
            );
            events.push({
                id: `card-acquire:${currentIndex}:${player}:${acquiredCardIds.join(',')}`,
                type: 'card-acquire',
                player,
                cardIds: acquiredCardIds,
                cards,
                createdAtIndex: currentIndex,
            });
        }

        const reservedCardIds = getNewCardIds(
            getVisibleReservedCards(previousState.playerReserved[player]),
            getVisibleReservedCards(nextState.playerReserved[player])
        );
        if (reservedCardIds.length > 0) {
            const cards = createCardFlightItems(
                previousState,
                nextState,
                player,
                reservedCardIds,
                'reserved'
            );
            events.push({
                id: `card-reserve:${currentIndex}:${player}:${reservedCardIds.join(',')}`,
                type: 'card-reserve',
                player,
                cardIds: reservedCardIds,
                cards,
                createdAtIndex: currentIndex,
            });
        }
    }

    return events;
};
