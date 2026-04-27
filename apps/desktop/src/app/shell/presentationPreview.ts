import type { Card, GameState, GemColor } from '@gemduel/shared/types';
import type { PresentationEvent } from '../presentation/presentationTypes';

export type PresentationPreviewStage = 'intro' | 'selection' | null;
export type PresentationPreviewMode = PresentationEvent['type'] | null;

const PRESENTATION_PREVIEW_MODES = new Set<PresentationEvent['type']>([
    'royal-unlock',
    'card-acquire',
    'card-reserve',
    'market-refill',
    'gem-flight',
    'gem-drop',
    'gem-steal',
    'gem-discard',
    'ability-callout',
    'turn-handoff',
]);

export const getPresentationPreviewMode = (): PresentationPreviewMode => {
    if (typeof window === 'undefined') {
        return null;
    }

    const rawMode = new URLSearchParams(window.location.search).get('presentationPreview');
    return PRESENTATION_PREVIEW_MODES.has(rawMode as PresentationEvent['type'])
        ? (rawMode as PresentationEvent['type'])
        : null;
};

export const getShouldHoldPresentationPreviewIntro = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return (
        new URLSearchParams(window.location.search).get('presentationPreviewHoldIntro') === 'true'
    );
};

const findPreviewMarketCard = (
    state: GameState
): { card: Card; level: 1 | 2 | 3; index: number } | null => {
    for (const level of [1, 2, 3] as const) {
        const index = state.market[level].findIndex((card) => Boolean(card));
        const card = index >= 0 ? state.market[level][index] : null;
        if (card) {
            return { card, level, index };
        }
    }

    return null;
};

const findPreviewBoardGem = (
    state: GameState,
    preferredColor: GemColor
): { row: number; col: number; color: GemColor } | null => {
    for (let row = 0; row < state.board.length; row += 1) {
        for (let col = 0; col < state.board[row].length; col += 1) {
            const color = state.board[row][col].type.id;
            if (color === preferredColor) {
                return { row, col, color };
            }
        }
    }

    return null;
};

export const createPreviewPresentationEvent = (
    mode: Exclude<PresentationPreviewMode, null | 'royal-unlock'>,
    state: GameState,
    currentIndex: number
): PresentationEvent | null => {
    const player = state.turn;
    const marketCard = findPreviewMarketCard(state);
    const previewIndex = currentIndex;

    switch (mode) {
        case 'card-acquire':
            if (!marketCard) return null;
            return {
                id: `card-acquire:preview:${marketCard.card.id}`,
                type: 'card-acquire',
                player,
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
                createdAtIndex: previewIndex,
            };
        case 'card-reserve':
            if (!marketCard) return null;
            return {
                id: `card-reserve:preview:${marketCard.card.id}`,
                type: 'card-reserve',
                player,
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
                        targetIndex: state.playerReserved[player].length,
                    },
                ],
                createdAtIndex: previewIndex,
            };
        case 'market-refill':
            if (!marketCard) return null;
            return {
                id: `market-refill:preview:${marketCard.level}-${marketCard.index}`,
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
                createdAtIndex: previewIndex,
            };
        case 'gem-flight': {
            const source = findPreviewBoardGem(state, 'blue') ?? undefined;
            return {
                id: 'gem-flight:preview',
                type: 'gem-flight',
                player,
                deltas: { blue: 1 },
                sources: source ? [source] : [],
                createdAtIndex: previewIndex,
            };
        }
        case 'gem-drop': {
            const source =
                findPreviewBoardGem(state, 'green') ?? findPreviewBoardGem(state, 'blue');
            return {
                id: 'gem-drop:preview',
                type: 'gem-drop',
                cells: source ? [source] : [{ row: 2, col: 2, color: 'blue' }],
                createdAtIndex: previewIndex,
            };
        }
        case 'gem-steal':
            return {
                id: 'gem-steal:preview',
                type: 'gem-steal',
                fromPlayer: player === 'p1' ? 'p2' : 'p1',
                toPlayer: player,
                deltas: { blue: 1 },
                createdAtIndex: previewIndex,
            };
        case 'gem-discard':
            return {
                id: 'gem-discard:preview',
                type: 'gem-discard',
                player,
                deltas: { blue: 1 },
                createdAtIndex: previewIndex,
            };
        case 'ability-callout':
            return {
                id: 'ability-callout:preview',
                type: 'ability-callout',
                player,
                callout: 'ability-resolution',
                message: 'Preview',
                createdAtIndex: previewIndex,
            };
        case 'turn-handoff':
            return {
                id: 'turn-handoff:preview',
                type: 'turn-handoff',
                fromPlayer: player === 'p1' ? 'p2' : 'p1',
                toPlayer: player,
                createdAtIndex: previewIndex,
            };
        default:
            return null;
    }
};
