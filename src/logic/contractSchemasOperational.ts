import { z } from 'zod';
import { appReasonCodeSchema, uiNoticeSeveritySchema } from './contractSchemasCore';

export const runtimeRelayProfileSourceSchema = z.enum([
    'online-turn-service',
    'ephemeral-turn-bundle',
    'runtime-ice-fallback',
    'default-stun',
]);

export const runtimeIceServerSchema = z
    .object({
        urls: z.union([z.string(), z.array(z.string())]),
        username: z.string().optional(),
        credential: z.string().optional(),
    })
    .passthrough();

export const runtimeIceServerListSchema = z.array(runtimeIceServerSchema);

export const runtimeRelayProfileSchema = z
    .object({
        policyVersion: z.literal(1),
        source: runtimeRelayProfileSourceSchema,
        iceServers: runtimeIceServerListSchema,
        issuedAt: z.string().nullable().optional(),
        expiresAt: z.string().nullable().optional(),
    })
    .passthrough();

export const uiStatusNoticeSchema = z
    .object({
        code: appReasonCodeSchema,
        message: z.string().min(1),
        severity: uiNoticeSeveritySchema,
    })
    .passthrough();

export const responsiveLayoutSchema = z
    .object({
        layoutMode: z.enum(['mobile', 'desktop-4k']),
        viewportWidth: z.number(),
        viewportHeight: z.number(),
        aspectRatio: z.number(),
        stageCanvasWidthPx: z.number(),
        stageCanvasHeightPx: z.number(),
        stageScale: z.number(),
        stageInsetXPx: z.number(),
        stageInsetYPx: z.number(),
        boardScale: z.number(),
        deckScale: z.number(),
        zoneScale: z.number(),
        zoneHeightPx: z.number(),
        mainGapPx: z.number(),
    })
    .passthrough();

export const releaseHealthSeveritySchema = z.enum(['info', 'warn', 'error']);
export const releaseHealthCategorySchema = z.enum([
    'startup',
    'updater',
    'peer',
    'network',
    'recovery',
    'runtime',
    'security',
]);
export const releaseHealthContextValueSchema = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
]);
export const releaseHealthEventSchema = z
    .object({
        source: z.enum(['main', 'renderer']).default('renderer'),
        category: releaseHealthCategorySchema,
        name: z
            .string()
            .regex(/^[A-Z0-9_]+$/)
            .max(64),
        severity: releaseHealthSeveritySchema,
        message: z.string().min(1).max(200),
        context: z.record(z.string(), releaseHealthContextValueSchema).optional(),
    })
    .passthrough();
export const releaseHealthCounterSnapshotSchema = z
    .object({
        count: z.number().int().nonnegative(),
        severity: releaseHealthSeveritySchema,
        lastAt: z.string().min(1),
    })
    .passthrough();
export const releaseHealthIndicatorSnapshotSchema = z
    .object({
        startupFailures: z.number().int().nonnegative(),
        runtimeConfigFailures: z.number().int().nonnegative(),
        updaterFailures: z.number().int().nonnegative(),
        peerFailures: z.number().int().nonnegative(),
        recoveryRequests: z.number().int().nonnegative(),
        ipcRejected: z.number().int().nonnegative(),
    })
    .passthrough();
export const releaseHealthSnapshotSchema = z
    .object({
        startedAt: z.string().min(1),
        lastEventAt: z.string().nullable(),
        totalEvents: z.number().int().nonnegative(),
        severityCounts: z
            .object({
                info: z.number().int().nonnegative(),
                warn: z.number().int().nonnegative(),
                error: z.number().int().nonnegative(),
            })
            .passthrough(),
        indicators: releaseHealthIndicatorSnapshotSchema,
        reasonCodeCounts: z.record(z.string(), z.number().int().nonnegative()),
        counters: z.record(z.string(), releaseHealthCounterSnapshotSchema),
        recentEvents: z.array(
            releaseHealthEventSchema.extend({
                source: z.enum(['main', 'renderer']),
                timestamp: z.string().min(1),
            })
        ),
    })
    .passthrough();

export const turnCredentialBundleSchema = z
    .object({
        policyVersion: z.literal(1),
        iceServers: runtimeIceServerListSchema.min(1),
        issuedAt: z.string().min(1),
        expiresAt: z.string().min(1),
    })
    .passthrough();

export const turnCredentialIssueRequestSchema = z
    .object({
        subject: z.string().min(1),
        client: z.string().min(1),
    })
    .passthrough();

export const turnCredentialRefreshRequestSchema = z
    .object({
        leaseId: z.string().min(1),
        client: z.string().min(1),
    })
    .passthrough();

export const turnCredentialRevokeRequestSchema = z
    .object({
        leaseId: z.string().min(1),
        client: z.string().min(1),
        reason: z.string().min(1).max(120).optional(),
    })
    .passthrough();

export const turnCredentialLeaseSchema = z
    .object({
        policyVersion: z.literal(1),
        leaseId: z.string().min(1),
        bundle: turnCredentialBundleSchema,
        refreshAfterAt: z.string().min(1),
    })
    .passthrough();

export const turnCredentialRevokeResultSchema = z
    .object({
        policyVersion: z.literal(1),
        leaseId: z.string().min(1),
        revoked: z.literal(true),
        revokedAt: z.string().min(1),
    })
    .passthrough();
