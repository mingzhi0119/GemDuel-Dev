import { BONUS_COLORS } from '@gemduel/shared/constants';
import { STANDARD_CARD_SIZE } from '../Card';

export const TABLEAU_STACK_FALLBACK_SCALE = 0.72;
export const TABLEAU_STACK_MIN_SCALE = 0.46;
export const TABLEAU_STACK_GAP_PX = 6;
export const RESERVED_CARD_FALLBACK_SCALE = 0.88;
export const RESERVED_CARD_MIN_SCALE = 0.42;
export const RESERVED_CARD_GAP_PX = 8;

export const PLAYER_ZONE_STACK_OFFSET_Y = Math.round((STANDARD_CARD_SIZE.height / 96) * -2);
export const PLAYER_ZONE_STACK_OFFSET_X = Math.round((STANDARD_CARD_SIZE.width / 72) * 1);

export const PLAYER_ZONE_DISPLAY_COLORS = [...BONUS_COLORS];

export const SUMMARY_TEXT_COLORS: Record<string, string> = {
    blue: '#60a5fa',
    white: '#f8fafc',
    green: '#34d399',
    black: '#94a3b8',
    red: '#f87171',
    pearl: '#f472b6',
    gold: '#fbbf24',
};

export const PLAYER_ZONE_GEM_COLOR_MAP: Record<string, string> = {
    blue: '#60a5fa',
    white: '#f1f5f9',
    green: '#34d399',
    black: '#94a3b8',
    red: '#f87171',
    pearl: '#f472b6',
    gold: '#fbbf24',
};

export const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);
