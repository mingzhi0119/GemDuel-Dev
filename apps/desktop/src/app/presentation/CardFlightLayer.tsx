import { useEffect, useState, type CSSProperties } from 'react';
import { Card, FEATURED_CARD_SIZE } from '@gemduel/ui/components/Card';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import type { MarketDeckBackArtworkMap } from '@gemduel/ui/components/card/cardBackArtwork';
import type { ThemeName } from '@gemduel/shared/types';
import type {
    CardAcquirePresentationEvent,
    CardFlightPresentationItem,
    CardFlightSource,
    CardReservePresentationEvent,
    MarketRefillPresentationEvent,
} from './presentationTypes';
import { getAnchorCenter } from './presentationGeometry';
import { CARD_FLIGHT_STYLES } from './cardFlightStyles';
import { CardFlightAnchorHalo, CardFlightLabel } from './cardFlightAnnotations';
import { DeckBackFace } from './DeckBackFace';
import { MarketRefillMotion } from './MarketRefillMotion';
import { getPresentationDurationMs, type PresentationPreviewMode } from './presentationPreviewMode';

const CARD_SCALE = 0.52;
const LAB_CARD_SCALE = 0.68;
const MIDDLE_ZONE_SELECTOR = '[data-presentation-anchor="middle-zone"]';

const getCardScale = (previewMode: PresentationPreviewMode | undefined): number =>
    previewMode ? LAB_CARD_SCALE : CARD_SCALE;

const getCardActionLabel = (
    event: CardAcquirePresentationEvent | CardReservePresentationEvent,
    item: CardFlightPresentationItem
) => {
    const playerLabel = event.player.toUpperCase();

    if (event.type === 'card-reserve') {
        return item.source.kind === 'deck'
            ? `${playerLabel} reserves from deck`
            : `${playerLabel} reserves`;
    }

    return item.source.kind === 'reserved' ? `${playerLabel} buys reserved` : `${playerLabel} buys`;
};

type CardFlightEvent =
    | CardAcquirePresentationEvent
    | CardReservePresentationEvent
    | MarketRefillPresentationEvent;

const getCardSourceSelector = (
    source: CardFlightSource,
    player: string
): { selector: string; fallbackSelector: string } => {
    switch (source.kind) {
        case 'market':
            return {
                selector: `[data-market-slot="${source.level}-${source.index}"]`,
                fallbackSelector: MIDDLE_ZONE_SELECTOR,
            };
        case 'reserved':
            return {
                selector: `[data-reserved-slot="${player}-${source.index}"]`,
                fallbackSelector: `[data-reserved-row="${player}"]`,
            };
        case 'deck':
            return {
                selector: `[data-market-deck="${source.level}"]`,
                fallbackSelector: MIDDLE_ZONE_SELECTOR,
            };
        default:
            return { selector: MIDDLE_ZONE_SELECTOR, fallbackSelector: MIDDLE_ZONE_SELECTOR };
    }
};

const getCardTargetSelector = (
    event: CardAcquirePresentationEvent | CardReservePresentationEvent,
    item: CardFlightPresentationItem
): { selector: string; fallbackSelector: string } => {
    if (event.type === 'card-reserve') {
        return {
            selector: `[data-reserved-slot="${event.player}-${item.targetIndex ?? 0}"]`,
            fallbackSelector: `[data-reserved-row="${event.player}"]`,
        };
    }

    if (item.bonusColor && item.bonusColor !== 'null') {
        return {
            selector: `[data-tableau-stack="${event.player}-${item.bonusColor}"]`,
            fallbackSelector: `[data-player-zone="${event.player}"]`,
        };
    }

    return {
        selector: `[data-player-zone="${event.player}"]`,
        fallbackSelector: MIDDLE_ZONE_SELECTOR,
    };
};

