import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SETTINGS_STORAGE_KEY, useSettings } from '../useSettings';
import { DEFAULT_SURFACE_THEME_SELECTIONS } from '../../app/shell/surfaceTheme';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useSettings', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useSettings> | null = null;
    const originalLocalStorage = window.localStorage;

    const renderHarness = () => {
        const Harness = () => {
            currentResult = useSettings();
            return null;
        };

        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);
        }

        act(() => {
            root?.render(React.createElement(Harness));
        });
    };

    const setNavigatorLanguage = (value: string) => {
        Object.defineProperty(window.navigator, 'language', {
            configurable: true,
            value,
        });
    };

    beforeEach(() => {
        currentResult = null;
        window.localStorage.clear();
        setNavigatorLanguage('en-US');
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: originalLocalStorage,
        });
        vi.restoreAllMocks();
    });

    it('defaults to English on first launch for non-Chinese systems and does not persist locale implicitly', () => {
        renderHarness();

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.locale).toBe('en');
        expect(currentResult?.soundEnabled).toBe(true);
        expect(currentResult?.resolvedInitialLocale).toBe('en');
        expect(currentResult?.GAME_CONFIG).toMatchObject({
            difficulty: 'NORMAL',
            playerNames: { p1: 'Player 1', p2: 'Player 2' },
        });

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored.theme).toBeUndefined();
        expect(stored.surfaceTheme).toEqual(DEFAULT_SURFACE_THEME_SELECTIONS);
        expect(stored.soundEnabled).toBe(true);
        expect(stored.desktopAspectRatio).toBeUndefined();
        expect(stored.locale).toBeUndefined();
    });

    it('resolves Simplified Chinese when system language starts with zh', () => {
        setNavigatorLanguage('zh-HK');
        renderHarness();

        expect(currentResult?.locale).toBe('zh');
        expect(currentResult?.resolvedInitialLocale).toBe('zh');
        expect(currentResult?.GAME_CONFIG.playerNames).toEqual({
            p1: '玩家 1',
            p2: '玩家 2',
        });
    });

    it('normalizes legacy theme preferences to dark and persists explicit changes', () => {
        window.localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify({
                theme: 'light',
                locale: 'zh',
                soundEnabled: false,
                desktopAspectRatio: '16:9',
            })
        );

        renderHarness();

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.locale).toBe('zh');
        expect(currentResult?.soundEnabled).toBe(false);
        expect(currentResult?.surfaceTheme).toEqual(DEFAULT_SURFACE_THEME_SELECTIONS);

        act(() => {
            currentResult?.setLocale('en');
            currentResult?.setSoundEnabled(true);
            currentResult?.setSurfaceTheme((current) => ({
                ...current,
                background: 'royal-luxury',
                gemPanel: 'royal-luxury',
                playerZone: 'dark-arcane',
            }));
        });

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.locale).toBe('en');
        expect(currentResult?.soundEnabled).toBe(true);
        expect(currentResult?.surfaceTheme.playerZone).toBe('dark-arcane');
        expect(currentResult?.surfaceTheme.background).toBe('royal-luxury');
        expect(currentResult?.surfaceTheme.gemPanel).toBe('royal-luxury');
        expect(currentResult?.surfaceTheme.effects).toBe('anime');

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored).toMatchObject({
            locale: 'en',
            soundEnabled: true,
        });
        expect(stored.theme).toBeUndefined();
        expect(stored.desktopAspectRatio).toBeUndefined();
        expect(stored.surfaceTheme).toMatchObject({
            background: 'royal-luxury',
            gemPanel: 'royal-luxury',
            playerZone: 'dark-arcane',
            effects: 'anime',
        });
    });

    it('migrates the old all-crystal default surface selection to the royal runtime default', () => {
        window.localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify({
                surfaceTheme: {
                    background: 'crystal-anime',
                    topBar: 'crystal-anime',
                    gemPanel: 'crystal-anime',
                    playerZone: 'crystal-anime',
                    effects: 'anime',
                },
            })
        );

        renderHarness();

        expect(currentResult?.surfaceTheme).toEqual(DEFAULT_SURFACE_THEME_SELECTIONS);

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored.surfaceTheme).toEqual(DEFAULT_SURFACE_THEME_SELECTIONS);
        expect(stored.soundEnabled).toBe(true);
        expect(stored.surfaceThemeDefaultVersion).toBe('royal-luxury-default-2026-04-29');
    });

    it('preserves current-version intentional all-crystal surface selections', () => {
        const crystalSurfaceTheme = {
            background: 'crystal-anime',
            gemPanel: 'crystal-anime',
            playerZone: 'crystal-anime',
            effects: 'anime',
        };

        window.localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify({
                surfaceTheme: crystalSurfaceTheme,
                surfaceThemeDefaultVersion: 'royal-luxury-default-2026-04-29',
            })
        );

        renderHarness();

        expect(currentResult?.surfaceTheme).toEqual(crystalSurfaceTheme);
    });

    it('falls back cleanly when stored settings JSON is invalid', () => {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, '{');

        renderHarness();

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.locale).toBe('en');
        expect(currentResult?.soundEnabled).toBe(true);
        expect(currentResult?.hasExplicitLocalePreference).toBe(false);

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored.theme).toBeUndefined();
        expect(stored.surfaceTheme).toEqual(DEFAULT_SURFACE_THEME_SELECTIONS);
        expect(stored.soundEnabled).toBe(true);
        expect(stored.desktopAspectRatio).toBeUndefined();
        expect(stored.locale).toBeUndefined();
    });

    it('sanitizes invalid stored values and supports updater-form locale changes', () => {
        window.localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify({
                theme: 'neon',
                locale: 'fr',
                soundEnabled: 'yes',
                surfaceTheme: { playerZone: 'geek', tablecloth: 'sparkle' },
                desktopAspectRatio: '21:9',
            })
        );

        renderHarness();

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.locale).toBe('en');
        expect(currentResult?.soundEnabled).toBe(true);
        expect(currentResult?.hasExplicitLocalePreference).toBe(false);
        expect(currentResult?.surfaceTheme).toEqual(DEFAULT_SURFACE_THEME_SELECTIONS);

        act(() => {
            currentResult?.setLocale((current) => (current === 'en' ? 'zh' : 'en'));
        });

        expect(currentResult?.locale).toBe('zh');
        expect(currentResult?.hasExplicitLocalePreference).toBe(true);

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored).toMatchObject({ locale: 'zh' });
        expect(stored.soundEnabled).toBe(true);
        expect(stored.theme).toBeUndefined();
        expect(stored.desktopAspectRatio).toBeUndefined();
    });

    it('skips storage persistence when localStorage is unavailable', () => {
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            value: undefined,
        });

        setNavigatorLanguage('zh-CN');
        renderHarness();

        expect(currentResult?.locale).toBe('zh');
        expect(currentResult?.resolvedInitialLocale).toBe('zh');

        act(() => {
            currentResult?.setLocale('en');
        });

        expect(currentResult?.locale).toBe('en');
        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.soundEnabled).toBe(true);
    });

    it('persists explicit sound preference changes', () => {
        renderHarness();

        act(() => {
            currentResult?.setSoundEnabled(false);
        });

        expect(currentResult?.soundEnabled).toBe(false);

        let stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored.soundEnabled).toBe(false);

        act(() => {
            currentResult?.setSoundEnabled((current) => !current);
        });

        expect(currentResult?.soundEnabled).toBe(true);

        stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored.soundEnabled).toBe(true);
    });
});
