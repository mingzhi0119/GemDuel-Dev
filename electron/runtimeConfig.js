export const normalizeIceServer = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }

    const { urls, username, credential } = value;
    const urlsAreValid =
        typeof urls === 'string' ||
        (Array.isArray(urls) && urls.every((entry) => typeof entry === 'string'));

    if (!urlsAreValid) {
        return null;
    }

    if (username !== undefined && typeof username !== 'string') {
        return null;
    }

    if (credential !== undefined && typeof credential !== 'string') {
        return null;
    }

    return { urls, username, credential };
};

const VALID_LOG_LEVELS = new Set(['error', 'warn', 'info', 'verbose', 'debug', 'silly']);

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
