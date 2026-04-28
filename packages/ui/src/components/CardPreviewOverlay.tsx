import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getGemLabel, getPlayerDisplayName } from '@gemduel/shared';
import type { Card as CardType, GemColor, PlayerKey } from '@gemduel/shared/types';
import { useLocale, useT } from '../i18n/LocaleProvider';
import { Card, FEATURED_CARD_SAMPLE_SIZE, FEATURED_CARD_SIZE } from './Card';
import type { CardPreviewAction } from './cardPreviewActions';

const CARD_ASPECT_RATIO = FEATURED_CARD_SAMPLE_SIZE.height / FEATURED_CARD_SAMPLE_SIZE.width;
const CARD_LAYOUT_COLUMNS = 4;
const CARD_LAYOUT_MAX_ROWS = 3;
const CARD_LIMIT = CARD_LAYOUT_COLUMNS * CARD_LAYOUT_MAX_ROWS;
const DESKTOP_CARD_GAP_PX = 24;
const MOBILE_CARD_GAP_PX = 12;
const CARD_ROW_VIEWPORT_RATIO = 0.9;
const MIN_CARD_WIDTH_PX = 72;
const VERTICAL_CHROME_PX = 230;
const GLOBAL_ACTION_BAND_BOTTOM = 'clamp(72px, 11vh, 150px)';
const ACTION_BUTTON_CLASS =
    'min-w-[148px] rounded border border-amber-200/70 bg-amber-400 px-6 py-2 text-sm font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_10px_28px_rgba(251,191,36,0.26)] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:border-slate-500/50 disabled:bg-slate-700 disabled:text-slate-300 disabled:shadow-none';

type CardPreviewMode = 'single' | 'collection';

interface CardPreviewOverlayProps {
    isOpen: boolean;
    mode: CardPreviewMode;
    cards: CardType[];
    theme: 'light' | 'dark';
    onClose: () => void;
    title?: string;
    player?: PlayerKey;
    color?: string;
    previewContent?: ReactNode;
    actions?: CardPreviewAction[];
    cardActions?: CardPreviewAction[][];
}

const getViewportSize = () => {
    if (typeof window === 'undefined') {
        return { width: 1280, height: 800 };
    }

    return {
        width: window.innerWidth || 1280,
        height: window.innerHeight || 800,
    };
};

