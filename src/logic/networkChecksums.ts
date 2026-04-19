import { applyAction } from './gameReducer';
import { generateGameStateHash } from '../utils/checksum';
import type { GameState } from '../types';
import type { BootstrapCommand, HostDecisionMessage, RecoveryReason } from '../types/network';
import { bootstrapCommandToAction, guestIntentToAction } from './networkProtocol';

export interface HostDecisionVerificationResult {
    valid: boolean;
    reason?: RecoveryReason;
}

export const computeBootstrapChecksum = (
    command: BootstrapCommand,
    isHost: boolean
): string | null => {
    const nextState = applyAction(null, bootstrapCommandToAction(command, isHost));
    return nextState ? generateGameStateHash(nextState) : null;
};

export const computeGuestIntentChecksum = (
    state: GameState,
    command: HostDecisionMessage['command']
): string | null => {
    if (!command) return null;
    const nextState = applyAction(state, guestIntentToAction(command));
    return nextState ? generateGameStateHash(nextState) : null;
};

export const verifyApprovedHostDecision = (
    state: GameState,
    decision: HostDecisionMessage
): HostDecisionVerificationResult => {
    if (!decision.approved || !decision.command || !decision.checksum) {
        return { valid: false, reason: 'STALE_PACKET' };
    }

    const localChecksum = computeGuestIntentChecksum(state, decision.command);
    if (!localChecksum) {
        return { valid: false, reason: 'STALE_PACKET' };
    }

    if (localChecksum !== decision.checksum) {
        return { valid: false, reason: 'CHECKSUM_MISMATCH' };
    }

    return { valid: true };
};
