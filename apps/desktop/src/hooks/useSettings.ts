import { useState } from 'react';

// Global Game Configuration (Preserved during Replay)
export const GAME_CONFIG = {
    difficulty: 'NORMAL',
    playerNames: { p1: 'Player 1', p2: 'Player 2' },
};

export const useSettings = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    return {
        theme,
        setTheme,
        GAME_CONFIG,
    };
};
