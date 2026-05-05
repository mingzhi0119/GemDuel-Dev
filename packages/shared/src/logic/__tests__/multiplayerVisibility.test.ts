import { describe, expect, it } from 'vitest';
import { generateGameStateHash } from '../../utils/checksum';
import { createMockState } from './testHelpers';
import { createMultiplayerViewForPlayer, isHiddenReservedCard } from '../multiplayerVisibility';
import type { Card, GameState } from '../../types';

const emptyCost = {
    blue: 0,
    white: 0,
    green: 0,
    black: 0,
    red: 0,
    pearl: 0,
    gold: 0,
};

const createCard = (id: string, overrides: Partial<Card> = {}): Card => ({
    id,
    level: 2,
    cost: { ...emptyCost, red: 2 },
    points: 3,
    bonusColor: 'red',
    ability: 'steal',
    crowns: 1,
    prestige: 9,
    uid: `${id}-uid`,
    image: `${id}.png`,
    ...overrides,
});

const createReservedState = (): GameState =>
    createMockState({
        mode: 'ONLINE_MULTIPLAYER',
        isHost: true,
        hostPlayer: 'p1',
        localPlayer: 'p1',
        playerReserved: {
            p1: [createCard('owner-card', { bonusColor: 'blue' })],
            p2: [createCard('opponent-card-a'), createCard('opponent-card-b')],
        },
    });

describe('multiplayer visibility', () => {
    it('keeps receiver reserved card faces complete and redacts opponent reserved cards', () => {
        const state = createReservedState();
        const view = createMultiplayerViewForPlayer(state, 'p1');

        expect(view).not.toBe(state);
        expect(view.localPlayer).toBe('p1');
        expect(view.isHost).toBe(true);
        expect(view.playerReserved.p1).toEqual(state.playerReserved.p1);
        expect(view.playerReserved.p2).toHaveLength(2);
        expect(view.playerReserved.p2.every(isHiddenReservedCard)).toBe(true);
        expect(view.playerReserved.p2).toEqual([
            {
                isHiddenReservedCard: true,
                owner: 'p2',
                slotIndex: 0,
                slotKey: 'reserved-back-p2-0',
            },
            {
                isHiddenReservedCard: true,
                owner: 'p2',
                slotIndex: 1,
                slotKey: 'reserved-back-p2-1',
            },
        ]);
    });

    it('does not include reserved-card identity fields in placeholders', () => {
        const state = createReservedState();
        const view = createMultiplayerViewForPlayer(state, 'p1');
        const placeholder = view.playerReserved.p2[0] as unknown as Record<string, unknown>;

        for (const forbidden of [
            'id',
            'cost',
            'points',
            'ability',
            'bonusColor',
            'crowns',
            'prestige',
            'image',
            'uid',
        ]) {
            expect(placeholder).not.toHaveProperty(forbidden);
        }
    });

    it('does not mutate the authoritative source state', () => {
        const state = createReservedState();
        const originalOpponentReserved = JSON.parse(JSON.stringify(state.playerReserved.p2));

        createMultiplayerViewForPlayer(state, 'p1');

        expect(state.playerReserved.p2).toEqual(originalOpponentReserved);
        expect((state.playerReserved.p2[0] as Card | undefined)?.id).toBe('opponent-card-a');
    });

    it('hashes full and redacted reserved-card views consistently for guest verification', () => {
        const state = createReservedState();
        const redactedGuestView = createMultiplayerViewForPlayer(state, 'p2');

        expect(redactedGuestView.playerReserved.p1.every(isHiddenReservedCard)).toBe(true);
        expect(generateGameStateHash(redactedGuestView)).toBe(generateGameStateHash(state));
    });

    it('hashes reserved-card public slot shape without reserved-card identities', () => {
        const state = createReservedState();
        const samePublicShapeState = structuredClone(state);
        samePublicShapeState.playerReserved.p1[0] = createCard('different-private-card', {
            ability: 'scroll',
            bonusColor: 'green',
            points: 9,
        });
        const differentPublicShapeState = structuredClone(state);
        differentPublicShapeState.playerReserved.p1.push(createCard('extra-private-card'));

        expect(generateGameStateHash(samePublicShapeState)).toBe(generateGameStateHash(state));
        expect(generateGameStateHash(differentPublicShapeState)).not.toBe(
            generateGameStateHash(state)
        );
    });
});
