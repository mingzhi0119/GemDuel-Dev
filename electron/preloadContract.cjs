const UPDATE_CHANNELS = Object.freeze({
    available: 'update_available',
    progress: 'download_progress',
    downloaded: 'update_downloaded',
});

const subscribe = (ipcRenderer, channel, callback) => {
    const listener = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
};

const createElectronBridge = (ipcRenderer) => ({
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getRuntimeIceServers: () => ipcRenderer.invoke('get-runtime-ice-servers'),
    restartApp: () => ipcRenderer.send('restart_app'),
    onUpdateAvailable: (callback) => subscribe(ipcRenderer, UPDATE_CHANNELS.available, callback),
    onDownloadProgress: (callback) => subscribe(ipcRenderer, UPDATE_CHANNELS.progress, callback),
    onUpdateDownloaded: (callback) => subscribe(ipcRenderer, UPDATE_CHANNELS.downloaded, callback),
});

module.exports = {
    UPDATE_CHANNELS,
    createElectronBridge,
    subscribe,
};
