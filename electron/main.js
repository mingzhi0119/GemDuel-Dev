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
import { createReleaseHealthMonitor } from './releaseHealth.js';
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

const releaseHealth = createReleaseHealthMonitor({ logger: log });
const recordMainHealth = (event) =>
    releaseHealth.record({
        source: 'main',
        ...event,
    });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let updateFailureCount = 0;
let peerServer = null; // Keep reference to prevent garbage collection
let lastLoggedUpdaterProgressBucket = 0;

recordMainHealth({
    category: 'startup',
    name: 'APP_BOOT',
    severity: 'info',
    message: 'Desktop process booted and initialized structured release-health logging.',
    context: {
        mode: isDev ? 'development' : 'production',
        version: app.getVersion(),
    },
});

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
        recordMainHealth({
            category: 'security',
            name: 'IPC_REQUEST_REJECTED',
            severity: 'warn',
            message: 'IPC request was rejected by sender authorization.',
            context: {
                channel,
                reason: authorization.reason,
            },
        });
        return authorization;
    }

    const payloadCheck = validateIpcArgs(channel, args);
    if (!payloadCheck.ok) {
        log.warn(`[IPC] Rejected ${channel}: ${payloadCheck.reason}`);
        recordMainHealth({
            category: 'security',
            name: 'IPC_REQUEST_REJECTED',
            severity: 'warn',
            message: 'IPC request was rejected by payload validation.',
            context: {
                channel,
                reason: payloadCheck.reason,
            },
        });
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

        return handler(event, ...args);
    });
};

const handleGovernedSend = (channel, handler) => {
    ipcMain.on(channel, (event, ...args) => {
        const guard = authorizeDesktopRequest(channel, event, args);
        if (!guard.ok) {
            return;
        }

        handler(event, ...args);
    });
};

const sendToRenderer = (channel, ...args) => {
    if (!mainWindow || mainWindow.isDestroyed()) {
        log.warn(`[IPC] Skipped ${channel}: main window is unavailable.`);
        recordMainHealth({
            category: 'startup',
            name: 'WINDOW_UNAVAILABLE',
            severity: 'warn',
            message: 'Main window was unavailable when a renderer event was emitted.',
            context: {
                channel,
            },
        });
        return;
    }

    mainWindow.webContents.send(channel, ...args);
};

const configureAutoUpdater = () => {
    if (!autoUpdaterPolicy.enabled) {
        log.info('Auto-updates disabled by environment override.');
        recordMainHealth({
            category: 'updater',
            name: 'UPDATER_DISABLED',
            severity: 'info',
            message: 'Auto-updates were disabled by runtime policy.',
        });
        return;
    }

    autoUpdater.autoDownload = autoUpdaterPolicy.autoDownload;
    autoUpdater.allowPrerelease = autoUpdaterPolicy.allowPrerelease;

    autoUpdater.checkForUpdatesAndNotify().catch((error) => {
        log.error('Failed to start auto-update check.', error);
        recordMainHealth({
            category: 'updater',
            name: 'UPDATER_CHECK_FAILED',
            severity: 'error',
            message: 'Auto-updater failed to start the update check.',
        });
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
    recordMainHealth({
        category: 'startup',
        name: 'WINDOW_CREATED',
        severity: 'info',
        message: 'BrowserWindow was created with the governed desktop policy.',
        context: {
            mode: isDev ? 'development' : 'production',
        },
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.on('did-finish-load', () => {
        recordMainHealth({
            category: 'startup',
            name: 'WINDOW_LOADED',
            severity: 'info',
            message: 'BrowserWindow finished loading the renderer.',
        });
    });
    mainWindow.webContents.on(
        'did-fail-load',
        (_event, errorCode, errorDescription, validatedURL) => {
            recordMainHealth({
                category: 'startup',
                name: 'WINDOW_LOAD_FAILED',
                severity: 'error',
                message: 'BrowserWindow failed to load the renderer.',
                context: {
                    errorCode,
                    errorDescription,
                    validatedURL,
                },
            });
        }
    );

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
        recordMainHealth({
            category: 'startup',
            name: 'WINDOW_CLOSED',
            severity: 'info',
            message: 'Main BrowserWindow was closed.',
        });
        mainWindow = null;
    });
}

autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
    recordMainHealth({
        category: 'updater',
        name: 'UPDATER_CHECK_STARTED',
        severity: 'info',
        message: 'Auto-updater started checking for updates.',
    });
});

autoUpdater.on('update-available', (info) => {
    log.info(
        `Update available: Current version ${app.getVersion()}, Available version ${info.version}`
    );
    recordMainHealth({
        category: 'updater',
        name: 'UPDATER_AVAILABLE',
        severity: 'info',
        message: 'A newer desktop version is available.',
        context: {
            version: info.version,
        },
    });
    sendToRenderer(UPDATE_CHANNELS.updateAvailable);
});

autoUpdater.on('update-not-available', () => {
    log.info('Update not available.');
    recordMainHealth({
        category: 'updater',
        name: 'UPDATER_NOT_AVAILABLE',
        severity: 'info',
        message: 'No newer desktop version was found.',
    });
});

autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err);
    updateFailureCount++;
    recordMainHealth({
        category: 'updater',
        name: 'UPDATER_ERROR',
        severity: 'error',
        message: 'Auto-updater emitted an error.',
        context: {
            failureCount: updateFailureCount,
        },
    });
    if (updateFailureCount > 2) {
        log.warn('Update failed multiple times. Resetting failure count.');
        recordMainHealth({
            category: 'updater',
            name: 'UPDATER_FAILURE_THRESHOLD_REACHED',
            severity: 'warn',
            message: 'Auto-updater hit the failure threshold and reset its retry counter.',
            context: {
                threshold: 2,
            },
        });
        updateFailureCount = 0;
        // Optional: Implement actual cache clearing if needed (e.g. deleting local app data folder for updates)
    }
});

autoUpdater.on('download-progress', (progressObj) => {
    log.info(`Download progress: ${progressObj.percent}%`);
    const progressBucket = Math.min(100, Math.floor(progressObj.percent / 25) * 25);
    if (progressBucket > lastLoggedUpdaterProgressBucket) {
        lastLoggedUpdaterProgressBucket = progressBucket;
        recordMainHealth({
            category: 'updater',
            name: 'UPDATER_DOWNLOAD_PROGRESS',
            severity: 'info',
            message: 'Auto-updater download crossed a release-health progress checkpoint.',
            context: {
                percent: progressBucket,
            },
        });
    }
    sendToRenderer(UPDATE_CHANNELS.downloadProgress, progressObj.percent);
});

autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded; will install now', info);
    lastLoggedUpdaterProgressBucket = 100;
    recordMainHealth({
        category: 'updater',
        name: 'UPDATER_DOWNLOADED',
        severity: 'info',
        message: 'Auto-updater finished downloading the release.',
        context: {
            version: info.version,
        },
    });
    sendToRenderer(UPDATE_CHANNELS.updateDownloaded);
});

handleGovernedSend(IPC_SEND_CHANNELS.restartApp, () => {
    recordMainHealth({
        category: 'updater',
        name: 'UPDATER_INSTALL_REQUESTED',
        severity: 'info',
        message: 'Renderer requested restart-and-install for the downloaded update.',
    });
    autoUpdater.quitAndInstall();
});

handleGovernedSend(IPC_SEND_CHANNELS.reportReleaseHealth, (_event, payload) => {
    recordMainHealth(payload);
});

handleGovernedInvoke(IPC_INVOKE_CHANNELS.getAppVersion, () => {
    return app.getVersion();
});

handleGovernedInvoke(IPC_INVOKE_CHANNELS.getRuntimeIceServers, () => {
    return getRuntimeIceServersFromEnv(process.env.GEMDUEL_ICE_SERVERS_JSON, log);
});

handleGovernedInvoke(IPC_INVOKE_CHANNELS.getReleaseHealthSnapshot, () => {
    return releaseHealth.getSnapshot();
});

app.whenReady().then(() => {
    log.info(
        `[DESKTOP_GOVERNANCE] IPC guard active for ${Object.keys(IPC_INVOKE_CHANNELS).length + Object.keys(IPC_SEND_CHANNELS).length} renderer-to-main capabilities.`
    );
    recordMainHealth({
        category: 'startup',
        name: 'APP_READY',
        severity: 'info',
        message: 'Electron app lifecycle reached the ready state.',
        context: {
            guardedCapabilities:
                Object.keys(IPC_INVOKE_CHANNELS).length + Object.keys(IPC_SEND_CHANNELS).length,
        },
    });

    // Start Local PeerJS Signaling Server
    try {
        peerServer = PeerServer({
            port: 9000,
            path: '/gemduel',
            proxied: true,
        });

        log.info('[P2P] Local Signaling Server running on port 9000');
        recordMainHealth({
            category: 'peer',
            name: 'PEER_SERVER_STARTED',
            severity: 'info',
            message: 'Local PeerJS signaling server started successfully.',
            context: {
                port: 9000,
            },
        });
        if (isDev) {
            console.log('[P2P] Local Signaling Server running on port 9000');
        }

        peerServer.on('connection', (client) => {
            log.info(`[P2P] Client connected: ${client.getId()}`);
            recordMainHealth({
                category: 'peer',
                name: 'PEER_SERVER_CLIENT_CONNECTED',
                severity: 'info',
                message: 'A client connected to the local signaling server.',
                context: {
                    clientId: client.getId(),
                },
            });
        });

        peerServer.on('disconnect', (client) => {
            log.info(`[P2P] Client disconnected: ${client.getId()}`);
            recordMainHealth({
                category: 'peer',
                name: 'PEER_SERVER_CLIENT_DISCONNECTED',
                severity: 'info',
                message: 'A client disconnected from the local signaling server.',
                context: {
                    clientId: client.getId(),
                },
            });
        });
    } catch (err) {
        log.error('[P2P] Failed to start PeerServer:', err);
        recordMainHealth({
            category: 'peer',
            name: 'PEER_SERVER_START_FAILED',
            severity: 'error',
            message: 'Local PeerJS signaling server failed to start.',
        });
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
        recordMainHealth({
            category: 'peer',
            name: 'PEER_SERVER_SHUTDOWN',
            severity: 'info',
            message: 'Desktop process is shutting down the local signaling server.',
        });
        // PeerServer doesn't have explicit close method, node will clean up
    }

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        recordMainHealth({
            category: 'startup',
            name: 'APP_ACTIVATED',
            severity: 'info',
            message: 'Electron app activation recreated the main window.',
        });
        createWindow();
    }
});

app.on('before-quit', () => {
    log.info(`[RELEASE_HEALTH_SUMMARY] ${JSON.stringify(releaseHealth.getSnapshot())}`);
});
