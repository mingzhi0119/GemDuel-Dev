/**
 * State Helper Functions
 *
 * Low-level utility functions for modifying game state.
 * These are pure functions that handle common state mutations.
 */

import { GameState, PlayerKey } from '../types';

export const SHARED_PRIVILEGE_SUPPLY_SIZE = 3;

/**
 * Add feedback for a player action to the state
 *
 * @param state - Current game state
 * @param player - Player ID ('p1' or 'p2')
 * @param type - Feedback type (gem color, action, etc.)
 * @param diff - Change amount (positive or negative)
 */
export const addFeedback = (
    state: GameState,
    player: PlayerKey,
    type: string,
    diff: number
): void => {
    if (!state.lastFeedback) {
        state.lastFeedback = {
            uid: Date.now() + '-' + Math.random(),
            items: [],
        };
    }
    const existing = state.lastFeedback.items.find((i) => i.player === player && i.type === type);
    if (existing) {
        existing.diff += diff;
    } else {
        state.lastFeedback.items.push({ player, type, diff });
    }
};

/**
 * Add a standard privilege scroll to a player.
 *
 * The shared supply only holds 3 standard scrolls total. If the supply is empty,
 * the gaining player takes one from the opponent instead.
 *
 * @param state - Current game state
 * @param pid - Player ID ('p1' or 'p2')
 */
export const addPrivilege = (state: GameState, pid: PlayerKey): void => {
    const opponent: PlayerKey = pid === 'p1' ? 'p2' : 'p1';
    const total = state.privileges.p1 + state.privileges.p2;

    if (total < SHARED_PRIVILEGE_SUPPLY_SIZE) {
        state.privileges[pid]++;
        addFeedback(state, pid, 'privilege', 1);
        return;
    }

    if (state.privileges[opponent] > 0) {
        state.privileges[opponent]--;
        state.privileges[pid]++;
        addFeedback(state, opponent, 'privilege', -1);
        addFeedback(state, pid, 'privilege', 1);
    }
};
