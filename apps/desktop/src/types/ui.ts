import type { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import type { useGameLogic } from '../hooks/useGameLogic';
import type { useLanMatchmaking } from '../hooks/useLanMatchmaking';
import type { SurfaceThemeSelections, SurfaceThemeVariant } from '../app/shell/surfaceTheme';
import type { GameMode, PlayerKey, ThemeName } from '@gemduel/shared/types';
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
export type StartSetupRoute = 'none' | 'classic' | 'roguelike';
export type AppVisualLabMode = 'surfaces' | 'motion' | 'readability';

export interface AppUiState {
    showDebug: boolean;
    isReviewing: boolean;
    showRulebook: boolean;
    setupRoute?: StartSetupRoute;
    matchmakingRoute: MatchmakingRoute;
    visualLabMode?: AppVisualLabMode | null;
    isPeekingBoard: boolean;
    persistentWinner: PlayerKey | null;
    showRestartConfirm: boolean;
    soundEnabled: boolean;
    lanShowOpponentPlayerZoneCards?: boolean;
    lanShowOpponentGems?: boolean;
}

export interface AppUiSetters {
    setShowDebug: Dispatch<SetStateAction<boolean>>;
    setIsReviewing: Dispatch<SetStateAction<boolean>>;
    setShowRulebook: Dispatch<SetStateAction<boolean>>;
    setStartSetupRoute?: Dispatch<SetStateAction<StartSetupRoute>>;
    setMatchmakingRoute: Dispatch<SetStateAction<MatchmakingRoute>>;
    setIsPeekingBoard: Dispatch<SetStateAction<boolean>>;
    setShowRestartConfirm: Dispatch<SetStateAction<boolean>>;
    setSoundEnabled: Dispatch<SetStateAction<boolean>>;
    setLanShowOpponentPlayerZoneCards?: Dispatch<SetStateAction<boolean>>;
    setLanShowOpponentGems?: Dispatch<SetStateAction<boolean>>;
}

export interface AppUiCallbacks {
    handleRestart: () => void;
    handleDownloadReplay: () => void;
    handleUploadReplay: ChangeEventHandler<HTMLInputElement>;
    startGame?: (
        mode: GameMode,
        config: { useBuffs: boolean; isHost?: boolean; hostPlayer?: PlayerKey }
    ) => void;
    selectSurfaceTheme?: (variant: SurfaceThemeVariant) => void;
    openVisualLab?: (mode: AppVisualLabMode) => void;
    closeVisualLabToStartPage?: () => void;
}

export interface AppRouteProps {
    appVersion: string;
    game: GameLogicController;
    lan: LanMatchmakingController;
    layout: ResponsiveLayout;
    theme: ThemeName;
    surfaceTheme?: SurfaceThemeSelections;
    ui: AppUiState;
    setters: AppUiSetters;
    callbacks: AppUiCallbacks;
}
