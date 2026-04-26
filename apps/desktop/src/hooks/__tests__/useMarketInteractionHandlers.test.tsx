// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Card, GameAction, GameState } from '@gemduel/shared/types';
import { useMarketInteractionHandlers } from '../useMarketInteractionHandlers';

const mocks = vi.hoisted(() => ({
    getRandomBasicGemColor: vi.fn(),
    canActionRunInPhase: vi.fn(),
    isBonusColorSelectionPhase: vi.fn(),
    buildBuyAction: vi.fn(),
    buildReserveCardFlow: vi.fn(),
    buildReserveDeckFlow: vi.fn(),
    buildSelectBonusColorAction: vi.fn(),
}));

vi.mock('@gemduel/shared/logic/gameSetup', () => ({
    getRandomBasicGemColor: (...args: unknown[]) => mocks.getRandomBasicGemColor(...args),
}));

vi.mock('@gemduel/shared/logic/fsm', () => ({
    canActionRunInPhase: (...args: unknown[]) => mocks.canActionRunInPhase(...args),
    isBonusColorSelectionPhase: (...args: unknown[]) => mocks.isBonusColorSelectionPhase(...args),
}));

vi.mock('@gemduel/shared/logic/interactionCommands', () => ({
    buildBuyAction: (...args: unknown[]) => mocks.buildBuyAction(...args),
    buildReserveCardFlow: (...args: unknown[]) => mocks.buildReserveCardFlow(...args),
    buildReserveDeckFlow: (...args: unknown[]) => mocks.buildReserveDeckFlow(...args),
    buildSelectBonusColorAction: (...args: unknown[]) => mocks.buildSelectBonusColorAction(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useMarketInteractionHandlers', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useMarketInteractionHandlers> | null = null;
    const networkDispatch = vi.fn<(action: GameAction) => void>();
    const setErrorMsg = vi.fn<(value: string | null) => void>();
    const canAfford = vi.fn<(card: Card, isReserved?: boolean) => boolean>();
    const clearPreselectedReserveGold = vi.fn<() => void>();

    const renderHarness = (gameState: GameState, canLocalInteract = true) => {
        const Harness = () => {
            currentResult = useMarketInteractionHandlers({
                gameState,
                canLocalInteract,
                networkDispatch,
                setErrorMsg,
                canAfford,
                preselectedReserveGold: null,
                clearPreselectedReserveGold,
            });
            return null;
        };

        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);
        }

        act(() => {
            root?.render(React.createElement(Harness));
        });
    };

    beforeEach(() => {
        currentResult = null;
        networkDispatch.mockReset();
        setErrorMsg.mockReset();
        canAfford.mockReset();
        clearPreselectedReserveGold.mockReset();
        mocks.getRandomBasicGemColor.mockReset();
        mocks.canActionRunInPhase.mockReset();
        mocks.isBonusColorSelectionPhase.mockReset();
        mocks.buildBuyAction.mockReset();
        mocks.buildReserveCardFlow.mockReset();
        mocks.buildReserveDeckFlow.mockReset();
        mocks.buildSelectBonusColorAction.mockReset();
        mocks.getRandomBasicGemColor.mockReturnValue('red');
        mocks.canActionRunInPhase.mockReturnValue(true);
        mocks.isBonusColorSelectionPhase.mockReturnValue(true);
        canAfford.mockReturnValue(true);
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('runs reserve, buy, bonus, cancel, and discard flows when allowed', () => {
        const card = { id: 'card-1', bonusColor: 'blue' } as Card;
        const reservedCard = { id: 'reserved-1', bonusColor: 'blue' } as Card;
        const gameState = {
            turn: 'p1',
            phase: 'MAIN_PHASE',
            board: [[{ type: { id: 'gold' } }]],
            playerReserved: { p1: [], p2: [] },
            decks: { 1: [], 2: [{ id: 'deck-2' }], 3: [] },
            pendingBuy: {
                card,
                source: 'market',
                marketInfo: { level: 2, idx: 1 },
            },
        } as unknown as GameState;

        mocks.buildReserveCardFlow.mockReturnValue({
            action: { type: 'INITIATE_RESERVE', payload: { card, level: 1, idx: 0 } },
            prompt: 'Select a Gold gem.',
        });
        mocks.buildReserveDeckFlow.mockReturnValue({
            action: { type: 'INITIATE_RESERVE_DECK', payload: { level: 2 } },
            prompt: 'Select a Gold gem.',
        });
        mocks.buildBuyAction.mockReturnValue({ type: 'BUY_CARD', payload: {} } as GameAction);
        mocks.buildSelectBonusColorAction.mockReturnValue({
            type: 'BUY_CARD',
            payload: {},
        } as GameAction);

        renderHarness(gameState);

        currentResult?.handleReserveCard(card, { level: 1, idx: 0 });
        currentResult?.handleReserveDeck(2);
        currentResult?.initiateBuy(card);
        currentResult?.handleSelectBonusColor('red');
        currentResult?.handleCancelReserve();
        currentResult?.handleCancelPrivilege();
        currentResult?.checkAndInitiateBuyReserved(reservedCard, true);
        currentResult?.handleDiscardReserved('reserved-1');

        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'INITIATE_RESERVE',
            payload: { card, level: 1, idx: 0 },
        });
        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'INITIATE_RESERVE_DECK',
            payload: { level: 2 },
        });
        expect(networkDispatch).toHaveBeenCalledWith({ type: 'BUY_CARD', payload: {} });
        expect(networkDispatch).toHaveBeenCalledWith({ type: 'CANCEL_RESERVE' });
        expect(networkDispatch).toHaveBeenCalledWith({ type: 'CANCEL_PRIVILEGE' });
        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'DISCARD_RESERVED',
            payload: { cardId: 'reserved-1' },
        });
        expect(mocks.buildSelectBonusColorAction).toHaveBeenCalledWith(
            gameState.pendingBuy,
            'red',
            'red'
        );
        expect(canAfford).toHaveBeenCalledWith(reservedCard, true);
    });

    it('preserves revealed-deck reserve context for extra visible cards', () => {
        const card = { id: 'visible-extra', bonusColor: 'blue' } as Card;
        const gameState = {
            turn: 'p1',
            phase: 'MAIN_PHASE',
            board: [[{ type: { id: 'empty' } }]],
            playerReserved: { p1: [], p2: [] },
            decks: { 1: [], 2: [], 3: [] },
            pendingBuy: null,
        } as unknown as GameState;

        mocks.buildReserveCardFlow.mockReturnValue({
            action: {
                type: 'RESERVE_CARD',
                payload: { card, level: 1, idx: 0, isExtra: true, extraIdx: 0 },
            },
        });

        renderHarness(gameState);

        currentResult?.handleReserveCard(card, { level: 1, idx: 0, isExtra: true, extraIdx: 0 });

        expect(mocks.buildReserveCardFlow).toHaveBeenCalledWith(
            card,
            { level: 1, idx: 0, isExtra: true, extraIdx: 0 },
            false
        );
        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'RESERVE_CARD',
            payload: { card, level: 1, idx: 0, isExtra: true, extraIdx: 0 },
        });
    });

    it('uses a preselected gold gem to complete card and deck reserve immediately', () => {
        const card = { id: 'reserve-with-gold', bonusColor: 'blue' } as Card;
        const gameState = {
            turn: 'p1',
            phase: 'IDLE',
            board: [[{ type: { id: 'gold' } }]],
            playerReserved: { p1: [], p2: [] },
            decks: { 1: [{ id: 'deck-1' }], 2: [], 3: [] },
            pendingBuy: null,
        } as unknown as GameState;

        const Harness = () => {
            currentResult = useMarketInteractionHandlers({
                gameState,
                canLocalInteract: true,
                networkDispatch,
                setErrorMsg,
                canAfford,
                preselectedReserveGold: { r: 2, c: 3 },
                clearPreselectedReserveGold,
            });
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);

        act(() => {
            root?.render(<Harness />);
        });

        currentResult?.handleReserveCard(card, { level: 1, idx: 0 });
        currentResult?.handleReserveDeck(1);
        currentResult?.initiateBuy(card, 'market', { level: 1, idx: 0 });

        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'RESERVE_CARD',
            payload: { card, level: 1, idx: 0, goldCoords: { r: 2, c: 3 } },
        });
        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'RESERVE_DECK',
            payload: { level: 1, goldCoords: { r: 2, c: 3 } },
        });
        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'RESERVE_CARD',
            payload: { card, level: 1, idx: 0, goldCoords: { r: 2, c: 3 } },
        });
        expect(networkDispatch).toHaveBeenCalledTimes(3);
        expect(mocks.buildReserveCardFlow).not.toHaveBeenCalled();
        expect(mocks.buildReserveDeckFlow).not.toHaveBeenCalled();
        expect(clearPreselectedReserveGold).toHaveBeenCalledTimes(3);
        expect(setErrorMsg).toHaveBeenCalledWith(null);
    });

    it('surfaces guarded and unaffordable branches without dispatching illegal actions', () => {
        const card = { id: 'card-2', bonusColor: 'blue' } as Card;
        const gameState = {
            turn: 'p1',
            phase: 'IDLE',
            board: [[{ type: { id: 'empty' } }]],
            playerReserved: { p1: [], p2: [] },
            decks: { 1: [], 2: [], 3: [] },
            pendingBuy: null,
        } as unknown as GameState;

        canAfford.mockReturnValue(false);
        mocks.isBonusColorSelectionPhase.mockReturnValue(false);

        renderHarness(gameState, true);

        currentResult?.handleReserveDeck(1);
        currentResult?.initiateBuy(card);
        currentResult?.handleSelectBonusColor('blue');
        currentResult?.checkAndInitiateBuyReserved(card, true);

        expect(setErrorMsg).toHaveBeenCalledWith('Deck empty!');
        expect(setErrorMsg).toHaveBeenCalledWith('Cannot afford!');
        expect(networkDispatch).not.toHaveBeenCalled();
        expect(canAfford).toHaveBeenCalledWith(card, false);
        expect(canAfford).toHaveBeenCalledWith(card, true);
    });
});
