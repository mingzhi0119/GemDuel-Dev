import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlayerZoneFeedback } from '../usePlayerZoneFeedback';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePlayerZoneFeedback', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof usePlayerZoneFeedback> | null = null;

    const renderHarness = (
        player: 'p1' | 'p2',
        lastFeedback: {
            uid: string;
            items: Array<{ player: 'p1' | 'p2'; type: string; diff: number }>;
        } | null
    ) => {
        const Harness = () => {
            currentResult = usePlayerZoneFeedback(player, lastFeedback);
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

    it('adds feedback items only for the active player, toggles extortion, and clears timers', () => {
        renderHarness('p1', {
            uid: 'feedback-1',
            items: [
                { player: 'p1', type: 'extortion', diff: -2 },
                { player: 'p1', type: 'gold', diff: 1 },
                { player: 'p2', type: 'blue', diff: 3 },
            ],
        });

        expect(currentResult?.isExtortionEffect).toBe(true);
        expect(currentResult?.feedbacks).toEqual([
            expect.objectContaining({ label: 'Extortion', quantity: '-2', type: 'extortion' }),
            expect.objectContaining({ label: 'Gold', quantity: '+1', type: 'gold' }),
        ]);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(currentResult?.isExtortionEffect).toBe(false);

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(currentResult?.feedbacks).toEqual([]);
    });

    it('ignores duplicate feedback ids and leaves empty state unchanged for null feedback', () => {
        const feedback = {
            uid: 'feedback-2',
            items: [{ player: 'p2' as const, type: 'blue', diff: 2 }],
        };

        renderHarness('p2', feedback);
        const firstSnapshot = currentResult?.feedbacks.map((item) => item.quantity);

        renderHarness('p2', feedback);
        expect(currentResult?.feedbacks.map((item) => item.quantity)).toEqual(firstSnapshot);

        act(() => {
            root?.unmount();
        });
        root = null;
        container?.remove();
        container = null;

        renderHarness('p2', null);
        expect(currentResult?.feedbacks).toEqual([]);
    });

    it('clears pending feedback timers when unmounted', () => {
        renderHarness('p1', {
            uid: 'feedback-3',
            items: [
                { player: 'p1', type: 'extortion', diff: -1 },
                { player: 'p1', type: 'gold', diff: 1 },
            ],
        });

        expect(vi.getTimerCount()).toBe(3);

        act(() => {
            root?.unmount();
        });
        root = null;
        container?.remove();
        container = null;

        expect(vi.getTimerCount()).toBe(0);
    });
});
