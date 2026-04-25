import React, { Suspense, useEffect, useRef, useState, type ChangeEventHandler } from 'react';
import { BookOpen, Download, Moon, RotateCcw, Settings, Sun, Upload } from 'lucide-react';
import type { ThemeName } from '@gemduel/shared/types';
import { LocaleSwitch } from '@gemduel/ui/components/LocaleSwitch';
import { useT } from '@gemduel/ui/i18n/LocaleProvider';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
    type SurfaceThemeSelections,
    type SurfaceThemeSlot,
    type SurfaceThemeVariant,
} from '../shell/surfaceTheme';
import { AppChromeSurfaceMenu } from './AppChromeSurfaceMenu';

const DebugPanel = React.lazy(() =>
    import('@gemduel/ui/components/DebugPanel').then((module) => ({ default: module.DebugPanel }))
);

interface AppChromeProps {
    theme: ThemeName;
    showDebug: boolean;
    canShowDebug: boolean;
    onToggleDebug: () => void;
    onDownloadReplay: () => void;
    onUploadReplay: ChangeEventHandler<HTMLInputElement>;
    onRequestRestart: () => void;
    onShowRulebook: () => void;
    onToggleTheme: () => void;
    onAddCrowns: (player: 'p1' | 'p2') => void;
    onAddPoints: (player: 'p1' | 'p2') => void;
    onAddPrivilege: (player: 'p1' | 'p2') => void;
    onForceRoyal: () => void;
    showDebugPanels: boolean;
    surfaceTheme?: SurfaceThemeSelections;
    onSurfaceThemeChange?: (slot: SurfaceThemeSlot, variant: SurfaceThemeVariant) => void;
    onResetSurfaceTheme?: () => void;
}

