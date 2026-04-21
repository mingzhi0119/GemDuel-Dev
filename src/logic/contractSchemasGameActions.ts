import { z } from 'zod';
import {
    bonusGemPayloadSchema,
    buyCardPayloadSchema,
    debugRerollBuffsPayloadSchema,
    discardReservedPayloadSchema,
    gameStateBoundarySchema,
    gameSetupPayloadSchema,
    initDraftPayloadSchema,
    initiateBuyJokerPayloadSchema,
    initiateReserveDeckPayloadSchema,
    initiateReservePayloadSchema,
    peekDeckPayloadSchema,
    replenishPayloadSchema,
    reserveCardPayloadSchema,
    reserveDeckPayloadSchema,
    selectBuffPayloadSchema,
    selectRoyalPayloadSchema,
    stealGemPayloadSchema,
    takeGemsPayloadSchema,
    usePrivilegePayloadSchema,
} from './contractSchemasGameState';
import { gemColorSchema, playerKeySchema } from './contractSchemasCore';

const noPayloadActionSchema = <Type extends string>(type: Type) =>
    z
        .object({
            type: z.literal(type),
        })
        .passthrough();

const noPayloadCommandSchema = <Kind extends string>(kind: Kind) =>
    z
        .object({
            kind: z.literal(kind),
        })
        .passthrough();

export const bootstrapActionSchema = z.discriminatedUnion('type', [
    z.object({ type: z.literal('INIT'), payload: gameSetupPayloadSchema }).passthrough(),
    z.object({ type: z.literal('INIT_DRAFT'), payload: initDraftPayloadSchema }).passthrough(),
]);

export const gameActionSchema = z.discriminatedUnion('type', [
    bootstrapActionSchema.options[0],
    bootstrapActionSchema.options[1],
    z.object({ type: z.literal('FORCE_SYNC'), payload: gameStateBoundarySchema }).passthrough(),
    z.object({ type: z.literal('FLATTEN'), payload: gameStateBoundarySchema }).passthrough(),
    z.object({ type: z.literal('SELECT_BUFF'), payload: selectBuffPayloadSchema }).passthrough(),
    z.object({ type: z.literal('TAKE_GEMS'), payload: takeGemsPayloadSchema }).passthrough(),
    z
        .object({ type: z.literal('REPLENISH'), payload: replenishPayloadSchema.optional() })
        .passthrough(),
    z.object({ type: z.literal('TAKE_BONUS_GEM'), payload: bonusGemPayloadSchema }).passthrough(),
    z.object({ type: z.literal('DISCARD_GEM'), payload: gemColorSchema }).passthrough(),
    z.object({ type: z.literal('STEAL_GEM'), payload: stealGemPayloadSchema }).passthrough(),
    z
        .object({
            type: z.literal('INITIATE_BUY_JOKER'),
            payload: initiateBuyJokerPayloadSchema,
        })
        .passthrough(),
    z.object({ type: z.literal('BUY_CARD'), payload: buyCardPayloadSchema }).passthrough(),
    z
        .object({ type: z.literal('INITIATE_RESERVE'), payload: initiateReservePayloadSchema })
        .passthrough(),
    z
        .object({
            type: z.literal('INITIATE_RESERVE_DECK'),
            payload: initiateReserveDeckPayloadSchema,
        })
        .passthrough(),
    noPayloadActionSchema('CANCEL_RESERVE'),
    z.object({ type: z.literal('RESERVE_CARD'), payload: reserveCardPayloadSchema }).passthrough(),
    z.object({ type: z.literal('RESERVE_DECK'), payload: reserveDeckPayloadSchema }).passthrough(),
    z
        .object({
            type: z.literal('DISCARD_RESERVED'),
            payload: discardReservedPayloadSchema,
        })
        .passthrough(),
    noPayloadActionSchema('ACTIVATE_PRIVILEGE'),
    z
        .object({ type: z.literal('USE_PRIVILEGE'), payload: usePrivilegePayloadSchema })
        .passthrough(),
    noPayloadActionSchema('CANCEL_PRIVILEGE'),
    noPayloadActionSchema('FORCE_ROYAL_SELECTION'),
    z
        .object({
            type: z.literal('SELECT_ROYAL_CARD'),
            payload: selectRoyalPayloadSchema,
        })
        .passthrough(),
    z.object({ type: z.literal('DEBUG_ADD_CROWNS'), payload: playerKeySchema }).passthrough(),
    z.object({ type: z.literal('DEBUG_ADD_POINTS'), payload: playerKeySchema }).passthrough(),
    z.object({ type: z.literal('DEBUG_ADD_PRIVILEGE'), payload: playerKeySchema }).passthrough(),
    noPayloadActionSchema('UNDO'),
    noPayloadActionSchema('REDO'),
    z.object({ type: z.literal('PEEK_DECK'), payload: peekDeckPayloadSchema }).passthrough(),
    z
        .object({
            type: z.literal('DEBUG_REROLL_BUFFS'),
            payload: debugRerollBuffsPayloadSchema,
        })
        .passthrough(),
    noPayloadActionSchema('CLOSE_MODAL'),
]);

