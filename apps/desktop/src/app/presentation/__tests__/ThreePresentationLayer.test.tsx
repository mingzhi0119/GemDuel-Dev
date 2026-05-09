// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { ThreePresentationLayer, type ThreeLayerStatus } from '../ThreePresentationLayer';
import { collectBoardGemAnchors } from '../threeBoardGemAnchors';

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

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
    act(() => {
        root?.unmount();
    });
    container?.remove();
    root = null;
    container = null;
});

describe('ThreePresentationLayer board anchors', () => {
    it('collects board gem state from DOM anchors and skips empty cells', () => {
        const host = document.createElement('div');
        const red = document.createElement('div');
        red.dataset.boardCell = '1-2';
        red.dataset.boardRow = '1';
        red.dataset.boardCol = '2';
        red.dataset.boardGemColor = 'red';
        red.dataset.boardGemUid = 'red-uid';
        red.dataset.boardGemSelected = 'true';
        red.dataset.boardGemSelectionIndex = '2';
        red.dataset.boardGemTarget = 'false';
        red.dataset.boardGemReserveSelected = 'false';
        red.dataset.boardGemDimmed = 'true';
        red.dataset.boardGemInteractive = 'false';
        red.getBoundingClientRect = () => mockRect(40, 60, 64, 64);

        const empty = document.createElement('div');
        empty.dataset.boardCell = '0-0';
        empty.dataset.boardGemColor = 'empty';
        empty.getBoundingClientRect = () => mockRect(0, 0, 64, 64);

        host.append(red, empty);

        expect(collectBoardGemAnchors(host)).toEqual([
            expect.objectContaining({
                key: '1-2',
                row: 1,
                col: 2,
                uid: 'red-uid',
                color: 'red',
                selected: true,
                selectionIndex: 2,
                dimmed: true,
                interactive: false,
            }),
        ]);
    });

    it('reports a visible fallback status when WebGL cannot initialize', async () => {
        const statuses: ThreeLayerStatus[] = [];
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <div>
                    <ThreePresentationLayer
                        activePlayer="p1"
                        renderGemBoard
                        onStatusChange={(status) => statuses.push(status)}
                    />
                </div>
            );
            await Promise.resolve();
        });
        await act(async () => {
            await Promise.resolve();
        });

        expect(statuses).toContain('webgl-unavailable');
        expect(
            container.querySelector('[data-three-presentation-layer-status="webgl-unavailable"]')
        ).not.toBeNull();
        expect(
            container
                .querySelector('[data-three-presentation-layer]')
                ?.getAttribute('data-three-board-gem-texture-source')
        ).toBe('existing-gem-assets');
    });
});
