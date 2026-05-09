export const canInstallParityHarness = () =>
    typeof window !== 'undefined' &&
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('parityHarness') === '1';

export const waitForStableFrame = async () => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
};

export const waitForCondition = async (
    condition: () => boolean,
    attempts = 30
): Promise<boolean> => {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        if (condition()) {
            return true;
        }

        await waitForStableFrame();
    }

    return condition();
};

export const clickElement = (selector: string): boolean => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
        return false;
    }

    element.click();
    return true;
};

export const clearParityErrorBanner = () => {
    document.querySelector('[data-parity-error-banner]')?.remove();
};

export const showParityErrorBanner = (message: string) => {
    clearParityErrorBanner();
    const banner = document.createElement('div');
    banner.dataset.parityErrorBanner = 'true';
    banner.textContent = message;
    Object.assign(banner.style, {
        position: 'fixed',
        left: '34.25vw',
        top: '10.4vh',
        width: '31.5vw',
        height: '4.8vh',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        background: 'rgba(128, 31, 31, 0.92)',
        color: 'white',
        font: '600 14px system-ui, sans-serif',
        pointerEvents: 'none',
    });
    document.body.appendChild(banner);
};
