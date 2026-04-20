import { useCallback, useMemo, type MutableRefObject } from 'react';
import { reviewHostIntent } from '../../logic/hostApproval';
import { reviewBootstrapReceipt, reviewGuestHostDecision } from '../../logic/networkRecovery';
import { guestIntentToAction } from '../../logic/networkProtocol';
import { createReasonTelemetryContext, createUiStatusNotice } from '../../logic/reasonCatalog';
import { reportReleaseHealth } from '../../observability/releaseHealth';
import type { GameAction, GameState, UiStatusNotice } from '../../types';
import type {
    BootstrapCommand,
    GuestIntentCommand,
    HostApprovalLogEntry,
    HostDecisionMessage,
    PendingGuestIntent,
} from '../../types/network';
import type { OnlineManagerController } from '../useOnlineManager';

interface UseNetworkEventHandlersArgs {
    gameState: GameState;
    localDispatch: (action: GameAction) => void;
    clearAndInit: (action: GameAction) => void;
    appendApprovalLog: (entry: HostApprovalLogEntry) => void;
    publishStatusNotice: (notice: UiStatusNotice) => void;
    onlineRef: MutableRefObject<OnlineManagerController | null>;
    pendingGuestIntentRef: MutableRefObject<PendingGuestIntent | null>;
}

