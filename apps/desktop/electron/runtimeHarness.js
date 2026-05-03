import preloadContract from './preloadContract.cjs';

const { IPC_SEND_CHANNELS, UPDATE_CHANNELS } = preloadContract;

const AUTO_UPDATER_FAILURE_THRESHOLD = 2;

const getSenderUrl = (event) => event?.senderFrame?.url ?? event?.sender?.getURL?.() ?? '';

const isWindowDestroyed = (window) =>
    typeof window?.isDestroyed === 'function' ? window.isDestroyed() : false;

export const createElectronRuntimeHarness = ({
    autoUpdater,
    ipcMain,
    isDev,
    log,
    recordMainHealth,
    authorizeIpcSender,
    validateIpcArgs,
    autoUpdaterPolicy,
}) => {
    let mainWindow = null;
    let updateFailureCount = 0;
    let lastLoggedUpdaterProgressBucket = 0;
    let updateDownloaded = false;

    const getMainWindowId = () => mainWindow?.webContents?.id ?? null;

    const recordIpcRejection = (channel, reason, severityMessage) => {
        log.warn(`[IPC] Rejected ${channel}: ${reason}`);
        recordMainHealth({
            category: 'security',
            name: 'IPC_REQUEST_REJECTED',
            severity: 'warn',
            message: severityMessage,
            context: {
                channel,
                reasonCode: 'IPC_REQUEST_REJECTED',
                reasonDetail: reason,
            },
        });
    };

    const authorizeDesktopRequest = (channel, event, args) => {
        const authorization = authorizeIpcSender({
            senderId: event.sender.id,
            senderUrl: getSenderUrl(event),
            mainWindowId: getMainWindowId(),
            isDev,
        });

        if (!authorization.ok) {
            recordIpcRejection(
                channel,
                authorization.reason,
                'IPC request was rejected by sender authorization.'
            );
            return authorization;
        }

        const payloadCheck = validateIpcArgs(channel, args);
        if (!payloadCheck.ok) {
            recordIpcRejection(
                channel,
                payloadCheck.reason,
                'IPC request was rejected by payload validation.'
            );
            return payloadCheck;
        }

        return { ok: true };
    };

    const registerGovernedIpcHandlers = ({ invokeHandlers = {}, sendHandlers = {} }) => {
        for (const [channel, handler] of Object.entries(invokeHandlers)) {
            ipcMain.handle(channel, (event, ...args) => {
                const guard = authorizeDesktopRequest(channel, event, args);
                if (!guard.ok) {
                    throw new Error(`[IPC] ${channel} rejected: ${guard.reason}`);
                }

                return handler(event, ...args);
            });
        }

        for (const [channel, handler] of Object.entries(sendHandlers)) {
            ipcMain.on(channel, (event, ...args) => {
                const guard = authorizeDesktopRequest(channel, event, args);
                if (!guard.ok) {
                    return;
                }

                handler(event, ...args);
            });
        }
    };

    const sendToRenderer = (channel, ...args) => {
        if (!mainWindow || isWindowDestroyed(mainWindow)) {
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

    const attachWindowLifecycle = (window) => {
        mainWindow = window;

        mainWindow.webContents.on('did-finish-load', () => {
            recordMainHealth({
                category: 'startup',
                name: 'WINDOW_LOADED',
                severity: 'info',
                message: 'BrowserWindow finished loading the renderer.',
            });
        });

        mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
            const write =
                level >= 2
                    ? log.error.bind(log)
                    : level === 1
                      ? log.warn.bind(log)
                      : log.info.bind(log);
            write(`[RENDERER] ${message} (${sourceId}:${line})`);
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

        mainWindow.webContents.on('render-process-gone', (_event, details) => {
            recordMainHealth({
                category: 'startup',
                name: 'WINDOW_RENDERER_GONE',
                severity: 'error',
                message: 'Renderer process exited unexpectedly.',
                context: {
                    reason: details.reason,
                    exitCode: details.exitCode,
                },
            });
        });

        mainWindow.webContents.on('preload-error', (_event, preloadPath, error) => {
            log.error(`[PRELOAD] ${preloadPath} failed to load.`, error);
            recordMainHealth({
                category: 'startup',
                name: 'WINDOW_PRELOAD_FAILED',
                severity: 'error',
                message: 'Preload script failed to initialize.',
                context: {
                    preloadPath,
                },
            });
        });

        mainWindow.on('closed', () => {
            recordMainHealth({
                category: 'startup',
                name: 'WINDOW_CLOSED',
                severity: 'info',
                message: 'Main BrowserWindow was closed.',
            });
            mainWindow = null;
        });

        return mainWindow;
    };

    const attachAutoUpdaterLifecycle = () => {
        autoUpdater.on('checking-for-update', () => {
            updateDownloaded = false;
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
                `Update available: Current version ${info?.currentVersion ?? 'unknown'}, Available version ${info?.version ?? 'unknown'}`
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
            updateDownloaded = false;
            log.info('Update not available.');
            recordMainHealth({
                category: 'updater',
                name: 'UPDATER_NOT_AVAILABLE',
                severity: 'info',
                message: 'No newer desktop version was found.',
            });
        });

        autoUpdater.on('error', (err) => {
            updateDownloaded = false;
            log.error('Error in auto-updater:', err);
            updateFailureCount += 1;
            recordMainHealth({
                category: 'updater',
                name: 'UPDATER_ERROR',
                severity: 'error',
                message: 'Auto-updater emitted an error.',
                context: {
                    failureCount: updateFailureCount,
                },
            });

            if (updateFailureCount > AUTO_UPDATER_FAILURE_THRESHOLD) {
                log.warn('Update failed multiple times. Resetting failure count.');
                recordMainHealth({
                    category: 'updater',
                    name: 'UPDATER_FAILURE_THRESHOLD_REACHED',
                    severity: 'warn',
                    message: 'Auto-updater hit the failure threshold and reset its retry counter.',
                    context: {
                        threshold: AUTO_UPDATER_FAILURE_THRESHOLD,
                    },
                });
                updateFailureCount = 0;
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
            updateDownloaded = true;
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

        return autoUpdater.checkForUpdatesAndNotify().catch((error) => {
            log.error('Failed to start auto-update check.', error);
            recordMainHealth({
                category: 'updater',
                name: 'UPDATER_CHECK_FAILED',
                severity: 'error',
                message: 'Auto-updater failed to start the update check.',
            });
        });
    };

    return {
        attachAutoUpdaterLifecycle,
        attachWindowLifecycle,
        authorizeDesktopRequest,
        configureAutoUpdater,
        canQuitAndInstall: () => updateDownloaded,
        registerGovernedIpcHandlers,
        resetUpdaterState: () => {
            updateFailureCount = 0;
            lastLoggedUpdaterProgressBucket = 0;
            updateDownloaded = false;
        },
        sendToRenderer,
    };
};
