import { z } from 'zod';
import {
    ALLOWED_ICE_URL_PROTOCOLS,
    collectIceServerPolicyViolations,
} from '../shared/runtimeIcePolicy.js';

const VALID_LOG_LEVELS_LIST = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
const VALID_LOG_LEVELS = new Set(VALID_LOG_LEVELS_LIST);
const TURN_CREDENTIAL_BUNDLE_POLICY_VERSION = 1;
const TURN_CREDENTIAL_SERVICE_POLICY_VERSION = 1;
const TURN_CREDENTIAL_SERVICE_FALLBACK_MODES = ['allow-runtime-ice', 'deny-runtime-ice'];

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
        validation: `One of ${VALID_LOG_LEVELS_LIST.join(', ')}.`,
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
    GEMDUEL_TURN_SERVICE_URL: {
        owner: 'Networking',
        defaultValue: 'unset',
        validation: 'Absolute http/https URL for the short-lived TURN credential service.',
        secretHandling:
            'Service endpoint metadata only. Keep bearer tokens separate and never emit the resolved URL in release-health payloads.',
        failureMode:
            'Disables online TURN credential fetch and falls back to governed runtime relay sources.',
    },
    GEMDUEL_TURN_SERVICE_TOKEN: {
        owner: 'Networking',
        defaultValue: 'unset',
        validation:
            'Opaque bearer token used by the desktop runtime to authenticate before TURN credentials are issued.',
        secretHandling:
            'Treat as a secret. Do not commit, log, or expose this token to the renderer.',
        failureMode:
            'Disables online TURN credential fetch and falls back to governed runtime relay sources unless fallback deny is enabled.',
    },
    GEMDUEL_TURN_SERVICE_FALLBACK_MODE: {
        owner: 'Networking',
        defaultValue: 'allow-runtime-ice',
        validation: `One of ${TURN_CREDENTIAL_SERVICE_FALLBACK_MODES.join(', ')}.`,
        secretHandling: 'Operational policy only. Never store credentials here.',
        failureMode: 'Falls back to allow-runtime-ice if the policy value is missing or malformed.',
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

        return {
            enabled: true,
            serviceUrl: url.toString().replace(/\/+$/, ''),
            serviceToken: serviceTokenEnv,
            fallbackMode,
        };
    } catch (error) {
        logger.warn?.(
            '[RTC] GEMDUEL_TURN_SERVICE_URL must be an absolute http/https URL. Falling back to governed runtime relay sources.',
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
