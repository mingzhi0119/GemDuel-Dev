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

    it('does not render player buff text or tooltip slots in the top bar', async () => {
        await renderTopBar();

        expect(container?.querySelector('[data-topbar-buff-slot]')).toBeNull();
        expect(container?.querySelector('[data-buff-trigger="intelligence"]')).toBeNull();
        expect(container?.textContent).not.toContain('Intelligence');
    });
});
