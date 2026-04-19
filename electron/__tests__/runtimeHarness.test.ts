// @vitest-environment node

import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import { createElectronRuntimeHarness } from '../runtimeHarness.js';

const createLogger = () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
});

const createRecordMainHealth = () => vi.fn();

const createIpcMainStub = () => {
    const handlers = new Map();
    const listeners = new Map();

    return {
        handle: vi.fn((channel, handler) => handlers.set(channel, handler)),
        handlers,
        listeners,
        on: vi.fn((channel, handler) => listeners.set(channel, handler)),
    };
};

const createAutoUpdaterStub = () => {
    const autoUpdater = new EventEmitter() as EventEmitter & {
        autoDownload?: boolean;
        allowPrerelease?: boolean;
        checkForUpdatesAndNotify: ReturnType<typeof vi.fn>;
        quitAndInstall: ReturnType<typeof vi.fn>;
    };

    autoUpdater.checkForUpdatesAndNotify = vi.fn(() => Promise.resolve());
    autoUpdater.quitAndInstall = vi.fn();

    return autoUpdater;
};

const createWindowStub = ({ id = 7 } = {}) => {
    const window = new EventEmitter() as EventEmitter & {
        isDestroyed: ReturnType<typeof vi.fn>;
        setMenuBarVisibility: ReturnType<typeof vi.fn>;
        webContents: EventEmitter & {
            id: number;
            send: ReturnType<typeof vi.fn>;
            openDevTools: ReturnType<typeof vi.fn>;
        };
    };

    window.isDestroyed = vi.fn(() => false);
    window.setMenuBarVisibility = vi.fn();
    window.webContents = new EventEmitter() as EventEmitter & {
        id: number;
        send: ReturnType<typeof vi.fn>;
        openDevTools: ReturnType<typeof vi.fn>;
    };
    window.webContents.id = id;
    window.webContents.send = vi.fn();
    window.webContents.openDevTools = vi.fn();

    return window;
};

const createSenderEvent = ({ id, url }: { id: number; url: string }) => ({
    sender: {
        id,
        getURL: vi.fn(() => url),
    },
    senderFrame: {
        url,
    },
});

