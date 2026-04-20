import type { ReleaseHealthEvent } from '../observability/releaseHealth';
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

export interface ElectronBridge {
    getAppVersion: () => Promise<string>;
    getRuntimeIceServers: () => Promise<RTCIceServer[]>;
    getRuntimeRelayProfile: () => Promise<RuntimeRelayProfile>;
    getReleaseHealthSnapshot: () => Promise<ReleaseHealthSnapshot>;
    restartApp: () => void;
    reportReleaseHealth: (event: ReleaseHealthEvent & { source?: 'renderer' }) => void;
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
