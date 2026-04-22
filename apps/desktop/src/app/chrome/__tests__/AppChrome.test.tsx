import React, { useState } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import { AppChrome } from '../AppChrome';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const ChromeHarness = () => {
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
                onRequestRestart={vi.fn()}
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
});
