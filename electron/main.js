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
import { createElectronRuntimeHarness } from './runtimeHarness.js';
const { autoUpdater } = pkg;
const { IPC_INVOKE_CHANNELS, IPC_SEND_CHANNELS } = preloadContract;

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
let peerServer = null; // Keep reference to prevent garbage collection

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

const runtimeHarness = createElectronRuntimeHarness({
    autoUpdater,
    autoUpdaterPolicy,
    authorizeIpcSender,
    isDev,
    ipcMain,
    log,
    recordMainHealth,
    validateIpcArgs,
});

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
    runtimeHarness.attachWindowLifecycle(mainWindow);
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

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    if (isDev) {
        mainWindow.webContents.openDevTools();
    } else {
        runtimeHarness.configureAutoUpdater();
    }
}

runtimeHarness.attachAutoUpdaterLifecycle();
runtimeHarness.registerGovernedIpcHandlers({
    invokeHandlers: {
        [IPC_INVOKE_CHANNELS.getAppVersion]: () => app.getVersion(),
        [IPC_INVOKE_CHANNELS.getRuntimeIceServers]: () =>
            getRuntimeIceServersFromEnv(process.env.GEMDUEL_ICE_SERVERS_JSON, log),
        [IPC_INVOKE_CHANNELS.getReleaseHealthSnapshot]: () => releaseHealth.getSnapshot(),
    },
    sendHandlers: {
        [IPC_SEND_CHANNELS.restartApp]: () => {
            recordMainHealth({
                category: 'updater',
                name: 'UPDATER_INSTALL_REQUESTED',
                severity: 'info',
                message: 'Renderer requested restart-and-install for the downloaded update.',
            });
            autoUpdater.quitAndInstall();
        },
        [IPC_SEND_CHANNELS.reportReleaseHealth]: (_event, payload) => {
            recordMainHealth(payload);
        },
    },
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
