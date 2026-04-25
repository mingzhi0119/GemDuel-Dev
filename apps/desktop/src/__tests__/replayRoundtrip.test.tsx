// @vitest-environment happy-dom

import React, { useEffect, useMemo, useState } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppRouteProps, ResponsiveLayout } from '@app/types/ui';
import { parseReplayTextBoundary } from '../app/io/safeReplayImport';
import { useReplayAutoSave } from '../app/io/useReplayAutoSave';
import { useReplayIO } from '../app/io/useReplayIO';
import {
    getPersistentWinnerForUi,
    shouldAutoEnterReplayReview,
} from '../app/runtime/replayReviewState';
import { GameShell } from '../app/shell/GameShell';
import { useGameLogic } from '../hooks/useGameLogic';
import {
    createCompletedReplayFixture,
    createPeekModalReplayFixture,
    createSelectCardColorReplayFixture,
    type ReplayRoundtripFixture,
} from './fixtures/replayRoundtripFixtures';
import { getCrownCount, getPlayerScore } from '@gemduel/shared/logic/selectors';
import type { GameState, PlayerKey } from '@gemduel/shared/types';
import type { ElectronBridge, SaveReplayToFolderPayload } from '@gemduel/shared/types/desktop';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';

vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
}));

vi.mock('@gemduel/ui/components/UpdateNotification', () => ({
    UpdateNotification: () => null,
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type SaveReplayToFolderMock = ReturnType<typeof vi.fn>;

interface UiSnapshot {
    replay: {
        currentStep: number;
        historyLength: number;
        canUndo: boolean;
        canRedo: boolean;
    };
    score: Record<PlayerKey, number>;
    crowns: Record<PlayerKey, number>;
    turnCounts: Record<PlayerKey, number>;
    deckCounts: Record<'1' | '2' | '3', number>;
    marketSlots: Record<string, string>;
    board: Record<string, string>;
    reserved: Record<PlayerKey, number>;
}

const createLayout = (): ResponsiveLayout => ({
    layoutMode: 'desktop-4k',
    viewportWidth: 1920,
    viewportHeight: 1080,
    aspectRatio: 16 / 9,
    stageCanvasWidthPx: 1600,
    stageCanvasHeightPx: 900,
    stageScale: 1,
    stageInsetXPx: 32,
    stageInsetYPx: 24,
    boardScale: 1,
    deckScale: 1,
    zoneScale: 1,
    zoneHeightPx: 280,
    mainGapPx: 24,
});

const createLanController = (): AppRouteProps['lan'] =>
    ({
        state: {
            phase: 'idle',
            roomId: null,
            remoteInstanceId: null,
            remoteAddress: null,
            hostPort: null,
            transportHost: false,
            localSeat: null,
            selectedMode: null,
            hostPeerId: null,
            errorMessage: null,
            statusMessage: 'LAN duel is ready.',
        },
        launch: null,
        refresh: vi.fn(),
        startSearch: vi.fn(),
        cancelSearch: vi.fn(),
        selectMode: vi.fn(),
        confirmStart: vi.fn(),
        reportPeerReady: vi.fn(),
        clearLaunch: vi.fn(),
    }) as AppRouteProps['lan'];

const createElectronBridge = (
    saveReplayToFolder: SaveReplayToFolderMock
): Partial<ElectronBridge> =>
    ({
        saveReplayToFolder,
    }) satisfies Partial<ElectronBridge>;

function ReplayRoundtripHarness() {
    const [showDebug, setShowDebug] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [showRulebook, setShowRulebook] = useState(false);
    const [matchmakingRoute, setMatchmakingRoute] =
        useState<AppRouteProps['ui']['matchmakingRoute']>('none');
    const [isPeekingBoard, setIsPeekingBoard] = useState(false);
    const [persistentWinner, setPersistentWinner] = useState<PlayerKey | null>(null);
    const [showRestartConfirm, setShowRestartConfirm] = useState(false);

    const layout = useMemo(() => createLayout(), []);
    const lan = useMemo(() => createLanController(), []);
    const game = useGameLogic(false, 'localhost', isReviewing, 9000, '5.2.11');
    const { state, handlers, historyControls } = game;

    const desiredPersistentWinner = useMemo(
        () =>
            getPersistentWinnerForUi({
                winner: state.winner,
                historySource: historyControls.historySource,
                historyLength: historyControls.historyLength,
                currentIndex: historyControls.currentIndex,
            }),
        [
            historyControls.currentIndex,
            historyControls.historyLength,
            historyControls.historySource,
            state.winner,
        ]
    );

    useEffect(() => {
        setPersistentWinner((current) =>
            current === desiredPersistentWinner ? current : desiredPersistentWinner
        );
    }, [desiredPersistentWinner]);

    useEffect(() => {
        if (historyControls.historyLength === 0) {
            setPersistentWinner(null);
            setIsReviewing(false);
        }
    }, [historyControls.historyLength]);

    useEffect(() => {
        if (
            shouldAutoEnterReplayReview({
                historySource: historyControls.historySource,
                historyLength: historyControls.historyLength,
            })
        ) {
            setPersistentWinner(null);
            setIsReviewing(true);
        }
    }, [historyControls.historyLength, historyControls.historySource]);

    const { handleDownloadReplay, handleUploadReplay, persistReplayToProjectFolder } = useReplayIO({
        replay: game.replay.currentReplay,
        importHistory: handlers.importHistory,
    });

    useReplayAutoSave({
        replay: game.replay.currentReplay,
        historyLength: historyControls.historyLength,
        historySource: historyControls.historySource,
        persistReplayToProjectFolder,
    });

    return (
        <LocaleProvider locale="en" setLocale={() => undefined}>
            <GameShell
                appVersion="5.2.11"
                game={game}
                lan={lan}
                layout={layout}
                theme="dark"
                ui={{
                    showDebug,
                    isReviewing,
                    showRulebook,
                    matchmakingRoute,
                    isPeekingBoard,
                    persistentWinner,
                    showRestartConfirm,
                }}
                setters={{
                    setShowDebug,
                    setIsReviewing,
                    setShowRulebook,
                    setMatchmakingRoute,
                    setIsPeekingBoard,
                    setShowRestartConfirm,
                }}
                callbacks={{
                    handleRestart: () => {
                        handlers.importHistory([]);
                        setShowRestartConfirm(false);
                    },
                    handleDownloadReplay,
                    handleUploadReplay,
                    toggleTheme: () => undefined,
                }}
            />
        </LocaleProvider>
    );
}

const settleUi = async (ticks = 3) => {
    for (let index = 0; index < ticks; index += 1) {
        await act(async () => {
            await Promise.resolve();
            await new Promise((resolve) => window.setTimeout(resolve, 0));
        });
    }
};

const getRequiredElement = <T extends Element>(container: ParentNode, selector: string): T => {
    const element = container.querySelector(selector);
    if (!element) {
        throw new Error(`Expected element matching selector "${selector}".`);
    }
    return element as T;
};

const clickElement = async (element: HTMLElement) => {
    await act(async () => {
        element.click();
        await Promise.resolve();
    });
    await settleUi();
};

const openSettingsMenu = async (container: HTMLElement) => {
    await clickElement(
        getRequiredElement<HTMLButtonElement>(container, 'button[aria-label="Settings"]')
    );
};

const importReplayThroughUi = async (container: HTMLElement, exportedJson: string) => {
    await openSettingsMenu(container);
    const input = getRequiredElement<HTMLInputElement>(
        container,
        'label[aria-label="Load"] input[type="file"]'
    );
    const file = new File([exportedJson], 'replay-roundtrip.json', {
        type: 'application/json',
    });
    Object.defineProperty(file, 'text', {
        configurable: true,
        value: async () => exportedJson,
    });
    Object.defineProperty(input, 'files', {
        configurable: true,
        value: [file],
    });

    await act(async () => {
        input.dispatchEvent(new Event('change', { bubbles: true }));
        await Promise.resolve();
    });
    await settleUi(5);
};

const exportReplayThroughUi = async (
    container: HTMLElement,
    saveReplayToFolder: SaveReplayToFolderMock
) => {
    await openSettingsMenu(container);
    await clickElement(
        getRequiredElement<HTMLButtonElement>(container, 'button[aria-label="Save"]')
    );
    await settleUi(5);

    const lastCall = saveReplayToFolder.mock.calls.at(-1);
    if (!lastCall) {
        throw new Error('Expected saveReplayToFolder to be called.');
    }

    return lastCall[0];
};

const getSnapshotFromUi = (container: HTMLElement): UiSnapshot => {
    const replayCounter = getRequiredElement<HTMLElement>(
        container,
        '[data-replay-step-counter="true"]'
    );
    const marketSlots = Array.from(
        container.querySelectorAll<HTMLElement>('[data-market-slot]')
    ).reduce<Record<string, string>>((acc, element) => {
        const slot = element.dataset.marketSlot;
        if (slot) {
            acc[slot] = element.dataset.cardId ?? 'empty';
        }
        return acc;
    }, {});
    const board = Array.from(container.querySelectorAll<HTMLElement>('[data-board-cell]')).reduce<
        Record<string, string>
    >((acc, element) => {
        const cell = element.dataset.boardCell;
        if (cell) {
            acc[cell] = element.dataset.gemId ?? 'empty';
        }
        return acc;
    }, {});

    return {
        replay: {
            currentStep: Number(replayCounter.dataset.currentStep ?? '0'),
            historyLength: Number(replayCounter.dataset.historyLength ?? '0'),
            canUndo: !getRequiredElement<HTMLButtonElement>(
                container,
                '[data-replay-control="undo"]'
            ).disabled,
            canRedo: !getRequiredElement<HTMLButtonElement>(
                container,
                '[data-replay-control="redo"]'
            ).disabled,
        },
        score: {
            p1: Number(
                getRequiredElement<HTMLElement>(container, '[data-topbar-score="p1"]').dataset
                    .value ?? '0'
            ),
            p2: Number(
                getRequiredElement<HTMLElement>(container, '[data-topbar-score="p2"]').dataset
                    .value ?? '0'
            ),
        },
        crowns: {
            p1: Number(
                getRequiredElement<HTMLElement>(container, '[data-topbar-crowns="p1"]').dataset
                    .value ?? '0'
            ),
            p2: Number(
                getRequiredElement<HTMLElement>(container, '[data-topbar-crowns="p2"]').dataset
                    .value ?? '0'
            ),
        },
        turnCounts: {
            p1: Number(
                getRequiredElement<HTMLElement>(container, '[data-topbar-turn-count="p1"]').dataset
                    .value ?? '0'
            ),
            p2: Number(
                getRequiredElement<HTMLElement>(container, '[data-topbar-turn-count="p2"]').dataset
                    .value ?? '0'
            ),
        },
        deckCounts: {
            '1': Number(
                getRequiredElement<HTMLElement>(container, '[data-market-deck-count="1"]').dataset
                    .count ?? '0'
            ),
            '2': Number(
                getRequiredElement<HTMLElement>(container, '[data-market-deck-count="2"]').dataset
                    .count ?? '0'
            ),
            '3': Number(
                getRequiredElement<HTMLElement>(container, '[data-market-deck-count="3"]').dataset
                    .count ?? '0'
            ),
        },
        marketSlots,
        board,
        reserved: {
            p1: Number(
                getRequiredElement<HTMLElement>(container, '[data-player-zone="p1"]').dataset
                    .reservedCount ?? '0'
            ),
            p2: Number(
                getRequiredElement<HTMLElement>(container, '[data-player-zone="p2"]').dataset
                    .reservedCount ?? '0'
            ),
        },
    };
};

const buildExpectedSnapshotFromState = (
    state: GameState,
    historyLength: number,
    stateIndex: number
): UiSnapshot => {
    const board = state.board.reduce<Record<string, string>>((acc, row, rowIndex) => {
        row.forEach((gem, columnIndex) => {
            acc[`${rowIndex}-${columnIndex}`] = gem?.type?.id ?? 'empty';
        });
        return acc;
    }, {});

    const marketSlots = ([1, 2, 3] as const).reduce<Record<string, string>>((acc, level) => {
        state.market[level].forEach((card, index) => {
            acc[`${level}-${index}`] = card?.id ?? 'empty';
        });
        return acc;
    }, {});

    return {
        replay: {
            currentStep: stateIndex + 1,
            historyLength,
            canUndo: stateIndex > 0,
            canRedo: stateIndex < historyLength - 1,
        },
        score: {
            p1: getPlayerScore(state, 'p1'),
            p2: getPlayerScore(state, 'p2'),
        },
        crowns: {
            p1: getCrownCount(state, 'p1'),
            p2: getCrownCount(state, 'p2'),
        },
        turnCounts: {
            p1: state.playerTurnCounts.p1,
            p2: state.playerTurnCounts.p2,
        },
        deckCounts: {
            '1': state.decks[1].length,
            '2': state.decks[2].length,
            '3': state.decks[3].length,
        },
        marketSlots,
        board,
        reserved: {
            p1: state.playerReserved.p1.length,
            p2: state.playerReserved.p2.length,
        },
    };
};

const getExpectedSnapshot = (fixture: ReplayRoundtripFixture, stateIndex: number): UiSnapshot => {
    const state = fixture.states[stateIndex];
    if (!state) {
        throw new Error(`Fixture state ${stateIndex} does not exist.`);
    }

    return buildExpectedSnapshotFromState(state, fixture.states.length, stateIndex);
};

describe('replay roundtrip review', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let saveReplayToFolder: SaveReplayToFolderMock;

    const renderHarness = async () => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<ReplayRoundtripHarness />);
            await Promise.resolve();
        });
        await settleUi(5);
    };

    beforeEach(() => {
        saveReplayToFolder = vi.fn(async ({ fileName }) => ({
            path: `E:\\simonbb\\GemDuel-Dev\\Replay\\${fileName}`,
        }));
        window.electron = createElectronBridge(saveReplayToFolder) as ElectronBridge;
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        delete window.electron;
    });

    it('imports a completed replay, sweeps backward and forward across every step, and re-exports valid replay JSON', async () => {
        const fixture = createCompletedReplayFixture();
        await renderHarness();

        expect(saveReplayToFolder).not.toHaveBeenCalled();

        await importReplayThroughUi(container!, fixture.exportedJson);

        expect(saveReplayToFolder).not.toHaveBeenCalled();
        expect(container?.textContent).not.toContain('Review Board');
        expect(container?.textContent).not.toContain('Congratulations!');
        expect(getSnapshotFromUi(container!)).toEqual(
            getExpectedSnapshot(fixture, fixture.states.length - 1)
        );

        for (let index = fixture.states.length - 2; index >= 0; index -= 1) {
            await clickElement(
                getRequiredElement<HTMLButtonElement>(container!, '[data-replay-control="undo"]')
            );
            expect(getSnapshotFromUi(container!)).toEqual(getExpectedSnapshot(fixture, index));
        }

        const undoButton = getRequiredElement<HTMLButtonElement>(
            container!,
            '[data-replay-control="undo"]'
        );
        expect(undoButton.disabled).toBe(true);
        await clickElement(undoButton);
        expect(getSnapshotFromUi(container!)).toEqual(getExpectedSnapshot(fixture, 0));

        const midpoint = Math.max(1, Math.floor((fixture.states.length - 1) / 2));
        for (let index = 1; index <= midpoint; index += 1) {
            await clickElement(
                getRequiredElement<HTMLButtonElement>(container!, '[data-replay-control="redo"]')
            );
            expect(getSnapshotFromUi(container!)).toEqual(getExpectedSnapshot(fixture, index));
        }

        await act(async () => {
            getRequiredElement<HTMLButtonElement>(
                container!,
                '[data-replay-control="undo"]'
            ).click();
            getRequiredElement<HTMLButtonElement>(
                container!,
                '[data-replay-control="redo"]'
            ).click();
            getRequiredElement<HTMLButtonElement>(
                container!,
                '[data-replay-control="undo"]'
            ).click();
            await Promise.resolve();
        });
        await settleUi(5);
        expect(getSnapshotFromUi(container!)).toEqual(getExpectedSnapshot(fixture, midpoint - 1));

        for (let index = midpoint; index < fixture.states.length; index += 1) {
            await clickElement(
                getRequiredElement<HTMLButtonElement>(container!, '[data-replay-control="redo"]')
            );
            expect(getSnapshotFromUi(container!)).toEqual(getExpectedSnapshot(fixture, index));
        }

        const redoButton = getRequiredElement<HTMLButtonElement>(
            container!,
            '[data-replay-control="redo"]'
        );
        expect(redoButton.disabled).toBe(true);
        await clickElement(redoButton);
        expect(getSnapshotFromUi(container!)).toEqual(
            getExpectedSnapshot(fixture, fixture.states.length - 1)
        );

        const exportedPayload = await exportReplayThroughUi(container!, saveReplayToFolder);
        const parsed = parseReplayTextBoundary(exportedPayload.contents);

        expect(parsed.ok).toBe(true);
        if (!parsed.ok) {
            return;
        }

        expect(parsed.diagnostics.summaryIntegrity).toBe('ok');
        expect(parsed.session.history).toHaveLength(fixture.session.history.length);
        expect(parsed.session.history.map((action) => action.type)).toEqual(
            fixture.session.history.map((action) => action.type)
        );
        expect(parsed.session.finalStateHash).toBe(parsed.replay.summary.finalStateHash);
        expect(
            buildExpectedSnapshotFromState(
                parsed.session.finalState,
                fixture.states.length,
                fixture.states.length - 1
            )
        ).toEqual(getExpectedSnapshot(fixture, fixture.states.length - 1));
    });

    it('keeps replay navigation usable for imported SELECT_CARD_COLOR states without showing the blocking overlay', async () => {
        const fixture = createSelectCardColorReplayFixture();
        await renderHarness();

        await importReplayThroughUi(container!, fixture.exportedJson);

        expect(container?.textContent).not.toContain('Select Card Color');
        expect(getSnapshotFromUi(container!)).toEqual(
            getExpectedSnapshot(fixture, fixture.states.length - 1)
        );

        await clickElement(
            getRequiredElement<HTMLButtonElement>(container!, '[data-replay-control="undo"]')
        );
        expect(getSnapshotFromUi(container!)).toEqual(getExpectedSnapshot(fixture, 0));

        await clickElement(
            getRequiredElement<HTMLButtonElement>(container!, '[data-replay-control="redo"]')
        );
        expect(getSnapshotFromUi(container!)).toEqual(
            getExpectedSnapshot(fixture, fixture.states.length - 1)
        );
    });

    it('keeps replay navigation usable for imported PEEK states without showing the blocking modal', async () => {
        const fixture = createPeekModalReplayFixture();
        await renderHarness();

        await importReplayThroughUi(container!, fixture.exportedJson);

        expect(container?.textContent).not.toContain('Deck Intelligence');
        expect(getSnapshotFromUi(container!)).toEqual(
            getExpectedSnapshot(fixture, fixture.states.length - 1)
        );

        await clickElement(
            getRequiredElement<HTMLButtonElement>(container!, '[data-replay-control="undo"]')
        );
        expect(getSnapshotFromUi(container!)).toEqual(
            getExpectedSnapshot(fixture, fixture.states.length - 2)
        );

        await clickElement(
            getRequiredElement<HTMLButtonElement>(container!, '[data-replay-control="redo"]')
        );
        expect(getSnapshotFromUi(container!)).toEqual(
            getExpectedSnapshot(fixture, fixture.states.length - 1)
        );
    });
});
