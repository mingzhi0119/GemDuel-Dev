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

const ChromeHarness = ({ theme = 'dark' }: { theme?: 'dark' }) => {
    const [locale, setLocale] = useState<'en' | 'zh'>('en');
    const [surfaceTheme, setSurfaceTheme] = useState<SurfaceThemeSelections>(
        DEFAULT_SURFACE_THEME_SELECTIONS
    );
    const [soundEnabled, setSoundEnabled] = useState(true);

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
                onAddCrowns={vi.fn()}
                onAddPoints={vi.fn()}
                onAddPrivilege={vi.fn()}
                onForceRoyal={vi.fn()}
                showDebugPanels={false}
                surfaceTheme={surfaceTheme}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled((current) => !current)}
                onSelectSurfaceTheme={(variant: SurfaceThemeVariant) =>
                    setSurfaceTheme({
                        background: variant,
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

    it('renders enlarged blurred top-right chrome actions', async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<ChromeHarness />);
            await Promise.resolve();
        });

        const rulebookButton = container.querySelector<HTMLButtonElement>(
            'button[data-app-rulebook-button="true"]'
        );
        const restartButton = container.querySelector<HTMLButtonElement>(
            'button[data-app-restart-button="true"]'
        );
        const settingsButton = container.querySelector<HTMLButtonElement>(
            'button[aria-label="Settings"]'
        );

        for (const button of [rulebookButton, restartButton, settingsButton]) {
            expect(button).not.toBeNull();
            expect(button?.className).toContain('h-[84px]');
            expect(button?.className).toContain('w-[84px]');
            expect(button?.className).toContain('lg:h-24');
            expect(button?.className).toContain('lg:w-24');
            expect(button?.className).toContain('backdrop-blur-md');
            expect(button?.className).toContain('before:-inset-2');
            expect(button?.className).toContain('before:backdrop-blur-lg');
        }

        expect(
            container.querySelector<HTMLElement>('[data-game-glyph="rulebook"]')?.style.width
        ).toBe('45px');
        expect(
            container.querySelector<HTMLElement>('[data-game-glyph="restart"]')?.style.width
        ).toBe('45px');
        expect(
            container.querySelector<HTMLElement>('[data-game-glyph="settings"]')?.style.width
        ).toBe('48px');
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
                        onAddCrowns={vi.fn()}
                        onAddPoints={vi.fn()}
                        onAddPrivilege={vi.fn()}
                        onForceRoyal={vi.fn()}
                        showDebugPanels={false}
                        soundEnabled={true}
                        onToggleSound={vi.fn()}
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
        expect(restartButton?.querySelector('[data-game-glyph="restart"]')).not.toBeNull();
        expect(restartTooltip?.textContent).toBe('Restart');
        expect(restartTooltip?.dataset.tooltipSize).toBe('standard-label');

        await act(async () => {
            restartButton?.click();
            await Promise.resolve();
        });

        expect(onRequestRestart).toHaveBeenCalledTimes(1);
    });

    it('toggles sound feedback from the settings menu', async () => {
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

        const soundToggle = container.querySelector<HTMLButtonElement>(
            'button[data-app-sound-toggle="true"]'
        );

        expect(soundToggle?.textContent).toContain('Sound');
        expect(soundToggle?.getAttribute('aria-pressed')).toBe('true');
        expect(soundToggle?.getAttribute('aria-label')).toBe('Disable sound');

        await act(async () => {
            soundToggle?.click();
            await Promise.resolve();
        });

        const disabledSoundToggle = container.querySelector<HTMLButtonElement>(
            'button[data-app-sound-toggle="true"]'
        );
        expect(disabledSoundToggle?.getAttribute('aria-pressed')).toBe('false');
        expect(disabledSoundToggle?.getAttribute('aria-label')).toBe('Enable sound');
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
        expect(settingsMenu?.textContent).toContain('Royal Luxury');
        expect(settingsMenu?.textContent).not.toContain('Aspect Ratio');
        expect(settingsMenu?.textContent).not.toContain('16:10');
        expect(settingsMenu?.textContent).not.toContain('16:9');
        expect(settingsMenu?.textContent).not.toContain('Dark');
        expect(settingsMenu?.textContent).not.toContain('Light');
        expect(settingsMenu?.textContent).not.toContain('Crystal Anime');
        expect(settingsMenu?.textContent).not.toContain('Dark Arcane');
        expect(settingsMenu?.textContent).not.toContain('Clean Boardgame');
        expect(settingsMenu?.textContent).not.toContain('Pearl Opaline');
        expect(settingsMenu?.textContent).not.toContain('Surface Theme');
        expect(settingsMenu?.textContent).not.toContain('Market Background');
        expect(settingsMenu?.textContent).not.toContain('Player Zone');
        expect(settingsMenu?.className).toContain('w-[248px]');
        expect(container.querySelector('[data-game-glyph="rulebook"]')).not.toBeNull();
        expect(container.querySelector('[data-game-glyph="settings"]')).not.toBeNull();
        expect(settingsMenu?.querySelector('[data-game-glyph="monitor"]')).toBeNull();
        expect(settingsMenu?.querySelector('[data-game-glyph="save"]')).not.toBeNull();
        expect(settingsMenu?.querySelector('[data-game-glyph="load"]')).not.toBeNull();

        const surfaceThemeSelect = container.querySelector<HTMLButtonElement>(
            'button[data-app-surface-theme-select="true"]'
        );

        expect(surfaceThemeSelect?.dataset.appSurfaceThemeValue).toBe('royal-luxury');

        expect(container.querySelector('button[data-desktop-aspect-ratio-option]')).toBeNull();

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
        expect(surfaceThemeDropdown?.textContent).toContain('Pearl Opaline');
        expect(surfaceThemeDropdown?.textContent).toContain('Lotus Porcelain');

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
});
