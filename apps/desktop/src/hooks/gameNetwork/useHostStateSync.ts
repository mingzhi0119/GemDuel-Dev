import { useEffect, useRef, type MutableRefObject } from 'react';
import { shouldSendHostStateSync } from '@gemduel/shared/logic/networkDispatchPolicy';
import { createRemoteMultiplayerViewForHost } from '@gemduel/shared/logic/multiplayerVisibility';
import type { GameState } from '@gemduel/shared/types';
import type { NetworkSyncReason } from '@gemduel/shared/types/network';
import type { buildReplayRecorderFromHistory } from '@gemduel/shared/replay';
import type { OnlineManagerController } from '../useOnlineManager';

interface UseHostStateSyncArgs {
    gameState: GameState;
    online: OnlineManagerController;
    skipNextHostSyncRef: MutableRefObject<boolean>;
    replayRecorder: ReturnType<typeof buildReplayRecorderFromHistory>;
    lastSentReplayRevisionRef: MutableRefObject<number>;
    pendingReplayFullSyncRef: MutableRefObject<boolean>;
    nextReplaySyncReasonRef: MutableRefObject<NetworkSyncReason>;
}

export const useHostStateSync = ({
    gameState,
    online,
    skipNextHostSyncRef,
    replayRecorder,
    lastSentReplayRevisionRef,
    pendingReplayFullSyncRef,
    nextReplaySyncReasonRef,
}: UseHostStateSyncArgs) => {
    const lastSentGameStateRef = useRef<GameState | null>(null);

    useEffect(() => {
        if (!replayRecorder.init) {
            return;
        }

        if (shouldSendHostStateSync(gameState, skipNextHostSyncRef.current)) {
            const replayRevision = replayRecorder.replayRevision;
            const shouldSendFull =
                pendingReplayFullSyncRef.current || lastSentReplayRevisionRef.current < 0;
            const hasUnsentReplayRevision = replayRevision > lastSentReplayRevisionRef.current;
            const hasUnsentGameState = lastSentGameStateRef.current !== gameState;

            if (!shouldSendFull && !hasUnsentReplayRevision && !hasUnsentGameState) {
                return;
            }

            const reason = shouldSendFull ? nextReplaySyncReasonRef.current : 'TURN_SYNC';
            online.sendState(createRemoteMultiplayerViewForHost(gameState), reason);
            pendingReplayFullSyncRef.current = false;
            nextReplaySyncReasonRef.current = 'TURN_SYNC';
            lastSentReplayRevisionRef.current = replayRevision;
            lastSentGameStateRef.current = gameState;
            return;
        }

        if (skipNextHostSyncRef.current) {
            skipNextHostSyncRef.current = false;
        }
    }, [
        gameState,
        lastSentReplayRevisionRef,
        nextReplaySyncReasonRef,
        online,
        pendingReplayFullSyncRef,
        replayRecorder,
        skipNextHostSyncRef,
    ]);
};
