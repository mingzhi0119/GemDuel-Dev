import { GameGlyph } from '@gemduel/ui/components/GameGlyph';
import {
    TOOLTIP_LABEL_CLASS,
    getTooltipLabelThemeClass,
} from '@gemduel/ui/components/tooltipStyles';
import {
    READABILITY_HUD_GLASS_CLASS,
    READABILITY_HUD_TEXT_STYLE,
} from '@gemduel/ui/components/readabilityHudStyles';
import type { ThemeName } from '@app/types/ui';

interface VisualLabRestartButtonProps {
    theme: ThemeName;
    label: string;
    tooltipId: string;
    readabilityTreatment: boolean;
    onCloseToStartPage: () => void;
}

export function VisualLabRestartButton({
    theme,
    label,
    tooltipId,
    readabilityTreatment,
    onCloseToStartPage,
}: VisualLabRestartButtonProps) {
    const restartIconButtonClass =
        theme === 'dark'
            ? 'hover:bg-slate-800/80 focus-visible:outline-slate-300'
            : 'hover:bg-white/80 focus-visible:outline-stone-700';

    return (
        <div className="absolute right-5 top-0 z-[200] flex h-24 items-center lg:right-7 lg:h-[120px]">
            <button
                type="button"
                data-app-restart-button="true"
                data-readability-hud-chip={readabilityTreatment ? 'visual-lab-restart' : undefined}
                onClick={onCloseToStartPage}
                className={`group relative flex h-20 w-20 items-center justify-center rounded-full border-0 bg-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:h-24 lg:w-24 ${restartIconButtonClass} ${
                    readabilityTreatment ? READABILITY_HUD_GLASS_CLASS : ''
                }`}
                style={{
                    color: 'var(--gd-chrome-icon)',
                    textShadow: 'var(--gd-chrome-text-shadow)',
                    ...(readabilityTreatment ? READABILITY_HUD_TEXT_STYLE : {}),
                }}
                aria-label={label}
                aria-describedby={tooltipId}
            >
                <GameGlyph variant="restart" size={48} />
                <span
                    id={tooltipId}
                    role="tooltip"
                    data-tooltip-size="standard-label"
                    className={`pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${TOOLTIP_LABEL_CLASS} ${getTooltipLabelThemeClass(theme)}`}
                >
                    {label}
                </span>
            </button>
        </div>
    );
}
