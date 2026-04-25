import React, { useState } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import { AppChrome } from '../AppChrome';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
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
                onSurfaceThemeChange={(slot, variant) =>
                    setSurfaceTheme((current) => ({ ...current, [slot]: variant }))
                }
                onResetSurfaceTheme={() => setSurfaceTheme(DEFAULT_SURFACE_THEME_SELECTIONS)}
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

        const settingsButton = Array.from(container.querySelectorAll('button')).find((button) =>
            button.textContent?.includes('Settings')
        );

        await act(async () => {
            settingsButton?.click();
            await Promise.resolve();
        });

        expect(container.textContent).toContain('English');
        expect(container.textContent).toContain('中文');
    });

    it('opens the surface theme menu and updates a slot selection', async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<ChromeHarness />);
            await Promise.resolve();
        });

        const themeButton = Array.from(container.querySelectorAll('button')).find((button) =>
            button.textContent?.includes('Theme')
        );

        await act(async () => {
            themeButton?.click();
            await Promise.resolve();
        });

        expect(container.textContent).toContain('Market Background');
        expect(container.textContent).toContain('Player Zone');

        const woodButtons = Array.from(container.querySelectorAll('button')).filter((button) =>
            button.textContent?.includes('Wood')
        );

        await act(async () => {
            woodButtons[0]?.click();
            await Promise.resolve();
        });

        expect(woodButtons[0]?.getAttribute('aria-pressed')).toBe('true');
    });

    it('renders light surface options and resets selected slots', async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<ChromeHarness theme="light" />);
            await Promise.resolve();
        });

        const themeButton = Array.from(container.querySelectorAll('button')).find((button) =>
            button.textContent?.includes('Theme')
        );

        await act(async () => {
            themeButton?.click();
            await Promise.resolve();
        });

        const royalButtons = Array.from(container.querySelectorAll('button')).filter((button) =>
            button.textContent?.includes('Royal')
        );
        await act(async () => {
            royalButtons[0]?.click();
            await Promise.resolve();
        });
        expect(royalButtons[0]?.getAttribute('aria-pressed')).toBe('true');

        const resetButton = Array.from(container.querySelectorAll('button')).find((button) =>
            button.textContent?.includes('Reset')
        );
        await act(async () => {
            resetButton?.click();
            await Promise.resolve();
        });
        expect(royalButtons[0]?.getAttribute('aria-pressed')).toBe('false');
    });
});
