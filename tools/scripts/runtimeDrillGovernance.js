import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { createElectronRuntimeHarness } from '../../apps/desktop/electron/runtimeHarness.js';

const require = createRequire(import.meta.url);
const preloadContract = require('../../apps/desktop/electron/preloadContract.cjs');
const { UPDATE_CHANNELS } = preloadContract;

export const RUNTIME_DRILL_SCHEMA_VERSION = 1;

const createLogger = () => ({
    info: () => undefined,
    warn: () => undefined,
    error: () => undefined,
});

const createIpcMainStub = () => {
    const handlers = new Map();
    const listeners = new Map();

    return {
        handle: (_channel, handler) => handlers.set(_channel, handler),
        handlers,
        listeners,
        on: (_channel, handler) => listeners.set(_channel, handler),
    };
};

const createAutoUpdaterStub = () => {
    const autoUpdater = new EventEmitter();
    autoUpdater.checkForUpdatesAndNotify = () => Promise.resolve();
    autoUpdater.quitAndInstall = () => undefined;
    return autoUpdater;
};

const createWindowStub = ({ id = 7, destroyed = false } = {}) => {
    const window = new EventEmitter();
    window.isDestroyed = () => destroyed;
    window.setMenuBarVisibility = () => undefined;
    window.webContents = new EventEmitter();
    window.webContents.id = id;
    window.webContents.send = () => undefined;
    window.webContents.openDevTools = () => undefined;
    return window;
};

const createSenderEvent = ({ id, url }) => ({
    sender: {
        id,
        getURL: () => url,
    },
    senderFrame: {
        url,
    },
});

const createHarnessContext = () => {
    const recordedEvents = [];
    const renderedChannels = [];
    const log = createLogger();
    const ipcMain = createIpcMainStub();
    const autoUpdater = createAutoUpdaterStub();
    const runtimeHarness = createElectronRuntimeHarness({
        autoUpdater,
        autoUpdaterPolicy: {
            enabled: true,
            autoDownload: true,
            allowPrerelease: false,
        },
        authorizeIpcSender: ({ senderId, mainWindowId }) =>
            senderId === mainWindowId
                ? { ok: true }
                : { ok: false, reason: 'Unexpected renderer sender.' },
        isDev: true,
        ipcMain,
        log,
        recordMainHealth: (event) => {
            recordedEvents.push({
                category: event.category,
                name: event.name,
                severity: event.severity,
            });
        },
        validateIpcArgs: () => ({ ok: true, args: [] }),
    });

    const originalSendToRenderer = runtimeHarness.sendToRenderer;
    runtimeHarness.sendToRenderer = (channel, ...args) => {
        renderedChannels.push({
            channel,
            argCount: args.length,
        });
        return originalSendToRenderer(channel, ...args);
    };

    return {
        autoUpdater,
        ipcMain,
        recordedEvents,
        renderedChannels,
        runtimeHarness,
    };
};

const scenarioWindowUnavailable = () => {
    const context = createHarnessContext();
    context.runtimeHarness.sendToRenderer(UPDATE_CHANNELS.updateAvailable);
    return {
        id: 'window-unavailable',
        title: 'Renderer notifications fail closed without a live window',
        eventMatrix: context.recordedEvents,
        rendererChannels: context.renderedChannels,
    };
};

const scenarioWindowLoadFailed = () => {
    const context = createHarnessContext();
    const window = createWindowStub();
    context.runtimeHarness.attachWindowLifecycle(window);
    window.webContents.emit('did-fail-load', {}, -1, 'boom', 'http://localhost:5173');

    return {
        id: 'window-load-failed',
        title: 'BrowserWindow load failures become structured startup evidence',
        eventMatrix: context.recordedEvents,
        rendererChannels: context.renderedChannels,
    };
};

const scenarioIpcPayloadReject = () => {
    const context = createHarnessContext();
    const window = createWindowStub();
    context.runtimeHarness.attachWindowLifecycle(window);
    context.runtimeHarness.registerGovernedIpcHandlers({
        sendHandlers: {
            restart_app: () => undefined,
        },
    });

    const restartApp = context.ipcMain.listeners.get('restart_app');
    const payloadRejectingHarness = createElectronRuntimeHarness({
        autoUpdater: context.autoUpdater,
        autoUpdaterPolicy: {
            enabled: false,
            autoDownload: true,
            allowPrerelease: false,
        },
        authorizeIpcSender: ({ senderId, mainWindowId }) =>
            senderId === mainWindowId
                ? { ok: true }
                : { ok: false, reason: 'Unexpected renderer sender.' },
        isDev: true,
        ipcMain: context.ipcMain,
        log: createLogger(),
        recordMainHealth: (event) => {
            context.recordedEvents.push({
                category: event.category,
                name: event.name,
                severity: event.severity,
            });
        },
        validateIpcArgs: () => ({
            ok: false,
            reason: 'This channel does not accept payload arguments.',
        }),
    });
    payloadRejectingHarness.attachWindowLifecycle(window);
    payloadRejectingHarness.registerGovernedIpcHandlers({
        sendHandlers: {
            restart_app: () => undefined,
        },
    });

    const guardedRestartApp = context.ipcMain.listeners.get('restart_app') ?? restartApp;
    guardedRestartApp?.(
        createSenderEvent({
            id: 7,
            url: 'http://localhost:5173',
        }),
        'unexpected'
    );

    return {
        id: 'ipc-payload-reject',
        title: 'Unexpected IPC payloads are rejected before privileged handlers run',
        eventMatrix: context.recordedEvents,
        rendererChannels: context.renderedChannels,
    };
};

