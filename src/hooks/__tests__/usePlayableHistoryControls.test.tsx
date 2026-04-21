import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlayableHistoryControls } from '../usePlayableHistoryControls';

const mocks = vi.hoisted(() => ({
    isHistoryTimeTravelBlocked: vi.fn(),
}));

vi.mock('../../logic/interactionAccess', () => ({
    isHistoryTimeTravelBlocked: (...args: unknown[]) => mocks.isHistoryTimeTravelBlocked(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePlayableHistoryControls', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof usePlayableHistoryControls> | null = null;

    const renderHarness = (mode: Parameters<typeof usePlayableHistoryControls>[0]) => {
        const historyControls = {
            undo: vi.fn(),
            redo: vi.fn(),
            canUndo: true,
            canRedo: true,
        };

        const Harness = () => {
            currentResult = usePlayableHistoryControls(mode, historyControls);
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

        return { historyControls };
    };

    beforeEach(() => {
        currentResult = null;
        mocks.isHistoryTimeTravelBlocked.mockReset();
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('passes through history controls when time travel is allowed', () => {
        mocks.isHistoryTimeTravelBlocked.mockReturnValue(false);
        const { historyControls } = renderHarness('LOCAL_PVP');

        currentResult?.undo();
        currentResult?.redo();

        expect(historyControls.undo).toHaveBeenCalled();
        expect(historyControls.redo).toHaveBeenCalled();
        expect(currentResult?.canUndo).toBe(true);
        expect(currentResult?.canRedo).toBe(true);
    });

    it('blocks history time travel in multiplayer mode', () => {
        mocks.isHistoryTimeTravelBlocked.mockReturnValue(true);
        const { historyControls } = renderHarness('ONLINE_MULTIPLAYER');

        currentResult?.undo();
        currentResult?.redo();

        expect(historyControls.undo).not.toHaveBeenCalled();
        expect(historyControls.redo).not.toHaveBeenCalled();
        expect(currentResult?.canUndo).toBe(false);
        expect(currentResult?.canRedo).toBe(false);
    });
});
