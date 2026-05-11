// @vitest-environment node

import { readFileSync } from 'node:fs';

import { describe, expect, it, vi } from 'vitest';

import { loadReplayStateAtRevision } from '../../packages/shared/src/replay/loader';
import { readReplayVNext } from '../../packages/shared/src/replay/reader';
import {
    buildIdentityRuntimeToInstanceMap,
    serializeReplayStateSnapshot,
} from '../../packages/shared/src/replay/runtime';
import { simulateAiVsAiReplay } from '../../packages/shared/src/replay/simulation';
import { generateReplayStateHash } from '../../packages/shared/src/replay/stateHash';
import type {
    ReplayEvent,
    ReplayMarketRef,
    ReplayVNext,
} from '../../packages/shared/src/replay/types';
import { handleUnityRulesEngineBridgeRequest } from './unity-rules-engine-bridge';

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const createDeterministicRandom = (seed = 123_456_789) => {
    let current = seed >>> 0;
    return () => {
        current = (current * 1_664_525 + 1_013_904_223) >>> 0;
        return current / 4_294_967_296;
    };
};

const findFirstBoardGem = (state: { board: string[][] }, gemId: string) => {
    for (let r = 0; r < state.board.length; r += 1) {
        const row = state.board[r];
        for (let c = 0; c < row.length; c += 1) {
            if (row[c] === gemId) {
                return { r, c };
            }
        }
    }

    throw new Error(`Missing board gem ${gemId}.`);
};

const findFirstCollectibleBoardGem = (state: { board: string[][] }) => {
    for (let r = 0; r < state.board.length; r += 1) {
        const row = state.board[r];
        for (let c = 0; c < row.length; c += 1) {
            const gemId = row[c];
            if (gemId !== 'empty' && gemId !== 'gold') {
                return { r, c };
            }
        }
    }

    throw new Error('Missing collectible board gem.');
};

const findFirstCollectibleBoardGemWithId = (state: { board: string[][] }) => {
    for (let r = 0; r < state.board.length; r += 1) {
        const row = state.board[r];
        for (let c = 0; c < row.length; c += 1) {
            const gemId = row[c];
            if (gemId !== 'empty' && gemId !== 'gold') {
                return { r, c, gemId };
            }
        }
    }

    throw new Error('Missing collectible board gem.');
};

const getDifferentGemColor = (gemId: string) =>
    (['red', 'green', 'blue', 'white', 'black', 'pearl'] as const).find(
        (candidate) => candidate !== gemId
    ) ?? 'red';

const startGameWithVisibleJoker = () => {
    for (let index = 0; index < 100; index += 1) {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: `unity-bridge-joker-${index}`,
        });
        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        for (const level of [1, 2, 3] as const) {
            const idx = start.state.market[level].findIndex((instanceId) =>
                Boolean(instanceId?.includes('-jo#'))
            );
            if (idx >= 0) {
                return {
                    start,
                    level,
                    idx,
                    instanceId: start.state.market[level][idx] as string,
                };
            }
        }
    }

    throw new Error(
        'Expected at least one deterministic start seed to expose a Joker market card.'
    );
};

const findFirstNonJokerMarketRef = (state: { market: Record<number, Array<string | null>> }) => {
    for (const level of [1, 2, 3] as const) {
        const idx = state.market[level].findIndex(
            (instanceId) => Boolean(instanceId) && !instanceId?.includes('-jo#')
        );
        if (idx >= 0) {
            return { level, idx, instanceId: state.market[level][idx] as string };
        }
    }

    throw new Error('Expected a non-Joker market card.');
};

const toBridgeMarketPayload = (marketRef: ReplayMarketRef) => ({
    level: marketRef.level,
    idx: marketRef.idx,
    ...(marketRef.isExtra ? { isExtra: true } : {}),
    ...(marketRef.extraIdx !== undefined ? { extraIdx: marketRef.extraIdx } : {}),
});

const replayEventToBridgeCommand = (event: ReplayEvent) => {
    switch (event.type) {
        case 'select_buff':
            return {
                type: 'SELECT_BUFF',
                payload: {
                    buffId: event.buffId,
                    ...(event.randomColor ? { randomColor: event.randomColor } : {}),
                    ...(event.initRandoms ? { initRandoms: event.initRandoms } : {}),
                    ...(event.p2DraftPoolIndices
                        ? { p2DraftPoolIndices: event.p2DraftPoolIndices }
                        : {}),
                },
            };
        case 'take_gems':
            return { type: 'TAKE_GEMS', payload: { coords: event.coords } };
        case 'replenish':
            return {
                type: 'REPLENISH',
                ...(event.randoms ? { payload: { randoms: event.randoms } } : {}),
            };
        case 'take_bonus_gem':
            return { type: 'TAKE_BONUS_GEM', payload: event.coord };
        case 'discard_gem':
            return { type: 'DISCARD_GEM', payload: { gemId: event.gemId } };
        case 'steal_gem':
            return { type: 'STEAL_GEM', payload: { gemId: event.gemId } };
        case 'initiate_buy_joker':
            return {
                type: 'INITIATE_BUY_JOKER',
                payload:
                    event.source === 'reserved'
                        ? { source: 'reserved', instanceId: event.instanceId }
                        : toBridgeMarketPayload(event.marketRef ?? { level: 1, idx: 0 }),
            };
        case 'buy_card':
            return event.source === 'reserved'
                ? {
                      type: 'BUY_RESERVED_CARD',
                      payload: {
                          instanceId: event.instanceId,
                          bonusColor: event.bonusColor,
                          ...(event.randoms ? { randoms: event.randoms } : {}),
                      },
                  }
                : {
                      type: 'BUY_CARD',
                      payload: {
                          ...toBridgeMarketPayload(event.marketRef ?? { level: 1, idx: 0 }),
                          bonusColor: event.bonusColor,
                          ...(event.randoms ? { randoms: event.randoms } : {}),
                      },
                  };
        case 'initiate_reserve':
            return {
                type: 'INITIATE_RESERVE',
                payload: toBridgeMarketPayload(event.marketRef),
            };
        case 'initiate_reserve_deck':
            return { type: 'INITIATE_RESERVE_DECK', payload: { level: event.level } };
        case 'cancel_reserve':
            return { type: 'CANCEL_RESERVE' };
        case 'reserve_card':
            return {
                type: 'RESERVE_CARD',
                payload: {
                    ...toBridgeMarketPayload(event.marketRef),
                    ...(event.goldCoord ? { goldCoords: event.goldCoord } : {}),
                    ...(event.isSteal ? { isSteal: true } : {}),
                },
            };
        case 'reserve_deck':
            return {
                type: 'RESERVE_DECK',
                payload: {
                    level: event.level,
                    ...(event.goldCoord ? { goldCoords: event.goldCoord } : {}),
                },
            };
        case 'discard_reserved':
            return { type: 'DISCARD_RESERVED', payload: { instanceId: event.instanceId } };
        case 'activate_privilege':
            return { type: 'ACTIVATE_PRIVILEGE' };
        case 'use_privilege':
            return { type: 'USE_PRIVILEGE', payload: event.coord };
        case 'cancel_privilege':
            return { type: 'CANCEL_PRIVILEGE' };
        case 'select_royal':
            return { type: 'SELECT_ROYAL_CARD', payload: { royalId: event.royalId } };
        case 'reroll_draft_pool':
            return {
                type: 'REROLL_DRAFT_POOL',
                payload: event.level ? { level: event.level } : {},
            };
        case 'peek_deck':
            return {
                type: 'PEEK_DECK',
                payload: {
                    ...(event.level ? { level: event.level } : {}),
                    ...(event.levels ? { levels: event.levels } : {}),
                },
            };
        case 'close_modal':
            return { type: 'CLOSE_MODAL' };
    }
};

const loadGoldenReplay = (fileName: string): ReplayVNext => {
    const raw = readFileSync(
        new URL(`../../fixtures/replay-golden/${fileName}`, import.meta.url),
        'utf8'
    );
    return readReplayVNext(raw, { verifySummary: 'full' }).replay;
};

