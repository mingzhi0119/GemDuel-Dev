// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { ExtraTurnBanner, TurnHandoffBanner } from '../TurnHandoffBanner';

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
        document
            .querySelectorAll('[data-testid="desktop-stage-canvas"]')
            .forEach((node) => node.remove());
        document
            .querySelectorAll('[data-presentation-anchor="topbar"]')
            .forEach((node) => node.remove());
        root = null;
        container = null;
    });

    it('renders a compact handoff banner below the topbar with from/to metadata', async () => {
        const stage = document.createElement('div');
        stage.dataset.testid = 'desktop-stage-canvas';
        stage.getBoundingClientRect = () =>
            ({
                left: 120,
                top: 48,
                width: 960,
                height: 540,
                right: 1080,
                bottom: 588,
                x: 120,
                y: 48,
                toJSON: () => ({}),
            }) as DOMRect;
        document.body.appendChild(stage);
        const topBar = document.createElement('div');
        topBar.dataset.presentationAnchor = 'topbar';
        topBar.getBoundingClientRect = () =>
            ({
                left: 120,
                top: 48,
                width: 960,
                height: 72,
                right: 1080,
                bottom: 120,
                x: 120,
                y: 48,
                toJSON: () => ({}),
            }) as DOMRect;
        document.body.appendChild(topBar);
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
                    previewMode="slow"
                />
            );
            await Promise.resolve();
        });

        const banner = container.querySelector<HTMLElement>('[data-turn-handoff-banner="p2"]');
        const overlay = container.querySelector<HTMLElement>('[data-turn-handoff-overlay="true"]');

        expect(overlay).not.toBeNull();
        expect(overlay?.style.left).toBe('120px');
        expect(overlay?.style.top).toBe('48px');
        expect(overlay?.style.width).toBe('960px');
        expect(overlay?.style.height).toBe('540px');
        expect(overlay?.style.zIndex).toBe('1000');
        expect(overlay?.style.background).toBe('transparent');
        expect(banner?.dataset.turnHandoffPosition).toBe('topbar-under-center');
        expect(banner?.dataset.turnHandoffFrom).toBe('p1');
        expect(banner?.dataset.turnHandoffTo).toBe('p2');
        expect(banner?.style.left).toBe('600px');
        expect(banner?.style.top).toBe('122.16px');
        expect(banner?.style.width).toBe('268.8px');
        expect(banner?.style.zIndex).toBe('1001');
        expect(banner?.style.transform).toBe('translateX(-50%)');
        const halo = container.querySelector<HTMLElement>(
            '[data-turn-handoff-gaussian-halo="true"]'
        );
        expect(halo).not.toBeNull();
        expect(halo?.style.animation).not.toContain('infinite');
        expect(container.textContent).toContain('P1');
        expect(container.textContent).toContain('P2 Turn');
        stage.remove();
        topBar.remove();
    });

    it('renders extra turns with the same topbar-adjacent treatment', async () => {
        const stage = document.createElement('div');
        stage.dataset.testid = 'desktop-stage-canvas';
        stage.getBoundingClientRect = () =>
            ({
                left: 0,
                top: 0,
                width: 3840,
                height: 2160,
                right: 3840,
                bottom: 2160,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            }) as DOMRect;
        document.body.appendChild(stage);
        const topBar = document.createElement('div');
        topBar.dataset.presentationAnchor = 'topbar';
        topBar.getBoundingClientRect = () =>
            ({
                left: 0,
                top: 0,
                width: 3840,
                height: 120,
                right: 3840,
                bottom: 120,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            }) as DOMRect;
        document.body.appendChild(topBar);
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <ExtraTurnBanner
                    event={{
                        id: 'ability-callout:test:extra-turn',
                        type: 'ability-callout',
                        player: 'p1',
                        callout: 'extra-turn',
                        createdAtIndex: 13,
                    }}
                    previewMode="slow"
                />
            );
            await Promise.resolve();
        });

        const banner = container.querySelector<HTMLElement>('[data-extra-turn-banner="p1"]');

        expect(banner?.dataset.extraTurnPosition).toBe('topbar-under-center');
        expect(banner?.style.top).toBe('128.64px');
        expect(container.textContent).toContain('P1 Extra Turn');
        stage.remove();
        topBar.remove();
    });
});
