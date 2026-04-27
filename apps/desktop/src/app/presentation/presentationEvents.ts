import { GAME_PHASES } from '@gemduel/shared/constants';
import type { GameState, PlayerKey } from '@gemduel/shared/types';
import {
    deriveGemDropEvent,
    deriveGemEvents,
    isPresentationGemColor,
} from './presentationGemEvents';
import { deriveCardEvents } from './presentationCardEvents';
import type {
    AbilityCalloutPresentationEvent,
    MarketRefillPresentationEvent,
    PresentationEvent,
    PresentationHistorySource,
    RoyalUnlockMilestone,
    TurnHandoffPresentationEvent,
} from './presentationTypes';

const MARKET_LEVELS = [1, 2, 3] as const;

const getMilestoneFlip = (
    previousState: GameState,
    nextState: GameState,
    player: PlayerKey
): 3 | 6 | null => {
    const previousMilestones = previousState.royalMilestones[player];
    const nextMilestones = nextState.royalMilestones[player];

    if (!previousMilestones?.[6] && nextMilestones?.[6]) {
        return 6;
    }

    if (!previousMilestones?.[3] && nextMilestones?.[3]) {
        return 3;
    }

    return null;
};

const getRoyalUnlockMilestone = (
    previousState: GameState,
    nextState: GameState,
    player: PlayerKey
): RoyalUnlockMilestone => {
    const milestoneFlip = getMilestoneFlip(previousState, nextState, player);
    if (milestoneFlip) {
        return milestoneFlip;
    }

    if (nextState.toastMessage?.toLowerCase().includes('royal envoy')) {
        return 'royal-envoy';
    }

    return 'forced';
};

const getAbilityCalloutForPhase = (
    phase: GameState['phase']
): AbilityCalloutPresentationEvent['callout'] | null => {
    if (phase === GAME_PHASES.BONUS_ACTION) {
        return 'bonus-gem';
    }

    if (phase === GAME_PHASES.STEAL_ACTION) {
        return 'steal';
    }

    if (phase === GAME_PHASES.PRIVILEGE_ACTION) {
        return 'privilege';
    }

    return null;
};

const getFeedbackCallout = (
    feedbackType: string
): AbilityCalloutPresentationEvent['callout'] | null => {
    const normalized = feedbackType.toLowerCase();

    if (normalized === 'privilege') {
        return 'privilege-gain';
    }

    if (normalized === 'crown' || normalized === 'crowns') {
        return 'crown';
    }

    if (normalized === 'extortion') {
        return 'extortion';
    }

    if (!isPresentationGemColor(normalized) && normalized !== 'gold' && normalized !== 'pearl') {
        return 'buff';
    }

    return null;
};

const deriveRoyalUnlockEvent = (
    previousState: GameState,
    nextState: GameState,
    currentIndex: number
): PresentationEvent | null => {
    if (
        previousState.phase === GAME_PHASES.SELECT_ROYAL ||
        nextState.phase !== GAME_PHASES.SELECT_ROYAL ||
        nextState.royalDeck.length === 0
    ) {
        return null;
    }

    const player = nextState.turn;
    const milestone = getRoyalUnlockMilestone(previousState, nextState, player);

    return {
        id: `royal-unlock:${currentIndex}:${player}:${milestone}`,
        type: 'royal-unlock',
        player,
        milestone,
        createdAtIndex: currentIndex,
    };
};

const deriveMarketRefillEvent = (
    previousState: GameState,
    nextState: GameState,
    currentIndex: number
): MarketRefillPresentationEvent | null => {
    const slots: MarketRefillPresentationEvent['slots'] = [];

    for (const level of MARKET_LEVELS) {
        const previousLevelCards = previousState.market[level];
        const nextLevelCards = nextState.market[level];
        const slotCount = Math.max(previousLevelCards.length, nextLevelCards.length);

        for (let index = 0; index < slotCount; index += 1) {
            const previousCardId = previousLevelCards[index]?.id ?? null;
            const nextCardId = nextLevelCards[index]?.id ?? null;
            const nextCard = nextLevelCards[index] ?? null;

            if (previousCardId !== nextCardId && nextCardId) {
                slots.push({ level, index, previousCardId, nextCardId, nextCard });
            }
        }
    }

    if (slots.length === 0) {
        return null;
    }

    const slotIdPart = slots
        .map(
            (slot) =>
                `${slot.level}.${slot.index}:${slot.previousCardId ?? 'empty'}>${slot.nextCardId}`
        )
        .join('|');

    return {
        id: `market-refill:${currentIndex}:${slotIdPart}`,
        type: 'market-refill',
        slots,
        createdAtIndex: currentIndex,
    };
};

