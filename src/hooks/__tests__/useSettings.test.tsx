import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useSettings } from '../useSettings';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useSettings', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useSettings> | null = null;

    const renderHarness = () => {
        const Harness = () => {
            currentResult = useSettings();
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

    it('exposes the dark theme default and a stable shared game config', () => {
        renderHarness();

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.GAME_CONFIG).toMatchObject({
            difficulty: 'NORMAL',
            playerNames: { p1: 'Player 1', p2: 'Player 2' },
        });

        act(() => {
            currentResult?.setTheme('light');
        });

        expect(currentResult?.theme).toBe('light');
    });
});
