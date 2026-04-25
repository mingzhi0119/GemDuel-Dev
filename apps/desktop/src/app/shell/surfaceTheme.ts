export type SurfaceThemeVariant = 'default' | 'wood' | 'royal' | 'minimal' | 'geek';

export type SurfaceThemeSlot =
    | 'marketBackground'
    | 'gemPanel'
    | 'playerZone'
    | 'tablecloth'
    | 'shellBackground';

export type SurfaceThemeSelections = Record<SurfaceThemeSlot, SurfaceThemeVariant>;

export const SURFACE_THEME_VARIANTS = [
    'default',
    'wood',
    'royal',
    'minimal',
    'geek',
] as const satisfies readonly SurfaceThemeVariant[];

export const DEFAULT_SURFACE_THEME_SELECTIONS: SurfaceThemeSelections = {
    marketBackground: 'default',
    gemPanel: 'default',
    playerZone: 'default',
    tablecloth: 'default',
    shellBackground: 'default',
};

const SURFACE_THEME_VARIANT_SET = new Set<SurfaceThemeVariant>(SURFACE_THEME_VARIANTS);
const SURFACE_THEME_SLOTS = Object.keys(DEFAULT_SURFACE_THEME_SELECTIONS) as SurfaceThemeSlot[];

export const isSurfaceThemeVariant = (value: unknown): value is SurfaceThemeVariant =>
    typeof value === 'string' && SURFACE_THEME_VARIANT_SET.has(value as SurfaceThemeVariant);

export const normalizeSurfaceThemeSelections = (value: unknown): SurfaceThemeSelections => {
    if (!value || typeof value !== 'object') {
        return { ...DEFAULT_SURFACE_THEME_SELECTIONS };
    }

    const candidate = value as Partial<Record<SurfaceThemeSlot, unknown>>;

    return SURFACE_THEME_SLOTS.reduce<SurfaceThemeSelections>(
        (next, slot) => ({
            ...next,
            [slot]: isSurfaceThemeVariant(candidate[slot])
                ? candidate[slot]
                : DEFAULT_SURFACE_THEME_SELECTIONS[slot],
        }),
        { ...DEFAULT_SURFACE_THEME_SELECTIONS }
    );
};
