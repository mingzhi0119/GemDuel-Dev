import type { GameState } from '@gemduel/shared/types';

export const BOX_SELECTORS = [
    '[data-testid="desktop-stage-viewport"]',
    '[data-testid="desktop-stage-canvas"]',
    '[data-app-rulebook-button]',
    '[data-app-restart-button]',
    '[data-app-settings-button]',
    '[data-app-restart-confirm]',
    '[data-topbar-score-group]',
    '[data-topbar-crown-group]',
    '[data-topbar-crown-artwork]',
    '[data-topbar-crowns]',
    '[data-topbar-crowns-goal]',
    '[data-topbar-points-group]',
    '[data-topbar-points-artwork]',
    '[data-topbar-score]',
    '[data-topbar-points-goal]',
    '[data-topbar-turn-core]',
    '[data-topbar-turn-side]',
    '[data-topbar-player-label]',
    '[data-topbar-turn-count]',
    '[data-topbar-turn-word]',
    '[data-rulebook-overlay]',
    '[data-rulebook-panel]',
    '[data-rulebook-nav-item]',
    '[data-draft-card-scale-reference]',
    '[data-draft-buff-id]',
    '[data-surface-slot]',
    '[data-market-deck]',
    '[data-market-slot]',
    '[data-board-cell]',
    '[data-player-zone]',
    '[data-player-zone-column]',
    '[data-player-zone-privilege]',
    '[data-player-zone-gem]',
    '[data-player-avatar]',
    '[data-player-zone-label]',
    '[data-echo-reservoir-memory]',
    '[data-tableau-row]',
    '[data-tableau-stack]',
    '[data-tableau-top-card-surface]',
    '[data-tableau-point-ribbon]',
    '[data-tableau-bonus-summary]',
    '[data-tableau-empty-stack-surface]',
    '[data-reserved-row]',
    '[data-reserved-mini-stack]',
    '[data-reserved-slot]',
    '[data-card-preview-overlay]',
    '[data-card-preview-backdrop]',
    'button[aria-label="Close card preview"]',
    '[data-card-preview-card]',
    '[data-card-preview-deck-reserve]',
    '[data-card-preview-action]',
    '[data-bonus-color]',
    '[data-royal-card]',
    '[data-royal-selection-card]',
    '[data-settings-menu]',
    '[data-locale-option]',
    '[data-app-sound-toggle]',
    '[data-app-save-replay-button]',
    '[data-app-load-replay-control]',
    '[data-app-surface-theme-control]',
    '[data-app-surface-theme-option]',
    '[data-replay-return-to-results]',
    '[data-replay-control]',
    '[data-replay-step-counter]',
    '[data-parity-mode-hover-target]',
    '[data-parity-error-banner]',
    '[data-game-action]',
    '[data-royal-court-grid]',
];

export const playerRole = (
    player: string | undefined,
    state: GameState & { errorMsg?: string | null }
) => {
    if (!player) {
        return undefined;
    }

    return player === state.turn && !state.winner ? 'current' : 'opponent';
};

const tableauPartsForElement = (element: HTMLElement) => {
    const encoded =
        element.dataset.tableauStack ??
        element.closest<HTMLElement>('[data-tableau-stack]')?.dataset.tableauStack;
    if (!encoded) {
        return null;
    }

    const [player, ...colorParts] = encoded.split('-');
    const color = colorParts.join('-');
    return player && color ? { player, color } : null;
};

