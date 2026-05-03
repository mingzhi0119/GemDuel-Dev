import type { AppReasonCode, UiStatusNotice } from '../types';

type ReasonGroup = 'authority' | 'recovery' | 'boundary' | 'runtime' | 'governance';

interface ReasonDescriptor {
    group: ReasonGroup;
    severity: UiStatusNotice['severity'];
    message: string;
}

const REASON_DESCRIPTORS: Record<AppReasonCode, ReasonDescriptor> = {
    AUTHORITY_REJECTED: {
        group: 'authority',
        severity: 'warn',
        message: 'The host rejected that multiplayer action.',
    },
    CHECKSUM_UNAVAILABLE: {
        group: 'authority',
        severity: 'error',
        message: 'The host could not verify that action safely.',
    },
    CHECKSUM_MISMATCH: {
        group: 'recovery',
        severity: 'error',
        message: 'The multiplayer session drifted and is requesting a resync.',
    },
    HEARTBEAT_TIMEOUT: {
        group: 'recovery',
        severity: 'warn',
        message: 'Heartbeat responses stopped and the client requested a recovery snapshot.',
    },
    MANUAL: {
        group: 'recovery',
        severity: 'warn',
        message: 'A manual recovery sync was requested.',
    },
    STALE_PACKET: {
        group: 'recovery',
        severity: 'warn',
        message: 'An out-of-date multiplayer packet was rejected and a resync was requested.',
    },
    NON_PROTOCOL_ACTION: {
        group: 'boundary',
        severity: 'warn',
        message: 'That action is not allowed over the multiplayer protocol.',
    },
    NOT_GUEST_TURN: {
        group: 'boundary',
        severity: 'warn',
        message: 'It is not the guest turn yet.',
    },
    NETWORK_MESSAGE_INVALID_ENVELOPE: {
        group: 'boundary',
        severity: 'warn',
        message: 'An inbound network packet failed the protocol envelope contract.',
    },
    NETWORK_MESSAGE_INVALID_BOOTSTRAP: {
        group: 'boundary',
        severity: 'warn',
        message: 'An inbound bootstrap payload failed schema validation.',
    },
    NETWORK_MESSAGE_INVALID_GUEST_INTENT: {
        group: 'boundary',
        severity: 'warn',
        message: 'An inbound guest intent failed schema validation.',
    },
    NETWORK_MESSAGE_INVALID_HOST_DECISION: {
        group: 'boundary',
        severity: 'warn',
        message: 'An inbound host decision failed schema validation.',
    },
    NETWORK_MESSAGE_INVALID_SYNC_STATE: {
        group: 'boundary',
        severity: 'warn',
        message: 'An inbound sync-state payload failed schema validation.',
    },
    NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST: {
        group: 'boundary',
        severity: 'warn',
        message: 'An inbound recovery request failed schema validation.',
    },
    REPLAY_FILE_TOO_LARGE: {
        group: 'boundary',
        severity: 'warn',
        message: 'The replay file exceeded the governed size limit.',
    },
    REPLAY_FILE_UNSUPPORTED_TYPE: {
        group: 'boundary',
        severity: 'warn',
        message: 'Replay import only accepts JSON files.',
    },
    REPLAY_FILE_READ_FAILED: {
        group: 'boundary',
        severity: 'error',
        message: 'The replay file could not be read safely.',
    },
    REPLAY_FILE_INVALID_JSON: {
        group: 'boundary',
        severity: 'warn',
        message: 'The replay file could not be parsed as JSON.',
    },
    REPLAY_FILE_INVALID_SCHEMA: {
        group: 'boundary',
        severity: 'warn',
        message: 'The replay file did not match the governed replay contract.',
    },
    UNSUPPORTED_REPLAY_VERSION: {
        group: 'boundary',
        severity: 'warn',
        message: 'This replay was recorded with an unsupported legacy format.',
    },
    TURN_CREDENTIAL_BUNDLE_INVALID: {
        group: 'runtime',
        severity: 'error',
        message: 'The TURN credential bundle failed runtime validation.',
    },
    TURN_CREDENTIAL_BUNDLE_EXPIRED: {
        group: 'runtime',
        severity: 'warn',
        message: 'The TURN credential bundle expired before it could be used.',
    },
    TURN_CREDENTIAL_FETCH_FAILED: {
        group: 'runtime',
        severity: 'warn',
        message: 'The desktop runtime could not fetch short-lived TURN credentials.',
    },
    TURN_CREDENTIAL_REFRESH_FAILED: {
        group: 'runtime',
        severity: 'warn',
        message: 'The desktop runtime could not refresh short-lived TURN credentials.',
    },
    TURN_CREDENTIAL_REVOKED: {
        group: 'runtime',
        severity: 'info',
        message: 'The short-lived TURN credential lease was revoked.',
    },
    TURN_CREDENTIAL_REVOKE_FAILED: {
        group: 'runtime',
        severity: 'warn',
        message: 'The desktop runtime could not confirm TURN credential revocation.',
    },
    TURN_CREDENTIAL_FALLBACK_DENIED: {
        group: 'runtime',
        severity: 'error',
        message: 'The runtime denied legacy relay fallback after TURN credential failure.',
    },
    RUNTIME_ICE_CONFIG_INVALID: {
        group: 'runtime',
        severity: 'warn',
        message: 'The runtime ICE configuration failed policy validation.',
    },
    IPC_REQUEST_REJECTED: {
        group: 'governance',
        severity: 'warn',
        message: 'A privileged desktop IPC request was rejected.',
    },
    DESKTOP_POLICY_REJECTED: {
        group: 'governance',
        severity: 'error',
        message: 'The desktop runtime rejected a weakened security policy.',
    },
    RELEASE_HEALTH_CHECK_FAILED: {
        group: 'governance',
        severity: 'error',
        message: 'A release-health governance check failed.',
    },
    DEPENDENCY_AUDIT_FAILED: {
        group: 'governance',
        severity: 'error',
        message: 'A dependency governance audit failed.',
    },
    LICENSE_ALLOWLIST_FAILED: {
        group: 'governance',
        severity: 'error',
        message: 'A dependency license allowlist gate failed.',
    },
    SBOM_SNAPSHOT_DRIFT: {
        group: 'governance',
        severity: 'error',
        message: 'The governed SBOM snapshot drifted.',
    },
    SECRET_ENV_DRIFT: {
        group: 'governance',
        severity: 'error',
        message: 'A secret environment governance gate detected drift.',
    },
};

export const getReasonDescriptor = (code: AppReasonCode): ReasonDescriptor =>
    REASON_DESCRIPTORS[code];

export const createUiStatusNotice = (
    code: AppReasonCode,
    message = getReasonDescriptor(code).message
): UiStatusNotice => ({
    code,
    message,
    severity: getReasonDescriptor(code).severity,
});

export const createReasonTelemetryContext = (
    code: AppReasonCode,
    context: Record<string, string | number | boolean | null | undefined> = {}
) =>
    Object.fromEntries(
        Object.entries({
            reasonCode: code,
            reasonGroup: getReasonDescriptor(code).group,
            ...context,
        }).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number | boolean | null>;
