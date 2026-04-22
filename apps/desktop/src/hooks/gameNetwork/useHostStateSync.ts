import { useEffect, type MutableRefObject } from 'react';
import { shouldSendHostStateSync } from '@gemduel/shared/logic/networkDispatchPolicy';
import type { GameState } from '@gemduel/shared/types';
import { buildReplayDeltaSync, buildReplayFullSync } from '@gemduel/shared/replay';
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
    useEffect(() => {
        if (!replayRecorder.init) {
            return;
        }

        if (shouldSendHostStateSync(gameState, skipNextHostSyncRef.current)) {
            const shouldSendFull =
                pendingReplayFullSyncRef.current || lastSentReplayRevisionRef.current < 0;
            const replaySync = shouldSendFull
                ? buildReplayFullSync(replayRecorder, gameState)
                : buildReplayDeltaSync(
                      replayRecorder,
                      gameState,
                      lastSentReplayRevisionRef.current
                  );
            const reason = shouldSendFull ? nextReplaySyncReasonRef.current : 'TURN_SYNC';
            online.sendState(gameState, reason, replaySync);
            pendingReplayFullSyncRef.current = false;
            nextReplaySyncReasonRef.current = 'TURN_SYNC';
            lastSentReplayRevisionRef.current = replayRecorder.replayRevision;
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
