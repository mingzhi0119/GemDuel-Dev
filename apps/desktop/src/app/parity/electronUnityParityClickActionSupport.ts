import type {
    ParityAction,
    ParityActionResult,
    UseElectronUnityParityHarnessParams,
} from './electronUnityParityTypes';

export type ReplayEventLike = {
    type?: string;
    marketRef?: { level?: number; idx?: number };
    royalId?: string;
    buffId?: string;
    actor?: string;
    coord?: { r?: number; c?: number };
    goldCoord?: { r?: number; c?: number };
    gemId?: string;
};

export type ParityResultFactory = (
    action: ParityAction,
    ok: boolean,
    detail?: string,
    driver?: string
) => ParityActionResult;

export type ClickActionDeps = {
    currentParams: () => UseElectronUnityParityHarnessParams;
    result: ParityResultFactory;
    hasRenderedCurrentRoute: () => boolean;
    getLoadedReplayEvent: () => ReplayEventLike | undefined;
    advanceLoadedReplayEvent: (
        action: ParityAction,
        expectedType: string,
        payload?: Record<string, unknown>
    ) => Promise<ParityActionResult>;
};

export const SETTINGS_CONTROL_SELECTOR =
    '[data-app-settings-button="true"], button[aria-label="Settings"], button[aria-label="设置"], [data-game-glyph="settings"]';
export const RULEBOOK_CONTROL_SELECTOR = '[data-app-rulebook-button="true"]';
export const RESTART_CONTROL_SELECTOR = '[data-app-restart-button="true"]';
export const RESTART_CONFIRM_SELECTOR = '[data-app-restart-confirm="true"]';
export const SETTINGS_SAVE_SELECTOR = '[data-app-save-replay-button="true"]';
export const SETTINGS_LOAD_SELECTOR = '[data-app-load-replay-control="true"]';

export const otherPlayer = (player: string | undefined) => (player === 'p2' ? 'p1' : 'p2');

export const selectorForBoardCellClick = (row: number, column: number) =>
    `[data-board-cell="${row}-${column}"] button:not(:disabled), [data-board-cell="${row}-${column}"] [role="button"]:not([aria-disabled="true"])`;

export const selectorForBoardCellHover = (row: number, column: number) =>
    `${selectorForBoardCellClick(row, column)}, [data-board-cell="${row}-${column}"]`;

export const hasTurnOrPhaseAdvanced = (
    beforePhase: string | undefined,
    beforeTurn: string | undefined,
    currentPhase: string | undefined,
    currentTurn: string | undefined
) => currentPhase !== beforePhase || currentTurn !== beforeTurn;

const createParityRandom = (seed: string) => {
    let hash = 2166136261;
    for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    let state = hash >>> 0 || 0x9e3779b9;
    return () => {
        state = Math.imul(state, 1664525) + 1013904223;
        return ((state >>> 0) + 0.5) / 4294967296;
    };
};

export const runWithDeterministicDraftRandom = <T>(callback: () => T): T => {
    const previousRandom = Math.random;
    Math.random = createParityRandom('parity:125');
    try {
        return callback();
    } finally {
        Math.random = previousRandom;
    }
};
