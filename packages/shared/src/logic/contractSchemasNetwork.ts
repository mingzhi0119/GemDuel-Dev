import { z } from 'zod';
import { NETWORK_PROTOCOL_VERSION } from '../types/network';
import { replaySyncSchema, replayVNextSchema } from '../replay/schema';
import { hostDecisionReasonCodeSchema, recoveryReasonSchema } from './contractSchemasCore';
import {
    bootstrapCommandSchema,
    gameStateBoundarySchema,
    guestIntentCommandSchema,
    guestIntentKindSchema,
} from './contractSchemasGame';

export const heartbeatPingMessageSchema = z
    .object({
        version: z.literal(NETWORK_PROTOCOL_VERSION),
        type: z.literal('HEARTBEAT_PING'),
        timestamp: z.number(),
    })
    .passthrough();

export const heartbeatPongMessageSchema = z
    .object({
        version: z.literal(NETWORK_PROTOCOL_VERSION),
        type: z.literal('HEARTBEAT_PONG'),
        timestamp: z.number(),
    })
    .passthrough();

export const bootstrapStateMessageSchema = z
    .object({
        version: z.literal(NETWORK_PROTOCOL_VERSION),
        type: z.literal('BOOTSTRAP_STATE'),
        command: bootstrapCommandSchema,
        checksum: z.string().optional(),
        replayFull: z
            .object({
                kind: z.literal('full'),
                replayRevision: z.number().int().min(0),
                replay: replayVNextSchema,
            })
            .strict()
            .optional(),
    })
    .passthrough();

export const guestIntentMessageSchema = z
    .object({
        version: z.literal(NETWORK_PROTOCOL_VERSION),
        type: z.literal('GUEST_INTENT'),
        requestId: z.string().min(1),
        command: guestIntentCommandSchema,
    })
    .passthrough();

export const hostDecisionMessageSchema = z
    .object({
        version: z.literal(NETWORK_PROTOCOL_VERSION),
        type: z.literal('HOST_DECISION'),
        requestId: z.string().min(1),
        intentKind: guestIntentKindSchema,
        approved: z.boolean(),
        reasonCode: hostDecisionReasonCodeSchema.optional(),
        reason: z.string().optional(),
        command: guestIntentCommandSchema.optional(),
        checksum: z.string().optional(),
    })
    .passthrough()
    .superRefine((value, ctx) => {
        if (value.command && value.command.kind !== value.intentKind) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Inbound host decision command payload did not match the declared intent.',
                path: ['command'],
            });
        }

        if (value.approved && (value.command === undefined || value.checksum === undefined)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    'Approved host decisions must include both a command payload and checksum.',
            });
        }
    });

export const syncStateMessageSchema = z
    .object({
        version: z.literal(NETWORK_PROTOCOL_VERSION),
        type: z.literal('SYNC_STATE'),
        snapshot: gameStateBoundarySchema,
        reason: z.string().min(1),
        replaySync: replaySyncSchema.optional(),
    })
    .passthrough();

export const recoveryRequestMessageSchema = z
    .object({
        version: z.literal(NETWORK_PROTOCOL_VERSION),
        type: z.literal('RECOVERY_REQUEST'),
        reason: recoveryReasonSchema,
        requestId: z.string().optional(),
    })
    .passthrough();

export const networkEnvelopeSchema = z
    .object({
        version: z.literal(NETWORK_PROTOCOL_VERSION),
        type: z.enum([
            'BOOTSTRAP_STATE',
            'GUEST_INTENT',
            'HOST_DECISION',
            'SYNC_STATE',
            'RECOVERY_REQUEST',
            'HEARTBEAT_PING',
            'HEARTBEAT_PONG',
        ]),
    })
    .passthrough();

export const networkMessageSchema = z.discriminatedUnion('type', [
    bootstrapStateMessageSchema,
    guestIntentMessageSchema,
    hostDecisionMessageSchema,
    syncStateMessageSchema,
    recoveryRequestMessageSchema,
    heartbeatPingMessageSchema,
    heartbeatPongMessageSchema,
]);
