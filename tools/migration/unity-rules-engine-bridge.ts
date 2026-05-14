import { mkdir, readFile, readdir, rename, rm, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { getActionRejectionReason } from '../../packages/shared/src/logic/actionValidation/rules';
import { applyAction } from '../../packages/shared/src/logic/gameReducer';
import { buildStartGameAction } from '../../packages/shared/src/logic/gameSetup';
import { INITIAL_STATE_SKELETON } from '../../packages/shared/src/logic/initialState';
import { getVisibleReservedCards } from '../../packages/shared/src/logic/multiplayerVisibility';
import { loadReplayStateAtRevision } from '../../packages/shared/src/replay/loader';
import {
    buildIdentityRuntimeToInstanceMap,
    buildReplayInitSnapshot,
    inflateReplayStateSnapshot,
    serializeReplayStateSnapshot,
} from '../../packages/shared/src/replay/runtime';
import { generateReplayStateHash } from '../../packages/shared/src/replay/stateHash';
import type {
    ReplayCardInstanceId,
    ReplayInitSnapshot,
    ReplayStateSnapshot,
    ReplayVNext,
} from '../../packages/shared/src/replay/types';
import type {
    Card,
    GameAction,
    GameMode,
    GameState,
    GemColor,
    MarketCardRef,
    P2DraftPoolIndices,
    PlayerKey,
} from '../../packages/shared/src/types';

type BridgeStartRequest = {
    kind: 'start';
    mode?: GameMode;
    useBuffs?: boolean;
    seed?: string | number;
    hostPlayer?: PlayerKey;
};

type BridgeApplyRequest = {
    kind: 'apply';
    init: ReplayInitSnapshot;
    state: ReplayStateSnapshot;
    actor?: PlayerKey;
    command: BridgeCommand;
};

type BridgeReplayStateRequest = {
    kind: 'replay-state';
    replay: ReplayVNext;
    revision?: number;
};

type BridgeRequest = BridgeStartRequest | BridgeApplyRequest | BridgeReplayStateRequest;

type BridgeCommand = {
    type: GameAction['type'] | 'BUY_MARKET_CARD' | 'BUY_RESERVED_CARD' | 'SELECT_ROYAL';
    payload?: Record<string, unknown> | string;
    actor?: PlayerKey;
};

type BridgeResponse =
    | {
          ok: true;
          replayRevision: number;
          init: ReplayInitSnapshot;
          state: ReplayStateSnapshot;
          stateHash: string;
          actionType?: GameAction['type'];
      }
    | {
          ok: false;
          replayRevision: number;
          state?: ReplayStateSnapshot;
          stateHash?: string;
          actionType?: string;
          rejection: {
              code: string;
              reason: string;
          };
      };

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const getPayloadObject = (command: BridgeCommand): Record<string, unknown> =>
    typeof command.payload === 'object' && command.payload !== null ? command.payload : {};

const getPayloadCard = (payload: Record<string, unknown>): Card | undefined =>
    payload.card && typeof payload.card === 'object'
        ? (cloneJson(payload.card) as Card)
        : undefined;

const getMarketCard = (state: GameState, marketRef: MarketCardRef): Card => {
    const card = marketRef.isExtra
        ? state.decks[marketRef.level][
              state.decks[marketRef.level].length - ((marketRef.extraIdx ?? 0) + 1)
          ]
        : state.market[marketRef.level][marketRef.idx];
    if (!card) {
        throw new Error('Selected market card does not exist in the current state.');
    }
    return card;
};

const getReservedCard = (state: GameState, actor: PlayerKey, instanceId?: string): Card => {
    const card = getVisibleReservedCards(state.playerReserved[actor]).find((candidate) =>
        instanceId ? candidate.id === instanceId : true
    );
    if (!card) {
        throw new Error('Selected reserved card does not belong to the active player.');
    }
    return card;
};

const toLevel = (value: unknown): 1 | 2 | 3 => {
    if (value === 1 || value === 2 || value === 3) {
        return value;
    }
    throw new Error('Command payload must include level 1, 2, or 3.');
};

const toIndex = (value: unknown): number => {
    if (Number.isInteger(value) && Number(value) >= 0) {
        return Number(value);
    }
    throw new Error('Command payload must include a zero-based index.');
};

const toMarketRef = (payload: Record<string, unknown>): MarketCardRef => {
    const level = toLevel(payload.level);
    const idx = toIndex(payload.idx ?? payload.index);
    if (payload.isExtra === true) {
        return {
            level,
            idx,
            isExtra: true,
            extraIdx: toIndex(payload.extraIdx),
        };
    }
    return { level, idx };
};

const toCoord = (value: unknown): { r: number; c: number } => {
    if (
        value &&
        typeof value === 'object' &&
        Number.isInteger((value as { r?: unknown }).r) &&
        Number.isInteger((value as { c?: unknown }).c)
    ) {
        return {
            r: Number((value as { r: number }).r),
            c: Number((value as { c: number }).c),
        };
    }
    throw new Error('Command payload must include a board coordinate with r and c.');
};

const toOptionalCoord = (value: unknown): { r: number; c: number } | undefined =>
    value === undefined || value === null ? undefined : toCoord(value);

const toCoords = (value: unknown): Array<{ r: number; c: number }> => {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.map(toCoord);
};

const toP2DraftPoolIndices = (value: unknown): P2DraftPoolIndices | undefined => {
    if (
        !Array.isArray(value) ||
        value.length !== 4 ||
        !value.every((candidate) => Number.isInteger(candidate))
    ) {
        return undefined;
    }
    return [Number(value[0]), Number(value[1]), Number(value[2]), Number(value[3])];
};

const toConcreteBonusColor = (value: unknown): Exclude<GemColor, 'gold' | 'empty'> | undefined =>
    value === 'red' ||
    value === 'green' ||
    value === 'blue' ||
    value === 'white' ||
    value === 'black' ||
    value === 'pearl'
        ? value
        : undefined;

const resolveBuyBonusColor = (
    state: GameState,
    card: Card,
    payload: Record<string, unknown>
): GemColor | undefined =>
    card.bonusColor === 'gold' && state.phase === 'SELECT_CARD_COLOR'
        ? (toConcreteBonusColor(payload.bonusColor) ?? card.bonusColor)
        : card.bonusColor;

const buildCardAction = (
    state: GameState,
    command: BridgeCommand,
    actor: PlayerKey
): GameAction => {
    const payload = getPayloadObject(command);
    if (
        command.type === 'BUY_RESERVED_CARD' ||
        (command.type === 'BUY_CARD' && payload.source === 'reserved')
    ) {
        const card =
            getPayloadCard(payload) ??
            getReservedCard(state, actor, payload.instanceId as string | undefined);
        return {
            type: 'BUY_CARD',
            payload: {
                card: {
                    ...cloneJson(card),
                    bonusColor: resolveBuyBonusColor(state, card, payload),
                },
                source: 'reserved',
                ...(payload.randoms ? { randoms: cloneJson(payload.randoms) } : {}),
            },
        };
    }

    if (command.type === 'INITIATE_BUY_JOKER') {
        if (payload.source === 'reserved' || typeof payload.instanceId === 'string') {
            const reservedCard =
                getPayloadCard(payload) ??
                getReservedCard(state, actor, payload.instanceId as string);
            return {
                type: 'INITIATE_BUY_JOKER',
                payload: {
                    card: cloneJson(reservedCard),
                    source: 'reserved',
                },
            };
        }

        const marketInfo = toMarketRef(payload);
        const card = getPayloadCard(payload) ?? getMarketCard(state, marketInfo);
        return {
            type: 'INITIATE_BUY_JOKER',
            payload: {
                card: cloneJson(card),
                source: 'market',
                marketInfo,
            },
        };
    }

    const marketInfo = toMarketRef(payload);
    const card = getPayloadCard(payload) ?? getMarketCard(state, marketInfo);
    return {
        type: 'BUY_CARD',
        payload: {
            card: {
                ...cloneJson(card),
                bonusColor: resolveBuyBonusColor(state, card, payload),
            },
            source: 'market',
            marketInfo,
            ...(payload.randoms ? { randoms: cloneJson(payload.randoms) } : {}),
        },
    };
};

const buildReserveAction = (state: GameState, command: BridgeCommand): GameAction => {
    const payload = getPayloadObject(command);
    if (command.type === 'INITIATE_RESERVE_DECK') {
        return {
            type: 'INITIATE_RESERVE_DECK',
            payload: { level: toLevel(payload.level) },
        };
    }
    if (command.type === 'RESERVE_DECK') {
        return {
            type: 'RESERVE_DECK',
            payload: {
                level: toLevel(payload.level),
                ...(toOptionalCoord(payload.goldCoords)
                    ? { goldCoords: toOptionalCoord(payload.goldCoords) }
                    : {}),
            },
        };
    }

    const marketInfo = toMarketRef(payload);
    const card = getPayloadCard(payload) ?? getMarketCard(state, marketInfo);
    if (command.type === 'INITIATE_RESERVE') {
        return {
            type: 'INITIATE_RESERVE',
            payload: {
                card: cloneJson(card),
                level: marketInfo.level,
                idx: marketInfo.idx,
                ...(marketInfo.isExtra ? { isExtra: true } : {}),
                ...(marketInfo.extraIdx !== undefined ? { extraIdx: marketInfo.extraIdx } : {}),
            },
        };
    }

    return {
        type: 'RESERVE_CARD',
        payload: {
            card: cloneJson(card),
            level: marketInfo.level,
            idx: marketInfo.idx,
            ...(toOptionalCoord(payload.goldCoords)
                ? { goldCoords: toOptionalCoord(payload.goldCoords) }
                : {}),
            ...(marketInfo.isExtra ? { isExtra: true } : {}),
            ...(marketInfo.extraIdx !== undefined ? { extraIdx: marketInfo.extraIdx } : {}),
            ...(payload.isSteal === true ? { isSteal: true } : {}),
        },
    };
};

const buildRoyalAction = (state: GameState, command: BridgeCommand): GameAction => {
    const payload = getPayloadObject(command);
    const payloadCard =
        payload.card && typeof payload.card === 'object'
            ? (cloneJson(payload.card) as Record<string, unknown>)
            : undefined;
    const royalId = String(payload.royalId ?? payload.id ?? payloadCard?.id ?? '');
    const fallbackCard = state.royalDeck[0];
    if (!fallbackCard) {
        throw new Error('No royal card is available in the current state.');
    }
    const card = payloadCard
        ? payloadCard
        : royalId
          ? (state.royalDeck.find((candidate) => candidate.id === royalId) ?? {
                ...cloneJson(fallbackCard),
                id: royalId,
            })
          : fallbackCard;
    return { type: 'SELECT_ROYAL_CARD', payload: { card: cloneJson(card) as never } };
};

const normalizeAction = (
    state: GameState,
    command: BridgeCommand,
    actor: PlayerKey
): GameAction => {
    const payload = getPayloadObject(command);
    switch (command.type) {
        case 'BUY_MARKET_CARD':
        case 'BUY_RESERVED_CARD':
        case 'INITIATE_BUY_JOKER':
        case 'BUY_CARD':
            return buildCardAction(state, command, actor);
        case 'INITIATE_RESERVE':
        case 'INITIATE_RESERVE_DECK':
        case 'RESERVE_CARD':
        case 'RESERVE_DECK':
            return buildReserveAction(state, command);
        case 'SELECT_ROYAL':
        case 'SELECT_ROYAL_CARD':
            return buildRoyalAction(state, command);
        case 'SELECT_BUFF':
            return {
                type: 'SELECT_BUFF',
                payload: {
                    buffId: String(payload.buffId),
                    ...(payload.randomColor ? { randomColor: payload.randomColor as never } : {}),
                    ...(payload.initRandoms ? { initRandoms: cloneJson(payload.initRandoms) } : {}),
                    ...(toP2DraftPoolIndices(payload.p2DraftPoolIndices)
                        ? { p2DraftPoolIndices: toP2DraftPoolIndices(payload.p2DraftPoolIndices) }
                        : {}),
                },
            };
        case 'TAKE_GEMS':
            return { type: 'TAKE_GEMS', payload: { coords: toCoords(payload.coords) } };
        case 'REPLENISH':
            return payload.randoms
                ? { type: 'REPLENISH', payload: { randoms: cloneJson(payload.randoms) } }
                : { type: 'REPLENISH' };
        case 'TAKE_BONUS_GEM':
            return { type: 'TAKE_BONUS_GEM', payload: toCoord(payload) };
        case 'DISCARD_GEM':
            return {
                type: 'DISCARD_GEM',
                payload: String(
                    typeof command.payload === 'string' ? command.payload : payload.gemId
                ),
            };
        case 'STEAL_GEM':
            return { type: 'STEAL_GEM', payload: { gemId: String(payload.gemId) as GemColor } };
        case 'CANCEL_RESERVE':
        case 'ACTIVATE_PRIVILEGE':
        case 'CANCEL_PRIVILEGE':
        case 'FORCE_ROYAL_SELECTION':
        case 'UNDO':
        case 'REDO':
        case 'CLOSE_MODAL':
            return { type: command.type } as GameAction;
        case 'USE_PRIVILEGE':
            return { type: 'USE_PRIVILEGE', payload: toCoord(payload) };
        case 'DISCARD_RESERVED':
            return {
                type: 'DISCARD_RESERVED',
                payload: { cardId: String(payload.cardId ?? payload.instanceId ?? '') },
            };
        case 'PEEK_DECK':
            return { type: 'PEEK_DECK', payload: cloneJson(payload) as never };
        case 'REROLL_DRAFT_POOL':
            return { type: 'REROLL_DRAFT_POOL', payload: cloneJson(payload) as never };
        case 'FORCE_SYNC':
        case 'FLATTEN':
        case 'INIT':
        case 'INIT_DRAFT':
        case 'DEBUG_ADD_CROWNS':
        case 'DEBUG_ADD_POINTS':
        case 'DEBUG_ADD_PRIVILEGE':
            throw new Error(`${command.type} is not accepted through the live Unity rules bridge.`);
        default:
            throw new Error(`Unsupported Unity bridge command: ${(command as BridgeCommand).type}`);
    }
};

const buildStateResponse = (
    state: GameState,
    init: ReplayInitSnapshot,
    replayRevision: number,
    actionType?: GameAction['type'],
    runtimeToInstanceOverride?: Map<string, ReplayCardInstanceId>
): Extract<BridgeResponse, { ok: true }> => {
    const runtimeToInstance =
        runtimeToInstanceOverride ?? buildIdentityRuntimeToInstanceMap(init.cardInstances);
    return {
        ok: true,
        replayRevision,
        init,
        state: serializeReplayStateSnapshot(state, runtimeToInstance),
        stateHash: generateReplayStateHash(state, runtimeToInstance),
        ...(actionType ? { actionType } : {}),
    };
};

const reject = (
    request: BridgeApplyRequest,
    reason: string,
    code = 'COMMAND_REJECTED',
    actionType?: string
): BridgeResponse => {
    const runtimeToInstance = buildIdentityRuntimeToInstanceMap(request.init.cardInstances);
    const state = inflateReplayStateSnapshot(request.state, request.init);
    return {
        ok: false,
        replayRevision: 0,
        state: request.state,
        stateHash: generateReplayStateHash(state, runtimeToInstance),
        actionType,
        rejection: { code, reason },
    };
};

export const handleUnityRulesEngineBridgeRequest = (request: BridgeRequest): BridgeResponse => {
    if (request.kind === 'start') {
        const action = buildStartGameAction(request.mode ?? 'LOCAL_PVP', {
            useBuffs: request.useBuffs ?? false,
            seed: request.seed ?? 'unity-localdev',
            isHost: true,
            hostPlayer: request.hostPlayer ?? 'p1',
        });
        const state = applyAction(INITIAL_STATE_SKELETON, action);
        if (!state) {
            throw new Error('TypeScript rules engine failed to bootstrap a Unity game.');
        }
        const { init, runtimeToInstance } = buildReplayInitSnapshot(action, state);
        return buildStateResponse(state, init, 0, action.type, runtimeToInstance);
    }

    if (request.kind === 'replay-state') {
        const revision = Math.max(
            0,
            Math.min(
                request.revision ?? request.replay.replayRevision,
                request.replay.events.length
            )
        );
        const state = loadReplayStateAtRevision(request.replay, revision);
        return buildStateResponse(state, request.replay.init, revision);
    }

    const state = inflateReplayStateSnapshot(request.state, request.init);
    const runtimeToInstance = buildIdentityRuntimeToInstanceMap(request.init.cardInstances);
    const currentStateHash = generateReplayStateHash(state, runtimeToInstance);
    const actor = request.actor ?? request.command.actor ?? state.turn;
    let action: GameAction;
    try {
        action = normalizeAction(state, request.command, actor);
    } catch (error) {
        return reject(
            request,
            error instanceof Error ? error.message : String(error),
            'COMMAND_NORMALIZATION_FAILED',
            request.command.type
        );
    }

    if (actor !== state.turn && action.type !== 'CLOSE_MODAL') {
        return reject(
            request,
            `Command actor ${actor} does not match active player ${state.turn}.`,
            'INVALID_ACTOR',
            action.type
        );
    }

    const rejectionReason = getActionRejectionReason(state, action);
    if (rejectionReason) {
        return reject(request, rejectionReason, 'COMMAND_REJECTED', action.type);
    }

    const nextState = applyAction(state, action);
    if (!nextState || nextState === state) {
        return reject(
            request,
            `Action ${action.type} did not produce a state transition.`,
            'NO_STATE_TRANSITION',
            action.type
        );
    }

    const nextStateHash = generateReplayStateHash(nextState, runtimeToInstance);
    if (nextStateHash === currentStateHash) {
        return reject(
            request,
            `Action ${action.type} did not change replay state.`,
            'NO_REPLAY_STATE_CHANGE',
            action.type
        );
    }

    return buildStateResponse(nextState, request.init, 0, action.type, runtimeToInstance);
};

const readStdin = async (): Promise<string> => {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf8');
};

const writeAtomicOutput = async (outputPath: string, serialized: string) => {
    const resolvedOutputPath = path.resolve(outputPath);
    const tempOutputPath = `${resolvedOutputPath}.${process.pid}.${Date.now()}.tmp`;
    try {
        await writeFile(tempOutputPath, serialized, 'utf8');
        await rename(tempOutputPath, resolvedOutputPath);
    } catch (error) {
        await rm(tempOutputPath, { force: true });
        throw error;
    }
};

const sleep = (milliseconds: number): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });

const parseCliArgs = (argv: string[]) => {
    const args = [...argv];
    const outputFlagIndex = args.indexOf('--out');
    const outputPath =
        outputFlagIndex >= 0 && args[outputFlagIndex + 1]
            ? args.splice(outputFlagIndex, 2)[1]
            : null;
    const mailboxFlagIndex = args.indexOf('--mailbox');
    const mailboxPath =
        mailboxFlagIndex >= 0 && args[mailboxFlagIndex + 1]
            ? args.splice(mailboxFlagIndex, 2)[1]
            : null;
    return {
        inputPath: args[0] ?? null,
        outputPath,
        mailboxPath,
    };
};

const buildCliErrorResponse = (error: unknown): BridgeResponse => ({
    ok: false,
    replayRevision: 0,
    rejection: {
        code: 'BRIDGE_EXECUTION_FAILED',
        reason: error instanceof Error ? error.message : String(error),
    },
});

const writeCliErrorResponse = async (outputPath: string | null, error: unknown) => {
    if (!outputPath) {
        return;
    }

    const serialized = `${JSON.stringify(buildCliErrorResponse(error), null, 4)}\n`;
    try {
        await writeAtomicOutput(outputPath, serialized);
    } catch (writeError) {
        process.stderr.write(
            `Failed to write structured Unity bridge error response to ${path.resolve(outputPath)}: ${
                writeError instanceof Error ? writeError.stack : String(writeError)
            }\n`
        );
    }
};