describe('unity rules engine bridge', () => {
    it('starts a deterministic local PvP game and applies a legal command', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        expect(start.actionType).toBe('INIT');
        expect(start.state.phase).toBe('IDLE');
        expect(start.stateHash).toMatch(/^[a-f0-9]{8}$/);

        const apply = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'TAKE_GEMS',
                payload: { coords: [{ r: 0, c: 0 }] },
            },
        });

        expect(apply.ok).toBe(true);
        if (!apply.ok) {
            throw new Error(apply.rejection.reason);
        }

        expect(apply.actionType).toBe('TAKE_GEMS');
        expect(apply.state.turn).toBe('p2');
        expect(apply.stateHash).toMatch(/^[a-f0-9]{8}$/);
        expect(apply.stateHash).not.toBe(start.stateHash);
    });

    it('rejects infrastructure and debug commands at the live Unity bridge boundary', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-infrastructure-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const unsupportedCommandTypes = [
            'FORCE_SYNC',
            'FLATTEN',
            'INIT',
            'INIT_DRAFT',
            'DEBUG_ADD_CROWNS',
            'DEBUG_ADD_POINTS',
            'DEBUG_ADD_PRIVILEGE',
        ] as const;

        for (const type of unsupportedCommandTypes) {
            const response = handleUnityRulesEngineBridgeRequest({
                kind: 'apply',
                init: start.init,
                state: start.state,
                actor: 'p1',
                command: { type, payload: {} },
            });

            expect(response.ok, type).toBe(false);
            if (response.ok) {
                throw new Error(`Expected ${type} to be rejected.`);
            }
            expect(response.rejection.code, type).toBe('COMMAND_NORMALIZATION_FAILED');
            expect(response.rejection.reason, type).toBe(
                `${type} is not accepted through the live Unity rules bridge.`
            );
            expect(response.actionType, type).toBe(type);
            expect(response.state, type).toEqual(start.state);
            expect(response.stateHash, type).toBe(start.stateHash);
        }
    });

    it('rejects invalid and wrong-phase take-gems commands without mutating state', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-take-gems-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const emptySelection = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'TAKE_GEMS',
                payload: { coords: [] },
            },
        });

        expect(emptySelection.ok).toBe(false);
        if (emptySelection.ok) {
            throw new Error('Expected empty gem selection to be rejected.');
        }
        expect(emptySelection.rejection.code).toBe('COMMAND_REJECTED');
        expect(emptySelection.rejection.reason).toBe(
            'Gem selection must contain between one and three coordinates.'
        );
        expect(emptySelection.actionType).toBe('TAKE_GEMS');
        expect(emptySelection.state).toEqual(start.state);
        expect(emptySelection.stateHash).toBe(start.stateHash);

        const gold = findFirstBoardGem(start.state, 'gold');
        const goldSelection = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'TAKE_GEMS',
                payload: { coords: [gold] },
            },
        });

        expect(goldSelection.ok).toBe(false);
        if (goldSelection.ok) {
            throw new Error('Expected gold gem selection to be rejected.');
        }
        expect(goldSelection.rejection.code).toBe('COMMAND_REJECTED');
        expect(goldSelection.rejection.reason).toBe(
            'Gem selection includes an empty or gold cell.'
        );
        expect(goldSelection.actionType).toBe('TAKE_GEMS');
        expect(goldSelection.state).toEqual(start.state);
        expect(goldSelection.stateHash).toBe(start.stateHash);

        const gappedSelection = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'TAKE_GEMS',
                payload: {
                    coords: [
                        { r: 0, c: 0 },
                        { r: 0, c: 2 },
                    ],
                },
            },
        });

        expect(gappedSelection.ok).toBe(false);
        if (gappedSelection.ok) {
            throw new Error('Expected gapped gem selection to be rejected.');
        }
        expect(gappedSelection.rejection.code).toBe('COMMAND_REJECTED');
        expect(gappedSelection.rejection.reason).toBe('Gap detected.');
        expect(gappedSelection.actionType).toBe('TAKE_GEMS');
        expect(gappedSelection.state).toEqual(start.state);
        expect(gappedSelection.stateHash).toBe(start.stateHash);

        const wrongPhaseState = cloneJson(start.state);
        wrongPhaseState.phase = 'DRAFT_PHASE';
        const collectible = findFirstCollectibleBoardGem(wrongPhaseState);
        const wrongPhase = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: wrongPhaseState,
            actor: 'p1',
            command: {
                type: 'TAKE_GEMS',
                payload: { coords: [collectible] },
            },
        });

        expect(wrongPhase.ok).toBe(false);
        if (wrongPhase.ok) {
            throw new Error('Expected wrong-phase gem selection to be rejected.');
        }
        expect(wrongPhase.rejection.code).toBe('COMMAND_REJECTED');
        expect(wrongPhase.rejection.reason).toBe(
            'TAKE_GEMS is only allowed during the IDLE phase.'
        );
        expect(wrongPhase.actionType).toBe('TAKE_GEMS');
        expect(wrongPhase.state).toEqual(wrongPhaseState);
    });

    it('rejects empty-bag and wrong-phase replenish commands without mutating state', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-replenish-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const emptyBagState = cloneJson(start.state);
        emptyBagState.bag = [];
        const emptyBag = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: emptyBagState,
            actor: 'p1',
            command: {
                type: 'REPLENISH',
            },
        });

        expect(emptyBag.ok).toBe(false);
        if (emptyBag.ok) {
            throw new Error('Expected empty-bag replenish to be rejected.');
        }
        expect(emptyBag.rejection.code).toBe('COMMAND_REJECTED');
        expect(emptyBag.rejection.reason).toBe('The bag is empty.');
        expect(emptyBag.actionType).toBe('REPLENISH');
        expect(emptyBag.state).toEqual(emptyBagState);

        const wrongPhaseState = cloneJson(start.state);
        wrongPhaseState.phase = 'DRAFT_PHASE';
        const wrongPhase = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: wrongPhaseState,
            actor: 'p1',
            command: {
                type: 'REPLENISH',
            },
        });

        expect(wrongPhase.ok).toBe(false);
        if (wrongPhase.ok) {
            throw new Error('Expected wrong-phase replenish to be rejected.');
        }
        expect(wrongPhase.rejection.code).toBe('COMMAND_REJECTED');
        expect(wrongPhase.rejection.reason).toBe(
            'REPLENISH is only allowed during the IDLE phase.'
        );
        expect(wrongPhase.actionType).toBe('REPLENISH');
        expect(wrongPhase.state).toEqual(wrongPhaseState);
    });

    it('rejects invalid and wrong-phase bonus, discard, and steal follow-up commands', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-follow-up-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const bonusState = cloneJson(start.state);
        const bonusGem = findFirstCollectibleBoardGemWithId(bonusState);
        bonusState.phase = 'BONUS_ACTION';
        bonusState.bonusGemTarget = getDifferentGemColor(bonusGem.gemId);

        const wrongBonusColor = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: bonusState,
            actor: 'p1',
            command: {
                type: 'TAKE_BONUS_GEM',
                payload: { r: bonusGem.r, c: bonusGem.c },
            },
        });

        expect(wrongBonusColor.ok).toBe(false);
        if (wrongBonusColor.ok) {
            throw new Error('Expected wrong-color bonus gem to be rejected.');
        }
        expect(wrongBonusColor.rejection.code).toBe('COMMAND_REJECTED');
        expect(wrongBonusColor.rejection.reason).toBe(
            'Selected bonus gem does not match the required color.'
        );
        expect(wrongBonusColor.actionType).toBe('TAKE_BONUS_GEM');
        expect(wrongBonusColor.state).toEqual(bonusState);

        const emptyBonusState = cloneJson(start.state);
        emptyBonusState.phase = 'BONUS_ACTION';
        emptyBonusState.bonusGemTarget = 'red';
        emptyBonusState.board[0][0] = 'empty';
        const emptyBonus = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: emptyBonusState,
            actor: 'p1',
            command: {
                type: 'TAKE_BONUS_GEM',
                payload: { r: 0, c: 0 },
            },
        });

        expect(emptyBonus.ok).toBe(false);
        if (emptyBonus.ok) {
            throw new Error('Expected empty-cell bonus gem to be rejected.');
        }
        expect(emptyBonus.rejection.code).toBe('COMMAND_REJECTED');
        expect(emptyBonus.rejection.reason).toBe('Selected bonus gem is not available.');
        expect(emptyBonus.actionType).toBe('TAKE_BONUS_GEM');
        expect(emptyBonus.state).toEqual(emptyBonusState);

        const wrongBonusPhaseState = cloneJson(start.state);
        wrongBonusPhaseState.bonusGemTarget = bonusGem.gemId;
        const wrongBonusPhase = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: wrongBonusPhaseState,
            actor: 'p1',
            command: {
                type: 'TAKE_BONUS_GEM',
                payload: { r: bonusGem.r, c: bonusGem.c },
            },
        });

        expect(wrongBonusPhase.ok).toBe(false);
        if (wrongBonusPhase.ok) {
            throw new Error('Expected wrong-phase bonus gem to be rejected.');
        }
        expect(wrongBonusPhase.rejection.code).toBe('COMMAND_REJECTED');
        expect(wrongBonusPhase.rejection.reason).toBe(
            'TAKE_BONUS_GEM is only allowed during the BONUS_ACTION phase.'
        );
        expect(wrongBonusPhase.actionType).toBe('TAKE_BONUS_GEM');
        expect(wrongBonusPhase.state).toEqual(wrongBonusPhaseState);

        const objectPayloadDiscardState = cloneJson(start.state);
        objectPayloadDiscardState.phase = 'DISCARD_EXCESS_GEMS';
        objectPayloadDiscardState.inventories.p1.red = 1;
        const objectPayloadDiscard = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: objectPayloadDiscardState,
            actor: 'p1',
            command: {
                type: 'DISCARD_GEM',
                payload: { gemId: 'red' },
            },
        });

        expect(objectPayloadDiscard.ok).toBe(true);
        if (!objectPayloadDiscard.ok) {
            throw new Error(objectPayloadDiscard.rejection.reason);
        }
        expect(objectPayloadDiscard.actionType).toBe('DISCARD_GEM');
        expect(objectPayloadDiscard.state.inventories.p1.red).toBe(0);
        expect(objectPayloadDiscard.state.turn).toBe('p2');
        expect(objectPayloadDiscard.stateHash).toMatch(/^[a-f0-9]+$/);

        const discardState = cloneJson(start.state);
        discardState.phase = 'DISCARD_EXCESS_GEMS';
        discardState.inventories.p1.red = 0;
        const notOwnedDiscard = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: discardState,
            actor: 'p1',
            command: {
                type: 'DISCARD_GEM',
                payload: { gemId: 'red' },
            },
        });

        expect(notOwnedDiscard.ok).toBe(false);
        if (notOwnedDiscard.ok) {
            throw new Error('Expected not-owned discard to be rejected.');
        }
        expect(notOwnedDiscard.rejection.code).toBe('COMMAND_REJECTED');
        expect(notOwnedDiscard.rejection.reason).toBe('The active player does not own that gem.');
        expect(notOwnedDiscard.actionType).toBe('DISCARD_GEM');
        expect(notOwnedDiscard.state).toEqual(discardState);

        const wrongDiscardPhaseState = cloneJson(start.state);
        wrongDiscardPhaseState.inventories.p1.red = 1;
        const wrongDiscardPhase = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: wrongDiscardPhaseState,
            actor: 'p1',
            command: {
                type: 'DISCARD_GEM',
                payload: { gemId: 'red' },
            },
        });

        expect(wrongDiscardPhase.ok).toBe(false);
        if (wrongDiscardPhase.ok) {
            throw new Error('Expected wrong-phase discard to be rejected.');
        }
        expect(wrongDiscardPhase.rejection.code).toBe('COMMAND_REJECTED');
        expect(wrongDiscardPhase.rejection.reason).toBe(
            'DISCARD_GEM is only allowed during the DISCARD_EXCESS_GEMS phase.'
        );
        expect(wrongDiscardPhase.actionType).toBe('DISCARD_GEM');
        expect(wrongDiscardPhase.state).toEqual(wrongDiscardPhaseState);

        const stealState = cloneJson(start.state);
        stealState.phase = 'STEAL_ACTION';
        stealState.inventories.p2.red = 0;
        const goldSteal = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: stealState,
            actor: 'p1',
            command: {
                type: 'STEAL_GEM',
                payload: { gemId: 'gold' },
            },
        });

        expect(goldSteal.ok).toBe(false);
        if (goldSteal.ok) {
            throw new Error('Expected gold steal to be rejected.');
        }
        expect(goldSteal.rejection.code).toBe('COMMAND_REJECTED');
        expect(goldSteal.rejection.reason).toBe('Gold cannot be stolen.');
        expect(goldSteal.actionType).toBe('STEAL_GEM');
        expect(goldSteal.state).toEqual(stealState);

        const notOwnedSteal = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: stealState,
            actor: 'p1',
            command: {
                type: 'STEAL_GEM',
                payload: { gemId: 'red' },
            },
        });

        expect(notOwnedSteal.ok).toBe(false);
        if (notOwnedSteal.ok) {
            throw new Error('Expected not-owned steal to be rejected.');
        }
        expect(notOwnedSteal.rejection.code).toBe('COMMAND_REJECTED');
        expect(notOwnedSteal.rejection.reason).toBe('The opponent does not own the requested gem.');
        expect(notOwnedSteal.actionType).toBe('STEAL_GEM');
        expect(notOwnedSteal.state).toEqual(stealState);

        const wrongStealPhaseState = cloneJson(start.state);
        wrongStealPhaseState.inventories.p2.red = 1;
        const wrongStealPhase = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: wrongStealPhaseState,
            actor: 'p1',
            command: {
                type: 'STEAL_GEM',
                payload: { gemId: 'red' },
            },
        });

        expect(wrongStealPhase.ok).toBe(false);
        if (wrongStealPhase.ok) {
            throw new Error('Expected wrong-phase steal to be rejected.');
        }
        expect(wrongStealPhase.rejection.code).toBe('COMMAND_REJECTED');
        expect(wrongStealPhase.rejection.reason).toBe(
            'STEAL_GEM is only allowed during the STEAL_ACTION phase.'
        );
        expect(wrongStealPhase.actionType).toBe('STEAL_GEM');
        expect(wrongStealPhase.state).toEqual(wrongStealPhaseState);
    });

    it('starts a roguelike draft game and rerolls the active draft level through the bridge', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            useBuffs: true,
            seed: 'unity-bridge-draft-reroll-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        expect(start.actionType).toBe('INIT_DRAFT');
        expect(start.state.phase).toBe('DRAFT_PHASE');
        expect(start.state.turn).toBe('p1');
        expect([1, 2, 3]).toContain(start.state.buffLevel);
        expect(start.state.draftPool.length).toBeGreaterThan(0);
        const rerollLevel = start.state.buffLevel === 1 ? 2 : 1;

        const rerolled = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'REROLL_DRAFT_POOL',
                payload: { level: rerollLevel },
            },
        });

        expect(rerolled.ok).toBe(true);
        if (!rerolled.ok) {
            throw new Error(rerolled.rejection.reason);
        }

        expect(rerolled.actionType).toBe('REROLL_DRAFT_POOL');
        expect(rerolled.state.phase).toBe('DRAFT_PHASE');
        expect(rerolled.state.turn).toBe('p1');
        expect(rerolled.state.buffLevel).toBe(rerollLevel);
        expect(rerolled.state.draftPool.length).toBeGreaterThan(0);
        expect(rerolled.state.draftPool).not.toEqual(start.state.draftPool);
        expect(rerolled.stateHash).toMatch(/^[a-f0-9]+$/);
        expect(rerolled.stateHash).not.toBe(start.stateHash);
    });

    it('rejects unavailable and wrong-phase draft buff selections without mutating state', () => {
        const draftStart = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            useBuffs: true,
            seed: 'unity-bridge-draft-select-rejection-test',
        });

        expect(draftStart.ok).toBe(true);
        if (!draftStart.ok) {
            throw new Error(draftStart.rejection.reason);
        }

        const unavailable = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: draftStart.init,
            state: draftStart.state,
            actor: 'p1',
            command: {
                type: 'SELECT_BUFF',
                payload: { buffId: '__missing_buff__' },
            },
        });

        expect(unavailable.ok).toBe(false);
        if (unavailable.ok) {
            throw new Error('Expected unavailable draft buff selection to be rejected.');
        }

        expect(unavailable.rejection.code).toBe('COMMAND_REJECTED');
        expect(unavailable.rejection.reason).toBe(
            'Selected buff is not available to the active player.'
        );
        expect(unavailable.actionType).toBe('SELECT_BUFF');
        expect(unavailable.state).toEqual(draftStart.state);
        expect(unavailable.stateHash).toBe(draftStart.stateHash);

        const localStart = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-draft-select-wrong-phase-test',
        });

        expect(localStart.ok).toBe(true);
        if (!localStart.ok) {
            throw new Error(localStart.rejection.reason);
        }

        const wrongPhase = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: localStart.init,
            state: localStart.state,
            actor: 'p1',
            command: {
                type: 'SELECT_BUFF',
                payload: { buffId: 'royal_envoy' },
            },
        });

        expect(wrongPhase.ok).toBe(false);
        if (wrongPhase.ok) {
            throw new Error('Expected wrong-phase draft buff selection to be rejected.');
        }

        expect(wrongPhase.rejection.code).toBe('COMMAND_REJECTED');
        expect(wrongPhase.rejection.reason).toBe(
            'SELECT_BUFF is only allowed during the DRAFT_PHASE phase.'
        );
        expect(wrongPhase.actionType).toBe('SELECT_BUFF');
        expect(wrongPhase.state).toEqual(localStart.state);
        expect(wrongPhase.stateHash).toBe(localStart.stateHash);
    });

    it('rejects draft reroll outside the draft phase without mutating state', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-draft-reroll-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        expect(start.state.phase).toBe('IDLE');
        const rejected = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'REROLL_DRAFT_POOL',
                payload: { level: 1 },
            },
        });

        expect(rejected.ok).toBe(false);
        if (rejected.ok) {
            throw new Error('Expected non-draft reroll to be rejected.');
        }

        expect(rejected.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejected.actionType).toBe('REROLL_DRAFT_POOL');
        expect(rejected.state).toEqual(start.state);
        expect(rejected.stateHash).toBe(start.stateHash);
    });

    it('rejects unavailable, wrong-actor, and wrong-phase royal selections without mutating state', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-royal-selection-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const validRoyalId = start.state.royalDeck[0];
        expect(validRoyalId).toBeTruthy();

        const selectRoyalState = cloneJson(start.state);
        selectRoyalState.phase = 'SELECT_ROYAL';

        const unavailable = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: selectRoyalState,
            actor: 'p1',
            command: {
                type: 'SELECT_ROYAL_CARD',
                payload: { royalId: '__missing_royal__' },
            },
        });

        expect(unavailable.ok).toBe(false);
        if (unavailable.ok) {
            throw new Error('Expected unavailable royal selection to be rejected.');
        }
        expect(unavailable.rejection.code).toBe('COMMAND_REJECTED');
        expect(unavailable.rejection.reason).toBe('Selected royal card is no longer available.');
        expect(unavailable.actionType).toBe('SELECT_ROYAL_CARD');
        expect(unavailable.state).toEqual(selectRoyalState);

        const wrongActor = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: selectRoyalState,
            actor: 'p2',
            command: {
                type: 'SELECT_ROYAL_CARD',
                payload: { royalId: validRoyalId },
            },
        });

        expect(wrongActor.ok).toBe(false);
        if (wrongActor.ok) {
            throw new Error('Expected wrong-actor royal selection to be rejected.');
        }
        expect(wrongActor.rejection.code).toBe('INVALID_ACTOR');
        expect(wrongActor.rejection.reason).toBe(
            'Command actor p2 does not match active player p1.'
        );
        expect(wrongActor.actionType).toBe('SELECT_ROYAL_CARD');
        expect(wrongActor.state).toEqual(selectRoyalState);

        const wrongPhase = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'SELECT_ROYAL_CARD',
                payload: { royalId: validRoyalId },
            },
        });

        expect(wrongPhase.ok).toBe(false);
        if (wrongPhase.ok) {
            throw new Error('Expected wrong-phase royal selection to be rejected.');
        }
        expect(wrongPhase.rejection.code).toBe('COMMAND_REJECTED');
        expect(wrongPhase.rejection.reason).toBe(
            'SELECT_ROYAL_CARD is only allowed during the SELECT_ROYAL phase.'
        );
        expect(wrongPhase.actionType).toBe('SELECT_ROYAL_CARD');
        expect(wrongPhase.state).toEqual(start.state);
        expect(wrongPhase.stateHash).toBe(start.stateHash);
    });

    it('activates and cancels privilege through the bridge', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-privilege-cancel-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const preparedState = cloneJson(start.state);
        preparedState.privileges.p1 = 1;

        const activated = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'ACTIVATE_PRIVILEGE',
            },
        });

        expect(activated.ok).toBe(true);
        if (!activated.ok) {
            throw new Error(activated.rejection.reason);
        }

        expect(activated.actionType).toBe('ACTIVATE_PRIVILEGE');
        expect(activated.state.phase).toBe('PRIVILEGE_ACTION');
        expect(activated.state.privileges.p1).toBe(1);

        const cancelled = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: activated.state,
            actor: 'p1',
            command: {
                type: 'CANCEL_PRIVILEGE',
            },
        });

        expect(cancelled.ok).toBe(true);
        if (!cancelled.ok) {
            throw new Error(cancelled.rejection.reason);
        }

        expect(cancelled.actionType).toBe('CANCEL_PRIVILEGE');
        expect(cancelled.state.phase).toBe('IDLE');
        expect(cancelled.state.turn).toBe('p1');
        expect(cancelled.state.privileges.p1).toBe(1);
        expect(cancelled.stateHash).toMatch(/^[a-f0-9]+$/);
        expect(cancelled.stateHash).not.toBe(activated.stateHash);
    });

    it('rejects privilege activation without charge or valid board targets', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-privilege-activation-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const noCharge = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'ACTIVATE_PRIVILEGE',
            },
        });

        expect(noCharge.ok).toBe(false);
        if (noCharge.ok) {
            throw new Error('Expected privilege activation without charge to be rejected.');
        }
        expect(noCharge.rejection.code).toBe('COMMAND_REJECTED');
        expect(noCharge.rejection.reason).toBe('The active player has no privilege to spend.');
        expect(noCharge.actionType).toBe('ACTIVATE_PRIVILEGE');
        expect(noCharge.state).toEqual(start.state);
        expect(noCharge.stateHash).toBe(start.stateHash);

        const emptyBoardState = cloneJson(start.state);
        emptyBoardState.privileges.p1 = 1;
        emptyBoardState.board = emptyBoardState.board.map((row) => row.map(() => 'empty'));

        const noTargets = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: emptyBoardState,
            actor: 'p1',
            command: {
                type: 'ACTIVATE_PRIVILEGE',
            },
        });

        expect(noTargets.ok).toBe(false);
        if (noTargets.ok) {
            throw new Error('Expected privilege activation without board targets to be rejected.');
        }
        expect(noTargets.rejection.code).toBe('COMMAND_REJECTED');
        expect(noTargets.rejection.reason).toBe(
            'There are no valid gems available for a privilege action.'
        );
        expect(noTargets.actionType).toBe('ACTIVATE_PRIVILEGE');
        expect(noTargets.state).toEqual(emptyBoardState);
        expect(noTargets.stateHash).not.toBe(start.stateHash);
    });

    it('rejects privilege use without charge or a valid board target', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-privilege-use-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const preparedState = cloneJson(start.state);
        preparedState.privileges.p1 = 1;

        const activated = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'ACTIVATE_PRIVILEGE',
            },
        });

        expect(activated.ok).toBe(true);
        if (!activated.ok) {
            throw new Error(activated.rejection.reason);
        }

        const validTarget = findFirstCollectibleBoardGem(activated.state);
        const noChargeState = cloneJson(activated.state);
        noChargeState.privileges.p1 = 0;
        noChargeState.extraPrivileges.p1 = 0;

        const noCharge = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: noChargeState,
            actor: 'p1',
            command: {
                type: 'USE_PRIVILEGE',
                payload: validTarget,
            },
        });

        expect(noCharge.ok).toBe(false);
        if (noCharge.ok) {
            throw new Error('Expected privilege use without a charge to be rejected.');
        }
        expect(noCharge.rejection.code).toBe('COMMAND_REJECTED');
        expect(noCharge.rejection.reason).toBe(
            'The active player has no privilege charge available.'
        );
        expect(noCharge.actionType).toBe('USE_PRIVILEGE');
        expect(noCharge.state).toEqual(noChargeState);

        const invalidTargetState = cloneJson(activated.state);
        invalidTargetState.board[0][0] = 'empty';

        const invalidTarget = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: invalidTargetState,
            actor: 'p1',
            command: {
                type: 'USE_PRIVILEGE',
                payload: { r: 0, c: 0 },
            },
        });

        expect(invalidTarget.ok).toBe(false);
        if (invalidTarget.ok) {
            throw new Error('Expected privilege use with an invalid target to be rejected.');
        }
        expect(invalidTarget.rejection.code).toBe('COMMAND_REJECTED');
        expect(invalidTarget.rejection.reason).toBe('Selected privilege gem is not available.');
        expect(invalidTarget.actionType).toBe('USE_PRIVILEGE');
        expect(invalidTarget.state).toEqual(invalidTargetState);
    });

    it('rejects privilege cancel outside the privilege phase', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-privilege-cancel-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const rejected = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'CANCEL_PRIVILEGE',
            },
        });

        expect(rejected.ok).toBe(false);
        if (rejected.ok) {
            throw new Error('Expected wrong-phase privilege cancel to be rejected.');
        }

        expect(rejected.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejected.actionType).toBe('CANCEL_PRIVILEGE');
        expect(rejected.state).toEqual(start.state);
        expect(rejected.stateHash).toBe(start.stateHash);
    });

    it('initiates and cancels a pending reserve through the bridge', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-reserve-cancel-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const initiated = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'INITIATE_RESERVE',
                payload: { level: 1, idx: 0 },
            },
        });

        expect(initiated.ok).toBe(true);
        if (!initiated.ok) {
            throw new Error(initiated.rejection.reason);
        }

        expect(initiated.actionType).toBe('INITIATE_RESERVE');
        expect(initiated.state.phase).toBe('RESERVE_WAITING_GEM');
        expect(initiated.state.pendingReserve?.level).toBe(1);

        const cancelled = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: initiated.state,
            actor: 'p1',
            command: {
                type: 'CANCEL_RESERVE',
            },
        });

        expect(cancelled.ok).toBe(true);
        if (!cancelled.ok) {
            throw new Error(cancelled.rejection.reason);
        }

        expect(cancelled.actionType).toBe('CANCEL_RESERVE');
        expect(cancelled.state.phase).toBe('IDLE');
        expect(cancelled.state.pendingReserve).toBeNull();
        expect(cancelled.state.turn).toBe('p1');
        expect(cancelled.stateHash).toMatch(/^[a-f0-9]+$/);
        expect(cancelled.stateHash).not.toBe(initiated.stateHash);
    });

    it('rejects reserve cancel outside the reserve-waiting phase', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-reserve-cancel-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const rejected = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'CANCEL_RESERVE',
            },
        });

        expect(rejected.ok).toBe(false);
        if (rejected.ok) {
            throw new Error('Expected wrong-phase reserve cancel to be rejected.');
        }

        expect(rejected.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejected.actionType).toBe('CANCEL_RESERVE');
        expect(rejected.state).toEqual(start.state);
        expect(rejected.stateHash).toBe(start.stateHash);
    });

    it('rejects market-card reserve with invalid gold, pending mismatch, or full reserve row', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-reserve-card-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const initiated = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'INITIATE_RESERVE',
                payload: { level: 1, idx: 0 },
            },
        });

        expect(initiated.ok).toBe(true);
        if (!initiated.ok) {
            throw new Error(initiated.rejection.reason);
        }
        expect(initiated.actionType).toBe('INITIATE_RESERVE');
        expect(initiated.state.phase).toBe('RESERVE_WAITING_GEM');
        expect(initiated.state.pendingReserve?.idx).toBe(0);

        const missingGold = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: initiated.state,
            actor: 'p1',
            command: {
                type: 'RESERVE_CARD',
                payload: { level: 1, idx: 0 },
            },
        });

        expect(missingGold.ok).toBe(false);
        if (missingGold.ok) {
            throw new Error('Expected reserve-card completion without gold to reject.');
        }
        expect(missingGold.rejection.code).toBe('COMMAND_REJECTED');
        expect(missingGold.rejection.reason).toBe('A gold coordinate is required for this action.');
        expect(missingGold.actionType).toBe('RESERVE_CARD');
        expect(missingGold.state).toEqual(initiated.state);
        expect(missingGold.stateHash).toBe(initiated.stateHash);

        const nonGold = findFirstCollectibleBoardGem(initiated.state);
        const invalidGold = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: initiated.state,
            actor: 'p1',
            command: {
                type: 'RESERVE_CARD',
                payload: { level: 1, idx: 0, goldCoords: nonGold },
            },
        });

        expect(invalidGold.ok).toBe(false);
        if (invalidGold.ok) {
            throw new Error('Expected reserve-card completion with a non-gold coord to reject.');
        }
        expect(invalidGold.rejection.code).toBe('COMMAND_REJECTED');
        expect(invalidGold.rejection.reason).toBe(
            'Selected coordinate does not contain a gold gem.'
        );
        expect(invalidGold.actionType).toBe('RESERVE_CARD');
        expect(invalidGold.state).toEqual(initiated.state);
        expect(invalidGold.stateHash).toBe(initiated.stateHash);

        const pendingMismatchState = cloneJson(initiated.state);
        pendingMismatchState.market[1][0] = pendingMismatchState.market[1][1];
        const goldCoords = findFirstBoardGem(pendingMismatchState, 'gold');
        const pendingMismatch = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: pendingMismatchState,
            actor: 'p1',
            command: {
                type: 'RESERVE_CARD',
                payload: { level: 1, idx: 0, goldCoords },
            },
        });

        expect(pendingMismatch.ok).toBe(false);
        if (pendingMismatch.ok) {
            throw new Error(
                'Expected reserve-card completion against a mismatched pending reserve.'
            );
        }
        expect(pendingMismatch.rejection.code).toBe('COMMAND_REJECTED');
        expect(pendingMismatch.rejection.reason).toBe(
            'Reserve resolution does not match the pending reserve action.'
        );
        expect(pendingMismatch.actionType).toBe('RESERVE_CARD');
        expect(pendingMismatch.state).toEqual(pendingMismatchState);

        const fullReserveState = cloneJson(initiated.state);
        fullReserveState.playerReserved.p1 = fullReserveState.market[1].slice(0, 3);
        const fullReserve = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: fullReserveState,
            actor: 'p1',
            command: {
                type: 'RESERVE_CARD',
                payload: { level: 1, idx: 0, goldCoords },
            },
        });

        expect(fullReserve.ok).toBe(false);
        if (fullReserve.ok) {
            throw new Error('Expected reserve-card completion with a full reserve row to reject.');
        }
        expect(fullReserve.rejection.code).toBe('COMMAND_REJECTED');
        expect(fullReserve.rejection.reason).toBe('The reserve limit has already been reached.');
        expect(fullReserve.actionType).toBe('RESERVE_CARD');
        expect(fullReserve.state).toEqual(fullReserveState);
    });

    it('reserves a market deck card through pending gold selection', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-reserve-deck-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const startingDeckSize = start.state.decks[1].length;
        const startingReservedSize = start.state.playerReserved.p1.length;
        const topDeckCard = start.state.decks[1][startingDeckSize - 1];
        const goldCoords = findFirstBoardGem(start.state, 'gold');
        expect(topDeckCard).toBeDefined();

        const initiated = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'INITIATE_RESERVE_DECK',
                payload: { level: 1 },
            },
        });

        expect(initiated.ok).toBe(true);
        if (!initiated.ok) {
            throw new Error(initiated.rejection.reason);
        }

        expect(initiated.actionType).toBe('INITIATE_RESERVE_DECK');
        expect(initiated.state.phase).toBe('RESERVE_WAITING_GEM');
        expect(initiated.state.pendingReserve?.isDeck).toBe(true);
        expect(initiated.state.pendingReserve?.level).toBe(1);

        const reserved = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: initiated.state,
            actor: 'p1',
            command: {
                type: 'RESERVE_DECK',
                payload: { level: 1, goldCoords },
            },
        });

        expect(reserved.ok).toBe(true);
        if (!reserved.ok) {
            throw new Error(reserved.rejection.reason);
        }

        expect(reserved.actionType).toBe('RESERVE_DECK');
        expect(reserved.state.phase).toBe('IDLE');
        expect(reserved.state.pendingReserve).toBeNull();
        expect(reserved.state.turn).toBe('p2');
        expect(reserved.state.decks[1]).toHaveLength(startingDeckSize - 1);
        expect(reserved.state.playerReserved.p1).toHaveLength(startingReservedSize + 1);
        expect(reserved.state.playerReserved.p1).toContainEqual(topDeckCard);
        expect(reserved.state.board[goldCoords.r][goldCoords.c]).toBe('empty');
        expect(reserved.stateHash).toMatch(/^[a-f0-9]+$/);
        expect(reserved.stateHash).not.toBe(initiated.stateHash);
    });

    it('rejects deck reserve with an empty deck, full reserve row, or missing gold', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-reserve-deck-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const emptyDeckState = cloneJson(start.state);
        emptyDeckState.decks[1] = [];

        const emptyInitiate = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: emptyDeckState,
            actor: 'p1',
            command: {
                type: 'INITIATE_RESERVE_DECK',
                payload: { level: 1 },
            },
        });

        expect(emptyInitiate.ok).toBe(false);
        if (emptyInitiate.ok) {
            throw new Error('Expected deck-reserve initiation against an empty deck to reject.');
        }
        expect(emptyInitiate.rejection.code).toBe('COMMAND_REJECTED');
        expect(emptyInitiate.rejection.reason).toBe('Selected deck is empty.');
        expect(emptyInitiate.actionType).toBe('INITIATE_RESERVE_DECK');
        expect(emptyInitiate.state).toEqual(emptyDeckState);

        const initiated = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'INITIATE_RESERVE_DECK',
                payload: { level: 1 },
            },
        });

        expect(initiated.ok).toBe(true);
        if (!initiated.ok) {
            throw new Error(initiated.rejection.reason);
        }

        const missingGold = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: initiated.state,
            actor: 'p1',
            command: {
                type: 'RESERVE_DECK',
                payload: { level: 1 },
            },
        });

        expect(missingGold.ok).toBe(false);
        if (missingGold.ok) {
            throw new Error('Expected deck-reserve completion without gold to reject.');
        }
        expect(missingGold.rejection.code).toBe('COMMAND_REJECTED');
        expect(missingGold.rejection.reason).toBe('A gold coordinate is required for this action.');
        expect(missingGold.actionType).toBe('RESERVE_DECK');
        expect(missingGold.state).toEqual(initiated.state);
        expect(missingGold.stateHash).toBe(initiated.stateHash);

        const emptyCompletionState = cloneJson(initiated.state);
        emptyCompletionState.decks[1] = [];
        const goldCoords = findFirstBoardGem(emptyCompletionState, 'gold');
        const emptyCompletion = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: emptyCompletionState,
            actor: 'p1',
            command: {
                type: 'RESERVE_DECK',
                payload: { level: 1, goldCoords },
            },
        });

        expect(emptyCompletion.ok).toBe(false);
        if (emptyCompletion.ok) {
            throw new Error('Expected deck-reserve completion against an empty deck to reject.');
        }
        expect(emptyCompletion.rejection.code).toBe('COMMAND_REJECTED');
        expect(emptyCompletion.rejection.reason).toBe('Selected deck is empty.');
        expect(emptyCompletion.actionType).toBe('RESERVE_DECK');
        expect(emptyCompletion.state).toEqual(emptyCompletionState);

        const fullReserveState = cloneJson(initiated.state);
        fullReserveState.playerReserved.p1 = start.state.decks[1].slice(-3);
        const fullReserve = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: fullReserveState,
            actor: 'p1',
            command: {
                type: 'RESERVE_DECK',
                payload: { level: 1, goldCoords },
            },
        });

        expect(fullReserve.ok).toBe(false);
        if (fullReserve.ok) {
            throw new Error('Expected deck reserve with a full reserve row to reject.');
        }
        expect(fullReserve.rejection.code).toBe('COMMAND_REJECTED');
        expect(fullReserve.rejection.reason).toBe('The reserve limit has already been reached.');
        expect(fullReserve.actionType).toBe('RESERVE_DECK');
        expect(fullReserve.state).toEqual(fullReserveState);
    });

    it('requires Joker buys to enter explicit bonus-color selection before purchase', () => {
        const joker = startGameWithVisibleJoker();
        const preparedState = cloneJson(joker.start.state);
        preparedState.inventories.p1 = {
            red: 20,
            green: 20,
            blue: 20,
            white: 20,
            black: 20,
            pearl: 20,
            gold: 20,
        };

        const rejectedDirectBuy = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: joker.start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'BUY_CARD',
                payload: {
                    level: joker.level,
                    idx: joker.idx,
                    bonusColor: 'blue',
                },
            },
        });

        expect(rejectedDirectBuy.ok).toBe(false);
        if (rejectedDirectBuy.ok) {
            throw new Error('Expected direct Joker buy to be rejected before color selection.');
        }
        expect(rejectedDirectBuy.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejectedDirectBuy.rejection.reason).toBe(
            'Joker cards must be routed through the bonus-color selection flow.'
        );

        const initiated = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: joker.start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'INITIATE_BUY_JOKER',
                payload: {
                    level: joker.level,
                    idx: joker.idx,
                },
            },
        });

        expect(initiated.ok).toBe(true);
        if (!initiated.ok) {
            throw new Error(initiated.rejection.reason);
        }
        expect(initiated.actionType).toBe('INITIATE_BUY_JOKER');
        expect(initiated.state.phase).toBe('SELECT_CARD_COLOR');
        expect(initiated.state.pendingBuy?.instanceId).toBe(joker.instanceId);

        const noPendingState = cloneJson(initiated.state);
        noPendingState.pendingBuy = null;
        const rejectedMissingPending = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: joker.start.init,
            state: noPendingState,
            actor: 'p1',
            command: {
                type: 'BUY_CARD',
                payload: {
                    level: joker.level,
                    idx: joker.idx,
                    bonusColor: 'blue',
                },
            },
        });

        expect(rejectedMissingPending.ok).toBe(false);
        if (rejectedMissingPending.ok) {
            throw new Error('Expected missing pending Joker color selection to reject.');
        }
        expect(rejectedMissingPending.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejectedMissingPending.rejection.reason).toBe(
            'No pending card is waiting for a bonus-color selection.'
        );
        expect(rejectedMissingPending.actionType).toBe('BUY_CARD');
        expect(rejectedMissingPending.state).toEqual(noPendingState);

        const nonJoker = findFirstNonJokerMarketRef(initiated.state);
        const rejectedPendingMismatch = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: joker.start.init,
            state: initiated.state,
            actor: 'p1',
            command: {
                type: 'BUY_CARD',
                payload: {
                    level: nonJoker.level,
                    idx: nonJoker.idx,
                    bonusColor: 'red',
                },
            },
        });

        expect(rejectedPendingMismatch.ok).toBe(false);
        if (rejectedPendingMismatch.ok) {
            throw new Error('Expected mismatched pending Joker color selection to reject.');
        }
        expect(rejectedPendingMismatch.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejectedPendingMismatch.rejection.reason).toBe(
            'Selected card does not match the pending bonus-color choice.'
        );
        expect(rejectedPendingMismatch.actionType).toBe('BUY_CARD');
        expect(rejectedPendingMismatch.state).toEqual(initiated.state);
        expect(rejectedPendingMismatch.stateHash).toBe(initiated.stateHash);

        const bought = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: joker.start.init,
            state: initiated.state,
            actor: 'p1',
            command: {
                type: 'BUY_CARD',
                payload: {
                    level: joker.level,
                    idx: joker.idx,
                    bonusColor: 'blue',
                },
            },
        });

        expect(bought.ok).toBe(true);
        if (!bought.ok) {
            throw new Error(bought.rejection.reason);
        }
        expect(bought.actionType).toBe('BUY_CARD');
        expect(bought.state.pendingBuy).toBeNull();
        expect(bought.state.playerTableau.p1).toContainEqual(
            expect.objectContaining({
                kind: 'instance',
                instanceId: joker.instanceId,
                bonusColor: 'blue',
            })
        );
        expect(bought.stateHash).not.toBe(initiated.stateHash);
    });

    it('applies a reserved-card buy command against the active player hand', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-reserved-buy-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const reservedInstanceId = start.state.market[1].find((instanceId): instanceId is string =>
            Boolean(instanceId)
        );
        expect(reservedInstanceId).toBeTruthy();
        if (!reservedInstanceId) {
            throw new Error('Expected a market card to reuse as a reserved-card fixture.');
        }

        const preparedState = cloneJson(start.state);
        preparedState.playerReserved.p1 = [reservedInstanceId];
        preparedState.inventories.p1 = {
            red: 20,
            green: 20,
            blue: 20,
            white: 20,
            black: 20,
            pearl: 20,
            gold: 20,
        };

        const bought = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'BUY_RESERVED_CARD',
                payload: {
                    instanceId: reservedInstanceId,
                    bonusColor: 'red',
                },
            },
        });

        expect(bought.ok).toBe(true);
        if (!bought.ok) {
            throw new Error(bought.rejection.reason);
        }

        expect(bought.actionType).toBe('BUY_CARD');
        expect(bought.state.turn).toBe('p1');
        expect(bought.state.playerReserved.p1).toEqual([]);
        expect(bought.state.playerTableau.p1).toContainEqual({
            kind: 'instance',
            instanceId: reservedInstanceId,
        });
        expect(bought.stateHash).toMatch(/^[a-f0-9]{8}$/);
        expect(bought.stateHash).not.toBe(start.stateHash);
    });

    it('applies discard-reserved only when the active buff allows it', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-discard-reserved-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const reservedInstanceId = start.state.market[1].find((instanceId): instanceId is string =>
            Boolean(instanceId)
        );
        expect(reservedInstanceId).toBeTruthy();
        if (!reservedInstanceId) {
            throw new Error('Expected a market card to reuse as a discard-reserved fixture.');
        }

        const preparedState = cloneJson(start.state);
        preparedState.playerReserved.p1 = [reservedInstanceId];

        const rejected = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'DISCARD_RESERVED',
                payload: { cardId: reservedInstanceId },
            },
        });

        expect(rejected.ok).toBe(false);
        if (rejected.ok) {
            throw new Error('Expected discard-reserved without an active buff to be rejected.');
        }
        expect(rejected.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejected.rejection.reason).toBe('The active player cannot discard reserved cards.');

        preparedState.playerBuffs.p1 = {
            buff: {
                id: 'puppet_master',
                level: 3,
            },
        };

        const discarded = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'DISCARD_RESERVED',
                payload: { cardId: reservedInstanceId },
            },
        });

        expect(discarded.ok).toBe(true);
        if (!discarded.ok) {
            throw new Error(discarded.rejection.reason);
        }

        expect(discarded.actionType).toBe('DISCARD_RESERVED');
        expect(discarded.state.playerReserved.p1).toEqual([]);
        expect(discarded.stateHash).toMatch(/^[a-f0-9]{8}$/);
        expect(discarded.stateHash).not.toBe(rejected.stateHash);
    });

    it('rejects discard-reserved when the card is not owned or the phase is wrong', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-discard-reserved-edges-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const p1ReservedInstanceId = start.state.market[1].find(
            (instanceId): instanceId is string => Boolean(instanceId)
        );
        const p2ReservedInstanceId = start.state.market[2].find(
            (instanceId): instanceId is string => Boolean(instanceId)
        );
        expect(p1ReservedInstanceId).toBeTruthy();
        expect(p2ReservedInstanceId).toBeTruthy();
        if (!p1ReservedInstanceId || !p2ReservedInstanceId) {
            throw new Error('Expected reusable market cards for discard-reserved edge fixtures.');
        }

        const preparedState = cloneJson(start.state);
        preparedState.playerReserved.p1 = [p1ReservedInstanceId];
        preparedState.playerReserved.p2 = [p2ReservedInstanceId];
        preparedState.playerBuffs.p1 = {
            buff: {
                id: 'puppet_master',
                level: 3,
            },
        };

        const notOwned = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'DISCARD_RESERVED',
                payload: { cardId: p2ReservedInstanceId },
            },
        });

        expect(notOwned.ok).toBe(false);
        if (notOwned.ok) {
            throw new Error('Expected not-owned reserved-card discard to be rejected.');
        }
        expect(notOwned.rejection.code).toBe('COMMAND_REJECTED');
        expect(notOwned.rejection.reason).toBe('Selected reserved card does not exist.');
        expect(notOwned.actionType).toBe('DISCARD_RESERVED');
        expect(notOwned.state).toEqual(preparedState);

        const wrongPhaseState = cloneJson(preparedState);
        wrongPhaseState.phase = 'DRAFT_PHASE';
        const wrongPhase = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: wrongPhaseState,
            actor: 'p1',
            command: {
                type: 'DISCARD_RESERVED',
                payload: { cardId: p1ReservedInstanceId },
            },
        });

        expect(wrongPhase.ok).toBe(false);
        if (wrongPhase.ok) {
            throw new Error('Expected wrong-phase reserved-card discard to be rejected.');
        }
        expect(wrongPhase.rejection.code).toBe('COMMAND_REJECTED');
        expect(wrongPhase.rejection.reason).toBe(
            'DISCARD_RESERVED is only allowed during the IDLE phase.'
        );
        expect(wrongPhase.actionType).toBe('DISCARD_RESERVED');
        expect(wrongPhase.state).toEqual(wrongPhaseState);
    });

    it('rejects an unaffordable reserved-card buy without changing replay state', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-reserved-buy-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const reservedInstanceId = start.state.market[3].find((instanceId): instanceId is string =>
            Boolean(instanceId)
        );
        expect(reservedInstanceId).toBeTruthy();
        if (!reservedInstanceId) {
            throw new Error('Expected a level-three card for the reserved-card rejection fixture.');
        }

        const preparedState = cloneJson(start.state);
        preparedState.playerReserved.p1 = [reservedInstanceId];
        preparedState.inventories.p1 = {
            red: 0,
            green: 0,
            blue: 0,
            white: 0,
            black: 0,
            pearl: 0,
            gold: 0,
        };

        const rejected = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'BUY_RESERVED_CARD',
                payload: {
                    instanceId: reservedInstanceId,
                    bonusColor: 'red',
                },
            },
        });

        expect(rejected.ok).toBe(false);
        if (rejected.ok) {
            throw new Error('Expected unaffordable reserved-card buy to be rejected.');
        }

        expect(rejected.rejection.code).toBe('NO_REPLAY_STATE_CHANGE');
        expect(rejected.rejection.reason).toBe('Action BUY_CARD did not change replay state.');
        expect(rejected.actionType).toBe('BUY_CARD');
        expect(rejected.state).toEqual(preparedState);
    });

    it('opens and closes a deck-peek modal through replay state snapshots', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-peek-modal-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const preparedState = cloneJson(start.state);
        preparedState.playerBuffs.p1 = {
            buff: {
                id: 'intelligence',
                level: 1,
                effects: { active: 'peek_deck' },
            },
        };

        const peeked = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: preparedState,
            actor: 'p1',
            command: {
                type: 'PEEK_DECK',
                payload: { levels: [3, 2, 1] },
            },
        });

        expect(peeked.ok).toBe(true);
        if (!peeked.ok) {
            throw new Error(peeked.rejection.reason);
        }

        expect(peeked.actionType).toBe('PEEK_DECK');
        expect(peeked.state.activeModal?.type).toBe('PEEK');
        expect(peeked.state.activeModal?.data.initiator).toBe('p1');
        expect(peeked.state.activeModal?.data.cards.length).toBeGreaterThan(0);
        expect(peeked.stateHash).not.toBe(start.stateHash);

        const closed = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: peeked.state,
            actor: 'p1',
            command: {
                type: 'CLOSE_MODAL',
            },
        });

        expect(closed.ok).toBe(true);
        if (!closed.ok) {
            throw new Error(closed.rejection.reason);
        }

        expect(closed.actionType).toBe('CLOSE_MODAL');
        expect(closed.state.activeModal).toBeUndefined();
        expect(closed.stateHash).not.toBe(peeked.stateHash);
    });

    it('rejects invalid deck-peek and modal-close commands without mutating replay state', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-peek-modal-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const rejectedPeek = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'PEEK_DECK',
                payload: { levels: [3, 2, 1] },
            },
        });

        expect(rejectedPeek.ok).toBe(false);
        if (rejectedPeek.ok) {
            throw new Error('Expected no-ability deck peek to be rejected.');
        }
        expect(rejectedPeek.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejectedPeek.rejection.reason).toBe(
            'The active player does not have a deck-peek ability.'
        );
        expect(rejectedPeek.actionType).toBe('PEEK_DECK');
        expect(rejectedPeek.state).toEqual(start.state);
        expect(rejectedPeek.stateHash).toBe(start.stateHash);

        const rejectedClose = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p1',
            command: {
                type: 'CLOSE_MODAL',
            },
        });

        expect(rejectedClose.ok).toBe(false);
        if (rejectedClose.ok) {
            throw new Error('Expected no-modal close to be rejected.');
        }
        expect(rejectedClose.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejectedClose.rejection.reason).toBe('There is no active modal to close.');
        expect(rejectedClose.actionType).toBe('CLOSE_MODAL');
        expect(rejectedClose.state).toEqual(start.state);
        expect(rejectedClose.stateHash).toBe(start.stateHash);
    });

    it('rejects blocked peek-modal close commands without mutating replay state', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-peek-modal-owner-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const peekCard = start.state.decks[1].at(-1);
        if (!peekCard) {
            throw new Error('Expected a level-1 deck card for blocked modal fixture.');
        }

        const blockedModalState = cloneJson(start.state);
        blockedModalState.activeModal = {
            type: 'PEEK',
            data: {
                cards: [peekCard],
                initiator: 'p2',
            },
        };

        const rejected = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: blockedModalState,
            actor: 'p1',
            command: {
                type: 'CLOSE_MODAL',
            },
        });

        expect(rejected.ok).toBe(false);
        if (rejected.ok) {
            throw new Error('Expected blocked peek-modal close to be rejected.');
        }
        expect(rejected.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejected.rejection.reason).toBe('The active player cannot close this modal.');
        expect(rejected.actionType).toBe('CLOSE_MODAL');
        expect(rejected.state).toEqual(blockedModalState);
        expect(rejected.stateHash).not.toBe(start.stateHash);
    });

    it('rejects wrong-phase deck-peek commands without mutating replay state', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-peek-wrong-phase-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const wrongPhaseState = cloneJson(start.state);
        wrongPhaseState.phase = 'DRAFT_PHASE';
        wrongPhaseState.playerBuffs.p1 = {
            buff: {
                id: 'intelligence',
                level: 1,
                effects: { active: 'peek_deck' },
            },
        };

        const rejected = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: wrongPhaseState,
            actor: 'p1',
            command: {
                type: 'PEEK_DECK',
                payload: { levels: [3, 2, 1] },
            },
        });

        expect(rejected.ok).toBe(false);
        if (rejected.ok) {
            throw new Error('Expected wrong-phase deck peek to be rejected.');
        }
        expect(rejected.rejection.code).toBe('COMMAND_REJECTED');
        expect(rejected.rejection.reason).toBe('PEEK_DECK is only allowed during the IDLE phase.');
        expect(rejected.actionType).toBe('PEEK_DECK');
        expect(rejected.state).toEqual(wrongPhaseState);
        expect(rejected.stateHash).not.toBe(start.stateHash);
    });

    it('rejects a command from the inactive player without mutating the supplied state hash', () => {
        const start = handleUnityRulesEngineBridgeRequest({
            kind: 'start',
            mode: 'LOCAL_PVP',
            seed: 'unity-bridge-rejection-test',
        });

        expect(start.ok).toBe(true);
        if (!start.ok) {
            throw new Error(start.rejection.reason);
        }

        const rejected = handleUnityRulesEngineBridgeRequest({
            kind: 'apply',
            init: start.init,
            state: start.state,
            actor: 'p2',
            command: {
                type: 'TAKE_GEMS',
                payload: { coords: [{ r: 0, c: 0 }] },
            },
        });

        expect(rejected.ok).toBe(false);
        if (rejected.ok) {
            throw new Error('Expected inactive player command to be rejected.');
        }

        expect(rejected.rejection.code).toBe('INVALID_ACTOR');
        expect(rejected.actionType).toBe('TAKE_GEMS');
        expect(rejected.state).toEqual(start.state);
        expect(rejected.stateHash).toBe(start.stateHash);
    });

    it('applies every golden replay event as bridge commands without replacing checkpoint state', () => {
        const fixtureFiles = [
            'local-pvp-opening.replay.json',
            'buff-draft-opening.replay.json',
            'local-pvp-royal-extra-turn-game-over.replay.json',
            'local-pvp-joker-color-selection.replay.json',
            'local-pvp-joker-reserved-buy.replay.json',
            'local-pvp-reserve-cancel.replay.json',
            'local-pvp-reserve-deck.replay.json',
            'local-pvp-privilege.replay.json',
            'local-pvp-peek-modal.replay.json',
            'local-pvp-discard-reserved.replay.json',
            'local-pvp-draft-reroll.replay.json',
        ];

        for (const fileName of fixtureFiles) {
            const replay = loadGoldenReplay(fileName);
            const runtimeToInstance = buildIdentityRuntimeToInstanceMap(replay.init.cardInstances);
            let bridgeState = serializeReplayStateSnapshot(
                loadReplayStateAtRevision(replay, 0),
                runtimeToInstance
            );

            replay.events.forEach((event, index) => {
                const response = handleUnityRulesEngineBridgeRequest({
                    kind: 'apply',
                    init: replay.init,
                    state: bridgeState,
                    actor: event.actor,
                    command: replayEventToBridgeCommand(event),
                });

                if (!response.ok) {
                    throw new Error(
                        `${fileName} event ${index + 1} ${event.type}: ${response.rejection.reason}`
                    );
                }
                expect(response.ok, `${fileName} event ${index + 1} ${event.type}`).toBe(true);

                const expectedState = loadReplayStateAtRevision(replay, index + 1);
                const expectedHash = generateReplayStateHash(expectedState, runtimeToInstance);
                expect(response.stateHash, `${fileName} event ${index + 1} ${event.type}`).toBe(
                    expectedHash
                );
                bridgeState = response.state;
            });

            expect(bridgeState.winner).toBe(replay.summary.winner);
        }
    });

    it('drives a freshly simulated local PvP match to game over through bridge commands', () => {
        const randomSpy = vi.spyOn(Math, 'random').mockImplementation(createDeterministicRandom());
        try {
            const maxActions = 300;
            let replay: ReplayVNext | null = null;
            let createdAt = '';

            for (let seedIndex = 0; seedIndex < 20; seedIndex += 1) {
                const candidateCreatedAt = `2026-05-11T15:${String(seedIndex).padStart(2, '0')}:00.000Z`;
                const result = simulateAiVsAiReplay({
                    gameVersion: '5.2.11',
                    mode: 'LOCAL_PVP',
                    useBuffs: false,
                    createdAt: candidateCreatedAt,
                    maxActions,
                });

                if (
                    result.status === 'completed' &&
                    result.abortReason === null &&
                    result.replay.summary.winner &&
                    result.actionsExecuted < maxActions
                ) {
                    replay = result.replay;
                    createdAt = candidateCreatedAt;
                    break;
                }
            }

            expect(replay, 'Expected a deterministic fresh simulation to end before max actions.')
                .not.toBeNull();
            if (!replay) {
                throw new Error('Fresh simulation did not produce a game-over replay.');
            }

            const start = handleUnityRulesEngineBridgeRequest({
                kind: 'start',
                mode: 'LOCAL_PVP',
                seed: createdAt,
            });
            expect(start.ok).toBe(true);
            if (!start.ok) {
                throw new Error(start.rejection.reason);
            }

            const runtimeToInstance = buildIdentityRuntimeToInstanceMap(replay.init.cardInstances);
            const initialHash = generateReplayStateHash(
                loadReplayStateAtRevision(replay, 0),
                runtimeToInstance
            );
            expect(start.stateHash).toBe(initialHash);

            let bridgeState = start.state;
            replay.events.forEach((event, index) => {
                const response = handleUnityRulesEngineBridgeRequest({
                    kind: 'apply',
                    init: start.init,
                    state: bridgeState,
                    actor: event.actor,
                    command: replayEventToBridgeCommand(event),
                });

                if (!response.ok) {
                    throw new Error(
                        `fresh simulation event ${index + 1} ${event.type}: ${response.rejection.reason}`
                    );
                }
                expect(response.ok, `fresh simulation event ${index + 1} ${event.type}`).toBe(
                    true
                );

                const expectedState = loadReplayStateAtRevision(replay, index + 1);
                const expectedHash = generateReplayStateHash(expectedState, runtimeToInstance);
                expect(
                    response.stateHash,
                    `fresh simulation event ${index + 1} ${event.type}`
                ).toBe(expectedHash);
                bridgeState = response.state;
            });

            expect(bridgeState.winner).toBe(replay.summary.winner);
            expect(bridgeState.winner).toMatch(/^p[12]$/);
            expect(replay.events.length).toBeGreaterThan(0);
        } finally {
            randomSpy.mockRestore();
        }
    });
});
