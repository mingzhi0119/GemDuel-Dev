import { z } from 'zod';
import preloadContract from './preloadContract.cjs';
import { RELEASE_HEALTH_EVENT_SCHEMA } from './releaseHealth.js';
import { buildRendererTrustPolicySnapshot, isAllowedRendererUrl } from './rendererTrustPolicy.js';

const { ELECTRON_BRIDGE_API_KEYS, IPC_INVOKE_CHANNELS, IPC_SEND_CHANNELS, UPDATE_CHANNELS } =
    preloadContract;
export const DESKTOP_GOVERNANCE_POLICY_VERSION = 2;
export const DEFAULT_DESKTOP_ASPECT_RATIO = '16:9';
export { buildRendererTrustPolicySnapshot, isAllowedRendererUrl } from './rendererTrustPolicy.js';
export const DESKTOP_ASPECT_RATIO_OPTIONS = Object.freeze({
    '16:9': Object.freeze({
        ratio: '16:9',
        width: 1280,
        height: 720,
        aspectRatio: 16 / 9,
    }),
});

const MAIN_WINDOW_WEB_PREFERENCES_SCHEMA = z.object({
    nodeIntegration: z.literal(false),
    contextIsolation: z.literal(true),
    webSecurity: z.literal(true),
    allowRunningInsecureContent: z.literal(false),
    preload: z.string().min(1),
});

const NO_ARGS_SCHEMA = z.tuple([]);
const DESKTOP_ASPECT_RATIO_SCHEMA = z.literal('16:9');
const DESKTOP_ASPECT_RATIO_TUPLE_SCHEMA = z.tuple([
    z.object({
        ratio: DESKTOP_ASPECT_RATIO_SCHEMA,
    }),
]);
const RELEASE_HEALTH_EVENT_TUPLE_SCHEMA = z.tuple([RELEASE_HEALTH_EVENT_SCHEMA]);
const LAN_PREGAME_MODE_SCHEMA = z.enum(['classic', 'roguelike']);
const LAN_ROOM_ID_SCHEMA = z.string().min(1);
const LAN_MODE_SELECTION_TUPLE_SCHEMA = z.tuple([
    z.object({
        roomId: LAN_ROOM_ID_SCHEMA,
        mode: LAN_PREGAME_MODE_SCHEMA,
    }),
]);
const LAN_START_TUPLE_SCHEMA = z.tuple([
    z.object({
        roomId: LAN_ROOM_ID_SCHEMA,
    }),
]);
const SAFE_REPLAY_FILE_NAME_SCHEMA = z
    .string()
    .min(1)
    .max(128)
    .regex(/^[A-Za-z0-9._-]+\.json$/);
const SAVE_REPLAY_TO_FOLDER_TUPLE_SCHEMA = z.tuple([
    z.object({
        fileName: SAFE_REPLAY_FILE_NAME_SCHEMA,
        contents: z
            .string()
            .min(2)
            .max(512 * 1024),
    }),
]);
const LAN_PEER_READY_TUPLE_SCHEMA = z.tuple([
    z.object({
        roomId: LAN_ROOM_ID_SCHEMA,
        peerId: z.string().min(1),
    }),
]);
const IPC_ARG_SCHEMAS = new Map([
    [IPC_INVOKE_CHANNELS.getAppVersion, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.getRuntimeIceServers, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.getRuntimeRelayProfile, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.refreshRuntimeRelayProfile, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.revokeRuntimeRelayProfile, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.getReleaseHealthSnapshot, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.getLanMatchmakingState, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.saveReplayToFolder, SAVE_REPLAY_TO_FOLDER_TUPLE_SCHEMA],
    [IPC_INVOKE_CHANNELS.startLanMatchmaking, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.cancelLanMatchmaking, NO_ARGS_SCHEMA],
    [IPC_INVOKE_CHANNELS.setDesktopAspectRatio, DESKTOP_ASPECT_RATIO_TUPLE_SCHEMA],
    [IPC_INVOKE_CHANNELS.selectLanPregameMode, LAN_MODE_SELECTION_TUPLE_SCHEMA],
    [IPC_INVOKE_CHANNELS.confirmLanPregameStart, LAN_START_TUPLE_SCHEMA],
    [IPC_SEND_CHANNELS.restartApp, NO_ARGS_SCHEMA],
    [IPC_SEND_CHANNELS.reportReleaseHealth, RELEASE_HEALTH_EVENT_TUPLE_SCHEMA],
    [IPC_SEND_CHANNELS.reportLanPeerReady, LAN_PEER_READY_TUPLE_SCHEMA],
]);

