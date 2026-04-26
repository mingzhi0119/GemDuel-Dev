import React, { useState } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import { AppChrome } from '../AppChrome';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
    getNextSurfaceThemeSelections,
    type SurfaceThemeSelections,
} from '../../shell/surfaceTheme';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const ChromeHarness = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
    const [locale, setLocale] = useState<'en' | 'zh'>('en');
    const [surfaceTheme, setSurfaceTheme] = useState<SurfaceThemeSelections>(
        DEFAULT_SURFACE_THEME_SELECTIONS
    );

    return (
        <LocaleProvider locale={locale} setLocale={setLocale}>
            <AppChrome
                theme={theme}
                showDebug={false}
                canShowDebug={true}
                onToggleDebug={vi.fn()}
                onDownloadReplay={vi.fn()}
                onUploadReplay={vi.fn()}
                onRequestRestart={vi.fn()}
                onShowRulebook={vi.fn()}
                onToggleTheme={vi.fn()}
                onAddCrowns={vi.fn()}
                onAddPoints={vi.fn()}
                onAddPrivilege={vi.fn()}
                onForceRoyal={vi.fn()}
                showDebugPanels={false}
                surfaceTheme={surfaceTheme}
                onCycleSurfaceTheme={() =>
                    setSurfaceTheme((current) => getNextSurfaceThemeSelections(current))
                }
            />
        </LocaleProvider>
    );
};

describe('AppChrome locale controls', () => {
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

    it('shows the English / 中文 switch inside the settings menu', async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<ChromeHarness />);
            await Promise.resolve();
        });

        const settingsButton = container.querySelector<HTMLButtonElement>(
            'button[aria-label="Settings"]'
        );

        await act(async () => {
            settingsButton?.click();
            await Promise.resolve();
        });

        expect(container.textContent).toContain('English');
        expect(container.textContent).toContain('中文');
    });

    it('uses the shared readable tooltip standard for the settings icon', async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<ChromeHarness />);
            await Promise.resolve();
        });

        const settingsButton = container.querySelector<HTMLButtonElement>(
            'button[aria-label="Settings"]'
        );
        const settingsTooltipId = settingsButton?.getAttribute('aria-describedby');
        const tooltip = settingsTooltipId
            ? container.querySelector<HTMLSpanElement>(`#${settingsTooltipId}`)
            : null;

        expect(settingsButton).not.toBeNull();
        expect(tooltip).not.toBeNull();
        expect(settingsButton?.getAttribute('aria-describedby')).toBe(tooltip?.id);
        expect(settingsButton?.hasAttribute('title')).toBe(false);
        expect(tooltip?.dataset.tooltipSize).toBe('standard-label');
        expect(tooltip?.className).toContain('text-[16px]');
        expect(tooltip?.className).toContain('px-4');
    });

    it('renders restart as a white icon action outside the settings menu', async () => {
        const onRequestRestart = vi.fn();
        const RestartHarness = () => {
            const [locale, setLocale] = useState<'en' | 'zh'>('en');

            return (
                <LocaleProvider locale={locale} setLocale={setLocale}>
                    <AppChrome
                        theme="dark"
                        showDebug={false}
                        canShowDebug={true}
                        onToggleDebug={vi.fn()}
                        onDownloadReplay={vi.fn()}
                        onUploadReplay={vi.fn()}
                        onRequestRestart={onRequestRestart}
                        onShowRulebook={vi.fn()}
                        onToggleTheme={vi.fn()}
                        onAddCrowns={vi.fn()}
                        onAddPoints={vi.fn()}
                        onAddPrivilege={vi.fn()}
                        onForceRoyal={vi.fn()}
                        showDebugPanels={false}
                    />
                </LocaleProvider>
            );
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<RestartHarness />);
            await Promise.resolve();
        });

        const restartButton = container.querySelector<HTMLButtonElement>(
            'button[data-app-restart-button="true"]'
        );
        const restartTooltipId = restartButton?.getAttribute('aria-describedby');
        const restartTooltip = restartTooltipId
            ? container.querySelector<HTMLSpanElement>(`#${restartTooltipId}`)
            : null;

        expect(restartButton?.getAttribute('aria-label')).toBe('Restart');
        expect(restartButton?.hasAttribute('title')).toBe(false);
        expect(restartButton?.className).toContain('text-slate-200');
        expect(restartTooltip?.textContent).toBe('Restart');
        expect(restartTooltip?.dataset.tooltipSize).toBe('standard-label');

        await act(async () => {
            restartButton?.click();
            await Promise.resolve();
        });

        expect(onRequestRestart).toHaveBeenCalledTimes(1);
    });

    it('shows shell actions and a single bundled surface theme control inside the settings menu', async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<ChromeHarness />);
            await Promise.resolve();
        });

        const settingsButton = container.querySelector<HTMLButtonElement>(
            'button[aria-label="Settings"]'
        );

        await act(async () => {
            settingsButton?.click();
            await Promise.resolve();
        });

        const settingsMenu = container.querySelector<HTMLElement>('[data-settings-menu="true"]');

        expect(settingsMenu?.textContent).not.toContain('Restart');
        expect(settingsMenu?.textContent).not.toContain('Rules');
        expect(settingsMenu?.textContent).toContain('Theme: Default');
        expect(settingsMenu?.textContent).not.toContain('Surface Theme');
        expect(settingsMenu?.textContent).not.toContain('Market Background');
        expect(settingsMenu?.textContent).not.toContain('Player Zone');
        expect(settingsMenu?.className).toContain('w-[216px]');

        const surfaceThemeButton = Array.from(container.querySelectorAll('button')).find((button) =>
            button.textContent?.includes('Theme: Default')
        );

        expect(surfaceThemeButton?.className).toContain('justify-start');

        await act(async () => {
            surfaceThemeButton?.click();
            await Promise.resolve();
        });

        expect(container.textContent).toContain('Theme: Wood');
    });

    it('renders the light surface theme cycle button inside settings', async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<ChromeHarness theme="light" />);
            await Promise.resolve();
        });

        const settingsButton = container.querySelector<HTMLButtonElement>(
            'button[aria-label="Settings"]'
        );

        await act(async () => {
            settingsButton?.click();
            await Promise.resolve();
        });

        const surfaceThemeButton = Array.from(container.querySelectorAll('button')).find((button) =>
            button.textContent?.includes('Theme: Default')
        );
        await act(async () => {
            surfaceThemeButton?.click();
            await Promise.resolve();
        });
        expect(container.textContent).toContain('Theme: Wood');
    });
});
