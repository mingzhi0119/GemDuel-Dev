// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest';
import { getVisualLabMode } from '../visualLabMode';

describe('getVisualLabMode', () => {
    afterEach(() => {
        window.history.replaceState({}, '', '/');
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
});
