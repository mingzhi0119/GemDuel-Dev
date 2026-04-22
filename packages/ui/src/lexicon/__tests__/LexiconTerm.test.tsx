// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { LexiconTerm } from '../LexiconTerm';
import { LexiconText } from '../LexiconText';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('Lexicon UI', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderWithLocale = async (element: React.ReactElement, locale: 'en' | 'zh' = 'en') => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale={locale} setLocale={vi.fn()}>
                    {element}
                </LocaleProvider>
            );
            await Promise.resolve();
        });
    };

    const getButtons = () => Array.from(container?.querySelectorAll('button') ?? []);
    const getPopover = () => document.querySelector('[role="dialog"]') as HTMLDivElement | null;

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        document.querySelector('[role="dialog"]')?.remove();
    });

    it('renders an underlined button and opens the popover on hover by default', async () => {
        await renderWithLocale(<LexiconTerm termId="bonus" />);

        const button = getButtons()[0];
        expect(button?.getAttribute('type')).toBe('button');
        expect(button?.getAttribute('aria-haspopup')).toBe('dialog');
        expect(button?.className).toContain('underline');
        expect(button?.textContent).toBe('Bonus');

        await act(async () => {
            button?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await Promise.resolve();
        });

        const popover = getPopover();
        expect(button?.getAttribute('aria-expanded')).toBe('true');
        expect(popover?.textContent).toContain('Bonus');
        expect(popover?.textContent).toContain('permanent discount');

        await act(async () => {
            button?.dispatchEvent(
                new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body })
            );
            await Promise.resolve();
        });

        expect(getPopover()).toBeNull();
        expect(button?.getAttribute('aria-expanded')).toBe('false');
    });

    it('keeps click-to-open behavior available for rulebook-style usage', async () => {
        await renderWithLocale(<LexiconTerm termId="bonus" interaction="click" />);

        const button = getButtons()[0];

        await act(async () => {
            button?.click();
            await Promise.resolve();
        });

        const popover = getPopover();
        expect(button?.getAttribute('aria-expanded')).toBe('true');
        expect(popover?.textContent).toContain('permanent discount');
        expect(document.activeElement).toBe(popover);

        await act(async () => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            await Promise.resolve();
        });

        expect(getPopover()).toBeNull();
        expect(button?.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(button);
    });

    it('segments long text into hoverable terms and keeps only one popover open', async () => {
        await renderWithLocale(<LexiconText text="Royal Card and Bonus Gem improve your Bonus." />);

        const [royalCardButton, bonusGemButton, bonusButton] = getButtons();
        expect(royalCardButton?.textContent).toBe('Royal Card');
        expect(bonusGemButton?.textContent).toBe('Bonus Gem');
        expect(bonusButton?.textContent).toBe('Bonus');

        await act(async () => {
            royalCardButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await Promise.resolve();
        });

        expect(getPopover()?.textContent).toContain('Royal Card');

        await act(async () => {
            bonusGemButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await Promise.resolve();
        });

        expect(royalCardButton?.getAttribute('aria-expanded')).toBe('false');
        expect(bonusGemButton?.getAttribute('aria-expanded')).toBe('true');
        expect(getPopover()?.textContent).toContain('Bonus Gem');

        await act(async () => {
            document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
            await Promise.resolve();
        });

        expect(getPopover()).toBeNull();
        expect(bonusGemButton?.getAttribute('aria-expanded')).toBe('false');
    });
});
