import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

const MIN_FIT_SCALE = 0.35;

export const useViewportFitScale = <T extends HTMLElement>(
    targetScale: number,
    marginPx: number
) => {
    const ref = useRef<T | null>(null);
    const [scale, setScale] = useState(targetScale);

    const updateScale = useCallback(() => {
        if (typeof window === 'undefined' || !ref.current) {
            setScale(targetScale);
            return;
        }

        const contentWidth = Math.max(ref.current.scrollWidth || ref.current.offsetWidth, 1);
        const contentHeight = Math.max(ref.current.scrollHeight || ref.current.offsetHeight, 1);
        const availableWidth = Math.max(window.innerWidth - marginPx, 1);
        const availableHeight = Math.max(window.innerHeight - marginPx, 1);
        const nextScale = Math.min(
            targetScale,
            availableWidth / contentWidth,
            availableHeight / contentHeight
        );

        setScale(Number.isFinite(nextScale) ? Math.max(MIN_FIT_SCALE, nextScale) : targetScale);
    }, [marginPx, targetScale]);

    useLayoutEffect(() => {
        updateScale();
    });

    useLayoutEffect(() => {
        updateScale();
        window.addEventListener('resize', updateScale);
        window.visualViewport?.addEventListener('resize', updateScale);

        const resizeObserver =
            typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScale) : null;
        if (ref.current) {
            resizeObserver?.observe(ref.current);
        }

        return () => {
            window.removeEventListener('resize', updateScale);
            window.visualViewport?.removeEventListener('resize', updateScale);
            resizeObserver?.disconnect();
        };
    }, [updateScale]);

    return {
        ref,
        style: { transform: `scale(${scale})` } satisfies CSSProperties,
        scale,
    };
};
