import { useEffect, useState } from 'react';
import type { ResponsiveLayout } from '@gemduel/shared/types';

const MOBILE_BREAKPOINT = 1024;
const FALLBACK_VIEWPORT = { width: 1280, height: 800 };
const FALLBACK_DEVICE_PIXEL_RATIO = 1;
const MIN_DESKTOP_EFFECTIVE_WIDTH_PX = 1440;
const MIN_DESKTOP_EFFECTIVE_HEIGHT_PX = 900;
const MOBILE_ZONE_HEIGHT_PX = 286;
const MOBILE_BOARD_SCALE = 0.45;
const MOBILE_DECK_SCALE = 0.55;
const MOBILE_ZONE_SCALE = 0.55;
const MOBILE_MAIN_GAP_PX = 16;

export const DESKTOP_STAGE_WIDTH_PX = 3840;
export const DESKTOP_STAGE_HEIGHT_PX = 2160;
export const DESKTOP_BOARD_SCALE = 1.2;
export const DESKTOP_DECK_SCALE = 1.12;
export const DESKTOP_ZONE_SCALE = 0.96;
export const DESKTOP_ZONE_HEIGHT_PX = 317;
export const DESKTOP_MAIN_GAP_PX = 24;

interface ResponsiveViewportMetrics {
    devicePixelRatio?: number;
    isFinePointer?: boolean;
}

const getSafeDevicePixelRatio = (value?: number) =>
    Number.isFinite(value) && (value ?? 0) > 0 ? (value as number) : FALLBACK_DEVICE_PIXEL_RATIO;

const canUseDesktopLayout = (
    viewportWidth: number,
    viewportHeight: number,
    devicePixelRatio: number,
    isFinePointer: boolean
) =>
    viewportWidth >= MOBILE_BREAKPOINT ||
    (isFinePointer &&
        viewportWidth * devicePixelRatio >= MIN_DESKTOP_EFFECTIVE_WIDTH_PX &&
        viewportHeight * devicePixelRatio >= MIN_DESKTOP_EFFECTIVE_HEIGHT_PX);

const getViewport = () => {
    if (typeof window === 'undefined') {
        return {
            ...FALLBACK_VIEWPORT,
            devicePixelRatio: FALLBACK_DEVICE_PIXEL_RATIO,
            isFinePointer: false,
        };
    }

    const finePointerMedia =
        typeof window.matchMedia === 'function'
            ? window.matchMedia('(hover: hover) and (pointer: fine)')
            : null;

    return {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: getSafeDevicePixelRatio(window.devicePixelRatio),
        isFinePointer: finePointerMedia?.matches ?? false,
    };
};

const calculateStageInsetPx = (viewportSpan: number, scaledStageSpan: number) =>
    Math.max(0, Math.round((viewportSpan - scaledStageSpan) / 2));

const calculateDesktopStageCanvasSpanPx = (referenceSpan: number, devicePixelRatio: number) =>
    referenceSpan / devicePixelRatio;

export const calculateResponsiveLayout = (
    viewportWidth: number,
    viewportHeight: number,
    metrics: ResponsiveViewportMetrics = {}
): ResponsiveLayout => {
    const safeWidth = Math.max(viewportWidth, 1);
    const safeHeight = Math.max(viewportHeight, 1);
    const aspectRatio = safeWidth / safeHeight;
    const devicePixelRatio = getSafeDevicePixelRatio(metrics.devicePixelRatio);
    const isFinePointer = metrics.isFinePointer ?? false;

    if (!canUseDesktopLayout(safeWidth, safeHeight, devicePixelRatio, isFinePointer)) {
        return {
            layoutMode: 'mobile',
            viewportWidth: safeWidth,
            viewportHeight: safeHeight,
            aspectRatio,
            stageCanvasWidthPx: safeWidth,
            stageCanvasHeightPx: safeHeight,
            stageScale: 1,
            stageInsetXPx: 0,
            stageInsetYPx: 0,
            boardScale: MOBILE_BOARD_SCALE,
            deckScale: MOBILE_DECK_SCALE,
            zoneScale: MOBILE_ZONE_SCALE,
            zoneHeightPx: MOBILE_ZONE_HEIGHT_PX,
            mainGapPx: MOBILE_MAIN_GAP_PX,
        };
    }

    const stageCanvasWidthPx = calculateDesktopStageCanvasSpanPx(
        DESKTOP_STAGE_WIDTH_PX,
        devicePixelRatio
    );
    const stageScale = safeWidth / stageCanvasWidthPx;
    const stageCanvasHeightPx = safeHeight / stageScale;
    const scaledStageWidth = stageCanvasWidthPx * stageScale;
    const scaledStageHeight = stageCanvasHeightPx * stageScale;

    return {
        layoutMode: 'desktop-4k',
        viewportWidth: safeWidth,
        viewportHeight: safeHeight,
        aspectRatio,
        stageCanvasWidthPx,
        stageCanvasHeightPx,
        stageScale,
        stageInsetXPx: calculateStageInsetPx(safeWidth, scaledStageWidth),
        stageInsetYPx: calculateStageInsetPx(safeHeight, scaledStageHeight),
        boardScale: DESKTOP_BOARD_SCALE,
        deckScale: DESKTOP_DECK_SCALE,
        zoneScale: DESKTOP_ZONE_SCALE,
        zoneHeightPx: DESKTOP_ZONE_HEIGHT_PX,
        mainGapPx: DESKTOP_MAIN_GAP_PX,
    };
};

export const useResponsiveLayout = () => {
    const [layout, setLayout] = useState<ResponsiveLayout>(() => {
        const viewport = getViewport();
        return calculateResponsiveLayout(viewport.width, viewport.height, viewport);
    });

    useEffect(() => {
        const updateLayout = () => {
            const viewport = getViewport();
            setLayout(calculateResponsiveLayout(viewport.width, viewport.height, viewport));
        };

        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    return layout;
};
