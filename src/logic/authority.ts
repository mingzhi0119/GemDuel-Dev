import { GameState, GameAction } from '../types';
import { validateGuestCommand } from './commandGate';

/**
 * Validates if an action received from a Guest is permissible.
 *
 * @param state - Current game state
 * @param action - Action requested by Guest
 * @returns true if action is valid to process, false otherwise
 */
export const validateOnlineAction = (state: GameState, action: GameAction): boolean => {
    const result = validateGuestCommand(state, action);
    if (!result.valid) {
        console.warn(result.reason || `Host rejected guest action ${action.type}.`);
        return false;
    }
    return true;
};
