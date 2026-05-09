// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { getVisualLabMode } from '../visualLabMode';

describe('getVisualLabMode', () => {
    afterEach(() => {
        window.history.replaceState({}, '', '/');
        delete window.__GEMDUEL_RUNTIME_CONFIG__;
        vi.unstubAllEnvs();
    });

    it('reads known visual lab modes from the query string', () => {
        window.history.replaceState({}, '', '/?visualLab=surfaces');
        expect(getVisualLabMode()).toBe('surfaces');

        window.history.replaceState({}, '', '/?visualLab=motion');
        expect(getVisualLabMode()).toBe('motion');

        window.history.replaceState({}, '', '/?visualLab=readability');
        expect(getVisualLabMode()).toBe('readability');
    });

    it('returns null for unknown or missing visual lab params', () => {
        window.history.replaceState({}, '', '/?visualLab=unknown');
        expect(getVisualLabMode()).toBeNull();

        window.history.replaceState({}, '', '/');
        expect(getVisualLabMode()).toBeNull();
    });

    it('returns null when window is unavailable', () => {
        const originalWindow = window;
        Reflect.deleteProperty(globalThis, 'window');

        try {
            expect(getVisualLabMode()).toBeNull();
        } finally {
            Object.defineProperty(globalThis, 'window', {
                configurable: true,
                value: originalWindow,
            });
        }
    });

    it('requires an explicit runtime bridge unlock outside Vite dev', () => {
        vi.stubEnv('DEV', false);
        window.history.replaceState({}, '', '/?visualLab=surfaces');
        window.__GEMDUEL_RUNTIME_CONFIG__ = { allowVisualLab: false };

        expect(getVisualLabMode()).toBeNull();

        window.__GEMDUEL_RUNTIME_CONFIG__ = { allowVisualLab: true };
        expect(getVisualLabMode()).toBe('surfaces');
    });
});
