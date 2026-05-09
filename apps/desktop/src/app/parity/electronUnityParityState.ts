import type { Card, GameState, ReservedCardView, RoyalCard } from '@gemduel/shared/types';
import type { GameLogicController, MatchmakingRoute, StartSetupRoute } from '../../types/ui';
import type {
    DomBox,
    ElectronParityStateDump,
    UseElectronUnityParityHarnessParams,
} from './electronUnityParityTypes';

const BOX_SELECTORS = [
    '[data-testid="desktop-stage-viewport"]',
    '[data-testid="desktop-stage-canvas"]',
    '[data-draft-card-scale-reference]',
    '[data-surface-slot]',
    '[data-market-deck]',
    '[data-market-slot]',
    '[data-board-cell]',
    '[data-player-zone]',
    '[data-player-zone-column]',
    '[data-player-zone-gem]',
    '[data-reserved-slot]',
    '[data-card-preview-overlay]',
    '[data-card-preview-card]',
    '[data-card-preview-action]',
    '[data-settings-menu]',
    '[data-parity-error-banner]',
    '[data-game-action]',
    '[data-royal-court-grid]',
];

const nowIso = () => new Date().toISOString();

const getDataset = (element: HTMLElement) =>
    Object.fromEntries(
        Object.entries(element.dataset).flatMap(([key, value]) =>
            value === undefined ? [] : [[key, value]]
        )
    ) as Record<string, string>;

const semanticKeyForElement = (
    element: HTMLElement,
    selector: string,
    state: GameState & { errorMsg?: string | null },
    historyLength: number
): string | undefined => {
    const dataset = element.dataset;

    if (selector === '[data-testid="desktop-stage-viewport"]') {
        return 'app.shell';
    }

    if (selector === '[data-testid="desktop-stage-canvas"]' && historyLength === 0) {
        return 'main.menu';
    }

    if (dataset.surfaceSlot === 'gem-panel') {
        return 'board.root';
    }

    if (dataset.marketDeck) {
        return `market.level.${dataset.marketDeck}`;
    }

    if (dataset.marketSlot) {
        const [level, index] = dataset.marketSlot.split('-');
        return level && index ? `market.card.${level}.${index}` : undefined;
    }

    if (dataset.boardCell) {
        const [row, column] = dataset.boardCell.split('-');
        return row && column ? `board.cell.${row}.${column}` : undefined;
    }

    if (dataset.playerZone) {
        return dataset.playerZone === state.turn && !state.winner
            ? 'player.current.zone'
            : 'player.opponent.zone';
    }

    if (dataset.playerZoneColumn) {
        const player = element.closest<HTMLElement>('[data-player-zone]')?.dataset.playerZone;
        if (player !== state.turn || state.winner) {
            return undefined;
        }

        if (dataset.playerZoneColumn === 'resources') {
            return 'player.resources';
        }

        if (dataset.playerZoneColumn === 'identity') {
            return 'player.score';
        }
    }

    if (dataset.reservedSlot) {
        const [player, index] = dataset.reservedSlot.split('-');
        return player === state.turn && index ? `player.reserved.${index}` : undefined;
    }

    if (selector === '[data-card-preview-overlay]') {
        return 'card.preview.overlay';
    }

    if (dataset.cardPreviewAction === 'buy') {
        return 'card.preview.primaryAction';
    }

    if (selector === '[data-settings-menu]') {
        return 'settings.panel';
    }

    if (selector === '[data-parity-error-banner]') {
        return 'error.banner';
    }

    if (selector === '[data-game-action]') {
        return 'turn.end';
    }

    if (selector === '[data-royal-court-grid]') {
        return 'royal.featured';
    }

    return undefined;
};

const syntheticBox = (semanticKey: string, rect: DOMRect, selector: string): DomBox => ({
    key: `synthetic:${semanticKey}`,
    semanticKey,
    selector,
    text: '',
    dataset: {},
    rect: {
        x: Math.round(rect.x * 100) / 100,
        y: Math.round(rect.y * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
    },
});

const appendShellSyntheticBoxes = (boxes: DomBox[], historyLength: number) => {
    if (historyLength !== 0) {
        return;
    }

    const canvas = document.querySelector<HTMLElement>('[data-testid="desktop-stage-canvas"]');
    const rect = canvas?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) {
        return;
    }

    boxes.push(
        syntheticBox(
            'mode.local',
            new DOMRect(
                rect.x + rect.width * 0.38,
                rect.y + rect.height * 0.48,
                rect.width * 0.24,
                rect.height * 0.07
            ),
            'synthetic:mode.local'
        )
    );
};

