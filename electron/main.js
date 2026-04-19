import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import log from 'electron-log';
import pkg from 'electron-updater';
import { PeerServer } from 'peer';
import preloadContract from './preloadContract.cjs';
import {
    authorizeIpcSender,
    createMainWindowOptions,
    validateIpcArgs,
    validateMainWindowOptions,
} from './desktopGovernance.js';
import {
    getAutoUpdaterPolicy,
    getRuntimeIceServersFromEnv,
    getRuntimeLogLevel,
} from './runtimeConfig.js';
const { autoUpdater } = pkg;
const { IPC_INVOKE_CHANNELS, IPC_SEND_CHANNELS, UPDATE_CHANNELS } = preloadContract;

const DEFAULT_LOG_LEVEL = isDev ? 'debug' : 'info';
const MAX_LOG_FILE_SIZE = 5 * 1024 * 1024;
const autoUpdaterPolicy = getAutoUpdaterPolicy({
    disableUpdatesEnv: process.env.GEMDUEL_DISABLE_UPDATES,
    allowPrereleaseEnv: process.env.GEMDUEL_ALLOW_PRERELEASE,
    appVersion: app.getVersion(),
    logger: log,
});

autoUpdater.logger = log;
log.transports.file.level = getRuntimeLogLevel({
    rawLevel: process.env.GEMDUEL_LOG_LEVEL,
    fallbackLevel: DEFAULT_LOG_LEVEL,
    logger: log,
});
log.transports.file.maxSize = MAX_LOG_FILE_SIZE;
log.transports.console.level = isDev ? 'debug' : 'warn';
log.info(`App starting in ${isDev ? 'development' : 'production'} mode...`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let updateFailureCount = 0;
let peerServer = null; // Keep reference to prevent garbage collection

const getMainWindowId = () => mainWindow?.webContents?.id ?? null;

const getSenderUrl = (event) => event.senderFrame?.url ?? event.sender.getURL?.() ?? '';

const authorizeDesktopRequest = (channel, event, args) => {
    const authorization = authorizeIpcSender({
        senderId: event.sender.id,
        senderUrl: getSenderUrl(event),
        mainWindowId: getMainWindowId(),
        isDev,
    });

    if (!authorization.ok) {
        log.warn(`[IPC] Rejected ${channel}: ${authorization.reason}`);
        return authorization;
    }

    const payloadCheck = validateIpcArgs(channel, args);
    if (!payloadCheck.ok) {
        log.warn(`[IPC] Rejected ${channel}: ${payloadCheck.reason}`);
        return payloadCheck;
    }

    return { ok: true };
};

const handleGovernedInvoke = (channel, handler) => {
    ipcMain.handle(channel, (event, ...args) => {
        const guard = authorizeDesktopRequest(channel, event, args);
        if (!guard.ok) {
            throw new Error(`[IPC] ${channel} rejected: ${guard.reason}`);
        }

        return handler(event);
    });
};

const handleGovernedSend = (channel, handler) => {
    ipcMain.on(channel, (event, ...args) => {
        const guard = authorizeDesktopRequest(channel, event, args);
        if (!guard.ok) {
            return;
        }

        handler(event);
    });
};

const sendToRenderer = (channel, ...args) => {
    if (!mainWindow || mainWindow.isDestroyed()) {
        log.warn(`[IPC] Skipped ${channel}: main window is unavailable.`);
        return;
    }

    mainWindow.webContents.send(channel, ...args);
};

const configureAutoUpdater = () => {
    if (!autoUpdaterPolicy.enabled) {
        log.info('Auto-updates disabled by environment override.');
        return;
    }

    autoUpdater.autoDownload = autoUpdaterPolicy.autoDownload;
    autoUpdater.allowPrerelease = autoUpdaterPolicy.allowPrerelease;

    autoUpdater.checkForUpdatesAndNotify().catch((error) => {
        log.error('Failed to start auto-update check.', error);
    });
};

function createWindow() {
    const windowOptions = createMainWindowOptions({
        preloadPath: path.join(__dirname, 'preload.js'),
        appVersion: app.getVersion(),
    });
    const governanceIssues = validateMainWindowOptions(windowOptions);
    if (governanceIssues.length > 0) {
        throw new Error(
            `Desktop security policy rejected the BrowserWindow config:\n${governanceIssues.join('\n')}`
        );
    }

    mainWindow = new BrowserWindow(windowOptions);

    mainWindow.setMenuBarVisibility(false);

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    if (isDev) {
        mainWindow.webContents.openDevTools();
    } else {
        configureAutoUpdater();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    log.info(
        `Update available: Current version ${app.getVersion()}, Available version ${info.version}`
    );
    sendToRenderer(UPDATE_CHANNELS.updateAvailable);
});

autoUpdater.on('update-not-available', () => {
    log.info('Update not available.');
});

autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err);
    updateFailureCount++;
    if (updateFailureCount > 2) {
        log.warn('Update failed multiple times. Resetting failure count.');
        updateFailureCount = 0;
        // Optional: Implement actual cache clearing if needed (e.g. deleting local app data folder for updates)
    }
});

autoUpdater.on('download-progress', (progressObj) => {
    log.info(`Download progress: ${progressObj.percent}%`);
    sendToRenderer(UPDATE_CHANNELS.downloadProgress, progressObj.percent);
});

autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded; will install now', info);
    sendToRenderer(UPDATE_CHANNELS.updateDownloaded);
});

handleGovernedSend(IPC_SEND_CHANNELS.restartApp, () => {
    autoUpdater.quitAndInstall();
});

handleGovernedInvoke(IPC_INVOKE_CHANNELS.getAppVersion, () => {
    return app.getVersion();
});

handleGovernedInvoke(IPC_INVOKE_CHANNELS.getRuntimeIceServers, () => {
    return getRuntimeIceServersFromEnv(process.env.GEMDUEL_ICE_SERVERS_JSON, log);
});

app.whenReady().then(() => {
    log.info(
        `[DESKTOP_GOVERNANCE] IPC guard active for ${Object.keys(IPC_INVOKE_CHANNELS).length + Object.keys(IPC_SEND_CHANNELS).length} renderer-to-main capabilities.`
    );

    // Start Local PeerJS Signaling Server
    try {
        peerServer = PeerServer({
            port: 9000,
            path: '/gemduel',
            proxied: true,
        });

        log.info('[P2P] Local Signaling Server running on port 9000');
        if (isDev) {
            console.log('[P2P] Local Signaling Server running on port 9000');
        }

        peerServer.on('connection', (client) => {
            log.info(`[P2P] Client connected: ${client.getId()}`);
        });

        peerServer.on('disconnect', (client) => {
            log.info(`[P2P] Client disconnected: ${client.getId()}`);
        });
    } catch (err) {
        log.error('[P2P] Failed to start PeerServer:', err);
        if (isDev) {
            console.error('[P2P] Failed to start PeerServer:', err);
        }
    }

    createWindow();
});

app.on('window-all-closed', () => {
    // Clean up PeerServer on exit
    if (peerServer) {
        log.info('[P2P] Shutting down PeerServer...');
        // PeerServer doesn't have explicit close method, node will clean up
    }

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
