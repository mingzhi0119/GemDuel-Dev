import { z } from 'zod';
import {
    basicGemColorSchema,
    bonusColorSchema,
    cardActionSourceSchema,
    draftLevelSchema,
    gemColorSchema,
    gameModeSchema,
    gamePhaseSchema,
    levelSchema,
    playerKeySchema,
} from './contractSchemasCore';

export const gemCoordSchema = z
    .object({
        r: z.number().int(),
        c: z.number().int(),
    })
    .passthrough();

export const gemInventorySchema = z
    .object({
        blue: z.number(),
        white: z.number(),
        green: z.number(),
        black: z.number(),
        red: z.number(),
        pearl: z.number(),
        gold: z.number(),
    })
    .passthrough();

export const gemTypeObjectSchema = z
    .object({
        id: z.union([gemColorSchema, z.literal('empty')]),
        color: z.string(),
        border: z.string(),
        label: z.string(),
    })
    .passthrough();

export const boardCellSchema = z
    .object({
        type: gemTypeObjectSchema,
        uid: z.string().min(1),
    })
    .passthrough();

export const boardSchema = z.array(z.array(boardCellSchema).length(5)).length(5);
export const bagSchema = z.array(z.union([boardCellSchema, z.string()]));

export const cardSchema = z
    .object({
        id: z.string().min(1),
        level: levelSchema,
        cost: gemInventorySchema,
        points: z.number(),
        bonusColor: bonusColorSchema.optional(),
    })
    .passthrough();

export const deckStateSchema = z
    .object({
        1: z.array(cardSchema),
        2: z.array(cardSchema),
        3: z.array(cardSchema),
    })
    .passthrough();

export const marketStateSchema = z
    .object({
        1: z.array(cardSchema.nullable()),
        2: z.array(cardSchema.nullable()),
        3: z.array(cardSchema.nullable()),
    })
    .passthrough();

export const playerInitRandomsSchema = z
    .object({
        randomGems: z.array(basicGemColorSchema).length(5),
        reserveCardLevel: levelSchema,
        preferenceColor: basicGemColorSchema,
    })
    .passthrough();

export const initRandomsSchema = z
    .object({
        p1: playerInitRandomsSchema,
        p2: playerInitRandomsSchema,
    })
    .passthrough();

export const marketCardRefSchema = z.union([
    z
        .object({
            level: levelSchema,
            idx: z.number().int().min(0),
        })
        .passthrough(),
    z
        .object({
            level: z.literal(3),
            idx: z.number().int().min(0),
            isExtra: z.literal(true),
            extraIdx: z.number().int().positive(),
        })
        .passthrough(),
]);

export const gameSetupPayloadSchema = z
    .object({
        mode: gameModeSchema,
        board: boardSchema,
        bag: bagSchema,
        market: marketStateSchema,
        decks: deckStateSchema,
        initRandoms: initRandomsSchema,
        isHost: z.boolean(),
        hostPlayer: playerKeySchema,
    })
    .passthrough();

export const initDraftPayloadSchema = gameSetupPayloadSchema
    .extend({
        draftPool: z.array(z.string()),
        buffLevel: levelSchema,
    })
    .passthrough();

export const selectBuffPayloadSchema = z
    .object({
        buffId: z.string().min(1),
        randomColor: basicGemColorSchema.optional(),
        initRandoms: z
            .object({
                p1: playerInitRandomsSchema.optional(),
                p2: playerInitRandomsSchema.optional(),
            })
            .passthrough()
            .optional(),
        p2DraftPoolIndices: z
            .tuple([z.number().int(), z.number().int(), z.number().int(), z.number().int()])
            .optional(),
    })
    .passthrough();

export const takeGemsPayloadSchema = z
    .object({
        coords: z.array(gemCoordSchema),
    })
    .passthrough();

export const replenishPayloadSchema = z
    .object({
        randoms: z
            .object({
                extortionColor: gemColorSchema.optional(),
                expansionColor: gemColorSchema.optional(),
            })
            .passthrough()
            .optional(),
    })
    .passthrough();

export const bonusGemPayloadSchema = gemCoordSchema;

export const stealGemPayloadSchema = z
    .object({
        gemId: gemColorSchema,
    })
    .passthrough();

export const usePrivilegePayloadSchema = gemCoordSchema;

export const buyCardPayloadSchema = z
    .object({
        card: cardSchema,
        source: cardActionSourceSchema,
        marketInfo: marketCardRefSchema.optional(),
        randoms: z
            .object({
                bountyHunterColor: gemColorSchema.optional(),
            })
            .passthrough()
            .optional(),
    })
    .passthrough();

export const initiateBuyJokerPayloadSchema = z
    .object({
        card: cardSchema,
        source: cardActionSourceSchema,
        marketInfo: marketCardRefSchema.optional(),
    })
    .passthrough();

export const initiateReservePayloadSchema = z
    .object({
        card: cardSchema,
        level: levelSchema,
        idx: z.number().int().min(0),
    })
    .passthrough();

export const initiateReserveDeckPayloadSchema = z
    .object({
        level: levelSchema,
    })
    .passthrough();

export const reserveCardPayloadSchema = z
    .object({
        card: cardSchema,
        level: levelSchema,
        idx: z.number().int().min(0),
        goldCoords: gemCoordSchema.optional(),
        isExtra: z.boolean().optional(),
        extraIdx: z.number().int().optional(),
        isSteal: z.boolean().optional(),
    })
    .passthrough();

export const reserveDeckPayloadSchema = z
    .object({
        level: levelSchema,
        goldCoords: gemCoordSchema.optional(),
    })
    .passthrough();

export const royalCardSchema = z
    .object({
        id: z.string().min(1),
        points: z.number(),
        bonusColor: gemColorSchema,
        ability: z.union([z.string(), z.array(z.string())]),
        label: z.string(),
        crowns: z.number().optional(),
    })
    .passthrough();

export const selectRoyalPayloadSchema = z
    .object({
        card: royalCardSchema,
    })
    .passthrough();

export const peekDeckPayloadSchema = z
    .object({
        level: levelSchema,
    })
    .passthrough();

export const discardReservedPayloadSchema = z
    .object({
        cardId: z.string().min(1),
    })
    .passthrough();

export const rerollDraftPoolPayloadSchema = z
    .object({
        level: levelSchema.optional(),
    })
    .passthrough();

export const gameStateBoundarySchema = z
    .object({
        board: boardSchema,
        bag: bagSchema,
        turn: playerKeySchema,
        phase: gamePhaseSchema,
        mode: gameModeSchema,
        isHost: z.boolean(),
        hostPlayer: playerKeySchema,
        localPlayer: playerKeySchema,
        buffLevel: draftLevelSchema,
        p2DraftLevel: draftLevelSchema.optional(),
        inventories: z
            .object({
                p1: gemInventorySchema,
                p2: gemInventorySchema,
            })
            .passthrough(),
        privileges: z
            .object({
                p1: z.number(),
                p2: z.number(),
            })
            .passthrough(),
        decks: deckStateSchema,
        market: marketStateSchema,
    })
    .passthrough();
