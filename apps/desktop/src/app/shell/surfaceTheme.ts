export type SurfaceThemeVariant = 'default' | 'wood' | 'royal' | 'minimal' | 'geek';
export type SurfaceEffectsSkin = 'anime';

export type SurfaceThemeSlot = 'gemPanel' | 'playerZone' | 'background' | 'topBar' | 'effects';

export interface SurfaceThemeSelections {
    background: SurfaceThemeVariant;
    topBar: SurfaceThemeVariant;
    playerZone: SurfaceThemeVariant;
    gemPanel: SurfaceThemeVariant;
    effects: SurfaceEffectsSkin;
}

type LegacySurfaceThemeSlot =
    | 'marketBackground'
    | 'gemPanel'
    | 'playerZone'
    | 'tablecloth'
    | 'shellBackground';

export const SURFACE_THEME_VARIANTS = [
    'default',
    'wood',
    'royal',
    'minimal',
    'geek',
] as const satisfies readonly SurfaceThemeVariant[];

export const DEFAULT_SURFACE_THEME_SELECTIONS: SurfaceThemeSelections = {
    background: 'default',
    topBar: 'default',
    gemPanel: 'default',
    playerZone: 'default',
    effects: 'anime',
};

const SURFACE_THEME_VARIANT_SET = new Set<SurfaceThemeVariant>(SURFACE_THEME_VARIANTS);
export const SURFACE_THEME_SLOTS = Object.keys(
    DEFAULT_SURFACE_THEME_SELECTIONS
) as SurfaceThemeSlot[];
const LEGACY_ONLY_SURFACE_THEME_SLOTS: LegacySurfaceThemeSlot[] = [
    'marketBackground',
    'shellBackground',
    'tablecloth',
];

export const isSurfaceThemeVariant = (value: unknown): value is SurfaceThemeVariant =>
    typeof value === 'string' && SURFACE_THEME_VARIANT_SET.has(value as SurfaceThemeVariant);

export const isSurfaceEffectsSkin = (value: unknown): value is SurfaceEffectsSkin =>
    value === 'anime';

const resolveBundledVariant = (
    candidate: Partial<Record<SurfaceThemeSlot | LegacySurfaceThemeSlot, unknown>>
): SurfaceThemeVariant =>
    [
        candidate.background,
        candidate.marketBackground,
        candidate.shellBackground,
        candidate.gemPanel,
        candidate.playerZone,
        candidate.tablecloth,
        candidate.topBar,
    ].find(isSurfaceThemeVariant) ?? DEFAULT_SURFACE_THEME_SELECTIONS.background;

export const normalizeSurfaceThemeSelections = (value: unknown): SurfaceThemeSelections => {
    if (!value || typeof value !== 'object') {
        return { ...DEFAULT_SURFACE_THEME_SELECTIONS };
    }

    const candidate = value as Partial<Record<SurfaceThemeSlot | LegacySurfaceThemeSlot, unknown>>;
    const hasLegacySlots = LEGACY_ONLY_SURFACE_THEME_SLOTS.some((slot) =>
        Object.prototype.hasOwnProperty.call(candidate, slot)
    );

    if (hasLegacySlots) {
        return createSurfaceThemeSelections(resolveBundledVariant(candidate));
    }

    return {
        background: isSurfaceThemeVariant(candidate.background)
            ? candidate.background
            : DEFAULT_SURFACE_THEME_SELECTIONS.background,
        topBar: isSurfaceThemeVariant(candidate.topBar)
            ? candidate.topBar
            : DEFAULT_SURFACE_THEME_SELECTIONS.topBar,
        playerZone: isSurfaceThemeVariant(candidate.playerZone)
            ? candidate.playerZone
            : DEFAULT_SURFACE_THEME_SELECTIONS.playerZone,
        gemPanel: isSurfaceThemeVariant(candidate.gemPanel)
            ? candidate.gemPanel
            : DEFAULT_SURFACE_THEME_SELECTIONS.gemPanel,
        effects: isSurfaceEffectsSkin(candidate.effects)
            ? candidate.effects
            : DEFAULT_SURFACE_THEME_SELECTIONS.effects,
    };
};

export const createSurfaceThemeSelections = (
    variant: SurfaceThemeVariant
): SurfaceThemeSelections => ({
    background: variant,
    topBar: variant,
    playerZone: variant,
    gemPanel: variant,
    effects: 'anime',
});

export const getSurfaceThemeVariant = (
    surfaceTheme: SurfaceThemeSelections | undefined
): SurfaceThemeVariant => normalizeSurfaceThemeSelections(surfaceTheme).background;

export const getNextSurfaceThemeVariant = (variant: SurfaceThemeVariant): SurfaceThemeVariant => {
    const currentIndex = SURFACE_THEME_VARIANTS.indexOf(variant);
    const nextIndex = (currentIndex + 1) % SURFACE_THEME_VARIANTS.length;
    return SURFACE_THEME_VARIANTS[nextIndex];
};

export const getNextSurfaceThemeSelections = (
    surfaceTheme: SurfaceThemeSelections | undefined
): SurfaceThemeSelections =>
    createSurfaceThemeSelections(getNextSurfaceThemeVariant(getSurfaceThemeVariant(surfaceTheme)));
