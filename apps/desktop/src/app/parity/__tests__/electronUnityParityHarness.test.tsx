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
            <button data-card-preview-backdrop="true">Backdrop</button>
            <button data-card-preview-action="buy">Buy</button>
            <button data-card-preview-action="reserve">Reserve</button>
            <div data-reserved-slot="p1-0"><button data-card-preview-click="true">Reserved</button></div>
            <button data-game-action="replenish">End</button>
            <button data-royal-card="r91-ro">Royal</button>
            <button aria-label="Settings">Settings</button>
        </main>
    `;
    document.querySelector('button[aria-label="Settings"]')?.addEventListener('click', () => {
        const settingsMenu = document.createElement('div');
        settingsMenu.dataset.settingsMenu = 'true';
        settingsMenu.textContent = 'Settings panel';
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
        await expect(api.dispatch('click_player_reserved', { index: 0 })).resolves.toMatchObject({
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

        (params.game as unknown as { state: GameState }).state = createState({ royalDeck: [] });
        await expect(api.dispatch('choose_royal', { index: 0 })).resolves.toMatchObject({
            ok: false,
            action: 'choose_royal',
            detail: 'No royal at index 0.',
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
