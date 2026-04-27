import { FlaskConical, Globe, Radio, Users, User } from 'lucide-react';
import { useState } from 'react';
import { GameMode } from '@gemduel/shared/types';
import { useLocale, useT } from '../i18n/LocaleProvider';
import { LocaleSwitch } from './LocaleSwitch';
import { useViewportFitScale } from './useViewportFitScale';

interface GameConfigMenuProps {
    onOnlineSetup: () => void;
    onLanSetup: () => void;
    onStartGame: (mode: GameMode, config: { useBuffs: boolean }) => void;
    onOpenVisualLab?: (mode: 'surfaces' | 'motion') => void;
    theme: string;
}

export function GameConfigMenu({
    onOnlineSetup,
    onLanSetup,
    onStartGame,
    onOpenVisualLab,
    theme,
}: GameConfigMenuProps) {
    const [gameConfig, setGameConfig] = useState<{ useBuffs: boolean } | null>(null);
    const [showVisualLabMenu, setShowVisualLabMenu] = useState(false);
    const { locale } = useLocale();
    const t = useT();
    const fitScale = useViewportFitScale<HTMLDivElement>(3, 96);

    if (!gameConfig) {
        return (
            <div
                className={`relative h-full w-full flex flex-col items-center justify-center gap-8 overflow-hidden transition-colors duration-500
                  ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}
              `}
            >
                <div
                    ref={fitScale.ref}
                    style={fitScale.style}
                    className="flex origin-center transform-gpu flex-col items-center gap-8"
                >
                    <div className="flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
                            {locale === 'zh' ? t('startPage.title.zh') : t('startPage.title')}
                        </h1>
                        <span className="text-sm tracking-widest opacity-60 text-center">
                            {t('startPage.subtitle')}
                        </span>
                        <LocaleSwitch theme={theme as 'light' | 'dark'} />
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 mt-8">
                        <button
                            onClick={() => setGameConfig({ useBuffs: false })}
                            className="group relative w-64 h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 overflow-hidden
                                  border-slate-300 hover:border-blue-500 bg-white/5 hover:bg-blue-500/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-2xl font-bold">
                                {t('startPage.classic.title')}
                            </span>
                            <span className="text-xs opacity-70 max-w-[80%] text-center">
                                {t('startPage.classic.subtitle')}
                            </span>
                        </button>

                        <button
                            onClick={() => setGameConfig({ useBuffs: true })}
                            className="group relative w-64 h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 overflow-hidden
                                  border-slate-300 hover:border-purple-500 bg-white/5 hover:bg-purple-500/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">
                                    {t('startPage.roguelike.title')}
                                </span>
                                <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                    {t('startPage.roguelike.badge')}
                                </span>
                            </div>
                            <span className="text-xs opacity-70 max-w-[80%] text-center">
                                {t('startPage.roguelike.subtitle')}
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-4 mt-8">
                        <div className="h-px w-64 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <button
                                onClick={onOnlineSetup}
                                className="group flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 transition-all hover:scale-105 active:scale-95"
                            >
                                <Globe className="text-blue-400 group-hover:rotate-12 transition-transform" />
                                <div className="flex flex-col items-start">
                                    <span className="text-lg font-bold">
                                        {t('startPage.online.title')}
                                    </span>
                                    <span className="text-[10px] opacity-50 uppercase tracking-widest font-black">
                                        {t('startPage.online.subtitle')}
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={onLanSetup}
                                className="group flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all hover:scale-105 active:scale-95"
                            >
                                <Radio className="text-emerald-400 group-hover:-rotate-6 transition-transform" />
                                <div className="flex flex-col items-start">
                                    <span className="text-lg font-bold">
                                        {t('startPage.lan.title')}
                                    </span>
                                    <span className="text-[10px] opacity-50 uppercase tracking-widest font-black">
                                        {t('startPage.lan.subtitle')}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 text-xs opacity-30 lg:text-base">
                    {t('startPage.selectMode')}
                </div>

                {onOpenVisualLab && (
                    <div className="absolute bottom-8 right-8 z-10 flex items-end gap-4">
                        {showVisualLabMenu && (
                            <div className="flex overflow-hidden rounded-2xl border border-cyan-300/45 bg-slate-950/92 text-[16px] font-black uppercase tracking-[0.14em] text-slate-100 shadow-2xl shadow-cyan-950/45 backdrop-blur-md">
                                <button
                                    type="button"
                                    className="px-7 py-5 transition-colors hover:bg-cyan-400/18 focus-visible:bg-cyan-400/18 focus-visible:outline-none"
                                    onClick={() => onOpenVisualLab('surfaces')}
                                >
                                    Surfaces
                                </button>
                                <button
                                    type="button"
                                    className="border-l border-cyan-300/35 px-7 py-5 transition-colors hover:bg-cyan-400/18 focus-visible:bg-cyan-400/18 focus-visible:outline-none"
                                    onClick={() => onOpenVisualLab('motion')}
                                >
                                    Motion
                                </button>
                            </div>
                        )}
                        <button
                            type="button"
                            aria-label="Open Visual Lab"
                            aria-expanded={showVisualLabMenu}
                            className="flex min-h-28 items-center gap-6 rounded-[2rem] border border-cyan-300/55 bg-cyan-400/12 px-8 py-6 text-left text-cyan-50 shadow-2xl shadow-cyan-950/35 backdrop-blur-md transition-all hover:border-cyan-200 hover:bg-cyan-400/20 hover:shadow-cyan-800/30 focus-visible:border-cyan-200 focus-visible:bg-cyan-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
                            onClick={() => setShowVisualLabMenu((current) => !current)}
                        >
                            <FlaskConical size={44} aria-hidden="true" className="text-cyan-200" />
                            <span className="flex flex-col leading-none">
                                <span className="text-3xl font-black uppercase tracking-[0.16em]">
                                    Visual Lab
                                </span>
                                <span className="mt-3 text-[15px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">
                                    Surfaces / Motion
                                </span>
                            </span>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={`relative h-full w-full flex flex-col items-center justify-center gap-8 overflow-hidden transition-colors duration-500
              ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}
          `}
        >
            <div
                ref={fitScale.ref}
                style={fitScale.style}
                className="flex origin-center transform-gpu flex-col items-center gap-8"
            >
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-bold uppercase tracking-widest opacity-80">
                        {t('startPage.selectOpponent')}
                    </h2>
                    <span className="text-xs opacity-50">
                        {gameConfig.useBuffs
                            ? t('startPage.mode.roguelike')
                            : t('startPage.mode.classic')}
                    </span>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mt-4">
                    <button
                        onClick={() => onStartGame('LOCAL_PVP', { useBuffs: gameConfig.useBuffs })}
                        className="group relative w-64 h-40 rounded-2xl border-2 border-slate-300 hover:border-emerald-500 bg-white/5 hover:bg-emerald-500/10 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 overflow-hidden"
                    >
                        <Users size={40} className="text-emerald-500" />
                        <span className="text-xl font-bold">{t('startPage.local.title')}</span>
                        <span className="text-[10px] opacity-60">
                            {t('startPage.local.subtitle')}
                        </span>
                    </button>

                    <button
                        onClick={() => onStartGame('PVE', { useBuffs: gameConfig.useBuffs })}
                        className="group relative w-64 h-40 rounded-2xl border-2 border-slate-300 hover:border-amber-500 bg-white/5 hover:bg-amber-500/10 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 overflow-hidden"
                    >
                        <User size={40} className="text-amber-500" />
                        <span className="text-xl font-bold">{t('startPage.ai.title')}</span>
                        <span className="text-[10px] opacity-60">{t('startPage.ai.subtitle')}</span>
                    </button>
                </div>

                <button
                    onClick={() => setGameConfig(null)}
                    className="text-xs underline opacity-40 hover:opacity-100 transition-opacity mt-4"
                >
                    {t('startPage.backToModeSelection')}
                </button>
            </div>
        </div>
    );
}
