import { z } from 'zod';
import { collectIceServerPolicyViolations } from '@gemduel/shared/runtimeIcePolicy.js';
import {
    RUNTIME_CONFIG_POLICY,
    TURN_CREDENTIAL_BUNDLE_POLICY_VERSION,
    TURN_CREDENTIAL_SERVICE_FALLBACK_MODES,
    TURN_CREDENTIAL_SERVICE_POLICY_VERSION,
    VALID_LOG_LEVELS,
    VALID_LOG_LEVELS_LIST,
} from '@gemduel/shared/runtimeConfigPolicy.js';
export { RUNTIME_CONFIG_POLICY } from '@gemduel/shared/runtimeConfigPolicy.js';

const ISO_TIMESTAMP_SCHEMA = z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Expected an ISO timestamp.');

export const RUNTIME_ICE_SERVER_SCHEMA = z
    .object({
        urls: z.union([z.string(), z.array(z.string())]),
        username: z.string().optional(),
        credential: z.string().optional(),
    })
    .passthrough()
    .superRefine((value, ctx) => {
        for (const violation of collectIceServerPolicyViolations(value)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: violation,
            });
        }
    });

export const RUNTIME_ICE_SERVER_LIST_SCHEMA = z.array(RUNTIME_ICE_SERVER_SCHEMA);

export const TURN_CREDENTIAL_BUNDLE_SCHEMA = z
    .object({
        policyVersion: z.literal(TURN_CREDENTIAL_BUNDLE_POLICY_VERSION),
        iceServers: RUNTIME_ICE_SERVER_LIST_SCHEMA.nonempty(),
        issuedAt: ISO_TIMESTAMP_SCHEMA,
        expiresAt: ISO_TIMESTAMP_SCHEMA,
    })
    .passthrough();

export const TURN_CREDENTIAL_LEASE_SCHEMA = z
    .object({
        policyVersion: z.literal(TURN_CREDENTIAL_SERVICE_POLICY_VERSION),
        leaseId: z.string().min(1),
        bundle: TURN_CREDENTIAL_BUNDLE_SCHEMA,
        refreshAfterAt: ISO_TIMESTAMP_SCHEMA,
    })
    .passthrough();

export const TURN_CREDENTIAL_REVOKE_RESULT_SCHEMA = z
    .object({
        policyVersion: z.literal(TURN_CREDENTIAL_SERVICE_POLICY_VERSION),
        leaseId: z.string().min(1),
        revoked: z.literal(true),
        revokedAt: ISO_TIMESTAMP_SCHEMA,
    })
    .passthrough();

export const buildRuntimeRelayProfile = ({
    source,
    iceServers,
    issuedAt = null,
    expiresAt = null,
}) => ({
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
        `[CONFIG] GEMDUEL_LOG_LEVEL must be one of ${VALID_LOG_LEVELS_LIST.join(', ')}. Falling back to ${fallbackLevel}.`
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
            .map((server) => {
                const result = RUNTIME_ICE_SERVER_SCHEMA.safeParse(server);
                return result.success ? normalizeIceServer(result.data) : null;
            })
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

const LOOPBACK_TURN_SERVICE_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

const isLoopbackTurnServiceHost = (hostname) =>
    LOOPBACK_TURN_SERVICE_HOSTS.has(hostname.toLowerCase());

export const getTurnCredentialServiceConfig = ({
    serviceUrlEnv,
    serviceTokenEnv,
    fallbackModeEnv,
    logger = console,
}) => {
    const fallbackMode = TURN_CREDENTIAL_SERVICE_FALLBACK_MODES.includes(fallbackModeEnv)
        ? fallbackModeEnv
        : 'allow-runtime-ice';

    if (fallbackModeEnv && !TURN_CREDENTIAL_SERVICE_FALLBACK_MODES.includes(fallbackModeEnv)) {
        logger.warn?.(
            `[RTC] GEMDUEL_TURN_SERVICE_FALLBACK_MODE must be one of ${TURN_CREDENTIAL_SERVICE_FALLBACK_MODES.join(', ')}. Falling back to allow-runtime-ice.`
        );
    }

    if (!serviceUrlEnv || !serviceTokenEnv) {
        return {
            enabled: false,
            serviceUrl: null,
            serviceToken: null,
            fallbackMode,
        };
    }

    try {
        const url = new URL(serviceUrlEnv);
        if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('unsupported-protocol');
        }

        if (url.protocol === 'http:' && !isLoopbackTurnServiceHost(url.hostname)) {
            throw new Error('insecure-non-loopback-http');
        }

        return {
            enabled: true,
            serviceUrl: url.toString().replace(/\/+$/, ''),
            serviceToken: serviceTokenEnv,
            fallbackMode,
        };
    } catch (error) {
        logger.warn?.(
            '[RTC] GEMDUEL_TURN_SERVICE_URL must be an absolute HTTPS URL, except HTTP is allowed for loopback development hosts. Falling back to governed runtime relay sources.',
            error
        );

        return {
            enabled: false,
            serviceUrl: null,
            serviceToken: null,
            fallbackMode,
        };
    }
};

export const getRuntimeRelayProfileFromEnv = (
    bundleConfig,
    rawIceConfig,
    logger = console,
    now = () => Date.now()
) => {
    if (bundleConfig) {
        try {
            const parsed = JSON.parse(bundleConfig);
            const bundle = TURN_CREDENTIAL_BUNDLE_SCHEMA.safeParse(parsed);

            if (!bundle.success) {
                logger.warn?.(
                    '[RTC] GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON did not satisfy the governed TURN bundle contract. Falling back to the next relay source.'
                );
            } else if (Date.parse(bundle.data.expiresAt) <= now()) {
                logger.warn?.(
                    '[RTC] GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON is already expired. Falling back to the next relay source.'
                );
            } else {
                return buildRuntimeRelayProfile({
                    source: 'ephemeral-turn-bundle',
                    iceServers: bundle.data.iceServers.map((server) => normalizeIceServer(server)),
                    issuedAt: bundle.data.issuedAt,
                    expiresAt: bundle.data.expiresAt,
                });
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
