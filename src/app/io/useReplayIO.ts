import type { ChangeEventHandler } from 'react';
import type { ReplayFile } from '../../types';
import { MAX_REPLAY_FILE_BYTES, parseReplayFile } from '../../logic/replayImport';
import type { GameLogicController } from '../types';

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

    const handleUploadReplay: ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_REPLAY_FILE_BYTES) {
            console.error('Replay file is too large to import safely.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            try {
                if (typeof loadEvent.target?.result !== 'string') {
                    console.error('Replay file could not be read as text.');
                    return;
                }

                const parsedJson = JSON.parse(loadEvent.target.result);
                const replay = parseReplayFile(parsedJson);
                if (!replay.ok) {
                    console.error(`Replay import rejected: ${replay.reason}`);
                    return;
                }

                importHistory(replay.replay.history);
            } catch (err) {
                console.error('Failed to parse replay file', err);
            }
        };
        reader.readAsText(file);
    };

    return { handleDownloadReplay, handleUploadReplay };
};
