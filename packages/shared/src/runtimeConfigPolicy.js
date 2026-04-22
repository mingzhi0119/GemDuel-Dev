import { ALLOWED_ICE_URL_PROTOCOLS } from './runtimeIcePolicy.js';

export const VALID_LOG_LEVELS_LIST = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
export const VALID_LOG_LEVELS = new Set(VALID_LOG_LEVELS_LIST);
export const TURN_CREDENTIAL_BUNDLE_POLICY_VERSION = 1;
export const TURN_CREDENTIAL_SERVICE_POLICY_VERSION = 1;
export const TURN_CREDENTIAL_SERVICE_FALLBACK_MODES = ['allow-runtime-ice', 'deny-runtime-ice'];

export const RUNTIME_CONFIG_POLICY = Object.freeze({
    GEMDUEL_DISABLE_UPDATES: {
        owner: 'Desktop Platform',
        defaultValue: 'false',
        validation: 'Boolean string: "true" or "false".',
        secretHandling: 'Operational flag only. Never store secrets here.',
        failureMode: 'Falls back to false and keeps auto-updates enabled.',
    },
    GEMDUEL_DEV_SERVER_URL: {
        owner: 'Desktop Platform',
        defaultValue: 'http://localhost:5173',
        validation:
            'Absolute http/https URL for the trusted development renderer origin, including optional query parameters.',
        secretHandling: 'Development-only endpoint metadata. Never store secrets here.',
        failureMode: 'Falls back to http://localhost:5173 when the dev renderer URL is absent.',
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
    GEMDUEL_PEER_SERVER_PORT: {
        owner: 'Networking',
        defaultValue: '9000',
        validation:
            'Integer TCP port from 1 to 65535. The desktop runtime may probe the next available local port when the preferred port is occupied.',
        secretHandling: 'Operational local-network setting only. Never store secrets here.',
        failureMode: 'Falls back to the governed default port probe window that starts at 9000.',
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
    GEMDUEL_USER_DATA_SUFFIX: {
        owner: 'Desktop Platform',
        defaultValue: 'unset',
        validation:
            'Optional non-empty filesystem-safe suffix used to isolate the desktop userData directory for local dev or verification sessions.',
        secretHandling: 'Operational local profile routing only. Never store secrets here.',
        failureMode: 'Falls back to the default Electron userData directory when absent.',
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
    GITHUB_DEFAULT_BRANCH: {
        owner: 'Release Engineering',
        defaultValue: 'unset',
        validation: 'GitHub Actions default branch name or unset outside CI.',
        secretHandling: 'CI provenance metadata only. Never store secrets here.',
        failureMode: 'Release provenance falls back to local non-tag mode when absent.',
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
