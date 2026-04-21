import type { AppReasonCode } from './reason';

export type ThemeName = 'light' | 'dark';
export type UiNoticeSeverity = 'info' | 'warn' | 'error';

export interface UiStatusNotice {
    code: AppReasonCode;
    message: string;
    severity: UiNoticeSeverity;
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
