// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GAME_PHASES } from '@gemduel/shared/constants';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import type { Card, GameState } from '@gemduel/shared/types';
import { usePresentationEvents, type PresentationController } from '../usePresentationEvents';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

const createRoyalState = (): GameState => {
    const state = cloneState();
    state.phase = GAME_PHASES.SELECT_ROYAL;
    state.turn = 'p1';
    state.royalMilestones.p1[3] = true;
    return state;
};

const RESERVED_FROM_DECK_CARD: Card = {
    id: 'reserve-pending-card',
    level: 1,
    cost: {
        blue: 0,
        white: 0,
        green: 0,
        black: 0,
        red: 0,
        pearl: 0,
        gold: 0,
    },
    points: 0,
    ability: 'none',
    bonusColor: 'green',
    crowns: 0,
    bonusCount: 1,
};

const ACQUIRED_MARKET_CARD: Card = {
    ...RESERVED_FROM_DECK_CARD,
    id: 'acquired-market-card',
    bonusColor: 'red',
};

const REFILLED_MARKET_CARD: Card = {
    ...RESERVED_FROM_DECK_CARD,
    id: 'refilled-market-card',
    bonusColor: 'blue',
};

describe('usePresentationEvents', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: PresentationController | null = null;

    const Harness = ({ state, currentIndex }: { state: GameState; currentIndex: number }) => {
        currentResult = usePresentationEvents({
            state,
            currentIndex,
            historySource: 'live',
            isReviewing: false,
        });
        return null;
    };

    const renderHarness = async (state: GameState, currentIndex: number) => {
        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);
        }

        await act(async () => {
            root?.render(<Harness state={state} currentIndex={currentIndex} />);
            await Promise.resolve();
        });
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        currentResult = null;
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('blocks royal selection while intro and overlay event stages are active', async () => {
        const idleState = cloneState();
        const royalState = createRoyalState();

        await renderHarness(idleState, 0);
        expect(currentResult?.isBlockingRoyalSelection).toBe(false);

        await renderHarness(royalState, 1);
        expect(currentResult?.activeEvent?.type).toBe('royal-unlock');
        expect(currentResult?.activeStage).toBe('intro');
        expect(currentResult?.isBlockingRoyalSelection).toBe(true);

        act(() => {
            currentResult?.completeIntro();
        });

        expect(currentResult?.activeStage).toBe('selection');
        expect(currentResult?.isBlockingRoyalSelection).toBe(true);
    });

    it('cancels the active royal event when phase leaves SELECT_ROYAL', async () => {
        const idleState = cloneState();
        const royalState = createRoyalState();
        const nextIdleState = cloneState();

        await renderHarness(idleState, 0);
        await renderHarness(royalState, 1);
        expect(currentResult?.activeEvent).not.toBeNull();

        await renderHarness(nextIdleState, 2);

        expect(currentResult?.activeEvent).toBeNull();
        expect(currentResult?.activeStage).toBeNull();
        expect(currentResult?.isBlockingRoyalSelection).toBe(false);
    });

    it('dedupes the same royal event id for a repeated currentIndex', async () => {
        const idleState = cloneState();
        const royalState = createRoyalState();

        await renderHarness(idleState, 0);
        await renderHarness(royalState, 1);
        const eventId = currentResult?.activeEvent?.id;
        expect(eventId).toBe('royal-unlock:1:p1:3');

        act(() => {
            currentResult?.completeEvent(eventId ?? '');
        });
        await renderHarness(idleState, 1);
        await renderHarness(royalState, 1);

        expect(currentResult?.activeEvent).toBeNull();
        expect(currentResult?.isBlockingRoyalSelection).toBe(false);
    });

    it('exposes pending reserved card ids while reserve animation is active', async () => {
        const idleState = cloneState();
        const reservedState = cloneState();
        reservedState.playerReserved.p1 = [RESERVED_FROM_DECK_CARD];

        await renderHarness(idleState, 0);
        await renderHarness(reservedState, 1);

        expect(currentResult?.activeEvent?.type).toBe('card-reserve');
        expect(currentResult?.pendingReservedCardIds).toEqual([RESERVED_FROM_DECK_CARD.id]);

        const activeEventId = currentResult?.activeEvent?.id ?? '';
        act(() => {
            currentResult?.completeEvent(activeEventId);
        });

        expect(currentResult?.pendingReservedCardIds).toEqual([]);
    });

    it('starts market-refill in parallel and exposes the pending slot immediately', async () => {
        const previousState = cloneState();
        previousState.market[1] = [ACQUIRED_MARKET_CARD];

        const nextState = cloneState();
        nextState.market[1] = [REFILLED_MARKET_CARD];
        nextState.playerTableau.p1 = [ACQUIRED_MARKET_CARD];

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(currentResult?.activeEvent?.type).toBe('card-acquire');
        expect(currentResult?.activeMarketRefillEvent?.type).toBe('market-refill');
        expect(currentResult?.pendingMarketRefillSlots).toEqual([
            { level: 1, index: 0, nextCardId: REFILLED_MARKET_CARD.id },
        ]);
    });

    it('starts turn-handoff in a parallel lane without blocking other presentation events', async () => {
        const previousState = cloneState();
        previousState.turn = 'p1';
        previousState.market[1] = [ACQUIRED_MARKET_CARD];

        const nextState = cloneState();
        nextState.turn = 'p2';
        nextState.market[1] = [REFILLED_MARKET_CARD];
        nextState.playerTableau.p1 = [ACQUIRED_MARKET_CARD];

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(currentResult?.activeEvent?.type).toBe('card-acquire');
        expect(currentResult?.activeMarketRefillEvent?.type).toBe('market-refill');
        expect(currentResult?.activeTurnHandoffEvent).toMatchObject({
            type: 'turn-handoff',
            fromPlayer: 'p1',
            toPlayer: 'p2',
        });
    });

    it('keeps turn-handoff visible for three seconds and replaces it immediately on a new handoff', async () => {
        vi.useFakeTimers();
        const p1State = cloneState();
        p1State.turn = 'p1';
        const p2State = cloneState();
        p2State.turn = 'p2';
        const nextP1State = cloneState();
        nextP1State.turn = 'p1';

        await renderHarness(p1State, 0);
        await renderHarness(p2State, 1);

        expect(currentResult?.activeTurnHandoffEvent).toMatchObject({
            fromPlayer: 'p1',
            toPlayer: 'p2',
        });

        act(() => {
            vi.advanceTimersByTime(1500);
        });
        await renderHarness(nextP1State, 2);

        expect(currentResult?.activeTurnHandoffEvent).toMatchObject({
            fromPlayer: 'p2',
            toPlayer: 'p1',
        });

        act(() => {
            vi.advanceTimersByTime(2999);
        });
        expect(currentResult?.activeTurnHandoffEvent?.toPlayer).toBe('p1');

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(currentResult?.activeTurnHandoffEvent).toBeNull();
    });

    it('keeps extra-turn callouts on screen for the handoff visual duration', async () => {
        vi.useFakeTimers();
        const previousState = cloneState();
        previousState.pendingExtraTurn = false;
        const nextState = cloneState();
        nextState.pendingExtraTurn = true;

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(currentResult?.activeEvent).toMatchObject({
            type: 'ability-callout',
            callout: 'extra-turn',
        });

        act(() => {
            vi.advanceTimersByTime(2999);
        });
        expect(currentResult?.activeEvent).toMatchObject({
            type: 'ability-callout',
            callout: 'extra-turn',
        });

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(currentResult?.activeEvent).toBeNull();
    });

    it('keeps market-refill pending for the one-second visual duration', async () => {
        vi.useFakeTimers();
        const previousState = cloneState();
        previousState.market[1] = [ACQUIRED_MARKET_CARD];

        const nextState = cloneState();
        nextState.market[1] = [REFILLED_MARKET_CARD];
        nextState.playerTableau.p1 = [ACQUIRED_MARKET_CARD];

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(currentResult?.activeMarketRefillEvent?.type).toBe('market-refill');

        act(() => {
            vi.advanceTimersByTime(999);
        });
        expect(currentResult?.activeMarketRefillEvent?.type).toBe('market-refill');

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(currentResult?.activeMarketRefillEvent).toBeNull();
    });

    it('keeps reduced-motion market-refill pending only for the short duration', async () => {
        vi.useFakeTimers();
        vi.stubGlobal(
            'matchMedia',
            vi.fn((query: string) => ({
                matches: query === '(prefers-reduced-motion: reduce)',
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            }))
        );
        const previousState = cloneState();
        previousState.market[1] = [ACQUIRED_MARKET_CARD];

        const nextState = cloneState();
        nextState.market[1] = [REFILLED_MARKET_CARD];
        nextState.playerTableau.p1 = [ACQUIRED_MARKET_CARD];

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(currentResult?.activeMarketRefillEvent?.type).toBe('market-refill');

        act(() => {
            vi.advanceTimersByTime(239);
        });
        expect(currentResult?.activeMarketRefillEvent?.type).toBe('market-refill');

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(currentResult?.activeMarketRefillEvent).toBeNull();
    });
});
