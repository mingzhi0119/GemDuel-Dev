import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SETTINGS_STORAGE_KEY, useSettings } from '../useSettings';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useSettings', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useSettings> | null = null;

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

        act(() => {
            currentResult?.setTheme('dark');
            currentResult?.setLocale('en');
        });

        expect(currentResult?.theme).toBe('dark');
        expect(currentResult?.locale).toBe('en');

        const stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
        expect(stored).toMatchObject({ theme: 'dark', locale: 'en' });
    });
});
