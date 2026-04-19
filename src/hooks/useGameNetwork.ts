import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { reviewOnlineIntent } from '../logic/authority';
import {
    computeBootstrapChecksum,
    computeGuestIntentChecksum,
    verifyApprovedHostDecision,
} from '../logic/networkChecksums';
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

            const review = reviewOnlineIntent(gameState, command);
            const logBase = {
                requestId,
                intentKind: command.kind,
                createdAt: Date.now(),
            } as const;

            if (!review.valid) {
                const rejectionDecision: Omit<HostDecisionMessage, 'type' | 'version'> = {
                    requestId,
                    intentKind: command.kind,
                    approved: false,
                    reason: review.reason || 'Host rejected the guest intent.',
                };

                appendApprovalLog({
                    ...logBase,
                    approved: false,
                    reason: rejectionDecision.reason,
                });
                onlineRef.current?.sendHostDecision(rejectionDecision);
                return;
            }

            const checksum = computeGuestIntentChecksum(gameState, command);
            if (!checksum) {
                const staleDecision: Omit<HostDecisionMessage, 'type' | 'version'> = {
                    requestId,
                    intentKind: command.kind,
                    approved: false,
                    reason: 'Host could not derive a deterministic checksum for the request.',
                };

                appendApprovalLog({
                    ...logBase,
                    approved: false,
                    reason: staleDecision.reason,
                });
                onlineRef.current?.sendHostDecision(staleDecision);
                return;
            }

            const approvalDecision: Omit<HostDecisionMessage, 'type' | 'version'> = {
                requestId,
                intentKind: command.kind,
                approved: true,
                command,
                checksum,
            };

            appendApprovalLog({
                ...logBase,
                approved: true,
                checksum: approvalDecision.checksum,
            });
            localDispatch(guestIntentToAction(command));
            onlineRef.current?.sendHostDecision(approvalDecision);
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
                return;
            }

            if (
                pendingIntent.requestId !== decision.requestId ||
                pendingIntent.command.kind !== decision.intentKind
            ) {
                console.warn(
                    '[NET] Guest received an unexpected host decision. Requesting authoritative recovery.'
                );
                onlineRef.current?.requestRecovery('STALE_PACKET', decision.requestId);
                return;
            }

            pendingGuestIntentRef.current = null;

            if (!decision.approved) {
                console.warn(
                    `[NET] Host rejected guest intent ${decision.intentKind}: ${decision.reason || 'Unknown reason.'}`
                );
                return;
            }

            const verification = verifyApprovedHostDecision(gameState, decision);
            if (!verification.valid) {
                console.error(
                    `[NET] Approved decision for ${decision.intentKind} failed verification (${verification.reason}).`
                );
                onlineRef.current?.requestRecovery(
                    verification.reason || 'STALE_PACKET',
                    decision.requestId
                );
                return;
            }

            console.log(
                `[NET] Guest verified approved ${decision.intentKind} checksum and is waiting for authoritative sync.`
            );
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
