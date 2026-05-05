import { Eye, EyeOff } from 'lucide-react';
import { useT } from '@gemduel/ui/i18n/LocaleProvider';
import type { ThemeName } from '@gemduel/shared/types';

interface AppChromeLanVisibilityControlsProps {
    theme: ThemeName;
    showOpponentPlayerZoneCards: boolean;
    showOpponentGems: boolean;
    onSetShowOpponentPlayerZoneCards?: (value: boolean) => void;
    onSetShowOpponentGems?: (value: boolean) => void;
}

export function AppChromeLanVisibilityControls({
    theme,
    showOpponentPlayerZoneCards,
    showOpponentGems,
    onSetShowOpponentPlayerZoneCards,
    onSetShowOpponentGems,
}: AppChromeLanVisibilityControlsProps) {
    const t = useT();
    const visibilityToggleClass =
        theme === 'dark'
            ? 'border-slate-600 bg-slate-900/70 text-slate-200'
            : 'border-stone-300 bg-white/95 text-stone-800';

    return (
        <div data-lan-visibility-controls="true" className="flex flex-col gap-1.5 px-1 py-1">
            <div
                className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                    theme === 'dark' ? 'text-slate-500' : 'text-stone-500'
                }`}
            >
                {t('settings.lanVisibility')}
            </div>
            <label
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[12px] font-black uppercase tracking-[0.10em] ${visibilityToggleClass}`}
            >
                <input
                    type="checkbox"
                    data-lan-show-opponent-player-zone-cards="true"
                    checked={showOpponentPlayerZoneCards}
                    onChange={(event) =>
                        onSetShowOpponentPlayerZoneCards?.(event.currentTarget.checked)
                    }
                    className="sr-only"
                />
                {showOpponentPlayerZoneCards ? (
                    <Eye size={18} aria-hidden="true" />
                ) : (
                    <EyeOff size={18} aria-hidden="true" />
                )}
                <span className="min-w-0 leading-tight">
                    {t('settings.lan.showOpponentPlayerZoneCards')}
                </span>
            </label>
            <label
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[12px] font-black uppercase tracking-[0.10em] ${visibilityToggleClass}`}
            >
                <input
                    type="checkbox"
                    data-lan-show-opponent-gems="true"
                    checked={showOpponentGems}
                    onChange={(event) => onSetShowOpponentGems?.(event.currentTarget.checked)}
                    className="sr-only"
                />
                {showOpponentGems ? (
                    <Eye size={18} aria-hidden="true" />
                ) : (
                    <EyeOff size={18} aria-hidden="true" />
                )}
                <span className="min-w-0 leading-tight">{t('settings.lan.showOpponentGems')}</span>
            </label>
        </div>
    );
}
