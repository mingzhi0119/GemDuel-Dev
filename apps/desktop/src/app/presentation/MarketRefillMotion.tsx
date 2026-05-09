import { motion } from 'framer-motion';
import { Card, FEATURED_CARD_SIZE } from '@gemduel/ui/components/Card';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import type { MarketDeckBackArtworkMap } from '@gemduel/ui/components/card/cardBackArtwork';
import type { ThemeName } from '@gemduel/shared/types';
import type { MarketRefillPresentationEvent } from './presentationTypes';
import { getElementRect } from './presentationGeometry';
import { DeckBackFace } from './DeckBackFace';
import {
    getPresentationDurationSeconds,
    type PresentationPreviewMode,
} from './presentationPreviewMode';

const MARKET_REFILL_DURATION_SECONDS = 1;
const MARKET_REFILL_REDUCED_DURATION_SECONDS = 0.24;

export function MarketRefillMotion({
    slot,
    theme,
    marketDeckBackArtwork,
    previewMode,
    enableThreeCardDepth = false,
}: {
    slot: MarketRefillPresentationEvent['slots'][number];
    theme: ThemeName;
    marketDeckBackArtwork?: MarketDeckBackArtworkMap;
    previewMode?: PresentationPreviewMode;
    enableThreeCardDepth?: boolean;
}) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const sourceRect = getElementRect(`[data-market-deck="${slot.level}"]`);
    const targetRect = getElementRect(`[data-market-slot="${slot.level}-${slot.index}"]`);

    if (!targetRect || !slot.nextCard) {
        return null;
    }

    const source = sourceRect ?? targetRect;
    const sourceScale = source.width / FEATURED_CARD_SIZE.width;
    const targetScale = targetRect.width / FEATURED_CARD_SIZE.width;
    const midX = (source.x + targetRect.x) / 2;
    const midY = (source.y + targetRect.y) / 2 - 34;
    const artwork = marketDeckBackArtwork?.[slot.level];
    const durationSeconds = getPresentationDurationSeconds(
        prefersReducedMotion
            ? MARKET_REFILL_REDUCED_DURATION_SECONDS
            : MARKET_REFILL_DURATION_SECONDS,
        previewMode
    );

    if (prefersReducedMotion) {
        return (
            <motion.div
                aria-hidden="true"
                data-card-flight="market-refill"
                data-market-refill-slot={`${slot.level}-${slot.index}`}
                className="fixed left-0 top-0 z-[118] pointer-events-none rounded-xl"
                style={{
                    width: FEATURED_CARD_SIZE.width,
                    height: FEATURED_CARD_SIZE.height,
                    transformOrigin: 'top left',
                    filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.32))',
                }}
                initial={{
                    x: targetRect.x,
                    y: targetRect.y,
                    scale: targetScale * 0.98,
                    opacity: 0,
                }}
                animate={{ x: targetRect.x, y: targetRect.y, scale: targetScale, opacity: 1 }}
                transition={{ duration: durationSeconds, ease: 'easeOut' }}
            >
                <Card
                    card={slot.nextCard}
                    size="featured"
                    canBuy={false}
                    theme={theme}
                    depthLayer={enableThreeCardDepth ? 'flight' : undefined}
                />
            </motion.div>
        );
    }

    return (
        <motion.div
            aria-hidden="true"
            data-card-flight="market-refill"
            data-market-refill-slot={`${slot.level}-${slot.index}`}
            className="fixed left-0 top-0 z-[118] pointer-events-none rounded-xl"
            style={{
                width: FEATURED_CARD_SIZE.width,
                height: FEATURED_CARD_SIZE.height,
                transformOrigin: 'top left',
                transformStyle: 'preserve-3d',
                perspective: 900,
                filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.36))',
            }}
            initial={{ x: source.x, y: source.y, scale: sourceScale, opacity: 0 }}
            animate={{
                x: [source.x, midX, targetRect.x],
                y: [source.y, midY, targetRect.y],
                scale: [sourceScale, Math.max(sourceScale, targetScale) * 1.03, targetScale],
                opacity: [0, 1, 1],
            }}
            transition={{
                duration: durationSeconds,
                ease: [0.2, 0.8, 0.2, 1],
                times: [0, 0.68, 1],
            }}
        >
            <motion.div
                className="absolute inset-0 overflow-hidden rounded-lg"
                style={{ backfaceVisibility: 'hidden' }}
                initial={{ opacity: 1, rotateY: 0 }}
                animate={{ opacity: [1, 1, 0, 0], rotateY: [0, 0, 88, 88] }}
                transition={{
                    duration: durationSeconds,
                    ease: 'easeOut',
                    times: [0, 0.64, 0.78, 1],
                }}
            >
                <DeckBackFace artwork={artwork} level={slot.level} />
            </motion.div>
            <motion.div
                className="absolute inset-0 overflow-hidden rounded-lg"
                style={{ backfaceVisibility: 'hidden' }}
                initial={{ opacity: 0, rotateY: -88 }}
                animate={{ opacity: [0, 0, 1, 1], rotateY: [-88, -88, 0, 0] }}
                transition={{
                    duration: durationSeconds,
                    ease: 'easeOut',
                    times: [0, 0.64, 0.78, 1],
                }}
            >
                <Card
                    card={slot.nextCard}
                    size="featured"
                    canBuy={false}
                    theme={theme}
                    className="shadow-2xl"
                    depthLayer={enableThreeCardDepth ? 'flight' : undefined}
                />
            </motion.div>
        </motion.div>
    );
}
