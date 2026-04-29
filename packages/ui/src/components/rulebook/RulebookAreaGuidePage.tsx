import React from 'react';
import type { AppLocale } from '@gemduel/shared';
import { UI_ICON_ARTWORK } from '../uiIconArtwork';

type AreaGuideKind = 'player_zone' | 'center_area' | 'topbar';

interface RulebookAreaGuidePageProps {
    kind: AreaGuideKind;
    lang: AppLocale;
    theme?: 'light' | 'dark';
}

const copy = {
    player_zone: {
        title: { en: 'Player Zone Figure', zh: '玩家区图示' },
        surfaceAlt: { en: 'Player zone surface', zh: '玩家区界面' },
        labels: {
            reserved: { en: 'Reserve', zh: '保留区' },
            tableau: { en: 'Tableau / Library', zh: '牌库 / 已购卡' },
            buffs: { en: 'Buffs (Rogue Only)', zh: 'Buffs（肉鸽限定）' },
            scrolls: { en: 'Scrolls', zh: '特权卷轴' },
            gems: { en: 'Gems', zh: '宝石资源' },
        },
    },
    center_area: {
        title: { en: 'Main Field Figure', zh: '主战区图示' },
        surfaceAlt: { en: 'Main field surface', zh: '主战区界面' },
        labels: {
            market: { en: 'Market', zh: '市场' },
            board: { en: 'Board', zh: '盘面' },
            royal: { en: 'Royal Area', zh: '皇室区' },
        },
    },
    topbar: {
        title: { en: 'Battle Status Bar Figure', zh: '战况栏图示' },
        labels: {
            p1Crowns: { en: 'P1 Crowns / Goals', zh: 'P1 皇冠 / 目标' },
            p1Points: { en: 'P1 Points / Goal', zh: 'P1 分数 / 目标' },
            turnCounts: { en: 'Turn Counts', zh: '回合计数' },
            p2Crowns: { en: 'P2 Crowns / Goals', zh: 'P2 皇冠 / 目标' },
            p2Points: { en: 'P2 Points / Goal', zh: 'P2 分数 / 目标' },
        },
    },
} as const;

const labelClass =
    'rounded border border-amber-200/40 bg-slate-950/80 px-4 py-2 text-lg font-black uppercase tracking-[0.12em] text-amber-100 shadow-[0_10px_26px_rgba(0,0,0,0.34)]';

const MiniCard: React.FC<{ src: string; label: string; className?: string }> = ({
    src,
    label,
    className = 'h-[152px] w-[114px]',
}) => (
    <img
        src={src}
        alt={label}
        draggable={false}
        className={`${className} rounded-md border border-white/15 object-cover shadow-2xl`}
    />
);

