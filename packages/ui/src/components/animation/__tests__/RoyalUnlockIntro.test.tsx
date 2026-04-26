// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RoyalUnlockIntro } from '../RoyalUnlockIntro';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type MatchMediaMock = (query: string) => MediaQueryList;

const createAnchors = () => {
    const middleZone = document.createElement('div');
    middleZone.dataset.presentationAnchor = 'middle-zone';
    middleZone.getBoundingClientRect = () =>
        ({
            x: 120,
            y: 180,
            top: 180,
            left: 120,
            right: 904,
            bottom: 620,
            width: 784,
            height: 440,
            toJSON: () => ({}),
        }) as DOMRect;
    document.body.appendChild(middleZone);
};

const setReducedMotion = (matches: boolean) => {
    const matchMedia: MatchMediaMock = (query) =>
        ({
            matches,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList;

    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: matchMedia,
    });
};

describe('RoyalUnlockIntro', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderIntro = async (onComplete = vi.fn()) => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <RoyalUnlockIntro
                    player="p1"
                    milestone={3}
                    theme="dark"
                    middleZoneSelector='[data-presentation-anchor="middle-zone"]'
                    onComplete={onComplete}
                />
            );
            await Promise.resolve();
        });

        return onComplete;
    };

    beforeEach(() => {
        vi.useFakeTimers();
        setReducedMotion(false);
        createAnchors();
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        document.body.innerHTML = '';
        root = null;
        container = null;
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('renders a rounded SVG frame around the whole middle zone and three crowns', async () => {
        await renderIntro();

        const framePath = container?.querySelector('[data-royal-unlock-frame="true"]');

        expect(framePath?.getAttribute('d')).toBe(
            'M 120 152 L 904 152 Q 938 152 938 186 L 938 614 Q 938 648 904 648 L 120 648 Q 86 648 86 614 L 86 186 Q 86 152 120 152 Z'
        );
        expect(container?.querySelectorAll('[data-royal-unlock-crown="true"]')).toHaveLength(3);
    });

    it('calls onComplete after the intro duration', async () => {
        const onComplete = await renderIntro();

        act(() => {
            vi.advanceTimersByTime(1250);
        });

        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('completes quickly when reduced motion is enabled', async () => {
        setReducedMotion(true);
        const onComplete = await renderIntro();

        act(() => {
            vi.advanceTimersByTime(140);
        });

        expect(onComplete).toHaveBeenCalledTimes(1);
    });
});
