const { contextBridge, ipcRenderer } = require('electron');

const subscribe = (channel, callback) => {
    const listener = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
};

contextBridge.exposeInMainWorld('electron', {
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getRuntimeIceServers: () => ipcRenderer.invoke('get-runtime-ice-servers'),
    restartApp: () => ipcRenderer.send('restart_app'),
    onUpdateAvailable: (callback) => subscribe('update_available', callback),
    onDownloadProgress: (callback) => subscribe('download_progress', callback),
    onUpdateDownloaded: (callback) => subscribe('update_downloaded', callback),
});
