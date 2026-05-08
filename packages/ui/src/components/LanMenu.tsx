import {
    ArrowLeft,
    CheckCircle2,
    LoaderCircle,
    Play,
    Radio,
    RefreshCcw,
    ShieldCheck,
    Sparkles,
    Swords,
} from 'lucide-react';
import { localizeLooseUiMessage } from '@gemduel/shared';
import type { LanMatchmakingState, LanPregameMode } from '@gemduel/shared/types/lan';
import { useLocale, useT } from '../i18n/LocaleProvider';

interface LanMenuProps {
    onBack: () => void;
    onRetry: () => void;
    onSelectMode: (mode: LanPregameMode) => void;
    onConfirmStart: () => void;
    lan: LanMatchmakingState;
    theme: string;
}

const MODES: Array<{ mode: LanPregameMode; accent: string }> = [
    {
        mode: 'classic',
        accent: 'border-blue-500/40 bg-blue-500/10 hover:border-blue-400',
    },
    {
        mode: 'roguelike',
        accent: 'border-purple-500/40 bg-purple-500/10 hover:border-purple-400',
    },
];

export function LanMenu({
    onBack,
    onRetry,
    onSelectMode,
    onConfirmStart,
    lan,
    theme,
}: LanMenuProps) {
    const isMatched = lan.phase === 'matched' || lan.phase === 'starting';
    const isP1 = lan.localSeat === 'p1';
    const isStarting = lan.phase === 'starting';
    const { locale } = useLocale();
    const t = useT();
    const localizedStatusMessage = localizeLooseUiMessage(lan.statusMessage, locale);
    const localizedErrorMessage = localizeLooseUiMessage(
        lan.errorMessage ?? lan.statusMessage,
        locale
    );
    const selectedModeLabel =
        lan.selectedMode === 'classic'
            ? t('startPage.classic.title')
            : lan.selectedMode === 'roguelike'
              ? t('startPage.roguelike.title')
              : t('lan.none');

    return (
        <div
            className={`relative h-full w-full flex flex-col items-center justify-center gap-8 overflow-hidden transition-colors duration-500
                ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
        >
            <div className="absolute top-0 left-0 w-full p-8 flex items-center justify-between z-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity font-bold uppercase tracking-wider text-xs"
                >
                    <ArrowLeft size={18} /> {t('lan.back')}
                </button>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 lg:scale-[1.35] lg:transform-gpu lg:origin-center max-w-5xl w-full px-8">
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                        <Radio size={64} className="text-emerald-500 animate-pulse-slow" />
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-1">
                            {t('lan.title')}
                        </h2>
                        <p className="text-sm font-medium opacity-50 tracking-widest uppercase">
                            {t('lan.subtitle')}
                        </p>
                    </div>
                </div>

                <div
                    className={`w-full max-w-3xl rounded-3xl border-2 p-8 flex flex-col gap-6 transition-all
                        ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}
                >
                    {lan.phase === 'searching' && (
                        <div className="flex flex-col items-center gap-4 py-10 text-center">
                            <LoaderCircle size={36} className="animate-spin text-emerald-500" />
                            <div>
                                <div className="text-xl font-bold uppercase tracking-wide">
                                    {t('lan.searching.title')}
                                </div>
                                <div className="text-sm opacity-60 mt-2">
                                    {localizedStatusMessage}
                                </div>
                            </div>
                        </div>
                    )}

                    {lan.phase === 'idle' && (
                        <div className="flex flex-col items-center gap-4 py-8 text-center">
                            <div className="text-xl font-bold uppercase tracking-wide">
                                {t('lan.ready')}
                            </div>
                            <div className="max-w-xl text-sm opacity-60">
                                {localizedStatusMessage}
                            </div>
                            <button
                                onClick={onRetry}
                                className="px-5 py-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-2 font-bold"
                            >
                                <RefreshCcw size={16} />
                                {t('lan.searchAgain')}
                            </button>
                        </div>
                    )}

                    {isMatched && (
                        <>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black uppercase tracking-wide">
                                            {t('lan.matchFound')}
                                        </div>
                                        <div className="text-xs opacity-60 uppercase tracking-[0.3em]">
                                            {t('lan.temporaryRoom')}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs opacity-50 uppercase tracking-[0.3em]">
                                        {t('lan.yourSeat')}
                                    </div>
                                    <div className="text-2xl font-black">
                                        {lan.localSeat?.toUpperCase() ?? '--'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    className={`rounded-2xl border p-5 ${theme === 'dark' ? 'border-slate-800 bg-black/20' : 'border-slate-200 bg-slate-50'}`}
                                >
                                    <div className="text-xs opacity-50 uppercase tracking-[0.3em] mb-2">
                                        {t('lan.opponent')}
                                    </div>
                                    <div className="font-mono text-sm break-all">
                                        {lan.remoteInstanceId ?? 'Pending...'}
                                    </div>
                                </div>
                                <div
                                    className={`rounded-2xl border p-5 ${theme === 'dark' ? 'border-slate-800 bg-black/20' : 'border-slate-200 bg-slate-50'}`}
                                >
                                    <div className="text-xs opacity-50 uppercase tracking-[0.3em] mb-2">
                                        {t('lan.status')}
                                    </div>
                                    <div className="text-sm">
                                        {isP1
                                            ? isStarting
                                                ? t('lan.status.startingMatch')
                                                : t('lan.status.p1')
                                            : isStarting
                                              ? t('lan.status.transportConnecting')
                                              : t('lan.status.waitingForP1')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span>{localizedStatusMessage}</span>
                            </div>

                            <div className="pt-2">
                                <div className="text-xs opacity-50 uppercase tracking-[0.3em] mb-3">
                                    {t('lan.chooseMode')}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {MODES.map(({ mode, accent }) => {
                                        const selected = lan.selectedMode === mode;
                                        const title =
                                            mode === 'classic'
                                                ? t('startPage.classic.title')
                                                : t('startPage.roguelike.title');
                                        const subtitle =
                                            mode === 'classic'
                                                ? t('startPage.classic.subtitle')
                                                : t('startPage.roguelike.subtitle');
                                        return (
                                            <button
                                                key={mode}
                                                onClick={() => onSelectMode(mode)}
                                                disabled={!isP1 || isStarting}
                                                className={`rounded-2xl border-2 p-5 text-left transition-all ${
                                                    selected
                                                        ? 'scale-[1.02] shadow-lg shadow-emerald-900/10 border-emerald-400 bg-emerald-500/10'
                                                        : accent
                                                } ${!isP1 || isStarting ? 'cursor-not-allowed opacity-50' : 'hover:scale-[1.02] active:scale-95'}`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="text-xl font-bold">{title}</div>
                                                    {mode === 'classic' ? (
                                                        <Swords
                                                            size={18}
                                                            className="text-blue-400"
                                                        />
                                                    ) : (
                                                        <Sparkles
                                                            size={18}
                                                            className="text-purple-400"
                                                        />
                                                    )}
                                                </div>
                                                <div className="text-xs opacity-60 mt-2">
                                                    {subtitle}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-2">
                                <div className="text-xs uppercase tracking-[0.25em] opacity-50">
                                    {t('lan.selected')}: {selectedModeLabel}
                                </div>
                                <button
                                    onClick={onConfirmStart}
                                    disabled={!isP1 || !lan.selectedMode || isStarting}
                                    className={`px-6 py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition-all flex items-center gap-2
                                        ${
                                            isP1 && lan.selectedMode && !isStarting
                                                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95'
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        }`}
                                >
                                    <Play size={16} />
                                    {isStarting ? t('lan.connecting') : t('lan.startDuel')}
                                </button>
                            </div>
                        </>
                    )}

                    {lan.phase === 'error' && (
                        <div className="flex flex-col items-center gap-4 py-8 text-center">
                            <div className="text-xl font-bold uppercase tracking-wide">
                                {t('lan.failed')}
                            </div>
                            <div className="text-sm opacity-60">{localizedErrorMessage}</div>
                            <button
                                onClick={onRetry}
                                className="px-5 py-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-colors flex items-center gap-2 font-bold"
                            >
                                <RefreshCcw size={16} />
                                {t('lan.searchAgain')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
