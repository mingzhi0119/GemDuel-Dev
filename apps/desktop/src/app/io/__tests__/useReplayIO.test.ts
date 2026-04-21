import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReplayFile } from '@gemduel/shared/types';
import { useReplayIO } from '../useReplayIO';

const reportRendererEvent = vi.fn();
const importReplayFromFile = vi.fn();

vi.mock('../../../observability/rendererLogger', () => ({
    reportRendererEvent: (...args: unknown[]) => reportRendererEvent(...args),
}));

vi.mock('../safeReplayImport', () => ({
    importReplayFromFile: (...args: unknown[]) => importReplayFromFile(...args),
}));

describe('useReplayIO', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-04-20T12:34:56.000Z'));
    });

    it('downloads the current replay history as a JSON blob', () => {
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

        const history = [{ type: 'INIT' }] as ReplayFile['history'];
        const { handleDownloadReplay } = useReplayIO({
            appVersion: '5.2.11',
            history,
            importHistory,
        });

        handleDownloadReplay();

        expect(createObjectURL).toHaveBeenCalledTimes(1);
        expect(anchor.href).toBe('blob:replay');
        expect(anchor.download).toBe('GemDuel_Replay_1776688496000.json');
        expect(click).toHaveBeenCalledTimes(1);
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:replay');
    });

    it('imports a valid replay and clears the file input afterwards', async () => {
        const importHistory = vi.fn();
        const history = [{ type: 'INIT' }] as ReplayFile['history'];
        const file = new File(['{}'], 'replay.json', { type: 'application/json' });
        const input = document.createElement('input');
        input.value = 'fake-path';
        Object.defineProperty(input, 'files', {
            configurable: true,
            value: [file],
        });
        importReplayFromFile.mockResolvedValue({
            ok: true,
            replay: {
                version: '5.2.11',
                timestamp: '2026-04-20T12:34:56.000Z',
                history,
            },
        });

        const { handleUploadReplay } = useReplayIO({
            appVersion: '5.2.11',
            history: [],
            importHistory,
        });

        await handleUploadReplay({
            target: input,
        } as Parameters<typeof handleUploadReplay>[0]);

        expect(importReplayFromFile).toHaveBeenCalledWith(file);
        expect(importHistory).toHaveBeenCalledWith(history);
        expect(input.value).toBe('');
        expect(reportRendererEvent).not.toHaveBeenCalled();
    });

    it('reports rejected replay imports and clears the file input', async () => {
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
            appVersion: '5.2.11',
            history: [],
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
        const importHistory = vi.fn();
        const input = document.createElement('input');
        Object.defineProperty(input, 'files', {
            configurable: true,
            value: [],
        });

        const { handleUploadReplay } = useReplayIO({
            appVersion: '5.2.11',
            history: [],
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
