import type { GameState } from '../types';
import type {
    GuestIntentCommand,
    HostApprovalLogEntry,
    HostApprovalOutcomeCode,
    HostDecisionMessage,
    HostDecisionReasonCode,
} from '../types/network';
import { validateGuestIntentCommand } from './commandGate';
import { computeGuestIntentChecksum } from './networkChecksums';

export interface HostApprovalDependencies {
    computeChecksum?: typeof computeGuestIntentChecksum;
    now?: () => number;
    validateIntent?: typeof validateGuestIntentCommand;
}

export interface HostApprovalReview {
    decision: Omit<HostDecisionMessage, 'type' | 'version'>;
    logEntry: HostApprovalLogEntry;
    outcomeCode: HostApprovalOutcomeCode;
}

const createLogEntry = ({
    approved,
    checksum,
    createdAt,
    intentKind,
    outcomeCode,
    reason,
    reasonCode,
    requestId,
}: {
    approved: boolean;
    checksum?: string;
    createdAt: number;
    intentKind: GuestIntentCommand['kind'];
    outcomeCode: HostApprovalOutcomeCode;
    reason?: string;
    reasonCode?: HostDecisionReasonCode;
    requestId: string;
}): HostApprovalLogEntry => ({
    requestId,
    intentKind,
    approved,
    outcomeCode,
    reasonCode,
    reason,
    checksum,
    createdAt,
});

export const reviewHostIntent = (
    state: GameState,
    requestId: string,
    command: GuestIntentCommand,
    dependencies: HostApprovalDependencies = {}
): HostApprovalReview => {
    const validateIntent = dependencies.validateIntent ?? validateGuestIntentCommand;
    const computeChecksum = dependencies.computeChecksum ?? computeGuestIntentChecksum;
    const createdAt = (dependencies.now ?? Date.now)();
    const validation = validateIntent(state, command);

    if (!validation.valid) {
        const reason = validation.reason || 'Host rejected the guest intent.';
        const reasonCode =
            validation.reasonCode === 'NON_PROTOCOL_ACTION' ||
            validation.reasonCode === 'NOT_GUEST_TURN'
                ? validation.reasonCode
                : 'AUTHORITY_REJECTED';
        return {
            outcomeCode: 'AUTHORITY_REJECTED',
            decision: {
                requestId,
                intentKind: command.kind,
                approved: false,
                reasonCode,
                reason,
            },
            logEntry: createLogEntry({
                approved: false,
                createdAt,
                intentKind: command.kind,
                outcomeCode: 'AUTHORITY_REJECTED',
                reasonCode,
                reason,
                requestId,
            }),
        };
    }

    const checksum = computeChecksum(state, command);
    if (!checksum) {
        const reason = 'Host could not derive a deterministic checksum for the request.';
        return {
            outcomeCode: 'CHECKSUM_UNAVAILABLE',
            decision: {
                requestId,
                intentKind: command.kind,
                approved: false,
                reasonCode: 'CHECKSUM_UNAVAILABLE',
                reason,
            },
            logEntry: createLogEntry({
                approved: false,
                createdAt,
                intentKind: command.kind,
                outcomeCode: 'CHECKSUM_UNAVAILABLE',
                reasonCode: 'CHECKSUM_UNAVAILABLE',
                reason,
                requestId,
            }),
        };
    }

    return {
        outcomeCode: 'APPROVED',
        decision: {
            requestId,
            intentKind: command.kind,
            approved: true,
            command,
            checksum,
        },
        logEntry: createLogEntry({
            approved: true,
            checksum,
            createdAt,
            intentKind: command.kind,
            outcomeCode: 'APPROVED',
            requestId,
        }),
    };
};
