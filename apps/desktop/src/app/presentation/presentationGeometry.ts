export interface PresentationPoint {
    x: number;
    y: number;
}

export interface PresentationRect extends PresentationPoint {
    width: number;
    height: number;
}

export const getElementRect = (selector: string): PresentationRect | null => {
    if (typeof document === 'undefined') {
        return null;
    }

    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
        return null;
    }

    const rect = element.getBoundingClientRect();
    return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
    };
};

export const getRectCenter = (rect: PresentationRect): PresentationPoint => ({
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
});

export const getViewportCenter = (): PresentationPoint => ({
    x: typeof window === 'undefined' ? 0 : window.innerWidth / 2,
    y: typeof window === 'undefined' ? 0 : window.innerHeight / 2,
});

export const getAnchorCenter = (
    selector: string,
    fallback = getViewportCenter()
): PresentationPoint => {
    const rect = getElementRect(selector);
    return rect ? getRectCenter(rect) : fallback;
};
