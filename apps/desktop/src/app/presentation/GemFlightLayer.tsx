import { useEffect, useState, type CSSProperties } from 'react';
import { GEM_TYPES } from '@gemduel/shared/constants';
import type { GemColor } from '@gemduel/shared/types';
import { GemIcon } from '@gemduel/ui/components/GemIcon';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import type {
    BoardGemPresentationSource,
    GemDiscardPresentationEvent,
    GemDropPresentationEvent,
    GemFlightPresentationEvent,
    GemStealPresentationEvent,
} from './presentationTypes';
import { getAnchorCenter, getElementRect, getRectCenter } from './presentationGeometry';

const GEM_SIZE_PX = 46;
const CENTER_PLAYFIELD_SELECTOR = '[data-presentation-anchor="center-playfield"]';
const MIDDLE_ZONE_SELECTOR = '[data-presentation-anchor="middle-zone"]';
const GEM_FLIGHT_STYLES = `
@keyframes gemduel-gem-flight {
    0% { opacity: 0; transform: translate3d(var(--start-x), var(--start-y), 0) scale(0.72); }
    24% { opacity: 1; transform: translate3d(var(--mid-x), var(--mid-y), 0) scale(1.14); }
    74% { opacity: 1; }
    100% { opacity: 0; transform: translate3d(var(--end-x), var(--end-y), 0) scale(0.82); }
}
@keyframes gemduel-gem-flight-reduced {
    0% { opacity: 0; transform: translate3d(var(--end-x), var(--end-y), 0) scale(0.96); }
    48% { opacity: 0.9; transform: translate3d(var(--end-x), var(--end-y), 0) scale(1.06); }
    100% { opacity: 0; transform: translate3d(var(--end-x), var(--end-y), 0) scale(1); }
}
`;

const shouldHoldPresentationPreview = (): boolean =>
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('presentationPreviewHold') === 'true';

type GemLayerEvent =
    | GemFlightPresentationEvent
    | GemDropPresentationEvent
    | GemStealPresentationEvent
    | GemDiscardPresentationEvent;

interface GemMotionItem {
    key: string;
    color: GemColor;
    sourceSelector?: string;
    targetSelector?: string;
    sourceFallbackSelector?: string;
    targetFallbackSelector?: string;
    sourcePoint?: { x: number; y: number };
    targetPoint?: { x: number; y: number };
}

const createRepeatedGemItems = (
    eventId: string,
    deltas: Partial<Record<GemColor, number>>,
    createItem: (color: GemColor, index: number) => Omit<GemMotionItem, 'key' | 'color'>
): GemMotionItem[] =>
    Object.entries(deltas).flatMap(([color, amount]) => {
        const safeColor = color as GemColor;
        return Array.from({ length: Math.max(0, Math.abs(amount ?? 0)) }, (_, index) => ({
            key: `${eventId}:${safeColor}:${index}`,
            color: safeColor,
            ...createItem(safeColor, index),
        }));
    });

const getBoardSourceSelector = (
    source: BoardGemPresentationSource | undefined
): string | undefined => (source ? `[data-board-cell="${source.row}-${source.col}"]` : undefined);

const getDropSourcePoint = (index: number): { x: number; y: number } => {
    const playfieldRect = getElementRect(CENTER_PLAYFIELD_SELECTOR);
    if (playfieldRect) {
        const center = getRectCenter(playfieldRect);
        return {
            x: center.x + ((index % 5) - 2) * 12,
            y: playfieldRect.y + 26,
        };
    }

    return getAnchorCenter(MIDDLE_ZONE_SELECTOR);
};

