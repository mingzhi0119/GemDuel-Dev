import { describe, expect, it } from 'vitest';
import { isVisualLabRuntimeUnlocked } from '../visualLabRuntime';

describe('isVisualLabRuntimeUnlocked', () => {
    it('allows Vite dev regardless of bridge', () => {
        expect(
            isVisualLabRuntimeUnlocked({ isViteDev: true, allowVisualLabFromBridge: false })
        ).toBe(true);
        expect(
            isVisualLabRuntimeUnlocked({ isViteDev: true, allowVisualLabFromBridge: undefined })
        ).toBe(true);
    });

    it('allows production when the preload bridge explicitly opts in', () => {
        expect(
            isVisualLabRuntimeUnlocked({ isViteDev: false, allowVisualLabFromBridge: true })
        ).toBe(true);
    });

    it('denies production when the bridge is absent or false', () => {
        expect(
            isVisualLabRuntimeUnlocked({ isViteDev: false, allowVisualLabFromBridge: false })
        ).toBe(false);
        expect(
            isVisualLabRuntimeUnlocked({ isViteDev: false, allowVisualLabFromBridge: undefined })
        ).toBe(false);
    });
});
