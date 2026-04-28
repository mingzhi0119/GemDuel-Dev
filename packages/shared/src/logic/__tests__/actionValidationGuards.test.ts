import { describe, expect, it } from 'vitest';
import { createGameSetupPayload } from '../gameSetup';
import { createMockState } from './testHelpers';
import {
    isBonusGemPayload,
    isBootstrapAction,
    isBuyCardPayload,
    isCoord,
    isDraftLevel,
    isGameSetupPayload,
    isGemColor,
    isInteger,
    isInitDraftPayload,
    isInitiateBuyJokerPayload,
    isInitiateReserveDeckPayload,
    isInitiateReservePayload,
    isLikelyGameState,
    isLevel,
    isPlainObject,
    isPeekDeckPayload,
    isPlayerKey,
    isReplenishPayload,
    isReserveCardPayload,
    isReserveDeckPayload,
    isRuntimeActionShapeValid,
    isSelectBuffPayload,
    isSelectRoyalPayload,
    isStealGemPayload,
    isTakeGemsPayload,
    isUsePrivilegePayload,
    isWithinBoard,
} from '../actionValidation/guards';

const sampleCard = {
    id: 'guard-card',
    level: 2 as const,
    cost: { blue: 1, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
    points: 2,
    bonusColor: 'blue' as const,
};

describe('actionValidation guards', () => {
    it('recognizes primitive and coordinate helpers', () => {
        expect(isPlainObject({ a: 1 })).toBe(true);
        expect(isPlainObject([])).toBe(false);
        expect(isInteger(3)).toBe(true);
        expect(isInteger(3.5)).toBe(false);
        expect(isLevel(2)).toBe(true);
        expect(isLevel(4)).toBe(false);
        expect(isDraftLevel(0)).toBe(true);
        expect(isDraftLevel(3)).toBe(true);
        expect(isDraftLevel(4)).toBe(false);
        expect(isPlayerKey('p1')).toBe(true);
        expect(isPlayerKey('p3')).toBe(false);
        expect(isGemColor('gold')).toBe(true);
        expect(isGemColor('pink')).toBe(false);
        expect(isCoord({ r: 1, c: 2 })).toBe(true);
        expect(isCoord({ r: 1, c: '2' })).toBe(false);
        expect(isWithinBoard({ r: 4, c: 4 })).toBe(true);
        expect(isWithinBoard({ r: 5, c: 0 })).toBe(false);
    });

    it('accepts the core payload schemas used by the reducers', () => {
        expect(
            isTakeGemsPayload({
                coords: [
                    { r: 0, c: 0 },
                    { r: 0, c: 1 },
                ],
            })
        ).toBe(true);
        expect(isBonusGemPayload({ r: 0, c: 1 })).toBe(true);
        expect(isReplenishPayload(undefined)).toBe(true);
        expect(
            isReplenishPayload({ randoms: { extortionColor: 'red', expansionColor: 'blue' } })
        ).toBe(true);
        expect(isStealGemPayload({ gemId: 'green' })).toBe(true);
        expect(isUsePrivilegePayload({ r: 1, c: 2 })).toBe(true);
        expect(
            isBuyCardPayload({
                card: sampleCard,
                source: 'market',
                marketInfo: { level: 2, idx: 0 },
            })
        ).toBe(true);
        expect(
            isInitiateBuyJokerPayload({
                card: { ...sampleCard, bonusColor: 'gold' },
                source: 'reserved',
                marketInfo: { level: 1, idx: 0, isExtra: true, extraIdx: 0 },
            })
        ).toBe(true);
        expect(
            isInitiateReservePayload({
                card: sampleCard,
                level: 2,
                idx: 0,
            })
        ).toBe(true);
        expect(
            isInitiateReservePayload({
                card: sampleCard,
                level: 1,
                idx: 0,
                isExtra: true,
                extraIdx: 0,
            })
        ).toBe(true);
        expect(isInitiateReserveDeckPayload({ level: 3 })).toBe(true);
        expect(
            isReserveCardPayload({
                card: sampleCard,
                level: 2,
                idx: 0,
                goldCoords: { r: 0, c: 0 },
            })
        ).toBe(true);
        expect(isReserveDeckPayload({ level: 1, goldCoords: { r: 0, c: 0 } })).toBe(true);
        expect(
            isSelectRoyalPayload({
                card: {
                    id: 'royal',
                    points: 3,
                    bonusColor: 'red',
                    ability: 'again',
                    label: 'Royal',
                },
            })
        ).toBe(true);
        expect(isPeekDeckPayload({ level: 1 })).toBe(true);
        expect(isPeekDeckPayload({ levels: [3, 2, 1] })).toBe(true);
        expect(isPeekDeckPayload({ levels: [] })).toBe(false);
        expect(
            isSelectBuffPayload({
                buffId: 'test-buff',
                randomColor: 'red',
                initRandoms: {
                    p1: {
                        randomGems: ['red', 'green', 'blue', 'white', 'black'],
                        reserveCardLevel: 1,
                        preferenceColor: 'red',
                    },
                    p2: {
                        randomGems: ['red', 'green', 'blue', 'white', 'black'],
                        reserveCardLevel: 2,
                        preferenceColor: 'blue',
                    },
                },
            })
        ).toBe(true);
    });

    it('accepts the game setup and state envelopes used by transport contracts', () => {
        const setup = createGameSetupPayload('LOCAL_PVP');
        const draft = {
            ...setup,
            draftPool: ['buff-a', 'buff-b', 'buff-c'],
            buffLevel: 1 as const,
        };
        const state = createMockState();
        const legacyReplayState = { ...state };
        delete (legacyReplayState as Partial<typeof legacyReplayState>).p2DraftLevel;

        expect(isGameSetupPayload(setup)).toBe(true);
        expect(isInitDraftPayload(draft)).toBe(true);
        expect(isLikelyGameState(state)).toBe(true);
        expect(isLikelyGameState(legacyReplayState)).toBe(true);
        expect(
            isBootstrapAction({
                type: 'INIT',
                payload: setup,
            })
        ).toBe(true);
        expect(
            isBootstrapAction({
                type: 'INIT_DRAFT',
                payload: draft,
            })
        ).toBe(true);
    });

    it('rejects malformed setup envelopes and payload edge cases', () => {
        const setup = createGameSetupPayload('LOCAL_PVP');

        expect(isReplenishPayload({ randoms: { extortionColor: 'pink' } })).toBe(false);
        expect(
            isBuyCardPayload({
                card: sampleCard,
                source: 'invalid',
            })
        ).toBe(false);
        expect(
            isBuyCardPayload({
                card: sampleCard,
                source: 'market',
                randoms: { bountyHunterColor: 'pink' },
            })
        ).toBe(false);
        expect(
            isReserveCardPayload({
                card: sampleCard,
                level: 2,
                idx: 0,
                isExtra: 'yes',
            })
        ).toBe(false);
        expect(
            isInitiateReservePayload({
                card: sampleCard,
                level: 1,
                idx: 0,
                isExtra: true,
            })
        ).toBe(false);
        expect(
            isReserveCardPayload({
                card: sampleCard,
                level: 2,
                idx: 0,
                extraIdx: 1.5,
            })
        ).toBe(false);
        expect(
            isGameSetupPayload({
                ...setup,
                mode: 'BROKEN_MODE',
            })
        ).toBe(false);
        expect(
            isGameSetupPayload({
                ...setup,
                bag: [...setup.bag.slice(0, 1), 123],
            })
        ).toBe(false);
        expect(
            isInitDraftPayload({
                ...setup,
                draftPool: ['buff-a', 'buff-b'],
                buffLevel: 9,
            })
        ).toBe(false);

        const badState = JSON.parse(JSON.stringify(createMockState()));
        badState.inventories = {
            p1: { ...badState.inventories.p1 },
            p2: { ...badState.inventories.p2, red: 'nope' as unknown as number },
        };
        expect(isLikelyGameState(badState)).toBe(false);
    });

    it('distinguishes valid runtime actions from malformed ones', () => {
        expect(
            isRuntimeActionShapeValid({
                type: 'TAKE_GEMS',
                payload: { coords: [{ r: 0, c: 0 }] },
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'CLOSE_MODAL',
                payload: undefined,
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'FORCE_SYNC',
                payload: { nope: true },
            })
        ).toBe(false);
        expect(
            isRuntimeActionShapeValid({
                type: 'REROLL_DRAFT_POOL',
                payload: { level: 7 },
            })
        ).toBe(false);
        expect(
            isBootstrapAction({
                type: 'UNKNOWN',
                payload: {},
            })
        ).toBe(false);
        expect(
            isRuntimeActionShapeValid({
                type: 'RESERVE_CARD',
                payload: { idx: 0 },
            })
        ).toBe(false);
    });

    it('accepts the remaining governed runtime action variants', () => {
        const runtimeState = createMockState();

        expect(
            isRuntimeActionShapeValid({
                type: 'FORCE_SYNC',
                payload: runtimeState,
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'FLATTEN',
                payload: runtimeState,
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'DISCARD_GEM',
                payload: 'red',
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'DISCARD_RESERVED',
                payload: { cardId: 'reserved-card' },
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'DEBUG_ADD_CROWNS',
                payload: 'p1',
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'DEBUG_ADD_POINTS',
                payload: 'p2',
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'DEBUG_ADD_PRIVILEGE',
                payload: 'p1',
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'UNDO',
                payload: undefined,
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'REDO',
                payload: undefined,
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'ACTIVATE_PRIVILEGE',
                payload: undefined,
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'CANCEL_PRIVILEGE',
                payload: undefined,
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'FORCE_ROYAL_SELECTION',
                payload: undefined,
            })
        ).toBe(true);
        expect(
            isRuntimeActionShapeValid({
                type: 'REROLL_DRAFT_POOL',
                payload: {},
            })
        ).toBe(true);
    });
});
