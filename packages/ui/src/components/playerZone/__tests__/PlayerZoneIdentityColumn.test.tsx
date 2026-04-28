// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BUFFS } from '@gemduel/shared/constants';
import type { Buff } from '@gemduel/shared/types';
import { LocaleProvider } from '../../../i18n/LocaleProvider';
import { PlayerZoneIdentityColumn } from '../PlayerZoneIdentityColumn';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const renderColumn = async (
    buff: Buff,
    overrides: Partial<React.ComponentProps<typeof PlayerZoneIdentityColumn>> = {}
) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
        root.render(
            <LocaleProvider locale="en" setLocale={vi.fn()}>
                <PlayerZoneIdentityColumn
                    player="p1"
                    privileges={0}
                    extraPrivileges={0}
                    buff={buff}
                    isActive={true}
                    phase="IDLE"
                    isPrivilegeMode={false}
                    theme="dark"
                    onUsePrivilege={vi.fn()}
                    {...overrides}
                />
            </LocaleProvider>
        );
        await Promise.resolve();
    });

    return { container, root };
};

describe('PlayerZoneIdentityColumn echo reservoir memory', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        document.querySelectorAll('[data-player-buff-tooltip]').forEach((element) => {
            element.remove();
        });
        vi.useRealTimers();
        root = null;
        container = null;
    });

    it('shows the stored echoed ability above the player emblem', async () => {
        const rendered = await renderColumn({
            ...BUFFS.ECHO_RESERVOIR,
            state: {
                echoReservoirStoredAbilities: ['steal'],
            },
        } as Buff);
        container = rendered.container;
        root = rendered.root;

        const memory = container?.querySelector(
            '[data-echo-reservoir-memory="p1"]'
        ) as HTMLDivElement | null;

        expect(memory).not.toBeNull();
        expect(memory?.dataset.echoReservoirMemoryDetail).toBe('Steal');
        expect(memory?.textContent).toContain('Steal');
    });

    it('includes the remembered bonus-gem color in the memory label', async () => {
        const rendered = await renderColumn({
            ...BUFFS.ECHO_RESERVOIR,
            state: {
                echoReservoirStoredAbilities: ['bonus_gem'],
                echoReservoirStoredBonusColor: 'red',
            },
        } as Buff);
        container = rendered.container;
        root = rendered.root;

        const memory = container?.querySelector(
            '[data-echo-reservoir-memory="p1"]'
        ) as HTMLDivElement | null;

        expect(memory?.dataset.echoReservoirMemoryDetail).toBe('Bonus Gem (Red)');
    });

    it('renders the active buff as the player avatar and keeps the tooltip interactive', async () => {
        vi.useFakeTimers();
        const rendered = await renderColumn(BUFFS.INTELLIGENCE as unknown as Buff);
        container = rendered.container;
        root = rendered.root;

        const trigger = container?.querySelector(
            '[data-player-buff-icon-trigger="intelligence"]'
        ) as HTMLButtonElement | null;
        const image = container?.querySelector(
            '[data-player-buff-icon-image="intelligence"]'
        ) as HTMLImageElement | null;

        expect(trigger).not.toBeNull();
        expect(image?.getAttribute('src')).toBe('/assets/rogue-buffs/rogue-buff-intelligence.png');
        expect(container?.querySelector('[data-player-avatar="p1"] img')).not.toBeNull();
        expect(container?.querySelector('[data-player-avatar-fallback]')).toBeNull();
        expect(trigger?.textContent).toBe('');
        expect(container?.textContent).not.toContain('Intelligence');

        await act(async () => {
            trigger?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await Promise.resolve();
        });

        const tooltip = document.body.querySelector(
            '[data-player-buff-tooltip="intelligence"]'
        ) as HTMLDivElement | null;

        expect(tooltip?.textContent).toContain('Intelligence');
        expect(tooltip?.dataset.tooltipSize).toBe('compact-panel');
        expect(tooltip?.className).toContain('text-sm');

        await act(async () => {
            trigger?.dispatchEvent(
                new MouseEvent('mouseout', { bubbles: true, relatedTarget: tooltip })
            );
            tooltip?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            vi.advanceTimersByTime(200);
            await Promise.resolve();
        });

        expect(
            document.body.querySelector('[data-player-buff-tooltip="intelligence"]')
        ).not.toBeNull();

        const keywordButton = Array.from(tooltip?.querySelectorAll('button') ?? []).find(
            (button) => button.textContent === 'Optional Action'
        ) as HTMLButtonElement | undefined;
        expect(keywordButton).toBeDefined();

        await act(async () => {
            keywordButton?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            keywordButton?.click();
            tooltip?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
            vi.advanceTimersByTime(200);
            await Promise.resolve();
        });

        expect(
            document.body.querySelector('[data-player-buff-tooltip="intelligence"]')
        ).not.toBeNull();

        await act(async () => {
            document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            await Promise.resolve();
        });

        expect(document.body.querySelector('[data-player-buff-tooltip="intelligence"]')).toBeNull();
    });

    it('does not render a buff icon for the none buff', async () => {
        const rendered = await renderColumn(BUFFS.NONE as unknown as Buff);
        container = rendered.container;
        root = rendered.root;

        expect(container?.querySelector('[data-player-buff-icon-trigger]')).toBeNull();
        expect(container?.querySelector('[data-player-avatar-fallback="shield"]')).not.toBeNull();
    });

    it('disables privilege scrolls outside the activate-privilege phase', async () => {
        const onUsePrivilege = vi.fn();
        const rendered = await renderColumn(BUFFS.NONE as unknown as Buff, {
            privileges: 1,
            phase: 'RESERVE_WAITING_GEM',
            onUsePrivilege,
        });
        container = rendered.container;
        root = rendered.root;

        const button = container?.querySelector('button') as HTMLButtonElement | null;
        expect(button?.disabled).toBe(true);
        button?.click();
        expect(onUsePrivilege).not.toHaveBeenCalled();
    });
});
