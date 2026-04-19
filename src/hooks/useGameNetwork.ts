import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { computeBootstrapChecksum, verifyApprovedHostDecision } from '../logic/networkChecksums';
import {
    actionToBootstrapCommand,
    actionToGuestIntentCommand,
    bootstrapCommandToAction,
    guestIntentToAction,
} from '../logic/networkProtocol';
import { GameState, GameAction } from '../types';
import type {
    BootstrapCommand,
    GuestIntentCommand,
    HostApprovalLogEntry,
    HostDecisionMessage,
} from '../types/network';
import { useOnlineManager, type OnlineManagerController } from './useOnlineManager';
import { reportReleaseHealth } from '../observability/releaseHealth';
import { reviewHostIntent } from '../logic/hostApproval';

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
    const pendingGuestIntentRef = useRef<{
        requestId: string;
        command: GuestIntentCommand;
    } | null>(null);
    const [approvalLog, setApprovalLog] = useState<HostApprovalLogEntry[]>([]);

    const appendApprovalLog = useCallback((entry: HostApprovalLogEntry) => {
        setApprovalLog((previous) => [entry, ...previous].slice(0, MAX_APPROVAL_LOG_ENTRIES));
    }, []);

    const handleBootstrapReceived = useCallback(
        (command: BootstrapCommand, remoteChecksum?: string) => {
            console.log(`[NET-RECEIVE] Bootstrap: ${command.kind}`);
            const guestBootstrapAction = bootstrapCommandToAction(command, false);

            if (remoteChecksum) {
                const localChecksum = computeBootstrapChecksum(command, false);
                if (!localChecksum || localChecksum !== remoteChecksum) {
                    console.error(
                        `[NET] Bootstrap checksum mismatch: local ${localChecksum} vs remote ${remoteChecksum}`
                    );
                    reportReleaseHealth({
                        category: 'recovery',
                        name: 'BOOTSTRAP_CHECKSUM_MISMATCH',
                        severity: 'error',
                        message: 'Bootstrap checksum verification failed on the guest.',
                    });
                    onlineRef.current?.requestRecovery('CHECKSUM_MISMATCH');
                    return;
                }
            }

            clearAndInit(guestBootstrapAction);
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
            const pendingIntent = pendingGuestIntentRef.current;

            if (!pendingIntent) {
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

            if (
                pendingIntent.requestId !== decision.requestId ||
                pendingIntent.command.kind !== decision.intentKind
            ) {
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
                onlineRef.current?.requestRecovery('STALE_PACKET', decision.requestId);
                return;
            }

            pendingGuestIntentRef.current = null;

            if (!decision.approved) {
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
                        reasonCode: decision.reasonCode || 'AUTHORITY_REJECTED',
                    },
                });
                return;
            }

            const verification = verifyApprovedHostDecision(gameState, decision);
            if (!verification.valid) {
                console.error(
                    `[NET] Approved decision for ${decision.intentKind} failed verification (${verification.reason}).`
                );
                reportReleaseHealth({
                    category: 'recovery',
                    name: 'HOST_DECISION_VERIFICATION_FAILED',
                    severity: 'error',
                    message:
                        'Guest failed to verify an approved host decision and requested recovery.',
                    context: {
                        intentKind: decision.intentKind,
                        reason: verification.reason || 'STALE_PACKET',
                    },
                });
                onlineRef.current?.requestRecovery(
                    verification.reason || 'STALE_PACKET',
                    decision.requestId
                );
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
            const bootstrapCommand = actionToBootstrapCommand(action);

            if (gameState.mode === 'ONLINE_MULTIPLAYER') {
                if (gameState.isHost) {
                    localDispatch(action);

                    if (bootstrapCommand) {
                        skipNextHostSyncRef.current = true;
                        const checksum = computeBootstrapChecksum(bootstrapCommand, false);
                        online.sendBootstrap(bootstrapCommand, checksum || undefined);
                    }
                } else {
                    const guestIntent = actionToGuestIntentCommand(action);
                    if (gameState.turn === 'p2' && guestIntent) {
                        requestCounterRef.current += 1;
                        const requestId = `guest-${Date.now()}-${requestCounterRef.current}`;
                        pendingGuestIntentRef.current = {
                            requestId,
                            command: guestIntent,
                        };
                        online.sendGuestIntent(requestId, guestIntent);
                    } else if (!guestIntent) {
                        console.warn(
                            `[NET] Guest attempted to send non-protocol action ${action.type}.`
                        );
                    }
                }
                return;
            }

            localDispatch(action);

            if (
                bootstrapCommand &&
                (bootstrapCommand.setup.mode === 'ONLINE_MULTIPLAYER' || shouldConnect)
            ) {
                skipNextHostSyncRef.current = true;
                const checksum = computeBootstrapChecksum(bootstrapCommand, false);
                online.sendBootstrap(bootstrapCommand, checksum || undefined);
            }
        },
        [gameState, localDispatch, online, shouldConnect]
    );

    useEffect(() => {
        if (gameState.mode === 'ONLINE_MULTIPLAYER' && gameState.isHost) {
            if (skipNextHostSyncRef.current) {
                skipNextHostSyncRef.current = false;
                return;
            }
            online.sendState(gameState, 'TURN_SYNC');
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
