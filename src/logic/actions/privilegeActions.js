import { GEM_TYPES } from '../../constants';
import { addFeedback } from '../stateHelpers';

export const handleActivatePrivilege = (state) => {
    state.gameMode = 'PRIVILEGE_ACTION';
    state.privilegeGemCount = 0;
    return state;
};

export const handleUsePrivilege = (state, payload) => {
    const { r, c } = payload;
    const gem = state.board[r][c];
    const gemType = gem.type.id;
    
    if (gemType === 'gold' || gemType === 'empty') return state;

    state.board[r][c] = { type: GEM_TYPES.EMPTY, uid: `empty-${r}-${c}-${Date.now()}` };
    state.inventories[state.turn][gemType] = (state.inventories[state.turn][gemType] || 0) + 1;
    addFeedback(state, state.turn, gemType, 1);
    
    const buff = state.playerBuffs?.[state.turn];
    const hasDoubleAgent = buff?.effects?.passive?.privilegeBuff === 2;

    if (hasDoubleAgent) {
        if (typeof state.privilegeGemCount === 'undefined') state.privilegeGemCount = 0;
        state.privilegeGemCount++;

        if (state.privilegeGemCount === 1) {
            if (buff?.state?.specialPrivilege > 0) {
                buff.state.specialPrivilege = 0;
                state.toastMessage = "Used Special Privilege!";
            } else if (state.privileges[state.turn] > 0) {
                state.privileges[state.turn]--;
                addFeedback(state, state.turn, 'privilege', -1);
            }
        }

        if (state.privilegeGemCount < 2) {
                const hasMoreGems = state.board.some(row => row.some(g => g.type.id !== 'empty' && g.type.id !== 'gold'));
                if (hasMoreGems) {
                    state.toastMessage = "Double Agent: Select 2nd Gem!";
                    return state;
                }
        }
        state.privilegeGemCount = 0;
    } else {
        if (buff?.state?.specialPrivilege > 0) {
                buff.state.specialPrivilege = 0;
                state.toastMessage = "Used Special Privilege!";
        } else if (state.privileges[state.turn] > 0) {
            state.privileges[state.turn]--;
            addFeedback(state, state.turn, 'privilege', -1);
        }
    }
    state.gameMode = 'IDLE';
    return state;
};
