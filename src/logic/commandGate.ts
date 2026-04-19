import type { GameAction, GameState } from '../types';
import { getActionRejectionReason, isRuntimeActionShapeValid } from './actionValidation';
import { getStateIntegrityError, getTransitionIntegrityError } from './fsm';

const GUEST_ACTION_ALLOWLIST = new Set<GameAction['type']>([
    'SELECT_BUFF',
    'TAKE_GEMS',
    'REPLENISH',
    'TAKE_BONUS_GEM',
    'DISCARD_GEM',
    'STEAL_GEM',
    'INITIATE_BUY_JOKER',
    'BUY_CARD',
    'INITIATE_RESERVE',
    'INITIATE_RESERVE_DECK',
    'CANCEL_RESERVE',
    'RESERVE_CARD',
    'RESERVE_DECK',
    'DISCARD_RESERVED',
    'ACTIVATE_PRIVILEGE',
    'USE_PRIVILEGE',
    'CANCEL_PRIVILEGE',
    'SELECT_ROYAL_CARD',
    'PEEK_DECK',
    'CLOSE_MODAL',
]);

export interface CommandValidationResult {
    valid: boolean;
    reason?: string;
}

export const validateCommand = (
    state: GameState | null,
    action: GameAction
): CommandValidationResult => {
    if (!isRuntimeActionShapeValid(action)) {
        return { valid: false, reason: 'Malformed action payload.' };
    }

    if (!state) {
        return action.type === 'INIT' || action.type === 'INIT_DRAFT'
            ? { valid: true }
            : { valid: false, reason: `${action.type} requires an initialized game state.` };
    }

    if (action.type === 'FORCE_SYNC' || action.type === 'FLATTEN') {
        const integrityError = getStateIntegrityError(action.payload);
        return integrityError ? { valid: false, reason: integrityError } : { valid: true };
    }

    if (action.type === 'INIT' || action.type === 'INIT_DRAFT') {
        return { valid: true };
    }

    const rejectionReason = getActionRejectionReason(state, action);
    return rejectionReason ? { valid: false, reason: rejectionReason } : { valid: true };
};

export const validateGuestCommand = (
    state: GameState,
    action: GameAction
): CommandValidationResult => {
    if (state.turn !== 'p2') {
        return {
            valid: false,
            reason: `Host rejected ${action.type} because it is currently ${state.turn}'s turn.`,
        };
    }

    if (!GUEST_ACTION_ALLOWLIST.has(action.type)) {
        return {
            valid: false,
            reason: `Guest action ${action.type} is not permitted by the online protocol.`,
        };
    }

    return validateCommand(state, action);
};

export const validatePostActionState = (
    previousState: GameState,
    action: Exclude<GameAction, { type: 'INIT' | 'INIT_DRAFT' | 'FORCE_SYNC' | 'FLATTEN' }>,
    nextState: GameState
): CommandValidationResult => {
    const transitionError = getTransitionIntegrityError(previousState, action, nextState);
    if (transitionError) {
        return { valid: false, reason: transitionError };
    }

    const stateError = getStateIntegrityError(nextState);
    return stateError ? { valid: false, reason: stateError } : { valid: true };
};

export const validateStateSnapshot = (state: GameState): CommandValidationResult => {
    const integrityError = getStateIntegrityError(state);
    return integrityError ? { valid: false, reason: integrityError } : { valid: true };
};
