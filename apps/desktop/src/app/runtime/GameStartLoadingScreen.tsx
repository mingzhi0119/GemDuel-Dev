import type { GameMode } from '@gemduel/shared/types';

interface GameStartLoadingScreenProps {
    loaded: number;
    total: number;
    failed: number;
    mode: GameMode;
    useBuffs: boolean;
    locale: 'en' | 'zh';
    phase: 'preloading' | 'mounting';
}

const getPercent = (loaded: number, total: number): number =>
    total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 100;

const getModeLabel = (useBuffs: boolean, locale: 'en' | 'zh'): string => {
    if (locale === 'zh') {
        return useBuffs ? '肉鸽' : '经典';
    }

    return useBuffs ? 'Roguelike' : 'Classic';
};

const getOpponentLabel = (mode: GameMode, locale: 'en' | 'zh'): string => {
    if (locale === 'zh') {
        return mode === 'PVE' ? 'AI' : 'PVP';
    }

    return mode === 'PVE' ? 'AI' : 'PvP';
};

export function GameStartLoadingScreen({
    loaded,
    total,
    failed,
    mode,
    useBuffs,
    locale,
    phase,
}: GameStartLoadingScreenProps) {
    const percent = getPercent(loaded, total);
    const title =
        phase === 'mounting'
            ? locale === 'zh'
                ? '正在布置棋盘'
                : 'Preparing the board'
            : locale === 'zh'
              ? '正在加载本局资源'
              : 'Loading match assets';
    const status = locale === 'zh' ? '准备对局中' : 'Preparing duel';
    const failedLabel = locale === 'zh' ? '项资源未预载，将使用运行时回退。' : 'assets skipped.';

    return (
        <main
            aria-busy="true"
            aria-live="polite"
            className="fixed inset-0 z-[1000] flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050a14] px-6 text-slate-50"
        >
            <section className="w-full max-w-[420px]">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200/75">
                            {status}
                        </p>
                        <h1 className="mt-3 text-3xl font-black leading-tight">{title}</h1>
                    </div>
                    <p className="font-mono text-lg font-black text-amber-200">{percent}%</p>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 shadow-inner shadow-black/60">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-amber-200 to-amber-400 transition-[width] duration-200"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 text-sm font-bold text-slate-300">
                    <span>
                        {getModeLabel(useBuffs, locale)} / {getOpponentLabel(mode, locale)}
                    </span>
                    <span className="font-mono">
                        {loaded}/{total}
                    </span>
                </div>

                {failed > 0 && (
                    <p className="mt-3 text-xs font-semibold text-amber-200">
                        {failed} {failedLabel}
                    </p>
                )}
            </section>
        </main>
    );
}
