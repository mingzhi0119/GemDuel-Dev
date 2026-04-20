import React, { useEffect } from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ResponsiveLayout } from '../../types';
import { calculateResponsiveLayout, useResponsiveLayout } from '../../hooks/useResponsiveLayout';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const setViewport = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        writable: true,
        value: height,
    });
};

const expectLayoutMatch = (
    layout: ResponsiveLayout,
    expected: Omit<ResponsiveLayout, 'aspectRatio'>
) => {
    expect(layout.layoutMode).toBe(expected.layoutMode);
    expect(layout.viewportWidth).toBe(expected.viewportWidth);
    expect(layout.viewportHeight).toBe(expected.viewportHeight);
    expect(layout.boardScale).toBeCloseTo(expected.boardScale, 5);
    expect(layout.deckScale).toBeCloseTo(expected.deckScale, 5);
    expect(layout.zoneScale).toBeCloseTo(expected.zoneScale, 5);
    expect(layout.zoneHeightPx).toBe(expected.zoneHeightPx);
    expect(layout.mainGapPx).toBe(expected.mainGapPx);
};

describe('Responsive layout adaptation', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('computes the expected profile for common desktop and mobile viewports', () => {
        expectLayoutMatch(calculateResponsiveLayout(1280, 800), {
            layoutMode: 'desktop-auto',
            viewportWidth: 1280,
            viewportHeight: 800,
            boardScale: 1.007536231884058,
            deckScale: 1.047536231884058,
            zoneScale: 0.96,
            zoneHeightPx: 233,
            mainGapPx: 24,
        });

        expectLayoutMatch(calculateResponsiveLayout(1366, 768), {
            layoutMode: 'desktop-auto',
            viewportWidth: 1366,
            viewportHeight: 768,
            boardScale: 0.9530232558139535,
            deckScale: 1,
            zoneScale: 0.9130232558139535,
            zoneHeightPx: 233,
            mainGapPx: 24,
        });

        expectLayoutMatch(calculateResponsiveLayout(1440, 900), {
            layoutMode: 'desktop-auto',
            viewportWidth: 1440,
            viewportHeight: 900,
            boardScale: 1.1234782608695653,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 254,
            mainGapPx: 24,
        });

        expectLayoutMatch(calculateResponsiveLayout(1920, 1080), {
            layoutMode: 'desktop-auto',
            viewportWidth: 1920,
            viewportHeight: 1080,
            boardScale: 1.14,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 286,
            mainGapPx: 31,
        });

        expectLayoutMatch(calculateResponsiveLayout(1920, 1200), {
            layoutMode: 'desktop-auto',
            viewportWidth: 1920,
            viewportHeight: 1200,
            boardScale: 1.14,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 317,
            mainGapPx: 31,
        });

        expectLayoutMatch(calculateResponsiveLayout(375, 812), {
            layoutMode: 'mobile',
            viewportWidth: 375,
            viewportHeight: 812,
            boardScale: 0.45,
            deckScale: 0.55,
            zoneScale: 0.55,
            zoneHeightPx: 286,
            mainGapPx: 16,
        });
    });

    it('updates the layout profile when the viewport resizes', () => {
        const observedLayouts: ResponsiveLayout[] = [];
        let root: Root | null = null;

        const Harness = () => {
            const layout = useResponsiveLayout();

            useEffect(() => {
                observedLayouts.push(layout);
            }, [layout]);

            return null;
        };

        setViewport(1366, 768);

        const container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container);
            root.render(React.createElement(Harness));
        });

        expect(observedLayouts.at(-1)?.layoutMode).toBe('desktop-auto');
        expect(observedLayouts.at(-1)?.boardScale).toBeCloseTo(0.9530232558139535, 5);

        act(() => {
            setViewport(375, 812);
            window.dispatchEvent(new Event('resize'));
        });

        expect(observedLayouts.at(-1)?.layoutMode).toBe('mobile');
        expect(observedLayouts.at(-1)?.boardScale).toBe(0.45);

        act(() => {
            root?.unmount();
        });
    });

    it('cleans up the resize listener on unmount', () => {
        let root: Root | null = null;
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');

        const Harness = () => {
            useResponsiveLayout();
            return null;
        };

        const container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container);
            root.render(React.createElement(Harness));
        });

        const resizeHandler = addSpy.mock.calls.find(([eventName]) => eventName === 'resize')?.[1];
        expect(typeof resizeHandler).toBe('function');

        act(() => {
            root?.unmount();
        });

        expect(
            removeSpy.mock.calls.some(
                ([eventName, handler]) => eventName === 'resize' && handler === resizeHandler
            )
        ).toBe(true);
    });

    it('keeps desktop main-gap values clamped between 24 and 32 pixels', () => {
        [1280, 1366, 1440, 1600, 1920, 2560].forEach((width) => {
            const layout = calculateResponsiveLayout(width, 1080);
            expect(layout.layoutMode).toBe('desktop-auto');
            expect(layout.mainGapPx).toBeGreaterThanOrEqual(24);
            expect(layout.mainGapPx).toBeLessThanOrEqual(32);
        });
    });
});
