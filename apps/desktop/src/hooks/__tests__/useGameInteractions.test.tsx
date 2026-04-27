import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Card, GameAction, GameState } from '@gemduel/shared/types';
import { useGameInteractions } from '../useGameInteractions';

const mocks = vi.hoisted(() => ({
    useInteractionFeedback: vi.fn(),
    useBoardInteractionHandlers: vi.fn(),
    useMarketInteractionHandlers: vi.fn(),
    useMetaInteractionHandlers: vi.fn(),
    useDebugInteractionHandlers: vi.fn(),
    canPlayerInteract: vi.fn(),
    calculateTransaction: vi.fn(),
    getPlayerScore: vi.fn(),
    getCrownCount: vi.fn(),
}));

vi.mock('../useInteractionFeedback', () => ({
    useInteractionFeedback: (...args: unknown[]) => mocks.useInteractionFeedback(...args),
}));

vi.mock('../useBoardInteractionHandlers', () => ({
    useBoardInteractionHandlers: (...args: unknown[]) => mocks.useBoardInteractionHandlers(...args),
}));

vi.mock('../useMarketInteractionHandlers', () => ({
    useMarketInteractionHandlers: (...args: unknown[]) =>
        mocks.useMarketInteractionHandlers(...args),
}));

vi.mock('../useMetaInteractionHandlers', () => ({
    useMetaInteractionHandlers: (...args: unknown[]) => mocks.useMetaInteractionHandlers(...args),
}));

vi.mock('../useDebugInteractionHandlers', () => ({
    useDebugInteractionHandlers: (...args: unknown[]) => mocks.useDebugInteractionHandlers(...args),
}));

vi.mock('@gemduel/shared/logic/interactionAccess', () => ({
    canPlayerInteract: (...args: unknown[]) => mocks.canPlayerInteract(...args),
}));

vi.mock('@gemduel/shared/utils', () => ({
    calculateTransaction: (...args: unknown[]) => mocks.calculateTransaction(...args),
}));

