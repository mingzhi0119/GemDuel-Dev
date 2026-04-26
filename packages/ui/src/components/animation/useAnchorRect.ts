import { useLayoutEffect, useState } from 'react';

export interface AnchorRect {
    x: number;
    y: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
}

type AnchorTarget = string | HTMLElement | null;

const toAnchorRect = (rect: DOMRect): AnchorRect => ({
    x: rect.x,
    y: rect.y,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
});

const resolveTarget = (target: AnchorTarget): HTMLElement | null => {
    if (typeof document === 'undefined') {
        return null;
    }

    return typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
};

export const useAnchorRect = (target: AnchorTarget) => {
    const [rect, setRect] = useState<AnchorRect | null>(null);

    useLayoutEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const updateRect = () => {
            const element = resolveTarget(target);
            if (!element) {
                setRect(null);
                return;
            }

            setRect(toAnchorRect(element.getBoundingClientRect()));
        };

        const element = resolveTarget(target);
        updateRect();

        const resizeObserver =
            element && typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(updateRect)
                : null;
        if (element && resizeObserver) {
            resizeObserver.observe(element);
        }

        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, true);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect, true);
        };
    }, [target]);

    return { rect, isReady: Boolean(rect) };
};
