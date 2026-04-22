import { z } from 'zod';
import {
    basicGemColorSchema,
    bonusColorSchema,
    cardActionSourceSchema,
    draftLevelSchema,
    gameModeSchema,
    gamePhaseSchema,
    gemColorSchema,
    levelSchema,
    playerKeySchema,
} from '../logic/contractSchemasCore';
import {
    gemInventorySchema,
    initRandomsSchema,
    marketCardRefSchema,
} from '../logic/contractSchemasGameState';
import {
    REPLAY_VNEXT_SCHEMA_VERSION,
    type EvaluationReport,
    type ReplayCardInstanceId,
    type ReplayCardTemplateId,
    type ReplayCheckpoint,
    type ReplayEvent,
    type ReplayInitSnapshot,
    type ReplayReadDiagnostics,
    type ReplayRoyalId,
    type ReplayStateSnapshot,
    type ReplaySummary,
    type ReplaySync,
    type ReplayVNext,
} from './types';

const replaySchemaVersionSchema = z.literal(REPLAY_VNEXT_SCHEMA_VERSION);
const replayGemIdSchema = z.union([gemColorSchema, z.literal('empty')]);
const replayCardInstanceIdSchema = z.string().regex(/^c:.+#\d+$/, {
    message: 'Replay card instance ids must use the c:<template>#<seq> format.',
}) as z.ZodType<ReplayCardInstanceId>;
const replayCardTemplateIdSchema = z.string().min(1) as z.ZodType<ReplayCardTemplateId>;
const replayRoyalIdSchema = z.string().min(1) as z.ZodType<ReplayRoyalId>;

const replayBuffRefSchema = z
    .object({
        id: z.string().min(1),
        level: z.union([z.literal(0), levelSchema]),
        state: z.record(z.string(), z.unknown()).optional(),
    })
    .strict();

export const replayPlayersSchema = z
    .object({
        p1: z.object({ buff: replayBuffRefSchema }).strict(),
        p2: z.object({ buff: replayBuffRefSchema }).strict(),
    })
    .strict();

export const replayMatchInfoSchema = z
    .object({
        mode: gameModeSchema,
        seed: z.union([z.string(), z.number(), z.null()]),
        started: z.boolean(),
        ended: z.boolean(),
        winner: playerKeySchema.nullable(),
        endReason: z.enum(['normal', 'surrender', 'disconnect', 'aborted']).nullable(),
    })
    .strict();

const replayMarketSchema = z
    .object({
        1: z.array(replayCardInstanceIdSchema.nullable()),
        2: z.array(replayCardInstanceIdSchema.nullable()),
        3: z.array(replayCardInstanceIdSchema.nullable()),
    })
    .strict();

const replayDeckSchema = z
    .object({
        1: z.array(replayCardInstanceIdSchema),
        2: z.array(replayCardInstanceIdSchema),
        3: z.array(replayCardInstanceIdSchema),
    })
    .strict();

const replayCardInstancesSchema = z.record(replayCardInstanceIdSchema, replayCardTemplateIdSchema);

export const replayInitSnapshotSchema: z.ZodType<ReplayInitSnapshot> = z
    .object({
        actionType: z.enum(['INIT', 'INIT_DRAFT']),
        mode: gameModeSchema,
        hostPlayer: playerKeySchema,
        board: z.array(z.array(replayGemIdSchema)),
        bag: z.array(replayGemIdSchema),
        market: replayMarketSchema,
        decks: replayDeckSchema,
        cardInstances: replayCardInstancesSchema,
        initRandoms: initRandomsSchema,
        buffLevel: levelSchema.optional(),
        draftPool: z.array(z.string()).optional(),
        royalDeck: z.array(replayRoyalIdSchema),
    })
    .strict();

const replayTableauCardSchema = z.discriminatedUnion('kind', [
    z
        .object({
            kind: z.literal('instance'),
            instanceId: replayCardInstanceIdSchema,
        })
        .strict(),
    z
        .object({
            kind: z.literal('buff_dummy'),
            cardId: z.string().min(1),
            bonusColor: gemColorSchema,
            bonusCount: z.number().int().min(1),
        })
        .strict(),
]);

const replayAbilityResolutionSchema = z
    .object({
        nextPlayer: playerKeySchema,
        pending: z.array(z.string()),
        resolved: z.array(z.string()),
        bonusGemColor: gemColorSchema.optional(),
        deferredEchoWrite: z
            .object({
                holder: playerKeySchema,
                abilities: z.array(z.string()),
                bonusColor: gemColorSchema.optional(),
            })
            .strict()
            .optional(),
    })
    .strict();