const PlayerZoneFigure: React.FC<{ lang: AppLocale }> = ({ lang }) => (
    <section
        data-rulebook-area-guide="player-zone"
        className="rounded-lg border border-white/10 bg-white/[0.045] p-5"
    >
        <h4 className="mb-4 text-[22px] font-black uppercase tracking-[0.18em] text-amber-100 md:text-[25px]">
            {copy.player_zone.title[lang]}
        </h4>
        <div className="relative min-h-[460px] overflow-hidden rounded-lg border border-amber-100/15 bg-slate-950 shadow-[0_18px_48px_rgba(0,0,0,0.36)]">
            <img
                src="/assets/surfaces/anime-themes/royal-luxury/dark/player-zone.png"
                alt={copy.player_zone.surfaceAlt[lang]}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/15 to-slate-950/70" />
            <div
                data-rulebook-player-zone-layout="reserve-full-height"
                className="relative z-10 grid h-full min-h-[460px] grid-cols-[0.95fr_1.35fr_0.9fr] gap-6 p-6"
            >
                <div
                    data-rulebook-area-hotspot="reserved"
                    data-rulebook-reserve-card-size="large"
                    className="flex h-full flex-col gap-4 rounded-lg border border-sky-300/45 bg-sky-950/34 p-4"
                >
                    <span className={labelClass}>{copy.player_zone.labels.reserved[lang]}</span>
                    <div className="flex min-h-0 flex-1 items-center justify-center -space-x-14">
                        <MiniCard
                            src="/assets/cards/151-bk.png"
                            label="Reserved card"
                            className="h-[236px] w-[177px]"
                        />
                        <MiniCard
                            src="/assets/cards/373-jo.png"
                            label="Reserved card"
                            className="h-[236px] w-[177px]"
                        />
                    </div>
                </div>
                <div className="flex min-h-0 flex-col gap-5">
                    <div
                        data-rulebook-area-hotspot="gems"
                        className="rounded-lg border border-white/10 bg-slate-950/72 p-4"
                    >
                        <span className={labelClass}>{copy.player_zone.labels.gems[lang]}</span>
                        <div className="mt-5 grid grid-cols-7 gap-3">
                            {[
                                'bg-blue-500',
                                'bg-white',
                                'bg-emerald-500',
                                'bg-slate-900',
                                'bg-red-500',
                                'bg-pink-300',
                                'bg-yellow-400',
                            ].map((color, index) => (
                                <span
                                    key={`${color}-${index}`}
                                    className={`h-12 w-12 rounded-full border border-white/40 shadow-lg ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div
                        data-rulebook-area-hotspot="tableau"
                        className="flex min-h-0 flex-1 flex-col gap-4"
                    >
                        <span className={labelClass}>{copy.player_zone.labels.tableau[lang]}</span>
                        <div className="grid min-h-0 flex-1 grid-cols-6 gap-3 rounded-lg border border-white/10 bg-slate-950/65 p-4">
                            {['red', 'green', 'blue', 'white', 'black', 'pure'].map((color) => (
                                <div
                                    key={color}
                                    className="flex min-h-[150px] items-center justify-center rounded border border-white/10 bg-white/[0.055] text-3xl font-black uppercase text-slate-100"
                                >
                                    {color === 'pure' ? 'P' : color.slice(0, 1)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex min-h-0 flex-col gap-5">
                    <div
                        data-rulebook-area-hotspot="buffs"
                        className="flex min-h-0 flex-1 flex-col rounded-lg border border-violet-300/35 bg-slate-950/72 p-4"
                    >
                        <span className={labelClass}>{copy.player_zone.labels.buffs[lang]}</span>
                        <div className="mt-5 grid flex-1 grid-cols-2 gap-4">
                            {['II', 'III'].map((tier) => (
                                <div
                                    key={tier}
                                    className="flex min-h-[116px] items-center justify-center rounded-lg border border-violet-200/25 bg-violet-500/18 text-3xl font-black text-violet-100 shadow-lg"
                                >
                                    {tier}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        data-rulebook-area-hotspot="scrolls"
                        className="rounded-lg border border-amber-200/30 bg-slate-950/72 p-4"
                    >
                        <span className={labelClass}>{copy.player_zone.labels.scrolls[lang]}</span>
                        <div className="mt-5 flex gap-3">
                            {[1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className="h-20 w-12 rounded bg-gradient-to-b from-amber-100 to-amber-500 shadow-lg"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const CenterAreaFigure: React.FC<{ lang: AppLocale }> = ({ lang }) => (
    <section
        data-rulebook-area-guide="main-field"
        className="rounded-lg border border-white/10 bg-white/[0.045] p-5"
    >
        <h4 className="mb-4 text-[22px] font-black uppercase tracking-[0.18em] text-amber-100 md:text-[25px]">
            {copy.center_area.title[lang]}
        </h4>
        <div className="relative min-h-[460px] overflow-hidden rounded-lg border border-amber-100/15 bg-slate-950 shadow-[0_18px_48px_rgba(0,0,0,0.36)]">
            <img
                src="/assets/surfaces/dark/tablecloth-playmat.png"
                alt={copy.center_area.surfaceAlt[lang]}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-slate-950/35" />
            <div className="relative z-10 grid min-h-[460px] grid-cols-[1.12fr_1fr_1.02fr] gap-6 p-6">
                <div
                    data-rulebook-area-hotspot="market"
                    data-rulebook-market-layout="single-l3-plus-deck"
                    className="flex h-full flex-col gap-4 rounded-lg border border-white/10 bg-slate-950/68 p-5"
                >
                    <span className={labelClass}>{copy.center_area.labels.market[lang]}</span>
                    <div className="flex min-h-0 flex-1 items-center justify-center gap-5">
                        <MiniCard
                            src="/assets/cards/373-jo.png"
                            label="Level 3 market card"
                            className="h-[284px] w-[213px]"
                        />
                        <MiniCard
                            src="/assets/surfaces/anime-themes/royal-luxury/dark/market-card-back-l3.png"
                            label="Level 3 market deck"
                            className="h-[284px] w-[213px]"
                        />
                    </div>
                </div>
                <div
                    data-rulebook-area-hotspot="board"
                    className="flex flex-col items-center justify-center gap-4 rounded-lg border border-white/10 bg-slate-950/68 p-5"
                >
                    <span className={labelClass}>{copy.center_area.labels.board[lang]}</span>
                    <div className="relative h-[276px] w-[276px] overflow-hidden rounded-xl border border-white/10">
                        <img
                            src="/assets/surfaces/anime-themes/royal-luxury/dark/gem-panel.png"
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="relative z-10 grid h-full w-full grid-cols-5 gap-2 p-8">
                            {[
                                'bg-blue-500',
                                'bg-white',
                                'bg-emerald-500',
                                'bg-slate-900',
                                'bg-red-500',
                                'bg-pink-300',
                                'bg-yellow-400',
                                'bg-blue-500',
                                'bg-white',
                                'bg-emerald-500',
                                'bg-slate-900',
                                'bg-red-500',
                                'bg-pink-300',
                                'bg-yellow-400',
                                'bg-blue-500',
                                'bg-white',
                                'bg-emerald-500',
                                'bg-slate-900',
                                'bg-red-500',
                                'bg-pink-300',
                                'bg-yellow-400',
                                'bg-blue-500',
                                'bg-white',
                                'bg-emerald-500',
                                'bg-red-500',
                            ].map((color, index) => (
                                <span
                                    key={`${color}-${index}`}
                                    className={`h-8 w-8 rounded-full border border-white/50 shadow-lg ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div
                    data-rulebook-area-hotspot="royal-area"
                    data-rulebook-royal-layout="single-card-plus-back"
                    className="flex h-full flex-col gap-4 rounded-lg border border-white/10 bg-slate-950/68 p-5"
                >
                    <span className={labelClass}>{copy.center_area.labels.royal[lang]}</span>
                    <div className="flex min-h-0 flex-1 items-center justify-center gap-5">
                        <MiniCard
                            src="/assets/cards/r92-ro.png"
                            label="Royal card"
                            className="h-[284px] w-[213px]"
                        />
                        <MiniCard
                            src="/assets/surfaces/anime-themes/royal-luxury/dark/royal-card-back.png"
                            label="Royal deck"
                            className="h-[284px] w-[213px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const MetricIcon: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
    <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-14 w-14 shrink-0 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.5)]"
    />
);

const TopbarFigure: React.FC<{ lang: AppLocale }> = ({ lang }) => (
    <section
        data-rulebook-area-guide="topbar"
        className="rounded-lg border border-white/10 bg-white/[0.045] p-5"
    >
        <h4 className="mb-4 text-[22px] font-black uppercase tracking-[0.18em] text-amber-100 md:text-[25px]">
            {copy.topbar.title[lang]}
        </h4>
        <div className="relative overflow-hidden rounded-lg border border-amber-100/15 bg-slate-950 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.36)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.18),transparent_44%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]" />
            <div className="relative z-10">
                <div
                    data-rulebook-topbar-layout="clear-columns"
                    className="grid min-h-[136px] grid-cols-[1fr_1fr_1.18fr_1fr_1fr] items-stretch gap-3 rounded-lg border border-sky-300/45 bg-sky-950/35 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
                >
                    <div className="flex items-center justify-center gap-3 rounded border border-white/10 bg-slate-950/70 px-4">
                        <MetricIcon src={UI_ICON_ARTWORK.topbarCrown} alt="" />
                        <div className="text-right">
                            <div className="text-[44px] font-black leading-none text-amber-200">
                                3
                            </div>
                            <div className="text-lg font-black text-slate-100">/10</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 rounded border border-white/10 bg-slate-950/70 px-4">
                        <MetricIcon src={UI_ICON_ARTWORK.topbarPoints} alt="" />
                        <div className="text-right">
                            <div className="text-[44px] font-black leading-none text-slate-100">
                                14
                            </div>
                            <div className="text-lg font-black text-slate-100">/20</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center rounded border border-emerald-300/30 bg-slate-950/75 px-5 text-center">
                        <div className="border-r border-white/10 pr-4">
                            <div className="text-xl font-black text-emerald-300">P1</div>
                            <div className="text-[36px] font-black leading-none text-emerald-200">
                                5
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-200">
                                Turn
                            </div>
                        </div>
                        <div className="pl-4">
                            <div className="text-xl font-black text-sky-300">P2</div>
                            <div className="text-[36px] font-black leading-none text-sky-200">
                                4
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-200">
                                Turn
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 rounded border border-white/10 bg-slate-950/70 px-4">
                        <MetricIcon src={UI_ICON_ARTWORK.topbarCrown} alt="" />
                        <div className="text-right">
                            <div className="text-[44px] font-black leading-none text-amber-200">
                                1
                            </div>
                            <div className="text-lg font-black text-slate-100">/10</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 rounded border border-white/10 bg-slate-950/70 px-4">
                        <MetricIcon src={UI_ICON_ARTWORK.topbarPoints} alt="" />
                        <div className="text-right">
                            <div className="text-[44px] font-black leading-none text-slate-100">
                                9
                            </div>
                            <div className="text-lg font-black text-slate-100">/20</div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-5 gap-4">
                    {[
                        ['p1-crowns', copy.topbar.labels.p1Crowns[lang]],
                        ['p1-points', copy.topbar.labels.p1Points[lang]],
                        ['turn-counts', copy.topbar.labels.turnCounts[lang]],
                        ['p2-crowns', copy.topbar.labels.p2Crowns[lang]],
                        ['p2-points', copy.topbar.labels.p2Points[lang]],
                    ].map(([id, label]) => (
                        <span key={id} data-rulebook-area-hotspot={id} className={labelClass}>
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export const RulebookAreaGuidePage: React.FC<RulebookAreaGuidePageProps> = ({ kind, lang }) => {
    if (kind === 'player_zone') {
        return <PlayerZoneFigure lang={lang} />;
    }

    if (kind === 'topbar') {
        return <TopbarFigure lang={lang} />;
    }

    return <CenterAreaFigure lang={lang} />;
};
