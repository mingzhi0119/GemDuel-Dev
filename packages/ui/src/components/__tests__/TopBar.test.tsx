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

describe('TopBar buff placement', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderTopBar = async (props: Partial<React.ComponentProps<typeof TopBar>> = {}) => {
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
                        desktopTypography
                        {...props}
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

    it('does not render player buff text or tooltip slots in the top bar', async () => {
        await renderTopBar();

        expect(container?.querySelector('[data-topbar-buff-slot]')).toBeNull();
        expect(container?.querySelector('[data-buff-trigger="intelligence"]')).toBeNull();
        expect(container?.textContent).not.toContain('Intelligence');
    });

    it('keeps crown goal text on the gold crown color channel', async () => {
        await renderTopBar();

        const p1CrownGoal = container?.querySelector(
            '[data-topbar-crown-group="p1"] > span:last-child'
        ) as HTMLElement | null;
        const p2CrownGoal = container?.querySelector(
            '[data-topbar-crown-group="p2"] > span:last-child'
        ) as HTMLElement | null;

        expect(p1CrownGoal?.style.color).toBe('var(--gd-topbar-gold-text)');
        expect(p2CrownGoal?.style.color).toBe('var(--gd-topbar-gold-text)');
    });

    it('shows a persistent pointer under the active player using desktop-scale typography', async () => {
        await renderTopBar();

        const p1Pointer = container?.querySelector<HTMLElement>(
            '[data-topbar-active-turn-pointer="p1"]'
        );
        const p2Pointer = container?.querySelector<HTMLElement>(
            '[data-topbar-active-turn-pointer="p2"]'
        );
        const p1Label = container?.querySelector<HTMLElement>('[data-topbar-player-label="p1"]');
        const p2Label = container?.querySelector<HTMLElement>('[data-topbar-player-label="p2"]');

        expect(p1Pointer).not.toBeNull();
        expect(p2Pointer).toBeNull();
        expect(p1Pointer?.className).toContain('absolute');
        expect(p1Pointer?.className).toContain('h-[120px]');
        expect(p1Pointer?.className).toContain('w-[40px]');
        expect(p1Pointer?.style.clipPath).toBe('polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)');
        expect(p1Pointer?.style.animation).toContain('gemduel-topbar-pointer-rotate-y');
        expect(p1Pointer?.style.animation).toContain('linear');
        expect(p1Pointer?.style.animation).not.toContain('ease-in-out');
        expect(p1Pointer?.style.background).toContain('conic-gradient');
        expect(p1Pointer?.style.background).toContain('#facc15');
        expect(p1Pointer?.style.borderBottomColor).toBe('');
        expect(p1Label?.className).toContain('text-[56px]');
        expect(p1Label?.className).not.toContain('lg:text-[42px]');
        expect(p1Label?.dataset.topbarActivePlayerLabel).toBe('p1');
        expect(p1Label?.style.animation).toContain('gemduel-topbar-active-player-breathe');
        expect(p2Label?.dataset.topbarActivePlayerLabel).toBeUndefined();
        expect(p2Label?.style.animation).toBe('');
    });

    it('can suppress the legacy CSS pointer while keeping the active player anchor', async () => {
        await renderTopBar({ renderTurnPointer: false });

        const activePointer = container?.querySelector('[data-topbar-active-turn-pointer]');
        const p1Label = container?.querySelector<HTMLElement>('[data-topbar-player-label="p1"]');

        expect(activePointer).toBeNull();
        expect(p1Label?.dataset.topbarActivePlayerLabel).toBe('p1');
        expect(p1Label?.style.animation).toContain('gemduel-topbar-active-player-breathe');
    });
});