vi.mock('@gemduel/shared/logic/selectors', () => ({
    getPlayerScore: (...args: unknown[]) => mocks.getPlayerScore(...args),
    getCrownCount: (...args: unknown[]) => mocks.getCrownCount(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useGameInteractions', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useGameInteractions> | null = null;
    const networkDispatch = vi.fn<(action: GameAction) => void>();

    const renderHarness = (
        gameState: GameState,
        currentIndex = 0,
        isReviewing = false,
        isInteractionLocked = false
    ) => {
        const Harness = () => {
            currentResult = useGameInteractions(
                gameState,
                networkDispatch,
                currentIndex,
                isReviewing,
                isInteractionLocked
            );
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
        mocks.useInteractionFeedback.mockReset();
        mocks.useBoardInteractionHandlers.mockReset();
        mocks.useMarketInteractionHandlers.mockReset();
        mocks.useMetaInteractionHandlers.mockReset();
        mocks.useDebugInteractionHandlers.mockReset();
        mocks.canPlayerInteract.mockReset();
        mocks.calculateTransaction.mockReset();
        mocks.getPlayerScore.mockReset();
        mocks.getCrownCount.mockReset();
        mocks.useInteractionFeedback.mockReturnValue({
            selectedGems: [{ r: 0, c: 1 }],
            setSelectedGems: vi.fn(),
            clearSelectedGems: vi.fn(),
            errorMsg: 'feedback-error',
            setErrorMsg: vi.fn(),
        });
        mocks.useBoardInteractionHandlers.mockReturnValue({ boardHandler: vi.fn() });
        mocks.useMarketInteractionHandlers.mockReturnValue({ marketHandler: vi.fn() });
        mocks.useMetaInteractionHandlers.mockReturnValue({ metaHandler: vi.fn() });
        mocks.useDebugInteractionHandlers.mockReturnValue({ debugHandler: vi.fn() });
        mocks.canPlayerInteract.mockReturnValue(true);
        mocks.calculateTransaction.mockReturnValue({ affordable: true });
        mocks.getPlayerScore.mockReturnValue(9);
        mocks.getCrownCount.mockReturnValue(4);
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('wires the sub-hooks together and exposes bound getters', () => {
        const gameState = {
            mode: 'ONLINE_MULTIPLAYER',
            turn: 'p1',
            inventories: { p1: { gold: 1 }, p2: { gold: 0 } },
            playerTableau: { p1: [], p2: [] },
            playerBuffs: { p1: null, p2: null },
        } as unknown as GameState;

        renderHarness(gameState, 7, true);

        expect(mocks.canPlayerInteract).toHaveBeenCalledWith(gameState, true);
        expect(mocks.useInteractionFeedback).toHaveBeenCalledWith(7);
        expect(mocks.useBoardInteractionHandlers).toHaveBeenCalledWith(
            expect.objectContaining({ gameState, canLocalInteract: true, networkDispatch })
        );
        expect(mocks.useMarketInteractionHandlers).toHaveBeenCalledWith(
            expect.objectContaining({ gameState, canLocalInteract: true, networkDispatch })
        );
        expect(mocks.useMetaInteractionHandlers).toHaveBeenCalledWith(
            expect.objectContaining({ gameState, canLocalInteract: true, networkDispatch })
        );
        expect(mocks.useDebugInteractionHandlers).toHaveBeenCalledWith(
            expect.objectContaining({ gameState, canLocalInteract: true, networkDispatch })
        );

        expect(currentResult?.errorMsg).toBe('feedback-error');
        expect(currentResult?.selectedGems).toEqual([{ r: 0, c: 1 }]);
        expect(currentResult?.getters.getPlayerScore('p1')).toBe(9);
        expect(currentResult?.getters.getCrownCount('p2')).toBe(4);
        expect(currentResult?.getters.canAfford({} as Card)).toBe(true);
        expect(currentResult?.getters.canAfford({} as Card, true)).toBe(true);
        expect(mocks.calculateTransaction).toHaveBeenCalledWith(
            expect.anything(),
            gameState.inventories.p1,
            gameState.playerTableau.p1,
            gameState.playerBuffs.p1,
            false
        );
        expect(mocks.calculateTransaction).toHaveBeenCalledWith(
            expect.anything(),
            gameState.inventories.p1,
            gameState.playerTableau.p1,
            gameState.playerBuffs.p1,
            true
        );
        expect(currentResult?.handlers).toHaveProperty('boardHandler');
        expect(currentResult?.handlers).toHaveProperty('marketHandler');
        expect(currentResult?.handlers).toHaveProperty('metaHandler');
        expect(currentResult?.handlers).toHaveProperty('debugHandler');
    });

    it('reports the can-local-interact flag as false when the access gate blocks play', () => {
        const gameState = {
            mode: 'PVE',
            turn: 'p2',
            inventories: { p1: { gold: 0 }, p2: { gold: 0 } },
            playerTableau: { p1: [], p2: [] },
            playerBuffs: { p1: null, p2: null },
        } as unknown as GameState;
        mocks.canPlayerInteract.mockReturnValue(false);
        mocks.useInteractionFeedback.mockReturnValue({
            selectedGems: [],
            setSelectedGems: vi.fn(),
            clearSelectedGems: vi.fn(),
            errorMsg: null,
            setErrorMsg: vi.fn(),
        });

        renderHarness(gameState, 0, false);

        expect(mocks.canPlayerInteract).toHaveBeenCalledWith(gameState, false);
        expect(currentResult?.isMyTurn).toBe(false);
        expect(currentResult?.errorMsg).toBeNull();
    });

    it('passes a false gameplay interaction gate while the turn handoff lock is active', () => {
        const gameState = {
            mode: 'LOCAL_PVP',
            turn: 'p1',
            inventories: { p1: { gold: 0 }, p2: { gold: 0 } },
            playerTableau: { p1: [], p2: [] },
            playerBuffs: { p1: null, p2: null },
        } as unknown as GameState;

        renderHarness(gameState, 0, false, true);

        expect(mocks.canPlayerInteract).toHaveBeenCalledWith(gameState, false);
        expect(mocks.useBoardInteractionHandlers).toHaveBeenCalledWith(
            expect.objectContaining({ canLocalInteract: false })
        );
        expect(mocks.useMarketInteractionHandlers).toHaveBeenCalledWith(
            expect.objectContaining({ canLocalInteract: false })
        );
        expect(mocks.useMetaInteractionHandlers).toHaveBeenCalledWith(
            expect.objectContaining({ canLocalInteract: false })
        );
        expect(currentResult?.isMyTurn).toBe(false);
        expect(currentResult?.getters.isMyTurn).toBe(false);
    });
});
