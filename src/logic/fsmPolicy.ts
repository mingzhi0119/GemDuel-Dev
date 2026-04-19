import { GAME_PHASES } from '../constants';
import type { GameAction, GamePhase, GameState } from '../types';

export const ALL_PHASES = Object.values(GAME_PHASES) as GamePhase[];

export interface FsmCommandPolicy {
    allowedFrom?: GamePhase[];
    allowedTo?: GamePhase[];
}

export const FSM_POLICY_BY_ACTION: Record<GameAction['type'], FsmCommandPolicy> = {
    INIT: {},
    INIT_DRAFT: {},
    FORCE_SYNC: {},
    FLATTEN: {},
    SELECT_BUFF: {
        allowedFrom: [GAME_PHASES.DRAFT_PHASE],
        allowedTo: [GAME_PHASES.DRAFT_PHASE, GAME_PHASES.IDLE],
    },
    TAKE_GEMS: {
        allowedFrom: [GAME_PHASES.IDLE],
        allowedTo: [GAME_PHASES.IDLE, GAME_PHASES.DISCARD_EXCESS_GEMS, GAME_PHASES.SELECT_ROYAL],
    },
    REPLENISH: {
        allowedFrom: [GAME_PHASES.IDLE],
        allowedTo: [GAME_PHASES.IDLE, GAME_PHASES.DISCARD_EXCESS_GEMS, GAME_PHASES.SELECT_ROYAL],
    },
    TAKE_BONUS_GEM: {
        allowedFrom: [GAME_PHASES.BONUS_ACTION],
        allowedTo: [GAME_PHASES.IDLE, GAME_PHASES.DISCARD_EXCESS_GEMS, GAME_PHASES.SELECT_ROYAL],
    },
    DISCARD_GEM: {
        allowedFrom: [GAME_PHASES.DISCARD_EXCESS_GEMS],
        allowedTo: [GAME_PHASES.DISCARD_EXCESS_GEMS, GAME_PHASES.IDLE, GAME_PHASES.SELECT_ROYAL],
    },
    STEAL_GEM: {
        allowedFrom: [GAME_PHASES.STEAL_ACTION],
        allowedTo: [GAME_PHASES.IDLE, GAME_PHASES.DISCARD_EXCESS_GEMS, GAME_PHASES.SELECT_ROYAL],
    },
    INITIATE_BUY_JOKER: {
        allowedFrom: [GAME_PHASES.IDLE],
        allowedTo: [GAME_PHASES.SELECT_CARD_COLOR],
    },
    BUY_CARD: {
        allowedFrom: [GAME_PHASES.IDLE, GAME_PHASES.SELECT_CARD_COLOR],
        allowedTo: [
            GAME_PHASES.IDLE,
            GAME_PHASES.BONUS_ACTION,
            GAME_PHASES.STEAL_ACTION,
            GAME_PHASES.DISCARD_EXCESS_GEMS,
            GAME_PHASES.SELECT_ROYAL,
        ],
    },
    INITIATE_RESERVE: {
        allowedFrom: [GAME_PHASES.IDLE],
        allowedTo: [GAME_PHASES.RESERVE_WAITING_GEM],
    },
    INITIATE_RESERVE_DECK: {
        allowedFrom: [GAME_PHASES.IDLE],
        allowedTo: [GAME_PHASES.RESERVE_WAITING_GEM],
    },
    CANCEL_RESERVE: {
        allowedFrom: [GAME_PHASES.RESERVE_WAITING_GEM],
        allowedTo: [GAME_PHASES.IDLE],
    },
    RESERVE_CARD: {
        allowedFrom: [GAME_PHASES.IDLE, GAME_PHASES.RESERVE_WAITING_GEM],
        allowedTo: [GAME_PHASES.IDLE, GAME_PHASES.DISCARD_EXCESS_GEMS, GAME_PHASES.SELECT_ROYAL],
    },
    RESERVE_DECK: {
        allowedFrom: [GAME_PHASES.IDLE, GAME_PHASES.RESERVE_WAITING_GEM],
        allowedTo: [GAME_PHASES.IDLE, GAME_PHASES.DISCARD_EXCESS_GEMS, GAME_PHASES.SELECT_ROYAL],
    },
    DISCARD_RESERVED: {
        allowedFrom: [GAME_PHASES.IDLE],
        allowedTo: [GAME_PHASES.IDLE],
    },
    ACTIVATE_PRIVILEGE: {
        allowedFrom: [GAME_PHASES.IDLE],
        allowedTo: [GAME_PHASES.PRIVILEGE_ACTION],
    },
    USE_PRIVILEGE: {
        allowedFrom: [GAME_PHASES.PRIVILEGE_ACTION],
        allowedTo: [
            GAME_PHASES.PRIVILEGE_ACTION,
            GAME_PHASES.IDLE,
            GAME_PHASES.DISCARD_EXCESS_GEMS,
            GAME_PHASES.SELECT_ROYAL,
        ],
    },
    CANCEL_PRIVILEGE: {
        allowedFrom: [GAME_PHASES.PRIVILEGE_ACTION],
        allowedTo: [GAME_PHASES.IDLE],
    },
    FORCE_ROYAL_SELECTION: {
        allowedFrom: ALL_PHASES,
        allowedTo: [GAME_PHASES.SELECT_ROYAL],
    },
    SELECT_ROYAL_CARD: {
        allowedFrom: [GAME_PHASES.SELECT_ROYAL],
        allowedTo: [
            GAME_PHASES.IDLE,
            GAME_PHASES.BONUS_ACTION,
            GAME_PHASES.STEAL_ACTION,
            GAME_PHASES.DISCARD_EXCESS_GEMS,
        ],
    },
    DEBUG_ADD_CROWNS: {
        allowedFrom: ALL_PHASES,
        allowedTo: ALL_PHASES,
    },
    DEBUG_ADD_POINTS: {
        allowedFrom: ALL_PHASES,
        allowedTo: ALL_PHASES,
    },
    DEBUG_ADD_PRIVILEGE: {
        allowedFrom: ALL_PHASES,
        allowedTo: ALL_PHASES,
    },
    UNDO: {
        allowedFrom: ALL_PHASES,
        allowedTo: ALL_PHASES,
    },
    REDO: {
        allowedFrom: ALL_PHASES,
        allowedTo: ALL_PHASES,
    },
    PEEK_DECK: {
        allowedFrom: [GAME_PHASES.IDLE],
        allowedTo: [GAME_PHASES.IDLE],
    },
    DEBUG_REROLL_BUFFS: {
        allowedFrom: [GAME_PHASES.DRAFT_PHASE],
        allowedTo: [GAME_PHASES.DRAFT_PHASE],
    },
    CLOSE_MODAL: {
        allowedFrom: ALL_PHASES,
        allowedTo: ALL_PHASES,
    },
};

