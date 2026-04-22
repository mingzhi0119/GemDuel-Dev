import { buildP2DraftPoolIndices, buildStartGameAction } from './gameSetup';
import { isDraftSelectionPhase } from './fsm';
import type {
    BasicGemColor,
    BuyCardPayload,
    Card,
    CardActionSource,
    GameAction,
    GameState,
    GameMode,
    GamePhase,
    GemColor,
    InitiateBuyJokerPayload,
    MarketCardRef,
    PlayerKey,
    RoyalCard,
} from '../types';

type MarketInfo = InitiateBuyJokerPayload['marketInfo'];
type PendingBuy = NonNullable<GameState['pendingBuy']>;

export interface ReserveFlowResult {
    action: Extract<
        GameAction,
        { type: 'INITIATE_RESERVE' | 'RESERVE_CARD' | 'INITIATE_RESERVE_DECK' | 'RESERVE_DECK' }
    >;
    prompt?: string;
}

export const buildGameStartAction = (
    mode: GameMode,
    options: { useBuffs: boolean; isHost?: boolean; hostPlayer?: PlayerKey } = {
        useBuffs: false,
    }
) => buildStartGameAction(mode, options);

export const buildReplenishAction = (
    expansionColor: BasicGemColor,
    extortionColor?: GemColor
): Extract<GameAction, { type: 'REPLENISH' }> => ({
    type: 'REPLENISH',
    payload: {
        randoms: {
            expansionColor,
            extortionColor,
        },
    },
});

export const buildReserveCardFlow = (
    card: Card,
    marketInfo: MarketCardRef,
    hasGold: boolean
): ReserveFlowResult =>
    hasGold
        ? {
              action: {
                  type: 'INITIATE_RESERVE',
                  payload: { card, ...marketInfo },
              },
              prompt: 'Select a Gold gem.',
          }
        : {
              action: {
                  type: 'RESERVE_CARD',
                  payload: { card, ...marketInfo },
              },
          };

export const buildReserveDeckFlow = (level: 1 | 2 | 3, hasGold: boolean): ReserveFlowResult =>
    hasGold
        ? {
              action: {
                  type: 'INITIATE_RESERVE_DECK',
                  payload: { level },
              },
              prompt: 'Select a Gold gem.',
          }
        : {
              action: {
                  type: 'RESERVE_DECK',
                  payload: { level },
              },
          };

export const buildBuyAction = (
    card: Card,
    source: CardActionSource,
    marketInfo: MarketInfo,
    bountyHunterColor: BasicGemColor
): Extract<GameAction, { type: 'INITIATE_BUY_JOKER' | 'BUY_CARD' }> =>
    card.bonusColor === 'gold'
        ? {
              type: 'INITIATE_BUY_JOKER',
              payload: { card, source, marketInfo },
          }
        : {
              type: 'BUY_CARD',
              payload: {
                  card,
                  source,
                  marketInfo,
                  randoms: {
                      bountyHunterColor,
                  },
              },
          };

export const buildSelectBonusColorAction = (
    pendingBuy: PendingBuy,
    color: GemColor,
    bountyHunterColor: BasicGemColor
): Extract<GameAction, { type: 'BUY_CARD' }> => ({
    type: 'BUY_CARD',
    payload: {
        card: { ...pendingBuy.card, bonusColor: color },
        source: pendingBuy.source,
        marketInfo: pendingBuy.marketInfo,
        randoms: {
            bountyHunterColor,
        },
    },
});

export const buildSelectRoyalAction = (
    royalCard: RoyalCard
): Extract<GameAction, { type: 'SELECT_ROYAL_CARD' }> => ({
    type: 'SELECT_ROYAL_CARD',
    payload: { card: royalCard },
});

export const buildSelectBuffAction = (
    buffId: string,
    randomColor: BasicGemColor,
    turn: PlayerKey,
    phase: GamePhase,
    buffLevel: number
): Extract<GameAction, { type: 'SELECT_BUFF' }> => {
    const p2DraftPoolIndices =
        turn === 'p1' && isDraftSelectionPhase(phase)
            ? buildP2DraftPoolIndices(buffLevel, buffId)
            : undefined;

    return {
        type: 'SELECT_BUFF',
        payload: {
            buffId,
            randomColor,
            ...(p2DraftPoolIndices ? { p2DraftPoolIndices } : {}),
        },
    };
};

export const buildPeekDeckAction = (
    level: 1 | 2 | 3
): Extract<GameAction, { type: 'PEEK_DECK' }> => ({
    type: 'PEEK_DECK',
    payload: { level },
});

export const buildRerollDraftPoolAction = (
    level?: 1 | 2 | 3
): Extract<GameAction, { type: 'REROLL_DRAFT_POOL' }> => ({
    type: 'REROLL_DRAFT_POOL',
    payload: { level },
});

export const buildDebugAction = (
    type: 'DEBUG_ADD_CROWNS' | 'DEBUG_ADD_POINTS' | 'DEBUG_ADD_PRIVILEGE' | 'FORCE_ROYAL_SELECTION',
    player?: PlayerKey
): Extract<
    GameAction,
    {
        type:
            | 'DEBUG_ADD_CROWNS'
            | 'DEBUG_ADD_POINTS'
            | 'DEBUG_ADD_PRIVILEGE'
            | 'FORCE_ROYAL_SELECTION';
    }
> => {
    switch (type) {
        case 'FORCE_ROYAL_SELECTION':
            return { type };
        case 'DEBUG_ADD_CROWNS':
        case 'DEBUG_ADD_POINTS':
        case 'DEBUG_ADD_PRIVILEGE':
            return { type, payload: player || 'p1' };
    }
};
