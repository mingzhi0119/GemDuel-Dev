import type { ChangeEventHandler } from 'react';
import type { GameLogicController } from '@app/types/ui';
import type { ReplayVNext } from '@gemduel/shared/replay';
import { reportRendererEvent } from '../../observability/rendererLogger';
import { importReplayFromFile } from './safeReplayImport';

interface UseReplayIOOptions {
    replay: ReplayVNext | null;
    importHistory: GameLogicController['handlers']['importHistory'];
}

const buildReplayExportFileName = (
    replay: ReplayVNext,
    fallbackTimestamp = new Date().getTime()
) => {
    const createdAtTimestamp = Number.parseInt(String(Date.parse(replay.createdAt)), 10);
    const timestamp = Number.isFinite(createdAtTimestamp) ? createdAtTimestamp : fallbackTimestamp;
    return `GemDuel_Replay_v1_${timestamp}_${replay.summary.finalStateHash}.json`;
};

const triggerBrowserDownload = (replay: ReplayVNext, fileName: string) => {
    const blob = new Blob([JSON.stringify(replay)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
};

export const useReplayIO = ({ replay, importHistory }: UseReplayIOOptions) => {
    const persistReplayToProjectFolder = async (targetReplay: ReplayVNext | null = replay) => {
        if (!targetReplay || !window.electron?.saveReplayToFolder) {
            return null;
        }

        const fileName = buildReplayExportFileName(targetReplay);
        try {
            const result = await window.electron.saveReplayToFolder({
                fileName,
                contents: JSON.stringify(targetReplay),
            });
            return result.path;
        } catch (error) {
            reportRendererEvent(
                {
                    category: 'runtime',
                    name: 'REPLAY_EXPORT_FAILED',
                    severity: 'warn',
                    message: 'Replay export failed.',
                    context: {
                        fileName,
                    },
                },
                {
                    consoleMessage: `Replay export failed: ${fileName}`,
                    consoleDetails: error,
                }
            );
            return null;
        }
    };

    const handleDownloadReplay = () => {
        if (!replay) {
            return;
        }

        if (window.electron?.saveReplayToFolder) {
            void persistReplayToProjectFolder(replay);
            return;
        }

        triggerBrowserDownload(replay, buildReplayExportFileName(replay));
    };

    const handleUploadReplay: ChangeEventHandler<HTMLInputElement> = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const replayImport = await importReplayFromFile(file);
        if (!replayImport.ok) {
            reportRendererEvent(
                {
                    category: 'security',
                    name: 'REPLAY_IMPORT_REJECTED',
                    severity: 'warn',
                    message: replayImport.message,
                    context: {
                        reasonCode: replayImport.code,
                    },
                },
                {
                    consoleMessage: `Replay import rejected [${replayImport.code}]: ${replayImport.message}`,
                    consoleDetails: replayImport.detail,
                }
            );
            event.target.value = '';
            return;
        }

        importHistory(replayImport.session.history);
        event.target.value = '';
    };

    return { handleDownloadReplay, handleUploadReplay, persistReplayToProjectFolder };
};
