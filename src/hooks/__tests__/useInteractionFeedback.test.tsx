import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInteractionFeedback } from '../useInteractionFeedback';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useInteractionFeedback', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useInteractionFeedback> | null = null;

    const renderHarness = (currentIndex: number) => {
        const Harness = () => {
            currentResult = useInteractionFeedback(currentIndex);
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

    it('clears selections when the index changes and clears errors on a timer', () => {
        renderHarness(0);

        act(() => {
            currentResult?.setSelectedGems([{ r: 0, c: 0 }]);
        });
        expect(currentResult?.selectedGems).toEqual([{ r: 0, c: 0 }]);

        renderHarness(1);
        expect(currentResult?.selectedGems).toEqual([]);

        act(() => {
            currentResult?.setErrorMsg('boom');
        });
        expect(currentResult?.errorMsg).toBe('boom');

        act(() => {
            vi.advanceTimersByTime(2999);
        });
        expect(currentResult?.errorMsg).toBe('boom');

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(currentResult?.errorMsg).toBeNull();
    });
});
