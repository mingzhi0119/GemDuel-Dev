import { useCallback, useRef, useState } from 'react';
import type { GameState } from '@gemduel/shared/types';
import {
    applyReplaySyncToRecorder,
    buildReplayFullSync,
    createReplayRecorderInternalState,
    generateReplayStateHash,
    replaceReplayRecorderFromReplay,
    type ReplayFullSync,
    type ReplaySync,
} from '@gemduel/shared/replay';
import type { RecoveryReason } from '@gemduel/shared/types/network';

interface UseAuthoritativeReplaySyncArgs {
    gameState: GameState;
    localReplayRecorder: ReturnType<typeof createReplayRecorderInternalState>;
}

export const useAuthoritativeReplaySync = ({
    gameState,
    localReplayRecorder,
}: UseAuthoritativeReplaySyncArgs) => {
    const authoritativeReplayRecorderRef = useRef<ReturnType<
        typeof createReplayRecorderInternalState
    > | null>(null);
    const [, setAuthoritativeReplayRevision] = useState(0);

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
                if (current && replaySync.replayRevision <= current.replayRevision) {
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
            if (!current) return 'STALE_PACKET';
            if (replaySync.toRevision <= current.replayRevision) return null;
            if (replaySync.fromRevision !== current.replayRevision) return 'STALE_PACKET';

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

    return {
        authoritativeReplayRecorder: authoritativeReplayRecorderRef.current,
        getCurrentReplayFullSync,
        replaceAuthoritativeReplay,
        syncAuthoritativeReplay,
    };
};
