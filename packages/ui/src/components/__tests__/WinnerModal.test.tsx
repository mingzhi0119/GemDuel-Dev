import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { WinnerModal } from '../WinnerModal';

describe('WinnerModal', () => {
    it('renders the enlarged winner settlement treatment', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={vi.fn()}>
                <WinnerModal winner="p1" onReview={vi.fn()} />
            </LocaleProvider>
        );

        expect(html).toContain('width="160"');
        expect(html).toContain('height="160"');
        expect(html).toContain('text-8xl');
        expect(html).toContain('text-4xl');
        expect(html).toContain('px-12');
        expect(html).toContain('py-6');
        expect(html).toContain('width="40"');
        expect(html).toContain('text-[40px]');
        expect(html).toContain('P1 获胜！');
        expect(html).toContain('复盘棋盘');
        expect(html).toContain('再来一局');
    });
});
