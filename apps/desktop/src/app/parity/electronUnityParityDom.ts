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

export const clickElement = (
    selector: string,
    options: { pointerSequence?: boolean } = {}
): boolean => {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const element =
        candidates.find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) {
                return false;
            }

            const target = document.elementFromPoint(
                rect.x + rect.width / 2,
                rect.y + rect.height / 2
            );
            return Boolean(target && candidate.contains(target));
        }) ??
        candidates.find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }) ??
        candidates[0] ??
        null;
    if (!element) {
        return false;
    }

    const rect = element.getBoundingClientRect();
    const clientX = rect.x + rect.width / 2;
    const clientY = rect.y + rect.height / 2;
    const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const eventTarget = element.contains(target) ? (target ?? element) : element;
    const eventInit = {
        bubbles: true,
        cancelable: true,
        button: 0,
        clientX,
        clientY,
        view: window,
    };
    const createPointerEvent = (type: string, buttons: number) => {
        const pointerInit = {
            ...eventInit,
            buttons,
            pointerId: 1,
            pointerType: 'mouse',
            isPrimary: true,
        };
        return typeof PointerEvent === 'function'
            ? new PointerEvent(type, pointerInit)
            : new MouseEvent(type, pointerInit);
    };
    if (options.pointerSequence !== false) {
        eventTarget.dispatchEvent(createPointerEvent('pointerdown', 1));
    }
    eventTarget.dispatchEvent(new MouseEvent('mousedown', { ...eventInit, buttons: 1 }));
    if (options.pointerSequence !== false) {
        eventTarget.dispatchEvent(createPointerEvent('pointerup', 0));
    }
    eventTarget.dispatchEvent(new MouseEvent('mouseup', { ...eventInit, buttons: 0 }));
    eventTarget.dispatchEvent(new MouseEvent('click', { ...eventInit, buttons: 0 }));
    return true;
};

export const hoverElement = (selector: string): boolean => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
        return false;
    }

    const rect = element.getBoundingClientRect();
    const clientX = rect.x + rect.width / 2;
    const clientY = rect.y + rect.height / 2;
    const eventInit = {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
        view: window,
    };
    element.dispatchEvent(new MouseEvent('mouseover', eventInit));
    element.dispatchEvent(new MouseEvent('mouseenter', { ...eventInit, bubbles: false }));
    element.dispatchEvent(new MouseEvent('mousemove', eventInit));
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
