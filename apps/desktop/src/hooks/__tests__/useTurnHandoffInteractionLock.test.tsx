import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameState } from '@gemduel/shared/types';
import { useTurnHandoffInteractionLock } from '../useTurnHandoffInteractionLock';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useTurnHandoffInteractionLock', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult = false;

    const Harness = ({
        gameState,
        isReviewing,
        isViewingHistory,
    }: {
        gameState: GameState;
        isReviewing: boolean;
        isViewingHistory: boolean;
    }) => {
        currentResult = useTurnHandoffInteractionLock(gameState, isReviewing, isViewingHistory);
        return null;
    };

    const renderHarness = (gameState: GameState, isReviewing = false, isViewingHistory = false) => {
        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);
        }

        act(() => {
            root?.render(
                <Harness
                    gameState={gameState}
                    isReviewing={isReviewing}
                    isViewingHistory={isViewingHistory}
                />
            );
        });
    };

    beforeEach(() => {
        vi.useFakeTimers();
        currentResult = false;
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

    it('locks gameplay for about 500ms after the active turn changes', () => {
        renderHarness({ turn: 'p1', winner: null } as unknown as GameState);
        expect(currentResult).toBe(false);

        renderHarness({ turn: 'p2', winner: null } as unknown as GameState);
        expect(currentResult).toBe(true);

        act(() => {
            vi.advanceTimersByTime(499);
        });
        expect(currentResult).toBe(true);

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(currentResult).toBe(false);
    });

    it('does not lock while reviewing or viewing history', () => {
        renderHarness({ turn: 'p1', winner: null } as unknown as GameState);
        renderHarness({ turn: 'p2', winner: null } as unknown as GameState, true, false);
        expect(currentResult).toBe(false);

        renderHarness({ turn: 'p1', winner: null } as unknown as GameState, false, true);
        expect(currentResult).toBe(false);
    });
});
