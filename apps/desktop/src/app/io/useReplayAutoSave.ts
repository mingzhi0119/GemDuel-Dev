import { useEffect } from 'react';
import type { ReplayVNext } from '@gemduel/shared/replay';

interface UseReplayAutoSaveOptions {
    replay: ReplayVNext | null;
    historyLength: number;
    historySource: 'live' | 'replay-import';
    persistReplayToProjectFolder: (replay: ReplayVNext | null) => Promise<string | null>;
}

const autoSavedReplayKeys = new Set<string>();
const pendingReplayKeys = new Set<string>();

export const useReplayAutoSave = ({
    replay,
    historyLength,
    historySource,
    persistReplayToProjectFolder,
}: UseReplayAutoSaveOptions) => {
    useEffect(() => {
        if (historyLength > 0) {
            return;
        }

        autoSavedReplayKeys.clear();
        pendingReplayKeys.clear();
    }, [historyLength]);

    useEffect(() => {
        if (!replay?.match.ended || historySource !== 'live') {
            return;
        }

        const replayKey = `${replay.createdAt}:${replay.summary.finalStateHash}`;
        if (autoSavedReplayKeys.has(replayKey) || pendingReplayKeys.has(replayKey)) {
            return;
        }

        autoSavedReplayKeys.add(replayKey);
        pendingReplayKeys.add(replayKey);
        void persistReplayToProjectFolder(replay)
            .then((savedPath) => {
                if (!savedPath) {
                    autoSavedReplayKeys.delete(replayKey);
                }
            })
            .finally(() => {
                pendingReplayKeys.delete(replayKey);
            });
    }, [historySource, persistReplayToProjectFolder, replay]);
};
