export const addFeedback = (state, player, type, diff) => {
    if (!state.lastFeedback) state.lastFeedback = { uid: Date.now() + '-' + Math.random(), items: [] };
    const existing = state.lastFeedback.items.find(i => i.player === player && i.type === type);
    if (existing) existing.diff += diff;
    else state.lastFeedback.items.push({ player, type, diff });
};

export const addPrivilege = (state, pid) => {
    if (state.privileges[pid] < 3) { // Standard Cap
         state.privileges[pid]++;
         addFeedback(state, pid, 'privilege', 1);
    }
};
