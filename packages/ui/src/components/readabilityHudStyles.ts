import type { CSSProperties } from 'react';

export const READABILITY_HUD_TREATMENT = 'porcelain-glass' as const;

export const READABILITY_HUD_GLASS_CLASS =
    'border border-cyan-50/40 bg-slate-950/28 shadow-[0_12px_32px_rgba(4,18,28,0.24),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[10px] backdrop-saturate-125';

export const READABILITY_HUD_SOFT_GLASS_CLASS =
    'border border-cyan-50/30 bg-slate-950/20 shadow-[0_10px_26px_rgba(4,18,28,0.18),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[8px] backdrop-saturate-125';

export const READABILITY_HUD_FLAT_GLASS_CLASS =
    'border border-cyan-50/30 bg-slate-950/18 backdrop-blur-[6px] backdrop-saturate-125';

export const READABILITY_HUD_COMPACT_GLASS_CLASS =
    'border border-cyan-50/30 bg-slate-950/18 shadow-[0_8px_20px_rgba(4,18,28,0.16),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[6px] backdrop-saturate-125';

export const READABILITY_HUD_TEXT_STYLE = {
    textShadow:
        '0 1px 2px rgba(5, 12, 24, 0.92), 0 0 8px rgba(236, 254, 255, 0.34), 0 0 16px rgba(14, 165, 233, 0.18)',
    WebkitTextStroke: '0.35px rgba(5, 12, 24, 0.55)',
} satisfies CSSProperties;

export const READABILITY_HUD_LABEL_TEXT_STYLE = {
    textShadow: '0 1px 1px rgba(5, 12, 24, 0.72)',
    WebkitTextStroke: '0 transparent',
} satisfies CSSProperties;

export const READABILITY_HUD_LIGHT_TEXT_STYLE = {
    textShadow: '0 1px 2px rgba(5, 12, 24, 0.82), 0 0 8px rgba(236, 254, 255, 0.28)',
    WebkitTextStroke: '0.25px rgba(5, 12, 24, 0.45)',
} satisfies CSSProperties;

export const getReadabilityHudStyle = (
    style: CSSProperties | undefined,
    enabled: boolean,
    textStyle: CSSProperties = READABILITY_HUD_TEXT_STYLE
): CSSProperties | undefined => {
    if (!enabled) {
        return style;
    }

    return {
        ...style,
        ...textStyle,
    };
};
