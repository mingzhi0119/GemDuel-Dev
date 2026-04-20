export const NETWORK_SYNC_REASONS = ['TURN_SYNC', 'INITIAL', 'RECOVERY'] as const;
export type NetworkSyncReason = (typeof NETWORK_SYNC_REASONS)[number];

export const RECOVERY_REASONS = ['CHECKSUM_MISMATCH', 'MANUAL', 'STALE_PACKET'] as const;
export type RecoveryReason = (typeof RECOVERY_REASONS)[number];

export const GUEST_DISPATCH_BOUNDARY_REASON_CODES = [
    'NON_PROTOCOL_ACTION',
    'NOT_GUEST_TURN',
] as const;
export type GuestDispatchBoundaryReasonCode = (typeof GUEST_DISPATCH_BOUNDARY_REASON_CODES)[number];

export const HOST_DECISION_REASON_CODES = [
    'AUTHORITY_REJECTED',
    'CHECKSUM_UNAVAILABLE',
    ...GUEST_DISPATCH_BOUNDARY_REASON_CODES,
] as const;
export type HostDecisionReasonCode = (typeof HOST_DECISION_REASON_CODES)[number];

export const NETWORK_MESSAGE_BOUNDARY_ERROR_CODES = [
    'NETWORK_MESSAGE_INVALID_ENVELOPE',
    'NETWORK_MESSAGE_INVALID_BOOTSTRAP',
    'NETWORK_MESSAGE_INVALID_GUEST_INTENT',
    'NETWORK_MESSAGE_INVALID_HOST_DECISION',
    'NETWORK_MESSAGE_INVALID_SYNC_STATE',
    'NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST',
] as const;
export type NetworkMessageBoundaryErrorCode = (typeof NETWORK_MESSAGE_BOUNDARY_ERROR_CODES)[number];

export const REPLAY_IMPORT_ERROR_CODES = [
    'REPLAY_FILE_TOO_LARGE',
    'REPLAY_FILE_UNSUPPORTED_TYPE',
    'REPLAY_FILE_READ_FAILED',
    'REPLAY_FILE_INVALID_JSON',
    'REPLAY_FILE_INVALID_SCHEMA',
] as const;
export type ReplayImportErrorCode = (typeof REPLAY_IMPORT_ERROR_CODES)[number];

export const RUNTIME_RELAY_BOUNDARY_REASON_CODES = [
    'TURN_CREDENTIAL_BUNDLE_INVALID',
    'TURN_CREDENTIAL_BUNDLE_EXPIRED',
    'RUNTIME_ICE_CONFIG_INVALID',
] as const;
export type RuntimeRelayBoundaryReasonCode = (typeof RUNTIME_RELAY_BOUNDARY_REASON_CODES)[number];

export const GOVERNANCE_REASON_CODES = [
    'IPC_REQUEST_REJECTED',
    'DESKTOP_POLICY_REJECTED',
    'RELEASE_HEALTH_CHECK_FAILED',
    'DEPENDENCY_AUDIT_FAILED',
    'LICENSE_ALLOWLIST_FAILED',
    'SBOM_SNAPSHOT_DRIFT',
    'SECRET_ENV_DRIFT',
] as const;
export type GovernanceReasonCode = (typeof GOVERNANCE_REASON_CODES)[number];

export type BoundaryReasonCode =
    | GuestDispatchBoundaryReasonCode
    | NetworkMessageBoundaryErrorCode
    | ReplayImportErrorCode
    | RuntimeRelayBoundaryReasonCode
    | GovernanceReasonCode;

export type AppReasonCode = BoundaryReasonCode | HostDecisionReasonCode | RecoveryReason;

const createReasonCodeSet = <Code extends string>(codes: readonly Code[]) => new Set<string>(codes);

const HOST_DECISION_REASON_CODE_SET = createReasonCodeSet(HOST_DECISION_REASON_CODES);
const APP_REASON_CODE_SET = createReasonCodeSet([
    ...HOST_DECISION_REASON_CODES,
    ...RECOVERY_REASONS,
    ...NETWORK_MESSAGE_BOUNDARY_ERROR_CODES,
    ...REPLAY_IMPORT_ERROR_CODES,
    ...RUNTIME_RELAY_BOUNDARY_REASON_CODES,
    ...GOVERNANCE_REASON_CODES,
]);

export const isHostDecisionReasonCode = (value: unknown): value is HostDecisionReasonCode =>
    typeof value === 'string' && HOST_DECISION_REASON_CODE_SET.has(value);

export const isAppReasonCode = (value: unknown): value is AppReasonCode =>
    typeof value === 'string' && APP_REASON_CODE_SET.has(value);
