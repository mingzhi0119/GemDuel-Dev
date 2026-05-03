// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ROYAL_CARDS } from '@gemduel/shared/constants';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import type { AppRouteProps } from '@app/types/ui';
import type { GameAction } from '@gemduel/shared/types';
import { VisualLabRoute } from '../VisualLabRoute';
import { VisualLabConsole } from '../VisualLabConsole';
import { SURFACE_LAB_SLOTS, type SurfaceLabCandidate } from '../surfaceLabTypes';
import {
    createRuntimeSurfaceLabAssetSets,
    createSurfaceLabAssetSets,
    normalizeSurfaceLabCandidates,
} from '../surfaceLabCatalog';
import { createVisualLabShellStyles } from '../visualLabStyles';
import type { SurfaceLabMotionOptions } from '../motionLabEvents';
import {
    SURFACE_LAB_RATINGS_STORAGE_KEY,
    getNextSurfaceLabSelectedSetId,
    matchesSurfaceLabRatingFilter,
    useSurfaceLabRatings,
    type SurfaceLabStyleRatings,
} from '../useSurfaceLabRatings';
import {
    SURFACE_LAB_REGEN_MARKS_STORAGE_KEY,
    getSurfaceLabSlotRegenKey,
    matchesSurfaceLabRegenFilter,
    useSurfaceLabRegenMarks,
    type SurfaceLabRegenMarks,
} from '../useSurfaceLabRegenMarks';
import { SURFACE_LAB_COMMENTS_STORAGE_KEY, useSurfaceLabComments } from '../useSurfaceLabComments';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const noop = () => {};

const createCandidate = (
    slot: SurfaceLabCandidate['slot'],
    overrides: Partial<SurfaceLabCandidate> = {}
): SurfaceLabCandidate => ({
    batch: 'surface-autonomous-luminous-styles-candidates',
    date: '2026-04-27',
    promptId: `SMOKE-${slot}`,
    slot,
    style: 'paper-lantern',
    variant: 'A',
    score: 8.5,
    risk: '',
    dimensions: { archive: [1254, 1254] },
    archiveUrl: `/__surface-lab/assets/test/${slot}.png`,
    source: 'candidate',
    ...overrides,
});

const createCandidateSet = (style: string, variant: string) =>
    SURFACE_LAB_SLOTS.map((slot) =>
        createCandidate(slot, {
            promptId: `SMOKE-${style}-${variant}-${slot}`,
            style,
            variant,
        })
    );

const createLayout = (): AppRouteProps['layout'] => ({
    layoutMode: 'desktop-4k',
    viewportWidth: 1920,
    viewportHeight: 1200,
    aspectRatio: 1.6,
    stageCanvasWidthPx: 3840,
    stageCanvasHeightPx: 2160,
    stageScale: 0.5,
    stageInsetXPx: 0,
    stageInsetYPx: 60,
    boardScale: (3840 - 96) / 2000,
    deckScale: 1.12,
    zoneScale: 1,
    zoneHeightPx: 520,
    mainGapPx: 24,
});

const createGame = (): AppRouteProps['game'] =>
    ({
        state: {
            ...INITIAL_STATE_SKELETON,
            selectedGems: [],
            reserveGoldSelection: null,
            errorMsg: null,
            phase: 'IDLE',
            turn: 'p1',
            draftPool: [],
            p2DraftPool: [],
            buffLevel: 1,
            mode: 'LOCAL_PVP',
        },
        handlers: {
            startGame: vi.fn(),
            handleSelectRoyal: vi.fn(),
            handleSelectBuff: vi.fn(),
            handleCloseModal: vi.fn(),
            handlePeekDeck: vi.fn(),
            handleSelfGemClick: vi.fn(),
            handleGemClick: vi.fn(),
            handleGemDragSelection: vi.fn(),
            handleOpponentGemClick: vi.fn(),
            handleConfirmTake: vi.fn(),
            handleReplenish: vi.fn(),
            activatePrivilegeMode: vi.fn(),
            handleReserveCard: vi.fn(),
            handleReserveDeck: vi.fn(),
            handleDiscardReserved: vi.fn(),
            initiateBuy: vi.fn(),
            handleSelectBonusColor: vi.fn(),
            handleCancelReserve: vi.fn(),
            handleCancelPrivilege: vi.fn(),
            checkAndInitiateBuyReserved: vi.fn(),
            clearPreselectedReserveGold: vi.fn(),
            handleDebugAddCrowns: vi.fn(),
            handleDebugAddPoints: vi.fn(),
            handleDebugAddPrivilege: vi.fn(),
            handleForceRoyal: vi.fn(),
            handleRerollBuffs: vi.fn(),
            importHistory: vi.fn(),
        },
        getters: {
            getPlayerScore: vi.fn(() => 0),
            isSelected: vi.fn(() => false),
            getCrownCount: vi.fn(() => 0),
            canAfford: vi.fn(() => false),
            isMyTurn: false,
        },
        historyControls: {
            undo: noop,
            redo: noop,
            canUndo: false,
            canRedo: false,
            jumpToStep: noop,
            importHistory: noop,
            clearAndInit: noop,
            currentIndex: 0,
            historyLength: 0,
            history: [] as GameAction[],
            historySource: 'live',
        },
        online: {
            peerId: '',
            remotePeerId: '',
            connectionStatus: 'disconnected',
            isHost: true,
            connectToPeer: noop,
            sendBootstrap: noop,
            sendGuestIntent: noop,
            sendHostDecision: noop,
            sendState: noop,
            requestRecovery: noop,
            latency: 0,
            isUnstable: false,
            approvalLog: [],
            statusNotice: null,
            authoritativeReplayRecorder: null,
        },
        replay: {
            currentReplay: null,
        },
    }) as unknown as AppRouteProps['game'];

const createMotionOptions = (): SurfaceLabMotionOptions => ({
    player: 'p1',
    marketLevel: 1,
    marketIndex: 0,
    deckLevel: 1,
    gemColor: 'blue',
    row: 2,
    col: 2,
    callout: 'ability-resolution',
    message: 'Preview',
    milestone: 'forced',
    nonce: 0,
});

const flushMicrotasks = async () => {
    await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
    });
};

