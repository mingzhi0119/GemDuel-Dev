import type { GameAction, GameState } from '../types';
import type {
    BootstrapCommand,
    HostDecisionMessage,
    PendingGuestIntent,
    RecoveryReason,
} from '../types/network';
import {
    computeBootstrapChecksum,
    type HostDecisionVerificationResult,
    verifyApprovedHostDecision,
} from './networkChecksums';
import { bootstrapCommandToAction } from './networkProtocol';

type BootstrapAction = Extract<GameAction, { type: 'INIT' | 'INIT_DRAFT' }>;

export interface BootstrapReviewDependencies {
    computeChecksum?: typeof computeBootstrapChecksum;
    toAction?: typeof bootstrapCommandToAction;
}

export type BootstrapReviewResult =
    | {
          outcome: 'APPLY';
          action: BootstrapAction;
      }
    | {
          outcome: 'REQUEST_RECOVERY';
          reason: 'CHECKSUM_MISMATCH';
          localChecksum: string | null;
          remoteChecksum: string;
      };

export interface GuestHostDecisionReviewDependencies {
    verifyDecision?: (
        state: GameState,
        decision: HostDecisionMessage
    ) => HostDecisionVerificationResult;
}

export type GuestHostDecisionReviewResult =
    | {
          outcome: 'IGNORE_LATE';
          clearPendingIntent: false;
      }
    | {
          outcome: 'REQUEST_RECOVERY';
          clearPendingIntent: boolean;
          reason: RecoveryReason;
          requestId?: string;
      }
    | {
          outcome: 'REJECTED';
          clearPendingIntent: true;
          reasonCode: NonNullable<HostDecisionMessage['reasonCode']>;
          reason?: string;
      }
    | {
          outcome: 'VERIFIED';
          clearPendingIntent: true;
      };

export const reviewBootstrapReceipt = (
    command: BootstrapCommand,
    remoteChecksum?: string,
    dependencies: BootstrapReviewDependencies = {}
): BootstrapReviewResult => {
    const computeChecksum = dependencies.computeChecksum ?? computeBootstrapChecksum;
    const toAction = dependencies.toAction ?? bootstrapCommandToAction;

    if (remoteChecksum) {
        const localChecksum = computeChecksum(command, false);
        if (!localChecksum || localChecksum !== remoteChecksum) {
            return {
                outcome: 'REQUEST_RECOVERY',
                reason: 'CHECKSUM_MISMATCH',
                localChecksum,
                remoteChecksum,
            };
        }
    }

    return {
        outcome: 'APPLY',
        action: toAction(command, false),
    };
};

export const reviewGuestHostDecision = (
    state: GameState,
    pendingIntent: PendingGuestIntent | null,
    decision: HostDecisionMessage,
    dependencies: GuestHostDecisionReviewDependencies = {}
): GuestHostDecisionReviewResult => {
    const verifyDecision = dependencies.verifyDecision ?? verifyApprovedHostDecision;

    if (!pendingIntent) {
        return {
            outcome: 'IGNORE_LATE',
            clearPendingIntent: false,
        };
    }

    if (
        pendingIntent.requestId !== decision.requestId ||
        pendingIntent.command.kind !== decision.intentKind
    ) {
        return {
            outcome: 'REQUEST_RECOVERY',
            clearPendingIntent: false,
            reason: 'STALE_PACKET',
            requestId: decision.requestId,
        };
    }

    if (!decision.approved) {
        return {
            outcome: 'REJECTED',
            clearPendingIntent: true,
            reasonCode: decision.reasonCode || 'AUTHORITY_REJECTED',
            reason: decision.reason,
        };
    }

    const verification = verifyDecision(state, decision);
    if (!verification.valid) {
        return {
            outcome: 'REQUEST_RECOVERY',
            clearPendingIntent: true,
            reason: verification.reason || 'STALE_PACKET',
            requestId: decision.requestId,
        };
    }

    return {
        outcome: 'VERIFIED',
        clearPendingIntent: true,
    };
};
