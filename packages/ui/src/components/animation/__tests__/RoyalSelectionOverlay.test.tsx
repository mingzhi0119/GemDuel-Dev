// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ROYAL_CARDS } from '@gemduel/shared/constants';
import { FEATURED_CARD_SAMPLE_SIZE, FEATURED_CARD_SIZE } from '../../Card';
import { LocaleProvider } from '../../../i18n/LocaleProvider';
import { RoyalSelectionOverlay } from '../RoyalSelectionOverlay';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('RoyalSelectionOverlay', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const setViewportSize = (width: number, height: number) => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: width,
        });
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            writable: true,
            value: height,
        });
    };

    const renderOverlay = async (onSelectRoyal = vi.fn(), royalDeck = ROYAL_CARDS) => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale="en" setLocale={vi.fn()}>
                    <RoyalSelectionOverlay
                        royalDeck={royalDeck}
                        player="p1"
                        theme="dark"
                        onSelectRoyal={onSelectRoyal}
                    />
                </LocaleProvider>
            );
            await Promise.resolve();
        });

        return onSelectRoyal;
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    const getCardButtonWidths = () =>
        Array.from(container?.querySelectorAll('[data-royal-selection-card]') ?? []).map(
            (cardButton) => parseFloat((cardButton as HTMLElement).style.width)
        );

    const cleanupCurrentOverlay = () => {
        act(() => {
            root?.unmount();
        });
        if (container) {
            container.remove();
        }
        root = null;
        container = null;
    };

    it('sizes royal cards from a four-card row within 90vw without a horizontal scroll container', async () => {
        setViewportSize(1200, 800);
        await renderOverlay();

        const row = container?.querySelector('[data-royal-selection-card-row="single"]');
        const cardArea = container?.querySelector('[data-royal-selection-card-area="true"]');
        const overlay = container?.querySelector('[data-royal-selection-overlay]');
        const cards = Array.from(container?.querySelectorAll('[data-royal-selection-card]') ?? []);
        const gapPx = parseFloat((row as HTMLElement | null)?.style.gap ?? '0');
        const rowWidthPx = cards.reduce(
            (total, cardButton) => total + parseFloat((cardButton as HTMLElement).style.width),
            gapPx * Math.max(0, cards.length - 1)
        );

        expect(row).not.toBeNull();
        expect(row?.className).toContain('flex-nowrap');
        expect(row?.className).not.toContain('w-max');
        expect(cardArea?.className).not.toContain('overflow-x-auto');
        expect(cardArea?.className).toContain('max-w-[90vw]');
        expect(overlay?.className).toContain('overflow-hidden');
        expect(overlay?.className).not.toContain('overflow-y-auto');
        expect(rowWidthPx).toBeLessThanOrEqual(1200 * 0.9);
        expect(cards).toHaveLength(ROYAL_CARDS.length);
        cards.forEach((cardButton) => {
            const button = cardButton as HTMLButtonElement;
            expect(parseFloat(button.style.width)).toBe(252);
            expect(parseFloat(button.style.height)).toBe(336);
            expect(parseFloat(button.style.width)).toBeLessThanOrEqual(
                FEATURED_CARD_SAMPLE_SIZE.width
            );
        });
    });

    it('keeps the same per-card size when fewer than four royal cards remain', async () => {
        setViewportSize(1200, 800);
        await renderOverlay(vi.fn(), ROYAL_CARDS);
        const fourCardWidth = getCardButtonWidths()[0];

        cleanupCurrentOverlay();

        await renderOverlay(vi.fn(), ROYAL_CARDS.slice(0, 3));
        expect(getCardButtonWidths()).toEqual([fourCardWidth, fourCardWidth, fourCardWidth]);

        cleanupCurrentOverlay();

        await renderOverlay(vi.fn(), ROYAL_CARDS.slice(0, 2));
        expect(getCardButtonWidths()).toEqual([fourCardWidth, fourCardWidth]);

        cleanupCurrentOverlay();

        await renderOverlay(vi.fn(), [ROYAL_CARDS[0]!]);
        expect(getCardButtonWidths()).toEqual([fourCardWidth]);
    });

    it('caps a single selection card at the original artwork sample size', async () => {
        setViewportSize(6000, 4000);
        await renderOverlay(vi.fn(), [ROYAL_CARDS[0]!]);

        const cardButton = container?.querySelector(
            '[data-royal-selection-card]'
        ) as HTMLButtonElement | null;

        expect(parseFloat(cardButton?.style.width ?? '0')).toBe(FEATURED_CARD_SAMPLE_SIZE.width);
        expect(parseFloat(cardButton?.style.height ?? '0')).toBe(FEATURED_CARD_SAMPLE_SIZE.height);
    });

    it('toggles into a board-info mode that hides selection cards until the return button is clicked', async () => {
        const onSelectRoyal = await renderOverlay();
        const viewBoardButton = container?.querySelector(
            '[data-royal-selection-view-toggle="board"]'
        ) as HTMLButtonElement | null;

        await act(async () => {
            viewBoardButton?.click();
            await Promise.resolve();
        });

        const shield = container?.querySelector('[data-royal-selection-input-shield="true"]');
        const returnButton = container?.querySelector(
            '[data-royal-selection-view-toggle="selection"]'
        ) as HTMLButtonElement | null;

        expect(
            container
                ?.querySelector('[data-royal-selection-overlay]')
                ?.getAttribute('data-royal-selection-mode')
        ).toBe('board-info');
        expect(container?.querySelectorAll('[data-royal-selection-card]')).toHaveLength(0);
        expect(shield).not.toBeNull();
        expect(returnButton?.textContent).toContain('Back to Royal Selection');

        await act(async () => {
            shield?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await Promise.resolve();
        });

        expect(onSelectRoyal).not.toHaveBeenCalled();
        expect(
            container
                ?.querySelector('[data-royal-selection-overlay]')
                ?.getAttribute('data-royal-selection-mode')
        ).toBe('board-info');

        await act(async () => {
            returnButton?.click();
            await Promise.resolve();
        });

        expect(
            container
                ?.querySelector('[data-royal-selection-overlay]')
                ?.getAttribute('data-royal-selection-mode')
        ).toBe('selection');
        expect(container?.querySelectorAll('[data-royal-selection-card]')).toHaveLength(
            ROYAL_CARDS.length
        );
    });

    it('calls onSelectRoyal with the selected card', async () => {
        const onSelectRoyal = await renderOverlay();
        const firstCardButton = container?.querySelector(
            `[data-royal-selection-card="${ROYAL_CARDS[0].id}"]`
        ) as HTMLButtonElement | null;

        await act(async () => {
            firstCardButton?.click();
            await Promise.resolve();
        });

        expect(onSelectRoyal).toHaveBeenCalledWith(ROYAL_CARDS[0]);
    });

    it('includes required dialog semantics', async () => {
        await renderOverlay();
        const dialog = container?.querySelector('[role="dialog"]');

        expect(dialog).not.toBeNull();
        expect(dialog?.getAttribute('aria-modal')).toBe('true');
        expect(dialog?.getAttribute('aria-labelledby')).toBe('royal-selection-title');
    });
});
