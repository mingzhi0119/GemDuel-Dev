import type { CSSProperties } from 'react';
import type { PlayerKey, ThemeName } from '@gemduel/shared/types';
import type { SurfaceThemeVariant } from './surfaceTheme';

export type PlayerZoneSurfaceVariant = 'none' | SurfaceThemeVariant;

const PLAYER_ZONE_SURFACE_VARIANTS = new Set<PlayerZoneSurfaceVariant>([
    'none',
    'default',
    'wood',
    'royal',
    'minimal',
    'geek',
]);

const PLAYER_ZONE_SURFACE_LABELS: Record<PlayerZoneSurfaceVariant, string> = {
    none: 'none',
    default: 'default',
    wood: 'wood',
    royal: 'royal',
    minimal: 'minimal',
    geek: 'geek',
};

export const getPlayerZoneSurfaceVariant = (): PlayerZoneSurfaceVariant => {
    if (typeof window === 'undefined') {
        return 'none';
    }

    const rawVariant = new URLSearchParams(window.location.search).get('playerZoneBg');

    if (!rawVariant) {
        return 'none';
    }

    return PLAYER_ZONE_SURFACE_VARIANTS.has(rawVariant as PlayerZoneSurfaceVariant)
        ? (rawVariant as PlayerZoneSurfaceVariant)
        : 'none';
};

export const createPlayerZoneSurfaceStyle = (
    theme: ThemeName,
    variant: PlayerZoneSurfaceVariant,
    player: PlayerKey
): CSSProperties | undefined => {
    if (variant === 'none' || variant === 'default') {
        return undefined;
    }

    const path = `/assets/surfaces/player-zones/${theme}/${PLAYER_ZONE_SURFACE_LABELS[variant]}.png`;
    const overlay =
        theme === 'dark'
            ? 'linear-gradient(180deg, rgba(15,23,42,0.42) 0%, rgba(2,6,23,0.28) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(241,245,249,0.48) 100%)';

    return {
        backgroundImage: `${overlay}, url("${path}")`,
        backgroundPosition: `center, ${player === 'p1' ? 'left center' : 'right center'}`,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundSize: 'cover, cover',
    };
};
