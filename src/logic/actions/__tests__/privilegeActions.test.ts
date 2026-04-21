import { describe, expect, it } from 'vitest';
import { GEM_TYPES } from '../../../constants';
import { BUFF_NONE, type GameState, type GemTypeObject } from '../../../types';
import { createMockState } from '../../__tests__/testHelpers';
import {
    handleActivatePrivilege,
    handleCancelPrivilege,
    handleUsePrivilege,
} from '../privilegeActions';

const createState = (overrides: Partial<GameState> = {}): GameState =>
    JSON.parse(JSON.stringify(createMockState(overrides))) as GameState;

const setGem = (state: GameState, r: number, c: number, type: GemTypeObject = GEM_TYPES.RED) => {
    state.board[r][c] = { type, uid: `cell-${r}-${c}` };
};

describe('privilegeActions', () => {
    it('activates and cancels the privilege rail', () => {
        const state = createState({ phase: 'IDLE' });
        state.privilegeGemCount = 2;

        handleActivatePrivilege(state);
        expect(state.phase).toBe('PRIVILEGE_ACTION');
        expect(state.privilegeGemCount).toBe(0);

        handleCancelPrivilege(state);
        expect(state.phase).toBe('IDLE');
        expect(state.privilegeGemCount).toBe(0);
    });

    it('uses a normal privilege by consuming special privilege first', () => {
        const state = createState({
            phase: 'PRIVILEGE_ACTION',
            extraPrivileges: { p1: 1, p2: 0 },
            privileges: { p1: 1, p2: 0 },
        });
        setGem(state, 0, 0, GEM_TYPES.BLUE);

        handleUsePrivilege(state, { r: 0, c: 0 });

        expect(state.board[0][0].type).toBe(GEM_TYPES.EMPTY);
        expect(state.inventories.p1.blue).toBe(1);
        expect(state.extraPrivileges.p1).toBe(0);
        expect(state.privileges.p1).toBe(1);
        expect(state.phase).toBe('IDLE');
        expect(state.toastMessage).toBe('Used Special Privilege!');
    });

    it('ignores invalid payloads and non-collectible targets', () => {
        const invalidState = createState({ phase: 'PRIVILEGE_ACTION' });
        const invalidSnapshot = JSON.parse(JSON.stringify(invalidState)) as GameState;
        expect(handleUsePrivilege(invalidState, undefined as never)).toBe(invalidState);
        expect(invalidState).toEqual(invalidSnapshot);

        const goldState = createState({ phase: 'PRIVILEGE_ACTION' });
        setGem(goldState, 0, 0, GEM_TYPES.GOLD);
        handleUsePrivilege(goldState, { r: 0, c: 0 });
        expect(goldState.board[0][0].type).toBe(GEM_TYPES.GOLD);
        expect(goldState.phase).toBe('PRIVILEGE_ACTION');

        const emptyState = createState({ phase: 'PRIVILEGE_ACTION' });
        setGem(emptyState, 0, 0, GEM_TYPES.EMPTY);
        handleUsePrivilege(emptyState, { r: 0, c: 0 });
        expect(emptyState.board[0][0].type).toBe(GEM_TYPES.EMPTY);
        expect(emptyState.phase).toBe('PRIVILEGE_ACTION');
    });

    it('supports the double-agent second pick before returning to idle', () => {
        const state = createState({
            phase: 'PRIVILEGE_ACTION',
            privileges: { p1: 1, p2: 0 },
        });
        state.playerBuffs.p1 = {
            ...BUFF_NONE,
            effects: { passive: { privilegeBuff: 2 } },
        } as typeof BUFF_NONE;
        setGem(state, 0, 0, GEM_TYPES.RED);
        setGem(state, 0, 1, GEM_TYPES.BLUE);

        handleUsePrivilege(state, { r: 0, c: 0 });
        expect(state.phase).toBe('PRIVILEGE_ACTION');
        expect(state.privilegeGemCount).toBe(1);
        expect(state.privileges.p1).toBe(0);

        handleUsePrivilege(state, { r: 0, c: 1 });
        expect(state.phase).toBe('IDLE');
        expect(state.privilegeGemCount).toBe(0);
        expect(state.inventories.p1.red).toBe(1);
        expect(state.inventories.p1.blue).toBe(1);
    });

    it('consumes a standard privilege when no special charge exists', () => {
        const state = createState({
            phase: 'PRIVILEGE_ACTION',
            extraPrivileges: { p1: 0, p2: 0 },
            privileges: { p1: 1, p2: 0 },
        });
        setGem(state, 0, 0, GEM_TYPES.GREEN);

        handleUsePrivilege(state, { r: 0, c: 0 });

        expect(state.inventories.p1.green).toBe(1);
        expect(state.privileges.p1).toBe(0);
        expect(state.extraPrivileges.p1).toBe(0);
        expect(state.phase).toBe('IDLE');
    });

    it('resets a double-agent privilege immediately when no second gem remains', () => {
        const state = createState({
            phase: 'PRIVILEGE_ACTION',
            extraPrivileges: { p1: 1, p2: 0 },
            privileges: { p1: 0, p2: 0 },
        });
        Reflect.deleteProperty(state as unknown as Record<string, unknown>, 'privilegeGemCount');
        state.playerBuffs.p1 = {
            ...BUFF_NONE,
            effects: { passive: { privilegeBuff: 2 } },
        } as typeof BUFF_NONE;
        setGem(state, 0, 0, GEM_TYPES.RED);
        state.board = state.board.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
                rowIndex === 0 && colIndex === 0
                    ? cell
                    : { type: GEM_TYPES.EMPTY, uid: `empty-${rowIndex}-${colIndex}` }
            )
        );

        handleUsePrivilege(state, { r: 0, c: 0 });

        expect(state.inventories.p1.red).toBe(1);
        expect(state.extraPrivileges.p1).toBe(0);
        expect(state.privilegeGemCount).toBe(0);
        expect(state.phase).toBe('IDLE');
        expect(state.toastMessage).toBe('Used Special Privilege!');
    });
});
