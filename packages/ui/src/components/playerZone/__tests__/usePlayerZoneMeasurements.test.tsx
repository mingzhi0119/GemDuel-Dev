import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlayerZoneMeasurements } from '../usePlayerZoneMeasurements';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePlayerZoneMeasurements', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof usePlayerZoneMeasurements> | null = null;
    let observedElements: Element[] = [];
    let disconnect = vi.fn();

    const renderHarness = () => {
        const Harness = () => {
            currentResult = usePlayerZoneMeasurements();
            return React.createElement(
                React.Fragment,
                null,
                React.createElement('div', {
                    ref: currentResult.tableauRowRef,
                    'data-testid': 'tableau',
                }),
                React.createElement('div', {
                    ref: currentResult.reservedRowRef,
                    'data-testid': 'reserved',
                })
            );
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
        observedElements = [];
        disconnect = vi.fn();
        currentResult = null;
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        vi.unstubAllGlobals();
    });

    it('tracks widths through ResizeObserver-backed resize updates and disconnects on cleanup', () => {
        vi.stubGlobal(
            'ResizeObserver',
            vi.fn().mockImplementation(() => ({
                observe: (element: Element) => observedElements.push(element),
                disconnect,
            }))
        );

        renderHarness();

        const tableau = container?.querySelector('[data-testid="tableau"]') as HTMLDivElement;
        const reserved = container?.querySelector('[data-testid="reserved"]') as HTMLDivElement;
        Object.defineProperty(tableau, 'clientWidth', { configurable: true, value: 320 });
        Object.defineProperty(reserved, 'clientWidth', { configurable: true, value: 180 });

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(observedElements).toEqual([tableau, reserved]);
        expect(currentResult?.tableauRowWidth).toBe(320);
        expect(currentResult?.reservedRowWidth).toBe(180);

        act(() => {
            root?.unmount();
        });

        expect(disconnect).toHaveBeenCalled();
    });

    it('falls back to window resize handling when ResizeObserver is unavailable', () => {
        vi.stubGlobal('ResizeObserver', undefined);

        renderHarness();

        const tableau = container?.querySelector('[data-testid="tableau"]') as HTMLDivElement;
        const reserved = container?.querySelector('[data-testid="reserved"]') as HTMLDivElement;
        Object.defineProperty(tableau, 'clientWidth', { configurable: true, value: 250 });
        Object.defineProperty(reserved, 'clientWidth', { configurable: true, value: 150 });

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(currentResult?.tableauRowWidth).toBe(250);
        expect(currentResult?.reservedRowWidth).toBe(150);
    });
});
