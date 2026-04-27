import type { Card, GameState, GemColor, PlayerKey } from '@gemduel/shared/types';
import type {
    AbilityCalloutPresentationEvent,
    PresentationEvent,
    RoyalUnlockMilestone,
} from '../presentation/presentationTypes';

export const SURFACE_LAB_MOTION_EVENT_TYPES = [
    'royal-unlock',
    'card-acquire',
    'card-reserve',
    'deck-reserve',
    'market-refill',
    'gem-flight',
    'gem-drop',
    'gem-steal',
    'gem-discard',
    'ability-callout',
    'turn-handoff',
] as const;

export type SurfaceLabMotionEventType = (typeof SURFACE_LAB_MOTION_EVENT_TYPES)[number];

export interface SurfaceLabMotionOptions {
    player: PlayerKey;
    marketLevel: 1 | 2 | 3;
    marketIndex: number;
    deckLevel: 1 | 2 | 3;
    gemColor: GemColor;
    row: number;
    col: number;
    callout: AbilityCalloutPresentationEvent['callout'];
    message: string;
    milestone: RoyalUnlockMilestone;
    nonce: number;
}

const getEventId = (type: SurfaceLabMotionEventType, nonce: number): string =>
    `visual-lab:${type}:${nonce}`;

const findMarketCard = (
    state: GameState,
    preferredLevel: 1 | 2 | 3,
    preferredIndex: number
): { card: Card; level: 1 | 2 | 3; index: number } | null => {
    const preferredCard = state.market[preferredLevel]?.[preferredIndex];

    if (preferredCard) {
        return { card: preferredCard, level: preferredLevel, index: preferredIndex };
    }

    for (const level of [1, 2, 3] as const) {
        const index = state.market[level].findIndex(Boolean);
        const card = index >= 0 ? state.market[level][index] : null;

        if (card) {
            return { card, level, index };
        }
    }

    return null;
};

const findDeckCard = (state: GameState, level: 1 | 2 | 3): Card | null =>
    state.decks[level][state.decks[level].length - 1] ?? null;

export const createSurfaceLabPresentationEvent = (
    type: SurfaceLabMotionEventType,
    state: GameState,
    options: SurfaceLabMotionOptions
): PresentationEvent | null => {
    const id = getEventId(type, options.nonce);
    const marketCard = findMarketCard(state, options.marketLevel, options.marketIndex);
    const sourceCell = {
        row: options.row,
        col: options.col,
        color: options.gemColor,
    };
    const opponent = options.player === 'p1' ? 'p2' : 'p1';

    switch (type) {
        case 'royal-unlock':
            return {
                id,
                type: 'royal-unlock',
                player: options.player,
                milestone: options.milestone,
                createdAtIndex: 0,
            };
        case 'card-acquire':
            if (!marketCard) return null;
            return {
                id,
                type: 'card-acquire',
                player: options.player,
                cardIds: [marketCard.card.id],
                cards: [
                    {
                        cardId: marketCard.card.id,
                        card: marketCard.card,
                        bonusColor: marketCard.card.bonusColor,
                        source: {
                            kind: 'market',
                            level: marketCard.level,
                            index: marketCard.index,
                        },
                        targetIndex: 0,
                    },
                ],
                createdAtIndex: 0,
            };
        case 'card-reserve':
            if (!marketCard) return null;
            return {
                id,
                type: 'card-reserve',
                player: options.player,
                cardIds: [marketCard.card.id],
                cards: [
                    {
                        cardId: marketCard.card.id,
                        card: marketCard.card,
                        bonusColor: marketCard.card.bonusColor,
                        source: {
                            kind: 'market',
                            level: marketCard.level,
                            index: marketCard.index,
                        },
                        targetIndex: state.playerReserved[options.player].length,
                    },
                ],
                createdAtIndex: 0,
            };
        case 'deck-reserve': {
            const deckCard = findDeckCard(state, options.deckLevel) ?? marketCard?.card;

            if (!deckCard) return null;

            return {
                id,
                type: 'card-reserve',
                player: options.player,
                cardIds: [deckCard.id],
                cards: [
                    {
                        cardId: deckCard.id,
                        card: deckCard,
                        bonusColor: deckCard.bonusColor,
                        source: { kind: 'deck', level: options.deckLevel },
                        targetIndex: state.playerReserved[options.player].length,
                    },
                ],
                createdAtIndex: 0,
            };
        }
        case 'market-refill':
            if (!marketCard) return null;
            return {
                id,
                type: 'market-refill',
                slots: [
                    {
                        level: marketCard.level,
                        index: marketCard.index,
                        previousCardId: null,
                        nextCardId: marketCard.card.id,
                        nextCard: marketCard.card,
                    },
                ],
                createdAtIndex: 0,
            };
        case 'gem-flight':
            return {
                id,
                type: 'gem-flight',
                player: options.player,
                deltas: { [options.gemColor]: 1 },
                sources: [sourceCell],
                createdAtIndex: 0,
            };
        case 'gem-drop':
            return {
                id,
                type: 'gem-drop',
                cells: [sourceCell],
                createdAtIndex: 0,
            };
        case 'gem-steal':
            return {
                id,
                type: 'gem-steal',
                fromPlayer: opponent,
                toPlayer: options.player,
                deltas: { [options.gemColor]: 1 },
                createdAtIndex: 0,
            };
        case 'gem-discard':
            return {
                id,
                type: 'gem-discard',
                player: options.player,
                deltas: { [options.gemColor]: 1 },
                createdAtIndex: 0,
            };
        case 'ability-callout':
            return {
                id,
                type: 'ability-callout',
                player: options.player,
                callout: options.callout,
                message: options.message || 'Preview',
                createdAtIndex: 0,
            };
        case 'turn-handoff':
            return {
                id,
                type: 'turn-handoff',
                fromPlayer: opponent,
                toPlayer: options.player,
                createdAtIndex: 0,
            };
    }
};
