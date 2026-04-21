import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { GameAction } from '@gemduel/shared/types';
import { useActionHistory } from '../useActionHistory';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useActionHistory', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useActionHistory> | null = null;

    const renderHarness = () => {
        const Harness = () => {
            currentResult = useActionHistory();
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
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('records actions, branches from the past, and updates undo/redo state', () => {
        renderHarness();

        act(() => {
            currentResult?.recordAction({ type: 'INIT' } as GameAction);
        });
        expect(currentResult?.history).toEqual([{ type: 'INIT' }]);
        expect(currentResult?.currentIndex).toBe(0);

        act(() => {
            currentResult?.recordAction({ type: 'CLOSE_MODAL' } as GameAction);
        });
        expect(currentResult?.history).toEqual([{ type: 'INIT' }, { type: 'CLOSE_MODAL' }]);
        expect(currentResult?.currentIndex).toBe(1);
        expect(currentResult?.canUndo).toBe(true);

        act(() => {
            currentResult?.undo();
        });
        expect(currentResult?.currentIndex).toBe(0);
        expect(currentResult?.canRedo).toBe(true);

        act(() => {
            currentResult?.recordAction({ type: 'DEBUG_ADD_POINTS' } as GameAction);
        });
        expect(currentResult?.history).toEqual([{ type: 'INIT' }, { type: 'DEBUG_ADD_POINTS' }]);
        expect(currentResult?.currentIndex).toBe(1);
        expect(currentResult?.canRedo).toBe(false);

        act(() => {
            currentResult?.jumpToStep(-1);
        });
        expect(currentResult?.currentIndex).toBe(-1);

        act(() => {
            currentResult?.jumpToStep(99);
        });
        expect(currentResult?.currentIndex).toBe(-1);
    });

    it('imports and clears history snapshots', () => {
        renderHarness();

        const imported = [{ type: 'INIT' } as GameAction, { type: 'CLOSE_MODAL' } as GameAction];

        act(() => {
            currentResult?.importHistory(imported);
        });

        expect(currentResult?.history).toBe(imported);
        expect(currentResult?.currentIndex).toBe(1);

        act(() => {
            currentResult?.clearAndInit({ type: 'DEBUG_ADD_CROWNS' } as GameAction);
        });

        expect(currentResult?.history).toEqual([{ type: 'DEBUG_ADD_CROWNS' }]);
        expect(currentResult?.currentIndex).toBe(0);
    });
});