const useViewportSize = () => {
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

const getPreviewLayout = (cardCount: number, viewportSize: { width: number; height: number }) => {
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

const formatColorLabel = (color: string, locale: 'en' | 'zh') => {
    try {
        return getGemLabel(color as GemColor, locale);
    } catch {
        return color;
    }
};

export function CardPreviewOverlay({
    isOpen,
    mode,
    cards,
    theme,
    onClose,
    title,
    player,
    color,
    previewContent,
    actions = [],
    cardActions = [],
}: CardPreviewOverlayProps) {
    const { locale } = useLocale();
    const t = useT();
    const viewportSize = useViewportSize();
    const visibleCards = useMemo(() => cards.slice(0, CARD_LIMIT), [cards]);
    const visibleCardActions = useMemo(
        () => visibleCards.map((_, index) => cardActions[index] ?? []),
        [cardActions, visibleCards]
    );
    const hasCardActions = visibleCardActions.some((cardActionSet) => cardActionSet.length > 0);
    const layout = useMemo(
        () => getPreviewLayout(visibleCards.length, viewportSize),
        [visibleCards.length, viewportSize]
    );
    const collectionHeading =
        mode === 'collection' && player && color
            ? color === 'pure-royal'
                ? `${getPlayerDisplayName(player, locale)} - Extra Points`
                : `${getPlayerDisplayName(player, locale)} - ${t('labels.color')}: ${formatColorLabel(color, locale)}`
            : null;
    const heading = title ?? collectionHeading ?? 'Card Preview';

    useEffect(() => {
        if (!isOpen || typeof window === 'undefined') {
            return undefined;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const hasPreviewContent = Boolean(previewContent);
    const hasVisiblePreview = visibleCards.length > 0 || hasPreviewContent;
    const actionLayout = actions.length === 1 ? 'single' : actions.length > 1 ? 'pair' : 'none';
    const actionAlign = actions.length === 1 ? 'center' : 'split';
    const handleAction = (action: CardPreviewAction) => {
        if (action.disabled || !action.onAction) {
            return;
        }

        const result = action.onAction();
        if (result !== false) {
            onClose();
        }
    };

    if (!isOpen || !hasVisiblePreview) {
        return null;
    }

    const overlay = (
        <AnimatePresence>
            {isOpen && hasVisiblePreview && (
                <motion.div
                    key="card-preview-overlay"
                    data-card-preview-overlay="true"
                    data-card-preview-mode={mode}
                    data-card-preview-count={visibleCards.length}
                    data-card-preview-grid-columns={layout.columns}
                    data-card-preview-grid-rows={layout.rows}
                    className="fixed inset-0 z-[155] flex items-center justify-center overflow-hidden bg-black/82 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={heading}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                >
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        aria-label="Close card preview"
                        onClick={onClose}
                    />
                    <button
                        type="button"
                        aria-label="Close card preview"
                        onClick={onClose}
                        className="absolute right-6 top-6 z-[157] rounded-full border border-white/20 bg-slate-950/75 p-3 text-slate-100 shadow-xl transition-colors hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                    >
                        <X size={22} />
                    </button>
                    <motion.div
                        data-card-preview-panel="true"
                        className={`pointer-events-none absolute inset-0 z-[156] overflow-visible rounded-2xl px-4 py-6 ${
                            theme === 'dark' ? 'text-slate-100' : 'text-stone-50'
                        }`}
                        initial={{ opacity: 0.96 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0.98 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    >
                        <div
                            data-card-preview-title-band="true"
                            className="absolute left-0 right-0 top-0 flex h-[168px] items-end justify-center px-16 pb-5 text-center"
                        >
                            <h2 className="text-3xl font-black uppercase tracking-[0.15em] text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                                {heading}
                            </h2>
                            {cards.length > visibleCards.length && (
                                <p className="absolute bottom-1 text-xs font-black uppercase tracking-[0.18em] text-amber-100/70">
                                    Showing {visibleCards.length} / {cards.length}
                                </p>
                            )}
                        </div>
                        <div
                            data-card-preview-card-band="true"
                            className="pointer-events-auto absolute left-1/2 top-1/2 max-w-[94vw] -translate-x-1/2 -translate-y-1/2 overflow-visible"
                        >
                            {hasPreviewContent ? (
                                <motion.div
                                    data-card-preview-content="custom"
                                    className="relative overflow-visible rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.2, ease: 'easeOut' }}
                                    style={{
                                        width: `${layout.width}px`,
                                        height: `${layout.height}px`,
                                    }}
                                >
                                    <div
                                        className="absolute left-0 top-0"
                                        style={{
                                            width: `${FEATURED_CARD_SIZE.width}px`,
                                            height: `${FEATURED_CARD_SIZE.height}px`,
                                            transform: `scale(${layout.scale})`,
                                            transformOrigin: 'top left',
                                        }}
                                    >
                                        {previewContent}
                                    </div>
                                </motion.div>
                            ) : (
                                <div
                                    data-card-preview-grid="true"
                                    className="grid justify-center overflow-visible"
                                    style={{
                                        gridTemplateColumns: `repeat(${layout.columns}, ${layout.width}px)`,
                                        gap: `${layout.gapPx}px`,
                                        width: `${layout.gridWidth}px`,
                                        minHeight: `${layout.gridHeight}px`,
                                    }}
                                >
                                    {visibleCards.map((card, index) => (
                                        <motion.div
                                            key={card.id || index}
                                            data-card-preview-card={card.id}
                                            className="relative overflow-visible rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                                            initial={{ opacity: 0, y: 18, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{
                                                delay: index * 0.035,
                                                duration: 0.2,
                                                ease: 'easeOut',
                                            }}
                                            style={{
                                                width: `${layout.width}px`,
                                                height: `${layout.height}px`,
                                            }}
                                        >
                                            <div
                                                data-card-preview-card-frame={card.id}
                                                className="relative"
                                                style={{
                                                    width: `${layout.width}px`,
                                                    height: `${layout.height}px`,
                                                }}
                                            >
                                                <div
                                                    className="absolute left-0 top-0"
                                                    style={{
                                                        width: `${FEATURED_CARD_SIZE.width}px`,
                                                        height: `${FEATURED_CARD_SIZE.height}px`,
                                                        transform: `scale(${layout.scale})`,
                                                        transformOrigin: 'top left',
                                                    }}
                                                >
                                                    <Card
                                                        card={card}
                                                        canBuy={false}
                                                        theme={theme}
                                                        size="featured"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {hasCardActions && !hasPreviewContent && (
                            <div
                                data-card-preview-card-actions-band="true"
                                className="pointer-events-auto absolute left-1/2 grid -translate-x-1/2 justify-center overflow-visible px-4"
                                style={{
                                    bottom: GLOBAL_ACTION_BAND_BOTTOM,
                                    gridTemplateColumns: `repeat(${layout.columns}, ${layout.width}px)`,
                                    gap: `${layout.gapPx}px`,
                                    width: `${layout.gridWidth}px`,
                                    maxWidth: '94vw',
                                }}
                            >
                                {visibleCards.map((card, index) => (
                                    <div
                                        key={`card-actions-${card.id || index}`}
                                        data-card-preview-card-actions={card.id}
                                        className="flex justify-center gap-3"
                                    >
                                        {visibleCardActions[index].map((action, actionIndex) => (
                                            <button
                                                key={`${card.id || index}-${action.id}-${actionIndex}`}
                                                type="button"
                                                data-card-preview-action={action.id}
                                                data-card-preview-action-card={card.id}
                                                data-card-preview-action-index={actionIndex}
                                                data-card-preview-action-scope="card"
                                                disabled={action.disabled}
                                                onClick={() => handleAction(action)}
                                                className={ACTION_BUTTON_CLASS}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                        {actions.length > 0 && (
                            <div
                                data-card-preview-actions-band="true"
                                className="pointer-events-auto absolute bottom-8 left-1/2 flex w-full max-w-[520px] -translate-x-1/2 justify-center px-4"
                                style={{ bottom: GLOBAL_ACTION_BAND_BOTTOM }}
                            >
                                <div
                                    data-card-preview-actions="true"
                                    data-card-preview-actions-layout={actionLayout}
                                    data-card-preview-actions-align={actionAlign}
                                    className="flex w-full justify-center gap-4"
                                >
                                    {actions.map((action, index) => (
                                        <button
                                            key={action.id}
                                            type="button"
                                            data-card-preview-action={action.id}
                                            data-card-preview-action-index={index}
                                            data-card-preview-primary-action={
                                                index === 0 ? 'true' : undefined
                                            }
                                            disabled={action.disabled}
                                            onClick={() => handleAction(action)}
                                            className={ACTION_BUTTON_CLASS}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return typeof document === 'undefined' ? overlay : createPortal(overlay, document.body);
}

export type { CardPreviewMode, CardPreviewOverlayProps };