export function AppChrome({
    theme,
    showDebug,
    canShowDebug,
    onToggleDebug,
    onDownloadReplay,
    onUploadReplay,
    onRequestRestart,
    onShowRulebook,
    onToggleTheme,
    onAddCrowns,
    onAddPoints,
    onAddPrivilege,
    onForceRoyal,
    showDebugPanels,
    surfaceTheme = DEFAULT_SURFACE_THEME_SELECTIONS,
    onSurfaceThemeChange,
    onResetSurfaceTheme,
}: AppChromeProps) {
    const t = useT();
    const sideButtonLabelClass =
        'text-[13px] font-black uppercase tracking-[0.14em] hidden md:inline';
    const settingsMenuRef = useRef<HTMLDivElement | null>(null);
    const themeMenuRef = useRef<HTMLDivElement | null>(null);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const neutralButtonClass =
        theme === 'dark'
            ? 'bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 hover:text-white border-slate-600 hover:border-slate-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)]'
            : 'bg-white/95 hover:bg-stone-50 text-stone-800 border-stone-300';
    const neutralMutedButtonClass =
        theme === 'dark'
            ? 'bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 hover:text-white border-slate-600 hover:border-slate-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)]'
            : 'bg-white/95 hover:bg-stone-50 text-stone-700 border-stone-300';
    const dangerButtonClass =
        theme === 'dark'
            ? 'bg-red-950/50 hover:bg-red-900/70 text-red-200 hover:text-white border-red-700/60 hover:border-red-500/70 shadow-[0_6px_20px_rgba(69,10,10,0.35)]'
            : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-300';

    useEffect(() => {
        if (!showSettingsMenu) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!settingsMenuRef.current?.contains(event.target as Node)) {
                setShowSettingsMenu(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowSettingsMenu(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showSettingsMenu]);

    useEffect(() => {
        if (!showThemeMenu) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!themeMenuRef.current?.contains(event.target as Node)) {
                setShowThemeMenu(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowThemeMenu(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showThemeMenu]);

    return (
        <>
            <div className="absolute top-24 right-4 z-[200] flex flex-col gap-1.5">
                <button
                    onClick={onRequestRestart}
                    className={`px-3 py-3 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-center shadow-none
                    ${dangerButtonClass}`}
                    aria-label={t('settings.restart')}
                >
                    <RotateCcw size={21} />
                    <span className={sideButtonLabelClass}>{t('settings.restart')}</span>
                </button>

                <button
                    onClick={onShowRulebook}
                    className={`px-3 py-3 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-center shadow-none
                    ${neutralButtonClass}`}
                    aria-label={t('settings.rules')}
                >
                    <BookOpen size={21} />
                    <span className={sideButtonLabelClass}>{t('settings.rules')}</span>
                </button>

                <button
                    onClick={onToggleTheme}
                    className={`px-3 py-3 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-center shadow-none
                    ${neutralButtonClass}`}
                    aria-label={t('settings.toggleTheme')}
                >
                    {theme === 'dark' ? <Moon size={21} /> : <Sun size={21} />}
                    <span className={sideButtonLabelClass}>
                        {theme === 'dark' ? t('settings.dark') : t('settings.light')}
                    </span>
                </button>

                <div className="relative" ref={settingsMenuRef}>
                    <button
                        onClick={() => {
                            setShowThemeMenu(false);
                            setShowSettingsMenu((value) => !value);
                        }}
                        className={`px-3 py-3 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-center shadow-none
                        ${neutralButtonClass}`}
                        aria-label={t('settings.title')}
                        aria-expanded={showSettingsMenu}
                    >
                        <Settings size={21} />
                        <span className={sideButtonLabelClass}>{t('settings.title')}</span>
                    </button>

                    {showSettingsMenu && (
                        <div
                            className={`absolute right-full top-0 mr-3 min-w-[208px] rounded-2xl border p-3 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.32)] ${
                                theme === 'dark'
                                    ? 'bg-slate-950/92 border-slate-700/80'
                                    : 'bg-white/96 border-stone-300'
                            }`}
                        >
                            <div
                                className={`mb-3 px-1 text-[11px] font-black uppercase tracking-[0.22em] ${
                                    theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
                                }`}
                            >
                                {t('settings.title')}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="px-1 pb-1">
                                    <div
                                        className={`mb-2 text-[10px] font-black uppercase tracking-[0.18em] ${
                                            theme === 'dark' ? 'text-slate-500' : 'text-stone-500'
                                        }`}
                                    >
                                        {t('settings.language')}
                                    </div>
                                    <LocaleSwitch theme={theme} className="w-full justify-center" />
                                </div>
                                <button
                                    onClick={() => {
                                        onDownloadReplay();
                                        setShowSettingsMenu(false);
                                    }}
                                    className={`px-3 py-3 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-start shadow-none ${neutralMutedButtonClass}`}
                                    title={t('settings.save')}
                                    aria-label={t('settings.save')}
                                >
                                    <Download size={20} />
                                    <span className="text-[13px] font-black uppercase tracking-[0.14em]">
                                        {t('settings.save')}
                                    </span>
                                </button>

                                <label
                                    className={`px-3 py-3 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-start cursor-pointer shadow-none ${neutralMutedButtonClass}`}
                                    title={t('settings.load')}
                                    aria-label={t('settings.load')}
                                >
                                    <Upload size={20} />
                                    <span className="text-[13px] font-black uppercase tracking-[0.14em]">
                                        {t('settings.load')}
                                    </span>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={(event) => {
                                            onUploadReplay(event);
                                            setShowSettingsMenu(false);
                                        }}
                                        className="hidden"
                                    />
                                </label>

                                {canShowDebug && (
                                    <button
                                        onClick={() => {
                                            onToggleDebug();
                                            setShowSettingsMenu(false);
                                        }}
                                        className={`px-3 py-3 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-start shadow-none ${neutralMutedButtonClass}`}
                                        aria-label={
                                            showDebug
                                                ? t('settings.closeDebug')
                                                : t('settings.openDebug')
                                        }
                                    >
                                        <Settings size={20} />
                                        <span className="text-[13px] font-black uppercase tracking-[0.14em]">
                                            {showDebug
                                                ? t('settings.closeDebug')
                                                : t('settings.openDebug')}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <AppChromeSurfaceMenu
                    theme={theme}
                    isOpen={showThemeMenu}
                    menuRef={themeMenuRef}
                    sideButtonLabelClass={sideButtonLabelClass}
                    neutralButtonClass={neutralButtonClass}
                    neutralMutedButtonClass={neutralMutedButtonClass}
                    surfaceTheme={surfaceTheme}
                    onToggleOpen={() => {
                        setShowSettingsMenu(false);
                        setShowThemeMenu((value) => !value);
                    }}
                    onSurfaceThemeChange={onSurfaceThemeChange}
                    onResetSurfaceTheme={onResetSurfaceTheme}
                />
            </div>

            {showDebugPanels && (
                <Suspense fallback={null}>
                    <div className="absolute left-4 top-36 z-[90] flex flex-col gap-4 animate-in slide-in-from-left duration-300">
                        <DebugPanel
                            player="p1"
                            onAddCrowns={() => onAddCrowns('p1')}
                            onAddPoints={() => onAddPoints('p1')}
                            onAddPrivilege={() => onAddPrivilege('p1')}
                            onForceRoyal={onForceRoyal}
                            theme={theme}
                        />
                        <DebugPanel
                            player="p2"
                            onAddCrowns={() => onAddCrowns('p2')}
                            onAddPoints={() => onAddPoints('p2')}
                            onAddPrivilege={() => onAddPrivilege('p2')}
                            onForceRoyal={onForceRoyal}
                            theme={theme}
                        />
                    </div>
                </Suspense>
            )}
        </>
    );
}
