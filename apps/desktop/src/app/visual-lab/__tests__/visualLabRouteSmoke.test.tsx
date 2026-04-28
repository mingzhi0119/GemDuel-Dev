// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import type { AppRouteProps } from '@app/types/ui';
import type { GameAction } from '@gemduel/shared/types';
import { VisualLabRoute } from '../VisualLabRoute';
import { VisualLabConsole } from '../VisualLabConsole';
import { SURFACE_LAB_SLOTS, type SurfaceLabCandidate } from '../surfaceLabTypes';
import { createSurfaceLabAssetSets, normalizeSurfaceLabCandidates } from '../surfaceLabCatalog';
import { createVisualLabShellStyles } from '../visualLabStyles';
import type { SurfaceLabMotionOptions } from '../motionLabEvents';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const noop = () => {};

const createCandidate = (slot: SurfaceLabCandidate['slot']): SurfaceLabCandidate => ({
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
});

const createLayout = (): AppRouteProps['layout'] => ({
    layoutMode: 'desktop-4k',
    viewportWidth: 1920,
    viewportHeight: 1200,
    aspectRatio: 1.6,
    stageCanvasWidthPx: 3840,
    stageCanvasHeightPx: 2400,
    stageScale: 0.5,
    stageInsetXPx: 0,
    stageInsetYPx: 0,
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
        root = null;
        container = null;
        vi.restoreAllMocks();
    });

    it('mounts VisualLabRoute (surfaces) without throwing after catalog load', async () => {
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
        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabRoute
                    appVersion="0.test"
                    game={game}
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
                    }}
                    setters={{
                        setShowDebug: vi.fn(),
                        setIsReviewing: vi.fn(),
                        setShowRulebook: vi.fn(),
                        setMatchmakingRoute: vi.fn(),
                        setIsPeekingBoard: vi.fn(),
                        setShowRestartConfirm: vi.fn(),
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
                    mode="surfaces"
                />
            );
        });

        for (let attempt = 0; attempt < 30; attempt += 1) {
            await flushMicrotasks();
            if (container?.querySelector('[data-testid="visual-lab-route"]')) {
                break;
            }
        }

        expect(container?.querySelector('[data-testid="visual-lab-route"]')).toBeTruthy();
        const back = container?.querySelector(
            '[data-app-restart-button="true"]'
        ) as HTMLButtonElement | null;
        expect(back).not.toBeNull();
        await act(async () => {
            back?.click();
        });
        expect(onCloseToStartPage).toHaveBeenCalledTimes(1);
    });

    it('mounts VisualLabConsole without throwing', async () => {
        const normalized = normalizeSurfaceLabCandidates(
            SURFACE_LAB_SLOTS.map((slot) => createCandidate(slot))
        );
        const assetSets = createSurfaceLabAssetSets(normalized, 'dark');
        const selectedSet = assetSets[0];
        const assetSlots = selectedSet.slots;
        const styles = createVisualLabShellStyles('dark', createLayout(), assetSlots, {});
        const motionOptions: SurfaceLabMotionOptions = {
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
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabConsole
                    mode="surfaces"
                    catalogStatus="ready"
                    assetSets={assetSets}
                    selectedSet={selectedSet}
                    selectedSetId={selectedSet.id}
                    setSelectedSetId={vi.fn()}
                    slotOverrides={{}}
                    setSlotOverrides={vi.fn()}
                    assetSlots={assetSlots}
                    styles={styles}
                    activeEvent={null}
                    motionType="royal-unlock"
                    setMotionType={vi.fn()}
                    motionOptions={motionOptions}
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
    });
});
