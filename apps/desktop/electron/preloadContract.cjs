const IPC_ALLOWLIST = Object.freeze({
    invokes: Object.freeze({
        getAppVersion: Object.freeze({
            api: 'getAppVersion',
            channel: 'get-app-version',
            owner: 'Desktop shell',
            payload: 'none',
            threat: 'Read-only version metadata for the renderer watermark and exports.',
        }),
        getRuntimeIceServers: Object.freeze({
            api: 'getRuntimeIceServers',
            channel: 'get-runtime-ice-servers',
            owner: 'Desktop shell',
            payload: 'none',
            threat: 'Read-only runtime relay config, sanitized before renderer access.',
        }),
        getRuntimeRelayProfile: Object.freeze({
            api: 'getRuntimeRelayProfile',
            channel: 'get-runtime-relay-profile',
            owner: 'Desktop shell',
            payload: 'none',
            threat: 'Read-only governed relay profile that may prefer ephemeral TURN credentials before legacy fallback.',
        }),
        refreshRuntimeRelayProfile: Object.freeze({
            api: 'refreshRuntimeRelayProfile',
            channel: 'refresh-runtime-relay-profile',
            owner: 'Desktop shell',
            payload: 'none',
            threat: 'Refreshes the active short-lived TURN credential lease without exposing secrets to the renderer.',
        }),
        revokeRuntimeRelayProfile: Object.freeze({
            api: 'revokeRuntimeRelayProfile',
            channel: 'revoke-runtime-relay-profile',
            owner: 'Desktop shell',
            payload: 'none',
            threat: 'Revokes the active short-lived TURN credential lease during renderer cleanup.',
        }),
        getReleaseHealthSnapshot: Object.freeze({
            api: 'getReleaseHealthSnapshot',
            channel: 'get-release-health-snapshot',
            owner: 'Release health monitor',
            payload: 'none',
            threat: 'Read-only snapshot of sanitized release-health indicators and recent events.',
        }),
    }),
    sends: Object.freeze({
        restartApp: Object.freeze({
            api: 'restartApp',
            channel: 'restart_app',
            owner: 'Desktop shell',
            payload: 'none',
            threat: 'Privileged updater install trigger; sender must be authorized.',
        }),
        reportReleaseHealth: Object.freeze({
            api: 'reportReleaseHealth',
            channel: 'report-release-health',
            owner: 'Renderer observability',
            payload: 'ReleaseHealthEvent',
            threat: 'Structured renderer health event, validated and redacted before persistence.',
        }),
    }),
    events: Object.freeze({
        updateAvailable: Object.freeze({
            api: 'onUpdateAvailable',
            channel: 'update_available',
            owner: 'Auto-updater',
            payload: 'none',
            threat: 'Renderer notification only; no writable capability.',
        }),
        downloadProgress: Object.freeze({
            api: 'onDownloadProgress',
            channel: 'download_progress',
            owner: 'Auto-updater',
            payload: 'number percent',
            threat: 'Renderer notification only; payload is numeric progress.',
        }),
        updateDownloaded: Object.freeze({
            api: 'onUpdateDownloaded',
            channel: 'update_downloaded',
            owner: 'Auto-updater',
            payload: 'none',
            threat: 'Renderer notification that a restart may be offered.',
        }),
    }),
});

const toChannelMap = (entries) =>
    Object.freeze(
        Object.fromEntries(Object.entries(entries).map(([key, value]) => [key, value.channel]))
    );

const IPC_INVOKE_CHANNELS = toChannelMap(IPC_ALLOWLIST.invokes);
const IPC_SEND_CHANNELS = toChannelMap(IPC_ALLOWLIST.sends);
const UPDATE_CHANNELS = toChannelMap(IPC_ALLOWLIST.events);
const ELECTRON_BRIDGE_API_KEYS = Object.freeze(
    Object.values(IPC_ALLOWLIST)
        .flatMap((group) => Object.values(group).map((entry) => entry.api))
        .sort()
);

const assertCallback = (api, callback) => {
    if (typeof callback !== 'function') {
        throw new TypeError(`[IPC] ${api} requires a callback function.`);
    }
};

const subscribe = (ipcRenderer, api, channel, callback) => {
    assertCallback(api, callback);
    const listener = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
};

const createElectronBridge = (ipcRenderer) =>
    Object.freeze({
        getAppVersion: () => ipcRenderer.invoke(IPC_INVOKE_CHANNELS.getAppVersion),
        getRuntimeIceServers: () => ipcRenderer.invoke(IPC_INVOKE_CHANNELS.getRuntimeIceServers),
        getRuntimeRelayProfile: () =>
            ipcRenderer.invoke(IPC_INVOKE_CHANNELS.getRuntimeRelayProfile),
        refreshRuntimeRelayProfile: () =>
            ipcRenderer.invoke(IPC_INVOKE_CHANNELS.refreshRuntimeRelayProfile),
        revokeRuntimeRelayProfile: () =>
            ipcRenderer.invoke(IPC_INVOKE_CHANNELS.revokeRuntimeRelayProfile),
        getReleaseHealthSnapshot: () =>
            ipcRenderer.invoke(IPC_INVOKE_CHANNELS.getReleaseHealthSnapshot),
        restartApp: () => ipcRenderer.send(IPC_SEND_CHANNELS.restartApp),
        reportReleaseHealth: (event) =>
            ipcRenderer.send(IPC_SEND_CHANNELS.reportReleaseHealth, event),
        onUpdateAvailable: (callback) =>
            subscribe(
                ipcRenderer,
                IPC_ALLOWLIST.events.updateAvailable.api,
                UPDATE_CHANNELS.updateAvailable,
                callback
            ),
        onDownloadProgress: (callback) =>
            subscribe(
                ipcRenderer,
                IPC_ALLOWLIST.events.downloadProgress.api,
                UPDATE_CHANNELS.downloadProgress,
                callback
            ),
        onUpdateDownloaded: (callback) =>
            subscribe(
                ipcRenderer,
                IPC_ALLOWLIST.events.updateDownloaded.api,
                UPDATE_CHANNELS.updateDownloaded,
                callback
            ),
    });

module.exports = {
    ELECTRON_BRIDGE_API_KEYS,
    IPC_ALLOWLIST,
    IPC_INVOKE_CHANNELS,
    IPC_SEND_CHANNELS,
    UPDATE_CHANNELS,
    createElectronBridge,
    subscribe,
};
