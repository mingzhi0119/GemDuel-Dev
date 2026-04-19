import type { ChangeEventHandler } from 'react';
import type { ReplayFile } from '../../types';
import type { GameLogicController } from '../types';
import { importReplayFromFile } from './safeReplayImport';

interface UseReplayIOOptions {
    appVersion: string;
    history: GameLogicController['historyControls']['history'];
    importHistory: GameLogicController['handlers']['importHistory'];
}

export const useReplayIO = ({ appVersion, history, importHistory }: UseReplayIOOptions) => {
    const handleDownloadReplay = () => {
        const data: ReplayFile = {
            version: appVersion,
            timestamp: new Date().toISOString(),
            history,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `GemDuel_Replay_${new Date().getTime()}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const handleUploadReplay: ChangeEventHandler<HTMLInputElement> = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const replayImport = await importReplayFromFile(file);
        if (!replayImport.ok) {
            console.error(
                `Replay import rejected [${replayImport.code}]: ${replayImport.message}`,
                replayImport.detail
            );
            event.target.value = '';
            return;
        }

        importHistory(replayImport.replay.history);
        event.target.value = '';
    };

    return { handleDownloadReplay, handleUploadReplay };
};
