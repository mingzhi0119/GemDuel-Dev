// @vitest-environment node

import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import {
    authorizeIpcSender,
    buildDesktopGovernanceSnapshot,
    collectDesktopGovernanceErrors,
    collectSnapshotDriftIssues,
    createMainWindowOptions,
    isAllowedRendererUrl,
    validateIpcArgs,
    validateMainWindowOptions,
} from '../desktopGovernance.js';

const require = createRequire(import.meta.url);
const { createElectronBridge } = require('../preloadContract.cjs') as {
    createElectronBridge: (ipcRenderer: {
        invoke: () => Promise<undefined>;
        send: () => void;
        on: () => void;
        removeListener: () => void;
    }) => Record<string, unknown>;
};

describe('electron desktop governance', () => {
    it('builds BrowserWindow options that satisfy the security policy', () => {
        const options = createMainWindowOptions({
            preloadPath: 'E:/simonbb/GemDuel-Dev/electron/preload.js',
            appVersion: '5.2.11',
        });

        expect(validateMainWindowOptions(options)).toEqual([]);
        expect(options.webPreferences).toMatchObject({
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
            allowRunningInsecureContent: false,
        });
    });

    it('rejects weakened BrowserWindow security flags', () => {
        const options = createMainWindowOptions({
            preloadPath: 'E:/simonbb/GemDuel-Dev/electron/preload.js',
            appVersion: '5.2.11',
        });
        options.webPreferences.contextIsolation = false;

        expect(validateMainWindowOptions(options)).toContainEqual(
            expect.stringContaining('contextIsolation')
        );
    });

    it('rejects missing window registration, invalid preload settings, and unknown IPC channels', () => {
        const options = createMainWindowOptions({
            preloadPath: 'E:/simonbb/GemDuel-Dev/electron/preload.js',
            appVersion: '5.2.11',
        });
        options.autoHideMenuBar = false;
        options.webPreferences.preload = '';

        const issues = validateMainWindowOptions(options);

        expect(issues).toContain('[BrowserWindow] autoHideMenuBar must stay enabled.');
        expect(issues).toContainEqual(expect.stringContaining('preload'));
        expect(
            authorizeIpcSender({
                senderId: 7,
                senderUrl: 'file:///E:/simonbb/GemDuel-Dev/dist/index.html',
                mainWindowId: null,
                isDev: false,
            })
        ).toEqual({ ok: false, reason: 'No trusted main window is registered.' });
        expect(validateIpcArgs('unknown-channel', [])).toEqual({
            ok: false,
            reason: 'Unknown IPC channel unknown-channel.',
        });
        expect(isAllowedRendererUrl('file:///E:/simonbb/GemDuel-Dev/dist/index.html', false)).toBe(
            true
        );
        expect(isAllowedRendererUrl('http://localhost:5173', false)).toBe(false);
    });

    it('authorizes only the trusted renderer sender and origin', () => {
        expect(
            authorizeIpcSender({
                senderId: 7,
                senderUrl: 'http://localhost:5173',
                mainWindowId: 7,
                isDev: true,
            })
        ).toEqual({ ok: true });

        expect(
            authorizeIpcSender({
                senderId: 8,
                senderUrl: 'http://localhost:5173',
                mainWindowId: 7,
                isDev: true,
            })
        ).toEqual({ ok: false, reason: 'Unexpected renderer sender.' });

        expect(
            authorizeIpcSender({
                senderId: 7,
                senderUrl: 'https://evil.example.com',
                mainWindowId: 7,
                isDev: true,
            })
        ).toEqual({ ok: false, reason: 'Untrusted renderer origin.' });
    });

    it('validates payload shapes for governed IPC channels', () => {
        expect(validateIpcArgs('restart_app', [])).toEqual({ ok: true, args: [] });
        expect(validateIpcArgs('refresh-runtime-relay-profile', [])).toEqual({
            ok: true,
            args: [],
        });
        expect(validateIpcArgs('revoke-runtime-relay-profile', [])).toEqual({
            ok: true,
            args: [],
        });
        expect(validateIpcArgs('restart_app', ['unexpected'])).toEqual({
            ok: false,
            reason: 'This channel does not accept payload arguments.',
        });
        expect(
            validateIpcArgs('report-release-health', [
                {
                    source: 'renderer',
                    category: 'runtime',
                    name: 'APP_RUNTIME_CONFIG_LOADED',
                    severity: 'info',
                    message: 'Loaded.',
                },
            ])
        ).toEqual({
            ok: true,
            args: [
                {
                    source: 'renderer',
                    category: 'runtime',
                    name: 'APP_RUNTIME_CONFIG_LOADED',
                    severity: 'info',
                    message: 'Loaded.',
                },
            ],
        });
        expect(validateIpcArgs('report-release-health', ['invalid'])).toEqual({
            ok: false,
            reason: 'Release-health payload did not match the allowlisted schema.',
        });
    });

    it('fails the release governance check if the bridge surface or doc drifts', () => {
        const bridge = createElectronBridge({
            invoke: async () => undefined,
            send: () => undefined,
            on: () => undefined,
            removeListener: () => undefined,
        });
        const baseSnapshot = buildDesktopGovernanceSnapshot({
            windowOptions: createMainWindowOptions({
                preloadPath: 'E:/simonbb/GemDuel-Dev/electron/preload.js',
                appVersion: '5.2.11',
            }),
            bridgeApiKeys: Object.keys(bridge),
        });

        const issues = collectDesktopGovernanceErrors({
            windowOptions: createMainWindowOptions({
                preloadPath: 'E:/simonbb/GemDuel-Dev/electron/preload.js',
                appVersion: '5.2.11',
            }),
            bridgeApiKeys: [...Object.keys(bridge), 'dangerousApi'],
            allowlistDocumentText: 'missing channels on purpose',
            expectedSnapshot: baseSnapshot,
        });

        expect(issues).toContainEqual(expect.stringContaining('Bridge API surface drifted'));
        expect(issues).toContainEqual(expect.stringContaining('Missing documented channel'));
        expect(issues).toContainEqual(expect.stringContaining('audited snapshot'));
    });

    it('flags every audited snapshot drift dimension independently', () => {
        const bridge = createElectronBridge({
            invoke: async () => undefined,
            send: () => undefined,
            on: () => undefined,
            removeListener: () => undefined,
        });
        const baseSnapshot = buildDesktopGovernanceSnapshot({
            windowOptions: createMainWindowOptions({
                preloadPath: 'E:/simonbb/GemDuel-Dev/electron/preload.js',
                appVersion: '5.2.11',
            }),
            bridgeApiKeys: Object.keys(bridge),
        });

        const issues = collectSnapshotDriftIssues(baseSnapshot, {
            policyVersion: 999,
            mainWindow: {
                ...baseSnapshot.mainWindow,
                autoHideMenuBar: false,
            },
            bridgeApiKeys: [...baseSnapshot.bridgeApiKeys, 'dangerousApi'].sort(),
            allowlistedChannels: [...baseSnapshot.allowlistedChannels, 'dangerous-channel'].sort(),
        });

        expect(issues).toEqual(
            expect.arrayContaining([
                '[Snapshot] Desktop governance policy version must remain 1.',
                '[Snapshot] BrowserWindow governance snapshot drifted.',
                '[Snapshot] Bridge API surface drifted from the audited snapshot.',
                '[Snapshot] IPC allowlist drifted from the audited snapshot.',
            ])
        );
    });

    it('produces a stable machine-readable governance snapshot', () => {
        const bridge = createElectronBridge({
            invoke: async () => undefined,
            send: () => undefined,
            on: () => undefined,
            removeListener: () => undefined,
        });
        const actualSnapshot = buildDesktopGovernanceSnapshot({
            windowOptions: createMainWindowOptions({
                preloadPath: 'E:/simonbb/GemDuel-Dev/electron/preload.js',
                appVersion: '5.2.11',
            }),
            bridgeApiKeys: Object.keys(bridge),
        });

        expect(
            collectSnapshotDriftIssues(actualSnapshot, {
                ...actualSnapshot,
            })
        ).toEqual([]);
    });
});
