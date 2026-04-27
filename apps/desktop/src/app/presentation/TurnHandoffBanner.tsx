import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import type { TurnHandoffPresentationEvent } from './presentationTypes';

const TURN_HANDOFF_STYLES = `
@keyframes gemduel-turn-handoff {
    0% { opacity: 0; transform: translate3d(-50%, -12px, 0) scale(0.96); }
    24% { opacity: 1; transform: translate3d(-50%, 0, 0) scale(1.02); }
    76% { opacity: 1; transform: translate3d(-50%, 0, 0) scale(1); }
    100% { opacity: 0; transform: translate3d(-50%, -8px, 0) scale(1); }
}
@keyframes gemduel-turn-handoff-reduced {
    0% { opacity: 0; transform: translate3d(-50%, 0, 0) scale(0.98); }
    50% { opacity: 0.92; transform: translate3d(-50%, 0, 0) scale(1); }
    100% { opacity: 0; transform: translate3d(-50%, 0, 0) scale(1); }
}
`;

export function TurnHandoffBanner({ event }: { event: TurnHandoffPresentationEvent }) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const isP1 = event.toPlayer === 'p1';
    const colorClass = isP1
        ? 'border-emerald-200/50 bg-emerald-500/18 text-emerald-50 shadow-emerald-500/24'
        : 'border-blue-200/50 bg-blue-500/18 text-blue-50 shadow-blue-500/24';

    const style = {
        animation: `${prefersReducedMotion ? 'gemduel-turn-handoff-reduced' : 'gemduel-turn-handoff'} ${
            prefersReducedMotion ? 180 : 620
        }ms ease-out both`,
    } as CSSProperties;

    return (
        <div
            aria-live="polite"
            data-turn-handoff-banner={event.toPlayer}
            className="pointer-events-none fixed left-1/2 top-[132px] z-[121]"
            style={style}
        >
            <style>{TURN_HANDOFF_STYLES}</style>
            <div
                className={`flex items-center gap-3 rounded-full border px-5 py-2.5 shadow-2xl backdrop-blur-xl ${colorClass}`}
            >
                <span className="text-[12px] font-black uppercase tracking-[0.22em] opacity-80">
                    {event.fromPlayer.toUpperCase()}
                </span>
                <ArrowRight size={18} strokeWidth={2.6} />
                <span className="text-[18px] font-black uppercase tracking-[0.18em]">
                    {event.toPlayer.toUpperCase()} Turn
                </span>
            </div>
        </div>
    );
}
