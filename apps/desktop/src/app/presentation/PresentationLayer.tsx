import { RoyalSelectionOverlay, RoyalUnlockIntro } from '@gemduel/ui/components/animation';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import type { RoyalCard } from '@gemduel/shared/types';
import type { ThemeName } from '@app/types/ui';
import type { PresentationController } from './usePresentationEvents';

interface PresentationLayerProps {
    presentation: PresentationController;
    royalDeck: RoyalCard[];
    theme: ThemeName;
    onSelectRoyal: (card: RoyalCard) => void;
}

const MIDDLE_ZONE_ANCHOR = '[data-presentation-anchor="middle-zone"]';

export function PresentationLayer({
    presentation,
    royalDeck,
    theme,
    onSelectRoyal,
}: PresentationLayerProps) {
    const { activeEvent, activeStage } = presentation;
    let layer: ReactNode = null;

    if (!activeEvent || activeEvent.type !== 'royal-unlock') {
        return null;
    }

    if (activeStage === 'intro') {
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
