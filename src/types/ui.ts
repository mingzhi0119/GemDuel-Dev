import type { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import type { useGameLogic } from '../hooks/useGameLogic';
import type { PlayerKey } from './domain';

export type ThemeName = 'light' | 'dark';

export interface ResponsiveLayout {
    layoutMode: 'mobile' | 'desktop-auto';
    viewportWidth: number;
    viewportHeight: number;
    aspectRatio: number;
    boardScale: number;
    deckScale: number;
    zoneScale: number;
    zoneHeightPx: number;
    mainGapPx: number;
}

export type GameLogicController = ReturnType<typeof useGameLogic>;

export interface AppUiState {
    showDebug: boolean;
    isReviewing: boolean;
    showRulebook: boolean;
    onlineSetup: boolean;
    isPeekingBoard: boolean;
    persistentWinner: PlayerKey | null;
    showRestartConfirm: boolean;
}

export interface AppUiSetters {
    setShowDebug: Dispatch<SetStateAction<boolean>>;
    setIsReviewing: Dispatch<SetStateAction<boolean>>;
    setShowRulebook: Dispatch<SetStateAction<boolean>>;
    setOnlineSetup: Dispatch<SetStateAction<boolean>>;
    setIsPeekingBoard: Dispatch<SetStateAction<boolean>>;
    setShowRestartConfirm: Dispatch<SetStateAction<boolean>>;
}

export interface AppUiCallbacks {
    handleRestart: () => void;
    handleDownloadReplay: () => void;
    handleUploadReplay: ChangeEventHandler<HTMLInputElement>;
    toggleTheme: () => void;
}

export interface AppRouteProps {
    appVersion: string;
    game: GameLogicController;
    layout: ResponsiveLayout;
    theme: ThemeName;
    ui: AppUiState;
    setters: AppUiSetters;
    callbacks: AppUiCallbacks;
}
