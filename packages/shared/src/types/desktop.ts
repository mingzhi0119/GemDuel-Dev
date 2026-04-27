import type { ReleaseHealthEvent } from '../observability/releaseHealth';
import type {
    ConfirmLanPregameStartPayload,
    LanMatchmakingEvent,
    LanMatchmakingState,
    ReportLanPeerReadyPayload,
    SelectLanPregameModePayload,
} from './lan';
import type { RuntimeRelayProfile } from './runtime';

export interface ReleaseHealthCounterSnapshot {
    count: number;
    severity: 'info' | 'warn' | 'error';
    lastAt: string;
}

export interface ReleaseHealthIndicatorSnapshot {
    startupFailures: number;
    runtimeConfigFailures: number;
    updaterFailures: number;
    peerFailures: number;
    recoveryRequests: number;
    ipcRejected: number;
}

export interface ReleaseHealthSnapshot {
    startedAt: string;
    lastEventAt: string | null;
    totalEvents: number;
    severityCounts: Record<'info' | 'warn' | 'error', number>;
    indicators: ReleaseHealthIndicatorSnapshot;
    reasonCodeCounts: Record<string, number>;
    counters: Record<string, ReleaseHealthCounterSnapshot>;
    recentEvents: Array<
        ReleaseHealthEvent & {
            source: 'main' | 'renderer';
            timestamp: string;
        }
    >;
}

export interface SaveReplayToFolderPayload {
    fileName: string;
    contents: string;
}

export interface SaveReplayToFolderResult {
    path: string;
}

export type DesktopAspectRatio = '16:10' | '16:9';

export interface SetDesktopAspectRatioPayload {
    ratio: DesktopAspectRatio;
}

export interface SetDesktopAspectRatioResult {
    ratio: DesktopAspectRatio;
    width: number;
    height: number;
    aspectRatio: number;
}

export interface ElectronBridge {
    getAppVersion: () => Promise<string>;
    getRuntimeIceServers: () => Promise<RTCIceServer[]>;
    getRuntimeRelayProfile: () => Promise<RuntimeRelayProfile>;
    refreshRuntimeRelayProfile: () => Promise<RuntimeRelayProfile>;
    revokeRuntimeRelayProfile: () => Promise<RuntimeRelayProfile>;
    getReleaseHealthSnapshot: () => Promise<ReleaseHealthSnapshot>;
    getLanMatchmakingState: () => Promise<LanMatchmakingState>;
    startLanMatchmaking: () => Promise<LanMatchmakingState>;
    cancelLanMatchmaking: () => Promise<LanMatchmakingState>;
    saveReplayToFolder?: (payload: SaveReplayToFolderPayload) => Promise<SaveReplayToFolderResult>;
    setDesktopAspectRatio: (
        payload: SetDesktopAspectRatioPayload
    ) => Promise<SetDesktopAspectRatioResult>;
    selectLanPregameMode: (payload: SelectLanPregameModePayload) => Promise<LanMatchmakingState>;
    confirmLanPregameStart: (
        payload: ConfirmLanPregameStartPayload
    ) => Promise<LanMatchmakingState>;
    restartApp: () => void;
    reportReleaseHealth: (event: ReleaseHealthEvent & { source?: 'renderer' }) => void;
    reportLanPeerReady: (payload: ReportLanPeerReadyPayload) => void;
    onLanMatchmakingEvent: (callback: (event: LanMatchmakingEvent) => void) => () => void;
    onUpdateAvailable: (callback: () => void) => () => void;
    onDownloadProgress: (callback: (percent: number) => void) => () => void;
    onUpdateDownloaded: (callback: () => void) => () => void;
}

declare global {
    interface Window {
        electron?: ElectronBridge;
    }
}

export {};
