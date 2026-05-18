import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Card, GameState, ReservedCardView, RoyalCard } from '@gemduel/shared/types';
import { buildStateDump, hasRenderedRouteForState } from '../electronUnityParityState';
import type { UseElectronUnityParityHarnessParams } from '../electronUnityParityTypes';

const card = (id: string): Card => ({ id, uid: id }) as Card;
const royal = (id: string): RoyalCard => ({ id }) as RoyalCard;
const hiddenReserved = (slotKey: string): ReservedCardView =>
    ({ isHiddenReservedCard: true, slotKey }) as ReservedCardView;

const buildGameState = (
    overrides: Partial<GameState & { errorMsg?: string | null }> = {}
): GameState & { errorMsg?: string | null } =>
    ({
        mode: 'LOCAL_PVP',
        phase: 'PLAY',
        turn: 'p1',
        winner: null,
        errorMsg: null,
        selectedGems: [],
        board: [
            [{ type: { id: 'red' } }, { type: { id: 'blue' } }],
            [{ type: { id: 'white' } }, { type: { id: 'black' } }],
        ],
        market: {
            1: [card('112-re'), card('122-gr')],
            2: [card('215-re')],
            3: [card('323-gr')],
        },
        decks: {
            1: [card('115-re')],
            2: [card('244-wh')],
            3: [card('353-bk')],
        },
        royalDeck: [royal('r91-ro'), royal('r92-ro')],
        playerBuffs: {
            p1: { id: 'royal_envoy', state: { envoyTriggered: true } },
            p2: { id: 'echo_reservoir', state: null },
        },
        draftPool: ['collector', 'royal_envoy', 'minimalist'],
        p2DraftPool: ['royal_envoy', 'echo_reservoir', 'wonder_architect', 'minimalist'],
        p1SelectedBuff: { id: 'royal_envoy' },
        draftOrder: [],
        buffLevel: 3,
        p2DraftLevel: 3,
        playerTableau: {
            p1: [card('112-re')],
            p2: [card('122-gr')],
        },
        playerReserved: {
            p1: [card('171-jo') as ReservedCardView, hiddenReserved('hidden-p1-1')],
            p2: [card('181-po') as ReservedCardView],
        },
        playerRoyals: {
            p1: [royal('r93-ro')],
            p2: [],
        },
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
    }) as GameState & { errorMsg?: string | null };

const buildGame = (
    state: GameState & { errorMsg?: string | null },
    historyLength = 1
): UseElectronUnityParityHarnessParams['game'] =>
    ({
        state,
        historyControls: {
            currentIndex: Math.max(0, historyLength - 1),
            historyLength,
            historySource: historyLength > 0 ? 'local' : 'empty',
        },
    }) as unknown as UseElectronUnityParityHarnessParams['game'];

const buildParams = (
    state = buildGameState(),
    historyLength = 1
): Pick<
    UseElectronUnityParityHarnessParams,
    | 'game'
    | 'layout'
    | 'locale'
    | 'theme'
    | 'surfaceTheme'
    | 'soundEnabled'
    | 'setupRoute'
    | 'matchmakingRoute'
> => ({
    game: buildGame(state, historyLength),
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
});

const rect = (x: number, y: number, width: number, height: number) =>
    ({
        x,
        y,
        width,
        height,
        top: y,
        left: x,
        right: x + width,
        bottom: y + height,
        toJSON: () => ({ x, y, width, height }),
    }) as DOMRect;

const appendElement = (
    selectorKind: string,
    dataset: Record<string, string>,
    box = rect(10, 20, 100, 40),
    text = ''
) => {
    const element = document.createElement(selectorKind);
    Object.assign(element.dataset, dataset);
    element.textContent = text;
    element.getBoundingClientRect = () => box;
    document.body.appendChild(element);
    return element;
};

