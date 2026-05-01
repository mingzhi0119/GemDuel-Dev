// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ReplayControls } from '../ReplayControls';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('ReplayControls', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderReplayControls = async ({
        undo = vi.fn(),
        redo = vi.fn(),
        fastForward,
        canUndo = true,
        canRedo = true,
        currentIndex = 0,
        historyLength = 3,
    }: Partial<React.ComponentProps<typeof ReplayControls>> = {}) => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale="en" setLocale={vi.fn()}>
                    <ReplayControls
                        undo={undo}
                        redo={redo}
                        fastForward={fastForward}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        currentIndex={currentIndex}
                        historyLength={historyLength}
                        theme="dark"
                    />
                </LocaleProvider>
            );
            await Promise.resolve();
        });
    };

    const getRedoButton = () => {
        const button = container?.querySelector<HTMLButtonElement>('[data-replay-control="redo"]');
        if (!button) {
            throw new Error('Missing redo control');
        }

        return button;
    };

    beforeEach(() => {
        vi.useFakeTimers();
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

    it('keeps a normal redo click as a single step forward', async () => {
        const redo = vi.fn();
        const fastForward = vi.fn();
        await renderReplayControls({ redo, fastForward });
        const redoButton = getRedoButton();

        act(() => {
            redoButton.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0 }));
            vi.advanceTimersByTime(449);
            redoButton.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, button: 0 }));
            redoButton.click();
        });

        expect(redo).toHaveBeenCalledTimes(1);
        expect(fastForward).not.toHaveBeenCalled();
    });

    it('jumps to the latest step when holding the redo control', async () => {
        const redo = vi.fn();
        const fastForward = vi.fn();
        await renderReplayControls({ redo, fastForward });
        const redoButton = getRedoButton();

        act(() => {
            redoButton.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0 }));
            vi.advanceTimersByTime(450);
        });

        expect(fastForward).toHaveBeenCalledTimes(1);
        expect(redo).not.toHaveBeenCalled();

        act(() => {
            redoButton.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, button: 0 }));
            redoButton.click();
        });

        expect(fastForward).toHaveBeenCalledTimes(1);
        expect(redo).not.toHaveBeenCalled();
    });
});
