import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Card, GameAction, GameState, RoyalCard } from '@gemduel/shared/types';
import {
    createElectronUnityParityApi,
    useElectronUnityParityHarness,
} from '../electronUnityParityHarness';
import type { UseElectronUnityParityHarnessParams } from '../electronUnityParityTypes';

const replayMocks = vi.hoisted(() => ({
    buildReplaySyntheticHistory: vi.fn(),
    readReplayVNext: vi.fn(),
}));

vi.mock('@gemduel/shared/replay', () => replayMocks);

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const card = (id: string): Card => ({ id, uid: id }) as Card;
const royal = (id: string): RoyalCard => ({ id }) as RoyalCard;

const createState = (overrides: Partial<GameState> = {}): GameState =>
    ({
        mode: 'LOCAL_PVP',
        phase: 'PLAY',
        turn: 'p1',
        winner: null,
        selectedGems: [],
        board: [[{ type: { id: 'red' } }]],
        market: {
            1: [card('112-re')],
            2: [card('215-re')],
            3: [card('323-gr')],
        },
        decks: { 1: [], 2: [], 3: [] },
        royalDeck: [royal('r91-ro')],
        playerBuffs: {
            p1: { id: 'royal_envoy', state: null },
            p2: { id: 'echo_reservoir', state: null },
        },
        draftPool: ['collector', 'royal_envoy', 'minimalist'],
        p2DraftPool: ['royal_envoy', 'echo_reservoir', 'wonder_architect', 'minimalist'],
        p1SelectedBuff: null,
        draftOrder: [],
        buffLevel: 3,
        p2DraftLevel: 3,
        playerTableau: { p1: [], p2: [] },
        playerReserved: { p1: [card('171-jo')], p2: [] },
        playerRoyals: { p1: [], p2: [] },
        inventories: {
            p1: { red: 1, green: 0, blue: 0, white: 0, black: 0, pearl: 0, gold: 0 },
            p2: { red: 0, green: 1, blue: 0, white: 0, black: 0, pearl: 0, gold: 0 },
        },
        privileges: { p1: 0, p2: 0 },
        extraPoints: { p1: 0, p2: 0 },
        extraCrowns: { p1: 0, p2: 0 },
        pendingReserve: null,
        pendingBuy: null,
        ...overrides,
    }) as GameState;

const createParams = () => {
    const game = {
        state: createState(),
        historyControls: {
            currentIndex: 0,
            historyLength: 1,
            historySource: 'local',
        },
        handlers: {
            importHistory: vi.fn((history: GameAction[]) => {
                game.historyControls.currentIndex = Math.max(0, history.length - 1);
                game.historyControls.historyLength = history.length;
                game.historyControls.historySource = 'replay-import';
            }),
            handleForceRoyal: vi.fn(() => {
                game.state = createState({ phase: 'SELECT_ROYAL' });
            }),
            handleSelectRoyal: vi.fn(() => {
                const [selectedRoyal, ...remainingRoyalDeck] = game.state.royalDeck;
                if (selectedRoyal) {
                    game.state = createState({
                        ...game.state,
                        phase: 'IDLE',
                        turn: 'p2',
                        royalDeck: remainingRoyalDeck,
                        playerRoyals: {
                            ...game.state.playerRoyals,
                            p1: [...game.state.playerRoyals.p1, selectedRoyal],
                        },
                    });
                }
                game.historyControls.currentIndex += 1;
                game.historyControls.historyLength += 1;
            }),
        },
    };

    const params: UseElectronUnityParityHarnessParams = {
        game: game as unknown as UseElectronUnityParityHarnessParams['game'],
        layout: {
            viewportWidth: 1920,
            viewportHeight: 1080,
            stageCanvasWidthPx: 1500,
            stageCanvasHeightPx: 900,
        } as UseElectronUnityParityHarnessParams['layout'],
        locale: 'zh',
        theme: 'dark',
        surfaceTheme: {
            background: 'royal-luxury',
            playerZone: 'royal-luxury',
            gemPanel: 'royal-luxury',
            effects: 'anime',
        },
        soundEnabled: true,
        setupRoute: 'classic',
        matchmakingRoute: 'none',
        setLocale: vi.fn(),
        setSoundEnabled: vi.fn(),
        setStartSetupRoute: vi.fn(),
        startGame: vi.fn(() => {
            game.historyControls.currentIndex = 0;
            game.historyControls.historyLength = 1;
            game.historyControls.historySource = 'local';
            game.state = createState();
        }),
        selectSurfaceTheme: vi.fn(),
        reset: vi.fn(() => {
            game.historyControls.currentIndex = 0;
            game.historyControls.historyLength = 0;
            game.historyControls.historySource = 'empty';
            game.state = createState();
        }),
    };

    return { game, params };
};

