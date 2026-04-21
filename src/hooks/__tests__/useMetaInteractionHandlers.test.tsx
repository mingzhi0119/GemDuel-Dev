import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameAction, GameMode, GameState, RoyalCard } from '../../types';
import { useMetaInteractionHandlers } from '../useMetaInteractionHandlers';

const mocks = vi.hoisted(() => ({
    canActionRunInPhase: vi.fn(),
    buildGameStartAction: vi.fn(),
    buildPeekDeckAction: vi.fn(),
    buildSelectBuffAction: vi.fn(),
    buildSelectRoyalAction: vi.fn(),
    getRandomBasicGemColor: vi.fn(),
}));

vi.mock('../../logic/fsm', () => ({
    canActionRunInPhase: (...args: unknown[]) => mocks.canActionRunInPhase(...args),
}));

vi.mock('../../logic/interactionCommands', () => ({
    buildGameStartAction: (...args: unknown[]) => mocks.buildGameStartAction(...args),
    buildPeekDeckAction: (...args: unknown[]) => mocks.buildPeekDeckAction(...args),
    buildSelectBuffAction: (...args: unknown[]) => mocks.buildSelectBuffAction(...args),
    buildSelectRoyalAction: (...args: unknown[]) => mocks.buildSelectRoyalAction(...args),
}));

vi.mock('../../logic/gameSetup', () => ({
    getRandomBasicGemColor: (...args: unknown[]) => mocks.getRandomBasicGemColor(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useMetaInteractionHandlers', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useMetaInteractionHandlers> | null = null;
    const networkDispatch = vi.fn<(action: GameAction) => void>();

    const renderHarness = (gameState: GameState, canLocalInteract = true) => {
        const Harness = () => {
            currentResult = useMetaInteractionHandlers({
                gameState,
                canLocalInteract,
                networkDispatch,
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
        mocks.canActionRunInPhase.mockReset();
        mocks.buildGameStartAction.mockReset();
        mocks.buildPeekDeckAction.mockReset();
        mocks.buildSelectBuffAction.mockReset();
        mocks.buildSelectRoyalAction.mockReset();
        mocks.getRandomBasicGemColor.mockReset();
        mocks.getRandomBasicGemColor.mockReturnValue('blue');
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('dispatches all meta actions when the phase guards allow them', () => {
        const gameState = {
            phase: 'MAIN_PHASE',
            turn: 'p1',
            buffLevel: 2,
        } as unknown as GameState;
        const royalCard = { id: 'royal-1' } as RoyalCard;

        mocks.canActionRunInPhase.mockReturnValue(true);
        mocks.buildGameStartAction.mockReturnValue({ type: 'START_GAME' } as unknown as GameAction);
        mocks.buildSelectRoyalAction.mockReturnValue({ type: 'SELECT_ROYAL_CARD' } as GameAction);
        mocks.buildSelectBuffAction.mockReturnValue({ type: 'SELECT_BUFF' } as GameAction);
        mocks.buildPeekDeckAction.mockReturnValue({ type: 'PEEK_DECK' } as GameAction);

        renderHarness(gameState);

        currentResult?.startGame('PVE' as GameMode, { useBuffs: true, isHost: true });
        currentResult?.handleSelectRoyal(royalCard);
        currentResult?.handleSelectBuff('buff-1');
        currentResult?.handleCloseModal();
        currentResult?.handlePeekDeck(3);

        expect(mocks.buildGameStartAction).toHaveBeenCalledWith('PVE', {
            useBuffs: true,
            isHost: true,
        });
        expect(networkDispatch).toHaveBeenCalledWith({ type: 'START_GAME' });
        expect(networkDispatch).toHaveBeenCalledWith({ type: 'SELECT_ROYAL_CARD' });
        expect(networkDispatch).toHaveBeenCalledWith({ type: 'SELECT_BUFF' });
        expect(networkDispatch).toHaveBeenCalledWith({ type: 'CLOSE_MODAL' });
        expect(networkDispatch).toHaveBeenCalledWith({ type: 'PEEK_DECK' });
    });

    it('skips guarded meta actions when the phase or local-interaction gate blocks them', () => {
        const gameState = {
            phase: 'IDLE',
            turn: 'p2',
            buffLevel: 1,
        } as unknown as GameState;

        mocks.canActionRunInPhase.mockReturnValue(false);
        mocks.buildGameStartAction.mockReturnValue({ type: 'START_GAME' } as unknown as GameAction);

        renderHarness(gameState, false);

        currentResult?.handleSelectRoyal({ id: 'royal-2' } as RoyalCard);
        currentResult?.handleSelectBuff('buff-2');
        currentResult?.handlePeekDeck(1);

        expect(networkDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: 'SELECT_ROYAL_CARD' })
        );
        expect(networkDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: 'SELECT_BUFF' })
        );
        expect(networkDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: 'PEEK_DECK' })
        );
    });
});
