import type { RefObject } from 'react';
import { Palette } from 'lucide-react';
import { useT } from '@gemduel/ui/i18n/LocaleProvider';
import type { ThemeName } from '@gemduel/shared/types';
import {
    getSurfaceThemeVariant,
    type SurfaceThemeSelections,
    type SurfaceThemeVariant,
} from '../shell/surfaceTheme';

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
    onCycleSurfaceTheme?: () => void;
}

type AppChromeSurfaceControlsProps = Pick<
    AppChromeSurfaceMenuProps,
    'neutralMutedButtonClass' | 'surfaceTheme' | 'onCycleSurfaceTheme'
>;

export function AppChromeSurfaceControls({
    neutralMutedButtonClass,
    surfaceTheme,
    onCycleSurfaceTheme,
}: AppChromeSurfaceControlsProps) {
    const t = useT();
    const activeVariant = getSurfaceThemeVariant(surfaceTheme);
    const activeVariantLabel = t(SURFACE_THEME_VARIANT_LABEL_KEYS[activeVariant]);
    const buttonLabel = t('settings.surface.current', { theme: activeVariantLabel });

    return (
        <div className="flex flex-col gap-3">
            <button
                type="button"
                onClick={() => onCycleSurfaceTheme?.()}
                className={`px-3 py-2.5 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-start shadow-none ${neutralMutedButtonClass}`}
                aria-label={buttonLabel}
                title={buttonLabel}
            >
                <Palette size={18} />
                <span className="whitespace-nowrap text-[13px] font-black uppercase tracking-[0.14em]">
                    {buttonLabel}
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
    onCycleSurfaceTheme,
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
                    <AppChromeSurfaceControls
                        neutralMutedButtonClass={neutralMutedButtonClass}
                        surfaceTheme={surfaceTheme}
                        onCycleSurfaceTheme={onCycleSurfaceTheme}
                    />
                </div>
            )}
        </div>
    );
}
