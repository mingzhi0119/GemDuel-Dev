import { useEffect, type MutableRefObject } from 'react';
import { shouldSendHostStateSync } from '@gemduel/shared/logic/networkDispatchPolicy';
import type { GameState } from '@gemduel/shared/types';
import type { OnlineManagerController } from '../useOnlineManager';

interface UseHostStateSyncArgs {
    gameState: GameState;
    online: OnlineManagerController;
    skipNextHostSyncRef: MutableRefObject<boolean>;
}

export const useHostStateSync = ({
    gameState,
    online,
    skipNextHostSyncRef,
}: UseHostStateSyncArgs) => {
    useEffect(() => {
        if (shouldSendHostStateSync(gameState, skipNextHostSyncRef.current)) {
            online.sendState(gameState, 'TURN_SYNC');
            return;
        }

        if (skipNextHostSyncRef.current) {
            skipNextHostSyncRef.current = false;
        }
    }, [gameState, online, skipNextHostSyncRef]);
};
