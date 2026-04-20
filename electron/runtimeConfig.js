import {
    ALLOWED_ICE_URL_PROTOCOLS,
    collectIceServerPolicyViolations,
} from '../shared/runtimeIcePolicy.js';

const VALID_LOG_LEVELS = new Set(['error', 'warn', 'info', 'verbose', 'debug', 'silly']);
const TURN_CREDENTIAL_BUNDLE_POLICY_VERSION = 1;

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
    GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON: {
        owner: 'Networking',
        defaultValue: 'unset',
        validation:
            'JSON object with policyVersion, iceServers, issuedAt, and expiresAt. Credential-bearing servers must satisfy the governed ICE policy and expiresAt must be a future ISO timestamp.',
        secretHandling:
            'Treat ephemeral TURN bundles as sensitive runtime material. Do not commit them to source control, logs, or packaged client assets.',
        failureMode:
            'Falls back to GEMDUEL_ICE_SERVERS_JSON and then the built-in STUN baseline if the ephemeral bundle is missing, expired, or invalid.',
    },
    GITHUB_REPOSITORY: {
        owner: 'Release Engineering',
        defaultValue: 'unset',
        validation: 'GitHub Actions string metadata or unset outside CI.',
        secretHandling: 'CI provenance metadata only. Never store secrets here.',
        failureMode: 'Artifact provenance repository field falls back to null.',
    },
    GITHUB_SHA: {
        owner: 'Release Engineering',
        defaultValue: 'unset',
        validation: 'GitHub Actions commit SHA string or unset outside CI.',
        secretHandling: 'CI provenance metadata only. Never store secrets here.',
        failureMode: 'Artifact provenance sha field falls back to null.',
    },
    GITHUB_REF: {
        owner: 'Release Engineering',
        defaultValue: 'unset',
        validation: 'GitHub Actions ref string or unset outside CI.',
        secretHandling: 'CI provenance metadata only. Never store secrets here.',
        failureMode: 'Artifact provenance ref field falls back to null.',
    },
    GITHUB_WORKFLOW: {
        owner: 'Release Engineering',
        defaultValue: 'unset',
        validation: 'GitHub Actions workflow name or unset outside CI.',
        secretHandling: 'CI provenance metadata only. Never store secrets here.',
        failureMode: 'Artifact provenance workflow field falls back to null.',
    },
    GITHUB_RUN_ID: {
        owner: 'Release Engineering',
        defaultValue: 'unset',
        validation: 'GitHub Actions numeric run identifier string or unset outside CI.',
        secretHandling: 'CI provenance metadata only. Never store secrets here.',
        failureMode: 'Artifact provenance runId field falls back to null.',
    },
    GITHUB_RUN_ATTEMPT: {
        owner: 'Release Engineering',
        defaultValue: 'unset',
        validation: 'GitHub Actions numeric run attempt string or unset outside CI.',
        secretHandling: 'CI provenance metadata only. Never store secrets here.',
        failureMode: 'Artifact provenance runAttempt field falls back to null.',
    },
    GITHUB_JOB: {
        owner: 'Release Engineering',
        defaultValue: 'unset',
        validation: 'GitHub Actions job name or unset outside CI.',
        secretHandling: 'CI provenance metadata only. Never store secrets here.',
        failureMode: 'Artifact provenance jobName field falls back to null.',
    },
});

const isIsoTimestamp = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value));

const buildRuntimeRelayProfile = ({ source, iceServers, issuedAt = null, expiresAt = null }) => ({
    policyVersion: TURN_CREDENTIAL_BUNDLE_POLICY_VERSION,
    source,
    iceServers,
    issuedAt,
    expiresAt,
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

const parseRuntimeIceServersFromEnv = (rawConfig, logger = console) => {
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

export const getRuntimeIceServersFromEnv = (rawConfig, logger = console) =>
    parseRuntimeIceServersFromEnv(rawConfig, logger);

export const getRuntimeRelayProfileFromEnv = (
    bundleConfig,
    rawIceConfig,
    logger = console,
    now = () => Date.now()
) => {
    if (bundleConfig) {
        try {
            const parsed = JSON.parse(bundleConfig);
            if (
                typeof parsed !== 'object' ||
                parsed === null ||
                Array.isArray(parsed) ||
                !Array.isArray(parsed.iceServers)
            ) {
                logger.warn?.(
                    '[RTC] GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON must be an object with an iceServers array. Falling back to the next relay source.'
                );
            } else if (
                parsed.policyVersion !== TURN_CREDENTIAL_BUNDLE_POLICY_VERSION ||
                !isIsoTimestamp(parsed.issuedAt) ||
                !isIsoTimestamp(parsed.expiresAt)
            ) {
                logger.warn?.(
                    '[RTC] GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON did not satisfy the governed TURN bundle contract. Falling back to the next relay source.'
                );
            } else if (Date.parse(parsed.expiresAt) <= now()) {
                logger.warn?.(
                    '[RTC] GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON is already expired. Falling back to the next relay source.'
                );
            } else {
                const iceServers = parsed.iceServers
                    .map((server) => normalizeIceServer(server))
                    .filter((server) => server !== null);

                if (iceServers.length === parsed.iceServers.length && iceServers.length > 0) {
                    return buildRuntimeRelayProfile({
                        source: 'ephemeral-turn-bundle',
                        iceServers,
                        issuedAt: parsed.issuedAt,
                        expiresAt: parsed.expiresAt,
                    });
                }

                logger.warn?.(
                    '[RTC] GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON contained invalid ICE server entries. Falling back to the next relay source.'
                );
            }
        } catch (error) {
            logger.warn?.(
                '[RTC] Failed to parse GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON. Falling back to the next relay source.',
                error
            );
        }
    }

    const fallbackIceServers = parseRuntimeIceServersFromEnv(rawIceConfig, logger);
    if (fallbackIceServers.length > 0) {
        return buildRuntimeRelayProfile({
            source: 'runtime-ice-fallback',
            iceServers: fallbackIceServers,
        });
    }

    return buildRuntimeRelayProfile({
        source: 'default-stun',
        iceServers: [],
    });
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
