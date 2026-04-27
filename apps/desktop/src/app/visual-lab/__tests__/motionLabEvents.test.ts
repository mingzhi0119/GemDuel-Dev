import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import { LEVEL_1_CARDS } from '@gemduel/shared/data/realCardsLevel1';
import { LEVEL_2_CARDS } from '@gemduel/shared/data/realCardsLevel2';
import { LEVEL_3_CARDS } from '@gemduel/shared/data/realCardsLevel3';
import type { GameState } from '@gemduel/shared/types';
import {
    createSurfaceLabPresentationEvent,
    SURFACE_LAB_MOTION_EVENT_TYPES,
    type SurfaceLabMotionOptions,
} from '../motionLabEvents';
import { getPresentationDurationMs } from '../../presentation/presentationPreviewMode';

const createState = (): GameState =>
    ({
        ...INITIAL_STATE_SKELETON,
        market: {
            1: [LEVEL_1_CARDS[0], LEVEL_1_CARDS[1]],
            2: [LEVEL_2_CARDS[0]],
            3: [LEVEL_3_CARDS[0]],
        },
        decks: {
            1: [LEVEL_1_CARDS[2]],
            2: [LEVEL_2_CARDS[1]],
            3: [LEVEL_3_CARDS[1]],
        },
        playerReserved: {
            p1: [],
            p2: [],
        },
    }) as GameState;

const options: SurfaceLabMotionOptions = {
    player: 'p1',
    marketLevel: 1,
    marketIndex: 0,
    deckLevel: 1,
    gemColor: 'blue',
    row: 2,
    col: 2,
    callout: 'ability-resolution',
    message: 'Preview',
    milestone: 'forced',
    nonce: 1,
};

describe('motion lab events', () => {
    it('creates a valid presentation event for every motion trigger', () => {
        const state = createState();

        for (const type of SURFACE_LAB_MOTION_EVENT_TYPES) {
            const event = createSurfaceLabPresentationEvent(type, state, options);
            expect(event, type).not.toBeNull();
        }
    });

    it('uses a deck source for deck reserve previews', () => {
        const event = createSurfaceLabPresentationEvent('deck-reserve', createState(), options);

        expect(event?.type).toBe('card-reserve');
        if (event?.type !== 'card-reserve') {
            throw new Error('Expected card-reserve event');
        }
        expect(event.cards[0].source).toEqual({ kind: 'deck', level: 1 });
    });

    it('leaves production presentation timing unchanged unless preview mode is set', () => {
        expect(getPresentationDurationMs(720)).toBe(720);
        expect(getPresentationDurationMs(720, 'slow')).toBe(2160);
    });
});
