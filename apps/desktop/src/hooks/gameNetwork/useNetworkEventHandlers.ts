import { useCallback, useMemo, type MutableRefObject } from 'react';
import { reviewHostIntent } from '@gemduel/shared/logic/hostApproval';
import {
    reviewBootstrapReceipt,
    reviewGuestHostDecision,
} from '@gemduel/shared/logic/networkRecovery';
import { guestIntentToAction } from '@gemduel/shared/logic/networkProtocol';
import {
    createReasonTelemetryContext,
    createUiStatusNotice,
} from '@gemduel/shared/logic/reasonCatalog';
import { logRendererMessage, reportRendererEvent } from '../../observability/rendererLogger';
import type { GameAction, GameState, UiStatusNotice } from '@gemduel/shared/types';
import type {
    BootstrapCommand,
    GuestIntentCommand,
    HostApprovalLogEntry,
    HostDecisionMessage,
    PendingGuestIntent,
} from '@gemduel/shared/types/network';
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
            logRendererMessage('info', `[NET-RECEIVE] Bootstrap: ${command.kind}`);
            const review = reviewBootstrapReceipt(command, remoteChecksum);

            if (review.outcome === 'REQUEST_RECOVERY') {
                reportRendererEvent(
                    {
                        category: 'recovery',
                        name: 'BOOTSTRAP_CHECKSUM_MISMATCH',
                        severity: 'error',
                        message: 'Bootstrap checksum verification failed on the guest.',
                        context: createReasonTelemetryContext(review.reason),
                    },
                    {
                        consoleMessage: `[NET] Bootstrap checksum mismatch: local ${review.localChecksum} vs remote ${review.remoteChecksum}`,
                    }
                );
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
            const localPlayer = authoritativeState.hostPlayer === 'p1' ? 'p2' : 'p1';
            localDispatch({
                type: 'FORCE_SYNC',
                payload: {
                    ...authoritativeState,
                    isHost: false,
                    localPlayer,
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
                reportRendererEvent({
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
                reportRendererEvent({
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
                reportRendererEvent(
                    {
                        category: 'recovery',
                        name: 'HOST_DECISION_LATE',
                        severity: 'warn',
                        message:
                            'Guest ignored a late host decision because no intent was pending.',
                    },
                    {
                        consoleMessage:
                            '[NET] Ignoring late host decision because no guest intent is pending.',
                    }
                );
                return;
            }

            if (review.outcome === 'REQUEST_RECOVERY') {
                if (review.clearPendingIntent) {
                    reportRendererEvent(
                        {
                            category: 'recovery',
                            name: 'HOST_DECISION_VERIFICATION_FAILED',
                            severity: 'error',
                            message:
                                'Guest failed to verify an approved host decision and requested recovery.',
                            context: createReasonTelemetryContext(review.reason, {
                                intentKind: decision.intentKind,
                            }),
                        },
                        {
                            consoleMessage: `[NET] Approved decision for ${decision.intentKind} failed verification (${review.reason}).`,
                        }
                    );
                } else {
                    reportRendererEvent(
                        {
                            category: 'recovery',
                            name: 'HOST_DECISION_STALE',
                            severity: 'warn',
                            message:
                                'Guest received a stale or mismatched host decision and requested recovery.',
                            context: createReasonTelemetryContext(review.reason, {
                                intentKind: decision.intentKind,
                            }),
                        },
                        {
                            consoleMessage:
                                '[NET] Guest received an unexpected host decision. Requesting authoritative recovery.',
                        }
                    );
                }
                publishStatusNotice(createUiStatusNotice(review.reason));
                onlineRef.current?.requestRecovery(review.reason, review.requestId);
                return;
            }

            if (review.outcome === 'REJECTED') {
                reportRendererEvent(
                    {
                        category: 'network',
                        name: 'HOST_DECISION_REJECTED',
                        severity: 'warn',
                        message: 'Guest received a host rejection for a multiplayer intent.',
                        context: createReasonTelemetryContext(review.reasonCode, {
                            intentKind: decision.intentKind,
                        }),
                    },
                    {
                        consoleMessage: `[NET] Host rejected guest intent ${decision.intentKind}: ${decision.reason || 'Unknown reason.'}`,
                    }
                );
                publishStatusNotice(createUiStatusNotice(review.reasonCode));
                return;
            }

            reportRendererEvent(
                {
                    category: 'network',
                    name: 'HOST_DECISION_VERIFIED',
                    severity: 'info',
                    message:
                        'Guest verified an approved host decision and is awaiting authoritative sync.',
                    context: {
                        intentKind: decision.intentKind,
                    },
                },
                {
                    consoleMessage: `[NET] Guest verified approved ${decision.intentKind} checksum and is waiting for authoritative sync.`,
                }
            );
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
