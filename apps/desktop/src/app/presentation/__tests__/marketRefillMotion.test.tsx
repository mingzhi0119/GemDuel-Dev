// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Card } from '@gemduel/shared/types';
import type { MarketRefillPresentationEvent } from '../presentationTypes';
import { MarketRefillMotion } from '../MarketRefillMotion';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createCard = (id: string, level: 1 | 2 | 3 = 2): Card => ({
    id,
    level,
    cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
    points: 1,
    ability: 'none',
    bonusColor: 'blue',
    crowns: 0,
    bonusCount: 1,
});

const mockRect = (x: number, y: number, width: number, height: number) =>
    ({
        x,
        y,
        width,
        height,
        top: y,
        left: x,
        right: x + width,
        bottom: y + height,
        toJSON: () => ({}),
    }) as DOMRect;

const defaultGetElementRect = (selector: string) => {
    if (selector.includes('data-market-deck')) {
        return mockRect(10, 20, 120, 160);
    }
    if (selector.includes('data-market-slot')) {
        return mockRect(400, 300, 140, 180);
    }
    return null;
};

const getElementRectMock = vi.fn(defaultGetElementRect);

vi.mock('../presentationGeometry', () => ({
    getElementRect: (selector: string) => getElementRectMock(selector),
}));

const reducedMotionRef = { value: false };
vi.mock('@gemduel/ui/components/animation', () => ({
    usePrefersReducedMotion: () => reducedMotionRef.value,
}));

describe('MarketRefillMotion', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const slot: MarketRefillPresentationEvent['slots'][number] = {
        level: 2,
        index: 0,
        previousCardId: 'old-market-card',
        nextCardId: 'new-market-card',
        nextCard: createCard('new-market-card', 2),
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        reducedMotionRef.value = false;
        getElementRectMock.mockImplementation(defaultGetElementRect);
    });

    it('renders reduced-motion market refill frame', async () => {
        reducedMotionRef.value = true;
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<MarketRefillMotion slot={slot} theme="dark" />);
        });

        expect(container.querySelector('[data-card-flight="market-refill"]')).toBeTruthy();
        expect(container.querySelector('[data-market-refill-slot="2-0"]')).toBeTruthy();
    });

    it('renders full-motion market refill frame', async () => {
        reducedMotionRef.value = false;
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<MarketRefillMotion slot={slot} theme="dark" />);
        });

        expect(container.querySelector('[data-card-flight="market-refill"]')).toBeTruthy();
    });

    it('uses target rect when deck source rect is missing', async () => {
        reducedMotionRef.value = false;
        getElementRectMock.mockImplementation((selector: string) => {
            if (selector.includes('data-market-deck')) {
                return null;
            }
            if (selector.includes('data-market-slot')) {
                return mockRect(400, 300, 140, 180);
            }
            return null;
        });

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<MarketRefillMotion slot={slot} theme="dark" previewMode="slow" />);
        });

        expect(container.querySelector('[data-card-flight="market-refill"]')).toBeTruthy();
    });
});
