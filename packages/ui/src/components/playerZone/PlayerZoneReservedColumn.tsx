import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Card, FEATURED_CARD_SAMPLE_SIZE, FEATURED_CARD_SIZE } from '../Card';
import { ScaledCardFrame } from './ScaledCardFrame';
import type { RefObject } from 'react';
import type { Card as CardType, PlayerKey } from '@gemduel/shared/types';
import { RESERVED_CARD_GAP_PX } from './constants';

const PREVIEW_CARD_ASPECT_RATIO =
    FEATURED_CARD_SAMPLE_SIZE.height / FEATURED_CARD_SAMPLE_SIZE.width;
const PREVIEW_CARD_LAYOUT_COLUMNS = 4;
const PREVIEW_DESKTOP_CARD_GAP_PX = 24;
const PREVIEW_MOBILE_CARD_GAP_PX = 12;
const PREVIEW_CARD_ROW_VIEWPORT_RATIO = 0.9;
const PREVIEW_MIN_CARD_WIDTH_PX = 72;

interface PlayerZoneReservedColumnProps {
    player: PlayerKey;
    reserved: CardType[];
    reservedRowRef: RefObject<HTMLDivElement | null>;
    reservedCardScale: number;
    isActive: boolean;
    hasPuppetMaster: boolean;
    theme: 'light' | 'dark';
    onBuyReserved: (card: CardType, execute?: boolean) => boolean;
    onDiscardReserved: (cardId: string) => void;
    pendingReservedCardIds?: string[];
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

const getPreviewCardLayout = (viewportSize: { width: number; height: number }) => {
    const gapPx =
        viewportSize.width < 768 ? PREVIEW_MOBILE_CARD_GAP_PX : PREVIEW_DESKTOP_CARD_GAP_PX;
    const maxRowWidth = viewportSize.width * PREVIEW_CARD_ROW_VIEWPORT_RATIO;
    const availableWidth = maxRowWidth - gapPx * (PREVIEW_CARD_LAYOUT_COLUMNS - 1);
    const widthByFourCardRow = availableWidth / PREVIEW_CARD_LAYOUT_COLUMNS;
    const width = Math.max(
        PREVIEW_MIN_CARD_WIDTH_PX,
        Math.min(FEATURED_CARD_SAMPLE_SIZE.width, widthByFourCardRow)
    );

    return {
        scale: width / FEATURED_CARD_SIZE.width,
        width: Math.round(width),
        height: Math.round(width * PREVIEW_CARD_ASPECT_RATIO),
    };
};

function ReservedCardPreviewOverlay({
    card,
    theme,
    onClose,
}: {
    card: CardType;
    theme: 'light' | 'dark';
    onClose: () => void;
}) {
    const viewportSize = useViewportSize();
    const cardLayout = useMemo(() => getPreviewCardLayout(viewportSize), [viewportSize]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const overlay = (
        <div
            data-reserved-card-preview={card.id}
            className="fixed inset-0 z-[150] flex items-center justify-center overflow-hidden bg-black/82 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Card preview"
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
                className="absolute right-6 top-6 z-[152] rounded-full border border-white/20 bg-slate-950/75 p-3 text-slate-100 shadow-xl transition-colors hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
            >
                <X size={22} />
            </button>
            <div
                className={`relative z-[151] overflow-visible rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)] ${
                    theme === 'dark' ? 'text-slate-100' : 'text-stone-50'
                }`}
                style={{
                    width: `${cardLayout.width}px`,
                    height: `${cardLayout.height}px`,
                }}
                onClick={(event) => event.stopPropagation()}
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
                    <Card card={card} canBuy={false} theme={theme} size="featured" />
                </div>
            </div>
        </div>
    );

    return typeof document === 'undefined' ? overlay : createPortal(overlay, document.body);
}

export function PlayerZoneReservedColumn({
    player,
    reserved,
    reservedRowRef,
    reservedCardScale,
    isActive,
    hasPuppetMaster,
    theme,
    onBuyReserved,
    onDiscardReserved,
    pendingReservedCardIds = [],
}: PlayerZoneReservedColumnProps) {
    const [previewCard, setPreviewCard] = useState<CardType | null>(null);
    const pendingReservedCardIdSet = useMemo(
        () => new Set(pendingReservedCardIds),
        [pendingReservedCardIds]
    );

    return (
        <div
            className={`self-stretch flex items-center border-l pl-4 min-w-0 transition-colors duration-500
          ${theme === 'dark' ? 'border-slate-700' : 'border-stone-300'}
      `}
            style={{ flex: 42 }}
        >
            <div
                ref={reservedRowRef}
                data-reserved-row={player}
                className="w-full flex items-center justify-center overflow-hidden py-2 min-w-0"
            >
                {reserved.length === 0 && (
                    <span
                        className={`text-[10px] italic w-full text-center ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}
                    >
                        No Reserved Cards
                    </span>
                )}
                {reserved.length > 0 && (
                    <div
                        className="flex items-center justify-center min-w-0 max-w-full"
                        style={{ gap: `${RESERVED_CARD_GAP_PX}px` }}
                    >
                        {reserved.map((card, i) => {
                            const isPendingPresentation = pendingReservedCardIdSet.has(card.id);
                            const canBuyReserved =
                                !isPendingPresentation && isActive && onBuyReserved(card);

                            return (
                                <ScaledCardFrame
                                    key={card.id || i}
                                    scale={reservedCardScale}
                                    baseSize={FEATURED_CARD_SIZE}
                                >
                                    <div
                                        data-reserved-slot={`${player}-${i}`}
                                        data-card-id={card.id}
                                        data-reserved-card-scale={reservedCardScale.toFixed(3)}
                                        data-reserved-card-pending={
                                            isPendingPresentation ? 'true' : undefined
                                        }
                                        className="relative group/card"
                                        aria-hidden={isPendingPresentation ? 'true' : undefined}
                                        style={
                                            isPendingPresentation
                                                ? {
                                                      visibility: 'hidden',
                                                      pointerEvents: 'none',
                                                  }
                                                : undefined
                                        }
                                    >
                                        <Card
                                            card={card}
                                            size="featured"
                                            canBuy={canBuyReserved}
                                            onClick={() => {
                                                if (canBuyReserved) {
                                                    onBuyReserved(card, true);
                                                    return;
                                                }

                                                setPreviewCard(card);
                                            }}
                                            allowUnavailableClick={true}
                                            isReservedView={true}
                                            theme={theme}
                                            className="transition-transform duration-200 ease-in-out"
                                        />
                                        {hasPuppetMaster && isActive && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDiscardReserved(card.id);
                                                }}
                                                className="absolute -top-2 -right-2 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg border border-white/20 opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-rose-500 z-50"
                                                title="Discard Card (Puppet Master)"
                                            >
                                                <span className="text-[15px] font-black leading-none">
                                                    X
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </ScaledCardFrame>
                            );
                        })}
                    </div>
                )}
                {previewCard && (
                    <ReservedCardPreviewOverlay
                        card={previewCard}
                        theme={theme}
                        onClose={() => setPreviewCard(null)}
                    />
                )}
            </div>
        </div>
    );
}
