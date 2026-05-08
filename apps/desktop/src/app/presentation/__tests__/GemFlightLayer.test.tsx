// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { GemFlightPresentationEvent, GemStealPresentationEvent } from '../presentationTypes';
import { GemFlightLayer } from '../GemFlightLayer';
import type { PresentationPreviewMode } from '../presentationPreviewMode';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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
    event: GemFlightPresentationEvent | GemStealPresentationEvent,
    container: HTMLDivElement,
    previewMode?: PresentationPreviewMode
) => {
    let root: Root | null = null;

    await act(async () => {
        root = createRoot(container);
        root.render(<GemFlightLayer event={event} theme="dark" previewMode={previewMode} />);
        await Promise.resolve();
    });

    return root;
};

describe('GemFlightLayer', () => {
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
            .querySelectorAll('[data-board-cell], [data-player-gem], [data-player-zone]')
            .forEach((node) => node.remove());
        window.requestAnimationFrame = originalRequestAnimationFrame;
        window.cancelAnimationFrame = originalCancelAnimationFrame;
        root = null;
        container = null;
    });

    it('anchors gem pickup clones to the viewport origin before applying viewport-coordinate transforms', async () => {
        addAnchor('data-board-cell', '2-2', mockRect(620, 280, 64, 64));
        addAnchor('data-player-gem', 'p1-blue', mockRect(360, 700, 34, 34));

        root = await renderLayer(
            {
                id: 'gem-flight:test',
                type: 'gem-flight',
                player: 'p1',
                deltas: { blue: 1 },
                sources: [{ row: 2, col: 2, color: 'blue' }],
                createdAtIndex: 1,
            },
            container!,
            'slow'
        );

        const flight = container!.querySelector<HTMLElement>('[data-gem-flight="blue"]');
        const anchors = container!.querySelectorAll<HTMLElement>('[data-gem-flight-anchor]');

        expect(flight).not.toBeNull();
        expect(flight?.style.left).toBe('0px');
        expect(flight?.style.top).toBe('0px');
        expect(flight?.style.zIndex).toBe('1001');
        expect(flight?.style.getPropertyValue('--start-x')).not.toBe('');
        expect(flight?.style.getPropertyValue('--end-x')).not.toBe('');
        expect(container!.querySelector('[data-gem-flight-label="P1 +blue"]')).not.toBeNull();
        expect(anchors.length).toBe(2);
        expect(Array.from(anchors).every((anchor) => anchor.style.zIndex === '1000')).toBe(true);
    });

    it('labels steal motion with the receiving player', async () => {
        addAnchor('data-player-gem', 'p1-red', mockRect(280, 700, 34, 34));
        addAnchor('data-player-gem', 'p2-red', mockRect(860, 700, 34, 34));

        root = await renderLayer(
            {
                id: 'gem-steal:test',
                type: 'gem-steal',
                fromPlayer: 'p1',
                toPlayer: 'p2',
                deltas: { red: 1 },
                createdAtIndex: 2,
            },
            container!
        );

        expect(container!.querySelector('[data-gem-flight="red"]')).not.toBeNull();
        expect(container!.querySelector('[data-gem-flight-label="P2 steals red"]')).not.toBeNull();
    });
});
