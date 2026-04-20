import { z } from 'zod';
import preloadContract from './preloadContract.cjs';
import { RELEASE_HEALTH_EVENT_SCHEMA } from './releaseHealth.js';

const { ELECTRON_BRIDGE_API_KEYS, IPC_INVOKE_CHANNELS, IPC_SEND_CHANNELS, UPDATE_CHANNELS } =
    preloadContract;
export const DESKTOP_GOVERNANCE_POLICY_VERSION = 1;

const MAIN_WINDOW_WEB_PREFERENCES_SCHEMA = z.object({
    nodeIntegration: z.literal(false),
    contextIsolation: z.literal(true),
    webSecurity: z.literal(true),
    allowRunningInsecureContent: z.literal(false),
    preload: z.string().min(1),
});

const NO_ARGS_SCHEMA = z.tuple([]);
const RELEASE_HEALTH_EVENT_TUPLE_SCHEMA = z.tuple([RELEASE_HEALTH_EVENT_SCHEMA]);
const IPC_ARG_SCHEMAS = new Map([
    [IPC_INVOKE_CHANNELS.getAppVersion, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.getRuntimeIceServers, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.getRuntimeRelayProfile, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.refreshRuntimeRelayProfile, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.revokeRuntimeRelayProfile, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.getReleaseHealthSnapshot, NO_ARGS_SCHEMA],
    [IPC_SEND_CHANNELS.restartApp, NO_ARGS_SCHEMA],
    [IPC_SEND_CHANNELS.reportReleaseHealth, RELEASE_HEALTH_EVENT_TUPLE_SCHEMA],
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
    const schema = IPC_ARG_SCHEMAS.get(channel);

    if (!schema) {
        return {
            ok: false,
            reason: `Unknown IPC channel ${channel}.`,
        };
    }

    const parsed = schema.safeParse(args);
    if (!parsed.success) {
        return {
            ok: false,
            reason:
                channel === IPC_SEND_CHANNELS.reportReleaseHealth
                    ? 'Release-health payload did not match the allowlisted schema.'
                    : 'This channel does not accept payload arguments.',
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

export const buildDesktopGovernanceSnapshot = ({ windowOptions, bridgeApiKeys }) => ({
    policyVersion: DESKTOP_GOVERNANCE_POLICY_VERSION,
    mainWindow: {
        autoHideMenuBar: windowOptions?.autoHideMenuBar ?? null,
        webPreferences: {
            nodeIntegration: windowOptions?.webPreferences?.nodeIntegration ?? null,
            contextIsolation: windowOptions?.webPreferences?.contextIsolation ?? null,
            webSecurity: windowOptions?.webPreferences?.webSecurity ?? null,
            allowRunningInsecureContent:
                windowOptions?.webPreferences?.allowRunningInsecureContent ?? null,
        },
    },
    bridgeApiKeys: [...bridgeApiKeys].sort(),
    allowlistedChannels: getAllowlistedChannelNames(),
});

export const collectSnapshotDriftIssues = (expectedSnapshot, actualSnapshot) => {
    const issues = [];

    if (
        expectedSnapshot?.policyVersion !== DESKTOP_GOVERNANCE_POLICY_VERSION ||
        actualSnapshot.policyVersion !== DESKTOP_GOVERNANCE_POLICY_VERSION
    ) {
        issues.push(
            `[Snapshot] Desktop governance policy version must remain ${DESKTOP_GOVERNANCE_POLICY_VERSION}.`
        );
    }

    if (
        JSON.stringify(expectedSnapshot?.mainWindow) !== JSON.stringify(actualSnapshot.mainWindow)
    ) {
        issues.push('[Snapshot] BrowserWindow governance snapshot drifted.');
    }

    if (
        JSON.stringify(expectedSnapshot?.bridgeApiKeys) !==
        JSON.stringify(actualSnapshot.bridgeApiKeys)
    ) {
        issues.push('[Snapshot] Bridge API surface drifted from the audited snapshot.');
    }

    if (
        JSON.stringify(expectedSnapshot?.allowlistedChannels) !==
        JSON.stringify(actualSnapshot.allowlistedChannels)
    ) {
        issues.push('[Snapshot] IPC allowlist drifted from the audited snapshot.');
    }

    return issues;
};

export const collectDesktopGovernanceErrors = ({
    windowOptions,
    bridgeApiKeys,
    allowlistDocumentText,
    expectedSnapshot,
}) => {
    const issues = [...validateMainWindowOptions(windowOptions)];
    const snapshot = buildDesktopGovernanceSnapshot({
        windowOptions,
        bridgeApiKeys,
    });

    if (JSON.stringify(snapshot.bridgeApiKeys) !== JSON.stringify([...ELECTRON_BRIDGE_API_KEYS])) {
        issues.push(
            `[Preload] Bridge API surface drifted. Expected ${ELECTRON_BRIDGE_API_KEYS.join(', ')} but received ${snapshot.bridgeApiKeys.join(', ')}.`
        );
    }

    for (const channel of snapshot.allowlistedChannels) {
        if (!allowlistDocumentText.includes(`\`${channel}\``)) {
            issues.push(`[Allowlist Doc] Missing documented channel ${channel}.`);
        }
    }

    if (expectedSnapshot) {
        issues.push(...collectSnapshotDriftIssues(expectedSnapshot, snapshot));
    }

    return issues;
};
