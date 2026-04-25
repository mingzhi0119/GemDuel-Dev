// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ComponentProps } from 'react';
import { DraftScreen } from '../DraftScreen';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { BUFFS } from '@gemduel/shared/constants';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('DraftScreen', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderDraftScreen = (overrides: Partial<ComponentProps<typeof DraftScreen>> = {}) =>
        renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={vi.fn()}>
                <DraftScreen
                    draftPool={[
                        BUFFS.PRIVILEGE_FAVOR.id,
                        BUFFS.INTELLIGENCE.id,
                        BUFFS.DEEP_POCKETS.id,
                    ]}
                    activeDraftLevel={1}
                    mode="LOCAL_PVP"
                    activePlayer="p1"
                    onSelectBuff={vi.fn()}
                    onReroll={vi.fn()}
                    theme="dark"
                    localPlayer="p1"
                    {...overrides}
                />
            </LocaleProvider>
        );

    const renderInteractiveDraftScreen = async (
        overrides: Partial<ComponentProps<typeof DraftScreen>> = {}
    ) => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale="en" setLocale={vi.fn()}>
                    <DraftScreen
                        draftPool={[
                            BUFFS.INTELLIGENCE.id,
                            BUFFS.PRIVILEGE_FAVOR.id,
                            BUFFS.DEEP_POCKETS.id,
                        ]}
                        activeDraftLevel={1}
                        mode="LOCAL_PVP"
                        activePlayer="p1"
                        onSelectBuff={vi.fn()}
                        onReroll={vi.fn()}
                        theme="dark"
                        localPlayer="p1"
                        {...overrides}
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
        root = null;
        container = null;
        document.querySelectorAll('[role="dialog"]').forEach((element) => element.remove());
    });

    it('shows reroll controls for offline local roguelike drafts', () => {
        const html = renderDraftScreen();

        expect(html).toContain('DRAFT CUSTOMIZE');
        expect(html).toContain('Refresh Pool');
        expect(html).toContain('L1');
        expect(html).toContain('L2');
        expect(html).toContain('L3');
    });

    it('keeps reroll controls visible for the local p2 asymmetric pick', () => {
        const html = renderDraftScreen({
            activePlayer: 'p2',
            p2DraftPool: [
                BUFFS.PRIVILEGE_FAVOR.id,
                BUFFS.GREED_KING.id,
                BUFFS.DOUBLE_AGENT.id,
                BUFFS.ECHO_RESERVOIR.id,
            ],
            activeDraftLevel: 3,
        });

        expect(html).toContain('DRAFT CUSTOMIZE');
        expect(html).toContain('Lvl 3');
    });

    it('shows reroll controls for the local player during solo roguelike drafts', () => {
        const html = renderDraftScreen({
            mode: 'PVE',
            localPlayer: 'p1',
            activePlayer: 'p1',
        });

        expect(html).toContain('DRAFT CUSTOMIZE');
        expect(html).toContain('Refresh Pool');
    });

    it('hides reroll controls during the AI draft turn in solo mode', () => {
        const html = renderDraftScreen({
            mode: 'PVE',
            localPlayer: 'p1',
            activePlayer: 'p2',
        });

        expect(html).not.toContain('DRAFT CUSTOMIZE');
        expect(html).not.toContain('Refresh Pool');
    });

    it('hides reroll controls for online drafts', () => {
        const html = renderDraftScreen({
            mode: 'ONLINE_MULTIPLAYER',
            localPlayer: 'p1',
        });

        expect(html).not.toContain('DRAFT CUSTOMIZE');
        expect(html).not.toContain('Refresh Pool');
    });

    it('opens lexicon popovers on hover without selecting the buff', async () => {
        const onSelectBuff = vi.fn();
        await renderInteractiveDraftScreen({
            onSelectBuff,
            draftPool: [BUFFS.INTELLIGENCE.id],
        });

        const card = container?.querySelector(
            '#buff-select-intelligence'
        ) as HTMLButtonElement | null;
        const optionalAction = Array.from(card?.querySelectorAll('span') ?? []).find(
            (element) => element.textContent === 'Optional Action'
        ) as HTMLSpanElement | undefined;

        expect(optionalAction).toBeDefined();

        await act(async () => {
            optionalAction?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await Promise.resolve();
        });

        expect(
            Array.from(document.querySelectorAll('[role="dialog"]')).find((element) =>
                element.textContent?.includes('before your main action')
            )
        ).toBeDefined();
        expect(onSelectBuff).not.toHaveBeenCalled();

        await act(async () => {
            card?.click();
            await Promise.resolve();
        });

        expect(onSelectBuff).toHaveBeenCalledWith(BUFFS.INTELLIGENCE.id);
    });
});
