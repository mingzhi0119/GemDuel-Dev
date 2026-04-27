import type { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import type { useGameLogic } from '../hooks/useGameLogic';
import type { useLanMatchmaking } from '../hooks/useLanMatchmaking';
import type { SurfaceThemeSelections, SurfaceThemeVariant } from '../app/shell/surfaceTheme';
import type { DesktopAspectRatio, PlayerKey, ThemeName } from '@gemduel/shared/types';
import type { AppReasonCode } from '@gemduel/shared/types/reason';

export type { ThemeName } from '@gemduel/shared/types';

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

export type GameLogicController = ReturnType<typeof useGameLogic>;
export type LanMatchmakingController = ReturnType<typeof useLanMatchmaking>;
export type MatchmakingRoute = 'none' | 'online' | 'lan';

export interface AppUiState {
    showDebug: boolean;
    isReviewing: boolean;
    showRulebook: boolean;
    matchmakingRoute: MatchmakingRoute;
    isPeekingBoard: boolean;
    persistentWinner: PlayerKey | null;
    showRestartConfirm: boolean;
}

export interface AppUiSetters {
    setShowDebug: Dispatch<SetStateAction<boolean>>;
    setIsReviewing: Dispatch<SetStateAction<boolean>>;
    setShowRulebook: Dispatch<SetStateAction<boolean>>;
    setMatchmakingRoute: Dispatch<SetStateAction<MatchmakingRoute>>;
    setIsPeekingBoard: Dispatch<SetStateAction<boolean>>;
    setShowRestartConfirm: Dispatch<SetStateAction<boolean>>;
}

export interface AppUiCallbacks {
    handleRestart: () => void;
    handleDownloadReplay: () => void;
    handleUploadReplay: ChangeEventHandler<HTMLInputElement>;
    selectSurfaceTheme?: (variant: SurfaceThemeVariant) => void;
    selectDesktopAspectRatio?: (ratio: DesktopAspectRatio) => void;
    openVisualLab?: (mode: 'surfaces' | 'motion') => void;
}

export interface AppRouteProps {
    appVersion: string;
    game: GameLogicController;
    lan: LanMatchmakingController;
    layout: ResponsiveLayout;
    theme: ThemeName;
    surfaceTheme?: SurfaceThemeSelections;
    desktopAspectRatio?: DesktopAspectRatio;
    ui: AppUiState;
    setters: AppUiSetters;
    callbacks: AppUiCallbacks;
}
