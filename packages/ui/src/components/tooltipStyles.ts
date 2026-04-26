export type TooltipTheme = 'light' | 'dark';

export const TOOLTIP_LABEL_CLASS =
    'rounded-lg px-4 py-2 text-[16px] font-black uppercase tracking-[0.14em] shadow-xl';

export const TOOLTIP_PANEL_CLASS =
    'rounded-2xl border p-5 text-[16px] leading-snug shadow-2xl backdrop-blur-xl';

export const TOOLTIP_PANEL_WIDTH_CLASS = 'w-[min(90vw,380px)]';

export const TOOLTIP_PANEL_HEADER_CLASS = 'text-[16px] font-black uppercase tracking-wider';

export const TOOLTIP_PANEL_META_CLASS = 'text-[13px] font-mono font-black uppercase opacity-75';

export const TOOLTIP_PANEL_BODY_CLASS = 'text-[16px] leading-relaxed opacity-95';

export const TOOLTIP_PANEL_CAPTION_CLASS = 'text-[13px] font-black uppercase tracking-widest';

export const getTooltipLabelThemeClass = (theme: TooltipTheme) =>
    theme === 'dark'
        ? 'bg-slate-900 text-slate-100'
        : 'bg-white text-stone-800 border border-stone-200';

export const getTooltipPanelThemeClass = (theme: TooltipTheme) =>
    theme === 'dark'
        ? 'border-slate-600 bg-slate-950/98 text-slate-100'
        : 'border-slate-300 bg-white/98 text-slate-900';
