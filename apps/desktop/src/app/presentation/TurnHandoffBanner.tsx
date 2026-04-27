import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import type { TurnHandoffPresentationEvent } from './presentationTypes';
import { getElementRect, getViewportCenter } from './presentationGeometry';
import { createGaussianBlurHaloStyle } from './turnHandoffStyles';
import {
    getPresentationDurationSeconds,
    type PresentationPreviewMode,
} from './presentationPreviewMode';

const TURN_HANDOFF_ANCHOR_SELECTOR = '[data-topbar-turn-core="true"]';
const TURN_HANDOFF_DURATION_SECONDS = 3;
const TURN_HANDOFF_REDUCED_DURATION_SECONDS = 0.26;

const getPlayerAccent = (player: TurnHandoffPresentationEvent['toPlayer']) =>
    player === 'p1'
        ? {
              glow: 'rgba(16, 185, 129, 0.48)',
              soft: 'rgba(16, 185, 129, 0.24)',
              text: 'text-emerald-50',
              ring: 'border-emerald-200/65 shadow-emerald-500/25',
          }
        : {
              glow: 'rgba(59, 130, 246, 0.5)',
              soft: 'rgba(59, 130, 246, 0.24)',
              text: 'text-blue-50',
              ring: 'border-blue-200/65 shadow-blue-500/25',
          };

const getBannerPosition = () => {
    const anchorRect = getElementRect(TURN_HANDOFF_ANCHOR_SELECTOR);

    if (anchorRect) {
        return {
            left: anchorRect.x + anchorRect.width / 2,
            top: anchorRect.y + anchorRect.height + 10,
        };
    }

    const viewportCenter = getViewportCenter();
    return {
        left: viewportCenter.x,
        top: 94,
    };
};

export function TurnHandoffBanner({
    event,
    previewMode,
}: {
    event: TurnHandoffPresentationEvent;
    previewMode?: PresentationPreviewMode;
}) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const incomingAccent = getPlayerAccent(event.toPlayer);
    const position = getBannerPosition();
    const duration = prefersReducedMotion
        ? getPresentationDurationSeconds(TURN_HANDOFF_REDUCED_DURATION_SECONDS, previewMode)
        : getPresentationDurationSeconds(TURN_HANDOFF_DURATION_SECONDS, previewMode);
    const fromLabel = event.fromPlayer.toUpperCase();
    const toLabel = event.toPlayer.toUpperCase();

    return (
        <motion.div
            aria-live="polite"
            data-turn-handoff-banner={event.toPlayer}
            data-turn-handoff-position="topbar"
            data-turn-handoff-from={event.fromPlayer}
            data-turn-handoff-to={event.toPlayer}
            className="pointer-events-none fixed z-[121]"
            style={{
                left: position.left,
                top: position.top,
                transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0, y: prefersReducedMotion ? -4 : -12, scale: 0.96 }}
            animate={{
                opacity: prefersReducedMotion ? [0, 1, 0] : [0, 1, 1, 0],
                y: prefersReducedMotion ? [-4, 0, -2] : [-12, 0, 0, -6],
                scale: prefersReducedMotion ? [0.98, 1, 0.98] : [0.96, 1.02, 1, 0.98],
            }}
            transition={{
                duration,
                ease: [0.16, 1, 0.3, 1],
                times: prefersReducedMotion ? [0, 0.5, 1] : [0, 0.12, 0.88, 1],
            }}
        >
            <motion.div
                aria-hidden="true"
                data-turn-handoff-gaussian-halo="true"
                className="absolute -inset-x-8 -inset-y-5 rounded-full opacity-80"
                style={createGaussianBlurHaloStyle({ color: incomingAccent.soft })}
                animate={prefersReducedMotion ? undefined : { opacity: [0.48, 0.86, 0.48] }}
                transition={
                    prefersReducedMotion
                        ? undefined
                        : { duration: 1.15, repeat: Infinity, ease: 'easeInOut' }
                }
            />
            <motion.div
                className={`relative flex min-w-[300px] items-center justify-center gap-3 border bg-slate-950/82 px-5 py-3 shadow-2xl backdrop-blur-xl ${incomingAccent.text} ${incomingAccent.ring}`}
                style={{
                    borderRadius: 8,
                    boxShadow: `0 16px 46px rgba(0,0,0,0.36), 0 0 26px ${incomingAccent.glow}`,
                }}
                animate={prefersReducedMotion ? undefined : { scale: [1, 1.035, 1] }}
                transition={
                    prefersReducedMotion
                        ? undefined
                        : { duration: 1.15, repeat: Infinity, ease: 'easeInOut' }
                }
            >
                <span className="text-[14px] font-black uppercase tracking-[0.22em] opacity-75">
                    {fromLabel}
                </span>
                <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10"
                    aria-hidden="true"
                >
                    <ArrowRight size={18} strokeWidth={2.8} />
                </span>
                <span className="text-[22px] font-black uppercase leading-none tracking-[0.1em]">
                    {toLabel} Turn
                </span>
            </motion.div>
        </motion.div>
    );
}
