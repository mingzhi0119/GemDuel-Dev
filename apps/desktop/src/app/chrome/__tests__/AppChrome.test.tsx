import React, { useState } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import { AppChrome } from '../AppChrome';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
    type SurfaceThemeSelections,
    type SurfaceThemeVariant,
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
                onSelectSurfaceTheme={(variant: SurfaceThemeVariant) =>
                    setSurfaceTheme({
                        background: variant,
                        topBar: variant,
                        playerZone: variant,
                        gemPanel: variant,
                        effects: 'anime',
                    })
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
        expect(restartButton?.style.color).toBe('var(--gd-chrome-icon)');
        expect(restartButton?.style.textShadow).toBe('var(--gd-chrome-text-shadow)');
        expect(restartTooltip?.textContent).toBe('Restart');
        expect(restartTooltip?.dataset.tooltipSize).toBe('standard-label');

        await act(async () => {
            restartButton?.click();
            await Promise.resolve();
        });

        expect(onRequestRestart).toHaveBeenCalledTimes(1);
    });

    it('shows shell actions and a surface theme dropdown inside the settings menu', async () => {
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
        expect(settingsMenu?.textContent).toContain('Crystal Anime');
        expect(settingsMenu?.textContent).not.toContain('Royal Luxury');
        expect(settingsMenu?.textContent).not.toContain('Dark Arcane');
        expect(settingsMenu?.textContent).not.toContain('Clean Boardgame');
        expect(settingsMenu?.textContent).not.toContain('Surface Theme');
        expect(settingsMenu?.textContent).not.toContain('Market Background');
        expect(settingsMenu?.textContent).not.toContain('Player Zone');
        expect(settingsMenu?.className).toContain('w-[248px]');

        const surfaceThemeSelect = container.querySelector<HTMLButtonElement>(
            'button[data-app-surface-theme-select="true"]'
        );

        expect(surfaceThemeSelect?.dataset.appSurfaceThemeValue).toBe('crystal-anime');

        await act(async () => {
            surfaceThemeSelect?.click();
            await Promise.resolve();
        });

        const surfaceThemeDropdown = container.querySelector<HTMLElement>(
            '[data-app-surface-theme-dropdown="true"]'
        );
        expect(surfaceThemeDropdown?.className).toContain('bg-slate-950');
        expect(surfaceThemeDropdown?.textContent).toContain('Crystal Anime');
        expect(surfaceThemeDropdown?.textContent).toContain('Royal Luxury');
        expect(surfaceThemeDropdown?.textContent).toContain('Dark Arcane');
        expect(surfaceThemeDropdown?.textContent).toContain('Clean Boardgame');

        const royalLuxuryOption = container.querySelector<HTMLButtonElement>(
            '[data-app-surface-theme-option="royal-luxury"]'
        );

        await act(async () => {
            royalLuxuryOption?.click();
            await Promise.resolve();
        });

        expect(
            container.querySelector<HTMLButtonElement>(
                'button[data-app-surface-theme-select="true"]'
            )?.dataset.appSurfaceThemeValue
        ).toBe('royal-luxury');
    });

    it('renders the light surface theme dropdown inside settings', async () => {
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

        const surfaceThemeSelect = container.querySelector<HTMLButtonElement>(
            'button[data-app-surface-theme-select="true"]'
        );

        await act(async () => {
            surfaceThemeSelect?.click();
            await Promise.resolve();
        });

        const cleanBoardgameOption = container.querySelector<HTMLButtonElement>(
            '[data-app-surface-theme-option="clean-boardgame"]'
        );

        await act(async () => {
            cleanBoardgameOption?.click();
            await Promise.resolve();
        });
        expect(
            container.querySelector<HTMLButtonElement>(
                'button[data-app-surface-theme-select="true"]'
            )?.dataset.appSurfaceThemeValue
        ).toBe('clean-boardgame');
    });
});