describe('electron runtime harness', () => {
    it('records WINDOW_LOAD_FAILED when the renderer load fails', () => {
        const log = createLogger();
        const recordMainHealth = createRecordMainHealth();
        const ipcMain = createIpcMainStub();
        const autoUpdater = createAutoUpdaterStub();
        const runtime = createElectronRuntimeHarness({
            autoUpdater,
            autoUpdaterPolicy: {
                enabled: false,
                autoDownload: true,
                allowPrerelease: false,
            },
            authorizeIpcSender: vi.fn(),
            isDev: true,
            ipcMain,
            log,
            recordMainHealth,
            validateIpcArgs: vi.fn(),
        });

        const window = createWindowStub();
        runtime.attachWindowLifecycle(window);

        window.webContents.emit('did-fail-load', {}, -1, 'boom', 'http://localhost:5173');

        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'startup',
                name: 'WINDOW_LOAD_FAILED',
                severity: 'error',
                context: expect.objectContaining({
                    errorCode: -1,
                    errorDescription: 'boom',
                    validatedURL: 'http://localhost:5173',
                }),
            })
        );
    });

    it('rejects unauthorized invoke and send calls and records IPC_REQUEST_REJECTED', () => {
        const log = createLogger();
        const recordMainHealth = createRecordMainHealth();
        const ipcMain = createIpcMainStub();
        const autoUpdater = createAutoUpdaterStub();
        const runtime = createElectronRuntimeHarness({
            autoUpdater,
            autoUpdaterPolicy: {
                enabled: false,
                autoDownload: true,
                allowPrerelease: false,
            },
            authorizeIpcSender: vi.fn(({ senderId, mainWindowId }) =>
                senderId === mainWindowId
                    ? { ok: true }
                    : { ok: false, reason: 'Unexpected renderer sender.' }
            ),
            isDev: true,
            ipcMain,
            log,
            recordMainHealth,
            validateIpcArgs: vi.fn(() => ({ ok: true, args: [] })),
        });

        runtime.attachWindowLifecycle(createWindowStub({ id: 7 }));
        const invokeHandler = vi.fn();
        const sendHandler = vi.fn();
        runtime.registerGovernedIpcHandlers({
            invokeHandlers: {
                'get-app-version': invokeHandler,
            },
            sendHandlers: {
                restart_app: sendHandler,
            },
        });

        const invoke = ipcMain.handlers.get('get-app-version');
        const send = ipcMain.listeners.get('restart_app');
        const rejectedEvent = createSenderEvent({
            id: 99,
            url: 'http://localhost:5173',
        });

        expect(() => invoke?.(rejectedEvent)).toThrow(
            '[IPC] get-app-version rejected: Unexpected renderer sender.'
        );
        send?.(rejectedEvent);

        expect(invokeHandler).not.toHaveBeenCalled();
        expect(sendHandler).not.toHaveBeenCalled();
        expect(recordMainHealth).toHaveBeenCalledTimes(2);
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'IPC_REQUEST_REJECTED',
                context: expect.objectContaining({
                    channel: 'get-app-version',
                    reason: 'Unexpected renderer sender.',
                }),
            })
        );
    });

    it('records UPDATER_CHECK_FAILED when the update check rejects', async () => {
        const log = createLogger();
        const recordMainHealth = createRecordMainHealth();
        const ipcMain = createIpcMainStub();
        const autoUpdater = createAutoUpdaterStub();
        autoUpdater.checkForUpdatesAndNotify.mockRejectedValueOnce(new Error('network down'));

        const runtime = createElectronRuntimeHarness({
            autoUpdater,
            autoUpdaterPolicy: {
                enabled: true,
                autoDownload: true,
                allowPrerelease: false,
            },
            authorizeIpcSender: vi.fn(),
            isDev: false,
            ipcMain,
            log,
            recordMainHealth,
            validateIpcArgs: vi.fn(),
        });

        await runtime.configureAutoUpdater();

        expect(autoUpdater.autoDownload).toBe(true);
        expect(autoUpdater.allowPrerelease).toBe(false);
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'updater',
                name: 'UPDATER_CHECK_FAILED',
                severity: 'error',
            })
        );
    });

    it('records UPDATER_FAILURE_THRESHOLD_REACHED after repeated updater errors', () => {
        const log = createLogger();
        const recordMainHealth = createRecordMainHealth();
        const ipcMain = createIpcMainStub();
        const autoUpdater = createAutoUpdaterStub();
        const runtime = createElectronRuntimeHarness({
            autoUpdater,
            autoUpdaterPolicy: {
                enabled: false,
                autoDownload: true,
                allowPrerelease: false,
            },
            authorizeIpcSender: vi.fn(),
            isDev: false,
            ipcMain,
            log,
            recordMainHealth,
            validateIpcArgs: vi.fn(),
        });

        runtime.attachWindowLifecycle(createWindowStub({ id: 7 }));
        runtime.attachAutoUpdaterLifecycle();

        autoUpdater.emit('error', new Error('first'));
        autoUpdater.emit('error', new Error('second'));
        autoUpdater.emit('error', new Error('third'));

        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'updater',
                name: 'UPDATER_FAILURE_THRESHOLD_REACHED',
                severity: 'warn',
                context: expect.objectContaining({
                    threshold: 2,
                }),
            })
        );
    });

    it('allows restart_app to reach quitAndInstall only for authorized senders', () => {
        const log = createLogger();
        const recordMainHealth = createRecordMainHealth();
        const ipcMain = createIpcMainStub();
        const autoUpdater = createAutoUpdaterStub();
        const runtime = createElectronRuntimeHarness({
            autoUpdater,
            autoUpdaterPolicy: {
                enabled: false,
                autoDownload: true,
                allowPrerelease: false,
            },
            authorizeIpcSender: vi.fn(({ senderId, senderUrl, mainWindowId, isDev }) => {
                if (senderId !== mainWindowId) {
                    return { ok: false, reason: 'Unexpected renderer sender.' };
                }

                if (isDev && !senderUrl.startsWith('http://localhost:5173')) {
                    return { ok: false, reason: 'Untrusted renderer origin.' };
                }

                return { ok: true };
            }),
            isDev: true,
            ipcMain,
            log,
            recordMainHealth,
            validateIpcArgs: vi.fn(() => ({ ok: true, args: [] })),
        });

        runtime.attachWindowLifecycle(createWindowStub({ id: 7 }));
        runtime.registerGovernedIpcHandlers({
            sendHandlers: {
                restart_app: () => {
                    recordMainHealth({
                        category: 'updater',
                        name: 'UPDATER_INSTALL_REQUESTED',
                        severity: 'info',
                        message:
                            'Renderer requested restart-and-install for the downloaded update.',
                    });
                    autoUpdater.quitAndInstall();
                },
            },
        });

        const restartApp = ipcMain.listeners.get('restart_app');
        const authorizedEvent = createSenderEvent({
            id: 7,
            url: 'http://localhost:5173',
        });

        restartApp?.(authorizedEvent);

        expect(autoUpdater.quitAndInstall).toHaveBeenCalledTimes(1);
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'updater',
                name: 'UPDATER_INSTALL_REQUESTED',
                severity: 'info',
            })
        );
    });
});
