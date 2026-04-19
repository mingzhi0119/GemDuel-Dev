import {
    ALLOWED_ICE_URL_PROTOCOLS,
    collectIceServerPolicyViolations,
} from '../shared/runtimeIcePolicy.js';

const VALID_LOG_LEVELS = new Set(['error', 'warn', 'info', 'verbose', 'debug', 'silly']);

export const RUNTIME_CONFIG_POLICY = Object.freeze({
    GEMDUEL_DISABLE_UPDATES: {
        owner: 'Desktop Platform',
        defaultValue: 'false',
        validation: 'Boolean string: "true" or "false".',
        secretHandling: 'Operational flag only. Never store secrets here.',
        failureMode: 'Falls back to false and keeps auto-updates enabled.',
    },
    GEMDUEL_ALLOW_PRERELEASE: {
        owner: 'Release Engineering',
        defaultValue: 'false',
        validation: 'Boolean string: "true" or "false".',
        secretHandling: 'Operational flag only. Never store secrets here.',
        failureMode: 'Falls back to false unless the app version is already a prerelease.',
    },
    GEMDUEL_LOG_LEVEL: {
        owner: 'Desktop Platform',
        defaultValue: 'info',
        validation: `One of ${Array.from(VALID_LOG_LEVELS).join(', ')}.`,
        secretHandling: 'Operational flag only. Never store secrets here.',
        failureMode: 'Falls back to the release default log level.',
    },
    GEMDUEL_ICE_SERVERS_JSON: {
        owner: 'Networking',
        defaultValue: '[]',
        validation: `JSON array of ICE server objects using ${ALLOWED_ICE_URL_PROTOCOLS.join(', ')} URL schemes. TURN credentials must be injected at runtime and include both username and credential.`,
        secretHandling:
            'Treat TURN credentials as sensitive runtime material. Do not commit them to source control, logs, or packaged client assets.',
        failureMode:
            'Falls back to the built-in STUN-only baseline if parsing or validation fails.',
    },
});

export const normalizeIceServer = (value) => {
    const violations = collectIceServerPolicyViolations(value);

    if (violations.length > 0) {
        return null;
    }

    const { urls, username, credential } = value;
    return { urls, username, credential };
};

export const normalizeBooleanEnv = ({
    envName,
    rawValue,
    defaultValue = false,
    logger = console,
}) => {
    if (rawValue === undefined || rawValue === null || rawValue === '') {
        return defaultValue;
    }

    if (rawValue === 'true') {
        return true;
    }

    if (rawValue === 'false') {
        return false;
    }

    logger.warn?.(
        `[CONFIG] ${envName} must be "true" or "false". Falling back to ${String(defaultValue)}.`
    );
    return defaultValue;
};

export const getRuntimeLogLevel = ({ rawLevel, fallbackLevel, logger = console }) => {
    if (!rawLevel) {
        return fallbackLevel;
    }

    if (VALID_LOG_LEVELS.has(rawLevel)) {
        return rawLevel;
    }

    logger.warn?.(
        `[CONFIG] GEMDUEL_LOG_LEVEL must be one of ${Array.from(VALID_LOG_LEVELS).join(', ')}. Falling back to ${fallbackLevel}.`
    );
    return fallbackLevel;
};

export const getRuntimeIceServersFromEnv = (rawConfig, logger = console) => {
    if (!rawConfig) {
        return [];
    }

    try {
        const parsed = JSON.parse(rawConfig);
        if (!Array.isArray(parsed)) {
            logger.warn?.(
                '[RTC] GEMDUEL_ICE_SERVERS_JSON must be a JSON array. Falling back to STUN.'
            );
            return [];
        }

        const servers = parsed
            .map((server) => normalizeIceServer(server))
            .filter((server) => server !== null);

        if (servers.length !== parsed.length) {
            logger.warn?.('[RTC] Ignored one or more invalid runtime ICE server entries.');
        }

        return servers;
    } catch (error) {
        logger.warn?.(
            '[RTC] Failed to parse GEMDUEL_ICE_SERVERS_JSON. Falling back to STUN.',
            error
        );
        return [];
    }
};

export const getAutoUpdaterPolicy = ({
    disableUpdatesEnv,
    allowPrereleaseEnv,
    appVersion,
    logger = console,
}) => ({
    enabled: !normalizeBooleanEnv({
        envName: 'GEMDUEL_DISABLE_UPDATES',
        rawValue: disableUpdatesEnv,
        defaultValue: false,
        logger,
    }),
    autoDownload: true,
    allowPrerelease:
        normalizeBooleanEnv({
            envName: 'GEMDUEL_ALLOW_PRERELEASE',
            rawValue: allowPrereleaseEnv,
            defaultValue: false,
            logger,
        }) || appVersion.includes('-'),
});
