import { BOUNDARY_REGISTRY_SCHEMA_VERSION } from './boundaryGovernance.js';

const BOUNDARY_SOURCE_ENTRIES = Object.freeze([
    {
        id: 'renderer-action-dispatch',
        title: 'Renderer action dispatch',
        entrySurface: 'networkDispatch / local reducer actions',
        owner: 'Frontend + Domain Logic',
        validatorRefs: [
            'packages/shared/src/logic/actionValidation.ts',
            'packages/shared/src/logic/commandGate.ts',
            'packages/shared/src/logic/fsmPolicy.ts',
        ],
        contractRefs: [
            'packages/shared/src/types/boundary.ts',
            'packages/shared/src/types/network.ts',
            'packages/shared/src/types/reason.ts',
        ],
        reasonCodes: [
            'NON_PROTOCOL_ACTION',
            'NOT_GUEST_TURN',
            'AUTHORITY_REJECTED',
            'CHECKSUM_UNAVAILABLE',
        ],
        runtimeSignals: [
            'GUEST_INTENT_BLOCKED',
            'HOST_INTENT_REJECTED',
            'HOST_CHECKSUM_DERIVATION_FAILED',
        ],
        testRefs: [
            'packages/shared/src/logic/__tests__/fsmPolicyMatrix.test.ts',
            'packages/shared/src/logic/__tests__/securityBoundaries.test.ts',
            'apps/desktop/src/hooks/__tests__/useGameNetwork.test.tsx',
        ],
        failClosedBehavior:
            'Illegal actions are rejected before reducer state mutation or network dispatch.',
    },
    {
        id: 'network-message-parsing',
        title: 'Network message parsing',
        entrySurface: 'PeerJS data payload',
        owner: 'Networking',
        validatorRefs: [
            'packages/shared/src/logic/networkMessageValidation.ts',
            'packages/shared/src/logic/networkProtocol.ts',
        ],
        contractRefs: [
            'packages/shared/src/types/boundary.ts',
            'packages/shared/src/types/network.ts',
            'packages/shared/src/types/reason.ts',
        ],
        reasonCodes: [
            'NETWORK_MESSAGE_INVALID_ENVELOPE',
            'NETWORK_MESSAGE_INVALID_BOOTSTRAP',
            'NETWORK_MESSAGE_INVALID_GUEST_INTENT',
            'NETWORK_MESSAGE_INVALID_HOST_DECISION',
            'NETWORK_MESSAGE_INVALID_SYNC_STATE',
            'NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST',
        ],
        runtimeSignals: ['NETWORK_MESSAGE_REJECTED'],
        testRefs: [
            'packages/shared/src/logic/__tests__/propertyBoundaries.test.ts',
            'packages/shared/src/logic/__tests__/protocolRecoveryMatrix.test.ts',
            'packages/shared/src/logic/__tests__/networkMessageValidationBoundary.test.ts',
        ],
        failClosedBehavior:
            'Malformed or unsupported messages are dropped before they reach multiplayer state transitions.',
    },
    {
        id: 'guest-intent-authority-review',
        title: 'Guest intent authority review',
        entrySurface: 'HOST_DECISION / GUEST_INTENT',
        owner: 'Networking',
        validatorRefs: [
            'packages/shared/src/logic/hostApproval.ts',
            'packages/shared/src/logic/networkRecovery.ts',
            'packages/shared/src/logic/networkChecksums.ts',
        ],
        contractRefs: [
            'packages/shared/src/types/network.ts',
            'packages/shared/src/types/boundary.ts',
            'packages/shared/src/types/reason.ts',
        ],
        reasonCodes: [
            'NON_PROTOCOL_ACTION',
            'NOT_GUEST_TURN',
            'AUTHORITY_REJECTED',
            'CHECKSUM_UNAVAILABLE',
            'CHECKSUM_MISMATCH',
            'STALE_PACKET',
        ],
        runtimeSignals: [
            'HOST_INTENT_REJECTED',
            'HOST_CHECKSUM_DERIVATION_FAILED',
            'HOST_DECISION_LATE',
            'HOST_DECISION_STALE',
            'HOST_DECISION_REJECTED',
            'HOST_DECISION_VERIFICATION_FAILED',
            'HOST_DECISION_VERIFIED',
        ],
        testRefs: [
            'packages/shared/src/logic/__tests__/hostApproval.test.ts',
            'packages/shared/src/logic/__tests__/networkRecovery.test.ts',
            'apps/desktop/src/hooks/__tests__/useGameNetwork.test.tsx',
        ],
        failClosedBehavior:
            'Unauthorized, stale, or unverifiable guest intents are rejected or force authoritative recovery.',
    },
    {
        id: 'replay-local-file-read',
        title: 'Replay local file read',
        entrySurface: 'Renderer file input',
        owner: 'Frontend + Domain Logic',
        validatorRefs: ['apps/desktop/src/app/io/safeReplayImport.ts'],
        contractRefs: ['packages/shared/src/types/boundary.ts'],
        reasonCodes: [
            'REPLAY_FILE_TOO_LARGE',
            'REPLAY_FILE_UNSUPPORTED_TYPE',
            'REPLAY_FILE_READ_FAILED',
            'REPLAY_FILE_INVALID_JSON',
        ],
        runtimeSignals: ['REPLAY_BOUNDARY_REJECTED'],
        testRefs: ['apps/desktop/src/app/io/__tests__/safeReplayImport.test.ts'],
        failClosedBehavior:
            'Oversized, unreadable, or non-JSON local files are rejected before replay schema parsing.',
    },
    {
        id: 'replay-schema-deterministic-replay',
        title: 'Replay schema / deterministic replay',
        entrySurface: 'Replay JSON payload',
        owner: 'Domain Logic',
        validatorRefs: [
            'apps/desktop/src/app/io/safeReplayImport.ts',
            'packages/shared/src/replay/reader.ts',
            'packages/shared/src/replay/loader.ts',
            'packages/shared/src/replay/schema.ts',
        ],
        contractRefs: [
            'packages/shared/src/types/boundary.ts',
            'packages/shared/src/replay/types.ts',
        ],
        reasonCodes: ['REPLAY_FILE_INVALID_SCHEMA', 'UNSUPPORTED_REPLAY_VERSION'],
        runtimeSignals: ['REPLAY_BOUNDARY_REJECTED'],
        testRefs: [
            'apps/desktop/src/app/io/__tests__/safeReplayImport.test.ts',
            'packages/shared/src/replay/__tests__/replayVNext.test.ts',
        ],
        failClosedBehavior:
            'Schema-invalid, legacy, or nondeterministic Replay vNext payloads fail closed and are never imported.',
    },
    {
        id: 'ipc-bridge',
        title: 'IPC invoke/send',
        entrySurface: 'window.electron.* bridge',
        owner: 'Desktop Platform',
        validatorRefs: [
            'apps/desktop/electron/preloadContract.cjs',
            'apps/desktop/electron/desktopGovernance.js',
            'tools/scripts/check-electron-governance.mjs',
        ],
        contractRefs: [
            'packages/shared/src/types/desktop.ts',
            'docs/governance/electron-ipc-allowlist.md',
        ],
        reasonCodes: ['IPC_REQUEST_REJECTED'],
        runtimeSignals: ['IPC_REQUEST_REJECTED'],
        testRefs: [
            'apps/desktop/electron/__tests__/desktopGovernance.test.ts',
            'apps/desktop/electron/__tests__/preloadContract.test.ts',
        ],
        failClosedBehavior:
            'Unknown channels, unexpected payloads, and unauthorized senders are rejected in the main process.',
    },
    {
        id: 'desktop-window-security',
        title: 'Desktop BrowserWindow security',
        entrySurface: 'Electron main window creation',
        owner: 'Desktop Platform',
        validatorRefs: [
            'apps/desktop/electron/desktopGovernance.js',
            'tools/scripts/check-electron-governance.mjs',
            'tools/scripts/check-runtime-drill-governance.mjs',
        ],
        contractRefs: [
            'tools/governance/desktop-policy.snapshot.json',
            'tools/governance/runtime-drill.snapshot.json',
            'docs/governance/electron-ipc-allowlist.md',
        ],
        reasonCodes: ['DESKTOP_POLICY_REJECTED'],
        runtimeSignals: ['WINDOW_CREATED', 'WINDOW_LOAD_FAILED', 'WINDOW_UNAVAILABLE'],
        testRefs: [
            'apps/desktop/electron/__tests__/desktopGovernance.test.ts',
            'apps/desktop/electron/__tests__/runtimeHarness.test.ts',
            'tools/scripts/__tests__/runtimeDrillGovernance.test.ts',
        ],
        failClosedBehavior:
            'BrowserWindow policy drift fails desktop governance checks before release or local desktop startup.',
    },
    {
        id: 'runtime-relay-profile',
        title: 'Runtime env / ICE config',
        entrySurface: 'Renderer runtime bootstrap',
        owner: 'Desktop Platform + Networking',
        validatorRefs: [
            'apps/desktop/electron/runtimeConfig.js',
            'packages/shared/src/config/webrtc.ts',
            'apps/desktop/src/app/runtime/useRuntimeAppConfig.ts',
        ],
        contractRefs: [
            'packages/shared/src/types/runtime.ts',
            'packages/shared/src/types/boundary.ts',
            'docs/governance/dependency-runtime-governance.md',
        ],
        reasonCodes: [
            'TURN_CREDENTIAL_BUNDLE_INVALID',
            'TURN_CREDENTIAL_BUNDLE_EXPIRED',
            'RUNTIME_ICE_CONFIG_INVALID',
        ],
        runtimeSignals: [
            'ICE_PROFILE_LOADED',
            'ICE_PROFILE_FALLBACK',
            'APP_RUNTIME_CONFIG_LOADED',
            'APP_RUNTIME_CONFIG_FAILED',
        ],
        testRefs: [
            'apps/desktop/electron/__tests__/runtimeConfig.test.ts',
            'packages/shared/src/config/__tests__/webrtc.test.ts',
        ],
        failClosedBehavior:
            'Invalid or expired relay profiles fall back to legacy runtime ICE config and then the STUN-only baseline.',
    },
    {
        id: 'release-health-checklist',
        title: 'Release-health checklist',
        entrySurface: 'Release / CI gate',
        owner: 'Desktop Platform + Release Engineering',
        validatorRefs: [
            'tools/scripts/check-release-health.mjs',
            'tools/scripts/export-governance-artifacts.mjs',
            'tools/scripts/releaseHealthChecklist.js',
            'tools/scripts/releaseHealthOperations.js',
        ],
        contractRefs: [
            'docs/governance/release-health-checklist.md',
            'docs/governance/operations-slo.md',
            'tools/governance/release-health-operations.snapshot.json',
        ],
        reasonCodes: ['RELEASE_HEALTH_CHECK_FAILED'],
        runtimeSignals: [
            'APP_READY',
            'APP_BOOT',
            'APP_RUNTIME_CONFIG_FAILED',
            'IPC_REQUEST_REJECTED',
            'RECOVERY_REQUEST_SENT',
        ],
        testRefs: [
            'tools/scripts/__tests__/releaseHealthChecklist.test.ts',
            'tools/scripts/__tests__/releaseHealthOperations.test.ts',
            'tools/scripts/__tests__/exportGovernanceArtifacts.test.ts',
        ],
        failClosedBehavior:
            'Checklist or SLO drift blocks release-health gates before build and publish.',
    },
    {
        id: 'dependency-governance',
        title: 'Dependency / package governance',
        entrySurface: 'CI + local scripts',
        owner: 'Release Engineering',
        validatorRefs: [
            'tools/scripts/check-dependency-governance.mjs',
            'tools/scripts/check-license-governance.mjs',
            'tools/scripts/check-sbom-governance.mjs',
            'tools/scripts/check-secret-governance.mjs',
        ],
        contractRefs: [
            'docs/governance/dependency-runtime-governance.md',
            'tools/governance/dependency-license-allowlist.json',
            'tools/governance/dependency-sbom.snapshot.json',
        ],
        reasonCodes: [
            'DEPENDENCY_AUDIT_FAILED',
            'LICENSE_ALLOWLIST_FAILED',
            'SBOM_SNAPSHOT_DRIFT',
            'SECRET_ENV_DRIFT',
        ],
        runtimeSignals: [
            'DEPENDENCY_GOVERNANCE_CHECK',
            'SECRET_ENV_DRIFT_GATE',
            'SBOM_GATE',
            'LICENSE_ALLOWLIST_GATE',
        ],
        testRefs: [
            'tools/scripts/__tests__/dependencyGovernance.test.ts',
            'apps/desktop/electron/__tests__/runtimeConfig.test.ts',
        ],
        failClosedBehavior:
            'Policy drift, production vulnerabilities, secret leaks, or SBOM drift block CI and release builds.',
    },
]);

const cloneEntry = (entry) => ({
    ...entry,
    validatorRefs: [...entry.validatorRefs],
    contractRefs: [...entry.contractRefs],
    reasonCodes: [...entry.reasonCodes],
    runtimeSignals: [...entry.runtimeSignals],
    testRefs: [...entry.testRefs],
});

export const buildBoundaryRegistryFromSource = () => ({
    schemaVersion: BOUNDARY_REGISTRY_SCHEMA_VERSION,
    boundaries: BOUNDARY_SOURCE_ENTRIES.map(cloneEntry),
});
