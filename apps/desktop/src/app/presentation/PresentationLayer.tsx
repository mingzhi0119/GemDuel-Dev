import { RoyalSelectionOverlay, RoyalUnlockIntro } from '@gemduel/ui/components/animation';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import type { RoyalCard } from '@gemduel/shared/types';
import type { MarketDeckBackArtworkMap } from '@gemduel/ui/components/card/cardBackArtwork';
import type { ThemeName } from '@app/types/ui';
import { AbilityCalloutStack } from './AbilityCalloutStack';
import { CardFlightLayer } from './CardFlightLayer';
import { GemFlightLayer } from './GemFlightLayer';
import { ExtraTurnBanner, TurnHandoffBanner } from './TurnHandoffBanner';
import type { PresentationPreviewMode } from './presentationPreviewMode';
import type { PresentationController } from './usePresentationEvents';

interface PresentationLayerProps {
    presentation: PresentationController;
    royalDeck: RoyalCard[];
    theme: ThemeName;
    onSelectRoyal: (card: RoyalCard) => void;
    marketDeckBackArtwork?: MarketDeckBackArtworkMap;
    previewMode?: PresentationPreviewMode;
    enableThreeCardDepth?: boolean;
}

const MIDDLE_ZONE_ANCHOR = '[data-presentation-anchor="middle-zone"]';

export function PresentationLayer({
    presentation,
    royalDeck,
    theme,
    onSelectRoyal,
    marketDeckBackArtwork,
    previewMode,
    enableThreeCardDepth = false,
}: PresentationLayerProps) {
    const { activeEvent, activeMarketRefillEvent, activeTurnHandoffEvent, activeStage } =
        presentation;
    const layers: ReactNode[] = [];

    if (activeMarketRefillEvent) {
        layers.push(
            <CardFlightLayer
                key={activeMarketRefillEvent.id}
                event={activeMarketRefillEvent}
                theme={theme}
                marketDeckBackArtwork={marketDeckBackArtwork}
                previewMode={previewMode}
                enableThreeCardDepth={enableThreeCardDepth}
            />
        );
    }

    if (activeTurnHandoffEvent) {
        layers.push(
            <TurnHandoffBanner
                key={activeTurnHandoffEvent.id}
                event={activeTurnHandoffEvent}
                previewMode={previewMode}
            />
        );
    }

    if (activeEvent && activeEvent.type !== 'royal-unlock') {
        if (activeStage === 'pulse') {
            switch (activeEvent.type) {
                case 'card-acquire':
                case 'card-reserve':
                case 'market-refill':
                    layers.push(
                        <CardFlightLayer
                            key={activeEvent.id}
                            event={activeEvent}
                            theme={theme}
                            marketDeckBackArtwork={marketDeckBackArtwork}
                            previewMode={previewMode}
                            enableThreeCardDepth={enableThreeCardDepth}
                        />
                    );
                    break;
                case 'gem-flight':
                case 'gem-drop':
                case 'gem-steal':
                case 'gem-discard':
                    layers.push(
                        <GemFlightLayer
                            key={activeEvent.id}
                            event={activeEvent}
                            theme={theme}
                            previewMode={previewMode}
                        />
                    );
                    break;
                case 'ability-callout':
                    layers.push(
                        activeEvent.callout === 'extra-turn' ? (
                            <ExtraTurnBanner
                                key={activeEvent.id}
                                event={activeEvent}
                                previewMode={previewMode}
                            />
                        ) : (
                            <AbilityCalloutStack
                                key={activeEvent.id}
                                event={activeEvent}
                                theme={theme}
                                previewMode={previewMode}
                            />
                        )
                    );
                    break;
                default:
                    break;
            }
        }
    } else if (activeEvent && activeStage === 'intro') {
        layers.push(
            <RoyalUnlockIntro
                key={activeEvent.id}
                player={activeEvent.player}
                milestone={activeEvent.milestone}
                theme={theme}
                middleZoneSelector={MIDDLE_ZONE_ANCHOR}
                onComplete={presentation.completeIntro}
            />
        );
    } else if (activeEvent && activeStage === 'selection') {
        layers.push(
            <RoyalSelectionOverlay
                key={activeEvent.id}
                royalDeck={royalDeck}
                player={activeEvent.player}
                theme={theme}
                onSelectRoyal={(card) => {
                    onSelectRoyal(card);
                    presentation.completeEvent(activeEvent.id);
                }}
            />
        );
    }

    if (layers.length === 0) {
        return null;
    }

    const layer = <>{layers}</>;

    return typeof document === 'undefined' ? layer : createPortal(layer, document.body);
}