const buildGemMotionItems = (event: GemLayerEvent): GemMotionItem[] => {
    if (event.type === 'gem-flight') {
        return createRepeatedGemItems(event.id, event.deltas, (color, index) => {
            const source = event.sources?.filter((candidate) => candidate.color === color)[index];
            return {
                sourceSelector: getBoardSourceSelector(source),
                sourceFallbackSelector: CENTER_PLAYFIELD_SELECTOR,
                targetSelector: `[data-player-gem="${event.player}-${color}"]`,
                targetFallbackSelector: `[data-player-zone="${event.player}"]`,
            };
        });
    }

    if (event.type === 'gem-drop') {
        return event.cells.map((cell, index) => ({
            key: `${event.id}:${cell.row}-${cell.col}`,
            color: cell.color,
            sourcePoint: getDropSourcePoint(index),
            targetSelector: `[data-board-cell="${cell.row}-${cell.col}"]`,
            targetFallbackSelector: CENTER_PLAYFIELD_SELECTOR,
        }));
    }

    if (event.type === 'gem-steal') {
        return createRepeatedGemItems(event.id, event.deltas, (color) => ({
            sourceSelector: `[data-player-gem="${event.fromPlayer}-${color}"]`,
            sourceFallbackSelector: `[data-player-zone="${event.fromPlayer}"]`,
            targetSelector: `[data-player-gem="${event.toPlayer}-${color}"]`,
            targetFallbackSelector: `[data-player-zone="${event.toPlayer}"]`,
        }));
    }

    return createRepeatedGemItems(event.id, event.deltas, (color, index) => {
        const sink = getAnchorCenter(CENTER_PLAYFIELD_SELECTOR);
        return {
            sourceSelector: `[data-player-gem="${event.player}-${color}"]`,
            sourceFallbackSelector: `[data-player-zone="${event.player}"]`,
            targetPoint: {
                x: sink.x + ((index % 5) - 2) * 10,
                y: sink.y + 56,
            },
        };
    });
};

const resolvePoint = (
    selector: string | undefined,
    fallbackSelector: string | undefined,
    explicitPoint: { x: number; y: number } | undefined
) => {
    if (explicitPoint) {
        return explicitPoint;
    }

    return selector
        ? getAnchorCenter(selector, getAnchorCenter(fallbackSelector ?? MIDDLE_ZONE_SELECTOR))
        : getAnchorCenter(fallbackSelector ?? MIDDLE_ZONE_SELECTOR);
};

function AnimatedGemClone({
    item,
    index,
    theme,
}: {
    item: GemMotionItem;
    index: number;
    theme: 'light' | 'dark';
}) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const source = resolvePoint(item.sourceSelector, item.sourceFallbackSelector, item.sourcePoint);
    const target = resolvePoint(item.targetSelector, item.targetFallbackSelector, item.targetPoint);
    const start = prefersReducedMotion ? target : source;
    const laneOffset = ((index % 5) - 2) * 8;
    const gemType = GEM_TYPES[item.color.toUpperCase() as keyof typeof GEM_TYPES];

    const startX = start.x - GEM_SIZE_PX / 2 + laneOffset;
    const startY = start.y - GEM_SIZE_PX / 2;
    const endX = target.x - GEM_SIZE_PX / 2 + laneOffset * 0.25;
    const endY = target.y - GEM_SIZE_PX / 2;
    const shouldHold = shouldHoldPresentationPreview();
    const style = {
        width: GEM_SIZE_PX,
        height: GEM_SIZE_PX,
        filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.38))',
        '--start-x': `${startX}px`,
        '--start-y': `${startY}px`,
        '--mid-x': `${(startX + endX) / 2}px`,
        '--mid-y': `${(startY + endY) / 2 - 28}px`,
        '--end-x': `${endX}px`,
        '--end-y': `${endY}px`,
        opacity: shouldHold ? 1 : undefined,
        transform: shouldHold
            ? `translate3d(${(startX + endX) / 2}px, ${(startY + endY) / 2 - 28}px, 0) scale(1.14)`
            : undefined,
        animation: shouldHold
            ? 'none'
            : `${prefersReducedMotion ? 'gemduel-gem-flight-reduced' : 'gemduel-gem-flight'} ${
                  prefersReducedMotion ? 180 : 660
              }ms cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 25}ms both`,
    } as CSSProperties;

    return (
        <div
            aria-hidden="true"
            data-gem-flight={item.color}
            className="fixed z-[120] pointer-events-none"
            style={style}
        >
            <div
                aria-hidden="true"
                className="absolute inset-[-18%] rounded-full bg-cyan-200/20 blur-md"
            />
            <GemIcon
                type={gemType}
                size="w-full h-full"
                theme={theme}
                variant="board"
                className="shadow-2xl"
            />
        </div>
    );
}

export function GemFlightLayer({
    event,
    theme,
}: {
    event: GemLayerEvent;
    theme: 'light' | 'dark';
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

    const items = buildGemMotionItems(event);

    if (items.length === 0) {
        return null;
    }

    return (
        <div data-gem-flight-layer={event.id}>
            <style>{GEM_FLIGHT_STYLES}</style>
            {items.map((item, index) => (
                <AnimatedGemClone key={item.key} item={item} index={index} theme={theme} />
            ))}
        </div>
    );
}
