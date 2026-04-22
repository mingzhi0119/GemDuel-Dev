import type { GameMode, GameState, PlayerKey } from '../types';

const getOpposingPlayer = (player: PlayerKey): PlayerKey => (player === 'p1' ? 'p2' : 'p1');

export const getLocalPlayerKey = (
    gameState: Pick<GameState, 'isHost'> & Partial<Pick<GameState, 'hostPlayer' | 'localPlayer'>>
): PlayerKey =>
    gameState.localPlayer ??
    (gameState.isHost
        ? (gameState.hostPlayer ?? 'p1')
        : getOpposingPlayer(gameState.hostPlayer ?? 'p1'));

export const getRemotePlayerKey = (
    gameState: Partial<Pick<GameState, 'hostPlayer' | 'localPlayer'>> & Pick<GameState, 'isHost'>
): PlayerKey => getOpposingPlayer(getLocalPlayerKey(gameState));

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
