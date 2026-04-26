import type { RefObject } from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { useT } from '@gemduel/ui/i18n/LocaleProvider';
import type { ThemeName } from '@gemduel/shared/types';
import {
    SURFACE_THEME_VARIANTS,
    type SurfaceThemeSelections,
    type SurfaceThemeSlot,
    type SurfaceThemeVariant,
} from '../shell/surfaceTheme';

const SURFACE_THEME_CONTROLS = [
    { slot: 'marketBackground', labelKey: 'settings.surface.marketBackground' },
    { slot: 'gemPanel', labelKey: 'settings.surface.gemPanel' },
    { slot: 'playerZone', labelKey: 'settings.surface.playerZone' },
    { slot: 'tablecloth', labelKey: 'settings.surface.tablecloth' },
    { slot: 'shellBackground', labelKey: 'settings.surface.shellBackground' },
] as const satisfies readonly { slot: SurfaceThemeSlot; labelKey: string }[];

const SURFACE_THEME_VARIANT_LABEL_KEYS = {
    default: 'settings.surface.variant.default',
    wood: 'settings.surface.variant.wood',
    royal: 'settings.surface.variant.royal',
    minimal: 'settings.surface.variant.minimal',
    geek: 'settings.surface.variant.geek',
} as const satisfies Record<SurfaceThemeVariant, string>;

interface AppChromeSurfaceMenuProps {
    theme: ThemeName;
    isOpen: boolean;
    menuRef: RefObject<HTMLDivElement | null>;
    sideButtonLabelClass: string;
    neutralButtonClass: string;
    neutralMutedButtonClass: string;
    surfaceTheme: SurfaceThemeSelections;
    onToggleOpen: () => void;
    onSurfaceThemeChange?: (slot: SurfaceThemeSlot, variant: SurfaceThemeVariant) => void;
    onResetSurfaceTheme?: () => void;
}

type AppChromeSurfaceControlsProps = Pick<
    AppChromeSurfaceMenuProps,
    | 'theme'
    | 'neutralMutedButtonClass'
    | 'surfaceTheme'
    | 'onSurfaceThemeChange'
    | 'onResetSurfaceTheme'
>;

export function AppChromeSurfaceControls({
    theme,
    neutralMutedButtonClass,
    surfaceTheme,
    onSurfaceThemeChange,
    onResetSurfaceTheme,
}: AppChromeSurfaceControlsProps) {
    const t = useT();
    const surfaceOptionBaseClass =
        'min-h-9 rounded-md border px-1.5 text-[10px] font-black uppercase tracking-[0.08em] transition-colors';
    const getSurfaceOptionClass = (active: boolean) =>
        active
            ? theme === 'dark'
                ? `${surfaceOptionBaseClass} bg-cyan-400/18 text-cyan-100 border-cyan-300/70`
                : `${surfaceOptionBaseClass} bg-cyan-50 text-cyan-900 border-cyan-500`
            : theme === 'dark'
              ? `${surfaceOptionBaseClass} bg-slate-900/70 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white`
              : `${surfaceOptionBaseClass} bg-white/85 text-stone-700 border-stone-300 hover:border-stone-500 hover:text-stone-950`;

    return (
        <div className="flex flex-col gap-3">
            {SURFACE_THEME_CONTROLS.map((control) => (
                <div key={control.slot}>
                    <div
                        className={`mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                            theme === 'dark' ? 'text-slate-500' : 'text-stone-500'
                        }`}
                    >
                        {t(control.labelKey)}
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                        {SURFACE_THEME_VARIANTS.map((variant) => {
                            const active = surfaceTheme[control.slot] === variant;
                            const variantLabel = t(SURFACE_THEME_VARIANT_LABEL_KEYS[variant]);
                            return (
                                <button
                                    key={`${control.slot}-${variant}`}
                                    type="button"
                                    className={getSurfaceOptionClass(active)}
                                    aria-pressed={active}
                                    onClick={() => onSurfaceThemeChange?.(control.slot, variant)}
                                    title={`${t(control.labelKey)}: ${variantLabel}`}
                                >
                                    {variantLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={() => onResetSurfaceTheme?.()}
                className={`mt-1 px-3 py-2.5 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-center shadow-none ${neutralMutedButtonClass}`}
            >
                <RotateCcw size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.14em]">
                    {t('settings.surface.reset')}
                </span>
            </button>
        </div>
    );
}

export function AppChromeSurfaceMenu({
    theme,
    isOpen,
    menuRef,
    sideButtonLabelClass,
    neutralButtonClass,
    neutralMutedButtonClass,
    surfaceTheme,
    onToggleOpen,
    onSurfaceThemeChange,
    onResetSurfaceTheme,
}: AppChromeSurfaceMenuProps) {
    const t = useT();

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={onToggleOpen}
                className={`px-3 py-3 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-center shadow-none ${neutralButtonClass}`}
                aria-label={t('settings.surface.button')}
                aria-expanded={isOpen}
            >
                <Palette size={21} />
                <span className={sideButtonLabelClass}>{t('settings.surface.button')}</span>
            </button>

            {isOpen && (
                <div
                    className={`absolute right-full top-0 mr-3 w-[min(88vw,380px)] rounded-2xl border p-3 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.32)] ${
                        theme === 'dark'
                            ? 'bg-slate-950/94 border-slate-700/80'
                            : 'bg-white/96 border-stone-300'
                    }`}
                >
                    <div
                        className={`mb-3 px-1 text-[11px] font-black uppercase tracking-[0.22em] ${
                            theme === 'dark' ? 'text-slate-400' : 'text-stone-500'
                        }`}
                    >
                        {t('settings.surface.title')}
                    </div>

                    <AppChromeSurfaceControls
                        theme={theme}
                        neutralMutedButtonClass={neutralMutedButtonClass}
                        surfaceTheme={surfaceTheme}
                        onSurfaceThemeChange={onSurfaceThemeChange}
                        onResetSurfaceTheme={onResetSurfaceTheme}
                    />
                </div>
            )}
        </div>
    );
}
