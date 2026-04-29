import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { ChevronDown, Palette } from 'lucide-react';
import { useT } from '@gemduel/ui/i18n/LocaleProvider';
import type { ThemeName } from '@gemduel/shared/types';
import {
    getSurfaceThemeVariant,
    SURFACE_THEME_VARIANTS,
    type SurfaceThemeSelections,
    type SurfaceThemeVariant,
} from '../shell/surfaceTheme';

const SURFACE_THEME_VARIANT_LABEL_KEYS = {
    'crystal-anime': 'settings.surface.variant.crystalAnime',
    'royal-luxury': 'settings.surface.variant.royalLuxury',
    'dark-arcane': 'settings.surface.variant.darkArcane',
    'clean-boardgame': 'settings.surface.variant.cleanBoardgame',
    'pearl-opaline': 'settings.surface.variant.pearlOpaline',
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
    onSelectSurfaceTheme?: (variant: SurfaceThemeVariant) => void;
}

type AppChromeSurfaceControlsProps = Pick<
    AppChromeSurfaceMenuProps,
    'theme' | 'neutralMutedButtonClass' | 'surfaceTheme' | 'onSelectSurfaceTheme'
>;

export function AppChromeSurfaceControls({
    theme,
    neutralMutedButtonClass,
    surfaceTheme,
    onSelectSurfaceTheme,
}: AppChromeSurfaceControlsProps) {
    const t = useT();
    const dropdownId = useId();
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const listboxRef = useRef<HTMLDivElement | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const activeVariant = getSurfaceThemeVariant(surfaceTheme);
    const activeVariantLabel = t(SURFACE_THEME_VARIANT_LABEL_KEYS[activeVariant]);
    const selectLabel = t('settings.surface.current', { theme: activeVariantLabel });
    const optionBaseClass =
        'flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12px] font-black uppercase tracking-[0.10em] transition-colors';
    const optionThemeClass =
        theme === 'dark'
            ? 'text-slate-200 hover:bg-cyan-400/12 hover:text-white focus-visible:bg-cyan-400/14 focus-visible:text-white'
            : 'text-stone-800 hover:bg-stone-200/80 hover:text-stone-950 focus-visible:bg-stone-200 focus-visible:text-stone-950';
    const selectedOptionClass =
        theme === 'dark'
            ? 'bg-cyan-400/16 text-cyan-100 ring-1 ring-cyan-300/35'
            : 'bg-stone-900 text-white ring-1 ring-stone-600';

    useEffect(() => {
        if (!isDropdownOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;

            if (buttonRef.current?.contains(target) || listboxRef.current?.contains(target)) {
                return;
            }

            setIsDropdownOpen(false);
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
                buttonRef.current?.focus();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isDropdownOpen]);

    return (
        <div className="relative flex flex-col gap-3">
            <button
                ref={buttonRef}
                type="button"
                data-app-surface-theme-control="true"
                data-app-surface-theme-select="true"
                data-app-surface-theme-value={activeVariant}
                className={`px-3 py-2.5 rounded-lg backdrop-blur-md border flex items-center gap-2.5 transition-all justify-start shadow-none ${neutralMutedButtonClass}`}
                aria-label={selectLabel}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-controls={isDropdownOpen ? dropdownId : undefined}
                title={selectLabel}
                onClick={() => setIsDropdownOpen((value) => !value)}
            >
                <Palette size={18} className="shrink-0" />
                <span className="sr-only">{selectLabel}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-black uppercase tracking-[0.10em]">
                    {activeVariantLabel}
                </span>
                <ChevronDown
                    size={15}
                    aria-hidden="true"
                    className={`shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isDropdownOpen && (
                <div
                    ref={listboxRef}
                    id={dropdownId}
                    role="listbox"
                    data-app-surface-theme-dropdown="true"
                    aria-label={selectLabel}
                    className={`absolute left-0 right-0 top-full z-[260] mt-1 rounded-lg border p-1 shadow-[0_18px_38px_rgba(0,0,0,0.34)] ${
                        theme === 'dark'
                            ? 'border-slate-600/90 bg-slate-950 text-slate-100'
                            : 'border-stone-300 bg-white text-stone-900'
                    }`}
                >
                    {SURFACE_THEME_VARIANTS.map((variant) => {
                        const isSelected = variant === activeVariant;
                        const label = t(SURFACE_THEME_VARIANT_LABEL_KEYS[variant]);

                        return (
                            <button
                                key={variant}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                data-app-surface-theme-option={variant}
                                className={`${optionBaseClass} ${
                                    isSelected ? selectedOptionClass : optionThemeClass
                                }`}
                                onClick={() => {
                                    onSelectSurfaceTheme?.(variant);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <span className="truncate">{label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
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
    onSelectSurfaceTheme,
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
                        theme={theme}
                        neutralMutedButtonClass={neutralMutedButtonClass}
                        surfaceTheme={surfaceTheme}
                        onSelectSurfaceTheme={onSelectSurfaceTheme}
                    />
                </div>
            )}
        </div>
    );
}
