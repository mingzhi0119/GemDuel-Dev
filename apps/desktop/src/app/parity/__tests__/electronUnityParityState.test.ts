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
    }) as UseElectronUnityParityHarnessParams['game'];

const buildParams = (
    state = buildGameState(),
    historyLength = 1
): Pick<
    UseElectronUnityParityHarnessParams,
    'game' | 'layout' | 'locale' | 'theme' | 'soundEnabled' | 'setupRoute' | 'matchmakingRoute'
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
        appendElement('button', { reservedSlot: 'p1-0' });
        appendElement('div', { cardPreviewOverlay: 'true' }).setAttribute(
            'data-card-preview-overlay',
            'true'
        );
        appendElement('button', { cardPreviewAction: 'buy' });
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
            pendingReserve: { level: 1, idx: 0, isDeck: false, card: '112-re' },
            pendingBuy: { source: 'market', card: '122-gr' },
        });
        expect([...semanticKeys]).toEqual(
            expect.arrayContaining([
                'app.shell',
                'board.root',
                'market.level.1',
                'market.card.1.0',
                'board.cell.0.1',
                'player.current.zone',
                'player.opponent.zone',
                'player.resources',
                'player.score',
                'player.reserved.0',
                'card.preview.overlay',
                'card.preview.primaryAction',
                'settings.panel',
                'error.banner',
                'turn.end',
                'royal.featured',
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
                    rect: expect.objectContaining({ x: 480, y: 290, width: 240, height: 35 }),
                }),
            ])
        );
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

        const draftGame = buildGame(buildGameState({ phase: 'DRAFT_P1' } as Partial<GameState>), 1);
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