export const useNetworkEventHandlers = ({
    gameState,
    localDispatch,
    clearAndInit,
    appendApprovalLog,
    publishStatusNotice,
    onlineRef,
    pendingGuestIntentRef,
}: UseNetworkEventHandlersArgs) => {
    const handleBootstrapReceived = useCallback(
        (command: BootstrapCommand, remoteChecksum?: string) => {
            console.log(`[NET-RECEIVE] Bootstrap: ${command.kind}`);
            const review = reviewBootstrapReceipt(command, remoteChecksum);

            if (review.outcome === 'REQUEST_RECOVERY') {
                console.error(
                    `[NET] Bootstrap checksum mismatch: local ${review.localChecksum} vs remote ${review.remoteChecksum}`
                );
                reportReleaseHealth({
                    category: 'recovery',
                    name: 'BOOTSTRAP_CHECKSUM_MISMATCH',
                    severity: 'error',
                    message: 'Bootstrap checksum verification failed on the guest.',
                    context: createReasonTelemetryContext(review.reason),
                });
                publishStatusNotice(createUiStatusNotice(review.reason));
                onlineRef.current?.requestRecovery(review.reason);
                return;
            }

            clearAndInit(review.action);
        },
        [clearAndInit, onlineRef, publishStatusNotice]
    );

    const handleStateReceived = useCallback(
        (authoritativeState: GameState) => {
            pendingGuestIntentRef.current = null;
            localDispatch({
                type: 'FORCE_SYNC',
                payload: {
                    ...authoritativeState,
                    isHost: false,
                },
            });
        },
        [localDispatch, pendingGuestIntentRef]
    );

    const handleGuestIntentReceived = useCallback(
        (requestId: string, command: GuestIntentCommand) => {
            if (gameState.mode !== 'ONLINE_MULTIPLAYER' || !gameState.isHost) {
                return;
            }

            const review = reviewHostIntent(gameState, requestId, command);
            appendApprovalLog(review.logEntry);

            if (review.outcomeCode === 'AUTHORITY_REJECTED') {
                reportReleaseHealth({
                    category: 'network',
                    name: 'HOST_INTENT_REJECTED',
                    severity: 'warn',
                    message: 'Host rejected a guest intent during authority review.',
                    context: createReasonTelemetryContext(
                        review.decision.reasonCode || 'AUTHORITY_REJECTED',
                        {
                            intentKind: command.kind,
                        }
                    ),
                });
                onlineRef.current?.sendHostDecision(review.decision);
                return;
            }

            if (review.outcomeCode === 'CHECKSUM_UNAVAILABLE') {
                reportReleaseHealth({
                    category: 'recovery',
                    name: 'HOST_CHECKSUM_DERIVATION_FAILED',
                    severity: 'error',
                    message: 'Host could not derive a deterministic checksum for a guest intent.',
                    context: createReasonTelemetryContext(
                        review.decision.reasonCode || 'CHECKSUM_UNAVAILABLE',
                        {
                            intentKind: command.kind,
                        }
                    ),
                });
                onlineRef.current?.sendHostDecision(review.decision);
                return;
            }

            localDispatch(guestIntentToAction(command));
            onlineRef.current?.sendHostDecision(review.decision);
        },
        [appendApprovalLog, gameState, localDispatch, onlineRef]
    );

    const handleHostDecisionReceived = useCallback(
        (decision: HostDecisionMessage) => {
            const review = reviewGuestHostDecision(
                gameState,
                pendingGuestIntentRef.current,
                decision
            );

            if (review.clearPendingIntent) {
                pendingGuestIntentRef.current = null;
            }

            if (review.outcome === 'IGNORE_LATE') {
                console.warn(
                    '[NET] Ignoring late host decision because no guest intent is pending.'
                );
                reportReleaseHealth({
                    category: 'recovery',
                    name: 'HOST_DECISION_LATE',
                    severity: 'warn',
                    message: 'Guest ignored a late host decision because no intent was pending.',
                });
                return;
            }

            if (review.outcome === 'REQUEST_RECOVERY') {
                if (review.clearPendingIntent) {
                    console.error(
                        `[NET] Approved decision for ${decision.intentKind} failed verification (${review.reason}).`
                    );
                    reportReleaseHealth({
                        category: 'recovery',
                        name: 'HOST_DECISION_VERIFICATION_FAILED',
                        severity: 'error',
                        message:
                            'Guest failed to verify an approved host decision and requested recovery.',
                        context: createReasonTelemetryContext(review.reason, {
                            intentKind: decision.intentKind,
                        }),
                    });
                } else {
                    console.warn(
                        '[NET] Guest received an unexpected host decision. Requesting authoritative recovery.'
                    );
                    reportReleaseHealth({
                        category: 'recovery',
                        name: 'HOST_DECISION_STALE',
                        severity: 'warn',
                        message:
                            'Guest received a stale or mismatched host decision and requested recovery.',
                        context: createReasonTelemetryContext(review.reason, {
                            intentKind: decision.intentKind,
                        }),
                    });
                }
                publishStatusNotice(createUiStatusNotice(review.reason));
                onlineRef.current?.requestRecovery(review.reason, review.requestId);
                return;
            }

            if (review.outcome === 'REJECTED') {
                console.warn(
                    `[NET] Host rejected guest intent ${decision.intentKind}: ${decision.reason || 'Unknown reason.'}`
                );
                reportReleaseHealth({
                    category: 'network',
                    name: 'HOST_DECISION_REJECTED',
                    severity: 'warn',
                    message: 'Guest received a host rejection for a multiplayer intent.',
                    context: createReasonTelemetryContext(review.reasonCode, {
                        intentKind: decision.intentKind,
                    }),
                });
                publishStatusNotice(createUiStatusNotice(review.reasonCode));
                return;
            }

            console.log(
                `[NET] Guest verified approved ${decision.intentKind} checksum and is waiting for authoritative sync.`
            );
            reportReleaseHealth({
                category: 'network',
                name: 'HOST_DECISION_VERIFIED',
                severity: 'info',
                message:
                    'Guest verified an approved host decision and is awaiting authoritative sync.',
                context: {
                    intentKind: decision.intentKind,
                },
            });
        },
        [gameState, onlineRef, pendingGuestIntentRef, publishStatusNotice]
    );

    return useMemo(
        () => ({
            handleBootstrapReceived,
            handleStateReceived,
            handleGuestIntentReceived,
            handleHostDecisionReceived,
        }),
        [
            handleBootstrapReceived,
            handleStateReceived,
            handleGuestIntentReceived,
            handleHostDecisionReceived,
        ]
    );
};
