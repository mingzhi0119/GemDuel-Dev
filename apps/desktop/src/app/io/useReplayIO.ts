import type { ChangeEventHandler } from 'react';
import type { GameLogicController } from '@app/types/ui';
import {
    buildIdentityRuntimeToInstanceMap,
    loadReplaySession,
    saveReplayVNext,
    type ReplayEndReason,
    type ReplayVNext,
} from '@gemduel/shared/replay';
import { reportRendererEvent } from '../../observability/rendererLogger';
import { importReplayFromFile } from './safeReplayImport';

interface UseReplayIOOptions {
    replay: ReplayVNext | null;
    importHistory: GameLogicController['handlers']['importHistory'];
    onReplayImportSuccess?: () => void;
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

const getReplayExportEndReason = (replay: ReplayVNext): ReplayEndReason | undefined =>
    replay.match.endReason === 'aborted' ||
    replay.match.endReason === 'disconnect' ||
    replay.match.endReason === 'surrender'
        ? replay.match.endReason
        : undefined;

const normalizeReplayForExport = (targetReplay: ReplayVNext): ReplayVNext => {
    const session = loadReplaySession(targetReplay);
    return saveReplayVNext({
        replayRevision: targetReplay.replayRevision,
        gameVersion: targetReplay.gameVersion,
        createdAt: targetReplay.createdAt,
        init: targetReplay.init,
        events: targetReplay.events,
        checkpoints: targetReplay.checkpoints ?? [],
        currentState: session.finalState,
        runtimeToInstance: buildIdentityRuntimeToInstanceMap(targetReplay.init.cardInstances),
        endReason: getReplayExportEndReason(targetReplay),
    });
};

const reportReplayExportFailure = (fileName: string, error: unknown) => {
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
};

export const useReplayIO = ({
    replay,
    importHistory,
    onReplayImportSuccess,
}: UseReplayIOOptions) => {
    const persistReplayToProjectFolder = async (targetReplay: ReplayVNext | null = replay) => {
        if (!targetReplay || !window.electron?.saveReplayToFolder) {
            return null;
        }

        let fileName = buildReplayExportFileName(targetReplay);
        try {
            const exportReplay = normalizeReplayForExport(targetReplay);
            fileName = buildReplayExportFileName(exportReplay);
            const result = await window.electron.saveReplayToFolder({
                fileName,
                contents: JSON.stringify(exportReplay),
            });
            return result.path;
        } catch (error) {
            reportReplayExportFailure(fileName, error);
            return null;
        }
    };

    const handleDownloadReplay = () => {
        if (!replay) {
            return;
        }

        let fileName = buildReplayExportFileName(replay);
        try {
            const exportReplay = normalizeReplayForExport(replay);
            fileName = buildReplayExportFileName(exportReplay);
            if (window.electron?.saveReplayToFolder) {
                void persistReplayToProjectFolder(exportReplay);
                return;
            }

            triggerBrowserDownload(exportReplay, fileName);
        } catch (error) {
            reportReplayExportFailure(fileName, error);
        }
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

        onReplayImportSuccess?.();
        importHistory(replayImport.session.history);
        event.target.value = '';
    };

    return { handleDownloadReplay, handleUploadReplay, persistReplayToProjectFolder };
};
