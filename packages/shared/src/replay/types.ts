import type {
    BasicGemColor,
    BuffLevel,
    CardActionSource,
    DraftLevel,
    GameMode,
    GamePhase,
    GemColor,
    PlayerInitRandoms,
    PlayerKey,
    P2DraftPoolIndices,
} from '../types';

export const REPLAY_VNEXT_SCHEMA_VERSION = '1.0' as const;

export type ReplaySchemaVersion = typeof REPLAY_VNEXT_SCHEMA_VERSION;
export type ReplaySummaryDerivedFrom = 'writer' | 'recomputed';
export type ReplaySummaryIntegrity = 'unchecked' | 'ok' | 'mismatch';
export type ReplayDetectedVersion =
    | ReplaySchemaVersion
    | 'legacy-history'
    | 'unknown'
    | 'unsupported-vnext';
export type ReplayEndReason = 'normal' | 'surrender' | 'disconnect' | 'aborted' | null;
export type ReplayGemId = GemColor | 'empty';
export type ReplayBonusColor = GemColor | 'null';
export type ReplayCardInstanceId = `c:${string}#${number}`;
export type ReplayCardTemplateId = string;
export type ReplayRoyalId = string;
export type ReplayRevision = number;

export interface ReplayBuffRef {
    id: string;
    level: 0 | BuffLevel;
    state?: Record<string, unknown>;
}

export interface ReplayPlayers {
    p1: { buff: ReplayBuffRef };
    p2: { buff: ReplayBuffRef };
}

export interface ReplayMatchInfo {
    mode: GameMode;
    seed: string | number | null;
    started: boolean;
    ended: boolean;
    winner: PlayerKey | null;
    endReason: ReplayEndReason;
}

export type ReplayMarketRef =
    | {
          level: 1 | 2 | 3;
          idx: number;
          isExtra?: false;
          extraIdx?: undefined;
      }
    | {
          level: 3;
          idx: number;
          isExtra: true;
          extraIdx: number;
      };

export interface ReplayCardInstances {
    [instanceId: ReplayCardInstanceId]: ReplayCardTemplateId;
}

export interface ReplayInitSnapshot {
    actionType: 'INIT' | 'INIT_DRAFT';
    mode: GameMode;
    hostPlayer: PlayerKey;
    board: ReplayGemId[][];
    bag: ReplayGemId[];
    market: {
        1: Array<ReplayCardInstanceId | null>;
        2: Array<ReplayCardInstanceId | null>;
        3: Array<ReplayCardInstanceId | null>;
    };
    decks: {
        1: ReplayCardInstanceId[];
        2: ReplayCardInstanceId[];
        3: ReplayCardInstanceId[];
    };
    cardInstances: ReplayCardInstances;
    initRandoms: Record<PlayerKey, PlayerInitRandoms>;
    buffLevel?: BuffLevel;
    draftPool?: string[];
    royalDeck: ReplayRoyalId[];
}

export interface ReplayTableauInstanceCard {
    kind: 'instance';
    instanceId: ReplayCardInstanceId;
}

export interface ReplayTableauBuffCard {
    kind: 'buff_dummy';
    cardId: string;
    bonusColor: GemColor;
    bonusCount: number;
}

export type ReplayTableauCard = ReplayTableauInstanceCard | ReplayTableauBuffCard;

export interface ReplayPendingReserveSnapshot {
    instanceId?: ReplayCardInstanceId;
    level: 1 | 2 | 3;
    idx?: number;
    isDeck?: boolean;
}

export interface ReplayPendingBuySnapshot {
    instanceId: ReplayCardInstanceId;
    source: CardActionSource;
    marketRef?: ReplayMarketRef;
}

export interface ReplayAbilityResolutionSnapshot {
    nextPlayer: PlayerKey;
    pending: string[];
    resolved: string[];
    bonusGemColor?: GemColor;
    deferredEchoWrite?: {
        holder: PlayerKey;
        abilities: string[];
        bonusColor?: GemColor;
    };
}

export interface ReplayStateSnapshot {
    board: ReplayGemId[][];
    bag: ReplayGemId[];
    turn: PlayerKey;
    phase: GamePhase;
    mode: GameMode;
    winner: PlayerKey | null;
    market: ReplayInitSnapshot['market'];
    decks: ReplayInitSnapshot['decks'];
    playerTableau: Record<PlayerKey, ReplayTableauCard[]>;
    playerReserved: Record<PlayerKey, ReplayCardInstanceId[]>;
    playerRoyals: Record<PlayerKey, ReplayRoyalId[]>;
    inventories: Record<PlayerKey, Record<GemColor | 'gold' | 'pearl', number>>;
    privileges: Record<PlayerKey, number>;
    royalDeck: ReplayRoyalId[];
    royalMilestones: Record<PlayerKey, Record<number, boolean>>;
    extraPoints: Record<PlayerKey, number>;
    extraCrowns: Record<PlayerKey, number>;
    extraAllocation: Record<PlayerKey, Record<GemColor | 'gold' | 'pearl', number>>;
    extraPrivileges: Record<PlayerKey, number>;
    playerBuffs: ReplayPlayers;
    draftPool: string[];
    p2DraftPool?: string[];
    p1SelectedBuffId?: string | null;
    draftOrder: PlayerKey[];
    buffLevel: DraftLevel;
    p2DraftLevel: DraftLevel;
    privilegeGemCount: number;
    pendingReserve: ReplayPendingReserveSnapshot | null;
    pendingBuy: ReplayPendingBuySnapshot | null;
    bonusGemTarget: ReplayGemId | null;
    nextPlayerAfterRoyal: PlayerKey | null;
    pendingExtraTurn: boolean;
    playerTurnCounts: Record<PlayerKey, number>;
    abilityResolution: ReplayAbilityResolutionSnapshot | null;
}