const installDomTargets = () => {
    document.body.innerHTML = `
        <div id="root"></div>
        <main data-testid="desktop-stage-canvas">
            <span>选择一个模式开始</span>
            <div data-board-cell="0-0"></div>
            <div data-draft-card-scale-reference="4">
                <button name="buff-selection" data-draft-buff-id="royal_envoy" data-draft-buff-index="1">Royal Envoy</button>
            </div>
            <div data-market-slot="1-0"><button data-card-preview-click="true">Preview</button></div>
            <div data-market-deck="1" role="button" tabIndex="0">Deck</div>
            <button data-card-preview-backdrop="true">Backdrop</button>
            <button data-card-preview-action="buy">Buy</button>
            <button data-card-preview-action="reserve">Reserve</button>
            <div data-reserved-slot="p1-0"><button data-card-preview-click="true">Reserved</button></div>
            <button data-player-zone-gem="p2-red">Opponent red</button>
            <button data-player-zone-gem="p1-red">Current red</button>
            <button data-game-action="replenish">End</button>
            <button data-royal-card="r91-ro">Royal</button>
            <button data-app-rulebook-button="true">Rulebook</button>
            <button data-app-restart-button="true">Restart</button>
            <button aria-label="Settings">Settings</button>
        </main>
    `;
    document.querySelector('[data-app-rulebook-button="true"]')?.addEventListener('click', () => {
        const rulebookPanel = document.createElement('div');
        rulebookPanel.dataset.rulebookPanel = 'preview-style';
        rulebookPanel.textContent = 'Rulebook panel';
        document.body.appendChild(rulebookPanel);
    });
    document.querySelector('[data-app-restart-button="true"]')?.addEventListener('click', () => {
        const confirm = document.createElement('button');
        confirm.dataset.appRestartConfirm = 'true';
        confirm.textContent = 'Confirm restart';
        confirm.addEventListener('click', () => {
            document.querySelector('[data-app-restart-confirm="true"]')?.remove();
        });
        document.body.appendChild(confirm);
    });
    document
        .querySelector('[data-reserved-slot="p1-0"] [data-card-preview-click="true"]')
        ?.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.dataset.cardPreviewOverlay = 'true';
            const card = document.createElement('div');
            card.dataset.cardPreviewCard = 'reserved-test-card';
            overlay.appendChild(card);
            document.body.appendChild(overlay);
        });
    document.querySelector('button[aria-label="Settings"]')?.addEventListener('click', () => {
        const settingsMenu = document.createElement('div');
        settingsMenu.dataset.settingsMenu = 'true';
        settingsMenu.textContent = 'Settings panel';
        const save = document.createElement('button');
        save.dataset.appSaveReplayButton = 'true';
        save.textContent = 'Save';
        const load = document.createElement('label');
        load.dataset.appLoadReplayControl = 'true';
        load.textContent = 'Load';
        const surface = document.createElement('button');
        surface.dataset.appSurfaceThemeSelect = 'true';
        surface.dataset.appSurfaceThemeControl = 'true';
        surface.textContent = 'Surface';
        settingsMenu.append(save, load, surface);
        document.body.appendChild(settingsMenu);
    });
};

const Harness = ({ params }: { params: UseElectronUnityParityHarnessParams }) => {
    useElectronUnityParityHarness(params);
    return null;
};

const renderHarness = (params: UseElectronUnityParityHarnessParams) => {
    const container = document.querySelector<HTMLDivElement>('#root');
    if (!container) {
        throw new Error('Missing root container.');
    }

    const root = createRoot(container);
    act(() => {
        root.render(<Harness params={params} />);
    });
    return root;
};

