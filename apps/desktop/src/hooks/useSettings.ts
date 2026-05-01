import { useEffect, useMemo, useState } from 'react';
import type { AppLocale, ThemeName } from '@gemduel/shared';
import { getPlayerDisplayName, resolveSystemAppLocale } from '@gemduel/shared';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
    normalizeSurfaceThemeSelections,
    type SurfaceThemeSelections,
} from '../app/shell/surfaceTheme';

export const SETTINGS_STORAGE_KEY = 'gemduel.preferences.v1';

export interface StoredAppSettings {
    theme?: 'light' | ThemeName;
    locale?: AppLocale;
    surfaceTheme?: SurfaceThemeSelections;
    surfaceThemeDefaultVersion?: string;
    soundEnabled?: boolean;
}

const DEFAULT_THEME: ThemeName = 'dark';
const DEFAULT_SOUND_ENABLED = true;
const SURFACE_THEME_DEFAULT_VERSION = 'royal-luxury-default-2026-04-29';
const OLD_CRYSTAL_DEFAULT_SURFACE_THEME_SELECTIONS: SurfaceThemeSelections = {
    background: 'crystal-anime',
    playerZone: 'crystal-anime',
    gemPanel: 'crystal-anime',
    effects: 'anime',
};

const isOldCrystalDefaultSurfaceTheme = (value: unknown): boolean => {
    const normalized = normalizeSurfaceThemeSelections(value);

    return (
        normalized.background === OLD_CRYSTAL_DEFAULT_SURFACE_THEME_SELECTIONS.background &&
        normalized.playerZone === OLD_CRYSTAL_DEFAULT_SURFACE_THEME_SELECTIONS.playerZone &&
        normalized.gemPanel === OLD_CRYSTAL_DEFAULT_SURFACE_THEME_SELECTIONS.gemPanel &&
        normalized.effects === OLD_CRYSTAL_DEFAULT_SURFACE_THEME_SELECTIONS.effects
    );
};

const normalizeStoredSurfaceTheme = (
    value: unknown,
    surfaceThemeDefaultVersion: unknown
): SurfaceThemeSelections => {
    if (
        surfaceThemeDefaultVersion !== SURFACE_THEME_DEFAULT_VERSION &&
        isOldCrystalDefaultSurfaceTheme(value)
    ) {
        return { ...DEFAULT_SURFACE_THEME_SELECTIONS };
    }

    return normalizeSurfaceThemeSelections(value);
};

const readStoredSettings = (): StoredAppSettings | null => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<StoredAppSettings>;
        return {
            theme: DEFAULT_THEME,
            locale: parsed.locale === 'zh' || parsed.locale === 'en' ? parsed.locale : undefined,
            surfaceTheme: normalizeStoredSurfaceTheme(
                parsed.surfaceTheme,
                parsed.surfaceThemeDefaultVersion
            ),
            surfaceThemeDefaultVersion: SURFACE_THEME_DEFAULT_VERSION,
            soundEnabled:
                typeof parsed.soundEnabled === 'boolean'
                    ? parsed.soundEnabled
                    : DEFAULT_SOUND_ENABLED,
        };
    } catch {
        return null;
    }
};

const resolveInitialSettings = () => {
    const stored = readStoredSettings();
    const resolvedInitialLocale =
        stored?.locale ??
        resolveSystemAppLocale(typeof navigator !== 'undefined' ? navigator.language : undefined);

    return {
        theme: DEFAULT_THEME,
        locale: resolvedInitialLocale,
        surfaceTheme: stored?.surfaceTheme ?? DEFAULT_SURFACE_THEME_SELECTIONS,
        soundEnabled: stored?.soundEnabled ?? DEFAULT_SOUND_ENABLED,
        hasExplicitLocalePreference: Boolean(stored?.locale),
        resolvedInitialLocale,
    };
};

export const useSettings = () => {
    const initial = useMemo(resolveInitialSettings, []);
    const theme = DEFAULT_THEME;
    const [locale, setLocaleState] = useState<AppLocale>(initial.locale);
    const [surfaceTheme, setSurfaceTheme] = useState<SurfaceThemeSelections>(initial.surfaceTheme);
    const [soundEnabled, setSoundEnabled] = useState(initial.soundEnabled);
    const [hasExplicitLocalePreference, setHasExplicitLocalePreference] = useState(
        initial.hasExplicitLocalePreference
    );

    useEffect(() => {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }

        const payload: Omit<StoredAppSettings, 'theme'> = {
            ...(hasExplicitLocalePreference ? { locale } : {}),
            surfaceTheme,
            surfaceThemeDefaultVersion: SURFACE_THEME_DEFAULT_VERSION,
            soundEnabled,
        };

        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    }, [hasExplicitLocalePreference, locale, soundEnabled, surfaceTheme]);

    const setLocale = (value: AppLocale | ((current: AppLocale) => AppLocale)) => {
        setHasExplicitLocalePreference(true);
        setLocaleState((current) => (typeof value === 'function' ? value(current) : value));
    };

    const GAME_CONFIG = useMemo(
        () => ({
            difficulty: 'NORMAL',
            playerNames: {
                p1: getPlayerDisplayName('p1', locale),
                p2: getPlayerDisplayName('p2', locale),
            },
        }),
        [locale]
    );

    return {
        theme,
        locale,
        setLocale,
        surfaceTheme,
        setSurfaceTheme,
        soundEnabled,
        setSoundEnabled,
        hasExplicitLocalePreference,
        resolvedInitialLocale: initial.resolvedInitialLocale,
        GAME_CONFIG,
    };
};
