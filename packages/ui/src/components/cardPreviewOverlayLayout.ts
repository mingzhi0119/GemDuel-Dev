import { useEffect, useState } from 'react';
import { getGemLabel } from '@gemduel/shared';
import type { Card as CardType, GemColor } from '@gemduel/shared/types';
import { FEATURED_CARD_SAMPLE_SIZE, FEATURED_CARD_SIZE } from './Card';

const CARD_ASPECT_RATIO = FEATURED_CARD_SAMPLE_SIZE.height / FEATURED_CARD_SAMPLE_SIZE.width;
const CARD_LAYOUT_COLUMNS = 4;
const CARD_LAYOUT_MAX_ROWS = 3;
const DESKTOP_CARD_GAP_PX = 24;
const MOBILE_CARD_GAP_PX = 12;
const CARD_ROW_VIEWPORT_RATIO = 0.9;
const MIN_CARD_WIDTH_PX = 72;
const DECK_PEEK_MAX_CARD_WIDTH_PX = 220;
const VERTICAL_CHROME_PX = 230;

export const CARD_LIMIT = CARD_LAYOUT_COLUMNS * CARD_LAYOUT_MAX_ROWS;
export const DECK_PEEK_COLUMNS = 3;
export const DECK_PEEK_LEVELS = [3, 2, 1] as const;
export const DECK_PEEK_ORDER_KEYS = [
    'deckPeek.order.first',
    'deckPeek.order.second',
    'deckPeek.order.third',
] as const;
export const GLOBAL_ACTION_BAND_BOTTOM = 'clamp(72px, 11vh, 150px)';
export const ACTION_BUTTON_BASE_CLASS =
    'rounded border border-amber-200/70 bg-amber-400 font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_10px_28px_rgba(251,191,36,0.26)] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:border-slate-500/50 disabled:bg-slate-700 disabled:text-slate-300 disabled:shadow-none';
export const GLOBAL_ACTION_BUTTON_CLASS = `${ACTION_BUTTON_BASE_CLASS} min-h-[52px] min-w-[156px] px-5 py-3 text-[15px] sm:min-h-[56px] sm:min-w-[184px] sm:px-8 sm:text-base`;
export const CARD_ACTION_BUTTON_CLASS = `${ACTION_BUTTON_BASE_CLASS} min-h-[46px] min-w-[132px] px-4 py-2.5 text-sm`;

interface ViewportSize {
    width: number;
    height: number;
}

const getViewportSize = (): ViewportSize => {
    if (typeof window === 'undefined') {
        return { width: 1280, height: 800 };
    }

    return {
        width: window.innerWidth || 1280,
        height: window.innerHeight || 800,
    };
};

export const useViewportSize = () => {
    const [viewportSize, setViewportSize] = useState(getViewportSize);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const updateViewportSize = () => setViewportSize(getViewportSize());
        window.addEventListener('resize', updateViewportSize);
        return () => window.removeEventListener('resize', updateViewportSize);
    }, []);

    return viewportSize;
};

export const getPreviewLayout = (cardCount: number, viewportSize: ViewportSize) => {
    const visibleCount = Math.max(1, Math.min(CARD_LIMIT, cardCount));
    const columns = Math.min(CARD_LAYOUT_COLUMNS, visibleCount);
    const rows = Math.min(CARD_LAYOUT_MAX_ROWS, Math.ceil(visibleCount / CARD_LAYOUT_COLUMNS));
    const gapPx = viewportSize.width < 768 ? MOBILE_CARD_GAP_PX : DESKTOP_CARD_GAP_PX;
    const maxRowWidth = viewportSize.width * CARD_ROW_VIEWPORT_RATIO;
    const widthByFourCardRow =
        (maxRowWidth - gapPx * (CARD_LAYOUT_COLUMNS - 1)) / CARD_LAYOUT_COLUMNS;
    const availableCardAreaHeight = Math.max(180, viewportSize.height - VERTICAL_CHROME_PX);
    const widthByRows =
        (availableCardAreaHeight - gapPx * Math.max(0, rows - 1)) / rows / CARD_ASPECT_RATIO;
    const width = Math.max(
        MIN_CARD_WIDTH_PX,
        Math.min(FEATURED_CARD_SAMPLE_SIZE.width, widthByFourCardRow, widthByRows)
    );

    return {
        columns,
        rows,
        gapPx,
        visibleCount,
        gridWidth: Math.round(width * columns + gapPx * Math.max(0, columns - 1)),
        gridHeight: Math.round(width * CARD_ASPECT_RATIO * rows + gapPx * Math.max(0, rows - 1)),
        scale: width / FEATURED_CARD_SIZE.width,
        width: Math.round(width),
        height: Math.round(width * CARD_ASPECT_RATIO),
    };
};

export const getDeckPeekLayout = (rowCount: number, viewportSize: ViewportSize) => {
    const rows = Math.max(1, rowCount);
    const isMobile = viewportSize.width < 768;
    const columnGapPx = isMobile ? 10 : 18;
    const rowGapPx = isMobile ? 12 : 20;
    const orderLabelHeightPx = isMobile ? 34 : 42;
    const topPx = Math.round(Math.max(108, Math.min(164, viewportSize.height * 0.13)));
    const bottomPx = isMobile ? 34 : 52;
    const maxRowWidth = viewportSize.width * (isMobile ? 0.94 : 0.9);
    const widthByColumns =
        (maxRowWidth - columnGapPx * DECK_PEEK_COLUMNS) / (DECK_PEEK_COLUMNS + 1);
    const availableHeight = Math.max(240, viewportSize.height - topPx - bottomPx);
    const widthByRows =
        (availableHeight - rowGapPx * Math.max(0, rows - 1) - orderLabelHeightPx) /
        rows /
        CARD_ASPECT_RATIO;
    const width = Math.max(
        MIN_CARD_WIDTH_PX,
        Math.min(DECK_PEEK_MAX_CARD_WIDTH_PX, widthByColumns, widthByRows)
    );
    const height = width * CARD_ASPECT_RATIO;

    return {
        columnGapPx,
        gridHeight: Math.round(height * rows + rowGapPx * rows + orderLabelHeightPx),
        gridWidth: Math.round(width * (DECK_PEEK_COLUMNS + 1) + columnGapPx * DECK_PEEK_COLUMNS),
        height: Math.round(height),
        levelLabelHeightPx: Math.round(height),
        levelLabelWidthPx: Math.round(width),
        orderLabelHeightPx,
        rowGapPx,
        scale: width / FEATURED_CARD_SIZE.width,
        titleBandHeightPx: Math.max(88, topPx - 18),
        topPx,
        width: Math.round(width),
    };
};

export type DeckPeekLayout = ReturnType<typeof getDeckPeekLayout>;
export type DeckPeekLevel = (typeof DECK_PEEK_LEVELS)[number];
export interface DeckPeekGroup {
    level: DeckPeekLevel;
    cards: CardType[];
}

export const getDeckPeekGroups = (cards: CardType[]): DeckPeekGroup[] =>
    DECK_PEEK_LEVELS.map((level) => ({
        level,
        cards: cards.filter((card) => card.level === level).slice(0, DECK_PEEK_COLUMNS),
    })).filter((group) => group.cards.length > 0);

export const formatColorLabel = (color: string, locale: 'en' | 'zh') => {
    try {
        return getGemLabel(color as GemColor, locale);
    } catch {
        return color;
    }
};
