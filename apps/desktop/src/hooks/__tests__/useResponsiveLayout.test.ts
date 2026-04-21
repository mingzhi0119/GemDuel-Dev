import React, { useEffect } from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ResponsiveLayout } from '@gemduel/shared/types';
import { calculateResponsiveLayout, useResponsiveLayout } from '../useResponsiveLayout';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const setViewport = (
    width: number,
    height: number,
    options: { devicePixelRatio?: number; isFinePointer?: boolean } = {}
) => {
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
    Object.defineProperty(window, 'devicePixelRatio', {
        configurable: true,
        writable: true,
        value: options.devicePixelRatio ?? 1,
    });
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches:
                query === '(hover: hover) and (pointer: fine)' && options.isFinePointer === true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
};

const expectLayoutMatch = (
    layout: ResponsiveLayout,
    expected: Omit<ResponsiveLayout, 'aspectRatio'>
) => {
    expect(layout.layoutMode).toBe(expected.layoutMode);
    expect(layout.viewportWidth).toBe(expected.viewportWidth);
    expect(layout.viewportHeight).toBe(expected.viewportHeight);
    expect(layout.stageCanvasWidthPx).toBeCloseTo(expected.stageCanvasWidthPx, 5);
    expect(layout.stageCanvasHeightPx).toBeCloseTo(expected.stageCanvasHeightPx, 5);
    expect(layout.stageScale).toBeCloseTo(expected.stageScale, 5);
    expect(layout.stageInsetXPx).toBe(expected.stageInsetXPx);
    expect(layout.stageInsetYPx).toBe(expected.stageInsetYPx);
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
        expectLayoutMatch(calculateResponsiveLayout(3840, 2160), {
            layoutMode: 'desktop-4k',
            viewportWidth: 3840,
            viewportHeight: 2160,
            stageCanvasWidthPx: 3840,
            stageCanvasHeightPx: 2160,
            stageScale: 1,
            stageInsetXPx: 0,
            stageInsetYPx: 0,
            boardScale: 1.14,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 317,
            mainGapPx: 32,
        });

        expectLayoutMatch(calculateResponsiveLayout(3840, 2400), {
            layoutMode: 'desktop-4k',
            viewportWidth: 3840,
            viewportHeight: 2400,
            stageCanvasWidthPx: 3840,
            stageCanvasHeightPx: 2400,
            stageScale: 1,
            stageInsetXPx: 0,
            stageInsetYPx: 0,
            boardScale: 1.14,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 317,
            mainGapPx: 32,
        });

        expectLayoutMatch(calculateResponsiveLayout(2560, 1440), {
            layoutMode: 'desktop-4k',
            viewportWidth: 2560,
            viewportHeight: 1440,
            stageCanvasWidthPx: 3840,
            stageCanvasHeightPx: 2160,
            stageScale: 0.6666666666666666,
            stageInsetXPx: 0,
            stageInsetYPx: 0,
            boardScale: 1.14,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 317,
            mainGapPx: 32,
        });

        expectLayoutMatch(calculateResponsiveLayout(1920, 1080), {
            layoutMode: 'desktop-4k',
            viewportWidth: 1920,
            viewportHeight: 1080,
            stageCanvasWidthPx: 3840,
            stageCanvasHeightPx: 2160,
            stageScale: 0.5,
            stageInsetXPx: 0,
            stageInsetYPx: 0,
            boardScale: 1.14,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 317,
            mainGapPx: 32,
        });

        expectLayoutMatch(calculateResponsiveLayout(1920, 1200), {
            layoutMode: 'desktop-4k',
            viewportWidth: 1920,
            viewportHeight: 1200,
            stageCanvasWidthPx: 3840,
            stageCanvasHeightPx: 2400,
            stageScale: 0.5,
            stageInsetXPx: 0,
            stageInsetYPx: 0,
            boardScale: 1.14,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 317,
            mainGapPx: 32,
        });

        expectLayoutMatch(calculateResponsiveLayout(1440, 900), {
            layoutMode: 'desktop-4k',
            viewportWidth: 1440,
            viewportHeight: 900,
            stageCanvasWidthPx: 3840,
            stageCanvasHeightPx: 2400,
            stageScale: 0.375,
            stageInsetXPx: 0,
            stageInsetYPx: 0,
            boardScale: 1.14,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 317,
            mainGapPx: 32,
        });

        expectLayoutMatch(calculateResponsiveLayout(3440, 1440), {
            layoutMode: 'desktop-4k',
            viewportWidth: 3440,
            viewportHeight: 1440,
            stageCanvasWidthPx: 3840,
            stageCanvasHeightPx: 1440 / (3440 / 3840),
            stageScale: 3440 / 3840,
            stageInsetXPx: 0,
            stageInsetYPx: 0,
            boardScale: 1.14,
            deckScale: 1.08,
            zoneScale: 0.96,
            zoneHeightPx: 317,
            mainGapPx: 32,
        });

        expectLayoutMatch(calculateResponsiveLayout(375, 812), {
            layoutMode: 'mobile',
            viewportWidth: 375,
            viewportHeight: 812,
            stageCanvasWidthPx: 375,
            stageCanvasHeightPx: 812,
            stageScale: 1,
            stageInsetXPx: 0,
            stageInsetYPx: 0,
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
        const getLastLayout = () => observedLayouts[observedLayouts.length - 1];

        const Harness = () => {
            const layout = useResponsiveLayout();

            useEffect(() => {
                observedLayouts.push(layout);
            }, [layout]);

            return null;
        };

        setViewport(1920, 1200);

        const container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container);
            root.render(React.createElement(Harness));
        });

        expect(getLastLayout()?.layoutMode).toBe('desktop-4k');
        expect(getLastLayout()?.stageCanvasWidthPx).toBe(3840);
        expect(getLastLayout()?.stageCanvasHeightPx).toBe(2400);
        expect(getLastLayout()?.stageScale).toBeCloseTo(0.5, 5);
        expect(getLastLayout()?.stageInsetYPx).toBe(0);

        act(() => {
            setViewport(375, 812);
            window.dispatchEvent(new Event('resize'));
        });

        expect(getLastLayout()?.layoutMode).toBe('mobile');
        expect(getLastLayout()?.stageCanvasWidthPx).toBe(375);
        expect(getLastLayout()?.stageCanvasHeightPx).toBe(812);
        expect(getLastLayout()?.boardScale).toBe(0.45);

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

    it('compensates the desktop canvas for high-density laptop displays', () => {
        expectLayoutMatch(
            calculateResponsiveLayout(1707, 1067, {
                devicePixelRatio: 1.5,
                isFinePointer: true,
            }),
            {
                layoutMode: 'desktop-4k',
                viewportWidth: 1707,
                viewportHeight: 1067,
                stageCanvasWidthPx: 2560,
                stageCanvasHeightPx: 1067 / (1707 / 2560),
                stageScale: 1707 / 2560,
                stageInsetXPx: 0,
                stageInsetYPx: 0,
                boardScale: 1.14,
                deckScale: 1.08,
                zoneScale: 0.96,
                zoneHeightPx: 317,
                mainGapPx: 32,
            }
        );
    });

    it('promotes fine-pointer high-density laptop viewports to the desktop stage', () => {
        const layout = calculateResponsiveLayout(960, 600, {
            devicePixelRatio: 2,
            isFinePointer: true,
        });

        expect(layout.layoutMode).toBe('desktop-4k');
        expect(layout.stageCanvasWidthPx).toBe(1920);
        expect(layout.stageCanvasHeightPx).toBe(1200);
        expect(layout.stageScale).toBeCloseTo(0.5, 5);
        expect(layout.stageInsetYPx).toBe(0);
    });

    it('keeps coarse-pointer high-density screens on the mobile path', () => {
        const layout = calculateResponsiveLayout(414, 896, {
            devicePixelRatio: 3,
            isFinePointer: false,
        });

        expect(layout.layoutMode).toBe('mobile');
        expect(layout.stageCanvasWidthPx).toBe(414);
        expect(layout.stageCanvasHeightPx).toBe(896);
        expect(layout.stageScale).toBe(1);
    });

    it('keeps the desktop 4k constants stable across supported desktop viewports', () => {
        [
            [1280, 720],
            [1366, 768],
            [1440, 900],
            [1920, 1080],
            [1920, 1200],
            [2560, 1440],
            [3840, 2160],
        ].forEach(([width, height]) => {
            const layout = calculateResponsiveLayout(width, height);
            expect(layout.layoutMode).toBe('desktop-4k');
            expect(layout.boardScale).toBe(1.14);
            expect(layout.deckScale).toBe(1.08);
            expect(layout.zoneScale).toBe(0.96);
            expect(layout.zoneHeightPx).toBe(317);
            expect(layout.mainGapPx).toBe(32);
            expect(layout.stageScale).toBeGreaterThan(0);
        });
    });
});
