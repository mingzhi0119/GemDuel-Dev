import { useEffect, useMemo, useState } from 'react';
import type { AppLocale } from '@gemduel/shared';
import { getPlayerDisplayName, resolveSystemAppLocale } from '@gemduel/shared';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
    normalizeSurfaceThemeSelections,
    type SurfaceThemeSelections,
} from '../app/shell/surfaceTheme';

export const SETTINGS_STORAGE_KEY = 'gemduel.preferences.v1';

export interface StoredAppSettings {
    theme: 'light' | 'dark';
    locale?: AppLocale;
    surfaceTheme?: SurfaceThemeSelections;
}

const DEFAULT_THEME: StoredAppSettings['theme'] = 'dark';

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
            theme: parsed.theme === 'light' ? 'light' : 'dark',
            locale: parsed.locale === 'zh' || parsed.locale === 'en' ? parsed.locale : undefined,
            surfaceTheme: normalizeSurfaceThemeSelections(parsed.surfaceTheme),
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
        theme: stored?.theme ?? DEFAULT_THEME,
        locale: resolvedInitialLocale,
        surfaceTheme: stored?.surfaceTheme ?? DEFAULT_SURFACE_THEME_SELECTIONS,
        hasExplicitLocalePreference: Boolean(stored?.locale),
        resolvedInitialLocale,
    };
};

export const useSettings = () => {
    const initial = useMemo(resolveInitialSettings, []);
    const [theme, setTheme] = useState<StoredAppSettings['theme']>(initial.theme);
    const [locale, setLocaleState] = useState<AppLocale>(initial.locale);
    const [surfaceTheme, setSurfaceTheme] = useState<SurfaceThemeSelections>(initial.surfaceTheme);
    const [hasExplicitLocalePreference, setHasExplicitLocalePreference] = useState(
        initial.hasExplicitLocalePreference
    );

    useEffect(() => {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }

        const payload: StoredAppSettings = {
            theme,
            ...(hasExplicitLocalePreference ? { locale } : {}),
            surfaceTheme,
        };

        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    }, [hasExplicitLocalePreference, locale, surfaceTheme, theme]);

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
        setTheme,
        locale,
        setLocale,
        surfaceTheme,
        setSurfaceTheme,
        hasExplicitLocalePreference,
        resolvedInitialLocale: initial.resolvedInitialLocale,
        GAME_CONFIG,
    };
};
