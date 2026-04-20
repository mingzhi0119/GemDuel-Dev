import { useEffect, useState } from 'react';
import type { ResponsiveLayout } from '../types';

const DESKTOP_WIDTH = 1380;
const DESKTOP_HEIGHT = 860;
const MOBILE_BREAKPOINT = 1024;
const FALLBACK_VIEWPORT = { width: 1280, height: 800 };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getViewport = () => {
    if (typeof window === 'undefined') {
        return FALLBACK_VIEWPORT;
    }

    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
};

export const calculateResponsiveLayout = (
    viewportWidth: number,
    viewportHeight: number
): ResponsiveLayout => {
    const safeWidth = Math.max(viewportWidth, 1);
    const safeHeight = Math.max(viewportHeight, 1);
    const aspectRatio = safeWidth / safeHeight;

    if (safeWidth < MOBILE_BREAKPOINT) {
        return {
            layoutMode: 'mobile',
            viewportWidth: safeWidth,
            viewportHeight: safeHeight,
            aspectRatio,
            boardScale: 0.45,
            deckScale: 0.55,
            zoneScale: 0.55,
            zoneHeightPx: 260,
            mainGapPx: 16,
        };
    }

    const aspectBonus = aspectRatio <= 1.68 ? 0.08 : 0.06;
    const baseBoardScale = Math.min(safeWidth / DESKTOP_WIDTH, safeHeight / DESKTOP_HEIGHT);
    const boardScale = clamp(baseBoardScale + aspectBonus, 0.94, 1.14);

    return {
        layoutMode: 'desktop-auto',
        viewportWidth: safeWidth,
        viewportHeight: safeHeight,
        aspectRatio,
        boardScale,
        deckScale: clamp(boardScale + 0.04, 1.0, 1.08),
        zoneScale: clamp(boardScale - 0.04, 0.82, 0.96),
        zoneHeightPx: clamp(
            Math.round(safeHeight * 0.23 + (aspectRatio <= 1.68 ? 24 : 12)),
            212,
            288
        ),
        mainGapPx: clamp(Math.round(safeWidth * 0.016), 24, 32),
    };
};

export const useResponsiveLayout = () => {
    const [layout, setLayout] = useState<ResponsiveLayout>(() => {
        const viewport = getViewport();
        return calculateResponsiveLayout(viewport.width, viewport.height);
    });

    useEffect(() => {
        const updateLayout = () => {
            const viewport = getViewport();
            setLayout(calculateResponsiveLayout(viewport.width, viewport.height));
        };

        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    return layout;
};
