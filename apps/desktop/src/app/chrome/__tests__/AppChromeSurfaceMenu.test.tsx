// @vitest-environment happy-dom

import React, { createRef } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import type { ThemeName } from '@gemduel/shared/types';
import { AppChromeSurfaceControls, AppChromeSurfaceMenu } from '../AppChromeSurfaceMenu';
import { DEFAULT_SURFACE_THEME_SELECTIONS } from '../../shell/surfaceTheme';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('AppChromeSurfaceMenu', () => {
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

    const renderWithLocale = (node: React.ReactElement) => {
        container = document.createElement('div');
        document.body.appendChild(container);
        act(() => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale="en" setLocale={vi.fn()}>
                    {node}
                </LocaleProvider>
            );
        });
    };

    it('renders open surface menu for dark and light themes', () => {
        const menuRef = createRef<HTMLDivElement>();
        const neutral = 'border border-white/10';
        const muted = 'text-white/70';

        renderWithLocale(
            <AppChromeSurfaceMenu
                theme="dark"
                isOpen
                menuRef={menuRef}
                sideButtonLabelClass="text-white"
                neutralButtonClass={neutral}
                neutralMutedButtonClass={muted}
                surfaceTheme={DEFAULT_SURFACE_THEME_SELECTIONS}
                onToggleOpen={vi.fn()}
            />
        );

        expect(container?.querySelector('.bg-slate-950\\/94')).toBeTruthy();

        act(() => {
            root?.unmount();
        });
        container?.remove();
        container = document.createElement('div');
        document.body.appendChild(container);
        act(() => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale="en" setLocale={vi.fn()}>
                    <AppChromeSurfaceMenu
                        theme={'light' as unknown as ThemeName}
                        isOpen
                        menuRef={menuRef}
                        sideButtonLabelClass="text-black"
                        neutralButtonClass={neutral}
                        neutralMutedButtonClass={muted}
                        surfaceTheme={DEFAULT_SURFACE_THEME_SELECTIONS}
                        onToggleOpen={vi.fn()}
                    />
                </LocaleProvider>
            );
        });

        expect(container?.querySelector('.bg-white\\/96')).toBeTruthy();
    });

    it('opens surface theme dropdown and closes on Escape', async () => {
        renderWithLocale(
            <AppChromeSurfaceControls
                theme="dark"
                neutralMutedButtonClass="text-slate-300"
                surfaceTheme={DEFAULT_SURFACE_THEME_SELECTIONS}
                onSelectSurfaceTheme={vi.fn()}
            />
        );

        const select = container?.querySelector<HTMLButtonElement>(
            '[data-app-surface-theme-select="true"]'
        );
        expect(select).toBeTruthy();

        await act(async () => {
            select?.click();
        });

        expect(container?.querySelector('[data-app-surface-theme-dropdown="true"]')).toBeTruthy();

        await act(async () => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        });

        expect(container?.querySelector('[data-app-surface-theme-dropdown="true"]')).toBeNull();
    });

    it('closes surface theme dropdown on outside pointer down', async () => {
        renderWithLocale(
            <AppChromeSurfaceControls
                theme="dark"
                neutralMutedButtonClass="text-slate-300"
                surfaceTheme={DEFAULT_SURFACE_THEME_SELECTIONS}
                onSelectSurfaceTheme={vi.fn()}
            />
        );

        const select = container?.querySelector<HTMLButtonElement>(
            '[data-app-surface-theme-select="true"]'
        );
        await act(async () => {
            select?.click();
        });

        expect(container?.querySelector('[data-app-surface-theme-dropdown="true"]')).toBeTruthy();

        await act(async () => {
            document.dispatchEvent(
                new PointerEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 5 })
            );
        });

        expect(container?.querySelector('[data-app-surface-theme-dropdown="true"]')).toBeNull();
    });

    it('uses light-theme listbox chrome when surface controls use light theme', async () => {
        renderWithLocale(
            <AppChromeSurfaceControls
                theme={'light' as unknown as ThemeName}
                neutralMutedButtonClass="text-stone-600"
                surfaceTheme={DEFAULT_SURFACE_THEME_SELECTIONS}
                onSelectSurfaceTheme={vi.fn()}
            />
        );

        const select = container?.querySelector<HTMLButtonElement>(
            '[data-app-surface-theme-select="true"]'
        );
        await act(async () => {
            select?.click();
        });

        expect(container?.querySelector('.border-stone-300.bg-white')).toBeTruthy();
    });
});
