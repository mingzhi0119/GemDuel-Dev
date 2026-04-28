// @vitest-environment node

import { createRequire } from 'node:module';
import { describe, expect, it, vi } from 'vitest';
import {
    applyDesktopAspectRatioToWindow,
    authorizeIpcSender,
    buildDesktopGovernanceSnapshot,
    collectDesktopGovernanceErrors,
    collectSnapshotDriftIssues,
    createMainWindowOptions,
    getDesktopAspectRatioConfig,
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
        expect(options).toMatchObject({
            width: 1280,
            height: 800,
            minWidth: 1280,
            minHeight: 800,
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
        const packagedRendererUrl = 'file:///E:/simonbb/GemDuel-Dev/apps/desktop/dist/index.html';
        expect(
            isAllowedRendererUrl(packagedRendererUrl, false, {
                packagedRendererUrl,
            })
        ).toBe(true);
        expect(
            isAllowedRendererUrl('file:///E:/simonbb/GemDuel-Dev/other/index.html', false, {
                packagedRendererUrl,
            })
        ).toBe(false);
        expect(isAllowedRendererUrl('http://localhost:5173', false)).toBe(false);
    });

    it('keeps renderer trust URL parsing fail-closed with governed defaults', () => {
        expect(isAllowedRendererUrl(5173, true)).toBe(false);
        expect(isAllowedRendererUrl('not a url', true)).toBe(false);
        expect(
            isAllowedRendererUrl('http://localhost:5173', true, {
                devServerUrl: 'not a url',
            })
        ).toBe(true);
        expect(
            isAllowedRendererUrl('https://localhost/', true, {
                devServerUrl: 'https://LOCALHOST:443/',
            })
        ).toBe(true);
        expect(
            isAllowedRendererUrl(
                'file:///E:/simonbb/GemDuel-Dev/apps/desktop/dist/index.html',
                false,
                {
                    packagedRendererUrl: 'not a url',
                }
            )
        ).toBe(false);
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

    it('allows a governed dev-server origin override for local verification flows', () => {
        const previousDevServerUrl = process.env.GEMDUEL_DEV_SERVER_URL;
        process.env.GEMDUEL_DEV_SERVER_URL = 'http://localhost:5199/?lanHarness=1';

        try {
            expect(isAllowedRendererUrl('http://localhost:5199/?lanHarness=1', true)).toBe(true);
            expect(
                authorizeIpcSender({
                    senderId: 7,
                    senderUrl: 'http://localhost:5199/?lanHarness=1',
                    mainWindowId: 7,
                    isDev: true,
                })
            ).toEqual({ ok: true });
        } finally {
            if (previousDevServerUrl === undefined) {
                delete process.env.GEMDUEL_DEV_SERVER_URL;
            } else {
                process.env.GEMDUEL_DEV_SERVER_URL = previousDevServerUrl;
            }
        }
    });

    it('rejects renderer URL spoofing across dev and packaged renderer policies', () => {
        const packagedRendererUrl = 'file:///E:/simonbb/GemDuel-Dev/apps/desktop/dist/index.html';

        expect(isAllowedRendererUrl('http://localhost:5173.evil.example.com', true)).toBe(false);
        expect(isAllowedRendererUrl('http://localhost:5173/other', true)).toBe(false);
        expect(isAllowedRendererUrl('http://localhost:5173/%2fother', true)).toBe(false);
        expect(
            isAllowedRendererUrl('http://localhost:5173/?redirect=file:///tmp/index.html', true)
        ).toBe(false);
        expect(
            isAllowedRendererUrl(
                'file:///E:/simonbb/GemDuel-Dev/apps/desktop/dist/index.html?x=1',
                false,
                {
                    packagedRendererUrl,
                }
            )
        ).toBe(false);
        expect(
            isAllowedRendererUrl(
                'file:///E:/simonbb/GemDuel-Dev/apps/desktop/dist/other.html',
                false,
                {
                    packagedRendererUrl,
                }
            )
        ).toBe(false);
    });

    it('validates payload shapes for governed IPC channels', () => {
        expect(validateIpcArgs('restart_app', [])).toEqual({ ok: true, args: [] });
        expect(validateIpcArgs('get-lan-matchmaking-state', [])).toEqual({ ok: true, args: [] });
        expect(
            validateIpcArgs('save-replay-to-folder', [
                {
                    fileName: 'GemDuel_Replay_v1_test.json',
                    contents: '{"schemaVersion":"1.0"}',
                },
            ])
        ).toEqual({
            ok: true,
            args: [
                {
                    fileName: 'GemDuel_Replay_v1_test.json',
                    contents: '{"schemaVersion":"1.0"}',
                },
            ],
        });
        expect(validateIpcArgs('start-lan-matchmaking', [])).toEqual({ ok: true, args: [] });
        expect(validateIpcArgs('cancel-lan-matchmaking', [])).toEqual({ ok: true, args: [] });
        expect(validateIpcArgs('set-desktop-aspect-ratio', [{ ratio: '16:9' }])).toEqual({
            ok: true,
            args: [{ ratio: '16:9' }],
        });
        expect(validateIpcArgs('set-desktop-aspect-ratio', [{ ratio: '21:9' }])).toEqual({
            ok: false,
            reason: 'Desktop aspect ratio payload did not match the allowlisted schema.',
        });
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
        expect(validateIpcArgs('save-replay-to-folder', ['invalid'])).toEqual({
            ok: false,
            reason: 'Replay export payload did not match the allowlisted schema.',
        });
        expect(
            validateIpcArgs('select-lan-pregame-mode', [
                {
                    roomId: 'room-1',
                    mode: 'classic',
                },
            ])
        ).toEqual({
            ok: true,
            args: [
                {
                    roomId: 'room-1',
                    mode: 'classic',
                },
            ],
        });
        expect(
            validateIpcArgs('confirm-lan-pregame-start', [
                {
                    roomId: 'room-1',
                },
            ])
        ).toEqual({
            ok: true,
            args: [
                {
                    roomId: 'room-1',
                },
            ],
        });
        expect(
            validateIpcArgs('report-lan-peer-ready', [
                {
                    roomId: 'room-1',
                    peerId: 'peer-1',
                },
            ])
        ).toEqual({
            ok: true,
            args: [
                {
                    roomId: 'room-1',
                    peerId: 'peer-1',
                },
            ],
        });
    });

    it('applies the governed desktop aspect ratio to BrowserWindow-like targets', () => {
        const window = {
            getBounds: vi.fn(() => ({ width: 1600, height: 900 })),
            setMinimumSize: vi.fn(),
            setAspectRatio: vi.fn(),
            setSize: vi.fn(),
        };

        expect(applyDesktopAspectRatioToWindow(window, '16:9')).toEqual({
            ratio: '16:9',
            width: 1600,
            height: 900,
            aspectRatio: 16 / 9,
        });
        expect(window.setMinimumSize).toHaveBeenCalledWith(1280, 720);
        expect(window.setAspectRatio).toHaveBeenCalledWith(16 / 9);
        expect(window.setSize).toHaveBeenCalledWith(1600, 900);

        window.getBounds.mockReturnValue({ width: 1600, height: 900 });
        expect(applyDesktopAspectRatioToWindow(window, '16:10')).toEqual({
            ratio: '16:10',
            width: 1600,
            height: 1000,
            aspectRatio: 16 / 10,
        });
        expect(window.setMinimumSize).toHaveBeenLastCalledWith(1280, 800);
        expect(window.setAspectRatio).toHaveBeenLastCalledWith(16 / 10);
        expect(window.setSize).toHaveBeenLastCalledWith(1600, 1000);
    });

    it('keeps aspect ratio and snapshot fallbacks explicit for governance checks', () => {
        expect(() => getDesktopAspectRatioConfig('21:9')).toThrow(
            'Desktop aspect ratio must be one of 16:10 or 16:9.'
        );

        expect(applyDesktopAspectRatioToWindow(undefined, '16:10')).toEqual({
            ratio: '16:10',
            width: 1280,
            height: 800,
            aspectRatio: 16 / 10,
        });
        expect(
            applyDesktopAspectRatioToWindow(
                {
                    getBounds: vi.fn(() => ({ width: 0, height: 0 })),
                },
                '16:9'
            )
        ).toEqual({
            ratio: '16:9',
            width: 1280,
            height: 720,
            aspectRatio: 16 / 9,
        });

        expect(
            validateMainWindowOptions({
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    webSecurity: true,
                    allowRunningInsecureContent: false,
                    preload: 'E:/simonbb/GemDuel-Dev/electron/preload.js',
                },
                autoHideMenuBar: true,
                width: 1280,
                height: 720,
                minWidth: 1024,
                minHeight: 640,
            })
        ).toEqual([
            '[BrowserWindow] default size must stay locked to 16:10 at 1280x800.',
            '[BrowserWindow] default minimum size must stay locked to 16:10 at 1280x800.',
        ]);

        expect(
            buildDesktopGovernanceSnapshot({
                windowOptions: undefined,
                bridgeApiKeys: [],
            }).mainWindow
        ).toMatchObject({
            autoHideMenuBar: null,
            width: null,
            height: null,
            minWidth: null,
            minHeight: null,
            webPreferences: {
                nodeIntegration: null,
                contextIsolation: null,
                webSecurity: null,
                allowRunningInsecureContent: null,
            },
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
                '[Snapshot] Desktop governance policy version must remain 2.',
                '[Snapshot] Renderer trust policy drifted from the audited snapshot.',
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
