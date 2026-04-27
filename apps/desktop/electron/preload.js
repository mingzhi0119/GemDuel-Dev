const { contextBridge, ipcRenderer } = require('electron');

const IPC_INVOKE_CHANNELS = Object.freeze({
    getAppVersion: 'get-app-version',
    getRuntimeIceServers: 'get-runtime-ice-servers',
    getRuntimeRelayProfile: 'get-runtime-relay-profile',
    refreshRuntimeRelayProfile: 'refresh-runtime-relay-profile',
    revokeRuntimeRelayProfile: 'revoke-runtime-relay-profile',
    getReleaseHealthSnapshot: 'get-release-health-snapshot',
    getLanMatchmakingState: 'get-lan-matchmaking-state',
    saveReplayToFolder: 'save-replay-to-folder',
    startLanMatchmaking: 'start-lan-matchmaking',
    cancelLanMatchmaking: 'cancel-lan-matchmaking',
    setDesktopAspectRatio: 'set-desktop-aspect-ratio',
    selectLanPregameMode: 'select-lan-pregame-mode',
    confirmLanPregameStart: 'confirm-lan-pregame-start',
});

const IPC_SEND_CHANNELS = Object.freeze({
    restartApp: 'restart_app',
    reportReleaseHealth: 'report-release-health',
    reportLanPeerReady: 'report-lan-peer-ready',
});

const UPDATE_CHANNELS = Object.freeze({
    updateAvailable: 'update_available',
    downloadProgress: 'download_progress',
    updateDownloaded: 'update_downloaded',
    lanMatchmakingEvent: 'lan-matchmaking-event',
});

const subscribe = (api, channel, callback) => {
    if (typeof callback !== 'function') {
        throw new TypeError(`[IPC] ${api} requires a callback function.`);
    }

    const listener = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
};

contextBridge.exposeInMainWorld(
    'electron',
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
        getLanMatchmakingState: () =>
            ipcRenderer.invoke(IPC_INVOKE_CHANNELS.getLanMatchmakingState),
        saveReplayToFolder: (payload) =>
            ipcRenderer.invoke(IPC_INVOKE_CHANNELS.saveReplayToFolder, payload),
        startLanMatchmaking: () => ipcRenderer.invoke(IPC_INVOKE_CHANNELS.startLanMatchmaking),
        cancelLanMatchmaking: () => ipcRenderer.invoke(IPC_INVOKE_CHANNELS.cancelLanMatchmaking),
        setDesktopAspectRatio: (payload) =>
            ipcRenderer.invoke(IPC_INVOKE_CHANNELS.setDesktopAspectRatio, payload),
        selectLanPregameMode: (payload) =>
            ipcRenderer.invoke(IPC_INVOKE_CHANNELS.selectLanPregameMode, payload),
        confirmLanPregameStart: (payload) =>
            ipcRenderer.invoke(IPC_INVOKE_CHANNELS.confirmLanPregameStart, payload),
        restartApp: () => ipcRenderer.send(IPC_SEND_CHANNELS.restartApp),
        reportReleaseHealth: (event) =>
            ipcRenderer.send(IPC_SEND_CHANNELS.reportReleaseHealth, event),
        reportLanPeerReady: (payload) =>
            ipcRenderer.send(IPC_SEND_CHANNELS.reportLanPeerReady, payload),
        onUpdateAvailable: (callback) =>
            subscribe('onUpdateAvailable', UPDATE_CHANNELS.updateAvailable, callback),
        onDownloadProgress: (callback) =>
            subscribe('onDownloadProgress', UPDATE_CHANNELS.downloadProgress, callback),
        onUpdateDownloaded: (callback) =>
            subscribe('onUpdateDownloaded', UPDATE_CHANNELS.updateDownloaded, callback),
        onLanMatchmakingEvent: (callback) =>
            subscribe('onLanMatchmakingEvent', UPDATE_CHANNELS.lanMatchmakingEvent, callback),
    })
);