const flushEffects = async () => {
    await act(async () => {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

const createApi = (params: UseElectronUnityParityHarnessParams) =>
    createElectronUnityParityApi({ current: params });

describe('useElectronUnityParityHarness', () => {
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    let root: Root | null = null;

    beforeEach(() => {
        installDomTargets();
        window.history.pushState({}, '', '/?parityHarness=1');
        window.requestAnimationFrame = (callback: FrameRequestCallback) => {
            callback(0);
            return 0;
        };
        replayMocks.readReplayVNext.mockReturnValue({
            replay: {
                replayRevision: 1,
                events: [
                    { type: 'buy_card', marketRef: { level: 1, idx: 0 } },
                    { type: 'reserve_card', marketRef: { level: 1, idx: 0 } },
                    { type: 'replenish' },
                    { type: 'select_royal', royalId: 'r91-ro' },
                ],
            },
        });
        replayMocks.buildReplaySyntheticHistory.mockReturnValue([
            { type: 'INIT' },
            { type: 'BUY_CARD' },
            { type: 'RESERVE_CARD' },
            { type: 'REPLENISH' },
            { type: 'SELECT_ROYAL' },
        ]);
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        root = null;
        delete window.__GEMDUEL_PARITY__;
        document.body.innerHTML = '';
        window.history.pushState({}, '', '/');
        window.requestAnimationFrame = originalRequestAnimationFrame;
        vi.restoreAllMocks();
    });

    it('does not install outside the dev parity query path', async () => {
        const { params } = createParams();
        window.history.pushState({}, '', '/');

        root = renderHarness(params);
        await flushEffects();

        expect(window.__GEMDUEL_PARITY__).toBeUndefined();
    });

    it('creates an API that dumps current state', () => {
        const { params } = createParams();
        const api = createApi(params);

        expect(api.version).toBe(1);
        expect(api.actions).toContain('start_local_game');
        expect(api.actions).toContain('choose_boon');
        expect(api.actions).toContain('hover_boon');
        expect(api.actions).toContain('click_market_deck');
        expect(api.actions).toContain('click_preview_blank');
        expect(api.isReady()).toBe(true);
        expect(api.dumpState()).toMatchObject({
            source: 'electron',
            game: { phase: 'PLAY' },
        });
    });

    it('drives core semantic actions through the rendered UI and app handlers', async () => {
        const { params } = createParams();
        const api = createApi(params);

        await expect(api.dispatch('choose_mode', { mode: 'roguelike' })).resolves.toMatchObject({
            ok: true,
            action: 'choose_mode',
        });
        expect(params.setStartSetupRoute).toHaveBeenCalledWith('roguelike');

        await expect(
            api.dispatch('start_local_game', { seed: 'parity-seed', useBuffs: true })
        ).resolves.toMatchObject({ ok: true, action: 'start_local_game' });
        expect(params.startGame).toHaveBeenCalledWith('LOCAL_PVP', {
            useBuffs: true,
            seed: 'parity-seed',
        });

        document
            .querySelector('[data-draft-buff-id="royal_envoy"]')
            ?.addEventListener('click', () => {
                params.game.historyControls.currentIndex += 1;
                params.game.historyControls.historyLength += 1;
            });
        await expect(
            api.dispatch('choose_boon', { buffId: 'royal_envoy', index: 1 })
        ).resolves.toMatchObject({
            ok: true,
            action: 'choose_boon',
            driver: 'dom-click',
        });
        await expect(
            api.dispatch('hover_boon', { buffId: 'royal_envoy', index: 1 })
        ).resolves.toMatchObject({
            ok: true,
            action: 'hover_boon',
            driver: 'dom-hover',
        });

        await expect(
            api.dispatch('click_market_card', { level: 1, index: 0 })
        ).resolves.toMatchObject({ ok: true, action: 'click_market_card', driver: 'dom-click' });
        await expect(api.dispatch('click_market_deck', { level: 1 })).resolves.toMatchObject({
            ok: true,
            action: 'click_market_deck',
            driver: 'dom-click',
        });
        await expect(api.dispatch('click_preview_blank')).resolves.toMatchObject({
            ok: true,
            action: 'click_preview_blank',
            driver: 'dom-click',
        });
        await expect(api.dispatch('buy_card', { level: 1, index: 0 })).resolves.toMatchObject({
            ok: true,
            action: 'buy_card',
            driver: 'dom-click',
        });
        await expect(api.dispatch('reserve_card', { level: 1, index: 0 })).resolves.toMatchObject({
            ok: true,
            action: 'reserve_card',
            driver: 'dom-click',
        });
        await expect(
            api.dispatch('click_player_reserved', { index: 0, player: 'p1' })
        ).resolves.toMatchObject({
            ok: true,
            action: 'click_player_reserved',
            driver: 'dom-click',
        });
        await expect(
            api.dispatch('confirm_preview_action', { actionId: 'reserve' })
        ).resolves.toMatchObject({
            ok: true,
            action: 'confirm_preview_action',
            driver: 'dom-click',
        });
        await expect(api.dispatch('end_turn')).resolves.toMatchObject({
            ok: true,
            action: 'end_turn',
            driver: 'dom-click',
        });
        await expect(api.dispatch('force_royal_selection')).resolves.toMatchObject({
            ok: true,
            action: 'force_royal_selection',
        });
        expect(params.game.handlers.handleForceRoyal).toHaveBeenCalledTimes(1);
        document.querySelector('[data-royal-card="r91-ro"]')?.addEventListener('click', () => {
            params.game.handlers.handleSelectRoyal(params.game.state.royalDeck[0]);
        });
        await expect(api.dispatch('choose_royal', { index: 0 })).resolves.toMatchObject({
            ok: true,
            action: 'choose_royal',
            driver: 'dom-click',
        });
        expect(params.game.handlers.handleSelectRoyal).toHaveBeenCalledTimes(1);
        await expect(api.dispatch('open_settings')).resolves.toMatchObject({
            ok: true,
            action: 'open_settings',
        });
        await expect(
            api.dispatch('change_setting', { name: 'locale', value: 'en' })
        ).resolves.toMatchObject({ ok: true, action: 'change_setting' });
        expect(params.setLocale).toHaveBeenCalledWith('en');
        await expect(
            api.dispatch('change_setting', { name: 'soundEnabled', value: false })
        ).resolves.toMatchObject({ ok: true, action: 'change_setting' });
        expect(params.setSoundEnabled).toHaveBeenCalledWith(false);
        await expect(
            api.dispatch('change_setting', { name: 'surfaceTheme', value: 'royal-luxury' })
        ).resolves.toMatchObject({ ok: true, action: 'change_setting' });
        expect(params.selectSurfaceTheme).toHaveBeenCalledWith('royal-luxury');
        await expect(api.dispatch('invalid_action')).resolves.toMatchObject({
            ok: true,
            action: 'invalid_action',
        });
        expect(document.querySelector('[data-parity-error-banner]')?.textContent).toBe(
            'Invalid semantic action'
        );
    });

    it('drives settings mutations through visible DOM controls when present', async () => {
        const { params } = createParams();
        const api = createApi(params);
        const soundToggle = document.createElement('button');
        soundToggle.dataset.appSoundToggle = 'true';
        soundToggle.addEventListener('click', () => {
            params.soundEnabled = !params.soundEnabled;
        });
        const surfaceOption = document.createElement('button');
        surfaceOption.dataset.appSurfaceThemeOption = 'royal-luxury';
        surfaceOption.addEventListener('click', () => {
            params.selectSurfaceTheme('royal-luxury');
        });
        document.body.append(soundToggle, surfaceOption);

        await expect(
            api.dispatch('change_setting', { name: 'soundEnabled', value: false })
        ).resolves.toMatchObject({
            ok: true,
            action: 'change_setting',
            driver: 'dom-click',
            detail: 'Clicked sound toggle to false.',
        });
        expect(params.soundEnabled).toBe(false);

        await expect(
            api.dispatch('change_setting', { name: 'soundEnabled', value: false })
        ).resolves.toMatchObject({
            ok: true,
            action: 'change_setting',
            driver: 'dom-click',
            detail: 'Clicked sound toggle twice to preserve false.',
        });
        expect(params.soundEnabled).toBe(false);

        await expect(
            api.dispatch('change_setting', { name: 'surfaceTheme', value: 'royal-luxury' })
        ).resolves.toMatchObject({
            ok: true,
            action: 'change_setting',
            driver: 'dom-click',
        });
        expect(params.selectSurfaceTheme).toHaveBeenCalledWith('royal-luxury');
    });

    it('loads replay fixtures and falls back to replay-backed semantic events', async () => {
        const { params } = createParams();
        const api = createApi(params);
        document.querySelector('[data-card-preview-action="buy"]')?.remove();
        document.querySelector('[data-card-preview-action="reserve"]')?.remove();
        document.querySelector('[data-game-action="replenish"]')?.remove();

        await expect(
            api.dispatch('load_replay_fixture', { rawText: '{"events":[]}', revision: 0 })
        ).resolves.toMatchObject({
            ok: true,
            action: 'load_replay_fixture',
            detail: 'Loaded replay revision 0.',
        });
        expect(replayMocks.readReplayVNext).toHaveBeenCalledWith('{"events":[]}', {
            verifySummary: 'sample',
        });
        expect(params.game.handlers.importHistory).toHaveBeenCalledWith([{ type: 'INIT' }]);

        await expect(api.dispatch('buy_card', { level: 1, index: 0 })).resolves.toMatchObject({
            ok: true,
            action: 'buy_card',
            detail: 'Applied replay-backed semantic buy_card action.',
        });
        await expect(api.dispatch('reserve_card', { level: 1, index: 0 })).resolves.toMatchObject({
            ok: true,
            action: 'reserve_card',
            detail: 'Applied replay-backed semantic reserve_card action.',
        });
        await expect(api.dispatch('end_turn')).resolves.toMatchObject({
            ok: true,
            action: 'end_turn',
            detail: 'Applied replay-backed semantic replenish action.',
        });
    });

    it('covers replay setup variants, mismatch recovery, and dispatch errors', async () => {
        const { params } = createParams();
        (
            params as UseElectronUnityParityHarnessParams & { setReplayReviewing: () => void }
        ).setReplayReviewing = vi.fn();
        (params.game as unknown as { getters: { isMyTurn: boolean } }).getters = {
            isMyTurn: true,
        };
        const api = createApi(params);

        await expect(
            api.dispatch('start_local_game', {
                rawText: '{"events":[]}',
                revision: -4,
                interactive: true,
            })
        ).resolves.toMatchObject({
            ok: true,
            action: 'start_local_game',
            detail: 'Loaded replay revision 0.',
            driver: 'setup-replay-load-interactive',
        });
        expect(params.startGame).toHaveBeenCalledWith('LOCAL_PVP', {
            useBuffs: false,
            seed: 'electron-unity-parity',
        });
        expect(params.setReplayReviewing).toHaveBeenCalledWith(false);

        await expect(api.dispatch('load_replay_fixture', { revision: 99 })).resolves.toMatchObject({
            ok: true,
            action: 'load_replay_fixture',
            detail: 'Loaded replay revision 4.',
        });
        expect(replayMocks.readReplayVNext).toHaveBeenCalledWith('', { verifySummary: 'sample' });

        document.querySelector('[data-card-preview-action="buy"]')?.remove();
        document.querySelector('[data-card-preview-action="reserve"]')?.remove();
        await expect(
            api.dispatch('load_replay_fixture', { rawText: '{"events":[]}', revision: 0 })
        ).resolves.toMatchObject({ ok: true });
        await expect(api.dispatch('buy_card', { level: 2, index: 0 })).resolves.toMatchObject({
            ok: false,
            action: 'buy_card',
            detail: 'No loaded replay event buy_card at revision 0.',
        });
        await expect(api.dispatch('reserve_card', { level: 1, index: 0 })).resolves.toMatchObject({
            ok: false,
            action: 'reserve_card',
            detail: 'No loaded replay event reserve_card at revision 0.',
        });

        const throwingParams = createParams().params;
        throwingParams.startGame = vi.fn(() => {
            throw new Error('start failed');
        });
        const throwingApi = createApi(throwingParams);
        await expect(throwingApi.dispatch('start_local_game')).resolves.toMatchObject({
            ok: false,
            action: 'start_local_game',
            detail: 'start failed',
        });
    });

    it('drives chrome, hover, board, gem, and settings controls through DOM paths', async () => {
        const { game, params } = createParams();
        const api = createApi(params);

        document
            .querySelector('[data-draft-buff-id="royal_envoy"]')
            ?.removeAttribute('data-draft-buff-id');
        document
            .querySelector('[name="buff-selection"]')
            ?.setAttribute('data-draft-buff-index', '1');
        document.querySelector('[name="buff-selection"]')?.addEventListener('click', () => {
            game.historyControls.currentIndex += 1;
            game.historyControls.historyLength += 1;
        });

        const restart = document.querySelector('[data-app-restart-button="true"]');
        restart?.addEventListener(
            'click',
            () => {
                const confirm = document.createElement('button');
                confirm.dataset.appRestartConfirm = 'true';
                confirm.addEventListener('click', () => {
                    params.reset();
                    confirm.remove();
                });
                document.body.prepend(confirm);
            },
            { once: true }
        );

        const boardCell = document.querySelector('[data-board-cell="0-0"]');
        const boardButton = document.createElement('button');
        boardButton.textContent = 'Gem';
        boardButton.addEventListener('click', () => {
            game.historyControls.currentIndex += 1;
            game.historyControls.historyLength += 1;
            const nextState = createState({
                ...game.state,
                phase: 'IDLE',
            }) as GameState & { selectedGems: Array<{ r: number; c: number }> };
            nextState.selectedGems = [{ r: 0, c: 0 }];
            game.state = nextState;
        });
        boardCell?.appendChild(boardButton);

        const confirmTake = document.createElement('button');
        confirmTake.dataset.gameAction = 'confirm-take';
        confirmTake.addEventListener('click', () => {
            game.historyControls.currentIndex += 1;
            game.historyControls.historyLength += 1;
            const nextState = createState({ ...game.state, turn: 'p2' }) as GameState & {
                selectedGems: [];
            };
            nextState.selectedGems = [];
            game.state = nextState;
        });
        const cancelTake = document.createElement('button');
        cancelTake.dataset.gameAction = 'cancel-take';
        document.body.append(confirmTake, cancelTake);

        document.querySelector('[data-player-zone-gem="p2-red"]')?.addEventListener('click', () => {
            game.historyControls.currentIndex += 1;
            game.historyControls.historyLength += 1;
            game.state = createState({ ...game.state, phase: 'IDLE', turn: 'p2' });
        });
        document.querySelector('[data-player-zone-gem="p1-red"]')?.addEventListener('click', () => {
            game.historyControls.currentIndex += 1;
            game.historyControls.historyLength += 1;
            game.state = createState({ ...game.state, phase: 'IDLE', turn: 'p2' });
        });

        document.addEventListener(
            'pointerdown',
            () => document.querySelector('[data-settings-menu]')?.remove(),
            { once: true }
        );

        await expect(api.dispatch('choose_mode', { mode: 'classic' })).resolves.toMatchObject({
            ok: true,
        });
        expect(params.setStartSetupRoute).toHaveBeenCalledWith('classic');

        await expect(api.dispatch('choose_boon', { index: 1 })).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(api.dispatch('hover_boon', { index: 1 })).resolves.toMatchObject({
            ok: true,
            driver: 'dom-hover',
        });
        await expect(api.dispatch('click_chrome_rulebook')).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(api.dispatch('click_chrome_restart')).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(
            api.dispatch('hover_chrome_control', { control: 'rulebook' })
        ).resolves.toMatchObject({
            ok: true,
            driver: 'dom-hover',
        });
        await expect(
            api.dispatch('hover_chrome_control', { control: 'restart' })
        ).resolves.toMatchObject({
            ok: true,
            driver: 'dom-hover',
        });
        await expect(api.dispatch('hover_chrome_control')).resolves.toMatchObject({
            ok: true,
            driver: 'dom-hover',
        });

        await expect(
            api.dispatch('hover_market_card', { level: 1, index: 0 })
        ).resolves.toMatchObject({
            ok: true,
            driver: 'dom-hover',
        });
        await expect(api.dispatch('hover_market_deck', { level: 1 })).resolves.toMatchObject({
            ok: true,
            driver: 'dom-hover',
        });
        await expect(
            api.dispatch('hover_player_reserved', { player: 'p1', index: 0 })
        ).resolves.toMatchObject({
            ok: true,
            driver: 'dom-hover',
        });
        await expect(
            api.dispatch('click_board_cell', { row: 0, column: 0 })
        ).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(api.dispatch('hover_board_cell', { r: 0, c: 0 })).resolves.toMatchObject({
            ok: true,
            driver: 'dom-hover',
        });
        await expect(api.dispatch('confirm_gem_selection')).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(api.dispatch('cancel_gem_selection')).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(api.dispatch('take_bonus_gem', { row: 0, column: 0 })).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(api.dispatch('steal_gem', { gemId: 'red' })).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(
            api.dispatch('discard_gem', { player: 'p1', gemId: 'red' })
        ).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(
            api.dispatch('hover_player_gem', { role: 'opponent', gemId: 'red' })
        ).resolves.toMatchObject({
            ok: true,
            driver: 'dom-hover',
        });

        await expect(api.dispatch('open_settings')).resolves.toMatchObject({ ok: true });
        await expect(api.dispatch('settings_save')).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(api.dispatch('settings_load')).resolves.toMatchObject({
            ok: true,
            driver: 'dom-click',
        });
        await expect(
            api.dispatch('change_setting', { name: 'locale', value: 'zh' })
        ).resolves.toMatchObject({
            ok: true,
            detail: 'Set locale zh through harness fallback.',
        });
        await expect(
            api.dispatch('change_setting', { name: 'surfaceTheme', value: 'anime' })
        ).resolves.toMatchObject({
            ok: true,
            detail: 'Set surface theme anime through fallback.',
        });
        await expect(api.dispatch('close_settings')).resolves.toMatchObject({
            ok: true,
            detail: 'Closed settings panel.',
        });
    });

    it('reports unsupported or missing semantic targets without mutating through shortcuts', async () => {
        const { params } = createParams();
        const api = createApi(params);

        await expect(
            api.dispatch('change_setting', { name: 'unknown', value: true })
        ).resolves.toMatchObject({
            ok: false,
            action: 'change_setting',
            detail: 'Unsupported setting unknown.',
        });

        document.querySelector('[data-draft-buff-id="royal_envoy"]')?.remove();
        await expect(
            api.dispatch('hover_boon', { buffId: 'royal_envoy', index: 1 })
        ).resolves.toMatchObject({
            ok: false,
            action: 'hover_boon',
            detail: 'No draft boon target for royal_envoy.',
            driver: 'missing-dom-target',
        });

        document.querySelector('[data-card-preview-backdrop="true"]')?.remove();
        await expect(api.dispatch('click_preview_blank')).resolves.toMatchObject({
            ok: false,
            action: 'click_preview_blank',
            detail: 'No preview blank backdrop target.',
            driver: 'missing-dom-target',
        });

        document.querySelector('[data-market-slot="1-0"]')?.remove();
        await expect(
            api.dispatch('click_market_card', { level: 1, index: 0 })
        ).resolves.toMatchObject({
            ok: false,
            action: 'click_market_card',
            detail: 'No market card target for 1-0.',
        });

        document.querySelector('[data-market-deck="1"]')?.remove();
        await expect(api.dispatch('click_market_deck', { level: 1 })).resolves.toMatchObject({
            ok: false,
            action: 'click_market_deck',
            detail: 'No market deck target for 1.',
            driver: 'missing-dom-target',
        });

        (params.game as unknown as { state: GameState }).state = createState({ royalDeck: [] });
        await expect(api.dispatch('choose_royal', { index: 0 })).resolves.toMatchObject({
            ok: false,
            action: 'choose_royal',
            detail: 'No royal at index 0.',
        });
    });

    it('reports missing DOM paths and uses replay fallback for board and gem actions', async () => {
        const { params } = createParams();
        replayMocks.readReplayVNext.mockReturnValue({
            replay: {
                replayRevision: 0,
                events: [
                    { type: 'take_bonus_gem', coord: { r: 0, c: 0 } },
                    { type: 'steal_gem', gemId: 'red' },
                    { type: 'discard_gem', gemId: 'red' },
                    { type: 'replenish' },
                ],
            },
        });
        replayMocks.buildReplaySyntheticHistory.mockReturnValue([
            { type: 'INIT' },
            { type: 'TAKE_BONUS_GEM' },
            { type: 'STEAL_GEM' },
            { type: 'DISCARD_GEM' },
            { type: 'REPLENISH' },
        ]);
        const api = createApi(params);

        document.querySelector('[data-app-rulebook-button="true"]')?.remove();
        document.querySelector('[data-app-restart-button="true"]')?.remove();
        document.querySelector('button[aria-label="Settings"]')?.remove();
        document.querySelector('[name="buff-selection"]')?.setAttribute('disabled', 'true');
        document.querySelector('[data-market-slot="1-0"]')?.remove();
        document.querySelector('[data-market-deck="1"]')?.remove();
        document.querySelector('[data-card-preview-action="buy"]')?.remove();
        document.querySelector('[data-card-preview-action="reserve"]')?.remove();
        document.querySelector('[data-reserved-slot="p1-0"]')?.remove();
        document.querySelector('[data-game-action="replenish"]')?.remove();
        document.querySelector('[data-player-zone-gem="p2-red"]')?.remove();
        document.querySelector('[data-player-zone-gem="p1-red"]')?.remove();

        await expect(api.dispatch('choose_boon')).resolves.toMatchObject({
            ok: false,
            detail: 'No enabled draft boon target for 0.',
        });
        await expect(api.dispatch('click_chrome_rulebook')).resolves.toMatchObject({
            ok: false,
            detail: 'Rulebook control or panel not found.',
        });
        await expect(api.dispatch('click_chrome_restart')).resolves.toMatchObject({
            ok: false,
            detail: 'Restart control, confirmation, or reset state was not observed.',
        });
        await expect(
            api.dispatch('hover_chrome_control', { control: 'unknown' })
        ).resolves.toMatchObject({
            ok: false,
            detail: 'Chrome control not found.',
        });
        await expect(api.dispatch('open_settings')).resolves.toMatchObject({
            ok: false,
            detail: 'Settings control or panel not found.',
        });
        await expect(api.dispatch('settings_save')).resolves.toMatchObject({
            ok: false,
            detail: 'Settings save replay control not found.',
        });
        await expect(api.dispatch('settings_load')).resolves.toMatchObject({
            ok: false,
            detail: 'Settings load replay control not found.',
        });
        await expect(api.dispatch('close_settings')).resolves.toMatchObject({
            ok: true,
            detail: 'Closed settings panel.',
        });
        await expect(
            api.dispatch('hover_market_card', { level: 1, index: 0 })
        ).resolves.toMatchObject({
            ok: false,
            detail: 'No market card target for 1-0.',
        });
        await expect(api.dispatch('hover_market_deck', { level: 1 })).resolves.toMatchObject({
            ok: false,
            detail: 'No market deck target for 1.',
        });
        await expect(api.dispatch('click_player_reserved')).resolves.toMatchObject({
            ok: false,
            detail: 'No preview opened for p1 reserved slot 0.',
        });
        await expect(api.dispatch('hover_player_reserved')).resolves.toMatchObject({
            ok: false,
            detail: 'No p1 reserved slot 0.',
        });
        await expect(api.dispatch('confirm_preview_action')).resolves.toMatchObject({
            ok: false,
            detail: 'No enabled preview action.',
        });
        await expect(api.dispatch('click_board_cell', { r: 9, c: 9 })).resolves.toMatchObject({
            ok: false,
            detail: 'No board cell target for 9-9.',
        });
        await expect(
            api.dispatch('hover_board_cell', { row: 9, column: 9 })
        ).resolves.toMatchObject({
            ok: false,
            detail: 'No board cell target for 9-9.',
        });
        await expect(api.dispatch('confirm_gem_selection')).resolves.toMatchObject({
            ok: false,
            detail: 'No enabled gem-selection confirm action.',
        });
        await expect(api.dispatch('cancel_gem_selection')).resolves.toMatchObject({
            ok: false,
            detail: 'No enabled gem-selection cancel action.',
        });

        await expect(
            api.dispatch('load_replay_fixture', { rawText: '{"events":[]}', revision: 0 })
        ).resolves.toMatchObject({ ok: true });
        await expect(api.dispatch('take_bonus_gem')).resolves.toMatchObject({
            ok: true,
            detail: 'Applied replay-backed semantic take_bonus_gem action.',
            driver: 'replay-state-import',
        });
        await expect(api.dispatch('steal_gem')).resolves.toMatchObject({
            ok: true,
            detail: 'Applied replay-backed semantic steal_gem action.',
            driver: 'replay-state-import',
        });
        await expect(api.dispatch('discard_gem')).resolves.toMatchObject({
            ok: true,
            detail: 'Applied replay-backed semantic discard_gem action.',
            driver: 'replay-state-import',
        });
        await expect(api.dispatch('end_turn')).resolves.toMatchObject({
            ok: true,
            detail: 'Applied replay-backed semantic replenish action.',
            driver: 'replay-state-import',
        });
    });

    it('runs step batches in order and resets loaded replay state', async () => {
        const { params } = createParams();
        const api = createApi(params);

        await expect(
            api.runSteps([
                { action: 'choose_mode', payload: { mode: 'classic' } },
                { action: 'reset' },
            ])
        ).resolves.toEqual([
            expect.objectContaining({ ok: true, action: 'choose_mode' }),
            expect.objectContaining({ ok: true, action: 'reset' }),
        ]);
        expect(params.reset).toHaveBeenCalledTimes(1);
        expect(document.querySelector('[data-parity-error-banner]')).toBeNull();
    });
});
