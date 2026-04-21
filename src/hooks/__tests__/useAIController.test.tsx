import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameAction, GameState } from '../../types';
import { useAIController } from '../useAIController';

const mocks = vi.hoisted(() => ({
    computeAiAction: vi.fn(),
}));

vi.mock('../../logic/ai/aiPlayer', () => ({
    computeAiAction: (...args: unknown[]) => mocks.computeAiAction(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useAIController', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useAIController> | null = null;
    const recordAction = vi.fn<(action: GameAction) => void>();

    const renderHarness = (gameState: GameState, isViewingHistory = false) => {
        const Harness = () => {
            currentResult = useAIController(gameState, recordAction, isViewingHistory);
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
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-04-19T00:00:00.000Z'));
        recordAction.mockReset();
        mocks.computeAiAction.mockReset();
        currentResult = null;
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        vi.useRealTimers();
    });

    it('queues an AI action only for the active p2 PVE turn', () => {
        mocks.computeAiAction.mockReturnValue({ type: 'AI_PLAY' } as unknown as GameAction);

        renderHarness({ mode: 'PVE', turn: 'p2', winner: null } as unknown as GameState);

        act(() => {
            vi.advanceTimersByTime(999);
        });
        expect(recordAction).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(mocks.computeAiAction).toHaveBeenCalled();
        expect(recordAction).toHaveBeenCalledWith({ type: 'AI_PLAY' });
        expect(currentResult).toBeUndefined();
    });

    it('skips scheduling when viewing history or when the turn is not ai-controlled', () => {
        renderHarness({ mode: 'PVE', turn: 'p1', winner: null } as unknown as GameState, true);

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(mocks.computeAiAction).not.toHaveBeenCalled();
        expect(recordAction).not.toHaveBeenCalled();
    });
});
