import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ElectronBridge } from '@gemduel/shared/types/desktop';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import { applyAction } from '@gemduel/shared/logic/gameReducer';
import { createGameSetupPayload } from '@gemduel/shared/logic/gameSetup';
import {
    buildReplayInitSnapshot,
    loadReplaySession,
    readReplayVNext,
    saveReplayVNext,
    type ReplayVNext,
} from '@gemduel/shared/replay';
import { useReplayIO } from '../useReplayIO';

const reportRendererEvent = vi.fn();
const importReplayFromFile = vi.fn();

vi.mock('../../../observability/rendererLogger', () => ({
    reportRendererEvent: (...args: unknown[]) => reportRendererEvent(...args),
}));

vi.mock('../safeReplayImport', () => ({
    importReplayFromFile: (...args: unknown[]) => importReplayFromFile(...args),
}));

const createReplayFixture = (): ReplayVNext => {
    const setup = createGameSetupPayload('LOCAL_PVP');
    const initAction = { type: 'INIT', payload: setup } as const;
    const nextState = applyAction(INITIAL_STATE_SKELETON, initAction);
    if (!nextState) {
        throw new Error('Failed to build replay test fixture.');
    }

    const { init, runtimeToInstance } = buildReplayInitSnapshot(initAction, nextState);
    return saveReplayVNext({
        replayRevision: 0,
        gameVersion: '5.2.11',
        createdAt: '2026-04-20T12:34:56.000Z',
        init,
        events: [],
        currentState: nextState,
        runtimeToInstance,
    });
};

