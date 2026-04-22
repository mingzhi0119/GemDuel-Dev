import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Rulebook } from '../Rulebook';

describe('Rulebook', () => {
    it('follows the global locale instead of rendering a local language toggle', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={vi.fn()}>
                <Rulebook onClose={vi.fn()} theme="dark" />
            </LocaleProvider>
        );

        expect(html).toContain('游戏说明书');
        expect(html).toContain('介绍');
        expect(html).not.toContain('Close Rules');
    });
});
