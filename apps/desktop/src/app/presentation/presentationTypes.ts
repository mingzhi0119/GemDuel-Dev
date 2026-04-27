import type { BounsColor, Card, GemColor, PlayerKey } from '@gemduel/shared/types';

export type RoyalUnlockMilestone = 3 | 6 | 'royal-envoy' | 'forced';

export type PresentationEventType =
    | 'royal-unlock'
    | 'card-acquire'
    | 'card-reserve'
    | 'market-refill'
    | 'gem-flight'
    | 'gem-drop'
    | 'gem-steal'
    | 'gem-discard'
    | 'ability-callout'
    | 'turn-handoff';

interface PresentationEventBase {
    id: string;
    type: PresentationEventType;
    createdAtIndex: number;
}

export interface RoyalUnlockPresentationEvent extends PresentationEventBase {
    type: 'royal-unlock';
    player: PlayerKey;
    milestone: RoyalUnlockMilestone;
}

export interface CardAcquirePresentationEvent extends PresentationEventBase {
    type: 'card-acquire';
    player: PlayerKey;
    cardIds: string[];
    cards: CardFlightPresentationItem[];
}

export interface CardReservePresentationEvent extends PresentationEventBase {
    type: 'card-reserve';
    player: PlayerKey;
    cardIds: string[];
    cards: CardFlightPresentationItem[];
}

export type CardFlightSource =
    | { kind: 'market'; level: 1 | 2 | 3; index: number }
    | { kind: 'reserved'; index: number }
    | { kind: 'deck'; level: 1 | 2 | 3 }
    | { kind: 'unknown' };

export interface CardFlightPresentationItem {
    cardId: string;
    card: Card;
    bonusColor?: BounsColor;
    source: CardFlightSource;
    targetIndex?: number;
}

export interface MarketRefillPresentationEvent extends PresentationEventBase {
    type: 'market-refill';
    slots: Array<{
        level: 1 | 2 | 3;
        index: number;
        previousCardId: string | null;
        nextCardId: string | null;
        nextCard?: Card | null;
    }>;
}

export interface PendingMarketRefillSlot {
    level: 1 | 2 | 3;
    index: number;
    nextCardId: string | null;
}

export interface BoardGemPresentationSource {
    row: number;
    col: number;
    color: GemColor;
}

export interface GemFlightPresentationEvent extends PresentationEventBase {
    type: 'gem-flight';
    player: PlayerKey;
    deltas: Partial<Record<GemColor, number>>;
    sources?: BoardGemPresentationSource[];
}

export interface GemDropPresentationEvent extends PresentationEventBase {
    type: 'gem-drop';
    cells: Array<{
        row: number;
        col: number;
        color: GemColor;
    }>;
}

export interface GemStealPresentationEvent extends PresentationEventBase {
    type: 'gem-steal';
    fromPlayer: PlayerKey;
    toPlayer: PlayerKey;
    deltas: Partial<Record<GemColor, number>>;
}

export interface GemDiscardPresentationEvent extends PresentationEventBase {
    type: 'gem-discard';
    player: PlayerKey;
    deltas: Partial<Record<GemColor, number>>;
}

export interface AbilityCalloutPresentationEvent extends PresentationEventBase {
    type: 'ability-callout';
    player: PlayerKey;
    callout:
        | 'bonus-gem'
        | 'steal'
        | 'privilege'
        | 'extra-turn'
        | 'ability-resolution'
        | 'privilege-gain'
        | 'crown'
        | 'extortion'
        | 'toast'
        | 'buff';
    message?: string;
    feedbackType?: string;
}

export interface TurnHandoffPresentationEvent extends PresentationEventBase {
    type: 'turn-handoff';
    fromPlayer: PlayerKey;
    toPlayer: PlayerKey;
}

export type PresentationEvent =
    | RoyalUnlockPresentationEvent
    | CardAcquirePresentationEvent
    | CardReservePresentationEvent
    | MarketRefillPresentationEvent
    | GemFlightPresentationEvent
    | GemDropPresentationEvent
    | GemStealPresentationEvent
    | GemDiscardPresentationEvent
    | AbilityCalloutPresentationEvent
    | TurnHandoffPresentationEvent;

export type PresentationHistorySource = 'live' | 'replay-import';