describe('useReplayIO', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-04-20T12:34:56.000Z'));
        delete window.electron;
    });

    it('downloads the current Replay vNext payload as compact JSON', () => {
        const replay = createReplayFixture();
        const importHistory = vi.fn();
        const originalCreateElement = document.createElement.bind(document);
        const click = vi.fn();
        const anchor = originalCreateElement('a');
        anchor.click = click;
        const createObjectURL = vi.fn(() => 'blob:replay');
        const revokeObjectURL = vi.fn();

        vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
            if (tagName === 'a') {
                return anchor;
            }
            return originalCreateElement(tagName);
        }) as typeof document.createElement);
        Object.defineProperty(URL, 'createObjectURL', {
            configurable: true,
            value: createObjectURL,
        });
        Object.defineProperty(URL, 'revokeObjectURL', {
            configurable: true,
            value: revokeObjectURL,
        });

        const { handleDownloadReplay } = useReplayIO({
            replay,
            importHistory,
        });

        handleDownloadReplay();

        expect(createObjectURL).toHaveBeenCalledTimes(1);
        expect(anchor.href).toBe('blob:replay');
        expect(anchor.download).toMatch(/^GemDuel_Replay_v1_1776688496000_[a-z0-9]+\.json$/);
        expect(click).toHaveBeenCalledTimes(1);
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:replay');
    });

    it('persists the replay into the governed desktop replay folder when the Electron bridge is available', async () => {
        const replay = createReplayFixture();
        const importHistory = vi.fn();
        const saveReplayToFolder = vi.fn().mockResolvedValue({
            path: 'E:\\GemDuel-Dev\\Replay\\GemDuel_Replay_v1_1776688496000_test.json',
        });

        window.electron = {
            saveReplayToFolder,
        } as Partial<ElectronBridge> as ElectronBridge;

        const { handleDownloadReplay, persistReplayToProjectFolder } = useReplayIO({
            replay,
            importHistory,
        });

        handleDownloadReplay();
        await persistReplayToProjectFolder(replay);

        expect(saveReplayToFolder).toHaveBeenCalledTimes(2);
        expect(saveReplayToFolder).toHaveBeenLastCalledWith(
            expect.objectContaining({
                fileName: expect.stringMatching(
                    /^GemDuel_Replay_v1_1776688496000_[a-z0-9]+\.json$/
                ),
                contents: JSON.stringify(replay),
            })
        );
    });

    it('normalizes replay summary metadata before persisting exported JSON', async () => {
        const replay = createReplayFixture();
        const staleReplay = {
            ...replay,
            summary: {
                ...replay.summary,
                winner: 'p1',
                endReason: 'normal',
                finalStateHash: 'stale-hash',
            },
        } satisfies ReplayVNext;
        const importHistory = vi.fn();
        const saveReplayToFolder = vi.fn().mockResolvedValue({
            path: 'E:\\GemDuel-Dev\\Replay\\GemDuel_Replay_v1_1776688496000_test.json',
        });

        window.electron = {
            saveReplayToFolder,
        } as Partial<ElectronBridge> as ElectronBridge;

        const { persistReplayToProjectFolder } = useReplayIO({
            replay: staleReplay,
            importHistory,
        });

        await persistReplayToProjectFolder(staleReplay);

        const payload = saveReplayToFolder.mock.calls[0]?.[0];
        expect(payload).toBeDefined();
        const { replay: savedReplay, diagnostics } = readReplayVNext(payload.contents, {
            verifySummary: 'sample',
        });

        expect(diagnostics.summaryIntegrity).toBe('ok');
        expect(savedReplay.summary.finalStateHash).not.toBe('stale-hash');
        expect(savedReplay.summary.finalStateHash).toBe(
            loadReplaySession(savedReplay).finalStateHash
        );
    });

    it('reports replay export failures from the Electron bridge', async () => {
        const replay = createReplayFixture();
        const importHistory = vi.fn();
        const saveReplayToFolder = vi.fn().mockRejectedValue(new Error('disk full'));

        window.electron = {
            saveReplayToFolder,
        } as Partial<ElectronBridge> as ElectronBridge;

        const { persistReplayToProjectFolder } = useReplayIO({
            replay,
            importHistory,
        });

        await expect(persistReplayToProjectFolder(replay)).resolves.toBeNull();

        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'runtime',
                name: 'REPLAY_EXPORT_FAILED',
                severity: 'warn',
            }),
            expect.objectContaining({
                consoleMessage: expect.stringContaining(
                    'Replay export failed: GemDuel_Replay_v1_1776688496000_'
                ),
                consoleDetails: expect.any(Error),
            })
        );
    });

    it('imports a valid replay session and clears the file input afterwards', async () => {
        const replay = createReplayFixture();
        const session = loadReplaySession(replay);
        const importHistory = vi.fn();
        const onReplayImportSuccess = vi.fn();
        const file = new File(['{}'], 'replay.json', { type: 'application/json' });
        const input = document.createElement('input');
        input.value = 'fake-path';
        Object.defineProperty(input, 'files', {
            configurable: true,
            value: [file],
        });
        importReplayFromFile.mockResolvedValue({
            ok: true,
            replay,
            session,
            diagnostics: {
                detectedVersion: '1.0',
                summaryIntegrity: 'ok',
            },
        });

        const { handleUploadReplay } = useReplayIO({
            replay,
            importHistory,
            onReplayImportSuccess,
        });

        await handleUploadReplay({
            target: input,
        } as Parameters<typeof handleUploadReplay>[0]);

        expect(importReplayFromFile).toHaveBeenCalledWith(file);
        expect(onReplayImportSuccess).toHaveBeenCalledTimes(1);
        expect(onReplayImportSuccess.mock.invocationCallOrder[0]).toBeLessThan(
            importHistory.mock.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY
        );
        expect(importHistory).toHaveBeenCalledWith(session.history);
        expect(input.value).toBe('');
        expect(reportRendererEvent).not.toHaveBeenCalled();
    });

    it('reports rejected replay imports and clears the file input', async () => {
        const replay = createReplayFixture();
        const importHistory = vi.fn();
        const file = new File(['{}'], 'replay.json', { type: 'application/json' });
        const input = document.createElement('input');
        input.value = 'fake-path';
        Object.defineProperty(input, 'files', {
            configurable: true,
            value: [file],
        });
        importReplayFromFile.mockResolvedValue({
            ok: false,
            boundaryId: 'replay-local-file-read',
            code: 'REPLAY_FILE_INVALID_JSON',
            message: 'Replay file could not be parsed as JSON text.',
            detail: 'Unexpected token',
            runtimeSignal: 'REPLAY_BOUNDARY_REJECTED',
        });

        const { handleUploadReplay } = useReplayIO({
            replay,
            importHistory,
        });

        await handleUploadReplay({
            target: input,
        } as Parameters<typeof handleUploadReplay>[0]);

        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'security',
                name: 'REPLAY_IMPORT_REJECTED',
                severity: 'warn',
            }),
            expect.objectContaining({
                consoleMessage:
                    'Replay import rejected [REPLAY_FILE_INVALID_JSON]: Replay file could not be parsed as JSON text.',
                consoleDetails: 'Unexpected token',
            })
        );
        expect(importHistory).not.toHaveBeenCalled();
        expect(input.value).toBe('');
    });

    it('returns early when no file was selected', async () => {
        const replay = createReplayFixture();
        const importHistory = vi.fn();
        const input = document.createElement('input');
        Object.defineProperty(input, 'files', {
            configurable: true,
            value: [],
        });

        const { handleUploadReplay } = useReplayIO({
            replay,
            importHistory,
        });

        await handleUploadReplay({
            target: input,
        } as Parameters<typeof handleUploadReplay>[0]);

        expect(importReplayFromFile).not.toHaveBeenCalled();
        expect(importHistory).not.toHaveBeenCalled();
        expect(reportRendererEvent).not.toHaveBeenCalled();
    });
});
