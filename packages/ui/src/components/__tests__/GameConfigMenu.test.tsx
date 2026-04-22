import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GameConfigMenu } from '../GameConfigMenu';
import { LocaleProvider } from '../../i18n/LocaleProvider';

describe('GameConfigMenu', () => {
    it('shows the start-page language switch and bilingual online entry points', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={vi.fn()}>
                <GameConfigMenu
                    onOnlineSetup={vi.fn()}
                    onLanSetup={vi.fn()}
                    onStartGame={vi.fn()}
                    theme="dark"
                />
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
                <GameConfigMenu
                    onOnlineSetup={vi.fn()}
                    onLanSetup={vi.fn()}
                    onStartGame={vi.fn()}
                    theme="dark"
                />
            </LocaleProvider>
        );

        expect(html).toContain('宝石：对决');
        expect(html).toContain('局域网对决');
    });
});
