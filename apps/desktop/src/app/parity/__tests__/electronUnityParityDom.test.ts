import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    canInstallParityHarness,
    clearParityErrorBanner,
    clickElement,
    showParityErrorBanner,
    waitForCondition,
    waitForStableFrame,
} from '../electronUnityParityDom';

describe('electronUnityParityDom', () => {
    const originalRequestAnimationFrame = window.requestAnimationFrame;

    beforeEach(() => {
        document.body.innerHTML = '';
        window.history.pushState({}, '', '/');
        window.requestAnimationFrame = (callback: FrameRequestCallback) => {
            callback(0);
            return 0;
        };
    });

    afterEach(() => {
        document.body.innerHTML = '';
        window.history.pushState({}, '', '/');
        window.requestAnimationFrame = originalRequestAnimationFrame;
        vi.restoreAllMocks();
    });

    it('installs only when the dev parity query flag is present', () => {
        expect(canInstallParityHarness()).toBe(false);

        window.history.pushState({}, '', '/?parityHarness=1');

        expect(canInstallParityHarness()).toBe(true);
    });

    it('waits for two animation frames before resolving a stable frame', async () => {
        const frameSpy = vi.spyOn(window, 'requestAnimationFrame');

        await waitForStableFrame();

        expect(frameSpy).toHaveBeenCalledTimes(2);
    });

    it('polls a condition across stable frames and reports timeout failure', async () => {
        let attempts = 0;

        await expect(
            waitForCondition(() => {
                attempts += 1;
                return attempts === 3;
            }, 4)
        ).resolves.toBe(true);
        expect(attempts).toBe(3);

        await expect(waitForCondition(() => false, 2)).resolves.toBe(false);
    });

    it('clicks matching elements and reports missing selectors', () => {
        const button = document.createElement('button');
        const onClick = vi.fn();
        button.dataset.testTarget = 'true';
        button.addEventListener('click', onClick);
        document.body.appendChild(button);

        expect(clickElement('[data-test-target="true"]')).toBe(true);
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(clickElement('[data-test-target="missing"]')).toBe(false);
    });

    it('renders one parity error banner and clears it', () => {
        showParityErrorBanner('Invalid semantic action');
        showParityErrorBanner('Second error');

        const banners = document.querySelectorAll('[data-parity-error-banner]');
        expect(banners).toHaveLength(1);
        expect(banners[0]?.textContent).toBe('Second error');

        clearParityErrorBanner();

        expect(document.querySelector('[data-parity-error-banner]')).toBeNull();
    });
});
