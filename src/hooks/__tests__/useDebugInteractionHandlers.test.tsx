import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameAction, GameState } from '../../types';
import { useDebugInteractionHandlers } from '../useDebugInteractionHandlers';

const mocks = vi.hoisted(() => ({
    buildDebugAction: vi.fn(),
}));

vi.mock('../../logic/interactionCommands', () => ({
    buildDebugAction: (...args: unknown[]) => mocks.buildDebugAction(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useDebugInteractionHandlers', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useDebugInteractionHandlers> | null = null;
    const networkDispatch = vi.fn<(action: GameAction) => void>();

    const renderHarness = (gameState: GameState, canLocalInteract = true) => {
        const Harness = () => {
            currentResult = useDebugInteractionHandlers({
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
        mocks.buildDebugAction.mockReset();
        mocks.buildDebugAction.mockImplementation((type: string, player?: string) =>
            type === 'FORCE_ROYAL_SELECTION' ? { type } : { type, payload: player || 'p1' }
        );
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('dispatches debug actions when the game is still live', () => {
        renderHarness({ winner: null } as unknown as GameState, true);

        currentResult?.handleDebugAddCrowns('p1');
        currentResult?.handleDebugAddPoints('p2');
        currentResult?.handleDebugAddPrivilege('p1');
        currentResult?.handleForceRoyal();
        currentResult?.handleRerollBuffs(2);

        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'DEBUG_ADD_CROWNS',
            payload: 'p1',
        });
        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'DEBUG_ADD_POINTS',
            payload: 'p2',
        });
        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'DEBUG_ADD_PRIVILEGE',
            payload: 'p1',
        });
        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'FORCE_ROYAL_SELECTION',
        });
        expect(networkDispatch).toHaveBeenCalledWith({
            type: 'DEBUG_REROLL_BUFFS',
            payload: { level: 2 },
        });
    });

    it('blocks debug dispatches after a winner exists or when local interaction is disabled', () => {
        renderHarness({ winner: 'p1' } as unknown as GameState, false);

        currentResult?.handleDebugAddCrowns('p1');
        currentResult?.handleForceRoyal();
        currentResult?.handleRerollBuffs(3);

        expect(networkDispatch).not.toHaveBeenCalled();
    });
});
