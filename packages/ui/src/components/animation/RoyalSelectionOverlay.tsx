import { ArrowLeft, Crown, Eye } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import { getPlayerDisplayName } from '@gemduel/shared';
import type { Card as CardType, PlayerKey, RoyalCard } from '@gemduel/shared/types';
import { Card, FEATURED_CARD_SAMPLE_SIZE, FEATURED_CARD_SIZE } from '../Card';
import { useLocale, useT } from '../../i18n/LocaleProvider';

const CARD_ASPECT_RATIO = FEATURED_CARD_SAMPLE_SIZE.height / FEATURED_CARD_SAMPLE_SIZE.width;
const CARD_LAYOUT_COLUMNS = 4;
const DESKTOP_CARD_GAP_PX = 24;
const MOBILE_CARD_GAP_PX = 12;
const CARD_ROW_VIEWPORT_RATIO = 0.9;
const MIN_CARD_WIDTH_PX = 72;

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

        const updateViewportSize = () => {
            setViewportSize(getViewportSize());
        };

        window.addEventListener('resize', updateViewportSize);
        return () => window.removeEventListener('resize', updateViewportSize);
    }, []);

    return viewportSize;
};

const getCardLayout = (cardCount: number, viewportSize: { width: number; height: number }) => {
    const gapPx = viewportSize.width < 768 ? MOBILE_CARD_GAP_PX : DESKTOP_CARD_GAP_PX;
    const safeCardCount = Math.max(1, cardCount);
    const maxRowWidth = viewportSize.width * CARD_ROW_VIEWPORT_RATIO;
    const availableWidth = maxRowWidth - gapPx * (CARD_LAYOUT_COLUMNS - 1);
    const widthByFourCardRow = availableWidth / CARD_LAYOUT_COLUMNS;
    const width = Math.max(
        MIN_CARD_WIDTH_PX,
        Math.min(FEATURED_CARD_SAMPLE_SIZE.width, widthByFourCardRow)
    );

    return {
        gapPx,
        maxRowWidth,
        rowWidth: width * safeCardCount + gapPx * Math.max(0, safeCardCount - 1),
        scale: width / FEATURED_CARD_SIZE.width,
        width: Math.round(width),
        height: Math.round(width * CARD_ASPECT_RATIO),
    };
};

interface RoyalSelectionOverlayProps {
    royalDeck: RoyalCard[];
    player: PlayerKey;
    theme: 'light' | 'dark';
    onSelectRoyal: (card: RoyalCard) => void;
}

