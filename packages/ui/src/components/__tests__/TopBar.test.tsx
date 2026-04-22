// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BUFFS } from '@gemduel/shared/constants';
import type { Buff } from '@gemduel/shared/types';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { TopBar } from '../TopBar';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('TopBar buff tooltip', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderTopBar = async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale="en" setLocale={vi.fn()}>
                    <TopBar
                        p1Score={3}
                        p1Crowns={1}
                        p2Score={2}
                        p2Crowns={0}
                        playerTurnCounts={{ p1: 1, p2: 1 }}
                        activePlayer="p1"
                        theme="dark"
                        playerBuffs={{
                            p1: BUFFS.INTELLIGENCE as unknown as Buff,
                            p2: BUFFS.NONE as unknown as Buff,
                        }}
                    />
                </LocaleProvider>
            );
            await Promise.resolve();
        });
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        document.querySelectorAll('[role="dialog"]').forEach((element) => {
            element.remove();
        });
        root = null;
        container = null;
    });

    it('keeps the buff tooltip interactive and closes it on outside click after pinning', async () => {
        await renderTopBar();

        const trigger = container?.querySelector(
            '[data-buff-trigger="intelligence"]'
        ) as HTMLButtonElement | null;
        expect(trigger).not.toBeNull();

        await act(async () => {
            trigger?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await Promise.resolve();
        });

        const tooltip = container?.querySelector(
            '[data-buff-tooltip="intelligence"]'
        ) as HTMLDivElement | null;
        expect(tooltip?.textContent).toContain('Optional Action');

        const optionalActionButton = Array.from(tooltip?.querySelectorAll('button') ?? []).find(
            (button) => button.textContent === 'Optional Action'
        ) as HTMLButtonElement | undefined;
        expect(optionalActionButton).toBeDefined();

        await act(async () => {
            optionalActionButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await Promise.resolve();
        });

        expect(container?.querySelector('[data-buff-tooltip="intelligence"]')).not.toBeNull();

        const lexiconPopover = Array.from(document.querySelectorAll('[role="dialog"]')).find(
            (element) => element.textContent?.includes('before your main action')
        );
        expect(lexiconPopover).toBeDefined();

        await act(async () => {
            trigger?.click();
            await Promise.resolve();
        });

        await act(async () => {
            document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            await Promise.resolve();
        });

        expect(container?.querySelector('[data-buff-tooltip="intelligence"]')).toBeNull();
        expect(
            Array.from(document.querySelectorAll('[role="dialog"]')).find((element) =>
                element.textContent?.includes('before your main action')
            )
        ).toBeUndefined();
    });
});
