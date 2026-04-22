// @vitest-environment node

import { createRequire } from 'node:module';
import { describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const { ELECTRON_BRIDGE_API_KEYS, UPDATE_CHANNELS, createElectronBridge, subscribe } =
    require('../preloadContract.cjs') as {
        ELECTRON_BRIDGE_API_KEYS: string[];
        UPDATE_CHANNELS: Record<string, string>;
        createElectronBridge: (ipcRenderer: {
            invoke: ReturnType<typeof vi.fn>;
            send: ReturnType<typeof vi.fn>;
            on: ReturnType<typeof vi.fn>;
            removeListener: ReturnType<typeof vi.fn>;
        }) => {
            [key: string]: unknown;
        };
        subscribe: (
            ipcRenderer: {
                on: ReturnType<typeof vi.fn>;
                removeListener: ReturnType<typeof vi.fn>;
            },
            api: string,
            channel: string,
            callback: (...args: unknown[]) => void
        ) => () => void;
    };

describe('electron preload contract', () => {
    it('exposes only the expected renderer-safe API surface', () => {
        const ipcRenderer = {
            invoke: vi.fn(),
            send: vi.fn(),
            on: vi.fn(),
            removeListener: vi.fn(),
        };

        const bridge = createElectronBridge(ipcRenderer);
        expect(Object.keys(bridge).sort()).toEqual(ELECTRON_BRIDGE_API_KEYS);
        expect('send' in bridge).toBe(false);
        expect('on' in bridge).toBe(false);
    });

    it('routes invocations and events through the allowlisted channels only', async () => {
        const listeners = new Map<string, (...args: unknown[]) => void>();
        const ipcRenderer = {
            invoke: vi.fn((channel) => Promise.resolve(channel)),
            send: vi.fn(),
            on: vi.fn((channel, listener) => {
                listeners.set(channel, listener);
            }),
            removeListener: vi.fn((channel, listener) => {
                if (listeners.get(channel) === listener) {
                    listeners.delete(channel);
                }
            }),
        };

        const bridge = createElectronBridge(ipcRenderer) as {
            getAppVersion: () => Promise<string>;
            getRuntimeIceServers: () => Promise<string>;
            getRuntimeRelayProfile: () => Promise<string>;
            refreshRuntimeRelayProfile: () => Promise<string>;
            revokeRuntimeRelayProfile: () => Promise<string>;
            getReleaseHealthSnapshot: () => Promise<string>;
            getLanMatchmakingState: () => Promise<string>;
            saveReplayToFolder: (payload: {
                fileName: string;
                contents: string;
            }) => Promise<string>;
            startLanMatchmaking: () => Promise<string>;
            cancelLanMatchmaking: () => Promise<string>;
            selectLanPregameMode: (payload: {
                roomId: string;
                mode: 'classic' | 'roguelike';
            }) => Promise<string>;
            confirmLanPregameStart: (payload: { roomId: string }) => Promise<string>;
            restartApp: () => void;
            reportReleaseHealth: (event: { name: string }) => void;
            reportLanPeerReady: (payload: { roomId: string; peerId: string }) => void;
            onUpdateAvailable: (callback: () => void) => () => void;
            onDownloadProgress: (callback: (value: number) => void) => () => void;
            onUpdateDownloaded: (callback: () => void) => () => void;
            onLanMatchmakingEvent: (callback: (event: { type: string }) => void) => () => void;
        };

        await expect(bridge.getAppVersion()).resolves.toBe('get-app-version');
        await expect(bridge.getRuntimeIceServers()).resolves.toBe('get-runtime-ice-servers');
        await expect(bridge.getRuntimeRelayProfile()).resolves.toBe('get-runtime-relay-profile');
        await expect(bridge.refreshRuntimeRelayProfile()).resolves.toBe(
            'refresh-runtime-relay-profile'
        );
        await expect(bridge.revokeRuntimeRelayProfile()).resolves.toBe(
            'revoke-runtime-relay-profile'
        );
        await expect(bridge.getReleaseHealthSnapshot()).resolves.toBe(
            'get-release-health-snapshot'
        );
        await expect(bridge.getLanMatchmakingState()).resolves.toBe('get-lan-matchmaking-state');
        await expect(
            bridge.saveReplayToFolder({
                fileName: 'GemDuel_Replay_v1_test.json',
                contents: '{"schemaVersion":"1.0"}',
            })
        ).resolves.toBe('save-replay-to-folder');
        await expect(bridge.startLanMatchmaking()).resolves.toBe('start-lan-matchmaking');
        await expect(bridge.cancelLanMatchmaking()).resolves.toBe('cancel-lan-matchmaking');
        await expect(
            bridge.selectLanPregameMode({
                roomId: 'room-1',
                mode: 'classic',
            })
        ).resolves.toBe('select-lan-pregame-mode');
        await expect(bridge.confirmLanPregameStart({ roomId: 'room-1' })).resolves.toBe(
            'confirm-lan-pregame-start'
        );
        bridge.restartApp();
        bridge.reportReleaseHealth({ name: 'APP_RUNTIME_CONFIG_LOADED' });
        bridge.reportLanPeerReady({ roomId: 'room-1', peerId: 'peer-1' });

        const onAvailable = vi.fn();
        const onProgress = vi.fn();
        const onDownloaded = vi.fn();
        const onLanEvent = vi.fn();

        const unsubscribeAvailable = bridge.onUpdateAvailable(onAvailable);
        const unsubscribeProgress = bridge.onDownloadProgress(onProgress);
        const unsubscribeDownloaded = bridge.onUpdateDownloaded(onDownloaded);
        const unsubscribeLan = bridge.onLanMatchmakingEvent(onLanEvent);

        listeners.get(UPDATE_CHANNELS.updateAvailable)?.({}, undefined);
        listeners.get(UPDATE_CHANNELS.downloadProgress)?.({}, 42);
        listeners.get(UPDATE_CHANNELS.updateDownloaded)?.({}, undefined);
        listeners.get(UPDATE_CHANNELS.lanMatchmakingEvent)?.(
            {},
            {
                type: 'state',
                state: { phase: 'searching' },
            }
        );

        expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-app-version');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-runtime-ice-servers');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-runtime-relay-profile');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('refresh-runtime-relay-profile');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('revoke-runtime-relay-profile');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-release-health-snapshot');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-lan-matchmaking-state');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('save-replay-to-folder', {
            fileName: 'GemDuel_Replay_v1_test.json',
            contents: '{"schemaVersion":"1.0"}',
        });
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('start-lan-matchmaking');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('cancel-lan-matchmaking');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('select-lan-pregame-mode', {
            roomId: 'room-1',
            mode: 'classic',
        });
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('confirm-lan-pregame-start', {
            roomId: 'room-1',
        });
        expect(ipcRenderer.send).toHaveBeenCalledWith('restart_app');
        expect(ipcRenderer.send).toHaveBeenCalledWith('report-release-health', {
            name: 'APP_RUNTIME_CONFIG_LOADED',
        });
        expect(ipcRenderer.send).toHaveBeenCalledWith('report-lan-peer-ready', {
            roomId: 'room-1',
            peerId: 'peer-1',
        });
        expect(onAvailable).toHaveBeenCalledTimes(1);
        expect(onProgress).toHaveBeenCalledWith(42);
        expect(onDownloaded).toHaveBeenCalledTimes(1);
        expect(onLanEvent).toHaveBeenCalledWith({
            type: 'state',
            state: { phase: 'searching' },
        });

        unsubscribeAvailable();
        unsubscribeProgress();
        unsubscribeDownloaded();
        unsubscribeLan();

        expect(ipcRenderer.on).toHaveBeenCalledWith(
            UPDATE_CHANNELS.updateAvailable,
            expect.any(Function)
        );
        expect(ipcRenderer.on).toHaveBeenCalledWith(
            UPDATE_CHANNELS.downloadProgress,
            expect.any(Function)
        );
        expect(ipcRenderer.on).toHaveBeenCalledWith(
            UPDATE_CHANNELS.updateDownloaded,
            expect.any(Function)
        );
        expect(ipcRenderer.on).toHaveBeenCalledWith(
            UPDATE_CHANNELS.lanMatchmakingEvent,
            expect.any(Function)
        );
        expect(ipcRenderer.removeListener).toHaveBeenCalledTimes(4);
    });

    it('rejects non-function callbacks for event subscriptions', () => {
        const ipcRenderer = {
            invoke: vi.fn(),
            send: vi.fn(),
            on: vi.fn(),
            removeListener: vi.fn(),
        };
        const bridge = createElectronBridge(ipcRenderer) as {
            onUpdateAvailable: (callback: unknown) => () => void;
        };

        expect(() => bridge.onUpdateAvailable('not-a-function')).toThrow(
            '[IPC] onUpdateAvailable requires a callback function.'
        );
    });

    it('wraps raw IPC subscriptions in the governed helper contract', () => {
        const listeners = new Map<string, (...args: unknown[]) => void>();
        const ipcRenderer = {
            on: vi.fn((channel, listener) => {
                listeners.set(channel, listener);
            }),
            removeListener: vi.fn((channel, listener) => {
                if (listeners.get(channel) === listener) {
                    listeners.delete(channel);
                }
            }),
        };
        const callback = vi.fn();

        const unsubscribe = subscribe(
            ipcRenderer,
            'onDownloadProgress',
            UPDATE_CHANNELS.downloadProgress,
            callback
        );

        listeners.get(UPDATE_CHANNELS.downloadProgress)?.({}, 73);
        unsubscribe();

        expect(callback).toHaveBeenCalledWith(73);
        expect(ipcRenderer.on).toHaveBeenCalledWith(
            UPDATE_CHANNELS.downloadProgress,
            expect.any(Function)
        );
        expect(ipcRenderer.removeListener).toHaveBeenCalledWith(
            UPDATE_CHANNELS.downloadProgress,
            expect.any(Function)
        );
    });
});
