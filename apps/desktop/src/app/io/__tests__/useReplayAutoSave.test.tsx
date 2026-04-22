import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import { applyAction } from '@gemduel/shared/logic/gameReducer';
import { createGameSetupPayload } from '@gemduel/shared/logic/gameSetup';
import {
    buildReplayInitSnapshot,
    saveReplayVNext,
    type ReplayVNext,
} from '@gemduel/shared/replay';
import { useReplayAutoSave } from '../useReplayAutoSave';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createReplayFixture = (ended = true): ReplayVNext => {
    const setup = createGameSetupPayload('LOCAL_PVP');
    const initAction = { type: 'INIT', payload: setup } as const;
    const nextState = applyAction(INITIAL_STATE_SKELETON, initAction);
    if (!nextState) {
        throw new Error('Failed to build replay auto-save fixture.');
    }

    const { init, runtimeToInstance } = buildReplayInitSnapshot(initAction, nextState);
    const replay = saveReplayVNext({
        replayRevision: 0,
        gameVersion: '5.2.11',
        createdAt: '2026-04-20T12:34:56.000Z',
        init,
        events: [],
        currentState: nextState,
        runtimeToInstance,
    });

    return ended
        ? {
              ...replay,
              match: {
                  ...replay.match,
                  ended: true,
                  winner: 'p1',
                  endReason: 'normal',
              },
              summary: {
                  ...replay.summary,
                  winner: 'p1',
                  endReason: 'normal',
              },
          }
        : replay;
};

describe('useReplayAutoSave', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderHarness = ({
        replay,
        historyLength,
        historySource,
        persistReplayToProjectFolder,
    }: {
        replay: ReplayVNext | null;
        historyLength: number;
        historySource: 'live' | 'replay-import';
        persistReplayToProjectFolder: (replay: ReplayVNext | null) => Promise<string | null>;
    }) => {
        const Harness = () => {
            useReplayAutoSave({
                replay,
                historyLength,
                historySource,
                persistReplayToProjectFolder,
            });
            return null;
        };

        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);
        }

        act(() => {
            root?.render(React.createElement(Harness));
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('auto-saves a finished live replay exactly once per match', async () => {
        const replay = createReplayFixture(true);
        const persistReplayToProjectFolder = vi.fn().mockResolvedValue('E:\\GemDuel-Dev\\Replay\\match.json');

        renderHarness({
            replay,
            historyLength: 2,
            historySource: 'live',
            persistReplayToProjectFolder,
        });
        await vi.waitFor(() => {
            expect(persistReplayToProjectFolder).toHaveBeenCalledTimes(1);
        });

        renderHarness({
            replay,
            historyLength: 2,
            historySource: 'live',
            persistReplayToProjectFolder,
        });
        await vi.waitFor(() => {
            expect(persistReplayToProjectFolder).toHaveBeenCalledTimes(1);
        });
    });

    it('skips imported replay sessions and retries only after history resets', async () => {
        const replay = createReplayFixture(true);
        const persistReplayToProjectFolder = vi.fn().mockResolvedValue('E:\\GemDuel-Dev\\Replay\\match.json');

        renderHarness({
            replay,
            historyLength: 2,
            historySource: 'replay-import',
            persistReplayToProjectFolder,
        });
        await Promise.resolve();
        expect(persistReplayToProjectFolder).not.toHaveBeenCalled();

        renderHarness({
            replay: null,
            historyLength: 0,
            historySource: 'live',
            persistReplayToProjectFolder,
        });

        renderHarness({
            replay,
            historyLength: 2,
            historySource: 'live',
            persistReplayToProjectFolder,
        });
        await vi.waitFor(() => {
            expect(persistReplayToProjectFolder).toHaveBeenCalledTimes(1);
        });
    });
});
