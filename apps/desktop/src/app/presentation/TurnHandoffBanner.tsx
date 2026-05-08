import { ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import type { TurnHandoffPresentationEvent } from './presentationTypes';
import { getElementRect, getRectCenter, getViewportCenter } from './presentationGeometry';
import { createGaussianBlurHaloStyle } from './turnHandoffStyles';
import {
    getPresentationDurationSeconds,
    type PresentationPreviewMode,
} from './presentationPreviewMode';

const TURN_HANDOFF_STAGE_SELECTOR = '[data-testid="desktop-stage-canvas"]';
const TURN_HANDOFF_DURATION_SECONDS = 3;
const TURN_HANDOFF_REDUCED_DURATION_SECONDS = 1.2;

const TURN_HANDOFF_STYLES = `
@keyframes gemduel-turn-handoff-backdrop {
    0% { opacity: 0; }
    12% { opacity: 1; }
    86% { opacity: 0.92; }
    100% { opacity: 0; }
}
@keyframes gemduel-turn-handoff-card {
    0% { opacity: 0; transform: translate3d(0, 18px, 0) scale(0.94); }
    12% { opacity: 1; transform: translate3d(0, 0, 0) scale(1.035); }
    82% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
    100% { opacity: 0; transform: translate3d(0, -8px, 0) scale(0.98); }
}
@keyframes gemduel-turn-handoff-card-reduced {
    0% { opacity: 0; transform: scale(0.99); }
    20% { opacity: 1; transform: scale(1); }
    82% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1); }
}
@keyframes gemduel-turn-handoff-halo {
    0% { opacity: 0.42; transform: scale(0.88); }
    50% { opacity: 0.86; transform: scale(1.08); }
    100% { opacity: 0.42; transform: scale(0.96); }
}
`;

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

const getBannerLayout = () => {
    const stageRect = getElementRect(TURN_HANDOFF_STAGE_SELECTOR);

    if (stageRect) {
        const center = getRectCenter(stageRect);
        return {
            center,
            stageRect,
        };
    }

    const viewportCenter = getViewportCenter();
    return {
        center: viewportCenter,
        stageRect: {
            x: 0,
            y: 0,
            width: typeof window === 'undefined' ? 0 : window.innerWidth,
            height: typeof window === 'undefined' ? 0 : window.innerHeight,
        },
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
    const layout = getBannerLayout();
    const duration = prefersReducedMotion
        ? getPresentationDurationSeconds(TURN_HANDOFF_REDUCED_DURATION_SECONDS, previewMode)
        : getPresentationDurationSeconds(TURN_HANDOFF_DURATION_SECONDS, previewMode);
    const fromLabel = event.fromPlayer.toUpperCase();
    const toLabel = event.toPlayer.toUpperCase();
    const cardAnimationName = prefersReducedMotion
        ? 'gemduel-turn-handoff-card-reduced'
        : 'gemduel-turn-handoff-card';

    return (
        <>
            <style>{TURN_HANDOFF_STYLES}</style>
            <div
                aria-hidden="true"
                data-turn-handoff-overlay="true"
                className="pointer-events-none fixed z-[120]"
                style={{
                    left: layout.stageRect.x,
                    top: layout.stageRect.y,
                    width: layout.stageRect.width,
                    height: layout.stageRect.height,
                    zIndex: previewMode ? 1000 : undefined,
                    background:
                        'radial-gradient(circle at center, rgba(15,23,42,0.36) 0%, rgba(15,23,42,0.2) 34%, rgba(15,23,42,0.04) 68%, transparent 100%)',
                    animation: `gemduel-turn-handoff-backdrop ${duration}s ease-out both`,
                }}
            />
            <div
                aria-live="polite"
                data-turn-handoff-banner={event.toPlayer}
                data-turn-handoff-position="stage-center"
                data-turn-handoff-from={event.fromPlayer}
                data-turn-handoff-to={event.toPlayer}
                className="pointer-events-none fixed z-[121]"
                style={{
                    left: layout.center.x,
                    top: layout.center.y,
                    zIndex: previewMode ? 1001 : undefined,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <div
                    aria-hidden="true"
                    data-turn-handoff-gaussian-halo="true"
                    className="absolute -inset-x-16 -inset-y-10 rounded-full opacity-80"
                    style={{
                        ...createGaussianBlurHaloStyle({ color: incomingAccent.soft }),
                        animation: prefersReducedMotion
                            ? undefined
                            : 'gemduel-turn-handoff-halo 1.15s ease-in-out infinite',
                    }}
                />
                <div
                    className={`relative flex min-w-[520px] flex-col items-center justify-center gap-3 border bg-slate-950/88 px-8 py-6 text-center shadow-2xl backdrop-blur-xl ${incomingAccent.text} ${incomingAccent.ring}`}
                    style={{
                        borderRadius: 8,
                        boxShadow: `0 22px 70px rgba(0,0,0,0.46), 0 0 42px ${incomingAccent.glow}`,
                        animation: `${cardAnimationName} ${duration}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                    }}
                >
                    <div className="flex items-center justify-center gap-3 text-[15px] font-black uppercase tracking-[0.22em] opacity-80">
                        <span>{fromLabel}</span>
                        <span
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10"
                            aria-hidden="true"
                        >
                            <ArrowRight size={18} strokeWidth={2.8} />
                        </span>
                        <span>{toLabel}</span>
                    </div>
                    <div className="text-[42px] font-black uppercase leading-none tracking-[0.08em]">
                        {toLabel} Turn
                    </div>
                </div>
            </div>
        </>
    );
}
