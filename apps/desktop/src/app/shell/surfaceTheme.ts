export type SurfaceThemeVariant =
    | 'crystal-anime'
    | 'royal-luxury'
    | 'dark-arcane'
    | 'clean-boardgame'
    | 'pearl-opaline';
export type SurfaceEffectsSkin = 'anime';

export type SurfaceThemeSlot = 'gemPanel' | 'playerZone' | 'background' | 'effects';

export interface SurfaceThemeSelections {
    background: SurfaceThemeVariant;
    playerZone: SurfaceThemeVariant;
    gemPanel: SurfaceThemeVariant;
    effects: SurfaceEffectsSkin;
}

type LegacySurfaceThemeSlot =
    | 'marketBackground'
    | 'gemPanel'
    | 'playerZone'
    | 'tablecloth'
    | 'shellBackground'
    | 'topBar';
type LegacySurfaceThemeVariant = 'default' | 'wood' | 'royal' | 'minimal' | 'geek';

export const SURFACE_THEME_VARIANTS = [
    'crystal-anime',
    'royal-luxury',
    'dark-arcane',
    'clean-boardgame',
    'pearl-opaline',
] as const satisfies readonly SurfaceThemeVariant[];

export const DEFAULT_SURFACE_THEME_SELECTIONS: SurfaceThemeSelections = {
    background: 'royal-luxury',
    gemPanel: 'royal-luxury',
    playerZone: 'royal-luxury',
    effects: 'anime',
};

const SURFACE_THEME_VARIANT_SET = new Set<SurfaceThemeVariant>(SURFACE_THEME_VARIANTS);
const LEGACY_SURFACE_THEME_VARIANT_SET = new Set<LegacySurfaceThemeVariant>([
    'default',
    'wood',
    'royal',
    'minimal',
    'geek',
]);
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

const isLegacySurfaceThemeVariant = (value: unknown): value is LegacySurfaceThemeVariant =>
    typeof value === 'string' &&
    LEGACY_SURFACE_THEME_VARIANT_SET.has(value as LegacySurfaceThemeVariant);

const normalizeSurfaceThemeVariant = (
    value: unknown,
    fallback: SurfaceThemeVariant
): SurfaceThemeVariant => {
    if (isSurfaceThemeVariant(value)) {
        return value;
    }

    return isLegacySurfaceThemeVariant(value)
        ? DEFAULT_SURFACE_THEME_SELECTIONS.background
        : fallback;
};

export const normalizeSurfaceThemeSelections = (value: unknown): SurfaceThemeSelections => {
    if (!value || typeof value !== 'object') {
        return { ...DEFAULT_SURFACE_THEME_SELECTIONS };
    }

    const candidate = value as Partial<Record<SurfaceThemeSlot | LegacySurfaceThemeSlot, unknown>>;
    const hasLegacySlots = LEGACY_ONLY_SURFACE_THEME_SLOTS.some((slot) =>
        Object.prototype.hasOwnProperty.call(candidate, slot)
    );

    if (hasLegacySlots) {
        return createSurfaceThemeSelections(
            normalizeSurfaceThemeVariant(
                [
                    candidate.background,
                    candidate.marketBackground,
                    candidate.shellBackground,
                    candidate.gemPanel,
                    candidate.playerZone,
                    candidate.tablecloth,
                ].find(isSurfaceThemeVariant),
                DEFAULT_SURFACE_THEME_SELECTIONS.background
            )
        );
    }

    return {
        background: normalizeSurfaceThemeVariant(
            candidate.background,
            DEFAULT_SURFACE_THEME_SELECTIONS.background
        ),
        playerZone: normalizeSurfaceThemeVariant(
            candidate.playerZone,
            DEFAULT_SURFACE_THEME_SELECTIONS.playerZone
        ),
        gemPanel: normalizeSurfaceThemeVariant(
            candidate.gemPanel,
            DEFAULT_SURFACE_THEME_SELECTIONS.gemPanel
        ),
        effects: isSurfaceEffectsSkin(candidate.effects)
            ? candidate.effects
            : DEFAULT_SURFACE_THEME_SELECTIONS.effects,
    };
};

export const createSurfaceThemeSelections = (
    variant: SurfaceThemeVariant
): SurfaceThemeSelections => ({
    background: variant,
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