const scenarioUpdaterNotifications = () => {
    const context = createHarnessContext();
    const window = createWindowStub();
    context.runtimeHarness.attachWindowLifecycle(window);
    context.runtimeHarness.attachAutoUpdaterLifecycle();

    context.autoUpdater.emit('checking-for-update');
    context.autoUpdater.emit('update-available', {
        version: '5.2.12',
        currentVersion: '5.2.11',
    });
    context.autoUpdater.emit('update-not-available');
    context.autoUpdater.emit('download-progress', {
        percent: 26,
    });
    context.autoUpdater.emit('download-progress', {
        percent: 55,
    });
    context.autoUpdater.emit('update-downloaded', {
        version: '5.2.12',
    });

    return {
        id: 'updater-notifications',
        title: 'Updater lifecycle emits release-health checkpoints and renderer notifications',
        eventMatrix: context.recordedEvents,
        rendererChannels: context.renderedChannels,
    };
};

const scenarioUpdaterFailureThreshold = () => {
    const context = createHarnessContext();
    context.runtimeHarness.attachWindowLifecycle(createWindowStub());
    context.runtimeHarness.attachAutoUpdaterLifecycle();

    context.autoUpdater.emit('error', new Error('first'));
    context.autoUpdater.emit('error', new Error('second'));
    context.autoUpdater.emit('error', new Error('third'));

    return {
        id: 'updater-failure-threshold',
        title: 'Repeated updater failures roll into a governed threshold warning',
        eventMatrix: context.recordedEvents,
        rendererChannels: context.renderedChannels,
    };
};

const scenarioUpdaterDisabled = () => {
    const recordedEvents = [];
    const runtimeHarness = createElectronRuntimeHarness({
        autoUpdater: createAutoUpdaterStub(),
        autoUpdaterPolicy: {
            enabled: false,
            autoDownload: true,
            allowPrerelease: false,
        },
        authorizeIpcSender: () => ({ ok: true }),
        isDev: false,
        ipcMain: createIpcMainStub(),
        log: createLogger(),
        recordMainHealth: (event) => {
            recordedEvents.push({
                category: event.category,
                name: event.name,
                severity: event.severity,
            });
        },
        validateIpcArgs: () => ({ ok: true, args: [] }),
    });

    runtimeHarness.configureAutoUpdater();

    return {
        id: 'updater-disabled',
        title: 'Runtime policy can disable auto-updates without crashing startup',
        eventMatrix: recordedEvents,
        rendererChannels: [],
    };
};

export const buildRuntimeDrillSnapshot = () => ({
    schemaVersion: RUNTIME_DRILL_SCHEMA_VERSION,
    scenarios: [
        scenarioWindowUnavailable(),
        scenarioWindowLoadFailed(),
        scenarioIpcPayloadReject(),
        scenarioUpdaterNotifications(),
        scenarioUpdaterFailureThreshold(),
        scenarioUpdaterDisabled(),
    ],
});

export const collectRuntimeDrillSnapshotErrors = ({ expectedSnapshot, actualSnapshot }) => {
    const issues = [];

    if (
        expectedSnapshot?.schemaVersion !== RUNTIME_DRILL_SCHEMA_VERSION ||
        actualSnapshot?.schemaVersion !== RUNTIME_DRILL_SCHEMA_VERSION
    ) {
        issues.push(
            `Runtime drill snapshot must stay at schema version ${RUNTIME_DRILL_SCHEMA_VERSION}.`
        );
    }

    const expectedScenarioIds = Array.isArray(expectedSnapshot?.scenarios)
        ? expectedSnapshot.scenarios.map((scenario) => scenario.id)
        : [];
    const actualScenarioIds = Array.isArray(actualSnapshot?.scenarios)
        ? actualSnapshot.scenarios.map((scenario) => scenario.id)
        : [];

    if (JSON.stringify(expectedScenarioIds) !== JSON.stringify(actualScenarioIds)) {
        issues.push('Runtime drill scenario IDs drifted from the audited snapshot.');
    }

    if (JSON.stringify(expectedSnapshot) !== JSON.stringify(actualSnapshot)) {
        issues.push('Runtime drill snapshot drifted from the audited machine-readable baseline.');
    }

    return issues;
};