describe('electronUnityParityState', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-09T12:00:00.000Z'));
        document.title = 'GemDuel';
        document.body.innerHTML = '';
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('normalizes shared state, visible text, and canonical semantic boxes', () => {
        const state = buildGameState({
            pendingReserve: {
                level: 1,
                idx: 0,
                isDeck: false,
                card: card('112-re'),
            } as GameState['pendingReserve'],
            pendingBuy: {
                source: 'market',
                card: card('122-gr'),
                marketInfo: { level: 1, idx: 1 },
            } as GameState['pendingBuy'],
        });

        const viewport = appendElement('section', { testid: 'desktop-stage-viewport' });
        viewport.setAttribute('data-testid', 'desktop-stage-viewport');
        const canvas = appendElement('main', { testid: 'desktop-stage-canvas' });
        canvas.setAttribute('data-testid', 'desktop-stage-canvas');
        appendElement('div', { surfaceSlot: 'gem-panel' });
        appendElement('div', { draftCardScaleReference: '4' }).setAttribute(
            'data-draft-card-scale-reference',
            '4'
        );
        appendElement('button', { draftBuffId: 'royal_envoy', draftBuffIndex: '1' });
        appendElement('div', { marketDeck: '1' });
        appendElement('div', { marketSlot: '1-0' });
        appendElement('div', { boardCell: '0-1' });
        const p1Zone = appendElement('section', { playerZone: 'p1' });
        const resources = document.createElement('div');
        resources.dataset.playerZoneColumn = 'resources';
        resources.getBoundingClientRect = () => rect(12, 22, 80, 30);
        p1Zone.appendChild(resources);
        const score = document.createElement('div');
        score.dataset.playerZoneColumn = 'identity';
        score.getBoundingClientRect = () => rect(14, 24, 80, 30);
        p1Zone.appendChild(score);
        const p2Zone = appendElement('section', { playerZone: 'p2' });
        const opponentResources = document.createElement('div');
        opponentResources.dataset.playerZoneColumn = 'resources';
        opponentResources.getBoundingClientRect = () => rect(16, 26, 80, 30);
        p2Zone.appendChild(opponentResources);
        appendElement('h3', { playerZoneLabel: 'p1' }, rect(30, 40, 56, 40), 'P1');
        appendElement('button', { reservedSlot: 'p1-0' });
        appendElement('div', { cardPreviewOverlay: 'true' }).setAttribute(
            'data-card-preview-overlay',
            'true'
        );
        appendElement('div', { cardPreviewBackdrop: 'true' }).setAttribute(
            'data-card-preview-backdrop',
            'true'
        );
        appendElement('button', {}).setAttribute('aria-label', 'Close card preview');
        appendElement('div', { cardPreviewCard: 'c11-re' }).setAttribute(
            'data-card-preview-card',
            'c11-re'
        );
        appendElement('div', { cardPreviewDeckReserve: '1' }).setAttribute(
            'data-card-preview-deck-reserve',
            '1'
        );
        appendElement('button', { cardPreviewAction: 'buy' });
        appendElement('button', { cardPreviewAction: 'reserve' });
        appendElement('div', { settingsMenu: 'true' }).setAttribute('data-settings-menu', 'true');
        appendElement('div', { parityErrorBanner: 'true' }).setAttribute(
            'data-parity-error-banner',
            'true'
        );
        appendElement('button', { gameAction: 'replenish' }).setAttribute(
            'data-game-action',
            'replenish'
        );
        appendElement('div', { royalCourtGrid: 'true' }).setAttribute(
            'data-royal-court-grid',
            'true'
        );
        document.body.append(' Visible text digest ');

        const dump = buildStateDump(buildParams(state));
        const semanticKeys = new Set(
            dump.visible.boxes.flatMap((box) => (box.semanticKey ? [box.semanticKey] : []))
        );

        expect(dump.timestamp).toBe('2026-05-09T12:00:00.000Z');
        expect(dump.game).toMatchObject({
            mode: 'LOCAL_PVP',
            phase: 'PLAY',
            turn: 'p1',
            market: { 1: ['112-re', '122-gr'] },
            playerReserved: { p1: ['171-jo', 'hidden-p1-1'] },
            playerBuffs: {
                p1: { id: 'royal_envoy', state: { envoyTriggered: true } },
                p2: { id: 'echo_reservoir', state: null },
            },
            draftPool: ['collector', 'royal_envoy', 'minimalist'],
            p2DraftPool: ['royal_envoy', 'echo_reservoir', 'wonder_architect', 'minimalist'],
            p1SelectedBuffId: 'royal_envoy',
            pendingReserve: { level: 1, idx: 0, isDeck: false, card: '112-re' },
            pendingBuy: { source: 'market', card: '122-gr' },
        });
        expect([...semanticKeys]).toEqual(
            expect.arrayContaining([
                'app.shell',
                'draft.root',
                'draft.buff.1',
                'board.root',
                'market.level.1',
                'market.card.1.0',
                'board.cell.0.1',
                'player.current.zone',
                'player.opponent.zone',
                'player.resources',
                'player.score',
                'player.current.resourcesColumn',
                'player.current.identityColumn',
                'player.opponent.resourcesColumn',
                'player.current.label',
                'player.reserved.0',
                'card.preview.overlay',
                'card.preview.backdrop',
                'card.preview.close',
                'card.preview.card',
                'card.preview.primaryAction',
                'card.preview.action.reserve',
                'settings.panel',
                'error.banner',
                'turn.end',
                'royal.featured',
            ])
        );
        expect(dump.visible.boxes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    semanticKey: 'player.current.resourcesColumn',
                    rect: expect.objectContaining({ x: 12, y: 22, width: 80, height: 30 }),
                }),
                expect.objectContaining({
                    semanticKey: 'player.current.identityColumn',
                    rect: expect.objectContaining({ x: 14, y: 24, width: 80, height: 30 }),
                }),
            ])
        );
        expect(dump.visible.textDigest).toContain('Visible text digest');
    });

    it('adds shell synthetic keys only on the main menu route', () => {
        const canvas = appendElement('main', {});
        canvas.setAttribute('data-testid', 'desktop-stage-canvas');
        canvas.getBoundingClientRect = () => rect(100, 50, 1000, 500);

        const dump = buildStateDump(buildParams(buildGameState(), 0));

        expect(dump.visible.boxes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    semanticKey: 'main.menu',
                    rect: expect.objectContaining({ width: 1000, height: 500 }),
                }),
                expect.objectContaining({
                    semanticKey: 'mode.local',
                    rect: expect.objectContaining({
                        x: 390.63,
                        y: 260.25,
                        width: 200,
                        height: 111.11,
                    }),
                }),
            ])
        );
    });

    it('adds replay-review action semantic keys when visible controls are disabled', () => {
        const board = appendElement('div', { surfaceSlot: 'gem-panel' });
        board.getBoundingClientRect = () => rect(1000, 220, 420, 420);
        const overlay = appendElement('div', { cardPreviewOverlay: 'true' });
        overlay.setAttribute('data-card-preview-overlay', 'true');
        overlay.getBoundingClientRect = () => rect(0, 0, 1920, 1080);

        const dump = buildStateDump(buildParams(buildGameState({ phase: 'IDLE' })));

        expect(dump.visible.boxes).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    semanticKey: 'card.preview.primaryAction',
                    selector: 'synthetic:card.preview.primaryAction',
                    rect: expect.objectContaining({ x: 768, y: 905.2, width: 184, height: 56 }),
                }),
                expect.objectContaining({
                    semanticKey: 'turn.end',
                    selector: 'synthetic:turn.end',
                    rect: expect.objectContaining({ x: 1118, y: 656, width: 184, height: 44 }),
                }),
            ])
        );
    });

    it('captures chrome, settings, player-gem, and contextual action semantics', () => {
        appendElement('button', { appRulebookButton: 'true' });
        appendElement('button', { appRestartButton: 'true' });
        appendElement('button', { appSettingsButton: 'true' });
        appendElement('button', { appRestartConfirm: 'true' });
        appendElement('div', { topbarScoreGroup: 'p1' });
        appendElement('div', { topbarScoreGroup: 'p2' });
        appendElement('div', { topbarCrownGroup: 'p1' });
        appendElement('img', { topbarCrownArtwork: 'p1' });
        appendElement('span', { topbarCrowns: 'p1' });
        appendElement('span', { topbarCrownsGoal: 'p1' });
        appendElement('div', { topbarPointsGroup: 'p2' });
        appendElement('img', { topbarPointsArtwork: 'p2' });
        appendElement('span', { topbarScore: 'p2' });
        appendElement('span', { topbarPointsGoal: 'p2' });
        appendElement('div', { topbarTurnCore: 'true' });
        appendElement('div', { topbarTurnSide: 'p1' });
        appendElement('div', { topbarTurnSide: 'p2' });
        appendElement('span', { topbarPlayerLabel: 'p1' });
        appendElement('span', { topbarTurnCount: 'p1' });
        appendElement('span', { topbarTurnWord: 'p1' });
        appendElement('div', { rulebookOverlay: 'true' }).setAttribute(
            'data-rulebook-overlay',
            'true'
        );
        appendElement('div', { rulebookPanel: 'preview-style' }).setAttribute(
            'data-rulebook-panel',
            'preview-style'
        );
        appendElement('button', { localeOption: 'en' });
        appendElement('button', { appSoundToggle: 'true' });
        appendElement('button', { appSaveReplayButton: 'true' });
        appendElement('label', { appLoadReplayControl: 'true' });
        appendElement('button', { appSurfaceThemeControl: 'true' });
        appendElement('button', { appSurfaceThemeOption: 'anime' });
        appendElement('button', { replayReturnToResults: 'true' });
        appendElement('button', { replayControl: 'undo' });
        appendElement('button', { replayControl: 'redo' });
        appendElement('span', { replayStepCounter: 'true' });
        appendElement('button', { playerZoneGem: 'p1-red' });
        appendElement('button', { playerZoneGem: 'p2-green' });
        appendElement('button', { playerZoneGem: 'malformed' });
        appendElement('button', { reservedSlot: 'p2-0' });
        appendElement('div', { marketSlot: 'bad' });
        appendElement('div', { boardCell: 'bad' });
        appendElement('button', { gameAction: 'confirm-take' }).setAttribute(
            'data-game-action',
            'confirm-take'
        );
        appendElement('button', { gameAction: 'cancel-take' }).setAttribute(
            'data-game-action',
            'cancel-take'
        );
        appendElement('button', { gameAction: 'cancel-reserve' }).setAttribute(
            'data-game-action',
            'cancel-reserve'
        );
        appendElement('button', { gameAction: 'cancel-privilege' }).setAttribute(
            'data-game-action',
            'cancel-privilege'
        );

        const p1Zone = appendElement('section', { playerZone: 'p1' });
        const unknownColumn = document.createElement('div');
        unknownColumn.dataset.playerZoneColumn = 'other';
        unknownColumn.getBoundingClientRect = () => rect(20, 20, 80, 30);
        p1Zone.appendChild(unknownColumn);

        const winnerDump = buildStateDump(buildParams(buildGameState({ winner: 'p1' })));
        const keys = winnerDump.visible.boxes.map((box) => box.semanticKey);

        expect(keys).toEqual(
            expect.arrayContaining([
                'chrome.rulebook',
                'chrome.restart',
                'settings.control',
                'chrome.restart.confirm',
                'topbar.score.p1',
                'topbar.score.p2',
                'topbar.crowns.p1',
                'topbar.crowns.p1.icon',
                'topbar.crowns.p1.value',
                'topbar.crowns.p1.goal',
                'topbar.points.p2',
                'topbar.points.p2.icon',
                'topbar.points.p2.value',
                'topbar.points.p2.goal',
                'topbar.turnCore',
                'topbar.turn.p1',
                'topbar.turn.p2',
                'topbar.turn.p1.label',
                'topbar.turn.p1.count',
                'topbar.turn.p1.word',
                'rulebook.overlay',
                'rulebook.panel',
                'settings.locale.en',
                'settings.sound',
                'settings.save',
                'settings.load',
                'settings.surface.control',
                'settings.surface.anime',
                'replay.returnToResults',
                'replay.control.undo',
                'replay.control.redo',
                'replay.counter',
                'board.selection.confirm',
                'board.selection.cancel',
                'reserve.cancel',
                'privilege.cancel',
                'player.opponent.zone',
            ])
        );
        expect(keys).not.toContain('player.current.gem.red');
        expect(keys).not.toContain('player.reserved.0');
    });

    it('detects rendered routes for menu, matchmaking, draft, and board states', () => {
        const game = buildGame(buildGameState(), 0);
        document.body.textContent = '选择一个模式开始';
        expect(
            hasRenderedRouteForState(game, { setupRoute: 'classic', matchmakingRoute: 'none' })
        ).toBe(true);

        document.body.textContent = '在线 局域网';
        expect(
            hasRenderedRouteForState(game, { setupRoute: 'classic', matchmakingRoute: 'online' })
        ).toBe(true);

        const draftGame = buildGame(buildGameState({ phase: 'DRAFT_PHASE' }), 1);
        expect(
            hasRenderedRouteForState(draftGame, { setupRoute: 'classic', matchmakingRoute: 'none' })
        ).toBe(false);
        appendElement('div', { draftCardScaleReference: 'true' }).setAttribute(
            'data-draft-card-scale-reference',
            'true'
        );
        expect(
            hasRenderedRouteForState(draftGame, { setupRoute: 'classic', matchmakingRoute: 'none' })
        ).toBe(true);

        document.body.innerHTML = '';
        expect(
            hasRenderedRouteForState(buildGame(buildGameState(), 1), {
                setupRoute: 'classic',
                matchmakingRoute: 'none',
            })
        ).toBe(false);
        appendElement('div', { boardCell: '0-0' });
        expect(
            hasRenderedRouteForState(buildGame(buildGameState(), 1), {
                setupRoute: 'classic',
                matchmakingRoute: 'none',
            })
        ).toBe(true);
    });
});
