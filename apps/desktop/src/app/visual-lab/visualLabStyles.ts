import type { CSSProperties } from 'react';
import type { GemPanelSkin, PlayerKey, ResponsiveLayout, ThemeName } from '@gemduel/shared/types';
import { calculateGemPanelCellCentersFromIntersections } from '@gemduel/ui/components/gameBoard/gemPanelLayout';
import type {
    CardBackArtwork,
    MarketDeckBackArtworkMap,
} from '@gemduel/ui/components/card/cardBackArtwork';
import type { PlayerZoneSurfaceArtwork } from '@gemduel/ui/components/playerZone/types';
import { createGameShellStyles, type GameShellStyles } from '../shell/gameShellStyles';
import {
    DESKTOP_SHELL_ARTWORK_HEIGHT_PX,
    DESKTOP_TOP_BAR_HEIGHT_PX,
} from '../layout/desktopLayoutContract';
import type { SurfaceLabCandidate, SurfaceLabSlot } from './surfaceLabTypes';

const CANDIDATE_GEM_PANEL_GRID_LINES = {
    x: [100, 305, 515, 726, 938, 1141].map((value) => value / 1254),
    y: [104, 308, 512, 717, 917, 1132].map((value) => value / 1254),
};

const CANDIDATE_GEM_PANEL_SKIN_BASE = {
    id: 'surface-lab-candidate',
    intrinsicWidthPx: 1254,
    intrinsicHeightPx: 1254,
};

export interface VisualLabShellStyles extends GameShellStyles {
    playerZoneSurfaceStyle: (player: PlayerKey) => CSSProperties;
    playerZoneSurfaceArtwork: (player: PlayerKey) => PlayerZoneSurfaceArtwork;
    royalCardBackArtwork: CardBackArtwork;
}

const getSlotArtwork = (
    assetSlots: Record<SurfaceLabSlot, SurfaceLabCandidate>,
    slot: SurfaceLabSlot
) => assetSlots[slot].archiveUrl;

const createCandidateGemPanelSkin = (artworkPath: string): GemPanelSkin => {
    const cellGridLinesNormalized = {
        x: [...CANDIDATE_GEM_PANEL_GRID_LINES.x],
        y: [...CANDIDATE_GEM_PANEL_GRID_LINES.y],
    };

    return {
        ...CANDIDATE_GEM_PANEL_SKIN_BASE,
        artworkPath,
        playfieldRectNormalized: {
            left: cellGridLinesNormalized.x[0],
            top: cellGridLinesNormalized.y[0],
            right: cellGridLinesNormalized.x[5],
            bottom: cellGridLinesNormalized.y[5],
        },
        cellCentersNormalized:
            calculateGemPanelCellCentersFromIntersections(cellGridLinesNormalized),
        cellGridLinesNormalized,
        gemDiameterNormalized: 0.13,
    };
};

const createImageSurfaceStyle = (
    archiveUrl: string,
    options: {
        backgroundColor?: string;
        backgroundSize?: string;
        backgroundPosition?: string;
        boxShadow?: string;
    } = {}
): CSSProperties => ({
    backgroundColor: options.backgroundColor ?? 'transparent',
    backgroundImage: `url("${archiveUrl}")`,
    backgroundSize: options.backgroundSize ?? 'cover',
    backgroundPosition: options.backgroundPosition ?? 'center',
    backgroundRepeat: 'no-repeat',
    boxShadow: options.boxShadow,
});

const createTransparentTopBarSurfaceStyle = (): CSSProperties => ({
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    backgroundRepeat: 'no-repeat',
    height: `${DESKTOP_TOP_BAR_HEIGHT_PX}px`,
    borderColor: 'rgba(250,204,21,0.18)',
    boxShadow: 'inset 0 -1px 0 rgba(250,204,21,0.12)',
});

export const createVisualLabShellStyles = (
    theme: ThemeName,
    layout: ResponsiveLayout,
    assetSlots: Record<SurfaceLabSlot, SurfaceLabCandidate>,
    playerZoneSideSlots: Partial<Record<PlayerKey, SurfaceLabCandidate>> = {}
): VisualLabShellStyles => {
    const base = createGameShellStyles(theme, layout);
    const marketDeckBackArtwork: MarketDeckBackArtworkMap = {
        1: {
            path: getSlotArtwork(assetSlots, 'market-card-back-l1'),
            variant: assetSlots['market-card-back-l1'].promptId,
        },
        2: {
            path: getSlotArtwork(assetSlots, 'market-card-back-l2'),
            variant: assetSlots['market-card-back-l2'].promptId,
        },
        3: {
            path: getSlotArtwork(assetSlots, 'market-card-back-l3'),
            variant: assetSlots['market-card-back-l3'].promptId,
        },
    };

    return {
        ...base,
        shellStyle: {
            ...base.shellStyle,
            ...createImageSurfaceStyle(getSlotArtwork(assetSlots, 'shell-background'), {
                backgroundColor: '#020617',
                backgroundPosition: 'top center',
                backgroundSize: `100% ${DESKTOP_SHELL_ARTWORK_HEIGHT_PX}px`,
            }),
        },
        topBarSurfaceStyle: createTransparentTopBarSurfaceStyle(),
        gemBoardSurfaceStyle: createImageSurfaceStyle(getSlotArtwork(assetSlots, 'gem-panel'), {
            backgroundSize: '100% 100%',
            boxShadow: '0 18px 36px rgba(0,0,0,0.32)',
        }),
        gemPanelSkin: createCandidateGemPanelSkin(getSlotArtwork(assetSlots, 'gem-panel')),
        marketDeckBackArtwork,
        playerZoneSurfaceStyle: (player) =>
            createImageSurfaceStyle(getSlotArtwork(assetSlots, 'player-zone'), {
                backgroundPosition: player === 'p1' ? 'left center' : 'right center',
            }),
        playerZoneSurfaceArtwork: (player) => {
            const fallbackPath = getSlotArtwork(assetSlots, 'player-zone');
            const primaryPath = playerZoneSideSlots[player]?.archiveUrl ?? fallbackPath;

            return {
                primaryPath,
                fallbackPath,
                mirrorFallback: player === 'p2',
                objectPosition: player === 'p1' ? 'left center' : 'right center',
            };
        },
        royalCardBackArtwork: {
            path: getSlotArtwork(assetSlots, 'royal-card-back'),
            variant: assetSlots['royal-card-back'].promptId,
        },
        shellSurfaceVariant: `${assetSlots['shell-background'].style}-${assetSlots['shell-background'].variant}`,
        topBarSurfaceVariant: `${assetSlots['shell-background'].style}-${assetSlots['shell-background'].variant}-shell-fill`,
    };
};
