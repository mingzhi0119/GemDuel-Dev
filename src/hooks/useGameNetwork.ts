import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameState, GameAction } from '../types';
import type { HostApprovalLogEntry, PendingGuestIntent } from '../types/network';
import { useOnlineManager, type OnlineManagerController } from './useOnlineManager';
import {
    createGuestIntentRequestId,
    resolveNetworkDispatchPlan,
} from '../logic/networkDispatchPolicy';
import { useHostStateSync } from './gameNetwork/useHostStateSync';
import { useNetworkEventHandlers } from './gameNetwork/useNetworkEventHandlers';

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
            }
        },
        [gameState, localDispatch, online, shouldConnect]
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
        }),
        [approvalLog, online]
    );

    return {
        online: onlineWithApprovalLog,
        networkDispatch,
    };
};
