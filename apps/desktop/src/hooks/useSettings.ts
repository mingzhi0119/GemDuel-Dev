import { useEffect, useMemo, useState } from 'react';
import type { AppLocale, DesktopAspectRatio, ThemeName } from '@gemduel/shared';
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
    desktopAspectRatio?: DesktopAspectRatio;
}

const DEFAULT_THEME: ThemeName = 'dark';
export const DEFAULT_DESKTOP_ASPECT_RATIO: DesktopAspectRatio = '16:10';
const SURFACE_THEME_DEFAULT_VERSION = 'royal-luxury-default-2026-04-29';
const OLD_CRYSTAL_DEFAULT_SURFACE_THEME_SELECTIONS: SurfaceThemeSelections = {
    background: 'crystal-anime',
    topBar: 'crystal-anime',
    playerZone: 'crystal-anime',
    gemPanel: 'crystal-anime',
    effects: 'anime',
};

const normalizeDesktopAspectRatio = (value: unknown): DesktopAspectRatio =>
    value === '16:9' ? '16:9' : DEFAULT_DESKTOP_ASPECT_RATIO;

const isOldCrystalDefaultSurfaceTheme = (value: unknown): boolean => {
    const normalized = normalizeSurfaceThemeSelections(value);

    return (
        normalized.background === OLD_CRYSTAL_DEFAULT_SURFACE_THEME_SELECTIONS.background &&
        normalized.topBar === OLD_CRYSTAL_DEFAULT_SURFACE_THEME_SELECTIONS.topBar &&
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
            desktopAspectRatio: normalizeDesktopAspectRatio(parsed.desktopAspectRatio),
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
        desktopAspectRatio: stored?.desktopAspectRatio ?? DEFAULT_DESKTOP_ASPECT_RATIO,
        hasExplicitLocalePreference: Boolean(stored?.locale),
        resolvedInitialLocale,
    };
};

export const useSettings = () => {
    const initial = useMemo(resolveInitialSettings, []);
    const theme = DEFAULT_THEME;
    const [locale, setLocaleState] = useState<AppLocale>(initial.locale);
    const [surfaceTheme, setSurfaceTheme] = useState<SurfaceThemeSelections>(initial.surfaceTheme);
    const [desktopAspectRatio, setDesktopAspectRatio] = useState<DesktopAspectRatio>(
        initial.desktopAspectRatio
    );
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
            desktopAspectRatio,
        };

        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    }, [desktopAspectRatio, hasExplicitLocalePreference, locale, surfaceTheme]);

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
        desktopAspectRatio,
        setDesktopAspectRatio,
        hasExplicitLocalePreference,
        resolvedInitialLocale: initial.resolvedInitialLocale,
        GAME_CONFIG,
    };
};
