import type { CSSProperties } from 'react';
import type { PlayerKey, ThemeName } from '@gemduel/shared/types';
import { isSurfaceThemeVariant, type SurfaceThemeVariant } from './surfaceTheme';

export type PlayerZoneSurfaceVariant = 'none' | SurfaceThemeVariant;

export const getPlayerZoneSurfaceVariant = (): PlayerZoneSurfaceVariant => {
    if (typeof window === 'undefined') {
        return 'none';
    }

    const rawVariant = new URLSearchParams(window.location.search).get('playerZoneBg');

    if (!rawVariant) {
        return 'none';
    }

    return isSurfaceThemeVariant(rawVariant) ? (rawVariant as PlayerZoneSurfaceVariant) : 'none';
};

export const createPlayerZoneSurfaceStyle = (
    theme: ThemeName,
    variant: PlayerZoneSurfaceVariant,
    player: PlayerKey
): CSSProperties | undefined => {
    if (variant === 'none') {
        return undefined;
    }

    if (!isSurfaceThemeVariant(variant)) {
        return undefined;
    }

    const path = `/assets/surfaces/anime-themes/${variant}/${theme}/player-zone.png`;

    return {
        backgroundColor: 'transparent',
        backgroundImage: `url("${path}")`,
        backgroundPosition: player === 'p1' ? 'left center' : 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    };
};
