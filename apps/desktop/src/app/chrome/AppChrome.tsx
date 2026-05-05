import React, {
    Suspense,
    useEffect,
    useId,
    useRef,
    useState,
    type ChangeEventHandler,
} from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { ThemeName } from '@gemduel/shared/types';
import { GameGlyph } from '@gemduel/ui/components/GameGlyph';
import { LocaleSwitch } from '@gemduel/ui/components/LocaleSwitch';
import { READABILITY_HUD_GLASS_CLASS } from '@gemduel/ui/components/readabilityHudStyles';
import {
    TOOLTIP_LABEL_CLASS,
    getTooltipLabelThemeClass,
} from '@gemduel/ui/components/tooltipStyles';
import { useT } from '@gemduel/ui/i18n/LocaleProvider';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
    type SurfaceThemeSelections,
    type SurfaceThemeVariant,
} from '../shell/surfaceTheme';
import { AppChromeLanVisibilityControls } from './AppChromeLanVisibilityControls';
import { AppChromeSurfaceControls } from './AppChromeSurfaceMenu';

const DebugPanel = React.lazy(() =>
    import('@gemduel/ui/components/DebugPanel').then((module) => ({ default: module.DebugPanel }))
);

const chromeActionButtonClass = `group relative flex h-[84px] w-[84px] items-center justify-center overflow-visible rounded-full ${READABILITY_HUD_GLASS_CLASS} transition-[background-color,border-color,box-shadow,backdrop-filter,color] before:pointer-events-none before:absolute before:-inset-2 before:z-0 before:rounded-full before:bg-slate-950/10 before:backdrop-blur-[10px] before:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:h-24 lg:w-24`;

