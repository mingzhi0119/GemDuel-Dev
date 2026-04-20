export type BoundaryId =
    | 'renderer-action-dispatch'
    | 'network-message-parsing'
    | 'guest-intent-authority-review'
    | 'replay-local-file-read'
    | 'replay-schema-deterministic-replay'
    | 'ipc-bridge'
    | 'desktop-window-security'
    | 'runtime-relay-profile'
    | 'release-health-checklist'
    | 'dependency-governance';

export type ReplayImportErrorCode =
    | 'REPLAY_FILE_TOO_LARGE'
    | 'REPLAY_FILE_UNSUPPORTED_TYPE'
    | 'REPLAY_FILE_READ_FAILED'
    | 'REPLAY_FILE_INVALID_JSON'
    | 'REPLAY_FILE_INVALID_SCHEMA';

export type NetworkMessageBoundaryErrorCode =
    | 'NETWORK_MESSAGE_INVALID_ENVELOPE'
    | 'NETWORK_MESSAGE_INVALID_BOOTSTRAP'
    | 'NETWORK_MESSAGE_INVALID_GUEST_INTENT'
    | 'NETWORK_MESSAGE_INVALID_HOST_DECISION'
    | 'NETWORK_MESSAGE_INVALID_SYNC_STATE'
    | 'NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST';

export type GuestDispatchBoundaryReasonCode = 'NON_PROTOCOL_ACTION' | 'NOT_GUEST_TURN';

export interface BoundaryFailure<Code extends string = string> {
    ok: false;
    boundaryId: BoundaryId;
    code: Code;
    message: string;
    detail?: string;
    runtimeSignal?: string;
    context?: Record<string, string | number | boolean | null>;
}

export interface BoundarySuccess<T> {
    ok: true;
    value: T;
}

export type BoundaryResult<T, Code extends string = string> =
    | BoundarySuccess<T>
    | BoundaryFailure<Code>;
