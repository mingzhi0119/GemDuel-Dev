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

const renderColumn = async (buff: Buff) => {
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
                    isPrivilegeMode={false}
                    theme="dark"
                    onUsePrivilege={vi.fn()}
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
});