export const replayStateSnapshotSchema: z.ZodType<ReplayStateSnapshot> = z
    .object({
        board: z.array(z.array(replayGemIdSchema)),
        bag: z.array(replayGemIdSchema),
        turn: playerKeySchema,
        phase: gamePhaseSchema,
        mode: gameModeSchema,
        winner: playerKeySchema.nullable(),
        market: replayMarketSchema,
        decks: replayDeckSchema,
        playerTableau: z
            .object({
                p1: z.array(replayTableauCardSchema),
                p2: z.array(replayTableauCardSchema),
            })
            .strict(),
        playerReserved: z
            .object({
                p1: z.array(replayCardInstanceIdSchema),
                p2: z.array(replayCardInstanceIdSchema),
            })
            .strict(),
        playerRoyals: z
            .object({
                p1: z.array(replayRoyalIdSchema),
                p2: z.array(replayRoyalIdSchema),
            })
            .strict(),
        inventories: z
            .object({
                p1: gemInventorySchema,
                p2: gemInventorySchema,
            })
            .strict(),
        privileges: z
            .object({
                p1: z.number(),
                p2: z.number(),
            })
            .strict(),
        royalDeck: z.array(replayRoyalIdSchema),
        royalMilestones: z
            .object({
                p1: z.record(z.string(), z.boolean()),
                p2: z.record(z.string(), z.boolean()),
            })
            .strict(),
        extraPoints: z
            .object({
                p1: z.number(),
                p2: z.number(),
            })
            .strict(),
        extraCrowns: z
            .object({
                p1: z.number(),
                p2: z.number(),
            })
            .strict(),
        extraAllocation: z
            .object({
                p1: gemInventorySchema,
                p2: gemInventorySchema,
            })
            .strict(),
        extraPrivileges: z
            .object({
                p1: z.number(),
                p2: z.number(),
            })
            .strict(),
        playerBuffs: replayPlayersSchema,
        draftPool: z.array(z.string()),
        p2DraftPool: z.array(z.string()).optional(),
        p1SelectedBuffId: z.string().nullable().optional(),
        draftOrder: z.array(playerKeySchema),
        buffLevel: draftLevelSchema,
        p2DraftLevel: draftLevelSchema,
        privilegeGemCount: z.number().int(),
        pendingReserve: z
            .object({
                instanceId: replayCardInstanceIdSchema.optional(),
                level: levelSchema,
                idx: z.number().int().optional(),
                isExtra: z.boolean().optional(),
                extraIdx: z.number().int().min(0).optional(),
                isDeck: z.boolean().optional(),
            })
            .strict()
            .nullable(),
        pendingBuy: z
            .object({
                instanceId: replayCardInstanceIdSchema,
                source: cardActionSourceSchema,
                marketRef: marketCardRefSchema.optional(),
            })
            .strict()
            .nullable(),
        bonusGemTarget: replayGemIdSchema.nullable(),
        nextPlayerAfterRoyal: playerKeySchema.nullable(),
        pendingExtraTurn: z.boolean(),
        playerTurnCounts: z
            .object({
                p1: z.number(),
                p2: z.number(),
            })
            .strict(),
        abilityResolution: replayAbilityResolutionSchema.nullable(),
    })
    .strict();

export const replayCheckpointSchema: z.ZodType<ReplayCheckpoint> = z
    .object({
        revision: z.number().int().min(0),
        state: replayStateSnapshotSchema,
    })
    .strict();

export const replayEventSchema: z.ZodType<ReplayEvent> = z.discriminatedUnion('type', [
    z
        .object({
            type: z.literal('select_buff'),
            actor: playerKeySchema,
            buffId: z.string().min(1),
            randomColor: basicGemColorSchema.optional(),
            initRandoms: z
                .object({
                    p1: initRandomsSchema.shape.p1.optional(),
                    p2: initRandomsSchema.shape.p2.optional(),
                })
                .strict()
                .optional(),
            p2DraftPoolIndices: z
                .tuple([z.number().int(), z.number().int(), z.number().int(), z.number().int()])
                .optional(),
        })
        .strict(),
    z
        .object({
            type: z.literal('take_gems'),
            actor: playerKeySchema,
            coords: z.array(
                z
                    .object({
                        r: z.number().int(),
                        c: z.number().int(),
                    })
                    .strict()
            ),
        })
        .strict(),
    z
        .object({
            type: z.literal('replenish'),
            actor: playerKeySchema,
            randoms: z
                .object({
                    extortionColor: gemColorSchema.optional(),
                    expansionColor: gemColorSchema.optional(),
                })
                .strict()
                .optional(),
        })
        .strict(),
    z
        .object({
            type: z.literal('take_bonus_gem'),
            actor: playerKeySchema,
            coord: z
                .object({
                    r: z.number().int(),
                    c: z.number().int(),
                })
                .strict(),
        })
        .strict(),
    z
        .object({
            type: z.literal('discard_gem'),
            actor: playerKeySchema,
            gemId: gemColorSchema,
        })
        .strict(),
    z
        .object({
            type: z.literal('steal_gem'),
            actor: playerKeySchema,
            gemId: gemColorSchema,
        })
        .strict(),
    z
        .object({
            type: z.literal('buy_card'),
            actor: playerKeySchema,
            instanceId: replayCardInstanceIdSchema,
            source: cardActionSourceSchema,
            marketRef: marketCardRefSchema.optional(),
            bonusColor: bonusColorSchema,
            randoms: z
                .object({
                    bountyHunterColor: gemColorSchema.optional(),
                })
                .strict()
                .optional(),
        })
        .strict(),
    z
        .object({
            type: z.literal('reserve_card'),
            actor: playerKeySchema,
            instanceId: replayCardInstanceIdSchema,
            level: levelSchema,
            marketRef: marketCardRefSchema,
            goldCoord: z
                .object({
                    r: z.number().int(),
                    c: z.number().int(),
                })
                .strict()
                .optional(),
            isExtra: z.boolean().optional(),
            extraIdx: z.number().int().optional(),
            isSteal: z.boolean().optional(),
        })
        .strict(),
    z
        .object({
            type: z.literal('reserve_deck'),
            actor: playerKeySchema,
            level: levelSchema,
            goldCoord: z
                .object({
                    r: z.number().int(),
                    c: z.number().int(),
                })
                .strict()
                .optional(),
        })
        .strict(),
    z
        .object({
            type: z.literal('discard_reserved'),
            actor: playerKeySchema,
            instanceId: replayCardInstanceIdSchema,
        })
        .strict(),
    z
        .object({
            type: z.literal('use_privilege'),
            actor: playerKeySchema,
            coord: z
                .object({
                    r: z.number().int(),
                    c: z.number().int(),
                })
                .strict(),
        })
        .strict(),
    z
        .object({
            type: z.literal('select_royal'),
            actor: playerKeySchema,
            royalId: replayRoyalIdSchema,
        })
        .strict(),
]);

