import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { guestIntentToAction } from '../logic/networkProtocol';
import { GameState, GameAction } from '../types';
import type {
    GuestIntentCommand,
    HostApprovalLogEntry,
    HostDecisionMessage,
    PendingGuestIntent,
} from '../types/network';
import { useOnlineManager, type OnlineManagerController } from './useOnlineManager';
import { reportReleaseHealth } from '../observability/releaseHealth';
import { reviewHostIntent } from '../logic/hostApproval';
import {
    createGuestIntentRequestId,
    resolveNetworkDispatchPlan,
    shouldSendHostStateSync,
} from '../logic/networkDispatchPolicy';
import { reviewBootstrapReceipt, reviewGuestHostDecision } from '../logic/networkRecovery';

const MAX_APPROVAL_LOG_ENTRIES = 25;

export const useGameNetwork = (
    gameState: GameState,
    localDispatch: (action: GameAction) => void,
    clearAndInit: (action: GameAction) => void,
    shouldConnect: boolean,
    targetIP: string = 'localhost'
) => {
    const onlineRef = useRef<OnlineManagerController | null>(null);
    const requestCounterRef = useRef(0);
    const skipNextHostSyncRef = useRef(false);
    const pendingGuestIntentRef = useRef<PendingGuestIntent | null>(null);
    const [approvalLog, setApprovalLog] = useState<HostApprovalLogEntry[]>([]);

    const appendApprovalLog = useCallback((entry: HostApprovalLogEntry) => {
        setApprovalLog((previous) => [entry, ...previous].slice(0, MAX_APPROVAL_LOG_ENTRIES));
    }, []);

    const handleBootstrapReceived = useCallback(
        (command, remoteChecksum) => {
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
                });
                onlineRef.current?.requestRecovery(review.reason);
                return;
            }

            clearAndInit(review.action);
        },
        [clearAndInit]
    );

    const handleStateReceived = useCallback(
        (authoritativeState: GameState) => {
            pendingGuestIntentRef.current = null;
            const guestStateSnapshot = { ...authoritativeState, isHost: false };
            localDispatch({ type: 'FORCE_SYNC', payload: guestStateSnapshot });
        },
        [localDispatch]
    );

    const handleGuestIntent = useCallback(
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
                    context: {
                        intentKind: command.kind,
                        reasonCode: review.decision.reasonCode || 'AUTHORITY_REJECTED',
                    },
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
                    context: {
                        intentKind: command.kind,
                        reasonCode: review.decision.reasonCode || 'CHECKSUM_UNAVAILABLE',
                    },
                });
                onlineRef.current?.sendHostDecision(review.decision);
                return;
            }

            localDispatch(guestIntentToAction(command));
            onlineRef.current?.sendHostDecision(review.decision);
        },
        [appendApprovalLog, gameState, localDispatch]
    );

    const handleHostDecision = useCallback(
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
                        context: {
                            intentKind: decision.intentKind,
                            reason: review.reason,
                        },
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
                        context: {
                            intentKind: decision.intentKind,
                        },
                    });
                }
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
                    context: {
                        intentKind: decision.intentKind,
                        reasonCode: review.reasonCode,
                    },
                });
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
        [gameState]
    );

    const online = useOnlineManager(
        {
            onBootstrapReceived: handleBootstrapReceived,
            onStateReceived: handleStateReceived,
            onGuestIntentReceived: handleGuestIntent,
            onHostDecisionReceived: handleHostDecision,
        },
        gameState.mode === 'ONLINE_MULTIPLAYER' || shouldConnect,
        () => gameState,
        targetIP
    );

    useEffect(() => {
        onlineRef.current = online;
    }, [online]);

    const networkDispatch = useCallback(
        (action: GameAction) => {
            console.log(`[ACTION-RECORD] Type: ${action.type}`, action.payload);
            const dispatchPlan = resolveNetworkDispatchPlan(gameState, action, shouldConnect, {
                nextGuestRequestId: () => {
                    requestCounterRef.current += 1;
                    return createGuestIntentRequestId({
                        now: Date.now(),
                        requestCounter: requestCounterRef.current,
                    });
                },
            });

            if (dispatchPlan.localAction) {
                localDispatch(dispatchPlan.localAction);
            }

            if (dispatchPlan.bootstrapSync) {
                skipNextHostSyncRef.current = dispatchPlan.shouldSkipNextHostSync;
                online.sendBootstrap(
                    dispatchPlan.bootstrapSync.command,
                    dispatchPlan.bootstrapSync.checksum
                );
            }

            if (dispatchPlan.pendingGuestIntent) {
                pendingGuestIntentRef.current = dispatchPlan.pendingGuestIntent;
                online.sendGuestIntent(
                    dispatchPlan.pendingGuestIntent.requestId,
                    dispatchPlan.pendingGuestIntent.command
                );
            }

            if (dispatchPlan.blockedGuestIntentReason === 'NON_PROTOCOL_ACTION') {
                console.warn(`[NET] Guest attempted to send non-protocol action ${action.type}.`);
            }
        },
        [gameState, localDispatch, online, shouldConnect]
    );

    useEffect(() => {
        if (shouldSendHostStateSync(gameState, skipNextHostSyncRef.current)) {
            online.sendState(gameState, 'TURN_SYNC');
            return;
        }

        if (skipNextHostSyncRef.current) {
            skipNextHostSyncRef.current = false;
        }
    }, [gameState, online]);

    const onlineWithApprovalLog = useMemo(
        () => ({
            ...online,
            approvalLog,
        }),
        [approvalLog, online]
    );

    return {
        online: onlineWithApprovalLog,
        networkDispatch,
    };
};
