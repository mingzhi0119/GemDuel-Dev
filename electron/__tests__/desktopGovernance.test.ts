// @vitest-environment node

import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import {
    authorizeIpcSender,
    collectDesktopGovernanceErrors,
    createMainWindowOptions,
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

    it('rejects payload arguments for no-argument IPC channels', () => {
        expect(validateIpcArgs('restart_app', [])).toEqual({ ok: true, args: [] });
        expect(validateIpcArgs('restart_app', ['unexpected'])).toEqual({
            ok: false,
            reason: 'This channel does not accept payload arguments.',
        });
    });

    it('fails the release governance check if the bridge surface or doc drifts', () => {
        const bridge = createElectronBridge({
            invoke: async () => undefined,
            send: () => undefined,
            on: () => undefined,
            removeListener: () => undefined,
        });

        const issues = collectDesktopGovernanceErrors({
            windowOptions: createMainWindowOptions({
                preloadPath: 'E:/simonbb/GemDuel-Dev/electron/preload.js',
                appVersion: '5.2.11',
            }),
            bridgeApiKeys: [...Object.keys(bridge), 'dangerousApi'],
            allowlistDocumentText: 'missing channels on purpose',
        });

        expect(issues).toContainEqual(expect.stringContaining('Bridge API surface drifted'));
        expect(issues).toContainEqual(expect.stringContaining('Missing documented channel'));
    });
});
