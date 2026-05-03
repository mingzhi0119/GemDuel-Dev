import { app, BrowserWindow, ipcMain } from 'electron';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import log from 'electron-log';
import pkg from 'electron-updater';
import preloadContract from './preloadContract.cjs';
import { createLanDiscoveryService } from './lanDiscoveryService.js';
import {
    DEFAULT_DESKTOP_ASPECT_RATIO,
    applyDesktopAspectRatioToWindow,
    authorizeIpcSender,
    createMainWindowOptions,
    validateIpcArgs,
    validateMainWindowOptions,
} from './desktopGovernance.js';
import { createReleaseHealthMonitor } from './releaseHealth.js';
import {
    DEFAULT_PEER_SERVER_HOST,
    startPeerSignalingServer,
    stopPeerSignalingServer,
} from './peerSignalingServer.js';
import {
    getAutoUpdaterPolicy,
    getRuntimeIceServersFromEnv,
    getRuntimeLogLevel,
} from './runtimeConfig.js';
import { createElectronRuntimeHarness } from './runtimeHarness.js';
import { createTurnCredentialClient } from './turnCredentialClient.js';
const { autoUpdater } = pkg;
const { IPC_INVOKE_CHANNELS, IPC_SEND_CHANNELS, UPDATE_CHANNELS } = preloadContract;
const DEFAULT_LOG_LEVEL = isDev ? 'debug' : 'info';
const MAX_LOG_FILE_SIZE = 5 * 1024 * 1024;
const MAX_REPLAY_EXPORT_BYTES = 512 * 1024;
const DEFAULT_DEV_SERVER_URL = process.env.GEMDUEL_DEV_SERVER_URL ?? 'http://localhost:5173';
const DEFAULT_PEER_SERVER_PORT = Number(process.env.GEMDUEL_PEER_SERVER_PORT ?? 9000);
const DEV_USER_DATA_SUFFIX = process.env.GEMDUEL_USER_DATA_SUFFIX?.trim() ?? '';
if (DEV_USER_DATA_SUFFIX) {
    app.setPath('userData', path.join(app.getPath('userData'), DEV_USER_DATA_SUFFIX));
}

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
const turnCredentialClient = createTurnCredentialClient({
    bundleConfig: process.env.GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON,
    rawIceConfig: process.env.GEMDUEL_ICE_SERVERS_JSON,
    serviceUrlEnv: process.env.GEMDUEL_TURN_SERVICE_URL,
    serviceTokenEnv: process.env.GEMDUEL_TURN_SERVICE_TOKEN,
    fallbackModeEnv: process.env.GEMDUEL_TURN_SERVICE_FALLBACK_MODE,
    logger: log,
    recordMainHealth,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getReplayExportDirectory = () =>
    isDev
        ? path.resolve(__dirname, '../../..', 'Replay')
        : path.join(app.getPath('userData'), 'Replay');

const createReplayArtifactId = (contents) =>
    createHash('sha256').update(contents).digest('hex').slice(0, 12);

const saveReplayToFolder = async (payload) => {
    const safeFileName = path.basename(payload.fileName);
    if (safeFileName !== payload.fileName || !safeFileName.endsWith('.json')) {
        throw new Error('Replay export filename must stay within the governed replay folder.');
    }

    const replayBytes = Buffer.byteLength(payload.contents, 'utf8');
    if (replayBytes > MAX_REPLAY_EXPORT_BYTES) {
        throw new Error('Replay export payload exceeded the governed size limit.');
    }

    const replayDirectory = getReplayExportDirectory();
    const outputPath = path.join(replayDirectory, safeFileName);
    await fs.mkdir(replayDirectory, { recursive: true });
    await fs.writeFile(outputPath, payload.contents, 'utf8');

    recordMainHealth({
        category: 'runtime',
        name: 'REPLAY_AUTO_SAVED',
        severity: 'info',
        message: 'Replay export was written to the governed replay folder.',
        context: {
            fileName: safeFileName,
            replayArtifactId: createReplayArtifactId(payload.contents),
            replayBytes,
        },
    });

    return {
        path: outputPath,
    };
};

let mainWindow;
let peerSignalingServer = null;
let peerServerPort = null;
let lanDiscoveryService = null;
let activeDesktopAspectRatio = DEFAULT_DESKTOP_ASPECT_RATIO;
let isApplyingDesktopAspectRatio = false;

const stopActivePeerSignalingServer = (reason) => {
    const activeServer = peerSignalingServer;
    peerSignalingServer = null;
    peerServerPort = null;
    return stopPeerSignalingServer(activeServer, {
        logger: log,
        recordMainHealth,
        reason,
    });
};

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

const applyMainWindowDesktopAspectRatio = (ratio) => {
    if (!mainWindow) {
        return null;
    }
    isApplyingDesktopAspectRatio = true;
    try {
        const result = applyDesktopAspectRatioToWindow(mainWindow, ratio);
        activeDesktopAspectRatio = result.ratio;
        return result;
    } finally {
        setTimeout(() => (isApplyingDesktopAspectRatio = false), 0);
    }
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
    runtimeHarness.attachWindowLifecycle(mainWindow);
    applyMainWindowDesktopAspectRatio(activeDesktopAspectRatio);
    mainWindow.on('resize', () => {
        if (!isApplyingDesktopAspectRatio)
            applyMainWindowDesktopAspectRatio(activeDesktopAspectRatio);
    });
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
        mainWindow.loadURL(DEFAULT_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    if (!isDev) {
        runtimeHarness.configureAutoUpdater();
    }
}

runtimeHarness.attachAutoUpdaterLifecycle();
runtimeHarness.registerGovernedIpcHandlers({
    invokeHandlers: {
        [IPC_INVOKE_CHANNELS.getAppVersion]: () => app.getVersion(),
        [IPC_INVOKE_CHANNELS.getRuntimeIceServers]: () =>
            getRuntimeIceServersFromEnv(process.env.GEMDUEL_ICE_SERVERS_JSON, log),
        [IPC_INVOKE_CHANNELS.getRuntimeRelayProfile]: () =>
            turnCredentialClient.getRuntimeRelayProfile(),
        [IPC_INVOKE_CHANNELS.refreshRuntimeRelayProfile]: () =>
            turnCredentialClient.refreshRuntimeRelayProfile(),
        [IPC_INVOKE_CHANNELS.revokeRuntimeRelayProfile]: () =>
            turnCredentialClient.revokeRuntimeRelayProfile(),
        [IPC_INVOKE_CHANNELS.getReleaseHealthSnapshot]: () => releaseHealth.getSnapshot(),
        [IPC_INVOKE_CHANNELS.getLanMatchmakingState]: () => lanDiscoveryService?.getState(),
        [IPC_INVOKE_CHANNELS.saveReplayToFolder]: (_event, payload) => saveReplayToFolder(payload),
        [IPC_INVOKE_CHANNELS.startLanMatchmaking]: () => lanDiscoveryService?.startMatchmaking(),
        [IPC_INVOKE_CHANNELS.cancelLanMatchmaking]: () => lanDiscoveryService?.cancelMatchmaking(),
        [IPC_INVOKE_CHANNELS.setDesktopAspectRatio]: (_event, payload) =>
            applyMainWindowDesktopAspectRatio(payload.ratio),
        [IPC_INVOKE_CHANNELS.selectLanPregameMode]: (_event, payload) =>
            lanDiscoveryService?.selectPregameMode(payload),
        [IPC_INVOKE_CHANNELS.confirmLanPregameStart]: (_event, payload) =>
            lanDiscoveryService?.confirmPregameStart(payload),
    },
    sendHandlers: {
        [IPC_SEND_CHANNELS.restartApp]: () => {
            if (!runtimeHarness.canQuitAndInstall()) {
                recordMainHealth({
                    category: 'updater',
                    name: 'UPDATER_INSTALL_REJECTED',
                    severity: 'warn',
                    message:
                        'Renderer requested restart-and-install before an update was downloaded.',
                });
                return;
            }

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
        [IPC_SEND_CHANNELS.reportLanPeerReady]: (_event, payload) => {
            lanDiscoveryService?.reportPeerReady(payload);
        },
    },
});

app.whenReady().then(async () => {
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
        peerSignalingServer = await startPeerSignalingServer({
            startingPort: DEFAULT_PEER_SERVER_PORT,
            host: DEFAULT_PEER_SERVER_HOST,
            logger: log,
            recordMainHealth,
        });
        peerServerPort = peerSignalingServer.port;
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

    lanDiscoveryService = createLanDiscoveryService({
        appVersion: app.getVersion(),
        getHostSignalPort: () => peerServerPort,
        logger: log,
        onEvent: (event) => {
            runtimeHarness.sendToRenderer(UPDATE_CHANNELS.lanMatchmakingEvent, event);
        },
    });
    lanDiscoveryService.start();

    createWindow();
});

app.on('window-all-closed', () => {
    lanDiscoveryService?.stop();
    void stopActivePeerSignalingServer('window-all-closed');

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
    lanDiscoveryService?.stop();
    void stopActivePeerSignalingServer('before-quit');
    void turnCredentialClient.revokeRuntimeRelayProfile({
        reason: 'app-quit',
    });
    log.info(`[RELEASE_HEALTH_SUMMARY] ${JSON.stringify(releaseHealth.getSnapshot())}`);
});
