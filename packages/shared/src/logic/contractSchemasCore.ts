import { z } from 'zod';
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
