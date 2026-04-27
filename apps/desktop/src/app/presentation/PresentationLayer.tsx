import { RoyalSelectionOverlay, RoyalUnlockIntro } from '@gemduel/ui/components/animation';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import type { RoyalCard } from '@gemduel/shared/types';
import type { MarketDeckBackArtworkMap } from '@gemduel/ui/components/card/cardBackArtwork';
import type { ThemeName } from '@app/types/ui';
import { AbilityCalloutStack } from './AbilityCalloutStack';
import { CardFlightLayer } from './CardFlightLayer';
import { GemFlightLayer } from './GemFlightLayer';
import { TurnHandoffBanner } from './TurnHandoffBanner';
import type { PresentationController } from './usePresentationEvents';

interface PresentationLayerProps {
    presentation: PresentationController;
    royalDeck: RoyalCard[];
    theme: ThemeName;
    onSelectRoyal: (card: RoyalCard) => void;
    marketDeckBackArtwork?: MarketDeckBackArtworkMap;
}

const MIDDLE_ZONE_ANCHOR = '[data-presentation-anchor="middle-zone"]';

export function PresentationLayer({
    presentation,
    royalDeck,
    theme,
    onSelectRoyal,
    marketDeckBackArtwork,
}: PresentationLayerProps) {
    const { activeEvent, activeStage } = presentation;
    let layer: ReactNode = null;

    if (!activeEvent) {
        return null;
    }

    if (activeEvent.type !== 'royal-unlock') {
        if (activeStage === 'pulse') {
            switch (activeEvent.type) {
                case 'card-acquire':
                case 'card-reserve':
                case 'market-refill':
                    layer = (
                        <CardFlightLayer
                            event={activeEvent}
                            theme={theme}
                            marketDeckBackArtwork={marketDeckBackArtwork}
                        />
                    );
                    break;
                case 'gem-flight':
                case 'gem-drop':
                case 'gem-steal':
                case 'gem-discard':
                    layer = <GemFlightLayer event={activeEvent} theme={theme} />;
                    break;
                case 'ability-callout':
                    layer = <AbilityCalloutStack event={activeEvent} theme={theme} />;
                    break;
                case 'turn-handoff':
                    layer = <TurnHandoffBanner event={activeEvent} />;
                    break;
                default:
                    layer = null;
            }
        }
    } else if (activeStage === 'intro') {
        layer = (
            <RoyalUnlockIntro
                player={activeEvent.player}
                milestone={activeEvent.milestone}
                theme={theme}
                middleZoneSelector={MIDDLE_ZONE_ANCHOR}
                onComplete={presentation.completeIntro}
            />
        );
    } else if (activeStage === 'selection') {
        layer = (
            <RoyalSelectionOverlay
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

    if (!layer) {
        return null;
    }

    return typeof document === 'undefined' ? layer : createPortal(layer, document.body);
}