export function RoyalSelectionOverlay({
    royalDeck,
    player,
    theme,
    onSelectRoyal,
}: RoyalSelectionOverlayProps) {
    const { locale } = useLocale();
    const t = useT();
    const viewportSize = useViewportSize();
    const [isViewingBoard, setIsViewingBoard] = useState(false);
    const returnToSelectionButtonRef = useRef<HTMLButtonElement | null>(null);
    const cardLayout = useMemo(
        () => getCardLayout(royalDeck.length, viewportSize),
        [royalDeck.length, viewportSize]
    );

    useEffect(() => {
        if (isViewingBoard) {
            returnToSelectionButtonRef.current?.focus();
        }
    }, [isViewingBoard]);

    if (royalDeck.length === 0) {
        return null;
    }

    const handleBoardViewPointerCapture = (event: PointerEvent<HTMLDivElement>) => {
        if (returnToSelectionButtonRef.current?.contains(event.target as Node)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    };

    const handleBoardViewKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (returnToSelectionButtonRef.current?.contains(event.target as Node)) {
            if (event.key === 'Tab') {
                event.preventDefault();
                returnToSelectionButtonRef.current.focus();
            }
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        returnToSelectionButtonRef.current?.focus();
    };

    if (isViewingBoard) {
        return (
            <div
                data-royal-selection-overlay={player}
                data-royal-selection-mode="board-info"
                data-royal-selection-input-shield="true"
                className="fixed inset-0 z-[130] overflow-hidden bg-transparent"
                role="dialog"
                aria-modal="true"
                aria-label={t('overlays.viewBoard')}
                onPointerDownCapture={handleBoardViewPointerCapture}
                onClickCapture={handleBoardViewPointerCapture}
                onKeyDownCapture={handleBoardViewKeyDown}
            >
                <button
                    ref={returnToSelectionButtonRef}
                    type="button"
                    data-royal-selection-view-toggle="selection"
                    onClick={() => setIsViewingBoard(false)}
                    className="fixed bottom-8 left-1/2 z-[131] flex -translate-x-1/2 items-center gap-3 rounded-full border border-amber-200/70 bg-slate-950/88 px-6 py-3 text-[13px] font-black uppercase tracking-[0.14em] text-amber-100 shadow-[0_0_30px_rgba(250,204,21,0.22)] backdrop-blur-md transition-colors hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                >
                    <ArrowLeft size={18} />
                    {t('overlays.backToRoyalSelection')}
                </button>
            </div>
        );
    }

    return (
        <div
            data-royal-selection-overlay={player}
            data-royal-selection-mode="selection"
            className="fixed inset-0 z-[130] overflow-hidden bg-black/82 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="royal-selection-title"
        >
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 24 }}
                className={`relative flex w-full min-w-0 flex-col items-center justify-center px-4 py-6 ${
                    theme === 'dark'
                        ? 'bg-slate-950/72 text-slate-100'
                        : 'bg-stone-950/35 text-stone-50'
                }`}
                style={{ minHeight: `max(100vh, ${cardLayout.height + 260}px)` }}
            >
                <div className="mb-7 flex shrink-0 flex-col items-center gap-3 text-center">
                    <div className="rounded-full border border-amber-300/50 bg-amber-400/15 p-3 text-amber-300 shadow-[0_0_24px_rgba(250,204,21,0.18)]">
                        <Crown size={38} fill="currentColor" />
                    </div>
                    <h2
                        id="royal-selection-title"
                        className="text-4xl font-black uppercase tracking-[0.16em]"
                    >
                        {t('royalCourt.title')}
                    </h2>
                    <p
                        className={`text-base font-bold uppercase tracking-[0.2em] ${
                            theme === 'dark' ? 'text-amber-100/80' : 'text-amber-800'
                        }`}
                    >
                        {getPlayerDisplayName(player, locale)} - {t('royalCourt.pick')}
                    </p>
                </div>

                <div
                    data-royal-selection-card-area="true"
                    className="w-full max-w-[90vw] overflow-x-hidden overflow-y-visible px-0 py-4"
                    style={{ minHeight: `${cardLayout.height + 24}px` }}
                >
                    <div
                        data-royal-selection-card-row="single"
                        className="mx-auto flex min-w-0 flex-nowrap items-start justify-center"
                        style={{
                            gap: `${cardLayout.gapPx}px`,
                            maxWidth: `${cardLayout.maxRowWidth}px`,
                            width: `${cardLayout.rowWidth}px`,
                        }}
                    >
                        {royalDeck.map((card, index) => (
                            <motion.button
                                key={card.id}
                                type="button"
                                data-royal-selection-card={card.id}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08, duration: 0.24 }}
                                onClick={() => onSelectRoyal(card)}
                                className="relative shrink-0 overflow-visible rounded-xl transition-transform hover:-translate-y-1 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 active:scale-95"
                                aria-label={`${t('royalCourt.pick')} ${card.label ?? card.id}`}
                                style={{
                                    width: `${cardLayout.width}px`,
                                    height: `${cardLayout.height}px`,
                                }}
                            >
                                <div
                                    className="absolute left-0 top-0"
                                    style={{
                                        width: `${FEATURED_CARD_SIZE.width}px`,
                                        height: `${FEATURED_CARD_SIZE.height}px`,
                                        transform: `scale(${cardLayout.scale})`,
                                        transformOrigin: 'top left',
                                    }}
                                >
                                    <Card
                                        card={card as unknown as CardType}
                                        isRoyal={true}
                                        theme={theme}
                                        size="featured"
                                    />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    data-royal-selection-view-toggle="board"
                    onClick={() => setIsViewingBoard(true)}
                    className="mt-5 flex items-center gap-3 rounded-full border border-amber-200/70 bg-black/45 px-6 py-3 text-[13px] font-black uppercase tracking-[0.14em] text-amber-100 shadow-[0_0_26px_rgba(250,204,21,0.18)] backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                >
                    <Eye size={18} />
                    {t('overlays.viewBoard')}
                </button>
            </motion.div>
        </div>
    );
}
