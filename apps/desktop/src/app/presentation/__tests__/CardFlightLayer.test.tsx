// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Card } from '@gemduel/shared/types';
import type {
    CardAcquirePresentationEvent,
    CardReservePresentationEvent,
} from '../presentationTypes';
import { CardFlightLayer } from '../CardFlightLayer';
import type { PresentationPreviewMode } from '../presentationPreviewMode';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createCard = (id: string, level: 1 | 2 | 3 = 1): Card => ({
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

const addAnchor = (attribute: string, value: string, rect: DOMRect) => {
    const element = document.createElement('div');
    element.setAttribute(attribute, value);
    element.getBoundingClientRect = () => rect;
    document.body.appendChild(element);
    return element;
};

const renderLayer = async (
    event: CardAcquirePresentationEvent | CardReservePresentationEvent,
    container: HTMLDivElement,
    previewMode?: PresentationPreviewMode
) => {
    let root: Root | null = null;

    await act(async () => {
        root = createRoot(container);
        root.render(<CardFlightLayer event={event} theme="dark" previewMode={previewMode} />);
        await Promise.resolve();
    });

    return root;
};

describe('CardFlightLayer', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    const originalCancelAnimationFrame = window.cancelAnimationFrame;

    beforeEach(() => {
        window.requestAnimationFrame = (callback: FrameRequestCallback) => {
            callback(0);
            return 1;
        };
        window.cancelAnimationFrame = () => {};
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        document.body
            .querySelectorAll(
                '[data-market-slot], [data-market-deck], [data-tableau-stack], [data-reserved-row]'
            )
            .forEach((node) => node.remove());
        window.requestAnimationFrame = originalRequestAnimationFrame;
        window.cancelAnimationFrame = originalCancelAnimationFrame;
        root = null;
        container = null;
    });

    it('anchors market acquire clones to the viewport origin before applying viewport-coordinate transforms', async () => {
        const card = createCard('card-acquire-test');
        addAnchor('data-market-slot', '1-0', mockRect(200, 100, 100, 140));
        addAnchor('data-tableau-stack', 'p1-blue', mockRect(520, 420, 90, 120));

        root = await renderLayer(
            {
                id: 'card-acquire:test',
                type: 'card-acquire',
                player: 'p1',
                cardIds: [card.id],
                cards: [
                    {
                        cardId: card.id,
                        card,
                        bonusColor: 'blue',
                        source: { kind: 'market', level: 1, index: 0 },
                        targetIndex: 0,
                    },
                ],
                createdAtIndex: 1,
            },
            container!,
            'slow'
        );

        const flight = container!.querySelector<HTMLElement>('[data-card-flight="card-acquire"]');
        const anchors = container!.querySelectorAll<HTMLElement>('[data-card-flight-anchor]');

        expect(flight).not.toBeNull();
        expect(flight?.style.left).toBe('0px');
        expect(flight?.style.top).toBe('0px');
        expect(flight?.style.zIndex).toBe('1001');
        expect(flight?.style.getPropertyValue('--start-x')).not.toBe('');
        expect(flight?.style.getPropertyValue('--end-x')).not.toBe('');
        const label = container!.querySelector<HTMLElement>('[data-card-flight-label="P1 buys"]');
        expect(label).not.toBeNull();
        expect(label?.className).not.toContain('border');
        expect(label?.className).not.toContain('bg-');
        expect(container!.querySelector('.border-cyan-200\\/80')).toBeNull();
        expect(anchors.length).toBe(2);
        expect(Array.from(anchors).every((anchor) => anchor.style.zIndex === '1000')).toBe(true);
    });

    it('labels deck reserve flights and keeps the deck clone origin deterministic', async () => {
        const card = createCard('card-reserve-test', 2);
        addAnchor('data-market-deck', '2', mockRect(80, 90, 100, 140));
        addAnchor('data-reserved-row', 'p2', mockRect(700, 620, 220, 100));

        root = await renderLayer(
            {
                id: 'card-reserve:test',
                type: 'card-reserve',
                player: 'p2',
                cardIds: [card.id],
                cards: [
                    {
                        cardId: card.id,
                        card,
                        bonusColor: 'blue',
                        source: { kind: 'deck', level: 2 },
                        targetIndex: 0,
                    },
                ],
                createdAtIndex: 2,
            },
            container!
        );

        const flight = container!.querySelector<HTMLElement>('[data-card-reserve-source="deck"]');

        expect(flight).not.toBeNull();
        expect(flight?.style.left).toBe('0px');
        expect(flight?.style.top).toBe('0px');
        expect(
            container!.querySelector('[data-card-flight-label="P2 reserves from deck"]')
        ).not.toBeNull();
    });
});
