import type { CSSProperties } from 'react';
import { Crown, HandCoins, MessageSquare, ScrollText, Sparkles, Swords, Zap } from 'lucide-react';
import { usePrefersReducedMotion } from '@gemduel/ui/components/animation';
import type { AbilityCalloutPresentationEvent } from './presentationTypes';
import { getElementRect, getRectCenter } from './presentationGeometry';

const ABILITY_CALLOUT_STYLES = `
@keyframes gemduel-ability-callout {
    0% { opacity: 0; transform: translate3d(-50%, 12px, 0) scale(0.94); }
    18% { opacity: 1; transform: translate3d(-50%, 0, 0) scale(1.03); }
    78% { opacity: 1; transform: translate3d(-50%, -4px, 0) scale(1); }
    100% { opacity: 0; transform: translate3d(-50%, -10px, 0) scale(1); }
}
@keyframes gemduel-ability-callout-reduced {
    0% { opacity: 0; transform: translate3d(-50%, 0, 0) scale(0.98); }
    50% { opacity: 0.9; transform: translate3d(-50%, 0, 0) scale(1); }
    100% { opacity: 0; transform: translate3d(-50%, 0, 0) scale(1); }
}
`;

const CALLOUT_COPY: Record<
    AbilityCalloutPresentationEvent['callout'],
    { title: string; detail: string; tone: string; Icon: typeof Sparkles }
> = {
    'bonus-gem': {
        title: 'Bonus Gem',
        detail: 'Choose a bonus',
        tone: 'emerald',
        Icon: Sparkles,
    },
    steal: {
        title: 'Steal',
        detail: 'Take from opponent',
        tone: 'rose',
        Icon: Swords,
    },
    privilege: {
        title: 'Privilege',
        detail: 'Spend a scroll',
        tone: 'amber',
        Icon: ScrollText,
    },
    'extra-turn': {
        title: 'Extra Turn',
        detail: 'Keeps initiative',
        tone: 'cyan',
        Icon: Zap,
    },
    'ability-resolution': {
        title: 'Ability',
        detail: 'Resolving effect',
        tone: 'violet',
        Icon: Sparkles,
    },
    'privilege-gain': {
        title: 'Privilege',
        detail: 'Scroll changed',
        tone: 'amber',
        Icon: ScrollText,
    },
    crown: {
        title: 'Crown',
        detail: 'Royal progress',
        tone: 'yellow',
        Icon: Crown,
    },
    extortion: {
        title: 'Extortion',
        detail: 'Gem stolen',
        tone: 'fuchsia',
        Icon: HandCoins,
    },
    toast: {
        title: 'Effect',
        detail: 'Rule message',
        tone: 'slate',
        Icon: MessageSquare,
    },
    buff: {
        title: 'Buff',
        detail: 'Modifier triggered',
        tone: 'violet',
        Icon: Sparkles,
    },
};

const TONE_CLASS: Record<string, string> = {
    emerald: 'border-emerald-300/45 bg-emerald-500/16 text-emerald-100 shadow-emerald-500/28',
    rose: 'border-rose-300/45 bg-rose-500/16 text-rose-100 shadow-rose-500/28',
    amber: 'border-amber-300/50 bg-amber-500/16 text-amber-100 shadow-amber-500/28',
    cyan: 'border-cyan-300/45 bg-cyan-500/16 text-cyan-100 shadow-cyan-500/28',
    violet: 'border-violet-300/45 bg-violet-500/16 text-violet-100 shadow-violet-500/28',
    yellow: 'border-yellow-200/55 bg-yellow-400/18 text-yellow-50 shadow-yellow-500/30',
    fuchsia: 'border-fuchsia-300/45 bg-fuchsia-500/16 text-fuchsia-100 shadow-fuchsia-500/28',
    slate: 'border-slate-200/35 bg-slate-900/72 text-slate-100 shadow-slate-700/24',
};

export function AbilityCalloutStack({
    event,
    theme,
}: {
    event: AbilityCalloutPresentationEvent;
    theme: 'light' | 'dark';
}) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const config = CALLOUT_COPY[event.callout];
    const playerRect = getElementRect(`[data-player-zone="${event.player}"]`);
    const center = playerRect
        ? getRectCenter(playerRect)
        : { x: typeof window === 'undefined' ? 0 : window.innerWidth / 2, y: 220 };
    const top = playerRect ? Math.max(132, playerRect.y - 58) : 154;
    const Icon = config.Icon;
    const detail = event.message ?? config.detail;
    const playerTint = event.player === 'p1' ? 'before:bg-emerald-300/70' : 'before:bg-blue-300/70';

    const style = {
        left: center.x,
        top,
        animation: `${prefersReducedMotion ? 'gemduel-ability-callout-reduced' : 'gemduel-ability-callout'} ${
            prefersReducedMotion ? 240 : 1050
        }ms ease-out both`,
    } as CSSProperties;

    return (
        <div
            aria-live="polite"
            data-ability-callout={event.callout}
            data-ability-callout-player={event.player}
            className="fixed z-[121] pointer-events-none"
            style={style}
        >
            <style>{ABILITY_CALLOUT_STYLES}</style>
            <div
                className={`relative flex min-w-[210px] max-w-[360px] items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl before:absolute before:left-0 before:top-0 before:h-full before:w-1 ${TONE_CLASS[config.tone]} ${playerTint} ${
                    theme === 'light' ? 'bg-white/88 text-slate-900' : ''
                }`}
            >
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/14 ring-1 ring-white/18">
                    <Icon size={23} strokeWidth={2.3} />
                </div>
                <div className="relative z-10 min-w-0">
                    <div className="text-[12px] font-black uppercase tracking-[0.22em]">
                        {event.player.toUpperCase()} {config.title}
                    </div>
                    <div className="truncate text-[13px] font-bold opacity-82">{detail}</div>
                </div>
            </div>
        </div>
    );
}
