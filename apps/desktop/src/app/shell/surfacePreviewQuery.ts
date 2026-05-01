import { isSurfaceThemeVariant, type SurfaceThemeVariant } from './surfaceTheme';

const SURFACE_PREVIEW_ARTWORK_QUERY_KEYS = [
    'surfaceAnime',
    'surfaceTheme',
    'surfaceStyle',
    'surfaceAnimeVariant',
    'surfaceVariant',
    'cardBackBg',
    'cardBackStyle',
    'surfaceCardBack',
    'cardBackBgVariant',
    'cardBackVariant',
    'shellBg',
    'shellBackground',
    'backgroundBg',
    'surfaceBg',
    'shellBgVariant',
    'backgroundBgVariant',
    'backgroundVariant',
    'playerZoneBg',
    'playerZoneSurface',
    'surfacePlayerZone',
    'playerZoneBgVariant',
    'playerZoneVariant',
    'surfacePlayerZoneVariant',
    'gemPanelBg',
    'gemPanelSurface',
    'surfaceGemPanel',
    'gemPanelBgVariant',
    'gemPanelVariant',
    'surfaceGemPanelVariant',
    'marketCardBack',
    'marketDeckBack',
    'marketBack',
    'surfaceMarketCardBack',
    'marketCardBackVariant',
    'marketDeckBackVariant',
    'marketCardBackL1',
    'marketDeckBackL1',
    'marketL1Back',
    'l1CardBack',
    'marketCardBackL1Variant',
    'marketDeckBackL1Variant',
    'marketL1BackVariant',
    'l1CardBackVariant',
    'marketCardBackL2',
    'marketDeckBackL2',
    'marketL2Back',
    'l2CardBack',
    'marketCardBackL2Variant',
    'marketDeckBackL2Variant',
    'marketL2BackVariant',
    'l2CardBackVariant',
    'marketCardBackL3',
    'marketDeckBackL3',
    'marketL3Back',
    'l3CardBack',
    'marketCardBackL3Variant',
    'marketDeckBackL3Variant',
    'marketL3BackVariant',
    'l3CardBackVariant',
    'royalCardBack',
    'royalBack',
    'surfaceRoyalCardBack',
    'royalCardBackVariant',
    'royalBackVariant',
] as const;

export const clearSurfacePreviewArtworkQuery = () => {
    if (typeof window === 'undefined') {
        return;
    }

    const url = new URL(window.location.href);
    let changed = false;
    SURFACE_PREVIEW_ARTWORK_QUERY_KEYS.forEach((key) => {
        if (url.searchParams.has(key)) {
            url.searchParams.delete(key);
            changed = true;
        }
    });

    if (changed) {
        window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
};

export const getSurfacePreviewStartMode = (): 'local' | 'pve' | undefined => {
    if (typeof window === 'undefined') {
        return undefined;
    }

    const rawMode = new URLSearchParams(window.location.search).get('surfacePreviewStart');
    return rawMode === 'local' || rawMode === 'pve' ? rawMode : undefined;
};

export const getSurfacePreviewVariant = (): SurfaceThemeVariant | undefined => {
    if (typeof window === 'undefined') {
        return undefined;
    }

    const params = new URLSearchParams(window.location.search);
    const rawVariant =
        params.get('surfaceTheme') ?? params.get('surfaceAnime') ?? params.get('surfaceStyle');

    return isSurfaceThemeVariant(rawVariant) ? rawVariant : undefined;
};

export const getShouldShowGemPanelCalibrationOverlay = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    const params = new URLSearchParams(window.location.search);
    const rawValue =
        params.get('surfaceGemCalibration') ??
        params.get('gemPanelCalibration') ??
        params.get('surfaceCalibration');

    return rawValue === '1' || rawValue === 'true';
};
