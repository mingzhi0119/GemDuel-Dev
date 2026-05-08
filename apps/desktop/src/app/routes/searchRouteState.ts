import type { AppVisualLabMode, MatchmakingRoute, StartSetupRoute } from '../../types/ui';
import { getVisualLabMode } from '../visual-lab/visualLabMode';

export interface AppSearchRouteState {
    setupRoute: StartSetupRoute;
    matchmakingRoute: MatchmakingRoute;
    visualLabMode: AppVisualLabMode | null;
}

export const EMPTY_SEARCH_ROUTE: AppSearchRouteState = {
    setupRoute: 'none',
    matchmakingRoute: 'none',
    visualLabMode: null,
};

export const readSearchRouteState = (): AppSearchRouteState => {
    if (typeof window === 'undefined') {
        return EMPTY_SEARCH_ROUTE;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const rawSetup = searchParams.get('setup');
    const rawMatchmaking = searchParams.get('matchmaking');
    const visualLabMode = getVisualLabMode() as AppVisualLabMode | null;

    if (visualLabMode) {
        return {
            setupRoute: 'none',
            matchmakingRoute: 'none',
            visualLabMode,
        };
    }

    if (rawMatchmaking === 'online' || rawMatchmaking === 'lan') {
        return {
            setupRoute: 'none',
            matchmakingRoute: rawMatchmaking,
            visualLabMode: null,
        };
    }

    if (rawSetup === 'classic' || rawSetup === 'roguelike') {
        return {
            setupRoute: rawSetup,
            matchmakingRoute: 'none',
            visualLabMode: null,
        };
    }

    return EMPTY_SEARCH_ROUTE;
};

export const buildSearchRouteUrl = (route: AppSearchRouteState) => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete('setup');
    nextUrl.searchParams.delete('matchmaking');
    nextUrl.searchParams.delete('visualLab');

    if (route.visualLabMode) {
        nextUrl.searchParams.set('visualLab', route.visualLabMode);
    } else if (route.matchmakingRoute !== 'none') {
        nextUrl.searchParams.set('matchmaking', route.matchmakingRoute);
    } else if (route.setupRoute !== 'none') {
        nextUrl.searchParams.set('setup', route.setupRoute);
    }

    const search = nextUrl.searchParams.toString();
    return `${nextUrl.pathname}${search ? `?${search}` : ''}${nextUrl.hash}`;
};

export const writeSearchRouteHistory = (
    route: AppSearchRouteState,
    mode: 'push' | 'replace' = 'push'
) => {
    if (typeof window === 'undefined') {
        return;
    }

    const nextUrl = buildSearchRouteUrl(route);
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (currentUrl === nextUrl) {
        return;
    }

    if (mode === 'replace') {
        window.history.replaceState(null, '', nextUrl);
    } else {
        window.history.pushState(null, '', nextUrl);
    }
};
