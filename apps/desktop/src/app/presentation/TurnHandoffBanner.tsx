import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import type { PlayerKey } from '@gemduel/shared/types';
import type {
    AbilityCalloutPresentationEvent,
    TurnHandoffPresentationEvent,
} from './presentationTypes';
import { getElementRect, getRectCenter, getViewportCenter } from './presentationGeometry';
import { createGaussianBlurHaloStyle } from './turnHandoffStyles';
import {
    getPresentationDurationSeconds,
    type PresentationPreviewMode,
} from './presentationPreviewMode';

const TURN_HANDOFF_STAGE_SELECTOR = '[data-testid="desktop-stage-canvas"]';
const TURN_HANDOFF_TOPBAR_SELECTOR = '[data-presentation-anchor="topbar"]';
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

const getPlayerAccent = (player: PlayerKey) =>
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
    const topBarRect = getElementRect(TURN_HANDOFF_TOPBAR_SELECTOR);

    if (stageRect) {
        const center = topBarRect ? getRectCenter(topBarRect) : getRectCenter(stageRect);
        const topOffset = Math.max(2, stageRect.height * 0.004);
        const top = topBarRect
            ? topBarRect.y + topBarRect.height + topOffset
            : stageRect.y + Math.max(32, stageRect.height * 0.055);

        return {
            center: {
                x: center.x,
                y: top,
            },
            stageRect,
            width: Math.min(340, Math.max(230, stageRect.width * 0.28)),
        };
    }

    const viewportCenter = getViewportCenter();
    return {
        center: {
            x: viewportCenter.x,
            y: Math.max(48, viewportCenter.y * 0.18),
        },
        stageRect: {
            x: 0,
            y: 0,
            width: typeof window === 'undefined' ? 0 : window.innerWidth,
            height: typeof window === 'undefined' ? 0 : window.innerHeight,
        },
        width: 260,
    };
};

function TurnStatusBannerFrame({
    player,
    title,
    meta,
    previewMode,
    dataAttributes,
}: {
    player: PlayerKey;
    title: string;
    meta: ReactNode;
    previewMode?: PresentationPreviewMode;
    dataAttributes: Record<string, string>;
}) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const incomingAccent = getPlayerAccent(player);
    const layout = getBannerLayout();
    const duration = prefersReducedMotion
        ? getPresentationDurationSeconds(TURN_HANDOFF_REDUCED_DURATION_SECONDS, previewMode)
        : getPresentationDurationSeconds(TURN_HANDOFF_DURATION_SECONDS, previewMode);
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
                    background: 'transparent',
                    animation: `gemduel-turn-handoff-backdrop ${duration}s ease-out both`,
                }}
            />
            <div
                aria-live="polite"
                {...dataAttributes}
                className="pointer-events-none fixed z-[121]"
                style={{
                    left: layout.center.x,
                    top: layout.center.y,
                    width: layout.width,
                    zIndex: previewMode ? 1001 : undefined,
                    transform: 'translateX(-50%)',
                }}
            >
                <div
                    aria-hidden="true"
                    data-turn-handoff-gaussian-halo="true"
                    className="absolute -inset-x-8 -inset-y-3 rounded-full opacity-75"
                    style={{
                        ...createGaussianBlurHaloStyle({ color: incomingAccent.soft }),
                        animation: `${cardAnimationName} ${duration}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                    }}
                />
                <div
                    className={`relative flex w-full items-center justify-center gap-2 overflow-hidden border bg-slate-950/86 px-3 py-1.5 text-center shadow-xl backdrop-blur-lg ${incomingAccent.text} ${incomingAccent.ring}`}
                    style={{
                        borderRadius: 8,
                        boxShadow: `0 12px 34px rgba(0,0,0,0.38), 0 0 24px ${incomingAccent.glow}`,
                        animation: `${cardAnimationName} ${duration}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                    }}
                >
                    {meta ? (
                        <div className="flex shrink-0 items-center justify-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] opacity-80">
                            {meta}
                        </div>
                    ) : null}
                    <div className="min-w-0 whitespace-nowrap text-[20px] font-black uppercase leading-none tracking-[0.04em]">
                        {title}
                    </div>
                </div>
            </div>
        </>
    );
}

export function TurnHandoffBanner({
    event,
    previewMode,
}: {
    event: TurnHandoffPresentationEvent;
    previewMode?: PresentationPreviewMode;
}) {
    const fromLabel = event.fromPlayer.toUpperCase();
    const toLabel = event.toPlayer.toUpperCase();

    return (
        <TurnStatusBannerFrame
            player={event.toPlayer}
            title={`${toLabel} Turn`}
            previewMode={previewMode}
            dataAttributes={{
                'data-turn-handoff-banner': event.toPlayer,
                'data-turn-handoff-position': 'topbar-under-center',
                'data-turn-handoff-from': event.fromPlayer,
                'data-turn-handoff-to': event.toPlayer,
            }}
            meta={
                <>
                    <span>{fromLabel}</span>
                    <span
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10"
                        aria-hidden="true"
                    >
                        <ArrowRight size={13} strokeWidth={2.8} />
                    </span>
                    <span>{toLabel}</span>
                </>
            }
        />
    );
}

export function ExtraTurnBanner({
    event,
    previewMode,
}: {
    event: AbilityCalloutPresentationEvent;
    previewMode?: PresentationPreviewMode;
}) {
    const playerLabel = event.player.toUpperCase();

    return (
        <TurnStatusBannerFrame
            player={event.player}
            title={`${playerLabel} Extra Turn`}
            previewMode={previewMode}
            dataAttributes={{
                'data-extra-turn-banner': event.player,
                'data-extra-turn-position': 'topbar-under-center',
            }}
            meta={null}
        />
    );
}