export interface ReplayCheckpoint {
    revision: ReplayRevision;
    state: ReplayStateSnapshot;
}

interface ReplayBaseEvent {
    actor: PlayerKey;
}

export interface ReplaySelectBuffEvent extends ReplayBaseEvent {
    type: 'select_buff';
    buffId: string;
    randomColor?: BasicGemColor;
    initRandoms?: Partial<Record<PlayerKey, PlayerInitRandoms>>;
    p2DraftPoolIndices?: P2DraftPoolIndices;
}

export interface ReplayTakeGemsEvent extends ReplayBaseEvent {
    type: 'take_gems';
    coords: Array<{ r: number; c: number }>;
}

export interface ReplayReplenishEvent extends ReplayBaseEvent {
    type: 'replenish';
    randoms?: {
        extortionColor?: GemColor;
        expansionColor?: GemColor;
    };
}

export interface ReplayTakeBonusGemEvent extends ReplayBaseEvent {
    type: 'take_bonus_gem';
    coord: { r: number; c: number };
}

export interface ReplayDiscardGemEvent extends ReplayBaseEvent {
    type: 'discard_gem';
    gemId: GemColor;
}

export interface ReplayStealGemEvent extends ReplayBaseEvent {
    type: 'steal_gem';
    gemId: GemColor;
}

export interface ReplayBuyCardEvent extends ReplayBaseEvent {
    type: 'buy_card';
    instanceId: ReplayCardInstanceId;
    source: CardActionSource;
    marketRef?: ReplayMarketRef;
    bonusColor: ReplayBonusColor;
    randoms?: {
        bountyHunterColor?: GemColor;
    };
}

export interface ReplayReserveCardEvent extends ReplayBaseEvent {
    type: 'reserve_card';
    instanceId: ReplayCardInstanceId;
    level: 1 | 2 | 3;
    marketRef: ReplayMarketRef;
    goldCoord?: { r: number; c: number };
    isExtra?: boolean;
    extraIdx?: number;
    isSteal?: boolean;
}

export interface ReplayReserveDeckEvent extends ReplayBaseEvent {
    type: 'reserve_deck';
    level: 1 | 2 | 3;
    goldCoord?: { r: number; c: number };
}

export interface ReplayDiscardReservedEvent extends ReplayBaseEvent {
    type: 'discard_reserved';
    instanceId: ReplayCardInstanceId;
}

export interface ReplayUsePrivilegeEvent extends ReplayBaseEvent {
    type: 'use_privilege';
    coord: { r: number; c: number };
}

export interface ReplaySelectRoyalEvent extends ReplayBaseEvent {
    type: 'select_royal';
    royalId: ReplayRoyalId;
}

export type ReplayEvent =
    | ReplaySelectBuffEvent
    | ReplayTakeGemsEvent
    | ReplayReplenishEvent
    | ReplayTakeBonusGemEvent
    | ReplayDiscardGemEvent
    | ReplayStealGemEvent
    | ReplayBuyCardEvent
    | ReplayReserveCardEvent
    | ReplayReserveDeckEvent
    | ReplayDiscardReservedEvent
    | ReplayUsePrivilegeEvent
    | ReplaySelectRoyalEvent;

export interface ReplaySummary {
    turnCount: number;
    totalEvents: number;
    eventsByType: Record<ReplayEvent['type'], number>;
    eventsByPlayer: Record<PlayerKey, number>;
    winner: PlayerKey | null;
    endReason: ReplayEndReason;
    finalScores: Record<PlayerKey, number>;
    finalCrowns: Record<PlayerKey, number>;
    finalGemTotals: Record<PlayerKey, number>;
    finalStateHash: string;
    summaryDerivedFrom: ReplaySummaryDerivedFrom;
}

export interface ReplayVNext {
    schemaVersion: ReplaySchemaVersion;
    replayRevision: ReplayRevision;
    gameVersion: string;
    createdAt: string;
    match: ReplayMatchInfo;
    players: ReplayPlayers;
    init: ReplayInitSnapshot;
    events: ReplayEvent[];
    checkpoints?: ReplayCheckpoint[];
    summary: ReplaySummary;
}

