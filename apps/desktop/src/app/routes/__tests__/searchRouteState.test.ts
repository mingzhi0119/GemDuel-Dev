// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    EMPTY_SEARCH_ROUTE,
    buildSearchRouteUrl,
    readSearchRouteState,
    writeSearchRouteHistory,
} from '../searchRouteState';

const resetUrl = (url = '/') => {
    window.history.replaceState(null, '', url);
};

describe('search route state', () => {
    afterEach(() => {
        resetUrl();
        vi.restoreAllMocks();
    });

    it('uses visual lab query state before setup or matchmaking routes', () => {
        resetUrl('/?setup=classic&matchmaking=online&visualLab=motion');

        expect(readSearchRouteState()).toEqual({
            setupRoute: 'none',
            matchmakingRoute: 'none',
            visualLabMode: 'motion',
        });
    });

    it('reads matchmaking, setup, and invalid queries into explicit route states', () => {
        resetUrl('/?matchmaking=lan');
        expect(readSearchRouteState()).toEqual({
            setupRoute: 'none',
            matchmakingRoute: 'lan',
            visualLabMode: null,
        });

        resetUrl('/?setup=roguelike');
        expect(readSearchRouteState()).toEqual({
            setupRoute: 'roguelike',
            matchmakingRoute: 'none',
            visualLabMode: null,
        });

        resetUrl('/?setup=unknown&matchmaking=remote');
        expect(readSearchRouteState()).toBe(EMPTY_SEARCH_ROUTE);
    });

    it('builds canonical URLs by clearing stale route query params and preserving hashes', () => {
        resetUrl('/?setup=classic&matchmaking=online&visualLab=surfaces&foo=bar#panel');

        expect(
            buildSearchRouteUrl({
                setupRoute: 'roguelike',
                matchmakingRoute: 'none',
                visualLabMode: null,
            })
        ).toBe('/?foo=bar&setup=roguelike#panel');

        expect(
            buildSearchRouteUrl({
                setupRoute: 'classic',
                matchmakingRoute: 'lan',
                visualLabMode: null,
            })
        ).toBe('/?foo=bar&matchmaking=lan#panel');

        expect(
            buildSearchRouteUrl({
                setupRoute: 'classic',
                matchmakingRoute: 'online',
                visualLabMode: 'readability',
            })
        ).toBe('/?foo=bar&visualLab=readability#panel');
    });

    it('writes push, replace, and no-op history updates intentionally', () => {
        resetUrl('/');
        const pushState = vi.spyOn(window.history, 'pushState');
        const replaceState = vi.spyOn(window.history, 'replaceState');

        writeSearchRouteHistory({
            setupRoute: 'classic',
            matchmakingRoute: 'none',
            visualLabMode: null,
        });
        expect(pushState).toHaveBeenCalledWith(null, '', '/?setup=classic');

        writeSearchRouteHistory(
            {
                setupRoute: 'none',
                matchmakingRoute: 'online',
                visualLabMode: null,
            },
            'replace'
        );
        expect(replaceState).toHaveBeenCalledWith(null, '', '/?matchmaking=online');

        pushState.mockClear();
        replaceState.mockClear();
        writeSearchRouteHistory(
            {
                setupRoute: 'none',
                matchmakingRoute: 'online',
                visualLabMode: null,
            },
            'replace'
        );
        expect(pushState).not.toHaveBeenCalled();
        expect(replaceState).not.toHaveBeenCalled();
    });

    it('returns empty state and skips history writes when window is unavailable', () => {
        const originalWindow = window;
        Reflect.deleteProperty(globalThis, 'window');

        try {
            expect(readSearchRouteState()).toBe(EMPTY_SEARCH_ROUTE);
            expect(() =>
                writeSearchRouteHistory({
                    setupRoute: 'classic',
                    matchmakingRoute: 'none',
                    visualLabMode: null,
                })
            ).not.toThrow();
        } finally {
            Object.defineProperty(globalThis, 'window', {
                configurable: true,
                value: originalWindow,
            });
        }
    });
});
