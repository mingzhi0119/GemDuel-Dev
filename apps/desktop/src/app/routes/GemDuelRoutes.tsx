import React, { Suspense } from 'react';
import { isDraftSelectionPhase } from '@gemduel/shared/logic/fsm';
import type { AppRouteProps } from '@app/types/ui';
import type { ThemeName } from '@gemduel/shared/types';
import { DesktopStage } from '../layout/DesktopStage';
import { getVisualLabMode } from '../visual-lab/visualLabMode';

const DraftScreen = React.lazy(() =>
    import('@gemduel/ui/components/DraftScreen').then((module) => ({ default: module.DraftScreen }))
);
const GameConfigMenu = React.lazy(() =>
    import('@gemduel/ui/components/GameConfigMenu').then((module) => ({
        default: module.GameConfigMenu,
    }))
);
const OnlineMenu = React.lazy(() =>
    import('@gemduel/ui/components/OnlineMenu').then((module) => ({ default: module.OnlineMenu }))
);
const LanMenu = React.lazy(() =>
    import('@gemduel/ui/components/LanMenu').then((module) => ({ default: module.LanMenu }))
);
const GameShell = React.lazy(() =>
    import('../shell/GameShell').then((module) => ({ default: module.GameShell }))
);
const VisualLabRoute = React.lazy(() =>
    import('../visual-lab/VisualLabRoute').then((module) => ({
        default: module.VisualLabRoute,
    }))
);

type RouteKind = 'config' | 'online' | 'lan' | 'draft' | 'game';

const getDesktopViewportPresentation = (routeKind: RouteKind, theme: ThemeName) => {
    void theme;
    if (routeKind === 'game') {
        return {
            viewportClassName:
                'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f111a] to-black text-slate-200 transition-colors duration-500',
        };
    }

    if (routeKind === 'online' || routeKind === 'lan') {
        return {
            viewportClassName: 'bg-slate-950 text-slate-100 transition-colors duration-500',
        };
    }

    return {
        viewportClassName: 'bg-slate-950 text-slate-100 transition-colors duration-500',
    };
};

const getRouteFallback = (routeKind: RouteKind, theme: ThemeName) => {
    void theme;

    const fallbackClassName =
        routeKind === 'game'
            ? 'h-full w-full bg-slate-950/95'
            : routeKind === 'online'
              ? 'h-full w-full bg-slate-950'
              : 'h-full w-full bg-slate-950';

    return <div className={fallbackClassName} />;
};

export function GemDuelRoutes(props: AppRouteProps) {
    const { game, theme, ui, setters } = props;
    const { state, handlers, historyControls, online } = game;
    const visualLabMode = getVisualLabMode();
    let routeContent: React.ReactNode;
    let routeKind: RouteKind;

    if (visualLabMode) {
        routeKind = 'game';
        routeContent = <VisualLabRoute {...props} mode={visualLabMode} />;
    } else if (isDraftSelectionPhase(state.phase)) {
        routeKind = 'draft';
        const activeDraftLevel =
            state.turn === 'p2' ? state.p2DraftLevel || state.buffLevel : state.buffLevel;
        routeContent = (
            <DraftScreen
                draftPool={state.draftPool}
                p2DraftPool={state.p2DraftPool}
                activeDraftLevel={activeDraftLevel}
                mode={state.mode}
                activePlayer={state.turn}
                onSelectBuff={handlers.handleSelectBuff}
                onReroll={
                    state.mode !== 'ONLINE_MULTIPLAYER' ? handlers.handleRerollBuffs : undefined
                }
                theme={theme}
                localPlayer={state.localPlayer}
            />
        );
    } else if (historyControls.historyLength === 0) {
        if (ui.matchmakingRoute === 'online') {
            routeKind = 'online';
            routeContent = (
                <OnlineMenu
                    onBack={() => setters.setMatchmakingRoute('none')}
                    online={online}
                    startGame={handlers.startGame}
                    theme={theme}
                />
            );
        } else if (ui.matchmakingRoute === 'lan') {
            routeKind = 'lan';
            routeContent = (
                <LanMenu
                    onBack={() => {
                        void props.lan.cancelSearch();
                        setters.setMatchmakingRoute('none');
                    }}
                    onRetry={() => {
                        void props.lan.startSearch();
                    }}
                    onSelectMode={(mode) => {
                        void props.lan.selectMode(mode);
                    }}
                    onConfirmStart={() => {
                        void props.lan.confirmStart();
                    }}
                    lan={props.lan.state}
                    theme={theme}
                />
            );
        } else {
            routeKind = 'config';
            routeContent = (
                <GameConfigMenu
                    onOnlineSetup={() => setters.setMatchmakingRoute('online')}
                    onLanSetup={() => setters.setMatchmakingRoute('lan')}
                    onStartGame={handlers.startGame}
                    onOpenVisualLab={props.callbacks.openVisualLab}
                    theme={theme}
                />
            );
        }
    } else {
        routeKind = 'game';
        routeContent = <GameShell {...props} />;
    }

    const suspenseContent = (
        <Suspense fallback={getRouteFallback(routeKind, theme)}>{routeContent}</Suspense>
    );

    if (props.layout.layoutMode === 'desktop-4k') {
        return (
            <DesktopStage
                layout={props.layout}
                {...getDesktopViewportPresentation(routeKind, theme)}
            >
                {suspenseContent}
            </DesktopStage>
        );
    }

    return suspenseContent;
}
