import { z } from 'zod';
import {
    bonusGemPayloadSchema,
    buyCardPayloadSchema,
    discardReservedPayloadSchema,
    gameStateBoundarySchema,
    gameSetupPayloadSchema,
    initDraftPayloadSchema,
    initiateBuyJokerPayloadSchema,
    initiateReserveDeckPayloadSchema,
    initiateReservePayloadSchema,
    peekDeckPayloadSchema,
    replenishPayloadSchema,
    rerollDraftPoolPayloadSchema,
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
        .strict();

const noPayloadCommandSchema = <Kind extends string>(kind: Kind) =>
    z
        .object({
            kind: z.literal(kind),
        })
        .strict();

export const bootstrapActionSchema = z.discriminatedUnion('type', [
    z.object({ type: z.literal('INIT'), payload: gameSetupPayloadSchema }).strict(),
    z.object({ type: z.literal('INIT_DRAFT'), payload: initDraftPayloadSchema }).strict(),
]);

export const gameActionSchema = z.discriminatedUnion('type', [
    bootstrapActionSchema.options[0],
    bootstrapActionSchema.options[1],
    z.object({ type: z.literal('FORCE_SYNC'), payload: gameStateBoundarySchema }).strict(),
    z.object({ type: z.literal('FLATTEN'), payload: gameStateBoundarySchema }).strict(),
    z.object({ type: z.literal('SELECT_BUFF'), payload: selectBuffPayloadSchema }).strict(),
    z.object({ type: z.literal('TAKE_GEMS'), payload: takeGemsPayloadSchema }).strict(),
    z.object({ type: z.literal('REPLENISH'), payload: replenishPayloadSchema.optional() }).strict(),
    z.object({ type: z.literal('TAKE_BONUS_GEM'), payload: bonusGemPayloadSchema }).strict(),
    z.object({ type: z.literal('DISCARD_GEM'), payload: gemColorSchema }).strict(),
    z.object({ type: z.literal('STEAL_GEM'), payload: stealGemPayloadSchema }).strict(),
    z
        .object({
            type: z.literal('INITIATE_BUY_JOKER'),
            payload: initiateBuyJokerPayloadSchema,
        })
        .strict(),
    z.object({ type: z.literal('BUY_CARD'), payload: buyCardPayloadSchema }).strict(),
    z
        .object({ type: z.literal('INITIATE_RESERVE'), payload: initiateReservePayloadSchema })
        .strict(),
    z
        .object({
            type: z.literal('INITIATE_RESERVE_DECK'),
            payload: initiateReserveDeckPayloadSchema,
        })
        .strict(),
    noPayloadActionSchema('CANCEL_RESERVE'),
    z.object({ type: z.literal('RESERVE_CARD'), payload: reserveCardPayloadSchema }).strict(),
    z.object({ type: z.literal('RESERVE_DECK'), payload: reserveDeckPayloadSchema }).strict(),
    z
        .object({
            type: z.literal('DISCARD_RESERVED'),
            payload: discardReservedPayloadSchema,
        })
        .strict(),
    noPayloadActionSchema('ACTIVATE_PRIVILEGE'),
    z.object({ type: z.literal('USE_PRIVILEGE'), payload: usePrivilegePayloadSchema }).strict(),
    noPayloadActionSchema('CANCEL_PRIVILEGE'),
    noPayloadActionSchema('FORCE_ROYAL_SELECTION'),
    z
        .object({
            type: z.literal('SELECT_ROYAL_CARD'),
            payload: selectRoyalPayloadSchema,
        })
        .strict(),
    z.object({ type: z.literal('DEBUG_ADD_CROWNS'), payload: playerKeySchema }).strict(),
    z.object({ type: z.literal('DEBUG_ADD_POINTS'), payload: playerKeySchema }).strict(),
    z.object({ type: z.literal('DEBUG_ADD_PRIVILEGE'), payload: playerKeySchema }).strict(),
    noPayloadActionSchema('UNDO'),
    noPayloadActionSchema('REDO'),
    z.object({ type: z.literal('PEEK_DECK'), payload: peekDeckPayloadSchema }).strict(),
    z
        .object({
            type: z.literal('REROLL_DRAFT_POOL'),
            payload: rerollDraftPoolPayloadSchema,
        })
        .strict(),
    noPayloadActionSchema('CLOSE_MODAL'),
]);

export const bootstrapCommandSchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('INIT'), setup: gameSetupPayloadSchema }).strict(),
    z.object({ kind: z.literal('INIT_DRAFT'), setup: initDraftPayloadSchema }).strict(),
]);

export const guestIntentCommandSchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('SELECT_BUFF'), payload: selectBuffPayloadSchema }).strict(),
    z.object({ kind: z.literal('TAKE_GEMS'), payload: takeGemsPayloadSchema }).strict(),
    z.object({ kind: z.literal('REPLENISH'), payload: replenishPayloadSchema.optional() }).strict(),
    z.object({ kind: z.literal('TAKE_BONUS_GEM'), payload: bonusGemPayloadSchema }).strict(),
    z.object({ kind: z.literal('DISCARD_GEM'), payload: gemColorSchema }).strict(),
    z.object({ kind: z.literal('STEAL_GEM'), payload: stealGemPayloadSchema }).strict(),
    z
        .object({
            kind: z.literal('INITIATE_BUY_JOKER'),
            payload: initiateBuyJokerPayloadSchema,
        })
        .strict(),
    z.object({ kind: z.literal('BUY_CARD'), payload: buyCardPayloadSchema }).strict(),
    z
        .object({ kind: z.literal('INITIATE_RESERVE'), payload: initiateReservePayloadSchema })
        .strict(),
    z
        .object({
            kind: z.literal('INITIATE_RESERVE_DECK'),
            payload: initiateReserveDeckPayloadSchema,
        })
        .strict(),
    noPayloadCommandSchema('CANCEL_RESERVE'),
    z.object({ kind: z.literal('RESERVE_CARD'), payload: reserveCardPayloadSchema }).strict(),
    z.object({ kind: z.literal('RESERVE_DECK'), payload: reserveDeckPayloadSchema }).strict(),
    z
        .object({
            kind: z.literal('DISCARD_RESERVED'),
            payload: discardReservedPayloadSchema,
        })
        .strict(),
    noPayloadCommandSchema('ACTIVATE_PRIVILEGE'),
    z.object({ kind: z.literal('USE_PRIVILEGE'), payload: usePrivilegePayloadSchema }).strict(),
    noPayloadCommandSchema('CANCEL_PRIVILEGE'),
    z
        .object({
            kind: z.literal('SELECT_ROYAL_CARD'),
            payload: selectRoyalPayloadSchema,
        })
        .strict(),
    z.object({ kind: z.literal('PEEK_DECK'), payload: peekDeckPayloadSchema }).strict(),
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