export const createMainWindowOptions = ({ preloadPath, appVersion }) => ({
    width: DESKTOP_ASPECT_RATIO_OPTIONS[DEFAULT_DESKTOP_ASPECT_RATIO].width,
    height: DESKTOP_ASPECT_RATIO_OPTIONS[DEFAULT_DESKTOP_ASPECT_RATIO].height,
    minWidth: DESKTOP_ASPECT_RATIO_OPTIONS[DEFAULT_DESKTOP_ASPECT_RATIO].width,
    minHeight: DESKTOP_ASPECT_RATIO_OPTIONS[DEFAULT_DESKTOP_ASPECT_RATIO].height,
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

export const getDesktopAspectRatioConfig = (ratio) => {
    const parsed = DESKTOP_ASPECT_RATIO_SCHEMA.safeParse(ratio);

    if (!parsed.success) {
        throw new Error('Desktop aspect ratio must be 16:9.');
    }

    return DESKTOP_ASPECT_RATIO_OPTIONS[parsed.data];
};

export const applyDesktopAspectRatioToWindow = (window, ratio) => {
    const config = getDesktopAspectRatioConfig(ratio);
    const bounds =
        typeof window?.getBounds === 'function'
            ? window.getBounds()
            : { width: config.width, height: config.height };
    const targetWidth = Math.max(config.width, Number(bounds?.width) || config.width);
    const targetHeight = Math.round(targetWidth / config.aspectRatio);

    window?.setMinimumSize?.(config.width, config.height);
    window?.setAspectRatio?.(config.aspectRatio);
    window?.setSize?.(targetWidth, targetHeight);

    return {
        ratio: config.ratio,
        width: targetWidth,
        height: targetHeight,
        aspectRatio: config.aspectRatio,
    };
};

export const validateMainWindowOptions = (options) => {
    const issues = [];
    const defaultAspectConfig = DESKTOP_ASPECT_RATIO_OPTIONS[DEFAULT_DESKTOP_ASPECT_RATIO];

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

    if (
        options?.width !== defaultAspectConfig.width ||
        options?.height !== defaultAspectConfig.height
    ) {
        issues.push('[BrowserWindow] default size must stay locked to 16:9 at 1280x720.');
    }

    if (
        options?.minWidth !== defaultAspectConfig.width ||
        options?.minHeight !== defaultAspectConfig.height
    ) {
        issues.push('[BrowserWindow] default minimum size must stay locked to 16:9 at 1280x720.');
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
                    : channel === IPC_INVOKE_CHANNELS.saveReplayToFolder
                      ? 'Replay export payload did not match the allowlisted schema.'
                      : channel === IPC_INVOKE_CHANNELS.setDesktopAspectRatio
                        ? 'Desktop aspect ratio payload did not match the allowlisted schema.'
                        : 'This channel does not accept payload arguments.',
        };
    }

    return {
        ok: true,
        args: parsed.data,
    };
};

export const authorizeIpcSender = ({
    senderId,
    senderUrl,
    mainWindowId,
    isDev,
    rendererTrust = undefined,
}) => {
    if (!mainWindowId) {
        return { ok: false, reason: 'No trusted main window is registered.' };
    }

    if (senderId !== mainWindowId) {
        return { ok: false, reason: 'Unexpected renderer sender.' };
    }

    if (!isAllowedRendererUrl(senderUrl, isDev, rendererTrust)) {
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
    rendererTrust: buildRendererTrustPolicySnapshot(),
    mainWindow: {
        autoHideMenuBar: windowOptions?.autoHideMenuBar ?? null,
        width: windowOptions?.width ?? null,
        height: windowOptions?.height ?? null,
        minWidth: windowOptions?.minWidth ?? null,
        minHeight: windowOptions?.minHeight ?? null,
        defaultAspectRatio: DEFAULT_DESKTOP_ASPECT_RATIO,
        supportedAspectRatios: Object.values(DESKTOP_ASPECT_RATIO_OPTIONS).map((option) => ({
            ratio: option.ratio,
            width: option.width,
            height: option.height,
            aspectRatio: option.aspectRatio,
        })),
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
        JSON.stringify(expectedSnapshot?.rendererTrust) !==
        JSON.stringify(actualSnapshot.rendererTrust)
    ) {
        issues.push('[Snapshot] Renderer trust policy drifted from the audited snapshot.');
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
