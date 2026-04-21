import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameAction, GameState } from '@gemduel/shared/types';
import { useHistoryFlattening } from '../useHistoryFlattening';

const mocks = vi.hoisted(() => ({
    shouldFlattenHistory: vi.fn(),
}));

vi.mock('@gemduel/shared/logic/historyFlattening', () => ({
    shouldFlattenHistory: (...args: unknown[]) => mocks.shouldFlattenHistory(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useHistoryFlattening', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useHistoryFlattening> | null = null;
    const clearAndInit = vi.fn();

    const renderHarness = (
        gameState: GameState,
        historyControls: Parameters<typeof useHistoryFlattening>[1]
    ) => {
        const Harness = () => {
            currentResult = useHistoryFlattening(gameState, historyControls);
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
        clearAndInit.mockReset();
        mocks.shouldFlattenHistory.mockReset();
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('flattens qualifying history snapshots into a FLATTEN action', () => {
        const snapshot = {
            phase: 'IDLE',
            nested: { count: 2 },
        } as unknown as GameState;
        const historyControls = {
            history: [{ type: 'SELECT_BUFF' } as GameAction],
            historyLength: 2,
            clearAndInit,
        };

        mocks.shouldFlattenHistory.mockReturnValue(true);

        renderHarness(snapshot, historyControls);

        expect(clearAndInit).toHaveBeenCalledTimes(1);
        const flattened = clearAndInit.mock.calls[0][0] as GameAction;
        expect(flattened.type).toBe('FLATTEN');
        expect(flattened.payload).toEqual(snapshot);
        expect(flattened.payload).not.toBe(snapshot);
        expect(currentResult).toBeUndefined();
    });

    it('does nothing when the history should remain intact', () => {
        const historyControls = {
            history: [{ type: 'CLOSE_MODAL' } as GameAction],
            historyLength: 1,
            clearAndInit,
        };

        mocks.shouldFlattenHistory.mockReturnValue(false);

        renderHarness({ phase: 'MAIN_PHASE' } as unknown as GameState, historyControls);

        expect(clearAndInit).not.toHaveBeenCalled();
    });
});
