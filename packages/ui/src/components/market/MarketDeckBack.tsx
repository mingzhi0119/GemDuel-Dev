import React from 'react';
import type { CardBackArtwork } from '../card/cardBackArtwork';

const MARKET_DECK_BACK_STYLES = {
    1: {
        frame: 'from-emerald-900 via-slate-900 to-slate-950 border-emerald-300/45',
        glow: 'bg-emerald-400/18',
        accent: 'text-emerald-200',
        ring: 'border-emerald-300/35',
        numeral: 'I',
    },
    2: {
        frame: 'from-amber-900 via-stone-950 to-slate-950 border-amber-300/50',
        glow: 'bg-amber-400/18',
        accent: 'text-amber-100',
        ring: 'border-amber-300/40',
        numeral: 'II',
    },
    3: {
        frame: 'from-indigo-950 via-slate-950 to-black border-violet-300/45',
        glow: 'bg-violet-400/18',
        accent: 'text-violet-100',
        ring: 'border-violet-300/40',
        numeral: 'III',
    },
} as const;

interface MarketDeckBackProps {
    level: 1 | 2 | 3;
    count: number;
    theme: 'light' | 'dark';
    levelLabel: string;
    artwork?: CardBackArtwork;
}

export const MarketDeckBack: React.FC<MarketDeckBackProps> = ({
    level,
    count,
    theme,
    levelLabel,
    artwork,
}) => {
    const style = MARKET_DECK_BACK_STYLES[level];

    if (artwork) {
        return (
            <>
                <img
                    src={artwork.path}
                    alt=""
                    aria-hidden="true"
                    data-market-deck-back-artwork={level}
                    data-card-back-variant={artwork.variant}
                    data-market-deck-back-img="true"
                    draggable={false}
                    decoding="async"
                    className="pointer-events-none select-none absolute inset-0 h-full w-full object-cover"
                    style={{
                        zIndex: 5,
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: 6,
                        background:
                            theme === 'dark'
                                ? 'linear-gradient(180deg, rgba(2,6,23,0.04) 0%, rgba(2,6,23,0.08) 54%, rgba(2,6,23,0.16) 100%)'
                                : 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(15,23,42,0.04) 54%, rgba(15,23,42,0.20) 100%)',
                    }}
                />
                <div
                    className={`absolute inset-2 rounded-md border ${style.ring}`}
                    style={{ zIndex: 7 }}
                />

                <div className="absolute inset-x-2 bottom-3 z-10 flex flex-col items-center gap-1">
                    <div
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] ${
                            theme === 'dark'
                                ? 'border-white/15 bg-black/45 text-slate-100'
                                : 'border-white/40 bg-slate-950/35 text-white'
                        }`}
                    >
                        {levelLabel}
                    </div>
                    <div
                        data-market-deck-count={level}
                        data-count={count}
                        className={`rounded-full border px-3 py-0.5 text-[12px] font-black tabular-nums ${
                            theme === 'dark'
                                ? 'border-white/15 bg-black/50 text-slate-100'
                                : 'border-white/40 bg-slate-950/35 text-white'
                        }`}
                    >
                        {count}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className={`absolute inset-0 bg-gradient-to-br ${style.frame}`} />
            <div className={`absolute inset-3 rounded-md border ${style.ring}`} />
            <div
                className={`absolute left-1/2 top-6 h-12 w-12 -translate-x-1/2 rounded-full blur-xl ${style.glow}`}
            />
            <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(45deg,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:18px_18px]" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border text-[15px] font-black tracking-widest shadow-inner ${style.ring} ${style.accent}`}
                >
                    {style.numeral}
                </div>
                <div
                    className={`text-[12px] font-black uppercase tracking-[0.18em] ${
                        theme === 'dark' ? 'text-slate-100' : 'text-stone-100'
                    }`}
                >
                    {levelLabel}
                </div>
                <div
                    data-market-deck-count={level}
                    data-count={count}
                    className={`rounded-full border px-3 py-0.5 text-[12px] font-black tabular-nums ${
                        theme === 'dark'
                            ? 'border-white/15 bg-black/30 text-slate-100'
                            : 'border-white/25 bg-black/25 text-white'
                    }`}
                >
                    {count}
                </div>
            </div>
        </>
    );
};
