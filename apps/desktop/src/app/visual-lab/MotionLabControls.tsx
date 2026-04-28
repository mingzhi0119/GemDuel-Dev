import type { GemColor, PlayerKey } from '@gemduel/shared/types';
import type { PresentationEvent } from '../presentation/presentationTypes';
import { SurfaceLabSelect } from './SurfaceLabSelect';
import {
    SURFACE_LAB_MOTION_EVENT_TYPES,
    type SurfaceLabMotionEventType,
    type SurfaceLabMotionOptions,
} from './motionLabEvents';

const GEM_COLOR_OPTIONS: GemColor[] = ['blue', 'white', 'green', 'black', 'red', 'pearl', 'gold'];
const CALLOUT_OPTIONS: SurfaceLabMotionOptions['callout'][] = [
    'bonus-gem',
    'steal',
    'privilege',
    'extra-turn',
    'ability-resolution',
    'privilege-gain',
    'crown',
    'extortion',
    'toast',
    'buff',
];

export function MotionLabControls({
    activeEvent,
    motionType,
    setMotionType,
    motionOptions,
    setMotionOptions,
    holdRoyalIntro,
    setHoldRoyalIntro,
    onTrigger,
    onRepeat,
    onClear,
}: {
    activeEvent: PresentationEvent | null;
    motionType: SurfaceLabMotionEventType;
    setMotionType: (type: SurfaceLabMotionEventType) => void;
    motionOptions: SurfaceLabMotionOptions;
    setMotionOptions: (options: SurfaceLabMotionOptions) => void;
    holdRoyalIntro: boolean;
    setHoldRoyalIntro: (value: boolean) => void;
    onTrigger: () => void;
    onRepeat: () => void;
    onClear: () => void;
}) {
    return (
        <section className="flex flex-col gap-3 border-t border-slate-700 pt-3">
            <div className="text-[12px] font-black uppercase tracking-[0.2em] text-amber-100">
                Motion Trigger
            </div>
            <SurfaceLabSelect
                label="Event"
                value={motionType}
                options={SURFACE_LAB_MOTION_EVENT_TYPES.map((type) => type)}
                onChange={(value) => setMotionType(value as SurfaceLabMotionEventType)}
            />
            <div className="grid grid-cols-2 gap-2">
                <SurfaceLabSelect
                    label="Player"
                    value={motionOptions.player}
                    options={['p1', 'p2']}
                    onChange={(value) =>
                        setMotionOptions({ ...motionOptions, player: value as PlayerKey })
                    }
                />
                <SurfaceLabSelect
                    label="Gem"
                    value={motionOptions.gemColor}
                    options={GEM_COLOR_OPTIONS}
                    onChange={(value) =>
                        setMotionOptions({ ...motionOptions, gemColor: value as GemColor })
                    }
                />
                <SurfaceLabSelect
                    label="Market L"
                    value={String(motionOptions.marketLevel)}
                    options={['1', '2', '3']}
                    onChange={(value) =>
                        setMotionOptions({
                            ...motionOptions,
                            marketLevel: Number(value) as 1 | 2 | 3,
                        })
                    }
                />
                <SurfaceLabSelect
                    label="Deck L"
                    value={String(motionOptions.deckLevel)}
                    options={['1', '2', '3']}
                    onChange={(value) =>
                        setMotionOptions({
                            ...motionOptions,
                            deckLevel: Number(value) as 1 | 2 | 3,
                        })
                    }
                />
                <SurfaceLabSelect
                    label="Cell row"
                    value={String(motionOptions.row)}
                    options={['0', '1', '2', '3', '4']}
                    onChange={(value) => setMotionOptions({ ...motionOptions, row: Number(value) })}
                />
                <SurfaceLabSelect
                    label="Cell col"
                    value={String(motionOptions.col)}
                    options={['0', '1', '2', '3', '4']}
                    onChange={(value) => setMotionOptions({ ...motionOptions, col: Number(value) })}
                />
                <SurfaceLabSelect
                    label="Callout"
                    value={motionOptions.callout}
                    options={CALLOUT_OPTIONS}
                    onChange={(value) =>
                        setMotionOptions({
                            ...motionOptions,
                            callout: value as SurfaceLabMotionOptions['callout'],
                        })
                    }
                />
                <SurfaceLabSelect
                    label="Milestone"
                    value={String(motionOptions.milestone)}
                    options={['3', '6', 'royal-envoy', 'forced']}
                    onChange={(value) =>
                        setMotionOptions({
                            ...motionOptions,
                            milestone:
                                value === '3' || value === '6'
                                    ? (Number(value) as 3 | 6)
                                    : (value as SurfaceLabMotionOptions['milestone']),
                        })
                    }
                />
            </div>
            <label className="flex flex-col gap-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
                <span>Message</span>
                <input
                    value={motionOptions.message}
                    onChange={(event) =>
                        setMotionOptions({ ...motionOptions, message: event.currentTarget.value })
                    }
                    className="min-h-9 rounded-md border border-slate-600 bg-slate-950 px-2 text-[12px] font-bold normal-case tracking-normal text-slate-100 outline-none focus:border-cyan-300"
                />
            </label>
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-300">
                <input
                    type="checkbox"
                    checked={holdRoyalIntro}
                    onChange={(event) => setHoldRoyalIntro(event.currentTarget.checked)}
                />
                Hold royal intro
            </label>
            <div className="grid grid-cols-3 gap-2">
                <button
                    type="button"
                    className="rounded-md border border-cyan-300 bg-cyan-300/12 px-2 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-cyan-100"
                    onClick={onTrigger}
                >
                    Trigger
                </button>
                <button
                    type="button"
                    className="rounded-md border border-slate-600 px-2 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-200"
                    onClick={onRepeat}
                >
                    Repeat
                </button>
                <button
                    type="button"
                    className="rounded-md border border-slate-600 px-2 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-200"
                    onClick={onClear}
                >
                    Clear
                </button>
            </div>
            <div className="text-[11px] text-slate-400">
                Active:{' '}
                <span className="font-mono text-slate-100">
                    {activeEvent ? `${activeEvent.type} / ${activeEvent.id}` : 'none'}
                </span>
            </div>
        </section>
    );
}
