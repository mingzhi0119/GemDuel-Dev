import { z } from 'zod';
import type {
    MarketCardRef,
    PlayerInitRandoms,
    RerollDraftPoolPayload,
    SelectBuffPayload,
} from '../types';
import { collectIceServerPolicyViolations } from '../runtimeIcePolicy.js';

export const levelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const draftLevelSchema = z.union([z.literal(0), levelSchema]);
export const playerKeySchema = z.union([z.literal('p1'), z.literal('p2')]);
export const basicGemColorSchema = z.union([
    z.literal('blue'),
    z.literal('white'),
    z.literal('green'),
    z.literal('black'),
    z.literal('red'),
]);
export const cardActionSourceSchema = z.union([z.literal('market'), z.literal('reserved')]);

const playerInitRandomsSchema: z.ZodType<PlayerInitRandoms> = z.object({
    randomGems: z.array(basicGemColorSchema).length(5),
    reserveCardLevel: levelSchema,
    preferenceColor: basicGemColorSchema,
});

export const marketCardRefSchema: z.ZodType<MarketCardRef> = z.union([
    z.object({
        level: levelSchema,
        idx: z.number().int().min(0),
        isExtra: z.undefined().optional(),
        extraIdx: z.undefined().optional(),
    }),
    z.object({
        level: levelSchema,
        idx: z.number().int().min(0),
        isExtra: z.literal(true),
        extraIdx: z.number().int().min(0),
    }),
]);

export const selectBuffPayloadSchema: z.ZodType<SelectBuffPayload> = z.object({
    buffId: z.string().min(1),
    randomColor: basicGemColorSchema.optional(),
    initRandoms: z
        .object({
            p1: playerInitRandomsSchema.optional(),
            p2: playerInitRandomsSchema.optional(),
        })
        .optional(),
    p2DraftPoolIndices: z
        .tuple([z.number().int(), z.number().int(), z.number().int(), z.number().int()])
        .optional(),
});

export const rerollDraftPoolPayloadSchema: z.ZodType<RerollDraftPoolPayload> = z.object({
    level: levelSchema.optional(),
});

export const runtimeIceServerSchema: z.ZodType<RTCIceServer> = z
    .object({
        urls: z.union([z.string(), z.array(z.string())]),
        username: z.string().optional(),
        credential: z.string().optional(),
    })
    .superRefine((value, ctx) => {
        for (const violation of collectIceServerPolicyViolations(value)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: violation,
            });
        }
    });

export const runtimeIceServerListSchema = z.array(runtimeIceServerSchema);

export const parseRuntimeIceServers = (value: unknown): RTCIceServer[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry) => runtimeIceServerSchema.safeParse(entry))
        .flatMap((result) => (result.success ? [result.data] : []));
};
