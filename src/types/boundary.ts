import type {
    GuestDispatchBoundaryReasonCode as SharedGuestDispatchBoundaryReasonCode,
    NetworkMessageBoundaryErrorCode as SharedNetworkMessageBoundaryErrorCode,
    ReplayImportErrorCode as SharedReplayImportErrorCode,
} from './reason';

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

export type ReplayImportErrorCode = SharedReplayImportErrorCode;

export type NetworkMessageBoundaryErrorCode = SharedNetworkMessageBoundaryErrorCode;

export type GuestDispatchBoundaryReasonCode = SharedGuestDispatchBoundaryReasonCode;

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