const executeCliRequest = async (inputPath: string | null, outputPath: string | null) => {
    const raw = inputPath ? await readFile(path.resolve(inputPath), 'utf8') : await readStdin();
    const request = JSON.parse(raw) as BridgeRequest;
    const response = handleUnityRulesEngineBridgeRequest(request);
    const serialized = `${JSON.stringify(response, null, 4)}\n`;
    if (outputPath) {
        await writeAtomicOutput(outputPath, serialized);
    } else {
        process.stdout.write(serialized);
    }
    if (!response.ok) {
        process.exit(2);
    }
};

const executeMailboxRequest = async (requestPath: string, responsePath: string) => {
    let response: BridgeResponse;
    try {
        const raw = await readFile(requestPath, 'utf8');
        response = handleUnityRulesEngineBridgeRequest(JSON.parse(raw) as BridgeRequest);
    } catch (error) {
        response = buildCliErrorResponse(error);
    }

    await writeAtomicOutput(responsePath, `${JSON.stringify(response, null, 4)}\n`);
    await unlink(requestPath).catch(() => {});
};

const executeMailbox = async (mailboxPath: string) => {
    const mailboxRoot = path.resolve(mailboxPath);
    const requestDirectory = path.join(mailboxRoot, 'requests');
    const responseDirectory = path.join(mailboxRoot, 'responses');
    await mkdir(requestDirectory, { recursive: true });
    await mkdir(responseDirectory, { recursive: true });

    const inFlight = new Set<string>();
    while (true) {
        const files = await readdir(requestDirectory).catch(() => []);
        await Promise.all(
            files
                .filter((fileName) => fileName.endsWith('.json') && !inFlight.has(fileName))
                .map(async (fileName) => {
                    inFlight.add(fileName);
                    try {
                        await executeMailboxRequest(
                            path.join(requestDirectory, fileName),
                            path.join(responseDirectory, fileName)
                        );
                    } finally {
                        inFlight.delete(fileName);
                    }
                })
        );
        await sleep(15);
    }
};

const main = async () => {
    const { inputPath, outputPath, mailboxPath } = parseCliArgs(process.argv.slice(2));
    try {
        if (mailboxPath) {
            await executeMailbox(mailboxPath);
            return;
        }

        await executeCliRequest(inputPath, outputPath);
    } catch (error) {
        await writeCliErrorResponse(outputPath, error);
        throw error;
    }
};

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
    main().catch((error) => {
        process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
        process.exit(1);
    });
}
