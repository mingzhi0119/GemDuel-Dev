import { z } from 'zod';
import { NETWORK_PROTOCOL_VERSION } from '../types/network';
import {
    GOVERNANCE_REASON_CODES,
    HOST_DECISION_REASON_CODES,
    NETWORK_MESSAGE_BOUNDARY_ERROR_CODES,
    NETWORK_SYNC_REASONS,
    RECOVERY_REASONS,
    REPLAY_IMPORT_ERROR_CODES,
    RUNTIME_RELAY_BOUNDARY_REASON_CODES,
} from '../types/reason';

export const gameModeSchema = z.enum(['LOCAL_PVP', 'PVE', 'ONLINE_MULTIPLAYER']);
export const gamePhaseSchema = z.enum([
    'IDLE',
    'DRAFT_PHASE',
    'SELECT_ROYAL',
    'DISCARD_EXCESS_GEMS',
    'BONUS_ACTION',
    'STEAL_ACTION',
    'PRIVILEGE_ACTION',
    'RESERVE_WAITING_GEM',
    'SELECT_CARD_COLOR',
]);
export const levelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const playerKeySchema = z.enum(['p1', 'p2']);
export const gemColorSchema = z.enum(['blue', 'white', 'green', 'black', 'red', 'pearl', 'gold']);
export const basicGemColorSchema = z.enum(['blue', 'white', 'green', 'black', 'red']);
export const bonusColorSchema = z.union([gemColorSchema, z.literal('null')]);
export const uiNoticeSeveritySchema = z.enum(['info', 'warn', 'error']);
export const runtimeRelayProfileSourceSchema = z.enum([
    'online-turn-service',
    'ephemeral-turn-bundle',
    'runtime-ice-fallback',
    'default-stun',
]);
export const cardActionSourceSchema = z.enum(['market', 'reserved']);
export const hostDecisionReasonCodeSchema = z.enum(HOST_DECISION_REASON_CODES);
export const networkSyncReasonSchema = z.enum(NETWORK_SYNC_REASONS);
export const recoveryReasonSchema = z.enum(RECOVERY_REASONS);
export const appReasonCodeSchema = z.enum([
    ...HOST_DECISION_REASON_CODES,
    ...RECOVERY_REASONS,
    ...NETWORK_MESSAGE_BOUNDARY_ERROR_CODES,
    ...REPLAY_IMPORT_ERROR_CODES,
    ...RUNTIME_RELAY_BOUNDARY_REASON_CODES,
    ...GOVERNANCE_REASON_CODES,
]);
export const runtimeIceServerSchema = z
    .object({
        urls: z.union([z.string(), z.array(z.string())]),
        username: z.string().optional(),
        credential: z.string().optional(),
    })
    .passthrough();
export const runtimeIceServerListSchema = z.array(runtimeIceServerSchema);

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

export const debugRerollBuffsPayloadSchema = z
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
