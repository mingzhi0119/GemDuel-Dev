import { ALLOWED_ICE_URL_PROTOCOLS } from '../shared/runtimeIcePolicy.js';

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
