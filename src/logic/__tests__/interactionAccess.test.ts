import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import {
    canPlayerInteract,
    getLocalPlayerKey,
    isHistoryTimeTravelBlocked,
} from '../interactionAccess';
import type { GameState } from '../../types';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

describe('Interaction Access', () => {
    it('derives the local player key from host identity', () => {
        expect(getLocalPlayerKey({ isHost: true })).toBe('p1');
        expect(getLocalPlayerKey({ isHost: false })).toBe('p2');
    });

    it('blocks interaction while reviewing or after a winner exists', () => {
        const state = cloneState();
        state.winner = 'p1';

        expect(canPlayerInteract(state, true)).toBe(false);
        expect(canPlayerInteract(state, false)).toBe(false);
    });

    it('applies turn ownership correctly in PVE and online modes', () => {
        const pveState = cloneState();
        pveState.mode = 'PVE';
        pveState.turn = 'p1';

        const onlineGuestState = cloneState();
        onlineGuestState.mode = 'ONLINE_MULTIPLAYER';
        onlineGuestState.isHost = false;
        onlineGuestState.turn = 'p2';

        const onlineHostState = cloneState();
        onlineHostState.mode = 'ONLINE_MULTIPLAYER';
        onlineHostState.isHost = true;
        onlineHostState.turn = 'p2';

        expect(canPlayerInteract(pveState)).toBe(true);
        pveState.turn = 'p2';
        expect(canPlayerInteract(pveState)).toBe(false);
        expect(canPlayerInteract(onlineGuestState)).toBe(true);
        expect(canPlayerInteract(onlineHostState)).toBe(false);
    });

    it('blocks history time travel only in online multiplayer', () => {
        expect(isHistoryTimeTravelBlocked('LOCAL_PVP')).toBe(false);
        expect(isHistoryTimeTravelBlocked('PVE')).toBe(false);
        expect(isHistoryTimeTravelBlocked('ONLINE_MULTIPLAYER')).toBe(true);
    });
});
