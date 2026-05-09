// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AppVisualLabMode } from '../../../types/ui';
import { useVisualLabExitReset } from '../useVisualLabExitReset';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

interface HarnessProps {
    visualLabMode: AppVisualLabMode | null;
    historyLength: number;
    resetToStartPage: () => void;
    onHookReady?: (markExitIntent: () => void) => void;
}

const Harness = ({ visualLabMode, historyLength, resetToStartPage, onHookReady }: HarnessProps) => {
    const markExitIntent = useVisualLabExitReset({
        visualLabMode,
        historyLength,
        resetToStartPage,
    });
    onHookReady?.(markExitIntent);
    return null;
};

describe('useVisualLabExitReset', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderHarness = async (props: HarnessProps) => {
        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);
        }

        await act(async () => {
            root!.render(<Harness {...props} />);
            await Promise.resolve();
        });
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('resets to the start page when a directly opened visual lab route closes', async () => {
        const resetToStartPage = vi.fn();

        await renderHarness({
            visualLabMode: 'surfaces',
            historyLength: 0,
            resetToStartPage,
        });
        await renderHarness({
            visualLabMode: null,
            historyLength: 0,
            resetToStartPage,
        });

        expect(resetToStartPage).toHaveBeenCalledTimes(1);
    });

    it('does not reset when visual lab had app history to return to', async () => {
        const resetToStartPage = vi.fn();

        await renderHarness({
            visualLabMode: null,
            historyLength: 2,
            resetToStartPage,
        });
        await renderHarness({
            visualLabMode: 'motion',
            historyLength: 2,
            resetToStartPage,
        });
        await renderHarness({
            visualLabMode: null,
            historyLength: 2,
            resetToStartPage,
        });

        expect(resetToStartPage).not.toHaveBeenCalled();
    });

    it('lets the close action refresh the reset decision from current history length', async () => {
        const resetToStartPage = vi.fn();
        let markExitIntent: (() => void) | null = null;

        await renderHarness({
            visualLabMode: 'readability',
            historyLength: 1,
            resetToStartPage,
            onHookReady: (callback) => {
                markExitIntent = callback;
            },
        });
        act(() => {
            markExitIntent?.();
        });
        await renderHarness({
            visualLabMode: null,
            historyLength: 1,
            resetToStartPage,
        });

        expect(resetToStartPage).not.toHaveBeenCalled();
    });
});
