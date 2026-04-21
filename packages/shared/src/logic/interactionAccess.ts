import type { GameMode, GameState, PlayerKey } from '../types';

export const getLocalPlayerKey = (gameState: Pick<GameState, 'isHost'>): PlayerKey =>
    gameState.isHost ? 'p1' : 'p2';

export const canPlayerInteract = (gameState: GameState, isReviewing: boolean = false): boolean => {
    if (isReviewing || gameState.winner) return false;

    switch (gameState.mode) {
        case 'LOCAL_PVP':
            return true;
        case 'PVE':
            return gameState.turn === 'p1';
        case 'ONLINE_MULTIPLAYER':
            return gameState.turn === getLocalPlayerKey(gameState);
        default:
            return true;
    }
};

export const isHistoryTimeTravelBlocked = (mode: GameMode): boolean =>
    mode === 'ONLINE_MULTIPLAYER';