export interface ReplayReadDiagnostics {
    detectedVersion: ReplayDetectedVersion;
    summaryIntegrity: ReplaySummaryIntegrity;
}

export class ReplayFormatError extends Error {
    readonly code:
        | 'UNSUPPORTED_REPLAY_VERSION'
        | 'REPLAY_FILE_INVALID_SCHEMA'
        | 'REPLAY_FILE_INVALID_JSON';
    readonly detectedVersion?: ReplayDetectedVersion;

    constructor(
        code:
            | 'UNSUPPORTED_REPLAY_VERSION'
            | 'REPLAY_FILE_INVALID_SCHEMA'
            | 'REPLAY_FILE_INVALID_JSON',
        message: string,
        detectedVersion?: ReplayDetectedVersion
    ) {
        super(message);
        this.name = 'ReplayFormatError';
        this.code = code;
        this.detectedVersion = detectedVersion;
    }
}

export interface LoadedReplaySession {
    replay: ReplayVNext;
    history: import('../types').GameAction[];
    finalState: import('../types').GameState;
    finalStateHash: string;
}

export interface EvaluationMetric {
    score: number;
    note: string;
}

export interface EvaluationReport {
    winnerConsistency: EvaluationMetric;
    actionLegality: EvaluationMetric;
    tempo: EvaluationMetric;
    resourceEfficiency: EvaluationMetric;
    buffImpact: EvaluationMetric;
    confidence: number;
}

export interface ReplayReaderOptions {
    verifySummary?: 'none' | 'sample' | 'full';
}

export interface ReplaySummaryOptions {
    recompute?: boolean;
}

export interface ReplaySaveInput {
    replayRevision: ReplayRevision;
    gameVersion: string;
    createdAt: string;
    init: ReplayInitSnapshot;
    events: ReplayEvent[];
    checkpoints?: ReplayCheckpoint[];
    currentState: import('../types').GameState;
    runtimeToInstance: Map<string, ReplayCardInstanceId>;
    endReason?: ReplayEndReason;
}

export interface ReplayRecorderState {
    replayRevision: ReplayRevision;
    gameVersion: string;
    createdAt: string;
    init: ReplayInitSnapshot | null;
    events: ReplayEvent[];
    checkpoints: ReplayCheckpoint[];
}

export interface ReplayFullSync {
    kind: 'full';
    replayRevision: ReplayRevision;
    replay: ReplayVNext;
}

export interface ReplayDeltaSync {
    kind: 'delta';
    fromRevision: ReplayRevision;
    toRevision: ReplayRevision;
    events: ReplayEvent[];
    checkpoint?: ReplayCheckpoint;
    stateHashAfter: string;
}

export type ReplaySync = ReplayFullSync | ReplayDeltaSync;
export type ReplaySimulationMode = Extract<GameMode, 'LOCAL_PVP' | 'PVE'>;
export type ReplaySimulationAbortReason = 'max_actions' | 'no_action' | 'state_stall';
export type ReplaySimulationStatus = 'completed' | 'aborted';

export interface ReplaySimulationOptions {
    gameVersion: string;
    useBuffs?: boolean;
    mode?: ReplaySimulationMode;
    maxActions?: number;
    createdAt?: string;
    hostPlayer?: PlayerKey;
}

export interface ReplaySimulationResult {
    replay: ReplayVNext;
    summary: ReplaySummary;
    evaluation: EvaluationReport;
    finalState: import('../types').GameState;
    finalStateHash: string;
    history: import('../types').GameAction[];
    status: ReplaySimulationStatus;
    abortReason: ReplaySimulationAbortReason | null;
    actionsExecuted: number;
}

export interface ReplayAuditExpectation {
    fileName?: string;
    winner?: PlayerKey | null;
    endReason?: ReplayEndReason;
    turnCount?: number;
    totalEvents?: number;
    finalStateHash?: string;
    confidence?: number;
}

export interface ReplayAuditInput {
    id?: string;
    value: string | ReplayVNext;
    expected?: ReplayAuditExpectation;
    verifySummary?: ReplayReaderOptions['verifySummary'];
    confidenceEpsilon?: number;
}

export interface ReplayAuditMismatch {
    field: string;
    expected: unknown;
    actual: unknown;
}

export interface ReplayAuditError {
    code: ReplayFormatError['code'] | 'REPLAY_AUDIT_EXCEPTION';
    message: string;
    detectedVersion?: ReplayDetectedVersion;
}

export interface ReplayAuditResult {
    id?: string;
    ok: boolean;
    diagnostics?: ReplayReadDiagnostics;
    loadedFinalStateHash?: string;
    loadedWinner?: PlayerKey | null;
    recomputedSummary?: ReplaySummary;
    evaluation?: EvaluationReport;
    mismatches: ReplayAuditMismatch[];
    error?: ReplayAuditError;
}

export interface ReplayBatchAuditResult {
    ok: boolean;
    auditedCount: number;
    passedCount: number;
    failedCount: number;
    mismatchCounts: Record<string, number>;
    errorCounts: Record<string, number>;
    results: ReplayAuditResult[];
}
