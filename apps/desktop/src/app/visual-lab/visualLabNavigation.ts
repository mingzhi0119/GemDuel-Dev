import type { AppVisualLabMode } from '../../types/ui';
import { EMPTY_SEARCH_ROUTE, type AppSearchRouteState } from '../routes/searchRouteState';

type NavigateSearchRoute = (route: AppSearchRouteState, mode?: 'push' | 'replace') => void;

export const createVisualLabNavigation = (
    markVisualLabOpened: () => void,
    navigateSearchRoute: NavigateSearchRoute
) => ({
    handleOpenVisualLab: (mode: AppVisualLabMode) => {
        markVisualLabOpened();
        navigateSearchRoute(
            {
                setupRoute: 'none',
                matchmakingRoute: 'none',
                visualLabMode: mode,
            },
            'push'
        );
    },
    handleCloseVisualLabToStartPage: () => navigateSearchRoute(EMPTY_SEARCH_ROUTE, 'replace'),
});