const deriveAbilityEvents = (
    previousState: GameState,
    nextState: GameState,
    currentIndex: number
): PresentationEvent[] => {
    const events: PresentationEvent[] = [];
    const phaseCallout = getAbilityCalloutForPhase(nextState.phase);

    if (phaseCallout && previousState.phase !== nextState.phase) {
        events.push({
            id: `ability-callout:${currentIndex}:${nextState.turn}:${phaseCallout}`,
            type: 'ability-callout',
            player: nextState.turn,
            callout: phaseCallout,
            createdAtIndex: currentIndex,
        });
    }

    if (!previousState.pendingExtraTurn && nextState.pendingExtraTurn) {
        events.push({
            id: `ability-callout:${currentIndex}:${nextState.turn}:extra-turn`,
            type: 'ability-callout',
            player: nextState.turn,
            callout: 'extra-turn',
            createdAtIndex: currentIndex,
        });
    }

    if (!previousState.abilityResolution && nextState.abilityResolution) {
        events.push({
            id: `ability-callout:${currentIndex}:${nextState.turn}:ability-resolution`,
            type: 'ability-callout',
            player: nextState.turn,
            callout: 'ability-resolution',
            createdAtIndex: currentIndex,
        });
    }

    if (nextState.lastFeedback && nextState.lastFeedback.uid !== previousState.lastFeedback?.uid) {
        nextState.lastFeedback.items.forEach((item, index) => {
            const callout = getFeedbackCallout(item.type);
            if (!callout) {
                return;
            }

            events.push({
                id: `ability-callout:${currentIndex}:${nextState.lastFeedback?.uid}:${index}:${item.player}:${item.type}:${item.diff}`,
                type: 'ability-callout',
                player: item.player,
                callout,
                feedbackType: item.type,
                message:
                    callout === 'crown' || callout === 'privilege-gain'
                        ? `${item.diff > 0 ? '+' : ''}${item.diff}`
                        : undefined,
                createdAtIndex: currentIndex,
            });
        });
    }

    if (
        nextState.toastMessage &&
        nextState.toastMessage !== previousState.toastMessage &&
        !nextState.toastMessage.toLowerCase().includes('royal envoy')
    ) {
        events.push({
            id: `ability-callout:${currentIndex}:${nextState.turn}:toast:${nextState.toastMessage}`,
            type: 'ability-callout',
            player: nextState.turn,
            callout: 'toast',
            message: nextState.toastMessage,
            createdAtIndex: currentIndex,
        });
    }

    return events;
};

const deriveTurnHandoffEvent = (
    previousState: GameState,
    nextState: GameState,
    currentIndex: number
): TurnHandoffPresentationEvent | null => {
    if (previousState.turn === nextState.turn || nextState.winner) {
        return null;
    }

    return {
        id: `turn-handoff:${currentIndex}:${previousState.turn}:${nextState.turn}`,
        type: 'turn-handoff',
        fromPlayer: previousState.turn,
        toPlayer: nextState.turn,
        createdAtIndex: currentIndex,
    };
};

export const derivePresentationEvents = (
    previousState: GameState | null,
    nextState: GameState,
    currentIndex: number,
    historySource: PresentationHistorySource,
    isReviewing: boolean
): PresentationEvent[] => {
    if (!previousState || isReviewing || historySource !== 'live') {
        return [];
    }

    const events: PresentationEvent[] = [];
    const royalUnlockEvent = deriveRoyalUnlockEvent(previousState, nextState, currentIndex);
    const marketRefillEvent = deriveMarketRefillEvent(previousState, nextState, currentIndex);
    const gemDropEvent = deriveGemDropEvent(previousState, nextState, currentIndex);
    const turnHandoffEvent = deriveTurnHandoffEvent(previousState, nextState, currentIndex);

    if (royalUnlockEvent) {
        events.push(royalUnlockEvent);
    }
    events.push(...deriveCardEvents(previousState, nextState, currentIndex));
    events.push(...deriveGemEvents(previousState, nextState, currentIndex));
    if (gemDropEvent) {
        events.push(gemDropEvent);
    }
    if (marketRefillEvent) {
        events.push(marketRefillEvent);
    }
    events.push(...deriveAbilityEvents(previousState, nextState, currentIndex));
    if (turnHandoffEvent) {
        events.push(turnHandoffEvent);
    }

    return events;
};
