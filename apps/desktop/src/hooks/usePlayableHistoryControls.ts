import { useMemo } from 'react';
import { isHistoryTimeTravelBlocked } from '@gemduel/shared/logic/interactionAccess';
import type { GameMode } from '@gemduel/shared/types';

interface HistoryControls {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const usePlayableHistoryControls = <T extends HistoryControls>(
    mode: GameMode,
    historyControls: T,
    allowTimeTravel = false
) =>
    useMemo(() => {
        const isBlocked = !allowTimeTravel && isHistoryTimeTravelBlocked(mode);

        return {
            ...historyControls,
            undo: () => !isBlocked && historyControls.canUndo && historyControls.undo(),
            redo: () => !isBlocked && historyControls.canRedo && historyControls.redo(),
            canUndo: !isBlocked && historyControls.canUndo,
            canRedo: !isBlocked && historyControls.canRedo,
        };
    }, [allowTimeTravel, historyControls, mode]);