const replayEventTypeSchema = z.enum([
    'select_buff',
    'take_gems',
    'replenish',
    'take_bonus_gem',
    'discard_gem',
    'steal_gem',
    'buy_card',
    'reserve_card',
    'reserve_deck',
    'discard_reserved',
    'use_privilege',
    'select_royal',
]);

export const replaySummarySchema: z.ZodType<ReplaySummary> = z
    .object({
        turnCount: z.number().int().min(0),
        totalEvents: z.number().int().min(0),
        eventsByType: z.record(replayEventTypeSchema, z.number().int().min(0)),
        eventsByPlayer: z.record(playerKeySchema, z.number().int().min(0)),
        winner: playerKeySchema.nullable(),
        endReason: z.enum(['normal', 'surrender', 'disconnect', 'aborted']).nullable(),
        finalScores: z.record(playerKeySchema, z.number()),
        finalCrowns: z.record(playerKeySchema, z.number()),
        finalGemTotals: z.record(playerKeySchema, z.number()),
        finalStateHash: z.string().min(1),
        summaryDerivedFrom: z.enum(['writer', 'recomputed']),
    })
    .strict();

export const replayVNextSchema: z.ZodType<ReplayVNext> = z
    .object({
        schemaVersion: replaySchemaVersionSchema,
        replayRevision: z.number().int().min(0),
        gameVersion: z.string().min(1),
        createdAt: z.string().datetime(),
        match: replayMatchInfoSchema,
        players: replayPlayersSchema,
        init: replayInitSnapshotSchema,
        events: z.array(replayEventSchema),
        checkpoints: z.array(replayCheckpointSchema).optional(),
        summary: replaySummarySchema,
    })
    .strict();

export const replayReadDiagnosticsSchema: z.ZodType<ReplayReadDiagnostics> = z
    .object({
        detectedVersion: z.enum([
            REPLAY_VNEXT_SCHEMA_VERSION,
            'legacy-history',
            'unknown',
            'unsupported-vnext',
        ]),
        summaryIntegrity: z.enum(['unchecked', 'ok', 'mismatch']),
    })
    .strict();

export const evaluationMetricSchema = z
    .object({
        score: z.number(),
        note: z.string(),
    })
    .strict();

export const evaluationReportSchema: z.ZodType<EvaluationReport> = z
    .object({
        winnerConsistency: evaluationMetricSchema,
        actionLegality: evaluationMetricSchema,
        tempo: evaluationMetricSchema,
        resourceEfficiency: evaluationMetricSchema,
        buffImpact: evaluationMetricSchema,
        confidence: z.number(),
    })
    .strict();

export const replaySyncSchema: z.ZodType<ReplaySync> = z.discriminatedUnion('kind', [
    z
        .object({
            kind: z.literal('full'),
            replayRevision: z.number().int().min(0),
            replay: replayVNextSchema,
        })
        .strict(),
    z
        .object({
            kind: z.literal('delta'),
            fromRevision: z.number().int().min(0),
            toRevision: z.number().int().min(0),
            events: z.array(replayEventSchema),
            checkpoint: replayCheckpointSchema.optional(),
            stateHashAfter: z.string().min(1),
        })
        .strict(),
]);
