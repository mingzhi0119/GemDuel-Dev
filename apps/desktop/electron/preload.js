import electron from 'electron';
import preloadContract from './preloadContract.cjs';

const { contextBridge, ipcRenderer } = electron;
const { createElectronBridge } = preloadContract;

const allowVisualLabRuntime = process.env.GEMDUEL_ALLOW_VISUAL_LAB === 'true';

contextBridge.exposeInMainWorld(
    '__GEMDUEL_RUNTIME_CONFIG__',
    Object.freeze({
        allowVisualLab: allowVisualLabRuntime,
    })
);

contextBridge.exposeInMainWorld('electron', createElectronBridge(ipcRenderer));
