import { getRemotePlayerKey } from './interactionAccess';
import type {
    Card,
    GameState,
    HiddenReservedCard,
    PlayerKey,
    ReservedCardVisibility,
    ReservedCardView,
} from '../types';

export const createHiddenReservedCardPlaceholder = (
    owner: PlayerKey,
    slotIndex: number
): HiddenReservedCard => ({
    isHiddenReservedCard: true,
    slotKey: `reserved-back-${owner}-${slotIndex}`,
    owner,
    slotIndex,
});

export const isHiddenReservedCard = (value: unknown): value is HiddenReservedCard =>
    Boolean(
        value &&
        typeof value === 'object' &&
        (value as Partial<HiddenReservedCard>).isHiddenReservedCard === true
    );

export const isVisibleReservedCard = (value: ReservedCardView): value is Card =>
    !isHiddenReservedCard(value);

export const getVisibleReservedCards = (cards: ReservedCardView[]): Card[] =>
    cards.filter(isVisibleReservedCard);

export const getReservedCardVisibilityForViewer = (
    owner: PlayerKey,
    receiver: PlayerKey
): ReservedCardVisibility => (owner === receiver ? 'faces' : 'backs');

const cloneGameState = (state: GameState): GameState =>
    JSON.parse(JSON.stringify(state)) as GameState;

const getOpponent = (player: PlayerKey): PlayerKey => (player === 'p1' ? 'p2' : 'p1');

const redactReservedCardsForOpponent = (
    cards: ReservedCardView[],
    owner: PlayerKey
): HiddenReservedCard[] =>
    cards.map((_, slotIndex) => createHiddenReservedCardPlaceholder(owner, slotIndex));

export const createMultiplayerViewForPlayer = (
    state: GameState,
    receiver: PlayerKey
): GameState => {
    const view = cloneGameState(state);
    const opponent = getOpponent(receiver);

    view.localPlayer = receiver;
    view.isHost = receiver === view.hostPlayer;
    view.playerReserved = {
        ...view.playerReserved,
        [receiver]: [...view.playerReserved[receiver]],
        [opponent]: redactReservedCardsForOpponent(state.playerReserved[opponent], opponent),
    };

    return view;
};

export const createRemoteMultiplayerViewForHost = (state: GameState): GameState =>
    createMultiplayerViewForPlayer(state, getRemotePlayerKey(state));
