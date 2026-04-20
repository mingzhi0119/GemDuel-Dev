import type { GameAction, GameState } from '../types';
import type { GuestIntentCommand } from '../types/network';
import { validateGuestCommand, validateGuestIntentCommand } from './commandGate';
import { reportRendererEvent } from '../observability/rendererLogger';

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
        reportRendererEvent(
            {
                category: 'network',
                name: 'HOST_ACTION_REJECTED',
                severity: 'warn',
                message: result.reason || `Host rejected guest action ${action.type}.`,
                context: {
                    actionType: action.type,
                    reasonCode: result.reasonCode ?? null,
                },
            },
            {
                consoleMessage: result.reason || `Host rejected guest action ${action.type}.`,
            }
        );
        return false;
    }
    return true;
};

export const reviewOnlineIntent = (state: GameState, command: GuestIntentCommand) => {
    const result = validateGuestIntentCommand(state, command);
    if (!result.valid) {
        reportRendererEvent(
            {
                category: 'network',
                name: 'HOST_INTENT_REJECTED',
                severity: 'warn',
                message: result.reason || `Host rejected guest intent ${command.kind}.`,
                context: {
                    intentKind: command.kind,
                    reasonCode: result.reasonCode ?? null,
                },
            },
            {
                consoleMessage: result.reason || `Host rejected guest intent ${command.kind}.`,
            }
        );
    }
    return result;
};

export const validateOnlineIntent = (state: GameState, command: GuestIntentCommand): boolean =>
    reviewOnlineIntent(state, command).valid;