export const bootstrapCommandSchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('INIT'), setup: gameSetupPayloadSchema }).passthrough(),
    z.object({ kind: z.literal('INIT_DRAFT'), setup: initDraftPayloadSchema }).passthrough(),
]);

export const guestIntentCommandSchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('SELECT_BUFF'), payload: selectBuffPayloadSchema }).passthrough(),
    z.object({ kind: z.literal('TAKE_GEMS'), payload: takeGemsPayloadSchema }).passthrough(),
    z
        .object({ kind: z.literal('REPLENISH'), payload: replenishPayloadSchema.optional() })
        .passthrough(),
    z.object({ kind: z.literal('TAKE_BONUS_GEM'), payload: bonusGemPayloadSchema }).passthrough(),
    z.object({ kind: z.literal('DISCARD_GEM'), payload: gemColorSchema }).passthrough(),
    z.object({ kind: z.literal('STEAL_GEM'), payload: stealGemPayloadSchema }).passthrough(),
    z
        .object({
            kind: z.literal('INITIATE_BUY_JOKER'),
            payload: initiateBuyJokerPayloadSchema,
        })
        .passthrough(),
    z.object({ kind: z.literal('BUY_CARD'), payload: buyCardPayloadSchema }).passthrough(),
    z
        .object({ kind: z.literal('INITIATE_RESERVE'), payload: initiateReservePayloadSchema })
        .passthrough(),
    z
        .object({
            kind: z.literal('INITIATE_RESERVE_DECK'),
            payload: initiateReserveDeckPayloadSchema,
        })
        .passthrough(),
    noPayloadCommandSchema('CANCEL_RESERVE'),
    z.object({ kind: z.literal('RESERVE_CARD'), payload: reserveCardPayloadSchema }).passthrough(),
    z.object({ kind: z.literal('RESERVE_DECK'), payload: reserveDeckPayloadSchema }).passthrough(),
    z
        .object({
            kind: z.literal('DISCARD_RESERVED'),
            payload: discardReservedPayloadSchema,
        })
        .passthrough(),
    noPayloadCommandSchema('ACTIVATE_PRIVILEGE'),
    z
        .object({ kind: z.literal('USE_PRIVILEGE'), payload: usePrivilegePayloadSchema })
        .passthrough(),
    noPayloadCommandSchema('CANCEL_PRIVILEGE'),
    z
        .object({
            kind: z.literal('SELECT_ROYAL_CARD'),
            payload: selectRoyalPayloadSchema,
        })
        .passthrough(),
    z.object({ kind: z.literal('PEEK_DECK'), payload: peekDeckPayloadSchema }).passthrough(),
    noPayloadCommandSchema('CLOSE_MODAL'),
]);

export const guestIntentKindSchema = z.enum([
    'SELECT_BUFF',
    'TAKE_GEMS',
    'REPLENISH',
    'TAKE_BONUS_GEM',
    'DISCARD_GEM',
    'STEAL_GEM',
    'INITIATE_BUY_JOKER',
    'BUY_CARD',
    'INITIATE_RESERVE',
    'INITIATE_RESERVE_DECK',
    'CANCEL_RESERVE',
    'RESERVE_CARD',
    'RESERVE_DECK',
    'DISCARD_RESERVED',
    'ACTIVATE_PRIVILEGE',
    'USE_PRIVILEGE',
    'CANCEL_PRIVILEGE',
    'SELECT_ROYAL_CARD',
    'PEEK_DECK',
    'CLOSE_MODAL',
]);
