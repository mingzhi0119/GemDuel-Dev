import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useViewportFitScale } from '../useViewportFitScale';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const installElementMetric = (
    key: 'offsetWidth' | 'offsetHeight' | 'scrollWidth' | 'scrollHeight',
    dataKey: string
) => {
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, key);

    Object.defineProperty(HTMLElement.prototype, key, {
        configurable: true,
        get() {
            return Number((this as HTMLElement).dataset[dataKey] ?? 0);
        },
    });

    return () => {
        if (original) {
            Object.defineProperty(HTMLElement.prototype, key, original);
        } else {
            delete (HTMLElement.prototype as unknown as Record<string, unknown>)[key];
        }
    };
};

const readScale = (container: Element) => {
    const fitTarget = container.querySelector<HTMLElement>('[data-testid="fit-target"]');
    const match = fitTarget?.style.transform.match(/scale\(([^)]+)\)/);
    return match ? Number(match[1]) : Number.NaN;
};

describe('useViewportFitScale', () => {
    const restoreMetrics: Array<() => void> = [];
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    beforeEach(() => {
        restoreMetrics.push(
            installElementMetric('offsetWidth', 'offsetWidth'),
            installElementMetric('offsetHeight', 'offsetHeight'),
            installElementMetric('scrollWidth', 'scrollWidth'),
            installElementMetric('scrollHeight', 'scrollHeight')
        );

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 1280,
        });
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 800,
        });

        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;

        while (restoreMetrics.length > 0) {
            restoreMetrics.pop()?.();
        }
    });

    it('uses untransformed layout dimensions when fitting start-page scale', () => {
        const FitHarness = () => {
            const fitScale = useViewportFitScale<HTMLDivElement>(3, 96);

            return (
                <div
                    ref={fitScale.ref}
                    data-testid="fit-target"
                    data-offset-width="536"
                    data-offset-height="560"
                    data-scroll-width="1608"
                    data-scroll-height="1680"
                    style={fitScale.style}
                />
            );
        };

        act(() => {
            root?.render(<FitHarness />);
        });

        expect(readScale(container!)).toBeCloseTo(1.257, 2);
    });

    it('uses the parent stage layout instead of the raw window when fitting start-page scale', () => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 1280,
        });
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 720,
        });

        const FitHarness = () => {
            const fitScale = useViewportFitScale<HTMLDivElement>(3, 96);

            return (
                <div data-offset-width="3840" data-offset-height="2160">
                    <div
                        ref={fitScale.ref}
                        data-testid="fit-target"
                        data-offset-width="536"
                        data-offset-height="560"
                        data-scroll-width="1608"
                        data-scroll-height="1680"
                        style={fitScale.style}
                    />
                </div>
            );
        };

        act(() => {
            root?.render(<FitHarness />);
        });

        expect(readScale(container!)).toBe(3);
    });
});