interface AppChromeProps {
    theme: ThemeName;
    showDebug: boolean;
    canShowDebug: boolean;
    onToggleDebug: () => void;
    onDownloadReplay: () => void;
    onUploadReplay: ChangeEventHandler<HTMLInputElement>;
    onRequestRestart: () => void;
    onShowRulebook: () => void;
    onAddCrowns: (player: 'p1' | 'p2') => void;
    onAddPoints: (player: 'p1' | 'p2') => void;
    onAddPrivilege: (player: 'p1' | 'p2') => void;
    onForceRoyal: () => void;
    showDebugPanels: boolean;
    surfaceTheme?: SurfaceThemeSelections;
    onSelectSurfaceTheme?: (variant: SurfaceThemeVariant) => void;
    soundEnabled: boolean;
    onToggleSound: () => void;
    showLanVisibilitySettings?: boolean;
    lanShowOpponentPlayerZoneCards?: boolean;
    lanShowOpponentGems?: boolean;
    onSetLanShowOpponentPlayerZoneCards?: (value: boolean) => void;
    onSetLanShowOpponentGems?: (value: boolean) => void;
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
    onAddCrowns,
    onAddPoints,
    onAddPrivilege,
    onForceRoyal,
    showDebugPanels,
    surfaceTheme = DEFAULT_SURFACE_THEME_SELECTIONS,
    onSelectSurfaceTheme,
    soundEnabled,
    onToggleSound,
    showLanVisibilitySettings = false,
    lanShowOpponentPlayerZoneCards = true,
    lanShowOpponentGems = true,
    onSetLanShowOpponentPlayerZoneCards,
    onSetLanShowOpponentGems,
}: AppChromeProps) {
    const t = useT();
    const settingsTooltipId = useId();
    const restartTooltipId = useId();
    const rulebookTooltipId = useId();
    const settingsMenuRef = useRef<HTMLDivElement | null>(null);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const settingsIconButtonClass =
        theme === 'dark'
            ? 'hover:bg-slate-800/80 focus-visible:outline-slate-300'
            : 'hover:bg-white/80 focus-visible:outline-stone-700';
    const chromeIconStyle = {
        color: 'var(--gd-chrome-icon)',
        textShadow: 'var(--gd-chrome-text-shadow)',
    } as React.CSSProperties;
    const neutralMutedButtonClass =
        theme === 'dark'
            ? 'bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 hover:text-white border-slate-600 hover:border-slate-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)]'
            : 'bg-white/95 hover:bg-stone-50 text-stone-700 border-stone-300';
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

    return (
        <>
            <div className="absolute right-4 top-0 z-[200] flex h-24 items-center gap-1 lg:right-6 lg:h-[120px]">
                <button
                    type="button"
                    data-app-rulebook-button="true"
                    onClick={() => {
                        setShowSettingsMenu(false);
                        onShowRulebook();
                    }}
                    className={`${chromeActionButtonClass} ${settingsIconButtonClass}`}
                    style={chromeIconStyle}
                    aria-label={t('settings.rules')}
                    aria-describedby={rulebookTooltipId}
                >
                    <span className="relative z-10 flex items-center justify-center">
                        <GameGlyph variant="rulebook" size={45} />
                    </span>
                    <span
                        id={rulebookTooltipId}
                        role="tooltip"
                        data-tooltip-size="standard-label"
                        className={`pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${TOOLTIP_LABEL_CLASS} ${getTooltipLabelThemeClass(theme)}`}
                    >
                        {t('settings.rules')}
                    </span>
                </button>
                <button
                    type="button"
                    data-app-restart-button="true"
                    onClick={() => {
                        setShowSettingsMenu(false);
                        onRequestRestart();
                    }}
                    className={`${chromeActionButtonClass} ${settingsIconButtonClass}`}
                    style={chromeIconStyle}
                    aria-label={t('settings.restart')}
                    aria-describedby={restartTooltipId}
                >
                    <span className="relative z-10 flex items-center justify-center">
                        <GameGlyph variant="restart" size={45} />
                    </span>
                    <span
                        id={restartTooltipId}
                        role="tooltip"
                        data-tooltip-size="standard-label"
                        className={`pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${TOOLTIP_LABEL_CLASS} ${getTooltipLabelThemeClass(theme)}`}
                    >
                        {t('settings.restart')}
                    </span>
                </button>
                <div className="relative" ref={settingsMenuRef}>
                    <button
                        onClick={() => {
                            setShowSettingsMenu((value) => !value);
                        }}
                        className={`${chromeActionButtonClass} ${settingsIconButtonClass}`}
                        style={chromeIconStyle}
                        aria-label={t('settings.title')}
                        aria-describedby={settingsTooltipId}
                        aria-expanded={showSettingsMenu}
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            <GameGlyph variant="settings" size={48} />
                        </span>
                        <span
                            id={settingsTooltipId}
                            role="tooltip"
                            data-tooltip-size="standard-label"
                            className={`pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${TOOLTIP_LABEL_CLASS} ${getTooltipLabelThemeClass(theme)}`}
                        >
                            {t('settings.title')}
                        </span>
                    </button>

                    {showSettingsMenu && (
                        <div
                            data-settings-menu="true"
                            className={`absolute right-0 top-full mt-3 w-[248px] origin-top-right rounded-2xl border p-2.5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.32)] lg:scale-[1.5] ${
                                theme === 'dark'
                                    ? 'bg-slate-950/92 border-slate-700/80'
                                    : 'bg-white/96 border-stone-300'
                            }`}
                        >
                            <div
                                className={`mb-2 px-1 text-[11px] font-black uppercase tracking-[0.22em] ${
                                    theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
                                }`}
                            >
                                {t('settings.title')}
                            </div>
                            <div className="flex flex-col gap-1.5">
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

                                {canShowDebug && (
                                    <button
                                        onClick={() => {
                                            onToggleDebug();
                                            setShowSettingsMenu(false);
                                        }}
                                        className={`px-3 py-2.5 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-start shadow-none ${neutralMutedButtonClass}`}
                                        aria-label={
                                            showDebug
                                                ? t('settings.closeDebug')
                                                : t('settings.openDebug')
                                        }
                                    >
                                        <GameGlyph variant="settings" size={20} />
                                        <span className="whitespace-nowrap text-[13px] font-black uppercase tracking-[0.14em]">
                                            {showDebug
                                                ? t('settings.closeDebug')
                                                : t('settings.openDebug')}
                                        </span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    data-app-sound-toggle="true"
                                    onClick={onToggleSound}
                                    className={`px-3 py-2.5 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-start shadow-none ${neutralMutedButtonClass}`}
                                    aria-label={
                                        soundEnabled
                                            ? t('settings.sound.disable')
                                            : t('settings.sound.enable')
                                    }
                                    aria-pressed={soundEnabled}
                                >
                                    {soundEnabled ? (
                                        <Volume2 size={20} aria-hidden="true" />
                                    ) : (
                                        <VolumeX size={20} aria-hidden="true" />
                                    )}
                                    <span className="whitespace-nowrap text-[13px] font-black uppercase tracking-[0.14em]">
                                        {t('settings.sound')}
                                    </span>
                                </button>

                                {showLanVisibilitySettings && (
                                    <AppChromeLanVisibilityControls
                                        theme={theme}
                                        showOpponentPlayerZoneCards={lanShowOpponentPlayerZoneCards}
                                        showOpponentGems={lanShowOpponentGems}
                                        onSetShowOpponentPlayerZoneCards={
                                            onSetLanShowOpponentPlayerZoneCards
                                        }
                                        onSetShowOpponentGems={onSetLanShowOpponentGems}
                                    />
                                )}

                                <button
                                    onClick={() => {
                                        onDownloadReplay();
                                        setShowSettingsMenu(false);
                                    }}
                                    className={`px-3 py-2.5 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-start shadow-none ${neutralMutedButtonClass}`}
                                    title={t('settings.save')}
                                    aria-label={t('settings.save')}
                                >
                                    <GameGlyph variant="save" size={20} />
                                    <span className="whitespace-nowrap text-[13px] font-black uppercase tracking-[0.14em]">
                                        {t('settings.save')}
                                    </span>
                                </button>

                                <label
                                    className={`px-3 py-2.5 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-start cursor-pointer shadow-none ${neutralMutedButtonClass}`}
                                    title={t('settings.load')}
                                    aria-label={t('settings.load')}
                                >
                                    <GameGlyph variant="load" size={20} />
                                    <span className="whitespace-nowrap text-[13px] font-black uppercase tracking-[0.14em]">
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

                                <AppChromeSurfaceControls
                                    theme={theme}
                                    neutralMutedButtonClass={neutralMutedButtonClass}
                                    surfaceTheme={surfaceTheme}
                                    onSelectSurfaceTheme={onSelectSurfaceTheme}
                                />
                            </div>
                        </div>
                    )}
                </div>
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
