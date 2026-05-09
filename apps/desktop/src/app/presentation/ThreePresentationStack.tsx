import type { PlayerKey } from '@gemduel/shared/types';
import { ThreeCardSlabLayer } from './ThreeCardSlabLayer';
import { ThreePresentationLayer, type ThreeLayerStatus } from './ThreePresentationLayer';
import type { ThreePresentationFeatureFlags } from './threePresentationFeatures';

interface ThreePresentationStackProps {
    activePlayer: PlayerKey;
    features: ThreePresentationFeatureFlags;
    enabled?: boolean;
    onStatusChange?: (status: ThreeLayerStatus) => void;
}

export function ThreePresentationStack({
    activePlayer,
    features,
    enabled = true,
    onStatusChange,
}: ThreePresentationStackProps) {
    const shouldRenderThreePresentationLayer = features.activeTurnPointer || features.gemBoard;

    return (
        <>
            {shouldRenderThreePresentationLayer ? (
                <ThreePresentationLayer
                    activePlayer={activePlayer}
                    enabled={enabled}
                    renderActiveTurnPointer={features.activeTurnPointer}
                    renderGemBoard={features.gemBoard}
                    onStatusChange={onStatusChange}
                />
            ) : null}
            {features.cardSlab ? <ThreeCardSlabLayer enabled={enabled} /> : null}
        </>
    );
}
