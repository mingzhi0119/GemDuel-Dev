import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { GameConfigMenu } from '../GameConfigMenu';
import { LocaleProvider } from '../../i18n/LocaleProvider';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const defaultMenuProps = {
    setupRoute: 'none' as const,
    onSelectSetup: vi.fn(),
    onBackToModeSelection: vi.fn(),
    onOnlineSetup: vi.fn(),
    onLanSetup: vi.fn(),
    onStartGame: vi.fn(),
    theme: 'dark',
};

describe('GameConfigMenu', () => {
    it('shows the start-page language switch and bilingual online entry points', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={vi.fn()}>
                <GameConfigMenu {...defaultMenuProps} />
            </LocaleProvider>
        );

        expect(html).toContain('Online Duel');
        expect(html).toContain('LAN Duel');
        expect(html).toContain('Auto Match Nearby');
        expect(html).toContain('English');
        expect(html).toContain('中文');
    });

    it('renders the Chinese title in zh mode', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={vi.fn()}>
                <GameConfigMenu {...defaultMenuProps} />
            </LocaleProvider>
        );

        expect(html).toContain('宝石：对决');
        expect(html).toContain('局域网对决');
    });

    it('opens the visible visual lab launcher options', async () => {
        const onOpenVisualLab = vi.fn();
        const container = document.createElement('div');
        let root: Root | null = null;

        document.body.appendChild(container);
        await act(async () => {
            root = createRoot(container);
            root.render(
                <LocaleProvider locale="en" setLocale={vi.fn()}>
                    <GameConfigMenu {...defaultMenuProps} onOpenVisualLab={onOpenVisualLab} />
                </LocaleProvider>
            );
        });

        const launcher = container.querySelector<HTMLButtonElement>(
            'button[aria-label="Open Visual Lab"]'
        );
        expect(launcher).not.toBeNull();
        expect(launcher?.textContent).toContain('Visual Lab');
        expect(launcher?.textContent).toContain('Surfaces / Motion / Readability');

        await act(async () => {
            launcher?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        const buttons = Array.from(container.querySelectorAll('button'));
        const surfaces = buttons.find((button) => button.textContent === 'Surfaces');
        const motion = buttons.find((button) => button.textContent === 'Motion');
        const readability = buttons.find((button) => button.textContent === 'Readability');

        await act(async () => {
            surfaces?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            motion?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            readability?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(onOpenVisualLab).toHaveBeenNthCalledWith(1, 'surfaces');
        expect(onOpenVisualLab).toHaveBeenNthCalledWith(2, 'motion');
        expect(onOpenVisualLab).toHaveBeenNthCalledWith(3, 'readability');

        act(() => {
            root?.unmount();
        });
        container.remove();
    });

    it('uses controlled setup route for opponent selection and back navigation', async () => {
        const onBackToModeSelection = vi.fn();
        const onStartGame = vi.fn();
        const container = document.createElement('div');
        let root: Root | null = null;

        document.body.appendChild(container);
        await act(async () => {
            root = createRoot(container);
            root.render(
                <LocaleProvider locale="en" setLocale={vi.fn()}>
                    <GameConfigMenu
                        {...defaultMenuProps}
                        setupRoute="classic"
                        onBackToModeSelection={onBackToModeSelection}
                        onStartGame={onStartGame}
                    />
                </LocaleProvider>
            );
        });

        expect(container.textContent).toContain('Select Opponent');
        expect(container.textContent).toContain('Classic Mode');

        const localPvp = Array.from(container.querySelectorAll('button')).find((button) =>
            button.textContent?.includes('Local PvP')
        );
        const back = Array.from(container.querySelectorAll('button')).find((button) =>
            button.textContent?.includes('Back to Mode Selection')
        );

        await act(async () => {
            localPvp?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            back?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(onStartGame).toHaveBeenCalledWith('LOCAL_PVP', { useBuffs: false });
        expect(onBackToModeSelection).toHaveBeenCalledTimes(1);

        act(() => {
            root?.unmount();
        });
        container.remove();
    });
});
