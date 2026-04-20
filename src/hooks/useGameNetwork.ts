import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameState, GameAction, type UiStatusNotice } from '../types';
import type { HostApprovalLogEntry, PendingGuestIntent } from '../types/network';
import { createReasonTelemetryContext, createUiStatusNotice } from '../logic/reasonCatalog';
import { useOnlineManager, type OnlineManagerController } from './useOnlineManager';
import {
    createGuestIntentRequestId,
    resolveNetworkDispatchPlan,
} from '../logic/networkDispatchPolicy';
import { useHostStateSync } from './gameNetwork/useHostStateSync';
import { useNetworkEventHandlers } from './gameNetwork/useNetworkEventHandlers';
import { reportReleaseHealth } from '../observability/releaseHealth';

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
    const [statusNotice, setStatusNotice] = useState<UiStatusNotice | null>(null);

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
                reportReleaseHealth({
                    category: 'network',
                    name: 'GUEST_INTENT_BLOCKED',
                    severity: 'warn',
                    message:
                        'Renderer blocked a guest action before it left the multiplayer boundary.',
                    context: createReasonTelemetryContext(dispatchPlan.blockedGuestIntentReason, {
                        actionType: action.type,
                    }),
                });
                publishStatusNotice(createUiStatusNotice(dispatchPlan.blockedGuestIntentReason));
            }

            if (dispatchPlan.blockedGuestIntentReason === 'NOT_GUEST_TURN') {
                console.warn(`[NET] Guest attempted ${action.type} outside of the guest turn.`);
                reportReleaseHealth({
                    category: 'network',
                    name: 'GUEST_INTENT_BLOCKED',
                    severity: 'warn',
                    message:
                        'Renderer blocked an out-of-turn guest action before network dispatch.',
                    context: createReasonTelemetryContext(dispatchPlan.blockedGuestIntentReason, {
                        actionType: action.type,
                    }),
                });
                publishStatusNotice(createUiStatusNotice(dispatchPlan.blockedGuestIntentReason));
            }
        },
        [gameState, localDispatch, online, publishStatusNotice, shouldConnect]
    );

    useHostStateSync({
        gameState,
        online,
        skipNextHostSyncRef,
    });

    const onlineWithApprovalLog = useMemo(
        () => ({
            ...online,
            approvalLog,
            statusNotice,
        }),
        [approvalLog, online, statusNotice]
    );

    return {
        online: onlineWithApprovalLog,
        networkDispatch,
    };
};
