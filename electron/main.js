import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import log from 'electron-log';
import pkg from 'electron-updater';
import { PeerServer } from 'peer';
const { autoUpdater } = pkg;

const DEFAULT_LOG_LEVEL = isDev ? 'debug' : 'info';
const MAX_LOG_FILE_SIZE = 5 * 1024 * 1024;
const allowPrereleaseUpdates =
    process.env.GEMDUEL_ALLOW_PRERELEASE === 'true' || app.getVersion().includes('-');

autoUpdater.logger = log;
log.transports.file.level = process.env.GEMDUEL_LOG_LEVEL || DEFAULT_LOG_LEVEL;
log.transports.file.maxSize = MAX_LOG_FILE_SIZE;
log.transports.console.level = isDev ? 'debug' : 'warn';
log.info(`App starting in ${isDev ? 'development' : 'production'} mode...`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let updateFailureCount = 0;
let peerServer = null; // Keep reference to prevent garbage collection

const normalizeIceServer = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }

    const { urls, username, credential } = value;
    const urlsAreValid =
        typeof urls === 'string' ||
        (Array.isArray(urls) && urls.every((entry) => typeof entry === 'string'));

    if (!urlsAreValid) {
        return null;
    }

    if (username !== undefined && typeof username !== 'string') {
        return null;
    }

    if (credential !== undefined && typeof credential !== 'string') {
        return null;
    }

    return { urls, username, credential };
};

const getRuntimeIceServers = () => {
    const rawConfig = process.env.GEMDUEL_ICE_SERVERS_JSON;
    if (!rawConfig) {
        return [];
    }

    try {
        const parsed = JSON.parse(rawConfig);
        if (!Array.isArray(parsed)) {
            log.warn('[RTC] GEMDUEL_ICE_SERVERS_JSON must be a JSON array. Falling back to STUN.');
            return [];
        }

        const servers = parsed
            .map((server) => normalizeIceServer(server))
            .filter((server) => server !== null);

        if (servers.length !== parsed.length) {
            log.warn('[RTC] Ignored one or more invalid runtime ICE server entries.');
        }

        return servers;
    } catch (error) {
        log.warn('[RTC] Failed to parse GEMDUEL_ICE_SERVERS_JSON. Falling back to STUN.', error);
        return [];
    }
};

const configureAutoUpdater = () => {
    if (process.env.GEMDUEL_DISABLE_UPDATES === 'true') {
        log.info('Auto-updates disabled by environment override.');
        return;
    }

    autoUpdater.autoDownload = true;
    autoUpdater.allowPrerelease = allowPrereleaseUpdates;

    autoUpdater.checkForUpdatesAndNotify().catch((error) => {
        log.error('Failed to start auto-update check.', error);
    });
};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        title: `GemDuel v${app.getVersion()}`,
        backgroundColor: '#020617',
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
    if (mainWindow) mainWindow.webContents.send('update_available');
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
    if (mainWindow) mainWindow.webContents.send('download_progress', progressObj.percent);
});

autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded; will install now', info);
    if (mainWindow) mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.handle('get-runtime-ice-servers', () => {
    return getRuntimeIceServers();
});

app.whenReady().then(() => {
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
