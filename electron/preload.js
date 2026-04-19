const { contextBridge, ipcRenderer } = require('electron');
const { createElectronBridge } = require('./preloadContract.cjs');

contextBridge.exposeInMainWorld('electron', createElectronBridge(ipcRenderer));
