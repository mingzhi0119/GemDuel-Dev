import type { AppReasonCode } from './reason';

export type ThemeName = 'dark';
export type UiNoticeSeverity = 'info' | 'warn' | 'error';

export interface UiStatusNotice {
    code: AppReasonCode;
    message: string;
    severity: UiNoticeSeverity;
}

export interface NormalizedPoint {
    x: number;
    y: number;
}

export interface NormalizedRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface NormalizedGridLines {
    x: number[];
    y: number[];
}

export interface GemPanelSkin {
    id: string;
    artworkPath: string;
    intrinsicWidthPx: number;
    intrinsicHeightPx: number;
    playfieldRectNormalized: NormalizedRect;
    cellCentersNormalized?: NormalizedPoint[];
    cellGridLinesNormalized?: NormalizedGridLines;
    gemDiameterNormalized?: number;
}

export interface ResponsiveLayout {
    layoutMode: 'mobile' | 'desktop-4k';
    viewportWidth: number;
    viewportHeight: number;
    aspectRatio: number;
    stageCanvasWidthPx: number;
    stageCanvasHeightPx: number;
    stageScale: number;
    stageInsetXPx: number;
    stageInsetYPx: number;
    boardScale: number;
    deckScale: number;
    zoneScale: number;
    zoneHeightPx: number;
    mainGapPx: number;
}
