import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameState, GameAction, type UiStatusNotice } from '@gemduel/shared/types';
import type {
    HostApprovalLogEntry,
    NetworkSyncReason,
    PendingGuestIntent,
    RecoveryReason,
} from '@gemduel/shared/types/network';
import {
    applyReplaySyncToRecorder,
    buildReplayFullSync,
    createReplayRecorderInternalState,
    generateReplayStateHash,
    replaceReplayRecorderFromReplay,
    type ReplayFullSync,
    type ReplaySync,
} from '@gemduel/shared/replay';
import {
    createReasonTelemetryContext,
    createUiStatusNotice,
} from '@gemduel/shared/logic/reasonCatalog';
import { useOnlineManager, type OnlineManagerController } from './useOnlineManager';
import {
    createGuestIntentRequestId,
    resolveNetworkDispatchPlan,
} from '@gemduel/shared/logic/networkDispatchPolicy';
import { useHostStateSync } from './gameNetwork/useHostStateSync';
import { useNetworkEventHandlers } from './gameNetwork/useNetworkEventHandlers';
import { logRendererMessage, reportRendererEvent } from '../observability/rendererLogger';

const MAX_APPROVAL_LOG_ENTRIES = 25;

export const useGameNetwork = (
    gameState: GameState,
    localDispatch: (action: GameAction) => void,
    clearAndInit: (action: GameAction) => void,
    shouldConnect: boolean,
    targetIP: string = 'localhost',
    targetPort: number = 9000,
    localReplayRecorder: ReturnType<
        typeof createReplayRecorderInternalState
    > = createReplayRecorderInternalState('unknown')
) => {
    const onlineRef = useRef<OnlineManagerController | null>(null);
    const requestCounterRef = useRef(0);
    const skipNextHostSyncRef = useRef(false);
    const pendingGuestIntentRef = useRef<PendingGuestIntent | null>(null);
    const authoritativeReplayRecorderRef = useRef<ReturnType<
        typeof createReplayRecorderInternalState
    > | null>(null);
    const lastSentReplayRevisionRef = useRef(-1);
    const pendingReplayFullSyncRef = useRef(true);
    const nextReplaySyncReasonRef = useRef<NetworkSyncReason>('INITIAL');
    const [approvalLog, setApprovalLog] = useState<HostApprovalLogEntry[]>([]);
    const [statusNotice, setStatusNotice] = useState<UiStatusNotice | null>(null);
    const [authoritativeReplayRevision, setAuthoritativeReplayRevision] = useState(0);

    const appendApprovalLog = useCallback((entry: HostApprovalLogEntry) => {
        setApprovalLog((previous) => [entry, ...previous].slice(0, MAX_APPROVAL_LOG_ENTRIES));
    }, []);

    const publishStatusNotice = useCallback((notice: UiStatusNotice) => {
        setStatusNotice(notice);
    }, []);

    useEffect(() => {
        if (!statusNotice) {
            return;
        }

        const timer = window.setTimeout(() => {
            setStatusNotice(null);
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [statusNotice]);

    const getCurrentReplayFullSync = useCallback((): ReplayFullSync | null => {
        if (!localReplayRecorder.init) {
            return null;
        }

        return buildReplayFullSync(localReplayRecorder, gameState);
    }, [gameState, localReplayRecorder]);

    const replaceAuthoritativeReplay = useCallback((replayFull: ReplayFullSync) => {
        const current = authoritativeReplayRecorderRef.current;
        if (current && replayFull.replayRevision <= current.replayRevision) {
            return;
        }

        authoritativeReplayRecorderRef.current = replaceReplayRecorderFromReplay(replayFull.replay);
        setAuthoritativeReplayRevision(replayFull.replayRevision);
    }, []);

    const syncAuthoritativeReplay = useCallback(
        (replaySync: ReplaySync, authoritativeState: GameState): RecoveryReason | null => {
            if (replaySync.kind === 'full') {
                const current = authoritativeReplayRecorderRef.current;
                if (current && replaySync.replayRevision < current.replayRevision) {
                    return null;
                }
                if (current && replaySync.replayRevision === current.replayRevision) {
                    return null;
                }

                const nextRecorder = replaceReplayRecorderFromReplay(replaySync.replay);
                const nextHash = generateReplayStateHash(
                    authoritativeState,
                    nextRecorder.runtimeToInstance
                );
                if (nextHash !== replaySync.replay.summary.finalStateHash) {
                    return 'CHECKSUM_MISMATCH';
                }

                authoritativeReplayRecorderRef.current = nextRecorder;
                setAuthoritativeReplayRevision(replaySync.replayRevision);
                return null;
            }

            const current = authoritativeReplayRecorderRef.current;
            if (!current) {
                return 'STALE_PACKET';
            }
            if (replaySync.toRevision < current.replayRevision) {
                return null;
            }
            if (replaySync.toRevision === current.replayRevision) {
                return null;
            }
            if (replaySync.fromRevision !== current.replayRevision) {
                return 'STALE_PACKET';
            }

            try {
                applyReplaySyncToRecorder(current, replaySync);
            } catch {
                return 'STALE_PACKET';
            }

            const nextHash = generateReplayStateHash(authoritativeState, current.runtimeToInstance);
            if (nextHash !== replaySync.stateHashAfter) {
                return 'CHECKSUM_MISMATCH';
            }

            setAuthoritativeReplayRevision(current.replayRevision);
            return null;
        },
        []
    );

    const {
        handleBootstrapReceived,
        handleStateReceived,
        handleGuestIntentReceived,
        handleHostDecisionReceived,
    } = useNetworkEventHandlers({
        gameState,
        localDispatch,
        clearAndInit,
        appendApprovalLog,
        publishStatusNotice,
        onlineRef,
        pendingGuestIntentRef,
        replaceAuthoritativeReplay,
        syncAuthoritativeReplay,
    });

    const online = useOnlineManager(
        {
            onBootstrapReceived: handleBootstrapReceived,
            onStateReceived: handleStateReceived,
            onGuestIntentReceived: handleGuestIntentReceived,
            onHostDecisionReceived: handleHostDecisionReceived,
        },
        gameState.mode === 'ONLINE_MULTIPLAYER' || shouldConnect,
        () => gameState,
        getCurrentReplayFullSync,
        targetIP,
        targetPort
    );

    useEffect(() => {
        onlineRef.current = online;
    }, [online]);

    useEffect(() => {
        if (online.connectionStatus !== 'connected') {
            lastSentReplayRevisionRef.current = -1;
            pendingReplayFullSyncRef.current = true;
            nextReplaySyncReasonRef.current = 'INITIAL';
        }
    }, [online.connectionStatus]);

    const networkDispatch = useCallback(
        (action: GameAction) => {
            logRendererMessage('info', `[ACTION-RECORD] Type: ${action.type}`, action.payload);
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
                pendingReplayFullSyncRef.current = true;
                nextReplaySyncReasonRef.current = 'INITIAL';
                lastSentReplayRevisionRef.current = -1;
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
                reportRendererEvent(
                    {
                        category: 'network',
                        name: 'GUEST_INTENT_BLOCKED',
                        severity: 'warn',
                        message:
                            'Renderer blocked a guest action before it left the multiplayer boundary.',
                        context: createReasonTelemetryContext(
                            dispatchPlan.blockedGuestIntentReason,
                            {
                                actionType: action.type,
                            }
                        ),
                    },
                    {
                        consoleMessage: `[NET] Guest attempted to send non-protocol action ${action.type}.`,
                    }
                );
                publishStatusNotice(createUiStatusNotice(dispatchPlan.blockedGuestIntentReason));
            }

            if (dispatchPlan.blockedGuestIntentReason === 'NOT_GUEST_TURN') {
                reportRendererEvent(
                    {
                        category: 'network',
                        name: 'GUEST_INTENT_BLOCKED',
                        severity: 'warn',
                        message:
                            'Renderer blocked an out-of-turn guest action before network dispatch.',
                        context: createReasonTelemetryContext(
                            dispatchPlan.blockedGuestIntentReason,
                            {
                                actionType: action.type,
                            }
                        ),
                    },
                    {
                        consoleMessage: `[NET] Guest attempted ${action.type} outside of the guest turn.`,
                    }
                );
                publishStatusNotice(createUiStatusNotice(dispatchPlan.blockedGuestIntentReason));
            }
        },
        [gameState, localDispatch, online, publishStatusNotice, shouldConnect]
    );

    useHostStateSync({
        gameState,
        online,
        skipNextHostSyncRef,
        replayRecorder: localReplayRecorder,
        lastSentReplayRevisionRef,
        pendingReplayFullSyncRef,
        nextReplaySyncReasonRef,
    });

    const onlineWithApprovalLog = useMemo(
        () => ({
            ...online,
            approvalLog,
            statusNotice,
            authoritativeReplayRecorder: authoritativeReplayRecorderRef.current ?? null,
        }),
        [approvalLog, authoritativeReplayRevision, online, statusNotice]
    );

    return {
        online: onlineWithApprovalLog,
        networkDispatch,
    };
};
