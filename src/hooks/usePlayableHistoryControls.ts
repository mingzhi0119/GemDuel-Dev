import { useMemo } from 'react';
import { isHistoryTimeTravelBlocked } from '../logic/interactionAccess';
import type { GameMode } from '../types';

interface HistoryControls {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const usePlayableHistoryControls = <T extends HistoryControls>(
    mode: GameMode,
    historyControls: T
) =>
    useMemo(() => {
        const isBlocked = isHistoryTimeTravelBlocked(mode);

        return {
            ...historyControls,
            undo: () => !isBlocked && historyControls.canUndo && historyControls.undo(),
            redo: () => !isBlocked && historyControls.canRedo && historyControls.redo(),
            canUndo: !isBlocked && historyControls.canUndo,
            canRedo: !isBlocked && historyControls.canRedo,
        };
    }, [historyControls, mode]);