export const semanticKeyForElement = (
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
    if (dataset.parityModeHoverTarget) {
        return `mode.${dataset.parityModeHoverTarget}`;
    }
    if (dataset.appRulebookButton) {
        return 'chrome.rulebook';
    }
    if (dataset.appRestartButton) {
        return 'chrome.restart';
    }
    if (dataset.appSettingsButton) {
        return 'settings.control';
    }
    if (dataset.appRestartConfirm) {
        return 'chrome.restart.confirm';
    }
    if (dataset.topbarScoreGroup === 'p1') {
        return 'topbar.score.p1';
    }
    if (dataset.topbarScoreGroup === 'p2') {
        return 'topbar.score.p2';
    }
    if (dataset.topbarCrownGroup) {
        return `topbar.crowns.${dataset.topbarCrownGroup}`;
    }
    if (dataset.topbarCrownArtwork) {
        return `topbar.crowns.${dataset.topbarCrownArtwork}.icon`;
    }
    if (dataset.topbarCrowns) {
        return `topbar.crowns.${dataset.topbarCrowns}.value`;
    }
    if (dataset.topbarCrownsGoal) {
        return `topbar.crowns.${dataset.topbarCrownsGoal}.goal`;
    }
    if (dataset.topbarPointsGroup) {
        return `topbar.points.${dataset.topbarPointsGroup}`;
    }
    if (dataset.topbarPointsArtwork) {
        return `topbar.points.${dataset.topbarPointsArtwork}.icon`;
    }
    if (dataset.topbarScore) {
        return `topbar.points.${dataset.topbarScore}.value`;
    }
    if (dataset.topbarPointsGoal) {
        return `topbar.points.${dataset.topbarPointsGoal}.goal`;
    }
    if (dataset.topbarTurnCore) {
        return 'topbar.turnCore';
    }
    if (dataset.topbarTurnSide === 'p1') {
        return 'topbar.turn.p1';
    }
    if (dataset.topbarTurnSide === 'p2') {
        return 'topbar.turn.p2';
    }
    if (dataset.topbarPlayerLabel) {
        return `topbar.turn.${dataset.topbarPlayerLabel}.label`;
    }
    if (dataset.topbarTurnCount) {
        return `topbar.turn.${dataset.topbarTurnCount}.count`;
    }
    if (dataset.topbarTurnWord) {
        return `topbar.turn.${dataset.topbarTurnWord}.word`;
    }
    if (selector === '[data-rulebook-overlay]') {
        return 'rulebook.overlay';
    }
    if (selector === '[data-rulebook-panel]') {
        return 'rulebook.panel';
    }
    if (dataset.rulebookNavItem) {
        return `rulebook.nav.${dataset.rulebookNavItem}`;
    }
    if (dataset.draftCardScaleReference) {
        return 'draft.root';
    }
    if (dataset.draftBuffIndex) {
        return `draft.buff.${dataset.draftBuffIndex}`;
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
        const role = playerRole(dataset.playerZone, state);
        return role ? `player.${role}.zone` : undefined;
    }
    if (dataset.playerZoneColumn) {
        const player = element.closest<HTMLElement>('[data-player-zone]')?.dataset.playerZone;
        const role = playerRole(player, state);
        if (!role) {
            return undefined;
        }

        if (role === 'current' && dataset.playerZoneColumn === 'resources') {
            return 'player.resources';
        }
        if (role === 'current' && dataset.playerZoneColumn === 'identity') {
            return 'player.score';
        }
        if (dataset.playerZoneColumn === 'resources') {
            return `player.${role}.resourcesColumn`;
        }
        if (dataset.playerZoneColumn === 'identity') {
            return `player.${role}.identityColumn`;
        }
        if (dataset.playerZoneColumn === 'reserved') {
            return `player.${role}.reservedColumn`;
        }

        return undefined;
    }
    if (dataset.playerZonePrivilege) {
        const [player] = dataset.playerZonePrivilege.split('-');
        const role = playerRole(player, state);
        if (!role) {
            return undefined;
        }

        return `player.${role}.privilege`;
    }
    if (dataset.playerZoneGem) {
        const [player, gem] = dataset.playerZoneGem.split('-');
        const role = playerRole(player, state);
        if (!role || !gem) {
            return undefined;
        }

        return `player.${role}.gem.${gem}`;
    }
    if (dataset.playerAvatar) {
        const role = playerRole(dataset.playerAvatar, state);
        return role ? `player.${role}.avatar` : undefined;
    }
    if (dataset.playerZoneLabel) {
        const role = playerRole(dataset.playerZoneLabel, state);
        return role ? `player.${role}.label` : undefined;
    }
    if (dataset.echoReservoirMemory) {
        const role = playerRole(dataset.echoReservoirMemory, state);
        return role ? `player.${role}.echoMemory` : undefined;
    }
    if (dataset.tableauRow) {
        const role = playerRole(dataset.tableauRow, state);
        return role ? `player.${role}.tableauRow` : undefined;
    }
    if (dataset.tableauStack) {
        const parts = tableauPartsForElement(element);
        const role = playerRole(parts?.player, state);
        return role && parts ? `player.${role}.tableau.${parts.color}` : undefined;
    }
    if (dataset.tableauTopCardSurface) {
        const parts = tableauPartsForElement(element);
        const role = playerRole(parts?.player, state);
        return role && parts ? `player.${role}.tableau.${parts.color}.topCard` : undefined;
    }
    if (dataset.tableauPointRibbon) {
        const parts = tableauPartsForElement(element);
        const role = playerRole(parts?.player, state);
        return role && parts ? `player.${role}.tableau.${parts.color}.points` : undefined;
    }
    if (dataset.tableauBonusSummary) {
        const parts = tableauPartsForElement(element);
        const role = playerRole(parts?.player, state);
        return role && parts ? `player.${role}.tableau.${parts.color}.bonus` : undefined;
    }
    if (dataset.tableauEmptyStackSurface) {
        const parts = tableauPartsForElement(element);
        const role = playerRole(parts?.player, state);
        return role && parts ? `player.${role}.tableau.${parts.color}.empty` : undefined;
    }
    if (dataset.reservedRow) {
        const role = playerRole(dataset.reservedRow, state);
        return role ? `player.${role}.reservedRow` : undefined;
    }
    if (dataset.reservedMiniStack) {
        const role = playerRole(dataset.reservedMiniStack, state);
        return role ? `player.${role}.reservedMiniStack` : undefined;
    }
    if (dataset.reservedSlot) {
        const [player, index] = dataset.reservedSlot.split('-');
        return player === state.turn && index ? `player.reserved.${index}` : undefined;
    }
    if (selector === '[data-card-preview-overlay]') {
        return 'card.preview.overlay';
    }
    if (selector === '[data-card-preview-backdrop]') {
        return 'card.preview.backdrop';
    }
    if (selector === 'button[aria-label="Close card preview"]') {
        return 'card.preview.close';
    }
    if (selector === '[data-card-preview-card]') {
        return 'card.preview.card';
    }
    if (selector === '[data-card-preview-deck-reserve]') {
        return 'card.preview.card';
    }
    if (dataset.cardPreviewAction === 'buy') {
        return 'card.preview.primaryAction';
    }
    if (dataset.cardPreviewAction === 'reserve') {
        return 'card.preview.action.reserve';
    }
    if (dataset.bonusColor) {
        return `card.color.${dataset.bonusColor}`;
    }
    if (dataset.royalCard || dataset.royalSelectionCard) {
        const royalId = dataset.royalCard ?? dataset.royalSelectionCard;
        const royalIndex = state.royalDeck.findIndex((royal) => royal.id === royalId);
        return royalIndex >= 0 ? `royal.card.${royalIndex}` : `royal.card.${royalId}`;
    }
    if (selector === '[data-settings-menu]') {
        return 'settings.panel';
    }
    if (dataset.localeOption) {
        return `settings.locale.${dataset.localeOption}`;
    }
    if (dataset.appSoundToggle) {
        return 'settings.sound';
    }
    if (dataset.appSaveReplayButton) {
        return 'settings.save';
    }
    if (dataset.appLoadReplayControl) {
        return 'settings.load';
    }
    if (dataset.appSurfaceThemeControl) {
        return 'settings.surface.control';
    }
    if (dataset.appSurfaceThemeOption) {
        return `settings.surface.${dataset.appSurfaceThemeOption}`;
    }
    if (dataset.replayReturnToResults) {
        return 'replay.returnToResults';
    }
    if (dataset.replayControl === 'undo') {
        return 'replay.control.undo';
    }
    if (dataset.replayControl === 'redo') {
        return 'replay.control.redo';
    }
    if (dataset.replayStepCounter) {
        return 'replay.counter';
    }
    if (selector === '[data-parity-error-banner]') {
        return 'error.banner';
    }
    if (selector === '[data-game-action]') {
        if (dataset.gameAction === 'confirm-take') {
            return 'board.selection.confirm';
        }
        if (dataset.gameAction === 'cancel-take') {
            return 'board.selection.cancel';
        }
        if (dataset.gameAction === 'cancel-reserve') {
            return 'reserve.cancel';
        }
        if (dataset.gameAction === 'cancel-privilege') {
            return 'privilege.cancel';
        }
        return 'turn.end';
    }
    if (selector === '[data-royal-court-grid]') {
        return 'royal.featured';
    }

    return undefined;
};
