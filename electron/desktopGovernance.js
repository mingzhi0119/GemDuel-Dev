import { z } from 'zod';
import preloadContract from './preloadContract.cjs';

const { ELECTRON_BRIDGE_API_KEYS, IPC_INVOKE_CHANNELS, IPC_SEND_CHANNELS, UPDATE_CHANNELS } =
    preloadContract;

const MAIN_WINDOW_WEB_PREFERENCES_SCHEMA = z.object({
    nodeIntegration: z.literal(false),
    contextIsolation: z.literal(true),
    webSecurity: z.literal(true),
    allowRunningInsecureContent: z.literal(false),
    preload: z.string().min(1),
});

const NO_ARGS_SCHEMA = z.tuple([]);

const NO_ARG_CHANNELS = new Set([
    ...Object.values(IPC_INVOKE_CHANNELS),
    ...Object.values(IPC_SEND_CHANNELS),
]);

export const createMainWindowOptions = ({ preloadPath, appVersion }) => ({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
        preload: preloadPath,
    },
    title: `GemDuel v${appVersion}`,
    backgroundColor: '#020617',
});

export const validateMainWindowOptions = (options) => {
    const issues = [];

    const parsed = MAIN_WINDOW_WEB_PREFERENCES_SCHEMA.safeParse(options?.webPreferences);
    if (!parsed.success) {
        issues.push(
            ...parsed.error.issues.map(
                (issue) =>
                    `[BrowserWindow] ${issue.path.join('.') || 'webPreferences'}: ${issue.message}`
            )
        );
    }

    if (options?.autoHideMenuBar !== true) {
        issues.push('[BrowserWindow] autoHideMenuBar must stay enabled.');
    }

    return issues;
};

export const validateIpcArgs = (channel, args) => {
    if (!NO_ARG_CHANNELS.has(channel)) {
        return {
            ok: false,
            reason: `Unknown IPC channel ${channel}.`,
        };
    }

    const parsed = NO_ARGS_SCHEMA.safeParse(args);
    if (!parsed.success) {
        return {
            ok: false,
            reason: 'This channel does not accept payload arguments.',
        };
    }

    return {
        ok: true,
        args: parsed.data,
    };
};

export const isAllowedRendererUrl = (url, isDev) =>
    typeof url === 'string' &&
    (isDev ? url.startsWith('http://localhost:5173') : url.startsWith('file://'));

export const authorizeIpcSender = ({ senderId, senderUrl, mainWindowId, isDev }) => {
    if (!mainWindowId) {
        return { ok: false, reason: 'No trusted main window is registered.' };
    }

    if (senderId !== mainWindowId) {
        return { ok: false, reason: 'Unexpected renderer sender.' };
    }

    if (!isAllowedRendererUrl(senderUrl, isDev)) {
        return { ok: false, reason: 'Untrusted renderer origin.' };
    }

    return { ok: true };
};

export const getAllowlistedChannelNames = () =>
    [
        ...Object.values(IPC_INVOKE_CHANNELS),
        ...Object.values(IPC_SEND_CHANNELS),
        ...Object.values(UPDATE_CHANNELS),
    ].sort();

export const collectDesktopGovernanceErrors = ({
    windowOptions,
    bridgeApiKeys,
    allowlistDocumentText,
}) => {
    const issues = [...validateMainWindowOptions(windowOptions)];
    const sortedBridgeKeys = [...bridgeApiKeys].sort();

    if (JSON.stringify(sortedBridgeKeys) !== JSON.stringify([...ELECTRON_BRIDGE_API_KEYS])) {
        issues.push(
            `[Preload] Bridge API surface drifted. Expected ${ELECTRON_BRIDGE_API_KEYS.join(', ')} but received ${sortedBridgeKeys.join(', ')}.`
        );
    }

    for (const channel of getAllowlistedChannelNames()) {
        if (!allowlistDocumentText.includes(`\`${channel}\``)) {
            issues.push(`[Allowlist Doc] Missing documented channel ${channel}.`);
        }
    }

    return issues;
};