const getDomBoxes = (
    state: GameState & { errorMsg?: string | null },
    historyLength: number
): DomBox[] => {
    const boxes: DomBox[] = [];

    for (const selector of BOX_SELECTORS) {
        document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) {
                return;
            }

            boxes.push({
                key: `${selector}:${index}`,
                semanticKey: semanticKeyForElement(element, selector, state, historyLength),
                selector,
                text: (element.innerText || element.textContent || '').replace(/\s+/g, ' ').trim(),
                dataset: getDataset(element),
                rect: {
                    x: Math.round(rect.x * 100) / 100,
                    y: Math.round(rect.y * 100) / 100,
                    width: Math.round(rect.width * 100) / 100,
                    height: Math.round(rect.height * 100) / 100,
                },
            });
        });
    }

    appendShellSyntheticBoxes(boxes, historyLength);

    return boxes;
};

const cardId = (card: Card | RoyalCard | null | undefined) =>
    card ? ('uid' in card ? (card.uid ?? card.id) : card.id) : null;

const reservedCardId = (card: ReservedCardView | null | undefined) => {
    if (!card) {
        return null;
    }

    if ('isHiddenReservedCard' in card) {
        return card.slotKey;
    }

    return cardId(card);
};

const normalizeGameState = (state: GameState & { errorMsg?: string | null }) => ({
    mode: state.mode,
    phase: state.phase,
    turn: state.turn,
    winner: state.winner,
    errorMsg: state.errorMsg ?? null,
    selectedGems: 'selectedGems' in state ? state.selectedGems : [],
    board: state.board.map((row) => row.map((cell) => cell.type.id)),
    market: {
        1: state.market[1].map(cardId),
        2: state.market[2].map(cardId),
        3: state.market[3].map(cardId),
    },
    deckCounts: {
        1: state.decks[1].length,
        2: state.decks[2].length,
        3: state.decks[3].length,
    },
    royalDeck: state.royalDeck.map((royal) => royal.id),
    playerTableau: {
        p1: state.playerTableau.p1.map(cardId),
        p2: state.playerTableau.p2.map(cardId),
    },
    playerReserved: {
        p1: state.playerReserved.p1.map(reservedCardId),
        p2: state.playerReserved.p2.map(reservedCardId),
    },
    playerRoyals: {
        p1: state.playerRoyals.p1.map((royal) => royal.id),
        p2: state.playerRoyals.p2.map((royal) => royal.id),
    },
    inventories: state.inventories,
    privileges: state.privileges,
    extraPoints: state.extraPoints,
    extraCrowns: state.extraCrowns,
    pendingReserve: state.pendingReserve
        ? {
              level: state.pendingReserve.level,
              idx: state.pendingReserve.idx ?? null,
              isDeck: state.pendingReserve.isDeck ?? false,
              card: cardId(state.pendingReserve.card),
          }
        : null,
    pendingBuy: state.pendingBuy
        ? {
              source: state.pendingBuy.source,
              card: cardId(state.pendingBuy.card),
              marketInfo: state.pendingBuy.marketInfo ?? null,
          }
        : null,
});

export const hasRenderedRouteForState = (
    game: GameLogicController,
    route: { setupRoute: StartSetupRoute; matchmakingRoute: MatchmakingRoute }
) => {
    if (game.historyControls.historyLength === 0) {
        if (route.matchmakingRoute !== 'none') {
            return (
                document.body.innerText.includes('在线') ||
                document.body.innerText.includes('局域网')
            );
        }

        return document.body.innerText.includes('选择一个模式开始');
    }

    if (String(game.state.phase).includes('DRAFT')) {
        return Boolean(document.querySelector('[data-draft-card-scale-reference]'));
    }

    return Boolean(
        document.querySelector('[data-board-cell], [data-market-slot], [data-player-zone]')
    );
};

export const buildStateDump = ({
    game,
    layout,
    locale,
    theme,
    soundEnabled,
    setupRoute,
    matchmakingRoute,
}: Pick<
    UseElectronUnityParityHarnessParams,
    'game' | 'layout' | 'locale' | 'theme' | 'soundEnabled' | 'setupRoute' | 'matchmakingRoute'
>): ElectronParityStateDump => ({
    source: 'electron',
    timestamp: nowIso(),
    route: { setupRoute, matchmakingRoute },
    settings: { locale, theme, soundEnabled },
    viewport: {
        viewportWidth: layout.viewportWidth,
        viewportHeight: layout.viewportHeight,
        stageCanvasWidthPx: layout.stageCanvasWidthPx,
        stageCanvasHeightPx: layout.stageCanvasHeightPx,
    },
    history: {
        currentIndex: game.historyControls.currentIndex,
        historyLength: game.historyControls.historyLength,
        historySource: game.historyControls.historySource,
    },
    game: normalizeGameState(game.state),
    visible: {
        title: document.title,
        textDigest: (document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 2000),
        boxes: getDomBoxes(game.state, game.historyControls.historyLength),
    },
});
