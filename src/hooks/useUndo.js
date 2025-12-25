import { useState, useCallback } from 'react';

export const useUndo = (onUndo) => {
    const [historyStack, setHistoryStack] = useState([]);
    const [undoMessage, setUndoMessage] = useState(null);

    const createSnapshot = (currentState) => {
        return JSON.parse(JSON.stringify(currentState));
    };

    const saveState = useCallback((currentState) => {
        const snapshot = createSnapshot(currentState);
        setHistoryStack(prev => [...prev, snapshot]);
    }, []);

    const handleUndo = useCallback(() => {
        if (historyStack.length === 0) return;

        const prevState = historyStack[historyStack.length - 1];
        setHistoryStack(prev => prev.slice(0, -1));

        if (onUndo) {
            onUndo(prevState);
        }
        
        setUndoMessage("Undid last action.");
        setTimeout(() => setUndoMessage(null), 1000);

    }, [historyStack, onUndo]);

    return { historyStack, saveState, handleUndo, undoMessage };
};
