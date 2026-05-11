import type { Card, GameState, ReservedCardView, RoyalCard } from '@gemduel/shared/types';
import type { GameLogicController, MatchmakingRoute, StartSetupRoute } from '../../types/ui';
import type {
    DomTypographySample,
    ElectronParityStateDump,
    UseElectronUnityParityHarnessParams,
} from './electronUnityParityTypes';
import { getDomBoxes } from './electronUnityParityDomState';
import { getSurfaceThemeVariant } from '../shell/surfaceTheme';

const nowIso = () => new Date().toISOString();

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

const buffRef = (buff: unknown) => {
    if (!buff || typeof buff !== 'object') {
        return null;
    }

    const value = buff as { id?: string; state?: unknown };
    return {
        id: value.id ?? null,
        state: value.state ?? null,
    };
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
    playerBuffs: {
        p1: buffRef(state.playerBuffs?.p1),
        p2: buffRef(state.playerBuffs?.p2),
    },
    draftPool: [...(state.draftPool ?? [])],
    p2DraftPool: state.p2DraftPool ? [...state.p2DraftPool] : null,
    p1SelectedBuffId: state.p1SelectedBuff?.id ?? null,
    draftOrder: [...(state.draftOrder ?? [])],
    buffLevel: state.buffLevel ?? null,
    p2DraftLevel: state.p2DraftLevel ?? null,
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

const TYPOGRAPHY_SELECTORS = [
    '[data-draft-buff-title]',
    '[data-draft-buff-description]',
    '[data-card-preview-action]',
    '[data-game-action]',
    '[data-settings-menu]',
];

const getTypographySamples = (): DomTypographySample[] =>
    TYPOGRAPHY_SELECTORS.flatMap((selector) =>
        Array.from(document.querySelectorAll<HTMLElement>(selector)).map((element, index) => {
            const styles = window.getComputedStyle(element);
            const semanticSuffix =
                element.dataset.draftBuffTitle ??
                element.dataset.draftBuffDescription ??
                element.dataset.cardPreviewAction ??
                element.dataset.gameAction ??
                String(index);
            return {
                key: `${selector}:${semanticSuffix}`,
                selector,
                text: (element.innerText || element.textContent || '').replace(/\s+/g, ' ').trim(),
                fontFamily: styles.fontFamily,
                fontSize: styles.fontSize,
                fontWeight: styles.fontWeight,
                lineHeight: styles.lineHeight,
                letterSpacing: styles.letterSpacing,
                textAlign: styles.textAlign,
                padding: styles.padding,
            };
        })
    );

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
    surfaceTheme,
    soundEnabled,
    setupRoute,
    matchmakingRoute,
}: Pick<
    UseElectronUnityParityHarnessParams,
    | 'game'
    | 'layout'
    | 'locale'
    | 'theme'
    | 'surfaceTheme'
    | 'soundEnabled'
    | 'setupRoute'
    | 'matchmakingRoute'
>): ElectronParityStateDump => ({
    source: 'electron',
    timestamp: nowIso(),
    route: { setupRoute, matchmakingRoute },
    settings: { locale, theme, surfaceTheme: getSurfaceThemeVariant(surfaceTheme), soundEnabled },
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
        typography: getTypographySamples(),
    },
});