function FlightCard({
    event,
    item,
    index,
    theme,
    previewMode,
}: {
    event: CardAcquirePresentationEvent | CardReservePresentationEvent;
    item: CardFlightPresentationItem;
    index: number;
    theme: ThemeName;
    previewMode?: PresentationPreviewMode;
}) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const sourceSelectors = getCardSourceSelector(item.source, event.player);
    const targetSelectors = getCardTargetSelector(event, item);
    const source = getAnchorCenter(
        sourceSelectors.selector,
        getAnchorCenter(sourceSelectors.fallbackSelector)
    );
    const target = getAnchorCenter(
        targetSelectors.selector,
        getAnchorCenter(targetSelectors.fallbackSelector)
    );
    const cardScale = getCardScale(previewMode);
    const cardWidth = FEATURED_CARD_SIZE.width * cardScale;
    const cardHeight = FEATURED_CARD_SIZE.height * cardScale;
    const stagger = index * 34;
    const startX = (prefersReducedMotion ? target.x : source.x) - cardWidth / 2;
    const startY = (prefersReducedMotion ? target.y : source.y) - cardHeight / 2;
    const endX = target.x - cardWidth / 2;
    const endY = target.y - cardHeight / 2;
    const durationMs = getPresentationDurationMs(prefersReducedMotion ? 180 : 720, previewMode);
    const actionLabel = getCardActionLabel(event, item);

    const style = {
        width: cardWidth,
        height: cardHeight,
        left: 0,
        top: 0,
        zIndex: previewMode ? 1001 : undefined,
        filter: previewMode
            ? 'drop-shadow(0 0 18px rgba(125,211,252,0.7)) drop-shadow(0 18px 32px rgba(0,0,0,0.42))'
            : 'drop-shadow(0 14px 28px rgba(0,0,0,0.36))',
        '--start-x': `${startX}px`,
        '--start-y': `${startY}px`,
        '--end-x': `${endX}px`,
        '--end-y': `${endY}px`,
        '--mid-x': `${(startX + endX) / 2}px`,
        '--mid-y': `${(startY + endY) / 2 - 42}px`,
        animation: `${prefersReducedMotion ? 'gemduel-card-flight-reduced' : 'gemduel-card-flight'} ${
            durationMs
        }ms cubic-bezier(0.2, 0.8, 0.2, 1) ${stagger}ms both`,
    } as CSSProperties;

    return (
        <>
            <CardFlightAnchorHalo point={source} tone="source" previewMode={previewMode} />
            <CardFlightAnchorHalo point={target} tone="target" previewMode={previewMode} />
            <div
                aria-hidden="true"
                data-card-flight={event.type}
                data-card-id={item.cardId}
                className="fixed z-[119] pointer-events-none"
                style={style}
            >
                <CardFlightLabel label={actionLabel} />
                {previewMode && (
                    <div
                        aria-hidden="true"
                        className="absolute inset-[-10px] rounded-xl border-2 border-cyan-200/80 shadow-[0_0_28px_rgba(125,211,252,0.7)]"
                    />
                )}
                <div
                    className="origin-top-left overflow-hidden rounded-lg"
                    style={{
                        width: FEATURED_CARD_SIZE.width,
                        height: FEATURED_CARD_SIZE.height,
                        transform: `scale(${cardScale})`,
                    }}
                >
                    <Card
                        card={item.card}
                        size="featured"
                        canBuy={false}
                        theme={theme}
                        className="shadow-2xl"
                    />
                </div>
            </div>
        </>
    );
}

