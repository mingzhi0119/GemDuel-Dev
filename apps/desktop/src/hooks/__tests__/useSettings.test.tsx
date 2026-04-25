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
        expect(currentResult?.resolvedInitialLocale).toBe('en');
        expect(currentResult?.GAME_CONFIG).toMatchObject({
            difficulty: 'NORMAL',
            playerNames: { p1: 'Player 1', p2: 'Player 2' },
        });

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored).toMatchObject({ theme: 'dark' });
        expect(stored.surfaceTheme).toEqual(DEFAULT_SURFACE_THEME_SELECTIONS);
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

    it('restores explicit locale preference from storage and persists explicit changes', () => {
        window.localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify({ theme: 'light', locale: 'zh' })
        );

        renderHarness();

        expect(currentResult?.theme).toBe('light');
        expect(currentResult?.locale).toBe('zh');
        expect(currentResult?.surfaceTheme).toEqual(DEFAULT_SURFACE_THEME_SELECTIONS);

        act(() => {
            currentResult?.setTheme('dark');
            currentResult?.setLocale('en');
            currentResult?.setSurfaceTheme((current) => ({
                ...current,
                playerZone: 'royal',
                marketBackground: 'wood',
            }));
        });

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.locale).toBe('en');
        expect(currentResult?.surfaceTheme.playerZone).toBe('royal');
        expect(currentResult?.surfaceTheme.marketBackground).toBe('wood');

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored).toMatchObject({ theme: 'dark', locale: 'en' });
        expect(stored.surfaceTheme).toMatchObject({
            playerZone: 'royal',
            marketBackground: 'wood',
        });
    });

    it('falls back cleanly when stored settings JSON is invalid', () => {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, '{');

        renderHarness();

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.locale).toBe('en');
        expect(currentResult?.hasExplicitLocalePreference).toBe(false);

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored).toMatchObject({ theme: 'dark' });
        expect(stored.surfaceTheme).toEqual(DEFAULT_SURFACE_THEME_SELECTIONS);
        expect(stored.locale).toBeUndefined();
    });

    it('sanitizes invalid stored values and supports updater-form locale changes', () => {
        window.localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify({
                theme: 'neon',
                locale: 'fr',
                surfaceTheme: { playerZone: 'geek', tablecloth: 'sparkle' },
            })
        );

        renderHarness();

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.locale).toBe('en');
        expect(currentResult?.hasExplicitLocalePreference).toBe(false);
        expect(currentResult?.surfaceTheme).toEqual({
            ...DEFAULT_SURFACE_THEME_SELECTIONS,
            playerZone: 'geek',
        });

        act(() => {
            currentResult?.setLocale((current) => (current === 'en' ? 'zh' : 'en'));
        });

        expect(currentResult?.locale).toBe('zh');
        expect(currentResult?.hasExplicitLocalePreference).toBe(true);

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored).toMatchObject({ theme: 'dark', locale: 'zh' });
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
            currentResult?.setTheme('light');
        });

        expect(currentResult?.locale).toBe('en');
        expect(currentResult?.theme).toBe('light');
    });
});
