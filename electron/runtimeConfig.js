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

export const getAutoUpdaterPolicy = ({ disableUpdatesEnv, allowPrereleaseEnv, appVersion }) => ({
    enabled: disableUpdatesEnv !== 'true',
    autoDownload: true,
    allowPrerelease: allowPrereleaseEnv === 'true' || appVersion.includes('-'),
});
