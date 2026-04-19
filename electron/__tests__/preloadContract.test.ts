// @vitest-environment node

import { createRequire } from 'node:module';
import { describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const { UPDATE_CHANNELS, createElectronBridge } = require('../preloadContract.cjs') as {
    UPDATE_CHANNELS: Record<string, string>;
    createElectronBridge: (ipcRenderer: {
        invoke: ReturnType<typeof vi.fn>;
        send: ReturnType<typeof vi.fn>;
        on: ReturnType<typeof vi.fn>;
        removeListener: ReturnType<typeof vi.fn>;
    }) => {
        [key: string]: unknown;
    };
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
        expect(Object.keys(bridge).sort()).toEqual([
            'getAppVersion',
            'getRuntimeIceServers',
            'onDownloadProgress',
            'onUpdateAvailable',
            'onUpdateDownloaded',
            'restartApp',
        ]);
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
            restartApp: () => void;
            onUpdateAvailable: (callback: () => void) => () => void;
            onDownloadProgress: (callback: (value: number) => void) => () => void;
            onUpdateDownloaded: (callback: () => void) => () => void;
        };

        await expect(bridge.getAppVersion()).resolves.toBe('get-app-version');
        await expect(bridge.getRuntimeIceServers()).resolves.toBe('get-runtime-ice-servers');
        bridge.restartApp();

        const onAvailable = vi.fn();
        const onProgress = vi.fn();
        const onDownloaded = vi.fn();

        const unsubscribeAvailable = bridge.onUpdateAvailable(onAvailable);
        const unsubscribeProgress = bridge.onDownloadProgress(onProgress);
        const unsubscribeDownloaded = bridge.onUpdateDownloaded(onDownloaded);

        listeners.get(UPDATE_CHANNELS.available)?.({}, undefined);
        listeners.get(UPDATE_CHANNELS.progress)?.({}, 42);
        listeners.get(UPDATE_CHANNELS.downloaded)?.({}, undefined);

        expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-app-version');
        expect(ipcRenderer.invoke).toHaveBeenCalledWith('get-runtime-ice-servers');
        expect(ipcRenderer.send).toHaveBeenCalledWith('restart_app');
        expect(onAvailable).toHaveBeenCalledTimes(1);
        expect(onProgress).toHaveBeenCalledWith(42);
        expect(onDownloaded).toHaveBeenCalledTimes(1);

        unsubscribeAvailable();
        unsubscribeProgress();
        unsubscribeDownloaded();

        expect(ipcRenderer.on).toHaveBeenCalledWith(
            UPDATE_CHANNELS.available,
            expect.any(Function)
        );
        expect(ipcRenderer.on).toHaveBeenCalledWith(UPDATE_CHANNELS.progress, expect.any(Function));
        expect(ipcRenderer.on).toHaveBeenCalledWith(
            UPDATE_CHANNELS.downloaded,
            expect.any(Function)
        );
        expect(ipcRenderer.removeListener).toHaveBeenCalledTimes(3);
    });
});