describe('visual lab smoke', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        window.localStorage.clear();
        delete window.electron;
        root = null;
        container = null;
        vi.restoreAllMocks();
    });

    it('mounts VisualLabRoute (readability) with opt-in HUD treatment after catalog load', async () => {
        const onCloseToStartPage = vi.fn();
        const candidatesPayload = SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot));
        vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const url =
                typeof input === 'string'
                    ? input
                    : input instanceof URL
                      ? input.href
                      : (input as Request).url;
            if (url.includes('/__surface-lab/candidates.json')) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ candidates: candidatesPayload }),
                } as Response;
            }
            return { ok: false, status: 404, json: async () => ({}) } as Response;
        });

        container = document.createElement('div');
        document.body.appendChild(container);

        const game = createGame();
        const gameWithRoyalDeck = {
            ...game,
            state: {
                ...game.state,
                royalDeck: ROYAL_CARDS.slice(0, 1),
            },
        } as AppRouteProps['game'];
        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabRoute
                    appVersion="0.test"
                    game={gameWithRoyalDeck}
                    layout={createLayout()}
                    theme="dark"
                    ui={{
                        showDebug: false,
                        isReviewing: false,
                        showRulebook: false,
                        matchmakingRoute: 'none',
                        isPeekingBoard: false,
                        persistentWinner: null,
                        showRestartConfirm: false,
                        soundEnabled: true,
                    }}
                    setters={{
                        setShowDebug: vi.fn(),
                        setIsReviewing: vi.fn(),
                        setShowRulebook: vi.fn(),
                        setMatchmakingRoute: vi.fn(),
                        setIsPeekingBoard: vi.fn(),
                        setShowRestartConfirm: vi.fn(),
                        setSoundEnabled: vi.fn(),
                    }}
                    callbacks={{
                        handleRestart: vi.fn(),
                        handleDownloadReplay: vi.fn(),
                        handleUploadReplay: vi.fn(),
                    }}
                    onCloseToStartPage={onCloseToStartPage}
                    lan={{
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
                            statusMessage: '',
                        },
                        launch: null,
                        refresh: vi.fn(),
                        startSearch: vi.fn(),
                        cancelSearch: vi.fn(),
                        selectMode: vi.fn(),
                        confirmStart: vi.fn(),
                        reportPeerReady: vi.fn(),
                        clearLaunch: vi.fn(),
                    }}
                    mode="readability"
                />
            );
        });

        for (let attempt = 0; attempt < 30; attempt += 1) {
            await flushMicrotasks();
            if (container?.querySelector('[data-testid="visual-lab-route"]')) {
                break;
            }
        }

        const visualLabRoute = container?.querySelector('[data-testid="visual-lab-route"]');
        expect(visualLabRoute).toBeTruthy();
        expect(visualLabRoute?.getAttribute('data-visual-lab-chrome-mode')).toBe('shell-fill');
        expect(visualLabRoute?.getAttribute('data-visual-lab-readability')).toBe('porcelain-glass');
        expect(container?.querySelector('[data-readability-hud="porcelain-glass"]')).toBeTruthy();
        const royalBack = document.body.querySelector(
            '[data-royal-card-display="back"]'
        ) as HTMLImageElement | null;
        expect(royalBack).toBeTruthy();
        expect(royalBack?.getAttribute('src')).toContain('royal-card-back.png');
        const back = container?.querySelector(
            '[data-app-restart-button="true"]'
        ) as HTMLButtonElement | null;
        expect(back).not.toBeNull();
        await act(async () => {
            back?.click();
        });
        expect(onCloseToStartPage).toHaveBeenCalledTimes(1);
    });

    it('writes persistent review state and removes cleared marks/comments on the next save', async () => {
        const candidatesPayload = SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot));
        const normalized = normalizeSurfaceLabCandidates(candidatesPayload);
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const selectedSet = createSurfaceLabAssetSets([], 'dark')[0];
        const candidateSet = assetSets.find((set) => set.source === 'candidate')!;
        const gemPanelKey = getSurfaceLabSlotRegenKey(selectedSet.slots['gem-panel']);
        const reviewStateWrites: Array<{
            ratings?: SurfaceLabStyleRatings;
            regenMarks?: SurfaceLabRegenMarks;
            comments?: Record<string, string>;
            assetSets?: Array<{
                id?: string;
                source?: string;
                slots?: Record<string, Partial<SurfaceLabCandidate>>;
            }>;
        }> = [];
        window.localStorage.setItem(
            SURFACE_LAB_RATINGS_STORAGE_KEY,
            JSON.stringify({ [selectedSet.id]: 1 })
        );
        window.localStorage.setItem(
            SURFACE_LAB_REGEN_MARKS_STORAGE_KEY,
            JSON.stringify({ [gemPanelKey]: true })
        );
        window.localStorage.setItem(
            SURFACE_LAB_COMMENTS_STORAGE_KEY,
            JSON.stringify({ [selectedSet.id]: 'Brighten the gem panel and simplify the shell.' })
        );
        vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
            const url =
                typeof input === 'string'
                    ? input
                    : input instanceof URL
                      ? input.href
                      : (input as Request).url;
            if (url.includes('/__surface-lab/candidates.json')) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ candidates: candidatesPayload }),
                } as Response;
            }
            if (url.includes('/__surface-lab/review-state.json')) {
                if (init?.method !== 'PUT') {
                    return {
                        ok: false,
                        status: 404,
                        json: async () => ({ ok: false, error: 'No review state found' }),
                    } as Response;
                }
                const body = JSON.parse(String(init.body ?? '{}')) as {
                    ratings?: SurfaceLabStyleRatings;
                    regenMarks?: SurfaceLabRegenMarks;
                    comments?: Record<string, string>;
                    assetSets?: Array<{
                        id?: string;
                        source?: string;
                        slots?: Record<string, Partial<SurfaceLabCandidate>>;
                    }>;
                    sourceKind?: string;
                };
                reviewStateWrites.push(body);
                const counts = {
                    ratings: {
                        '1': Object.values(body.ratings ?? {}).filter((rating) => rating === 1)
                            .length,
                        '4': Object.values(body.ratings ?? {}).filter((rating) => rating === 4)
                            .length,
                        '7': Object.values(body.ratings ?? {}).filter((rating) => rating === 7)
                            .length,
                        '10': Object.values(body.ratings ?? {}).filter((rating) => rating === 10)
                            .length,
                    },
                    regenMarks: Object.keys(body.regenMarks ?? {}).length,
                    comments: Object.keys(body.comments ?? {}).length,
                    assetSets: body.assetSets?.length ?? 0,
                    pendingReplacements: Object.keys(body.regenMarks ?? {}).length,
                    pendingComments: Object.keys(body.comments ?? {}).length,
                };
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({
                        ok: true,
                        path: 'tmp/visual-lab/surface-review-state.json',
                        state: {
                            schema: 'gemduel.visualLab.surfaceReviewState.v2',
                            revision: reviewStateWrites.length,
                            updatedAt: '2026-04-30T00:00:00.000Z',
                            source: { kind: body.sourceKind ?? 'browser' },
                            counts,
                            ratings: body.ratings ?? {},
                            regenMarks: body.regenMarks ?? {},
                            comments: body.comments ?? {},
                            assetSets: body.assetSets ?? [],
                        },
                    }),
                } as Response;
            }
            return { ok: false, status: 404, json: async () => ({}) } as Response;
        });

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabRoute
                    appVersion="0.test"
                    game={createGame()}
                    layout={createLayout()}
                    theme="dark"
                    ui={{
                        showDebug: false,
                        isReviewing: false,
                        showRulebook: false,
                        matchmakingRoute: 'none',
                        isPeekingBoard: false,
                        persistentWinner: null,
                        showRestartConfirm: false,
                        soundEnabled: true,
                    }}
                    setters={{
                        setShowDebug: vi.fn(),
                        setIsReviewing: vi.fn(),
                        setShowRulebook: vi.fn(),
                        setMatchmakingRoute: vi.fn(),
                        setIsPeekingBoard: vi.fn(),
                        setShowRestartConfirm: vi.fn(),
                        setSoundEnabled: vi.fn(),
                    }}
                    callbacks={{
                        handleRestart: vi.fn(),
                        handleDownloadReplay: vi.fn(),
                        handleUploadReplay: vi.fn(),
                    }}
                    lan={{
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
                            statusMessage: '',
                        },
                        launch: null,
                        refresh: vi.fn(),
                        startSearch: vi.fn(),
                        cancelSearch: vi.fn(),
                        selectMode: vi.fn(),
                        confirmStart: vi.fn(),
                        reportPeerReady: vi.fn(),
                        clearLaunch: vi.fn(),
                    }}
                    mode="surfaces"
                />
            );
        });

        for (let attempt = 0; attempt < 30; attempt += 1) {
            await flushMicrotasks();
            if (
                reviewStateWrites.length > 0 &&
                document.body.textContent?.includes('Review state')
            ) {
                break;
            }
        }

        const persistedWrite =
            reviewStateWrites.find((write) =>
                write.assetSets?.some((set) => set.id === candidateSet.id)
            ) ?? reviewStateWrites[0];

        expect(persistedWrite).toMatchObject({
            ratings: { [selectedSet.id]: 1 },
            regenMarks: {
                [gemPanelKey]: true,
            },
            comments: {
                [selectedSet.id]: 'Brighten the gem panel and simplify the shell.',
            },
        });
        const exportedAssetSets = persistedWrite.assetSets ?? [];
        const exportedCandidateSet = exportedAssetSets.find((set) => set.id === candidateSet.id);
        const exportedRuntimeSet = exportedAssetSets.find(
            (set) => set.id === 'runtime:crystal-anime:dark'
        );
        expect(exportedCandidateSet?.slots?.['gem-panel']).toMatchObject({
            source: 'candidate',
            archiveUrl: candidateSet.slots['gem-panel'].archiveUrl,
        });
        expect(exportedRuntimeSet?.slots).not.toHaveProperty('topbar');
        expect(exportedRuntimeSet?.slots?.['shell-background']).toMatchObject({
            source: 'runtime',
            batch: 'runtime',
            date: 'current',
            style: 'crystal-anime',
            variant: 'DARK',
            archiveUrl: '/assets/surfaces/anime-themes/crystal-anime/dark/shell-background.png',
        });
        expect(document.body.textContent).toContain('tmp/visual-lab/surface-review-state.json');
        expect(document.body.textContent).not.toContain('Export review plan');
        expect(document.body.textContent).not.toContain('Sync latest completion');

        await act(async () => {
            (
                document.body.querySelector(
                    'button[aria-label="Rate current style 10"]'
                ) as HTMLButtonElement | null
            )?.click();
        });
        for (let attempt = 0; attempt < 30; attempt += 1) {
            await flushMicrotasks();
            if (reviewStateWrites.at(-1)?.ratings?.[selectedSet.id] === 10) {
                break;
            }
        }
        expect(reviewStateWrites.at(-1)?.ratings).toMatchObject({ [selectedSet.id]: 10 });

        await act(async () => {
            (
                document.body.querySelector(
                    'button[aria-label="Clear Gem panel for regeneration"]'
                ) as HTMLButtonElement | null
            )?.click();
        });
        for (let attempt = 0; attempt < 30; attempt += 1) {
            await flushMicrotasks();
            if (!reviewStateWrites.at(-1)?.regenMarks?.[gemPanelKey]) {
                break;
            }
        }
        expect(reviewStateWrites.at(-1)?.regenMarks).not.toHaveProperty(gemPanelKey);

        const textarea = document.body.querySelector(
            'textarea[aria-label="Style comment"]'
        ) as HTMLTextAreaElement | null;
        const valueSetter = Object.getOwnPropertyDescriptor(
            HTMLTextAreaElement.prototype,
            'value'
        )?.set;
        await act(async () => {
            valueSetter?.call(textarea, '   ');
            textarea?.dispatchEvent(new Event('input', { bubbles: true }));
        });
        for (let attempt = 0; attempt < 30; attempt += 1) {
            await flushMicrotasks();
            if (!reviewStateWrites.at(-1)?.comments?.[selectedSet.id]) {
                break;
            }
        }
        expect(reviewStateWrites.at(-1)?.comments).not.toHaveProperty(selectedSet.id);
    });

    it('seeds shared review state from Electron localStorage when the preload bridge is present', async () => {
        const candidatesPayload = SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot));
        const selectedSet = createSurfaceLabAssetSets([], 'dark')[0];
        const shellKey = getSurfaceLabSlotRegenKey(selectedSet.slots['shell-background']);
        const reviewStateRequests: unknown[] = [];
        window.electron = {} as Window['electron'];
        window.localStorage.setItem(
            SURFACE_LAB_RATINGS_STORAGE_KEY,
            JSON.stringify({ [selectedSet.id]: 10 })
        );
        window.localStorage.setItem(
            SURFACE_LAB_REGEN_MARKS_STORAGE_KEY,
            JSON.stringify({ [shellKey]: true })
        );
        window.localStorage.setItem(
            SURFACE_LAB_COMMENTS_STORAGE_KEY,
            JSON.stringify({ [selectedSet.id]: 'Keep composition, replace shell texture.' })
        );
        vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
            const url =
                typeof input === 'string'
                    ? input
                    : input instanceof URL
                      ? input.href
                      : (input as Request).url;
            if (url.includes('/__surface-lab/candidates.json')) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ candidates: candidatesPayload }),
                } as Response;
            }
            if (url.includes('/__surface-lab/review-state.json')) {
                if (init?.method !== 'PUT') {
                    return {
                        ok: false,
                        status: 404,
                        json: async () => ({ ok: false, error: 'No review state found' }),
                    } as Response;
                }
                const body = JSON.parse(String(init?.body ?? '{}')) as {
                    ratings?: SurfaceLabStyleRatings;
                    regenMarks?: SurfaceLabRegenMarks;
                    comments?: Record<string, string>;
                    sourceKind?: string;
                };
                reviewStateRequests.push(body);
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({
                        ok: true,
                        path: 'tmp/visual-lab/surface-review-state.json',
                        state: {
                            schema: 'gemduel.visualLab.surfaceReviewState.v2',
                            revision: reviewStateRequests.length,
                            source: { kind: body.sourceKind },
                            counts: {
                                ratings: { '1': 0, '4': 0, '7': 0, '10': 1 },
                                regenMarks: Object.keys(body.regenMarks ?? {}).length,
                                comments: Object.keys(body.comments ?? {}).length,
                                assetSets: 0,
                                pendingReplacements: Object.keys(body.regenMarks ?? {}).length,
                                pendingComments: Object.keys(body.comments ?? {}).length,
                            },
                            ratings: body.ratings ?? {},
                            regenMarks: body.regenMarks ?? {},
                            comments: body.comments ?? {},
                        },
                    }),
                } as Response;
            }
            return { ok: false, status: 404, json: async () => ({}) } as Response;
        });

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabRoute
                    appVersion="0.test"
                    game={createGame()}
                    layout={createLayout()}
                    theme="dark"
                    ui={{
                        showDebug: false,
                        isReviewing: false,
                        showRulebook: false,
                        matchmakingRoute: 'none',
                        isPeekingBoard: false,
                        persistentWinner: null,
                        showRestartConfirm: false,
                        soundEnabled: true,
                    }}
                    setters={{
                        setShowDebug: vi.fn(),
                        setIsReviewing: vi.fn(),
                        setShowRulebook: vi.fn(),
                        setMatchmakingRoute: vi.fn(),
                        setIsPeekingBoard: vi.fn(),
                        setShowRestartConfirm: vi.fn(),
                        setSoundEnabled: vi.fn(),
                    }}
                    callbacks={{
                        handleRestart: vi.fn(),
                        handleDownloadReplay: vi.fn(),
                        handleUploadReplay: vi.fn(),
                    }}
                    lan={{
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
                            statusMessage: '',
                        },
                        launch: null,
                        refresh: vi.fn(),
                        startSearch: vi.fn(),
                        cancelSearch: vi.fn(),
                        selectMode: vi.fn(),
                        confirmStart: vi.fn(),
                        reportPeerReady: vi.fn(),
                        clearLaunch: vi.fn(),
                    }}
                    mode="surfaces"
                />
            );
        });

        for (let attempt = 0; attempt < 30; attempt += 1) {
            await flushMicrotasks();
            if (reviewStateRequests.length > 0) {
                break;
            }
        }

        expect(reviewStateRequests[0]).toMatchObject({
            sourceKind: 'electron',
            ratings: { [selectedSet.id]: 10 },
            regenMarks: { [shellKey]: true },
            comments: { [selectedSet.id]: 'Keep composition, replace shell texture.' },
        });
    });

    it('hydrates browser local review state from the shared Electron state', async () => {
        const candidatesPayload = SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot));
        const selectedSet = createSurfaceLabAssetSets([], 'dark')[0];
        const shellKey = getSurfaceLabSlotRegenKey(selectedSet.slots['shell-background']);
        window.localStorage.setItem(
            SURFACE_LAB_RATINGS_STORAGE_KEY,
            JSON.stringify({ [selectedSet.id]: 1 })
        );
        vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const url =
                typeof input === 'string'
                    ? input
                    : input instanceof URL
                      ? input.href
                      : (input as Request).url;
            if (url.includes('/__surface-lab/candidates.json')) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ candidates: candidatesPayload }),
                } as Response;
            }
            if (url.includes('/__surface-lab/review-state.json')) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({
                        ok: true,
                        path: 'tmp/visual-lab/surface-review-state.json',
                        state: {
                            schema: 'gemduel.visualLab.surfaceReviewState.v2',
                            revision: 7,
                            source: { kind: 'electron' },
                            counts: {
                                ratings: { '1': 0, '4': 0, '7': 1, '10': 0 },
                                regenMarks: 1,
                                comments: 1,
                                assetSets: 0,
                                pendingReplacements: 1,
                                pendingComments: 1,
                            },
                            ratings: { [selectedSet.id]: 7 },
                            regenMarks: { [shellKey]: true },
                            comments: { [selectedSet.id]: 'Needs clearer edge separation.' },
                        },
                    }),
                } as Response;
            }
            return { ok: false, status: 404, json: async () => ({}) } as Response;
        });

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabRoute
                    appVersion="0.test"
                    game={createGame()}
                    layout={createLayout()}
                    theme="dark"
                    ui={{
                        showDebug: false,
                        isReviewing: false,
                        showRulebook: false,
                        matchmakingRoute: 'none',
                        isPeekingBoard: false,
                        persistentWinner: null,
                        showRestartConfirm: false,
                        soundEnabled: true,
                    }}
                    setters={{
                        setShowDebug: vi.fn(),
                        setIsReviewing: vi.fn(),
                        setShowRulebook: vi.fn(),
                        setMatchmakingRoute: vi.fn(),
                        setIsPeekingBoard: vi.fn(),
                        setShowRestartConfirm: vi.fn(),
                        setSoundEnabled: vi.fn(),
                    }}
                    callbacks={{
                        handleRestart: vi.fn(),
                        handleDownloadReplay: vi.fn(),
                        handleUploadReplay: vi.fn(),
                    }}
                    lan={{
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
                            statusMessage: '',
                        },
                        launch: null,
                        refresh: vi.fn(),
                        startSearch: vi.fn(),
                        cancelSearch: vi.fn(),
                        selectMode: vi.fn(),
                        confirmStart: vi.fn(),
                        reportPeerReady: vi.fn(),
                        clearLaunch: vi.fn(),
                    }}
                    mode="surfaces"
                />
            );
        });

        for (let attempt = 0; attempt < 30; attempt += 1) {
            await flushMicrotasks();
            if (
                JSON.parse(window.localStorage.getItem(SURFACE_LAB_RATINGS_STORAGE_KEY) ?? '{}')[
                    selectedSet.id
                ] === 7 &&
                document.body
                    .querySelector('button[aria-label="Rate current style 7"]')
                    ?.getAttribute('aria-pressed') === 'true'
            ) {
                break;
            }
        }

        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_RATINGS_STORAGE_KEY) ?? '{}')
        ).toMatchObject({ [selectedSet.id]: 7 });
        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_REGEN_MARKS_STORAGE_KEY) ?? '{}')
        ).toMatchObject({ [shellKey]: true });
        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_COMMENTS_STORAGE_KEY) ?? '{}')
        ).toMatchObject({ [selectedSet.id]: 'Needs clearer edge separation.' });
        expect(
            document.body
                .querySelector('button[aria-label="Rate current style 7"]')
                ?.getAttribute('aria-pressed')
        ).toBe('true');
        expect(
            document.body
                .querySelector('button[aria-label="Clear Shell for regeneration"]')
                ?.getAttribute('aria-pressed')
        ).toBe('true');
    });

    it('mounts VisualLabConsole without throwing', async () => {
        const normalized = normalizeSurfaceLabCandidates(
            SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot))
        );
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const selectedSet = assetSets[0];
        const assetSlots = selectedSet.slots;
        const styles = createVisualLabShellStyles('dark', createLayout(), assetSlots, {});

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={assetSets}
                    selectedSet={selectedSet}
                    selectedSetId={selectedSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="All"
                    setRatingFilter={vi.fn()}
                    regenFilter="All"
                    setRegenFilter={vi.fn()}
                    styleRatings={{}}
                    styleRating={null}
                    setStyleRating={vi.fn()}
                    regenMarks={{}}
                    toggleSurfaceLabSlotRegenMark={vi.fn()}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={assetSlots}
                    styles={styles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        });

        expect(document.body.textContent).toContain('Visual Lab Console');
        expect(document.body.textContent).not.toContain('Royal back display box');
        expect(document.body.querySelector('[data-visual-lab-console]')).toBeTruthy();
    });

    it('uses shell-fill topbar styling as the only Visual Lab chrome art mode', () => {
        const normalized = normalizeSurfaceLabCandidates(
            SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot))
        );
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const selectedSet = assetSets[0];
        const styles = createVisualLabShellStyles('dark', createLayout(), selectedSet.slots, {});

        expect(Object.keys(selectedSet.slots)).not.toContain('topbar');
        expect(String(styles.shellStyle.backgroundImage)).toContain(
            '/__surface-lab/assets/test/shell-background.png'
        );
        expect(styles.shellStyle.gridTemplateRows).toBe('120px 1520px 520px');
        expect(styles.shellStyle.backgroundSize).toBe('100% 1640px');
        expect(styles.shellStyle.backgroundPosition).toBe('top center');
        expect(String(styles.topBarSurfaceStyle.backgroundImage)).not.toContain(
            '/__surface-lab/assets/test/topbar.png'
        );
        expect(styles.topBarSurfaceStyle.backgroundImage).toBe('none');
        expect(styles.topBarSurfaceStyle.backgroundColor).toBe('transparent');
        expect(styles.topBarSurfaceStyle.height).toBe('120px');
        expect(styles.topBarSurfaceStyle.borderColor).toBe('transparent');
        expect(styles.topBarSurfaceStyle.boxShadow).toBe('none');
        expect(styles.topBarSurfaceVariant).toContain('shell-fill');
    });

    it('uses the selected runtime style tone for Visual Lab text variables', () => {
        const runtimeSets = createRuntimeSurfaceLabAssetSets('dark');
        const darkArcane = runtimeSets.find((set) => set.style === 'dark-arcane');
        const lotusPorcelain = runtimeSets.find((set) => set.style === 'lotus-porcelain');
        const darkStyles = createVisualLabShellStyles(
            'dark',
            createLayout(),
            darkArcane!.slots,
            {}
        );
        const lotusStyles = createVisualLabShellStyles(
            'dark',
            createLayout(),
            lotusPorcelain!.slots,
            {}
        );
        const darkVars = darkStyles.shellStyle as Record<`--gd-${string}`, string>;
        const lotusVars = lotusStyles.shellStyle as Record<`--gd-${string}`, string>;

        expect(darkVars['--gd-shell-label-primary']).toBe('#f8fafc');
        expect(darkVars['--gd-topbar-label-primary']).toBe('#f8fafc');
        expect(lotusVars['--gd-shell-label-primary']).toBe('#002147');
        expect(lotusVars['--gd-shell-label-muted']).toBe('#212121');
        expect(lotusVars['--gd-topbar-label-primary']).toBe('#002147');
        expect(lotusVars['--gd-topbar-label-muted']).toBe('#212121');
        expect(lotusVars['--gd-topbar-p1-text']).toBe('#047857');
    });

    it('hides and restores the floating Visual Lab console', async () => {
        const normalized = normalizeSurfaceLabCandidates(
            SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot))
        );
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const selectedSet = assetSets[0];
        const assetSlots = selectedSet.slots;
        const styles = createVisualLabShellStyles('dark', createLayout(), assetSlots, {});

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={assetSets}
                    selectedSet={selectedSet}
                    selectedSetId={selectedSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="All"
                    setRatingFilter={vi.fn()}
                    regenFilter="All"
                    setRegenFilter={vi.fn()}
                    styleRatings={{}}
                    styleRating={null}
                    setStyleRating={vi.fn()}
                    regenMarks={{}}
                    toggleSurfaceLabSlotRegenMark={vi.fn()}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={assetSlots}
                    styles={styles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        });

        const hide = document.body.querySelector(
            '[data-visual-lab-console-hide="true"]'
        ) as HTMLButtonElement | null;
        expect(hide).not.toBeNull();

        await act(async () => {
            hide?.click();
        });

        expect(document.body.querySelector('[data-visual-lab-console]')).toBeNull();
        expect(document.body.querySelector('[data-visual-lab-console-show="true"]')).toBeTruthy();

        await act(async () => {
            (
                document.body.querySelector(
                    '[data-visual-lab-console-show="true"]'
                ) as HTMLButtonElement | null
            )?.click();
        });

        expect(document.body.querySelector('[data-visual-lab-console]')).toBeTruthy();
    });

    it('persists clicked style ratings in localStorage and restores them on remount', async () => {
        const normalized = normalizeSurfaceLabCandidates(
            SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot))
        );
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const selectedSet = assetSets[0];
        const assetSlots = selectedSet.slots;
        const styles = createVisualLabShellStyles('dark', createLayout(), assetSlots, {});
        const RatingConsoleHarness = () => {
            const { styleRatings, setStyleRating } = useSurfaceLabRatings();

            return (
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={assetSets}
                    selectedSet={selectedSet}
                    selectedSetId={selectedSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="All"
                    setRatingFilter={vi.fn()}
                    regenFilter="All"
                    setRegenFilter={vi.fn()}
                    styleRatings={styleRatings}
                    styleRating={styleRatings[selectedSet.id] ?? null}
                    setStyleRating={(rating) => setStyleRating(selectedSet.id, rating)}
                    regenMarks={{}}
                    toggleSurfaceLabSlotRegenMark={vi.fn()}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={assetSlots}
                    styles={styles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<RatingConsoleHarness />);
        });

        const rate10 = document.body.querySelector(
            'button[aria-label="Rate current style 10"]'
        ) as HTMLButtonElement | null;
        expect(rate10).not.toBeNull();
        expect(rate10?.getAttribute('aria-pressed')).toBe('false');

        await act(async () => {
            rate10?.click();
        });

        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_RATINGS_STORAGE_KEY) ?? '{}')
        ).toMatchObject({
            [selectedSet.id]: 10,
        });
        expect(rate10?.getAttribute('aria-pressed')).toBe('true');

        await act(async () => {
            root?.unmount();
        });
        await act(async () => {
            root = createRoot(container!);
            root.render(<RatingConsoleHarness />);
        });

        expect(
            document.body
                .querySelector('button[aria-label="Rate current style 10"]')
                ?.getAttribute('aria-pressed')
        ).toBe('true');
    });

    it('persists style comments without trimming text and deletes blank comments', async () => {
        const normalized = normalizeSurfaceLabCandidates(
            SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot))
        );
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const selectedSet = assetSets[0];
        const assetSlots = selectedSet.slots;
        const styles = createVisualLabShellStyles('dark', createLayout(), assetSlots, {});
        const CommentConsoleHarness = () => {
            const { styleComments, setStyleComment } = useSurfaceLabComments();

            return (
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={assetSets}
                    selectedSet={selectedSet}
                    selectedSetId={selectedSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="All"
                    setRatingFilter={vi.fn()}
                    regenFilter="All"
                    setRegenFilter={vi.fn()}
                    styleRatings={{}}
                    styleRating={null}
                    setStyleRating={vi.fn()}
                    styleComment={styleComments[selectedSet.id] ?? ''}
                    setStyleComment={(comment) => setStyleComment(selectedSet.id, comment)}
                    regenMarks={{}}
                    toggleSurfaceLabSlotRegenMark={vi.fn()}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={assetSlots}
                    styles={styles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<CommentConsoleHarness />);
        });

        const textarea = document.body.querySelector(
            'textarea[aria-label="Style comment"]'
        ) as HTMLTextAreaElement | null;
        expect(textarea).not.toBeNull();

        const setTextareaValue = (value: string) => {
            const valueSetter = Object.getOwnPropertyDescriptor(
                HTMLTextAreaElement.prototype,
                'value'
            )?.set;
            valueSetter?.call(textarea, value);
            textarea!.dispatchEvent(new Event('input', { bubbles: true }));
        };

        await act(async () => {
            setTextareaValue('中文 空格 test  ');
        });

        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_COMMENTS_STORAGE_KEY) ?? '{}')
        ).toMatchObject({
            [selectedSet.id]: '中文 空格 test  ',
        });

        await act(async () => {
            setTextareaValue('   ');
        });

        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_COMMENTS_STORAGE_KEY) ?? '{}')
        ).not.toHaveProperty(selectedSet.id);
    });

    it('keeps style comments local during IME composition and shields space key events', async () => {
        const normalized = normalizeSurfaceLabCandidates(
            SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot))
        );
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const selectedSet = assetSets[0];
        const assetSlots = selectedSet.slots;
        const styles = createVisualLabShellStyles('dark', createLayout(), assetSlots, {});
        let parentKeyDowns = 0;
        const CommentConsoleHarness = () => {
            const { styleComments, setStyleComment } = useSurfaceLabComments();

            return (
                <div
                    onKeyDown={() => {
                        parentKeyDowns += 1;
                    }}
                >
                    <VisualLabConsole
                        mode="surfaces"
                        catalogStatus="ready"
                        assetSets={assetSets}
                        visibleAssetSets={assetSets}
                        selectedSet={selectedSet}
                        selectedSetId={selectedSet.id}
                        setSelectedSetId={vi.fn()}
                        ratingFilter="All"
                        setRatingFilter={vi.fn()}
                        regenFilter="All"
                        setRegenFilter={vi.fn()}
                        styleRatings={{}}
                        styleRating={null}
                        setStyleRating={vi.fn()}
                        styleComment={styleComments[selectedSet.id] ?? ''}
                        setStyleComment={(comment) => setStyleComment(selectedSet.id, comment)}
                        regenMarks={{}}
                        toggleSurfaceLabSlotRegenMark={vi.fn()}
                        slotOverrides={{}}
                        setSlotOverrides={vi.fn()}
                        assetSlots={assetSlots}
                        styles={styles}
                        activeEvent={null}
                        motionType="royal-unlock"
                        setMotionType={vi.fn()}
                        motionOptions={createMotionOptions()}
                        setMotionOptions={vi.fn()}
                        holdRoyalIntro={false}
                        setHoldRoyalIntro={vi.fn()}
                        onTriggerMotion={vi.fn()}
                        onRepeatMotion={vi.fn()}
                        onClearMotion={vi.fn()}
                    />
                </div>
            );
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<CommentConsoleHarness />);
        });

        const textarea = document.body.querySelector(
            'textarea[aria-label="Style comment"]'
        ) as HTMLTextAreaElement | null;
        expect(textarea).not.toBeNull();

        const valueSetter = Object.getOwnPropertyDescriptor(
            HTMLTextAreaElement.prototype,
            'value'
        )?.set;
        const setTextareaValue = (value: string) => {
            valueSetter?.call(textarea, value);
            textarea!.dispatchEvent(new Event('input', { bubbles: true }));
        };

        await act(async () => {
            textarea!.dispatchEvent(new Event('compositionstart', { bubbles: true }));
            setTextareaValue('中文 ');
        });

        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_COMMENTS_STORAGE_KEY) ?? '{}')
        ).not.toHaveProperty(selectedSet.id);

        await act(async () => {
            textarea!.dispatchEvent(new Event('compositionend', { bubbles: true }));
        });

        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_COMMENTS_STORAGE_KEY) ?? '{}')
        ).toMatchObject({
            [selectedSet.id]: '中文 ',
        });

        await act(async () => {
            textarea!.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        });
        expect(parentKeyDowns).toBe(0);
    });

    it('persists toggled slot regeneration marks in localStorage and restores them on remount', async () => {
        const normalized = normalizeSurfaceLabCandidates(
            SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot))
        );
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const selectedSet = assetSets[0];
        const assetSlots = selectedSet.slots;
        const styles = createVisualLabShellStyles('dark', createLayout(), assetSlots, {});
        const shellKey = getSurfaceLabSlotRegenKey(assetSlots['shell-background']);
        const RegenConsoleHarness = () => {
            const { regenMarks, toggleSurfaceLabSlotRegenMark } = useSurfaceLabRegenMarks();

            return (
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={assetSets}
                    selectedSet={selectedSet}
                    selectedSetId={selectedSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="All"
                    setRatingFilter={vi.fn()}
                    regenFilter="All"
                    setRegenFilter={vi.fn()}
                    styleRatings={{}}
                    styleRating={null}
                    setStyleRating={vi.fn()}
                    regenMarks={regenMarks}
                    toggleSurfaceLabSlotRegenMark={toggleSurfaceLabSlotRegenMark}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={assetSlots}
                    styles={styles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<RegenConsoleHarness />);
        });

        expect(document.body.querySelectorAll('button[aria-label^="Mark "]')).toHaveLength(
            SURFACE_LAB_SLOTS.length
        );

        const markShell = document.body.querySelector(
            'button[aria-label="Mark Shell for regeneration"]'
        ) as HTMLButtonElement | null;
        expect(markShell).not.toBeNull();
        expect(markShell?.getAttribute('aria-pressed')).toBe('false');

        await act(async () => {
            markShell?.click();
        });

        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_REGEN_MARKS_STORAGE_KEY) ?? '{}')
        ).toMatchObject({
            [shellKey]: true,
        });
        expect(
            document.body
                .querySelector('button[aria-label="Clear Shell for regeneration"]')
                ?.getAttribute('aria-pressed')
        ).toBe('true');

        await act(async () => {
            root?.unmount();
        });
        await act(async () => {
            root = createRoot(container!);
            root.render(<RegenConsoleHarness />);
        });

        const clearShell = document.body.querySelector(
            'button[aria-label="Clear Shell for regeneration"]'
        ) as HTMLButtonElement | null;
        expect(clearShell?.getAttribute('aria-pressed')).toBe('true');

        await act(async () => {
            clearShell?.click();
        });

        expect(
            JSON.parse(window.localStorage.getItem(SURFACE_LAB_REGEN_MARKS_STORAGE_KEY) ?? '{}')
        ).not.toHaveProperty(shellKey);
        expect(
            document.body
                .querySelector('button[aria-label="Mark Shell for regeneration"]')
                ?.getAttribute('aria-pressed')
        ).toBe('false');
    });

    it('marks the currently displayed override candidate for slot regeneration', async () => {
        const normalized = normalizeSurfaceLabCandidates([
            ...createCandidateSet('paper-lantern', 'A'),
            ...createCandidateSet('onyx-archive', 'A'),
        ]);
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const paperSet = assetSets.find((set) => set.style === 'paper-lantern')!;
        const onyxSet = assetSets.find((set) => set.style === 'onyx-archive')!;
        const assetSlots = {
            ...paperSet.slots,
            'shell-background': onyxSet.slots['shell-background'],
        };
        const styles = createVisualLabShellStyles('dark', createLayout(), assetSlots, {});
        const overrideKey = getSurfaceLabSlotRegenKey(onyxSet.slots['shell-background']);
        const selectedKey = getSurfaceLabSlotRegenKey(paperSet.slots['shell-background']);
        const RegenConsoleHarness = () => {
            const { regenMarks, toggleSurfaceLabSlotRegenMark } = useSurfaceLabRegenMarks();

            return (
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={assetSets}
                    selectedSet={paperSet}
                    selectedSetId={paperSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="All"
                    setRatingFilter={vi.fn()}
                    regenFilter="All"
                    setRegenFilter={vi.fn()}
                    styleRatings={{}}
                    styleRating={null}
                    setStyleRating={vi.fn()}
                    regenMarks={regenMarks}
                    toggleSurfaceLabSlotRegenMark={toggleSurfaceLabSlotRegenMark}
                    slotOverrides={{ 'shell-background': onyxSet.id }}
                    setSlotOverrides={vi.fn()}
                    assetSlots={assetSlots}
                    styles={styles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<RegenConsoleHarness />);
        });

        await act(async () => {
            (
                document.body.querySelector(
                    'button[aria-label="Mark Shell for regeneration"]'
                ) as HTMLButtonElement | null
            )?.click();
        });

        const stored = JSON.parse(
            window.localStorage.getItem(SURFACE_LAB_REGEN_MARKS_STORAGE_KEY) ?? '{}'
        );
        expect(stored).toMatchObject({ [overrideKey]: true });
        expect(stored).not.toHaveProperty(selectedKey);
    });

    it('filters style selectors by manual rating category', async () => {
        const normalized = normalizeSurfaceLabCandidates([
            ...createCandidateSet('paper-lantern', 'A'),
            ...createCandidateSet('onyx-archive', 'A'),
        ]);
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const paperSet = assetSets.find((set) => set.style === 'paper-lantern')!;
        const onyxSet = assetSets.find((set) => set.style === 'onyx-archive')!;
        const styleRatings: SurfaceLabStyleRatings = { [onyxSet.id]: 10 };
        const ratedVisible = assetSets.filter((set) =>
            matchesSurfaceLabRatingFilter(set, styleRatings, '10')
        );
        const styles = createVisualLabShellStyles('dark', createLayout(), onyxSet.slots, {});

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={ratedVisible}
                    selectedSet={onyxSet}
                    selectedSetId={onyxSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="10"
                    setRatingFilter={vi.fn()}
                    regenFilter="All"
                    setRegenFilter={vi.fn()}
                    styleRatings={styleRatings}
                    styleRating={10}
                    setStyleRating={vi.fn()}
                    regenMarks={{}}
                    toggleSurfaceLabSlotRegenMark={vi.fn()}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={onyxSet.slots}
                    styles={styles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        });

        const styleSelect = Array.from(document.body.querySelectorAll('label'))
            .find((label) => label.querySelector('span')?.textContent === 'Style')
            ?.querySelector('select') as HTMLSelectElement | undefined;
        expect(Array.from(styleSelect?.options ?? []).map((option) => option.value)).toEqual([
            'onyx-archive',
        ]);

        await act(async () => {
            root?.unmount();
        });

        const unratedVisible = assetSets.filter((set) =>
            matchesSurfaceLabRatingFilter(set, styleRatings, 'Unrated')
        );
        const paperStyles = createVisualLabShellStyles('dark', createLayout(), paperSet.slots, {});

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={unratedVisible}
                    selectedSet={paperSet}
                    selectedSetId={paperSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="Unrated"
                    setRatingFilter={vi.fn()}
                    regenFilter="All"
                    setRegenFilter={vi.fn()}
                    styleRatings={styleRatings}
                    styleRating={null}
                    setStyleRating={vi.fn()}
                    regenMarks={{}}
                    toggleSurfaceLabSlotRegenMark={vi.fn()}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={paperSet.slots}
                    styles={paperStyles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        });

        const unratedStyleSelect = Array.from(document.body.querySelectorAll('label'))
            .find((label) => label.querySelector('span')?.textContent === 'Style')
            ?.querySelector('select') as HTMLSelectElement | undefined;
        expect(
            Array.from(unratedStyleSelect?.options ?? []).map((option) => option.value)
        ).toContain('paper-lantern');
        expect(
            Array.from(unratedStyleSelect?.options ?? []).map((option) => option.value)
        ).not.toContain('onyx-archive');
    });

    it('filters style selectors by slot regeneration category', async () => {
        const normalized = normalizeSurfaceLabCandidates([
            ...createCandidateSet('paper-lantern', 'A'),
            ...createCandidateSet('onyx-archive', 'A'),
        ]);
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const paperSet = assetSets.find((set) => set.style === 'paper-lantern')!;
        const onyxSet = assetSets.find((set) => set.style === 'onyx-archive')!;
        const regenMarks: SurfaceLabRegenMarks = {
            [getSurfaceLabSlotRegenKey(onyxSet.slots['gem-panel'])]: true,
        };
        const regenVisible = assetSets.filter((set) =>
            matchesSurfaceLabRegenFilter(set, regenMarks, 'Needs regen')
        );
        const styles = createVisualLabShellStyles('dark', createLayout(), onyxSet.slots, {});

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={regenVisible}
                    selectedSet={onyxSet}
                    selectedSetId={onyxSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="All"
                    setRatingFilter={vi.fn()}
                    regenFilter="Needs regen"
                    setRegenFilter={vi.fn()}
                    styleRatings={{}}
                    styleRating={null}
                    setStyleRating={vi.fn()}
                    regenMarks={regenMarks}
                    toggleSurfaceLabSlotRegenMark={vi.fn()}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={onyxSet.slots}
                    styles={styles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        });

        const styleSelect = Array.from(document.body.querySelectorAll('label'))
            .find((label) => label.querySelector('span')?.textContent === 'Style')
            ?.querySelector('select') as HTMLSelectElement | undefined;
        expect(Array.from(styleSelect?.options ?? []).map((option) => option.value)).toEqual([
            'onyx-archive',
        ]);

        await act(async () => {
            root?.unmount();
        });

        const cleanVisible = assetSets.filter((set) =>
            matchesSurfaceLabRegenFilter(set, regenMarks, 'Clean')
        );
        const paperStyles = createVisualLabShellStyles('dark', createLayout(), paperSet.slots, {});

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    visibleAssetSets={cleanVisible}
                    selectedSet={paperSet}
                    selectedSetId={paperSet.id}
                    setSelectedSetId={vi.fn()}
                    ratingFilter="All"
                    setRatingFilter={vi.fn()}
                    regenFilter="Clean"
                    setRegenFilter={vi.fn()}
                    styleRatings={{}}
                    styleRating={null}
                    setStyleRating={vi.fn()}
                    regenMarks={regenMarks}
                    toggleSurfaceLabSlotRegenMark={vi.fn()}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={paperSet.slots}
                    styles={paperStyles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={createMotionOptions()}
                    setMotionOptions={vi.fn()}
                    holdRoyalIntro={false}
                    setHoldRoyalIntro={vi.fn()}
                    onTriggerMotion={vi.fn()}
                    onRepeatMotion={vi.fn()}
                    onClearMotion={vi.fn()}
                />
            );
        });

        const cleanStyleSelect = Array.from(document.body.querySelectorAll('label'))
            .find((label) => label.querySelector('span')?.textContent === 'Style')
            ?.querySelector('select') as HTMLSelectElement | undefined;
        expect(Array.from(cleanStyleSelect?.options ?? []).map((option) => option.value)).toContain(
            'paper-lantern'
        );
        expect(
            Array.from(cleanStyleSelect?.options ?? []).map((option) => option.value)
        ).not.toContain('onyx-archive');
    });

    it('selects the first matching set when the current set is hidden by rating filter', () => {
        const normalized = normalizeSurfaceLabCandidates([
            ...createCandidateSet('paper-lantern', 'A'),
            ...createCandidateSet('onyx-archive', 'A'),
        ]);
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const paperSet = assetSets.find((set) => set.style === 'paper-lantern')!;
        const onyxSet = assetSets.find((set) => set.style === 'onyx-archive')!;

        expect(getNextSurfaceLabSelectedSetId(paperSet.id, assetSets, [onyxSet])).toBe(onyxSet.id);
    });

    it('selects the first matching set when the current set is hidden by regeneration filter', () => {
        const normalized = normalizeSurfaceLabCandidates([
            ...createCandidateSet('paper-lantern', 'A'),
            ...createCandidateSet('onyx-archive', 'A'),
        ]);
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const paperSet = assetSets.find((set) => set.style === 'paper-lantern')!;
        const onyxSet = assetSets.find((set) => set.style === 'onyx-archive')!;
        const regenMarks: SurfaceLabRegenMarks = {
            [getSurfaceLabSlotRegenKey(onyxSet.slots['gem-panel'])]: true,
        };
        const visibleByRegen = assetSets.filter((set) =>
            matchesSurfaceLabRegenFilter(set, regenMarks, 'Needs regen')
        );

        expect(getNextSurfaceLabSelectedSetId(paperSet.id, assetSets, visibleByRegen)).toBe(
            onyxSet.id
        );
    });
});
