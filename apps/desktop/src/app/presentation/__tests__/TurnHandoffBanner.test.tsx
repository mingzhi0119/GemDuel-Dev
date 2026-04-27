// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { TurnHandoffBanner } from '../TurnHandoffBanner';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('TurnHandoffBanner', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        document
            .querySelectorAll('[data-topbar-turn-core="true"]')
            .forEach((node) => node.remove());
        root = null;
        container = null;
    });

    it('renders the anchored Framer Motion handoff banner with from/to metadata', async () => {
        const anchor = document.createElement('div');
        anchor.dataset.topbarTurnCore = 'true';
        anchor.getBoundingClientRect = () =>
            ({
                left: 420,
                top: 24,
                width: 360,
                height: 52,
                right: 780,
                bottom: 76,
                x: 420,
                y: 24,
                toJSON: () => ({}),
            }) as DOMRect;
        document.body.appendChild(anchor);
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <TurnHandoffBanner
                    event={{
                        id: 'turn-handoff:test',
                        type: 'turn-handoff',
                        fromPlayer: 'p1',
                        toPlayer: 'p2',
                        createdAtIndex: 12,
                    }}
                />
            );
            await Promise.resolve();
        });

        const banner = container.querySelector<HTMLElement>('[data-turn-handoff-banner="p2"]');

        expect(container.querySelector('[data-turn-handoff-overlay="true"]')).toBeNull();
        expect(banner?.dataset.turnHandoffPosition).toBe('topbar');
        expect(banner?.dataset.turnHandoffFrom).toBe('p1');
        expect(banner?.dataset.turnHandoffTo).toBe('p2');
        expect(banner?.style.left).toBe('600px');
        expect(banner?.style.top).toBe('86px');
        expect(container.querySelector('[data-turn-handoff-gaussian-halo="true"]')).not.toBeNull();
        expect(container.textContent).toContain('P1');
        expect(container.textContent).toContain('P2 Turn');
        anchor.remove();
    });
});