function DeckReserveFlightCard({
    event,
    item,
    index,
    theme,
    marketDeckBackArtwork,
    previewMode,
}: {
    event: CardReservePresentationEvent;
    item: CardFlightPresentationItem & { source: Extract<CardFlightSource, { kind: 'deck' }> };
    index: number;
    theme: ThemeName;
    marketDeckBackArtwork?: MarketDeckBackArtworkMap;
    previewMode?: PresentationPreviewMode;
}) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const sourceSelectors = getCardSourceSelector(item.source, event.player);
    const targetSelectors = getCardTargetSelector(event, item);
    const source = getAnchorCenter(
        sourceSelectors.selector,
        getAnchorCenter(sourceSelectors.fallbackSelector)
    );
    const target = getAnchorCenter(
        targetSelectors.selector,
        getAnchorCenter(targetSelectors.fallbackSelector)
    );
    const cardScale = getCardScale(previewMode);
    const cardWidth = FEATURED_CARD_SIZE.width * cardScale;
    const cardHeight = FEATURED_CARD_SIZE.height * cardScale;
    const stagger = index * 34;
    const startX = (prefersReducedMotion ? target.x : source.x) - cardWidth / 2;
    const startY = (prefersReducedMotion ? target.y : source.y) - cardHeight / 2;
    const endX = target.x - cardWidth / 2;
    const endY = target.y - cardHeight / 2;
    const artwork = marketDeckBackArtwork?.[item.source.level];
    const durationMs = getPresentationDurationMs(prefersReducedMotion ? 180 : 760, previewMode);
    const actionLabel = getCardActionLabel(event, item);

    const style = {
        width: cardWidth,
        height: cardHeight,
        left: 0,
        top: 0,
        zIndex: previewMode ? 1001 : undefined,
        filter: previewMode
            ? 'drop-shadow(0 0 18px rgba(125,211,252,0.7)) drop-shadow(0 18px 32px rgba(0,0,0,0.42))'
            : 'drop-shadow(0 14px 28px rgba(0,0,0,0.36))',
        '--start-x': `${startX}px`,
        '--start-y': `${startY}px`,
        '--end-x': `${endX}px`,
        '--end-y': `${endY}px`,
        '--mid-x': `${(startX + endX) / 2}px`,
        '--mid-y': `${(startY + endY) / 2 - 42}px`,
        animation: `${prefersReducedMotion ? 'gemduel-card-flight-reduced' : 'gemduel-card-reserve-deck-flight'} ${
            durationMs
        }ms cubic-bezier(0.2, 0.8, 0.2, 1) ${stagger}ms both`,
        perspective: '900px',
    } as CSSProperties;

    return (
        <>
            <CardFlightAnchorHalo point={source} tone="source" previewMode={previewMode} />
            <CardFlightAnchorHalo point={target} tone="target" previewMode={previewMode} />
            <div
                aria-hidden="true"
                data-card-flight={event.type}
                data-card-reserve-source="deck"
                data-card-id={item.cardId}
                className="fixed z-[119] pointer-events-none"
                style={style}
            >
                <CardFlightLabel label={actionLabel} />
                {previewMode && (
                    <div
                        aria-hidden="true"
                        className="absolute inset-[-10px] rounded-xl border-2 border-cyan-200/80 shadow-[0_0_28px_rgba(125,211,252,0.7)]"
                    />
                )}
                <div
                    className="origin-top-left overflow-hidden rounded-lg"
                    style={{
                        width: FEATURED_CARD_SIZE.width,
                        height: FEATURED_CARD_SIZE.height,
                        transform: `scale(${cardScale})`,
                        transformOrigin: 'top left',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {!prefersReducedMotion && (
                        <div
                            className="absolute inset-0 overflow-hidden rounded-lg"
                            style={{
                                backfaceVisibility: 'hidden',
                                animation: `gemduel-card-reserve-deck-back ${durationMs}ms ease-out ${stagger}ms both`,
                            }}
                        >
                            <DeckBackFace artwork={artwork} level={item.source.level} />
                        </div>
                    )}
                    <div
                        className="absolute inset-0 overflow-hidden rounded-lg"
                        style={{
                            backfaceVisibility: 'hidden',
                            animation: prefersReducedMotion
                                ? undefined
                                : `gemduel-card-reserve-deck-face ${durationMs}ms ease-out ${stagger}ms both`,
                        }}
                    >
                        <Card
                            card={item.card}
                            size="featured"
                            canBuy={false}
                            theme={theme}
                            className="shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export function CardFlightLayer({
    event,
    theme,
    marketDeckBackArtwork,
    previewMode,
}: {
    event: CardFlightEvent;
    theme: ThemeName;
    marketDeckBackArtwork?: MarketDeckBackArtworkMap;
    previewMode?: PresentationPreviewMode;
}) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(false);
        const frame = window.requestAnimationFrame(() => setIsReady(true));
        return () => window.cancelAnimationFrame(frame);
    }, [event.id]);

    if (!isReady) {
        return null;
    }

    if (event.type === 'market-refill') {
        const [slot] = event.slots;

        if (!slot) {
            return null;
        }

        return (
            <div data-card-flight-layer={event.id}>
                <style>{CARD_FLIGHT_STYLES}</style>
                <MarketRefillMotion
                    key={`${slot.level}-${slot.index}-${slot.nextCardId ?? 'empty'}`}
                    slot={slot}
                    theme={theme}
                    marketDeckBackArtwork={marketDeckBackArtwork}
                    previewMode={previewMode}
                />
            </div>
        );
    }

    return (
        <div data-card-flight-layer={event.id}>
            <style>{CARD_FLIGHT_STYLES}</style>
            {event.cards.map((item, index) =>
                event.type === 'card-reserve' && item.source.kind === 'deck' ? (
                    <DeckReserveFlightCard
                        key={`${event.id}-${item.cardId}`}
                        event={event}
                        item={
                            item as CardFlightPresentationItem & {
                                source: Extract<CardFlightSource, { kind: 'deck' }>;
                            }
                        }
                        index={index}
                        theme={theme}
                        marketDeckBackArtwork={marketDeckBackArtwork}
                        previewMode={previewMode}
                    />
                ) : (
                    <FlightCard
                        key={`${event.id}-${item.cardId}`}
                        event={event}
                        item={item}
                        index={index}
                        theme={theme}
                        previewMode={previewMode}
                    />
                )
            )}
        </div>
    );
}