export interface FsmStateRequirement {
    phase: GamePhase;
    description: string;
    validate: (state: GameState) => boolean;
}

export const FSM_STATE_REQUIREMENTS: FsmStateRequirement[] = [
    {
        phase: GAME_PHASES.SELECT_CARD_COLOR,
        description: 'SELECT_CARD_COLOR requires a pendingBuy snapshot.',
        validate: (state) => state.pendingBuy !== null,
    },
    {
        phase: GAME_PHASES.RESERVE_WAITING_GEM,
        description: 'RESERVE_WAITING_GEM requires a pendingReserve snapshot.',
        validate: (state) => state.pendingReserve !== null,
    },
    {
        phase: GAME_PHASES.BONUS_ACTION,
        description: 'BONUS_ACTION requires a bonusGemTarget.',
        validate: (state) => state.bonusGemTarget !== null,
    },
    {
        phase: GAME_PHASES.SELECT_ROYAL,
        description: 'SELECT_ROYAL requires at least one royal card.',
        validate: (state) => state.royalDeck.length > 0,
    },
    {
        phase: GAME_PHASES.SELECT_ROYAL,
        description: 'SELECT_ROYAL requires a nextPlayerAfterRoyal pointer.',
        validate: (state) => state.nextPlayerAfterRoyal !== null,
    },
];

export const getFsmPolicy = (actionType: GameAction['type']): FsmCommandPolicy =>
    FSM_POLICY_BY_ACTION[actionType];

export const getCommandPhaseRejectionReason = (
    state: GameState,
    action: Exclude<GameAction, { type: 'INIT' | 'INIT_DRAFT' | 'FORCE_SYNC' | 'FLATTEN' }>
): string | null => {
    const policy = getFsmPolicy(action.type);
    if (!policy.allowedFrom || policy.allowedFrom.includes(state.phase)) {
        return null;
    }

    if (policy.allowedFrom.length === 1) {
        return `${action.type} is only allowed during the ${policy.allowedFrom[0]} phase.`;
    }

    return `${action.type} is not allowed during the ${state.phase} phase.`;
};

export const getStateIntegrityError = (state: GameState): string | null => {
    if (!ALL_PHASES.includes(state.phase)) {
        return `State contains an unknown phase: ${String(state.phase)}.`;
    }

    if (state.turn !== 'p1' && state.turn !== 'p2') {
        return `State contains an unknown active player: ${String(state.turn)}.`;
    }

    const phaseRequirement = FSM_STATE_REQUIREMENTS.find(
        (requirement) => requirement.phase === state.phase && !requirement.validate(state)
    );
    if (phaseRequirement) {
        return phaseRequirement.description;
    }

    if (state.winner && state.phase !== GAME_PHASES.IDLE) {
        return 'Winner states must resolve to the IDLE phase.';
    }

    return null;
};

export const getTransitionIntegrityError = (
    previousState: GameState,
    action: Exclude<GameAction, { type: 'INIT' | 'INIT_DRAFT' | 'FORCE_SYNC' | 'FLATTEN' }>,
    nextState: GameState
): string | null => {
    const policy = getFsmPolicy(action.type);
    if (policy.allowedTo && !policy.allowedTo.includes(nextState.phase)) {
        return `${action.type} moved the FSM from ${previousState.phase} to an unexpected ${nextState.phase} phase.`;
    }

    return null;
};
