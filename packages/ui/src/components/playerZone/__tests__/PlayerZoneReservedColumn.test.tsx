// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../../../i18n/LocaleProvider';
import { PlayerZoneReservedColumn } from '../PlayerZoneReservedColumn';
import type { Card } from '@gemduel/shared/types';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const card: Card = {
    id: 'private-reserved-card',
    level: 2,
    cost: {
        blue: 0,
        white: 0,
        green: 0,
        black: 0,
        red: 3,
        pearl: 0,
        gold: 0,
    },
    points: 4,
    bonusColor: 'red',
    ability: 'steal',
    crowns: 1,
    uid: 'private-runtime-uid',
    image: 'private-image.png',
};

const renderColumn = async (
    overrides: Partial<React.ComponentProps<typeof PlayerZoneReservedColumn>> = {}
) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const onBuyReserved = vi.fn(() => true);
    const onDiscardReserved = vi.fn();

    await act(async () => {
        root.render(
            <LocaleProvider locale="en" setLocale={vi.fn()}>
                <PlayerZoneReservedColumn
                    player="p2"
                    reserved={[card]}
                    reservedRowRef={React.createRef<HTMLDivElement>()}
                    reservedCardScale={1}
                    canUseReservedActions={true}
                    hasPuppetMaster={true}
                    theme="dark"
                    onBuyReserved={onBuyReserved}
                    onDiscardReserved={onDiscardReserved}
                    {...overrides}
                />
            </LocaleProvider>
        );
        await Promise.resolve();
    });

    return { container, root, onBuyReserved, onDiscardReserved };
};

describe('PlayerZoneReservedColumn hidden reserved cards', () => {
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

    it('renders back-only reserved slots without exposing card identity or actions', async () => {
        const rendered = await renderColumn({ reservedVisibility: 'backs' });
        root = rendered.root;
        const testContainer = rendered.container;
        container = testContainer;

        const stack = testContainer.querySelector<HTMLElement>('[data-reserved-mini-stack="p2"]');
        const slot = testContainer.querySelector<HTMLElement>('[data-reserved-slot="p2-0"]');

        expect(stack?.dataset.reservedVisibility).toBe('backs');
        expect(slot?.dataset.cardId).toBeUndefined();
        expect(slot?.dataset.reservedHidden).toBe('true');
        expect(testContainer.querySelector('[data-reserved-card-back="true"]')).not.toBeNull();
        expect(testContainer.querySelector('[data-card-affordable]')).toBeNull();
        expect(testContainer.querySelector('button[title*="Discard"]')).toBeNull();

        const html = testContainer.innerHTML;
        expect(html).not.toContain('private-reserved-card');
        expect(html).not.toContain('private-runtime-uid');
        expect(html).not.toContain('private-image.png');
        expect(html).not.toContain('steal');

        await act(async () => {
            testContainer.querySelector<HTMLElement>('[data-reserved-card-back="true"]')?.click();
            await Promise.resolve();
        });

        expect(rendered.onBuyReserved).not.toHaveBeenCalled();
        expect(rendered.onDiscardReserved).not.toHaveBeenCalled();
        expect(document.body.querySelector('[data-card-preview-overlay]')).toBeNull();
    });
});
