import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

const MIN_FIT_SCALE = 0.35;

const readPositiveDimension = (...values: number[]) =>
    values.find((value) => Number.isFinite(value) && value > 0) ?? 0;

const readElementLayoutWidth = (element: HTMLElement | null) =>
    element ? readPositiveDimension(element.offsetWidth, element.clientWidth) : 0;

const readElementLayoutHeight = (element: HTMLElement | null) =>
    element ? readPositiveDimension(element.offsetHeight, element.clientHeight) : 0;

const readContentLayoutWidth = (element: HTMLElement) =>
    readPositiveDimension(element.offsetWidth, element.clientWidth, element.scrollWidth);

const readContentLayoutHeight = (element: HTMLElement) =>
    readPositiveDimension(element.offsetHeight, element.clientHeight, element.scrollHeight);

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

        const contentWidth = Math.max(readContentLayoutWidth(ref.current), 1);
        const contentHeight = Math.max(readContentLayoutHeight(ref.current), 1);
        const parentWidth = readElementLayoutWidth(ref.current.parentElement);
        const parentHeight = readElementLayoutHeight(ref.current.parentElement);
        const availableWidth = Math.max((parentWidth || window.innerWidth) - marginPx, 1);
        const availableHeight = Math.max((parentHeight || window.innerHeight) - marginPx, 1);
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
            if (ref.current.parentElement) {
                resizeObserver?.observe(ref.current.parentElement);
            }
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
