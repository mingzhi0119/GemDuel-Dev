import type {
    Card as CardType,
    CardInteractionContext,
    GameState,
    PlayerKey,
} from '@gemduel/shared/types';

export interface RevealCardPreviewEntry {
    card: CardType;
    context: CardInteractionContext;
}

export type CardPreviewState =
    | {
          kind: 'market-card';
          mode: 'single';
          card: CardType;
          context: CardInteractionContext;
          title?: string;
      }
    | {
          kind: 'deck-reserve';
          mode: 'single';
          level: 1 | 2 | 3;
          title?: string;
      }
    | {
          kind: 'reveal-cards';
          mode: 'collection';
          entries: RevealCardPreviewEntry[];
          player: PlayerKey;
          title?: string;
      }
    | {
          kind: 'royal-card';
          mode: 'single';
          cards: CardType[];
          title?: string;
      }
    | {
          kind: 'collection';
          mode: 'collection';
          cards: CardType[];
          player: PlayerKey;
          color: string;
          title?: string;
      };

export const getPreviewSourceCard = (state: GameState, context: CardInteractionContext) => {
    if (context.isExtra && context.extraIdx !== undefined) {
        const deck = state.decks[context.level];
        return deck[deck.length - (context.extraIdx + 1)] ?? null;
    }

    return state.market[context.level]?.[context.idx] ?? null;
};

export const getRevealPreviewEntries = (
    state: GameState,
    player: PlayerKey
): RevealCardPreviewEntry[] => {
    const buff = state.playerBuffs?.[player];
    const entries: RevealCardPreviewEntry[] = [];

    if (buff?.effects?.passive?.revealDeck1) {
        const deck = state.decks[1];
        const card = deck[deck.length - 1] ?? null;
        if (card) {
            entries.push({
                card,
                context: { level: 1, idx: 0, isExtra: true, extraIdx: 0 },
            });
        }
    }

    if (buff?.effects?.passive?.extraL3) {
        const deck = state.decks[3];
        ([1, 2] as const).forEach((extraIdx) => {
            const card = deck[deck.length - (extraIdx + 1)] ?? null;
            if (card) {
                entries.push({
                    card,
                    context: { level: 3, idx: extraIdx - 1, isExtra: true, extraIdx },
                });
            }
        });
    }

    return entries;
};
