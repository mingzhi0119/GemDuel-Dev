import type { GameAction, GamePhase } from '../types';

export const shouldFlattenHistory = (
    phase: GamePhase,
    historyLength: number,
    history: GameAction[]
): boolean =>
    phase === 'IDLE' &&
    historyLength > 1 &&
    history.some((action) => action.type === 'SELECT_BUFF' || action.type === 'INIT_DRAFT');
